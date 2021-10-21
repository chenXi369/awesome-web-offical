<template>
  <el-dialog
    :title="title"
    width="40%"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <section>
      <div v-if="title === '微信登录'">
        <vue-qr
          colorDark="#000000"
          colorLight="#fff"
          :logoSrc="downloadData.icon + '?cache'"
          :text="downloadData.url"
          :size="200"
          :margin="0"
        ></vue-qr>
      </div>
      <div v-else>
        <span>QQ登录</span>
      </div>
    </section>
  </el-dialog>
</template>

<script>
import vueQr from "vue-qr";
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    vueQr,
  },
  data() {
    return {
      downloadData: {
        url: "https://open.weixin.qq.com/connect/qrconnect?appid=wx4de421c9641e8e0c&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect=zyt.oklong.com",
        icon: require("../../../assets/logo.png"),
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>