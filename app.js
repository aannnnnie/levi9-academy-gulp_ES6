var express = require('express');
var http = require('http');
var path = require('path');
var connect = require('connect');

var app = express();
var app2 = connect();
var port = 3000; 



http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});


app.use(express.static('public'));

app2.use(function (err, req, res, next) {
  console.log(err)
 if( app.get('env') == 'development'){
  var errorHandler = express.errorHandler();
   errorHandler(err, req, res, next);
 }else{
   res.send(500);
 }
});

module.exports = app;