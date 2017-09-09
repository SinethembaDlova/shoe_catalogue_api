// Requiring all my dependencies
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var morganLogger = require("morgan")
//require mangoose and create a database that takes strings
var mongoose = require('mongoose');
const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/shoe_api";

var app = express();

//getting my Dadabase
mongoose.connect(mongoURL);

var shoeAPISchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        sparse: true
    },
    color : String,
    brand : String,
    price : Number,
    in_stock : Number
});

shoeAPISchema.index({
    id: 1
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
app.use(morganLogger("dev"));


//getting my routes
//	List all shoes in stock
app.get('/api/shoes', function(req,res){
  ShoeAPI.find({}, function(err, shoes){
    if (err) {
      console.log();
    }
    else {
      res.json(shoes)
    }
  })

});

//	List all shoes for a given brand
app.get('/api/shoes/brand/:brandname', function(req,res){

});

//	List all shoes for a given size
app.get('/api/shoes/size/:size', function(req,res){

});

//	List all shoes for a given brand and size
app.get('/api/shoes/brand/:brandname/size/:size', function(req,res){

});

//	Update the stock levels when a shoe is sold
app.post('/api/shoes/sold/:id', function(req,res){

});


//	Add a new new shoe to his stock.
app.post('/api/shoes', function(req,res){

  var addedItems = req.body;

  var shoe = new ShoeAPI(addedItems);

  shoe.save(function(err,shoes){
    if(err){
      console.log(err);
    }
    else {
      console.log("Item added successfully");;
    }
  })

});

/*app.use(function(req,res,next){
  var err = new Error("Not found");
  err.status = 404;
  next(err);
});

/*app.use(function(req,res,next){
  res.status(err.status || 500);
  res.json({
          error: {
                messsage: err.message
        }
})
});*/


//connecting to my server, running my sever ports 5001 or any available port
const port = process.env.PORT || 5000;

app.listen(port, function(err) {
    if (err) {
        return err;
    } else {
        console.log('server running on port 5000');
    }
});
