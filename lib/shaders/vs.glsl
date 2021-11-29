#version 300 es

in vec3 a_position;
in vec2 a_uv;
in vec3 a_normal;


out vec2 uv_cord;
out vec3 normalVec;
out vec3 eyePos;
out vec3 lightDir;
out vec3 fs_pos; 

uniform mat4 worldMatrix; 
uniform mat4 projectionMatrix;
uniform mat4 worldViewMatrix;
uniform mat4 normalMatrix;
uniform vec3 uEyePos;
uniform vec3 uLightDir;


void main() {
  uv_cord = a_uv;
  
  gl_Position = projectionMatrix * vec4(a_position,1.0);
  fs_pos = (worldViewMatrix * vec4(a_position,1.0)).xyz;
  normalVec = mat3(normalMatrix) * a_normal;
  //normalVec = a_normal;
  eyePos = uEyePos;
  // position is transformed

  lightDir = uLightDir;
  

}