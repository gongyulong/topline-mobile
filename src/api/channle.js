// 用来请求 频道列表数据
function getChannle (axios, { url, method }) {
  return axios({
    url: url,
    method: method
  })
}
// 暴露给外界：按需导出
export {
  getChannle
}
