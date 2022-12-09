const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');



router.get('/', (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            res.json({message: err.message})
        } else {
            res.render('index', {
                title: 'Home-page',
                users: users
            })
        }
    })
});



module.exports = router;