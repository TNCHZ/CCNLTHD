import axios from "axios";

// const BASE_URL = 'http://10.0.2.2:8000/';
const BASE_URL = 'http://192.168.1.7:8000/';
// const BASE_URL = ' http://127.0.0.1:8000/';

export const endpoints = {
    'login': '/o/token/',
    'current-user': '/user/current-user', //cần chứng thực mới lấy được
}

export const authApis = (token) =>  {
    console.info("User",token);
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