import { comments, updateComments } from "./data.js";
import { renderComments } from "./renderComments.js";
import { initHandlers } from "./handlers.js";
import { fetchComments } from "./api.js";

// DOM элементы
const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const addButton = document.querySelector(".add-form-button");
const commentsList = document.querySelector(".comments");
const quoteBlock = document.querySelector(".quote-block");
const quoteAuthor = document.querySelector(".quote-author");
const quoteText = document.querySelector(".quote-text");

// Находим или создаем контейнер для авторизации
let appContainer = document.querySelector(".app") || document.querySelector(".container") || document.body;
let loginContainer = document.querySelector(".login-container");

if (!loginContainer) {
    loginContainer = document.createElement("div");
    loginContainer.className = "login-container";
    loginContainer.style.margin = "20px";
    loginContainer.style.padding = "10px";
    loginContainer.style.borderBottom = "1px solid #ccc";
    
    // Создаем форму входа
    const loginFormHtml = `
        <form id="login-form" style="display: inline-block;">
            <input type="text" name="login" placeholder="Логин" required style="margin-right: 10px; padding: 5px;">
            <input type="password" name="password" placeholder="Пароль" required style="margin-right: 10px; padding: 5px;">
            <button type="submit" style="padding: 5px 10px;">Войти</button>
        </form>
    `;
    loginContainer.innerHTML = loginFormHtml;
    
    // Добавляем контейнер в начало приложения
    const addForm = document.querySelector(".add-form");
    if (addForm) {
        addForm.parentNode.insertBefore(loginContainer, addForm);
    } else if (commentsList) {
        commentsList.parentNode.insertBefore(loginContainer, commentsList);
    } else {
        appContainer.prepend(loginContainer);
    }
}

// Создаем кнопку выхода, если её нет
let logoutButton = document.querySelector(".logout-button");
if (!logoutButton) {
    logoutButton = document.createElement("button");
    logoutButton.textContent = "Выйти";
    logoutButton.className = "logout-button";
    logoutButton.style.padding = "5px 10px";
    logoutButton.style.marginLeft = "10px";
    logoutButton.style.display = "none";
    loginContainer.appendChild(logoutButton);
}

// Создаем элемент для информации о пользователе
let userInfo = document.querySelector(".user-info");
if (!userInfo) {
    userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.style.margin = "10px 0";
    userInfo.style.fontWeight = "bold";
    loginContainer.appendChild(userInfo);
}

const loginForm = document.querySelector("#login-form");

// Состояние авторизации
const token = localStorage.getItem("token");
const userName = localStorage.getItem("userName");

if (token && userName) {
    // Авторизован: скрываем форму входа, показываем кнопку выхода и приветствие
    if (loginForm) loginForm.style.display = "none";
    logoutButton.style.display = "inline-block";
    userInfo.textContent = `👤 Привет, ${userName}!`;
    userInfo.style.display = "block";
    
    // Скрываем поле имени (оно больше не нужно)
    if (nameInput) {
        nameInput.style.display = "none";
    }
    
    // Включаем кнопку добавления комментария
    if (addButton) {
        addButton.disabled = false;
        addButton.title = "";
    }
} else {
    // Не авторизован: показываем форму входа, скрываем кнопку выхода
    if (loginForm) loginForm.style.display = "block";
    logoutButton.style.display = "none";
    userInfo.style.display = "none";
    
    // Отключаем кнопку добавления комментария
    if (addButton) {
        addButton.disabled = true;
        addButton.title = "Войдите, чтобы комментировать";
        addButton.style.opacity = "0.5";
        addButton.style.cursor = "not-allowed";
    }
    
    // Скрываем поле имени (оно не нужно неавторизованным)
    if (nameInput) {
        nameInput.style.display = "none";
    }
    
    // Блокируем поле ввода комментария
    if (commentInput) {
        commentInput.disabled = true;
        commentInput.placeholder = "Войдите, чтобы оставить комментарий";
        commentInput.style.opacity = "0.5";
    }
}

// Загрузка комментариев
if (commentsList) {
    commentsList.innerHTML = '<div style="text-align: center; padding: 20px;">Комментарии загружаются, подождите...</div>';
} else {
    console.error("Элемент .comments не найден в DOM");
}

fetchComments(token)
    .then((data) => {
        updateComments(data);
        if (commentsList) {
            renderComments(comments, commentsList);
        }
    })
    .catch((error) => {
        console.error("Ошибка загрузки комментариев:", error);
        if (commentsList) {
            commentsList.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Не удалось загрузить комментарии. Обновите страницу.</div>';
        }
    });


initHandlers({
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
});