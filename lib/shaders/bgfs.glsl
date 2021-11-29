#version 300 es

precision mediump float;

in vec2 uv_cord;
in vec4 lightColor;
in vec3 lightDir;
in vec3 normalVec;
in vec3 eyePos;
in vec3 fs_pos;

out vec4 out_color;

uniform float uPointLightTarget;
uniform float uPointLightDecay;
uniform vec3 uPointLightPos;
uniform vec4 uPointLightColor;
uniform sampler2D sampler;


    
void main() {
    vec3 eyedirVec = normalize(eyePos - fs_pos);
    vec4 ambientLight = vec4(0.4, 0.4, 0.4, 1.0);
    vec4 diffColor =  texture(sampler, uv_cord);
    vec4 ambientColor = diffColor;
    float SpecShine = 2.0;
    vec3 lightD = -lightDir;
    vec4 lightColor = vec4(0.82, 0.8, 0.8, 1.0);
    vec4 specularColor = vec4(0.82, 0.8, 0.8, 1.0);
    vec4 lightCoeff = clamp(dot(lightD, normalVec),0.0,1.0) * lightColor;
    vec4 fspecular = pow(clamp(dot(normalVec,normalize(lightD+eyedirVec)),0.0,1.0),SpecShine) *lightColor;
    out_color = diffColor;
}