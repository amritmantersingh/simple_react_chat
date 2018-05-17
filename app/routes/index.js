const userRoutes = require('./routes_user');
const chatRoutes = require('./routes_chat');


module.exports = function(app, db) {
    userRoutes(app, db);
    chatRoutes(app, db);
};