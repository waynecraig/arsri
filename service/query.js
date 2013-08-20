var database = require('./db');

exports.handleQuery = function(req, res) {
	var db = database.getConnection();
	db.collection('meta').find({
		id: 'site'
	}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};