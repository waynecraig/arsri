var express = require('express'),
    account = require('./account'),
    query = require('./query');
    update = require('./update');

var app = express();

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({
        secret: 'arsri'
    }));
    account.init(app);
});


app.use('/upload', express.static('upload'));
app.use('/lib', express.static('lib'));
app.use('/', express.static('public'));
app.get('/q', function(req, res) {
    query.handleQuery(req, res);
});
app.get('/admin/*', account.ensureAuthenticated);
app.post('/admin/s', function (req, res) {
    update.handleSave(req, res);
});


var port = 8000;
app.listen(port, function() {
    console.log('Service is started on port ' + port);
});