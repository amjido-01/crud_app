const express = require('express');
// const { default: mongoose } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String, // need to make some research
        required: true
    },
    image: {
        type: String,
        required: true,
        extension: String,
        data: Buffer,
        contentType: String
    },
    created: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema)