const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const Issue = require("./issue.js")

const app = new express();


app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/api/issues', (req, res) => {
    db.collection('issues').find().toArray().then(issues => {
        const metadata = {total_count: issues.length};
        res.json({_metadata: metadata, records: issues});
    }).catch(err => {
        console.log('Error: ' + err);
        res.status(500).json({ message: `Internal server error ${err}` });
    });
}); 

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.created = new Date();

    if (!newIssue.status)
        newIssue.status = "New";
    
    const err = Issue.validateIssue(newIssue);
    
    if (err) {
        res.status(422).json({message: `invalid request: ${err}`});
        return;
    }

    db.collection('issues').insertOne(newIssue).then(result => 
        db.collection('issues').find({_id: result.insertedId}).limit(1).next()
    ).then(newIssue => {
        res.json(newIssue);
    }).catch(err => {
        console.log('Error: ' + err);
        res.status(500).json({message: `Internal server error ${err}`});
    });
});

let db;
MongoClient.connect('mongodb://localhost/issuetracker').then(connection => {
    db = connection;
    app.listen(3000, function() {
        console.log("started at 3000");
    });
}).catch(err => {
    console.log('Error: ' + err);
});


