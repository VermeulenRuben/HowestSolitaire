const soundHTMLCollection = document.getElementById("sound").getElementsByTagName("img");
let soundState = "";
let bgm = new Audio('audio/bgm.mp3');

function playClick() {
    if(soundState === "sound-on") new Audio('audio/fx/click.mp3').play();
}

function changeSoundStateTo(newState) {
    soundState = "sound-" + newState;
    for(let i = 0; i < soundHTMLCollection.length; i++) {
        if(soundHTMLCollection[i].getAttribute("title") === "sound") {
            soundHTMLCollection[i].setAttribute("alt", soundState);
            soundHTMLCollection[i].setAttribute("src", "images/soundState/" + soundState + ".png");
        }
    }
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
    const linkElements = document.getElementsByTagName("a");

    for(let i = 0; i < soundHTMLCollection.length; i++) {
        if(soundHTMLCollection[i].getAttribute("title") === "sound") soundState = soundHTMLCollection[i].getAttribute("alt");
    }

    for (let i = 0;  i < linkElements.length; i++){
        linkElements[i].addEventListener("click", playClick);
        if(linkElements[i].getAttribute("id") === "sound") linkElements[i].addEventListener("click", toggleSoundState)
    }

    bgm.volume = 0.3;
    bgm.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    changeSoundStateTo("off")
}

initSound();

