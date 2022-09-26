var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roomSchema = new Schema({
    code: String,
    title: String,
    users:[
        {
            userName:String,
            uuid:String
        }
    ],
    messages: [
        {
            ip: String,
            msg: String,
            time: String,
            user: {
                userName:String,
                uuid:String
            }
        }
    ]
})

var RoomModel = mongoose.model("room", roomSchema);

exports.model = RoomModel;