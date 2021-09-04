"use strict";


//////////////// Classes /////////////////

class Card {
    constructor(id, url) {
        this._id = id;
        this._url = url;
    }
    get id() {
        return this._id;
    }
    set id(x) {
        this._id = x;
    }
    get url() {
        return this._url;
    }
}

class Player {
    constructor(id, color) {
        this._id = id;
        this._points = 0;
        this._color = color;
    }
    get points() {
        return this._points;
    }
    set points(x) {
        this._points = x;
    }
    increase_points() {
        this._points++;
    }
    get color() {
        return this._color;
    }
}


///////////////////// Variables /////////////////////

var pictures = [];
var number_pictures = 12;
var _flipCard = function (ev) { flipCard(ev); }
var activated_cards = 0; // 0 cards flipped
var first_card; // id of the first card that the current player flipped
var player_number = 1;
var active_player = 1;
var pairs_left = number_pictures; // all cards left on board
var size = 200; // card size


/////////////////// Functions /////////////////////

/* is called when user changes the number of used pictures and clicks button */
function setPictureNumber() {
    number_pictures = Number(document.getElementById("picture_number").value);
    prepareGame();
}

/* adds a second player to the game */
function addPlayer() {
    player2 = new Player(2, "deepskyblue");
    document.getElementById("p2").style.color = player2.color;
    player_number = 2;
    document.getElementById("player2").style.display = "block";
    document.getElementById("addPlayer").style.display = "none";
    prepareGame();
}

/* used by prepareGame, randomizes the order of the memory cards */
function randomize(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let k = array[i];
        array[i] = array[j];
        array[j] = k;
    }
}

/* lays the memory cards out in randomized order */
function prepareGame() {

    /* reset variables */
    pictures = [];
    document.getElementById("pictures_container").innerHTML = "";
    activated_cards = 0;
    first_card;
    active_player = 1;
    if (player_number == 1) {
        player1.points = 0;
    } else {
        player1.points = 0;
        player2.points = 0;
    }
    pairs_left = number_pictures;
    document.getElementById("points_p1").innerHTML = 0;
    document.getElementById("points_p2").innerHTML = 0;

    /* with multiple player show who's turn it is in, player1 begins */
    if (player_number > 1) {
        document.getElementById("footer").style.display = "block";
        document.getElementById("footer").style.backgroundColor = player1.color;
        document.getElementById("footer").innerHTML = "It's Player 1's turn";
    }

    /* fills array pictures with urls to the pictures, each picture is used twice */
    for (var i = 0; i < number_pictures; i++) {
        pictures[i] = new Card(i, "./pictures/" + i + ".jpg");
        pictures[number_pictures + i] = new Card(number_pictures + i, "./pictures/" + i + ".jpg", false, true);
    }

    randomize(pictures);

    /* create the cards and display their backside*/
    for (var i = 0; i < (number_pictures * 2); i++) {
        var url = "backside.jpg";
        let card = document.createElement("div");
        card.id = pictures[i].id;
        card.className = "card";
        card.style.width = "" + size + "px";
        card.style.height = "" + size + "px";
        card.style.backgroundImage = "url(" + url + ")";
        card.addEventListener("click", _flipCard);
        document.getElementById("pictures_container").appendChild(card);
    }
}

/* changes player points and removes matching pair from board */
function matchingPair(second_card) {
    if (player_number == 1) {
        // give player a point for finding a pair
        player1.increase_points();
        document.getElementById("points_p1").innerHTML = player1.points;
        // make the cards of the found pair invisible and unclickable
        document.getElementById(second_card).style.opacity = 0;
        document.getElementById(first_card).style.opacity = 0;
        document.getElementById(second_card).style.pointerEvents = 'none';
        document.getElementById(first_card).style.pointerEvents = 'none';
        console.log("Pair found: 1:   " + first_card + "     2:    " + second_card);
        // decrease the number of pairs left on the board
        pairs_left--;
    } else if (player_number == 2) {
        // depending on which player's turn it is, give them a point for finding a pair
        if (active_player == 1) {
            player1.increase_points();
            document.getElementById("points_p1").innerHTML = player1.points;
        }
        else if (active_player == 2) {
            player2.increase_points();
            document.getElementById("points_p2").innerHTML = player2.points;
        }
        // make the cards of the found pair invisible and unclickable
        document.getElementById(second_card).style.opacity = 0;
        document.getElementById(first_card).style.opacity = 0;
        document.getElementById(second_card).style.pointerEvents = 'none';
        document.getElementById(first_card).style.pointerEvents = 'none';
        // decrease the number of pairs left on the board
        pairs_left--;
    }
    activated_cards -= 2;
    finishGame();
}

/* changes active player and flips cards to their backside */ 
function noMatch(second_card) {
    if (player_number == 1) {
        // flip the cards back the their backside
        document.getElementById(second_card).style.backgroundImage = "url('backside.jpg')";
        document.getElementById(first_card).style.backgroundImage = "url('backside.jpg')";
    } else if (player_number == 2) {
        // if a pair was not found, change the active player
        if (active_player == 1) {
            alert("It's Player 2's turn");
            active_player++;
            document.getElementById("footer").style.backgroundColor = player2.color;
            document.getElementById("footer").innerHTML = "It's Player 2's turn";
        }
        else if (active_player == 2) {
            alert("It's Player 1's turn");
            active_player--;
            document.getElementById("footer").style.backgroundColor = player1.color;
            document.getElementById("footer").innerHTML = "It's Player 1's turn";
        }
        // flip the cards the their backside
        document.getElementById(second_card).style.backgroundImage = "url('backside.jpg')";
        document.getElementById(first_card).style.backgroundImage = "url('backside.jpg')";
    }
    activated_cards -= 2;
    finishGame();
}

/* gives out who has won */
function finishGame() {
    if (player_number == 2)  {
        // if board is empty give out who has won
        if (pairs_left == 0) {
            if (player1.points > player2.points) alert("Player 1 has won");
            else if (player1.points == player2.points) alert("It's a tie");
            else alert("Player 2 has won");
        }
    }
}

/* handles what happens when a player flips a card*/
function flipCard(ev) {
    var id = ev.target.id;
    // if player clicks on same card twice don't register the second click, do nothing
    if (first_card == id) { return;}
    var url = pictures[id].url;
    // display picture of card instead of backside
    document.getElementById(id).style.backgroundImage = "url('" + url + "')";
    activated_cards++;
    // if player has only one card flipped, remember the id but do nothing else
    if (activated_cards == 1) {
        first_card = id;
    }
    // if player has two cards flipped
    var timeout = 1000;
    var second_card = id;
    if (activated_cards == 2) {
        // check if pictures on the card match
        // disable click-event for a time, so that player can't flip a third card while two are already flipped
        // also so that player has time to view the second card they flipped
        if (pictures[first_card].url == pictures[second_card].url) {
            disable_flipCard(timeout);
            setTimeout(function () { matchingPair(second_card) }, timeout);
        } else {
            disable_flipCard(timeout);
            setTimeout(function () { noMatch(second_card) }, timeout);
        }
    }
}

/* disables the function flipCard for all cards for time given in the parameter, then enables it again*/
function disable_flipCard(timeout) {
    for (var i = 0; i < (number_pictures * 2); i++) {
        document.getElementById(i).removeEventListener("click", _flipCard);
    }
    setTimeout(enable_flipCard, timeout);
}

/* enables the function flipCard for all cards */
function enable_flipCard(timeout) {
    for (var i = 0; i < (number_pictures * 2); i++) {
        document.getElementById(i).addEventListener("click", _flipCard);
    }
}

/* increases size of memory cards */
function increaseSize() {
    size = size + 50;
    for (var i = 0; i < pictures.length; i++) {
        document.getElementById(i).style.width = size + "px";
        document.getElementById(i).style.height = size + "px";
    }
}

/* decreases size of memory cards */
function decreaseSize() {
    size = size - 50;
    for (var i = 0; i < pictures.length; i++) {
        document.getElementById(i).style.width = size + "px";
        document.getElementById(i).style.height = size + "px";
    }
}


/////////////////////// START ///////////////////////

// create Players
let player1 = new Player(1, "orangered");
document.getElementById("p1").style.color = player1.color;
let player2 = 0;

/* player 2 and text showing who's turn it is is hidden until user clicks on 'Add Player' button */
document.getElementById("player2").style.display = "none";
document.getElementById("footer").style.display = "none";

prepareGame();
