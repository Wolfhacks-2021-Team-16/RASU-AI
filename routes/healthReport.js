var express = require('express');
var router = express.Router();
var mymongo = require('mongodb').MongoClient;

// mongo ipaddress
var mongoUrl = "mongodb://127.0.0.1:27017/";



router.get('/', function (request, response) {
    request.session.destroy(function (err) { // distroy session
        if (!req.session.loggedin) 
            return res.redirect("/login");
        return res.render('healthReport')
    });
});

module.exports = router