var express = require("express");
var route = express.Router();
var Comment=require("../models/comment"),
    Campground=require("../models/campground"),
    User=require("../models/user");
var middleware = require("../middleware");
route.get("/",function(req, res) {
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campground/index",{data:campgrounds});
        }
    })
})
route.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campground/new");
})
route.post("/new", middleware.isLoggedIn, function(req, res) {
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    var newCamp={name:name, image:image, description:desc, author:author};
    Campground.create(newCamp,function(err,newCreated){
        if(err){
            console.log(err);
        }
    })
    res.redirect("/");
})
route.get("/:id", function(req,res) {
    //res.send(req.params.id);
    //console.log((req.params.id));
    Campground.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err){
            console.log(err);
            //res.send("ERROR");
        }else{
            //res.send("FOUND");
            //console.log(found);
            res.render("campground/show",{info:found});
        }
    })
})
//Editing
route.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.render("campground/edit", {camp:foundCampground});
        }
    })
})
route.put("/:id", middleware.checkCampOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updCamp){
        if(err){
            console.log(err);
            res.redirect("/")
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
route.delete("/:id", middleware.checkCampOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
}) 
module.exports = route;