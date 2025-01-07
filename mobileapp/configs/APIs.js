import axios from "axios";

//const BASE_URL = '';

export const endpoints = {
    'login': '/o/token/'
}

export default axios.create({
    //baseURL: BASE_URL
});