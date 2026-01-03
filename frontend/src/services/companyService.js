// frontend/src/services/companyService.js
import api from './api';

const companyService = {
  // Obtener información de mi empresa
  getMyCompany: async () => {
    const response = await api.get('/companies/me');
    return response.data;
  },

  // Obtener empresa por ID
  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // Actualizar empresa
  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  // Subir logo
  uploadLogo: async (id, logoUrl) => {
    const response = await api.post(`/companies/${id}/logo`, { logo_url: logoUrl });
    return response.data;
  },

  // Eliminar logo
  deleteLogo: async (id) => {
    const response = await api.delete(`/companies/${id}/logo`);
    return response.data;
  },

  // Obtener estadísticas
  getCompanyStats: async (id) => {
    const response = await api.get(`/companies/${id}/stats`);
    return response.data;
  }
};

export default companyService;