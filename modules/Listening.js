const mongoose = require('mongoose');

const list = new mongoose.Schema({
    title: {
        required : true,
        type : String
    },
    description : {
        type : String
    },
    image :{
        filname : String ,
        url :{
            type : String ,
            set : (v)=> v ==="" ? "https://images.unsplash.com/photo-1464069668014-99e9cd4abf16?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        default : "https://images.unsplash.com/photo-1464069668014-99e9cd4abf16?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        
        

    },
    price :{
        type : Number
    },
    location :{
        type : String
    },
    country :{
        type : String
    }

})

const Listening = mongoose.model("Listening", list)

module.exports = Listening;