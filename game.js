const tool = require('./tool.js');

class GAME {
  constructor() {
    this.users = [];
    this.state = 'prep';
    this.round = 0;
    this.totalRound = 5;
    this.history = [];
    this.currentQuestion;
    this.lastTurn = {};
    this.whosTurn = {
      name: '',
      socketId: '',
    }
  }

  tryRetriveUser(cookie, socketId) {
    let index = tool.FindIndexByCookie(this.users, cookie);
    if (index != -1) {
      // save his new socket id.
      this.users[index].socketId = socketId;
      this.users[index].online = true;
      console.log(`${this.users[index]} is coming back`);
      // client needs to tell this user to get back to his game.
    } else {
      console.log(`this is a new user`);
    }

  }

  userOffline(userSocketId) {

  }

  addUser(name, socketId, role, cookie) {
    let data = {
      name: name,
      socketId: socketId,
      role: role,
      cookie: cookie,
      scores: [],
      online: true,
      hasPlayedInThisRound: false,
    }
    this.users.push(data);
  }

  getNewQuestion() {
    let hasHugeBackFire = 0;
    if (Math.random() > 0.7) {
      hasHugeBackFire = 1;
    }

    let backfire1 = -Math.floor(Math.random() * 100) - Math.floor(Math.random() * 1000) * hasHugeBackFire;
    let backfire2 = 0;
    let util1 = 20 + Math.random() * 10;
    let util2 = 20 + Math.random() * 10;
    let chance1 = (1 + (Math.floor(Math.random() * 10))) / 100;
    let chance2 = (91 + (Math.floor(Math.random() * 10))) / 100;
    let value1 = Math.floor((util1 - backfire1) / chance1);
    let value2 = Math.floor((util2 - backfire2) / chance2);

    let q = [{
      chance: chance1,
      value: value1,
      backfire: backfire1,
    }, {
      chance: chance2,
      value: value2,
      backfire: backfire2
    }];
    return (q);
  }

  storeUserChoice(userSocket, choice) {
    let userIndex = tool.FindIndexBySocket(this.users, userSocket);
    let user = this.users[index];
    user.playedInThisTurn = true;
    let q = this.currentQuestion;
    let roll = Math.random();
    let win = false;
    let gain = 0;
    if (q[choice].chance > roll) {
      gain = q[choice].value;
    } else {
      gain = q[choice].backfire;
    }
    this.lastTurn = {
      who: user.name,
      which: choice,
      hasWin: win,
      gain: gain,
    }
    this.users[index].scores.push(gain);
  }

  nextTurn() {
    this.currentQuestion = this.getNewQuestion();
    let hasEveryonePlayed = true;
    for (var i = 0; i < this.users.length; i++) {
      if (!this.users[i].hasPlayedInThisRound) {
        this.whosTurn = {
          name: this.users[i].name,
          socketId: this.users[i].socketId
        }
        hasEveryonePlayed = false;
        break;
      }
    }

    if (hasEveryonePlayed) {
      this.nextRound();
    }

    console.log('new turn');
    console.log('new question');
    console.log(JSON.stringify(this.currentQuestion));
    console.log(`new player's turn`);
    console.log(JSON.stringify(this.whosTurn));
    // save last choice made by user

  }


  nextRound() {
    if (this.round < this.totalRound) {
      this.round += 1;
      for (var i = 0; i < this.users.length; i++) {
        this.users[i].hasPlayedInThisRound = false;
        this.nextTurn();
      }
    } else if (this.round == this.totalRound) {
      this.gameEnd();
    }
  }

  getGameData() {
    let data = {
      gameState: this.gameState,
      scores: [],
      round: this.round,
      whosTurn: this.whosTurn,
      questions: [this.currentQuestion],
      lastTurn: this.lastTurn,
    }

    for (var i = 0; i < this.users.length; i++) {
      let score = {
        name: this.users[i].name,
        scores: this.users[i].scores,
      }
      data.scores.push(score);
    }
    return data
  }

  writeHistory() {

  }

  startGame() {
    // round = 1
    this.nextRound();
    // get 1st question
    // get first player // next round did this for us
    // gamestart in progress
    this.state = 'inProgress';
  }

  gameEnd() {
    this.state = 'ended';
  }

  resetGame() {
    this.state = 'prep';
    this.round = 0;
    this.totalRound = 5;
    this.history = [];
    this.currentQuestion = {};
    this.lastTurn = {};
    this.whosTurn = {
      name: '',
      socketId: '',
    }
  }

  setEndRound(num) {
    this.totalRound = num;
  }
}

let game = new GAME();

module.exports = game;
