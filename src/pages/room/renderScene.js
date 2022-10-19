import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GLT from '../../mod/water.glb'
import Universe from "../../img/u.jpg"
import { scene, loader, renderer } from './initScene';

export const renderScene = (node) => {
    //Note: In Three.js 坐标系是(x,y,z) y为竖着的轴 右手坐标系

    loader.load( GLT, ( gltf ) => {
        gltf.scene.scale.set(1,1,1);
        gltf.scene.position.set(0,50,0);

        //遍历模型设置阴影
        gltf.scene.traverse( function ( node ) {
            if (node.isMesh){
                node.receiveShadow = true;
                node.castShadow = true;
                // node.material.map = text;
                
                console.log(node);
            }
        } );
        scene.add( gltf.scene );

    }, undefined, function ( error ) {
    console.error( error );
    } );

    //加载材质
    // const textureLoader = new THREE.TextureLoader()
    // textureLoader.load(Universe,
    //     (texture) => {
    //         texture.mapping = THREE.EquirectangularReflectionMapping; //等距柱状投影图
    //         scene.background = texture
    //         scene.environment = texture
    //     }
    // )
}