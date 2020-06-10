//importing the required modules
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');
var mysql = require('mysql'); 
//setting connection port and engine
app.set('view engine', 'handlebars');
app.set('port', 19952);
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
//create connection pool with MYSQL database
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'admin',
  database        : 'pharmacy_DB'
});

//pool.connect();

//function to select rows from SQL database and serve context
function selectQuer(quer, res, next, params){
  var context = {};
  if(params){
  pool.query(quer, params, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.send(context);
    return;
  });
  }
  else{
  pool.query(quer, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.send(context);
    return;
  });
  }
}
//function to make a database query, then display selected rows sing the callback function
function sqlQuer(quer, params, selectString, res, next, selectQuer){
  pool.query(quer, params, function(err){
    if(err){
      next(err);
      return;
    }
    console.log("success");
    selectQuer(selectString, res, next);
    return;
  });
}

//main route to send data from the database table and show pharmacies
app.get('/',function(req,res,next){
  var queryString = "";
  var params = [];
  var selectString = "SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy`";
  if(req.query.read == "true"){
    selectQuer(selectString, res, next);
  }//create query, inserts values from request into database
  else if (req.query.create == "true"){
    queryString = "INSERT INTO `pharmacy` (`name`, `dea`, `address`, `phone`, `fax`) VALUES (?, ?, ?, ?, ?)";
    params = [req.query.name, req.query.dea, req.query.address, req.query.phone, req.query.fax];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
    return;
  }
  else if (req.query.search == "true"){
    queryString = "SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy` WHERE `name` REGEXP ? AND `dea` REGEXP ? AND `address` REGEXP ? AND `phone` REGEXP ? AND `fax` REGEXP ?";
    params = [req.query.name, req.query.dea, req.query.address, req.query.phone, req.query.fax];
    selectQuer(queryString, res, next, params);
  }//delete function
  else if(req.query.delete == "true"){
    queryString = "DELETE FROM `pharmacy` WHERE dea = ?";
    params = [req.query.dea];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else{//if no relevant query was made, the home page is served 
    res.render('index');
    return;
  } 
});

//DRUG page route
app.get('/drug',function(req,res,next){
  var queryString;
  var params = [];
  var selectString = "SELECT `ndc`, `name`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? ORDER BY `name`";
  if(req.query.read == "true"){
    params = [req.query.pharmacy];
    selectQuer(selectString, res, next, params);
  }//create query, inserts values from request into database
  else if (req.query.create == "true"){
    queryString = "INSERT INTO `drug` (`name`, `ndc`, `strength`, `price`, `qty`, `pharmacy`) VALUES (?, ?, ?, ?, ?, ?)";
    params = [req.query.name, req.query.ndc, req.query.strength, req.query.price, req.query.qty, req.query.pharmacy];    
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else if (req.query.search == "true"){
    queryString = "SELECT `name`, `ndc`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? AND `name` REGEXP ? AND `ndc` REGEXP ? AND `strength` REGEXP ?";
    params = [req.query.pharmacy, req.query.name, req.query.ndc, req.query.strength];
    selectQuer(queryString, res, next, params);
  }
  else if(req.query.delete == "true"){//delete
    querystring = "";          //*write delete query
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else if(req.query.update == "true"){  // add update
      queryString = "UPDATE `drug` SET `qty` = ? WHERE `pharmacy` = ? AND `ndc` = ?";
      selectString = "SELECT `ndc`, `name`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = " + req.query.pharmacy + " ORDER BY `name`";
      console.log(req.query);
      params = [req.query.qty, req.query.pharmacy, req.query.ndc]; 
      sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else{//if no relevant query was made, the home page is served 
    res.render('drug');
    return;
  } 
});

//PATIENT page route
app.get('/patient',function(req,res,next){
  //var context = {};
  var queryString;
  var selectString = "SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` ORDER BY `lname`";
  var params = [];
  if(req.query.read == "true"){
    selectQuer(selectString, res, next);
  }//create query, inserts values from request into database
  else if (req.query.create == "true"){
    queryString = ""      //*WRITE QUERY TO INSERT
    params = [req.query.fname,req.query.lname, req.query.dob, req.query.email, req.query.address, req.query.phone, req.query.gender];
    sqlQuer(queryString,params,selectString,res,next,selectQuer);
  }
  else if (req.query.search == "true"){
    queryString = "SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` WHERE `fname` REGEXP ? AND `lname` REGEXP ? AND `phone` REGEXP ? AND `email` REGEXP ?";
    if (req.query.dob != "" && req.query.gender != "") {
      queryString += " AND `dob` = ? AND `gender` = ? ORDER BY `lname`";
    }
    else if(req.query.dob != ""){
      queryString += " AND `dob` = ? ORDER BY `lname`";
    }
    else if(req.query.gender != ""){
      queryString += " AND `gender = ? ORDER BY `lname`";
    }
    else{
      queryString += " ORDER BY `lname`";
    }
    params = [req.query.id, req.query.fname, req.query.lname, req.query.phone, req.query.email, req.query.dob, req.query.gender];
    selectQuer(queryString,res, next, params);
  }
  else if(req.query.patientid == "true"){
    queryString = "SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` WHERE `id` = ?";
    params = [req.query.id];
    selectQuer(queryString, res, next, params);
  }
  else if(req.query.delete == "true"){//delete function
    queryString = "DELETE FROM `patient` WHERE `id` = ?";
    params = [req.query.id];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else if(req.query.update == "true"){   //update function
    queryString = "UPDATE `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` WHERE `id` = ?";
    //params = [];
    if (req.query.dob != "" && req.query.gender != "") {
      queryString += " AND `dob` = ? AND `gender` = ? ORDER BY `lname`";
    }
    else if(req.query.dob != ""){
      queryString += " AND `dob` = ? ORDER BY `lname`";
    }
    else if(req.query.gender != ""){
      queryString += " AND `gender = ? ORDER BY `lname`";
    }
    else{
      queryString += " ORDER BY `lname`";
    }
    params = [req.query.id];
    selectQuer(queryString, res, next, params);
  }
  else{//if no relevant query was made, the home page is served 
    res.render('patient');
    return;
  } 
});

//ORDER page route          *NOT DONE*
app.get('/order',function(req,res,next){
  //var context = {};
  var params = [];
  var selectString = "SELECT `id`, `name`, `drug_name`, `ndc` FROM `pharmacy` = ? ORDER BY `name`";
  /*if (req.query.length == undefined) {
    pool.query("SELECT * FROM `order`", function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.render('order', context);
      return;
    });
  }*/
  if(req.query.read == "true"){
    params = [req.query.pharmacy];
    selectQuer(selectString, res, next, params);
  } // insert values from requst into database
  else if(req.query.create == "true"){
    queryString = "INSERT INTO `order` (`id`, `lname`, `fname`, `name`, `ndc`, `pharmacy`) VALUES (?, ?, ?, ?, ?, ?)"; 
    params = [req.query.fname, req.query.lname, req.query.ndc, req.query.name, req.query.pharmacy, req.query.id];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else if(req.query.search == "true"){
    queryString = "SELECT `id`, `fname`, `lname`, `name` FROM `order` WHERE `lname` REGREXP ? AND `fname` REGREXP ? AND `name` REGREXP ?";
    if(req.query.name != ""){
      queryString += "AND `name` = ? ORDER BY `lname`";
    }
    else{
      queryString += "ORDER BY `lname`";
    }
    params = [req.query.fname, req.query.lanme, req.query.id, req.query.name];
    selectQuer(queryString,res, next, params);
  }
  else if(req.query.orderid == "true"){
    queryString = "SELECT `id`, `fname`, `lname`, `name` FROM `order` WHERE `id` = ?";
    params = [req.query.id];
    selectQuer(queryString, res, next, params);
  }
  else if(req.query.delete == "true"){
    queryString = "DELETE FROM `order` WHERE `id` = ?";
    params = [req.query.id];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  /*else if(req.query.update == "true"){  
    queryString = "UPDATE `id`, `fname`, `lname`, `name` FROM `order` WHERE `id` =?";
  }*/
  else{//if no relevant query was made, the home page is served 
    res.render('order');
    return;
  } 
});

//SALE page route
app.get('/sale',function(req,res,next){
  //var context = {};
  var params = [];
  var selectString = "SELECT `id`, `order`, `time` FROM `order` = ? ORDER BY `id`";
  /*if (req.query.length == undefined) {
    pool.query("SELECT * FROM `sale`", function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.render('sale', context);
      return;
    });
  }*/
  if(req.query.read == "true"){
    params = [req.query.pharmacy];
    selectQuer(selectString, res, next, params);
  }
  else if(req.query.create == "true"){
    queryString = "INSERT INTO `sale` (`id`, `order`, `time`, `pharmacy`) VALUES (?, ?, ?, ?)";
    params = [req.quer.id, req.query.order, req.query.time, req.query.pharmacy];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  //else if(req.query.search){};
  else if(req.query.update == "true"){
    queryString = "UPDATE `sale` SET `id` = ?, `order` = ?, `time` = ? WHERE `pharmacy` = ?";
    
    console.log(req.query);
    params = [req.query.pharmacy, req.query.id, req.query.order, req.query.time];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else{//if no relevant query was made, the home page is served 
    res.render('sale');
    return;
  } 
});
//error handling
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});~
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

//start server
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});