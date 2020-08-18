let controller = {};
let models = require('../models');
//const bill_detail = require('../models/bill_detail');
//const { where } = require('sequelize/types');
let Bill = models.Bill;
let TeacherName = models.User;
let Bill_detail = models.Bill_Detail;
let Course = models.Course;
let Skill = models.Skill;
let Object = models.Object;
let Category = models.Category;
let User = models.User;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
let User_Course=models.User_Course;
let Review = models.Review;
let Lesson = models.Lesson;


controller.getAll = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['billID', 'revenue', 'dateCreated', 'createdAt']
        }
        Bill
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};


controller.getAllTeacher = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['userID', 'name', 'email', 'avatar', 'description', 'phone', 'createdAt'],
            where: { roleID: '2' }
        }
        TeacherName
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.getAllStudents = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['name', 'email', 'avatar', 'phone', 'createdAt'],
            where: { roleID: '1' }
        }
        TeacherName
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));

    });
};
controller.getTeacher = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['userID', 'username', 'name'],
            include: [{ model: models.Course }],
            where: { roleID: '2' }
        }
        TeacherName
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.getBill = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['billID', 'revenue', 'paymentMethod', 'dateCreated', 'voucherID'],
        }
        Bill
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.getCourse = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['courseID', 'name', 'price', 'imagePath', 'NoVideos', 'description', 'priceDis', 'startedAt', 'endedAt', 'objectId', 'categoryID', 'userID', 'skillID', 'NumberStudent'],
            include: [{ model: models.Category }],
        }
        Course
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.getbill_detail = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['price', 'courseID'],
            include: [{ model: models.Course }]
        }
        Bill_detail
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
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

controller.getUser = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['userID', 'username', 'roleID'],
            where: { roleID: '2' },
        };
        User
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
}

controller.getSkill = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['skillID', 'skillName'],
        };
        Skill
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
}

controller.getObject = () => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id', 'name'],
        };
        Object
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
}

controller.getcourseId = (courseID) => {
    return Course.findOne({
        where: {
            courseID: courseID
        }
    })
};

controller.getObject_insert = (objectId) => {
    return Object.findOne({
        attributes: ['id', 'name'],
        where: {
            id: objectId
        }
    })
}

controller.getCategory_insert=(categoryID)=>{
    return Category.findOne({
        attributes: ['categoryID','name'],
        where:{categoryID:categoryID}
    })
}

controller.getUser_insert=(userID)=>{
    return User.findOne({
        attributes: ['userID','username'],
        where:{userID:userID}
    })
}

controller.getSkills_insert=(skillID)=>{
    return Skill.findOne({
        attributes: ['skillID','skillName'],
        where:{skillID:skillID}
    })
}

controller.getLession=(courseID)=>{
    return Lesson.findAll({
        where:{courseID:courseID}
    })
}

controller.getLessionID=(lessonID)=>{
    return Lesson.findOne({
        where:{lessonID:lessonID}
    })
}


controller.delete_review=(courseID)=>{
    return Review.destroy({
        where:{courseID:courseID}
    })
}

controller.delete_user_course=(courseID)=>{
    return User_Course.destroy({
        where:{courseID:courseID}
    })
}

controller.delete_course=(courseID)=>{
    return Course.destroy({
        where: { courseID: courseID }
    })
}

controller.addCourse = (courses => {
    return new Promise((resolve, reject) => {
        Course
            .create(courses)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    })
})

controller.addLession=(lession=>{
    return new Promise((resolve, reject) => {
        Lesson
        .create(lession)
        .then(data=>resolve(data)
        .catch(error => reject(new Error(error))));
    })
})

controller.addBill = (infobill => {
    return new Promise((resolve, reject) => {
        Bill
            .create(infobill)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    })
})

controller.addBillDetail = (infobilldetail => {
    return new Promise((resolve, reject) => {
        Bill_detail
            .create(infobilldetail)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    })
})


controller.update_course=(course_change=>{
    return Course.update({
            name:course_change.name,
            description:course_change.description,
            price:course_change.price,
            imagePath:course_change.imagePath,
            NoVideos:course_change.NoVideos,
            priceDis:course_change.priceDis,
            startedAt:course_change.startedAt,
            endedAt:course_change.endedAt,
            objectId:course_change.objectId,
            categoryID:course_change.categoryID,
            userID:course_change.userID,
            skillID:course_change.skillID,
            NumberStudent:course_change.NumberStudent,
        },
        {
            where:{courseID:course_change.courseID}
        })
})

controller.update_lession=(lession_change=>{
    return Lesson.update({
        name:lession_change.name,
        lessonNo:lession_change.lessonNo,
        urlLesson:lession_change.urlLesson,
        imagePath:lession_change.imagePath,
    },{
        where:{lessonID:lession_change.lessonID}
    })
})

controller.delete_lession=(lessonID)=>{
    return Lesson.destroy({
        where:{lessonID:lessonID}
    })
}

module.exports = controller;