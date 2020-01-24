var express = require('express'),
    cors = require('cors'),
    MongoClient = require('mongodb').MongoClient,
    moment = require('moment')

var app = express();

app.use(cors());

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'local';

// Database connection
var db;

MongoClient.connect(url + '/' + dbName, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, function (err, client) {
    if (err) throw err

    db = client.db(dbName);

    app.listen(8080);
})

// Error function
function error(err, status, res) {
    console.log("Error " + status + ": " + err);
    return res.status(status).send({ status: err }).end();
}

// Date validation middleware
function validateDates(req, res, next) {
    var from = moment.invalid();
    var to = moment.invalid();

    try {
        if (req.query.from) {
            from = moment(req.query.from, 'YYYY/MM/DD', true);
            if (!from.isValid()) error('Bad request: Invalid dates', 400, res);
        }
        
        if (req.query.to) {
            to = moment(req.query.to, 'YYYY/MM/DD', true);
            if (!to.isValid()) error('Bad request: Invalid dates', 400, res);
        }
        
        if (req.query.from && req.query.to && from.isAfter(to)) error('Bad request: Invalid dates', 400, res);
    } catch {
        error('Bad request: Invalid dates', 400, res);
    }

    res.locals.from = from;
    res.locals.to = to;

    // If no errors have occurred, continue to next matching route
    if (!res.headersSent) next();
}

// Get cars with registration date between two dates
app.get('/carsBetweenDates', validateDates, (req, res) => {
    var where = {};
    var field = {};
    if (res.locals.from.isValid()) where.$gte = res.locals.from.toDate();
    // Add 1 day so we can ignore hours (E.g.: '2020/01/01 00:00:00' < '2020/01/01 08:30:00')
    if (res.locals.to.isValid()) where.$lte = res.locals.to.add(1, 'days').toDate();
    // Is 'where' empty? 
    if (Object.keys(where).length !== 0 && where.constructor === Object) field = { registrationDate : where }

    // Query the database. Field will be {} if neither 'from' nor 'to' have been specified as a query parameter or filled with 
    db.collection('cars').find(field).toArray(function (err, result) {
        if (err) {
            error(err, 500, res);
        } else {
            res.send(result);
        }
    })
})
