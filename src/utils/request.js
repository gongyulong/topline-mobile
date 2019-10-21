// 封装所有与 axios 相关的逻辑
// 改造为一个插件

// 导入axios
import axios from 'axios'
// 创建一个 axios 实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0' // 请求基准地址
})
// 设置请求拦截器
instance.interceptors.request.use(config => {
// config 所有的请求信息
  return config
}, error => {
  return Promise.reject(error)
})
// 设置响应拦截器
instance.interceptors.response.use(response => {
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
}
// 暴露插件对象
export default myPlugs
