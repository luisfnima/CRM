import api from './api';

const scheduleService = {
  getAll: async () => {
    const response = await api.get('/schedules');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },
  
  create: async (scheduleData) => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },
  
  update: async (id, scheduleData) => {
    const response = await api.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  }
};

export default scheduleService;