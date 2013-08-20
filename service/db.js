var MongoClient = require('mongodb').MongoClient,
	dbConfig = require('../../resources/dbconfig.js');

var connection;
MongoClient.connect(dbConfig.dbUrl, function(err, db) {
	if (err) throw err;
	connection = db;
});

exports.getConnection = function() {
	return connection;
};