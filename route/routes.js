const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const upload = multer({ dest: "uploads/" });


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
  
const uploads = multer({ 
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

router.post('/add-user', uploads, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.path
    });
    user.save((err) => {
        if (err) {
            res.json({message: err.message, type: 'bg-red-100', border: 'border-red-500', text: 'text-red-700'})
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
// contact page
router.get('/contact', (req, res) => {
    res.render('contact', {title: 'contact'})
});
// about page
router.get('/about', (req, res) => {
    res.render('about', {title: 'about'})
});
// add user
router.get('/add-user', (req, res) => {
    res.render('add-user', {title: 'add-user'})
});

// edit user
router.get('/edit-user/:id', (req, res) => {

    let id = req.params.id;
    console.log(id, "hello")
    User.findById(id, (err, user) => {
        if (err) {
            res.redirect('/')
        } else {
            if (user == null) {
                res.redirect('/')
            } else {
                res.render('edit-user', {
                    title: 'Edit user',
                    user: user
                })
            }
        }
    })
});

// update a user
router.post('/update/:id', uploads, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image =req.file.filename;;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image)
        } catch(err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image
    }, (err, result) => {
        if (err) {
        res.json({message: err.message, type: 'bg-red-100', border: 'border-red-500', text: 'text-blue-700'})
        } else {
            req.session.message = {
                type: 'bg-green-100',
                border: 'border-blue-500',
                text: 'text-blue-700',
                message: 'user updated successfully'
            }
            res.redirect('/')
        }
    })
})

// Delete a user 
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;

    User.findOneAndRemove(id, (err, result) => {
        if (result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image)
            } catch(err) {
                console.log(err)
            }
        };

        if (err) {
            res.json({message: err.message, type: 'bg-red-100', border: 'border-red-500', text: 'text-blue-700'})
        } else {
            req.session.message = {
                type: 'bg-green-100',
                border: 'border-blue-500',
                text: 'text-blue-700',
                message: 'user deleted successfully'
            }
            res.redirect('/')
        }
    })
})

module.exports = router;