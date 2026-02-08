import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://43.203.155.196:8080', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 요청/응답 로그 (리스폰스 확인용)
api.interceptors.request.use(req => {
  console.log('[REQ]', req.method?.toUpperCase(), `${req.baseURL}${req.url}`, req.data);
  return req;
});

api.interceptors.response.use(
  res => {
    console.log('[RES]', res.status, res.config.url, res.data);
    return res;
  },
  err => {
    console.log('[ERR]', err?.response?.status, err?.config?.url, err?.response?.data ?? err.message);
    throw err;
  }
);