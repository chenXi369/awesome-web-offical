<template>
  <el-dialog
    title="密码设置"
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
        <el-button
          class="codeButton"
          v-show="showTime"
          :disabled="form.getCodeBtnStatus"
          >{{ totalTime }}S
        </el-button>
        <el-button
          class="checkedCode codeButton"
          v-show="!showTime"
          @click="getCode"
          :loading="form.getCodeBtnStatus"
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    thirdLoginVisible: {
      type: Boolean,
      default: false,
    },
    phoneForm: {
      type: Object,
      default: () => {},
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
    return {
      form: {
        account: "",
        code: "",
        userPwd: "",
        againUserPwd: "",
        getCodeBtnStatus: ""
      },
      tip_flag: false,
      pwdflag: false,
      formRule: {
        userPwd: [{ required: true, trigger: "blur", validator: validatePwd }],
        againUserPwd: [
          { required: true, message: "请再次输入你的密码", trigger: "blur" },
        ],
      },
      showTime: false,
      totalTime: 60
    };
  },
  methods: {
    getCode() {},
    handleClose() {
      this.$refs["form"].resetFields();
      this.$emit("closeNoPwdReg");
    },
    cancel() {
      this.$refs["form"].resetFields();
      this.$emit("closeNoPwdReg");
    },
    confirm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userPwd === this.form.againUserPwd) {
            let data = {
              telephone: this.phoneForm.loginNum,
              password: this.$md5(this.form.userPwd).toUpperCase(),
              verifyCode: this.phoneForm.verifyCode,
              code: this.phoneForm.code,
              uuid: this.phoneForm.uuid,
              checked: 1,
            };
            this.$store
              .dispatch("user/register", data)
              .then(() => {
                this.$router.push({
                  path: "/user",
                });
                this.loading = false;
              })
              .catch(() => {
                this.$emit("closeNoPwdReg");
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