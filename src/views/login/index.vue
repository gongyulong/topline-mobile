<template>
  <div>
    <!-- 页面顶部 -->
    <van-nav-bar title="登录" />
    <!-- 输入框 -->
    <van-cell-group>
      <van-field v-model="user.mobile" clearable placeholder="请输入手机号" :error-message="errmsg.mobile" >
        <template slot="left-icon">
          <i class="iconfont icon-phone1"></i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        type="password"
        placeholder="请输入验证码"
        :error-message="errmsg.code"
      >
        <template slot="left-icon">
          <i class="iconfont icon-lock named-args2"></i>
        </template>
        <van-button class="code-btn" slot="button" size="small" round>发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login-btn">
      <van-button class="l-btn" type="info" size="large" @click="login" :loading='loginLoading' loading-text="登录中">登录</van-button>
    </div>
  </div>
</template>

<script>
import { userLogin } from '@/api/user.js'
export default {
  data () {
    return {
      // 登录的数据
      user: {
        mobile: '',
        code: ''
      },
      // 验证的错误信息
      errmsg: {
        mobile: '',
        code: ''
      },
      // 加载动画
      loginLoading: false
    }
  },
  methods: {
    // 设置登录参数验证
    validData () {
      // 验证 user 中的参数是否为空
      // 手机号验证
      if (this.user.mobile.trim().length === 0) {
        this.errmsg.mobile = '手机号不能为空'
        return false
      }
      if (this.user.mobile.trim().length !== 11) {
        this.errmsg.mobile = '手机号必须是 11 位数'
        return false
      }
      // 将手机号错误信息重置为空
      this.errmsg.mobile = ''
      // 验证码验证
      if (this.user.code.trim().length === 0) {
        this.errmsg.code = '验证码不能为空'
        return false
      }
      // 将验证码错误信息重置为空
      this.errmsg.code = ''
      return true
    },
    // 登录请求数据
    async login () {
      // 参数的验证
      this.validData()
      try {
        // 开启加载动画
        this.loginLoading = true
        // 请求数据
        let res = await userLogin(this.$http, {
          url: '/authorizations',
          method: 'POST',
          data: this.user
        })
        // console.log(res)
        // 将用户信息保存到 vuex 中
        this.$store.commit('setUser', res)
        // 关闭加载动画
        this.loginLoading = false
        // 判断当前路由（解决新人登陆Login跳转空白页bug）
        // 跳转到 home (back回退到跳转前页面)
        if (this.$route.path !== '/login') {
          this.$router.back()
        } else {
          this.$router.push('/home')
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('手机号或者验证码有误')
        setTimeout(() => {
          this.loginLoading = false
        }, 1000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar.van-hairline--bottom {
  background: #3296fa;
  .van-nav-bar__title.van-ellipsis {
    color: #fff;
  }
}
.code-btn {
  background-color: #eee;
  color: #aaa;
}
.login-btn {
  margin: 15px;
  .l-btn {
    border-radius: 5px;
  }
}
</style>
