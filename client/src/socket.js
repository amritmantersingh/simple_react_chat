import socketIOClient from 'socket.io-client';

export default function (token) {

    const socket = socketIOClient.connect('http://localhost:8000', {query: 'auth_token=' + token})

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
