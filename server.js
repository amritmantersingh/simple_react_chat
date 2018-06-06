const express        = require('express');
const http           = require('http');
const socketIO       = require('socket.io');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();
const logger         = require('express-logger');
const cors           = require('cors');
const compression    = require('compression');

const server = http.createServer(app);
const io = socketIO(server);

const port = 8000;
const myDb = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(logger({path: "./log.txt"}));
app.use(compression());

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);
    require('./app/')(io, database);
    require('./app/routes')(app, database);
    server.listen(port, () => console.log(`Listening on port ${port}`))
});