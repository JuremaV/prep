const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`); 
if(!webgl){throw new Error("WebGL not supported!");}
webgl.clearColor(1.0,0.0,1.0,0.9); //Magenta colour for the canvas
webgl.clear(webgl.COLOR_BUFFER_BIT);
var r = 0.3 //Radius

var trianglesVertices = [
    
    //1sttriang
    0.0,0.0,
    r,0.0,
    r*Math.cos(Math.PI/4),r*Math.sin(Math.PI/4),
    //2ndtriang
    0.0,0.0,
    r*Math.cos(Math.PI/4),r*Math.sin(Math.PI/4),
    r*Math.cos(2*Math.PI/4),r*Math.sin(2*Math.PI/4),
    //3rdtriang
    0.0,0.0,
    r*Math.cos(2*Math.PI/4),r*Math.sin(2*Math.PI/4),
    r*Math.cos(3*Math.PI/4),r*Math.sin(3*Math.PI/4),
    //4thtriang
    0.0,0.0,
    r*Math.cos(3*Math.PI/4),r*Math.sin(3*Math.PI/4),
    r*Math.cos(4*Math.PI/4),r*Math.sin(4*Math.PI/4),
    //5thtriang
    0.0,0.0,
    r*Math.cos(4*Math.PI/4),r*Math.sin(4*Math.PI/4),
    r*Math.cos(5*Math.PI/4),r*Math.sin(5*Math.PI/4),
    //6thtriang
    0.0,0.0,
    r*Math.cos(5*Math.PI/4),r*Math.sin(5*Math.PI/4),
    r*Math.cos(6*Math.PI/4),r*Math.sin(6*Math.PI/4),
    //7thtriang
    0.0,0.0,
    r*Math.cos(6*Math.PI/4),r*Math.sin(6*Math.PI/4),
    r*Math.cos(7*Math.PI/4),r*Math.sin(7*Math.PI/4),
    //8thtriang
    0.0,0.0,
    r*Math.cos(7*Math.PI/4),r*Math.sin(7*Math.PI/4),
    r*Math.cos(8*Math.PI/4),r*Math.sin(8*Math.PI/4),
    
];
 const vertices = new Float32Array(trianglesVertices);
 
var randomColours = [
    
    //1th
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,

    //2th
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,

    //3th
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,

    //4th
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,

    //5th
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,,

    //6th
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,

    //7th
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,

    //8th
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
    Math.random(), Math.random(), Math.random(), 1.0,
]; 
const colours = new Float32Array(randomColours);

//This buffer is for POS (VERTICES)
const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vertexShader,
`attribute vec2 pos;
attribute vec4 colours;
varying vec4 vcolours;
void main() { gl_Position = vec4( pos, 0, 1);
vcolours = colours; }`);
webgl.compileShader(vertexShader);
if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)){
    console.error("ERROR compiling vertex shader!", webgl.getShaderInfoLog(vertexShader))}

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fragmentShader, 
`precision mediump float;
varying vec4 vcolours;
void main() { gl_FragColor = vcolours; }`);
webgl.compileShader(fragmentShader);
if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)){
    console.error("ERROR compiling fragment shader!", webgl.getShaderInfoLog(fragmentShader));}

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

//For POS
const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
//vertexAttribPointer(index, size, type, normalized, stride, offset);/*

//This buffer is for COLOURS
const colourbuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, colourbuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, colours, webgl.STATIC_DRAW);

//For COLOURS
const coloursLocation = webgl.getAttribLocation(program, `colours`);
webgl.enableVertexAttribArray(coloursLocation);
webgl.vertexAttribPointer(coloursLocation, 4, webgl.FLOAT,false, 0, 0);
//vertexAttribPointer(index, size, type, normalized, stride, offset);


webgl.useProgram(program);
webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length/2);
//drawArrays(mode, first, count);