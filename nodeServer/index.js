const { createServer } = require("http");
const { Server } = require("socket.io");
//const cors = require("cors");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5500", // Replace with your client's origin
    methods: ["GET", "POST"], // Allow only specific methods
    allowedHeaders: ["my-custom-header"], // Allow only specific headers
    credentials: true // Allow credentials (cookies)
  }
});

const users = {};

io.on('connection', socket => {
    // Handling the event of a new user joining the chat:
    socket.on('new-user-joined', naam => {
        //console.log("new-user: ", naam);
        users[socket.id] = naam;
        socket.broadcast.emit('user-joined', naam);
    });

    // event of sending a message:
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    //event of disconnecting a user, this is a built-in event!:
    socket.on('disconnect', message =>{
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    })

});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
