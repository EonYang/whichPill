// Server
let socket = io('/');

let data = {};

socket.on('connect', function () {
    console.log("You are connected: " + socket.id);
});

socket.on('disconncted', function () {
    socket.emit('disconnected', socket.id);
});

// Client
let role = "empty";
let nameAndRole = {
    name: "",
    role: "",
    cookie: ""
};
let gameSatus = 0;

var textField = $("#search")[0];
var textLable = $("label.input__label.input__label--hoshi.input__label--hoshi-color-0")[0];

// Center the main div and set cookies
$(window).on('load', function () {
    centerContent();
    // Generate cookie
    new Fingerprint2().get(function(result, components) {
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
    } else if (role == 0) {
        $("#role")[0].classList.add("input__label--error");
        setTimeout(function () {
            $("#role")[0].classList.remove("input__label--error");
        }, 300);
    } else {
        // Pass name and role value
        nameAndRole.name = $("#input-4").val();
        nameAndRole.role = role;
        socket.emit('setNameAndRole', nameAndRole)
        // Hide buttons and input
        $(".input")[0].classList.add("animated", "fadeOut");
        $(".input")[0].style.animationDuration = "0.2s";
        $(".button")[0].classList.add("animated", "fadeOut");
        $(".button")[0].style.animationDuration = "0.2s";
        $(".description")[0].classList.add("animated", "fadeOut");
        $(".description")[0].style.animationDuration = "0.2s";
        $("#role")[0].classList.add("animated", "fadeOut");
        $("#role")[0].style.animationDuration = "0.2s";
    }
});

// Role Button listener
$("#button-player")[0].addEventListener("click", function () {
    if (role == "empty" || role == "Audience") {
        $("#button-player").attr("src", "assets/player_tick.png");
        $("#button-player")[0].style.borderColor = "#083D77";
        $("#button-player")[0].style.borderWidth = "2px";
        $("#button-audience").attr("src", "assets/audience.png");
        role = "Player";
    }
});

$("#button-audience")[0].addEventListener("click", function () {
    if (role == "empty" || role == "Player") {
        $("#button-audience").attr("src", "assets/audience_tick.png");
        $("#button-player").attr("src", "assets/player.png");
        role = "Audience";
    }
});

// Creating visulization bars
function bars() {

    var hoverHolder = $(".barHolder")[0];

    hoverHolder.addEventListener("mouseover", function (e) {
        if (e.target && e.target.nodeName == "SPAN") {
            console.log("Hovered!")
            $('.desc').css('display', 'block')

            var index = e.target.className.split('--')[1];
            $(".illustrations--header")[0].innerHTML = allMessage.wordData[index].date;
            $(".illustrations--paragraph")[0].innerHTML = `${allMessage.wordData[index].name}, mentioned ${allMessage.word} ${allMessage.wordData[index].wordCount} time(s).`;
        }
    });
    hoverHolder.addEventListener("mouseout", function (e) {
        if (e.target && e.target.nodeName == "SPAN") {
            $('.desc').css('display', 'none')
            $(".illustrations--header")[0].innerHTML = "";
            $(".illustrations--paragraph")[0].innerHTML = "";
        }
    });

    var bars = $(".barHolder")[0];
    var illustrations = $(".illustrationsHolder")[0];


    let wordCount = allMessage.wordData.map(data => data.wordCount)
    wordCount = mapping(wordCount, 300, 40)
    // Create bars
    for (i = 0; i < allMessage.wordData.length; i++) {
        var j = wordCount[i]
        barHolders[i] = document.createElement("span");
        // sheet.insertRule(`.bars--${i} { height: ${j}px;}`, 0);
        sheet.insertRule(`.bars--${i} {height: ${j}px;}`, sheet.cssRules.length);
        barHolders[i].setAttribute("class", `bars bars--${i}`);
        bars.appendChild(barHolders[i]);
    }
}

$('.barHolder').on('mousemove', function (e) {
    if (e.pageX + 20 < ($(window).width()) / 4 * 3) {
        $('.desc').css({
            left: e.pageX + 20,
            top: e.pageY - 100
        });
    } else {
        $('.desc').css({
            left: e.pageX - 300,
            top: e.pageY - 100
        });
    }
});

// Set Cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}