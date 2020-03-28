var bodyParser  = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
mongoose        = require("mongoose"),
express         = require("express"),
app             = express(),
methodOverride = require("method-override");


mongoose.connect("mongodb://localhost/restfull_book_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer())
app.use(methodOverride("_method"))

var bookSchema = new mongoose.Schema({
        title: String,
        image: String,
        created: {type: String, default: Date()},
        body: String
    });

    var Book = mongoose.model("Book",bookSchema);

//Home
app.get("/",function(req,res){
    res.redirect("/books");
})
//Index
app.get("/books",function(req,res){
    Book.find(function(err,allBooks){
        if(err){
            console.log(err);
        } else{
            res.render("index",{books:allBooks});   
        }
    })
});
//New Index
app.get("/books/new",function(req,res){
    res.render("new");
})
//create book
app.post("/books",function(req,res){
    req.body.book.body = req.sanitize(req.body.book.body)
    Book.create(req.body.book,function(err,newBook){
        if(err){
            console.log(err);
        }else{
            res.redirect("/books");
        }
    })
})

//Show book
app.get("/books/:id",function(req,res){
    Book.findById(req.params.id,function(err,showBook){
        if(err){
            res.redirect("/books")
        }
        else{
            res.render("show",{book:showBook})
        }
    })
})

//Edit Route
app.get("/books/:id/edit",function(req,res){
    Book.findById(req.params.id,function(err,foundBook){
        if(err){
            res.redirect("/books")
        }else{
            res.render("edit",{Book:foundBook})
        }
    })
});
//Update Route
app.put("/books/:id",function(req,res){
    req.body.book.body = req.sanitize(req.body.book.body)
    Book.findByIdAndUpdate(req.params.id,req.body.book,function(err,foundBook){
        if(err){
            res.redirect("/books");
        } else{
            res.redirect("/books/"+req.params.id);
        }
    })
})

//Delete Route
app.delete("/books/:id",function(req,res){
    Book.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/books")

        } else{
            res.redirect("/books")  
        }
    })
});
app.listen(3000,function(){
    console.log("Server has started at port 3000");
    
})