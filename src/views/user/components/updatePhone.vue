<template>
  <el-dialog
    title="修改手机号"
    width="40%"
    :visible.sync="updatePhoneDialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <section v-if="active === 1">
      <el-switch
        class="switch"
        v-model="switchValue"
        @change="switchChange"
        active-text="邮箱验证"
        inactive-text="手机号验证"
      >
      </el-switch>
    </section>
    <section>
      <template v-if="!switchValue">
        <el-form
          :model="updatePhoneForm"
          :rules="updatePhoneFormRules"
          ref="updatePhoneForm"
          label-width="78px"
          class="findPsd_form"
          key="updatePhoneForm"
          v-if="phoneStepOne === 1"
        >
          <el-form-item prop="oldPhoneNum" label="手机号">
            <el-input
              :disabled="oldPhoneDisabled"
              v-model.trim="updatePhoneForm.oldPhoneNum"
              placeholder="请输入正确的手机号"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item class="code" prop="oldPhoneCode" label="验证码">
            <el-input
              v-model="updatePhoneForm.oldPhoneCode"
              placeholder="请输入短信验证码"
              maxlength="8"
            ></el-input>
            <el-button class="codeButton" v-show="showTime"
              >{{ totalTime }}S
            </el-button>
            <el-button
              class="checkedCode codeButton"
              v-show="!showTime"
              @click="phoneGetCode(0)"
              :loading="loading"
              >获取验证码
            </el-button>
          </el-form-item>
        </el-form>
      </template>

      <template v-else>
        <el-form
          :model="updateEmailForm"
          :rules="updateEmailFormRules"
          ref="updateEmailForm"
          label-width="78px"
          class="findPsd_form"
          key="updateEmailForm"
          v-if="emailStepOne === 1"
        >
          <el-form-item prop="oldEmailNum" label="邮箱">
            <el-input
              :disabled="oldEmailDisabled"
              v-model.trim="updateEmailForm.oldEmailNum"
              placeholder="请输入正确的邮箱号"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item class="code" prop="oldEmailCode" label="验证码">
            <el-input
              v-model="updateEmailForm.oldEmailCode"
              placeholder="请输入短信验证码"
              maxlength="8"
            ></el-input>
            <el-button
              class="codeButton"
              v-show="showTime2"
              :disabled="updateEmailForm.getCodeBtnStatus"
              >{{ totalTime2 }}S
            </el-button>
            <el-button
              class="checkedCode codeButton"
              v-show="!showTime2"
              @click="emailGetCode(0)"
              :loading="loading"
              >获取验证码
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </section>

    <section v-if="phoneStepOne === 2 || emailStepOne === 2">
      <el-form
        :model="newPhoneForm"
        :rules="newPhoneFormRules"
        ref="newPhoneForm"
        label-width="78px"
        class="findPsd_form"
        key="newPhoneForm"
      >
        <el-form-item prop="newPhoneNum" label="新手机号">
          <el-input
            v-model.trim="newPhoneForm.newPhoneNum"
            placeholder="请输入新的手机号"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item class="code" prop="newPhoneCode" label="验证码">
          <el-input
            v-model="newPhoneForm.newPhoneCode"
            placeholder="请输入短信验证码"
            maxlength="8"
          ></el-input>
          <el-button class="codeButton" v-show="showTime1"
            >{{ totalTime1 }}S
          </el-button>
          <el-button
            class="checkedCode codeButton"
            v-show="!showTime1"
            @click="phoneGetCode(1)"
            :loading="loading"
            >获取验证码
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <div slot="footer" class="dialog-footer" v-if="active === 1">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="nextStep" class="login_btn"
        >下一步</el-button
      >
    </div>
    <div slot="footer" class="dialog-footer" v-else>
      <el-button
        type="primary"
        @click="confirm"
        class="login_btn"
        :loading="loading"
        >确 认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Cookies from "js-cookie";
import { getCode, checkCode } from "@/api/login";

export default {
  props: {
    updatePhoneDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateOldPhoneNum = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入手机号"));
      } else if (/^1[34578]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    const validateNewPhoneNum = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入手机号"));
      } else if (/^1[34578]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    const validateOldEmailNum = (rule, value, callback) => {
      if (value.length == "") {
        callback(new Error("请输入邮箱号"));
      } else if (
        /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(value)
      ) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱号"));
      }
    };
    return {
      switchValue: false,
      updatePhoneForm: {
        oldPhoneNum: "",
        oldPhoneCode: "",
      },
      updatePhoneFormRules: {
        oldPhoneNum: [
          { required: true, trigger: "blur", validator: validateOldPhoneNum },
        ],
        oldPhoneCode: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
      },
      updateEmailForm: {
        oldEmailNum: "",
        oldEmailCode: "",
      },
      updateEmailFormRules: {
        oldEmailNum: [
          { required: true, trigger: "blur", validator: validateOldEmailNum },
        ],
        oldEmailCode: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
      },
      newPhoneForm: {
        newPhoneNum: "",
        newPhoneCode: "",
      },
      newPhoneFormRules: {
        newPhoneNum: [
          { required: true, trigger: "blur", validator: validateNewPhoneNum },
        ],
        newPhoneCode: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
      },
      showTime: false,
      showTime1: false,
      showTime2: false,
      showTime3: false,
      totalTime: 30,
      totalTime1: 30,
      totalTime2: 30,
      totalTime3: 30,
      loading: false,
      active: 1,
      phoneStepOne: 1,
      emailStepOne: 1,
      oldPhoneDisabled: false,
      oldEmailDisabled: false,
    };
  },
  created() {
    if (Cookies.get("phoneNum") !== "null") {
      this.oldPhoneDisabled = true;
      this.updatePhoneForm.oldPhoneNum = Cookies.get("phoneNum");
    }
    if (Cookies.get("emailNum") !== "null") {
      this.oldEmailDisabled = true;
      this.updateEmailForm.oldEmailNum = Cookies.get("emailNum");
    }
  },
  methods: {
    handleClose() {
      this.$emit("closeUpdatePhone", false);
      if (!this.switchValue) {
        this.updatePhoneForm = {
          oldPhoneCode: "",
        };
        this.newPhoneForm = {
          newPhoneNum: "",
          newPhoneCode: "",
        };
        if (this.phoneStepOne === 1) {
          this.$refs["updatePhoneForm"].resetFields();
        } else if (this.phoneStepOne === 2) {
          this.$refs["newPhoneForm"].resetFields();
        }
      } else {
        this.updateEmailForm = {
          oldEmailCode: "",
        };
        this.newPhoneForm = {
          newPhoneNum: "",
          newPhoneCode: "",
        };
        if (this.emailStepOne === 1) {
          this.$refs["updateEmailForm"].resetFields();
        } else if (this.emailStepOne === 2) {
          this.$refs["newPhoneForm"].resetFields();
        }
      }
      if (Cookies.get("phoneNum") !== "null") {
        this.oldPhoneDisabled = true;
        this.updatePhoneForm.oldPhoneNum = Cookies.get("phoneNum");
      }
      if (Cookies.get("emailNum") !== "null") {
        this.oldEmailDisabled = true;
        this.updateEmailForm.oldEmailNum = Cookies.get("emailNum");
      }
    },
    cancel() {
      this.$emit("closeUpdatePhone", false);
      if (!this.switchValue) {
        this.updatePhoneForm = {
          oldPhoneCode: "",
        };
        this.newPhoneForm = {
          newPhoneNum: "",
          newPhoneCode: "",
        };
        if (this.phoneStepOne === 1) {
          this.$refs["updatePhoneForm"].resetFields();
        } else if (this.phoneStepOne === 2) {
          this.$refs["newPhoneForm"].resetFields();
        }
      } else {
        this.updateEmailForm = {
          oldEmailCode: "",
        };
        this.newPhoneForm = {
          newPhoneNum: "",
          newPhoneCode: "",
        };
        if (this.emailStepOne === 1) {
          this.$refs["updateEmailForm"].resetFields();
        } else if (this.emailStepOne === 2) {
          this.$refs["newPhoneForm"].resetFields();
        }
      }
      if (Cookies.get("phoneNum") !== "null") {
        this.oldPhoneDisabled = true;
        this.updatePhoneForm.oldPhoneNum = Cookies.get("phoneNum");
      }
      if (Cookies.get("emailNum") !== "null") {
        this.oldEmailDisabled = true;
        this.updateEmailForm.oldEmailNum = Cookies.get("emailNum");
      }
    },
    // 提交接口
    confirm() {
      let data = {
        userName: this.newPhoneForm.newPhoneNum
      }
      this.$store.dispatch("user/updateUserInfo", data).then(() => {
        this.$message.success("已成功修改绑定手机!");
        this.$emit("successUpdatePhone");
        Cookies.set("phoneNum", this.newPhoneForm.newPhoneNum);
      })
    },
    // 获取验证码
    phoneGetCode(e) {
      let value = "";
      if (e === 0) {
        value = this.updatePhoneForm.oldPhoneNum;
        this.getCode(value);
      } else {
        value = this.newPhoneForm.newPhoneNum;
        this.getCode1(value);
      }
    },
    emailGetCode(e) {
      let value = "";
      if (e === 0) {
        value = this.updateEmailForm.oldEmailNum;
        this.getCode2(value);
      } else {
        value = this.newPhoneForm.newPhoneNum;
        this.getCode1(value);
      }
    },
    // 获取验证码
    getCode(value) {
      this.loading = true;
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
          this.loading = false;
        });
      }
    },
    getCode1(value) {
      this.loading = true;
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

        getCode(params).then(() => {
          this.showTime1 = true;
          this.$message.success("验证码已发送!");
          const timer1 = setInterval(() => {
            // 某些定时器操作
            if (this.totalTime1 > 0) {
              this.totalTime1--;
            } else {
              this.showTime1 = false;
              clearInterval(timer1);
              this.totalTime1 = 30;
              return;
            }
          }, 1000);
          this.loading = false;
        });
      }
    },
    getCode2(value) {
      this.loading = true;
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

        getCode(params).then(() => {
          this.showTime2 = true;
          this.$message.success("验证码已发送!");
          const timer2 = setInterval(() => {
            // 某些定时器操作
            if (this.totalTime2 > 0) {
              this.totalTime2--;
            } else {
              this.showTime2 = false;
              clearInterval(timer2);
              this.totalTime2 = 30;
              return;
            }
          }, 1000);
          this.loading = false;
        });
      }
    },
    getCode3(value) {
      this.loading = true;
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

        getCode(params).then(() => {
          this.showTime1 = true;
          this.$message.success("验证码已发送!");
          const timer3 = setInterval(() => {
            // 某些定时器操作
            if (this.totalTime3 > 0) {
              this.totalTime3--;
            } else {
              this.showTime3 = false;
              clearInterval(timer3);
              this.totalTime3 = 30;
              return;
            }
          }, 1000);
          this.loading = false;
        });
      }
    },
    // 下一步
    nextStep() {
      if (!this.switchValue) {
        this.$refs["updatePhoneForm"].validate((valid) => {
          if (valid) {
            let data = {
              type: 0,
              telephone: this.updatePhoneForm.oldPhoneNum,
              verifyCode: this.updatePhoneForm.oldPhoneCode,
            };
            checkCode(data).then(() => {
              this.active = 2;
              this.phoneStepOne = 2;
            });
          }
        });
      } else {
        this.$refs["updateEmailForm"].validate((valid) => {
          if (valid) {
            let data = {
              type: 1,
              telephone: this.updateEmailForm.oldEmailNum,
              verifyCode: this.updateEmailForm.oldEmailCode,
            };
            checkCode(data).then(() => {
              this.active = 2;
              this.emailStepOne = 2;
            });
          }
        });
      }
    },
    // swicth切换时如果没有邮箱去绑定邮箱
    switchChange() {
      if (Cookies.get("emailNum") === "null") {
        this.switchValue = false;
        this.$confirm("您还没有绑定邮箱，是否立即去绑定", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$emit("toBindEmail");
        });
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

.switch {
  margin-bottom: 40px;
  padding: 12px 20px;
  border-radius: 4px;
  border: 1px solid #eaeaea;
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

<style lang="scss">
.el-switch__core {
  margin: 0 20px;
}
</style>