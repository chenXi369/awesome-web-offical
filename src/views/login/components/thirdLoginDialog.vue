<template>
  <el-dialog
    :title="bindTitle"
    :visible.sync="thirdLoginVisible"
    width="40%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      :rules="formRule"
      ref="form"
      label-width="80px"
      class="findPsd_form"
    >
      <template v-if="bindState === 1">
        <el-form-item prop="account" label="手机号">
          <el-input
            v-model.trim="form.account"
            placeholder="请输入正确的手机号"
            maxlength="20"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="code" prop="code" label="验证码">
          <el-input
            v-model="form.code"
            placeholder="请输入短信验证码"
            maxlength="8"
          ></el-input>
          <el-button class="codeButton" v-show="showTime" :disabled="loading"
            >{{ totalTime }}S
          </el-button>
          <el-button
            class="checkedCode codeButton"
            v-show="!showTime"
            @click="getCode"
            :loading="loading"
            >获取验证码
          </el-button>
        </el-form-item>
      </template>
      <template v-else>
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
        <el-form-item prop="againUserPwd" label="确认密码">
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
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" style="width: 100px">取 消</el-button>

      <template>
        <el-button
          type="primary"
          @click="confirm"
          style="width: 100px; margin-left: 20px"
          v-if="bindState === 2"
          >确 定</el-button
        >
        <el-button
          type="primary"
          @click="nextStep"
          style="width: 100px; margin-left: 20px"
          v-else
          >下一步</el-button
        >
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { getCode, checkCode } from "@/api/login";
export default {
  props: {
    thirdLoginVisible: {
      type: Boolean,
      default: false,
    },
    openId: {
      type: String,
      default: "",
    },
  },
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
      form: {
        account: "",
        code: "",
        userPwd: "",
        againUserPwd: "",
      },
      tip_flag: false,
      pwdflag: false,
      formRule: {
        account: [
          { required: true, trigger: "blur", validator: validatePhone },
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }],
        userPwd: [{ required: true, trigger: "blur", validator: validatePwd }],
        againUserPwd: [
          { required: true, message: "请再次输入你的密码", trigger: "blur" },
        ],
      },
      showTime: false,
      totalTime: 60,
      loading: false,
      bindState: 1,
      bindTitle: "绑定手机",
    };
  },
  methods: {
    getCode() {
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
    nextStep() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let checkData = {
              verifyCode: this.form.code,
              type: 0,
              telephone: this.form.account,
            };
            checkCode(checkData).then(() => {
              let data = {
                telephone: this.form.account,
                openid: this.openId,
              };
              this.$store.dispatch("user/checkOpenid", data).then((res) => {
                console.log(res);
                if (res.code === 200) {
                  this.$router.push({
                    path: "/user",
                  });
                } else if(res.code === 201) {
                  this.bindState = 2;
                  this.bindTitle = "设置密码"
                }
                this.loading = false;
              });
            });
        }
      });
    },
    handleClose() {
      this.$refs["form"].resetFields();
      this.$emit("closeThirdLogin");
    },
    cancel() {
      this.$refs["form"].resetFields();
      this.$emit("closeThirdLogin");
    },
    confirm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userPwd === this.form.againUserPwd) {
            let data = {
              telephone: this.form.account,
              checked: 1,
              openid: this.openId,
              password: this.$md5(this.form.userPwd).toUpperCase()
            }
            this.$store.dispatch("user/register", data).then((res) => {
                if (res.code === 200) {
                  this.$router.push({
                    path: "/user",
                  });
                }
                this.loading = false;
              });
          } else {
            this.form = {
              userPwd: "",
              againUserPwd: "",
            };
            this.$message.warning("两次输入的密码不一致，请重新设置");
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.article {
  min-width: 440px;
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
  .code {
    height: 40px;
    .codeButton {
      width: 33%;
      height: 38px;
      margin-left: 10px;
    }
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
}
.login-container .el-form-item {
  background: none;
}
.el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #ffffff;
  border-radius: 5px;
  color: #454545;
  margin-bottom: 0px;
  margin-top: 24px;
}
.dialog-footer {
  text-align: center;
  .login_btn {
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
}
</style>