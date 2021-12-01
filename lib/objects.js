class Object{
    constructor (gl,program,mesh){

        this.program = program;
        this.vao = gl.createVertexArray(this.program);
        this.textureImage = null;
        this.texture = null;
        this.vertices = mesh.vertices;
        this.indices = mesh.indices;
        this.normals = mesh.vertexNormals;
        this.uvCoordinates = mesh.textures;

        this.uniformLocations = {
            worldMatrix: gl.getUniformLocation(this.program, "worldMatrix"),
            projectionMatrix: gl.getUniformLocation(this.program, "projectionMatrix"),
            sampler: gl.getUniformLocation(this.program, "sampler"),
            uLightColor: gl.getUniformLocation(this.program,"uLightColor"),
            uLightDir: gl.getUniformLocation(this.program,"uLightDir"),
            worldViewMatrix: gl.getUniformLocation(this.program,"worldViewMatrix"),
            normalMatrix: gl.getUniformLocation(this.program,"normalMatrix"),
            uPointLightColor: gl.getUniformLocation(this.program,"uPointLightColor"),
            uPointLightPos: gl.getUniformLocation(this.program,"uPointLightPos"),
            uPointLightTarget: gl.getUniformLocation(this.program,"uPointLightTarget"),
            uPointLightDecay: gl.getUniformLocation(this.program,"uPointLightDecay"),
            shinyFactor:  gl.getUniformLocation(this.program,"shinyFactor"),
            uSpecular: gl.getUniformLocation(this.program,"uSpecular"),
            uAmbient: gl.getUniformLocation(this.program,"uAmbient"),
            uAmbientColor: gl.getUniformLocation(this.program,"uAmbientColor"),
        };

        this.attributesLocation = {
            a_position: gl.getAttribLocation(this.program, "a_position"),
            a_color: gl.getAttribLocation(this.program, "a_color"),
            a_uv: gl.getAttribLocation(this.program, "a_uv"),
            a_normal: gl.getAttribLocation(this.program, "a_normal"),
        };

        gl.bindVertexArray(this.vao);
        initBuffers(gl,this);
        
    }

    setTexture(texture,image){
        this.texture = texture;
        this.textureImage = image;
        initTextures(gl,this);
    }
}


function initBuffers(gl,object){

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(object.attributesLocation.a_position);
    gl.vertexAttribPointer(object.attributesLocation.a_position, 3, gl.FLOAT, false, 0, 0);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(object.attributesLocation.a_normal);
    gl.vertexAttribPointer(object.attributesLocation.a_normal, 3, gl.FLOAT, false, 0, 0);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.uvCoordinates), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(object.attributesLocation.a_uv);
    gl.vertexAttribPointer(object.attributesLocation.a_uv, 2, gl.FLOAT, false, 0, 0);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW); 

}

function initTextures(gl,object){
    let image = object.textureImage;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, object.texture); //Bound to slot 0
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //WebGL has inverted uv coordinates
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
}

