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

  // loading shaders for the skyBox
  await utils.loadFiles(["lib/shaders/skyBoxVs.glsl","lib/shaders/skyBoxFs.glsl"], function (shaderText) {
    skyBoxVertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    skyBoxFragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
  });
  
  // setting gl context
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  w=canvas.clientWidth;
  h=canvas.clientHeight;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0.0, 0.0, w, h);
  aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  // loading the .obj files for the scene objects 
  let blockStr = await utils.get_objstr("lib/assets/block.obj");
  let paddleStr = await utils.get_objstr("lib/assets/paddle.obj");
  let sphereStr = await utils.get_objstr("lib/assets/ball.obj");
  let wallStr = await utils.get_objstr("lib/assets/wall.obj");

  // creating the meshes from the loaded .obj strings
  let blockMesh = new OBJ.Mesh(blockStr);
  let paddleMesh = new OBJ.Mesh(paddleStr);
  let sphereMesh = new OBJ.Mesh(sphereStr);
  let wallMesh = new OBJ.Mesh(wallStr);

  // programs for the Objects and the SkyBox 
  let program = utils.createProgram(gl, vertexShader,fragmentShader);
  let programSB = utils.createProgram(gl, skyBoxVertexShader,skyBoxFragmentShader);

  // Creating the objects: 
  // object class defined in object.js -> define buffers, attributes, uniforms, textures
  blueBlock = new Object(gl,program,blockMesh);
  greenBlock = new Object(gl,program,blockMesh);
  redBlock = new Object(gl,program,blockMesh);
  yellowBlock = new Object(gl,program,blockMesh);
  fuchsiaBlock = new Object(gl,program,blockMesh);
  paddle = new Object(gl,program,paddleMesh);
  sphere = new Object(gl,program,sphereMesh);
  wall = new Object(gl,program,wallMesh);

  // Create the skybox (same as object but no mesh is needed and textures image are loaded in the constructor)
  skyBox = new SkyBox(gl,programSB);

  // Texture loading
  const promiseArray = []; 

  var redBlockImage=new Image();
  var blueBlockImage=new Image();
  var fuchsiaBlockImage=new Image();
  var yellowBlockImage=new Image();
  var greenBlockImage=new Image();
  var paddleImage = new Image();
  var sphereImage = new Image();
  var wallImage = new Image();

  // array that contains tuples (object, image)
  var objects = [[redBlock,redBlockImage],
                [blueBlock,blueBlockImage],
                [fuchsiaBlock,fuchsiaBlockImage],
                [yellowBlock,yellowBlockImage],
                [greenBlock,greenBlockImage],
                [paddle,paddleImage],
                [sphere,sphereImage],
                [wall,wallImage],
              ];

  var textureFolder = "textures/";

  // Images path
  redBlockImage.src = textureFolder + colors.RED;
  blueBlockImage.src = textureFolder + colors.BLUE;
  fuchsiaBlockImage.src = textureFolder + colors.FUCHSIA;
  yellowBlockImage.src = textureFolder + colors.YELLOW;
  greenBlockImage.src = textureFolder + colors.GREEN;
  paddleImage.src = textureFolder + "paddle.jpg";
  sphereImage.src = textureFolder + "metalShiny.png";
  wallImage.src = textureFolder + "tile.jpg";

  // load images
  for (let i = 0; i < objects.length; ++i){
    promiseArray.push(new Promise(resolve => {
      objects[i][1].onload = function(e){
        var texture=gl.createTexture();
        objects[i][0].setTexture(texture,objects[i][1]);
        resolve();
      };
    }));
  }

  // wait that all images are loaded
  await Promise.all(promiseArray);

  console.log("Finished loading textures and meshes...");

  main();
}


function main() {
  
  // compute perspective Matrix (fixed)
  perspectiveMatrix = utils.MakePerspective(fieldOfViewDeg, aspect, zNear, zFar);
  // copute view Matrix 
  viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);

  // create the Scene graph
  scene = new SceneGraph();
  let sideWallY = topWallY-wallLength/2;
  paddleNode = new Node(paddle,utils.MakeWorld(paddleX,paddleY,0.0,0.0,0.0,0.0,1.0),false);
  sphereNode = new Node(sphere,utils.MakeWorld(sphereX,sphereY,sphereZ,0.0,0.0,0.0,1.0),false);
  leftWallNode = new Node(wall,utils.MakeWorld(0.0,sideWallY,0.0,0.0,0.0,90.0,1.0),false);
  rightWallNode = new Node(wall,utils.MakeWorld(topWallX+wallLength/2,sideWallY,0.0,0.0,0.0,90.0,1.0),false);
  topWallNode = new Node(wall,utils.MakeWorld(topWallX,topWallY,0.0,0.0,0.0,0.0,1.0),false);
  
  // everything is child of the root node
  scene.root.addChild(paddleNode);
  scene.root.addChild(sphereNode);
  scene.root.addChild(leftWallNode);
  scene.root.addChild(rightWallNode);
  scene.root.addChild(topWallNode);


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

    // start the animation 
    requestAnimationFrame(drawScene);
  }



  function drawScene(now) {

    // animation must be fps independent
    now *= 0.001;
    let deltaTime = now - then;
    then = now;

    v = []

    // check for collisions (scripts defined in 'collision.js')
    collisionPaddleCheck();
    wallCollision(sphereX, sphereY);
    blockCollision(sphereX,sphereY);

    // update ball and paddle positions
    sphereX += (sphereDirectionX*sphereSpeed*deltaTime);
    sphereY += (sphereDirectionY*sphereSpeed*deltaTime);
    sphereRot += (sphereDirectionX*sphereSpeed * deltaTime);
    paddleX += (paddleDir*paddleSpeed*deltaTime);

    // paddle cannot go beyond the walls 
    if(paddleX + paddleWidth/2 >= wallLength-wallWidth){
      paddleX = wallLength-wallWidth-paddleWidth/2;
    }else if(paddleX - paddleWidth/2 <= wallWidth){
      paddleX = wallWidth+paddleWidth/2;
    }

    // update world matrixes of the sphere and ball (other objects are fixed)
    sphereNode.objMatrix = utils.MakeWorld(sphereX,sphereY,sphereZ,0.0,0.0,sphereRot,1.0);
    paddleNode.objMatrix = utils.MakeWorld(paddleX,paddleY,0.0,paddleRot,0.0,0.0,1.0);
    
    
    // draw skybox 
    skyBox.draw(gl);

    // SCENE DRAW WITH SCENE GRAPH 
    scene.computeMatrices();
    scene.drawScene();

    requestAnimationFrame(drawScene);
  }

// controls to interact with the game (paddle and restart/start the game)
function paddleActive(e){
      if (e.keyCode == 65) {  
        paddleDir = -1;
      }
      if (e.keyCode == 68) {  
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


// paddle is inactive: don't change direction (when the keys to move it are released)
function paddleInactive(e){
  if (e.keyCode == 65 || e.keyCode == 68){
    paddleDir = 0;
  }
}


function startGame(){
  main();
}

// first action -> load everything and create objects 
window.onload = initLoading;

window.addEventListener("keydown", paddleActive, false);
window.addEventListener("keyup", paddleInactive, false);
