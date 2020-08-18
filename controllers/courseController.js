let controller = {};
let models = require('../models');
let Course = models.Course;
let Bill_Detail = models.Bill_Detail;
let User_Course = models.User_Course;
let Lesson = models.Lesson;
let db = require('../models/index');
let Review = models.Review;
let GuestReview = models.GuestReview;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            include: [{ model: models.Category }],
            where: {
                price: {
                    [Op.gte]: query.min,
                    [Op.lte]: query.max
                }
            }
        }
        if (query.category > 0) {
            options.where.categoryID = query.category;
        }
        if (query.object > 0) {
            options.where.objectId = query.object;
        }
        if (query.user > 0) {
            options.where.userID = query.user;
        }
        if (query.search != '') {
            options.where.name = {
                [Op.iLike]: `%${query.search}%`
            }
        }
        if (query.object > 0) {
            options.where.objectId = query.object;
        }
        if (query.user > 0) {
            options.where.userID = query.user;
        }
        if (query.limit > 0) {
            options.limit = query.limit;
            options.offset = query.limit * (query.page - 1);
        }
        if (query.sort) {
            switch (query.sort) {
                case 'name':
                    options.order = [
                        ['name', 'ASC']
                    ];
                    break;
                case 'price_increase':
                    options.order = [
                        ['price', 'ASC']
                    ];
                    break;
                case 'price_reduction':
                    options.order = [
                        ['price', 'DESC']
                    ];
                    break;
                default:
                    options.oder = [
                        ['name', 'ASC']
                    ];

            }
        }
        Course
            .findAndCountAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.getTopCourses = () => {
    return new Promise((resolve, reject) => {
        let options = {
            include: [{ model: models.Category }],
            order: [
                ['NumberStudent', 'DESC']
            ],
            limit: 8
        }
        Course
            .findAll(options)
            .then(result => resolve(result))
            .catch(error => reject(new Error(error)));
    })
}

controller.getCourseByUserID = (userID) => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['courseID'],
            where:{
                userID: userID
            }
        }
        User_Course
            .findAll(options)
            .then(result => resolve(result))
            .catch(error => reject(new Error(error)));
    })
}
controller.getById = (courseID) => {
    return new Promise((resolve, reject) => {
        let course;
        Course
            .findOne({
                where: { courseID: courseID },
                include: [{ model: models.Category }]
            })
            .then(result => {
                course = result;
                relatedCourse = result;
                return models.Review.findAll({
                    where: { courseID: courseID },
                    include: [{ model: models.User }]
                })
            })
            .then(comment => {
                course.Reviews = comment;
                resolve(course);
            })
            .catch(error => reject(new Error(error)));
    });
};

controller.getrelatedCourse = () => {
    return new Promise((resolve, reject) => {
        let options = {
            include: [{ model: models.Category }],
        }
        Course
            .findAll(options)
            .then(result => resolve(result))
            .catch(error => reject(new Error(error)));
    });
};

controller.getskillID = (courseID) => {
    return Course.findOne({
        attributes: ['courseID', 'skillID'],
        where: {
            courseID: courseID
        }
    })
}

controller.getCourseDetail = (courseID) => {
    return Course.findOne({
        where: {
            courseID: courseID
        }
    })
}

controller.getTopCourse = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth()) + '-' + today.getDate();
    return Bill_Detail.findAll({
        attributes: ['courseID', [db.Sequelize.fn('COUNT', 'courseID'), 'courseCount']],
        where: {
            createdAt: {
                [Op.gt]: date
            }
        },
        group: ['courseID'],
        raw: true,
        order: db.Sequelize.literal('"courseCount" DESC')
    })
}

controller.addUser_course = (user_course) => {
    return User_Course.create(user_course);
};

controller.getCourseIDByUserID=(userID)=>{
    return User_Course.findAll({
        attributes: ['courseID'],
        where:{
            userID: userID
        }
    })
};

controller.getLessonByCourseID = (courseID)=>{
    return Lesson.findAll({
        where:{
            courseID: courseID
        }
    })
}

controller.getLessonDetail =(courseID,lessonNo)=>{
    return Lesson.findOne({
        where:{
            courseID:courseID,
            lessonNo:lessonNo
        }
    })
}


module.exports = controller;