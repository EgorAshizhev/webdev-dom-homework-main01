import { uploadImage } from "../api.js";

/**
 * Компонент загрузки изображения.
 * Этот компонент позволяет пользователю загружать изображение и отображать его превью.
 * Если изображение уже загружено, пользователь может заменить его.
 *
 * @param {HTMLElement} params.element - HTML-элемент, в который будет рендериться компонент.
 * @param {Function} params.onImageUrlChange - Функция, вызываемая при изменении URL изображения.
 *                                            Принимает один аргумент - новый URL изображения или пустую строку.
 */
export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let imageUrl = "";

  const render = () => {
    element.innerHTML = `
      <div class="upload-image">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение" style="max-width: 100%; max-height: 200px;">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
            : `
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                accept="image/*"
                style="display:none"
              />
              Выберите фото
            </label>
          `
        }
      </div>
    `;

    const fileInputElement = element.querySelector(".file-upload-input");
    if (fileInputElement) {
      fileInputElement.addEventListener("change", () => {
        const file = fileInputElement.files[0];
        if (file) {
          
          if (file.size > 5 * 1024 * 1024) {
            alert("Файл слишком большой. Максимум 5MB");
            return;
          }
          
      
          if (!file.type.startsWith('image/')) {
            alert("Пожалуйста, выберите изображение");
            return;
          }

          const labelEl = element.querySelector(".file-upload-label");
          if (labelEl) {
            labelEl.setAttribute("disabled", true);
            labelEl.textContent = "Загружаю файл...";
          }
          
          uploadImage({ file })
            .then(({ fileUrl }) => {
              console.log("Получен URL:", fileUrl);
              if (!fileUrl) {
                throw new Error("Не получен URL изображения");
              }
              imageUrl = fileUrl;
              onImageUrlChange(imageUrl);
              render();
            })
            .catch((error) => {
              console.error("Ошибка загрузки:", error);
              alert("Ошибка при загрузке изображения: " + error.message);
          
              if (labelEl) {
                labelEl.removeAttribute("disabled");
                labelEl.textContent = "Выберите фото";
              }
            });
        }
      });
    }

    const removeButton = element.querySelector(".file-upload-remove-button");
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        imageUrl = "";
        onImageUrlChange(imageUrl);
        render();
      });
    }
  };

  render();
}
