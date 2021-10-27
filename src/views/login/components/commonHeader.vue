<template>
  <header>
    <div
      class="header"
      :class="[
        fixedHeader ? 'fixedHeader' : '',
        fixedShadow ? 'fixedShadow' : '',
      ]"
    >
      <div class="left">
        <img
          src="@/assets/logo_bule.png"
          class="logo"
          alt=""
          v-if="fixedHeader"
        />
        <img src="@/assets/logo_white.png" class="logo" alt="" v-else />
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
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="updatePwd">
              <span style="display: block">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      fixedHeader: false,
      fixedShadow: false,
      hiddenProduce: false,
      urlList: ["首页", "产品", "客户", "关于我们"],
      produceList: [
        {
          name: "社区平台",
          img: require("@/assets/icon/social.png"),
        },
        {
          name: "移动支付",
          img: require("@/assets/icon/pay.png"),
        },
        {
          name: "发票系统",
          img: require("@/assets/icon/trcket.png"),
        },
        {
          name: "催费缴费",
          img: require("@/assets/icon/payFee.png"),
        },
        {
          name: "微信推送",
          img: require("@/assets/icon/wxPush.png"),
        },
        {
          name: "停车服务",
          img: require("@/assets/icon/parking.png"),
        },
      ],
      isToken: true,
    };
  },
  created() {
    if (this.$store.state.user.token !== undefined) {
      this.isToken = false;
    }
  },
  methods: {
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
            this.$router.push({
              path: "/",
            });
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
    // 修改密码的弹窗
    updatePwd() {
      this.$emit("openUpdatePwd")
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
    goMenus(title) {
      if(title === '首页') {
        this.$router.push(`/`)
      } else if(title === '客户') {
        this.$router.push(`/customer`)
      } else if(title === '关于我们') {
        this.$router.push(`/mine`)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
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
.transition {
  width: 280px;
  border-radius: 10px;
  position: absolute;
  top: 100px;
  left: 0px;
  background: #fff;
  box-shadow: 0px 9px 24px rgba(0, 0, 0, 0.1);
  z-index: 2021 !important;
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
      z-index: 2021 !important;
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
            background: url(../../../assets/icon/activeRight.png) no-repeat;
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
          background: url(../../../assets/icon/right.png) no-repeat;
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
.el-dropdown-menu__item {
    list-style: none;
    line-height: 28px;
}
</style>