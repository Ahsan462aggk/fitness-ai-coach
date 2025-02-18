import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // This ensures cookies are sent with every request.
});

export default axiosInstance;
