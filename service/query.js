var database = require('./db');

exports.handleQuery = function(req, res) {
	var db = database.getConnection(),
		collection = req.query.collection,
		condition = req.query.condition || {},
		fields = req.query.fields || {};
	if (collection == 'users') return;
	db.collection(collection).find(condition, fields).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
	});

};