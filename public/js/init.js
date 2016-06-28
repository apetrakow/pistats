var iourl = window.location.protocol+'//';
    iourl+= window.location.hostname;
    iourl+= (window.location.port=='')? ':3344' : ':'+window.location.port;
var socket = io.connect(iourl);

var Updater = function(t, e, d) {
    this.refreshtime    = 1;
    this.event          = '';
    this.data           = {};
    this.interVal       = 0;

    this.init           = function(t,e,d) {
        this.refreshtime = t;
        this.event = e;
        this.data = d;
    };

    this.countElements = function(obj) {
        var l = 0;
        for(i in obj) {
            l++;
        }
        return l;
    }

    this.start          = function() {
        var func = "socket.emit(";
            func+= "'" + this.event + "'";
            if(this.data){
                func+= ", {";
                l = this.countElements(this.data);
                c = 0;
                for(index in this.data){
                    func+= index + ": '" + this.data[index] + "'"; c++;
                    if(l > c) func+=",";
                }
                func+= "}";
            }
            func+= ");";
        this.interVal = setInterval(func, this.refreshtime * 1000);
    };

    this.stop           = function(){
        clearInterval(this.interVal);
    }

    this.init(t, e, d);
    this.start();
}

var State = {
    current : 'default',
    last: 'default'
};

var witchClass = function() {
    if( $('.page-header').hasClass('btn-primary') ) {return 'btn-primary'} else
    if( $('.page-header').hasClass('btn-warning') ) {return 'btn-warning'} else
    if( $('.page-header').hasClass('btn-danger') ) {return 'btn-danger'};
}
