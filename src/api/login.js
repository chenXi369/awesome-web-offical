import request from '@/utils/request'

const urlPost = "/dev-api/hlb-saas-register"

/* 获取验证码 */
export function getCode(data) {
    return request({
        url: urlPost + "/verify/send",
        method: "post",
        data
    })
}

// 验证码的校验
export function checkCode(data) {
    return request({
        url: urlPost + "/verify/check",
        method: "post",
        data
    })
}

// 获取静态的验证码图片
export function getCodeImg() {
    return request({
        url: "/pm-verifyCode",
        method: "get"
    })
}

// 免密登录
export function noPwdLogin(data) {
    return request({
        url: urlPost + "/login/verifyCode",
        method: "post",
        data
    })
}

// 密码登录
export function pwdLogin(data) {
    return request({
        url: urlPost + "/login/secret",
        method: "post",
        data
    })
}

// 获取token
export function getWxToken(query) {
    return request({
        url: urlPost + "/weChat/access-token/get",
        method: "get",
        params: query
    })
}


// 微信登录
export function wxLogin(data) {
    return request({
        url: urlPost + "/login/weChat",
        method: "post",
        data
    })
}

// 检查openid绑定情况
export function checkOpenid(data) {
    return request({
        url: urlPost + "/login/checkOpenid",
        method: "post",
        data
    })
}

// qq登录
export function qqLogin(data) {
    return request({
        url: urlPost + "/login/qq",
        method: "post",
        data
    })
}