const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not supported!");
}
webgl.clearColor(1.0, 0.0, 1.0, 0.9); //Magenta colour for the canvas
webgl.clear(webgl.COLOR_BUFFER_BIT);
var r = 0.3; //radius

var trianglesVertices = [
  //1sttriang
  0.0,
  0.0,
  r,
  0.0,
  r * Math.cos(Math.PI / 4),
  r * Math.sin(Math.PI / 4),
  //2ndtriang
  0.0,
  0.0,
  r * Math.cos(Math.PI / 4),
  r * Math.sin(Math.PI / 4),
  r * Math.cos((2 * Math.PI) / 4),
  r * Math.sin((2 * Math.PI) / 4),
  //3rdtriang
  0.0,
  0.0,
  r * Math.cos((2 * Math.PI) / 4),
  r * Math.sin((2 * Math.PI) / 4),
  r * Math.cos((3 * Math.PI) / 4),
  r * Math.sin((3 * Math.PI) / 4),
  //4thtriang
  0.0,
  0.0,
  r * Math.cos((3 * Math.PI) / 4),
  r * Math.sin((3 * Math.PI) / 4),
  r * Math.cos((4 * Math.PI) / 4),
  r * Math.sin((4 * Math.PI) / 4),
  //5thtriang
  0.0,
  0.0,
  r * Math.cos((4 * Math.PI) / 4),
  r * Math.sin((4 * Math.PI) / 4),
  r * Math.cos((5 * Math.PI) / 4),
  r * Math.sin((5 * Math.PI) / 4),
  //6thtriang
  0.0,
  0.0,
  r * Math.cos((5 * Math.PI) / 4),
  r * Math.sin((5 * Math.PI) / 4),
  r * Math.cos((6 * Math.PI) / 4),
  r * Math.sin((6 * Math.PI) / 4),
  //7thtriang
  0.0,
  0.0,
  r * Math.cos((6 * Math.PI) / 4),
  r * Math.sin((6 * Math.PI) / 4),
  r * Math.cos((7 * Math.PI) / 4),
  r * Math.sin((7 * Math.PI) / 4),
  //8thtriang
  0.0,
  0.0,
  r * Math.cos((7 * Math.PI) / 4),
  r * Math.sin((7 * Math.PI) / 4),
  r * Math.cos((8 * Math.PI) / 4),
  r * Math.sin((8 * Math.PI) / 4),
];
const vertices = new Float32Array(trianglesVertices);

var multipleColours = [
     //violet
     0.3,0.0,1.0,1.0,
     0.3,0.0,1.0,1.0,
     0.3,0.0,1.0,1.0,
 
     //yellow
     1.0, 1.0, 0.0, 1.0,
     1.0, 1.0, 0.0, 1.0,
     1.0, 1.0, 0.0, 1.0,
 
     //red
     1.0, 0.0, 0.0, 1.0,
     1.0, 0.0, 0.0, 1.0,
     1.0, 0.0, 0.0, 1.0,
 
     //blue
     0.0, 0.0, 1.0, 1.0,
     0.0, 0.0, 1.0, 1.0,
     0.0, 0.0, 1.0, 1.0,
 
     //cyan
     0.0, 1.0, 1.0, 1.0,
     0.0, 1.0, 1.0, 1.0,
     0.0, 1.0, 1.0, 1.0,
 
     //black
     0.0, 0.0, 0.0, 1.0,
     0.0, 0.0, 0.0, 1.0,
     0.0, 0.0, 0.0, 1.0,
 
     //white
     1.0, 1.0, 1.0, 1.0,
     1.0, 1.0, 1.0, 1.0,
     1.0, 1.0, 1.0, 1.0,
 
     //green
     0.0, 1.0, 0.0, 1.0,
     0.0, 1.0, 0.0, 1.0,
     0.0, 1.0, 0.0, 1.0
];
const colours = new Float32Array(multipleColours);

//This buffer is for POS (VERTICES)
const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(
  vertexShader,
  `attribute vec2 pos;
attribute vec4 colours;
varying vec4 vcolours;
uniform float xshift;
uniform float yshift;
uniform float scale;
void main() { 
    gl_Position.x = scale*pos.x + xshift;
    gl_Position.y = scale*pos.y + yshift;
    gl_Position.z = 0.0;
    gl_Position.w = 1.0;
    vcolours = colours; }`
);
webgl.compileShader(vertexShader);
if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)){
   console.error("ERROR compiling vertex shader!", webgl.getShaderInfoLog(vertexShader))}

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `precision mediump float;
varying vec4 vcolours;
void main() { gl_FragColor = vcolours; }`
);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)){
   console.error("ERROR compiling fragment shader!", webgl.getShaderInfoLog(fragmentShader));}

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

//For Pos
const positionLocation = webgl.getAttribLocation(program, `pos`);
console.log(positionLocation);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

//This buffer is for COLOURS
const colourbuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, colourbuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, colours, webgl.STATIC_DRAW);

//For COLOURS
const coloursLocation = webgl.getAttribLocation(program, `colours`);
console.log(coloursLocation);
webgl.enableVertexAttribArray(coloursLocation);
webgl.vertexAttribPointer(coloursLocation, 4, webgl.FLOAT, false, 0, 0);

webgl.useProgram(program);

let xs = 0.0;
let ys = 0.0;
let scale = 1.0;


//passing the values from  the js app to the variable 'uniform'
webgl.uniform1f(webgl.getUniformLocation(program, `xshift`), xs);
webgl.uniform1f(webgl.getUniformLocation(program, `yshift`), ys);
webgl.uniform1f(webgl.getUniformLocation(program, `scale`), scale);
webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 2);

draw();
document.onkeydown = function (event) {
  switch (event.key) {
    // For xyshift
    case "ArrowDown":
      console.log("Arrow Down Key.");
      ys = ys - 0.01;
      break;
    case "ArrowLeft":
      console.log("Arrow Left Key.");
      xs = xs - 0.01;
      break;
    case "ArrowRight":
      console.log("Arrow Right Key.");
      xs = xs + 0.01;
      break;
    case "ArrowUp":
      console.log("Arrow Up Key.");
      ys = ys + 0.01;
      break;

      // For scale
    case "i": //zoom in
      console.log(scale);
      scale -= 0.01;
      break;  
    case "o": //zoom out
      console.log(scale);
      scale += 0.01;
      break;   
  }
};

function draw(){
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniform1f(webgl.getUniformLocation(program, `xshift`), xs);
    webgl.uniform1f(webgl.getUniformLocation(program, `yshift`), ys);
    webgl.uniform1f(webgl.getUniformLocation(program, `scale`), scale);
    webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 2);
    window.requestAnimationFrame(draw);
    
};
