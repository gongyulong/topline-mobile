// 进行登录验证

// 导入 Vue
import Vue from 'vue'
// 导入 router
import router from '@/router'
// 导入 vuex
import store from '@/store'
// 导入 vant
import { Toast } from 'vant'
Vue.use(Toast)

// 定义插件对象
let loginPlugs = {}
// 添加一个 install 方法
loginPlugs.install = function (vue) {
  Vue.prototype.$login = function () {
    // 得到用户的信息
    let user = store.state.user
    // 判断是否登陆
    if (!user) {
      Toast.fail('对不起，您还没有登录，请先登录')
      setTimeout(() => {
        router.push('/login/nologin')
      }, 2000)
      return false
    }
    return true
  }
}

// 导出插件对象
export default loginPlugs
