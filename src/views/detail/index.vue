<template>
  <div class="detail">
    <!-- 1.0 标题 -->
    <van-nav-bar title="文章详情" fixed title-class='d-title'/>
    <!-- 2.0 文字标题 -->
    <van-cell :title="detaiList.title" />
    <!-- 3.0 作者区域 -->
    <van-cell>
      <template slot="title">
        <div class="author">
          <!-- 头像 -->
          <div class="a-img">
            <img
              :src="detaiList.aut_photo"
              alt
            />
          </div>
          <!-- 作者 -->
          <div class="a-name">
            <div class="name">{{ detaiList.aut_name }}</div>
            <div class="name">{{ detaiList.pubdate | relativetime }}</div>
          </div>
          <!-- 关注 -->
          <div>
            <van-button @click="follow" type="info" size="small" round >
              <van-icon name='plus' v-if='!detaiList.is_followed' />
              {{ detaiList.is_followed ? '取消关注' : '关注' }}
            </van-button>
          </div>
        </div>
      </template>
    </van-cell>
    <!-- 4.0 内容区域 -->
    <van-cell>
        <template solt='title'>
          <div v-html='detaiList.content'></div>
        </template>
    </van-cell>
    <!-- 5.0 点赞&不喜欢 -->
    <div class='d-btn'>
        <van-button  :type="detaiList.attitude === 1 ? 'danger': 'default' " class='d-btn1' round size='small' plain >
          <van-icon name='like-o'/>
          点赞
        </van-button>
        <van-button  :type="detaiList.attitude === 0 ? 'danger': 'default' " class='d-btn1' round size='small' plain >
          <van-icon name='like-o'/>
          不喜欢
        </van-button>
    </div>
    <!-- 6.0 评论留言组件 -->
    <van-list v-model='loading' :finished='finished' finished-text='没有更多了' @load='onLoad'>
      <div v-for="(item, index) in commonList" :key='index'>
        <!-- isa 回复框-给文章添加评论 -->
        <leaveword :itemobj='item' v-model='show' :isa="true"/>
      </div>
    </van-list>
    <!-- 7.0 留言输入框 -->
    <!-- isa 文章评论框 -->
    <addword :detaiList='detaiList' :commonList='commonList' :isa="true"/>
    <!-- 8.0  回复留言的面板组件-->
    <Reply v-model="show" :artid='artid'/>
  </div>
</template>

<script>
// 导入 留言区域
import leaveword from '@/components/leaveword'
// 导入 留言输入框
import addword from '@/components/addword'
// 导入 文章详情数据
import { apicomArticle } from '@/api/article'
// 导入 取关的 接口
import { apiUnFollow, apiFollow } from '@/api/user'
// 导入 评论的 接口
import { apiGetpageComment } from '@/api/commen'
// 导入 评论的 接口
import Reply from '@/components/reply'

export default {
  data () {
    return {
      artid: '', // 文章id
      detaiList: {}, // 文章详情数据
      commonList: [], // 文章评论数据
      loading: false, // list 加载状态
      finished: false, // list 是否完毕状态
      endid: '', // 结束id
      limit: 10, // 每页的条数
      offset: '', // 文章的偏移量
      show: false // 回复面板的显示
    }
  },
  methods: {
    // 1.0 得到文章详情
    async getArtieDetail () {
      let res = await apicomArticle(this.$http, this.artid)
      // console.log('--------------------------------')
      // console.log(res)
      // console.log('--------------------------------')
      this.detaiList = res
    },
    // 2.0 关注 & 取消关注
    async follow () {
      // 得到当前作者的关注状态
      let isFollow = this.detaiList.is_followed
      // console.log(isFollow)
      if (isFollow) {
        // 已经关注
        await apiUnFollow(this.$http, this.detaiList.aut_id)
        // console.log('11111111111111111111111')
        // console.log(res)
        // 将数据源中关注状态改为没有关注
        this.detaiList.is_followed = false
      } else {
        // 未关注
        await apiFollow(this.$http, this.detaiList.aut_id)
        // console.log('2222222222222222222')
        // console.log(res)
        // 将数据源中关注状态改为已经关注
        this.detaiList.is_followed = true
      }
    },
    // 3.0 加载评论数据
    async onLoad () {
      // 请求数据源 commonList
      let res = await apiGetpageComment(this.$http, {
        source: this.artid,
        offset: this.offset || undefined,
        limit: this.limit
      })
      // console.log(res)
      // 保存 评论数据
      this.commonList = [...this.commonList, ...res.results]
      // 保存结束 id
      this.endid = res.end_id
      // 保存偏移量（分页）
      this.offset = res.last_id
      // 解决评论数据过多bug
      if (this.offset === this.endid) {
        this.finished = true
      }
      // 重新加载 状态(解决底部一直加载BUG))
      this.loading = false
    }
  },
  components: {
    leaveword,
    addword,
    Reply
  },
  created () {
    // 得到文章 id
    this.artid = this.$route.params.artid
    // console.log(this.artid)
    // 得到文章详情
    this.getArtieDetail()
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
.detail {
  margin-top: 46px;
  margin-bottom: 80px;
  .d-title {
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
  }
  .author {
    display: flex;
    align-items: center;
    .a-img {
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .a-name {
      flex: 1;
    }
  }
  .d-btn {
    text-align: center;
    .d-btn1 {
      margin: 0 10px;
      border-radius: 44px;
    }
  }
}
</style>
