<template>
  <div>
    <!-- 显示留言 -->
    <van-cell>
      <template slot="title">
        <div>
          <!-- 图片 -->
          <div class="t-img">
            <img src='https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=494030861,2564153321&fm=85&s=4AF839C480220505CD1921A30300D016' alt />
          </div>
          <!-- 作者 -->
          <div class="t-msg">
            <div class="nname">
              <div class="nickname">晚风</div>
              <div class="icon">
                <van-icon name="good-job-o" />
              </div>
            </div>
            <div class="content">我出去</div>
            <!-- 留言时间 -->
            <div class="time">
              <span>10-28 11:00</span>
              <van-button type="default" size="small">18回复</van-button>
            </div>
          </div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.comment {
    display: flex;
    .t-img {
        margin-right: 10px;
        img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
        }
    }
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
</style>
