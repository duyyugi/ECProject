let controller = {};
let models = require('../models');
let User = models.User;
let User_Skill = models.User_Skill;
let Skill = models.Skill;
let User_Course = models.User_Course;
let Category = models.Category;
let Course = models.Course;
let Object = models.Object;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
var bcrypt = require('bcryptjs');

controller.getUserByEmail = (email) => {
    return User.findOne({
        where: {
            email: email
        }
    })
}

controller.getUserByUserName = (username) => {
    return User.findOne({
        where: {
            username: username
        }
    })
}

controller.getUserByPhone = (phone) => {
    return User.findOne({
        where: {
            phone: phone
        }
    })
}

controller.createUser = (user) => {
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    return User.create(user);
}

controller.comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash)
}

controller.getUserSkill = (userid) => {
    return Skill.findAll({
        attributes: ['skillName', 'skillID'],
        include: [
            { model: User_Skill, where: { userID: userid } }
        ]
    })
}

controller.getAllSkill = () => {
    return Skill.findAll({
        attributes: ['skillName', 'skillID'],
    })
}

controller.updateUser = (user) => {
    return User.update({
        name: user.name,
        description: user.description,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar
    }, {
        where: { username: user.username }
    })
}

controller.deleteUser_Skill = (userID) => {
    return User_Skill.destroy({
        where: {
            userID: userID
        }
    })
}

controller.insertUser_Skill = (skill, userID) => {
    return User_Skill.create({
        userID: userID,
        skillID: skill
    })
}

controller.getSkillID = (userID) => {
    return User_Skill.findAll({
        attributes: ['skillID'],
        where: {
            userID: userID
        }
    })
}

controller.getUseriLikeNameNotBanned = (name, banned) => {
    let ban = (banned == "banned") ? true : false;
    return User.findAndCountAll({
        where: {
            name: {
                [Op.iLike]: `%${name}%`
            },
            banned: ban
        }
    })
}


controller.getAllTeacher = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['userID', 'name', 'avatar', 'description', 'roleID'],
            where: {
                roleID: '2'
            },
            include: [{
                model: models.Course,
                attributes: ['courseID'],
                where: {
                    price: {
                        [Op.gte]: query.min,
                        [Op.lte]: query.max
                    }
                }
            }]
        }
        if (query.category > 0) {
            options.include[0].where.categoryID = query.category;
        }
        if (query.search != '') {
            options.include[0].where.name = {
                [Op.iLike]: `%${query.search}%`
            }
        }
        if (query.object > 0) {
            options.include[0].where.objectId = query.object;
        }
        User
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
}

controller.banUserByUsername = (username) => {
    return User.update({
        banned: true
    }, {
        where: { username: username }
    })
}
controller.unBanUserByUsername = (username) => {
    return User.update({
        banned: false
    }, {
        where: { username: username }
    })
}

controller.get_teacher_course = (userID) => {
    return Course.findAll({
        attributes: ['courseID', 'name', 'price', 'imagePath', 'NoVideos', 'description', 'priceDis', 'startedAt', 'endedAt', 'objectId', 'categoryID', 'userID', 'skillID', 'NumberStudent'],
        where: {
            userID: userID
        }
    })
}

controller.getUserIDsHaveCourse=(courseID)=>{
    return User_Course.findAll({
        attributes: ['userID'],
        where: {
            courseID: courseID
        }
    })
};

controller.getPasswordByUserID = (userID) => {
    return User.findOne({
        attributes: ['password'],
        where: {
            userID: userID
        }
    })
}

controller.updatePassword = (newHashedPassword, userID) => {
    return User.update({
        password: newHashedPassword
    }, {
        where: {
            userID: userID
        }
    })
}

controller.getOneTeacher = (userID) => {
    return User.findOne({
        attributes: ['userID', 'name'],
        where: {
            userID: userID
        }
    })
}

module.exports = controller;