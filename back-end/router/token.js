const jwt =  require("jwt-simple");
const config = require('./../db');
const jwt_decode = require('jsonwebtoken');

exports.check_token = async(req,res,next) =>{
    var token = req.headers.authorization;
    if(!token){
        next();
    }else{
        try{
            const tdata= await this.jwt_decode(token)
            const currentTime = (new Date()).valueOf()/1000;
            if(tdata.exp < currentTime) {

                return res.json({session : "session expired",status : false});
            }else{
                next();
            }
        } catch (e){
            next();
        }
    }
    
}

exports.jwt_encode =async function(string){
    try{
        var token = await jwt.encode(string, config.ADMINPASSMETHOD);
        return token;
    } catch (e){
        return false;
    }
}

exports.jwt_decode =async function(string){
    try{
        var token = await jwt_decode.decode(string);
        return token;
    } catch(e){
        return false;       
    }
}