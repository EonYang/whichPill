let socket = io('/');

socket.on('connect', function() {
    console.log("I am connected: " + socket.id);
});

socket.on('disconncted', function() {
    socket.emit('disconnected', socket.id);
});

socket.on('gameState', function(data) {
    console.log(data);
});

socket.on('newChat', function(data) {
    console.log(data);
});

let data = {

}
socket.emit('event', data);
