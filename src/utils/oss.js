/**
 * 阿里云OSS上传工具
 */
import { useToast } from 'wot-design-uni'

// 从环境变量或配置文件获取OSS配置
// 注意：实际项目中，这些配置应该从后端获取，避免在前端暴露敏感信息
const OSS_CONFIG = {
  region: 'oss-cn-hangzhou', // 根据实际情况修改
  accessKeyId: '', // 从后端获取
  accessKeySecret: '', // 从后端获取
  bucket: '', // 你的bucket名称
  // 如果使用后端签名，需要提供签名接口
  signatureUrl: '/api/oss/signature' // 例如
}

/**
 * 上传文件到阿里云OSS
 * @param {Object} file - 要上传的文件对象，包含name和path
 * @returns {Promise<string>} 返回上传后的文件URL
 */
export async function uploadToOSS(file) {
  const { success: showSuccess, error: showError } = useToast()

  // 在实际项目中，你可能需要从后端获取签名信息
  // 这里提供两种方式：1. 直接使用SDK上传 2. 使用临时凭证上传

  try {
    // 方式一：通过后端签名方式上传（推荐）
    // 获取上传凭证
    const signatureResponse = await uni.request({
      url: OSS_CONFIG.signatureUrl,
      method: 'POST',
      data: {
        fileName: file.name,
        fileType: file.type
      }
    })

    const { policy, signature, accessKeyId, dir, host } = signatureResponse.data.data

    // 创建FormData
    const formData = {
      key: `${dir}${Date.now()}_${file.name}`, // 使用时间戳避免文件名冲突
      policy: policy,
      OSSAccessKeyId: accessKeyId,
      signature: signature,
      'Content-Type': file.type || 'image/jpeg'
    }

    // 上传文件
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: host,
        filePath: file.path,
        name: 'file',
        formData: formData,
        success: uploadResult => {
          if (uploadResult.statusCode === 204 || uploadResult.statusCode === 200) {
            // 上传成功
            const fileUrl = `${host}/${formData.key}`
            showSuccess('上传成功')
            resolve(fileUrl)
          } else {
            console.error('上传失败:', uploadResult)
            showError('上传失败')
            reject(new Error('上传失败'))
          }
        },
        fail: error => {
          console.error('上传失败:', error)
          showError('上传失败')
          reject(error)
        }
      })
    })
  } catch (error) {
    console.error('获取签名失败:', error)
    showError('上传失败')
    throw error
  }
}

/**
 * 上传多个文件到阿里云OSS
 * @param {Array} files - 文件对象数组，每个对象需要包含name和path
 * @returns {Promise<Array>} 返回上传后的文件URL数组
 */
export async function uploadMultipleToOSS(files) {
  // 串行上传，避免并发过多导致问题
  const results = []
  for (const file of files) {
    try {
      const url = await uploadToOSS(file)
      results.push(url)
    } catch (error) {
      console.error(`文件 ${file.name} 上传失败:`, error)
      throw error // 如果任一文件上传失败，抛出错误
    }
  }
  return results
}
