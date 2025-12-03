import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/memes';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const memeService = {
  getMemes: async (page = 0, size = 9, search = '', sortDir = 'desc') => {
    const response = await api.get('', {
      params: { page, size, search, sortDir },
    });
    return response.data.data;
  },

  createMeme: async (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const response = await api.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  deleteMeme: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  }
};