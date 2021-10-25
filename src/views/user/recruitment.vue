<template>
  <article class="recruitment">
    <el-page-header @back="goBack" content="商家入驻" class="goBack">
    </el-page-header>

    <template>
      <header class="index-header">
        <h1>商家入驻审核信息</h1>
      </header>

      <main class="index-main">
        <el-form
          :model="customerForm"
          :rules="customerFormRules"
          ref="customerForm"
          label-width="94px"
          class="findPsd_form"
        >
          <el-form-item prop="companyEmail" label="公司邮箱">
            <el-input
              v-model.trim="customerForm.companyEmail"
              placeholder="请输入企业的名称"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item prop="businessMobile" label="服务电话">
            <div class="flex">
              <el-input
                v-model.trim="customerForm.businessMobile"
                placeholder="请输入手机号"
                maxlength="20"
              ></el-input>
              <el-button
                icon="el-icon-plus"
                circle
                @click="addDomain"
                style="margin-left: 10px"
              ></el-button>
            </div>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in customerForm.businessMobiles"
            :label="'服务电话' + (index + 1)"
            :key="domain.key"
            :rules="{
              required: true,
              message: '服务电话不能为空',
              trigger: 'blur',
            }"
          >
            <div class="flex">
              <el-input v-model="domain.value"></el-input>
              <el-button
                icon="el-icon-delete"
                @click.prevent="removeDomain(domain)"
                circle
                style="margin-left: 10px"
              ></el-button>
            </div>
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
          <template v-if="businessImgState">
            <el-form-item prop="businesSocialCreditCode" label="信用代码">
              <el-input
                v-model.trim="customerForm.businesSocialCreditCode"
                placeholder="请输入营业执照的信用代码"
                maxlength="40"
              ></el-input>
            </el-form-item>
            <el-form-item prop="businessStartTime" label="注册日期">
              <el-date-picker
                v-model="customerForm.businessStartTime"
                type="date"
                style="width: 100%"
                placeholder="请输入公司注册时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="businesLegalPerson" label="法人姓名">
              <el-input
                v-model.trim="customerForm.businesLegalPerson"
                placeholder="请输入法定代表人的姓名"
                maxlength="40"
              ></el-input>
            </el-form-item>
            <el-form-item prop="businessName" label="企业名称">
              <el-input
                v-model.trim="customerForm.businessName"
                placeholder="请输入企业的名称"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item prop="businessAddress" label="公司地址">
              <el-input
                v-model.trim="customerForm.businessAddress"
                placeholder="请输入公司所在地址"
                maxlength="40"
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
            ></el-input>
          </el-form-item>

          <el-form-item>
            <template>
              <el-button @click="onSave" style="width: 120px"
                >存入草稿</el-button
              >
              <!-- <el-button @click="onSave" style="width: 120px">修改草稿</el-button> -->
            </template>

            <el-button type="primary" @click="onSubmit" style="width: 120px"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </main>
    </template>

    <section>
      <draft-list
        :draftList="draftList"
        :draftVisible="draftVisible"
        @useDraft="useDraft"
        @closeDraft="closeDraft"
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

export default {
  components: { DraftList },
  data() {
    // const validateUserPhone = (rule, value, callback) => {
    //   let isMob =
    //     /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
    //   if (value.length == "") {
    //     callback(new Error("请输入服务电话"));
    //   } else if (/^1[34578]\d{9}$/.test(value) || isMob.test(value)) {
    //     callback();
    //   } else {
    //     callback(new Error("请输入正确的服务电话"));
    //   }
    // };
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
        businessMobiles: [],
        businesSocialCreditCode: "",
        businessStartTime: "",
        businesLegalPerson: "",
      },
      customerFormRules: {
        // businessMobile: [
        //   { required: true, trigger: "blur", validator: validateUserPhone },
        // ],
        businessMobile: [
          { required: true, trigger: "blur", message: "请输入公司服务热线！" },
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
      let backState = Object.keys(this.customerForm)
        .map((key) => this.customerForm[key])
        .find((item) => {
          return item !== "";
        });
      if (backState !== undefined) {
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
    // 移除别的服务电话
    removeDomain(item) {
      var index = this.customerForm.businessMobiles.indexOf(item);
      if (index !== -1) {
        this.customerForm.businessMobiles.splice(index, 1);
      }
    },
    // 新增服务电话
    addDomain() {
      if (this.customerForm.businessMobiles.length < 2) {
        this.customerForm.businessMobiles.push({
          value: "",
          key: Date.now(),
        });
      } else {
        this.$message.info("服务电话数最大不超过三个");
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
        businessMobiles: this.customerForm.businessMobiles,
      };
      this.draftVisible = false;
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
    onSubmit() {
      this.$refs["customerForm"].validate((valid) => {
        if (valid) {
          submitCompanyInfo(this.customerForm).then((res) => {
            console.log(res.data);
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
      this.imageUrl = URL.createObjectURL(file.raw);
      this.beforeAvatarUpload(file.raw);
      this.getBase64(file.raw).then((e) => {
        companyRecognition({ businessLicenseImg: e }).then((res) => {
          this.companyInfo = { ...JSON.parse(res.msg).words_result };
          this.businessImgState = true;
          this.customerForm.businessName = this.companyInfo.COMPANY[0];
          this.customerForm.businessAddress = this.companyInfo.ADDR[0];
          this.customerForm.businessLicenseImg = JSON.stringify(file.raw);
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
        submitCompanyInfo({ ...rest }).then(() => {
          this.$message({
            type: "success",
            message: "已存入草稿箱!",
          });
        });
      } else {
        updateCompanyInfo(data).then(() => {
          this.$message({
            type: "success",
            message: "该草稿信息已成功修改!",
          });
        });
      }
    },
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