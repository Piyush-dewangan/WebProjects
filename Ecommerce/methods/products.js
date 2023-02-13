const fs = require("fs");
module.exports = function (quantity) {
  fs.readFile(__dirname + "public/db/product.txt", "utf-8", (err, data) => {
    let products;

    products = JSON.parse(data);
    return products;
  });
};
