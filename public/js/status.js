var update_proc = [];

if(socket != 'undefined') {
    socket
        .on('connect', function(){
            socket.emit('join');
        })
        .on('handson', function(){
            console.log('IO Connected, what now?');
            // init updater
            update_proc['cpu'] = new Updater(10, 'updateCPU');
            update_proc['mem'] = new Updater(30, 'updateMEM');
            update_proc['uptime'] = new Updater(60, 'updateUT');

        })
        .on('killinterval', function(data){
            if(data.interval) {
                update_proc[data.interval].stop();
            }else{
                for(p in update_proc) {
                    update_proc[p].stop();
                }
                console.log("all updater stopped");
            }
            if(data.msg) console.log(data.msg);
            if(data.err) console.log(data.err);
        })
        .on('CPUupdate', function(data) {
            $('#cpu').html('<code>'+ data[0] + '</code><code>'+ data[1] + '</code><code>' + data[2] + '</code>');

            var state = parseFloat(data[1]);

            if(state < 1.5) { State.current = 'default'; } else
            if(state < 3) { State.current = 'warning'; } else
            if(state >= 3) { State.current = 'danger'; }

            if(State.current != State.last) {
                switch(State.current) {
                case 'warning':
                    $('.page-header').removeClass(witchClass()).addClass('btn-warning');
                    State.last = State.current;
                    break;
                case 'danger':
                    $('.page-header').removeClass(witchClass()).addClass('btn-danger');
                    State.last = State.current;
                    break;
                default:
                    $('.page-header').removeClass(witchClass()).addClass('btn-primary');
                    State.last = State.current;
                    break;
                }
            }

        })
        .on('UTupdate', function(data){
            $('#uptime').text('since ' + data);
        })
        .on('MEMupdate', function(data){
            $('#memory').text(data);
        })
    ;
}
