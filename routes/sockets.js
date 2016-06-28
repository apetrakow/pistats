
var monitor = require('./monitor');

module.exports.initsocket = function(socket) {

    socket
    .on('join', function(data){
        if(data == 'debug') console.log('handson');
        socket.emit('handson');
    })
    .on('updateCPU', function(data){
        var load = monitor.load();
        if(data == 'debug') console.log(load);
        socket.emit('CPUupdate', load);
    })
    .on('updateUT', function(data){
        var uptime = monitor.uptime();
        if(data == 'debug') console.log(uptime);
        socket.emit('UTupdate', uptime);
    })
    .on('updateMEM', function(data){
        var memory = monitor.memory();
        if(data == 'debug') console.log(memory);
        socket.emit('MEMupdate', memory);
    })
    .on('pm2-reset', function(data){
        monitor.pm2reset(socket, data);
    })
    .on('pm2-update', function(data){
        monitor.pm2update(socket, data);
    })
    .on('pm2-restart', function(data){
        monitor.pm2reload(socket, data);
    })
    .on('pm2-stop', function(data){
        monitor.pm2stop(socket, data);
    })
    ;

}
