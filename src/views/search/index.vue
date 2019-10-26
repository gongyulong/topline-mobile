<template>
  <!-- 搜索页面 -->
  <div>
    <!-- @search：当点击完成按钮时间触发 cancel：点击取消按钮时触发 -->
    <!-- 搜索区域 -->
    <van-search
      class="topsearch"
      placeholder="请输入搜索关键词"
      show-action
      v-model="search"
      @input="thinksearch"
      @search="onSearch"
    >
      <template slot="action">
        <van-button type="info" @click="onCancel">取消</van-button>
      </template>
    </van-search>
    <!-- 联想区域 -->
    <van-cell-group class="thinkplace" >
      <van-cell
        icon="search"
        v-for="(item, index) in thinkRes"
        :key="index"
        @click="onSearch(item.item)"
        >
        <template slot="title">
          <div v-html="item.colorItem"></div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 导入搜索的接口
import { apiThinkSearch } from '@/api/search'
export default {
  data () {
    return {
      // 搜索内容
      search: '',
      // 联想的结果
      thinkRes: []
    }
  },
  methods: {
    // 触发搜索
    onSearch (item) {
      // 判断搜索内容是否为空
      if (this.search.trim().length === 0) {
        this.$toast('请输入搜索内容')
        return
      }
      // 跳转searchList 页面
      this.$router.push(`/searchList/${item}`)
    },
    // 取消搜索
    onCancel () {
      // 清空
      this.search = ''
    },
    // 关键词联想请求服务器
    async thinksearch () {
      // 判断搜索内容是否为空
      if (this.search.trim().length === 0) {
        return
      }
      // 请求服务器
      let res = await apiThinkSearch(this.$http, this.search)
      // console.log(res)
      // 改造 res
      this.thinkRes = res.options.map(item => {
        // 将元素以关键字进行分隔
        return {
          // 带有颜色的关键词搜索内容
          colorItem: item
            .split(this.search)
            .join(`<span style="color:red">${this.search}</span>`),
          // 默认文本
          item: item
        }
      })
    //   console.log(this.thinkRes)
    }
  },
  watch: {
    // 监听 search:当它为空时，联想列表内容为空
    search: function () {
      if (this.search.trim().length === 0) {
        this.thinkRes = []
      }
    }
  }
}
</script>

<style lang='less' scoped>
.topsearch {
  background-color: #3296fa !important;
  .colorW {
    color: white;
  }
  /deep/ .van-search__action:active {
    background-color: #3296fa !important;
  }
}
.thinkplace {
  .tpcell {
    background-color: #f5f7f9;
  }
}
</style>
