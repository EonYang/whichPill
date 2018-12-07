const express = require('express');
const port = 5600;
const ioPort = 5600;
const app = express();
app.use(express.static('public'));
const server = require('http').createServer(app).listen(port, function() {
  console.log(`server on ${port}`);
});
const io = require('socket.io').listen(ioPort);

const game = new GAME();

let data = {};

const web = io.of('/bullySocket');
web.on('connection', function(socket) {
  console.log(`An player ${socket.id} connected`);
});


setInterval(5000, sendDataSnippet);

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
  socket.emit('gameState', dataSnippet);
}
