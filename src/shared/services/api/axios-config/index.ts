import axios from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';
import { Environment } from '../../../environment';

const Api = axios.create({
    baseURL: Environment.URL_BASE,
});

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
);

const setAuthToken = (token: string | null) => {
    if (token) {
      Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete Api.defaults.headers.common['Authorization'];
    }
  };

export { Api, setAuthToken };