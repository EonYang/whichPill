let socket = io('/');
let gameData;
var timers = [];
let refreshScreen = 1;
let lastPlayer;

var winSound = new Audio('assets/correct.mp3');
// var loseSOund = new Audio('assets/wrong.mp3');

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
    } else if (gameData.gameState == "inProgress" && refreshScreen == 0) {
        updateScreen(gameData);
    }
    console.log(data);
});

socket.on('newChat', function (data) {
    var jqueryDom = createScreenbullet(data);
    addInterval(jqueryDom);
    console.log(JSON.stringify(data));
});



socket.on('userHover', function (data) {
    console.log(data);
    if (data == 0) {
        $("#choice-a")[0].style.borderColor = "#0F15AE";
        $("#choice-b")[0].style.borderColor = "white";
    } else if (data == 1) {
        $("#choice-b")[0].style.borderColor = "#0F15AE";
        $("#choice-a")[0].style.borderColor = "white";
    }
});

// Center the main div and set cookies
$(window).on('load', function () {
    socket.emit("sendCookie", "ck");
    centerContent();
});

$(window).on('resize', function () {
    centerContent();
});

function centerContent() {
    var container = $('#home');
    var content = $('#main');
    content.css("left", (container.width() - content.width()) / 2);
    content.css("top", ($(window).height() - content.height()) / 2 + 16);
}

// Main
function initScreen(gameData) {
    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    userNumber = gameData.users.length;

    let newDiv = $("<div></div>");
    let newIcon = $("<img />");

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
    $("#infoRound")[0].childNodes[0].id = "roundTitle";

    // Info Group - Round - Title
    $("#roundTitle")[0].innerHTML = `Round ${gameData.round}`;
    $("#roundTitle")[0].classList.add("title");

    // Info Group - Scoreboard
    $("#infoScoreboard").append(newDiv.clone());
    $("#infoScoreboard")[0].childNodes[0].id = "scoreboardBlockGroup";

    // Info Group - Scoreboard - Block
    for (i = 0; i < userNumber; i++) {
        blockGenerator(i, gameData.users[i].name, gameData.users[i].sum);
    }
    // blockGenerator(0, gameData.users[0].name, gameData.users[0].sum);
    // blockGenerator(1, gameData.users[1].name, gameData.users[1].sum);
    // blockGenerator(2, gameData.users[2].name, gameData.users[2].sum);
    // blockGenerator(3, gameData.users[3].name, gameData.users[3].sum);

    // Turn Group
    $("#turnGroup").append(newDiv.clone());
    $("#turnGroup").append(newDiv.clone());
    $("#turnGroup").append(newDiv.clone());
    $("#turnGroup")[0].childNodes[0].id = "turnTitle";
    $("#turnGroup")[0].childNodes[1].id = "choice-a";
    $("#turnGroup")[0].childNodes[2].id = "choice-b";

    // Turn Group - Turn - Title
    $("#turnTitle")[0].innerHTML = `${gameData.whosTurn.name}'s Turn`;
    $("#turnTitle")[0].classList.add("title");

    // Turn Group - Turn - Choice
    let chanceA = gameData.questions[0][0].chance;
    let valueA = gameData.questions[0][0].value;
    let backfireA = -gameData.questions[0][0].backfire;

    let chanceB = gameData.questions[0][1].chance;
    let valueB = gameData.questions[0][1].value;

    let txtPercentageA1 = $("<div></div>").text(`${(100 * chanceA).toFixed(0)}%`);
    let txtPercentageA2 = $("<div></div>").text(`${(100 * (1 - chanceA)).toFixed(0)}%`);
    let txtPercentageB1 = $("<div></div>").text(`${(100 * chanceB).toFixed(0)}%`);
    let txtPercentageB2 = $("<div></div>").text(`${(100 * (1 - chanceB)).toFixed(0)}%`);
    let txtWinA = $("<div></div>").text(`+ ${valueA} power`);
    let txtWinB = $("<div></div>").text(`+ ${valueB} power`);
    let txtLose = $("<div></div>").text(`- ${backfireA} power`);
    let txtNeutral = $("<div></div>").text("Nothing happens");

    // Choice A
    $("#choice-a").append(newIcon.clone());
    $("#choice-a").append(newDiv.clone());

    $("#choice-a")[0].childNodes[0].id = "redPill";
    $("#choice-a")[0].childNodes[0].src = "assets/pill_red.png";
    $("#choice-a")[0].childNodes[0].classList.add("results-a-icon");

    $("#choice-a")[0].childNodes[1].id = "result-a"
    $("#result-a").append(newDiv.clone());
    $("#result-a").append(newDiv.clone());
    $("#result-a")[0].childNodes[0].id = "result-a-1";
    $("#result-a")[0].childNodes[0].classList.add("results-text");
    $("#result-a")[0].childNodes[1].id = "result-a-2";
    $("#result-a")[0].childNodes[1].classList.add("results-text");
    $("#result-a-1").append(txtPercentageA1);
    $("#result-a-1").append(txtWinA);
    $("#result-a-1")[0].childNodes[0].id = "result-a-1-percentage";
    $("#result-a-1")[0].childNodes[1].id = "result-a-1-text";
    $("#result-a-2").append(txtPercentageA2);
    $("#result-a-2").append(txtLose);
    $("#result-a-2")[0].childNodes[0].id = "result-a-2-percentage";
    $("#result-a-2")[0].childNodes[1].id = "result-a-2-text";

    // Choice B
    $("#choice-b").append(newIcon.clone());
    $("#choice-b").append(newDiv.clone());

    $("#choice-b")[0].childNodes[0].id = "bluePill";
    $("#choice-b")[0].childNodes[0].src = "assets/pill.png";
    $("#choice-b")[0].childNodes[0].classList.add("results-b-icon");

    $("#choice-b")[0].childNodes[1].id = "result-b"
    $("#result-b").append(newDiv.clone());
    $("#result-b").append(newDiv.clone());
    $("#result-b")[0].childNodes[0].id = "result-b-1";
    $("#result-b")[0].childNodes[0].classList.add("results-text");
    $("#result-b")[0].childNodes[1].id = "result-b-2";
    $("#result-b")[0].childNodes[1].classList.add("results-text");
    $("#result-b-1").append(txtPercentageB1);
    $("#result-b-1").append(txtWinB);
    $("#result-b-1")[0].childNodes[0].id = "result-b-1-percentage";
    $("#result-b-1")[0].childNodes[1].id = "result-b-1-text";
    $("#result-b-2").append(txtPercentageB2);
    $("#result-b-2").append(txtNeutral);
    $("#result-b-2")[0].childNodes[0].id = "result-b-2-percentage";
    $("#result-b-2")[0].childNodes[1].id = "result-b-2-text";

    $("#main")[0].classList.add("animated", "fadeIn");
    centerContent();
}

function updateScreen(gameData) {

    userNumber = gameData.users.length;

    let chanceA = gameData.questions[0][0].chance;
    let valueA = gameData.questions[0][0].value;
    let backfireA = -gameData.questions[0][0].backfire;

    let chanceB = gameData.questions[0][1].chance;
    let valueB = gameData.questions[0][1].value;

    let txtPercentageA1 = `${(100 * chanceA).toFixed(0)}%`;
    let txtPercentageA2 = `${(100 * (1 - chanceA)).toFixed(0)}%`;
    let txtPercentageB1 = `${(100 * chanceB).toFixed(0)}%`;
    let txtPercentageB2 = `${(100 * (1 - chanceB)).toFixed(0)}%`;
    let txtWinA = `+ ${valueA} power`;
    let txtWinB = `+ ${valueB} power`;
    let txtLose = `- ${backfireA} power`;

    // let scoreA = gameData.users[0].sum;
    // let scoreB = gameData.users[1].sum;
    // let scoreC = gameData.users[2].sum;
    // let scoreD = gameData.users[3].sum;

    hasWon = gameData.lastTurn.hasWin;
    choiceIndex = gameData.lastTurn.which;
    currentPlayer = gameData.whosTurn.name;
    round = gameData.round;

    

    if (hasWon && hasWon !== undefined && lastPlayer != currentPlayer) {
        if (choiceIndex = 0) {
            $("#redPill")[0].src = "assets/correct.png";
            // winSound.play();
        } else if (choiceIndex = 1) {
            $("#bluePill")[0].src = "assets/correct.png";
            // winSound.play();
        }
    } else if (!hasWon && hasWon !== undefined && lastPlayer != currentPlayer) {
        if (choiceIndex = 0) {
            $("#redPill")[0].src = "assets/wrong.png";
        } else if (choiceIndex = 1){
            $("#bluePill")[0].src = "assets/wrong.png";
        }
    }

    setTimeout(function () {
        $("#roundTitle")[0].innerHTML = `Round ${round}`;
        $("#turnTitle")[0].innerHTML = `${currentPlayer}'s Turn`;
        $("#redPill")[0].src = "assets/pill_red.png";
        $("#bluePill")[0].src = "assets/pill.png";

        $("#choice-a")[0].style.borderColor = "white";
        $("#choice-b")[0].style.borderColor = "white";

        for (i = 0; i < userNumber; i++) {
            let score = gameData.users[i].sum;
            $(`#scoreblock${i}Score`)[0].innerHTML = `${score}`;
        }
        $("#result-a-1-percentage")[0].innerHTML = txtPercentageA1;
        $("#result-a-1-text")[0].innerHTML = txtWinA;
        $("#result-a-2-percentage")[0].innerHTML = txtPercentageA2;
        $("#result-a-2-text")[0].innerHTML = txtLose;

        $("#result-b-1-percentage")[0].innerHTML = txtPercentageB1;
        $("#result-b-1-text")[0].innerHTML = txtWinB;
        $("#result-b-2-percentage")[0].innerHTML = txtPercentageB2;
        $("#result-b-2-text")[0].innerHTML = "Nothing happens";
    }, 3000);

    // $("#scoreblock1Score")[0].innerHTML = `${scoreB}`;
    // $("#scoreblock2Score")[0].innerHTML = `${scoreC}`;
    // $("#scoreblock3Score")[0].innerHTML = `${scoreD}`;

    lastPlayer = gameData.whosTurn.name;
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
    let newDiv = $("<div></div>");
    let blockId = `scoreblock${id}`;
    capName = jsUcfirst(name);
    $("#scoreboardBlockGroup").append(newDiv.clone());
    $("#scoreboardBlockGroup")[0].childNodes[`${id}`].id = blockId;

    $(`#${blockId}`).append(newDiv.clone());
    $(`#${blockId}`).append(newDiv.clone());
    $(`#${blockId}`)[0].classList.add("blocks");
    $(`#${blockId}`)[0].childNodes[0].id = `${blockId}Name`;
    $(`#${blockId}`)[0].childNodes[1].id = `${blockId}Score`;

    $(`#${blockId}Name`)[0].classList.add("blockTitle");
    $(`#${blockId}Score`)[0].classList.add("blockText");
    $(`#${blockId}Name`)[0].innerHTML = `${capName}`;
    if (score == 0) {
        $(`#${blockId}Score`)[0].innerHTML = "0";
    } else {
        $(`#${blockId}Score`)[0].innerHTML = `${score}`;
    }

}