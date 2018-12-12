let socket = io('/');
let gameData;
let role = "empty";
let nameAndRole = {
    name: "",
    role: "",
    cookie: ""
};
let gameSatus = 0; // 0: Preparing; 1: Started; 2: End
let playerRefresh = 1;
let endGameRefresh = 1;
let decision = {
    who: "",
    choice: 2
};

let textField = $("#search")[0];

// Server
socket.on('connect', function () {
    console.log("You are connected: " + socket.id);
});

socket.on('disconncted', function () {
    socket.emit('disconnected', socket.id);
});

socket.on('startGame', function () {
    console.log('game started');
});

socket.on('gameState', function (data) {
    gameData = data;

    decision.who = gameData.whosTurn.name;

    if (gameData.gameState == "inProgress") {
        if (nameAndRole.role == "Player") {
            if (nameAndRole.name.toLowerCase() == gameData.whosTurn.name.toLowerCase() && playerRefresh == 1) {
                if (gameData.whosTurn.name != gameData.lastTurn.name) {
                    myTurn(gameData.questions);
                }
                playerRefresh = 0;
            } else if (nameAndRole.name.toLowerCase() != gameData.whosTurn.name.toLowerCase() && playerRefresh == 0) {
                othersTurn(gameData.whosTurn.name);
                playerRefresh = 1;
            } else if (nameAndRole.name.toLowerCase() != gameData.whosTurn.name.toLowerCase() && playerRefresh == 1) {
                othersTurnRefreshName(gameData.whosTurn.name);
            }
        } else if (nameAndRole.role == "Audience") {
            myComment();
            $("#button-send")[0].addEventListener("click", function () {
                if ($("#input-4").val().trim().length === 0) {
                    textField.classList.add("input__label--error");
                    setTimeout(function () {
                        textField.classList.remove("input__label--error");
                    }, 300);
                } else {
                    let chat = $("#input-4").val();
                    socket.emit('sendChat', chat);
                }
            });
        }
    } else if (gameData.gameState == "ended" && endGameRefresh == 1) {
        endGame(gameData);
        endGameRefresh = 0;
    }
    console.log(data);
});

// Client

// Center the main div and set cookies
$(window).on('load', function () {
    centerContent();
    // Generate cookie
    new Fingerprint2().get(function (result, components) {
        nameAndRole.cookie = result;
    });
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

// Make choice at the player's turn
function myTurn(questions) {
    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    // Add choices
    let newDiv = $("<div></div>");
    let newButton = $("<button></button>");
    let newIcon = $("<img />");

    $("#main").append(newDiv.clone());
    $("#main")[0].childNodes[0].id = "choiceGroup";
    $("#main")[0].childNodes[0].classList.add("choice", "animated", "fadeIn");

    $("#choiceGroup").append(newDiv.clone());
    $("#choiceGroup").append(newDiv.clone());
    $("#choiceGroup")[0].childNodes[0].id = "choice-a";
    $("#choiceGroup")[0].childNodes[0].classList.add("choice-a", "animated", "fadeIn");
    $("#choiceGroup")[0].childNodes[1].id = "choice-b";
    $("#choiceGroup")[0].childNodes[1].classList.add("choice-b", "animated", "fadeIn");

    let chanceA = questions[0][0].chance;
    let valueA = questions[0][0].value;
    let backfireA = -questions[0][0].backfire;

    let chanceB = questions[0][1].chance;
    let valueB = questions[0][1].value;
    // let backfireB = questions[0][1].backfire;

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

    // let txt1 = $("<span></span>").text(`You have ${(100 * chanceA).toFixed(0)}% chance to win ${valueA} with a backfire of ${backfireA}!`);
    // $("#choice-a").append(newDiv.clone());
    // $("#choice-a")[0].childNodes[0].id = "result-a"
    // $("#result-a").append(txt1);

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

    // let txt2 = $("<span></span>").text(`You have ${(100 * chanceB).toFixed(0)}% chance to win ${valueB} with a backfire of ${backfireB}!`);
    // $("#choice-b").append(newDiv.clone());
    // $("#choice-b")[0].childNodes[0].id = "result-b"
    // $("#result-b").append(txt2);

    // // Add sumbit button
    $("#choiceGroup").append(newDiv.clone());
    $("#choiceGroup")[0].childNodes[2].classList.add("button", "animated", "fadeIn");
    $("#choiceGroup")[0].childNodes[2].id = "buttonTurn";

    $("#buttonTurn").append(newButton.clone());
    $("#choiceGroup")[0].childNodes[2].firstChild.id = "button-confirm";
    $("#button-confirm").append("Confirm");
    $("#button-confirm")[0].classList.add("button", "button-confirm", "animated", "fadeIn");

    centerContent();
}

// Wait at other players' turn
function othersTurn(whosTurn) {
    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    // Add new elements
    var newIcon = $("<img />");
    $("#main").append(newIcon);
    $("#main")[0].firstChild.src = "assets/hourglass.png";
    $("#main")[0].firstChild.classList.add("image", "animated", "fadeIn");

    var newDiv = $("<div></div>").text(`Stay calm and wait for ${whosTurn}...`);
    $("#main").append(newDiv);
    $("#main")[0].childNodes[1].classList.add("description-waiting", "animated", "infinite", "flash", "slower");

    centerContent();
}

function othersTurnRefreshName(whosTurn) {
    $(".description-waiting")[0].innerHTML = `Stay calm and wait for ${whosTurn}...`;
}

function endGame(data) {
    let maxSum = data.users[0].sum;
    let maxIndex;
    for (i = 0; i < 4; i++) {
        if (data.users[i].sum > maxSum) {
            maxIndex = i;
        }
    }

    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    // Add new elements
    var newIcon = $("<img />");
    $("#main").append(newIcon);
    $("#main")[0].firstChild.src = "assets/pill.png";
    $("#main")[0].firstChild.classList.add("image", "animated", "fadeIn");

    var newDiv = $("<div></div>").text(`Game Ended! ${data.users[maxIndex].name} is the winner with a total strength of ${data.users[maxIndex].sum}!`);
    $("#main").append(newDiv);
    $("#main")[0].childNodes[1].classList.add("description", "animated", "fadeIn", "slow");

    centerContent();
}

function myComment() {
    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    // Add input
    let newDiv = $("<div></div>");
    let newSpan = $("<span></span>");
    let newButton = $("<button></button>");
    let newInput = $("<input></input>");
    let newLabel = $("<label></label>");
    var txt = $("<div></div>").text("Say something nice to the players! Or not...");

    $("#main").append(txt);
    $("#main").append(newDiv.clone());
    $("#main").append(newDiv.clone());

    $("#main")[0].childNodes[0].classList.add("description-chat");
    $("#main")[0].childNodes[1].id = "search";
    $("#main")[0].childNodes[2].classList.add("button");

    $("#search").append(newSpan.clone());
    $("#search")[0].firstChild.classList.add("input", "input--hoshi");
    $(".input").append(newInput.clone());
    $(".input").append(newLabel.clone());
    $(".input")[0].childNodes[0].type = "text";
    $(".input")[0].childNodes[0].id = "input-4";
    $(".input")[0].childNodes[0].htmlFor = "input-4";
    $(".input")[0].childNodes[0].classList.add("input__field", "input__field--hoshi");
    $(".input")[0].childNodes[1].classList.add("input__label", "input__label--hoshi", "input__label--hoshi-color-0");

    $(".button").append(newButton.clone());
    $(".button")[0].firstChild.innerHTML = "Send";
    $(".button")[0].firstChild.id = "button-send";
    $(".button")[0].firstChild.type = "button";
    $(".button")[0].firstChild.classList.add("button", "button--send");

    centerContent();
}

$("#main")[0].addEventListener("click", function (e) {
    switch (e.target.id) {
        case "choice-a":
        case "redPill":
        case "result-a": 
        case "result-a-1": 
        case "result-a-2": 
        case "result-a-1-percentage": 
        case "result-a-1-text": 
        case "result-a-2-percentage": 
        case "result-a-2-text": 
            {
                decision.choice = 0;
                $("#choice-a")[0].classList.add("choice-a-tick");
                $("#choice-b")[0].classList.remove("choice-b-tick");
                break;
            }

        case "choice-b":
        case "bluePill":
        case "result-b": 
        case "result-b-1": 
        case "result-b-2": 
        case "result-b-1-percentage": 
        case "result-b-1-text": 
        case "result-b-2-percentage": 
        case "result-b-2-text":
            {
                decision.choice = 1;
                $("#choice-b")[0].classList.add("choice-b-tick");
                $("#choice-a")[0].classList.remove("choice-a-tick");
                break;
            }

        case "button-confirm":
            {
                if (decision.choice != 2) {
                    socket.emit("makeChoice", decision);

                    othersTurn();
                }
                break;
            }

        case "button-player":
            {
                if (role == "empty" || role == "Audience") {
                    $("#button-player").attr("src", "assets/player_tick.png");
                    $("#button-player")[0].classList.add("player-tick");
                    $("#button-audience")[0].classList.remove("audience-tick");
                    $("#button-audience").attr("src", "assets/audience.png");
                    role = "Player";
                }
                break;
            }

        case "button-audience":
            {
                if (role == "empty" || role == "Player") {
                    $("#button-audience").attr("src", "assets/audience_tick.png");
                    $("#button-audience")[0].classList.add("audience-tick");
                    $("#button-player")[0].classList.remove("player-tick");
                    $("#button-player").attr("src", "assets/player.png");
                    role = "Audience";
                }
                break;
            }

        case "button-next":
            {
                if ($("#input-4").val().trim().length === 0) {
                    textField.classList.add("input__label--error");
                    setTimeout(function () {
                        textField.classList.remove("input__label--error");
                    }, 300);
                } else if (role == "empty") {
                    $("#role")[0].classList.add("input__label--error");
                    setTimeout(function () {
                        $("#role")[0].classList.remove("input__label--error");
                    }, 300);
                } else {
                    // Pass name and role value
                    nameAndRole.name = $("#input-4").val();
                    nameAndRole.role = role;
                    socket.emit('setNameAndRole', nameAndRole);

                    // Hide buttons and input
                    $(".input")[0].classList.add("animated", "fadeOut");
                    $(".input")[0].style.animationDuration = "0.2s";
                    $(".button")[0].classList.add("animated", "fadeOut");
                    $(".button")[0].style.animationDuration = "0.2s";
                    $(".description")[0].classList.add("animated", "fadeOut");
                    $(".description")[0].style.animationDuration = "0.2s";
                    $("#role")[0].classList.add("animated", "fadeOut");
                    $("#role")[0].style.animationDuration = "0.2s";

                    // Remove old elements
                    setTimeout(function () {
                        while ($("#main")[0].firstChild) {
                            $("#main")[0].removeChild($("#main")[0].firstChild);
                        }
                    }, 200);

                    // Wait for the game to start
                    if (gameSatus == 0) {
                        setTimeout(function () {
                            // Add new elements
                            var newIcon = $("<img />");
                            $("#main").append(newIcon);
                            $("#main")[0].firstChild.src = "assets/hourglass.png";
                            $("#main")[0].firstChild.classList.add("image", "animated", "fadeIn");

                            var newDiv = $("<div></div>").text("Waiting for the game to start...");
                            $("#main").append(newDiv);
                            $("#main")[0].childNodes[1].classList.add("description-waiting", "animated", "infinite", "flash", "slower");

                            centerContent();
                        }, 200);
                    }
                }
                break;
            }

        default:
            {
                break;
            }

    }


});