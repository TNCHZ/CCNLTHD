import axios from "axios";

// const BASE_URL = 'http://192.168.206.3:8000/';
const BASE_URL = 'http://192.168.1.5:8000/';
// const BASE_URL = ' http://127.0.0.1:8000/';

export const client_id = "MH4TCwTXdmpAOulasshJv0ofgFaHYpyRV7Q0huNe";
export const client_secret = "Oqe03MRLrsTQzUcLNs6p9F8j2v3toIoeo8nzcCIZejNCm0BQ6HVa4VKDMy0APCaubWxq0qJlhekqyXvaWHxRd8B5VLrKD0FM3ca0KZTHZxi7yN3WeXaHQ4SxMp1XA4b7";

export const endpoints = {
    'managing-fees': (accountState) => `/resident-information/${accountState.id}/managing-fees/`,
    'parking-fees': (accountState) => `/resident-information/${accountState.id}/parking-fees/`,
    'service-fees': (accountState) => `/resident-information/${accountState.id}/service-fees/`,
    'feedback': (accountState) => `/resident-information/${accountState.id}/feedback/`,
    'locker-resident': (accountState) => `/resident-information/${accountState.id}/locker/`,
    'survey-response': (accountState) => `/resident-information/${accountState.id}/survey/`,
    'address': '/address/',
    'login': '/o/token/',
    'survey': '/survey/',
    'feedback': '/feedback/',
    'locker': '/locker/',
    'register-for-relative': '/register-for-relative/',
    'item-in-locker': '/item-in-locker/',
    'resident-survey-response': '/resident-survey-response/',
    'get-resident-response-survey': '/resident-survey-response/by-survey/',
    'month-fee': '/month-fee/',
    'update-avatar-password': `/user/update-avatar-password/`,
    'current-user': '/user/current-user', //cần chứng thực mới lấy được
    'resident-information': (accountState) => `/resident-information/${accountState.id}/`,
    'resident-create': '/resident-create/',
    'list-user': '/list-user/'
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