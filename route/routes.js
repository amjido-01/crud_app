const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require("nodemailer");
var bodyParser = require('body-parser');

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASS = process.env.GMAIL_PASS

// const bodyParser = require('bodyParser')
// const upload = multer({ dest: "uploads/" });

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))


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
    console.log(req.body)
    const exampleCheck25 = req.body.myCheckbox
    if (!exampleCheck25 === true) {
        console.log('checkbox ' + ' not checked')
    } else {
        console.log('checkbox is' + 'checked, welcome')
    }

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


router.post('/contact', (req, res) => {
    // console.log(req.body)

    // node mailer server instance
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    });

    // Specify what the email will look like
    const mailOpts = {
        from: req.body.email,  // This is ignored by Gmail
        to:  GMAIL_USER,
        subject: `message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }


    // Attempt to send the email
    transporter.sendMail(mailOpts, (error, response) => {
    if (error) {
    //   res.send('contact-failure') // Show a page indicating failure
        console.log(error);
        res.render('error-page', {title: 'error'})
        // res.send('erro')
    } else {
        res.render('index', {title: 'hello'})
      //res.render('hello') // Show a page indicating success
    }
  })

})

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