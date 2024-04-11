const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

var audio = new Audio('../ting.mp3');

const append = (message, position)=> {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position === 'left') {
        audio.play();
    }
}

// If the form is getting submitted, send the message to the server:
form.addEventListener('submit', (e)=>{
    e.preventDefault(); // Prevents the page from reloading
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

// Ask for the name of new user and let the server know:
const naam = prompt("Please enter your name:");
socket.emit('new-user-joined', naam);

// note: the event name has to be the same as that mentioned in the node server file!

// If a new user joins, receive his/her name from the server:
socket.on('user-joined', naam => {
    append(`${naam} joined the chat`, 'right');
})

// If server sends a message, receive it:
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

// If the user leaves the chat, append it in the container:
socket.on('left', name =>{
    append(`${name} left the chat`, 'left');
})