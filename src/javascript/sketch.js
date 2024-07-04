console.clear();

var ww = window.innerWidth,
  wh = window.innerHeight;

var renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true
});
renderer.setSize(ww, wh);
renderer.setClearColor(0xffffff);

var scene = new THREE.Scene();  

var camera = new THREE.PerspectiveCamera(45, ww / wh, 0.1, 2000);
camera.position.z = 200;

var container = new THREE.Object3D();
scene.add(container);

var objectLines = new THREE.Object3D();
scene.add(objectLines);

// Create a simple circle texture
var canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
var ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.arc(16, 16, 14, 0, 2 * Math.PI);
ctx.fillStyle = 'white';
ctx.fill();

var texture = new THREE.CanvasTexture(canvas);

var mat = new THREE.PointsMaterial({
  color: 0x000000,
  map: texture,
  transparent: true,
  alphaTest: 0.5,
  sizeAttenuation: false
});

var lines = [];
var dotsPerLine = 250;
var amountLines = 500;

function Line(){
  this.geometry = new THREE.BufferGeometry();
  var positions = new Float32Array(dotsPerLine * 3);
  for(var i = 0; i < dotsPerLine; i++){
    positions[i * 3] = (i - dotsPerLine / 2) * 0.4;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }
  this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  this.mesh = new THREE.Points(this.geometry, mat);
  this.length = Math.floor(Math.random() * 100 + 250);
  this.speed = Math.random() * 400 + 200;
  this.mesh.rotation.x = Math.random() * Math.PI;
  this.mesh.rotation.y = Math.random() * Math.PI;
  this.mesh.rotation.z = Math.random() * Math.PI;
}

Line.prototype.update = function(a) {
  var positions = this.geometry.attributes.position.array;
  for(var i = 0; i < dotsPerLine; i++){
    positions[i * 3 + 1] = Math.sin(a/this.speed + i*0.1) * 2.2;
  }
  this.geometry.attributes.position.needsUpdate = true;
};

function init() {
  for(var i=0; i<amountLines; i++) {
    lines.push(new Line());
    objectLines.add(lines[i].mesh);
  }
  
  requestAnimationFrame(render);

  window.addEventListener("resize", onResize);
}

function render(a){
  requestAnimationFrame(render);
  
  objectLines.rotation.y = (a * 0.0001);
  objectLines.rotation.x = (-a * 0.0001);

  for(var i=0; i<amountLines; i++) {
    lines[i].update(a);
  }
  renderer.render(scene, camera);
}

function onResize() {
  ww = window.innerWidth;
  wh = window.innerHeight;
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
  renderer.setSize(ww, wh);
}

// Check if WebGL is available
if (THREE.WEBGL.isWebGLAvailable()) {
  init();
} else {
  var warning = THREE.WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}