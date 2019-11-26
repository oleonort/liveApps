const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');

router.post('/register', (req, res) => {
   const { name, email, password, confirmPassword } = req.body;
   const errors = [];

   if (!name || !email || !password || !confirmPassword) {
       errors.push({ msg: 'Please fill in all required fields'});
   }

   if (password !== confirmPassword) {
       errors.push({ msg: 'Passwords do no match' });
   }

   if (password.length < 6) {
       errors.push({ msg: 'Password should be at least 6 characters' });
   }

   if (errors.length) {
       res.send(errors);
   } else {
       User.findOne({ email })
           .then(user => {
               if (user) {
                   errors.push({ msg: 'Email is already registered'});
                   res.send(errors);
               } else {
                   const newUser = new User({
                       name,
                       email,
                       password
                   });

                   // Hash password
                   bcrypt.genSalt(10, (err, salt) => {
                       bcrypt.hash(newUser.password, salt, (err, hash) => {
                           if (err) throw err;
                           // Set password to hash
                           newUser.password = hash;

                           // Save user to db
                           newUser.save()
                               .then(user => res.redirect('/login'))
                               .catch(err => console.log(err))
                       });
                   });
               }
           });
   }
});

router.post('/login', (req, res) => {
    console.log(res);
});

module.exports = router;