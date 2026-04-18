
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, user, onAddPostClick }) {
  let imageUrl = "";
  let description = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить новый пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea 
              id="description-input" 
              class="input" 
              placeholder="Опишите вашу фотографию..."
              rows="4"
            ></textarea>
            <div class="form-error"></div>
            <button class="button" id="add-button">Опубликовать</button>
            <button class="button secondary-button" id="cancel-button">Отмена</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user,
    });


    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    const setError = (message) => {
      const errorEl = appEl.querySelector(".form-error");
      if (errorEl) {
        errorEl.textContent = message;
      }
    };

    document.getElementById("add-button").addEventListener("click", () => {
      setError("");
      
      const descriptionInput = document.getElementById("description-input");
      description = descriptionInput?.value || "";

      if (!imageUrl) {
        setError("Пожалуйста, выберите фотографию");
        return;
      }
       if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        setError("Некорректный URL изображения");
        return;
      }
      if (!description.trim()) {
        setError("Пожалуйста, добавьте описание");
        return;
      }


      onAddPostClick({
        description: description.trim(),
        imageUrl: imageUrl,
      });
    });


    document.getElementById("cancel-button").addEventListener("click", () => {

      import("../index.js").then(({ goToPage }) => {
        goToPage("posts");
      });
    });
  };

  render();
}