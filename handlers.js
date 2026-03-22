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
        loginForm,
        logoutButton,
        userInfo,
    } = elements;

    let replyingTo = null;

    
    if (commentsList) {
        commentsList.addEventListener("click", (event) => {
            const commentElement = event.target.closest(".comment");
            if (!commentElement) return;

            const commentId = Number(commentElement.dataset.id);
            const comment = comments.find(c => c.id === commentId);

            if (comment) {
                replyingTo = commentId;
                if (quoteBlock) quoteBlock.style.display = "block";
                if (quoteAuthor) quoteAuthor.textContent = comment.name;
                if (quoteText) quoteText.textContent = comment.text;
                if (commentInput) {
                    commentInput.value = `> ${comment.text}\n\n`;
                    commentInput.focus();
                }
            }
        });
    }

   
    if (addButton) {
        addButton.addEventListener("click", () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Войдите, чтобы комментировать");
                return;
            }

            const text = commentInput ? commentInput.value.trim() : "";
            if (!text || text.length < 3) {
                alert("Текст комментария должен быть не короче 3 символов");
                return;
            }

            
            const formElements = [commentInput, addButton].filter(el => el);
            formElements.forEach(el => {
                if (el) el.style.display = "none";
            });

            const loaderDiv = document.createElement("div");
            loaderDiv.className = "sending-loader";
            loaderDiv.style.textAlign = "center";
            loaderDiv.style.padding = "20px";
            loaderDiv.textContent = "Отправка комментария, подождите...";
            
            if (addButton.parentNode) {
                addButton.parentNode.insertBefore(loaderDiv, addButton);
            }

            import("./api.js").then(({ postComment }) => {
                postComment(text, token)
                    .then((updatedComments) => {
                        updateComments(updatedComments);
                        if (commentsList) {
                            renderComments(comments, commentsList);
                        }

                        if (commentInput) commentInput.value = "";
                        if (quoteBlock) quoteBlock.style.display = "none";
                        replyingTo = null;
                    })
                    .catch(error => {
                        alert(error.message || "Не удалось добавить комментарий. Попробуйте снова.");
                    })
                    .finally(() => {
                        if (loaderDiv && loaderDiv.parentNode) loaderDiv.remove();
                        formElements.forEach(el => {
                            if (el) el.style.display = "";
                        });
                    });
            });
        });
    }

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const login = loginForm.login.value.trim();
        const password = loginForm.password.value.trim();

        if (!login || !password) {
            alert("Заполните логин и пароль");
            return;
        }

        import("./api.js").then(({ login: authLogin }) => {
            authLogin(login, password)
                .then(data => {
                    console.log("Успешный вход:", data);
                    localStorage.setItem("token", data.user.token);
                    localStorage.setItem("userName", data.user.name);
                    
                    window.location.reload();
                })
                .catch(error => {
                    console.error("Ошибка входа:", error);
                    alert(error.message || "Ошибка авторизации. Проверьте логин и пароль");
                });
        });
    });
}

    // Обработчик выхода
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            window.location.reload();
        });
    }
}