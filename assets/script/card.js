function isEmpty(element) {
    return element === undefined || element === null
}

function clearElementOfArrayWithIndexOf(array, index, chainLength = 1) {
    let len = array.length;
    let newArray = new Array(len);
    array.splice(index, chainLength);
    array.forEach(function (element, index) {
        newArray[index] = element
    });
    return newArray
}

function getIndexOfLastFilledItemFromArray(array) {
    for (let i = array.length; i >= 0; i--) {
        if (array[i] !== null && array[i] !== undefined) {
            return i;
        }
    }
    return "empty"
}

function Card(category, cardNumber) {
    this.category = category;
    this.cardnumber = cardNumber;
    if (this.category === "database" || this.category === "social") this.color = "black";
    if (this.category === "java" || this.category === "bee") this.color = "red";
    this.showBack = true;
    this.imgSrc = this.setCardIMGPath()
}

Card.prototype.setCardIMGPath = function () {
    if (!this.showBack) return "images/cards/" + this.category + "/" + this.cardnumber + ".png";
    else return "images/cards/back.png"
};
Card.prototype.flip = function () {
    this.showBack = !this.showBack;
    this.imgSrc = this.setCardIMGPath();
};
Card.prototype.toString = function () {
    let isTurned = (this.showBack) ? "Yes" : "No";
    return "Cardset: " + this.category + " Number: " + this.cardnumber + " Turned: " + isTurned;
};

function CardGame() {
    this.goal = new Array(4);
    this.deck = new Array(24);
    this.given = new Array(24);
    this.table = null;
    this.takenFromTableCounter = 1;
}

CardGame.prototype.refreshDeck = function () {
    this.given.forEach(card => {if(!isEmpty(card))card.flip()});
    this.deck = this.given;
    this.given = new Array(24);
};

CardGame.prototype.takeFromDeck = function (taken) {
    if (!(isEmpty(taken))) {
        taken.flip();
        for (let i = 0; i < this.deck.length - 1; i++) {
            this.deck[i] = this.deck[i + 1]
        }
        this.deck[this.deck.length - 1] = undefined;
        let next = getIndexOfLastFilledItemFromArray(this.given);
        if (next === "empty") next = 0;
        else next++;
        this.given[next] = taken;
    }
};

CardGame.prototype.deckHandler = function () {
    let lastItem = this.given[this.given.length - this.takenFromTableCounter];
    if (!(isEmpty(lastItem))) this.refreshDeck();
    this.takeFromDeck(this.deck[0]);
};

CardGame.prototype.findNeighbours = function (card) {
    let cardNumbers = ["k", "q", "j", 10, 9, 8, 7, 6, 5, 4, 3, 2, "a"];
    for (let i = 0; i < cardNumbers.length; i++) {
        if (cardNumbers[i] === card.cardnumber) return {predecessor: cardNumbers[i - 1], successor: cardNumbers[i + 1]};
    }
};

CardGame.prototype.takenFromTable =  function (rowIndex, cardIndex) {
    let taken = this.table[rowIndex][cardIndex];
    if(this.table[rowIndex][getIndexOfLastFilledItemFromArray(this.table[rowIndex])] === taken){
        let hasPosition = this.findAPosition(taken);
        if(hasPosition) {
            if(!taken.showBack && !(isEmpty(this.table[rowIndex][cardIndex-1])) && this.table[rowIndex][cardIndex - 1].showBack)
                this.table[rowIndex][cardIndex-1].flip();
            this.table[rowIndex] = clearElementOfArrayWithIndexOf(this.table[rowIndex], cardIndex)
        }
    }else if(!taken.showBack){
        let takenChain = [];
        for (let i = cardIndex;  i < this.table[rowIndex].length; i++){
            if(!isEmpty(this.table[rowIndex][i])) takenChain.push(this.table[rowIndex][i])
        }
        let hasPosition = this.findAPosition(takenChain);
        if(hasPosition){
            if(!taken.showBack && !(isEmpty(this.table[rowIndex][cardIndex-1])) && this.table[rowIndex][cardIndex - 1].showBack)
                this.table[rowIndex][cardIndex-1].flip();
            for(let i = cardIndex; i < this.table[rowIndex].length; i++){
                this.table[rowIndex] = clearElementOfArrayWithIndexOf(this.table[rowIndex], cardIndex, takenChain.length);
            }
        }
    }
};

CardGame.prototype.takeFromGiven = function () {
    let taken = this.given[getIndexOfLastFilledItemFromArray(this.given)];
    let hasPosition = false;
    if (!(isEmpty(taken))) hasPosition = this.findAPosition(taken, true);
    if (hasPosition) this.given[getIndexOfLastFilledItemFromArray(this.given)] = undefined;
};

CardGame.prototype.findAPosition = function (taken, isFromGiven = false) {
    if(typeof taken[0] !== "object") {
        let oppositeColor = (taken.color === "red") ? "black" : "red";
        let neighbours = this.findNeighbours(taken);

        for (let goalCardIndex = 0; goalCardIndex < this.goal.length; goalCardIndex++) {
            let goalCard = this.goal[goalCardIndex];

            if (((isEmpty(goalCard)) && taken.cardnumber === "a") ||
                (!(isEmpty(goalCard)) && goalCard.cardnumber === neighbours.successor && goalCard.category === taken.category)
            ) {
                this.goal[goalCardIndex] = taken;
                if (isFromGiven) this.takenFromTableCounter++;
                return true;
            }
        }


        for (let rowIndex = 0; rowIndex < this.table.length; rowIndex++) {
            let row = this.table[rowIndex];
            let lastInRow = row[getIndexOfLastFilledItemFromArray(row)];
            if (lastInRow === undefined) {
                if (taken.cardnumber === "k") {
                    row[0] = taken;
                    if (isFromGiven) this.takenFromTableCounter++;
                    return true;
                }
            } else if (lastInRow.cardnumber === neighbours.predecessor && lastInRow.color === oppositeColor) {
                row[getIndexOfLastFilledItemFromArray(row) + 1] = taken;
                if (isFromGiven) this.takenFromTableCounter++;
                return true;
            }
        }
    }else{
        let oppositeColor = (taken[0].color === "red") ? "black" : "red";
        let neighbours = this.findNeighbours(taken[0]);

        for (let rowIndex = 0; rowIndex < this.table.length; rowIndex++) {
            let row = this.table[rowIndex];
            let lastInRow = row[getIndexOfLastFilledItemFromArray(row)];
            if (lastInRow === undefined) {
                if (taken[0].cardnumber === "k") {
                    for (let i = 0; i < row.length; i++) {
                        if(taken[i] !== undefined)row[i] = taken[i]
                    }
                    return true;
                }
            } else if (lastInRow.cardnumber === neighbours.predecessor && lastInRow.color === oppositeColor) {
                let chainIndex = 0;
                for(let i = getIndexOfLastFilledItemFromArray(row) + 1; chainIndex < taken.length; i++){
                    row[i] = taken[chainIndex];
                    chainIndex++;
                }
                return true;
            }
        }
    }
};

CardGame.prototype.init = function () {
    let setOfCards = new Array(52);
    let categories = ["bee", "database", "social", "java"];
    let specialCards = ["k", "q", "j", "a"];
    let setId = 0;

    categories.forEach(category => {
        for (let i = 2; i < 11; i++) {
            setOfCards[setId] = new Card(category, i);
            setId++;
        }
        specialCards.forEach(specialCard => {
            setOfCards[setId] = new Card(category, specialCard);
            setId++;
        })
    });

    let newTable = new Array(7);
    for (let rowIndex = 0; rowIndex < newTable.length; rowIndex++) {
        let newRow = new Array(13);
        for (let cardIndex = 0; cardIndex < newRow.length; cardIndex++) {
            if (rowIndex >= cardIndex) {
                let randomNumber = 0;
                do {
                    randomNumber = Math.floor((Math.random() * 51));
                } while (setOfCards[randomNumber] === undefined);

                newRow[cardIndex] = setOfCards[randomNumber];
                if (rowIndex === cardIndex) newRow[cardIndex].flip();
                setOfCards[randomNumber] = undefined;
            }

        }
        newTable[rowIndex] = newRow;
    }
    this.table = newTable;


    let j = 0;
    setOfCards.forEach(card => {
        if (card !== undefined) {
            this.deck[j] = card;
            j++;
        }
    });
    for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
};

