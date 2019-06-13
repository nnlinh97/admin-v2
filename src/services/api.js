import axios from 'axios';
import { baseURL } from './../config';


export const apiGet = (api) => {
    return axios.get(`${baseURL}${api}`)
    // .catch(error => {
    //     console.log(error);
    // });
}

export const apiPost = (api, body) => {
    return axios.post(`${baseURL}${api}`, body)
    // .catch(error => {
    //     console.log(error.response);
    // });
}

export const apiPostAdmin = (api, body) => {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: localStorage.token
    }
    axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
    return axios.post(`${baseURL}${api}`, body, { headers: headers })
}