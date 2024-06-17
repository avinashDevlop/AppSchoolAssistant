import axios from 'axios';

const api = axios.create({
  baseURL: 'https://studentassistant-18fdd-default-rtdb.firebaseio.com/',
});

export default api;