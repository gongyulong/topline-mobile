<template>
  <div class="home">
    <!-- 顶部标题 -->
    <van-nav-bar title="首页" fixed />
    <div class="tab-content">
      <!-- tab栏 频道列表-->
      <van-tabs>
        <van-tab v-for="(item, index) in channelsList" :key="index" :title="item.name">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 上拉刷新  v-model：pull 的加载状态 true 正在加载 false 加载完毕 -->
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
              <van-cell v-for="item in list" :key="item" :title="item" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <!-- 图标按钮 -->
        <div class="tab-icon">
          <van-icon name="wap-nav" />
        </div>
      </van-tabs>
    </div>
  </div>
</template>

<script>
// 导入请求频道的方法
import { getchannle } from '@/api/channle.js'
export default {
  data () {
    return {
      // 频道数据列表
      channelsList: [],
      // 加载状态
      loading: false,
      // 加载完毕
      finished: false,
      // 测试数据
      list: '',
      // 下拉刷新数据
      isLoading: false
    }
  },
  methods: {
    // 获取频道数据
    async getChannelList () {
      try {
        let res = await getchannle(this.$http, {
          url: '/user/channels',
          method: 'GET'
        })
        console.log(res)
        // 将数据保存到 channelsList
        this.channelsList = res.channels
      } catch {
        // 提示信息
        this.$toast.fail('获取信息失败')
      }
    },
    // 上拉刷新
    onLoad () {
      this.list = [...this.list, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      // console.log('loaded')
      this.loading = false
    },
    // 下拉刷新
    onRefresh () {
      console.log('onrefresh')
      this.list = []
      this.onLoad()
      this.isLoading = false
    }
  },
  created () {
    // 页面打开时,加载频道数据
    this.getChannelList()
  }
}
</script>

<style lang='less' scoped>
.van-nav-bar.van-hairline--bottom {
  background: #3296fa;
  .van-nav-bar__title.van-ellipsis {
    color: #fff;
  }
}
.tab-content {
  position: relative;
  .tab-icon {
    position: fixed;
    top: 50px;
    right: 0;
    width: 10%;
    height: 44px;
    text-align: center;
    line-height: 44px;
    font-size: 26px;
  }
}
.home {
  margin-top: 100px;
  margin-bottom: 50px;
}
.home /deep/ .van-tabs__wrap {
  width: 90% !important;
  position: fixed;
  top: 50px;
  left: 0;
  z-index: 1000;
}
.home /deep/ .van-nav-bar {
  height: 50px;
  line-height: 50px;
}
</style>
