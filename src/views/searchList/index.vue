<template>
  <div class="searchList">
    <!-- 搜索列表 -->
    <van-nav-bar title="搜索列表" fixed />
    <!-- 使用vant中的list组件分页 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
    <!-- 渲染数据源 -->
    <van-cell-group>
      <van-cell @click='todetail(item.art_id)' class='mycell' v-for="(item, index) in searchResult" :key="index" :title="item.title" >
        <template slot="label">
          <!-- 图片 -->
          <van-grid :border="false" :column-num="3" v-if='item.cover.type > 0'>
            <van-grid-item>
              <van-image v-for="(imgitem, imgindex) in item.cover.images" :key="imgindex" :src=imgitem />
            </van-grid-item>
          </van-grid>
          <!-- 说明信息 -->
          <div>
            <span>{{ item.aut_name }}</span>
            <span>{{ item.pubdate | relativetime }}</span>
          </div>
          <!-- 点赞区域 -->
          <van-grid :column-num="3">
            <van-grid-item>
              <template slot="default">
                <!-- flex布局-影响下一级布局 -->
                <div class="ispace" @click.stop="commit">
                  <van-icon class="myicon" name="comment-o" />{{ item.comm_count }}评论
                </div>
              </template>
            </van-grid-item>
            <van-grid-item>
              <template slot="default">
                <div class="ispace" @click.stop="thumbsup">
                  <van-icon class="myicon" name="comment-o" />{{ item.like_count }}点赞
                </div>
              </template>
            </van-grid-item>
            <van-grid-item>
              <template slot="default">
                <div class="ispace">
                  <van-icon class="myicon" name="comment-o" />{{ item.collect_count }}收藏
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </template>
      </van-cell>
    </van-cell-group>
    </van-list>
  </div>
</template>

<script>
// 导入搜索结果数据请求
import { apiGetSearchList } from '@/api/search'

export default {
  data () {
    return {
      // 搜索关键字
      key: '',
      // 分页码(page: 0 解决默认页显示第二页bug)
      page: 0,
      // 页容量
      perpage: 10,
      // 搜索结果数据源
      searchResult: [],
      // 数据总条数
      totalCount: '',
      // 设置list的加载状态
      loading: false,
      // 设置list加载完毕状态
      finished: false
    }
  },
  methods: {
    // 1.0 list 加载方法 1. list被加载 2. 下拉触底 3. 将加载状态设置 true
    onLoad () {
      // 当前页++
      this.page++
      // 调用获取数据方法(异步方法)
      this.getSearchList()
    },
    // 2.0 获取搜索列表数据
    async getSearchList () {
      let res = await apiGetSearchList(this.$http, {
        page: this.page,
        perpage: this.perpage,
        q: this.key
      })
      // console.log(res)
      // 保存搜索结果数据源
      this.searchResult = [...this.searchResult, ...res.results]
      // 判断：数据源是否请求结束
      if (this.searchResult.length === this.totalCount) {
        // 数据已经加载完毕(设置 list 组件的数据请求的完结状态)
        this.finished = true
      }
      // 数据的总条数
      this.totalCount = res.total_count
      // 修改加载状态（每次触底请求两页数据的 bug; 异步方法之后）
      this.loading = false
    },
    // 3.0 模拟评论操作
    commit () {
      // 用户信息
      let user = this.$store.state.user
      // 判断是否登陆
      if (!user) {
        this.$toast.fail('对不起，您还没有登录，请先登录')
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
        return
      }
      console.log('模拟评论')
    },
    // 4.0 模拟点赞
    thumbsup () {
      // 登录验证
      let result = this.$login()
      if (!result) {
        return
      }
      console.log('模拟点赞')
    },
    // 5.0 详情页
    todetail (artid) {
      this.$router.push(`/detail/${artid}`)
    }
  },
  created () {
    // 获取用户搜索关键字
    this.key = this.$route.params.key
  }
}
</script>

<style lang='less' scoped>
.searchList {
  margin-top: 46px;
  .van-nav-bar.van-hairline--bottom {
    background: #3296fa;
    .van-nav-bar__title.van-ellipsis {
      color: #fff;
    }
  }
  .ispace {
    font-size: 14px;
    display: flex;
    align-items: center;
    .myicon {
      margin-right: 6px;
      font-size: 20px;
    }
  }
  .mycell {
    border-bottom: 10px solid #f4f5f6;
  }
}
</style>
