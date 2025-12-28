// frontend/src/services/uploadService.js
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      return data.secure_url; // URL de la imagen
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};

export default uploadService;