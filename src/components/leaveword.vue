<template>
  <div>
    <!-- 1.0 显示留言 -->
    <van-cell>
      <template slot="title">
        <div>
          <!-- 2.0 图片 -->
          <div class="t-img">
            <img :src='itemobj.aut_photo' alt="" />
          </div>
          <!-- 3.0 作者 -->
          <div class="t-msg">
            <div class="nname">
              <div class="nickname">{{itemobj.aut_name}}</div>
              <div class="icon">
                <van-icon name="good-job-o" />
                {{itemobj.like_count}}
              </div>
            </div>
            <div class="content">{{itemobj.content}}</div>
            <!-- 4.0 留言时间 -->
            <div class="time">
              <span>{{itemobj.pubdate}}</span>
              <van-button v-if="isa === true" type="default" size="small" @click='reply()'>回复：{{ itemobj.reply_count }}</van-button>
            </div>
          </div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 导入bus 将itemobj参数给 bus
import bus from '@/utils/bus'
export default {
  props: ['itemobj', 'value', 'isa'],
  methods: {
    reply () {
      this.$emit('input', true)
      // 将参数通过bus 交给面板
      bus.$emit('commenitem', this.itemobj)
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
    display: flex;
    .t-msg {
        .nname {
            display: flex;
            justify-content: space-between;
        }
        .content {
            font-size: 16px;
            font-weight: 700;
            margin: 20px 0;
        }
    }
}
.t-img {
  margin-right: 10px;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
}
</style>
