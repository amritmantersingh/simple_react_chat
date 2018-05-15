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