// const { Router } = require('express');
const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    res.render('login', {title: 'Login'})
});

module.exports = router