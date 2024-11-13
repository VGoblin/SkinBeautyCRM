const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generatedUrl = () =>{
    var  UserSchema = new Schema({ 
        url :{ type : String, required : true},
        expiretime: { type: Number, required : true},
        timestamp: { type: String, required : true},
        isExpired: { type: Boolean, required : true},
        isOpened: {type: Boolean, default: false},
        createdAt : {type : String, default : Date.now }
    });
    return mongoose.model('generated_urls', UserSchema)
}

const consentform = () => {
    var  UserSchema = new Schema({ 
        contactInfo :{ type : Object, required : true},
        signInfo: { type: Object, required : true},
        pdf_url: { type: String, required : true},
        createdAt : {type : String, default : Date.now }
    });
    return mongoose.model('consentforms', UserSchema)
}

const customers = () =>{
    var  UserSchema = new Schema({ 
        name :{ type : String, required : true},
        email: { type: String, required : true},
        phone: { type: String, default: ''},
        city: { type: String, default : ''},
        fsession: { type: String, default : ''},
        lsession: { type: String, default : ''},
        referredby: { type: String, default : ''},
        consentId: {type: String, required: true},
        pdf: {type: String, required: true},
        date: {type: String, required: true},
        createdAt : {type : String, default : Date.now }
    });
    return mongoose.model('customers', UserSchema)
}

const sessions = () =>{
    var  UserSchema = new Schema({ 
        date :{ type : Date, required : true},
        area: [{type:mongoose.Schema.ObjectId, ref: 'bodyareas'}],
        skintype: { type: String, default: ''},
        kj: { type: Number, default : 0},
        cost: { type: Number, default : 0},
        comments: { type: String, default : ''},
        customer_id: {type: String, required: true},
        createdAt : {type : String, default : Date.now }
    });
    return mongoose.model('sessions', UserSchema)
}

module.exports  = {
    generatedUrl : generatedUrl(),
    consentform : consentform(),
    customers: customers(),
    sessions: sessions()
}