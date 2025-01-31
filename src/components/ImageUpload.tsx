import { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void
  initialImage?: string
}

export default function ImageUpload({ onImageSelect, initialImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage)
    }
  }, [initialImage])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreview(base64String)
        onImageSelect(base64String)
        // Save to localStorage
        localStorage.setItem('tempProductImage', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageSelect('')
    localStorage.removeItem('tempProductImage')
  }

  return (
    <div className="mt-1">
      {!preview ? (
        <div className="max-w-xl">
          <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-400 focus:outline-none">
            <span className="flex flex-col items-center justify-center space-y-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">
                Click to upload image
              </span>
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-md"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
