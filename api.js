import { getCurrentDate } from "./date.js";

const host = "https://wedev-api.sky.pro/api/v1/EgorAshizhev"

export const fetchComments = () => {
    return fetch(host + "/comments")
    .then((res) => {
        if (!res.ok) {
            throw new Error("Ошибка загрузки комментариев");
        }
        return res.json()
    })
    .then((responseData) => {
       const appComments = responseData.comments.map(comment => {
            return {
                id: comment.id,
                name: comment.author.name,
                date: getCurrentDate(new Date(comment.date)),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            }
        })
        return appComments      
    })
}

export const postComment = (text, name) => {
  return fetch(host + '/comments', {
    method: 'POST',
    body: JSON.stringify({
      text,
      name,
    }),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.error || "Ошибка добавления комментария");
      });
    }
    return fetchComments();
  })
}