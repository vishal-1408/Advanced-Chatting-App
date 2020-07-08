var express = require("express");
var app = express();
var socket = require("socket.io");
var mongoose = require("mongoose");
var User = require("./models/user.js");
var format = require("./utils/messages.js");
var dotenv = require("dotenv");

dotenv.config();

mongoose.set("useNewUrlParser",true);
mongoose.set("useFindAndModify",false);
mongoose.set("useCreateIndex",true);
mongoose.set("useUnifiedTopology",true);

mongoose.connect("mongodb+srv://vishal:vishal1408@cluster0.yqug2.mongodb.net/webchatapp");



app.use(express.static(__dirname+"/public"));



let port = process.env.PORT;
if(port==null || port=="") port=3000;
var server = app.listen(port,function(){
  console.log(`Server has started on the port ${port}`);
});


io = socket(server);

io.on("connection",function(socket){
  console.log("connection established");
  socket.on("room",function(data){

    socket.join(data.room);
    console.log("joined");

    socket.emit("message",format("ChatBot",`Welcome ${data.username} to the ${data.room} room!!`));

    socket.broadcast.to(data.room).emit("message",format("ChatBot",`${data.username} has joined the room`));

    data.socketId = socket.id;
    User.create(data,function(er,sol){
      if(er) console.log(er);
      else{
        console.log(sol);
        User.find({room:data.room},function(err,s){
          if(err) console.log(err);
          else{
            console.log("checking for room members");
            console.log(s);
            socket.emit("roomusers",s);
            console.log(sol.room);
            socket.broadcast.to(sol.room).emit("roomuser",sol);
          }
        });
      }
    });

  });




  socket.on("disconnect",function(){
    console.log(socket.id);
    User.findOne({socketId:socket.id},function(err,sol){
      if(err) console.log(err);
      else{
        console.log(sol);
        io.sockets.to(sol.room).emit("message",format("ChatBot",`${sol.username} has left the room`));
        io.sockets.to(sol.room).emit("deleteuser",sol.username);
        User.deleteOne({socketId:socket.id},function(er){if(er) console.log(er);});

      }
    });

  });

  socket.on("chat",function(data){
    User.findOne({socketId:socket.id},function(err,sol){
      if(err) console.log(err);
      else{
        console.log(sol);
        io.sockets.to(sol.room).emit("chat",format(sol.username,data.message));
      }
    });
  })

  socket.on("typing",function(data){
    User.findOne({socketId:socket.id},function(err,sol){
      if(err) console.log(err);
      else{
        console.log(sol);
        socket.broadcast.to(sol.room).emit("typing",sol.username+data);
      }
    });
  })
});
