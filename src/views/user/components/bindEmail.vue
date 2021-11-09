<template>
  <el-dialog
    title="绑定邮箱"
    width="540px"
    :visible.sync="bindEmailDialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <section>
      <el-form
        :model="bindEmailForm"
        :rules="bindEmailFormRules"
        ref="bindEmailForm"
        label-width="70px"
        class="findPsd_form"
      >
        <template>
          <el-form-item prop="emailNum" label="邮箱">
            <el-input
              :disabled="loading"
              v-model.trim="bindEmailForm.emailNum"
              placeholder="请输入正确的邮箱"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item class="code" prop="code" label="验证码">
            <el-input
              v-model="bindEmailForm.code"
              placeholder="请输入短信验证码"
              maxlength="8"
            ></el-input>
            <el-button class="codeButton" v-show="showTime" :disabled="showTime"
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
      </el-form>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button
        type="primary"
        @click="confirm"
        class="login_btn"
        :disabled="loading"
        >确 认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { getCode } from "@/api/login";
import { updateUserInfo } from "@/api/user";
import { setToken } from '@/utils/auth'
import Cookies from "js-cookie";

export default {
  props: {
    bindEmailDialog: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    const validateEmailNum = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入正确的邮箱号"));
      } else if (/^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱号"));
      }
    };
    return {
      bindEmailForm: {
        emailNum: "",
        code: "",
      },
      bindEmailFormRules: {
        emailNum: [
          { required: true, trigger: "blur", validator: validateEmailNum },
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }],
      },
      showTime: false,
      totalTime: 120,
      loading: false,
    };
  },
  methods: {
    handleClose() {
      this.loading = false
      this.showTime = false
      this.$refs['bindEmailForm'].resetFields()
      this.$emit("closeBindEmail", false);
    },
    // 获取验证码
    getCode() {
      let value = this.bindEmailForm.emailNum;
      if (
        /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(value)
      ) {
        let params = {};
        params.type = 1;
        params.email = value;
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
        }).catch(() => {
          this.loading = false;
        });
      }
    },
    cancel() {
      this.loading = false
      this.showTime = false
      this.$refs['bindEmailForm'].resetFields()
      this.$emit("closeBindEmail", false);
    },
    confirm() {
      this.$refs.bindEmailForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          updateUserInfo({ email: this.bindEmailForm.emailNum }).then((res) => {
            this.$message.success("已成功绑定邮箱!");
            Cookies.set("emailNum", this.bindEmailForm.emailNum);
            setToken(res.data.access_token)
            this.$store.commit('user/SET_TOKEN', res.data.access_token)
            this.$emit("successBindEmail");
          }).catch(() => {
            
          })
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.findPsd_form {
  width: 440px;
  min-width: 440px;
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