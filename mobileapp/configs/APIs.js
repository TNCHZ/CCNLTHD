import axios from "axios";

// const BASE_URL = 'http://10.0.2.2:8000/';
const BASE_URL = 'http://192.168.1.7:8000/';
// const BASE_URL = ' http://127.0.0.1:8000/';

export const endpoints = {
    'managing-fees': (accountState) => `/resident-information/${accountState.id}/managing-fees/`,
    'parking-fees': (accountState) => `/resident-information/${accountState.id}/parking-fees/`,
    'service-fees': (accountState) => `/resident-information/${accountState.id}/service-fees/`,
    'feedback': (accountState) => `/resident-information/${accountState.id}/feedback/`,
    'locker': (accountState) => `/resident-information/${accountState.id}/loker/`,
    'surveys': (accountState) => `/resident-information/${accountState.id}/surveys/`,
    'address': '/address/',
    'login': '/o/token/',
    'update-avatar-password': '/user/update-avatar-password/',
    'current-user': '/user/current-user', //cần chứng thực mới lấy được
    'resident-information': '/resident-information/',
    'resident-create': '/resident-create/'
}

export const authApis = (token) =>  {
    return axios.create({
        baseURL: BASE_URL, 
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
};

export default axios.create({
    baseURL: BASE_URL
});