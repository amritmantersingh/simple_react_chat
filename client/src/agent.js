import axios from 'axios';

const env = process.env.NODE_ENV;
const API_ROOT = env === 'production' ? 'http://31.31.201.7:8000/api' : 'http://localhost:8000/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

const token = window.localStorage.getItem('token');
if ( token && token.length ) {
    axios.defaults.headers.common['Authorization'] = token;
} else {
    delete axios.defaults.headers.common.Authorization;
}

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
    check: (done) =>
        requests.get('/').then( res => done( res ) ),
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
    register: (username, email, password, passwordConfirm, done) =>
        requests.post('/users', {
            username: username,
            password: password,
            passwordConfirm: passwordConfirm,
            email: email
        }).then( res => done(res.data) ),
};

const Chat = {
    getMessages: (query) =>
        requests.get('/messages/'+ ( query ? query : '' ) ),
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