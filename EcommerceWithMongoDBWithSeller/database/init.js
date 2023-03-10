const mongoose = require("mongoose");
// 0.
// main().catch((err) => console.log(err));

module.exports = async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/EcommerceWithSeller");
  // await mongoose.connect(
  //   "mongodb+srv://yogesh:Vyogesh07032002@cluster0.zjs4vuh.mongodb.net/ecommerce?retryWrites=true&w=majority"
  // );

  console.log("database connected");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};
