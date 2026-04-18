// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "prod";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Загруженное изображение:", data); // Для отладки
      // Проверяем структуру ответа
      if (data.fileUrl) {
        return { fileUrl: data.fileUrl };
      } else if (data.url) {
        return { fileUrl: data.url };
      } else {
        throw new Error("Не получен URL изображения");
      }
    });
}



// api.js - добавляем новые функции

// Добавление нового поста
export function addPost({ token, description, imageUrl }) {
  // Очищаем URL от лишних символов
  const cleanImageUrl = imageUrl.trim();
  const cleanDescription = description.trim();
  
  console.log("Отправляем данные:", { description: cleanDescription, imageUrl: cleanImageUrl });
  
  // Проверяем, что URL начинается с http:// или https://
  if (!cleanImageUrl.startsWith('http://') && !cleanImageUrl.startsWith('https://')) {
    return Promise.reject(new Error("Неверный URL изображения"));
  }

  // Пробуем разные варианты формата данных
  // Вариант 1: как в документации
  const postData = {
    description: cleanDescription,
    imageUrl: cleanImageUrl
  };
   return fetch(postsHost, {
    method: "POST",
    headers: {
      'Authorization': token,
    },
    body: JSON.stringify(postData),
  })
    .then(async (response) => {
      const responseText = await response.text();
      console.log("Ответ сервера:", responseText);
      
      if (response.status === 400) {
        throw new Error(`Ошибка API: ${responseText}`);
      }
      
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      return JSON.parse(responseText);
    });
}

// Получение постов конкретного пользователя
export function getUserPosts({ token, userId }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

// Поставить лайк
export function likePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.post;
    });
}

// Убрать лайк
export function dislikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.post;
    });
}

// Удалить пост
export function deletePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      if (response.status === 403) {
        throw new Error("Нет прав на удаление");
      }
      return response.json();
    });
}
