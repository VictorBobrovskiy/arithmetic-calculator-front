import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
});