#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

out vec2 uv_cord;

void main() {
    gl_Position = a_position;
    uv_cord = a_texcoord;
}