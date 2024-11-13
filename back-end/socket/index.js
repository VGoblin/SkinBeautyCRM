  var Sessionmodel = require("../models/users_model").sessionmodel
  var BASECONTROL = require("../controller/basecontroller");
  var Players = require("../models/users_model").GamePlay;
  var ObjectId = require('mongodb').ObjectID;
  const hex = require('string-hex')

  var config = require("../config");


  var index = 0;
  module.exports = (io) => {

    //   io.on("connection",async(socket) => {
    //     index++;
    //     var decoded = socket.handshake.query;
    //     var socketid = index + socket.id;
    //     decoded['_id'] = ObjectId(hex(socketid).slice(0,24));
    //     var saveHandle = await session_save(decoded,socket.id);
    //     if(!saveHandle){
    //       socket.emit("destory",{data : false});
    //     }

    //   socket.on("gamesavetoken",async(rdata)=>{
    //     var find = await BASECONTROL.BfindOne(gamesessionmodel,{ email : rdata.email});
    //     if(!find){
    //       var savehandle =  await BASECONTROL.data_save(rdata,gamesessionmodel);
    //       if(!savehandle){
    //         socket.emit("gamedestory",{data : false})
    //       }
    //     }else{
    //       socket.emit("gamedestory",{data : false})
    //     }
    //   });

    //   socket.on("gamedelete",async(rdata)=>{
    //     await gamesessionremove(rdata.data);
    //   });

    //   socket.on("destroy",async()=>{
    //     console.log(socket.id);
    //     await session_remove_id(socket.id);
    //     await session_remove(socket.handshake.query);  
    //   })

    //   socket.on('disconnect', async(disdata) => {
    //     await session_remove_id(socket.id);
    //     await session_remove(socket.handshake.query);
    //   });

    // });
    // setInterval(async() => {
    //   var findhandle =  await BASECONTROL.Bfind(Sessionmodel);
    //   if(!findhandle.length < 0){
    
    //   }else{
    //     for(var i = 0 ; i < findhandle.length ; i++){
    //       // if(findhandle[i].socketid !=""){
    //         var fhandle = await BASECONTROL.BfindOne(Players,{email : findhandle[i].email});
    //         if(fhandle){
    //             var lasttime = findhandle[i].intimestamp;
    //             var nowtime = BASECONTROL.get_timestamp();
    //             var expire = nowtime - parseInt(lasttime);
    //             if(expire > expiredtime){
    //               await session_remove(findhandle[i]);
    //               await gamesessionremove(findhandle[i]);

    //               try{
    //                 io.sockets.connected[findhandle[i].socketid].emit("destory",{data : findhandle[i]});
    //               }catch(e){
                
    //               }
    //                 // }
    //             }else{
    //               // if(findhandle[i].socketid !="" && findhandle[i].role == "players"){

    //               //   if(io.sockets.connected[findhandle[i].socketid]){
    //               //     try{
    //               //       io.sockets.connected[findhandle[i].socketid].emit("balance",{data : fhandle});
    //               //     }catch(e){

    //               //     }                 
                  
    //               //   }
    //               // }
    //             }
    //         }
    //     }
    //   }

    //   var findhandle =  await BASECONTROL.Bfind(gamesessionmodel);
    //   if(!findhandle.length < 0){
    
    //   }else{
    //     for(var i = 0 ; i < findhandle.length ; i++){
    //       var lasttime = findhandle[i].intimestamp;
    //       var nowtime = BASECONTROL.get_timestamp();
    //       var expire = nowtime - parseInt(lasttime);
    //       if(expire > gameexpiredtime){
    //         var user = await BASECONTROL.Bfind(Sessionmodel,{email : findhandle[i].email});
    //         await gamesessionremove(findhandle[i]);
    //         if(user){
    //           if(user.socketid){
    //             try{
    //               io.sockets.connected[user.socketid].emit("gamedestory",{data : user});
    //             }catch(e){

    //             }
    //           }
    //         }
    //       }else{

    //       }
    //     }
    //   }

    // }, 5000);
  
  };


  // async function session_save(decoded,socketid){
  //   var lasttime = decoded.intimestamp;
  //   var nowtime = BASECONTROL.get_timestamp();
  //   var expire = nowtime - parseInt(lasttime);
  //   if(expire > expiredtime){
  //     return false;
  //   }else{
  //     if(decoded.role == "players"){
  //       var rdata =  await BASECONTROL.BfindOne(Sessionmodel,{email : decoded.email});
  //       if(!rdata){
  //         var data = decoded;
  //         data['socketid'] = socketid;
  //         var save = await BASECONTROL.data_save(data,Sessionmodel);
  //         if(!save){
  //           return false;
  //         }else{
  //           return true;
  //         }
  //       }else{
  //         var rdata1 =  await BASECONTROL.BfindOne(Sessionmodel,{email : decoded.email,token : decoded.token});
  //         if(!rdata1){
  //           return false;
  //         }else{
  //           return true;
  //         }
  //       }
  //     }else{
  //       var data = decoded;
  //       data['socketid'] = socketid;
  //       var save = await BASECONTROL.data_save(data,Sessionmodel);
  //       return true;
  //     }
  //   }
  // }

  // async function session_remove_id(socketid){
  //   var findone = await BASECONTROL.BfindOne(Sessionmodel,{socketid:socketid});
  //   if(!findone){

  //   }else{
  //     await session_remove({socketid : socketid});
  //     await gamesessionremove(findone)
  //   }
  // }


  // async function session_remove(inputdata){
  //   var outdata = null;
  //   await Sessionmodel.findOneAndDelete({socketid : inputdata.socketid}).then(rdata=>{
  //     outdata = rdata;
  //   });
  // }

  // async function gamesessionremove(inputdata){
  //   await gamesessionmodel.findOneAndDelete({email : inputdata.email}).then(rdata=>{
  //     outdata = rdata;
  //   });
  // }