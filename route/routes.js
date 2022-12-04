const express = require('express');
const router = express.Router();


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