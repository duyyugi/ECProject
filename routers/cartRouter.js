let express = require('express');
let router = express.Router();
let voucherController = require('../controllers/voucherController');

router.get('/', (req, res) => {
    var cart = req.session.cart
    res.locals.cart = cart.getCart();
    req.session.cart.voucherCode = null;
    res.render('cart');
});

router.post('/', (req, res, next) => {
    var courseID = req.body.id;
    var quantity = isNaN(req.body.quantity) ? 1 : req.body.quantity;
    var courseController = require('../controllers/courseController');
    courseController
        .getById(courseID)
        .then(course => {
            var cartItem = req.session.cart.add(course, courseID, quantity);
            res.json(cartItem);
        })
        .catch(error => next(error));
});


router.delete('/', (req, res) => {
    var courseID = req.body.id;
    req.session.cart.remove(courseID);
    res.json({
        totalQuantity: req.session.cart.totalQuantity,
        totalPrice: req.session.cart.totalPrice,
    });
});


router.delete('/all', (req, res) => {
    req.session.cart.empty();
    res.sendStatus(204);
    res.end();
});

router.post('/voucher', async(req, res) => {
    let status = 0;
    if (!req.session.user) {
        res.json({
            Voucher: null,
            status: status
        })
    } else {
        status = 1;
        let voucherCode = req.body.voucherCode;
        let userID = req.session.user.userID;
        try {
            let percentDiscount = 0;
            let totalPrice = req.session.cart.totalPrice;
            let voucher = await voucherController.checkVoucher(voucherCode, userID);
            if (voucher) {
                req.session.cart.useVoucher(voucher.Voucher.priceDiscount, voucherCode);
                totalPrice = req.session.cart.totalPrice;
                percentDiscount = voucher.Voucher.priceDiscount * 100;
            }
            res.json({
                voucher: voucher,
                status: status,
                totalPrice: totalPrice,
                percentDiscount: percentDiscount
            });
        } catch (err) {
            console.log(err);
        }
    }

})
module.exports = router;