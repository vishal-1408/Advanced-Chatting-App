var socket = io();

//vvimp

var d = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

var input = document.querySelector("#msg");


//important
socket.emit("room",d);

socket.on("roomusers",function(data){
  console.log(data);
  createUser(data);
  roomName(data[0]);
});

socket.on("deleteuser",function(data){
  deleteUser(data);
})

socket.on("message",function(data){
  createMessage(data);
  console.log(data);
});

var form = document.querySelector("form");
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

var c=1;
input.addEventListener("keypress",function(){
  if(c==1){
    socket.emit("typing"," is typing....");
    c++;
  }

});

socket.on("chat",function(data){
  var typing = document.querySelector(".chat-messages .typing");
  console.log("this is it");
  console.log(typing);
   if(typing){
     console.log(typing);
     typing.parentNode.removeChild(typing);
   }
  createMessage(data);
  document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight; //imp
});

socket.on("typing",function(data){
  typing(data);
})

function createMessage(data){
  console.log(data);
  var div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML= `<p class="meta">${data.user} <span>${data.time}</span></p>
        <p class="text">
            ${data.text}
        </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function createUser(data){
  data.forEach(function(d){
    var li = document.createElement("li");
    li.innerHTML = d.username;
    li.classList.add(d.username);
    document.querySelector("#users").appendChild(li);
  });
}

function roomName(d){
  console.log("asd;lkdas;d");
  document.querySelector("#room-name").innerHTML = d.room;
}

function deleteUser(d){
  var user = document.querySelector("."+d);
  console.log(user);
  user.parentNode.removeChild(user);
}

function typing(data){
  var div = document.createElement("div");
  div.innerHTML = data;
  div.classList.add("typing");
  document.querySelector(".chat-messages").appendChild(div);
  console.log("sadkjlsajkdsa");

}


//this chat.html is different for diffferent rooms. the changes made by a socket in that room reflected for allt he users of the same room
