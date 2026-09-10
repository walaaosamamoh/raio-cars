import './assets/main.css'
import FontAwesomeIcon from './plugins/icons.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Form, Field, ErrorMessage } from 'vee-validate'

import App from './App.vue'
import router from './router'
import i18n from './i18n.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { toastService } from './services/toastService.js'
import { swalMixin } from './mixins/swalMixin'

dayjs.extend(relativeTime);

const app = createApp(App)

app.mixin(swalMixin)
app.config.globalProperties.$toast = toastService
app.config.globalProperties.$dayjs = dayjs

app.component('VForm', Form)
app.component('VField', Field)
app.component('VErrorMessage', ErrorMessage)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
