const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const User = require('./../models/user');
const bindUserDocumentToResponseLocals = require('./middleware/bind-user-to-response-locals');
const routeGuard = require('./middleware/route-guard');
const deserializeUser = require('./middleware/deserialize-user');


router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, 10)
    .then(hashAndSalt => {
      return User.create({
        username,
        passwordHashAndSalt: hashAndSalt
      });
    })
    .then(user => {
      console.log(user);
      res.redirect('/');
    })
    .catch(error => {
      // ...
    })
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    username
  })
    .then(user => {
      console.log(user);
      return bcrypt.compare(password, user.passwordHashAndSalt);
    })
    .then(comparison => {
      console.log(comparison);
      res.redirect('/');
    })
    .catch(error => {
      // error
    })
});

router.use(deserializeUser);
router.use(bindUserDocumentToResponseLocals);

router.get('/private', routeGuard, (req, res) => {
  res.render('private');
});

module.exports = router;
