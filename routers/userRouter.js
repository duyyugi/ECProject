let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');
let billController = require('../controllers/billController');
let courseController = require('../controllers/courseController');
let dateFormat = require('dateformat');
let bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);
// set multer control
let multer = require('multer');
let imageMimeTypes = ['image/jpeg', 'image/png'];
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})
let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/register', (req, res) => {
    let renderNewRole = false;
    if (req.session.user) {
        let checkAdmin = req.session.user.roleID == 3 ? true : false;
        if (checkAdmin) {
            renderNewRole = true;
        }
    }
    res.render('register', {
        renderNewRole: renderNewRole
    });
})
router.post('/register', async (req, res, next) => {
    let user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        avatar: "/img/no-image.png",
        description: "",
        roleID: 1,
        banned: false
    }
    let checkAdmin = false;
    if (req.session.user) {
        checkAdmin = req.session.user.roleID == 3 ? true : false;
        if (checkAdmin) {
            user.roleID = req.body.roleID;
        }
    }
    // check username don't have any space
    if (/\s/.test(user.username)) {
        return res.render('register', {
            message: 'Tên đăng nhập không được có khoảng trống',
            type: 'alert-danger'
        })
    }
    // Check password have greater than or equals to 6 characters
    if (user.password.length < 6) {
        return res.render('register', {
            message: 'Mật khẩu phải lớn hơn 6 ký tự',
            type: 'alert-danger'
        })
    }
    // Check phone number
    if (!/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(user.phone)) {
        return res.render('register', {
            message: 'Số điện thoại nhập vào không đúng',
            type: 'alert-danger'
        })
    }

    let confirmPassword = req.body.confirmPassword;
    // Check password matches confirmPassword
    if (user.password != confirmPassword) {
        return res.render('register', {
            message: 'Không khớp mật khẩu',
            type: 'alert-danger'
        })
    }
    try {
        // Check username doesn't exist
        let tusername = await userController.getUserByUserName(user.username);
        if (tusername) {
            return res.render('register', {
                message: 'username đã tồn tại',
                type: 'alert-danger'
            })
        }
        // Check email doesn't exist
        let temail = await userController.getUserByEmail(user.email);
        if (temail) {
            return res.render('register', {
                message: 'email đã tồn tại',
                type: 'alert-danger'
            })
        }
        // Check phone doesn't exist
        let tphone = await userController.getUserByPhone(user.phone);
        if (tphone) {
            return res.render('register', {
                message: 'Số điện thoại đã tồn tại',
                type: 'alert-danger'
            })
        }
        // Create account
        let tuser = await userController.createUser(user);
        if (tuser) {
            return res.render('login', {
                message: 'đăng kí thành công, mời bạn đăng nhập vào tài khoản',
                type: 'alert-primary'
            })
        }
    } catch (err) {
        console.log(err)
        return res.render('register', {
            message: 'Lỗi chưa xác định, hãy thử lại',
            type: 'alert-danger'
        })
    }
})

module.exports = router;

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    let user = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        let tuser = await userController.getUserByUserName(user.username);
        if (!tuser) {
            return res.render('login', {
                message: 'Tên đăng nhập không tồn tại',
                type: 'alert-danger'
            })
        }
        let tpassword = await userController.comparePassword(user.password, tuser.password)
        if (tpassword == true) {
            if (tuser.banned) {
                return res.render('login', {
                    message: 'Tài khoản của bạn đã bị cấm, liên hệ SĐT 0123456789 để biết thêm chi tiết',
                    type: 'alert-danger'
                })
            } else {
                req.session.user = tuser
                res.redirect('/')
            }
        } else {
            return res.render('login', {
                message: 'Mật khẩu không đúng',
                type: 'alert-danger'
            })
        }
    } catch (err) {
        console.log(err)
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy()
    return res.redirect('/')
})

router.get('/account', async (req, res, next) => {
    try {
        let dateFormat = require('dateformat');
        if ((req.query.username == null) || (req.query.username.trim() == '')) {
            req.query.username = req.session.user.username;
        }
        let checkEditPrivilege = false;
        let user = await userController.getUserByUserName(req.query.username);
        if (!req.session.user) {
            checkEditPrivilege = false;
        } else if (req.session.user.roleID == 3 || req.session.user.username == req.query.username) {
            checkEditPrivilege = true;
        }
        // Get favorite skills of user.
        let skill = await userController.getUserSkill(user.userID);
        res.render('account', {
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            dateOfBirth: dateFormat(new Date(user.dateOfBirth), 'dd/mm/yyyy'),
            dateJoin: dateFormat(new Date(user.createdAt), 'dd/mm/yyyy'),
            skill: skill,
            description: user.description,
            checkEditPrivilege: checkEditPrivilege,
            banned: user.banned,
            avatar: user.avatar
        })
    } catch (err) {
        console.log(err);
    }
})

router.get('/edit', async (req, res) => {
    try {
        if (!req.session.user) {
            res.sendStatus(404);
        }
        // get skill of user and all skill for rendering
        let user = await userController.getUserByUserName(req.query.username);
        if (req.session.user.roleID != 3 && req.session.user.username != req.query.username) {
            res.sendStatus(404);
        }
        let skill = [];
        let askill = await userController.getAllSkill();
        let uskill = await userController.getUserSkill(user.userID);
        for (let i = 0; i < askill.length; i++) {
            skill.push({ skillName: askill[i].skillName, skillID: askill[i].skillID })
            for (let j = 0; j < uskill.length; j++) {
                if (askill[i].skillName == uskill[j].skillName) {
                    skill[i].checked = 1;
                }
            }
        }
        res.render('editprofile', {
            skill: skill,
            name: user.name,
            dateOfBirth: new Date(user.dateOfBirth).toISOString().substr(0, 10),
            usernameHref: req.query.username,
            avatar: user.avatar
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/edit', upload.single('avatar'), async (req, res, next) => {
    // get skill from view
    let stringSkill = req.body.allskill;
    let arraySkill = stringSkill.split(',');
    let sessionAdmin = (req.session.user.roleID == 3) ? req.session.user : '';
    try {
        let userChange = await userController.getUserByUserName(req.query.username);
        //Get new value for editing
        userChange.name = req.body.name;
        userChange.description = req.body.description;
        userChange.dateOfBirth = req.body.dateOfBirth;
        if (!userChange.description) {
            userChange.description = ' ';
        }
        // Upload image
        let fileName = req.file != null ? req.file.filename : null
        if (fileName) {
            // drop old avatar image
            if (userChange.avatar != '/img/no-image.png') {
                const fs = require('fs');
                let oldAvatarPath = './public' + userChange.avatar;
                fs.unlink(oldAvatarPath, function (err) {
                    if (err) throw err;
                });
            }
            //set new avatar image
            userChange.avatar = '/img/uploads/' + fileName;
        }
        //Update user without skills.
        await userController.updateUser(userChange);
        await userController.deleteUser_Skill(userChange.userID);
        //Update skills of user.
        if (stringSkill.length != 0) {
            for (let i = 0; i < arraySkill.length; i++) {
                await userController.insertUser_Skill(arraySkill[i], userChange.userID);
            }
        }
        let skill = await userController.getUserSkill(userChange.userID);
        req.session.reload(error => {
            if (req.session.user.roleID == 3) {
                req.session.user = sessionAdmin;
            } else {
                req.session.user = userChange;
            }
            if (error) {
                return next(error);
            }
            let user = userChange;
            return res.render('account', {
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                dateOfBirth: dateFormat(new Date(user.dateOfBirth), 'dd/mm/yyyy'),
                dateJoin: dateFormat(new Date(user.createdAt), 'dd/mm/yyyy'),
                skill: skill,
                description: user.description,
                checkEditPrivilege: true,
                banned: user.banned,
                avatar: user.avatar
            })
        })
    } catch (err) {
        next(err);
    }
})

router.get('/user_trans', async (req, res, next) => {
    try {
        let bills = await billController.getBillByUserID(req.session.user.userID);
        for (let i in bills) {
            bills[i].Bill_Detail.dateFormatted = dateFormat(bills[i].Bill_Detail.createdAt, 'hh:mm:ss dd/mm/yyyy')
        }
        res.render("user_trans", {
            bills: bills
        });
    } catch (err) {
        next(err);
    }
});

router.get('/user_course', async (req, res) => {
    let coursesID = await courseController.getCourseIDByUserID(req.session.user.userID);
    let Courses = [];
    for (let i in coursesID) {
        let courseDetail = await courseController.getCourseDetail(coursesID[i].courseID);
        Courses.push(courseDetail);
    }
    res.render("user_course", {
        Courses: Courses
    });
});

router.get('/user-course', async (req, res) => {
    let coursesID = await courseController.getCourseIDByUserID(req.session.user.userID);
    let Courses = [];
    for (let i in coursesID) {
        let courseDetail = await courseController.getCourseDetail(coursesID[i].courseID);
        Courses.push(courseDetail);
    }
    res.render("user_course", {
        Courses: Courses
    });
});

router.get('/change_password', async (req, res, next) => {
    try {
        res.render("change_password", {
            newPasswordNotMatch: false,
            passwordFalse: false,
            changedPassword: false
        });
    } catch (err) {
        next(err);
    }
});

router.post('/change-password', async (req, res, next) => {
    try {
        let oldPassword = req.body.oldPassword;
        let newPassword1 = req.body.newPassword1;
        let newPassword2 = req.body.newPassword2;
        // compare new password;
        if (newPassword1 != newPassword2) {
            res.render("change_password", {
                newPasswordNotMatch: true,
                passwordFalse: false,
                changedPassword: false
            });
        } else {
            let hashedPassword = await userController.getPasswordByUserID(req.session.user.userID);
            let checkPassword = await userController.comparePassword(oldPassword, hashedPassword.password);
            if (checkPassword == false) {
                res.render("change_password", {
                    newPasswordNotMatch: false,
                    passwordFalse: true,
                    changedPassword: false
                });
            } else {
                let newHashedPassword = bcrypt.hashSync(newPassword1, salt);
                await userController.updatePassword(newHashedPassword, req.session.user.userID);
                res.render("change_password", {
                    newPasswordNotMatch: false,
                    passwordFalse: false,
                    changedPassword: true
                });
            }
        }
    } catch (err) {
        next(err);
    }
});

router.get('/forget-password', (req, res, next) => {
    res.render("forget-password");
})

router.post('/check-and-send-email', async (req, res, next) => {
    let emailResetPassword = req.body.emailResetPassword;
    let checkEmail = true;
    try {
        let user = await userController.getUserByEmail(emailResetPassword);
        if (!user) {
            checkEmail = false;
            res.json({
                checkEmail: checkEmail
            });
        } else {
            checkEmail = true;
            let randexp = require('randexp');
            let randomString = new randexp('^[0-9,A-Z]{6}');
            let otpCode = randomString.gen();
            let nodemailer = require("nodemailer");
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'kiemhon1110@gmail.com',
                    pass: '123456yugi',
                    otpCode: otpCode
                }
            });
            let mainOptions = {
                from: 'EC20B04 Supporter',
                to: emailResetPassword,
                subject: 'Đặt lại mật khẩu',
                text: 'Mã OTP để đặt lại mật khẩu cho tài khoản của bạn là: ' + otpCode
            };
            transporter.sendMail(mainOptions, function (err) {
                if (err) {
                    next(err);
                }
            })
            res.json({
                checkEmail: checkEmail,
                otpCode: otpCode,
                userID: user.userID
            })
        }
    } catch (err) {
        next(err);
    }
})

router.post('/forget-password', async (req, res, next) => {
    try {
        let otpCode = req.body.otpCode;
        let tOtpCode = req.body.tOtpCode;
        let userID = req.body.userID;
        console.log(tOtpCode);
        console.log(otpCode);
        console.log(userID);
        if (otpCode != tOtpCode) {
            res.json({
                checkOtp: false,
            })
        } else {
            let newResetPassword1 = req.body.newResetPassword1;
            let newResetPassword2 = req.body.newResetPassword2;
            console.log(newResetPassword1);
            if (newResetPassword1 == newResetPassword2) {
                let newHashedPassword = bcrypt.hashSync(newResetPassword1, salt);
                await userController.updatePassword(newHashedPassword, userID);
                res.json({
                    checkOtp: true,
                    checkMatchedPassword: true
                })
            } else {
                res.json({
                    checkOtp: true,
                    checkMatchedPassword: false
                })
            }
        }
    } catch (err) {
        next(err);
    }
})