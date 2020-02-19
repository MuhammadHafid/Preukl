const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pelSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    ketepatan:{
        type:String
    },
    kerajinan:{
        type:String
    },
    kerapian:{
        type:String,
    },
    totalPoin:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mPel = mongoose.model('dataPel',pelSchema)