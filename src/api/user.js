// 管理所有与用户相关的网络请求

// 用来进行用户的登录
function userLogin (axios, { url, method, data }) {
  return axios({
    url,
    method,
    data
  })
}
// 用来进行用户的登录
function apiBalckList (axios, { url, method, data }) {
  return axios({
    url,
    method,
    data
  })
}
// 取消关注用户
function apiUnFollow (axios, userId) {
  return axios({
    url: `/user/followings/${userId}`,
    method: 'DELETE'
  })
}

// 关注用户
function apiFollow (axios, userId) {
  return axios({
    url: `/user/followings`,
    method: 'post',
    data: {
      target: userId
    }
  })
}
// 暴露给外界：按需导出
export {
  userLogin,
  apiBalckList,
  apiUnFollow,
  apiFollow
}
