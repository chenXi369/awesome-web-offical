<template>
  <el-dialog
    title="提示"
    :visible.sync="loginLoadingVisible"
    width="30%"
    top="30vh"
    center
  >
    <section>
        微信授权登录中
    </section>
  </el-dialog>
</template>

<script>
export default {
    props: {
        loginLoadingVisible: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style>
</style>