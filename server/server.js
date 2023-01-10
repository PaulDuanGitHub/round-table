/**
 * 重复进入房间，关闭标签页退出房间
 * 	- 更新users -> conferees 并添加chosenSeat - Finished
 */

import express from 'express';
const app = express();
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import './connectMongo.js';
import RoomModel from './rooms.js';
import loadRoomModel from './loadRoomModel.js';
// import Room from './Room.js';
// const express =  require('express');
// const app = express();
// const { createServer } =  require('http');
// const { Server } =  require("socket.io");
// const cors =  require('cors');
// require('./connectMongo.js');
// const RoomModel =  require('./rooms.js').model;
// const loadRoomModel =  require('./loadRoomModel.js').loadRoomModel;
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000","http://127.0.0.1:3000","https://paulduangithub.github.io"],
		methods: ["GET", "POST"],
		credentials: true
	},
	cookie: {
		name: "test-cookie",
		httpOnly: true,
		sameSite: "strict"
	}
});
/**
 * Respond status 1, code is empty or no such room under the code
 * Respond status 2, uuid is empty or no such uuid in the room
 * Repsond status 0, success
 */
app.post('/api/load-room', function (req, res) {
	var code = req.query.code;
	var uuid = req.query.uuid;
	if (code == null) {
		res.send({ code: code, status: 1 })
		return
	} else if (uuid == null) {
		res.send({ code: code, status: 2 })
		return
	}
	RoomModel.findOne({ code: code }, (err, room) => {
		if (room == null) {
			console.log(`Can not find room ${code}`);
			res.send({ code: code, status: 1 });
		} else {
			RoomModel.findOne({ code: code }, { title: 1, messages: 1, users: { $elemMatch: { uuid: uuid } }, roomType: 1}, (err, doc) => {
				if (doc.users[0] == null) {
					res.send({ code: code, status: 2 })
				} else {
					console.log(room.users);
					res.send({ code: code, status: 0, msgs: doc.messages,users:room.users, user: doc.users[0], title: doc.title, roomType: doc.roomType})
				}
			})
		}
	})
})
app.post('/api/check-room', function (req, res) {
	var code = req.query.code;
	RoomModel.findOne({ code: code },{users: 1}, (err, doc) => {
		if (doc == null) {
			res.send({ code: code, status: 1 });
		} else {
			// console.log(doc.users[0]);
			res.send({ code: code, users: doc.users, status: 0 })
		}
	})
})
app.post('/api/join-room', function (req, res) {
	var code = req.query.code;
	var name = req.query.name;
	var chosenSeat = req.query.chosenSeat;
	var uuid = req.query.uuid;
	RoomModel.findOne({ code: code }, (err, doc) => {
		if (doc == null) {
			res.send({ code: code, status: 1 });
		} else {
			RoomModel.updateOne({ code: code }, { $push: { users: { userName: name, uuid: uuid, chosenSeat: chosenSeat } }}, (err) => {
			});
			res.send({ code: code, status: 0 })
		}
	})
})

app.post('/api/create-room', function (req, res) {
	var code = req.query.code;
	var name = req.query.name;
	var uuid = req.query.uuid;
	var title = req.query.title;
	var roomType = req.query.roomType;
	// console.log(code);
	RoomModel.findOne({ code: code }, (err, doc) => {
		// console.log(doc);
		if (doc == null) {
			res.send({ code: code, status: 1 });
			RoomModel.create({ code: code, title: title, roomType: roomType}, () => {
				RoomModel.updateOne({ code: code }, { $push: { users: { userName: name, uuid: uuid, chosenSeat:0 } } }, (err) => {
				});
			});
		} else {
			res.send({ code: code, status: 0 })
		}
	});
})

io.on('connection', (socket) => {
	// console.log("欸嘿嘿嘿，鸡汤来了");
	socket.on('disconnect', (data)=>{
		// var roomCode = data.roomCode;
		// var userName = data.user.name;
		// var userUUID = data.user.uuid;
		// RoomModel.updateOne({code:roomCode}, {$pull: { users: { userName: userName, uuid: userUUID } }}, (err) =>{})
		console.log("我走了啊，我不打扰");
	})
	socket.on("joinRoom", (data) => {
		io.in(data.roomCode).fetchSockets().then((sockets)=>{
			console.log(sockets.length);
			sockets.forEach(s=>{
				if (s.uuid == data.uuid){
					// io.to(s.id).emit("quitRoom");
				};
			})
		});
		
		socket.join(data.roomCode)
		socket.uuid = data.uuid;

		RoomModel.findOne({ code: data.roomCode }, { users: 1 }, (err, doc) => {
			if (doc != null) {
				io.to(data.roomCode).emit("resUsers", doc.users)
			}
		})

		io.to(data.roomCode).emit("loadingRoom", data.node)
		
		console.log(`${socket.id } joined room ${data.roomCode}`);

	})
	socket.on("setMyMixerTime", (data) => {
		var roomCode = data.roomCode;
		console.log("收到" + roomCode + " " + data.selfAnimationActionTimes);
		socket.to(roomCode).emit("setUrMixerTime", {hisTimes: data.selfAnimationActionTimes, hisIndex: data.selfIndex})
	})
	socket.on("new message", (data) => {
		var res = data;
		var roomCode = data.roomCode
		var msg = data.msg
		var user = data.user
		res.ip = socket.handshake.address
		res.time = socket.handshake.time;
		// console.log(JSON.stringify(res));
		// io.sockets.emit("recieveMessage",res);
		io.to(roomCode).emit("recieveMessage", res)
		// console.log(roomCode);
		RoomModel.updateOne({ code: roomCode }, { $push: { messages: { ip: res.ip, msg: msg, time: res.time, user: user } } }, (err) => {
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