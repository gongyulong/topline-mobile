<template>
  <div>
    <h3>1.0 使用 vant 中的 button</h3>
    <van-button type="primary" @click="text">主要按钮</van-button>
    <h3>2.0 使用 vant 中的单元格</h3>
    <van-cell title="单元格" value="内容" value-class="mycolor" />
    <van-cell value="内容" is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template slot="title">
         <van-icon name="like" />
        <span class="custom-title">单元格</span>
      </template>
    </van-cell>
    <h3>3.0 使用 vant 中的字体</h3>
    <van-icon name="music-o" />
  </div>
</template>

<script>
export default {
  methods: {
    text () {
      console.log('我是测试按钮')
    }
  }
}
</script>

<style lang="less" scoped>
.mycolor {
  color: red;
}
</style>
