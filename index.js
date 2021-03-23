var cluster = require('cluster');

if(cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
   


var express = require('express');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path');
var https = require('https');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo');(session);

mongoose.connect('mongodb://localhost:27017/login-register',{
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});
app.use(cookieParser());
app.use(session({
    secret: 'work hard',
    resave: true,
    
    saveUninitialized: false,
    cookie: {
      expires: 600000
  }
    /* store: new MongoStore({
      mongooseConnection: db
    }) */
  }));
  app.use((req, res, next) => {
    res.cookie('MyCookie', '500', { expires: new Date(Date.now() + 900000), httpOnly: true })
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

  

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

var r_index = require('./routes/recipes');
app.use('/recipes', r_index);

var a_index = require('./routes/admins');
app.use('/admins', a_index);

// catch 404 erro
app.use(function(req,res){
  res.status(404).render('404_error_template.ejs');
});

const sslServer = https.createServer({
    'key': fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
  },
  app
);



sslServer.listen('3443', ()=>console.log('Secure server started on port 3443 by Process:'+process.pid));
}