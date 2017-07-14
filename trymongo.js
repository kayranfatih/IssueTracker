'use strict';
const MongoClient = require('mongodb');

function usage() {
    console.log("Usage : ");
    console.log('node', '_filename', '<option>');
    console.log('where option is one of: ');
    console.log(' callbacks Use callback paradigm');
    console.log(' promises  Use promises paradigm');
    console.log(' generator Use generator paradigm');
    console.log(' async     Use async paradigm');
}

if (process.argv.length < 3) {
    console.log("incorrect");
    usage();
}
else {
    if (process.argv[2] === 'callbacks')
        testWithCallbacks();
    else if (process.argv[2] === 'promises')
        testWithPromises();
    else if (process.argv[2] === 'generator')
        testWithGenerator();
    else if (process.argv[2] == 'async')
        testWithAsync();
    else
        console.log("invalid");
}

function testWithCallbacks() {
    MongoClient.connect('mongodb://localhost/playground', function(err, db) {
        db.collection('employees').insertOne({id:1, name: 'A. Callback'}, function (err, result) {
            console.log('Result of inserted: ' + result.insertedId);
            db.collection('employees').find({id:1}).toArray(function(err, docs) {
                console.log('Result of find' + docs.map(all => console.log(all)));
                db.close();
            });
        });
    });
}

function testWithPromises() {
    let db;
    MongoClient.connect('mongodb://localhost/playground').then(connection => {
        db = connection;
        return db.collection('employees').insertOne({id:1, name: 'B. promises'});
    }).then(result => {
        console.log('Result of inserted ID' + result.insertedId);
        return db.collection('employees').find({id: 1}).toArray();
    }).then(docs => {
        console.log('Result of find' + docs);
        db.close();
    }).catch(err => {
        console.log('Error: ' + err);
    });
}

function testWithGenerator() {
    const co = require('co');
    co(function*() {
        const db = yield MongoClient.connect('mongodb://localhost/playground');

        const result = yield db.collection('employees').insertOne({id: 1, name: 'C. gGenerator'});
        console.log('Result of insert: ' + result.insertedId);

        const docs = yield db.collection('employees').find({id: 1}).toArray();
        console.log('Result of find' + docs.map(all => console.log(all)));

        db.close();
    }).catch(err => {
        console.log('Error: ' + err);
    });
}

function testWithAsync() {
    const db = MongoClient.connect('mongodb://localhost/playground');

    let result = db.collection('employees').insertOne({id:10, name: 'D. nothing'});
    console.log('Result of insert: ' + result.insertId);
    
    let docs = db.collection('employees').find().toArray();
    console.log('Result find: ' + docs);
}