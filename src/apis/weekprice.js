import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  withCredentials: true,
});

export const getWeeklyPrices = async (dataCode) => {
  const res = await API.get(`/data/weekly-prices/${dataCode}`);
  return res.data;
};
