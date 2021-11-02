<template>
  <article class="recruitment">
    <template>
      <header class="index-header">
        <h1>商家入驻审核信息</h1>
        <el-divider></el-divider>
      </header>

      <main class="index-main">
        <!-- 审核人信息审核 -->
        <el-form
          :model="checkerForm"
          :rules="checkerFormRules"
          ref="checkerForm"
          label-width="94px"
          class="findPsd_form"
          size="small"
        >
          <!-- <el-form-item prop="companyEmail" label="个人邮箱">
            <el-input
              v-model.trim="customerForm.companyEmail"
              placeholder="请输入您的企业邮箱"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item prop="companyEmail" label="手机号">
            <el-input
              v-model.trim="customerForm.companyEmail"
              placeholder="请输入您的企业邮箱"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item prop="companyEmail" label="身份证号">
            <el-input
              v-model.trim="customerForm.companyEmail"
              placeholder="请输入您的企业邮箱"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item prop="companyEmail" label="姓名">
            <el-input
              v-model.trim="customerForm.companyEmail"
              placeholder="请输入您的企业邮箱"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item prop="companyEmail" label="部门">
            <el-input
              v-model.trim="customerForm.companyEmail"
              placeholder="请输入您的企业邮箱"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item prop="companyEmail" label="职务">
            <el-input
              v-model.trim="customerForm.companyEmail"
              placeholder="请输入您的企业邮箱"
              maxlength="20"
            ></el-input>
          </el-form-item> -->
        </el-form>
        <!-- 公司信息审核 -->
        <el-form
          :model="customerForm"
          :rules="customerFormRules"
          ref="checkForm"
          label-width="94px"
          class="findPsd_form"
          size="small"
        >
          <el-form-item prop="companyEmail" label="公司邮箱">
            <el-input
              v-model.trim="customerForm.companyEmail"
              placeholder="请输入您的企业邮箱"
              maxlength="20"
              @input="changeCustomerForm(1)"
            ></el-input>
          </el-form-item>
          <el-form-item prop="businessMobile" label="服务电话">
            <el-input
              v-model.trim="customerForm.businessMobile"
              placeholder="请输入手机号"
              maxlength="20"
              @input="changeCustomerForm(2)"
            ></el-input>
          </el-form-item>
          <el-form-item prop="businessLicenseImg" label="营业执照">
            <el-upload
              action="#"
              class="avatar-uploader"
              :auto-upload="true"
              :show-file-list="false"
              :on-success="successUploadUser"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <!-- <i slot="default" class="el-icon-plus"></i> -->
            </el-upload>
          </el-form-item>
          <template>
            <el-form-item prop="businesSocialCreditCode" label="信用代码">
              <el-input
                v-model.trim="customerForm.businesSocialCreditCode"
                placeholder="请输入营业执照的信用代码"
                maxlength="40"
                @input="changeCustomerForm(3)"
              ></el-input>
            </el-form-item>
            <el-form-item prop="businessStartTime" label="注册日期">
              <el-date-picker
                v-model="customerForm.businessStartTime"
                type="date"
                style="width: 100%"
                placeholder="请输入公司注册时间"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy年MM月dd日"
                @input="changeCustomerForm(4)"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="businessEndTime" label="有效日期">
              <div class="flex">
                <el-date-picker
                  v-model="customerForm.businessEndTime"
                  type="date"
                  style="width: 100%"
                  placeholder="请输入营业执照的过期时间"
                  :disabled="hasEndTime"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy年MM月dd日"
                  @input="changeCustomerForm(5)"
                >
                </el-date-picker>
                <el-checkbox v-model="hasEndTime" style="margin-left: 20px"
                  >长期</el-checkbox
                >
              </div>
            </el-form-item>
            <el-form-item prop="businesLegalPerson" label="法人姓名">
              <el-input
                v-model.trim="customerForm.businesLegalPerson"
                placeholder="请输入法定代表人的姓名"
                maxlength="40"
                @input="changeCustomerForm(6)"
              ></el-input>
            </el-form-item>
            <el-form-item prop="businessName" label="企业名称">
              <el-input
                v-model.trim="customerForm.businessName"
                placeholder="请输入企业的名称"
                @input="changeCustomerForm(7)"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item prop="businessAddress" label="公司地址">
              <el-input
                v-model.trim="customerForm.businessAddress"
                placeholder="请输入公司所在地址"
                maxlength="40"
                @input="changeCustomerForm(8)"
              ></el-input>
            </el-form-item>
          </template>

          <!-- <el-form-item prop="idNum" label="法人身份证">
            <el-upload
              action="#"
              class="avatar-uploader"
              :auto-upload="true"
              :show-file-list="false"
              :before-upload="beforeuploadIdNum"
              :on-success="successUploadIdNum"
            > 
              <img v-if="idNumFileList[0] !== undefined" :src="idNumFileList[0]" class="avatar" />
              <img v-if="idNumFileList[1] !== undefined" :src="idNumFileList[1]" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="true"
              :limit="2"
              :before-upload="beforeuploadIdNum"
              :file-list="idNumFileList"
              :on-remove="idNumRemove"
              :on-success="successUploadIdNum"
            >
              <i slot="default" class="el-icon-plus"></i>
            </el-upload>
          </el-form-item> -->
          <el-form-item prop="reviewMsg" label="备 注">
            <el-input
              v-model.trim="customerForm.reviewMsg"
              type="textarea"
              @input="changeCustomerForm(9)"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <template>
              <el-button @click="goBack" style="width: 120px">返回</el-button>
              <el-button @click="onSave" style="width: 120px"
                >存入草稿</el-button
              >
              <!-- <el-button @click="onSave" style="width: 120px">修改草稿</el-button> -->
            </template>

            <el-button type="primary" @click="submitCheck" style="width: 120px"
              >提交审核</el-button
            >
          </el-form-item>
        </el-form>
      </main>
    </template>

    <section>
      <draft-list
        :draftList="draftList"
        :previewArea="previewArea"
        :draftVisible="draftVisible"
        :previewImgUrl="previewImgUrl"
        @previewPic="previewPic"
        @useDraft="useDraft"
        @closeDraft="closeDraft"
        @closePreviewDialog="closePreviewDialog"
      ></draft-list>
    </section>
  </article>
</template>

<script>
import DraftList from "./components/draftList.vue";
import {
  submitCompanyInfo,
  updateCompanyInfo,
  getCompanyInfo,
  companyRecognition,
} from "@/api/check";
import { uploadPic, previewPic } from "@/api/user";

export default {
  components: { DraftList },
  data() {
    const validateUserPhone = (rule, value, callback) => {
      const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/; // 0571-86295197
      const isPhone02 = /^\d{3,4}-\d{3,4}-\d{3,4}$/; // 4001-550-520
      const isMob = /^1[0-9]{10}$/;
      // const phone02 = /^0\d{2,3}-?\d{7,8}$/;
      const valuePhone = value.trim();
      if (valuePhone.length == "") {
        callback(new Error("请输入服务电话"));
      } else if (
        isMob.test(valuePhone) ||
        isPhone.test(valuePhone) ||
        isPhone02.test(valuePhone)
      ) {
        // 正则验证
        callback(); // 校验通过
      } else {
        callback("请输入正确手机号或座机电话"); // 校验不通过
      }
    };
    const validateEmail = (rule, value, callback) => {
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
    // const validateIdNum = (rule, value, callback) => {
    //   if (!this.idNumImgState) {
    //     callback(new Error("请上传法人身份证正反面照片"));
    //   } else {
    //     callback();
    //   }
    // };
    const validateBusyLicense = (rule, value, callback) => {
      if (!this.businessImgState) {
        callback(new Error("请上传公司营业执照照片"));
      } else {
        callback();
      }
    };
    const validateEndTime = (rule, value, callback) => {
      if (this.hasEndTime) {
        callback();
      } else {
        if (value === "") {
          callback(new Error("请选择营业执照过期时间！"));
        } else {
          callback();
        }
      }
    };
    return {
      customerForm: {
        businessMobile: "",
        companyEmail: "",
        businessAddress: "",
        businessLicenseImg: "", // 营业执照
        businessName: "", // 企业名称
        idNum: "",
        reviewMsg: "", // 备注
        saasCompanyId: "",
        businesSocialCreditCode: "",
        businessStartTime: "",
        businessEndTime: "",
        businesLegalPerson: "",
      },
      customerFormRules: {
        businessMobile: [
          { required: true, trigger: "blur", validator: validateUserPhone },
        ],
        businessName: [
          { required: true, trigger: "blur", message: "请输入企业名称！" },
        ],
        companyEmail: [
          { required: true, trigger: "blur", validator: validateEmail },
        ],
        // idNum: [{ required: true, trigger: "blur", validator: validateIdNum }],
        businessLicenseImg: [
          { required: true, trigger: "blur", validator: validateBusyLicense },
        ],
        businessAddress: [
          { required: true, trigger: "blur", message: "请输入公司地址！" },
        ],
        businesSocialCreditCode: [
          {
            required: true,
            trigger: "blur",
            message: "请输入营业执照的统一社会信用代码！",
          },
        ],
        businessStartTime: [
          { required: true, trigger: "blur", message: "请输入公司成立日期！" },
        ],
        businessEndTime: [
          { required: true, trigger: "blur", validator: validateEndTime },
        ],
        businesLegalPerson: [
          { required: true, trigger: "blur", message: "请输入公司法人姓名！" },
        ],
      },
      draftVisible: false,
      draftList: [],
      businessImgState: false,
      idNumImgState: false,
      companyInfo: {},
      imageUrl: "",
      hasEndTime: false,
      checkerForm: {},
      checkerFormRules: {},
      buinessPic: {},
      previewImgUrl: "",
      previewArea: false,
      changeState: false
    };
  },
  created() {
    // 获取审核信息
    this.getCheckInfo();
  },
  mounted() {
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    //离开这个界面之后，删除事件
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    goBack() {
      if (this.changeState) {
        this.$confirm("您还有正在编辑的信息，是否继续返回？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/user");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消退出！",
            });
          });
      } else {
        this.$router.push("/user");
      }
    },
    // 获取审核信息
    getCheckInfo() {
      getCompanyInfo().then((res) => {
        this.draftVisible = true;
        this.draftList = [...res.data].map((item) => {
          return item;
        });
        console.log(this.draftList);
      });
    },
    // 使用草稿
    useDraft(row) {
      this.customerForm = {
        businessMobile: row.businessMobile,
        companyEmail: row.companyEmail,
        businessAddress: row.businessAddress,
        businessLicenseImg: row.businessLicenseImg, // 营业执照
        businessName: row.businessName, // 企业名称
        idNum: row.idNum,
        reviewMsg: row.reviewMsg, // 备注
        saasCompanyId: row.saasCompanyId,
        businesSocialCreditCode: row.businesSocialCreditCode,
        businessStartTime: row.businessStartTime,
        businessEndTime: row.businessEndTime,
        businesLegalPerson: row.businesLegalPerson,
      };
      if (this.customerForm.businessEndTime === "") {
        this.hasEndTime = true;
      }
      this.draftVisible = false;
      previewPic({ filePath: row.businessLicenseImg }).then((res) => {
        this.imageUrl = "data:image/gif;base64," + res.data;
        this.businessImgState = true;
      });
    },
    closeDraft(val) {
      this.$confirm("是否要重新编辑商家信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.draftVisible = val;
        })
        .catch(() => {
          this.draftVisible = !val;
        });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 PNG/JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isPNG && isLt2M;
    },
    submitCheck() {
      this.$refs["checkForm"].validate((valid) => {
        if (valid) {
          let data = { ...this.customerForm };
          data.reviewStatus = 1;
          submitCompanyInfo(data).then(() => {
            this.$message.success("商户信息已成功提交！")
            this.changeState = false
          });
        }
      });
    },
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    successUploadUser(response, file) {
      console.log(file);
      this.buinessPic = file.raw;
      this.imageUrl = URL.createObjectURL(file.raw);
      this.beforeAvatarUpload(file.raw);
      this.getBase64(file.raw).then((e) => {
        companyRecognition({ businessLicenseImg: e }).then((res) => {
          this.companyInfo = { ...JSON.parse(res.msg).words_result };
          this.businessImgState = true;
          this.customerForm.businessLicenseImg = file.name;

          let customerForm = {
            businesSocialCreditCode:
              this.customerForm.businesSocialCreditCode.trim() === ""
                ? this.companyInfo.社会信用代码.words
                : this.customerForm.businesSocialCreditCode,
            businessStartTime:
              this.customerForm.businessStartTime.trim() === ""
                ? this.companyInfo.成立日期.words
                : this.customerForm.businessStartTime,
            businessEndTime:
              this.customerForm.businessEndTime.trim() === ""
                ? this.companyInfo.有效期.words === "无"
                  ? ""
                  : this.companyInfo.有效期.words
                : this.customerForm.businessEndTime,
            businesLegalPerson:
              this.customerForm.businesLegalPerson.trim() === ""
                ? this.companyInfo.法人.words
                : this.customerForm.businesLegalPerson,
            businessName:
              this.customerForm.businessName.trim() === ""
                ? this.companyInfo.单位名称.words
                : this.customerForm.businessName,
            businessAddress:
              this.customerForm.businessAddress.trim() === ""
                ? this.companyInfo.地址.words
                : this.customerForm.businessAddress,
          };
          this.customerForm.businesSocialCreditCode =
            customerForm.businesSocialCreditCode;
          this.customerForm.businessStartTime = customerForm.businessStartTime;
          this.customerForm.businessEndTime = customerForm.businessEndTime;
          this.customerForm.businesLegalPerson =
            customerForm.businesLegalPerson;
          this.customerForm.businessName = customerForm.businessName;
          this.customerForm.businessAddress = customerForm.businessAddress;

          if (
            this.customerForm.businessEndTime === "" &&
            this.companyInfo.有效期.words === "无"
          ) {
            this.hasEndTime = true;
          }
        });
      });
    },
    // 上传身份证图片
    // beforeuploadIdNum(file) {
    //   this.beforeAvatarUpload(file);
    //   this.getBase64(file).then((e) => {
    //     idReCognition({ idCardFrontImg: e }).then(() => {
    //       this.dialogIdNumUrl = e;
    //     });
    //   });
    // },
    // successUploadIdNum(response, file) {
    //   this.idNumFileList.push(URL.createObjectURL(file.raw));
    // },
    // 存入草稿箱
    onSave() {
      let data = { ...this.customerForm };
      if (data.saasCompanyId === "") {
        let { saasCompanyId, ...rest } = data;
        console.log(saasCompanyId);
        let newData = { ...rest };
        newData.businessLicenseImg = `${
          newData.businesSocialCreditCode
        }${newData.businessLicenseImg.slice(
          newData.businessLicenseImg.indexOf(".")
        )}`;
        submitCompanyInfo(newData).then(() => {
          // 存入草稿成功的同时上传图片
          this.uploadPic(newData.businessLicenseImg);
          this.$message({
            type: "success",
            message: "已存入草稿箱!",
          });
          this.changeState = false
        });
      } else {
        let newObj = data;
        newObj.businessLicenseImg = `${
          newObj.businesSocialCreditCode
        }${newObj.businessLicenseImg.slice(
          newObj.businessLicenseImg.indexOf(".")
        )}`;
        updateCompanyInfo(newObj).then(() => {
          this.$message({
            type: "success",
            message: "该草稿信息已成功修改!",
          });
          this.changeState = false
        });
      }
    },
    // 上传图片
    uploadPic(picPath) {
      const formData = new FormData();
      formData.append("fileName", picPath);
      formData.append("file", this.buinessPic);

      uploadPic(formData).then((res) => {
        console.log(res.data);
      });
    },
    // 预览图片
    previewPic(path) {
      this.previewArea = true;
      previewPic({ filePath: path }).then((res) => {
        this.previewImgUrl = "data:image/gif;base64," + res.data;
      });
    },
    closePreviewDialog(val) {
      this.previewArea = val;
    },
    changeCustomerForm(e) {
      console.log(e)
      if(!this.changeState) {
        this.changeState = true
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.recruitment {
  .goBack {
    padding: 18px 26px;
    box-shadow: 6px 0 6px #eaeaea;
  }
  .index-header {
    margin-top: 20px;
  }
  .index-main {
    .findPsd_form {
      width: 40%;
      min-width: 500px;
      margin: 30px auto;
      padding: 40px 24px 20px;
      border: 1px solid #eaeaea;
    }
  }
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>