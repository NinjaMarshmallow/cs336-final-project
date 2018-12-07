/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// MongoDB variables
var username = 'cs336'
var password = process.env.MONGO_PASSWORD
var host = 'ds119273.mlab.com'
var port = '19273'
var database = 'tic-tac-toe'
var usernamesDB = null;

var mclient = require('mongodb').MongoClient

mclient.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`, function (err, client) {
    if (err) throw err
    usernamesDB = client.db(database);
})

var db;
var APP_PATH = path.join(__dirname, 'dist');

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.get('/api/usernames', function(req, res) {
    var usernamesList = usernamesDB.collection('usernames').find({}).toArray((err, result) => {
        console.log("Result: ");
        console.log(result);
        if(err) throw err;
        res.json(result);
    });
});

app.get('/api/challenges', function(req, res) {
    console.log("GET")
    console.log(req.query)
    usernamesDB.collection('challenges').find({opponent: req.query.username}).toArray((err, result) => {
        if (err) throw err
        console.log("Result GET /api/challenges/");
        console.log(result);
        if(result === undefined || result.length == 0) {
            res.statusCode = 201;
            res.send({result: "No Challenges"});
        } else {
            res.send({result: result[0].username});
        }
    });
});

app.post('/api/usernames', function(req, res, next) {
    console.log("POST /usernames" + req.body);
    usernamesDB.collection('usernames').find({username: req.body.username}).toArray((err, result) => {
        if (err) throw err
        if(result === undefined || result.length == 0) {
            usernamesDB.collection('usernames').insert({
                username: req.body.username,
            });
            res.statusCode = 200;
            res.send({result: "Success"});
        } else {
            res.statusCode = 403;
            next(new Error("Username Taken"));
        }
    })
});

app.delete('/api/usernames', function(req, res) {
    console.log("Delete Request");
    console.log(req.body);
    var username = (req.body.username);
    try {
        usernamesDB.collection('usernames').remove(req.body);
    } catch(e) {
        console.log(e);
    }
})

app.delete('/api/challenges', function(req, res) {
    console.log("Delete Request /api/challenges");
    console.log(req.body);
    try {
        usernamesDB.collection('challenges').remove({username: req.body.username});
        usernamesDB.collection('challenges').remove({opponent: req.body.username});
    } catch(e) {
        console.log(e);
    }
})

app.post('/api/challenges', function(req, res) {
    console.log("POST" + req.body.username)
    usernamesDB.collection('challenges').find({username: req.body.username}).toArray((err, result) => {
        if (err) throw err
        if(result === undefined || result.length == 0) {
            usernamesDB.collection('challenges').insert(req.body);
            res.send({result: "Challenge Issued."    });
        } else {
            res.statusCode = 201;
            res.send({result: "Challenge Already Sent..."});
        }
    });
    
});

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use('/', express.static(APP_PATH));
app.use('*', express.static(APP_PATH));

app.listen(app.get('port'), function() {
        console.log('Server started: http://localhost:' + app.get('port') + '/');
    });