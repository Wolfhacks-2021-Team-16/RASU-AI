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
            email: req.session.email
        } // get current user
        localDrive.collection("users").find(queryCommand).toArray(function (err, result) {
            if (err) 
                throw err;
            
            if (result.length == 0) {
                res.redirect("/login")
            }
            let caloriesPerDayCurrentUser = getCalories(result[0])
            // Get calories taken by entire space team
            localDrive.collection("users").find().toArray(function (err, result) {
                if (err)
                throw err
                totalCaloriesForTeam = 0
                result.forEach(user => {
                    totalCaloriesForTeam  = totalCaloriesForTeam + getCalories(user)
                })
                console.log(caloriesPerDayCurrentUser, totalCaloriesForTeam)
                return res.render("inventory", {
                    caloriesForCurrentUser: caloriesPerDayCurrentUser,
                    caloriesForTeam: totalCaloriesForTeam
                })
            })
        });
    });
});

function getCalories(user) { // Calculate BMR
    let bmr = 0
    if (user.gender.toLowerCase() == "female") {
        bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) - 161
    } else {
        bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5
    }

    return bmr * 1.55
}

module.exports = router

