const tool = require('./tool.js');
const game = require('./game.js');
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
    game.tryRetriveUser(data, socket.id);
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
    game.storeUserChoice(socket.id, data.choice);
    io.emit('gameState', game.getGameData());
  });

  socket.on('sendChat', function(data) {
    console.log(JSON.stringify(data));
    io.emit('newChat', data);
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

// setTimeout(runTestData, 2000);
//
// setInterval(function() {
//   io.emit('gameState', game.getGameData());
// }, 5000, );
//
// setInterval(sendChatSnippet, 10000, );

function sendChatSnippet() {
  let people = ['Daniel', 'kelsey', 'Jordan', 'Lee', 'Yang'];
  let dataSnippet = {
    who: people[Math.floor(tool.Random(5))],
    text: tool.CreateId()
  }
  io.emit('newChat', dataSnippet);
}

var testFunctions = [
  function() {
    game.resetGame();
  },
  function() {
    game.addUser('yang', '111111', 'player', 'hajkshdfkjhskjdhfkjhk');
    game.addUser('Jordan', '222222', 'player', 'ashjkdfhjdfhjkshd');
    game.addUser('bitch', '333333', 'player', 'adasdasdasd3e1das');
    game.addUser('kelsey', '444444', 'player', '123asdasdasd');
    game.addUser('Daniel', '555555', 'player', 'sdjfskhdkjfh');
  },
  function() {
    game.userLeavesGame('555555');
  },
  function() {
    game.startGame();
  },
  function() {
    game.storeUserChoice('111111', 1);
  },
  function() {
    game.storeUserChoice('222222', 0);
  },
  function() {
    game.storeUserChoice('333333', 1);
  },
  function() {
    game.storeUserChoice('444444', 0);
  },
  function() {
    game.whoIsTakingLead();
  },
  function() {
    game.storeUserChoice('111111', 0);
  },
  function() {
    game.storeUserChoice('222222', 1);
  },
  function() {
    game.storeUserChoice('333333', 0);
  },
  function() {
    game.storeUserChoice('444444', 0);
  },
  function() {
    game.whoIsTakingLead();
  },
  function() {
    game.setEndRound(4);
  },
  function() {
    game.storeUserChoice('111111', 1);
  },
  function() {
    game.userLeavesGame('444444');
  },
  function() {
    game.storeUserChoice('222222', 0);
  },
  function() {
    game.storeUserChoice('333333', 1);
  },
  function() {
    game.whoIsTakingLead();
  },
  function() {
    game.storeUserChoice('111111', 0);
  },
  function() {
    game.storeUserChoice('222222', 1);
  },
  function() {
    game.storeUserChoice('333333', 0);
  },
  function() {
    io.emit('gameState', game.getGameData());
  },
  function() {
    game.whoIsTakingLead();
  }
];


function runTestData() {
  let t = 0;
  for (var i = 0; i < testFunctions.length; i++) {
    t += 5000;
    console.log(t);
    setTimeout(testFunctions[i], t);
  }
}
