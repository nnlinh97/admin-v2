import axios from 'axios';
import { baseURL } from './../config';


export const apiGet = (api) => {
    return axios.get(`${baseURL}${api}`)
        .catch(error => {
            console.log(error);
        });
}

export const apiPost = (api, body) => {
    return axios.post(`${baseURL}${api}`, body)
        .catch(error => {
            console.log(error);
        });
}