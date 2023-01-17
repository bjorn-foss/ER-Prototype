var express = require('express');
var bodyParser = require('body-parser');
var userController = require('./controllers/userController');
const session = require("express-session");
const passport = require("passport");
const User = require("./models/user").User;
const port = process.env.PORT || 8080;
const LocalStrategy = require("passport-local").Strategy;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;

var app = express();
const server = require("http").createServer(app);
// Setting up Embedded JavaScript Template Engine
app.set('view engine', 'ejs');
app.use(express.static('assets'));
var jsonParser = bodyParser.json();

const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

server.listen(port, function () {
    console.log(`Application running @ http://localhost:${port}`);
});

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/register', function (req, res) {
    res.render('user/register');
});

app.post("/register", jsonParser, function(req,res){
    userController.insert(req, function () {
        //We have to send JSON back or the success ajax event does not work
        res.redirect(307, '/login');
    });
});

app.get('/login', function (req, res) {
    res.render('user/login');
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

app.get('/password_recovery', function (req, res) {
    res.render('password_recovery');
});

app.post("/password_recovery", jsonParser, function(req,res){
    userController.insert(req, function () {
        //We have to send JSON back or the success ajax event does not work
        res.redirect(307, '/login');
    });
});

app.get('/schedule', function (req, res) {
    res.render('schedule');
});

app.get('/booking', function (req, res) {
    res.render('booking');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/newbooking', function (req, res) {
    res.render('newbooking');
});

passport.serializeUser((user, cb) => {
    console.log(`serializeUser ${user.id}`);
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    console.log(`deserializeUser ${id}`);
    User.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));