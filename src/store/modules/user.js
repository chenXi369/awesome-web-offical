import { login, logout, getInfo, register } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { noPwdLogin } from "@/api/login"

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 注册完即获取token
  register({ commit }, obj) {
    const registerObj = { ...obj }
    return new Promise((resolve, reject) => {
      register(registerObj).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户密码登录
  login({ commit }, userInfo) {
    const userInfoObj = { ...userInfo }
    return new Promise((resolve, reject) => {
      login(userInfoObj).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 免密登录
  noPwdLogin({ commit }, userInfo) {
    const noPwdUserInfo = { ...userInfo }
    return new Promise((resolve, reject) => {
      noPwdLogin(noPwdUserInfo).then(response => {
        if (response.code === 201) {
          resolve(response)
        } else if (response.code === 200) {
          const { data } = response
          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token)
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        const user = res.user
        // const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
        const avatar = require("@/assets/images/profile.jpg")
        commit('SET_NAME', user.userName)
        commit('SET_AVATAR', avatar)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', undefined)
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移出token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
