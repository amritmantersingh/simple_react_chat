const validator      = require('validator');
const jwt            = require('jsonwebtoken');
const secret         = require('../config/signature');

const Errors = {
    all: {
        requiredFileds: 'All fields is required',
        loginFailed: 'Incorrect username or password',
        noToken: 'No token provided',
        invalidToken: 'Failed to authenticate token',
        undefined: 'An error has occurred'
    },
    username: {
        missed: 'Username is required.',
        tooShort: 'Username must be at least 3 characters',
        userExist: 'Username already used. Please choose another one.',
        invalid: 'The username must be alphanumeric characters only.'
    },
    email: {
        emailExist: 'Email already used. Please choose another one.',
        missed: 'Email is required.',
        invalid: 'Email address is incorrect'
    },
    password: {
        missed: 'Password is required.',
        tooShort: 'Password must be at least 4 characters.',
        confirmInvalid: 'Confirmation not match with you password.'
    }
}
module.exports = ( app, db ) => {

    app.get('/api', (req, res) => {

        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.get("authorization");

        if (token) {
            jwt.verify(token, secret.secret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: Errors.all.invalidToken });
                } else {
                    req.decoded = decoded;
                    res.json({user: decoded, success: true, message: 'valid token!'})
                }
            });
        } else {
            return res.send({
                success: false,
                message: Errors.all.noToken
            });
        }
    });

    app.post('/api/user/login', (req,res) => {
        const user = {
            username: req.body.username,
            password: req.body.password,
        };
        db.collection('users').find({username: user.username}).toArray((err, item) => {
            if (err) {
                res.send({'error':Errors.all.undefined});
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
                        message: Errors.all.loginFailed,
                        status: 0
                    });
                }
            }
        });
    });

    app.post('/api/users', (req, res) => {

        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }
        let errors = {};
        const validateUserData = () => {
            ( !user.username.length && !user.password.length && !req.body.passwordConfirm.length && !user.email.length) ? errors.common = Errors.all.requiredFileds: null;
            user.password && user.password !== req.body.passwordConfirm ? errors.password = Errors.password.confirmInvalid: null;
            !validator.isEmail(user.email) ? errors.email = Errors.email.invalid : null;
            !validator.isAlphanumeric(user.username) ? errors.username = Errors.username.invalid : null;
            user.username.length < 3 ? errors.username = Errors.username.tooShort : null;
            user.password.length < 4 ? errors.password = Errors.password.tooShort: null;
            !user.username.length ? errors.username = Errors.username.missed : null;
            !user.email.length ? errors.email = Errors.email.missed : null;
            !user.password.length ? errors.password = Errors.password.missed : null;
            !req.body.passwordConfirm.length ? errors.pasword = Errors.password.missed : null;
        };
        validateUserData();
        if ( Object.keys(errors).length !== 0 ) {
            res.send({'error': errors})
        } else {
            db.collection('users').find({username: user.username}).toArray((err, item) => {
                if (err) {
                    res.send({'error': {common: Errors.all.common }});
                } else if (item.length) {
                    res.send({'error': {username: Errors.username.userExist }});
                } else  {
                    db.collection('users').insert(user, (err, item) => {
                        if (err) {
                            res.send({ 'error': { common: Errors.all.common }});
                        } else {
                            res.send(Object.assign({success: true},item));
                        }
                    })
                }
            });
        }
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