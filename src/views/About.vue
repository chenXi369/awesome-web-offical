<template>
  <article class="about">
    <div class="article">
      <header
        class="header"
        :class="[
          fixedHeader ? 'fixedHeader' : '',
          fixedShadow ? 'fixedShadow' : '',
        ]"
      >
        <div class="left">
          <img src="../assets/logo_bule.png" class="logo" />
          <!-- <span class="title">好邻邦</span> -->
        </div>
        <ul class="menuList">
          <li
            class="menu"
            :class="{ activeMenu: item === '产品' }"
            v-for="item in urlList"
            :key="item"
            @click="selectMenu(item)"
            @mouseenter="menuEnter(item)"
            @mouseleave="menuLeave(item)"
          >
            {{ item }}
            <template v-if="item === '产品'">
              <el-collapse-transition>
                <div class="transition" v-show="hiddenProduce">
                  <div class="produceList">
                    <div
                      class="produce"
                      v-for="item in produceList"
                      :key="item.name"
                      @click="goToUrl(item)"
                    >
                      <img :src="item.img" class="produceIcon" alt="" />
                      <div class="right">
                        <div class="innerRight"></div>
                        <span class="innerName">{{ item.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-collapse-transition>
            </template>
          </li>
        </ul>
      </header>
    </div>
    
    <main class="main"></main>

    <footer class="footer">
      <common-footer></common-footer>
    </footer>
  </article>
</template>

<script>
import CommonFooter from "../components/commonFooter.vue";
export default {
  data() {
    return {
      hiddenProduce: false,
      fixedHeader: false,
      fixedShadow: false,
      urlList: ["首页", "产品", "客户", "关于我们"],
      produceList: [
        {
          name: "社区平台",
          img: require("../assets/icon/social.png"),
        },
        {
          name: "移动支付",
          img: require("../assets/icon/pay.png"),
        },
        {
          name: "发票系统",
          img: require("../assets/icon/trcket.png"),
        },
        {
          name: "催费缴费",
          img: require("../assets/icon/payFee.png"),
        },
        {
          name: "微信推送",
          img: require("../assets/icon/wxPush.png"),
        },
        {
          name: "停车服务",
          img: require("../assets/icon/parking.png"),
        },
      ],
    };
  },
  components: {
    CommonFooter,
  },
  created() {
    console.log(this.$route.query.produce)
  },
  methods: {
    menuEnter(name) {
      if (name === "产品") {
        this.hiddenProduce = true;
      }
    },
    menuLeave(name) {
      if (name === "产品") {
        this.hiddenProduce = false;
      }
    },
    selectMenu(item) {
      if(item === '首页') {
        this.$router.push({
          name: "Home"
        })
      } else if(item === '客户') {
        this.$router.push({
          name: "Customer"
        })
      } else if(item === '关于我们') {
        this.$router.push({
          name: "Mine"
        })
      }
    },
    goToUrl(item) {
      this.$router.push({
        name: "About",
        query: {
          produce: item.name
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.about {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .article {
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #3c9, #1890ff, #66f) left center/400% 400%;
    animation: move 10s infinite;
    @keyframes move {
      0%,
      100% {
        background-position-x: left;
      }
      50% {
        background-position-x: right;
      }
    }
    .header {
      width: 60%;
      padding: 10px 20% 0;
      background: #ffffff;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      top: 0px;

      .left {
        display: flex;
        flex-direction: row;
        .logo {
          width: 240px;
        }
        .title {
          font-size: 30px;
          font-weight: 700;
          color: #3099dd;
        }
      }

      .menuList {
        display: flex;
        flex-direction: row;
        list-style-type: none;
        .menu {
          font-size: 16px;
          font-weight: 500;
          color: #666666;
          padding: 40px;
          cursor: pointer;
          &:hover {
            color: #3099dd;
          }
        }
        .activeMenu {
          position: relative;
        }
      }
    }

    .fixedShadow {
      box-shadow: 4px 4px 4px #eaeaea;
    }

    .transition {
      width: 280px;
      border-radius: 10px;
      position: absolute;
      top: 100px;
      left: 0px;
      background: #fff;
      box-shadow: 0px 9px 24px rgba(0, 0, 0, 0.1);
      .produceList {
        list-style-type: none;
        .produce {
          height: 60px;
          border-bottom: 1px dotted #eaeaea;
          font-size: 18px;
          color: #666666;
          display: flex;
          align-items: center;
          justify-content: space-around;
          &:last-child {
            border-bottom: none;
          }
          &:hover {
            background: #eaeaea;
            .right {
              display: flex;
              align-items: center;
              .innerRight {
                width: 12px;
                height: 12px;
                margin-right: 20px;
                background: url(../assets/icon/activeRight.png) no-repeat;
                background-size: 100%;
              }
              .innerName {
                font-size: 14px;
                color: #3099dd;
              }
            }
          }
          .produceIcon {
            width: 30px;
            height: 29px;
          }
          .right {
            display: flex;
            align-items: center;
            .innerRight {
              width: 12px;
              height: 12px;
              margin-right: 20px;
              background: url(../assets/icon/right.png) no-repeat;
              background-size: 100%;
            }
            .innerName {
              font-size: 16px;
              color: #666666;
            }
          }
        }
      }
    }
  }

  .main {
    width: 100%;
    height: 300px;
  }

  .footer {
    width: 100%;
    height: 230px;
    border-top: 1px solid #666;
  }
}
</style>
