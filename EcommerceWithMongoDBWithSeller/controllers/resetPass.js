const resetGet = (req, res) => {
  const { token } = req.params;

  fs.readFile(__dirname + "/user.txt", "utf-8", (err, data) => {
    let users = JSON.parse(data);
    for (let i = 0; i < users.length; i++) {
      if (users[i].mailToken == token) {
        flag = true;
        req.session.name = users[i].name;
        req.session.user = users[i];
        req.session.is_logged_in = true;
        req.session.isVerified = true;
        res.redirect("/changepass");

        return;
      }
    }
  });
};

module.exports = resetGet;
