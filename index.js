// Requiring all my dependencies
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
//require mangoose and create a database that takes strings
var mongoose = require('mongoose');
const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/shoe_api";

var app = express();

//getting my Dadabase
mongoose.connect(mongoURL);

var shoeAPISchema = mongoose.Schema({
    regNum: {
        type: String,
        unique: true,
        sparse: true
    }
});

shoeAPISchema.index({
    regNum: 1
}, {
    unique: true
});

var ShoeAPI = mongoose.model('ShoeAPI',shoeAPISchema);

//app using all my dependencies
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 6000 * 30
    }
}));
app.use(flash());








//connecting to my server, running my sever ports 5001 or any available port
const port = process.env.PORT || 5000;

app.listen(port, function(err) {
    if (err) {
        return err;
    } else {
        console.log('server running on port 5000');
    }
});
