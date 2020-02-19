const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoUrl = "mongodb://localhost:27017/Telkom";
const port = process.env.PORT || 2800;
var app = express();

app.use(BodyParser.json());
app.use(cors());
app.use(
    BodyParser.urlencoded({
        extended:false
    })
);
mongoose.Promise = global.Promise;
mongoose
    .connect(mongoUrl,{ useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const siswa = require("./routes/serverSiswa");
app.use("/siswa",siswa);
const guru = require("./routes/serverGuru");
app.use("/guru",guru);


app.listen(port,()=>{
    console.log("server running on port" + port);
});