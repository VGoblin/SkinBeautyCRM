const express = require('express');
const router = express.Router();
const TOKEN = require("./token");

const customer = require('../controller/customer')
const adminusers = require('../controller/adminuser');
const settings = require('../controller/settings');

check_expire = async(req,res,next) =>{
    var maxAge = req.session.cookie.maxAge;
    console.log("MaxAge:", maxAge, req.session.cookie.expires);
    next();
}

router.use('/users',adminusers);
router.use('/customers', customer);
router.use('/settings', settings);
//player 
// router.use("/profile",TOKEN.check_token,profile);
// router.use("/firstpage",TOKEN.check_token, firstpagedata);
// router.use("/players",TOKEN.check_token,netplay);
// router.use("/sports",TOKEN.check_token,SportsControl)

// router.use("/reports",TOKEN.check_token,ReportsModel);
// router.use("/Tools",TOKEN.check_token,Tools);
// router.use("/providermanager",TOKEN.check_token,ProviderManager);
// router.use("/netplay",TOKEN.check_token, netplay);
// router.use("/paymentGateWay",TOKEN.check_token,paymentGateWay);
// router.use("/gameprovider",TOKEN.check_token,GameProviders); 
// router.use("/revenue",TOKEN.check_token,revenueController);

// app.get('/file/download/:filename/:originalname' , function(req,res,next){ 
//   var filename = req.params.filename;
//   var originalname = req.params.originalname;
//   var directory = dl_dir.BASEURL + "/uploads/" + filename;
//   res.download(directory,originalname,'');
// })  

module.exports = router;