function isAuth(req, res, next) {
  if (req.session.is_logged_in && req.session.isVerified) {
    next();
    return;
  } else if (req.session.is_logged_in && req.session.isVerified == false) {
    res.send("Check your Email For Verification");
    return;
  }
  res.redirect("/login");
}
module.exports = isAuth;
