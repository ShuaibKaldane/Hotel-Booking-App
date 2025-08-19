const mongoose = require('mongoose');
const list = require("./Listening.js");
const sample = require("./data.js")
main().then(()=>{
    console.log("Database Connected Sucessfully")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

 
}

async function database(){
    await  list.deleteMany({});
    await list.insertMany(sample.data);
    console.log("Data inserted Sucessfully");
}

database();