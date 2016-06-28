var os = require('os');
var pm2 = require('pm2');
var data = [];

var getLoad = function(){
    return [
        Math.round(os.loadavg()[0] * 100) / 100,
        Math.round(os.loadavg()[1] * 100) / 100,
        Math.round(os.loadavg()[2] * 100) / 100
    ];
}

var getUptime = function(){
    data['uptime'] = os.uptime();
    return getDays(data) + ' Day(s), ' + getHours(data) + ' h, ' + getMinutes(data) + ' m';
}

var getMinutes = function(data){
    return parseInt(data['uptime'] / 60 - (getDays(data) * 1440  + getHours(data) * 60));
}
var getHours = function(data){
    return parseInt(data['uptime'] / 3600 - getDays(data) * 24);
}

var getDays = function(data){
    return parseInt(data['uptime'] / 86400);
}

var getMemory = function() {

    var memory   = parseInt(os.totalmem() / 1048576) + ' MB';
    var free     = parseInt(os.freemem() / 1048576) + ' MB';

    return free + ' / ' + memory;
}

var pm2UpdateState = function(socket, data){
    pm2.connect(function(err){
        if(err) throw new Error(err);

        pm2.describe(data.name, function(err, plist){
            if(err) socket.emit('msg', {msg:"Something went wrong...", err:err});

            var res = {
                name:plist[0].name,
                status: plist[0].pm2_env.status,
                restarts: plist[0].pm2_env.restart_time.toString(),
                memory: parseInt(plist[0].monit.memory / 1048576) + ' MB',
                //msg:{plist:plist}
            }

            socket.emit('p-state', res);

            pm2.disconnect(function(err, proc){ socket.emit('msg', {err:err}) });
        })

    });
}

var pm2Reset = function(socket, data){
    pm2.connect(function(err){
        if(err) throw new Error(err);

        pm2.reset(data.name, function(err, proc){
            if(err) socket.emit('msg', {msg:"Something went wrong...", err:err});

            pm2UpdateState(socket, data);

            pm2.disconnect(function(err, proc){ socket.emit('msg', {msg:{proc:proc}, err:err}); });

        })
    });
}

var pm2Reload = function(socket, data) {
    pm2.connect(function(err) {
        if(err) throw new Error(err);
        pm2.reload(data.name, function(err, proc){
            var res = {
                name: proc[0].name,
                status: proc[0].pm2_env.status,
                restart: proc[0].pm2_env.restart_time,
                memory: parseInt(proc[0].monit.memory / 1048576) + ' MB',
                msg:'Reload successful!',
                err: err
            }

            socket.emit('p-state', res);

            pm2.disconnect(function(err, proc){ socket.emit('msg', {msg:proc, err:err}) });
        })

    })
}

var pm2Stop = function(socket, data) {
    pm2.connect(function(err){
        if(err) throw new Error(err);

        pm2.stop(data.name, function(err, proc){
            if(err) socket.emit('p-state', {name:proc[0].name, status:proc[0].pm2_env.status, msg:err});

            console.log(proc, err);
            //socket.emit('p-state', {name:proc[0].name, status:proc[0].pm2_env.status});

            pm2.disconnect(function(err, proc){ socket.emit('msg', {msg:{proc:proc}, err:err}) });
        })
    })
}

module.exports.load = getLoad;
module.exports.uptime = getUptime;
module.exports.memory = getMemory;

module.exports.pm2reload = pm2Reload;
module.exports.pm2stop = pm2Stop;
module.exports.pm2reset = pm2Reset;
module.exports.pm2update = pm2UpdateState;
