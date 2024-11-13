  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const config = require('./db');
  const cors = require('cors');
  const app = express();
  const server = require("http").Server(app);
  const io = require("socket.io").listen(server);
  const SocketServer = require("./socket");

  const adminRouter = require("./router");
  const path = require("path");

  const db = mongoose.connect(config.URL+ config.DBNAME, { useNewUrlParser: true ,useFindAndModify: false}).then(() => {
    console.log('Database is connected') 
    },
    err => { console.log('Can not connect to the database'+ err)}
  );
  // mongoose.connect("mongodb+srv://root:E9xMPJKkyY7xtgZr@cluster0.45zp5.mongodb.net/skinbeauty_enhance?retryWrites=true&w=majority", { useNewUrlParser: true ,useFindAndModify: false}).then(() => {
  //   console.log('Database is connected') 
  //   },
  //   err => { console.log('Can not connect to the database'+ err)}
  // );
  //   mongoose.connect("mongodb://kasino9_admin:Kiranku123%24@51.79.167.211:27731/kasino9?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=kasino9&authMechanism=SCRAM-SHA-256", 
  // { useNewUrlParser: true ,useFindAndModify: false }).then(
  //   () => {console.log('Database is connected') },
  //   err => { console.log('Can not connect to the database'+ err)}
  // );


  app.use(cors());
  app.use(express.static('./client'));
  app.use(express.static('./upload'));
  app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
  app.use(bodyParser.urlencoded({limit: "15360mb",extended: true,parameterLimit:100000000,type:'application/json'}));
  app.use(express.limit('100M'));
  // app.use(bodyParser());
  app.use('/api',adminRouter);

  SocketServer(io);

  app.get('*', (req, res) => {
    res.sendFile(path.join(config.DIR, 'client/index.html'));  
  });


  //   mongoose.connect("mongodb://kasagames_admin:Kiranku123%24@164.52.199.98:26767/kasagames?authSource=kasagames", { useNewUrlParser: true, useFindAndModify: false }).then(
  //     () => {console.log('Database is connected') },
  //     err => { console.log('Can not connect to the database'+ err)}
  //   );

  //    start server
  server.listen(process.env.PORT || config.ServerPort, () => {
    console.log(`Started server on => http://localhost:${config.ServerPort}`);
  });
  // in case of an error
  app.on('error', (appErr, appCtx) => {
  });