const DRIVERS = [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE];
const GAME_KEY = 'lastCardGame';


localforage.setDriver(DRIVERS).then(function () {
    console.log("LocalForage: Current driver set to " + localforage.driver() + ".")
});

function storeCardGame(cardGame) {
    localforage.setItem(GAME_KEY, cardGame, function () {
        console.log("LocalForage: With driver " + localforage.driver() + " stored card game on key ")
    })
}

function getLastCardGame() {
    return new Promise((fulfil, reject) => {
        localforage.getItem(GAME_KEY, function (err, cardGame) {
            console.log("LocalForage: Reading of " + GAME_KEY + " was successful", cardGame);
            if(err) reject(err);
            else fulfil(cardGame);
        })
    });
}