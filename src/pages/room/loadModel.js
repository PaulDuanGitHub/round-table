import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GLT from '../../mod/room.glb'
import Universe from "../../img/u.jpg"
import { Mesh } from 'three';

export const loadModel = (node) => {
    //Note: In Three.js 坐标系是(x,y,z) y为竖着的轴 右手坐标系
    const loader = new GLTFLoader(); //GLTFLoader 加载器
    const scene = new THREE.Scene(); //场景
    const renderer = new THREE.WebGLRenderer(); //渲染器
    //一个Perspective相机，锥体aspect是dom元素的宽高比 
    const camera = new THREE.PerspectiveCamera( 30, node.offsetWidth / node.offsetHeight, 0.1,1000 ); 
    camera.position.set(0,50,200)
    camera.rotation.x += (-5 * Math.PI / 180)
    camera.rotation.y += (15 * Math.PI / 180)

    var controls = new OrbitControls( camera, renderer.domElement ); //交互
    // controls.enabled = false;

    renderer.setClearColor( 0xffffff ); //设置clear color
    renderer.setPixelRatio( window.devicePixelRatio ); //分辨率
    renderer.setSize(node.offsetWidth, node.offsetHeight); //渲染器大小
    renderer.shadowMap.enabled = true; //允许影子
    renderer.shadowMap.type=THREE.PCFSoftShadowMap; //柔化影子
    
    node.appendChild( renderer.domElement ); //关联dom
    
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.1 ); //环境光
    // scene.add( ambientLight );
    
    var pointLightHe = 100;
    var pointLightCo = 0xffffff;
    var pointLightIn = 0.4;
    var pointLightInv = 0;

    var pointLight1 = new THREE.PointLight(pointLightCo,pointLightIn)
    pointLight1.position.set(pointLightInv,pointLightHe,pointLightInv)
    scene.add(pointLight1)

    // var pointLight2 = new THREE.PointLight(pointLightCo,pointLightIn)
    // pointLight2.position.set(pointLightInv,pointLightHe,0)
    // //scene.add(pointLight2)

    // var pointLight3 = new THREE.PointLight(pointLightCo,pointLightIn)
    // pointLight3.position.set(pointLightInv,pointLightHe,-pointLightInv)
    // //scene.add(pointLight3)

    // var pointLight4 = new THREE.PointLight(pointLightCo,pointLightIn)
    // pointLight4.position.set(0,pointLightHe,pointLightInv)
    // //scene.add(pointLight4)

    // var pointLight5 = new THREE.PointLight(pointLightCo,pointLightIn)
    // pointLight5.position.set(0,pointLightHe,0)
    // //scene.add(pointLight5)

    // var pointLight6 = new THREE.PointLight(pointLightCo,pointLightIn)
    // pointLight6.position.set(0,pointLightHe,-pointLightInv)
    // //scene.add(pointLight6)

    // var pointLight7 = new THREE.PointLight(pointLightCo,pointLightIn)
    // pointLight7.position.set(-pointLightInv,pointLightHe,pointLightInv)
    // //scene.add(pointLight7)

    // var pointLight8 = new THREE.PointLight(pointLightCo,pointLightIn)
    // pointLight8.position.set(-pointLightInv,pointLightHe,0)
    // //scene.add(pointLight8)

    // var pointLight9 = new THREE.PointLight(pointLightCo,pointLightIn)
    // pointLight9.position.set(-pointLightInv,pointLightHe,-pointLightInv)
    // //scene.add(pointLight9)

    var pointLights = [pointLight1]

    pointLights.map((pointLight)=>{
        // scene.add(new THREE.PointLightHelper(pointLight, 10))
        pointLight.castShadow = true;
        pointLight.shadow.camera.fov = 90;
        pointLight.shadow.camera.aspect = 1;
        // pointLight.shadow.camera.near = 0.1;
        pointLight.shadow.camera.far = 500;
        pointLight.shadow.bias = -0.01;
        // pointLight.shadow.normalBias = -0.002;
        //影子投射范围
        pointLight.shadow.mapSize.width =  200;
        pointLight.shadow.mapSize.height = 200;
        // scene.add(new THREE.CameraHelper(pointLight.shadow.camera));
    })

    var directionalLight = new THREE.DirectionalLight( 0xFFC674,0.9 ); //平行光
    directionalLight.position.set( 0, 100, -300 ); //平行光位置
    directionalLight.castShadow = true; //可否投射影子
    scene.add( directionalLight ); //加到场景里
    //设置平行光影子镜头的大小left right为上截面大小，top bottom为下截面大小
    directionalLight.shadow.camera.left = 100;
    directionalLight.shadow.camera.right = -100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    // directionalLight.shadow.camera.fov = 45;
    // directionalLight.shadow.camera.aspect = 1;
    directionalLight.shadow.camera.near = 0;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.bias = -0.01;
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

    //加载GLT模型
    loader.load( GLT, ( gltf ) => {
        gltf.scene.scale.set(20,20,20);
        // gltf.scene.scale.set(1,1,1);
        gltf.scene.position.set(0,0,0);

        //遍历模型设置阴影
        var text = new THREE.TextureLoader().load(new URL('https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg'));
        text.flipY = false;
        gltf.scene.traverse( function ( node ) {
            if (node.isMesh){
                node.receiveShadow = true;
                node.castShadow = true;
                // node.material.map = text;
                
                console.log(node);
            }
        } );
        scene.add( gltf.scene );
        // controls.update();
        // render();
        // animate();

    }, undefined, function ( error ) {
    console.error( error );
    } );


    function animate() {
        requestAnimationFrame( animate );

        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        // controls.update();
        render();
    };
    function render() {
        renderer.render(scene, camera)
    }
    animate();
}