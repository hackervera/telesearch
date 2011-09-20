var sys = require("sys");
var telehash = require("./telehash");
var request = require("request");
var events = require( "events" );
var fs = require("fs");
var _ = require("underscore");
var hostname = new Date().getTime();
var endHash = new telehash.Hash("search");
var loaded;

var cl = require('clucene').CLucene;
var lucene = new cl.Lucene();
var doc = new cl.Document();


var Switch = function(){
  var self=this;
  self.start();
  self.host = hostname;
  var tap = {};
  tap.is = {};
  tap.is["+end"] = endHash.toString();
  tap.has = ["+news"];
  self.addTap(tap);
  self.on("+news", function(remoteipp, telex, line) {
    self.host = telex["_to"];
    //console.log("incoming telex: "+ telex);
    self.emit("telex", telex);
    if(telex["+find"]){
      //self.emit("find", telex);
      lucene.search('./index', telex["+find"], function(err, results, searchTime){
        //self.emit("results", results);
        self.sendTelex([
          {keyName:"+result", keyValue:telex["+find"]},{keyName:"+data", keyValue:results}
        ]);
      });
    }
    if(telex["+result"]){
      self.emit("results", telex);
    }
  });

    
}
Switch.prototype = new telehash.createSwitch(undefined, undefined, undefined);

Switch.prototype.sendTelex = function(keys){
    var self = this;
    telehash.keys(self.master)
    .filter(function(x) { return self.master[x].ipp != self.selfipp; })
    .sort(function(a,b) { return endHash.distanceTo(a) - endHash.distanceTo(b) })
    .slice(0,3)
    .forEach(function(ckey){
        var target = self.master[ckey].ipp;
        if (!target) {
            return;
        }
        console.log("Target: "+target);
        telex = new telehash.Telex(target);
        telex["+news"] = true;
        telex["+end"] = endHash.toString();
        telex["+host"] = self.host || hostname;
        keys.forEach(function(key){
          telex[key.keyName] = key.keyValue;
        });
        telex["_hop"] = 1;
        console.log("Sending telex: "+JSON.stringify(telex));
        self.send(telex);
    });

    
}


var Query = function(){}
Query.prototype.find = function(query){
  var self = this;
  self.host = hostname;
  self.callback = function(){
    self.switch.sendTelex([{keyName:"+find", keyValue: query}]);
  }
  self.timerId = setInterval(self.callback, 10000);
}
Query.prototype.stop = function(){
  var self = this;
  clearInterval(self.timerId);
}
Query.prototype.include = function(host){
  var self = this;
  var ret;
  if (_.include(self.hosts, host)){
    ret = true
  }
  else { ret = false }
  
  return ret;
}

exports.Query = Query;
exports.Switch = Switch;









