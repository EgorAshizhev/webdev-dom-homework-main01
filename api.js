import { getCurrentDate } from "./date.js";

const personalKey = "EgorAshizhev";
const baseUrl = `https://wedev-api.sky.pro/api/v2/${personalKey}`;

export const fetchComments = (token) => {
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch(baseUrl + "/comments", { headers })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Ошибка загрузки комментариев");
            }
            return res.json();
        })
        .then((responseData) => {
            const appComments = responseData.comments.map(comment => ({
                id: comment.id,
                name: comment.author.name,
                date: getCurrentDate(new Date(comment.date)),
                text: comment.text,
                likes: comment.likes,
                isLiked: comment.isLiked,
            }));
            return appComments;
        });
};

export const postComment = (text, token) => {
    
    return fetch(baseUrl + "/comments", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            
        },
        body: JSON.stringify({ text }),
    }).then((response) => {
        if (!response.ok) {
            return response.text().then(body => {
                let message;
                try {
                    const err = JSON.parse(body);
                    message = err.error || "Ошибка добавления комментария";
                } catch {
                    message = body || "Ошибка добавления комментария";
                }
                throw new Error(message);
            });
        }
        return fetchComments(token);
    });
};

export const login = (login, password) => {
    
    return fetch("https://wedev-api.sky.pro/api/user/login", {
        method: "POST",
        body: JSON.stringify({ login, password }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || "Ошибка авторизации");
            });
        }
        return response.json();
    });
};