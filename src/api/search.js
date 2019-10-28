// 联想接口
function apiThinkSearch (axios, q) {
  return axios({
    url: `/suggestion?q=${q}`,
    method: 'GET'
  })
}

// 搜索的结果
function apiGetSearchList (axios, { page, perpage, q }) {
  return axios({
    url: '/search',
    method: 'GET',
    params: {
      page: page,
      perpage: perpage,
      q: q
    }
  })
}

// 暴露 API
export { apiThinkSearch, apiGetSearchList }
