import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Room1GLT from '../../mod/room.glb'
// import Room1GLT from '../../mod/room.fbx'
// import Room1GLT from '../../mod/Room.glb'
import Room2GLT from '../../mod/room2.glb'
import Universe from "../../img/u.jpg"
//Note: In Three.js 坐标系是(x,y,z) y为竖着的轴 右手坐标系

export const initScene = (node, roomType) => {
    const renderer = new THREE.WebGLRenderer(); //渲染器
    //设置色彩sRGB，因为Blender的颜色是sRGB
    THREE.ColorManagement.legacyMode = false
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    const scene = new THREE.Scene(); //场景
    const loader = new GLTFLoader(); //GLTFLoader 加载器
    const fbxLoader = new FBXLoader(); //GLTFLoader 加载器
    //一个Perspective相机，锥体aspect是dom元素的宽高比 
    const camera = new THREE.PerspectiveCamera( 30, node.offsetWidth / node.offsetHeight, 0.1,500 ); 
    // {
    //     "x": 8.959605050696072e-15,
    //     "y": 5.207715829759764,
    //     "z": 33.538056284842924
    // }
    camera.position.set( 8.959605050696072e-15,5.207715829759764,33.538056284842924)
    // {
    //     "isEuler": true,
    //     "_x": -0.15404757794608712,
    //     "_y": 2.6398388703748636e-16,
    //     "_z": 4.0990839053124627e-17,
    //     "_order": "XYZ"
    // }
    camera.rotation.set(-0.15404757794608712,2.6398388703748636e-16,4.0990839053124627e-17)

    var controls = new OrbitControls( camera, renderer.domElement ); //交互

    renderer.setClearColor( 0xffffff ); //设置clear color
    renderer.setPixelRatio( window.devicePixelRatio ); //分辨率
    renderer.setSize(node.offsetWidth, node.offsetHeight); //渲染器大小
    renderer.shadowMap.enabled = true; //允许影子
    renderer.shadowMap.type=THREE.PCFSoftShadowMap; //柔化影子
    
    node.appendChild( renderer.domElement ); //关联dom
    
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2); //环境光
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF,1 ); //平行光
    directionalLight.position.set( 1, 5, -1 ); //平行光位置
    directionalLight.castShadow = true; //可否投射影子
    // scene.add( directionalLight ); //加到场景里
    //设置平行光影子镜头的大小left right为上截面大小，top bottom为下截面大小
    directionalLight.shadow.camera.left = 100;
    directionalLight.shadow.camera.right = -100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    // directionalLight.shadow.camera.fov = 45;
    // directionalLight.shadow.camera.aspect = 1;
    directionalLight.shadow.camera.near = 0;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.bias = -0.1;
    // directionalLight.shadow.normalBias = -0.002;
    //影子投射范围
    directionalLight.shadow.mapSize.width = 300;
    directionalLight.shadow.mapSize.height = 300;
    // Helper
    var axesHelper = new THREE.AxesHelper(200); //显示轴
    axesHelper.setColors(0xff0000,0x00ff00,0x0000ff)//xAxis: RED, yAxis: GREEN, zAxis:BLUE
    var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,50, 0xff0000); //显示平行光
    var gridHelper = new THREE.GridHelper( 200, 20 ); //显示网格
    var cameraHepler = new THREE.CameraHelper(directionalLight.shadow.camera); //显示平行光阴影
    // scene.add(directionalLightHelper);
    // scene.add(axesHelper);
    // scene.add( gridHelper );
    // scene.add(cameraHepler);
    const geometry = new THREE.SphereGeometry( 25, 25, 25 );
    const material = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const cube = new THREE.Mesh( geometry, material );
    const plane = new THREE.Mesh(new THREE.BoxGeometry(200,1,200), new THREE.MeshStandardMaterial( { color: 0x00ff00}))
    cube.position.set(0,125,0);
    plane.position.set(0,90,0);
    cube.castShadow=true;
    plane.receiveShadow=true;
    // scene.add( cube );
    // scene.add(plane);
    // const cubeCamera = new THREE.CubeCamera(0.1, 500, 500)
    // scene.add(cubeCamera);

    //加载材质
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(Universe,
        (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping; //等距柱状投影图
            // const crt = new THREE.WebGLCubeRenderTarget(texture.image.height)
            // crt.fromEquirectangularTexture(renderer,texture)
            // scene.background = texture
            // scene.environment = texture
        }
    )
    //Animation
    var mixer;
    var GLT; 
    console.log(roomType);
    switch (roomType) {
        case 0:
            GLT = Room1GLT;
            break;
        case 1:
            GLT = Room2GLT;
            break;
            default:
                GLT = Room1GLT;
                break;
            }
    //加载GLT模型
    loader.load( GLT, ( gltf ) => {
        console.log(gltf);

        // gltf.scene.scale.set(20,20,20);
        gltf.scene.scale.set(1,1,1);
        gltf.scene.position.set(0,0,0);
        
        //遍历模型设置阴影
        gltf.scene.receiveShadow = true;
        gltf.scene.castShadow = true;
        gltf.scene.children.forEach((node)=>{
            node.receiveShadow = true;
            node.castShadow = true;
            if (node.type=="PointLight"){
                if(node.name != "Light001"){
                    node.intensity=50;
                    node.castShadow = false;
                    // node.receiveShadow = true;

                }else{
                }
                node.intensity=50;
                // node.shadow.camera.fov = 90;
                // node.shadow.camera.aspect = 1;
                // pointLight.shadow.camera.near = 0.1;
                // node.shadow.camera.far = 500;
                node.shadow.bias = -0.001;
                node.shadow.normalBias = -0.002;
                //影子投射范围
                // node.shadow.mapSize.width =  500;
                // node.shadow.mapSize.height = 500;
            }
        })

        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
            var animation = mixer.clipAction(clip);
            animation.setLoop(THREE.LoopOnce);
            animation.clampWhenFinished = true;
            // raiseHand(animation);
            // animation.timeScale = -1;
            // animation.play();
        });
    

        scene.add( gltf.scene );
        // controls.update();
        // render();
        // animate();

    }, undefined, function ( error ) {
    console.error( error );
    } );



    // fbxLoader.load( GLT, ( gltf ) => {
    //     console.log(gltf);

    //     // gltf.scene.scale.set(20,20,20);
    //     gltf.scale.set(0.1,0.1,0.1);
    //     gltf.position.set(0,0,0);
        
    //     //遍历模型设置阴影
    //     gltf.receiveShadow = true;
    //     gltf.castShadow = true;
    //     gltf.children.forEach((node)=>{
    //         node.receiveShadow = true;
    //         node.castShadow = true;
    //         if(node.name=="metarig"){
    //             node.children.forEach((bone)=>{
    //                 if(bone.name=="spine"){
    //                     bone.rotateX+=2;
    //                     console.log(bone);
    //                 }
    //             })
    //         }
    //         if (node.type=="PointLight"){
    //             if(node.name != "Light001"){
    //                 node.intensity=50;
    //                 node.castShadow = false;
    //                 // node.receiveShadow = true;

    //             }else{
    //             }
    //             node.intensity=50;
    //             // node.shadow.camera.fov = 90;
    //             // node.shadow.camera.aspect = 1;
    //             // pointLight.shadow.camera.near = 0.1;
    //             // node.shadow.camera.far = 500;
    //             node.shadow.bias = -0.001;
    //             node.shadow.normalBias = -0.002;
    //             //影子投射范围
    //             // node.shadow.mapSize.width =  500;
    //             // node.shadow.mapSize.height = 500;
    //         }
    //     })

    //     mixer = new THREE.AnimationMixer(gltf);
    //     gltf.animations.forEach((clip) => {
    //         mixer.clipAction(clip).play();
    //     });
    

    //     scene.add( gltf );
    //     // controls.update();
    //     // render();
    //     // animate();

    // }, undefined, function ( error ) {
    // console.error( error );
    // } );


    var clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame( animate );
        var delta = clock.getDelta();
        if ( mixer ) mixer.update(delta);

        render();

        // console.log(controls.object.position);
        // console.log(controls.object.rotation);
    };
    function render() {
        renderer.render(scene, camera)
    }
    animate();
}

export function raiseHand(animation){
    animation.play();
}