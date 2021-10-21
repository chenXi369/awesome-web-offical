<template>
  <div>
    <el-dialog
      title="审核信息列表"
      :visible.sync="draftVisible"
      width="800px"
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
          label="公司邮箱"
          width="200"
          align="center"
          prop="companyEmail"
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
            <img
              :src="scope.businessLicenseImg"
              style="width: 30px; height: 30px"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="useDraft(scope.row)" type="text" size="small"
              >使用草稿</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
  },
};
</script>

<style>
</style>