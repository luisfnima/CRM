import api from './api';

const branchService = {
  getAll: async () => {
    const response = await api.get('/branches');
    return response.data;
  },
};

export default branchService;