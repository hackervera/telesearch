var sys = require("sys");
var telehash = require("./telehash");
var request = require("request");
var events = require( "events" );
var fs = require("fs");
var _ = require("underscore");
var endHash = new telehash.Hash("208.68.163.247:42424");
var hostname = new Date().getTime();
var s = new telehash.createSwitch(undefined, undefined, undefined);
var loaded;

var Telenews = function(){
    var self = this;
    this.on("seeded", function(){
        //console.log("seeking");
        if(!self.query){
            return
        }
        var telex = {
            "+news": 1,
            "+host": hostname,
            "+find": self.query,
            //"+end": new telehash.Hash("+find").toString()
        }
        self.sendTelex(telex);
        
    
    });

    events.EventEmitter.call(this);
    return(this);
}

Telenews.prototype = new events.EventEmitter();

Telenews.prototype.sendTelex = function(telex){
    var self = this;
    telehash.keys(s.master)
    .filter(function(x) { return s.master[x].ipp != s.selfipp; })
    .sort(function(a,b) { return endHash.distanceTo(a) - endHash.distanceTo(b) })
    .slice(0,3)
    .forEach(function(ckey){
        var target = s.master[ckey].ipp;
        if (!target) {
            return;
        }
        console.log("Target: "+target);
        telex = _.extend(new telehash.Telex(target), telex);
        telex["+end"] = endHash.toString();
        telex["+guid"] = new Date().getTime();
        telex["+time"] = new Date().toString();
        telex["_hop"] = 1;
        console.log("Sending telex: "+JSON.stringify(telex));
        s.send(telex);
    });

    
}

Telenews.prototype.wait = function(key, callback){
    var self = this;
    console.log("waiting on key: "+key);
    if(!loaded){
        var tap = {};
        tap.is = {};
        tap.is["+end"] = endHash.toString();
        tap.has = [key];
        s.addTap(tap);
        loaded = true;
    }
    s.on(key, function(remoteipp, telex, line) {
        telex["remoteipp"] = remoteipp;
        callback(telex);
    });


}

Telenews.prototype.findData = function(query){
    console.log("FINDING "+query);
    var self = this;
    try {
        var data = JSON.parse(fs.readFileSync(self.serve, 'utf8'));
        var message = data[query];
    }
    catch(e){
        console.log("returning "+e);
        return;
    }
    if(message == undefined){
        return;
    }
    
    var telex = {
        "+news": 1,
        "+result": query,
        "+host": hostname,
        "+message": message
    }
    self.sendTelex(telex);
}


Telenews.prototype.seeded = function(self){  
    //console.log("called seeded callback");
    self.emit("seeded");
 
}

Telenews.prototype.guids = [];


Telenews.prototype.start = function(){
    var self = this;
    if(!loaded){
        s.start(function(){  });
    }


}


Telenews.prototype.waitNews = function(){
    var self = this;
    this.wait("+news", function(telex){
        console.log(telex);
    
        if(telex["+find"] && telex["+host"] != hostname){
            self.findData(telex["+find"]);
        }
        if(telex["+result"]){
            var guid = telex["+host"];
            if(telex["+result"] == self.query){
               if(!(_.include(self.guids,guid))){
                    self.emit("result", telex);
                    self.guids.push(guid);
                }
            }
        }
    });

}

exports.Telenews = Telenews;









