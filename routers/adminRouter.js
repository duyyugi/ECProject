let express = require('express');
let models = require('../models');
let router = express.Router();
let userController = require('../controllers/userController');
let adminController = require('../controllers/adminController');
let billController = require('../controllers/billController');
let dateFormat = require('dateformat');
let Course = models.Course;
// set multer control
let multer = require('multer');
let imageMimeTypes = ['image/jpeg', 'image/png'];
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/course')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) => {
    try {
        if (!req.session.user) {
            res.sendStatus(404);
        }
        let adminRoleID = req.session.user.roleID;
        if (adminRoleID == 3) {
            if ((req.query.searchUser == null) || (req.query.searchUser.trim() == '')) {
                req.query.searchUser = '';
            }
            if ((req.query.banned == null) || (req.query.banned.trim() == '')) {
                req.query.banned = "notBanned";
            }
            let iuser = await userController.getUseriLikeNameNotBanned(req.query.searchUser, req.query.banned);
            let page = parseInt(req.query.page) || 1;
            let perPage = 5;
            let numRow = iuser.count;
            let user = iuser.rows;
            let nPages = Math.floor(numRow / perPage);
            let pageNumbers = [];
            if (numRow % perPage > 0) {
                nPages++;
            }
            if (page < 1) {
                page = 1;
            }
            if (page > nPages) {
                page = nPages;
            }
            let start = (page - 1) * perPage;
            let end = page * perPage;
            for (let i = 1; i <= nPages; i++) {
                pageNumbers.push({
                    value: i,
                    isCurrentPage: i === +page
                })
            }
            res.locals.Users = user.slice(start, end);
            res.locals.prev_value = (+page - 1 != 0) ? +page - 1 : 1;
            res.locals.next_value = (+page + 1 != nPages + 1) ? +page + 1 : nPages;
            res.locals.pageNumbers = pageNumbers;
            res.locals.banned = req.query.banned;
            res.locals.searchUser = req.query.searchUser;
            res.render('admin-manager');
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.log(err);
    }
})
router.get('/addTeacher', async (req, res) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        res.render('addTeacher');
    }
    else {
        res.sendStatus(404);
    }
})
router.post('/', async (req, res, next) => {
    try {
        let getCheckedBannedUsers = req.body.checkAllBannedUser;
        let arrayCheckedBannedUsers = getCheckedBannedUsers.split(',');
        if (req.query.banned == "notBanned") {
            for (let i = 0; i < arrayCheckedBannedUsers.length; i++) {
                await userController.banUserByUsername(arrayCheckedBannedUsers[i]);
            }
        } else {
            for (let i = 0; i < arrayCheckedBannedUsers.length; i++) {
                await userController.unBanUserByUsername(arrayCheckedBannedUsers[i]);
            }
        }
        let redirectUrl = '/admin?page=1&banned=' + req.query.banned;
        res.redirect(redirectUrl);
    } catch (err) {
        next(err);
    }
})

// ==========Statistical ========================

// function lấy giá trị year trong chuỗi datetime
function getYear(year_input) {
    var d = new Date(year_input);
    var n = d.getFullYear();
    return n;
}
// function lấy giá trị month trong chuỗi datetime
function getMonth(month_input) {
    var m = new Date(month_input);
    var n = m.getMonth() + 1;
    return n;
}
//function xóa 1 phần tử trong mảng tai vi tri j
function deleteElementArray(arr, j) {
    for (let i = j + 1; i < arr.length; i++) {
        arr[i - 1] = arr[i];
    }
    arr.length--;
}
//function xóa các giá trị lặp trong mảng
function deleteRepeatValue(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
                deleteElementArray(arr, j);
                j--;
            }
        }
    }
    return arr;
}
//function khởi tạo một mảng
function createArr(size, defaultValue) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = defaultValue;
    }
    return arr;
}

//Xử lý statistical theo year

router.get('/statistical', async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.sendStatus(404);
        }
        let adminRoleID = req.session.user.roleID;
        if (adminRoleID == 3) {
            let list_year = [];
            let list_yearResult = [];
            let statis_year = await adminController.getAll();
            let arr = [];
            let listTotalRevenue = [];
            //Lấy danh sách tất cả những năm xuất bill
            for (let i = 0; i < statis_year.length; i++) {
                let year_data_1 = statis_year[i].createdAt;
                var result_1 = getYear(year_data_1);
                list_year.push(result_1);
            }
            //Lấy danh sách năm không trùng nhau
            let arr_yearResult = deleteRepeatValue(list_year);
            for (let i = 0; i < arr_yearResult.length; i++) {
                list_yearResult.push(arr_yearResult[i]);
            }
            //Tính doanh thu theo từng năm
            var result_2 = 0;
            let lengthRevenue = list_yearResult.length;
            arr = createArr(lengthRevenue, '0');
            for (let i = 0; i < statis_year.length; i++) {
                for (let j = 0; j < list_yearResult.length; j++) {
                    let year_data_2 = statis_year[i].createdAt;
                    result_2 = getYear(year_data_2);
                    if (result_2 == list_yearResult[j]) {
                        arr[j] = parseInt(arr[j]) + statis_year[i].revenue;
                    }
                }
            }
            for (let k = 0; k < list_yearResult.length; k++) {
                let valueRevenue = {
                    id: k + 1,
                    year: list_yearResult[k],
                    revenue: arr[k]
                }
                listTotalRevenue.push(valueRevenue);
            }
            res.locals.demos = listTotalRevenue;
            res.render('statistical');
        }
        else {
            res.sendStatus(404);
        }

    } catch (err) {
        next(err);
    }
})
//Xử lý statistical theo month
router.get('/statisticalmonth', async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.sendStatus(404);
        }
        let adminRoleID = req.session.user.roleID;
        if (adminRoleID == 3) {
            let list_year = [];
            let list_yearResult = [];
            let list_month_default = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let statis_month = await adminController.getAll();
            //Lấy danh sách tất cả những năm xuất bill
            for (let i = 0; i < statis_month.length; i++) {
                let year_data_1 = statis_month[i].createdAt;
                var result_1 = getYear(year_data_1);
                list_year.push(result_1);
            }
            //Lấy danh sách năm không trùng nhau
            let arr_yearResult = deleteRepeatValue(list_year);
            for (let i = 0; i < arr_yearResult.length; i++) {
                list_yearResult.push(arr_yearResult[i]);
            }
            //Khởi tạo một object json chứa thông tin year, month, revenue
            let list_datetime = [];
            for (let i = 0; i < list_yearResult.length; i++) {
                for (let j = 0; j < list_month_default.length; j++) {
                    let object_datetime = {
                        year: list_yearResult[i],
                        month: list_month_default[j],
                        revenue: 0
                    }
                    list_datetime.push(object_datetime);
                }
            }
            //Xử lý doanh thu theo tháng, năm rồi đổ vào revenue object json trên
            for (let i = 0; i < statis_month.length; i++) {
                let year_temp = statis_month[i].createdAt;
                let value_year = getYear(year_temp);
                let value_month = getMonth(year_temp);
                for (var j in list_datetime) {
                    if (list_datetime[j].year == value_year && list_datetime[j].month == value_month) {
                        list_datetime[j].revenue = list_datetime[j].revenue + statis_month[i].revenue;
                    }
                }
            }
            let list_totalRevenue_first = [];
            for (let i = 0; i < 12; i++) {
                list_totalRevenue_first.push(list_datetime[i]);
            }
            let list_totalRevenue_second = [];
            for (let i = 12; i < 24; i++) {
                list_totalRevenue_second.push(list_datetime[i]);
            }
            let list_totalRevenue_third = [];
            for (let i = 24; i < 36; i++) {
                list_totalRevenue_third.push(list_datetime[i])
            }
            res.locals.datamonths_one = list_totalRevenue_first;
            res.locals.datamonths_two = list_totalRevenue_second;
            res.locals.datamonths_three = list_totalRevenue_third;
            res.render('statistical_month');
        }
        else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
})
//xử lý statistical giảng viên
router.get('/statisticalteacher', async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.sendStatus(404);
        }
        let adminRoleID = req.session.user.roleID;
        if (adminRoleID == 3) {
            let list_teachers = [];
            let list_info_teacher = await adminController.getAllTeacher();
            for (let i = 0; i < list_info_teacher.length; i++) {
                let datetime = list_info_teacher[i].createdAt;
                let datetime_format = dateFormat(new Date(datetime), 'dd/mm/yyyy');
                let object = {
                    avatar: list_info_teacher[i].avatar,
                    name: list_info_teacher[i].name,
                    email: list_info_teacher[i].email,
                    phone: list_info_teacher[i].phone,
                    description: list_info_teacher[i].description,
                    createdAt: datetime_format
                }
                list_teachers.push(object);
            }
            res.locals.listTeachers = list_teachers;
            res.render('statistical-teachers');
        }
        else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
})
//Xử lý statistical học viên
router.get('/statisticalstudent', async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.sendStatus(404);
        }
        let adminRoleID = req.session.user.roleID;
        if (adminRoleID == 3) {
            let list_students = [];
            let list_info_student = await adminController.getAllStudents();
            for (let i = 0; i < list_info_student.length; i++) {
                let dateTimeStudents = list_info_student[i].createdAt;
                let dateTimeFormat = dateFormat(new Date(dateTimeStudents), 'dd/mm/yyyy');
                let object = {
                    avatar: list_info_student[i].avatar,
                    name: list_info_student[i].name,
                    email: list_info_student[i].email,
                    phone: list_info_student[i].phone,
                    description: list_info_student[i].description,
                    createdAt: dateTimeFormat
                }
                list_students.push(object);
            }
            res.locals.listStudents = list_students;
            res.render('statistical-students');
        }
        else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
})

//====================================================//

router.get('/bill-manager', async (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        adminController
            .getBill()
            .then(data => {
                for (let i in data) {
                    data[i].time = dateFormat(data[i].dateCreated, 'yyyy-mm-dd');
                }
                res.locals.Bill = data;
                res.render('bill-manager');
            })
            .catch(error => next(error));
    }
    else {
        res.sendStatus(404);
    }
})

router.get('/revenue', async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.sendStatus(404);
        }
        let adminRoleID = req.session.user.roleID;
        if (adminRoleID == 3) {
            let BD = await adminController.getbill_detail();
            let course = await adminController.getCourse();
            let teacher = await adminController.getTeacher();
            let CID = [];
            let revC = [];
            let cname = [];
            let data = [];
            let object1 = [];
            let object2 = [];
            let flag = 0;
            let UID = [];
            let revT = [];
            let tname = [];
            let data2 = [];
            for (let k = 0; k < course.length; k++) {
                revC[k] = 0;
                cname[k] = '';
            }
            for (let k = 0; k < teacher.length; k++) {
                revT[k] = 0;
                UID[k] = 0;
            }
            for (let i = 0; i < course.length; i++) {
                flag = 0;
                for (let j = 0; j < BD.length; j++) {
                    if (course[i].courseID == BD[j].courseID) {
                        revC[i] += BD[j].price;
                        cname[i] = course[i].name;
                        CID[i] = course[i].courseID;
                        UID[i] = course[i].userID;
                        object1 = {
                            UID: UID[i],
                            ID: CID[i],
                            NAME: cname[i],
                            REVC: revC[i]
                        }
                        flag = 1; //đặt cờ hiệu để khi push vào object không bị trùng
                    }
                }
                if (flag == 1) {
                    data.push(object1); //data vẫn push những object đã nhận từ vòng lặp trước vì có những courseID không tồn tại trong Bill_Details.
                }
            }
            for (let i = 0; i < teacher.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (teacher[i].userID == data[j].UID) {
                        revT[i] += data[j].REVC;
                        UID[i] = teacher[i].userID;
                        tname[i] = teacher[i].name;
                        object2 = {
                            TID: UID[i],
                            TNAME: tname[i],
                            REVT: revT[i]
                        }
                    }
                }
                data2.push(object2);
            }
            res.locals.TeacherRev = data2;
            res.render('revenue');
        }
        else {
            res.sendStatus(404);
        }
    } catch (err) {
        next(err);
    }
})


router.get('/revenue_courses', async (req, res, next) => {
    try {
        if (!req.session.user) {
            res.sendStatus(404);
        }
        let adminRoleID = req.session.user.roleID;
        if (adminRoleID == 3) {
            let BD = await adminController.getbill_detail();
            let course = await adminController.getCourse();
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
            res.locals.CourseRev = data;
            res.render('revenue_courses');
        }
        else {
            res.sendStatus(404);
        }

    } catch (err) {
        next(err);
    }
})

router.get('/select_course', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        adminController
            .getCourse()
            .then(data => {
                for (let i in data) {
                    data[i].date_startedAt = dateFormat(data[i].startedAt, 'dd/mm/yyyy');
                    data[i].date_endedAt = dateFormat(data[i].endedAt, 'dd/mm/yyyy');
                }
                res.locals.Courses = data;
                res.render('select_course')
            })
            .catch(error => next(error));
    }
    else {
        res.sendStatus(404);
    }
})
router.get('/Insert_course', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
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
                res.render('Insert_course', {
                    title: "Thêm Khóa Học",
                    nameButton: "Thêm khóa học"
                });
            })
            .catch(error => next(error));
    }
    else {
        res.sendStatus(404);
    }
})


router.post('/Insert_course', upload.single('imagePath'), (req, res, next) => {
    let adminController = require('../controllers/adminController');
    let fileName = req.file != null ? req.file.filename : null
    let image = '/img/course/' + fileName
    try {
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
            userID: req.body.userID,
            skillID: req.body.skillID,
            NumberStudent: req.body.NumberStudent,
        }
        console.log(course)
        adminController
            .addCourse(course)
            .then(data => {
                res.redirect('/admin/select_course');
            })
    } catch (err) {
        next(err);
    }
})

router.get('/update_course', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        let course_temp;
        let courses = adminController.getcourseId(req.query.courseID)
            .then(data => {
                course_temp = data;
                res.locals.courses = data;
                return adminController.getObject_insert(data.objectId)
            })
            .then(data => {
                res.locals.objects = data;
                return adminController.getCategory_insert(course_temp.categoryID)
            })
            .then(data => {
                res.locals.categories = data;
                return adminController.getUser_insert(course_temp.userID)
            })
            .then(data => {
                res.locals.users = data;
                return adminController.getSkills_insert(course_temp.skillID)
            })
            .then(data => {
                res.locals.skills = data;
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
            .then(data => {
                res.locals.Skills_update = data;
                return adminController.getCategory()
            })
            .then(data => {
                res.locals.Categories_update = data;
                res.render('update_course', {
                    title: "Chỉnh Sửa Khóa Học",
                    nameButton: "Chỉnh sửa khóa học",
                    startedAt: course_temp.startedAt.toISOString().substr(0, 10),
                    endedAt: course_temp.endedAt.toISOString().substr(0, 10)
                });
            })
            .catch(error => next(error));
    }
    else {
        res.sendStatus(404);
    }
})

router.post('/update_course', upload.single('imagePath'), (req, res, next) => {
    let course_change = adminController.getcourseId(req.body.courseID)
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
    course_change.courseID = req.body.courseID,
        course_change.name = req.body.name,
        course_change.description = req.body.description,
        course_change.price = req.body.price,
        course_change.NoVideos = req.body.NoVideos,
        course_change.priceDis = req.body.priceDis,
        course_change.startedAt = req.body.startedAt,
        course_change.endedAt = req.body.endedAt,
        course_change.objectId = req.body.objectId,
        course_change.categoryID = req.body.categoryID,
        course_change.userID = req.body.userID,
        course_change.skillID = req.body.skillID,
        course_change.NumberStudent = req.body.NumberStudent,
        adminController
            .update_course(course_change)
            .then(data => {
                res.redirect('/admin/select_course');
            })
})

router.get('/delete/:courseID', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        adminController.delete_course(req.params.courseID)
            //adminController.delete_user_course(req.params.courseID)
            //adminController.delete_review(req.params.courseID)
            .then(data => {
                res.redirect('/admin/select_course')
            })
            .catch(error => next(error));
    }
    else {
        res.sendStatus(404);
    }
})

router.get('/select_lession', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        adminController
            .getLession(req.query.courseID)
            .then(data => {
                res.locals.lessions = data
                res.render('select_lession', {
                    courseID: req.query.courseID
                });
            })
            .catch(error => next(error));
    }
    else {
        res.sendStatus(404);
    }
})

router.get('/insert_lession', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        adminController.getcourseId(req.query.courseID)
            .then(data => {
                res.locals.course_lession = data;
                res.render('insert_lession');
            })
            .catch(error => next(error));
    }
    else {
        res.sendStatus(404);
    }
})

router.post('/insert_lession', upload.single('imagePath'), (req, res, next) => {
    let fileName = req.file != null ? req.file.filename : null
    let image = '/img/course/' + fileName
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
                res.redirect('/admin/select_lession?courseID=' + req.body.courseID);
            })
    } catch (err) { next(err); }
})

router.get('/update_lession', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        adminController
            .getLessionID(req.query.lessonID)
            .then(data => {
                res.locals.lessions_update = data;
                console.log(data)
                res.render('update_lession')
            })
    }
    else {
        res.sendStatus(404);
    }
})

router.post('/update_lession', upload.single('imagePath'), (req, res, next) => {
    let lession_change = adminController.getLessionID(req.body.lessonID)
    let fileName = req.file != null ? req.file.filename : null
    lession_change.imagePath = '/img/course/' + fileName;
    lession_change.lessonID = req.body.lessonID,
        lession_change.name = req.body.name,
        lession_change.lessonNo = req.body.lessonNo,
        lession_change.urlLesson = req.body.urlLesson,
        adminController
            .update_lession(lession_change)
            .then(data => {
                res.redirect('/admin/select_lession?courseID=' + req.body.courseID);
            })
})

router.get('/delete_lession', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(404);
    }
    let adminRoleID = req.session.user.roleID;
    if (adminRoleID == 3) {
        adminController
            .delete_lession(req.query.lessonID)
            .then(data => {
                res.redirect('/admin/select_lession?courseID=' + req.query.courseID);
            })
    }
    else {
        res.sendStatus(404);
    }
})


module.exports = router;