// const mongoose = require("mongoose");
// const Listing = require("../models/listing.js");
// const initData = require("./data.js");

// const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';

// main()
// .then(() => {
//     console.log("connected to db");
// })
// .catch((err) => {
//     console.log(err);
// });

// async function main() {
//     await mongoose.connect(MONGO_URL);
// };

// const initDB = async() => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({
//         ...obj,
//         owner: "6768e0ffd8e3dc379f7a646d"
//     }));
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
// };
 
// initDB();

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/myLocalDB"; // Fallback for local dev

mongoose.connect(dbUrl) // change this

async function addCategoryToListings() {
    await Listing.updateMany(
        { category: { $exists: false } },
        { $set: { category: "Trending" } }
    );
    console.log("Default category added to listings.");
    mongoose.connection.close();
}

addCategoryToListings();
