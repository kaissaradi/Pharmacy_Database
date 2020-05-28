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
  host            : 'localhost',
  user            : 'root',
  password        : 'admin',
  database        : 'pharmacy_DB'
});

//main route to send data from the database table
app.get('/',function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM pharmacy', function(err, rows, fields){

    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('home', context);
    return;
  });
});
//send mysql table data
app.get('/view',function(req,res,next){
  var context = {};
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