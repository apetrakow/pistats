var process_state = [];

if(socket != 'undefined') {

    socket
        .on('connect', function(){
            socket.emit('join');

        })
        .on('handson', function(data){
            console.log('IO Connected, what now?');
        })
        .on('msg', function(data) {
            if(data.err) console.error(data.err);
            if(data.msg) console.log(data.msg);
        })
        .on('CPUupdate', function(data) {
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
        .on('p-state', function(data){
            $('.process.' + data.name + ' td:first-child').text(data.status);
            if(data.status === 'offline') { $('.process.' + data.name).removeProp("class").addClass("danger", "process", data.name); } else
            if(data.status === 'online') { $('.process.' + data.name).removeProp("class").addClass("success", "process", data.name); } else
            {
                $('.process.'+data.name).removeProp('class').addClass("primary", "process", data.name);
            }

            if(data.restarts) $('.process.' + data.name + ' td:first-child + td').text(data.restarts);
            if(data.memory) $('.process.' + data.name + ' td:last-child').text(data.memory);

            if(data.msg) console.log(data.msg);
        })
    ;


    $(document).ready( function(){

        var process_actions = $('.process a.label');
        process_actions.each(function(){
            var t = $(this);
            var p = t.attr('data-process');
            var a = t.attr('data-action');

            t.click(function(e){
                e.preventDefault();
                if(a == 'restart' || a == 'stop' && process_state[p] !== 'undefined'){
                    console.log(process_state[p], p);
                    process_state[p].stop();
                }
                socket.emit('pm2-'+a, {name:p});
            });

            process_state[p] = new Updater(30, 'pm2-update', {name:p});
            process_state[p].stop();

        });

    } );

}
