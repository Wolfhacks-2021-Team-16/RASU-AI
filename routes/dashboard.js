var express = require('express');
var router = express.Router();
var mymongo = require('mongodb').MongoClient;

// mongo ipaddress
var mongoUrl = "mongodb://127.0.0.1:27017/";


/* Sends the Login Page, and show error 
    if user attemted to login before */
router.get('/', function (req, res, next) { // checks if user is already logged in. if they are, then send them home!
    if (!req.session.loggedin) 
        return res.redirect("/login");
    mymongo.connect(mongoUrl, function (err, server) { // connects to main server
        if (err) 
            throw err;

        var localDrive = server.db("RASU-DB"); // connects to localDrive database
        queryCommand = {
            email: req.session.email,
            password: req.session.password
        } // prepares the search statement
        localDrive.collection("users").find(queryCommand).toArray(function (err, result) {
            if (err) 
                throw err;
            if (result.length == 0) {
                res.redirect("/login")
            }
            return res.render('dashboard', {
                user: result[0]
            })

        });
    });
});

module.exports = router

