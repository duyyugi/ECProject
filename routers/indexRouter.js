let express = require('express');
let router = express.Router();
let categoryController = require('../controllers/categoryController');
let userController = require('../controllers/userController');
let courseController = require('../controllers/courseController')

router.get('/', async (req, res, next) => {
    try {
        res.locals.categories = await categoryController.getAll();
        let topCourse = await courseController.getTopCourse();
        let top8Course = [];
        // If user don't login, render top 8 popular recommended course related to all skills
        if (!req.session.user) {
            for (let i = 0; i < topCourse.length; i++) {
                if (i < 8) {
                    let courseDetail = await courseController.getById(topCourse[i].courseID);
                    top8Course.push(courseDetail)
                }
            }
            res.locals.courseOffereds = top8Course;
            res.render('index');
        }
        else {
            let courseOfUser = await courseController.getCourseIDByUserID(req.session.user.userID);
            let userSkillID = await userController.getSkillID(req.session.user.userID);
            // If user don't have favorite skills, render top 8 popular recommended course related to all skills and user haven't bought
            if (userSkillID.length == 0) {
                let i = 0;
                while (i < topCourse.length) {
                    if (top8Course.length == 8) {
                        break;
                    }
                    let check = false;
                    for (let j in courseOfUser) {
                        if (topCourse[i].courseID == courseOfUser[j].courseID) {
                            check = true;
                            break;
                        }
                    }
                    if (!check) {
                        let courseDetail = await courseController.getById(topCourse[i].courseID);
                        top8Course.push(courseDetail);
                    }
                    i++;
                }
                res.locals.courseOffereds = top8Course;
                res.render('index');
            } else {
                // If user have favorite skills, render top 8 popular recommended course related to this skills and user haven't bought
                let topCourseUserID = [];
                for (let i = 0; i < topCourse.length; i++) {
                    if (!topCourse[i].courseID) {
                        break;
                    }
                    let checkCourse = true;
                    for (let j in courseOfUser) {
                        if (topCourse[i].courseID == courseOfUser[j].courseID) {
                            checkCourse = false;
                            break;
                        }
                    }
                    if (checkCourse) {
                        let courseSkillID = await courseController.getskillID(topCourse[i].courseID);
                        for (let k = 0; k < userSkillID.length; k++) {
                            if (courseSkillID.skillID == userSkillID[k].skillID) {
                                topCourseUserID.push(courseSkillID.courseID);
                            }
                        }
                    }
                }
                let topCourseUserDetail = [];
                for (let i = 0; i < topCourseUserID.length; i++) {
                    let courseDetail = await courseController.getById(topCourseUserID[i]);
                    if (i < 8) {
                        topCourseUserDetail.push(courseDetail);
                    }
                }
                res.locals.courseOffereds = topCourseUserDetail;
                res.render('index');
            }
        }
    }
    catch (err) {
        next(err);
    }
})
module.exports = router;