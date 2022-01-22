const socket = io('/');

const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const username = prompt('what is your name?');
  socket.emit('new_user');
}

function init() {
  helloUser();
}
init();
