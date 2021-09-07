var express = require("express");
var app = express();
const { MongoClient,ObjectId } = require('mongodb');
var url = "mongodb://localhost:27017/";

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.set('view engine', 'pug');
app.set('views','./views');

app.get("/",function(req,res){
    res.send("Hello express")
})

app.get("/allbooks",function(req,res){
    MongoClient.connect(url,function(err,conn){
        var db = conn.db("cts");
        db.collection('books').find()
        .toArray(function(err,data){
            res.send(data)
        })
    })
})

app.get("/studentsList",function(req,res){
    MongoClient.connect(url,function(err,conn){
        var db = conn.db("delta");
        db.collection("students").find()
        .toArray(function(err,data){
            res.render("studentslist",{
                students:data
            });
        })
    })
})
app.get("/studentdetails/:id",function(req,res){
    MongoClient.connect(url,function(err,conn){
        var db = conn.db("delta");
        db.collection("students").find({_id:ObjectId(req.params.id)})
        .toArray(function(err,data){
            res.send(data);
        })
    })
})

app.get("/studentRegistrationForm",function(req,res){
    res.sendFile(__dirname+"/stureg.html")
})

app.post("/addStudent",function(req,res){
    MongoClient.connect(url,function(err,conn){
        var db = conn.db("delta");
        db.collection("students").insertOne(req.body,function(err,data){
            res.send(data)
        })
    })
})

app.get("/deleteStudent/:id",function(req,res){
    MongoClient.connect(url,function(err,conn){
        var db = conn.db("delta");
        db.collection("students").deleteOne({_id:ObjectId(req.params.id)},function(err,data){
            res.redirect("/studentsList")
        })
    })
})
app.get("/addStudentWeightForm/:id",function(req,res){
    res.render("addweightform",{
        studentid:req.params.id
    })
})
app.post("/addStudentWeight",function(req,res){
    MongoClient.connect(url,function(err,conn){
        console.log(req.body)
        var db = conn.db("delta");
        db.collection("students")
        .updateOne(
            {_id:ObjectId(req.body.id)},
            {
                $push:{
                    weightEntry:{
                        date:req.body.date,
                        weight:req.body.weight
                    }
                }
            },
            function(err,data){
                console.log(data)
                res.redirect("/studentsList")
            }
        )
    })
})

app.listen(9090,function(){console.log("App runnning on 9090")})