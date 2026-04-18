// user-posts-page-component.js
import { renderHeaderComponent } from "./header-component.js";
import { renderPostCard } from "./post-card-component.js";
import { likePost, dislikePost, deletePost, getUserPosts } from "../api.js";

export function renderUserPostsPageComponent({ appEl, user, posts, goToPage }) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <h2 class="page-title">Посты пользователя</h2>
      <ul class="posts">
        ${posts.map(post => renderPostCard(post, user, goToPage)).join('')}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
    user,
    goToPage,
  });

  // Обработчики для кликов по пользователям
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains('delete-post-button')) {
        const userId = userEl.dataset.userId;
        if (userId) {
          goToPage("user-posts", { userId });
        }
      }
    });
  }

  // Обработчики для лайков
  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const postId = likeButton.dataset.postId;
      const token = user ? `Bearer ${user.token}` : undefined;
      
      if (!user) {
        alert("Войдите в систему, чтобы ставить лайки");
        return;
      }

      const currentPost = posts.find(p => p.id === postId);
      const isCurrentlyLiked = currentPost?.isLiked;

      if (isCurrentlyLiked) {
        dislikePost({ token, postId })
          .then(updatedPost => {
            const index = posts.findIndex(p => p.id === postId);
            if (index !== -1) {
              posts[index] = updatedPost;
            }
            renderUserPostsPageComponent({ appEl, user, posts, goToPage });
          })
          .catch(error => {
            console.error(error);
            alert("Ошибка при снятии лайка");
          });
      } else {
        likePost({ token, postId })
          .then(updatedPost => {
            const index = posts.findIndex(p => p.id === postId);
            if (index !== -1) {
              posts[index] = updatedPost;
            }
            renderUserPostsPageComponent({ appEl, user, posts, goToPage });
          })
          .catch(error => {
            console.error(error);
            alert("Ошибка при добавлении лайка");
          });
      }
    });
  }

  // Обработчики для удаления постов
  for (let deleteButton of document.querySelectorAll(".delete-post-button")) {
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const postId = deleteButton.dataset.postId;
      const token = user ? `Bearer ${user.token}` : undefined;
      
      if (confirm("Вы уверены, что хотите удалить этот пост?")) {
        deletePost({ token, postId })
          .then(() => {
            // Получаем userId из URL или сохраняем его
            const userId = posts[0]?.user?.id;
            if (userId) {
              return getUserPosts({ token, userId });
            }
            throw new Error("Не удалось определить пользователя");
          })
          .then(newPosts => {
            posts = newPosts;
            renderUserPostsPageComponent({ appEl, user, posts, goToPage });
          })
          .catch(error => {
            console.error(error);
            alert("Ошибка при удалении поста: " + error.message);
          });
      }
    });
  }
}