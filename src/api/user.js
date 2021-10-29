import request from '@/utils/request'

const urlPost = "/dev-api/hlb-saas-register"

// 注册
export function register(data) {
    return request({
        url: urlPost + '/login/register',
        method: 'post',
        data: data
    })
}

// 登录 获取token
export function login(data) {
    return request({
        url: urlPost + '/login/secret',
        method: 'post',
        data: data
    })
}

// 获取信息
export function getInfo() {
    return request({
        url: urlPost + '/user-info/get-login-info',
        method: 'get'
    })
}

// 修改密码、改手机号、绑定邮箱、修改邮箱、修改身份信息
export function updateUserInfo(data) {
    return request({
        url: urlPost + "/user-info/update",
        method: "post",
        data
    })
}

// 退出登录
export function logout() {
    return request({
        url: urlPost + '/logout',
        method: 'post'
    })
}

// 上传文件
export function uploadPic(data) {
    return request({
        url: urlPost + '/file/upload',
        method: 'post',
        data
    })
}

// 预览图片
export function previewPic(query) {
    return request({
        url: urlPost + '/file/preview-img',
        method: 'get',
        params: query
    })
}



