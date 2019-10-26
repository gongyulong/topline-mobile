<template>
  <div>
    <van-popup
      :value="value"
      @input="$emit('input', false)"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <!-- 我的频道 -->
      <div>
        <!-- 标题 -->
        <van-cell title-class="mytitle" title="我的频道">
          <template slot="default">
            <van-button v-if="iconshow===false" @click="iconshow=true" class="fonts" plain type="warning" size="small" round>编辑</van-button>
            <van-button v-if="iconshow===true" @click="iconshow=false" class="fonts" plain type="warning" size="small" round>完成</van-button>
          </template>
        </van-cell>
        <!-- 我的频道内容 -->
        <van-grid>
          <van-grid-item class="channelitem" v-for="(item, index) in channelsList" :key="index" >
              <template slot="text">
                  <!-- 当点击频道管理元素时触发 sync使用-->
                  <div @click="changeActive(index)">
                      <div :class="{active: index === activeTab}" class="channeltext">{{item.name}}</div>
                      <van-icon @click="delChannel(index)" class="channelicon" name="clear" v-show="iconshow && index !== 0"/>
                  </div>
              </template>
          </van-grid-item>
        </van-grid>
      </div>
       <!-- 推荐频道 -->
      <div>
        <!-- 标题 -->
        <van-cell title-class="mytitle" title="推荐频道">
          <template slot="default">
          </template>
        </van-cell>
        <!-- 推荐频道内容 -->
        <van-grid>
          <van-grid-item class="channelitem" v-for="(item, index) in surplusChannel" :key="index" >
              <template slot="text">
                  <div >
                      <div @click="addChannel(item)" class="channeltext">{{item.name}}</div>
                  </div>
              </template>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { apiGetAllChannle, apiSetUserChannels } from '@/api/channle.js'
export default {
  props: ['value', 'channelsList', 'activeTab'],
  data () {
    return {
      // 完成/编辑按钮切换
      iconshow: false,
      // 所有的频道数据
      allChannels: []
    }
  },
  methods: {
    // 得到所有的频道数据
    async getAllChannels () {
      let res = await apiGetAllChannle(this.$http, {
        url: '/channels',
        method: 'GET'
      })
      // console.log(res)
      // 赋值给所有频道数据
      this.allChannels = res.channels
    },
    // 当点击频道管理元素时触发
    changeActive (index) {
      this.$emit('update:activeTab', index)
    },
    // 添加我的频道
    addChannel (item) {
      // 动态添加自定义属性
      this.addAttrToChannels(item)
      // 本地添加频道
      this.channelsList.push(item)
      // 判断是否有登录
      this.loginInfo()
    },
    // 删除我的频道
    delChannel (index) {
      // 删除当前选中频道
      this.channelsList.splice(index, 1)
      // 判断是否有登录
      this.loginInfo()
    },
    // 判断是有登录
    loginInfo () {
      // 得到用户信息
      let user = this.$store.state.user
      if (!user) {
        // 保存到本地
        window.localStorage.setItem('channles', JSON.stringify(this.channelsList))
      } else {
        // 根据用户频道数据生成 channels
        let newArr = this.channelsList.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        // 登录过
        let res = apiSetUserChannels(this.$http, {
          url: '/user/channels',
          method: 'PUT',
          data: {
            channels: newArr
          }
        })
        console.log(res)
      }
    },
    // 频道数据源:动态添加属性
    addAttrToChannels (item) {
      // 下拉状态
      this.$set(item, 'pull', false)
      // 上拉的状态
      this.$set(item, 'up', false)
      // 数据完结的状态
      this.$set(item, 'finished', false)
      // 文章数据的集合
      this.$set(item, 'articleList', [])
      // 添加一个 timestampe
      this.$set(item, 'timestamp', 0)
    }
  },
  computed: {
    // 根据用户频道得到其它剩余频道
    surplusChannel: function () {
      // 1.0 得到所有用户频道的 id 集合
      let ids = this.channelsList.map(item => {
        return item.id
      })
      // 2.0 根据用户频道 id 集合得到剩余频道
      let newChannel = this.allChannels.filter(item => {
        return !ids.includes(item.id)
      })
      // 3.0 返回剩余频道
      return newChannel
    }
  },
  created () {
    // 得到所有的频道数据
    this.getAllChannels()
  }
}
</script>

<style lang='less' scoped>
.mytitle {
  font-size: 18px;
}
.channelitem {
    position: relative;
    .channeltext {
        color: #999;
        font-size: 14px;
    }
    .channelicon {
        position: absolute;
        top: 0;
        right: 0;
        color: #ccc;
    }
    .active {
        color: red;
    }
}
</style>
