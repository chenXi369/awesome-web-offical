<template>
  <article class="user-article">
    <template v-if="isToken">
      <header class="user-header">
        <common-header></common-header>
      </header>

      <main class="user-main flex">
        <section class="main-left flex flex-column flex-middle">
          <img src="@/assets/images/profile.jpg" class="avatar" />
          <ul class="left-ul">
            <li class="left-li flex flex-between flex-middle">
              <span>姓名：</span><span>×××</span>
            </li>
            <li class="left-li flex flex-between flex-middle">
              <span>手机：</span><span>{{ userInfo.phone }}</span>
            </li>
            <li class="left-li flex flex-between flex-middle">
              <span>邮箱：</span><span>{{ userInfo.email }}</span>
            </li>
            <li class="left-li flex flex-between flex-middle"><span></span><span></span></li>
            <li class="left-li flex flex-between flex-middle"><span></span><span></span></li>
          </ul>
        </section>

        <section>
          <ul class="list-view flex flex-row">
            <li class="view-left flex flex-column">
              <el-button class="list-item" @click="updatePhone"
                >修改手机号</el-button
              >
              <el-button class="list-item list-left" @click="updatePwd"
                >修改密码</el-button
              >
            </li>
            <li>
              <el-button class="register-server" @click="toRegSJ"
                >商家入驻</el-button
              >
            </li>
            <li class="view-right flex flex-column">
              <el-button class="list-item" @click="bindEmail"
                >绑定邮箱</el-button
              >
              <el-button class="list-item list-right" @click="updateEmail"
                >修改邮箱</el-button
              >
            </li>
          </ul>
        </section>
      </main>

      <footer></footer>

      <section>
        <!-- 修改手机号 -->
        <update-phone
          :updatePhoneDialog="updatePhoneDialog"
          @toBindEmail="toBindEmail"
          @closeUpdatePhone="closeUpdatePhone"
          @successUpdatePhone="successUpdatePhone"
        ></update-phone>
        <!-- 绑定邮箱 -->
        <bind-email
          :bindEmailDialog="bindEmailDialog"
          @closeBindEmail="closeBindEmail"
          @successBindEmail="successBindEmail"
        ></bind-email>
        <!-- 修改邮箱 -->
        <update-email
          :updateEmailDialog="updateEmailDialog"
          @closeUpdateEmail="closeUpdateEmail"
          @successUpdatepwd="successUpdatepwd"
        ></update-email>
        <!-- 密码找回 -->
        <update-pwd
          :updatePwdDialog="updatePwdDialog"
          @hiddenDialog="hiddenDialog"
          @successUpdatePwd="successUpdatePwd"
        ></update-pwd>
      </section>
    </template>

    <template v-else> </template>
  </article>
</template>

<script>
import CommonHeader from "../login/components/commonHeader.vue";
import UpdatePhone from "./components/updatePhone.vue";
import BindEmail from "./components/bindEmail.vue";
import UpdateEmail from "./components/updateEmail.vue";
import UpdatePwd from "./components/updatePwd.vue";
import Cookies from "js-cookie";

import { getInfo } from "@/api/user";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    return {
      updatePhoneDialog: false,
      updatePwdDialog: false,
      updateEmailDialog: false,
      bindEmailDialog: false,
      isToken: true,
      userInfo: {
        phone: "",
        email: "",
      },
    };
  },
  components: {
    CommonHeader,
    UpdatePhone,
    BindEmail,
    UpdateEmail,
    UpdatePwd,
  },
  created() {
    if (this.$store.state.user.token === undefined) {
      this.isToken = false;
      this.$alert("您还没有登录，点击前往登录页", "提示", {
        confirmButtonText: "确定",
        callback: () => {
          this.$router.push({
            path: "/login",
          });
        },
      });
    }
    this.getUserInfo();
  },
  methods: {
    // 跳转注册服务
    toRegSJ() {
      this.$router.push({
        path: "/recruitment",
      });
    },
    // 修改手机号
    updatePhone() {
      this.updatePhoneDialog = true;
    },
    closeUpdatePhone(val) {
      this.updatePhoneDialog = val;
    },
    // 修改密码
    updatePwd() {
      this.updatePwdDialog = true;
    },
    hiddenDialog(val) {
      this.updatePwdDialog = val;
    },
    successUpdatePwd() {
      this.updatePwdDialog = false;
      removeToken();
      this.$store.commit("user/SET_TOKEN", undefined);
      this.$router.push({
        name: "Login",
      });
    },
    // 绑定邮箱
    bindEmail() {
      getInfo().then((res) => {
        if (res.data.email === "" || res.data.email === null) {
          this.bindEmailDialog = true;
        } else {
          this.$message.info("您已绑定邮箱，无需该操作！");
        }
      });
    },
    closeBindEmail(val) {
      this.bindEmailDialog = val;
    },
    // 修改邮箱
    updateEmail() {
      getInfo().then((res) => {
        if (res.data.email !== "" && res.data.email !== null) {
          this.updateEmailDialog = true;
        } else {
          this.$confirm("您还没绑定邮箱，请先去绑定邮箱。", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.bindEmailDialog = true;
            })
            .catch(() => {
              this.updateEmailDialog = false;
            });
        }
      });
    },
    closeUpdateEmail(val) {
      this.updateEmailDialog = val;
    },
    successUpdatepwd() {
      this.updateEmailDialog = false;
    },
    // 手机号的绑定邮箱
    toBindEmail() {
      this.updatePhoneDialog = false;
      this.bindEmailDialog = true;
    },
    getUserInfo() {
      getInfo().then((res) => {
        Cookies.set("emailNum", res.data.email);
        Cookies.set("phoneNum", res.data.telephone);
        this.userInfo.email = res.data.email;
        this.userInfo.phone = res.data.telephone;
      });
    },
    successBindEmail() {
      this.bindEmailDialog = false;
      this.getUserInfo();
    },
    // 成功修改手机号
    successUpdatePhone() {

    }
  },
};
</script>

<style lang="scss" scoped>
.user-article {
  width: 100%;
  min-width: 1440px;
  .user-header {
    width: 100%;
    height: 110px;
    background: #1890ff;
    z-index: 2021;
  }
  .user-main {
    margin-top: 160px;
    justify-content: center;
    .main-left {
      width: 260px;
      height: 350px;
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      padding: 32px;
      .avatar {
        width: 80px;
        height: 80px;
        padding-bottom: 20px;
        border-radius: 50%;
      }
      .left-ul {
        border-top: 1px solid #eaeaea;
        padding: 24px;
        .left-li {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .list-view {
      margin: 80px auto 0;
      .view-left {
        width: 240px;
        .list-left {
          margin-top: 10px;
          margin-left: 90px;
        }
      }
      .view-right {
        width: 240px;
        align-items: flex-end;
        .list-right {
          margin-top: 10px;
          margin-right: 90px;
        }
      }
      .register-server {
        width: 250px;
        height: 250px;
        color: #ffffff;
        font-size: 15px;
        border-radius: 50%;
        text-align: center;
        background: #1890ff;
        &:hover {
          background: rgba($color: #1890ff, $alpha: 0.7);
        }
      }
      .list-item {
        width: 120px;
        height: 120px;
        color: #ffffff;
        font-size: 15px;
        margin: 0 20px;
        border-radius: 50%;
        text-align: center;
        background: #1890ff;
        &:hover {
          background: rgba($color: #1890ff, $alpha: 0.7);
        }
      }
    }
  }
}
</style>