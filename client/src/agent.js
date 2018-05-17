import axios from 'axios';

const API_ROOT = 'http://localhost:8000/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

const token = window.localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;

const requests = {
    del: url =>
        axios.del(`${API_ROOT}${url}`).then(responseBody),
    get: url =>
        axios.get(`${API_ROOT}${url}`),
    put: (url, body) =>
        axios.put(`${API_ROOT}${url}`, body).then(responseBody),
    post: (url, body) =>
        axios.post(`${API_ROOT}${url}`, body)
};

const Auth = {
    check: () =>
        requests.get('/'),
    current: () =>
        requests.get('/user'),
    login: (username, password) =>
        requests.post('/user/login', { username: username, password: password }),
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
            passwordConfirm: passwordConfirm,
            email: email
        }),
};

const Chat = {
    getMessages: () =>
        requests.get('/messages/'),
    sendMessage: (username, text) =>
        requests.post('/messages', {
            username: username,
            text: text,
        })
}

export default {
    Auth,
    Reg,
    Chat
};