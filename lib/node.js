
// node of the Scene Graph 
class Node{

    constructor (object,objMatrix,root){
        // initial position, useful for checking block collision easily
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.objMatrix = objMatrix;    // matrix relative to the object 
        this.worldMatrix = utils.identityMatrix();  // matrix computed recursively  
        this.object = object; // object to draw, attached to the node
        this.children = []; // array of children Nodes 
        this.root = root;   // root is boolean 
        this.parent = null;
        if(root){this.worldMatrix = objMatrix;} // the root will be initialized with identity matrix 
    }

    addChild(node){
        this.children.push(node);
        node.parent = this;
    }

    delChild(node){
        this.children.splice(this.children.indexOf(node),1);
    }
}
