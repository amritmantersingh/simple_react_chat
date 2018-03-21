import axios from 'axios';

const API_ROOT = 'http://localhost:8000/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

const requests = {
    del: url =>
        axios.del(`${API_ROOT}${url}`).then(responseBody),
    get: url =>
        axios.get(`${API_ROOT}${url}`).then(responseBody),
    put: (url, body) =>
        axios.put(`${API_ROOT}${url}`, body).then(responseBody),
    post: (url, body) =>
        axios.post(`${API_ROOT}${url}`, body)
};

const Auth = {
    current: () =>
        requests.get('/user'),
    login: (username, password) =>
        requests.post('/user/login', { username: username, password: password }),
    register: (username, email, password) =>
        requests.post('/users', { user: { username, email, password } }),
    save: user =>
        requests.put('/user', { user })
};

const Reg = {
    checkName: (username) =>
        requests.get('/usercheck/' + username ),
    register: (username, email, password, passwordConfirm) =>
        requests.post('/users', {
            username: username,
            password: password,
            password_confirm: passwordConfirm,
            email: email
        })
};

export default {
    Auth,
    Reg
};