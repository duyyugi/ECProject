let controller = {};
let models = require('../models');
let Object = models.Object;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id', 'name'],
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
        if(query.category > 0){
           options.include[0].where.categoryID = query.category; 
        }
        if( query.search != ''){
            options.include[0].where.name = {
                [Op.iLike]: `%${query.search}%`
            }
        }
        if(query.user >0){
            options.include[0].include = [{
                model: models.User_Course,
                attributes: [],
                where: {userID: query.user}
            }]
        }
        Object
            .findAll(options)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

module.exports = controller;