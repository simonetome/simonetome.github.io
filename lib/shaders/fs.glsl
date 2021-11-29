#version 300 es

precision mediump float;

in vec2 uv_cord;
in vec3 lightDir;
in vec3 normalVec;
in vec3 eyePos;
in vec3 fs_pos;


out vec4 out_color;

uniform float shinyFactor;
uniform float uPointLightTarget;
uniform float uPointLightDecay;
uniform vec3 uPointLightPos;
uniform vec4 uPointLightColor;
uniform vec4 uLightColor;
uniform int uSpecular;

uniform sampler2D sampler;

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
  //vec4 fspecular = pow(clamp(dot(normalVec,normalize(lightD+eyedirVec)),0.0,1.0),SpecShine) *lightColor;

  //vec4(oPointLightDir,1.0)*oPointLightColor
  //out_color = vec4(computeSpecularPhong(),1.0);
  //out_color = clamp(vec4(computeLambertDiffuse(lightD,diffColor),1.0) + vec4(computeSpecularPhong(),1.0),0.0,1.0);
  if(uSpecular > 0){
    out_color = clamp(vec4(computeLambertDiffuse(lightD,diffColor),1.0) + vec4(computeSpecularPhong(),1.0),0.0,1.0);
  }else{
    out_color = clamp(vec4(computeLambertDiffuse(lightD,diffColor),1.0),0.0,1.0);
  }
} 

