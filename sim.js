class SIM {
  constructor() {
    this.testFunctions;
  }
  start() {
    let t = 0;
    for (var i = 0; i < this.testFunctions.length; i++) {
      t += 5000;
      console.log(t);
      setTimeout(this.testFunctions[i], t);
    }
  }
}

let sim = new SIM();

sim.testFunctions = = [
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

module.exports = sim;
