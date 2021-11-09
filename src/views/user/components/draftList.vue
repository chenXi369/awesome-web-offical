<template>
  <div>
    <el-dialog
      title="审核信息列表"
      :visible.sync="draftVisible"
      width="1000px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-table :data="draftList" border>
        <el-table-column
          fixed
          label="日期"
          width="160"
          align="center"
          prop="createTime"
        >
        </el-table-column>

        <el-table-column fixed label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            {{ reviewStatusList[scope.row.reviewStatus] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="businessName"
          label="企业名称"
          width="220"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="信用代码"
          width="200"
          align="center"
          prop="businesSocialCreditCode"
        >
        </el-table-column>
        <el-table-column
          label="注册日期"
          width="200"
          align="center"
          prop="businessStartTime"
        >
        </el-table-column>
        <el-table-column
          label="法人姓名"
          width="200"
          align="center"
          prop="businesLegalPerson"
        >
        </el-table-column>
        <el-table-column
          label="服务电话"
          width="200"
          align="center"
          prop="businessMobile"
        >
        </el-table-column>
        <el-table-column label="营业执照" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="priview(scope.row)" type="text" size="small"
              >点击查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="useDraft(scope.row)" type="text" size="small"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        width="600px"
        title="营业执照"
        :visible.sync="previewArea"
        append-to-body
        :close-on-click-modal="false"
        :before-close="closePreview"
      >
        <section style="width: 100%; text-align: center">
          <img :src="previewImgUrl" class="preview-area" />
        </section>
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button plain type="primary" @click="addBuiness" size="small"
          >新增商家</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    draftVisible: {
      type: Boolean,
      default: false,
    },
    draftList: {
      type: Array,
      default: () => [],
    },
    previewArea: {
      type: Boolean,
      default: false,
    },
    previewImgUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      reviewStatusList: ["草稿箱", "未审核", "审核中", "审核成功", "审核失败"],
    };
  },
  methods: {
    useDraft(row) {
      this.$emit("useDraft", row);
    },
    handleClose() {
      this.$emit("closeDraft", false);
    },
    priview(val) {
      this.$emit("previewPic", val.businessLicenseImg);
    },
    closePreview() {
      this.$emit("closePreviewDialog", false);
    },
    // 新增商家
    addBuiness() {
      this.$emit("addBuiness")
    }
  },
};
</script>

<style lang="scss">
.preview-area {
  width: 400px;
  height: 600px;
}
.el-dialog__footer {
  padding-top: 0px;
}
</style>