// 导入了 vue
import Vue from 'vue'
// 导入了 vue-router
import VueRouter from 'vue-router'
// 在 vue 中使用 VueRouter
Vue.use(VueRouter)

// 创建了一个路由信息对象集合
const routes = [
  // vant 测试路由
  {
    path: '/usevant',
    name: 'usevant',
    component: () => import('@/views/usevant')
  },
  // 设定 重定向路由
  {
    path: '/',
    redirect: '/home'
  },
  // login 登录路由
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  // login 登录验证路由
  {
    path: '/login/nologin',
    name: 'nologin',
    component: () => import('@/views/login')
  },
  // layout 布局路由
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      // home 作为布局组件的子路由
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home')
      },
      // searchList 作为布局组件的子路由
      {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search')
      }
    ]
  },
  // searchList 布局路由
  {
    path: '/searchList/:key',
    name: 'searchList',
    component: () => import('@/views/searchList')
  },
  // detail 详情路由
  {
    path: '/detail/:artid',
    name: 'detail',
    component: () => import('@/views/detail')
  },
  // chat 小智聊天路由
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat')
  }
]

// 创建了一个路由实例
const router = new VueRouter({
  routes // 路由信息的集合
})

// 导出路由实例
export default router
