import request from '@/utils/request'

/**
 * 获取用户关注列表
 * @param userId
 * @returns {*}
 */
export function getMessageList(userId){
    return request({
        url: `/privateMessage/getFollowsConversationsList`,
        method: 'GET',
        data: userId,
        needToken: true
    })
}

/**
 * 获取用户聊天记录
 * @param data
 * @returns {*}
 */
export function getChatHistory(data){
    return request({
        url: `/privateMessage/getChatHistory`,
        method: 'GET',
        data: data,
        needToken: true
    })
}

export function getAllUnreadCount(data){
    return request({
        url: `/privateMessage/getAllUnreadCount`,
        method: 'GET',
        data: data,
        needToken: true
    })
}