const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`); 
if(!webgl){throw new Error("WebGL not supported!");}
webgl.clearColor(0.3,0.0,1.0,1.0); //Magenta colour for the canvas
webgl.clear(webgl.COLOR_BUFFER_BIT);
webgl.enable(webgl.DEPTH_TEST);
var r = 0.25; 

var box = new Float32Array([
    
    //1.FRONT FACE RED
    -r,r,r, 1,0,0,  -r,-r,r, 1,0,0,  r,-r,r, 1,0,0, //1st Triang
    r,r,r,  1,0,0,  -r,r,r, 1,0,0,   r,-r,r, 1,0,0, //2nd Triang
    
    //2.RIGHT FACE GREEN
    r,r,r,  0,1,0,  r,-r,r, 0,1,0,  r,r,-r,  0,1,0, //1st Triang
    r,-r,r, 0,1,0,  r,r,-r, 0,1,0,  r,-r,-r, 0,1,0, //2nd Triang

    //3.BACK FACE Magenta
    -r,r,-r, 1,0,1,  -r,-r,-r, 1,0,1,  r,-r,-r, 1,0,1, //1st Triang
    r,r,-r,  1,0,1,  -r,r,-r,  1,0,1,  r,-r,-r, 1,0,1, //2nd Triang

    //4.LEFT FACE YELLOW
    -r,r,r,  1,1,0,  -r,-r,r, 1,1,0,  -r,r,-r,   1,1,0, //1st Triang
    //-r,-r,r, 1,1,1,  -r,r,-r, 1,1,1,  -r,-r,-r,  1,1,1, //2nd Triang
    -r,-r,r, 1,1,0,  -r,r,-r, 1,1,0,  -r,-r,-r,  1,1,0, //2nd Triang

   //5.BOTTOM FACE BLUE
   -r,-r,r,  0,0,1,  r,-r,r, 0,0,1,  -r,-r,-r, 0,0,1, //1st Triang
   -r,-r,-r, 0,0,1,  r,-r,-r, 0,0,1,  r,-r,r,   0,0,1, //2nd Triang

    //6.TOP FACE CYAN
    -r,r,r, 0,1,1,   r,r,r, 0,1,1,  -r,r,-r, 0,1,1, //1st Triang
    -r,r,-r, 0,1,1,  r,r,-r, 0,1,1,  r,r,r,  0,1,1  //2nd Triang

]);

//This buffer is for POS (VERTICES)
const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, box, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vertexShader,
`attribute vec3 pos;
attribute vec3 colour;
varying vec3 fragcolour;
uniform float a;

void main() { 
    //ROTATION ALONG THE Z - AXIS
    /* gl_Position.x = cos(a)*pos.x -sin(a)*pos.y;
    gl_Position.y = sin(a)*pos.x +cos(a)*pos.y;
    gl_Position.z = pos.z;*/

    /* //ROTATION ALONG THE X - AXIS
    gl_Position.y = pos.y*cos(a) -pos.z*sin(a);
    gl_Position.z = pos.y*sin(a) +pos.z*cos(a);
    gl_Position.x = pos.x;*/

    //ROTATION ALONG THE Y - AXIS
     gl_Position.x = pos.z*cos(a) -pos.x*sin(a);
    gl_Position.z = pos.z*sin(a) +pos.x*cos(a);
    gl_Position.y =pos.y;
    

    gl_Position.w = 1.0; //x/w
    fragcolour = colour; }`);
webgl.compileShader(vertexShader);
if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)){
   console.error("ERROR compiling vertex shader!", webgl.getShaderInfoLog(vertexShader))}

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fragmentShader,
`precision mediump float; 
varying vec3 fragcolour;
void main() { gl_FragColor = vec4(fragcolour,1.0); }`);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)){
    console.error("ERROR compiling fragment shader!", webgl.getShaderInfoLog(fragmentShader));}

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 6*4, 0);
//Float32Array.BYTES_PER_ELEMENT =4
const coloursLocation = webgl.getAttribLocation(program, `colour`);
webgl.enableVertexAttribArray(coloursLocation);
webgl.vertexAttribPointer(coloursLocation, 3, webgl.FLOAT, false, 6*4, 3*4);
  
webgl.useProgram(program);
 
let angle = 0.001;

draw();

function draw(){
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniform1f(webgl.getUniformLocation(program, `a`), angle);
    webgl.drawArrays(webgl.TRIANGLES, 0, box.length/6);
    angle +=0.01;
    window.requestAnimationFrame(draw);
    
}

/*
function matmult(r,a,b) {

 r[0]  = a[0]*b[0]  + a[1]*b[4]  + a[2]*b[8]   + a[3]*b[12];  
 r[1]  = a[0]*b[1]  + a[1]*b[5]  + a[2]*b[9]   + a[3]*b[13];  
 r[2]  = a[0]*b[2]  + a[1]*b[6]  + a[2]*b[10]  + a[3]*b[14];  
 r[3]  = a[0]*b[3]  + a[1]*b[7]  + a[2]*b[11]  + a[3]*b[14];   
 r[4]  = a[4]*b[0]  + a[5]*b[4]  + a[6]*b[8]   + a[7]*b[12];  
 r[5]  = a[4]*b[1]  + a[5]*b[5]  + a[6]*b[9]   + a[7]*b[13];  
 r[6]  = a[4]*b[2]  + a[5]*b[6]  + a[6]*b[10]  + a[7]*b[14];  
 r[7]  = a[4]*b[3]  + a[5]*b[7]  + a[6]*b[11]  + a[7]*b[14]; 
 r[12] = a[12]*b[0] + a[13]*b[4] + a[14]*b[8]  + a[15]*b[12];  
 r[13] = a[12]*b[1] + a[13]*b[5] + a[14]*b[9]  + a[15]*b[13];  
 r[14] = a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14];  
 r[15] = a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15]; 


}*/



/*


  model[0]  = model[0]*translate[0]  + model[1]*b[4]  + model[2]*b[8]   + model[3]*b[12];  
    model[1]  = model[0]*translate[1]  + model[1]*b[5]  + model[2]*b[9]   + model[3]*b[13];  
    model[2]  = model[0]*translate[2]  + model[1]*b[6]  + model[2]*b[10]  + model[3]*b[14];  
    model[3]  = model[0]*translate[3]  + model[1]*b[7]  + model[2]*b[11]  + model[3]*b[14];   
    model[4]  = model[4]*translate[0]  + model[5]*b[4]  + model[6]*b[8]   + model[7]*b[12];  
    model[5]  = model[4]*translate[1]  + model[5]*b[5]  + model[6]*b[9]   + model[7]*b[13];  
    model[6]  = model[4]*translate[2]  + model[5]*b[6]  + model[6]*b[10]  + model[7]*b[14];  
    model[7]  = model[4]*translate[3]  + model[5]*b[7]  + model[6]*b[11]  + model[7]*b[14]; 
    model[12] = model[12]*translate[0] + model[13]*b[4] + model[14]*b[8]  + model[15]*b[12];  
    model[13] = model[12]*translate[1] + model[13]*b[5] + model[14]*b[9]  + model[15]*b[13];  
    model[14] = model[12]*translate[2] + model[13]*b[6] + model[14]*b[10] + model[15]*b[14];  
    model[15] = model[12]*b[3] + model[13]*b[7] + model[14]*b[11] + model[15]*b[15]; 
   






const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`); 
if(!webgl){throw new Error("WebGL not supported!");}
webgl.clearColor(0.3,0.0,1.0,1.0); //Magenta colour for the canvas
webgl.clear(webgl.COLOR_BUFFER_BIT);
webgl.enable(webgl.DEPTH_TEST);
var r = 0.25; 

var box = new Float32Array([
    
    //1.FRONT FACE RED
    -r,r,r, 1,0,0,  -r,-r,r, 1,0,0,  r,-r,r, 1,0,0, //1st Triang
    r,r,r,  1,0,0,  -r,r,r, 1,0,0,   r,-r,r, 1,0,0, //2nd Triang
    
    //2.RIGHT FACE GREEN
    r,r,r,  0,1,0,  r,-r,r, 0,1,0,  r,r,-r,  0,1,0, //1st Triang
    r,-r,r, 0,1,0,  r,r,-r, 0,1,0,  r,-r,-r, 0,1,0, //2nd Triang

    //3.BACK FACE Magenta
    -r,r,-r, 1,0,1,  -r,-r,-r, 1,0,1,  r,-r,-r, 1,0,1, //1st Triang
    r,r,-r,  1,0,1,  -r,r,-r,  1,0,1,  r,-r,-r, 1,0,1, //2nd Triang

    //4.LEFT FACE YELLOW
    -r,r,r,  1,1,0,  -r,-r,r, 1,1,0,  -r,r,-r,   1,1,0, //1st Triang
    -r,-r,r, 1,1,0,  -r,r,-r, 1,1,0,  -r,-r,-r,  1,1,0, //2nd Triang

   //5.BOTTOM FACE BLUE
   -r,-r,r,  0,0,1,  r,-r,r, 0,0,1,  -r,-r,-r, 0,0,1, //1st Triang
   -r,-r,-r, 0,0,1,  r,-r,-r, 0,0,1,  r,-r,r,   0,0,1, //2nd Triang

    //6.TOP FACE CYAN
    -r,r,r, 0,1,1,   r,r,r, 0,1,1,  -r,r,-r, 0,1,1, //1st Triang
    -r,r,-r, 0,1,1,  r,r,-r, 0,1,1,  r,r,r,  0,1,1  //2nd Triang

]);

//This buffer is for POS (VERTICES)
const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, box, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vertexShader,
`attribute vec3 pos;
attribute vec3 colours;
varying vec3 vcolours;
uniform float a;

void main() { 
    //ROTATION ALONG THE Z - AXIS
    /* gl_Position.x = cos(a)*pos.x - sin(a)*pos.y;
    gl_Position.y = sin(a)*pos.x + cos(a)*pos.y;
    gl_Position.z = pos.z;*/

    //ROTATION ALONG THE X - AXIS
    /* gl_Position.y = pos.y*cos(a) - pos.z*sin(a);
    gl_Position.z = pos.y*sin(a) + pos.z*cos(a);
    gl_Position.x = pos.x;*

    //ROTATION ALONG THE Y - AXIS
     gl_Position.x = pos.z*cos(a) - pos.x*sin(a);
    gl_Position.z = pos.z*sin(a) + pos.x*cos(a);
    gl_Position.y = pos.y; 

    gl_Position.w = 1.0; //x/w
    vcolours = colours; }`);
webgl.compileShader(vertexShader);
if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)){
    console.error("ERROR compiling vertex shader!", webgl.getShaderInfoLog(vertexShader));
}

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fragmentShader,
`precision mediump float; 
varying vec3 vcolours;
void main() { gl_FragColor = vec4(vcolours,1.0); }`);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)){
    console.error("ERROR compiling fragment shader!", webgl.getShaderInfoLog(fragmentShader));
}

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 6*4, 0);
//Float32Array.BYTES_PER_ELEMENT =4
const coloursLocation = webgl.getAttribLocation(program, `colours`);
webgl.enableVertexAttribArray(coloursLocation);
webgl.vertexAttribPointer(coloursLocation, 3, webgl.FLOAT, false, 6*4, 3*4);
  
webgl.useProgram(program);
 
let angle = 0.001;

draw();

function draw(){
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniform1f(webgl.getUniformLocation(program, `a`), angle);
    webgl.drawArrays(webgl.TRIANGLES, 0, box.length/6);
    angle +=0.01;
    window.requestAnimationFrame(draw);
    
}*/