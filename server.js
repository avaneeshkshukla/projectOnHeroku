var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var connectFlash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongodb');
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const request = require('request');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/university', {useNewUrlParser: true });
var db= mongoose.connection;


var routes= require('./routes/index');
var routes= require('./routes/users');


var app = express();
 const port = process.env.PORT || 3000

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
//Express Session
app.use(expressSession({
	secret: 'secret',
	saveUninitialized: true,
	resave:true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.')
			, root = namespace.shift()
			, formParam = root;
		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

//Connect flash
app.use(connectFlash());

//Global vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	
	next();
});


app.use('/',routes);

//app.use('/users',users);


app.get('/', (req, res) => {
    res.render('index',{Title:'Takshinda University'});
});


app.get('/home2', (req, res) => {
    res.render('home2',{Title:'Home2Page'});
});

app.get('/about-us', (req, res) => {
    res.render('about-us');
});

app.get('/about-us', (req, res) => {
    res.render('about-us');
});

app.get('/alumni', (req, res) => {
    res.render('alumni');
});

app.get('/apply-to-kingster', (req, res) => {
    res.render('apply-to-kingster');
});

app.get('/art-science', (req, res) => {
    res.render('art-science');
});

app.get('/athletics', (req, res) => {
    res.render('athletics');
});

app.get('/bachelor-of-science-in-business-administration', (req, res) => {
    res.render('bachelor-of-science-in-business-administration');
});

app.get('/blog-full-both-sidebar-with-frame', (req, res) => {
    res.render('blog-full-both-sidebar-with-frame');
});

app.get('/blog-full-both-sidebar', (req, res) => {
    res.render('blog-full-both-sidebar');
});

app.get('/blog-full-left-sidebar-with-frame', (req, res) => {
    res.render('blog-full-left-sidebar-with-frame');
});

app.get('/blog-full-left-sidebar', (req, res) => {
    res.render('blog-full-left-sidebar');
});

app.get('/blog-full-right-sidebar-with-frame', (req, res) => {
    res.render('blog-full-right-sidebar-with-frame');
});

app.get('/blog-full-right-sidebar', (req, res) => {
    res.render('blog-full-right-sidebar');
});

app.get('/blog-grid-2-columns-no-space', (req, res) => {
    res.render('blog-grid-2-columns-no-space');
});

app.get('/homepage-2', (req, res) => {
    res.render('homepage-2');
});

app.get('/hospitality-management', (req, res) => {
    res.render('hospitality-management');
});



app.listen(port,(req,res)=>{
console.log('server runging on port no '+port)
})