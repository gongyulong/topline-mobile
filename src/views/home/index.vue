<template>
  <div class="home">
    <!-- 顶部标题 -->
    <van-nav-bar title="头条资讯" fixed />
    <div class="tab-content">
      <!-- tab栏 频道列表-->
      <van-tabs v-model="activeTab">
        <!-- {{activeTab}} -->
        <van-tab v-for="(item, index) in channelsList" :key="index" :title="item.name">
          <!-- 下拉刷新 refresh组件-->
          <van-pull-refresh v-model="item.pull" @refresh="onRefresh">
            <!-- 上拉刷新list组件  v-model：pull 的加载状态 true 正在加载 false 加载完毕 -->
            <van-list v-model="item.up" :finished="item.finished" finished-text="没有更多了"  @load="onLoad" >
              <!-- 文章列表数据 start -->
              <van-cell  class = 'mycell' v-for="(subitem, subindex) in item.articleList" :key="subindex" :title="subitem.title" title-class="titlelis">
                <template slot="label">
                  <!-- 图片 -->
                  <van-grid v-if="subitem.cover.type > 0" :border="false" :column-num="3">
                    <van-grid-item v-for="(imgitem, imgindex) in subitem.cover.images" :key="imgindex">
                      <van-image lazy-load :src="imgitem"/>
                    </van-grid-item>
                  </van-grid>
                  <!-- 评论 -->
                  <div class='comlist'>
                    <div class='fonstyle'>
                      <span>{{ subitem.aut_name }}</span>
                      <span>{{ subitem.comm_count }} 评论</span>
                      <!-- 使用过滤器处理时间 -->
                      <span>{{ subitem.pubdate | relativetime }}</span>
                    </div>
                    <!-- 更多操作按钮 -->
                    <div>
                      <van-icon name="cross" @click="openMore(subitem, item.articleList)"/>
                    </div>
                  </div>
                </template>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <!-- 图标按钮 -->
        <div class="tab-icon">
          <van-icon name="wap-nav" @click="showPop"/>
        </div>
      </van-tabs>
    </div>
    <!-- 频道管理: 封装为一个组件 -->
    <channlepop  v-model="show" :channelsList='channelsList' :activeTab.sync="activeTab"/>
    <!-- 更多操作: 封装为一个组件-->
    <morePop v-model="moreshow" :articleList="itemList" :objItem="objItem"/>
  </div>
</template>

<script>
// 导入请求频道的方法
import { getChannle } from '@/api/channle.js'
// 导入请求文章的方法
import { apigetArticle } from '@/api/article.js'
// 导入频道管理组件
import channlepop from '@/components/channelPop'
// 导入更多操作组件
import morePop from '@/components/morePop'

export default {
  data () {
    return {
      // 频道数据列表
      channelsList: [],
      // 当前选中的van-tabs下标
      activeTab: 0,
      // 控制频道管理弹窗的显示和隐藏
      show: false,
      // 控制操作管理弹窗的显示和隐藏
      moreshow: false,
      // 当前显示数据源
      itemList: [],
      // 当前操作的数据对象
      objItem: {}
    }
  },
  methods: {
    // 获取频道数据
    async getChannelList () {
      try {
        // 得到用户信息
        let user = this.$store.state.user
        // 判断 是否有登录
        if (!user) {
          // 得到 localstorage 中频道数据
          let channels = JSON.parse(window.localStorage.getItem('channels'))
          // 判断 localstorage 中是否有频道数据
          if (channels) {
            // 将数据直接加载
            this.channelsList = channels
          } else {
            // 如果不存在，再去服务器中得到返回的默认 7 条频道数据
            let res = await getChannle(this.$http, {
              url: '/user/channels',
              method: 'GET'
            })
            // 将服务器返回的数据保存到 channelsList
            this.channelsList = res.channels
          }
        } else {
          // 如果登录，去服务器中得到返回 登录后频道数据
          let res = await getChannle(this.$http, {
            url: '/user/channels',
            method: 'GET'
          })
          // console.log(res)
          // 将数据保存到 channelsList
          this.channelsList = res.channels
        }
        // 调用动态添加属性方法
        this.addAttrToChannels()
      } catch {
        // 提示信息
        this.$toast.fail('获取信息失败')
      }
    },
    // 频道数据源:动态添加属性
    addAttrToChannels () {
      this.channelsList.forEach(item => {
        // 上拉状态: up
        this.$set(item, 'up', false)
        // 上拉结束状态： finished
        this.$set(item, 'finished', false)
        // 下拉状态：pull
        this.$set(item, 'pull', false)
        // 添加list 数据源articleList
        this.$set(item, 'articleList', [])
        // 添加timestamp
        this.$set(item, 'timestamp', 0)
      })
      // console.log(this.channelsList)
    },
    // 获取list组件文章数据
    // 上拉触底、list刷新触发
    async onLoad () {
      try {
        // 得到当前选中的频道
        let channel = this.channelsList[this.activeTab]
        // 得到当前频道id
        let channleid = channel.id
        // 定义一个 timestamp
        let timestamp
        // 判断： 是否是第一次请求
        if (channel.timestamp === 0) {
          timestamp = Date.now()
        } else {
          timestamp = channel.timestamp
        }
        // 请求当前选中频道下的文章列表
        let res = await apigetArticle(this.$http2, {
          url: '/articles',
          method: 'GET',
          query: {
            // 需要的频道 id
            channel_id: channleid,
            // 当前时间戳（分页标识）
            timestamp: timestamp,
            // 不包含置顶
            with_top: 0
          }
        })
        // console.log(res)
        // 将数据源追加 到当前频道下的 articleList 中
        channel.articleList = [...channel.articleList, ...res.results]
        // 保存timestamp
        channel.timestamp = res.pre_timestamp
        // 判断返回的数据是否为空
        if (res.pre_timestamp === null) {
          // 说明数据已经加载完成
          channel.finished = true
        }
        // 关闭加载状态
        channel.up = false
      } catch {
        // 提示信息
        this.$toast.fail('获取信息失败')
      }
    },
    // 下拉刷新
    onRefresh () {
      // 得到当前选中的频道
      let channel = this.channelsList[this.activeTab]
      // 清除文章内容数据源
      channel.articleList = []
      // 将相关数据设置为默认值
      channel.timestamp = 0
      channel.up = false
      channel.finished = false
      // 重新加载list组件文章获取数据
      this.onLoad()
      // 将下拉状态重置为 false
      channel.pull = false
    },
    // 打开频道弹框显示
    showPop () {
      this.show = true
    },
    // 打开更多操作显示
    openMore (subitem, itemList) {
      // 打开更多操作的面板
      this.moreshow = true
      // 得到当前文章
      this.objItem = subitem
      // 得到当前显示的文章数据源
      this.itemList = itemList
      // console.log(itemList)
    }
  },
  created () {
    // 页面打开时,加载频道数据
    this.getChannelList()
  },
  components: {
    // 频道管理弹框
    channlepop,
    // 更多操作弹框
    morePop
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
.titlelis {
  font-size: 16px;
  font-weight: 700;
  .comlist {
    display: flex;
    justify-content: space-between;
    .fonstyle {
      font-size: 14px;
      font-weight: 400;
      span {
        margin: 0 10px;
      }
    }
  }
}
</style>
