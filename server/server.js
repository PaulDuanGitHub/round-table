const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io")
const cors = require('cors');
require('./connectMongo.js');
const RoomModel = require('./rooms').model;
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin: "http://localhost:3000",
    methods: ["GET","POST"]
  },
  cookie: {
    name:"test-cookie",
    httpOnly:true,
    sameSite:"strict"
  }
});
app.post('/api/load-room', function(req, res){
  var code = req.query.code;
  var uuid = req.query.uuid;
  if (code == null){
    res.send({code:code, status:1})
    return
  }else if (uuid == null){
    res.send({code:code, status:2})
    return
  }
  RoomModel.findOne({code:code}, (err, doc)=>{
    if(doc == null){
      console.log(`Can not find room ${code}`);
      res.send({code:code, status:1});
    }else{
      RoomModel.findOne({code:code},{title:1,messages:1,users:{$elemMatch:{uuid:uuid}}}, (err, doc)=>{
        if (doc.users[0] == null){
          res.send({code:code, status:2})
        }else {
          res.send({code:code, status:0,msgs:doc.messages, user:doc.users[0], title:doc.title})
        }
      })
    }
  })
})
app.post('/api/check-room', function(req, res){
  var code = req.query.code;
  var name = req.query.name;
  var uuid = req.query.uuid;
  RoomModel.findOne({code:code}, (err, doc)=>{
    if(doc == null){
      res.send({code:code, status:1});
    }else{
      RoomModel.updateOne({code:code},{$push:{users:{userName:name,uuid:uuid}}}, (err)=>{
      });
      res.send({code:code, status:0})
    }
  })
})

app.post('/api/create-room', function(req, res){
    var code = req.query.code;
    var name = req.query.name;
    var uuid = req.query.uuid;
    var title = req.query.title;
    // console.log(code);
    RoomModel.findOne({code:code}, (err, doc)=>{
      // console.log(doc);
      if (doc == null){
        res.send({code:code,status:1});
        RoomModel.create({code:code, title:title},()=>{
          RoomModel.updateOne({code:code},{$push:{users:{userName:name,uuid:uuid}}}, (err)=>{
        });
        });
      }else{
        res.send({code:code,status:0})
      }
    });
})

io.on('connection', (socket) => {
  socket.on("joinRoom", (data)=>{
    // socket.handshake.headers.cookie="user=44"
    socket.join(data.roomCode)
    console.log(`joined room ${data.roomCode}`);

  })
  socket.on("new message", (data)=>{
    var res = data;
    var roomCode = data.roomCode
    var msg = data.msg
    var user = data.user
    res.ip=socket.handshake.address
    res.time=socket.handshake.time;
    // console.log(JSON.stringify(res));
    // io.sockets.emit("recieveMessage",res);
    io.to(roomCode).emit("recieveMessage", res)
    // console.log(roomCode);
    RoomModel.updateOne({code:roomCode}, {$push:{messages:{ip:res.ip,msg:msg,time:res.time,user:user}}} ,(err)=>{
      // console.log(err);
    })
    // console.log(`Send ${msg.msg} to room ${msg.roomCode}`);
    // console.log("A user connected: "+ `${socket.id}`);
    // console.log("user: "+socket.handshake.address + "  " + socket.handshake.time);
  });
  
})

server.listen(8000, () => {
  console.log('listening on *:8000');
});