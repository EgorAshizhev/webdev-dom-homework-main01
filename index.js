import { comments } from "./data.js";
import { renderComments } from "./renderComments.js";
import { initHandlers } from "./handlers.js";

const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const addButton = document.querySelector(".add-form-button");
const commentsList = document.querySelector(".comments");
const quoteBlock = document.querySelector(".quote-block");
const quoteAuthor = document.querySelector(".quote-author");
const quoteText = document.querySelector(".quote-text");

renderComments(comments, commentsList);

initHandlers({
  nameInput,
  commentInput,
  addButton,
  commentsList,
  quoteBlock,
  quoteAuthor,
  quoteText,
});

