<template>
  <article class="index">
    <header class="home">
      <div
        class="header"
        :class="[
          fixedHeader ? 'fixedHeader' : '',
          fixedShadow ? 'fixedShadow' : '',
        ]"
      >
        <div class="left">
          <img
            src="../assets/logo_bule.png"
            class="logo"
            alt=""
            v-if="fixedHeader"
          />
          <img src="../assets/logo_white.png" class="logo" alt="" v-else />
        </div>
        <ul class="menuList">
          <li
            class="menu"
            :class="{ activeMenu: item === '产品' }"
            v-for="item in urlList"
            :key="item"
            @click="goMenus(item)"
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
        <div v-if="isToken">
          <el-button @click="toLogin">注册/登录</el-button>
        </div>
        <div v-else>
          <el-dropdown
            class="avatar-container right-menu-item hover-effect"
            trigger="click"
            placement="bottom-end"
          >
            <div class="avatar-wrapper">
              <img src="@/assets/images/profile.jpg" class="user-avatar" />
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/user">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided @click.native="logout">
                <span style="display: block">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="middle">
        <div class="middle-title">重新定义社区管理模式</div>
        <div class="middle-content">
          我们为社区重新定义了全新的管理模式，使得我们的社区更加的数字化、模块化、安全化，方便，安心，快捷。
        </div>
        <div class="middle-center">
          <div
            v-for="item in produceList"
            :key="item.name"
            class="middle-produce"
          >
            <img src="../assets/icon/yes.png" class="middle-icon" alt="" />
            <span class="middle-name">{{ item.name }}</span>
          </div>
        </div>
        <img
          src="https://nwzimg.wezhan.cn/contents/sitefiles2035/10176650/images/11508667.png"
          class="middle-img"
          alt=""
        />
      </div>
    </header>

    <main class="main">
      <div class="cardList">
        <div class="card" v-for="item in cardList" :key="item.name">
          <img :src="item.img" class="cardIcon" alt="" />
          <h2 class="name">{{ item.name }}</h2>
          <span class="title">{{ item.title }}</span>
          <div class="more" @click="toMore(item.name)">
            <span class="innerMore otherMore">了解更多</span>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <common-footer></common-footer>
    </footer>

    <div class="tips">
      <div class="position">
        <div v-show="phoneIcon" class="phoneIcon">
          <img src="../assets/okbang_tel.png" style="width: 150px" alt="" />
        </div>
        <div v-show="wxIcon" class="wxIcon"></div>
        <div
          v-for="item in tips"
          :key="item.img"
          class="tip"
          @mouseenter="iconEnter(item.name)"
          @mouseleave="iconLeave(item.name)"
        >
          <img :src="item.img" class="tipIcon" alt="" />
        </div>
      </div>
    </div>
  </article>
</template>

<script>
// @ is an alias to /src
import CommonFooter from "../components/commonFooter.vue";

export default {
  name: "Home",
  data() {
    return {
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
      cardList: [
        {
          name: "社区平台",
          title: "数字社区，快捷平台",
          img: require("../assets/icon/social.png"),
        },
        {
          name: "移动支付",
          title: "安全支付，安心快捷",
          img: require("../assets/icon/pay.png"),
        },
        {
          name: "发票系统",
          title: "查票打印，全面服务",
          img: require("../assets/icon/trcket.png"),
        },
        {
          name: "催费缴费",
          title: "线上催收，一键服务",
          img: require("../assets/icon/payFee.png"),
        },
        {
          name: "微信推送",
          title: "及时推送，方便安全",
          img: require("../assets/icon/wxPush.png"),
        },
        {
          name: "停车服务",
          title: "停车接入，更人性化",
          img: require("../assets/icon/parking.png"),
        },
      ],
      tips: [
        { name: "phone", img: require("../assets/icon/phone.png") },
        { name: "wx", img: require("../assets/icon/wx.png") },
      ],
      hiddenProduce: false,
      fixedHeader: false,
      fixedShadow: false,
      wxIcon: false,
      phoneIcon: false,
      isToken: true,
    };
  },
  components: {
    CommonFooter,
  },
  created() {
    this.listenerFunction();
    if (this.$store.state.user.token !== undefined) {
      this.isToken = false;
    }
  },
  mounted() {},
  beforeDestroy() {
    document.removeEventListener("scroll", this.listenerFunction);
  },
  methods: {
    goToUrl(item) {
      this.$router.push({
        path: "/about",
        query: {
          produce: item.name,
        },
      });
    },
    toMore(item) {
      this.$router.push({
        path: "/about",
        query: {
          produce: item,
        },
      });
    },
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
    listenerFunction() {
      document.addEventListener("scroll", this.handleScroll, true);
    },
    goMenus(item) {
      if (item === "客户") {
        this.$router.push(`/customer`)
      } else if(item === "关于我们") {
        this.$router.push(`/mine`)
      }
    },
    handleScroll() {
      if (window.pageYOffset > 1 && window.pageYOffset < 650) {
        this.fixedHeader = true;
        this.fixedShadow = false;
      } else if (window.pageYOffset > 650) {
        this.fixedHeader = true;
        this.fixedShadow = true;
      } else if (window.pageYOffset < 1) {
        this.fixedHeader = false;
        this.fixedShadow = false;
      }
    },
    iconEnter(name) {
      if (name === "phone") {
        this.phoneIcon = true;
        this.wxIcon = false;
      } else if (name === "wx") {
        this.phoneIcon = false;
        this.wxIcon = true;
      } else {
        this.phoneIcon = false;
        this.wxIcon = false;
      }
    },
    iconLeave() {
      this.phoneIcon = false;
      this.wxIcon = false;
    },
    toLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    // 退出登录
    logout() {
      this.$confirm("退出当前账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("user/logout").then(() => {
            this.isToken = true;
            this.$message({
              type: "success",
              message: "退出成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.home {
  width: 100%;
  height: 780px;
  background: url(../assets/okbangfill.jpg) repeat-y;
  background-size: 100% 850px;
  .avatar-container {
    margin-right: 30px;
    .avatar-wrapper {
      margin-top: 5px;
      position: relative;
      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .header {
    width: 60%;
    padding: 10px 20% 0;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0px;

    .left {
      display: flex;
      flex-direction: row;
      // .title {
      //   font-size: 30px;
      //   font-weight: 700;
      //   color: #fff;
      // }
      .logo {
        width: 240px;
      }
    }

    .menuList {
      display: flex;
      flex-direction: row;
      list-style-type: none;
      .menu {
        font-size: 16px;
        font-weight: 500;
        color: #eaeaea;
        padding: 40px;
        cursor: pointer;
        &:hover {
          color: #ffffff;
        }
      }
      .activeMenu {
        position: relative;
      }
    }
  }

  .middle {
    margin-top: 80px;
    padding: 60px 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .middle-title {
      font-size: 50px;
      line-height: 80px;
      color: #ffffff;
    }
    .middle-content {
      font-size: 16px;
      line-height: 40px;
      color: #ffffff;
    }
    .middle-img {
      width: 540px;
      height: 400px;
    }
    .middle-center {
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .middle-produce {
      height: 60px;
      display: flex;
      align-items: center;
      margin-right: 10px;
      .middle-icon {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
      .middle-name {
        font-size: 12px;
        color: #ffffff;
      }
    }
  }

  .fixedHeader {
    background: #ffffff;
    z-index: 2021;

    .left {
      display: flex;
      flex-direction: row;
      .title {
        color: #3099dd;
      }
    }

    .menuList {
      display: flex;
      flex-direction: row;
      list-style-type: none;
      .menu {
        color: #666666;
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
  width: 1206px;
  margin: 40px auto 200px auto;
  .cardList {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .card {
      width: 280px;
      height: 389px;
      margin: 50px 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #eaeaea;
      border-radius: 10px;
      box-shadow: 0px 9px 35px rgba($color: #000000, $alpha: 0.1);
      .cardIcon {
        width: 60px;
        height: 60px;
        margin: 70px 0 30px 0;
      }
      &:hover {
        border: 1px solid #3099dd;
        box-shadow: none;
        transition: box-shadow 0.3s, border 0.3s, background-color 0.3s,
          color 0.3s, transform 0.3s;
      }
      .more {
        background: #ffffff;
        border-radius: 0;
        padding: 8px 20px;
        position: relative;
        cursor: pointer;
        margin-top: 30px;
        .innerMore {
          color: #ee741e;
          font-size: 14px;
        }
        &:before {
          transition: all 0.8s cubic-bezier(0.7, -0.5, 0.2, 2);
          content: "";
          width: 100%;
          height: 1px;
          background: #ee741e;
          position: absolute;
          bottom: 0;
          left: 0;
          .otherMore {
            color: #ffffff;
            font-size: 14px;
            z-index: 99999;
          }
        }

        &:hover:before {
          background: #3099dd;
          opacity: 0.6;
          width: 100%;
          height: 100%;
          .otherMore {
            color: #ffffff;
            font-size: 14px;
            z-index: 99999 !important;
          }
        }
      }
      .name {
        color: #000;
        padding-bottom: 5px;
        border-bottom: 2px solid #ee741e;
        margin-bottom: 0px;
      }
      .title {
        font-size: 14px;
        color: #000;
        line-height: 40px;
      }
    }
  }
}

.footer {
  width: 100%;
  height: 230px;
  border-top: 1px solid #666;
}

.tips {
  position: fixed;
  right: 0px;
  top: 500px;
  .position {
    position: relative;
    .tip {
      width: 50px;
      height: 50px;
      margin: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1890ff;
      cursor: pointer;
      .tipIcon {
        width: 30px;
        height: 30px;
      }
    }

    .phoneIcon {
      width: 200px;
      height: 50px;
      background: #1890ff;
      position: absolute;
      top: 0px;
      right: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #ffffff;
    }

    .wxIcon {
      width: 200px;
      height: 250px;
      background: url(../assets/okbang_qq.jpg) no-repeat;
      background-size: 100%;
      position: absolute;
      top: 60px;
      right: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
</style>
