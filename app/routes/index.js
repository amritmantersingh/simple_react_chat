const userRoutes = require('./routes_user');


module.exports = function(app, db) {
    userRoutes(app, db);
    // Тут, позже, будут и другие обработчики маршрутов
};