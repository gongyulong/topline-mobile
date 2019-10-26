// 封装搜索的接口

// 关键词联想接口
function apiThinkSearch (axios, q) {
  return axios({
    url: `/suggestion?q=${q}`,
    method: 'GET'
  })
}

// 暴露 API
export {
  apiThinkSearch
}
