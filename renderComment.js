import { escapeHtml } from "./escapeHtml.js";

export function renderComment(comment) {
    const safeName = escapeHtml(comment.name);
    const safeText = escapeHtml(comment.text).replace(/\n/g, "<br>");

    return `
        <li class="comment" data-id="${comment.id}">
            <div class="comment-header">
                <div>${safeName}</div>
                <div>${comment.date}</div>
            </div>
            <div class="comment-body">
                <div class="comment-text">
                    ${safeText}
                </div>
            </div>
            <div class="comment-footer">
                <div class="likes">
                    <span class="likes-counter">${comment.likes}</span>
                    <button 
                        class="like-button ${comment.isLiked ? "-active-like" : ""}" 
                        data-action="like">
                    </button>
                </div>
            </div>
        </li>
    `;
}