var express = require("express");
var route = express.Router({mergeParams: true});
var Comment=require("../models/comment"),
    Campground=require("../models/campground"),
    User=require("../models/user");
var middleware = require("../middleware");
route.get("/new", middleware.isLoggedIn, function(req, res){
    //console.log(req.params.id);
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log(err);
        }else{
            res.render("comment/new",{campground:found});
        }
    })
})
route.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})
route.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("comment/edit", {campId:req.params.id, comment:foundComment});
        }
    })
})
route.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updComment){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds"+req.params.id);
        }
    })
})
route.delete("/:comment_id", middleware.checkCommentOwnership,  function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/campgrounds"+req.params.id);
        }else{
            res.redirect("/campgrounds"+req.params.id);
        }
    })
})
module.exports = route;