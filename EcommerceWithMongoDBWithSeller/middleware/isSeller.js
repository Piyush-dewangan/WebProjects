function isSeller(req, res, next) {
  if (req.session.user.isSeller) {
    next();
    return;
  }

  res.redirect("/");
}
module.exports = isSeller;
