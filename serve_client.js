const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((request, response) => {
    return handler(request, response, {
        "public": "./client/build"
    });
})

server.listen(3000, () => {
    console.log('Running chat client at http://localhost:3000');
});