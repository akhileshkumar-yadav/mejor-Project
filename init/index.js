const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const connection = "mongodb://127.0.0.1:27017/Wonderlust"; // replace with your MongoDB connection string

main()
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(connection);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "683fc072c5810fde9455f8e6",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
