let express = require('express');
let app = express();
//Set public Static Folder
app.use(express.static(__dirname + '/public'));
//Use View Engine
let expressHbs = require('express-handlebars');
let helper = require('./controllers/helper');
let paginateHelper = require('express-handlebars-paginate');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        createPagination: paginateHelper.createPagination
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
//Register conditon equal for hbs
hbs.handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if (v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
//Use Body Parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Use Cookie-parser
let cookieParser = require('cookie-parser');
app.use(cookieParser());
//Use session
let session = require('express-session');
app.use(session({
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
    secret: 's3cret',
    resave: false,
    saveUninitialized: false
}));
//Use Cart Controller
let Cart = require('./controllers/cartController');
app.use((req, res, next) => {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    req.session.cart = cart;
    res.locals.totalQuantity = cart.totalQuantity;
    res.locals.isLoggedIn = req.session.user ? true : false;
    console.log(res.locals.isLoggedIn);
    res.locals.sesName = req.session.user ? req.session.user.username : '';
    res.locals.roleName = req.session.user ? req.session.user.roleID : '';
    res.locals.isUpdate=req.session.isInsert ? req.session.isInsert: 'isInsert';
    next();
});
//=============use paypal-rest-sdk=========================
let paypal = require('paypal-rest-sdk');
let addNewBill = require('./controllers/billController');
let addNewBillDetail = require('./controllers/billController');
let voucherController = require('./controllers/voucherController');
let addCourseUser = require('./controllers/courseController');
//connect my app paypal test
paypal.configure({
    'mode': 'sandbox', 
    'client_id': 'ATGJjA_P0CcLiuXqBJp5MN1KJHmCb70rgC7WWFbGQNnZbLnTOuSclBZ1n9zZ6S254ogg6wfrTJgryAwC',
    'client_secret': 'EGC62EluIdzFk94ma6Bu8gHULFv9qhVqGBFkWnTC6SGojmfBQ5DxZ1RPO8GWRd88EW67cnl-rjyzXoXg'
  });
app.post('/pay', (req, res) => {
    let totalPrice = req.session.cart.totalPrice;
    var totalPriceUSD = totalPrice*0.000043;
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "https://abc0234.herokuapp.com/success",
          "cancel_url": "https://abc0234.herokuapp.com/payment"
      },
      "transactions": [{
          amount: {
              "currency": "USD",
              "total": totalPriceUSD
          },
          "description": "Hat for the best team ever"
      }]
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
});
app.get('/success', async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    let cart = req.session.cart;
    let totalPrice = cart.totalPrice;
    let userid = req.session.user.userID;
    let today = new Date();
    var totalPriceUSD = totalPrice*0.000043;
    let voucherID = null;
    let voucherCode = req.session.cart.voucherCode;
    let percentDis = 0;
    if (voucherCode != null) {
        let voucher = voucherController.getVoucherByCode(voucherCode);
        voucherID = voucher.id;
        percentDis = voucher.priceDiscount;
    }
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          amount: {
              "currency": "USD",
              "total": totalPriceUSD
          }
      }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.render('success-paypal');
      }
    });
        //add info bill success at database
    let infoBill = {
        revenue: totalPrice,
        paymentMethod: "payment",
        dateCreated: today, 
        userID: userid, 
        voucherID: voucherID
    }
    let newBill = await addNewBill.addBill(infoBill);
    //add info bil_detail
   
    for(let i in cart.items){
        let price = cart.items[i].item.price *(1- percentDis) ;
        let bill_detail = {
            billID: newBill.billID,
            courseID: cart.items[i].item.courseID,
            price: price
        };
        addNewBillDetail.addBill_detail(bill_detail);
        //add course 
    let user_course = {
        courseID: cart.items[i].item.courseID,
        userID : req.session.user.userID
        }
    addCourseUser.addUser_course(user_course);
    }  
    //reset status cart hollow
    req.session.cart = null ;
  });
  app.get('/cancel', (req, res) => res.send('Cancelled'));
// use chartjs
let Chart = require('chart.js');
//define your routes here
app.use('/', require('./routers/indexRouter'));
app.use('/category', require('./routers/courseRouter'));
//app.use('/course', require('./routers/courseRouter'));
app.use('/cart', require('./routers/cartRouter'));
app.use('/user', require('./routers/userRouter'));
app.use('/review', require('./routers/reviewRouter'));
app.use('/admin', require('./routers/adminRouter'));
app.use('/teacher', require('./routers/teacherRouter'));
app.use('/payment', require('./routers/paymentRouter'));
app.use('/study', require('./routers/studyRouter'));
app.get('/sync', (req, res) => {
    let models = require('./models');
    models.sequelize.sync().then(() => {
        res.send('database sync completed');
    })
})
app.get('/:page', (req, res) => {
    let banners = {
        blog: 'Our Blog',
        category: 'Course',
        cart: 'Shopping Cart',
        checkout: 'Product Checkout',
        confirmation: 'Order Confirmation',
        contact: 'Contact Us',
        login: 'Login',
        register: 'Register',
        singleblog: 'Blog Details',
        singleproduct: 'Course Detail',
        trackingorder: 'Order Tracking'
    };
    let page = req.params.page;
    res.render(page, { banner: banners[page] });
});

//Set Server port & start server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`);
});