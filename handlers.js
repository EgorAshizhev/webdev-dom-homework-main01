import { comments, updateComments } from "./data.js";
import { renderComments } from "./renderComments.js";
import { escapeHtml } from "./escapeHtml.js";

export function initHandlers(elements) {
    const {
        nameInput,
        commentInput,
        addButton,
        commentsList,
        quoteBlock,
        quoteAuthor,
        quoteText,
    } = elements;

    let replyingTo = null;

    // Обработчик лайков и ответов на комментарии
    commentsList.addEventListener("click", (event) => {
        const likeButton = event.target.closest('[data-action="like"]');

        if (likeButton) {
            event.stopPropagation();

            const commentElement = likeButton.closest(".comment");
            const commentId = Number(commentElement.dataset.id);
            const comment = comments.find(c => c.id === commentId);

            if (comment) {
                comment.isLiked ? comment.likes-- : comment.likes++;
                comment.isLiked = !comment.isLiked;
                renderComments(comments, commentsList);
            }
            return;
        }

        const commentElement = event.target.closest(".comment");
        if (!commentElement) return;

        const commentId = Number(commentElement.dataset.id);
        const comment = comments.find(c => c.id === commentId);

        if (comment) {
            replyingTo = commentId;
            quoteBlock.style.display = "block";
            quoteAuthor.textContent = comment.name;
            quoteText.textContent = comment.text;
            commentInput.value = `> ${comment.text}\n\n`;
            commentInput.focus();
        }
    });

    // Обработчик добавления комментария
    addButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const text = commentInput.value.trim();

        if (!name || !text) {
            alert("Заполните имя и комментарий");
            return;
        }

        if (name.length < 3 || text.length < 3) {
            alert("Имя и текст комментария должны быть не короче 3 символов");
            return;
        }

        // Блокируем кнопку на время отправки
        addButton.disabled = true;
        addButton.textContent = "Отправка...";

        import("./api.js").then(({ postComment }) => {
            postComment(escapeHtml(text).replaceAll("\n", "<br>"), escapeHtml(name))
                .then((updatedComments) => {
                    updateComments(updatedComments);
                    renderComments(comments, commentsList);
                    
                    nameInput.value = '';
                    commentInput.value = '';
                    quoteBlock.style.display = "none";
                    replyingTo = null;
                })
                .catch(error => {
                    alert(error.message || "Не удалось добавить комментарий. Попробуйте снова.");
                })
                .finally(() => {
                    addButton.disabled = false;
                    addButton.textContent = "Написать";
                });
        });
    });
}