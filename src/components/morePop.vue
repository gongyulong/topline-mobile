<template>
  <van-dialog class="myframe" :value="value"  :showConfirmButton="false" :showCancelButton="false">
      <van-cell-group v-if="isShow === false">
          <!-- 关闭面板按钮 -->
          <van-cell title=''>
              <template slot="right-icon">
                  <van-icon name="cross" @click="$emit('input', false)" />
              </template>
          </van-cell>
          <van-cell icon="location-o" @click="hideArticle" title="隐藏此文章"  />
          <van-cell icon="location-o" @click="isShow=true" title="举报此文章" is-link/>
          <van-cell icon="location-o" @click="blackList"   title="拉黑此作者" />
      </van-cell-group>
      <!-- 举报文章 -->
      <van-cell-group v-if="isShow === true">
           <!-- 右侧箭头图标 -->
            <van-cell @click="isShow=false">
                <template slot="icon">
                    <van-icon name="arrow-left" />
                </template>
            </van-cell>
          <!-- 举报的类型 -->
          <van-cell @click="report(item.id)" v-for="(item, index) in type" :key="index" :title="item.name" icon="location-o"/>
      </van-cell-group>
  </van-dialog>
</template>

<script>
// 导入操作文章
import { apiOperaArticle, apiReportArticle } from '@/api/article'
// 导入接口：拉黑用户
import { apiBalckList } from '@/api/user'
export default {
  props: ['value', 'articleList', 'objItem'],
  data () {
    return {
      // 是否显示举报类型
      isShow: false,
      // 举报类型
      type: [
        { id: 0, name: '其他问题' },
        { id: 1, name: '标题夸张' },
        { id: 2, name: '低俗色情' },
        { id: 3, name: '错别字多' },
        { id: 4, name: '旧闻重复' },
        { id: 5, name: '广告软文' },
        { id: 6, name: '内容不实' },
        { id: 7, name: '涉嫌违法犯罪' },
        { id: 8, name: '侵权' }
      ]
    }
  },
  methods: {
    // 隐藏文章
    async hideArticle () {
      // 将当前文章从数据源中删除
      this.articleList.map((item, index) => {
        // 判断 当前文章的 id 与数据源中对应的数据
        if (item.art_id === this.objItem.art_id) {
          // 将当前文章数据删除
          this.articleList.splice(index, 1)
        }
      })
      // 关闭当前面板
      this.$emit('input', false)
      // 提示用户隐藏成功
      this.$toast.success('隐藏文章成功')

      // 判断用户是否登录
      let user = this.$store.state.user
      if (user) {
        await apiOperaArticle(this.$http, {
          url: `/article/dislikes/${this.objItem.art_id}`,
          method: 'DELETE'
        })
      }
    },
    // 举报文章
    async report (type) {
      // 被举报文章的数据
      // console.log(this.objItem)
      // 将文章信息提交到服务器
      let res = await apiReportArticle(this.$http, {
        url: '/article/reports',
        method: 'POST',
        data: {
          target: this.objItem.art_id,
          type: type
        }
      })
      console.log(res)
      // 回退到更多操作选项
      this.isShow = false
      // 关闭面板
      this.$emit('input', false)
      // 举报成功消息
      this.$toast.success('举报成功')
    },
    // 拉黑文章作者
    async blackList () {
      // 获取被拉黑的作者 id
      let authorId = this.objItem.aut_id
      // 提交到服务器
      let res = await apiBalckList(this.$http, {
        url: 'user/blacklists',
        method: 'POST',
        data: {
          target: authorId
        }
      })
      console.log(res)
      // 关闭操作面板
      this.$emit('input', false)
      // 拉黑操作成功消息提示
      this.$toast.success('拉黑用户成功')
    }
  }
}
</script>

<style lang='less' scoped>
.myframe {
    padding-bottom: 20px;
}
</style>
