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

//main route to send data from the database table
app.get('/',function(req,res,next){
  var context = {};
  var queryString = "";
  if(req.query.read == "true"){
  queryString = "SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy`";
    pool.query(queryString, function(err, rows, fields){
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
    queryString = "INSERT INTO `pharmacy` (`name`, `dea`, `address`, `phone`, `fax`) VALUES (?, ?, ?, ?, ?)"
    pool.query(queryString,
    [req.query.name,
    req.query.dea,
    req.query.address,
    req.query.phone,
    req.query.fax], function(err){
      if(err){
        next(err);
        return;
      }
      queryString = "SELECT `name`, `dea`, `address`, `phone`, `fax` FROM pharmacy";
      pool.query(queryString, function(err, rows, fields){
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
  else if (req.query.search == "true"){
    queryString = "SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy` WHERE `name` REGEXP ? AND `dea` REGEXP ? AND `address` REGEXP ? AND `phone` REGEXP ? AND `fax` REGEXP ?";
    pool.query(queryString,
    [req.query.name,
    req.query.dea,
    req.query.address,
    req.query.phone,
    req.query.fax], function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.send(context);
      return;
    });
  }//delete function
  else if(req.query.delete == "true"){
    queryString = "DELETE FROM `pharmacy` WHERE dea = ?";
    pool.query(queryString,[req.query.dea], function(err, result) {
      if(err){
        next(err);
        return;
      }
      queryString = "SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy`";
      pool.query(queryString, function(err, rows, fields){
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
  else{//if no relevant query was made, the home page is served 
    res.render('index');
    return;
  } 
});

//DRUG page route
app.get('/drug',function(req,res,next){
  var context = {};
  if(req.query.read == "true"){
    queryString = "SELECT `ndc`, `name`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? ORDER BY `name`";
    pool.query(queryString, [req.query.pharmacy], function(err, rows, fields){
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
    queryString = "INSERT INTO `drug` (`name`, `ndc`, `strength`, `price`, `qty`, `pharmacy`) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(queryString,
    [req.query.name,
    req.query.ndc,
    req.query.strength,
    req.query.price,
    req.query.qty,
    req.query.pharmacy], function(err){
      if(err){
        next(err);
        return;
      }
      queryString = "SELECT `ndc`, `name`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? ORDER BY `name`";
      pool.query(queryString,[req.query.pharmacy], function(err, rows, fields){
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
  else if (req.query.search == "true"){
    queryString = "SELECT `name`, `ndc`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? AND `name` REGEXP ? AND `ndc` REGEXP ? AND `strength` REGEXP ?";
    pool.query(queryString,
    [req.query.pharmacy,
    req.query.name,
    req.query.ndc,
    req.query.strength,], 
    function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.send(context);
      return;
    });
  }//delete function
  else if(req.query.delete == "true"){
    queryString = "";          //*WRITE DELETE QUERY
    pool.query(queryString,[req.query.dea], function(err, result) {
      if(err){
        next(err);
        return;
      }
      queryString = "SELECT `ndc`, `name`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? ORDER BY `name`"; 
      pool.query(queryString, function(err, rows, fields){
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
  else{//if no relevant query was made, the home page is served 
    res.render('drug');
    return;
  } 
});

//ORDER page route
app.get('/order',function(req,res,next){
  var context = {};
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
  var queryString;
  if(req.query.read == "true"){
    queryString = "SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` ORDER BY `lname`";
    pool.query(queryString, function(err, rows, fields){
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
    queryString = ""      //*WRITE QUERY TO INSERT
    pool.query(queryString,
    [req.query.fname,
    req.query.lname,
    req.query.dob,
    req.query.email,
    req.query.address,
    req.query.phone,
    req.query.gender], function(err){
      if(err){
        next(err);
        return;
      }
      queryString = "SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` ORDER BY `lname`";
      pool.query(queryString,[req.query.pharmacy], function(err, rows, fields){
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
      console.log(queryString);
      console.log(req.query);
    }
    pool.query(queryString,
    [req.query.fname,
    req.query.lname,
    req.query.phone,
    req.query.email,
    req.query.dob,
    req.query.gender],
    function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      console.log(rows);
      res.send(context);
      return;
    });
  }
  else if(req.query.patientid == "true"){
    console.log(req.query);
    queryString = "SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` WHERE `id` = ?";
    pool.query(queryString, [req.query.id],
      function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.results = rows;
        res.send(context);
        return;
      });
  }
  else if(req.query.delete == "true"){//delete function
    queryString = "";       //*WRITE DELETE QUERY
    pool.query(queryString,[req.query.dea], function(err, result) {
      if(err){
        next(err);
        return;
      }
      queryString = "SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` ORDER BY `lname`";
      pool.query(queryString, function(err, rows, fields){
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
  else{//if no relevant query was made, the home page is served 
    res.render('patient');
    return;
  } 
});

//SALE page route
app.get('/sale',function(req,res,next){
  var context = {};
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