import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import md5 from 'js-md5';

import "./common/common.css";
import "./icons"
import './permission' // 登录后的控制
import 'element-ui/lib/theme-chalk/index.css'

// 全局引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;

import "./directive/echartResize"

Vue.prototype.$md5 = md5;

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
