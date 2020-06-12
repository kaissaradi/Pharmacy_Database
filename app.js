//importing the required modules
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');
var mysql = require('mysql'); 
const { urlencoded } = require('body-parser');
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
//function to make a database query, then display selected rows using the callback function
function sqlQuer(quer, params, selectString, res, next, selectQuer){
  pool.query(quer, params, function(err){
    if(err){
      next(err);
      return;
    }
    selectQuer(selectString, res, next, params);
    return;
  });
}
//main route to send data from the database table and show pharmacies
app.get('/',function(req,res,next){
  //create query strings, with parameters
  //check which kind of get request was made to the route
  //sent context for get requests or send page
  var queryString = "";
  var params = [];
  var selectString = "SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy`";
  if(req.query.read == "true"){//read
    selectQuer(selectString, res, next);
  }//create query, inserts values from request into database
  else if (req.query.create == "true"){//create/insert/add
    queryString = "INSERT INTO `pharmacy` (`name`, `dea`, `address`, `phone`, `fax`) VALUES (?, ?, ?, ?, ?)";
    params = [req.query.name, req.query.dea, req.query.address, req.query.phone, req.query.fax];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
    return;
  }
  else if (req.query.search == "true"){//search
    queryString = "SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy` WHERE `name` REGEXP ? AND `dea` REGEXP ? AND `address` REGEXP ? AND `phone` REGEXP ? AND `fax` REGEXP ?";
    params = [req.query.name, req.query.dea, req.query.address, req.query.phone, req.query.fax];
    selectQuer(queryString, res, next, params);
  }//delete function
  else if(req.query.delete == "true"){//delete
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
  if(req.query.read == "true"){//read
    params = [req.query.pharmacy];
    selectQuer(selectString, res, next, params);
  }
  else if (req.query.create == "true"){//create/insert/add
    queryString = "INSERT INTO `drug` (`name`, `ndc`, `strength`, `price`, `qty`, `pharmacy`) VALUES (?, ?, ?, ?, ?, ?)";
    params = [req.query.name, req.query.ndc, req.query.strength, req.query.price, req.query.qty, req.query.pharmacy];    
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else if (req.query.search == "true"){//search
    queryString = "SELECT `name`, `ndc`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? AND `name` REGEXP ? AND `ndc` REGEXP ? AND `strength` REGEXP ? ORDER BY `name`";
    params = [req.query.pharmacy, req.query.name, req.query.ndc, req.query.strength];
    selectQuer(queryString, res, next, params);
  }
  else if(req.query.delete == "true"){//delete
    queryString = "DELETE from `drug` where `ndc` = ? AND `pharmacy` = ?";
    params = [req.query.ndc, req.query.pharmacy];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else if(req.query.update == "true"){//update
      queryString = "UPDATE `drug` SET `qty` = ? WHERE `pharmacy` = ? AND `ndc` = ?";
      params = [req.query.qty, req.query.pharmacy, req.query.ndc]; 
      sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else{
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
  }
  else if (req.query.create == "true"){
    queryString = "INSERT INTO `patient` (`lname`, `fname`, `dob`, `gender`, `address`, `email`, `phone`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    params = [req.query.lname,req.query.fname, req.query.dob, req.query.gender, req.query.address, req.query.email, req.query.phone];
    sqlQuer(queryString,params,selectString,res,next,selectQuer);
  }
  else if (req.query.search == "true"){
    queryString = "SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` WHERE `fname` REGEXP ? AND `lname` REGEXP ? AND `phone` REGEXP ? AND `email` REGEXP ?";
    params = [req.query.fname, req.query.lname, req.query.phone, req.query.email, req.query.dob, req.query.gender];
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
    selectQuer(queryString,res, next, params);
  }
  else if(req.query.patientid == "true"){//create/read for prescriptions
    queryString = "SELECT `rx`, `name`, `strength`, `price` FROM `drug` JOIN `prescription` ON `prescription`.`drug` = `drug`.`ndc` JOIN `patient` ON `patient`.`id` = `prescription`.`patient` WHERE `patient`.`id` = ?" 
    params = [req.query.id];
    selectQuer(queryString, res, next, params);
  }
  else if(req.query.delete == "true"){
    queryString = "DELETE FROM `patient` WHERE `id` = ?";
    params = [req.query.id];
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else{
    res.render('patient');
    return;
  } 
});
//ORDER page route        
app.get('/order',function(req,res,next){
  var queryString;
  var params = [];
  var selectString = "SELECT `order`.`id`, `fname`, `lname`, `time`, `name`, `price` FROM `order` JOIN `prescription` ON `order`.`rx` = `prescription`.`rx` JOIN patient ON `prescription`.`patient` = `patient`.`id` JOIN drug ON `prescription`.`drug` = `drug`.`ndc` WHERE `status` = 'Incomplete'";
  if(req.query.read == "true"){
    selectQuer(selectString, res, next);
  }
  else if (req.query.create == "true"){
    queryString = "";
    params = [];    
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else if (req.query.search == "true"){
    queryString = selectString + " AND `fname` REGEXP ? AND `lname` REGEXP ? AND `name` REGEXP ?";
    params = [req.query.fname, req.query.lname, req.query.name];
    selectQuer(queryString, res, next, params);
  }
  else{
    res.render('order');
    return;
  } 
});
//SALE page route
app.get('/sale',function(req,res,next){
  var params = [];
  var queryString;
  var selectString = "SELECT `sale`.`id`, `fname`, `lname`, `sale`.`time`, `name`, `price` FROM `sale` JOIN `order` ON `sale`.`order` = `order`.`id` JOIN `prescription` ON `order`.`rx` = `prescription`.`rx` JOIN `patient` ON `prescription`.`patient` = `patient`.`id` JOIN `drug` ON `prescription`.`drug` = `drug`.`ndc`";
  if(req.query.read == "true"){
    selectQuer(selectString, res, next);
  }
  else if(req.query.readOrder == "true"){
    queryString = "SELECT `order`.`id`, `fname`, `lname`, `time`, `name`, `price` FROM `order` JOIN `prescription` ON `order`.`rx` = `prescription`.`rx` JOIN patient ON `prescription`.`patient` = `patient`.`id` JOIN drug ON `prescription`.`drug` = `drug`.`ndc` WHERE `status` = 'Complete'";
    selectQuer(queryString, res, next);
  }
  else if (req.query.create == "true"){
    queryString = "";
    params = [];    
    sqlQuer(queryString, params, selectString, res, next, selectQuer);
  }
  else if (req.query.search == "true"){
    queryString = selectString + " WHERE `fname` REGEXP ? AND `lname` REGEXP ? AND `name` REGEXP ?";
    params = [req.query.fname, req.query.lname, req.query.name];
    selectQuer(queryString, res, next, params);
  }
  else{
    res.render('sale');
    return;
  } 
});
//error handling
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});
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