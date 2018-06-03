const express        = require('express');
const http           = require('http');
const socketIO       = require('socket.io')
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();
const logger         = require('express-logger');
const jwt            = require('jsonwebtoken');
const jwtAuth        = require('socketio-jwt-auth');

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

var cors = require('cors')


const port = 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(logger({path: "./log.txt"}));

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    require('./app/routes/')(app, database);
    server.listen(port, () => console.log(`Listening on port ${port}`))
    // app.listen(port, () => {
    //     console.log('We are live on ' + port);
    // });
});
// using middleware
io.use(jwtAuth.authenticate({
    secret: 'superSecret',    // required, used to verify the token's signature
    algorithm: 'HS256',        // optional, default to be HS256
    succeedWithoutToken: true
}, function(payload, done) {
    // done is a callback, you can use it as follows
    console.log(payload)
    const user = {
        username: payload.username,
        password: payload.password,
    };
    db.collection('users').find({username: user.username}).toArray((err, item) => {
        if (err) {
            return done(err);
        } else {
            if (item.length && item[0].password === user.password) {
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 144000 // expires in 24 hours
                });
                res.send({
                    name: user.username,
                    message: 'User '+ user.username + ' successfully authorized',
                    status: 1,
                    token: token
                });
                return done(null, user);
            } else {
                return done(null, false, 'Incorrect username or password');
            }
        }
    });
}));
app.set('superSecret', db.secret);
app.use(authCheck);
io.on('connection', socket => {
    console.log('User connected')
    socket.on('message', (message) => {
        console.log(message)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})
function authCheck (req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.get("authorization");
    if ( req.path === '/api/users' || req.path === '/api/user/login' ) {
        next()
    } else if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                if (req.path === '/api/') {
                    req.decoded = decoded;
                    res.json({user: decoded, success: true, message: 'valid token!'})
                } else {
                    next()
                }
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}