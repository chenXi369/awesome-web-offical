<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Cookies from "js-cookie"

export default {
  data() {
    return {
      beforeUnload_time: 0,
      gap_time: 0
    }
  },
  mounted() {
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
    window.addEventListener("unload", (e) => this.unloadHandler(e));
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) =>
      this.beforeunloadHandler(e)
    );
    window.removeEventListener("unload", (e) => this.unloadHandler(e));
  },
  methods: {
    beforeunloadHandler() {
      this.beforeUnload_time = new Date().getTime();
    },
    unloadHandler() {
      this.gap_time = new Date().getTime() - this.beforeUnload_time;
      //判断是窗口关闭还是刷新
      if (this.gap_time <= 5) {
        //如果是登录状态，关闭窗口前，移除用户
        if (Cookies.get("Admin-Token") !== undefined) {
          this.$store.dispatch('user/resetToken')
        }
      }
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0px;
}

#app {
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.15);
  transition: color 0.2s ease;
}

.msgIndex {
  z-index: 3000 !important;
}
</style>
