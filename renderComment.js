export function renderComment(comment) {
  return `
    <li class="comment" data-id="${comment.id}">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
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
