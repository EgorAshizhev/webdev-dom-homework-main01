import { comments, updateComments } from "./data.js";
import { renderComments } from "./renderComments.js";
import { initHandlers } from "./handlers.js";
import { fetchComments } from "./api.js";

const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const addButton = document.querySelector(".add-form-button");
const commentsList = document.querySelector(".comments");
const quoteBlock = document.querySelector(".quote-block");
const quoteAuthor = document.querySelector(".quote-author");
const quoteText = document.querySelector(".quote-text");

// Показываем лоадер перед загрузкой
commentsList.innerHTML = '<div style="text-align: center; padding: 20px;">Комментарии загружаются, подождите...</div>';


fetchComments()
    .then((data) => {
        updateComments(data);
        renderComments(comments, commentsList);
    })
    .catch((error) => {
        console.error("Ошибка загрузки комментариев:", error);
        commentsList.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Не удалось загрузить комментарии. Обновите страницу.</div>';
    });

initHandlers({
    nameInput,
    commentInput,
    addButton,
    commentsList,
    quoteBlock,
    quoteAuthor,
    quoteText,
});