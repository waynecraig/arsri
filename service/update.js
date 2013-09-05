var database = require('./db'),
	ObjectID = require('mongodb').ObjectID;

exports.handleUpdate = function(req, res) {
	var db = database.getConnection(),
		collection = req.body.collection,
		data = req.body.data || {};
	if (data._id) {
		var _id = new ObjectID(data._id);
		delete data._id;
		db.collection(collection).update({_id: _id}, {$set:data}, function(err, result) {
			if (err) throw err;
			else if (result) res.json(result);
		});
	}
};