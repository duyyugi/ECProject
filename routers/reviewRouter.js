let express = require('express');
let router = express.Router();

router.post('/',(req,res,next)=>{
    let controller=require('../controllers/reviewController')
    let comment={
        userID: req.session.user.userID,
        courseID: req.body.courseID,
        comment: req.body.comment,
    }
    console.log(comment)
    controller
        .add(comment)
        .then(data=>{
            res.redirect('/category/'+data.courseID);
        })
        .catch(error=>next(error));
})

module.exports = router;