var express = require("express");
var route = express.Router();
var Comment=require("../models/comment"),
    Campground=require("../models/campground"),
    User=require("../models/user"),
    passport=require("passport");
route.get("/",function(req,res){
    res.render("homePage");
})
//Authentication routes
route.get("/register", function(req, res){
    res.render("register");
})
route.post("/register", function(req, res){
    var newUser=new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            //console.log("Entered");
            res.redirect("/campgrounds");
        })
    })
})
route.get("/login", function(req, res){
    res.render("login");
})
route.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/register"
    }), function(req, res){
});
route.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = route;