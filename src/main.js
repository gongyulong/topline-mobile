// 导入了 vue
import Vue from 'vue'
// 导入 App.vue（根组件）
import App from './App.vue'
// 导入了 router
import router from './router'
// 导入了 vuex
import store from './store'
// 导入 vant
import Vant from 'vant'
// 导入 vant 的样式
import 'vant/lib/index.css'
// 导入字体图标
import '@/styles/index.css'
// 导入axios自定义插件
import axiosPlug from '@/utils/request.js'

// 在 vue 中使用vant
Vue.use(Vant)
Vue.config.productionTip = false

// 在 vue 中使用axiosPlug
Vue.use(axiosPlug)

// 创建一个 vue 实例
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
