#version 300 es

precision mediump float;

in vec2 uv_cord;
in vec3 normalVec;
in vec3 fs_pos;

out vec4 out_color;

uniform float shinyFactor;
uniform float uPointLightTarget;
uniform float uPointLightDecay;
uniform vec3 uPointLightPos;
uniform vec4 uPointLightColor;
uniform vec4 uLightColor;
uniform int uSpecular;
uniform vec3 uLightDir;

uniform int uAmbient;
uniform vec4 uAmbientColor;

uniform sampler2D sampler;

/* --- RENDERING EQUATIONS ---

  L(x,wr) = SUM_lights( L(l,lx)*fr(x,lx,wr) ) + la*ma 

  where:  - L(l,lx) is the light model;
          - fr(x,lx,wr) is the BRDF 
          - la*ma is the ambient light term;
          - x --> position of the point (fs_pos);
          - wr --> eye Direction;
          - lx --> lightdirection (depends on the light model);
          - la --> ambient light color;
          - ma --> ambient diffuse color (assumed to be the main color);
  
  LIGHT MODELS:

    - DIRECTIONAL LIGHT: L(x,wr) = l * fr(x,d,wr)                           ---> l = uLightColor; d --> lightDir;

    - POINT LIGHT L(x,wr) = l * (g/(|p-x|))^beta * fr(x,(p-x / |p-x|), wr)  ---> l = uPointLightColor;
                                                                                 p = uPointLightPos;
                                                                                 x = fs_pos;
                                                                                 g = uPointLightTarget;
                                                                                 beta = uPointLightDecay;
  BRDF (Lambert reflection):

  fr(x,lx,wr) = md * clamp(lx . nx)   --> nx = normalVec (has to be normalized due to transformations);

  if specular is active -> Phong model : 

  fr(x,lx,wr) = md * clamp(lx . nx) + ms * clamp(wr . r)^shiny  --> r is the reflect vector of the Phong model


*/

vec4 frNoSpecular(vec3 lightDirection){

  vec3 nx = normalize(normalVec); // normal vector of x 
  vec4 md =  texture(sampler, uv_cord); // main diffuse color
  float dTerm = clamp(dot(lightDirection,nx),0.0,1.0); // diffuse term
  
  return vec4(md.rgb * dTerm,1.0);

}

vec4 frSpecular(vec3 lightDirection){

  vec3 nx = normalize(normalVec); // normal vector of x 
  vec3 wr = -(normalize(fs_pos)); // because of the camera shading space
  vec4 md =  texture(sampler, uv_cord); // main diffuse color
  vec4 ms = vec4(1.0,1.0,1.0,1.0); // specular color assumed white
  vec3 r = -reflect(lightDirection,nx); // reflect vector 

  float dTerm = clamp(dot(lightDirection,nx),0.0,1.0); // diffuse term
  float dSpecTerm = pow(clamp(dot(r, wr),0.0,1.0),shinyFactor); // diffuse term specular

  return vec4(md.rgb * dTerm + ms.rgb * dSpecTerm,1.0);
}

vec4 ambient(){
  vec4 md =  texture(sampler, uv_cord); // main diffuse color
  if(uAmbient > 0){
    return (uAmbientColor * md);
  }
  return vec4(0.0,0.0,0.0,1.0);
}

void main(){

  // in the game we have (fixed) one point light and one directional light
  // optional -> Phong specular and ambient light


  vec3 d = -uLightDir; // light direction
  vec3 pointLightDir = normalize(uPointLightPos-fs_pos); // point light direction

  float pointLightCoeff =  pow(uPointLightTarget / length(uPointLightPos-fs_pos), uPointLightDecay);

  if(uSpecular > 0){ // specular is active

    out_color = clamp(
                vec4(
                  uLightColor.rgb * frSpecular(d).rgb +
                  uPointLightColor.rgb * pointLightCoeff * frSpecular(pointLightDir).rgb 
                  + ambient().rgb
                  ,1.0)
                ,0.0,1.0);
  }
  else{
    out_color = clamp(
                vec4(
                  uLightColor.rgb * frNoSpecular(d).rgb +
                  uPointLightColor.rgb * pointLightCoeff * frNoSpecular(pointLightDir).rgb
                  + ambient().rgb
                  ,1.0)
                ,0.0,1.0);
  }
}



/*
vec3 computeLambertDiffuse(vec3 lightD,vec4 diffuseColor){
  
  vec3 normal = normalize(normalVec);
  float lightCoeff = clamp(dot(lightD,normal),0.0,1.0);

  vec3 pointLightDir = normalize(uPointLightPos-fs_pos);
  vec3 pointLightColor = (uPointLightColor.rgb) * pow(uPointLightTarget / length(uPointLightPos-fs_pos), uPointLightDecay);
  float pointLightCoeff = dot(pointLightDir,normal);
  
  //return clamp(diffuseColor.rgb*vec3(pointLightColor*pointLightCoeff) + diffuseColor.rgb*lightCoeff,0.0,1.0);
  //return clamp(diffuseColor.rgb*vec3(pointLightColor*pointLightCoeff),0.0,1.0);
  return clamp(diffuseColor.rgb*vec3(uLightColor*lightCoeff),0.0,1.0) + clamp(diffuseColor.rgb*vec3(pointLightColor*pointLightCoeff),0.0,1.0);
  
}

vec3 computeSpecularPhong(){
  
  vec3 pointLightDir = normalize(uPointLightPos-fs_pos); //correct
  vec3 normal = normalize(normalVec); // correct 
  float pointLightCoeff = dot(pointLightDir,normal); 

  vec4 specularColor = vec4(1.0,1.0,1.0,0.8);
  vec3 wr = -(normalize(fs_pos)); //correct
  vec3 reflectVec = -reflect(pointLightDir,normal);
  float LRA = max(dot(reflectVec, wr), 0.0);
  return specularColor.rgb * pow(LRA, shinyFactor);

}



void main() {
  
  vec4 diffColor =  texture(sampler, uv_cord);
  vec3 lightD = -lightDir;
  vec4 temp;

  if(uSpecular > 0){
    temp = clamp(vec4(computeLambertDiffuse(lightD,diffColor),1.0) + vec4(computeSpecularPhong(),1.0),0.0,1.0);
  }else{
    temp = clamp(vec4(computeLambertDiffuse(lightD,diffColor),1.0),0.0,1.0);
  }

  if(uAmbient > 0){
    // suppose the reflection color is the main color (texture)
    temp = temp + (uAmbientColor * diffColor);
  }
  out_color = temp;
} 


*/
