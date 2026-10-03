/**
 * Cloudinary config for TripGang
 * Reads unsigned upload settings from environment variables
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

/**
 * Upload an image file to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - Cloudinary folder path e.g. 'trips/adrai-2026'
 * @param {Function} onProgress - Optional progress callback (0-100)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (file, folder = 'tripgang', onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText)
      if (xhr.status === 200) {
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
        })
      } else {
        reject(new Error(data.error?.message || 'Upload failed'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)
    xhr.send(formData)
  })
}

/**
 * Get optimized image URL from Cloudinary
 * @param {string} url - Original Cloudinary URL
 * @param {object} opts - Transformation options
 */
export const getOptimizedUrl = (url, { width = 800, quality = 'auto', format = 'auto' } = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url
  return url.replace(
    '/upload/',
    `/upload/w_${width},q_${quality},f_${format}/`
  )
}

export { CLOUD_NAME }
