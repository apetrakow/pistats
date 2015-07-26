var express = require('express');
var router = express.Router();
var pm2 =   require('pm2');
var plist = [{pid:'0', name:'test', monit: {memory:0}}];


/* GET users listing. */
router.get('/', function(req, res) {

    pm2.connect(function(err){
        if(err) throw new Error(err);
        pm2.list( function(err, process_list){
            if(err) throw new Error(err);

            plist = process_list;
            for(var proc in plist) {
                plist[proc].monit.memory = parseInt(plist[proc].monit.memory / 1048576) + " MB";
            }


            pm2.disconnect(function(err){ if (err) throw new Error(err);});

            res.render('actions/processes',
            {
                title:'ArchiPi :: Process',
                siteTitle: 'Archi Pi',
                content:plist,
                status: false,
                proc: true
            });
        });
    });


});

module.exports = router;
