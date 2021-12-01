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
  
  function ambientChange(value){
    let color = (hexToRgb(value));
    ambientColor[0] = color.r / 255;
    ambientColor[1] = color.g/ 255;
    ambientColor[2] = color.b / 255;
  }
  
  function ambientActive(){
    ambient = 1;
  }
  
  function ambientNone(){
    ambient = 0;
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
  