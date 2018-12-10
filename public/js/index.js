let socket = io('/');
let gameData;
let role = "empty";
let nameAndRole = {
    name: "",
    role: "",
    cookie: ""
};
let gameSatus = 0; // 0: Preparing; 1: Started; 2: End
let refresh = 0;

var textField = $("#search")[0];

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
    let decision = {
        who: "",
        choice: 0
    };
    decision.who = gameData.whosTurn.name;

    if (gameData.gameState != "prep") {
        if (nameAndRole.role == "Player") {
            if (nameAndRole.name.toLowerCase() == gameData.whosTurn.name.toLowerCase()) {
                myTurn(gameData.questions);

                // Listen to decisions
                $("#choice-a")[0].addEventListener("click", function () {
                    decision.choice = 1;
                    $("#choice-a")[0].classList.add("choice-a-tick");
                    $("#choice-b")[0].classList.remove("choice-b-tick");
                });

                $("#choice-b")[0].addEventListener("click", function () {
                    decision.choice = 2;
                    $("#choice-b")[0].classList.add("choice-b-tick");
                    $("#choice-a")[0].classList.remove("choice-a-tick");
                });

                // Listen to confirm button
                $("#button-confirm")[0].addEventListener("click", function () {
                    if (decision.choice != 0) {
                        socket.emit("makeChoice", decision);
                        othersTurn();
                    }
                });

                refresh = 1;
            } else if (refresh == 1) {
                othersTurn();
                refresh = 0;
            }
        } else {
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

// Submit Button listener
$("#button-next")[0].addEventListener("click", function () {
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
                var newIcon = $("<img>");
                $("#main").append(newIcon);
                $("#main")[0].firstChild.src = "assets/pill.png";
                $("#main")[0].firstChild.classList.add("image", "animated", "fadeIn");

                var newDiv = $("<div></div>").text("Waiting for the game to start...");
                $("#main").append(newDiv);
                $("#main")[0].childNodes[1].classList.add("description-waiting", "animated", "infinite", "flash", "slower");

                centerContent();
            }, 200);
        }
    }
});

// Role Button listener
$("#button-player")[0].addEventListener("click", function () {
    if (role == "empty" || role == "Audience") {
        $("#button-player").attr("src", "assets/player_tick.png");
        $("#button-player")[0].classList.add("player-tick");
        $("#button-audience")[0].classList.remove("audience-tick");
        $("#button-audience").attr("src", "assets/audience.png");
        role = "Player";
    }
});

$("#button-audience")[0].addEventListener("click", function () {
    if (role == "empty" || role == "Player") {
        $("#button-audience").attr("src", "assets/audience_tick.png");
        $("#button-audience")[0].classList.add("audience-tick");
        $("#button-player")[0].classList.remove("player-tick");
        $("#button-player").attr("src", "assets/player.png");
        role = "Audience";
    }
});

// Make choice at the player's turn
function myTurn(questions) {
    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    // Add choices
    let newDiv = $("<div></div>");
    let newButton = $("<button></button>");

    $("#main").append(newDiv.clone());
    $("#main")[0].childNodes[0].id = "choiceGroup";
    $("#main")[0].childNodes[0].classList.add("choice", "animated", "fadeIn");

    $("#choiceGroup").append(newDiv.clone());
    $("#choiceGroup").append(newDiv.clone());
    $("#choiceGroup")[0].childNodes[0].id = "choice-a";
    $("#choiceGroup")[0].childNodes[0].classList.add("choice-a", "animated", "fadeIn");
    $("#choiceGroup")[0].childNodes[1].id = "choice-b";
    $("#choiceGroup")[0].childNodes[1].classList.add("choice-b", "animated", "fadeIn");

    // Choice A
    let chanceA = questions[0][0].chance;
    let valueA = questions[0][0].value;
    let backfireA = questions[0][0].backfire;

    let txt1 = $("<span></span>").text(`You have ${(100 * chanceA).toFixed(0)}% chance to win ${valueA} with a backfire of ${backfireA}!`);
    $("#choice-a").append(newDiv.clone());
    $("#choice-a")[0].childNodes[0].id = "result-a"
    $("#result-a").append(txt1);

    // Choice B
    let chanceB = questions[0][1].chance;
    let valueB = questions[0][1].value;
    let backfireB = questions[0][1].backfire;

    let txt2 = $("<span></span>").text(`You have ${(100 * chanceB).toFixed(0)}% chance to win ${valueB} with a backfire of ${backfireB}!`);
    $("#choice-b").append(newDiv.clone());
    $("#choice-b")[0].childNodes[0].id = "result-b"
    $("#result-b").append(txt2);

    // Add sumbit button
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
function othersTurn() {
    // Remove old elements
    while ($("#main")[0].firstChild) {
        $("#main")[0].removeChild($("#main")[0].firstChild);
    }

    // Add new elements
    var newIcon = $("<img>");
    $("#main").append(newIcon);
    $("#main")[0].firstChild.src = "assets/pill.png";
    $("#main")[0].firstChild.classList.add("image", "animated", "fadeIn");

    var newDiv = $("<div></div>").text("Stay calm and wait for others...");
    $("#main").append(newDiv);
    $("#main")[0].childNodes[1].classList.add("description-waiting", "animated", "infinite", "flash", "slower");

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