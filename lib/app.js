async function initLoading(){
  
  // Get a WebGL context
  canvas = document.getElementById("c");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(gl.canvas);

  // loading shaders for objects
  await utils.loadFiles(["lib/shaders/vs.glsl","lib/shaders/fs.glsl"], function (shaderText) {
    vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
  });

  // loading shaders for background image
  await utils.loadFiles(["lib/shaders/bgvs.glsl","lib/shaders/bgfs.glsl"], function (shaderText) {
    bgVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    bgFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
  });

  // loading shaders for Skybox image
  /*
var skyBoxVertexShader = null;
var skyBoxFragmentShader = null;

  */
  await utils.loadFiles(["lib/shaders/skyBoxVs.glsl","lib/shaders/skyBoxFs.glsl"], function (shaderText) {
    skyBoxVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    skyBoxFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
  });
  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  //Setting the size for the canvas equal to half the browser window
  w=canvas.clientWidth;
  h=canvas.clientHeight;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0.0, 0.0, w, h);




  let blockStr = await utils.get_objstr("lib/assets/block.obj");
  let paddleStr = await utils.get_objstr("lib/assets/paddle.obj");
  let sphereStr = await utils.get_objstr("lib/assets/ball.obj");
  let wallStr = await utils.get_objstr("lib/assets/wall.obj");
  let bgStr = await utils.get_objstr("lib/assets/background.obj");

  let blockMesh = new OBJ.Mesh(blockStr);
  let paddleMesh = new OBJ.Mesh(paddleStr);
  let sphereMesh = new OBJ.Mesh(sphereStr);
  let wallMesh = new OBJ.Mesh(wallStr);
  let backgroundMesh = new OBJ.Mesh(bgStr);

  // Block objects
  let program = utils.createProgram(gl, vertexShader,fragmentShader);
  let programBG = utils.createProgram(gl, vertexShader,bgFragmentShader);
  let programSB = utils.createProgram(gl, skyBoxVertexShader,skyBoxFragmentShader);

  blueBlock = new Object(gl,program,blockMesh);
  greenBlock = new Object(gl,program,blockMesh);
  redBlock = new Object(gl,program,blockMesh);
  yellowBlock = new Object(gl,program,blockMesh);
  fuchsiaBlock = new Object(gl,program,blockMesh);

  paddle = new Object(gl,program,paddleMesh);
  sphere = new Object(gl,program,sphereMesh);

  wall = new Object(gl,program,wallMesh);

  background = new Object(gl,programBG,backgroundMesh);

  // skybox creation 
  skyBox = new SkyBox(gl,programSB);


  // textures loading

  const promiseArray = []; 

  var redBlockImage=new Image();
  var blueBlockImage=new Image();
  var fuchsiaBlockImage=new Image();
  var yellowBlockImage=new Image();
  var greenBlockImage=new Image();

  var paddleImage = new Image();
  var sphereImage = new Image();
  var wallImage = new Image();
  var backgroundImage = new Image();

  // TO POPULATE
  var objects = [[redBlock,redBlockImage],
                [blueBlock,blueBlockImage],
                [fuchsiaBlock,fuchsiaBlockImage],
                [yellowBlock,yellowBlockImage],
                [greenBlock,greenBlockImage],
                [paddle,paddleImage],
                [sphere,sphereImage],
                [wall,wallImage],
                [background,backgroundImage],
              ];

  var textureFolder = "textures/";

  // TO POPULATE
  redBlockImage.src = textureFolder + colors.RED;
  blueBlockImage.src = textureFolder + colors.BLUE;
  fuchsiaBlockImage.src = textureFolder + colors.FUCHSIA;
  yellowBlockImage.src = textureFolder + colors.YELLOW;
  greenBlockImage.src = textureFolder + colors.GREEN;
  paddleImage.src = textureFolder + "paddle.jpg";
  sphereImage.src = textureFolder + "metalShiny.png";
  wallImage.src = textureFolder + "tile.jpg";
  backgroundImage.src = textureFolder + "spaceDeep.jpg";

  for (let i = 0; i < objects.length; ++i){
    promiseArray.push(new Promise(resolve => {
      objects[i][1].onload = function(e){
        var texture=gl.createTexture();
        objects[i][0].setTexture(texture,objects[i][1]);
        resolve();
      };
    }));
  }
  
  
  await Promise.all(promiseArray);


  console.log("Finished loading textures and meshes...");

  main();

}


function main() {

  console.log("Init scene");
  scene = new SceneGraph();
  let sideWallY = topWallY-wallLength/2;
  paddleNode = new Node(paddle,utils.MakeWorld(paddleX,-20.0,0.0,0.0,0.0,0.0,1.0),false);
  sphereNode = new Node(sphere,utils.MakeWorld(sphereX,sphereY,sphereZ,0.0,0.0,0.0,1.0),false);
  leftWallNode = new Node(wall,utils.MakeWorld(0.0,sideWallY,0.0,0.0,0.0,90.0,1.0),false);
  rightWallNode = new Node(wall,utils.MakeWorld(topWallX+wallLength/2,sideWallY,0.0,0.0,0.0,90.0,1.0),false);
  topWallNode = new Node(wall,utils.MakeWorld(topWallX,topWallY,0.0,0.0,0.0,0.0,1.0),false);
  backgroundBackNode = new Node(background,utils.multiplyMatrices(utils.MakeWorld(cx,30,-90.0,0.0,15.0,0.0,1),utils.MakeScaleMatrixXYZ(10,10,1)),false);
  backgroundTopNode = new Node(background,utils.multiplyMatrices(utils.MakeWorld(cx,90,0.0,0.0,-75.0,0.0,1),utils.MakeScaleMatrixXYZ(10,10,1)),false);
  backgroundDownNode = new Node(background,utils.multiplyMatrices(utils.MakeWorld(cx,-70.0,0.0,0.0,-75.0,0.0,1),utils.MakeScaleMatrixXYZ(10,10,1)),false);
  backgroundLeftNode = new Node(background,utils.multiplyMatrices(utils.MakeWorld(cx-160,0,60.0,90.0,15.0,0.0,1),utils.MakeScaleMatrixXYZ(10,10,1)),false);
  backgroundRightNode = new Node(background,utils.multiplyMatrices(utils.MakeWorld(cx+160,0,60.0,90.0,15.0,0.0,1),utils.MakeScaleMatrixXYZ(10,10,1)),false);

  scene.root.addChild(paddleNode);
  scene.root.addChild(sphereNode);
  scene.root.addChild(leftWallNode);
  scene.root.addChild(rightWallNode);
  scene.root.addChild(topWallNode);
  /*
  scene.root.addChild(backgroundBackNode);
  scene.root.addChild(backgroundTopNode);
  scene.root.addChild(backgroundLeftNode);
  scene.root.addChild(backgroundRightNode);
  scene.root.addChild(backgroundDownNode);
  */

    for(let i =0; i < lines; ++i){
      for(let j = 0; j < cubes; ++j){
        let x = j*(blockWidth+blockPadding) + offset;
        let y = i*(blockHeight+blockPadding);
        let worldMatrix = utils.MakeWorld(x,y,0.0,0.0,0.0,0.0,1.0);
        let node = null;

        switch (i){
          case 0:
            node = new Node(redBlock,worldMatrix,false);
            break;
          case 1:
            node = new Node(blueBlock,worldMatrix,false);
            break;
          case 2:
            node = new Node(fuchsiaBlock,worldMatrix,false);
            break;
          case 3:
            node = new Node(yellowBlock,worldMatrix,false);
            break;
          default:
            node = new Node(greenBlock,worldMatrix,false);
        }
        node.x = x;
        node.y = y;   
        cubeNodes.push(node);
        // add the block to the scene graph
        scene.root.addChild(node);
      }
    } 
  // look up where the vertex data needs to go.
    requestAnimationFrame(drawScene);
    
    
  }



  function drawScene(now) {

    now *= 0.001;
    let deltaTime = now - then;
    then = now;
    v = []

    collisionPaddleCheck();
    //else if(gameOver(sphereY)){}
    wallCollision(sphereX, sphereY);

    sphereX += (sphereDirectionX*sphereSpeed*deltaTime);
    sphereY += (sphereDirectionY*sphereSpeed*deltaTime);
    sphereRot += (sphereDirectionX*sphereSpeed * deltaTime);
    paddleX += (paddleDir*paddleSpeed*deltaTime);

    if(paddleX + paddleWidth/2 >= wallLength-wallWidth){
      paddleX = wallLength-wallWidth-paddleWidth/2;
    }else if(paddleX - paddleWidth/2 <= wallWidth){
      paddleX = wallWidth+paddleWidth/2;
    }

    blockCollision(sphereX,sphereY);

    sphereNode.objMatrix = utils.MakeWorld(sphereX,sphereY,sphereZ,0.0,0.0,sphereRot,1.0);
    paddleNode.objMatrix = utils.MakeWorld(paddleX,paddleY,0.0,paddleRot,0.0,0.0,1.0);
    
    // Compute the matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    perspectiveMatrix = utils.MakePerspective(fieldOfViewDeg, aspect, zNear, zFar);
    
    // draw skybox 

    skyBox.draw(gl);

    // SCENE DRAW WITH SCENE GRAPH 
    scene.computeMatrices();
    scene.drawScene(gl,perspectiveMatrix,viewMatrix,directionalLightColor,directionalLightDir,eyePos
      ,pointLightPosition, pointLightColor, pointLightDecay, pointLightTarget,shinyFactor);

    requestAnimationFrame(drawScene);
  }

function paddleActive(e){
      if (e.keyCode == 65) {  // 6
        paddleDir = -1;
      }
      if (e.keyCode == 68) {  // 7
        paddleDir = 1;
      } 
      if (e.keyCode == 13){
        if(startgame == 0){
          startgame = 1;
          sphereDirectionY = -1; 
        }else{
          cancelAnimationFrame(drawScene);
          resetGame();
        }
      }
}

function paddleInactive(e){
  if (e.keyCode == 65) {  // 6
    paddleDir = 0;
  }
  if (e.keyCode == 68) {  // 7
    paddleDir = 0;
  } 
}

function startGame(){
  main();
}

window.onload = initLoading;

//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keydown", paddleActive, false);
window.addEventListener("keyup", paddleInactive, false);
