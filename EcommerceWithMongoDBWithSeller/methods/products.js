const fs = require("fs");

module.exports = function (callback) {
  let products;

  fs.readFile(__dirname + "public/db/product.txt", "utf-8", (err, data) => {
    products = data;
    console.log("ata",JSON.stringify(data));

    callback(null, products);
  });
};
