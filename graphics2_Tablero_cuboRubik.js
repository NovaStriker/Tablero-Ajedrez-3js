

var backgroundScene = "#002233"
var selected_object = null;

// scene, camera and renderer --> render the scene with camera.
var scene = new THREE.Scene();
scene.background = new THREE.Color(backgroundScene);
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,500);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// to orbit with mouse
var mouseOrbit = new THREE.OrbitControls(camera, renderer.domElement);

// tablero
var tablero = new THREE.Group();
var tile_width=2;
var tile_color="#ffffff";
var addTablero = function(){
    var tile_geometry = new THREE.BoxGeometry(tile_width,tile_width/10,tile_width);
    var black_material = new THREE.MeshPhongMaterial({ color:"#000000", side: THREE.DoubleSide, flatShading: true });   //fixed color
    var color_material = new THREE.MeshPhongMaterial({ color:tile_color, side: THREE.DoubleSide, flatShading: true });  //to change with gui
    var black_color = -1;
    //Chess Table has 64 tiles, 8 rows, 8 columns
    for(var i = 0; i < 8; i++){
        if (i % 2 == 0) { black_color = -1 }
        else { black_color = 1 };
        for(var j = 0; j < 8; j++){
            var material;
            if(black_color == 1){ material = black_material; }   // iterate black and white
            else{ material = color_material; }
            var tile = new THREE.Mesh( tile_geometry, material );
            tile.position.x = (-4 + j) * tile_width;
            tile.position.z = (-4 + i) * tile_width;
            tablero.add(tile);
            black_color *= -1; } }
    scene.add(tablero); }

var ambient_light, white_light;               // white
var red_light, green_light, blue_light;       // RGB
var cyan_light, magenta_light, yellow_light;  // CMY

var addLights = function( distanceFromCenter ){
    white_up_light = new THREE.SpotLight("ffffff", 1);
    white_up_light.position.set(0 - tile_width, 20, 0 - tile_width);
    scene.add(white_up_light);

    white_down_light = new THREE.SpotLight("#ffffff",1);
    white_down_light.position.set(0 - tile_width, -20, 0 - tile_width);
    scene.add(white_down_light);

    ambient_light = new THREE.AmbientLight("#ffffff",0.4 ); // soft white light
    scene.add(ambient_light);
}

var prisma, esfera, piramide, toroide;
var figurasCreadas = false;



//Objeto complejo: Cubo Rubik
var cuboRubik = new THREE.Group();
var cube_width = tile_width*0.75;
for(var i= 0;i<3;i++){
    for(var j=0;j<3;j++){
        for(var k=0;k<3;k++){
            let geometryC = new THREE.BoxGeometry(cube_width, cube_width, cube_width );
            if(i==0){
                //pintar abajo
                geometryC.faces[ 6 ].color.setHex(0x4b3621);
                geometryC.faces[ 7 ].color.setHex(0x4b3621);
            }else if(i==2){
                //pintar arriba
                geometryC.faces[ 4 ].color.setHex(0x0000ff);
                geometryC.faces[ 5 ].color.setHex(0x0000ff);
            }
            if(j==0){
                //pintar atras
                geometryC.faces[ 10 ].color.setHex(0xff0000);
                geometryC.faces[ 11 ].color.setHex(0xff0000);
            }else if(j==2){
                //pintar adelante
                geometryC.faces[ 8 ].color.setHex(0xff5500);
                geometryC.faces[ 9 ].color.setHex(0xff5500);
            }
            if(k==0){
                //pintar izq
                geometryC.faces[ 2 ].color.setHex(0x00ff55);
                geometryC.faces[ 3 ].color.setHex(0x00ff55);
            }else if(k==2){
                //pintar der
                geometryC.faces[ 0 ].color.setHex(0xffff00);
                geometryC.faces[ 1 ].color.setHex(0xffff00);
            }
            //let material = new THREE.MeshBasicMaterial( { color: "ffffff",side: THREE.DoubleSide, vertexColors: THREE.FaceColors, flatShading: true} );
            let material = new THREE.MeshLambertMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors} );
            material.light = true;
            let cube = new THREE.Mesh(geometryC, material);
            cube.position.x = ((-1.65 + k) * cube_width)+(((k+1)%2)*(-1+k)*(cube_width/50));
            cube.position.z = ((-1.65 + j) * cube_width)+(((j+1)%2)*(-1+j)*(cube_width/50));
            cube.position.y = ((2 + i) * cube_width)+(((i+1)%2)*(-1+i)*(cube_width/50));
            cuboRubik.add(cube);
        }        
    }
}
scene.add(cuboRubik);

// // load objects
addTablero();
//addFiguras();
distanceFromCenter = 1.75*tile_width;
addLights( distanceFromCenter );
camera.position.set(-1, 4, 16);

var update = function(){ 
 
}
    
function render(){ renderer.render(scene,camera); }
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}
window.addEventListener( 'resize', onWindowResize, false );
var showAnimationLoop = function(){
    requestAnimationFrame(showAnimationLoop);
    update();
    render(); }
showAnimationLoop();
