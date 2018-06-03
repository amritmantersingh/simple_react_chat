const jwt            = require('jsonwebtoken');
const jwtAuth        = require('socketio-jwt-auth');
const secret         = require('../config/signature');
const ObjectID       = require('mongodb').ObjectID;
const moment         = require('moment');

module.exports = function(app, db) {

    app.use(jwtAuth.authenticate({
        secret: secret.secret,
        algorithm: 'HS256',
    }, function (payload, done) {
        db.collection('users').findOne({username: payload.username}, (err, user) => {
            if (err) {
                console.log(err);
                return done(err)
            }
            if (!user) {
                return done(null, false, 'user does not exist');
            }
            return done(null, user, 'Success');
        })
    }));

    app.on('connection', socket => {

        console.log('User connected');

        socket.on('message', (data) => {
            const message = {
                username: data.message.username,
                dateTime: moment().unix(),
                text: data.message.text,
                id: new ObjectID(data.message.id)
            };
            db.collection('chat.messages').insert( message, (err, result) => {
                if (err) {
                    socket.emit('error',err);
                } else {
                    app.emit('messages', result.ops);
                }
            });
        });

        socket.on('getMessages', ( data ) => {

            const query = data.isBefore ? '$lt' : '$gt';
            const timestamp = parseInt((data.ts || moment().unix()), 10);
            const count = data.count || 20;

            const searchQuery = {};
            searchQuery[query] = timestamp;

            db.collection('chat.messages').find( { 'dateTime': searchQuery } ).toArray( ( err, item ) => {
                if (err) {
                    console.log({'error':'An error has occurred'});
                } else {
                    let result = item.sort( ( a, b ) => { return a.dateTime - b.dateTime });
                    result = query === '$lt' ? result.slice(Math.max(result.length - count, 1)) : result.slice(0, count)
                    socket.emit('messages', result);
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
};