class SceneGraph{
    constructor(){
        this.root = new Node(null,utils.identityMatrix(),true);
    }

    // compute all matrices starting from the root
    computeMatrices(){

        var stack = [this.root];
        var prevMatrix = utils.identityMatrix();
        var node = null;

        while(stack.length > 0){     
            node = (stack.pop());
            if(!node.root){prevMatrix = node.parent.worldMatrix;}
            node.worldMatrix = utils.multiplyMatrices(prevMatrix,node.objMatrix);
            for(let i = 0; i < node.children.length; i++)
                stack.push(node.children[i]);
        }
    }

    drawScene(gl,perspectiveMatrix,viewMatrix,directionalLightColor,directionalLightDir,eyePos, pointLightPosition, pointLightColor, pointLightDecay, pointLightTarget,shinyFactor){

        var stack = [this.root];
        var node = null;

        let dirLightTransformed = utils.multiplyMatrix3Vector3(utils.sub3x3from4x4((viewMatrix)), directionalLightDir);
        var pointTransformed = utils.multiplyMatrixVector(viewMatrix, [pointLightPosition[0],pointLightPosition[1],pointLightPosition[2],1.0]);

        while(stack.length > 0){     
            node = stack.pop();
            if(node != this.root){
                let obj = node.object; 
                gl.useProgram(obj.program);
                gl.bindVertexArray(obj.vao);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, obj.texture);

                worldMatrix = node.worldMatrix;
            
                projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, utils.multiplyMatrices(viewMatrix, worldMatrix));
                let worldViewMatrix = utils.multiplyMatrices(viewMatrix,worldMatrix);
                let normalMatrix = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix));

                
                // LIGHT POSITION IS NOT USED --> DIRECTIONAL NOT SPOT 
                //let lightPosTransformed = utils.sub3x3from4x4(viewMatrix),
                // normal matrix for vs 
                // UNIFORM UPLOAD
                // texture sampler
                gl.uniform1i(obj.uniformLocations.sampler, 0);
                // camera position
                gl.uniform3fv(obj.uniformLocations.uEyePos,eyePos);

                // WORLD - WORLDVIEW - PERSPECTIVE - NORMAL TRANSFORMED FOR CAMERA SPACE
                gl.uniformMatrix4fv(obj.uniformLocations.worldMatrix, gl.FALSE, utils.transposeMatrix(worldMatrix)); 
                gl.uniformMatrix4fv(obj.uniformLocations.projectionMatrix, gl.FALSE, utils.transposeMatrix(projectionMatrix));
                gl.uniformMatrix4fv(obj.uniformLocations.worldViewMatrix, gl.FALSE, utils.transposeMatrix(worldViewMatrix)); 
                gl.uniformMatrix4fv(obj.uniformLocations.normalMatrix, gl.FALSE, utils.transposeMatrix(normalMatrix)); 
                
                // DIRECTIONAL LIGHT PARAMETERS 
                //gl.uniform3fv(obj.uniformLocations.uLightDir,directionalLightDir);
                gl.uniform3fv(obj.uniformLocations.uLightDir,dirLightTransformed);
                gl.uniform4fv(obj.uniformLocations.uLightColor,directionalLightColor);

                // POINT LIGHT PARAMETERS 
    
                gl.uniform3fv(obj.uniformLocations.uPointLightPos,  pointTransformed.slice(0,3));
                gl.uniform4fv(obj.uniformLocations.uPointLightColor,pointLightColor);
                gl.uniform1f(obj.uniformLocations.uPointLightDecay,pointLightDecay);
                gl.uniform1f(obj.uniformLocations.uPointLightTarget,pointLightTarget);
                gl.uniform1f(obj.uniformLocations.shinyFactor,shinyFactor);
                
                gl.uniform1i(obj.uniformLocations.uSpecular,specular);

                gl.drawElements(gl.TRIANGLES, obj.indices.length, gl.UNSIGNED_SHORT, 0 );
            }
            for(let i = 0; i < node.children.length; i++)
                stack.push(node.children[i]);
        }
        first = 0;
    }

}