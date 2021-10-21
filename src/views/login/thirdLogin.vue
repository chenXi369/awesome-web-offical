<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  created() {
    let newTime = Date.now()
    let stateVal = "haolong" + newTime
    window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=wx4de421c9641e8e0c&redirect_uri=http%3A%2F%2Fzyt.oklong.com%2Fhlb-parking-server%2FparkingUtils%2Ftest&response_type=code&scope=snsapi_login&state=${stateVal}#wechat_redirect`
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>