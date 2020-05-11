const routeGuard = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/views/main.hbs');
  }
};

module.exports = routeGuard;