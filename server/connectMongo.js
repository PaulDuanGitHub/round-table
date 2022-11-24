import mongoose from 'mongoose'
// const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:25565/roundtable");

mongoose.connection.once("open", ()=>{
    console.log("database connected")
})

mongoose.connection.once("close", ()=>{
    console.log("database disconnected")
})
