const express = require('express')
const path = require('path')
const chalk = require("chalk");
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
const userData = require('./src/models/user_model');
require('dotenv').config();
const PORT = process.env.PORT || 5000

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(bodyParser.json()) // Body parser use JSON data
    .use(expressValidator())
    .use(expressSession({
        secret: "Secret Key",
        saveUninitialized: false,
        resave: false
    }))
    .set('views', path.join(__dirname, 'src/views'))
    .set('view engine', 'ejs')
    .get('/login', (req, res) => {
        res.render('loginpage');
    })
    .post('/login', (req, res) => {
        console.log("Login Post");
        var username = req.body.username;
        var pass = req.body.pass;
        userData.findOne({
            username: username,
            password: pass
        }, (err, user) => {
            if (user) {
                console.log("Login Success");
                res.redirect('/');
                console.log("User info " + req.session.loginuserdata);
            } else { //error invalid detail

                console.log("Login Failed");
                res.redirect('/login');
            }

        });
        }
    )

    .get('/register', (req, res) => {
        res.render('registerpage');
    })
    .get('/', (req, res) => {
        res.render('index');
    })
    .post('/register', (req, res, next) => {
        console.log("Register Post");
        var username = req.body.username;
        var pass = req.body.pass;
        var rpass = req.body.rpass;

        var item = {
            username: username,
            password: pass
        };
        var user = new userData(item);
        user.save();

        console.log("Ragistation Success");
        res.redirect('/login');
    })


    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
