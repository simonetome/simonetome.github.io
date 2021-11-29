var canvas;
var broken = [];
var time = 0;
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

var fixPosLight = 1;

viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);

var eyePos = [cx,cy,cz];
//PROJECTION
var zNear = 1;
var zFar = 20000;
var fieldOfViewDeg = 40;


var gl = null;

var skyBox = null;
var skyBoxVertexShader = null;
var skyBoxFragmentShader = null;

var delta = 0.1;

var S = 1.0;
var Rz = 0.0;

var scene;
var first = 1;
var w = 0;
var h = 0;

// SPHERE PARAMS 
var sphereX = 27.0;
var sphereY = -10.0;
var sphereZ = 0.0;
var sphereDirectionX = 0;
var sphereDirectionY = 0;
var sphereSpeed = 15.0;
var sphereRadius = 1;
var sphereRot = 0;

// blocks 
var cubes = 7; // 3 lines of 10 cubes each 
var lines = 5;

// PADDLE PARAMETERS 
var paddleHeight = 2;
var paddleWidth = 10;
var paddleY = -30.0;
var paddleX = 25;
var paddleTopY = paddleHeight + paddleY;
var paddleDir = 0;
var paddleSpeed = 15.0;
var paddleRot = 0.0;

// WALL PARAMETERS
var topWallX = 25;
var topWallY = 13;
var wallLength = 50;
var wallWidth = 1;

// BLOCKS PARAMS 
var blockHeight = 2;
var blockWidth = 6;
// padding from the wall 
var blockPadding = 0.10;
var occupied = (blockWidth*cubes + (cubes-1)*blockPadding); // occupied space by blocks and gaps in-between 
var free = wallLength-wallWidth*2; // free space
var padding = (free-occupied)/2;
var offset =  wallWidth+blockWidth/2+padding;


// POINT LIGHT PARAMETERS 
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

// AUDIO 
var audioOn = 0;
var effectsOn = 0;
var audioFolder = "sounds/"
var gameLoopAudio = new Audio(audioFolder+'gameLoop.wav');
var ballHitAudio = new Audio(audioFolder+'ballHit.wav');
var winAudio = new Audio(audioFolder+'win.wav');
var looseAudio = new Audio(audioFolder+'loose.wav');
var bounceAudio = new Audio(audioFolder+'bounce.wav');

function audiOnChange(){
  if(document.getElementById("audioOn").checked){
    audioOn = 1;
    playLoop();
  }else{
    audioOn = 0;
    playLoop();
  }
}

function effectsOnChange(){
  if(document.getElementById("effectsOn").checked){
    effectsOn = 1;
  }else{
    effectsOn = 0;
  }
}

function dirAlphaSlider(value){
  dirLightAlpha = -utils.degToRad(value);
  directionalLightDir = [ Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
    Math.sin(dirLightAlpha),
    Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)];
}

function dirBetaSlider(value){
  dirLightBeta = -utils.degToRad(value);
  directionalLightDir = [ Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
    Math.sin(dirLightAlpha),
    Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)];
}

function decayChange(value){
  pointLightDecay = value;
}
function targetChange(value){
  pointLightTarget= value;
}

function pointXChange(value){
  pointLightPosition[0] = value;
}
function pointYChange(value){
  pointLightPosition[1] = value;
}
function pointZChange(value){
  pointLightPosition[2] = value;
}

function shinyChange(value){
  shinyFactor = value;
}

function specularInactive(){
  specular = 0;
}

function specularActive(){
  specular = 1;
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function colorChange(value){
  let color = (hexToRgb(value));
  pointLightColor[0] = color.r / 255;
  pointLightColor[1] = color.g/ 255;
  pointLightColor[2] = color.b / 255;
}

function dirColorChange(value){
  let color = (hexToRgb(value));
  directionalLightColor[0] = color.r / 255;
  directionalLightColor[1] = color.g/ 255;
  directionalLightColor[2] = color.b / 255;
}

function cameraxChange(value){
  cx = value;
  viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
}

function camerayChange(value){
  cy = value;
  viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
}

function camerazChange(value){
  cz = value;
  viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
}

function elevationChange(value){
  elevation = value;
  viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
}

function angleChange(value){
  angle = value;
  viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
}

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

// color for tiles 
const colors = {
	BLUE: "blue.png",
  YELLOW: "yellow.png",
  GREEN: "green.png",
  RED: "red.png",
  FUCHSIA: "fuchsia.png",
}


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