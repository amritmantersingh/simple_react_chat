const ObjectID = require('mongodb').ObjectID;
var jwt    = require('jsonwebtoken');

module.exports = function(app, db) {

    app.options('*', (req, res) => {
        res.status(200).send({
            success: true
        });
    });

    app.post('/api/user/login', (req,res) => {

        var auth = req.get("authorization");
        const user = {
            username: req.body.username,
            password: req.body.password,
        };
        db.collection('users').find({username: user.username}).toArray((err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                if (item.length && item[0].password === user.password) {
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 1440 // expires in 24 hours
                    });
                    res.send({
                            name: user.username,
                            message: 'User '+ user.username + ' successfully authorized',
                            status: 1,
                            token: token
                        });
                } else {
                    res.send({
                        message: 'Incorrect username or password',
                        status: 0
                    });
                }
            }
        });
    });

    app.get('/api', (req, res) => {
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.get("authorization");
        if (token) {
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    res.json({user: decoded, success: true, message: 'valid token!'})
                }
            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    app.get('/api/users/:id', (req, res) => {

        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        db.collection('users').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });

    });

    app.get('/api/usercheck/:name', (req, res) => {

       const username = req.params.name;
       console.log(username);

       db.collection('users').find({username: username}).toArray((err, item) => {
           if (err) {
               res.send({'error':'An error has occurred'});
           } else {
               res.send(item);
           }
       });

    });

    app.post('/api/users', (req, res) => {

        const user = {
            username: req.body.username,
            password: req.body.password,
            password_confirm: req.body.password_confirm,
            email: req.body.email
        };

       console.log(req.body);

        db.collection('users').find({username: user.username}).toArray((err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });

        // db.collection('users').insert(user, (err, result) => {
        //     if (err) {
        //         res.send({ 'error': 'An error has occurred' });
        //     } else {
        //         res.send(result.ops[0]);
        //     }
        // });
    });

    app.delete('/api/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('users').remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('User ' + id + ' deleted!');
            }
        });
    });

    app.put('/api/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const user = {
            username: req.body.username,
            password: req.body.password,
            password_confirm: req.body.password_confirm,
            email: req.body.email
        };
        db.collection('users').update(details, user, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(user);
            }
        });
    });

    app.put('/api/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const user = {
            username: req.body.username,
            password: req.body.password,
            password_confirm: req.body.password_confirm,
            email: req.body.email
        };
        db.collection('users').update(details, user, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(user);
            }
        });
    });

};