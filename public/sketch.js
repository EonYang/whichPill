let socket = socket.io();


let data = {
    x: mouseX
};


socket.on('connect', function() {
    console.log("I am connected: " + socket.id);
});

socket.on('disconncted', function() {
    socket.emit('disconnected', socket.id);
});


socket.emit('event', data);
