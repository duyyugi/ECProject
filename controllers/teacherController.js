let controller = {};
let models = require('../models');
let User = models.User;
let User_Skill = models.User_Skill;
let Skill = models.Skill;
let User_Course = models.User_Course;
let Category=models.Category;
let Course = models.Course;
let Object = models.Object;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
var bcrypt = require('bcryptjs');

controller.get_teacher_course=(userID)=>{
    return Course.findAll({
        attributes: ['courseID','name', 'price', 'imagePath', 'NoVideos', 'description', 'priceDis', 'startedAt', 'endedAt', 'objectId', 'categoryID', 'userID', 'skillID', 'NumberStudent'],
        where: {
            userID: userID
        }
    })
}

controller.getCategory = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['categoryID', 'name', 'imagePath'],
            include: [{ model: models.Course }]
        };
        Category
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.getSkill=()=>{
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['skillID','skillName'],
        };
        Skill
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
}

controller.getObject=()=>{
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id','name'],
        };
        Object
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
}

controller.add_teacher_Course=(course=>{
    return new Promise((resolve,reject)=>{
        Course
        .create(course)
        .then(data=>resolve(data))
        .catch(error=>reject(new Error(error)));
    })
})

module.exports = controller;

