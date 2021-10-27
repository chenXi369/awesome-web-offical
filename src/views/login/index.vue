<template>
  <div>
    <article class="login" :style="{ height: windowHeight }">
      <header class="header">
        <h1 style="color: #fff; font-size: 28px">好邻邦物业管理服务平台</h1>
      </header>

      <main class="main">
        <section class="select-title flex-between">
          <div
            class="login-title"
            :class="{ active: loginState === 0 }"
            @click="loginNoPwd"
          >
            免密登录
          </div>
          <div
            class="login-title"
            :class="{ active: loginState === 1 }"
            @click="loginPwd"
          >
            密码登录
          </div>
        </section>
        <template v-if="loginState === 0">
          <el-form
            ref="phoneForm"
            key="phoneForm"
            :model="phoneForm"
            :rules="phoneRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="loginNum">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="loginNum"
                v-model="phoneForm.loginNum"
                placeholder="请输入手机号"
                name="loginNum"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
              <div class="getCode">
                <el-button
                  type="primary"
                  @click="getCode"
                  v-if="!showSecond"
                  class="btn"
                  :disabled="loading"
                  :loading="loading"
                  >获取验证码</el-button
                >
                <el-button
                  type="primary"
                  :disabled="showSecond"
                  v-else
                  class="btn"
                  >{{ getSecond }}S</el-button
                >
              </div>
            </el-form-item>

            <!-- 验证码 -->
            <el-form-item prop="verifyCode">
              <span class="svg-container">
                <svg-icon icon-class="code" />
              </span>
              <el-input
                ref="verifyCode"
                v-model="phoneForm.verifyCode"
                placeholder="请输入验证码"
                name="verifyCode"
                type="text"
                tabindex="3"
                autocomplete="on"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>

            <!-- 图形验证码 -->
            <section class="flex flex-between">
              <el-form-item prop="code" style="width: 70%">
                <span class="svg-container1" style="width: 12%">
                  <svg-icon icon-class="code" />
                </span>
                <el-input
                  style="width: 82%"
                  ref="codeImg"
                  v-model="phoneForm.code"
                  placeholder="请输入验证码"
                  name="code"
                  type="text"
                  tabindex="3"
                  autocomplete="on"
                  @keyup.enter.native="handleLogin"
                />
              </el-form-item>
              <div class="code-input" @click="getImgCode">
                <img :src="codeUrl" class="login-code-img" />
              </div>
            </section>

            <div class="register-box">
              <el-checkbox
                class="remember-pwd"
                @click="rememberPwd"
                v-model="phoneForm.rememberMe"
                v-if="loginState === 1"
                >记住密码</el-checkbox
              >

              <span
                class="blue-text float-right"
                @click="forgetPwd"
                v-if="loginState === 1"
                >忘记密码</span
              >
            </div>
            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; margin-bottom: 30px; height: 36px"
              @click.native.prevent="handleLogin"
              >登 录</el-button
            >
          </el-form>
        </template>
        <template v-else>
          <el-form
            ref="pwdForm"
            key="pwdForm"
            :model="pwdForm"
            :rules="pwdRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="loginName">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="loginName"
                v-model="pwdForm.loginName"
                placeholder="请输入手机号/邮箱"
                name="loginName"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-tooltip
              v-model="capsTooltip"
              content="Caps lock is On"
              placement="right"
              manual
            >
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="pwdForm.password"
                  :type="passwordType"
                  placeholder="请输入密码"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" v-longpress="incrementPlusTen">
                  <svg-icon
                    :icon-class="
                      passwordType === 'password' ? 'eye' : 'eye-open'
                    "
                  />
                </span>
              </el-form-item>
            </el-tooltip>

            <!-- 图形验证码 -->
            <section class="flex flex-between">
              <el-form-item prop="code" style="width: 70%">
                <span class="svg-container1" style="width: 12%">
                  <svg-icon icon-class="code" />
                </span>
                <el-input
                  style="width: 82%"
                  ref="code"
                  v-model="pwdForm.code"
                  placeholder="请输入验证码"
                  name="code"
                  type="text"
                  tabindex="3"
                  autocomplete="on"
                  @keyup.enter.native="handleLogin"
                />
              </el-form-item>
              <div class="code-input" @click="getImgCode">
                <img :src="codeUrl" class="login-code-img" />
              </div>
            </section>

            <div class="register-box">
              <el-checkbox
                class="remember-pwd"
                @click="rememberPwd"
                label="记住密码"
                v-model="pwdForm.rememberMe"
              ></el-checkbox>

              <span class="blue-text float-right" @click="forgetPwd"
                >忘记密码</span
              >
            </div>
            <section>
              <el-button
                :loading="loading"
                type="primary"
                style="width: 100%; height: 36px"
                @click.native.prevent="handleLogin"
                >{{ !loading ? "登 录" : "登 录 中" }}</el-button
              >
            </section>
          </el-form>
        </template>
        <div @click="toRegister" class="register" v-if="loginState === 1">
          暂无账号，点我立即注册
        </div>
      </main>

      <footer class="footer">
        <section class="footer-view">
          <div class="label-view" @click="openWxDialog">
            <img src="@/assets/icon/weixin.png" class="view-icon" />
            <span class="view-title">微信登录</span>
          </div>
          <div class="label-view" @click="openQQDialog">
            <img src="@/assets/icon/QQ.png" class="view-icon" />
            <span class="view-title">QQ登录</span>
          </div>
        </section>
      </footer>

      <section>
        <forget-dialog
          :forgetDialog="forgetDialog"
          @hiddenDialog="hiddenDialog"
          @successFindPwd="successFindPwd"
        ></forget-dialog>
      </section>

      <section>
        <noPwd-reg
          :phoneForm="phoneForm"
          :noPwdRegVisible="noPwdRegVisible"
          @closeNoPwdReg="closeNoPwdReg"
        ></noPwd-reg>
      </section>

      <third-login-dialog
        :thirdLoginVisible="thirdLoginVisible"
      ></third-login-dialog>
    </article>
  </div>
</template>

<script>
import ForgetDialog from "./components/forgetPwd.vue";
import NoPwdReg from "./components/noPwdReg.vue";
import ThirdLoginDialog from "./components/thirdLoginDialog"
import Cookies from "js-cookie";
import { getCode, getCodeImg, getWxToken } from "@/api/login";

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    const validateUserName = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入手机号/邮箱"));
      } else if (
        /^1[34578]\d{9}$/.test(value) ||
        /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(value)
      ) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号/邮箱"));
      }
    };
    const validateUserPhone = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入手机号"));
      } else if (/^1[34578]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    return {
      windowHeight: "",
      loginState: 1,
      phoneForm: {
        loginNum: "",
        code: "",
        verifyCode: "",
        uuid: "",
      },
      pwdForm: {
        loginName: "",
        password: "",
        code: "",
        uuid: "",
        rememberMe: true,
      },
      phoneRules: {
        loginNum: [
          { required: true, trigger: "blur", validator: validateUserPhone },
        ],
        verifyCode: [
          { required: true, trigger: "blur", validator: validateCode },
        ],
        code: [
          { required: true, trigger: "blur", message: "请输入图片验证码！" },
        ],
      },
      pwdRules: {
        loginName: [
          { required: true, trigger: "blur", validator: validateUserName },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码！" }],
      },
      passwordType: "password",
      capsTooltip: false,
      codeUrl: "",
      loading: false,
      getSecond: 30,
      showSecond: false,
      forgetDialog: false,
      noPwdRegVisible: false,
      wxLoginState: 0,
      thirdLoginVisible: false
    };
  },
  components: {
    NoPwdReg,
    ForgetDialog,
    ThirdLoginDialog
  },
  created() {
    this.windowHeight = window.innerHeight + "px";
    this.getCookie();
    this.getCodeImg();
    if(this.$route.query.code !== undefined) {
      this.getOpenId(this.$route.query.code) 
    }
  },
  methods: {
    getImgCode() {
      this.getCodeImg();
    },
    successFindPwd() {
      this.forgetDialog = false;
      this.pwdForm.password = "";
      this.pwdForm.rememberMe = false;
    },
    getOpenId(code) {
      getWxToken({code: code}).then((res) => {
        let data = {
          openid: { ...res.data }.openid
        }
        this.$store.dispatch("user/wxLogin", data).then((res) => {
          if(res.code === 201) {
            this.wxLoginState = 1;
            this.$router.replace("/login")
            this.thirdLoginVisible = true
          }
        })
      })
    },
    // 获取loginForm的状态和数据  Cookie中有数据就替换没有就延续原来的
    getCookie() {
      const loginName = Cookies.get("loginName");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.pwdForm = {
        loginName: loginName === undefined ? this.pwdForm.loginName : loginName,
        password: password === undefined ? this.pwdForm.password : password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    loginNoPwd() {
      this.loginState = 0;
      this.$nextTick(() => {
        this.$refs["phoneForm"].resetFields();
      });
    },
    loginPwd() {
      this.loginState = 1;
      this.$nextTick(() => {
        this.$refs["pwdForm"].resetFields();
      });
    },
    // 获取验证的图片和uuid
    getCodeImg() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.pwdForm.uuid = res.uuid;
        this.phoneForm.uuid = res.uuid;
      });
    },
    // 记住密码
    rememberPwd() {
      this.pwdForm.rememberMe = !this.pwdForm.rememberMe;
    },
    // 忘记密码
    forgetPwd() {
      this.forgetDialog = true;
    },
    // 鼠标左键长按事件
    incrementPlusTen() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      // 登录  判断登录模式
      if (this.loginState === 0) {
        // 免密登录
        this.$refs.phoneForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let data = {
              verifyCode: this.phoneForm.verifyCode,
              code: this.phoneForm.code,
              uuid: this.phoneForm.uuid,
            };
            if (this.phoneForm.loginNum.indexOf("@") === -1) {
              data.telephone = this.phoneForm.loginNum;
              data.type = 0;
            } else {
              data.email = this.phoneForm.loginNum;
              data.type = 1;
            }
            this.$store
              .dispatch("user/noPwdLogin", data)
              .then((res) => {
                this.loading = false;
                if (res.code === 201) {
                  this.noPwdRegVisible = true;
                } else if (res.code === 200) {
                  console.log(111111);
                  this.$router.push({
                    path: "/user",
                  });
                }
              })
              .catch(() => {
                this.getCodeImg();
                this.loading = false;
              });
          }
        });
      } else {
        this.$refs.pwdForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            // cookie信息的处理  判断是否勾选记住密码
            if (this.pwdForm.rememberMe) {
              Cookies.set("loginName", this.pwdForm.loginName, { expires: 30 });
              Cookies.set("password", this.pwdForm.password, { expires: 30 });
              Cookies.set("rememberMe", this.pwdForm.rememberMe, {
                expires: 30,
              });
            } else {
              Cookies.remove("loginName");
              Cookies.remove("password");
              Cookies.remove("rememberMe");
            }
            let userInfo = {
              password: this.$md5(this.pwdForm.password).toUpperCase(),
              code: this.pwdForm.code,
              uuid: this.pwdForm.uuid,
            };
            if (this.pwdForm.loginName.indexOf("@") === -1) {
              userInfo.telephone = this.pwdForm.loginName;
            } else {
              userInfo.email = this.pwdForm.loginName;
            }
            this.$store
              .dispatch("user/login", userInfo)
              .then(() => {
                this.$router.push({
                  path: "/user",
                });
                this.loading = false;
              })
              .catch(() => {
                this.getCodeImg();
                this.loading = false;
              });
          }
        });
      }
    },
    // 微信第三方登录
    openWxDialog() {
      // 微信登录
      let newTime = Date.now();
      let stateVal = "haolong" + newTime;
      let href = `https://open.weixin.qq.com/connect/qrconnect?appid=wx4de421c9641e8e0c&redirect_uri=http%3A%2F%2F192.168.1.254%3A9520/login&response_type=code&scope=snsapi_login&state=${stateVal}#wechat_redirect`;
      window.location.href = href;
    },
    // qq第三方登录
    openQQDialog() {
      // QQ登录
    },
    hiddenDialog(val) {
      this.forgetDialog = val;
    },
    // 获取验证码
    getCode() {
      let value = this.phoneForm.loginNum;
      if (value !== "" && /^1[34578]\d{9}$/.test(value)) {
        let params = {
          type: null,
        };
        if (value.indexOf("@") === -1) {
          params.type = 0;
          params.telephone = value;
        } else {
          params.type = 1;
          params.email = value;
        }
        this.loading = true;

        getCode(params).then(() => {
          this.showSecond = true;
          this.$message.success("验证码已发送!");
          const timer = setInterval(() => {
            // 某些定时器操作
            if (this.getSecond > 0) {
              this.getSecond--;
            } else {
              this.showSecond = false;
              this.getSecond = 30;
              clearInterval(timer);
              return;
            }
          }, 1000);
          this.loading = false;
        });
      } else {
        this.$message.warning("请输入正确的手机号！");
        return;
      }
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    toRegister() {
      this.$router.push({
        path: "/register",
      });
    },
    closeNoPwdReg() {
      this.noPwdRegVisible = false;
      this.getCodeImg();
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
// 去掉滚动条的默认样式
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
/* reset element-ui css */
.login {
  height: 100%;
  min-height: 980px;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #000, #333, #659) left center/400% 400%;
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
  .login-form {
    .el-input {
      display: inline-block;
      height: 39px;
      width: 85%;

      input {
        background-color: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 8px 5px 8px 15px;
        color: $light_gray;
        height: 39px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login {
  position: relative;
  .header {
    margin-top: 150px;
  }
  .main {
    .select-title {
      width: 520px;
      min-width: 520px;
      margin: 80px auto 0px;
      color: #ffffff;
      .login-title {
        cursor: pointer;
      }
      .active {
        color: #1890ff;
        text-decoration: underline;
      }
    }
    .register {
      color: #1890ff;
      font-size: 14px;
      cursor: pointer;
      margin-top: 10px;
      &:hover {
        color: rgba($color: #1890ff, $alpha: 0.7);
      }
    }
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 40px 35px 0;
      margin: 0 auto;
      overflow: hidden;
      .register-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 22px 0px 8px;
        .remember-pwd {
          top: 1px;
          margin-right: 6px;
        }
        .blue-text {
          color: #409eff;
          cursor: pointer;
          font-size: 14px;
        }
        .float-right {
          float: right;
        }
      }
      .getCode {
        position: absolute;
        right: 1px;
        bottom: 2px;
        .btn {
          width: 112px;
        }
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 2px 5px 2px 0px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .svg-container1 {
      padding: 2px 0px 2px 3px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  }
  .footer {
    width: 360px;
    min-width: 360px;
    color: #ffffff;
    position: absolute;
    top: 750px;
    left: calc(50% - 180px);
    display: flex;
    flex-direction: column;
    .footer-view {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .label-view {
        display: flex;
        padding: 0px 20px;
        cursor: pointer;
        .view-title {
          margin-left: 6px;
        }
        .view-icon {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
.code-input {
  height: 42.5px;
  width: 27%;
  border-radius: 5px;
  margin-left: 3%;
  margin-top: 24px;
  .login-code-img {
    width: 100%;
    height: 100%;
  }
}
.el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
  margin-bottom: 0px;
  margin-top: 24px;
  position: relative;
}
</style>