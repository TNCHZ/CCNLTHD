import axios from "axios";

//const BASE_URL = '';

export const endpoints = {
    'login': '/o/token/',
    'current-user': '/user/current-user', //cần chứng thực mới lấy được
}

export default axios.create({
    //baseURL: BASE_URL
});