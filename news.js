var news = require("./telenews");
var express = require("express");

var port = process.argv[2];

var web;

var app = express.createServer()
  , io = require('./socket.io').listen(app)
  , fs = require('fs');
  
var s = new news.Switch();
s.on("telex", function(telex){
  console.log("Incoming telex: "+ JSON.stringify(telex));
});

s.on("find", function(telex){
  console.log("Find request issued from: "+ telex["+host"]);
});




app.listen(port || 8080);
setInterval(function(){

    console.log("PORT: "+app.address().port);
}, 10000);

app.use(express.static(__dirname + '/public'));


io.sockets.on('connection', function (socket) {
  console.log("OPENING SOCKET");
  //console.log(socket);
  var queries = [];
    
  //websocket event trigger  
  //socket.emit('news', { hello: 'world' });
  
  var sendback = function(telex, query, data){
    if(telex["+result"] == data.query){
      var host = parseInt(telex["+host"]);
      if(query.include(host) == false && telex["+host"] != query.host){
        console.log("HOSTS: " + query.hosts);
        console.log("FOUND RESULTS: " + JSON.stringify(telex["+data"]));
        if(telex["+data"] != null){
          socket.emit("news", telex);
        }
        query.hosts.push(host);
      }
    }
  }
  
  socket.on('data', function (data) {
    console.log(data);
    if(data.query){
      var query = new news.Query();
      queries.push(query);
      query.switch = s;
      query.hosts = [];  
      
      
      query.find(data.query); 
      //socket.emit("news", "wtf");
      s.on("results", function(telex){
        sendback(telex, query, data);
      });
     
        
    }
  });
  
  socket.on('id', function(data){
    //query.id = data;
  });
  
  
  
  //var queryString = "description:partyin";


  socket.on('disconnect', function(){
    console.log("CLOSING SOCKET");
    //query.stop();
    queries.forEach(function(query){
      console.log("Stopping " + JSON.stringify(query));
      query.stop();
    });
  });
  
  
});














