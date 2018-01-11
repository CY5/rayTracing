var Scene;
var rayTracingScene;
var screenTextureScene;

var camera;
var quadCamera;

var renderer;
var rayTracingRenderTarget;
var screenTextureRenderTarget;
var controls;

var OutputMesh ;
var mouseMoving = 0;
var generateScenes = 1;

var pixelRatio = window.devicePixelRatio ;
let w = window.innerWidth ;//* pixelRatio;
let h = window.innerHeight;// * pixelRatio;

var sample_dom = document.getElementById("sample");

var startTime = Date.now();


//Controls
var anim = false;
var motionBlur = false;
var rayTrace = false;
var ref_idx = 1.025;
var samples = true;


function main(){

    Scene = new THREE.Scene();
    rayTracingScene = new THREE.Scene();
    screenTextureScene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, w / h, 10, 15000);
    rayTracingScene.add(camera);
    camera.position.set(1.6, 54, 335);

    quadCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    screenTextureScene.add(quadCamera);
    Scene.add(quadCamera);
    

    renderer = new THREE.WebGLRenderer();
    setRenderer(renderer);

    rayTracingRenderTarget = new THREE.WebGLRenderTarget( (w ), (h), {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        depthBuffer: false,
        stencilBuffer: false
    } );
    rayTracingRenderTarget.texture.generateMipmaps = false;
				
    screenTextureRenderTarget = new THREE.WebGLRenderTarget( (w), (h), {
        minFilter: THREE.NearestFilter, 
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        depthBuffer: false,
        stencilBuffer: false
    } );
    screenTextureRenderTarget.texture.generateMipmaps = false;
				

    //controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    controls.target.set( 0, 20, 120 );
    rayTracingScene.add(controls.object);
    setControls (controls);

    stats = new Stats();
    document.body.appendChild( stats.dom );


    setScene(rayTracingScene, screenTextureRenderTarget.texture);
    setScreenTexture(screenTextureScene, rayTracingRenderTarget.texture);
    setScreenOutput(Scene, rayTracingRenderTarget.texture);

    OutputMesh = Scene.getObjectByName("mainScene");
    var earthMesh = rayTracingScene.getObjectByName("earth");
    var angle = 0;
    var earthRadius = 300.0;
  

    function animate() {
        requestAnimationFrame( animate );

        if(OutputMesh){
            if (mouseMoving){
                //OutputMesh.material.uniforms.Sample.value;
                //OutputMesh.material.uniforms.Sample.value=1.0;
                OutputMesh.material.uniforms.Sample.value=1.0;
                earthMesh.material.uniforms.scene_gen = 1;
                earthMesh.material.uniforms.mouseMove.value = 1;
                mouseMoving = 0;
            }else {
                OutputMesh.material.uniforms.Sample.value+=1.0;
                earthMesh.material.uniforms.mouseMove.value = 0;
                if (anim){
                    if (!motionBlur && OutputMesh.material.uniforms.Sample.value > 80){
                        OutputMesh.material.uniforms.Sample.value=0.0;
                        earthMesh.material.uniforms.mouseMove.value = 1;
                    }
                }
                
            }
        }

        earthMesh.material.uniforms.Sample.value = OutputMesh.material.uniforms.Sample.value;
        if (samples){

            sample_dom.textContent = Number(OutputMesh.material.uniforms.Sample.value);
        }else {

            sample_dom.textContent = 1.0;
        }

        earthMesh.material.uniforms.randd.value =  Math.random();
        earthMesh.material.uniforms.rayTrace.value = rayTrace;
        earthMesh.material.uniforms.ref_idx.value = ref_idx;
        earthMesh.material.uniforms.sampling.value = samples;
        OutputMesh.material.uniforms.sampling.value = samples;
        if (anim){
            camera.position.x = earthRadius * Math.cos( angle );  
            camera.position.z = earthRadius * Math.sin( angle );
            angle += 0.002;
        }
        controls.update();
        camera.updateProjectionMatrix();
        renderer.render( rayTracingScene, camera, rayTracingRenderTarget );
        renderer.render( screenTextureScene, quadCamera, screenTextureRenderTarget );
        renderer.render( Scene, quadCamera );
        stats.update();
    }

    function onWindowResize( event ) {
        
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize( w, h );

    
    }

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener('mousedown', mouseMove, true);
    //window.addEventListener('mouseup', mouseChange, true);
    window.addEventListener('mousewheel', mouseMove, true);
    

    animate();
}
function mouseMove(e){
    mouseMoving = 1;
}
function mouseChange(e){
    mouseMoving = 0;
}

function toggleAnim(){
    anim = !anim;
}
function toggleMotionBlur(){
    motionBlur = !motionBlur;
}
function togglerayTrace(){
    rayTrace = !rayTrace;
}

function selectTransparency(val){
    ref_idx = Number(val.value);
}

function toggleSampling(){
    samples = !samples;
}
function setScene(scene, texture) {
 
    createEarth(scene, texture);

}
function setScreenTexture(scene, texture){
    let w = window.innerWidth;
    let h = window.innerHeight;
    let geometry = new THREE.PlaneBufferGeometry(2, 2, 2 );

    let material = new THREE.ShaderMaterial( {
        uniforms:{
            tTexture01 : {
                type: "t",
                value : texture
            }
        },
        extensions:{
            derivatives: true
        },  
        vertexShader: document.getElementById( 'screenTextureVertexShader' ).textContent,

        fragmentShader: document.getElementById( 'screenTextureFragmentShader' ).textContent
    } );
    let mesh = new THREE.Mesh( geometry, material );


    scene.add(mesh);
}
function setScreenOutput(scene, texture){
    let w = window.innerWidth;
    let h = window.innerHeight;
    let geometry = new THREE.PlaneBufferGeometry(2, 2, 2 );

    let material = new THREE.ShaderMaterial( {
        uniforms:{
            tTexture02 : {
                type: "t",
                value : texture
            },
            Sample: { type: "f", value: 1.0 },
            mouseMove : {
                type : "i",
                value: mouseMoving
            },
            sampling : {
                type : "b",
                value : samples
            }
        },
        extensions:{
            derivatives: true
        },  
        vertexShader: document.getElementById( 'screenOutputVertexShader' ).textContent,

        fragmentShader: document.getElementById( 'screenOutputFragmentShader' ).textContent
    } );
    let mesh = new THREE.Mesh( geometry, material );
    mesh.name = "mainScene"

    scene.add(mesh);
}


function createEarth(scene, texture){
    let width = window.innerWidth;
    let height = window.innerHeight;
    let earthGeometry = new THREE.PlaneBufferGeometry(2, 2, 2 );

    let position = earthGeometry.attributes.position.array;
    earthGeometry.addAttribute( 'e_position', new THREE.BufferAttribute( position, 3 ) );
   

    var earthMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            u_resolution : {
                value : new THREE.Vector2(width,height)
            },
            texture0 : {
                type: "t",
                value : texture
            },
            mouseMove : {
                type : "i",
                value: mouseMoving
            },
            randd : {
                type : "i",
                value : Math.random()
            },
            Sample: { type: "f", value: 1.0 },
            time_val : {
                type : "f",
                value : 0.0
            },
            rayTrace : {
                type : "b",
                value : rayTrace
            },
            ref_idx : {
                type : "f",
                value : ref_idx
            },
            sampling : {
                type: "b",
                value : samples
            }
        },
        extensions:{
            derivatives: true
        },  
        vertexShader: document.getElementById( 'vertexShader' ).textContent,

        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
    let earth = new THREE.Mesh( earthGeometry, earthMaterial );


    //camera.add(earth);
    earth.name = "earth";
    scene.add(earth);
}


function setControls (controls) {
    controls.enableZoom = true;
    //controls.maxDistance = 70;
    //controls.maxZoom = 7;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.5;

    controls.keys = [ 65, 83, 68 ];
    controls.object.updateMatrixWorld(true);

}

function setRenderer(renderer){
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize( w, h);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);
    if ( renderer.extensions.get( 'ANGLE_instanced_arrays' ) === false ){
        document.getElementById( 'notSupported' ).style.display = '';
        return;
    }
}

