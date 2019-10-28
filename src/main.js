// 导入了 vue
import Vue from 'vue'
// 导入 App.vue（根组件）
import App from './App.vue'
// 导入了 router
import router from './router'
// 导入了 vuex
import store from './store'
// 导入 vant
import Vant, { Lazyload } from 'vant'
// 导入 vant 的样式
import 'vant/lib/index.css'
// 导入字体图标
import '@/styles/index.css'
// 导入自己封装axios插件
import axiosPlug from '@/utils/request.js'
// 导入自己封装的登录插件
import loginPlugs from '@/utils/loginplugs'
// 导入第三包 dayjs
import dayjs from 'dayjs'
// 导入 dayjs 的相对时间 插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入 dayjs 中文包
import 'dayjs/locale/zh-cn'
// 导入图片懒加载
// import VueLazyload from 'vue-lazyload'

// 在 vue 中使用vant
Vue.use(Vant)
Vue.config.productionTip = false

// 在 vue 中使用自定义插件 axiosPlug loginPlugs
Vue.use(axiosPlug)
Vue.use(loginPlugs)

// 使用图片懒加载
Vue.use(Lazyload)

// 使用 dayjs 插件
dayjs.extend(relativeTime)

// 使用dayjs 简体中文包
dayjs.locale('zh-cn')

// 定义全局过滤器
Vue.filter('relativetime', function (value) {
  // 得 value 与当前时间的相对时间
  return dayjs().from(dayjs(value))
})

// 创建一个 vue 实例
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
