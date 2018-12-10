const tool = require('./tool.js');
const s = require('./whichPillServer5600.js').server;
console.log(JSON.stringify(s));
const io = require('socket.io').listen(s);


let riskyChanceBase = 10;
let riskyChanceRandom = 20;
let conservativeChanceBase = 85;
let conservativeChanceRandom = 20;

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

  userLeavesGame(userSocketId) {
    let userIndex = tool.FindIndexBySocket(this.users, userSocketId);
    console.log(`player ${this.users[userIndex].name} left game,`)
    // in prep state, if user left, he's gone.
    if (this.state == 'prep') {
      console.log(`removed his since the game has not started`);
      this.users.splice(userIndex, 1);
    } else if (this.state == 'inProgress') {
      console.log(`game in inProgress, marked him as offline.`);
      this.users[userIndex].online = false;
      if (this.whosTurn.name == this.users[userIndex].name) {
        this.makeChoiceForOfflineUser(this.users[userIndex].socketId)
      }
    } else {
      console.log(`who cares, game ended anyway`);
    }
  }

  addUser(name, socketId, role, cookie) {
    if (this.state == 'prep') {
      let data = {
        name: name,
        socketId: socketId,
        role: role,
        cookie: cookie,
        scores: [],
        online: true,
        sum: 200,
        hasPlayedInThisRound: false,
      }
      this.users.push(data);
    }
  }

  startGame() {
    if (this.state == 'prep') {
      this.state = 'inProgress';
      this.nextRound();
      console.log(`game started`);
    }
  }

  nextRound() {
    if (this.round < this.totalRound) {
      this.round += 1;
      console.log(`a new round, ${this.round}`);
      for (var i = 0; i < this.users.length; i++) {
        this.users[i].hasPlayedInThisRound = false;
      }
      this.nextTurn();
    } else if (this.round == this.totalRound) {
      this.gameEnd();
    }
    this.whoIsTakingLead();
  }

  nextTurn() {
    let hasEveryonePlayed = true;
    let lastIndex = -1;
    for (var i = 0; i < this.users.length; i++) {
      if (!this.users[i].hasPlayedInThisRound) {
        lastIndex = i;
        this.currentQuestion = this.getNewQuestion();
        this.whosTurn = {
          name: this.users[i].name,
          socketId: this.users[i].socketId
        };

        hasEveryonePlayed = false;
        console.log(`new turn, ${this.users[i].name}'s turn'`);
        console.log(`new question: ${JSON.stringify(this.currentQuestion)}`);
        break;
      }
    }

    // if he is offline, make a choice for him
    if (lastIndex >= 0) {
      if (!this.users[lastIndex].online) {
        this.makeChoiceForOfflineUser(this.users[lastIndex].socketId);
      }
    }

    if (hasEveryonePlayed) {
      this.nextRound();
    }
  }



  getNewQuestion() {
    let hasHugeBackFire = 0;
    if (Math.random() > 0.8) {
      hasHugeBackFire = 1;
    }

    let backfire1 = -Math.floor(Math.random() * 30) - Math.floor(Math.random() * 300) * hasHugeBackFire;
    let backfire2 = 0;
    let util1 = 20 + Math.random() * 10;
    let util2 = 20 + Math.random() * 10;
    let chance1 = (riskyChanceBase + (Math.floor(Math.random() * riskyChanceRandom))) / 100;
    let chance2 = (conservativeChanceBase + (Math.floor(Math.random() * conservativeChanceRandom))) / 100;
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
    if (this.state == 'inProgress') {
      let userIndex = tool.FindIndexBySocket(this.users, userSocket);
      let user = this.users[userIndex];

      console.log(`${user.name} made a choise `);

      user.hasPlayedInThisRound = true;
      let q = this.currentQuestion;
      let roll = Math.random();
      console.log(`rolled ${roll}`);
      let win = false;
      let gain = 0;
      if (q[choice].chance > roll) {
        win = true;
        gain = q[choice].value;
        console.log(`wins ${gain}`);
      } else {
        gain = q[choice].backfire;
        console.log(`doesn't win, lose ${gain}`);
      }

      this.lastTurn = {
        who: user.name,
        which: choice,
        hasWin: win,
        gain: gain,
      }

      // console.log(`${this.lastTurn}`);
      this.users[userIndex].scores.push(gain);
      this.users[userIndex].sum = (this.users[userIndex].sum + gain) > 0 ? (this.users[userIndex].sum + gain) : 0;
      this.nextTurn();
    }
  }

  getGameData() {
    let data = {
      gameState: this.state,
      users: [],
      round: this.round,
      whosTurn: this.whosTurn,
      questions: [this.currentQuestion],
      lastTurn: this.lastTurn,
    }

    for (var i = 0; i < this.users.length; i++) {
      let user = {
        name: this.users[i].name,
        online: this.users[i].online,
        scores: this.users[i].scores,
        sum: this.users[i].sum,
        socket: this.users[i].socketId,
      }
      data.users.push(user);
    }
    console.log(`send data to client`);

    console.log(JSON.stringify(data));
    return data
  }

  writeHistory() {

  }

  gameEnd() {
    this.state = 'ended';
    console.log(`game has ended`);
  }

  resetGame() {
    this.users = [];
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
    console.log(`game has been resetted`);
  }

  setEndRound(num) {
    this.totalRound = num;
    console.log(`new end round is ${num}`);
  }

  whoIsTakingLead() {
    let bigestSum = -1;
    let takingLead = '';
    for (var i = 0; i < this.users.length; i++) {
      console.log(`${this.users[i].name} : ${this.users[i].sum}`);
      if (this.users[i].sum > bigestSum) {
        bigestSum = this.users[i].sum;
        takingLead = this.users[i].name;
      }
    }
    console.log(`${takingLead} takes lead wich a sum of ${bigestSum}`);
  }

  makeChoiceForOfflineUser(userSocket) {
    // add a 2 seconds delay
    let self = this;
    console.log('making choice for offline people, in 2 sec');
    setTimeout(function () {
      let i = tool.FindIndexBySocket(self.users, userSocket);
      let choice = Math.random() > 0.5 ? 0 : 1;
      console.log(`${self.users[i].name} is offline, we made a random choice for him`);
      self.storeUserChoice(userSocket, choice);
      io.emit('gameState', self.getGameData());
    },2000);

  }
}

let game = new GAME();

module.exports = game;
