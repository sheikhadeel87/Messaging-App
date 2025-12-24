import React, { useState } from 'react'
import { FaImage } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'

function ImageUpload({ onImageUploaded, disabled }) {
    const [uploading, setUploading] = useState(false)

    const handleFileSelect = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB')
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/upload/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            )

            toast.success('Image uploaded!')
            onImageUploaded(response.data.imageUrl)
        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error.response?.data?.error || 'Failed to upload image')
        } finally {
            setUploading(false)
            // Clear the input so the same file can be selected again
            e.target.value = ''
        }
    }

    return (
        <label className={`btn btn-circle btn-sm bg-gray-600 text-white hover:bg-gray-700 cursor-pointer ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? (
                <span className='loading loading-spinner loading-xs'></span>
            ) : (
                <FaImage size={16} />
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || uploading}
            />
        </label>
    )
}

export default ImageUpload