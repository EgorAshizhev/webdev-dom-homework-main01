import { comments } from "./data.js";
import { renderComments } from "./renderComments.js";
import { escapeHtml } from "./escapeHtml.js";
import { getCurrentDate } from "./date.js";

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

    commentsList.addEventListener("click", (event) => {
        const likeButton = event.target.closest('[data-action="like"]');

        if (likeButton) {
            event.stopPropagation();

            const commentElement = likeButton.closest(".comment");
            const commentId = Number(commentElement.dataset.id);
            const comment = comments.find(c => c.id === commentId);

            comment.isLiked ? comment.likes-- : comment.likes++;
            comment.isLiked = !comment.isLiked;

            renderComments(comments, commentsList);
            return;
        }

        const commentElement = event.target.closest(".comment");
        if (!commentElement) return;

        const commentId = Number(commentElement.dataset.id);
        const comment = comments.find(c => c.id === commentId);

        replyingTo = commentId;

        quoteBlock.style.display = "block";
        quoteAuthor.textContent = comment.name;
        quoteText.textContent = comment.text;

        commentInput.value = `> ${comment.text}\n\n`;
        commentInput.focus();
    });

    addButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const text = commentInput.value.trim();

        if (!name || !text) {
            alert("Заполните имя и комментарий");
            return;
        }

        const newComment = {
            id: Date.now(),
            name: escapeHtml(name),
            date: getCurrentDate(),
            text: escapeHtml(text).replaceAll("\n", "<br>"),
            likes: 0,
            isLiked: false,
        };

        comments.push(newComment);

        renderComments(comments, commentsList);

        nameInput.value = "";
        commentInput.value = "";
        quoteBlock.style.display = "none";
        replyingTo = null;
    });
}
