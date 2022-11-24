/**
 * Threejs WebGLRender()和大部分功能依赖浏览器，所以服务端做不了任何模型渲染
 */

// import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as fs  from 'fs';
import * as THREE  from 'three';
import bufferToArrayBuffer from 'buffer-to-arraybuffer';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// const GLTFLoader = require('three/examples/jsm/loaders/GLTFLoader.js');
// import Room1GLT from '../../mod/room.fbx'
// import Room1GLT from '../../mod/Room.glb'

const Room1GLT = '../src/mod/room.glb'
const Room2GLT = '../src/mod/room2.glb'
const loader = new GLTFLoader();

function loadRoomModel(scene, roomType) {
        var GLT;
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
        const glbBuffer = fs.readFileSync(GLT);
        loader.parse( bufferToArrayBuffer(glbBuffer), '', function (gltf) {
            console.log(gltf);

            // gltf.scene.scale.set(20,20,20);
            gltf.scene.scale.set(1, 1, 1);
            gltf.scene.position.set(0, 0, 0);

            //遍历模型设置阴影
            gltf.scene.receiveShadow = true;
            gltf.scene.castShadow = true;
            gltf.scene.getObjectByName("立方体").visible = false;
            gltf.scene.children.forEach((node) => {
                node.receiveShadow = true;
                node.castShadow = true;
                if (node.type == "PointLight") {
                    if (node.name != "Light001") {
                        node.intensity = 50;
                        node.castShadow = false;
                        // node.receiveShadow = true;
                    } else {
                    }
                    node.intensity = 50;
                    node.shadow.bias = -0.001;
                    node.shadow.normalBias = -0.002;
                }
            return gltf
            })
        }, undefined, function (error) {
            console.error( error );
            reject(error);
        });
        // loader.load(GLT, (gltf) => {
        //     console.log(gltf);

        //     // gltf.scene.scale.set(20,20,20);
        //     gltf.scene.scale.set(1, 1, 1);
        //     gltf.scene.position.set(0, 0, 0);

        //     //遍历模型设置阴影
        //     gltf.scene.receiveShadow = true;
        //     gltf.scene.castShadow = true;
        //     gltf.scene.children.forEach((node) => {
        //         node.receiveShadow = true;
        //         node.castShadow = true;
        //         if (node.type == "PointLight") {
        //             if (node.name != "Light001") {
        //                 node.intensity = 50;
        //                 node.castShadow = false;
        //                 // node.receiveShadow = true;
        //             } else {
        //             }
        //             node.intensity = 50;
        //             node.shadow.bias = -0.001;
        //             node.shadow.normalBias = -0.002;
        //         }
        //     return gltf
        //     })
        // }, undefined, function (error) {
        //     console.error(error);
        // });
}

export default loadRoomModel;