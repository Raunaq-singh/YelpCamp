var express=require("express"),
    app=express(),
    request=require("request"),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    Comment=require("./models/comment"),
    Campground=require("./models/campground"),
    User=require("./models/user"),
    flash=require("connect-flash"),
    passport=require("passport"),
    methodOverride=require("method-override"),
    LocalStrategy=require("passport-local"),
    seedDB=require("./seed");
    
var commentRoutes=require("./routers/comments"),
    campgroundRoutes=require("./routers/campgrounds"),
    indexRoutes=require("./routers/index");
    
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
app.use(require("express-session")({
    secret:"Raunaq Roxx",
    resave:"false",
    saveUninitialised:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
})