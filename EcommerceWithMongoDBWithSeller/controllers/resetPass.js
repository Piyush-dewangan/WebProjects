const UserModal = require("../database/users");

const resetGet = async (req, res) => {
  const { token } = req.params;

  let user = await UserModal.findOne({ mailToken: token });
  if (user.mailToken == token) {
    flag = true;
    req.session.name = users[i].name;
    req.session.user = users[i];
    req.session.is_logged_in = true;
    req.session.isVerified = true;
    res.redirect("/changepass");

    return;
  }
};

module.exports = resetGet;
