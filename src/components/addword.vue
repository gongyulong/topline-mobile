<template>
  <div class="myaddcomment">
    <!-- 留言输入框 -->
    <van-cell>
      <template slot="title">
        <van-search v-model="value" placeholder="写评论" show-action shape="round">
          <div slot="action" @click="onSearch">发送</div>
          <template slot="left-icon">
            <van-icon name="edit" />
          </template>
        </van-search>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 导入添加评论的接口
import { apiSetCommetForArticle, apiSetReplyForComment } from '@/api/article'

export default {
  //        文章详情数据  文章评论列表  添加文章评论还是回复评论  当前评论文章id
  props: ['detaiList', 'commonList', 'isa', 'artid'],
  data () {
    return {
      // 留言框中的数据
      value: ''
    }
  },
  methods: {
    async onSearch () {
      let res
      if (this.isa === true) { //  添加到文章中去
        // console.log(this.detaiList)
        res = await apiSetCommetForArticle(this.$http, {
          target: this.detaiList.art_id,
          content: this.value
        })
        // console.log(res)
      } else { // 添加到评论的回复面板中去
        res = await apiSetReplyForComment(this.$http, {
          target: this.detaiList.com_id, // 当前评论的id
          content: this.value, // 当前文章内容
          artid: this.artid // 当前评论文章id // artid: 传递过程：detail(index.vue)-->reply.vue-->addword.vue
        })
        console.log(res)
      }
      // 将成功后的留言追加到 commonList 中
      this.commonList.push(res.new_obj)
      this.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.myaddcomment {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
