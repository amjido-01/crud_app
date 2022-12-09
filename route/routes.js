const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
  
const upload = multer({ 
    storage: storage
}).single('image');

router.post('/add-user', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.path
    });
    user.save((err) => {
        if (err) {
            res.json({message: err.message, type: 'bg-red-100'})
        } else {
            req.session.message = {
                type: 'bg-green-100',
                border: 'border-blue-500',
                text: 'text-blue-700',
                message: 'user added successfully'
            };
            console.log('user added')
            res.redirect('/')
        }
    })
})
router.get('/contact', (req, res) => {
    res.render('contact', {title: 'contact'})
});
router.get('/about', (req, res) => {
    res.render('about', {title: 'about'})
});
router.get('/add-user', (req, res) => {
    res.render('add-user', {title: 'add-user'})
});

module.exports = router;