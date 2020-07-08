var socket = io();

//vvimp

var d = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

var input = document.querySelector("#msg");
var form = document.querySelector("form");

input.addEventListener("keydown",function(e){
  var a =document.querySelector("#msg").value;
  console.log(a);
  socket.emit("typing"," is typing....");

});

form.addEventListener("submit",function(param){
  param.preventDefault();
  var input = document.getElementById("msg");
  socket.emit("chat",{
    message:input.value
  });
  //imp
  input.value="";
  input.focus();

});



//Emitting
socket.emit("room",d);




socket.on("roomusers",function(data){
  // console.log(data);
  createUsers(data);
  roomName(data[0]);
});


socket.on("roomuser",function(data){
  createUser(data);
});

socket.on("message",function(data){
  createMessage(data);
  // console.log(data);
});


socket.on("chat",function(data){
  // console.log("reciever");
  if( document.getElementsByClassName("typing")[0]) {
    var t = document.getElementsByClassName("typing")[0];
    t.parentNode.removeChild(t);
  }

  createMessage(data);
  document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight; //imp
});


var c=1;
socket.on("typing",function(data){
  if(c==1){
     type(data);
     c++;
  }
   // console.log("call back called");
});

socket.on("deleteuser",function(data){
  deleteUser(data);
});






function createMessage(data){
  // console.log(data);
  var div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML= `<p class="meta">${data.user} <span>${data.time}</span></p>
        <p class="text">
            ${data.text}
        </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function createUsers(data){
  data.forEach(function(d){
    var li = document.createElement("li");
    li.innerHTML = d.username;
    li.classList.add(d.username);
    document.querySelector("#users").appendChild(li);
    // console.log(document.querySelector("#users"));
  });
}

function createUser(d){
    var li = document.createElement("li");
    li.innerHTML = d.username;
    li.classList.add(d.username);
    document.querySelector("#users").appendChild(li);
    // console.log(document.querySelector("#users"));
  }


function roomName(d){
  // console.log("asd;lkdas;d");
  document.querySelector("#room-name").innerHTML = d.room;
  // console.log(d.room,document.querySelector("#room-name"));
}

function deleteUser(d){
  var user = document.querySelector("."+d);
  // console.log(user);
  user.parentNode.removeChild(user);
}

function type(data){
  var div = document.createElement("div");
  div.innerHTML = data;
  div.classList.add("typing");
  document.querySelector(".chat-messages").appendChild(div);
  // console.log("sadkjlsajkdsa");

}


//this chat.html is different for diffferent rooms. the changes made by a socket in that room reflected for allt he users of the same room
