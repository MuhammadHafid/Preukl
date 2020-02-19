const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://localhost:27017";
const DBname = "Telkom";
const guru = express.Router();
let dbo = null;
MongoClient.connect(mongoUrl,(error,db)=>{
    if (error) throw error;
    dbo = db.db(DBname)


const mSiswa = require("../model/modelSiswa");
const mPel = require("../model/modelPel");

guru.use(cors());

process.env.SCRET_KEY="secret";


guru.get('/listsiswa', (request,response)=>{
    dbo.collection('siswas').aggregate([
        { $lookup:
           {
             from: 'datapels',
             localField: 'email',
             foreignField: 'email',
             as: 'orderdetails'
           }
         }
        ]).toArray(function(err, res) {
        if (err) throw err;
        response.end(JSON.stringify(res));
        db.close();
      });
    });

guru.put('/siswa/:id',(request,response)=>{
    let id = request.params.id;
    let id_object = new ObjectID(id);
    let first_name =request.body.first_name;
    let last_name = request.body.last_name;
    let email = request.body.email;

    dbo.collection("siswas").updateOne({
        _id : id_object
    },{$set:{
        first_name : first_name,
        last_name : last_name,
        email : email
    }},(err,res)=>{
        if(err)throw err;
        response.end("Update data Success");
    })
});

guru.delete('/siswa/:id',(request,response)=>{
    let id =request.params.id;
    let id_object = new ObjectID(id);
    mSiswa.findOne({
        _id : id_object
    })
    .then(user =>{
        dbo.collection("datapels").deleteOne({
            email : user.email
        });
        dbo.collection("siswas").deleteOne({
            _id : user._id
        },(err,res)=>{
            if(err) throw err;
            response.end("Delete Data Success");
        })
    })
});

guru.post("/addsiswa",(req,res)=>{
    const today = new Date();
    const siswaData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created:today
    };
    const pelData = {
        email: req.body.email,
        ketepatan: "0 Poin",
        kerajinan: "0 Poin",
        kerapian: "0 Poin",
        totalPoin: "0 Poin",
        created:today
    };
    mSiswa.findOne({
        email:req.body.email
    })
    .then(user =>{
        if(!user){
            bcrypt.hash(req.body.password,10,(err,hash) => {
                siswaData.password = hash;
                mPel.create(pelData)
                mSiswa.create(siswaData)
                .then(user => {
                    res.json({ status : user.first_name + " " + "register!"});
                })
                .catch(err => {
                    res.send("error: " + err);
                });
            });
        } else {
            res.json({error:"User already exists"});
        }
    })
    .catch(err=>{
        res.send("error: "+ err);
    })
});

guru.put('/pel/:id',(request,response)=>{
    let id = request.params.id;
    let id_object = new ObjectID(id);
    let kerajinan = request.body.kerajinan;
    let kerapian = request.body.kerapian;
    let totalPoin = request.body.totalPoin;
    let ketepatan = request.body.ketepatan;

    dbo.collection("datapels").updateOne({
        _id : id_object
    },{$set:{
        ketepatan : ketepatan,
        kerajinan : kerajinan,
        kerapian : kerapian,
        totalPoin : totalPoin


    }},(err,res)=>{
        if(err)throw err;
        response.end("Update data Success");
    })
});
});
module.exports = guru;