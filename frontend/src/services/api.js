import axios from 'axios';

// Single axios instance every service module imports, instead of each page
// calling the bare `axios` singleton directly. CRA's dev-server proxy
// (see package.json "proxy") forwards relative /api/* calls to the backend,
// so no baseURL is needed here.
const api = axios.create();

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
