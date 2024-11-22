import axios from 'axios';

const API_BASE_URL = 'https://iyz5u8os46.execute-api.sa-east-1.amazonaws.com/dev'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
});