let express = require('express');
let router = express.Router();

let courseController = require('../controllers/courseController');
let categoryController = require('../controllers/categoryController');
let objectController = require('../controllers/objectController');
let userController = require('../controllers/userController');

router.get('/', async (req, res, next) => {
    let list_objects = [];
    if(!req.session.user){
        list_objects.push(0);
    }
    else{
        let userId = req.session.user.userID;
        let coureseBuyed = await courseController.getCourseByUserID(userId);
        for(let i=0; i<coureseBuyed.length; i++ ){
            list_objects.push(coureseBuyed[i].courseID);
        }
    }
    if ((req.query.category == null) || isNaN(req.query.category)) {
        req.query.category = 0;
    }
    if ((req.query.object == null) || isNaN(req.query.object)) {
        req.query.object = 0;
    }
    if ((req.query.use == null) || isNaN(req.query.use)) {
        req.query.use = 0;
    }
    if ((req.query.min == null) || isNaN(req.query.min)) {
        req.query.min = 0;
    }
    if ((req.query.max == null) || isNaN(req.query.max)) {
        req.query.max = 5000000;
    }
    if ((req.query.sort == null)) {
        req.query.sort = 'name';
    }
    if ((req.query.limit == null) || isNaN(req.query.limit)) {
        req.query.sort = 9;
    }
    if ((req.query.page == null) || isNaN(req.query.page)) {
        req.query.page = 1;
    }
    if ((req.query.search == null) || (req.query.search.trim() == '')) {
        req.query.search = '';
    }
    categoryController
        .getAll(req.query)
        .then(data => {
            res.locals.categories = data;
            return  objectController.getAll(req.query);
        })
        .then(data => {
            res.locals.objects = data;
            return  userController.getAllTeacher(req.query);
        })
        .then(data => {
            res.locals.userTeachers = data;
            return  courseController.getAll(req.query);
        })
        .then(data => {
            
            for(let i=0; i<data.rows.length; i++){
                let value = data.rows[i].courseID;
                for(let j=0;j<list_objects.length;j++){
                    if(value == list_objects[j]){
                        delete data.rows[i];
                    }
                }
            }
            res.locals.courses = data.rows;
            
            res.locals.pagination = {
                page: parseInt(req.query.page),
                limit: parseInt(req.query.limit),
                totalRows: data.count
            };
            return  courseController.getTopCourses();
        })
        .then(data => {
            res.locals.topCourses = data;
            res.render('category');             
        })
        .catch(error => next(error));
});

router.get('/:courseID', (req, res, next) => {
    let courseController = require('../controllers/courseController')
    courseController
        .getById(req.params.courseID)
        .then(course => {
            res.locals.course = course;
            return courseController.getrelatedCourse();
        })
        .then(course => {
            res.locals.relatedCourse = course;
            res.render('single-product');
        })
        .catch(error => next(error));
})



module.exports = router;