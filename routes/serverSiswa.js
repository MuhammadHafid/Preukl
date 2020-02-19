const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const siswa = express.Router();

const mSiswa = require("../model/modelSiswa");
siswa.use(cors());

process.env.SCRET_KEY="secret";

siswa.get('/',() => console.log("Hellow"))

siswa.post("/login",(req,res)=>{
    mSiswa.findOne({
        email:req.body.email
    })
    .then(user =>{
        if(user){
            if(bcrypt.compareSync(req.body.password,user.password)){
                const payload ={
                    _id:user._id,
                    email:user.email,
                    password:user.password
                }
                let token = jwt.sign(payload,process.env.SCRET_KEY,{
                    expiresIn:1440
                })
                res.send(token)
            }else{
                res.json({error:"User does no exists"})
            }
        }else {
            res.json({error:"User does not exist"})
        }
    })
    .catch(err =>{
        res.send("err"+err);
    })
});
module.exports= siswa;