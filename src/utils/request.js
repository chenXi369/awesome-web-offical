import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getKey } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// request interceptor
service.interceptors.request.use(config => {
    if(getKey !=='') {
      config.headers['login_source'] = getKey()
    }
    // 是否需要设置 token
    if (store.getters.token) {
      // config.headers['X-Token'] = getToken()
      config.headers['register-auth'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if ([200, 201, 202].indexOf(res.code) === -1) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50001: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50001 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已经登出，您可以取消留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res.msg || 'Error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000,
      customClass:'msgIndex'
    })
    return Promise.reject(error)
  }
)

export default service
