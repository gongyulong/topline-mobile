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
    <!-- 6.0 评论留言 -->
    <div v-for="(item, index) in 8" :key='index'>
        <leaveword />
    </div>
    <!-- 7.0 留言输入框 -->
    <addword :detaiList='detaiList'/>
  </div>
</template>

<script>
// 导入 留言
import leaveword from '@/components/leaveword'
// 导入 留言输入框
import addword from '@/components/addword'
// 导入 文章详情数据
import { apicomArticle } from '@/api/article'
// 导入 取关的 接口
import { apiUnFollow, apiFollow } from '@/api/user'

export default {
  data () {
    return {
      artid: '',
      detaiList: {}
    }
  },
  methods: {
    // 得到文章详情
    async getArtieDetail () {
      let res = await apicomArticle(this.$http, this.artid)
      // console.log('--------------------------------')
      // console.log(res)
      // console.log('--------------------------------')
      this.detaiList = res
    },
    // 关注 & 取消关注
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
    }
  },
  components: {
    leaveword,
    addword
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
