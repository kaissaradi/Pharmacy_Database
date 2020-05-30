//importing the required modules
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');
var mysql = require('mysql'); 

//setting connection on port and create connection pool
app.set('view engine', 'handlebars');
app.set('port', 19952);
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
//http://eecs.oregonstate.edu/ecampus-video/CS290/core-content/node-mysql/using-server-sql.html
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_saradik',
  password        : '0846',
  database        : 'cs340_saradik'
});

//main route to send data from the database table
app.get('/',function(req,res,next){
  var context = {};
  if(req.query.read == "true"){
    pool.query("SELECT * FROM `pharmacy`", function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.send(context);
      return;
    });
  }//create query, inserts values from request into database
  else if (req.query.create == "true"){
    pool.query("INSERT INTO `pharmacy` (`name`, `dea`, `address`, `phone`, `fax`) VALUES (?, ?, ?, ?, ?)",
    [req.query.name,
    req.query.dea,
    req.query.address,
    req.query.phone,
    req.query.fax], function(err){
      if(err){
        next(err);
        return;
      }
      pool.query('SELECT * FROM pharmacy', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.results = rows;
        res.send(context);
        return;
      });
    });
  }//delete function
  else if(req.query.delete == "true"){
    pool.query("DELETE FROM `pharmacy` WHERE dea = ?",[req.query.dea], function(err, result) {
      if(err){
        next(err);
        return;
      }
      pool.query("SELECT * FROM `pharmacy`", function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.results = rows;
        res.send(context);
        return;
      });
    });
  }
  else{//if no elevant query was made, the home page is served
    res.render('index', context);
    return;
  } 
});

//DRUG page route
app.get('/drug',function(req,res,next){
  var context = {};
  console.length
  if (req.query.length == undefined) {
    pool.query("SELECT * FROM `drug`", function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.render('drug', context);
      return;
    });
  }
});

//ORDER page route
app.get('/order',function(req,res,next){
  var context = {};
  console.length
  if (req.query.length == undefined) {
    pool.query("SELECT * FROM `order`", function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.render('order', context);
      return;
    });
  }
});

//PATIENT page route
app.get('/patient',function(req,res,next){
  var context = {};
  console.length
  if (req.query.length == undefined) {
    pool.query("SELECT * FROM `patient`", function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.render('patient', context);
      return;
    });
  }
});

//SALE page route
app.get('/sale',function(req,res,next){
  var context = {};
  console.length
  if (req.query.length == undefined) {
    pool.query("SELECT * FROM `sale`", function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.render('sale', context);
      return;
    });
  }
});

//error handling
app.use(function(res) {
    res.status(404);
    res.render('404');
});~
app.use(function(err, res) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});
//start server
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});