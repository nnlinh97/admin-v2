import axios from 'axios';

export const apiGet = (api) => {
    return axios.get(`http://localhost:5000${api}`)
    // .catch(error => {
    //     console.log(error);
    // });
}

export const apiPost = (api, body) => {
    return axios.post(`http://localhost:5000${api}`, body)
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
    return axios.post(`http://localhost:5000${api}`, body, { headers: headers })
    // .catch(error => {
    //     console.log(error.response);
    // });
}