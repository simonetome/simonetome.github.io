var canvas;
var broken = [];
var time = 0;
var gl = null;
var aspect;
var scene;
var w = 0;
var h = 0;

// matrices
var projectionMatrix,perspectiveMatrix,viewMatrix, worldMatrix;

// START END GAME / SCORE
var startgame = 0;
var score = 0;

// CAMERA PARAMETERS 
var cx = 25.0;
var cy = -40.0;
var cz = 70.0;
var elevation = 20.0;
var angle = 0.0;


//PROJECTION parameters 
var zNear = 1;
var zFar = 20000;
var fieldOfViewDeg = 40;

// Skybox
var skyBox = null;
var skyBoxVertexShader = null;
var skyBoxFragmentShader = null;

// SPHERE parameters 
var sphereX = 27.0;
var sphereY = -10.0;
var sphereZ = 0.0;
var sphereDirectionX = 0;
var sphereDirectionY = 0;
var sphereSpeed = 15.0;
var sphereRadius = 1;
var sphereRot = 0;

// How many blocks  
var cubes = 7; 
var lines = 5;

// PADDLE parameters 
var paddleHeight = 2;
var paddleWidth = 10;
var paddleY = -30.0;
var paddleX = 25;
var paddleTopY = paddleHeight + paddleY;
var paddleDir = 0;
var paddleSpeed = 15.0;
var paddleRot = 0.0;

// WALL parameters
var topWallX = 25;
var topWallY = 13;
var wallLength = 50;
var wallWidth = 1;

// BLOCKS parameters 
var blockHeight = 2;
var blockWidth = 6;

// Compute the space between the cubes/ from the walls 
var blockPadding = 0.10;
var occupied = (blockWidth*cubes + (cubes-1)*blockPadding); 
var free = wallLength-wallWidth*2; 
var padding = (free-occupied)/2;
var offset =  wallWidth+blockWidth/2+padding;


// POINT LIGHT parameters 
var pointLightPosition = [0.0,0.0,0.0];
var pointLightColor = [1.0, 1.0, 1.0, 1.0];
var pointLightDecay = 1;
var pointLightTarget = 20.0;
var shinyFactor = 20.0;
var specular = 0;

// DIRECTIONAL LIGHT PARAMETERS 
var dirLightAlpha = -utils.degToRad(40);
var dirLightBeta = -utils.degToRad(120);

var directionalLightDir = [ Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
                            Math.sin(dirLightAlpha),
                            Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)];
var directionalLightColor = [1.0, 1.0, 1.0, 1.0];

// AMBIENT LIGHT PARAMETERS 
var ambientColor = [0.0,0.0,0.0,1.0];
var ambient = 0;

// AUDIO parameters
var audioOn = 0;
var effectsOn = 0;
var audioFolder = "sounds/"
var gameLoopAudio = new Audio(audioFolder+'gameLoop.wav');
var ballHitAudio = new Audio(audioFolder+'ballHit.wav');
var winAudio = new Audio(audioFolder+'win.wav');
var looseAudio = new Audio(audioFolder+'loose.wav');
var bounceAudio = new Audio(audioFolder+'bounce.wav');

// SHADERS 
var bgVertexShader = null;
var bgFragmentShader = null;

// for animation 
var then = 0;

// OBJECTS 
var cube = null;
var paddle = null;
var sphere = null;
var wall = null;
var background = null;
var leftWallNode = null;
var sphereNode = null;
var paddleNode = null;
var cubeNodes = [];

// Texture images for the blocks
const colors = {
	BLUE: "blue.png",
  YELLOW: "yellow.png",
  GREEN: "green.png",
  RED: "red.png",
  FUCHSIA: "fuchsia.png",
}

//------------------------------------//
// Game controllers

// reset game
function resetGame(){
    sphereX = 27.0;
    sphereY = -10.0;
    sphereZ = 0.0;
    sphereDirectionX = 0;
    sphereDirectionY = 0;
    sphereSpeed = 15.0;
    sphereRadius = 1;
    sphereRot = 0;

    startgame = 0;
    score = 0;
    cubeNodes = [];
    paddleX = 25;
    paddleTopY = paddleHeight + paddleY;
    paddleDir = 0;
    paddleSpeed = 15.0;

    scoreUpdate();
    broken = [];
    startGame();
  }
  
// update the score: if equal to number of cubes game is won 
// when the score is updated the speed of the paddle and the ball increase
function scoreUpdate(){
    document.getElementById("scoreDiv").innerHTML = score;
    sphereSpeed++;
    paddleSpeed += 0.5;
    if(score == cubes*lines){
        if(effectsOn){
          winAudio.play();
        }
        window.alert("You won");
        resetGame();
    }
}