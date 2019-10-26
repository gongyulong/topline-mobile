// 用来请求 频道列表数据
function getChannle (axios, { url, method }) {
  return axios({
    url: url,
    method: method
  })
}
// 得到所有的频道数据
function apiGetAllChannle (axios, { url, method }) {
  return axios({
    url: url,
    method: method
  })
}
// 设置频道数据
function apiSetUserChannels (axios, { url, method, data }) {
  return axios({
    url,
    method,
    data
  })
}
// 暴露给外界：按需导出
export {
  getChannle,
  apiGetAllChannle,
  apiSetUserChannels
}
