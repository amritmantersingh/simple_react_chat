const ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {

    app.post('/api/user/login', (req,res) => {
        const user = {
            username: req.body.username,
            password: req.body.password,
        };
        db.collection('users').find({username: user.username}).toArray((err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                (item.length && item[0].password) === user.password ?
                res.send({
                        message: 'User '+ user.username + ' successfully authorized',
                        status: 1
                    }) :
                res.send({
                    message: 'Incorrect username or password',
                    status: 0
                });
            }
        });
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