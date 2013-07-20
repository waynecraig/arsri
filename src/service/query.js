var MongoClient = require('mongodb').MongoClient,
	dbConfig = require('../../resources/dbconfig.js');

exports.handleQuery = function(req, res) {
	MongoClient.connect(dbConfig.dbUrl, function(err, db) {
		if (err) throw err;

		db.collection('meta').find({
			id: 'site'
		}).toArray(function(err, result) {
			if (err) throw err;
			//res.send(JSON.stringify(result));
			res.json(result);
			db.close();
		});

	});
};