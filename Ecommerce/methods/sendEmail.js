const mailjet = require("node-mailjet").apiConnect(
  "43d3a6d57465246a9544ce9451aa4946",
  "a8a3ea68a402231f04d78fcb908df7dd"
);
module.exports = function (email, callback) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "vyogesh624@gmail.com",
          Name: "Yogesh Verma",
        },
        To: [
          {
            Email: email,
            Name: "You",
          },
        ],
        Subject: "Welcome To Our ECommerce",
        TextPart: "Greetings from ClothMart!",
        HTMLPart:
          '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
      },
    ],
  });
  request
    .then((result) => {
      // console.log(result.body);
      callback(null, result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
      callback(err, result.body);
    });
};
