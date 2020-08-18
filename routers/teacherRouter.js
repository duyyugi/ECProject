let express = require('express');
let models = require('../models');
let router = express.Router();
let teacherController = require('../controllers/teacherController');
let adminController = require('../controllers/adminController');
let userController = require('../controllers/userController');
let dateFormat = require('dateformat');
const { on } = require('nodemon');

// set multer control
let multer = require('multer');
let imageMimeTypes = ['image/jpeg', 'image/png'];
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/course')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
})
let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', (req, res) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let teacherRoleID = req.session.user.roleID;
    if (teacherRoleID == 2) {
        res.send('teacher');
    } else {
        res.sendStatus(404);
    }
})

router.get('/select_teacher_course', (req, res, next) => {
    teacherController
        .get_teacher_course(req.session.user.userID)
        .then(data => {
            for(let i in data){
                data[i].date_startedAt=dateFormat(data[i].startedAt,'dd/mm/yyyy');
                data[i].date_endedAt=dateFormat(data[i].endedAt,'dd/mm/yyyy');
                }
            res.locals.teachercourses = data;
            res.render('select_teacher_course');
        })
        .catch(error => next(error));
})

router.get('/insert_teacher_course', (req, res, next) => {
    adminController
        .getCategory()
        .then(data => {
            res.locals.Categories = data;
            return adminController.getUser();
        })
        .then(data => {
            res.locals.Users = data;
            return adminController.getSkill();
        })
        .then(data => {
            res.locals.Skills = data;
            return adminController.getObject();
        })
        .then(data => {
            res.locals.Object = data;
            console.log(data)
            res.render('insert_teacher_course',{
                title: "Thêm Khóa Học",
                nameButton: "Thêm khóa học"
            });
        })
        .catch(error => next(error));
})

router.post('/insert_teacher_course',upload.single('imagePath'), (req, res, next) => {
    let fileName = req.file != null ? req.file.filename : null
    let image='/img/course/'+ fileName
    try{
        let course = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            imagePath: image,
            NoVideos: req.body.NoVideos,
            priceDis: req.body.priceDis,
            startedAt: req.body.startedAt,
            endedAt: req.body.endedAt,
            objectId: req.body.objectId,
            categoryID: req.body.categoryID,
            userID: req.session.user.userID,
            skillID: req.body.skillID,
            NumberStudent: req.body.NumberStudent,
        }
        console.log(course)
        adminController
        .addCourse(course)
            .then(data => {
                res.redirect('/teacher/select_teacher_course');
            })
    }catch (err) {
        next(err);
    }
});

router.get('/update_teacher_course', (req, res, next) => {
    let course_temp;
    let courses = adminController.getcourseId(req.query.courseID)
        .then(data => {
            course_temp=data;
            res.locals.courses = data;
            return adminController.getObject_insert(data.objectId)
        })
        .then(data=>{
            res.locals.objects=data;
            return adminController.getCategory_insert(course_temp.categoryID)
        })
        .then(data=>{
            res.locals.categories=data;
            return adminController.getUser_insert(course_temp.userID)
        })
        .then(data=>{
            res.locals.users=data;
            return adminController.getSkills_insert(course_temp.skillID)
        })
        .then(data=>{
            res.locals.skills=data;
            return adminController.getObject()
        })
        .then(data => {
            res.locals.Objects_update = data;
            return adminController.getUser();
        })
        .then(data => {
            res.locals.Users_update = data;
            return adminController.getSkill();
        })
        .then(data=>{
            res.locals.Skills_update=data;
            return adminController.getCategory()
        })
        .then(data=>{
            res.locals.Categories_update=data;
            res.render('update_teacher_course',{
                title: "Chỉnh Sửa Khóa Học",
                nameButton: "Chỉnh sửa khóa học",
                startedAt: course_temp.startedAt.toISOString().substr(0,10),
                endedAt: course_temp.endedAt.toISOString().substr(0, 10)
            });
        })
        .catch(error => next(error));
})

router.post('/update_teacher_course',upload.single('imagePath'),(req, res, next)=>{
    let course_change=adminController.getcourseId(req.query.courseID)
    let fileName = req.file != null ? req.file.filename : null
    if (fileName) {
        if (course_change.imagePath != req.body.imagePath) {
            const fs = require('fs');
            let oldAvatarPath = './public/img/course/' + course_change.imagePath;
            fs.unlink(oldAvatarPath, function (err) {
                if (err) throw err;
            });
            //set new avatar image
        }
        course_change.imagePath = '/img/course/' + fileName;
    }
    course_change.courseID=req.body.courseID,
    course_change.name= req.body.name,
    course_change.description= req.body.description,
    course_change.price= req.body.price,
    course_change.NoVideos= req.body.NoVideos,
    course_change.priceDis= req.body.priceDis,
    course_change.startedAt=req.body.startedAt,
    course_change.endedAt=req.body.endedAt,
    course_change.objectId=req.body.objectId,
    course_change.categoryID= req.body.categoryID,
    course_change.userID=req.session.user.userID,
    course_change.skillID=req.body.skillID,
    course_change.NumberStudent=req.body.NumberStudent,
    adminController
    .update_course(course_change)
    .then(data => {
        res.redirect('/teacher/select_teacher_course');
    })
})

router.get('/delete_teacher_course',(req, res, next)=>{
    adminController.delete_course(req.query.courseID)
    //adminController.delete_user_course(req.params.courseID)
    //adminController.delete_review(req.params.courseID)
    .then(data=>{
        res.redirect('/teacher/select_teacher_course')
    })
    .catch(error => next(error));
})

router.get('/select_teacher_lession',(req, res, next)=>{
    adminController
    .getLession(req.query.courseID)
    .then(data=>{
        res.locals.lessions=data
        res.render('select_teacher_lession',{
            courseID:req.query.courseID
        });
    })
    .catch(error => next(error));
})

router.get('/insert_teacher_lession',(req, res, next)=>{
    adminController.getcourseId(req.query.courseID)
    .then(data=>{
        res.locals.course_teacher_lession=data;
        res.render('insert_teacher_lession');
    })
    .catch(error => next(error));
})

router.post('/insert_teacher_lession',upload.single('imagePath'), (req, res, next)=>{
    let fileName = req.file != null ? req.file.filename : null
    let image='/img/course/'+ fileName
    try {
        let lession = {
            name: req.body.name,
            lessonNo: req.body.lessonNo,
            urlLesson: req.body.urlLesson,
            imagePath: image,
            courseID: req.body.courseID,
        }
        adminController
            .addLession(lession)
            .then(data => {
                res.redirect('/teacher/select_teacher_lession?courseID='+req.body.courseID);
            })
    } catch (err) { next(err); }
})

router.get('/update_teacher_lession',(req, res, next)=>{
    adminController
    .getLessionID(req.query.lessonID)
    .then(data=>{
        res.locals.lessions_teacher_update=data;
        console.log(data)
        res.render('update_teacher_lession')
    })
})

router.post('/update_teacher_lession',upload.single('imagePath'),(req, res, next)=>{
    let lession_change=adminController.getLessionID(req.body.lessonID)
    let fileName = req.file != null ? req.file.filename : null
    lession_change.imagePath = '/img/course/' + fileName;
    lession_change.lessonID= req.body.lessonID,
    lession_change.name=req.body.name,
    lession_change.lessonNo=req.body.lessonNo,
    lession_change.urlLesson=req.body.urlLesson,
    adminController
    .update_lession(lession_change)
    .then(data=>{
        res.redirect('/teacher/select_teacher_lession?courseID=' + req.body.courseID);
    })
})

router.get('/delete_teacher_lession',(req, res, next)=>{
    adminController
    .delete_lession(req.query.lessonID)
    .then(data=>{
        res.redirect('/teacher/select_teacher_lession?courseID=' + req.query.courseID);
    })
})


router.get('/teacher_revenue', async(req, res, next) => {
    try {
        let BD = await adminController.getbill_detail();
        let course = await adminController.getCourse();
        let oneteacher = await userController.getOneTeacher(req.session.user.userID)
        let CID = [];
        let revC = [];
        let cname = [];
        let UID = [];
        let data = [];
        let object = [];
        let flag = 0;
        for (let k = 0; k < course.length; k++) {
            revC[k] = 0;
            cname[k] = '';
        }
        for (let i = 0; i < course.length; i++) {
            flag = 0;
            for (let j = 0; j < BD.length; j++) {
                if (course[i].courseID == BD[j].courseID) {
                    revC[i] += BD[j].price;
                    cname[i] = course[i].name;
                    CID[i] = course[i].courseID;
                    UID[i] = course[i].userID;
                    object = {
                        UID: UID[i],
                        ID: CID[i],
                        NAME: cname[i],
                        REVC: revC[i]
                    }
                    flag = 1; //đặt cờ hiệu để khi push vào object không bị trùng
                }
            }
            if (flag == 1) {
                data.push(object); //data vẫn push những object đã nhận từ vòng lặp trước vì có những courseID không tồn tại trong Bill_Details.
            }
        }

        let revTeacher = 0;
        let data2 = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].UID == oneteacher.userID) {
                revTeacher += data[i].REVC;
                data2.push({
                    CNAME: data[i].NAME,
                    REVENUE: data[i].REVC
                })
            }
        }
        res.locals.GV = oneteacher.name;
        res.locals.ID = oneteacher.userID;
        res.locals.sumRev = revTeacher;
        res.locals.OneTeacher = data2;
        res.render('teacher_revenue');
    } catch (err) {
        next(err);
    }
})


module.exports = router;