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
    let newIcon = $("<img>");

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

    let txt1 = $("<span></span>").text(`You have 100% chance to win 20 with a backfire of 10!`);
    $("#choice-a").append(newIcon.clone());
    $("#choice-a").append(newDiv.clone());

    $("#choice-a")[0].childNodes[0].src = "assets/pill_red.png";
    $("#choice-a")[0].childNodes[0].classList.add("results-a-icon");

    $("#choice-a")[0].childNodes[1].id = "result-a"
    $("#result-a").append(txt1);

    

    // Choice B
    // let chanceB = questions[0][1].chance;
    // let valueB = questions[0][1].value;
    // let backfireB = questions[0][1].backfire;

    let txt2 = $("<span></span>").text(`You have 30% chance to win  with a backfire of !`);
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

$("#main")[0].addEventListener("click", function (e) {
    switch (e.target.id) {
        case "choice-a":
            {
                decision.choice = 0;
                $("#choice-a")[0].classList.add("choice-a-tick");
                $("#choice-b")[0].classList.remove("choice-b-tick");
                break;
            }

        case "choice-b":
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
                break;
            }

        default:
            {
                break;
            }

    }


});

myTurn();