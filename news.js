var news = require("./telenews");




var database = process.argv[2];

var web;





var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(0);
setInterval(function(){

    console.log("PORT: "+app.address().port);
}, 10000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    
    

    
    

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {

    var telenews = new news.Telenews();
    telenews.serve = database;
    telenews.start();
    telenews.waitNews();
    
    telenews.on("result", function(result){
        console.log(result);
        result["+message"].forEach(function(message){
            
            socket.emit('news', "<p>"+message+"</p>");
        });
    });
    
   var interval = setInterval(function(){
        telenews.emit("seeded");
    }, 10000);

    socket.on('disconnect', function(){
        clearInterval(interval);
    });
    
    
  socket.emit('news', { hello: 'world' });
  socket.on('data', function (data) {
    console.log(data);
    if(data.query){
        telenews.query = data.query;
        telenews.guids = [];
        
    }
  });
  
  
});










