cardGame = new CardGame();
cardGame.init();

function arrayOutput(element, name) {
    let outputContainer = document.getElementById(name);
    let img = "<img class='card' src='../HowestSolitaire/images/cards/error.png' alt='Card'/>"
    if(element !== undefined){
        img = "<img class='card' src='" + element.imgSrc + "' alt='Card'/>"
    }
    outputContainer.innerHTML = img;
}

function arrayClicked(e) {
    switch (e.currentTarget.id){
        case "given":
            cardGame.takeFromGiven();
            console.log(cardGame.goal);
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
    console.log(cardGame.takenFromTableCounter)
}

function updateOutput() {
    arrayOutput(cardGame.deck[0], "deck");
    arrayOutput(cardGame.given[getIndexOfLastFilledItemFromArray(cardGame.given)], "given");
    let elementInnerHTML = "";
    cardGame.table.forEach(function (array, index) {
        elementInnerHTML += "<div id='row" + index + "'>";
        array.forEach(function (element) {
            elementInnerHTML += "<img class='card' src='" + element.imgSrc + "' alt='Card'/>";
        });
        elementInnerHTML += "</div>"
    });
    document.getElementById('table').innerHTML = elementInnerHTML;
    elementInnerHTML = "";
    cardGame.goal.forEach(function (card, index) {
        elementInnerHTML += "<div id='set" + index + "'><img src='" + card.imgSrc + "' alt='Card'/></div>"
    });
    document.getElementById('goal').innerHTML = elementInnerHTML;
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

