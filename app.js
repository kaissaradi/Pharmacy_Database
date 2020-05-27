//importing the required modules
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');
var mysql = require('mysql'); 

//setting connection on port and create connection pool
app.set('port', 1995);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
//http://eecs.oregonstate.edu/ecampus-video/CS290/core-content/node-mysql/using-server-sql.html
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_saradik',
  password        : '0846',
  database        : 'cs340_saradik'
});

//main route to send data from the database table
app.get("/", function(req, res, next) {
  if(req.query.length == 0){
    pool.query('SELECT * FROM pharmacy', function(err,rows){
      if(err){
        next(err);
        return;
        }
      var context = {};
      context.results = JSON.stringify(rows);
      res.render('home', context);
    });
  }
  else{
    pool.query("INSERT INTO pharmacy (`name`, `dea`, `address`, `phone`, `fax`) VALUES (?, ?, ?, ?, ?)",
    [req.query.name,              
    req.query.dea, 
    req.query.address, 
    req.query.phone, 
    req.query.fax], function(err, result){
      if(err){
        next(err);
        return;
      }         
      context.results = JSON.stringify(rows);
      res.send(context);
      });
  }
});

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

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});