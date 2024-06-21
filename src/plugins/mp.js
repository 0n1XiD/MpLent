// Все что связано с jwt авторизацией хранится здесь, доступ можно везде получить через this.$mp.ajax(...)

// Плагин
export default {
  install(app, router) {
    app.config.globalProperties.$mp = mp(router)
  }
}

const mp = (router) => ({
  // Токен авторизации, который действует очень недолгое время, и его все время авто-обновляет метод ajax
  jwtAccessToken: null,

  // Функция обновляющая accessToken
  setAccessToken(token) {
    this.jwtAccessToken=token
  },

  // Делает запрос на /api/ и получает json результат, осуществляя параллельно авторизацию
  async ajax(service, action, params) {
    // Пытаемся получить ответ от сервера первый раз с сохраненным токеном
    let token = await this.getAuthToken(0)
    if (!token) return
    let json = await this.ajaxDo(service, action, params, token)
    // Если на предыдущем этапе не было redirect на login страницу, значит тот токен который хранится у нас устарел, его надо насильно заменить
    if (json.error==='Old token') {
      token = await this.getAuthToken(1)
      if (!token) return
      json = await this.ajaxDo(service, action, params, token)
    }
    return json
  },

  // Делаем реальный запрос к серверу
  async ajaxDo(service, action, params, token) {
    // Формируем тело запроса
    let reqBody = this.createPostFormBody(service, action, params)

    const response = await fetch("https://mpinsider.ru/api", {
      method: "post",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+token
      },
      body: reqBody
    })
    const json = await response.json();
    return json
  },

  // Получаем jwt auth token
  async getAuthToken(force) {
    // Пытаемся получить токен из локальной переменной
    if (this.jwtAccessToken && !force) return this.jwtAccessToken;
    // Иначе получаем токен с сервера
    const response = await this.auth('get-auth-token', {})
    if (response.error) {
      // Если сервер вернул ошибку это значит что у нас плохой refresh токен, значит надо по-новой авторизовываться
      this.jwtAccessToken = null
      router.push('/login')
      return null
    } else {
      // Если сервер вернул нормальный auth токен, сохраняем его в локальное хранилище и возвращаем
      this.jwtAccessToken = response.resp.access_token
      return this.jwtAccessToken
    }
  },

  // Делаем запрос к auth серверу
  async auth(action, params) {
    // Формируем тело запроса
    let reqBody = this.createPostFormBody("auth", action, params)

    const response = await fetch("https://auth.mpinsider.ru/api", {
      credentials: "include",
      method: "post",
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      },
      body: reqBody
    })
    const json = await response.json()
    return json
  },

  // Создаём тело запроса с post формой, которая включает в себя название сервиса, действие и прочие параметры запроса
  createPostFormBody(service, action, params) {
    // Формируем данные запроса с post формой
    let formData = new FormData()
    formData.append('service', service)
    formData.append('action', action)

    // Проходимся по каждому полю объекта с данными запроса
    for (var prop in params) {
      // Добавляем данные только, если это поля объекта, игнорируя служебные поля
      if (Object.prototype.hasOwnProperty.call(params, prop)) {
        // добавляем пару ключ-значение имя_поля-значение_поля
        formData.append(prop, params[prop])
      }
    }

    // Возвращаем данные, закодированные в формате url запроса, чтобы соответствовать формату запроса 'application/x-www-form-urlencoded'
    return new URLSearchParams(formData)
  }
})