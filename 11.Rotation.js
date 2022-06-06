const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
  throw new Error("WebGL not supported");
}
webgl.clearColor( 1.0, 1.0, 1.0, 1.0); //White
webgl.clear(webgl.COLOR_BUFFER_BIT);
var r = 0.2; //radius

var veighttriangles = [
  //1stt
  0.0,0.0, 
  r,0.0, 
  r*Math.cos(Math.PI/4),r*Math.sin(Math.PI/4), 
  
  //2ndt
  0.0,0.0,  
  r*Math.cos(Math.PI/4),r*Math.sin(Math.PI/4),
  r*Math.cos(2*Math.PI/4),r*Math.sin(2*Math.PI/4),

   //3rdt
   0.0,0.0,  
   r*Math.cos(2*Math.PI/4),r*Math.sin(2*Math.PI/4),
   r*Math.cos(3*Math.PI/4),r*Math.sin(3*Math.PI/4),

   //4tht
   0.0,0.0,  
   r*Math.cos(3*Math.PI/4),r*Math.sin(3*Math.PI/4),
   r*Math.cos(4*Math.PI/4),r*Math.sin(4*Math.PI/4),

    //5tht
  0.0,0.0,  
  r*Math.cos(4*Math.PI/4),r*Math.sin(4*Math.PI/4),
  r*Math.cos(5*Math.PI/4),r*Math.sin(5*Math.PI/4),

   //6tht
   0.0,0.0,  
   r*Math.cos(5*Math.PI/4),r*Math.sin(5*Math.PI/4),
   r*Math.cos(6*Math.PI/4),r*Math.sin(6*Math.PI/4),

  //7tht
  0.0,0.0,  
  r*Math.cos(6*Math.PI/4),r*Math.sin(6*Math.PI/4),
  r*Math.cos(7*Math.PI/4),r*Math.sin(7*Math.PI/4),

   //8tht
   0.0,0.0,  
   r*Math.cos(7*Math.PI/4),r*Math.sin(7*Math.PI/4),
   r*Math.cos(8*Math.PI/4),r*Math.sin(8*Math.PI/4)
];

const vertices = new Float32Array(veighttriangles);

var eightcolours = [
     //violet
     0.3,0.0,1.0,1.0,
     0.3,0.0,1.0,1.0,
     0.3,0.0,1.0,1.0,
 
     //yellow
     1.0, 1.0, 0.0, 1.0,
     1.0, 1.0, 0.0, 1.0,
     1.0, 1.0, 0.0, 1.0,

     //green
     0.0, 1.0, 0.0, 1.0,
     0.0, 1.0, 0.0, 1.0,
     0.0, 1.0, 0.0, 1.0,
 
     //red
     1.0, 0.0, 0.0, 1.0,
     1.0, 0.0, 0.0, 1.0,
     1.0, 0.0, 0.0, 1.0,

     //black
     0.0, 0.0, 0.0, 1.0,
     0.0, 0.0, 0.0, 1.0,
     0.0, 0.0, 0.0, 1.0,
 
     //blue
     0.0, 0.0, 1.0, 1.0,
     0.0, 0.0, 1.0, 1.0,
     0.0, 0.0, 1.0, 1.0,
 
     //cyan
     0.0, 1.0, 1.0, 1.0,
     0.0, 1.0, 1.0, 1.0,
     0.0, 1.0, 1.0, 1.0,
 
     //Magenta
     1.0, 0.0, 1.0, 1.0,
     1.0, 0.0, 1.0, 1.0,
     1.0, 0.0, 1.0, 1.0
 
];

const colours = new Float32Array(eightcolours);

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
       uniform float a;

       void main(){
           /*for scaling along xy*/
          //gl_Position.x = scale*pos.x + xshift;
          //gl_Position.y = scale*pos.y +yshift;
          /*for rotating along z*/
          gl_Position.x = cos(a)*pos.x - sin(a)*pos.y;
          gl_Position.y = sin(a)*pos.x + cos(a)*pos.y;
          gl_Position.z = 0.0;
          gl_Position.w = 1.0; //x/w 
          /*for shifting along xy*/
          //gl_Position = vec4( pos, 0, 1) + vec4(xshift,yshift,0,0);
          vcolours = colours;}`
);
webgl.compileShader(vertexShader);
if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)){
   console.error("ERROR compiling vertex shader!", webgl.getShaderInfoLog(vertexShader))}

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(
  fragmentShader,
  `precision mediump float; 
       varying vec4 vcolours; 
       void main(){ gl_FragColor = vcolours;}`
);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)){
    console.error("ERROR compiling fragment shader!", webgl.getShaderInfoLog(fragmentShader));}

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`);
console.log(positionLocation);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

const colourbuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, colourbuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, colours, webgl.STATIC_DRAW);

const coloursLocation = webgl.getAttribLocation(program, `colours`);
console.log(coloursLocation);
webgl.enableVertexAttribArray(coloursLocation);
webgl.vertexAttribPointer(coloursLocation, 4, webgl.FLOAT, false, 0, 0);

webgl.useProgram(program);
let xs = 0.0;
let ys = 0.0;
let scale = 1.0;
let xs2 = 0.5;
let ys2 = 0.5;
let k = 0.0;
let kinc = 0.0;
const incr = 0.025;
let bDecr = false;
let angle = 0.001;

//passing the values from  the js app to the variable 'uniform'
webgl.uniform1f(webgl.getUniformLocation(program, `xshift`), xs);
webgl.uniform1f(webgl.getUniformLocation(program, `yshift`), ys);
webgl.uniform1f(webgl.getUniformLocation(program, `xshift`), xs2);
webgl.uniform1f(webgl.getUniformLocation(program, `yshift`), ys2);
webgl.uniform1f(webgl.getUniformLocation(program, `scale`), scale);
webgl.uniform1f(webgl.getUniformLocation(program, `a`), angle);
webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 2);

draw();
document.onkeydown = function (event) {
  switch (event.key) {
   
    //For the secondOctagon:
    case "ArrowDown": //Down
      ys2 -= 0.01;
      break;
    case "ArrowLeft": //Left
      xs2 -= 0.01;
      break;
    case "ArrowRight": //Down
      xs2 += 0.01;
      break;
    case "ArrowUp": //Up
      ys2 += 0.01;
      break;

    //For both secondOctagons:  
    case "i": //ZOOM in
      scale -= 0.1;
      console.log(scale);
      break;
    case "o": //ZOOM out
      scale += 0.1;
      console.log(scale);
      break;
  }
};

function draw() {
  if (bDecr) xs -= incr;
  else xs += incr;

  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.uniform1f(webgl.getUniformLocation(program, `xshift`), xs);
  webgl.uniform1f(webgl.getUniformLocation(program, `yshift`), ys);
  webgl.uniform1f(webgl.getUniformLocation(program, `scale`), scale);
  webgl.uniform1f(webgl.getUniformLocation(program, `a`), angle);
  webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 2);

  webgl.uniform1f(webgl.getUniformLocation(program, `xshift`), xs2);
  webgl.uniform1f(webgl.getUniformLocation(program, `yshift`), ys2);
  kinc++;
  angle -=0.05;
  if (kinc % 30 == 0) {
    k = 1 - k;
  }
  webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 2 - 1.0);
  
  // For the firstOctagon to bounce: 

  //if we reach the right side, we decrement
  if (xs > 1.0) bDecr = true;

  //if we reach the left side we icrement
  if (xs < -1.0) bDecr = false;

  window.requestAnimationFrame(draw);
}