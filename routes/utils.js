var basicAuth = require('basic-auth');

module.exports.basicAuth = function(username, password) {
    return function(req, res, next) {
        var user = basicAuth(req);

        if (!user || user.name !== username || user.pass !== password) {
            res.set('WWW-Authenticate', 'Basic realm="Pi Stats authentication required"');
            return res.send(401);
        }

        next();
    };
};
