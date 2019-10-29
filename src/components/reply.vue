<template>
    <!--value: 控制面板显示  input 控制面板隐藏  -->
    <van-popup class='mypop' :value='value' @input="$emit('input', $event)" position="bottom" :style="{height: '80%'}">
      <van-cell title='当前评论'></van-cell>
      <!-- 1.0 使用leaveword组件渲染留言回复 -->
      <leaveword :itemobj='itemobj' :isa="false" />
      <!-- 评论的回复 -->
      <van-cell title='当前评论'></van-cell>
      <div v-for="(item, index) in commonReplyList" :key="index">
        <leaveword :itemobj='item' :isa="false" />
      </div>
      <!-- 2.0 使用addword评论框组件 -->
      <addword :detaiList='itemobj' :commonList="commonReplyList"  :artid="artid" :isa='false' />
    </van-popup>
</template>

<script>
// 导入bus, 接收leaveword兄弟组件传递itemobj
import bus from '@/utils/bus'
// 导入 leaveword 组件
import leaveword from '@/components/leaveword'
// 导入 addword 组件
import addword from '@/components/addword'
// 导入 请求评论回复的请求
import { apiGetPageCommentReplay } from '@/api/commen'

export default {
  props: ['value', 'artid'],
  data () {
    return {
      // 评论对象
      itemobj: {},
      // 评论的回复数据
      commonReplyList: []
    }
  },
  methods: {
    async getCommentReplyList () {
      let res = await apiGetPageCommentReplay(this.$http, {
        source: this.itemobj.com_id.toString(),
        offset: undefined,
        limit: 10
      })
      // console.log(res)
      this.commonReplyList = res.results
    }
  },
  created () {
    bus.$on('commenitem', value => {
      console.log(value)
      this.itemobj = value
    })
  },
  components: {
    leaveword,
    addword
  },
  watch: {
    // 将来 itemObj 改变之后会触发后的函数
    itemobj: function () {
      if (this.itemobj.com_id) {
        // 解决请求数据为空问题（原因reply组件创建过早，导致无法获取 itemobj数据源 缺失source）
        this.getCommentReplyList()
      }
    }
  }
}
</script>

<style lang='less' scoped>
.mypop {
  margin-bottom: 70px;
}
</style>
