let soundButton;
let restartButton;
let cardGame = new CardGame();
let timeInSec = 0;
let timer = setInterval(addSec, 1000);
let soundState = "";
let bgm = new Audio('audio/bgm.mp3');
cardGame.init();

function playClick() {
    if(soundState === "sound-on") new Audio('audio/fx/click.mp3').play();
}

function changeSoundStateTo(newState) {
    soundState = "sound-" + newState;
    soundButton.setAttribute("alt", soundState);
    soundButton.setAttribute("src", "images/soundState/" + soundState + ".png");
    checkSoundState()
}

function toggleSoundState() {
    if(soundState === "sound-on") changeSoundStateTo("off");
    else if(soundState === "sound-off") changeSoundStateTo("on");
}

function checkSoundState() {
    if(soundState === "sound-on") bgm.play();
    else if(soundState === "sound-off") bgm.pause();
}

function setSoundEvents() {
    soundButton = document.getElementById("sound");
    restartButton = document.getElementById("restartButton");
    soundState = soundButton.getAttribute("alt");
    restartButton.addEventListener("click", playClick);
    soundButton.addEventListener("click", function () {
        playClick();
        toggleSoundState();
    });
}

function initSound() {
    setSoundEvents();
    bgm.volume = 0.3;
    bgm.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    changeSoundStateTo("off")
}

function addSec() {
    timeInSec++;
    let sec = timeInSec % 60;
    let min = (timeInSec - sec) / 60;
    document.getElementById("timer").innerHTML = (min<10? "0"+min : min) + ":" + (sec<10? "0"+sec : sec);
}

function arrayOutput(element, name) {
    let outputContainer = document.getElementById(name);
    let img = "<img class='card' src='../HowestSolitaire/images/cards/error.png' alt='Card'/>";
    if(element !== undefined){
        img = "<img class='card' src='" + element.imgSrc + "' alt='Card'/>"
    }
    outputContainer.innerHTML = img;
}

function showPopUp(event, message = "Do you want to restart your game?") {
    let isPersonalBestEvent = event !== null && event.target.id !== "personalBest";
    let popUpOuterHTML =
        '<div id="popUp">' +
        '<div id="popUpContent">' +
        '<span class="close">&times;</span>' +
        '<p>' + message + '</p>';
    if(isPersonalBestEvent) popUpOuterHTML += '<button class="restart">Restart</button>';
    popUpOuterHTML += '</div></div>';
    document.getElementsByTagName("body")[0].innerHTML += popUpOuterHTML;
    document.getElementsByClassName("close")[0].addEventListener("click", closePopUp);
    if(isPersonalBestEvent) document.getElementsByClassName("restart")[0].addEventListener("click", restart);
}

function closePopUp(event) {
    document.getElementsByTagName("body")[0].removeChild(document.querySelector('#popUp'));
    eventHandler();
}

function restart() {
    cardGame = new CardGame();
    timeInSec = 0;
    clearTimeout(timer);
    timer = setInterval(addSec, 1000);
    cardGame.init();
    updateOutput();
    setSoundEvents();
    closePopUp();
}

function arrayClicked(e) {
    switch (e.currentTarget.id){
        case "given":
            cardGame.takeFromGiven();
            updateOutput();
            break;
        case "deck":
            cardGame.deckHandler();
            updateOutput();
            break;
        default:
            break;
    }

    if(this.parentElement.parentElement.id === "table"){
        let cardIndex, rowIndex;
        for (let i = 0; i < this.parentElement.parentElement.children.length; i++){
            if(this.parentElement.id === "row"+i) rowIndex = i;
            for(let j = 0; j < this.parentElement.children.length; j++){
                if(this.getAttribute("src") === this.parentElement.children[j].getAttribute("src") ) cardIndex = j;
            }
        }
        cardGame.takenFromTable(rowIndex, cardIndex);
        updateOutput();
    }

}

function updateOutput() {
    arrayOutput(cardGame.deck[0], "deck");
    arrayOutput(cardGame.given[getIndexOfLastFilledItemFromArray(cardGame.given)], "given");
    let elementInnerHTML = "";
    cardGame.table.forEach(function (array, index) {
        elementInnerHTML += "<div id='row" + index + "'>";
        // I did not use forEach method because I wanted all the elements including the empty ones
        let emptyCounter = 0;
        for(let i = 0; i < array.length; i++){
            if(isEmpty(array[i])) emptyCounter++;
        }
        if(emptyCounter !== array.length){
            array.forEach(function (element, index) {
                elementInnerHTML += "<img class='card' src='" + element.imgSrc + "' alt='Card'/>";
            });
        } else {
            elementInnerHTML += "<img class='card' src='../HowestSolitaire/images/cards/error.png' alt='Card'/>"
        }
        elementInnerHTML += "</div>"
    });
    document.getElementById('table').innerHTML = elementInnerHTML;
    elementInnerHTML = "";
    cardGame.goal.forEach(function (card, index) {
        elementInnerHTML += "<div id='set" + index + "'><img src='" + card.imgSrc + "' alt='Card'/></div>"
    });
    document.getElementById('goal').innerHTML = elementInnerHTML;

    let isKing = [];
    cardGame.goal.forEach(card => isKing.push(card.cardnumber === "k"));
    if(isKing[0]&& isKing[1] && isKing[2] && isKing[3]) {
        showPopUp(null, "Congratulations. You won. Do you want to play another round?");
        clearTimeout(timer);
        setPersonalBest(timeInSec);
    }
    eventHandler();
}

function eventHandler() {
    document.getElementById("deck").addEventListener("click", arrayClicked);
    document.getElementById("given").addEventListener("click",arrayClicked);
    let rows = document.getElementById("table").children;
    for (let i = 0; i < rows.length; i++){
        let cardsInRow = rows[i].children;
        for(let j = 0; j < cardsInRow.length; j++){
            cardsInRow[j].addEventListener("click", arrayClicked)
        }
    }
    document.getElementById("restartButton").addEventListener("click", showPopUp);
    document.getElementById("personalBest").addEventListener("click", getPersonalBest)
}

screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
updateOutput();
initSound();