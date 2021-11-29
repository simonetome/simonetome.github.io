
gameLoopAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

function playLoop(){
    if(audioOn){
        gameLoopAudio.play();
    }
    else{
        gameLoopAudio.pause();
    }
}
