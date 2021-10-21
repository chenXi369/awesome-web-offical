import request from '@/utils/request'

const urlPost = "/dev-api/hlb-saas-register"

/* 动态的获取菜单 */
export function getCode(data) {
    return request({
        url: urlPost + "/verify/send",
        method: "post",
        data
    })
}

// 找回密码
export function findPwd(data) {
    return request({
        url: urlPost + "/user-info/find-pwd",
        method: "post",
        data
    })
}
