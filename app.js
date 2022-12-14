const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session') // look up on this youtube video letter
require('dotenv').config();
const router = express.Router();
const path = require('path');
const fs = require('fs')
var bodyParser = require('body-parser');
const morgan = require('morgan')
const User = require('./models/users')


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))

// connect to the database
mongoose.connect(process.env.DB_URI, {useNewUrlparser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.log("database not connected"));
db.once('open', () => console.log('database is connected'))

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message,
    delete req.session.message,
    next()
});

app.use((req, res, next) => {
    res.locals.checkMessage = req.session.checkMessage,
    delete req.session.checkMessage,
    next()
});

app.use(morgan('tiny'))
app.use(express.static('uploads'))



// template engine
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'views')))

// app.use('', require('./route/routes'))
app.use('/', require('./route/index'));
app.use('', require('./route/routes'))

  
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`)
})