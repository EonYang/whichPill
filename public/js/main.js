let socket = io('/');
let gameData;
var timers = [];

// Server
socket.on('connect', function () {
    console.log("You are connected: " + socket.id);
});

socket.on('disconncted', function () {
    socket.emit('disconnected', socket.id);
});

socket.on('gameState', function (data) {
    gameData = data;
    if (gameData.gameState != "prep") {
        updateScreen(gameData);
    }

    var jqueryDom = createScreenbullet("Yang yang has a little lamb.");
    addInterval(jqueryDom);

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
function updateScreen(gameData) {
    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    // Add new elements
    let newDiv = $("<div></div>");

    $("#main").append(newDiv.clone());
    $("#main")[0].childNodes[0].id = "choiceGroup";
    $("#main")[0].childNodes[0].classList.add("choice", "animated", "fadeIn");

    $("#choiceGroup").append(newDiv.clone());
    $("#choiceGroup").append(newDiv.clone());
    $("#choiceGroup")[0].childNodes[0].id = "choice-a";
    $("#choiceGroup")[0].childNodes[0].classList.add("animated", "fadeIn");
    $("#choiceGroup")[0].childNodes[1].id = "choice-b";
    $("#choiceGroup")[0].childNodes[1].classList.add("animated", "fadeIn");

    // Choice A
    let chanceA = gameData.questions[0][0].chance;
    let valueA = gameData.questions[0][0].value;
    let backfireA = gameData.questions[0][0].backfire;

    let txt1 = $("<span></span>").text(`You have ${(100 * chanceA).toFixed(0)}% chance to win ${valueA} with a backfire of ${backfireA}!`);
    $("#choice-a").append(newDiv.clone());
    $("#choice-a")[0].childNodes[0].id = "result-a"
    $("#result-a").append(txt1);

    // Choice B
    let chanceB = gameData.questions[0][1].chance;
    let valueB = gameData.questions[0][1].value;
    let backfireB = gameData.questions[0][1].backfire;

    let txt2 = $("<span></span>").text(`You have ${(100 * chanceB).toFixed(0)}% chance to win ${valueB} with a backfire of ${backfireB}!`);
    $("#choice-b").append(newDiv.clone());
    $("#choice-b")[0].childNodes[0].id = "result-b"
    $("#result-b").append(txt2);

    // Add score board
    $("#main").prepend(newDiv.clone());
    $("#main")[0].childNodes[0].id = "scoreBoard";
    $("#scoreBoard")[0].classList.add("animated", "fadeIn");

    let player1 = $("<div></div>").text(`${gameData.users[0].name}: ${gameData.users[0].sum}`);
    let player2 = $("<div></div>").text(`${gameData.users[1].name}: ${gameData.users[1].sum}`);
    let player3 = $("<div></div>").text(`${gameData.users[2].name}: ${gameData.users[2].sum}`);
    let player4 = $("<div></div>").text(`${gameData.users[3].name}: ${gameData.users[3].sum}`);
    $("#scoreBoard").append(player1);
    $("#scoreBoard").append(player2);
    $("#scoreBoard").append(player3);
    $("#scoreBoard").append(player4);
    $("#scoreBoard").children().each(function () {
        this.classList.add("score");
    });

    // Add round and turn info
    $("#main").append(newDiv.clone());
    $("#main")[0].lastChild.id = "info"
    $("#info")[0].classList.add("animated", "fadeIn");

    let round = $("<div></div>").text(`Round: ${gameData.round}`);
    let turn = $("<div></div>").text(`It's ${gameData.whosTurn.name}'s turn.`);
    $("#info").append(round);
    $("#info").append(turn);
    $("#info")[0].childNodes[0].classList.add("round");
    $("#info")[0].childNodes[1].classList.add("turn");

    centerContent();
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