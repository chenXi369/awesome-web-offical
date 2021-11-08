<template>
  <article class="register">
    <header class="register-header">
      <common-header></common-header>
    </header>

    <main class="register-main">
      <section class="main-step">
        <el-steps :active="actived" align-center>
          <el-step title="注册须知" icon="el-icon-edit"></el-step>
          <el-step title="注册信息" icon="el-icon-edit"></el-step>
          <el-step title="注册完成" icon="el-icon-upload"></el-step>
        </el-steps>
      </section>

      <section class="main-form">
        <template v-if="actived === 1">
          <section class="register__box" :style="contentStyleObj"></section>
        </template>
        <el-form
          :model="form"
          :rules="formRule"
          ref="form"
          label-width="80px"
          class="findPsd_form"
        >
          <template v-if="actived === 2">
            <el-form-item prop="account" label="手机号">
              <el-input
                v-model.trim="form.account"
                placeholder="请输入手机号"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item class="code" prop="verifyCode" label="验证码">
              <el-input
                v-model="form.verifyCode"
                placeholder="请输入短信验证码"
                maxlength="8"
              ></el-input>
              <el-button class="codeButton" v-show="showTime"
                >{{ totalTime }}S
              </el-button>
              <el-button
                class="codeButton"
                v-show="!showTime"
                @click="getVerifyCode"
                :loading="loading"
                :disabled="loading"
                >获取验证码
              </el-button>
            </el-form-item>
            <el-form-item prop="userPwd" label="密码">
              <el-tooltip
                class="tool_tip"
                effect="light"
                placement="right"
                :manual="true"
                v-model="tip_flag"
              >
                <div slot="content">
                  <p style="color: '#9CACCA'">
                    <i v-if="pwdflag" class="el-icon-circle-check success"></i>
                    <i v-else class="el-icon-circle-close fail"></i>
                    6-20位，且只能包含字母、数字、标点符号
                  </p>
                </div>
                <div>
                  <el-input
                    @click="disabeld = !disabeld"
                    type="password"
                    v-model="form.userPwd"
                    placeholder="设置您的登录密码"
                    maxlength="20"
                    @copy.native.capture.prevent="handlePwdInput"
                    @paste.native.capture.prevent="handlePwdInput"
                  >
                  </el-input>
                </div>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="userPwd" label="确认密码">
              <el-tooltip
                class="tool_tip"
                effect="light"
                placement="right"
                :manual="true"
                v-model="tip_flag"
              >
                <div slot="content">
                  <p style="color: '#9CACCA'">
                    <i v-if="pwdflag" class="el-icon-circle-check success"></i>
                    <i v-else class="el-icon-circle-close fail"></i>
                    6-20位，且只能包含字母、数字、标点符号
                  </p>
                </div>
                <div>
                  <el-input
                    @click="disabeld = !disabeld"
                    type="password"
                    v-model="form.againUserPwd"
                    placeholder="请再次输入您的密码"
                    maxlength="20"
                    @copy.native.capture.prevent="handlePwdInput"
                    @paste.native.capture.prevent="handlePwdInput"
                  >
                  </el-input>
                </div>
              </el-tooltip>
            </el-form-item>

            <!-- 图形验证 -->
            <el-form-item class="code" prop="code" label="数字验证">
              <section class="flex flex-row">
                <el-input
                  v-model="form.code"
                  placeholder="请输入图形验证码"
                ></el-input>

                <img :src="codeImgUrl" class="codeButton" />
              </section>
            </el-form-item>
          </template>

          <template v-else-if="actived === 3">
            <p class="successReg">注册成功！</p>
            <section style="border: 1px solid #eaeaea; border-raduis: 5px">
              <p>是否要去完善商户信息。</p>
              <div class="btn__box flex flex-between">
                <el-button @click="backLogin" class="active__btn"
                  >返回首页</el-button
                >
                <el-button
                  type="primary"
                  @click="confirmToCustomer"
                  class="confirm"
                  >确 认</el-button
                >
              </div>
            </section>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="actived === 1">
          <el-button
            type="primary"
            @click="nextStep(1)"
            class="login_btn"
            :loading="loading"
            >下一步</el-button
          >
        </div>
        <div slot="footer" class="dialog-footer" v-else-if="actived === 2">
          <el-button
            type="primary"
            @click="nextStep(2)"
            class="login_btn"
            :loading="loading"
            >下一步</el-button
          >
        </div>
      </section>
    </main>
  </article>
</template>

<script>
import Cookies from 'js-cookie'
import { getDetailInfo } from "@/api/user";
import { getCode, getCodeImg } from "@/api/login";

import CommonHeader from "./components/commonHeader.vue";
export default {
  data() {
    const validatePwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入6~20位的字母与数字组合！"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入手机号"));
      } else if (/^1[34578]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    return {
      // 激活状态
      actived: 1,
      loading: false,
      form: {
        account: "",
        code: "",
        uuid: "",
        userPwd: "",
        verifyCode: "",
        againUserPwd: "",
      },
      tip_flag: false,
      pwdflag: false,
      showTime: false,
      totalTime: 60, // 倒计时冷却时间
      formRule: {
        account: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhone,
          },
        ],
        verifyCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入图形验证码", trigger: "blur" },
        ],
        userPwd: [{ required: true, trigger: "blur", validator: validatePwd }],
        notarizeUserPwd: [
          { required: true, message: "请再次输入你的密码", trigger: "blur" },
        ],
      },
      codeImgUrl: "",
      contentStyleObj: {
        height: "",
      },
    };
  },
  components: {
    CommonHeader,
  },
  created() {
    this.getCodeImg();
    this.getHeight();
    window.addEventListener("resize", this.getHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 450 + "px";
      console.log(this.contentStyleObj.height);
    },
    // 获取图形验证码
    getCodeImg() {
      getCodeImg().then((res) => {
        this.codeImgUrl = "data:image/gif;base64," + res.img;
        this.form.uuid = res.uuid;
      });
    },
    // 下一步
    nextStep(item) {
      if (item === 1) {
        this.actived = 2;
      } else if (item === 2) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.againUserPwd === this.form.userPwd) {
              let data = {
                telephone: this.form.account,
                password: this.$md5(this.form.userPwd).toUpperCase(),
                verifyCode: this.form.verifyCode,
                code: this.form.code,
                uuid: this.form.uuid,
              };
              this.$store
                .dispatch("user/register", data)
                .then(() => {
                  this.$message.success("账号注册成功！");
                  this.actived = 3;
                  this.$refs.form.resetFields();
                  this.loading = false;
                  // 获取用户信息
                  this.getUserInfo()
                })
                .catch(() => {
                  this.getCodeImg();
                  this.loading = false;
                });
            } else {
              this.$message.warning("您两次输入的密码不一致，请重新输入");
            }
          }
        });
      }
    },
    getUserInfo() {
      getDetailInfo().then((res) => {
        console.log(res.data)
        Cookies.set("emailNum", res.data.email);
        Cookies.set("phoneNum", res.data.telephone);
      });
    },
    fromStep() {
      this.actived = 1;
    },
    // 确认
    confirm() {
      // this.$emit("closeDialog", false);
    },
    // 取消
    cancel() {
      this.$emit("hiddenDialog", false);
      this.$refs.form.resetFields();
    },
    handleClose() {
      this.$emit("hiddenDialog", false);
    },
    // 获取验证码
    getVerifyCode() {
      if (this.form.account === "") {
        this.$message.warning("请输入手机号！");
        return;
      } else if (!/^1[34578]\d{9}$/.test(this.form.account)) {
        this.$message.warning("请输入正确的手机号！");
        return;
      }
      this.loading = true;
      let params = {
        type: 0,
        telephone: this.form.account,
      };
      getCode(params).then(() => {
        this.showTime = true;
        this.$message.success("验证码已发送!");
        const timer = setInterval(() => {
          // 某些定时器操作
          if (this.totalTime > 0) {
            this.totalTime--;
          } else {
            this.showTime = false;
            this.totalTime = 60;
            clearInterval(timer);
            return;
          }
        }, 1000);
        this.loading = false;
      });
    },
    handlePwdInput() {
      return false;
    },
    // 返回首页
    backLogin() {
      this.$router.push({
        path: "/",
      });
    },
    confirmToCustomer() {
      this.$router.push({
        path: "/recruitment",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.register {
  width: 100%;
  min-width: 1440px;
  .register-header {
    width: 100%;
    height: 110px;
    background: #1890ff;
    z-index: 2021;
  }
  .register-main {
    margin: 40px 20%;
    padding: 30px 0px;
    z-index: 100;
    border: 1px solid #eaeaea;
    .main-step {
      padding-bottom: 30px;
      border-bottom: 1px solid #eaeaea;
    }
    .main-form {
      padding-top: 30px;
      .register__box {
        width: 94%;
        margin: 0 3%;
        border: 1px solid #eaeaea;
        overflow-y: auto;
      }
    }
  }
}
.findPsd_form {
  width: 440px;
  margin: auto;
  text-align: center;
  .tooltip {
    position: absolute;
    top: 2px;
    left: 100%;
    width: 265px;
    height: 14px;
    font-size: 14px;
    color: rgba(156, 172, 201, 0.8);
    line-height: 36px;
  }
  .el-input__inner {
    height: 50px;
    opacity: 0.7;
    border-radius: 2px;
  }
  .code .el-button {
    background: transparent;
    width: 33%;
    font-size: 8px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #5475a9;
    border: 1px solid #9cacc9;
    border-radius: 2px;
    // margin-left: 10px;
  }
  .code .el-input {
    color: #242424;
    width: 64%;
  }
  .el-form-item__error {
    color: #ff4949;
    // font-size: 18px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 90px;
    font-family: "SourceHanSansSC";
  }
  .code {
    height: 40px;
    .codeButton {
      width: 33%;
      height: 38px;
      margin-left: 10px;
    }
  }
}
.login-container .el-form-item {
  background: none;
}
.dialog-footer .login_btn {
  margin-top: 10px;
  width: 200px;
  background: linear-gradient(90deg, #7ac2ff, #00dbff);
  border-radius: 4px;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.5;
  }
}

.successReg {
  font-size: 20px;
  font-weight: 600;
}

.btn__box {
  margin: 40px 20px 20px;
  padding: 0 30px;
  .confirm {
    width: 150px;
  }
  .active__btn {
    width: 150px;
  }
}
</style>

