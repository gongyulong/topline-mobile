<template>
  <div>
     小智同学
  </div>
</template>

<script>
// 导入websocket
import io from 'socket.io-client'
export default {
  data () {
    return {
      socket: null
    }
  },
  created () {
    // 接收 token
    let user = this.$store.state.user
    // 连接服务器
    this.socket = io(`http://ttapi.research.itcast.cn?token=${user.token}`)
    // 发送数据到服务器
    this.socket.emit('message', {
      msg: '你是叫小智吗',
      timestamp: Date.now()
    })
    // 接收服务器发送的数据
    this.socket.on('message', value => {
      console.log(value)
    })
  }
}
</script>

<style lang="less">
</style>
