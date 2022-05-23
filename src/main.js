import './common/pollify'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from 'store'

import plugins from 'plugins'
import 'styles/index.scss'

createApp(App).use(store).use(router).use(plugins).mount('#app')
