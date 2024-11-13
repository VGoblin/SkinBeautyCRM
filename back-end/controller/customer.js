const express = require('express');
var fs = require('fs');
const router = express.Router();
const { jsPDF } = require("jspdf");

const BASECONTROL = require("./basecontroller");
const CUSTOMER = require("../models/customer_model");
const SETTINGS = require("../models/settings_model");
const { basicQuestion } = require('../models/settings_model');
const config = require('../db');
const sysConf = require('../config');
var nodemailer = require('nodemailer');
const multer = require('multer');
const imageToBase64 = require('image-to-base64');
var ObjectId = require('mongodb').ObjectID;

router.post("/generate_url",async(req,res,next)=>{
    var sessionTime = req.body.session_time;
    var currTimeStamp = new Date();
    currTimeStamp = currTimeStamp.getTime();
    randomUrl = BASECONTROL.AesEncrypt(currTimeStamp.toString());
    // var url = req.protocol + '://localhost:3000/request/:' + randomUrl;
    var url = req.protocol + '://crm.skinbeautyenhance.com/request/:' + randomUrl;
    //save to db
    BASECONTROL.data_save({url: randomUrl,expiretime:sessionTime, timestamp: currTimeStamp, isExpired: false}, CUSTOMER.generatedUrl);
    res.json({
        status : true,
        url : url
    })
    return next();
});

router.post("/isopened",async(req,res,next)=>{
    var url = req.body.url;
    await CUSTOMER.generatedUrl.findOne({url: url},function(err, urlModel){
        if(err){
            res.json({
                status : false,
                msg : 'This url does not exist.'
            })
            return next();        
        }
        else{
            if(urlModel.isOpened){
                res.json({
                    status : true,
                    url : url
                })
                return next();    
            }
            else{
                res.json({
                    status : false,
                    msg : 'This url is still not opened.'
                })
                return next();
            }
        }
    });
});

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

router.post("/timeleft",async(req,res,next)=>{
    var url = req.body.url;
    await CUSTOMER.generatedUrl.findOne({url: url},function(err, urlModel){
        if(err){
            res.json({
                status : false,
                msg : 'This url does not exist.'
            })
            return next();        
        }
        else{
            var currTimeStamp = new Date();
            currTimeStamp = currTimeStamp.getTime();

            var expireTime = urlModel.expiretime;
            var createdTimestamp = urlModel.timestamp;
            
            if(expireTime * 60 * 1000 < (currTimeStamp - parseInt(createdTimestamp))){
                res.json({
                    status : false,
                    msg : 'This url is already expired.'
                })
                return next();
            }
            else {
                let timeLeft = expireTime * 60 * 1000 - (currTimeStamp - parseInt(createdTimestamp));
                
                res.json({
                    status : true,
                    msg : 'Time Left: ' + msToTime(timeLeft)    
                })
                return next();
            }    
        }
    });
});

/*Data Structure
    -1: Internal Server Error
    -2: No url
    -3: Expired Url
    1: success
*/
async function checkUrl(url){
    // try {
        urlModel = await CUSTOMER.generatedUrl.findOne({url: url});
        if(!urlModel){
            return -2;
        }

        if(urlModel.isOpened){
            return -4;
        }

        var currTimeStamp = new Date();
        currTimeStamp = currTimeStamp.getTime();

        var expireTime = urlModel.expiretime;
        var createdTimestamp = urlModel.timestamp;
        console.log(expireTime, createdTimestamp);
        console.log(currTimeStamp - parseInt(createdTimestamp));
        if(expireTime * 60 * 1000 < (currTimeStamp - parseInt(createdTimestamp))){
            return -3;
        }
        else {
            urlModel.isOpened = true;
            urlModel.save();
            return 1;
        }    
}

sendMail = async (to, file) => {

    var transporter = nodemailer.createTransport({
        host: "mail.skinbeautyenhance.com",
        port: 465,
        secure: true,
        auth: {
          user: "consent@skinbeautyenhance.com",
          pass: "ne8#5OnR{zMS"
        }
      });  
    
    //   const mail = {
    //     from: data.from,
    //     to: data.email,
    //     subject: data.subject,
    //     html: data.html
    //   };
      
    
    //   transporter.sendMail(mail, function(err, info) {
    //     if (err) {
    //         console.log(err);
    //         res.json({status : false , data : err})
    //         transporter.close();
    //         return next();
    //     }else {
    //       res.json({status : true , data : info})
    //       transporter.close();
    //       return next();
    //     }
    //   });
    

    // var transporter = await nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: sysConf.gmail.gmail,
    //         pass: sysConf.gmail.password
    //     }
    //     });

    var html = '<!doctype html><html xmlns=http://www.w3.org/1999/xhtml xmlns:v=urn:schemas-microsoft-com:vml xmlns:o=urn:schemas-microsoft-com:office:office><head><title></title><meta http-equiv=X-UA-Compatible content=\"IE=edge\"><meta http-equiv=Content-Type content=\"text/html; charset=UTF-8\"><meta name=viewport content=\"width=device-width, initial-scale=1\"><style type=text/css>#outlook a{padding:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}.ExternalClass *{line-height:100%}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}img{border:0;height:auto;line-height:100%;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}</style><style type=text/css>@media only screen and (max-width:480px){@-ms-viewport{width:320px}@viewport{width:320px}}</style><link href=\"https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700\" rel=stylesheet type=text/css><link href=\"https://fonts.googleapis.com/css?family=Cabin:400,700\" rel=stylesheet type=text/css><style type=text/css>@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);@import url(https://fonts.googleapis.com/css?family=Cabin:400,700);</style><style type=text/css>@media only screen and (min-width:480px){.mj-column-per-50{width:50%!important;max-width:50%}.mj-column-per-100{width:100%!important;max-width:100%}}</style><style type=text/css>@media only screen and (max-width:480px){table.full-width-mobile{width:100%!important}td.full-width-mobile{width:auto!important}}</style><style type=text/css>.hide_on_mobile{display:none!important}@media only screen and (min-width:480px){.hide_on_mobile{display:block!important}}.hide_section_on_mobile{display:none!important}@media only screen and (min-width:480px){.hide_section_on_mobile{display:table!important}}.hide_on_desktop{display:block!important}@media only screen and (min-width:480px){.hide_on_desktop{display:none!important}}.hide_section_on_desktop{display:table!important}@media only screen and (min-width:480px){.hide_section_on_desktop{display:none!important}}[owa] .mj-column-per-100{width:100%!important}[owa] .mj-column-per-50{width:50%!important}[owa] .mj-column-per-33{width:33.333333333333336%!important}p{margin:0}@media only print and (min-width:480px){.mj-column-per-100{width:100%!important}.mj-column-per-40{width:40%!important}.mj-column-per-60{width:60%!important}.mj-column-per-50{width:50%!important}mj-column-per-33{width:33.333333333333336%!important}}</style></head><body style=background-color:#FFFFFF><div style=background-color:#FFFFFF><div style=\"Margin:0 auto;max-width:600px\"><table align=center border=0 cellpadding=0 cellspacing=0 role=presentation style=width:100%><tbody><tr><td style=\"direction:ltr;font-size:0;padding:9px 0 9px 0;text-align:center;vertical-align:top\"><div class=\"mj-column-per-50 outlook-group-fix\" style=font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%><table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%><tr><td align=center style=font-size:0;padding:0;word-break:break-word><table border=0 cellpadding=0 cellspacing=0 role=presentation style=border-collapse:collapse;border-spacing:0px><tbody><tr><td style=width:300px><a href=https://www.instagram.com/skinbeauty_enhance/ target=_blank><img height=auto src=https://i.ibb.co/kDzyXN2/logo3x.png style=border:0;display:block;outline:none;text-decoration:none;height:auto;font-size:13px width=180></a></td></tr></tbody></table></td></tr></table></div><div class=\"mj-column-per-50 outlook-group-fix\" style=font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%><table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%><tr><td align=left style=\"font-size:0;padding:15px 15px 15px 15px;word-break:break-word\"><div style=font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000><a href=https://www.instagram.com/skinbeauty_enhance/ target=_blank style=text-decoration:none;color:black><p><span style=font-size:13px><strong>Skin Beauty Enhance(@skinbeauty_enhance) is on Instagram</strong></span>.</p><p>627 Followers, 437 Followin...</p><p>www.Instagram.com</p></a></div></td></tr></table></div></td></tr></tbody></table></div><div style=\"Margin:0 auto;max-width:600px\"><table align=center border=0 cellpadding=0 cellspacing=0 role=presentation style=width:100%><tbody><tr><td style=\"direction:ltr;font-size:0;padding:9px 0 9px 0;text-align:center;vertical-align:top\"><div class=\"mj-column-per-100 outlook-group-fix\" style=font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%><table border=0 cellpadding=0 cellspacing=0 role=presentation style=vertical-align:top width=100%><tr><td align=left style=\"font-size:0;padding:15px 15px 15px 15px;word-break:break-word\"><div style=font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000><div><span style=font-size:13px>Hi!</span></div><div> </div><div><span style=font-size:13px>Thank you very much for filling up our consent form. Please find a signed copy attached to this email for your own reference.</span></div><div> </div><div><span style=font-size:13px>Thank you for your trusting us!</span></div><div> </div><div><span style=font-size:13px>Please follow us:</span><br><span style=font-size:13px>https://www.instagram.com/skinbeauty_enhance/</span></div><div> </div><div><span style=font-size:13px>https://www.facebook.com/skinbeautyenhance/</span></div><div> </div><div> </div><div><span style=font-size:13px>With love... skinbeautyenhance.com</span></div></div></td></tr></table></div></td></tr></tbody></table></div></div></body></html>';
      
    var mailOptions = {
        from: "consent@skinbeautyenhance.com",
        to: to,
        subject: 'Skin Beauty Enhance - Your signed consent form attached!',
        html: html,
        attachments: [
            {path: file}
        ]
    };
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Email ERROR: ', error);
            resolve(false)
        } else {
            console.log('Email sent: ' + info.response);
            resolve(true)
        }
        });
    })
}

router.post("/submit_consent_form",multer({dest:config.BASEURL}).any(),async(req,res,next)=>{
    console.log(req.files);
    
    if(req.files.length > 1){
        var page1 = req.files[0].path;
        var page2 = req.files[1].path;
        await fs.rename(page1, page1+".jpg", ()=>{

        });
        await fs.rename(page2, page2+".jpg", ()=>{

        });
        imageToBase64(page1+".jpg").then(
            (page1Base64) => {
                imageToBase64(page2+".jpg").then( async (page2Base64) => {
                    fs.unlinkSync(page1+".jpg");
                    fs.unlinkSync(page2+".jpg");

                    let formData = req.body;
                    let fileName = (new Date()).getTime()+".pdf";
                    
                    const doc = new jsPDF('p', 'px', 'a4');
                    formData['margin1'] = JSON.parse(formData['margin1']);
                    formData['margin2'] = JSON.parse(formData['margin2']);
                    formData['contactInfo'] = JSON.parse(formData['contactInfo']);
                    formData['signInfo'] = JSON.parse(formData['signInfo']);

                    doc.addImage("data:image/jpeg;base64,"+page1Base64, 'JPEG', formData['margin1']['mx'], formData['margin1']['my'], formData['margin1']['w'], formData['margin1']['h']);
                    doc.addPage()
                    doc.addImage("data:image/jpeg;base64,"+page2Base64, 'JPEG', formData['margin2']['mx'], formData['margin2']['my'], formData['margin2']['w'], formData['margin2']['h']);
                    doc.save(config.BASEURL+'consentforms/'+fileName);

                    //send email
                    console.log("Sending email...");
                    let mailResult = await sendMail(formData['contactInfo']['email'], config.BASEURL+'consentforms/'+fileName);
                    console.log("done");
                    formData.pdf_url = fileName;
                    let result = await BASECONTROL.data_save(formData, CUSTOMER.consentform);
                    console.log(result);
                    if(result){
                        //Save to customers list
                        customerInfo = {};
                        customerInfo['name'] = formData.contactInfo.name;
                        customerInfo['email'] = formData.contactInfo.email;
                        customerInfo['phone'] = formData.contactInfo.phone;
                        customerInfo['city'] = formData.contactInfo.city;
                        customerInfo['date'] = result.contactInfo.topdate;
                        customerInfo['referredby'] = formData.contactInfo.referredby;
                        customerInfo['consentId'] = result._id;
                        customerInfo['pdf'] = result.pdf_url;
                        
                        BASECONTROL.data_save(customerInfo, CUSTOMER.customers);
                        res.json({
                            status : true,
                            emailSent: mailResult
                        })
                        return next();
                    }
                    else{
                        res.json({
                            status : false,
                            msg : 'Internal Server Error'
                        })
                        return next();
                    }
                }).catch((error)=>{
                    console.log(error); // Logs an error if there was one
                    res.json({
                        status : false,
                        msg : 'Internal Server Error'
                    })
                    return next();
                });
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
                res.json({
                    status : false,
                    msg : 'Internal Server Error'
                })
                return next();
            }
        );
        

        
    }
    else{
        res.json({
            status : false,
            msg : 'Internal Server Error'
        })
        return next();
    }

    
    // await fs.writeFile(config.BASEURL+'consentforms/'+fileName, bin, async function (err) {
    //     if (err) throw err;
    // });
    
});

router.post("/get_consent_form",async(req,res,next)=>{
    switch (await checkUrl(req.body.url)) {
        case -1:
            res.json({status : false, msg : 'Internal Server Error!'})
            return next();
        case -2:
            res.json({status : false, msg : 'Not valid url.'})
            return next();
        case -3:
            res.json({status : false, msg : 'This url is expired. Contact to us again.'})
            return next();
        case -4:
            res.json({status : false, msg : 'This url is already opened on another browser. Contact to us again.'})
            return next();
        default:
            break;
    }

    //get basic questions
    const basicQuestion = await SETTINGS.basicQuestion.find({activate:'Visible'});
    const mediaHistory = await SETTINGS.mediaQuestion.find({activate:'Visible'});
    const bodyArea = await SETTINGS.bodyArea.find({});
    areaSelectFormat = [];
    bodyArea.forEach(element => {
        areaSelectFormat.push({value:element['_id'], label:element['name']});
    });

    var currTimeStamp = new Date();
    currTimeStamp = currTimeStamp.getTime();
    randomUrl = BASECONTROL.AesEncrypt(currTimeStamp.toString());
    var url = req.protocol + '://' + req.get('host') + '/request/:' + randomUrl;
    //save to db
    // BASECONTROL.data_save({url: randomUrl, timestamp: currTimeStamp, isExpired: false}, CUSTOMER.generatedUrl);
    res.json({
        status : true,
        basicquestions : basicQuestion,
        mediahistory : mediaHistory,
        bodyarea : areaSelectFormat 
    })
    return next();
});

router.get("/customers",async(req,res,next)=>{
    const bodyArea = await SETTINGS.bodyArea.find({});
    areaSelectFormat = [];
    bodyArea.forEach(element => {
        areaSelectFormat.push({value:element['_id'], label:element['name']});
    });

    let customers = await CUSTOMER.customers.find({}).sort({'createdAt':-1})
    //save to db
    res.json({
        status : true,
        data: customers,
        bodyarea: areaSelectFormat,
        msg : 'Success'
    }) 
    return next();
});

router.post("/init_session_data",async(req,res,next)=>{
    const bodyArea = await SETTINGS.bodyArea.find({});
    areaSelectFormat = [];
    bodyArea.forEach(element => {
        areaSelectFormat.push({value:element['_id'], label:element['name']});
    });
    //save to db
    res.json({
        status : true,
        data: {'customers':await BASECONTROL.Bfind(CUSTOMER.customers, {}),'bodyarea': areaSelectFormat},
        msg : 'Success'
    })
    
    return next();
});

// router.post("/add",async(req,res,next)=>{
//     //save to db
//     result = await BASECONTROL.data_save({question:req.body.question, category:req.body.category, activate:req.body.activate}, SETTINGS.basicQuestion);
//     if(!result){
//         res.json({status : false, msg : 'Internal Sever Error!'})
//         return next();
//     }
//     else{
//         res.json({status : true,data : result})
//         return next();
//     }
// });

router.post("/update",async(req,res,next)=>{
    CUSTOMER.customers.findByIdAndUpdate({'_id': req.body._id}, req.body, function(err, result){
        if(err){
            res.json({ status : false, msg : err })
            return next();
        }
        else{
            res.json({ status : true, data : result })
            return next();
        }

    })
});

router.post("/delete",async(req,res,next)=>{
    //save to db
    await CUSTOMER.customers.findOne({'_id': req.body._id}).then(customer=>{
        if(customer){
            console.log("CUSTOMER: ", customer);
            let pdfName = customer.pdf;
            try {
                fs.unlinkSync(config.BASEURL+'consentforms/'+pdfName)
                //file removed
              } catch(err) {
                console.log(err)
              }
            let consentId = customer.consentId;
            console.log("CONSENT_ID:", consentId);
            CUSTOMER.consentform.findByIdAndDelete({'_id': consentId}, function(err, result){
                console.log("ERROR:", err);   
            })
            //delete session table
            CUSTOMER.sessions.findByIdAndDelete({'customer_id': req.body._id})
        }
    });

    CUSTOMER.customers.findByIdAndDelete({'_id': req.body._id}, function(err, result){
        if(err){
            res.json({ status : false, msg : err })
            return next();
        }
        else{
            res.json({ status : true, data : result })
            return next();
        }
    })
});


router.post("/sessions", async(req,res,next)=>{
    let customerId = req.body.customer_id;
    CUSTOMER.sessions.aggregate([
        { $match: { customer_id: { $eq: customerId } } },
        { 
            $lookup:
            {
              from: 'bodyareas',
              localField: 'area',
              foreignField: '_id',
              as: 'areas'
            }
        }
    ], function(err, session){
        session.forEach(element => {
            var areanames = [];
            var areas = [];
            element.areas.forEach(area => {
                areanames.push(area.name);
                areas.push({value: area._id, label: area.name});
            });
            element.areas = areas;
            element.areanames = areanames.toString();
        });
        console.log(err, session);
        if(err){
            res.json({
                status : false,
                msg : 'Internal Server Error'
            }) 
            return next();
        }
        else{
            res.json({
                status : true,
                data: session,
                msg : 'Success'
            }) 
            return next();
        }
    });
    //save to db
});

router.post("/session_add",async(req,res,next)=>{
    console.log(req.body);
    //save to db
    result = await BASECONTROL.data_save({date:new Date(req.body.date), area:req.body.area, skintype:req.body.skintype, kj: parseInt(req.body.kj)
        , cost:parseInt(req.body.cost), comments:req.body.comments, customer_id:req.body.customer_id}, CUSTOMER.sessions);
    if(!result){
        res.json({status : false, msg : 'Internal Sever Error!'})
        return next();
    }
    else{
        res.json({status : true,data : result})
        return next();
    }
});

router.post("/session_update",async(req,res,next)=>{
    CUSTOMER.sessions.findByIdAndUpdate({'_id': req.body._id}, req.body, function(err, result){
        if(err){
            res.json({ status : false, msg : err })
            return next();
        }
        else{
            res.json({ status : true, data : result })
            return next();
        }

    })
});

router.post("/session_delete",async(req,res,next)=>{

    CUSTOMER.sessions.findByIdAndDelete({'_id': req.body._id}, function(err, result){
        if(err){
            res.json({ status : false, msg : err })
            return next();
        }
        else{
            res.json({ status : true, data : result })
            return next();
        }
    })
});

module.exports = router;