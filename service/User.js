var MongoClient = require('mongodb').MongoClient,
	dbConfig = require('../resources/dbconfig.js');

exports.findOne = function(q, callback) {
	MongoClient.connect(dbConfig.dbUrl, function(err, db) {
		if (err) throw err;

		db.collection('users').find(q).toArray(function(err, result) {
			var user;
			if (!err) {
				user = result[0];
				user.validPassword = function () {
					return true;
				};
			}
			callback(err, user);
			db.close();
		});

	});
};