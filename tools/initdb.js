var MongoClient = require('mongodb').MongoClient,
    dbConfig = require('../resources/dbconfig.js'),
    initData = require('../resources/init_data.js');

MongoClient.connect(dbConfig.dbUrl, function(err, db) {
    if (err) throw err;

    var taskNum = 0;
    for (var key in initData) {
        taskNum += 1;
        db.collection(key).remove(removeCallback);
    }

    function removeCallback(err) {
        if (err) throw err;
        taskNum -= 1;
        console.log('remove one collection');
        if (taskNum === 0) {
            console.log('complete remove');
            startInsert();
        }
    }

    function startInsert() {
        for (var key in initData) {
            taskNum += 1;
            db.collection(key).insert(initData[key], insertCallback);
        }
    }

    function insertCallback(err, docs) {
        if (err) throw err;

        taskNum -= 1;
        console.log('insert data: ' + docs);
        if (taskNum === 0) {
            console.log('initialize database complete!');
            db.close();
        }
    }
});