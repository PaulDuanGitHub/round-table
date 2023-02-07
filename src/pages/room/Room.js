/**
 * 手不能完全抬高，可能与动画播放机制有关 - Fixed. 如果两个动画同时play() 并且paused, 那么手就太不高
 * 多个AnimationActions Blender
 */
/**
 * ToDo: THREEJS-GUI other motions[clap, talking gesture].
 * - Model: plants, cabinet, floor, wall, windows, lights
 * Bug: Animation conflicts when pressed at the same time, could ignore it
 * or let user quit the exist one first(or automatically). -Fixed
 */

/**
 * First client emit his animation time to server, and server
 * emit the time to all other clients, all clients have listener
 * on it. They will use the time to set their own animation time.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import HDR from "../../img/hdr.jpg"
import mcFont from '../../fonts/Minecraft_Regular.json'
import Room1GLT from '../../mod/roomv2.glb'
// import Room1GLT from '../../mod/room.fbx'
// import Room1GLT from '../../mod/Room.glb'
import Room2GLT from '../../mod/room2.glb'

export class Room {
    renderer;
    scene;
    loader;
    camera;
    controls;
    ambientLight;
    mixer;
    animations;
    animationClips;
    clock;
    socket;
    roomCode;
    confereeList;
    newConfereeList;
    fontLoader;
    nameTags;
    selfIndex;
    selfAnimationActions;
    conferees;
    constructor(node, roomCode, socket, users, user) {
        // I didn't create a new socket connection here.
        // If I do, I have to put the new connection into
        // the same room.
        this.socket = socket;
        this.socket.on("setUrMixerTime", (data) => {
            // console.log("收到 " + data.hisTimes[0].time + " " + data.hisTimes[1].time);
            for (var i = 0; i < 2; i++) {
                // console.log(this.animationActions);
                if (data.hisTimes[i].time > 0) {
                    this.animationActions[data.hisIndex * 2 + i].play()
                    this.animationActions[data.hisIndex * 2 + i].paused = true
                } else if (data.hisTimes[i].time == 0) {
                    // console.log("test")
                    this.animationActions[data.hisIndex * 2 + i].stop()
                    this.animationActions[data.hisIndex * 2 + i].paused = false
                }
                this.animationActions[data.hisIndex * 2 + i].time = data.hisTimes[i].time
            }
        });
        this.socket.on("resUsers", (data) => {
            // console.log("收到 " + data);
            // console.log("旧名单：" + this.confereeList);
            data.forEach((user) => {
                this.newConfereeList[user.chosenSeat] = user.userName
            })
            // console.log("新名单：" + this.newConfereeList);
            // console.log("旧名单：" + this.confereeList);
        });
        this.confereeList = new Array(8).fill(""); // Can be sub by room size in the future
        users.forEach((user) => {
            this.confereeList[user.chosenSeat] = user.userName
        })
        // console.log(this.confereeList);
        this.selfIndex = user.chosenSeat;
        this.selfAnimationActions = [];
        this.newConfereeList = this.confereeList.slice(); // Shallow copy here
        this.roomCode = roomCode;
        this.renderer = new THREE.WebGLRenderer(); //渲染器
        //设置色彩sRGB，因为Blender的颜色是sRGB
        THREE.ColorManagement.legacyMode = false

        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;

        this.scene = new THREE.Scene(); //场景
        this.loader = new GLTFLoader(); //GLTFLoader 加载器
        this.fontLoader = new FontLoader();
        this.nameTags = [];
        this.conferees = [];
        //一个Perspective相机，锥体aspect是dom元素的宽高比 
        this.camera = new THREE.PerspectiveCamera(30, node.offsetWidth / node.offsetHeight, 0.1, 500);
        this.camera.position.set(8.959605050696072e-15, 5.207715829759764, 33.538056284842924)
        this.camera.rotation.set(-0.15404757794608712, 2.6398388703748636e-16, 4.0990839053124627e-17)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement); //交互

        this.renderer.setClearColor(0xffffff); //设置clear color
        this.renderer.setPixelRatio(window.devicePixelRatio); //分辨率
        this.renderer.setSize(node.offsetWidth, node.offsetHeight); //渲染器大小
        this.renderer.shadowMap.enabled = true; //允许影子
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //柔化影子

        node.appendChild(this.renderer.domElement); //关联dom

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0); //环境光
        this.scene.add(this.ambientLight);

    }
    loadModel(roomType) {

        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(HDR,
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping; //等距柱状投影图
                const crt = new THREE.WebGLCubeRenderTarget(texture.image.height)
                crt.fromEquirectangularTexture(this.renderer, texture)
                // this.scene.background = texture
                this.scene.environment = texture
            }
        )

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
        this.loader.load(GLT, (gltf) => {
            // console.log(gltf);

            // gltf.scene.scale.set(20,20,20);
            gltf.scene.scale.set(1, 1, 1);
            gltf.scene.position.set(0, 0, 0);

            //遍历模型设置阴影
            gltf.scene.receiveShadow = true;
            gltf.scene.castShadow = true;
            // gltf.scene.getObjectByName("球体.008").visible = false;
            gltf.scene.traverse((node) => {
                if (node.name.includes("rig00")) {
                    this.conferees.push(node);
                    var i = node.name.substring(node.name.length - 1)
                    i = parseInt(i - 1);
                    node.visible = false;
                    if (this.confereeList[i] != "") {
                        node.visible = true
                        var nameTag = this.create3DNameTag(this.confereeList[i]);
                        // console.log(gltf.scene.getObjectByName("球体00"+i));
                        nameTag.position.set(node.position.x, node.position.y, node.position.z);
                        // nameTag.position.setY(node.position.y+1.5);
                        nameTag.position.setY(2.4);
                        this.nameTags.push(nameTag);
                        // console.log(node.position);
                        // nameTag.rotation.y = this.camera.rotation.y;
                        // this.scene.add(nameTag);
                    }
                }
                node.receiveShadow = true;
                node.castShadow = true;
                if (node.type == "PointLight") {
                    if (node.name != "Light001") {
                        node.intensity = 50;
                        // node.castShadow = false;
                        // // node.receiveShadow = true;
                    } else {
                    }
                    node.intensity = 50;
                    node.shadow.bias = -0.001;
                    node.shadow.normalBias = -0.002;
                }
            })
            // gltf.scene.children.forEach((node) => {
            //     if(node.name.includes("rig00")){
            //         this.conferees.push(node);
            //         var i = node.name.substring(node.name.length - 1)
            //         i = parseInt(i-1);
            //         node.visible = false;
            //         if(this.confereeList[i] != ""){
            //             node.visible = true
            //             var nameTag = this.create3DNameTag(this.confereeList[i]);
            //             // console.log(gltf.scene.getObjectByName("球体00"+i));
            //             nameTag.position.set(node.position.x,node.position.y,node.position.z);
            //             nameTag.position.setY(node.position.y + 2.5);
            //             this.nameTags.push(nameTag);
            //             // console.log(node.position);
            //             // nameTag.rotation.y = this.camera.rotation.y;
            //             // this.scene.add(nameTag);
            //         }
            //     }
            //     node.receiveShadow = true;
            //     node.castShadow = true;
            //     if (node.type == "PointLight") {
            //         if (node.name != "Light001") {
            //             node.intensity = 50;
            //             node.castShadow = false;
            //             // node.receiveShadow = true;
            //         } else {
            //         }
            //         node.intensity = 50;
            //         node.shadow.bias = -0.001;
            //         node.shadow.normalBias = -0.002;
            //     }
            // })

            this.mixer = new THREE.AnimationMixer(gltf.scene);
            // this.animations = gltf.animations;
            this.animationActions = [];
            gltf.animations.forEach((clip) => {
                var animation = this.mixer.clipAction(clip);
                // console.log(clip.name);
                if (clip.name.includes("rig.00" + (this.selfIndex + 1))) {
                    this.selfAnimationActions.push(animation);
                }
                this.animationActions.push(animation);
                // animation.paused = true;
                // animation.enabled = true;
                // animation.setLoop(THREE.LoopOnce);
                // animation.clampWhenFinished = true;
                // animation.play();
            });
            this.scene.add(gltf.scene);
            this.nameTags.forEach((nameTag) => {
                this.scene.add(nameTag);
            })
            console.log(this);

        }, undefined, function (error) {
            console.error(error);
        });
        this.clock = new THREE.Clock();
        this.animate();
    }
    animate = () => {
        // Here need a callback function, instead of a
        // function's return value.
        this.animationFrameID = requestAnimationFrame(this.animate);
        this.update();
        this.render();
    };
    render() {
        this.renderer.render(this.scene, this.camera)
    }

    update() {
        // Update control
        this.controls.update();
        // Update name tags' rotation
        this.nameTags.forEach((nameTag) => {
            nameTag.rotation.x = this.camera.rotation.x;
            nameTag.rotation.y = this.camera.rotation.y;
            nameTag.rotation.z = this.camera.rotation.z;
        })
        // Update conferee
        this.updateConferees();
        // Update animations
        var delta = this.clock.getDelta();

        /**
         * I have to make sure the mixer is exist, then
         * do the update or emit, or it will crush, I think
         * it is because animate is a function variable so
         * the class with initize it, meanwhile the mixer is not
         * defined
         */
        if (this.mixer) {
            this.mixer.update(delta)
            if (this.selfAnimationActions[0].time >= 0 || this.selfAnimationActions[1].time >= 0) {// So that when the others update, it will not emit messages.
                var selfAnimationActionTimes = [];
                this.selfAnimationActions.forEach((selfAnimationAction) => {
                    selfAnimationActionTimes.push({ time: selfAnimationAction.time })
                    // selfAnimationActionTimes.push(selfAnimationAction.paused)
                })
                // console.log("发送：" + this.selfAnimationActions[0].time + " " + this.selfAnimationActions[1].time);
                this.socket.emit("setMyMixerTime", { roomCode: this.roomCode, selfAnimationActionTimes: selfAnimationActionTimes, selfIndex: this.selfIndex });
            }
        }
    }

    updateConferees() {
        this.conferees.forEach(conferee => {
            var i = conferee.name.substring(conferee.name.length - 1)
            i = parseInt(i - 1);
            // console.log("更新 旧名单:" + this.confereeList );
            // console.log("更新 新名单:" + this.newConfereeList );
            if (this.confereeList[i] != this.newConfereeList[i]) {
                conferee.visible = true
                var nameTag = this.create3DNameTag(this.newConfereeList[i]);
                nameTag.position.set(conferee.position.x, conferee.position.y, conferee.position.z);
                nameTag.position.setY(2.4);
                this.nameTags.push(nameTag);
                this.scene.add(nameTag);
            }
        })
        this.confereeList = this.newConfereeList.slice();
    }

    create3DNameTag(name) {
        var geometry;
        // var name = name;
        const font = this.fontLoader.parse(mcFont);
        // console.log(name);
        geometry = new TextGeometry(name, {
            font,
            size: 0.15,
            height: 0,
            // curveSegments: 12,
            // bevelEnabled: true,
            // bevelThickness: 10,
            // bevelSize: 8,
            // bevelSegments: 5
        });
        // console.log(geometry);
        var nameMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: false }))
        nameMesh.geometry.center();
        var bgWidth = nameMesh.geometry.boundingBox.getSize(new THREE.Vector3()).x;
        var bgHeight = nameMesh.geometry.boundingBox.getSize(new THREE.Vector3()).y;
        var background = new THREE.Mesh(new THREE.PlaneGeometry(bgWidth + 0.3, bgHeight + 0.1), new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true }))
        background.position.set(0, 0, -0.01);
        nameMesh.add(background);
        // nameMesh.renderOrder =0;
        // console.log(nameMesh);
        return nameMesh;
    }

    raisingHand() {
        // this.animations.forEach((clip) => {
        //     var animation = this.mixer.clipAction(clip);
        //     console.log(animation.time);
        //     animation.paused = false;
        //     animation.enabled = true;
        //     animation.setLoop(THREE.LoopOnce);
        //     animation.clampWhenFinished = true;
        //     animation.timeScale = 1;
        // });
        // this.animationActions.forEach(animation=>{
        //     animation.paused = false;
        //     animation.enabled = true;
        //     animation.setLoop(THREE.LoopOnce);
        //     animation.clampWhenFinished = true;
        //     animation.timeScale = 1;
        // });
        this.selfAnimationActions[1].stop()

        this.selfAnimationActions[0].reset();
        this.selfAnimationActions[0].play();
        this.selfAnimationActions[0].paused = false;
        this.selfAnimationActions[0].enabled = true;
        this.selfAnimationActions[0].setLoop(THREE.LoopOnce);
        this.selfAnimationActions[0].clampWhenFinished = true;
        this.selfAnimationActions[0].timeScale = 1;
    }
    loweringHand() {
        // this.animationActions.forEach(animation=>{
        //     animation.enabled = true;
        //     animation.setLoop(THREE.LoopOnce);
        //     animation.clampWhenFinished = true;
        //     animation.timeScale = -1;
        //     animation.paused = false;
        // });
        this.selfAnimationActions[0].enabled = true;
        this.selfAnimationActions[0].setLoop(THREE.LoopOnce);
        this.selfAnimationActions[0].clampWhenFinished = false;
        this.selfAnimationActions[0].timeScale = -1;
        this.selfAnimationActions[0].paused = false;
    }
    clap() {
        clearInterval(this.clapTimeoutID);
        this.selfAnimationActions[0].stop();

        this.selfAnimationActions[1].reset();
        this.selfAnimationActions[1].play();
        this.selfAnimationActions[1].paused = false;
        this.selfAnimationActions[1].enabled = true;
        this.selfAnimationActions[1].setLoop(THREE.LoopOnce);
        this.selfAnimationActions[1].clampWhenFinished = false;
        this.clapTimeoutID = setTimeout(() => {
            this.selfAnimationActions[1].stop();
        }, 4000);
    }

    unmount() {
        console.log(this.renderer);
        console.log(this.scene);
        this.renderer.dispose();
        this.renderer.forceContextLoss(); 
        this.renderer.context=undefined;
        this.renderer.domElement=undefined;
        this.scene.traverse((obj) => {
            this.doDispose(obj);
        })
        cancelAnimationFrame(this.animationFrameID)
    
        console.log("after");
        console.log(this.renderer);
        console.log(this.scene);
    }

    doDispose (obj)
    {
        if (obj !== null)
        {
            for (var i = 0; i < obj.children.length; i++)
            {
                this.doDispose(obj.children[i]);
            }
            if (obj.geometry)
            {
                obj.geometry.dispose();
                obj.geometry = undefined;
            }
            if (obj.material)
            {
                if (obj.material.map)
                {
                    obj.material.map.dispose();
                    obj.material.map = undefined;
                }
                obj.material.dispose();
                obj.material = undefined;
            }
        }
        obj = undefined;
    }

} 