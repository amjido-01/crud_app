const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session') // look up on this youtube video letter
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

// connect to the database
mongoose.connect(process.env.DB_URI, {useNewUrlparser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('database connected'))

app.get('/', (req, res) => {
    res.send('hello world');
})
  
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})