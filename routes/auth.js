
var auth = require('basic-auth');

var authorized = {
    '': { password: ''}
};

module.exports = function(req, res, next) {
    var user = auth(req);

    if (!user || !authorized[user.name] || authorized[user.name].password !== user.pass ) {
        res.set('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).send();
    }

    return next();

};
