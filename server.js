var express = require('express');
var app = express();

app.use('/dist', express.static(__dirname + '/dist'));

app.all('*', function(req, res) {
  res
    .set('Content-Type', 'text/html')
    .status(200)
    .sendFile(__dirname + '/views/index.html', function(err) {
      if (err) res.status(err.status).end();
    });
});

app.listen(8000);
