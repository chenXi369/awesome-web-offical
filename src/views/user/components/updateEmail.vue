<template>
  <el-dialog
    title="修改邮箱"
    width="35%"
    :visible.sync="updateEmailDialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <section v-if="stepOne === 1">
      <el-form
        :model="emailPhoneForm"
        :rules="emailPhoneFormRules"
        ref="emailPhoneForm"
        label-width="65px"
        class="findPsd_form"
      >
        <el-form-item prop="phoneNum" label="手机号">
          <el-input
            :disabled="true"
            v-model.trim="emailPhoneForm.phoneNum"
            placeholder="请输入正确的手机号"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item class="code" prop="code" label="验证码">
          <el-input
            v-model="emailPhoneForm.code"
            placeholder="请输入短信验证码"
            maxlength="8"
          ></el-input>
          <el-button
            class="codeButton"
            v-show="showTime"
            >{{ totalTime }}S
          </el-button>
          <el-button
            class="checkedCode codeButton"
            v-show="!showTime"
            :disabled="showTime"
            @click="phoneGetCode(0)"
            :loading="emailPhoneForm.getCodeBtnStatus"
            >获取验证码
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section v-else>
      <el-form
        :model="updateEmailForm"
        :rules="updateEmailFormRules"
        ref="updateEmailForm"
        label-width="65px"
        class="findPsd_form"
      >
        <el-form-item prop="newEmail" label="新邮箱">
          <el-input
            v-model.trim="updateEmailForm.newEmail"
            placeholder="请输入正确的邮箱"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item class="code" prop="emailCode" label="验证码">
          <el-input
            v-model="updateEmailForm.emailCode"
            placeholder="请输入短信验证码"
            maxlength="8"
          ></el-input>
          <el-button
            class="codeButton"
            v-show="showTime1"
            >{{ totalTime }}S
          </el-button>
          <el-button
            class="checkedCode codeButton"
            v-show="!showTime1"
            @click="phoneGetCode(1)"
            :loading="updateEmailForm.getCodeBtnStatus"
            >获取验证码
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <section>
      <div slot="footer" class="dialog-footer" v-if="stepOne === 1" key="1">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="nextStep"
          class="login_btn"
          :loading="loading"
          >下一步</el-button
        >
      </div>
      <div slot="footer" class="dialog-footer" v-else key="2">
        <el-button
          type="primary"
          @click="confirm"
          class="login_btn"
          :loading="loading"
          >确 认</el-button
        >
      </div>
    </section>
  </el-dialog>
</template>

<script>
import { getCode, checkCode } from "@/api/login";
import { updateUserInfo } from "@/api/user"
import { setToken } from '@/utils/auth'
import Cookies from "js-cookie"

export default {
  props: {
    updateEmailDialog: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    const userPhone = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入手机号"));
      } else if (/^1[34578]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    const userEmail = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入邮箱"));
      } else if (
        /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(value)
      ) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱"));
      }
    };
    return {
      emailPhoneForm: {
        phoneNum: "",
        code: ""
      },
      emailPhoneFormRules: {
        phoneNum: [
          { required: true, trigger: "blur", validator: userPhone },
        ],
        code: [
          { required: true, trigger: "blur", message: "请输入手机验证码" },
        ],
      },
      updateEmailForm: {
        newEmail: "",
        emailCode: ""
      },
      updateEmailFormRules: {
        newEmail: [
          { required: true, trigger: "blur", validator: userEmail },
        ],
        emailCode: [
          { required: true, trigger: "blur", message: "请输入邮箱验证码" },
        ],
      },
      showTime: false,
      showTime1: false,
      totalTime: 60,
      loading: false,
      stepOne: 1,
    };
  },
  created() {
    this.emailPhoneForm.phoneNum = Cookies.get("phoneNum")
  },
  methods: {
    handleClose() {
      if(this.stepOne === 1) {
        this.$refs['emailPhoneForm'].resetFields()
      } else {
        this.$refs['updateEmailForm'].resetFields()
      }
      this.$emit("closeUpdateEmail", false);
    },
    cancel() {
      this.$refs['emailPhoneForm'].resetFields()
      this.$emit("closeUpdateEmail", false);
    },
    confirm() {
      this.$refs['updateEmailForm'].validate((valid) => {
        if(valid) {
          let data = {
            email: this.updateEmailForm.newEmail
          }
          updateUserInfo(data).then((res) => {
            this.$message.success("绑定邮箱已修改成功!");
            Cookies.set("emailNum", this.updateEmailForm.emailNum);
            setToken(res.data.access_token)
            this.$store.commit('user/SET_TOKEN', res.data.access_token)
            this.$emit("successUpdatepwd")
          })
        }
      })
    },
    getCode() {},
    nextStep() {
      this.$refs['emailPhoneForm'].validate((valid) => {
        if(valid) {
          let data = {
            type: 0,
            telephone: this.emailPhoneForm.phoneNum,
            verifyCode: this.emailPhoneForm.code
          }
          checkCode(data).then(() => {
            this.stepOne = 2;
          })
        }
      })
    },
    phoneGetCode(index) {
      if (index === 0) {
        let value = this.emailPhoneForm.phoneNum;
        if (/^1[34578]\d{9}$/.test(value)) {
          let params = {};
          params.type = 0;
          params.telephone = value;
          this.loading = true;

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
        } else {
          this.$message.warning("请输入正确的手机号！")
        }
      } else if (index === 1) {
        let value = this.updateEmailForm.newEmail;
        if (/^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(value)) {
          let params = {};
          params.type = 1;
          params.email = value;
          this.loading = true;

          getCode(params).then(() => {
            this.showTime1 = true;
            this.$message.success("验证码已发送!");
            const timer = setInterval(() => {
              // 某些定时器操作
              if (this.totalTime > 0) {
                this.totalTime--;
              } else {
                this.showTime1 = false;
                this.totalTime = 60;
                clearInterval(timer);
                return;
              }
            }, 1000);
            this.loading = false;
          });
        } else {
          this.$message.warning("请输入正确的邮箱！")
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  .codeInput {
    width: 64%;
  }
  .codeButton {
    width: 33%;
    margin-left: 10px;
  }
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