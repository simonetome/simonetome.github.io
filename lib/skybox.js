
class SkyBox{

    constructor (gl,program){
        this.gl = gl;
        this.program = program;
        this.vao = gl.createVertexArray(this.program);
        this.positions = new Float32Array(
            [
                -1, -1,
                 1, -1,
                -1,  1,
                -1,  1,
                 1, -1,
                 1,  1,
            ]
        );
        // Attributes and uniforms location
        this.positionLocation = gl.getAttribLocation(program, "a_position");
        this.skyboxLocation = gl.getUniformLocation(program, "u_skybox");
        this.viewDirectionProjectionInverseLocation = gl.getUniformLocation(program, "u_viewDirectionProjectionInverse");

        // Set geometry and buffers 
        gl.bindVertexArray(this.vao);
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);


        // Texture creation 
        var textureFolder = "textures/skybox/";
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        const faceInfos = [
            {
              target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
              url: textureFolder+'right.png',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
              url: textureFolder+'left.png',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
              url: textureFolder+'top.png',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
              url: textureFolder+'bottom.png',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
              url: textureFolder+'front.png',
            },
            {
              target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
              url: textureFolder+'back.png',
            },
          ];
          faceInfos.forEach((faceInfo) => {
            const {target, url} = faceInfo;
        
            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
        
            // setup each face so it's immediately renderable
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
        
            // Asynchronously load an image
            const image = new Image();
            image.src = url;
            image.addEventListener('load', function() {
              // Now that the image has loaded make copy it to the texture.
              gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
              gl.texImage2D(target, level, internalFormat, format, type, image);
              gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
          });
          gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    }

    draw(gl){
        // perspectiveMatrix, viewMatrix are globals 
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
    
        // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);

        let fieldOfViewRadians = utils.degToRad(fieldOfViewDeg);
        let aspect = 16/9;
        var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

        var viewDirectionProjectionMatrix =
        m4.multiply(projectionMatrix, viewMatrix);
        var viewDirectionProjectionInverseMatrix =
        m4.inverse(viewDirectionProjectionMatrix);

        gl.uniformMatrix4fv(this.viewDirectionProjectionInverseLocation, false,(viewDirectionProjectionInverseMatrix));
        gl.uniform1i(this.skyboxLocation, 0);
        gl.depthFunc(gl.LEQUAL);
        gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

    }
    

}


