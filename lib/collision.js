
// check collision between sphere and other things
function collisionPaddleCheck(){
    // the paddle has a constant y, I have to check if the bottom y of the sphere is less wrt to the paddle
    if((sphereY-sphereRadius) <= paddleY + paddleHeight/2){
      if(sphereX + sphereRadius/2 >= paddleX - paddleWidth/2 && sphereX - sphereRadius/2<= paddleX + paddleWidth/2){
        bounceAudio.currentTime = 0;
        if(effectsOn){
          bounceAudio.play();
        }
        sphereDirectionY = 1;
        if(sphereDirectionX == 0){sphereDirectionX = -0.5;}
      }
      else{
          if((sphereY-sphereRadius) <= paddleY + paddleHeight/2 - sphereRadius){
            if(effectsOn){
              looseAudio.play();
            }
            window.alert("You lost...");
            resetGame();
          }
      }
    }
}


function wallCollision(sphereX, sphereY){
  if(sphereX - sphereRadius <= topWallX - wallLength/2 + wallWidth){
    bounceAudio.currentTime = 0;
    if(effectsOn){
      bounceAudio.play();
    }
    sphereDirectionX = 0.5;
  }
  else if(sphereX + sphereRadius >= topWallX + wallLength/2 - wallWidth){
    bounceAudio.currentTime = 0;
    if(effectsOn){
      bounceAudio.play();
    }
    sphereDirectionX = -0.5;
  }
  else if(sphereY + sphereRadius >= topWallY - wallWidth){
    bounceAudio.currentTime = 0;
    if(effectsOn){
      bounceAudio.play();
    }
    sphereDirectionY = -1;
  }
}

function blockCollision(sphereX,sphereY){
  // check collision for each one
  for(let i=0; i < cubeNodes.length; i++){
    let node = cubeNodes[i];
    let xBlock = cubeNodes[i].x;
    let yBlock = cubeNodes[i].y;

    if(!broken.includes(i)){
      // top of sphere bouncing 
      if(sphereX >= xBlock - blockWidth/2 && sphereX <= xBlock + blockWidth/2 && (sphereY+sphereRadius) >= yBlock - blockHeight/2 && (sphereY+sphereRadius) <= yBlock + blockHeight/2){
        scene.root.delChild(node);
        sphereDirectionY *= -1;
        broken.push(i);
        score++;
        ballHitAudio.currentTime = 0;
        if(effectsOn){
          ballHitAudio.play();
        }
        scoreUpdate();
        break;
      }
      // bottom of sphere bouncing 
      else if(sphereX >= xBlock - blockWidth/2 && sphereX <= xBlock + blockWidth/2 && (sphereY-sphereRadius) <= yBlock + blockHeight/2 && (sphereY-sphereRadius) >= yBlock - blockHeight/2){
        scene.root.delChild(node);
        sphereDirectionY *= -1;
        broken.push(i);
        score++;
        ballHitAudio.currentTime = 0;
        if(effectsOn){
          ballHitAudio.play();
        }
        scoreUpdate();
        break;
      }
      // right side of the sphere bouncing 
      else if(sphereX + sphereRadius <= xBlock + blockWidth/2 && sphereX + sphereRadius >= xBlock - blockWidth/2 && sphereY <= yBlock + blockHeight/2 && sphereY >= yBlock - blockHeight/2){ 
        scene.root.delChild(node);
        broken.push(i);
        score++;
        ballHitAudio.currentTime = 0;
        if(effectsOn){
          ballHitAudio.play();
        }
        sphereDirectionX = -1;
        scoreUpdate();
        break;
      }
      // left side of the sphere bouncing 
      else if(sphereX - sphereRadius <= xBlock + blockWidth/2 && sphereX -sphereRadius >= xBlock - blockWidth/2 && sphereY <= yBlock + blockHeight/2 && sphereY >= yBlock - blockHeight/2){
        scene.root.delChild(node);
        broken.push(i);
        score++;
        ballHitAudio.currentTime = 0;
        if(effectsOn){
          ballHitAudio.play();
        }
        sphereDirectionX = +1;
        scoreUpdate();
        break;
      }
    }


  }
}