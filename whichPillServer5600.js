const tool = require('./tool.js');
const game = require('./game.js');
// const sime = require('./sim.js');
const express = require('express');
const port = 5600;
const ioPort = 5600;
const app = express();
app.use(express.static('public'));
const server = require('http').createServer(app).listen(port, function() {
  console.log(`server on ${port}`);
});

module.exports = { server: server };

const io = require('socket.io').listen(server);

let ai = false;

const web = io.of('/');
web.on('connection', function(socket) {
  console.log(`An player ${socket.id} connected`);

  socket.on('sendCookie', function(data) {
    console.log(JSON.stringify(data));
    game.isThisANewPlayer(data, socket.id);
    io.emit('gameState', game.getGameData());
  });

  socket.on('setNameAndRole', function(data) {
    console.log(JSON.stringify(data));
    let name = data.name;
    let socketId = socket.id;
    let role = data.role;
    let cookie = data.cookie;
    game.addUser(name, socketId, role, cookie);
    io.emit('gameState', game.getGameData());
  });

  socket.on('resetGame', function() {
    console.log('game Resetted');
    game.resetGame();
    io.emit('gameResetted');
    io.emit('gameState', game.getGameData());
  });

  socket.on('startGame', function() {
    console.log('starting game');
    game.startGame();
    if (ai) {
      aiLeaveGame();
    }
    io.emit('gameState', game.getGameData());
  });

  socket.on('makeChoice', function(data) {
    console.log(JSON.stringify(data));
    let win = game.storeUserChoice(socket.id, data.choice);
    io.emit('gameState', game.getGameData());
    if (win) {
      io.emit('showGif', 1);
    }else {
      io.emit('showGif', 0);
    }
  });

  socket.on('sendChat', function(data) {
    console.log(JSON.stringify(data));
    io.emit('newChat', data);
  });

  socket.on('onHover', function(data) {
    console.log(JSON.stringify(data));
    io.emit('userHover', data);
  });

  socket.on('setEndRound', function(data) {
    console.log(JSON.stringify(data));
    game.setEndRound(data);
  });

  socket.on('disconnected', function() {
    game.userLeavesGame(socket.id);
  })

  socket.on('enableAI', function () {
    insertAI();
    console.log('AI added');
    console.log(JSON.stringify(game.users));
  })
});

function insertAI() {
  game.addUser('yang', '111111', 'player', 'hajkshdfkjhskjdhfkjhk');
  game.addUser('Jordan', '222222', 'player', 'ashjkdfhjdfhjkshd');
  game.addUser('bitch', '333333', 'player', 'adasdasdasd3e1das');
  ai = true;
}

function aiLeaveGame() {
  game.userLeavesGame('111111');
  game.userLeavesGame('222222');
  game.userLeavesGame('333333');
}
