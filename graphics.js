
// scene, camera and renderer --> render the scene with camera.
var scene = new THREE.Scene();
var backgroundScene = "#002233"
scene.background = new THREE.Color(backgroundScene);
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,500);
var renderer = new THREE.WebGLRenderer();
var selected_object = null;

var picking_method = 'transform';

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// to orbit with mouse
var mouseOrbit = new THREE.OrbitControls(camera, renderer.domElement);

// tablero
var getMaterial = function(colorDesired){
    let material = new THREE.MeshPhongMaterial({ color:colorDesired, side: THREE.DoubleSide, flatShading: true });
    return material;}

var tablero = new THREE.Group();
var tile_width=2;
var tile_color="#ffffff";




var addTablero = function(){
    var tile_geometry = new THREE.BoxGeometry(tile_width,tile_width/10,tile_width);
    var black_material = getMaterial("#000000");   //fixed color
    var color_material = getMaterial(tile_color);  //to change with gui
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
var speed=0.025;

var getSpotLight = function(colorDesired,intensity){
    spotLight = new THREE.SpotLight( colorDesired, intensity );
    return spotLight; }

var addLights = function( distanceFromCenter ){
    white_up_light = getSpotLight("#ffffff",1);
    white_up_light.position.set(0 - tile_width, 20, 0 - tile_width);
    scene.add(white_up_light);

    white_down_light = getSpotLight("#ffffff",1);
    white_down_light.position.set(0 - tile_width, -20, 0 - tile_width);
    scene.add(white_down_light);

    red_light = getSpotLight("#ff0000",6);
    red_light.position.set(distanceFromCenter - tile_width, 20, distanceFromCenter - tile_width);
    scene.add(red_light);

    green_light = getSpotLight("#00ff00",6);
    green_light.position.set( -distanceFromCenter - tile_width, 20, distanceFromCenter - tile_width);
    scene.add(green_light);

    blue_light = getSpotLight("#0000ff",6);
    blue_light.position.set( 0 - tile_width, 20, -distanceFromCenter - tile_width);
    scene.add(blue_light); }

var prisma, esfera, piramide, toroide, iron_man;
var pivotPoint = new THREE.Object3D();
var figurasCreadas = false;

var addFiguras = function(){
    //piramide, la diferencia entre cylinder y cylinder 
    //buffer, es que el cylinder buffer permite que la cara 
    //superior tenga 0 de radio.
    let geometry = new THREE.CylinderBufferGeometry(0,2,3,4);
    let material = getMaterial("#00ffff");
    piramide = new THREE.Mesh(geometry,material);
    piramide.position.set(-3.5,7,-3);
    scene.add(piramide);
    
    //prisma de n lados es un cilindro si n es lo suficientemente grande 
    geometry = new THREE.CylinderGeometry(1,1,3,8);
    material = getMaterial("#ff00ff");
    prisma = new THREE.Mesh(geometry,material);
    prisma.position.set(2.5,5.5,-3);
    scene.add(prisma);
    // Torus - Toroide
    geometry = new THREE.TorusGeometry(1.5,0.5,32,100);
    material = getMaterial("#ffff00");   //fixed color
    toroide = new THREE.Mesh(geometry,material);
    toroide.position.set(2,3,3);
    toroide.rotation.x = Math.PI / 2;
    scene.add(toroide);
    //esfera
    geometry = new THREE.SphereGeometry(1.5,32,32);
    material = getMaterial("#777777");
    esfera = new THREE.Mesh(geometry,material);
    esfera.position.set(-4,2,3);
    scene.add(esfera); 
    

    figurasCreadas = true; }

var removeFiguras = function(){
    scene.remove(prisma);
    scene.remove(esfera);
    scene.remove(piramide);
    scene.remove(toroide); 
    figurasCreadas = false; }

var rotateFigura = function(figura,vel_X,vel_Y,vel_Z){
    if(vel_X != 0){ figura.rotation.x += vel_X; }
    if(vel_Y != 0){ figura.rotation.y += vel_Y; }
    if(vel_Z != 0){ figura.rotation.z += vel_Z; } }
var rotationOn = function(){
    rotateFigura(piramide,0,params.speed,0); 
    rotateFigura(prisma,0,params.speed,0);
    rotateFigura(toroide,0,params.speed,0);
    rotateFigura(esfera,0,0,params.speed); }



var loader = new THREE.OBJLoader();

loader.load(
    // resource URL
    'IronMan.obj',
    // called when resource is loaded
    function ( object ) {
        iron_man = object;
        object.scale.set(0.025,0.025,0.025);
        scene.add( object );
        object.add(pivotPoint);
       
        scene.add(pivotPoint);
                
    },
    // called when loading is in progresses
    function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
    // called when loading has errors
    function ( error ) {console.log( 'An error happened' );}
);



// GUI
var params = { up_light: true, down_light: false, background: backgroundScene, 
    red_light: false, green_light: false , blue_light: false, 
    non_black_tiles: tile_color, geometries: true, rotation: false,speed : this.speed,
    rotate_around: false};

var nlines = params.length;
var gui = new dat.GUI({ height: nlines * 32 - 1, });

var scenectl = gui.addFolder("Scene control");
scenectl.add(params, 'up_light');
scenectl.add(params, 'down_light');
scenectl.addColor(params, 'background').onChange(update);
scenectl.add(params, 'red_light');
scenectl.add(params, 'green_light');
scenectl.add(params, 'blue_light');
scenectl.addColor(params, 'non_black_tiles').onChange(update);
scenectl.add(params, 'geometries');
scenectl.add(params, 'rotation');
scenectl.add(params, 'speed',-1,1);
scenectl.add(params, 'speed',-1,1);
scenectl.add(params, 'rotate_around').onChange(rotateAround);


// --- ROTATE AROUND -------------------------------------------

function rotateAround(){
    if (params.rotate_around){
        pivotPoint.add(esfera);
        pivotPoint.add(piramide);
        pivotPoint.add(toroide);
        pivotPoint.add(prisma);
    }else{
        pivotPoint.remove(esfera);
        pivotPoint.remove(piramide);
        pivotPoint.remove(toroide);
        pivotPoint.remove(prisma);
        addFiguras();

    }
}

// --- CHANGE COLOR GUI CONTROL ---------------------------------

var shapectl = gui.addFolder("Shape control");

var shape_params = {
    color: "#00ffff",
    picking: "translate"    
};

// adding folder to gui control
shapectl.addColor(shape_params, 'color').onChange(ChangeColor).listen();
shapectl.add(shape_params, 'picking', [ "translate", "rotate", "scale"] );

// instantiate raycaster 
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// get mouse coordinates all the time
function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// adding events to window
window.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown );

// callback for event to change color
function ChangeColor(){
    selected_object.material.color.setHex(shape_params.color);
};

// var dragcontrols = new THREE.DragControls( scene.children, camera, renderer.domElement );
// dragcontrols.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } ); //cuando hace click sobre una figura y mientras la tiene sostenida
// dragcontrols.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );  //cuando suelta una figura

// callback event for mouse down
function onDocumentMouseDown( event ) {    
            // event.preventDefault();
            event.stopPropagation();
            raycaster.setFromCamera( mouse, camera );
            
            // calculate objects intersecting the picking ray
            var intersects = raycaster.intersectObjects( scene.children );
            // intersects[0].object.material.color.set( 0xff0000 );
            
            //validate if has objects intersected
            if (intersects.length>0){
                // pick first intersected object
                selected_object = intersects[0].object;

                // change gui color
                shape_params.color = selected_object.material.color.getHex();
                
                control.setMode(shape_params.picking);
                control.attach( selected_object );           
            }
             
}

// ---------------------------------------------------


// ----- TRANSLATE CONTROL ---------------------------
control = new THREE.TransformControls( camera, renderer.domElement );
control.addEventListener( 'change', render );
control.addEventListener( 'dragging-changed', function ( event ) {
			mouseOrbit.enabled = ! event.value;
    } );
                

scene.add( control );



// load objects
addTablero();
addFiguras();
distanceFromCenter = 1.75*tile_width;
addLights( distanceFromCenter );
camera.position.set(-1, 4, 16);

// update and render loop
var isHex = function (posible_hex) {
    let re = /[0-9A-Fa-f]{6}/g;
    if (re.test(posible_hex)) { return true; } 
    else { return false; } }


var update = function(){ 
    // change in GUI for lights
    if (params.up_light) { white_up_light.intensity = 1; }
    else { white_up_light.intensity = 0; };

    if (params.down_light) { white_down_light.intensity = 1; }
    else { white_down_light.intensity = 0; };	            
    
    if (params.red_light) { red_light.intensity = 6; }
    else { red_light.intensity = 0; };
    
    if (params.green_light) { green_light.intensity = 6; }
    else { green_light.intensity = 0; };
    
    if (params.blue_light) { blue_light.intensity = 6; }
    else { blue_light.intensity = 0; };

    // change in GUI for color_tiles or background
    let background_hex = new THREE.Color(params.background).getHexString();
    if ( isHex(background_hex) && scene.background != "#" + background_hex ){
            scene.background = new THREE.Color("#"+background_hex); }
    let color_hex = new THREE.Color(params.non_black_tiles).getHexString();
    
    if ( isHex(color_hex) && tile_color != "#" + color_hex ){
            tile_color = "#" + color_hex;
            let table = scene.getObjectByName(tablero);
            scene.remove(table);
            addTablero(); }
    
            if( !figurasCreadas && params.geometries == true ){ addFiguras(); } 
    
    if( figurasCreadas && params.geometries == false ){ removeFiguras(); }
    
    if( figurasCreadas && params.rotation ){ rotationOn(); } }
    
function render(){ 
    renderer.render(scene,camera);

    if(params.rotate_around)
        pivotPoint.rotation.y += 0.02;

}
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
