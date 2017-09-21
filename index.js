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
    brand: String,
    image: String,
    color: String,
    size : Number,
    price: Number,
    in_stock: Number
});

shoeAPISchema.index({
    id: 1
}, {
    unique: true
});

var ShoeAPI = mongoose.model('ShoeAPI', shoeAPISchema);

//app using all my dependencies
app.use('/', express.static('public'));
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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
        return res.status(200).json({});
    }
    next();
})


//getting my routes
//	List all shoes in stock
app.get('/api/shoes', function(req, res) {
    ShoeAPI.find({}, function(err, shoes) {
        if (err) {
            res.json({
                response: 'Failed to GET a query for all shoes.',
                error: err,
                status: 500,
                data: results
            });
        } else {
            res.json({
                status: 200,
                response: 'Got a GET query for all shoes.',
                data: shoes
            })
        }
    })

});

//	List all shoes for a given brand
app.get('/api/shoes/brand/:brandname', function(req, res) {

    var shoeBrand = req.params.brandname;

    ShoeAPI.find({
        brand: shoeBrand
    }, function(err, thisBrand) {

        if (err) {
            res.json({
                status: 500,
                response: 'Failed to GET a query for this shoe brand',
                error: err
            });
        } else {
            res.json({
                status: 200,
                response: 'Got a GET query for this shoe brand.',
                error: err,
                data: thisBrand
            });
        }


    })
});

//	List all shoes for a given size
app.get('/api/shoes/size/:size', function(req, res) {

  var shoeSize = req.params.size;

  ShoeAPI.find({
      size: shoeSize
  }, function(err, thisBrand) {

      if (err) {
          res.json({
              status: 500,
              response: 'Failed to GET a query for this shoe size',
              error: err
          });
      } else {
          res.json({
              status: 200,
              response: 'Got a GET query for this shoe size.',
              error: err,
              data: thisBrand
          });
      }


  })

});

//	List all shoes for a given brand and size
app.get('/api/shoes/brand/:brandname/size/:size', function(req, res) {

  var shoeBrand = req.params.brandname;
  var shoeSize = req.params.size;

  ShoeAPI.find({
      brand: shoeBrand,
      size: shoeSize
  }, function(err, thisBrand) {

      if (err) {
          res.json({
              status: 500,
              response: 'Failed to GET a query for this shoe brand and size',
              error: err
          });
      }
      else {
          res.json({
              status: 200,
              response: 'Got a GET query for this shoe brand size.',
              error: err,
              data: thisBrand
          });
      }
  })
});

//	Update the stock levels when a shoe is sold
app.put('/api/shoes/sold/:id', function(req, res) {

    var ammount = req.body.ammount
    var brandID = req.params.id

    ShoeAPI.findOne({
        id: brandID
    }, function(err, shoes) {
        if (err) {
          res.json({
              status: 500,
              response: 'Failed to UPDATE a query for this shoe ID',
              error: err
          });
        } else {
            shoes.in_stock = shoes.in_stock - ammount;
            shoes.save(function(err, updatedStock) {
                if (err) {
                  res.json({
                      status: 500,
                      response: 'Failed to UPDATE a query for this shoe ID',
                      error: err
                  });
                } else {
                  res.json({
                      status: 200,
                      response: 'Got a UPDATE query for this shoe brand ID.',
                      data: thisBrand
                  });
                }
            })
        }
    })
});


//	Add a new new shoe to his stock.
app.post('/api/shoes', function(req, res) {

    console.log(req.body);

    var shoe = new ShoeAPI({
        id: req.body.id,
        brand: req.body.brand,
        image : req.body.image,
        color: req.body.color,
        size : req.body.size,
        price: req.body.price,
        in_stock: req.body.in_stock
    });

    shoe.save(function(err, shoe) {
        if (err) {
            res.json({
                status: 503,
                response: 'Failed to POST shoes',
                error: err,
                data: shoe
            });
        } else {
            res.json({
                status: 200,
                response: 'Shoe successfully POSTed.',
                data: shoe
            })
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
