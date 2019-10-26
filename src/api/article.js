// 处理 文章相关数据
function apigetArticle (axios, { url, method, query }) {
  return axios({
    url,
    method,
    params: query
  })
}
// 处理 文章相关数据
function apiOperaArticle (axios, { url, method }) {
  return axios({
    url,
    method
  })
}
// 举报 文章相关数据
function apiReportArticle (axios, { url, method, data }) {
  return axios({
    url,
    method,
    data
  })
}

// 暴露给外界：按需导出
export {
  apigetArticle,
  apiOperaArticle,
  apiReportArticle
}
