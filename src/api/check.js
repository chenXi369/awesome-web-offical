import request from '@/utils/request'

const urlPost = "/dev-api/hlb-saas-register"

// 提交草稿箱
export function submitCompanyInfo(data) {
    return request({
        url: urlPost + '/review/submit',
        method: 'post',
        data: data
    })
}

// 修改审核
export function updateCompanyInfo(data) {
    return request({
        url: urlPost + '/review/update',
        method: 'post',
        data: data
    })
}

// 获取审核信息
export function getCompanyInfo(query) {
    return request({
        url: urlPost + '/review/list',
        method: 'get',
        params: query
    })
}

// 给审核人发送短信
export function sendMsg(data) {
    return request({
        url: urlPost + '/review/send-msg',
        method: 'post',
        params: data
    })
}

// 身份证识别
export function idReCognition(data) {
    return request({
        url: urlPost + '/identify/getIdentifyIdBase64',
        method: 'post',
        data: data
    })
}

// 营业执照识别
export function companyRecognition(data) {
    return request({
        url: urlPost + '/identify/getBusinessLicenseBase64',
        method: 'post',
        data: data
    })
}