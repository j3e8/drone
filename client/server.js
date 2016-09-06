var app = require('express')();
var http = require('http').Server(app);
const PORT = 3001;

app.get('/', function(req, res){
  res.sendFile('pages/play/play.html', { root: __dirname });
});
app.get('/bundle.js', function(req, res){
  res.sendFile('bundle.js', { root: __dirname });
});
app.get('/bundle.css', function(req, res){
  res.sendFile('bundle.css', { root: __dirname });
});
app.get('/assets/*', function(req, res){
  res.sendFile(req.url, { root: __dirname });
});
app.get('/components/*', function(req, res){
  res.sendFile(req.url, { root: __dirname });
});

http.listen(PORT, function() {
  console.log('listening on port ', PORT);
});