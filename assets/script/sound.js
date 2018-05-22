const soundButton = document.getElementById("sound");
const restartButton = document.getElementById("restartButton");
let soundState = "";
let bgm = new Audio('audio/bgm.mp3');

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

function initSound() {
    if(soundButton.getAttribute("title") === "sound") soundState = soundButton.getAttribute("alt");
    restartButton.addEventListener("click", playClick);
    soundButton.addEventListener("click", function () {
        playClick();
        toggleSoundState();
    });

    bgm.volume = 0.3;
    bgm.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    changeSoundStateTo("off")
}

initSound();

