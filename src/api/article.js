// 处理 文章相关数据
function apigetArticle (axios, { url, method, query }) {
  return axios({
    url: url,
    method: method,
    params: query
  })
}
// 暴露给外界：按需导出
export {
  apigetArticle
}
