import { createApp  } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mpPlugin from './plugins/mp'
import VueLazyload from 'vue-lazyload'

createApp(App).use(store).use(router).use(mpPlugin, router).use(VueLazyload, {error: require('@/static/img/no_image.jpg'), attempt: 1}).mount('#app')
