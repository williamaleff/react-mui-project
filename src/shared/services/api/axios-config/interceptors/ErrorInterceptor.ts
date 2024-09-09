import { AxiosError } from "axios";
import { setAuthToken } from "../index";

export const errorInterceptor = (error: AxiosError) => {

    if(error.message === 'Network Error') {
        return Promise.reject(new Error('Erro de conexão'));
    }

    if (error.response?.status === 401) {
        setAuthToken(null);
        localStorage.removeItem('APP_ACCESS_TOKEN');
    }

    if (error.response?.status === 403) {
        setAuthToken(null);
        localStorage.removeItem('APP_ACCESS_TOKEN');
    }

    return Promise.reject(error);
};