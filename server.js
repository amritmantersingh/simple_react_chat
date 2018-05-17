const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();
const logger         = require('express-logger');
var jwt    = require('jsonwebtoken');

var cors = require('cors')


const port = 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(logger({path: "./log.txt"}));

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    require('./app/routes/')(app, database);
    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
});

app.set('superSecret', db.secret);
app.use(authCheck);

function authCheck (req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.get("authorization");
    if ( req.path === '/api/users' || req.path === '/api/user/login') {
        next()
    } else if (token) {
        console.log(res.path);
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