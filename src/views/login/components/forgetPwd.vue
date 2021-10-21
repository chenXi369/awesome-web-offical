<template>
  <div class="article">
    <el-dialog
      title="找回密码"
      width="600px"
      :visible.sync="forgetDialog"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <section>
        <el-steps :active="actived" align-center>
          <el-step title="密码找回" icon="el-icon-edit"></el-step>
          <el-step title="输入新密码" icon="el-icon-upload"></el-step>
        </el-steps>

        <template v-if="actived === 1">
          <el-form
            :model="form"
            :rules="formRule"
            ref="form"
            label-width="78px"
            class="findPsd_form"
          >
            <el-form-item class="codeType" prop="account" :label="codeTypeName">
              <el-input
                v-model.trim="form.account"
                placeholder="请输入正确的手机号/邮箱"
                maxlength="20"
              >
              </el-input>
              <span
                title="点我切换验证方式"
                class="iconPhone"
                @click="handleIconClick"
              >
                <i :class="iconPhone" slot="suffix"> </i>
              </span>
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
          </el-form>
        </template>

        <template v-if="actived === 2">
          <el-form
            :model="pwdForm"
            :rules="pwdFormRule"
            ref="pwdForm"
            label-width="78px"
            class="findPsd_form"
          >
            <el-form-item prop="userPwd" label="新密码">
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
                    v-model="pwdForm.userPwd"
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
                    v-model="pwdForm.againUserPwd"
                    placeholder="设置您的登录密码"
                    maxlength="20"
                    @copy.native.capture.prevent="handlePwdInput"
                    @paste.native.capture.prevent="handlePwdInput"
                  >
                  </el-input>
                </div>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </template>
      </section>
      <div slot="footer" class="dialog-footer" v-if="actived === 1">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="nextStep"
          class="login_btn"
          :loading="loading"
          >下一步</el-button
        >
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button
          type="primary"
          @click="confirm"
          class="login_btn"
          :loading="loading"
          >完 成</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCode, checkCode } from "@/api/login";
import { findPwd } from "@/api/register";
import Cookies from "js-cookie";

export default {
  props: {
    forgetDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validatePwd = (rule, value, callback) => {
      if (value.length < 6 && value.length > 20) {
        callback(new Error("请输入6~20位的字母与数字组合！"));
      } else {
        callback();
      }
    };
    return {
      // 激活状态
      actived: 1,
      loading: false,
      form: {
        account: "",
        code: "",
        getCodeBtnStatus: false,
      },
      pwdForm: {
        userPwd: "",
        againUserPwd: "",
      },
      tip_flag: false,
      pwdflag: false,
      showTime: false,
      totalTime: 30, // 倒计时冷却时间
      formRule: {
        account: [
          {
            required: true,
            message: "请输入手机号/邮箱",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
        ]
      },
      pwdFormRule: {
        userPwd: [{ required: true, trigger: "blur", validator: validatePwd }],
        againUserPwd: [
          { required: true, message: "请再次输入你的密码", trigger: "blur" },
        ]
      },  
      iconPhone: "el-icon-mobile-phone el-input__icon",
      codeTypeName: "手机号",
    };
  },
  created() {
    if (Cookies.get("phoneNum") !== "null") {
      this.form.account = Cookies.get("phoneNum");
    }
  },
  methods: {
    handleClose() {
      this.$emit("hiddenDialog", false);
    },
    // 获取验证码
    getCode() {
      let value = this.form.account;
      if (
        (value !== "" && /^1[34578]\d{9}$/.test(value)) ||
        /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(value)
      ) {
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
        this.form.getCodeBtnStatus = true;

        getCode(params).then(() => {
          this.showTime = true;
          this.$message.success("验证码已发送!");
          const timer = setInterval(() => {
            // 某些定时器操作
            if (this.totalTime > 0) {
              this.totalTime--;
            } else {
              this.showTime = false;
              clearInterval(timer);
              this.totalTime = 30;
              return;
            }
          }, 1000);
          this.form.getCodeBtnStatus = false;
        });
      } else {
        this.$message.warning("请输入正确的手机号！");
        return;
      }
    },
    // 下一步
    nextStep() {
      let data = {
        verifyCode: this.form.code,
      };
      if (this.form.account.indexOf("@") === -1) {
        data.type = 0;
        data.telephone = this.form.account;
      } else {
        data.type = 1;
        data.email = this.form.account;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          checkCode(data).then(() => {
            this.actived = 2;
          });
        }
      });
    },
    // 手机和邮箱的切换按钮
    handleIconClick() {
      if (this.iconPhone === "el-icon-mobile-phone el-input__icon") {
        if (Cookies.get("emailNum") !== "null") {
          this.form.account = Cookies.get("emailNum");
          this.codeTypeName = "邮箱";
          this.iconPhone = "el-icon-message el-input__icon";
        } else if (Cookies.get("phoneNum") !== "null") {
          this.codeTypeName = "手机号";
          this.form.account = Cookies.get("phoneNum");
          this.iconPhone = "el-icon-mobile-phone el-input__icon";
          this.$message.warning("您暂未绑定邮箱，暂时不能使用邮箱找回！");
        }
      } else {
        this.codeTypeName = "手机号";
        this.form.account = Cookies.get("phoneNum");
        this.iconPhone = "el-icon-mobile-phone el-input__icon";
      }
    },
    // 完成
    confirm() {
      if (this.pwdForm.userPwd !== this.pwdForm.againUserPwd) {
        this.$message.warning("两次输入的密码不一致，请重新输入！");
        return;
      }
      let data = {
        password: this.$md5(this.pwdForm.againUserPwd).toUpperCase(),
      };
      if (this.form.account.indexOf("@") === -1) {
        data.telephone = this.form.account;
      } else {
        data.email = this.form.account;
      }
      this.$refs["pwdForm"].validate((valid) => {
        if (valid) {
          findPwd(data).then(() => {
            this.$message.success("密码修改成功，请重新登录！");
            this.$emit("successFindPwd");
          });
        }
      });
    },
    // 取消
    cancel() {
      this.$emit("hiddenDialog", false);
    },
    handlePwdInput() {
      return false;
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
  .codeType .iconPhone {
    cursor: pointer;
    background: transparent;
    width: 9%;
    height: 39px;
    display: inline-block;
    font-size: 8px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #5475a9;
    border: 1px solid #9cacc9;
    border-radius: 2px;
    margin-left: 2%;
  }
  .codeType .el-input {
    color: #242424;
    width: 88%;
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
  .codeInput {
    width: 64%;
  }
  .codeButton {
    width: 33%;
    margin-left: 10px;
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