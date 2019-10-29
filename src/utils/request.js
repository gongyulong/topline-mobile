// 封装所有与 axios 相关的逻辑
// 改造为一个插件

// 导入axios
import axios from 'axios'
// 导入store
import store from '@/store'
// 导入 JSON-bigint
import JSONBig from 'json-bigint'

// 创建一个 axios 实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 请求基准地址
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      console.log(err)
      return data
    }
  }]
})

// 创建登陆验证 axios 实例：请求接口： /authroizations
const refreshInstacn = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0'
})

// 设置请求拦截器
instance.interceptors.request.use(config => {
  // console.log(store.state)
  // 保存用户信息到user
  let user = store.state.user
  // 判断用户是否登录：判断 store 中的 state 中的 user 是否存在
  if (user) {
    // 向请求头中添加 token
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // config 所有的请求信息
  return config
}, error => {
  return Promise.reject(error)
})
// 设置响应拦截器
instance.interceptors.response.use(response => {
// response 服务器响应回来的数据
  return response.data.data
}, async function (error) {
  if (error.response.status === 401) {
    // 得到 refresh_token token
    let user = store.state.user
    // 1.0 发送请求到服务器：传入 refresh_token ，得到新的 token
    let res = await refreshInstacn({
      url: '/authorizations',
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.refresh_token}` // refresh_token
      }
    })
    // 更新后的 token：res.data.data.token
    user.token = res.data.data.token
    store.commit('setUser', user)
    // console.log('---------------测试更新token------------------------')
    // console.log(store.state.user)
    // console.log('---------------测试更新token------------------------')
    // token 已经更新了：需要重新发送请求
    return instance(error.config)
  }
  // 错误处理
  return Promise.reject(error)
})

// 创建另一个 axios2 实例 目的是设置另一个接口基地址
const instance2 = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_1' // 请求基准地址2
})
// 设置请求拦截器
instance2.interceptors.request.use(config => {
  // console.log(store.state)
  // 保存用户信息到user
  let user = store.state.user
  // 判断用户是否登录：判断 store 中的 state 中的 user 是否存在
  if (user) {
    // 向请求头中添加 token
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // config 所有的请求信息
  return config
}, error => {
  return Promise.reject(error)
})
// 设置响应拦截器
instance2.interceptors.response.use(response => {
// response 服务器响应回来的数据
  return response.data.data
}, error => {
  return Promise.reject(error)
})

// 创建一个插件对象
const myPlugs = {}

// 添加一个 install 方法
myPlugs.install = function (Vue) {
  Vue.prototype.$http = instance
  Vue.prototype.$http2 = instance2
}
// 暴露插件对象
export default myPlugs
