var express = require('express');
var router = express.Router();
var os = require('os');
var monitor = require('./monitor');

var getStatus = function(res,view,dataObj) {
    dataObj.memory   = parseInt(os.totalmem() / 1048576) + ' MB';
    dataObj.free     = parseInt(os.freemem() / 1048576) + ' MB';
    dataObj.load    = monitor.load();
    dataObj.uptime = monitor.uptime();

    res.render(view, dataObj);
}

router.get('/', function(req, res) {
    res.redirect('/pistate');
});

/* GET home page. */
router.get('/pistate', function(req, res) {
    getStatus(res, 'actions/status', {
        title: 'ArchiPi :: Status',
        siteTitle: 'Archi Pi',
        status: true,
        proc: false
    });
});

module.exports = router;
