import socketIOClient from 'socket.io-client';

const env = process.env.NODE_ENV;
const API_URL = env === 'production' ? 'http://31.31.201.7:8000/' : 'http://localhost:8000/';

export default function (token) {

    const socket = socketIOClient.connect(API_URL, {query: 'auth_token=' + token})

    socket.on('error', function (err) {
        console.log('received socket error:');
        console.log(err)
    });

    function login(username, password) {
        socket.emit('login', { username: username, password: password })
    }
    function message(msg) {
        socket.emit('message', { message: msg })
    }
    function getMessages (query) {
        socket.emit('getMessages', query)
    }
    function registerMessageHandler(onMessageReceived) {
        socket.on('messages', onMessageReceived)
    }

    return {
        login,
        message,
        getMessages,
        registerMessageHandler
    }
}
