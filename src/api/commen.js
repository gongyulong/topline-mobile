// 用来请求 评论列表数据
function apiGetpageComment (axios, { source, offset, limit }) {
  return axios({
    url: '/comments',
    method: 'GET',
    params: {
      type: 'a',
      source: source,
      offset: offset,
      limit: limit
    }
  })
}

// 得到评论的回复
function apiGetPageCommentReplay (axios, { source, offset, limit }) {
  return axios({
    url: '/comments',
    method: 'GET',
    params: {
      type: 'c',
      source: source,
      offset: offset,
      limit: limit
    }
  })
}

// 暴露给外界：按需导出
export { apiGetpageComment, apiGetPageCommentReplay }
