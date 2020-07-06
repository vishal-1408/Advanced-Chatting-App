var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username:String,
  room: String,
  socketId:String
});

var User = mongoose.model("User",userSchema);

module.exports = User;
