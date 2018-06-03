const jwt            = require('jsonwebtoken');
const secret         = require('../config/signature');

module.exports = ( app, db ) => {

    app.get('/api', (req, res) => {

        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.get("authorization");

        if (token) {
            jwt.verify(token, secret.secret, function(err, decoded) {
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

    app.post('/api/user/login', (req,res) => {
        const user = {
            username: req.body.username,
            password: req.body.password,
        };
        console.log(user);
        db.collection('users').find({username: user.username}).toArray((err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                if (item.length && item[0].password === user.password) {
                    var token = jwt.sign(user, secret.secret, {
                        expiresIn: 144000 // expires in 24 hours
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

    app.post('/api/users', (req, res) => {

        const user = req.body;

        if (
            !user.username.length
            || !user.password.length
            || !user.passwordConfirm.length
            || !user.email.length
        ) {
            res.send({'error':'All fields is required.'});
        } else if ( user.password && user.password !== user.passwordConfirm) {
            res.send({'error':'Try to retype password.'});
        }

        db.collection('users').find({username: user.username}).toArray((err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else if (item.length) {
                res.send({'error':'User already exist.'});
            } else  {
                db.collection('users').insert(user, (err, item) => {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        res.send(item);
                    }
                })
            }
        });

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

};