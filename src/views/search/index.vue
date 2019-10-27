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
    <van-cell-group class="thinkplace">
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
    <!-- 搜索历史 -->
    <van-cell-group>
      <van-cell title="搜索历史">
        <template slot="right-icon">
          <div v-if="isProcess===false">
            <van-icon @click="isProcess=true" name="delete" />
          </div>
          <div v-if="isProcess===true">
            <a href="#" @click="delAll" style="margin: 0 10px">清空历史</a>
            <a href="#" @click="isProcess=false">完成</a>
          </div>
        </template>
      </van-cell>
      <van-cell @click="onSearch(item)" :title="item" v-for="(item, index) in historyList" :key="index">
        <!-- 左侧图标 -->
        <template slot="icon">
          <van-icon style="line-height: 24px;margin: 0 10px;" name="search">
          </van-icon>
        </template>
       <!-- 右侧图标 -->
       <template slot="right-icon">
         <van-icon name="close" @click.stop="delItem(index)" v-if="isProcess===true"/>
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
      thinkRes: [],
      // 防抖定时器
      timer: null,
      // 控制是否用来操作历史
      isProcess: false,
      // 定义一个数组：用来记录所有的搜索数据
      historyList: JSON.parse(window.localStorage.getItem('history')) || []
    }
  },
  methods: {
    // 触发搜索事件
    onSearch (item) {
      // 判断搜索内容是否为空
      if (this.search.trim().length === 0) {
        this.$toast('请输入搜索内容')
        return
      }
      // 将搜索的内容保存到数组中
      this.historyList.unshift(item)
      // 1.0 数组的去重
      this.historyList = [...new Set(this.historyList)]
      // 2.0 将数组保存到 localstorage 中
      window.localStorage.setItem('history', JSON.stringify(this.historyList))

      // 跳转searchList 页面
      this.$router.push(`/searchList/${item}`)
    },
    // 取消搜索
    onCancel () {
      // 清空
      this.search = ''
    },
    // 关键词联想操作
    thinksearch () {
      // 清除定时器
      clearTimeout(this.timer)
      // 防抖定时器
      this.timer = setTimeout(() => {
        this.fangdou()
      }, 300)
    },
    // 防抖逻辑代码
    async fangdou () {
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
    },
    // 删除元素
    delItem (index) {
      // 在数据源中删除
      this.historyList.splice(index, 1)
      // 更新到本地
      window.localStorage.setItem('history', JSON.stringify(this.historyList))
    },
    // 清空历史
    delAll () {
      // 添加一个询问框
      this.$dialog.confirm({
        message: '您确定要删除吗'
      }).then(() => {
        this.historyList = []
        window.localStorage.removeItem('history')
      })
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
