//Role Button listener
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

// Listen to decisions
$("#choice-a")[0].addEventListener("click", function () {
    decision.choice = 0;
    $("#choice-a")[0].classList.add("choice-a-tick");
    $("#choice-b")[0].classList.remove("choice-b-tick");
});

$("#choice-b")[0].addEventListener("click", function () {
    decision.choice = 1;
    $("#choice-b")[0].classList.add("choice-b-tick");
    $("#choice-a")[0].classList.remove("choice-a-tick");
});

// Listen to confirm button
$("#button-confirm")[0].addEventListener("click", function () {
    if (decision.choice != 0) {
        socket.emit("makeChoice", decision);
        console.log("fired!");
        othersTurn();
    }
});

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
            console.log("fired!");
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
            console.log("Here I am!");
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