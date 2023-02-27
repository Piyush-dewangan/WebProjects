const mailjet = require("node-mailjet").apiConnect(
  "43d3a6d57465246a9544ce9451aa4946",
  "a8a3ea68a402231f04d78fcb908df7dd"
);
module.exports = function (email, name, token, callback) {
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
        HTMLPart: `<h3>Dear  ${name}, welcome to <a href="http://localhost:3000/resetPass/${token}">reset link</a>!</h3><br />This is your resel link!`,
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
