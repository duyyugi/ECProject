let express = require('express');
let router = express.Router();
let courseController = require('../controllers/courseController');
let userController = require('../controllers/userController')

router.get('/:id-:lessonNo', async (req, res, next) => {
    try {
        let user = req.session.user ? req.session.user : null;
        let check = false;
        if (!user) {
            res.sendStatus(404);
        }
        else {
            let userIDsHaveCourse = await userController.getUserIDsHaveCourse(req.params.id);
            for (let i in userIDsHaveCourse) {
                if (user.userID == userIDsHaveCourse[i].userID) {
                    check = true;
                    break;
                }
            }
            if (check == false) {
                res.render("study", {
                    check : false
                });
            }
            else {
                let Lessons = await courseController.getLessonByCourseID(req.params.id);
                let currentCourse = await courseController.getCourseDetail(req.params.id);
                let lessonDetail = await courseController.getLessonDetail(req.params.id, req.params.lessonNo);
                let nextLesson = Lessons.length;
                let prevLesson = 1;
                let currLesson = lessonDetail.lessonNo;
                if (currLesson < Lessons.length) {
                    nextLesson = currLesson + 1;
                }
                if (currLesson > 1) {
                    prevLesson = currLesson - 1;
                }
                res.render("study", {
                    Lessons: Lessons,
                    lessonDetail: lessonDetail,
                    currentCourse: currentCourse,
                    nextLesson: nextLesson,
                    prevLesson: prevLesson,
                    currLesson: currLesson,
                    check : true
                });
            }
        }
    } catch (err) {
        next(err);
    }
})

module.exports = router;