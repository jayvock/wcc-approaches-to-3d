import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/jsm/loaders/GLTFLoader.js';
let scene, camera, renderer, controls, light, hemiLight, model;
let centerPoint;

init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x33DDFF);

    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,5000);
    camera.position.set(0,25,25);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("sketch-container").appendChild( renderer.domElement );

    //camera interaction controls
    controls = new OrbitControls( camera, renderer.domElement );


    //set up our scene
    hemiLight = new THREE.HemisphereLight(0xE26078, 0x33DDFF, 3); // soft white light
    scene.add(hemiLight);    

    light = new THREE.SpotLight(0x33DDFF,4);
    light.position.set(-50,50,50);
    light.castShadow = true;
    light.shadow.bias = -0.0001;
    light.shadow.mapSize.width = 1024*4;
    light.shadow.mapSize.height = 1024*4;
    scene.add( light );

    renderer = new THREE.WebGLRenderer();
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    centerPoint = new THREE.Vector3( 0, 0, 0 );
   
    new GLTFLoader().load('model/Char.glb', result => { 
        model = result.scene.children[0]; 
        model.position.set(0,0,0);
        model.traverse(n => { if ( n.isMesh ) {
          n.castShadow = true; 
          n.receiveShadow = true;
          if(n.material.map) n.material.map.anisotropy = 1; 
        }});
        scene.add(model);

        animate();
      });

    window.addEventListener('resize', onWindowResize );

}


function animate() {
            renderer.render(scene,camera);
        light.position.set( 
          camera.position.x + 10,
          camera.position.y + 10,
          camera.position.z + 10,
        );
        requestAnimationFrame(animate);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}

