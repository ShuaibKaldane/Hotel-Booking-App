require("dotenv").config({ path: "../.env" });  
const mongoose = require("mongoose");
const Listing = require("./Listening.js")
const sample = require("./data.js");    

async function main() {
  try {
 
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log(" MongoDB Connected");

 
    await Listing.deleteMany({});
    console.log(" Old listings deleted");

   
    await Listing.insertMany(sample.data);
    console.log(" Sample listings inserted");

  } catch (err) {
    console.error(" Error:", err);
  } finally {
    mongoose.connection.close(); 
  }
}

main();
