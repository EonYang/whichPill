let socket = io('/');
let gameData;
var timers = [];
let refreshScreen = 1;

// Server
socket.on('connect', function () {
    console.log("You are connected: " + socket.id);
});

socket.on('disconncted', function () {
    socket.emit('disconnected', socket.id);
});

socket.on('gameState', function (data) {
    gameData = data;
    if (gameData.gameState == "inProgress" && refreshScreen == 1) {
        initScreen(gameData);
        refreshScreen = 0;
    } else if (gameData.gameState == "inProgress" && refreshScreen == 0){
        // updateScreen(gameData);
    }
    console.log(data);
});

socket.on('sendChat', function(data) {
    var jqueryDom = createScreenbullet("Yang yang has a little lamb.");
    addInterval(jqueryDom);
    console.log(JSON.stringify(data));
  });

// Center the main div and set cookies
$(window).on('load', function () {
    centerContent();
});

$(window).on('resize', function () {
    centerContent();
});

function centerContent() {
    var container = $('#home');
    var content = $('#main');
    content.css("left", (container.width() - content.width()) / 2);
    content.css("top", ($(window).height() - content.height()) / 2 - 32);
}

// Main
function initScreen(gameData) {
    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    let newDiv = $("<div></div>");

    $("#main").append(newDiv.clone());
    $("#main").append(newDiv.clone());
    $("#main")[0].childNodes[0].id = "infoGroup";
    $("#main")[0].childNodes[1].id = "turnGroup";

    // Info Group
    $("#infoGroup").append(newDiv.clone());
    $("#infoGroup").append(newDiv.clone());
    $("#infoGroup")[0].childNodes[0].id = "infoRound";
    $("#infoGroup")[0].childNodes[1].id = "infoScoreboard";

    // Info Group - Round
    $("#infoRound").append(newDiv.clone());
    $("#infoRound").append(newDiv.clone());
    $("#infoRound")[0].childNodes[0].id = "roundTitle";
    $("#infoRound")[0].childNodes[1].id = "roundBlock";

    // Info Group - Round - Title
    $("#roundTitle")[0].innerHTML = "Round";
    $("#roundTitle")[0].classList.add("title");

    // Info Group - Round - Block
    $("#roundBlock").append(newDiv.clone());
    $("#roundBlock").append(newDiv.clone());
    $("#roundBlock")[0].classList.add("blocks");
    $("#roundBlock")[0].childNodes[0].id = "roundNumber";
    $("#roundBlock")[0].childNodes[1].id = "roundTaker";
    $("#roundNumber")[0].classList.add("blockTitle");
    $("#roundTaker")[0].classList.add("blockText");
    $("#roundNumber")[0].innerHTML = `${gameData.round}`;
    $("#roundTaker")[0].innerHTML = `${gameData.whosTurn.name}`;

    // Info Group - Scoreboard
    $("#infoScoreboard").append(newDiv.clone());
    $("#infoScoreboard").append(newDiv.clone());
    $("#infoScoreboard")[0].childNodes[0].id = "scoreboardTitle";
    $("#infoScoreboard")[0].childNodes[1].id = "scoreboardBlockGroup";

    // Info Group - Scoreboard - Title
    $("#scoreboardTitle")[0].innerHTML = "Scoreboard";
    $("#scoreboardTitle")[0].classList.add("title");

    // Info Group - Scoreboard - Block
    blockGenerator(0, gameData.users[0].name, gameData.users[0].score);
    blockGenerator(1, gameData.users[1].name, gameData.users[1].score);
    blockGenerator(2, gameData.users[2].name, gameData.users[2].score);
    blockGenerator(3, gameData.users[3].name, gameData.users[3].score);
    


















    // $("#choiceGroup").append(newDiv.clone());
    // $("#choiceGroup").append(newDiv.clone());
    // $("#choiceGroup")[0].childNodes[0].id = "choice-a";
    // $("#choiceGroup")[0].childNodes[0].classList.add("animated", "fadeIn");
    // $("#choiceGroup")[0].childNodes[1].id = "choice-b";
    // $("#choiceGroup")[0].childNodes[1].classList.add("animated", "fadeIn");

    // // Choice A
    // let chanceA = gameData.questions[0][0].chance;
    // let valueA = gameData.questions[0][0].value;
    // let backfireA = gameData.questions[0][0].backfire;

    // let txt1 = $("<span></span>").text(`You have ${(100 * chanceA).toFixed(0)}% chance to win ${valueA} with a backfire of ${backfireA}!`);
    // $("#choice-a").append(newDiv.clone());
    // $("#choice-a")[0].childNodes[0].id = "result-a"
    // $("#result-a").append(txt1);

    // // Choice B
    // let chanceB = gameData.questions[0][1].chance;
    // let valueB = gameData.questions[0][1].value;
    // let backfireB = gameData.questions[0][1].backfire;

    // let txt2 = $("<span></span>").text(`You have ${(100 * chanceB).toFixed(0)}% chance to win ${valueB} with a backfire of ${backfireB}!`);
    // $("#choice-b").append(newDiv.clone());
    // $("#choice-b")[0].childNodes[0].id = "result-b"
    // $("#result-b").append(txt2);

    // // Add score board
    // $("#main").prepend(newDiv.clone());
    // $("#main")[0].childNodes[0].id = "scoreBoard";
    // $("#scoreBoard")[0].classList.add("animated", "fadeIn");

    // let player1 = $("<div></div>").text(`${gameData.users[0].name}: ${gameData.users[0].sum}`);
    // let player2 = $("<div></div>").text(`${gameData.users[1].name}: ${gameData.users[1].sum}`);
    // let player3 = $("<div></div>").text(`${gameData.users[2].name}: ${gameData.users[2].sum}`);
    // let player4 = $("<div></div>").text(`${gameData.users[3].name}: ${gameData.users[3].sum}`);
    // $("#scoreBoard").append(player1);
    // $("#scoreBoard").append(player2);
    // $("#scoreBoard").append(player3);
    // $("#scoreBoard").append(player4);
    // $("#scoreBoard").children().each(function () {
    //     this.classList.add("score");
    // });

    // // Add round and turn info
    // $("#main").append(newDiv.clone());
    // $("#main")[0].lastChild.id = "info"
    // $("#info")[0].classList.add("animated", "fadeIn");

    // let round = $("<div></div>").text(`Round: ${gameData.round}`);
    // let turn = $("<div></div>").text(`It's ${gameData.whosTurn.name}'s turn.`);
    // $("#info").append(round);
    // $("#info").append(turn);
    // $("#info")[0].childNodes[0].classList.add("round");
    // $("#info")[0].childNodes[1].classList.add("turn");

    $("#main")[0].classList.add("animated", "fadeIn");
    centerContent();
}

function updateScreen(gameData) {

    let chanceA = gameData.questions[0][0].chance;
    let valueA = gameData.questions[0][0].value;
    let backfireA = gameData.questions[0][0].backfire;

    let chanceB = gameData.questions[0][1].chance;
    let valueB = gameData.questions[0][1].value;
}

// Add screen bullets
function createScreenbullet(text) {
    var jqueryDom = $("<div class='bullet'>" + text + "</div>");
    var fontColor = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random()) + ")";
    var fontSize = Math.floor((Math.random() + 1) * 24) + "px";
    var left = $("#main").width() + "px";
    var top = Math.floor(Math.random() * 400) + "px";
    top = parseInt(top) > 352 ? "352px" : top;
    jqueryDom.css({
        "position": 'absolute',
        "color": fontColor,
        "font-size": fontSize,
        "left": left,
        "top": top,
        "white-space": "nowrap",
    });
    $("#main").append(jqueryDom);
    return jqueryDom;
}

function addInterval(jqueryDom) {
    var left = jqueryDom.offset().left - $("#main").offset().left;
    var timer = setInterval(function () {
        left--;
        jqueryDom.css("left", left + "px");
        if (jqueryDom.offset().left + jqueryDom.width() < $("#main").offset().left) {
            jqueryDom.remove();
            clearInterval(timer);
        }
    }, 10);
    timers.push(timer);
}

function blockGenerator(id, name, score) {
    console.log(`scoreblock${id}`);
    let newDiv = $("<div></div>");
    let blockId = `scoreblock${id}`;
    $("#scoreboardBlockGroup").append(newDiv.clone());
    $("#scoreboardBlockGroup")[0].childNodes[`${id}`].id = blockId;
    
    $(`#${blockId}`).append(newDiv.clone());
    $(`#${blockId}`).append(newDiv.clone());
    $(`#${blockId}`)[0].classList.add("blocks");
    $(`#${blockId}`)[0].childNodes[0].id = `${blockId}Name`;
    $(`#${blockId}`)[0].childNodes[1].id = `${blockId}Score`;

    $(`#${blockId}Name`)[0].classList.add("blockTitle");
    $(`#${blockId}Score`)[0].classList.add("blockText");
    $(`#${blockId}Name`)[0].innerHTML = `${name}`;
    $(`#${blockId}Score`)[0].innerHTML = `${score}`;
}