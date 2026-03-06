import { renderComment } from "./renderComment.js";

export function renderComments(comments, container) {
  container.innerHTML = comments.map(renderComment).join("");
}
