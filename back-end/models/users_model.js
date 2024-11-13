const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminUser = () =>{
    var  UserSchema = new Schema({ 
        password :{ type : String, required : true,},
        email : { type : String, required : true ,unique:true},
        username : { type : String, required : true ,unique:true},
        location : { type : String, default : "SkinBeautyEnhance" },
        region_name : { type : String, default : "" },
        city_name : { type : String, default : "" },
        country_code : { type : String, default : "" },
        zip_code  : {type : String, default : "" },
        role :{ type : String, default: "admin" },
        createdAt : {type : String, default : Date.now }
    });
    return mongoose.model('adminusers', UserSchema)
}

// const sessionmodel = () =>{
//     var  UserSchema = new Schema({
//         email: {
//             type: String,
//             required: true
//         },
//         username: {
//             type: String,
//             required: true,unique:true
//         },
//         date: {
//             type: Date,
//             default: Date.now
//         },
//         token : {
//             type :String,
//             required : true
//         },
//         socketid :{
//             type : String,
//             default : ""
//         },
//         role : {
//             type : String,
//             required : true
//         }
//     });
//     return mongoose.model('sessions', UserSchema)
// }


module.exports  = {
    adminUser : adminUser(),
    // sessionmodel  :sessionmodel()
}