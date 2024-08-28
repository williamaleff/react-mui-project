import axios from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';
//import { Environment } from '../../../environment';

const ApiAuth = axios.create({
    baseURL: 'http://localhost:8989'
});

ApiAuth.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
);

export { ApiAuth };