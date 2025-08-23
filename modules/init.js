require("dotenv").config({ path: "../.env" });  
const mongoose = require("mongoose");
const Listing = require("./Listening.js");
const sample = require("./data.js");    

async function main() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("✅ MongoDB Connected");

    // clear old data
    await Listing.deleteMany({});
    console.log("🗑️ Old listings deleted");

    // insert sample listings
    await Listing.insertMany(sample.data);
    console.log("🌱 Sample listings inserted");

    // assign owner to all listings
    const userId = "68a9593acb1e836510c65d20";
    await Listing.updateMany({}, { $set: { owner: userId } });
    console.log("👤 Owner assigned to all listings");

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.connection.close();
  }
}

main();
