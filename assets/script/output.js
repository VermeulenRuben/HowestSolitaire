let cardGame = new CardGame();
cardGame.init();



function arrayOutput(element, name) {
    let outputContainer = document.getElementById(name);
    let img = "<img class='card' src='../HowestSolitaire/images/cards/error.png' alt='Card'/>";
    if(element !== undefined){
        img = "<img class='card' src='" + element.imgSrc + "' alt='Card'/>"
    }
    outputContainer.innerHTML = img;
}

function showPopUp(message, defaultMode = true) {
    let body = document.getElementsByTagName("body")[0].innerHTML;
    let popUpOuterHTML =
        '<div id="popUp">' +
        '<div id="popUpContent">' +
        '<span class="close">&times;</span>' +
        '<p>' + message + '</p>' +
        '<button id="restart">Restart</button>'+
        !defaultMode ? '<button id="continue">Continue</button>' : '' +
        '</div>' +
        '</div>';
    document.getElementsByTagName("body")[0].innerHTML = popUpOuterHTML + body;
    document.getElementsByClassName("close")[0].addEventListener("click", closePopUp);
    document.getElementById("restart").addEventListener("click", newGame);
    document.getElementById("continue").addEventListener("click", continueLastGame)
}

function closePopUp(event) {
    document.getElementsByTagName("body")[0].removeChild(document.querySelector('#popUp'))
    eventHandler();
}

function newGame() {
    cardGame = new CardGame();
    cardGame.init();
    updateOutput();
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

    let allGoalCardNumbers = [];
    cardGame.goal.forEach(card => allGoalCardNumbers.push(card.cardnumber));
    allGoalCardNumbers.map(number => number === "k");
    if(allGoalCardNumbers[0] && allGoalCardNumbers[1] &&
        allGoalCardNumbers[2] && allGoalCardNumbers[3])
        showPopUp("Congratulations. You won");

    storeCardGame(cardGame);
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
}

updateOutput();