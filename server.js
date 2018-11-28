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

    app.listen(app.get('port'), function() {
        console.log('Server started: http://localhost:' + app.get('port') + '/');
    });
})

var db;
var APP_PATH = path.join(__dirname, 'dist');

app.set('port', (process.env.PORT || 3000));

app.get('/api/usernames', function(req, res) {
    var usernamesList = usernamesDB.collection('usernames').find({}).toArray((err, result) => {
        console.log("Result: " + result);
        if(err) throw err;
        res.json(result);
    });
});



app.use('/', express.static(APP_PATH));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use('*', express.static(APP_PATH));



app.post('/api/usernames', function(req, res, next) {
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
    usernamesDB.collection('usernames').remove(req.body);
})

