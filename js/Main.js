//-------------------------------------------------------
// Constant Variables
//-------------------------------------------------------
const c_ipDist = 0.03200000151991844; // inter pupil

//-------------------------------------------------------
// Global Variables
//-------------------------------------------------------
var g_effect;
var g_material;
var g_controls;

var g_currentBoost;
var g_facing;
var g_cellBoost;
var g_invCellBoost;
var g_phoneOrient;

var g_renderer;
var g_screenResolution;
var g_vr = 0;
var g_leftBoost, g_rightBoost;

//-------------------------------------------------------
// Scene Variables
//-------------------------------------------------------
var scene;
var mesh;
var camera;
var stats;
//-------------------------------------------------------
// Sets up precalculated values
//-------------------------------------------------------
var gens;
var invGens;

//-------------------------------------------------------
// Sets up the global objects
//-------------------------------------------------------
var lightPositions = [];
var lightIntensities = [];
var globalObjectBoost;

//-------------------------------------------------------
// Sets up the scene
//-------------------------------------------------------
var init = function() {
    //Setup our THREE scene--------------------------------
    scene = new THREE.Scene();
    var canvas  = document.createElement('canvas');
    var context = canvas.getContext('webgl2');
    g_renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
    document.body.appendChild(g_renderer.domElement);
    g_screenResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    g_effect = new THREE.VREffect(g_renderer);
    camera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow(2,53),1);
    g_controls = new THREE.Controls();
    g_rotation = new THREE.Quaternion();
    initGeometry();
    initObjects();
    g_phoneOrient = [null, null, null];

    loadShaders();
    stats = new Stats(); stats.showPanel(1); stats.showPanel(2); stats.showPanel(0); document.body.appendChild(stats.dom);
}

var mainFrag;

var loadShaders = function(){ //Since our shader is made up of strings we can construct it from parts
  var loader = new THREE.FileLoader();
  loader.setResponseType('text');
  loader.load('shaders/raymarch.glsl',function(main){
    mainFrag = main;
    setupMaterial(main);
    g_effect.setSize(g_screenResolution.x, g_screenResolution.y);

    //Setup a "quad" to render on-------------------------
    var geom = new THREE.BufferGeometry();
    var vertices = new Float32Array([
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
         1.0,  1.0, 0.0,

        -1.0, -1.0, 0.0,
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0
        ]);
    geom.addAttribute('position',new THREE.BufferAttribute(vertices,3));
    mesh = new THREE.Mesh(geom, g_material);
    scene.add(mesh);
    animate();
    });
}


//-------------------------------------------------------
// Where our scene actually renders out to screen
//-------------------------------------------------------
var animate = function(){
  stats.begin();
  g_controls.update();
  THREE.VRController.update();
  g_effect.render(scene, camera, animate);
  stats.end();
}

//-------------------------------------------------------
// Where the magic happens
//-------------------------------------------------------
init();
