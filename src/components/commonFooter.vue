<template>
  <div class="commonFooter">
    <div class="top">
      <div class="left">
        <div>
          <img src="../assets/logo_bule.png" class="logo" />
        </div>
        <div class="office">版权所有© 深圳市好邻邦科技有限公司</div>
      </div>
      <div class="right">
        <div class="rightOne">
          <span class="footTwo">服务条款和协议</span>
          <span class="footOne">隐私政策</span>
          <span class="footOne">在线客服</span>
        </div>
        <div class="rightOne">
          <span class="footOne">客户案例</span>
          <span class="footOne">关于我们</span>
          <span class="footOne">营业执照</span>
        </div>
        <div class="rightThree">
          <img src="../assets/gzh.jpg" class="rightTwo" />
          <span class="threeMsg">好邻邦科技公众号</span>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="BANum">
        <span class="BAInfo1" @click="toUrlOne">粤ICP备 17142134号</span>
        <span class="BAInfo2" @click="toUrlTwo">粤公网安备44030502006669号</span
        ><img src="../assets/icon/guohui.png" class="BAImg" />
      </div>
      <span class="offical">本网站由深圳市好邻邦科技提供计算和安全服务</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    toUrlOne() {
      window.open("https://beian.miit.gov.cn", "_blank");
    },
    toUrlTwo() {
      window.open(
        "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502006669",
        "_blank"
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.commonFooter {
  display: flex;
  flex-direction: column;
  .top {
    box-sizing: border-box;
    width: 100%;
    height: 160px;
    padding: 25px 20%;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      .logo {
        width: 240px;
      }
      .name {
        font-size: 32px;
        line-height: 60px;
        font-weight: 600;
        color: #3099dd;
      }
      .office {
        font-size: 12px;
        color: #989898;
        line-height: 25px;
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      .rightOne {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        .footOne {
          font-size: 12px;
          color: #898989;
          margin-bottom: 28px;
          cursor: pointer;
          margin-left: 50px;
          &:hover {
            border-bottom: 1px solid #898989;
          }
        }
        .footTwo {
          font-size: 12px;
          color: #898989;
          margin-bottom: 28px;
          cursor: pointer;
          margin-left: 50px;
          &:hover {
            border-bottom: 1px solid #898989;
          }
        }
      }
      .rightThree {
        display: flex;
        flex-direction: column;
        .rightTwo {
          width: 100px;
          height: 100px;
          margin-left: 50px;
        }
        .threeMsg {
          color: #666;
          font-size: 12px;
          margin-left: 50px;
        }
      }
    }
  }
  .bottom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 20px;
    .BANum {
      font-size: 12px;
      color: #989898;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      .BAInfo1 {
        margin-right: 30px;
        cursor: pointer;
        &:hover {
          border-bottom: 1px solid #989898;
        }
      }
      .BAInfo2 {
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          border-bottom: 1px solid #989898;
        }
      }

      .BAImg {
        width: 16px;
        height: 16px;
      }
    }
    .offical {
      font-size: 12px;
      color: #989898;
      line-height: 25px;
    }
  }
}
</style>
