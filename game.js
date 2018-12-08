const tool = require('./tool.js');

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
      sum: 0,
      hasPlayedInThisRound: false,
    }
    this.users.push(data);
  }

  startGame() {
    this.state = 'inProgress';
    this.nextRound();
    console.log(`game started`);
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
  }

  nextTurn() {
    let hasEveryonePlayed = true;
    for (var i = 0; i < this.users.length; i++) {
      if (!this.users[i].hasPlayedInThisRound) {
        this.currentQuestion = this.getNewQuestion();
        this.whosTurn = {
          name: this.users[i].name,
          socketId: this.users[i].socketId
        }
        hasEveryonePlayed = false;
        console.log(`new turn, ${this.users[i].name}'s turn'`);
        console.log(`new question: ${JSON.stringify(this.currentQuestion)}`);
        break;
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

    let backfire1 = -Math.floor(Math.random() * 100) - Math.floor(Math.random() * 1000) * hasHugeBackFire;
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

  getGameData() {
    let data = {
      gameState: this.gameState,
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
}

let game = new GAME();

module.exports = game;
