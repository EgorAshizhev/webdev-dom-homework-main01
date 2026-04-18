// post-card-component.js
import { formatDistanceToNow } from 'https://cdn.skypack.dev/date-fns';
import { ru } from 'https://cdn.skypack.dev/date-fns/locale';

export function renderPostCard(post, currentUser, goToPage) {
  const createdAt = new Date(post.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { 
    addSuffix: true, 
    locale: ru 
  });
  
  const isLiked = post.isLiked || false;
  const likesCount = post.likes?.length || 0;
  const isCurrentUserPost = currentUser && post.user.id === currentUser.id;

  return `
    <li class="post" data-post-id="${post.id}">
      <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl || 'https://via.placeholder.com/40'}" 
             class="post-header__user-image"
             onerror="this.src='https://via.placeholder.com/40'">
        <p class="post-header__user-name">${escapeHtml(post.user.name)}</p>
        ${isCurrentUserPost ? `
          <button class="delete-post-button" data-post-id="${post.id}">🗑️</button>
        ` : ''}
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}" 
             onerror="this.src='https://via.placeholder.com/300'">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" class="like-button">
          <img src="./assets/images/${isLiked ? 'like-active' : 'like-not-active'}.svg">
        </button>
        <p class="post-likes-text">
          Нравится: <strong class="likes-count-${post.id}">${likesCount}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${escapeHtml(post.user.name)}</span>
        ${escapeHtml(post.description)}
      </p>
      <p class="post-date">
        ${timeAgo}
      </p>
    </li>
  `;
}

// Функция для экранирования HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}