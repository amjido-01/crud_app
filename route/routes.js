const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const extensionName = file.mimetype.split('/')[1]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extensionName)
    }
})
  
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {

        // The function should call `cb` with a boolean
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true)
        } else {
            cb(null, false);
            // console.log('invalid file extension')
            // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
  
    }
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
        } else if (!req.file) {
            console.log('invalid file extension');
            return res.status(400).send({
                type: 'bg-red-100',
                border: 'border-red-500',
                text: 'text-red-700',
                message: 'invalide file extension'
            });
        }
        else {
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