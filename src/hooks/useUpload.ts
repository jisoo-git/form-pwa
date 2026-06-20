import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'

export function useUpload() {
  const [uploading, setUploading] = useState(false)

  const uploadPDF = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      return await getDownloadURL(snapshot.ref)
    } finally {
      setUploading(false)
    }
  }

  return { uploadPDF, uploading }
}
