import mongoose from 'mongoose';
// const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roomSchema = new Schema({
    code: String,
    title: String,
    roomType: Number,
    // confereeList: [String],
    users:[
        {
            userName:String,
            uuid:String,
            chosenSeat: Number
        }
    ],
    messages: [
        {
            msg: String,
            time: String,
            user: {
                userName:String,
                uuid:String,
                chosenSeat: Number
            }
        }
    ]
})

var RoomModel = mongoose.model("room", roomSchema);

// exports.model = RoomModel;
export default RoomModel