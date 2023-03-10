function isAdmin(req, res, next) {
  if (req.session.isAdmin) {
    console.log(req.session);
    next();
    return;
  } else {
    res.redirect("/admin/login");
  }
}
module.exports = isAdmin;
