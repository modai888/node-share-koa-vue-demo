import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// photon-ui
import 'photon.css'
import '@/styles/app.pcss'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')
