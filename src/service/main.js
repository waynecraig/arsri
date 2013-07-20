var express = require('express'),
	query = require('./query');

var app = express();

app.use('/upload', express.static('upload'));
app.use('/lib', express.static('lib'));
app.use('/', express.static('release/static'));
app.get('/q', function (req, res) {
	query.handleQuery(req, res);
});

var port = 8000;
app.listen(port, function() {
	console.log('Service is started on port ' + port);
});