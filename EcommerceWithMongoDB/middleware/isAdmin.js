function isAdmin(req, res, next) {
  if (req.session.user.isAdmin) {
    next();
    return;
  }

  res.redirect("/");
}
module.exports = isAdmin;
