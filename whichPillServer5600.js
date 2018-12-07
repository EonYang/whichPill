const tool = require('./tool.js');
const express = require('express');
const port = 5600;
const ioPort = 5600;
const app = express();
app.use(express.static('public'));
const server = require('http').createServer(app).listen(port, function() {
  console.log(`server on ${port}`);
});

const io = require('socket.io').listen(server);


let gameData = {};

const web = io.of('/');
web.on('connection', function(socket) {
  console.log(`An player ${socket.id} connected`);

  socket.on('setNameAndRole', function(data) {
    console.log(JSON.stringify(data));
  });

  socket.on('sendCookie', function(data) {
    console.log(JSON.stringify(data));
  });

  socket.on('resetGame', function() {
    console.log('game Resetted');
  });

  socket.on('startGame', function() {
    console.log('game startted');
  });

  socket.on('makeChoice', function(data) {
    console.log(JSON.stringify(data));
  });

  socket.on('sendChat', function(data) {
    console.log(JSON.stringify(data));
  });

  socket.on('setEndRound', function(data) {
    console.log(JSON.stringify(data));
  });

});


setInterval(sendDataSnippet, 5000, );

setInterval(sendChatSnippet, 3000, );

function sendChatSnippet() {
  let dataSnippet = {
    who: 'daniel',
    text: 'asdjkfhasjkhdfjkhasdf'
  }
  io.emit('newChat', dataSnippet);
}

function sendDataSnippet() {
  let dataSnippet = {
    gameState: 'inProgress',
    Scores: [{
      name: 'Daniel',
      eachRound: [23, 0, 15, 22, 0]
    }, {
      name: 'Kelsey',
      eachRound: [25, 122, 15, 33]
    }, {
      name: 'Jordan',
      eachRound: [234, 0, 151, 222]
    }, {
      name: 'Bitch',
      eachRound: [23, 130, 55, 32]
    }],
    round: 4,
    whosTurn: 'Kelsey',
    questions: [{
      chance: 0.23,
      value: 125
    }, {
      chance: 0.23,
      value: 125
    }],
    lastTurn: {
      who: 'Daniel',
      which: 'B',
      hasWin: false,
      gain: 0,
    }
  }
  io.emit('gameState', dataSnippet);
}
