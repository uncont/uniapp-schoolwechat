import {defineStore, storeToRefs} from 'pinia'
import { ref } from 'vue'
import {getAllUnreadCount, getChatHistory, getMessageList} from "../api/privateMessage";
import {useUserStore} from "./user";

const userStore = useUserStore()
const { userId } = storeToRefs(userStore)
export const useMessageStore = defineStore('message', () => {
    // 私信用户列表
    const messageList = ref([])
    // 聊天记录列表
    const chatHistoryList = ref([])
    // 获得总未读信息数
    const totalUnreadCount = ref(0)

    /**
     * 获取私信用户列表
     * @returns
     */
    const fetchMessageList = async () => {
        const params = {
            userId: userId.value
        }
        // 调用接口获取用户信息列表
        messageList.value = await getMessageList(params)
        return messageList.value
    }

    /**
     * 获取用户聊天记录
     * @param followingId
     */
    const fetchChatHistoryList = async (followingId) => {
        const params = {
            pageNum: 1,
            pageSize: 10,
            followerId: userId.value,
            followingId: followingId
        }
        chatHistoryList.value = await getChatHistory(params)
        return chatHistoryList.value
    }

    /**
     * 获取总未读信息数
     */
    const fetchTotalUnreadCount = async () => {
        const params = {
            userId: userId.value
        }
        getAllUnreadCount(params).then(res =>{
            totalUnreadCount.value = res
            console.log('获取总未读信息数成功')
        }).catch(error => {
            console.error('获取总未读信息数失败:', error)
        })

        return totalUnreadCount.value
    }

    return {
        messageList,
        fetchMessageList,
        chatHistoryList,
        fetchChatHistoryList,
        totalUnreadCount,
        fetchTotalUnreadCount
    }
})
