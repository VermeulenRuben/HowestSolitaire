const DRIVERS = [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE];
const SCORE_KEY = 'personalBest';

localforage.setDriver(DRIVERS).then(function () {
    console.log("LocalForage: Current driver set to " + localforage.driver() + ".")
});

function setPersonalBest(givenTime) {
    localforage.getItem(SCORE_KEY, function (err, currentPersonalBest) {
        if(currentPersonalBest === null || givenTime < currentPersonalBest) {
            localforage.setItem(SCORE_KEY, givenTime, function () {
                console.log("LocalForage: With driver " + localforage.driver() + " new personal best was set: ", givenTime)
            })
        }
    });
}

function getPersonalBest(event) {
    localforage.getItem(SCORE_KEY, function (err, currentPersonalBest) {
        let message = "";
        if(currentPersonalBest === null){
            message = "You haven't won any games yet";
        }else{
            let sec = currentPersonalBest % 60;
            let min = (currentPersonalBest - sec) / 60;
            message = "Your personal best time is " + (min<10? "0"+min : min) + ":" + (sec<10? "0"+sec : sec);
        }
        showPopUp(event, message);
    });
}