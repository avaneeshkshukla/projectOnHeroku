var express = require('express');
var router = express.Router();
var passport = require('passport');
const nodemailer = require('nodemailer');
var LocalStrategy = require('passport-local').Strategy;
var app=express();
var User = require('../models/user');

//Get Register
router.get('/register', function (req, res) {
    res.render('register');
});
var rand,mailOptions,host,link;
//User Register
router.post('/register', function (req, res) {

    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'User is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Passord required').notEmpty();
    req.checkBody('confirm_password', 'Password mismatch').equals(req.body.password);

    var errors = req.validationErrors();
    if(errors){
        res.render('register', {
            errors: errors
        });
    }else{
        var newUser = new User({
            name: name,
            username: username,
            email: email,
            password: password
        });
        User.getUserByUsername(username, function (err, user) {
            if(err) throw err;
            if(user){
                req.flash('error_msg', 'User Already Exist');
                res.redirect('/users/register');
            }else{
                User.createUser(newUser, function (err, user) {
                    if(err) throw err;
                    console.log(user);
                });

                req.flash('success_msg', 'You are registered and can now login');

                res.redirect('/login');
            }
        });
    }
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.username}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.password}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
   
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'hemantbly.kumar@gmail.com', // generated ethereal user
        pass: 'santoshmehu'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <hemantbly.kumar@gmail.com>', // sender address
      to: 'hemantbly.kumar@gmail.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      verify : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>",
      html: output // html body
     
  };

  app.get('/verify',function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand)
        {
            console.log("email is verified");
            res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
    });

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });



    


//Get Login
router.get('/login', ensureAuthenticated, function (req, res) {
    res.render('login');
});


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

//User Login
router.post('/login', passport.authenticate('local', {successRedirect: '/login', failureRedirect: '/users/login', failureFlash: true}), function(req, res) {
    res.redirect('/register');
});

//User Logout
router.get('/logout', function (req, res, next) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/');
    }else{
        return next();
    }
}
module.exports = router;