let controller = {};
let models = require('../models');
let Course = models.Course;
let Review=models.Review;
let Sequelize = require('sequelize');
const e = require('express');
const guestreview = require('../models/review');
let Op = Sequelize.Op;

controller.add=(comment=>{
    return new Promise((resolve,reject)=>{
        Review
        .create(comment)
        .then(data=>resolve(data))
        .catch(error=>reject(new Error(error)));
    })
})


module.exports = controller;