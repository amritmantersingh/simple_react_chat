const ObjectID = require('mongodb').ObjectID;
const jwt    = require('jsonwebtoken');
const moment = require('moment');

module.exports = function(app, db) {

    app.options('*', (req, res) => {
        res.status(200).send({
            success: true
        });
    });

    app.post('/api/messages', (req,res) => {

        const auth = req.get("authorization");
        const message = {
            username: req.body.username,
            dateTime: moment().unix(),
            text: req.body.text,
            id: new ObjectID(req.params.id)
        };

        db.collection('chat.messages').insert( message, (err, result) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    res.send(result.ops[0]);
                }
            });
        });

    app.get('/api/messages/', (req, res, next) => {

            const time = req.params.from;

            db.collection('chat.messages').find().toArray((err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(item);
                }
            });

        });


    // app.get('/api', (req, res) => {
    //     var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.get("authorization");
    //     if (token) {
    //         jwt.verify(token, app.get('superSecret'), function(err, decoded) {
    //             if (err) {
    //                 return res.json({ success: false, message: 'Failed to authenticate token.' });
    //             } else {
    //                 req.decoded = decoded;
    //                 res.json({user: decoded, success: true, message: 'valid token!'})
    //             }
    //         });
    //
    //     } else {
    //         return res.status(403).send({
    //             success: false,
    //             message: 'No token provided.'
    //         });
    //     }
    // });
    //
    // app.get('/api/users/:id', (req, res) => {
    //
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //
    //     db.collection('users').findOne(details, (err, item) => {
    //         if (err) {
    //             res.send({'error':'An error has occurred'});
    //         } else {
    //             res.send(item);
    //         }
    //     });
    //
    // });
    //
    // app.get('/api/usercheck/:name', (req, res) => {
    //
    //     const username = req.params.name;
    //     console.log(username);
    //
    //     db.collection('users').find({username: username}).toArray((err, item) => {
    //         if (err) {
    //             res.send({'error':'An error has occurred'});
    //         } else {
    //             res.send(item);
    //         }
    //     });
    //
    // });
    //
    // app.post('/api/users', (req, res) => {
    //
    //     const user = {
    //         username: req.body.username,
    //         password: req.body.password,
    //         password_confirm: req.body.password_confirm,
    //         email: req.body.email
    //     };
    //
    //     console.log(req.body);
    //
    //     db.collection('users').find({username: user.username}).toArray((err, item) => {
    //         if (err) {
    //             res.send({'error':'An error has occurred'});
    //         } else {
    //             res.send(item);
    //         }
    //     });

        // db.collection('users').insert(user, (err, result) => {
        //     if (err) {
        //         res.send({ 'error': 'An error has occurred' });
        //     } else {
        //         res.send(result.ops[0]);
        //     }
        // });
    // });

    // app.delete('/api/users/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //     db.collection('users').remove(details, (err, item) => {
    //         if (err) {
    //             res.send({'error':'An error has occurred'});
    //         } else {
    //             res.send('User ' + id + ' deleted!');
    //         }
    //     });
    // });

    // app.put('/api/users/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //     const user = {
    //         username: req.body.username,
    //         password: req.body.password,
    //         password_confirm: req.body.password_confirm,
    //         email: req.body.email
    //     };
    //     db.collection('users').update(details, user, (err, result) => {
    //         if (err) {
    //             res.send({'error':'An error has occurred'});
    //         } else {
    //             res.send(user);
    //         }
    //     });
    // });

    // app.put('/api/users/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //     const user = {
    //         username: req.body.username,
    //         password: req.body.password,
    //         password_confirm: req.body.password_confirm,
    //         email: req.body.email
    //     };
    //     db.collection('users').update(details, user, (err, result) => {
    //         if (err) {
    //             res.send({'error':'An error has occurred'});
    //         } else {
    //             res.send(user);
    //         }
    //     });
    // });

};