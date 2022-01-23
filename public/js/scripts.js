const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// global socket handler
socket.on('user_connected', (username) => {
  drawNewChat(`${username}님이 입장하셨습니다.`);
});

socket.on('user_disconnected', (username) => {
  drawNewChat(`${username}님이 퇴장하셨습니다.`);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username} : ${chat}`);
});

// event callback functions
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);

    // 화면에 채팅표시
    drawNewChat(`나 : ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

// draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `어서오세요 ${username}님! :)`);

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
    <div>
      ${message}
    </div>
  `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const username = prompt('what is your name?');
  socket.emit('new_user', username, (data) => {});
  drawHelloStranger(username);
}

function init() {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
}
init();
