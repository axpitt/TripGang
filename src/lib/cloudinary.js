/**
 * Cloudinary config for TripGang
 * Reads unsigned upload settings from environment variables with safe defaults
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dftr0uawp'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'tripgang_uploads'

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
 * Injects w_auto, q_auto, f_auto into the delivery URL
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - { width, quality, format }
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, { width = 'auto', quality = 'auto', format = 'auto' } = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url

  const uploadSegment = '/upload/'
  const idx = url.indexOf(uploadSegment)
  if (idx === -1) return url

  const transformations = [`f_${format}`, `q_${quality}`]
  if (width !== 'auto') transformations.push(`w_${width},c_limit`)
  else transformations.push('w_auto')

  const transformString = transformations.join(',') + '/'
  return url.slice(0, idx + uploadSegment.length) + transformString + url.slice(idx + uploadSegment.length)
}
