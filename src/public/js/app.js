const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  // var msgSplit = message.split(' ');
  var msgSplit = message.split(' ^%&1:^%&2@ ');
  var nickname = msgSplit[0];
  var msg = msgSplit[1]
  if(nickname === "나"){
    li.classList.add("me");

    li.innerHTML = msg;
    li.title = "보낸 사람 : " + nickname;
    ul.appendChild(li);
  } else if(nickname === "딹똼뛹") {
    li.classList.add("you");

    li.innerHTML = msg;
    li.title = "이 메시지는 서버에서 발송되었습니다.";
    ul.appendChild(li);
  } else{
    li.classList.add("you");

    li.innerHTML = msg;
    li.title = "보낸 사람 : " + nickname;
    ul.appendChild(li);
  }
 
  
}

function handleMessageSubmit(event){
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`나 ^%&1:^%&2@ ${value}`);
  })
  input.value = "";
}

function handleNicknameSubmit(event){
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("nickname", value)
  input.value = "";
}

function showRoom(){
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName} 방`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit)
}

function handleRoomSubmit(event){
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit)

socket.on("welcome", (userNickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName} 방 (${newCount})`;
  addMessage(`딹똼뛹 ^%&1:^%&2@ ${userNickname} 이(가) ${roomName} 방에 들어왔습니다.`)
})

socket.on("bye", (userNickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName} 방 (${newCount})`;
  addMessage(`딹똼뛹 ^%&1:^%&2@ ${userNickname} 이(가) ${roomName} 방을 나갔습니다.`)
})

socket.on("new_message", (msg) => {
  addMessage(msg)
})

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if(rooms.length === 0){
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
})