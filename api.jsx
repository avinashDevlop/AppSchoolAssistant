import axios from 'axios';

const api = axios.create({
  baseURL: 'https://studentassistant-18fdd-default-rtdb.firebaseio.com/',
  timeout: 10000,
});

export default api;