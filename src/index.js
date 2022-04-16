import * as THREE from "three";
import * as dat from "dat.gui";
import SceneInit from "./SceneInit";
import Planet from "./Planet";
import Rotation from "./Rotation";



const gui = new dat.GUI();
const test = new SceneInit();
test.initScene();
test.animate();

const sunGeometry = new THREE.SphereGeometry(8);
const sunTexture = new THREE.TextureLoader().load("textures/sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
const solarSystem = new THREE.Group();
solarSystem.add(sunMesh);
test.scene.add(solarSystem);

const earth = new Planet(4, 48, "textures/earth.jpg");
const earthMesh = earth.getMesh();
const earthSystem = new THREE.Group();
earthSystem.add(earthMesh);

const jupiter = new Planet(5, 100, "textures/jupiter.jpg");
const jupiterMesh = jupiter.getMesh();
const jupiterSystem = new THREE.Group();
jupiterSystem.add(jupiterMesh);

const io = new Planet(2, 15, "textures/io.jpg");
const ioMesh = io.getMesh();
const ioSystem = new THREE.Group();
ioSystem.add(ioMesh);
jupiterMesh.add(ioSystem);

solarSystem.add(earthSystem, jupiterSystem);

const earthRotation = new Rotation(earthMesh);
const earthRotationMesh = earthRotation.getMesh();
earthSystem.add(earthRotationMesh);
const jupiterRotation = new Rotation(jupiterMesh);
const jupiterRotationMesh = jupiterRotation.getMesh();
jupiterSystem.add(jupiterRotationMesh);
const ioRotation = new Rotation(ioMesh);
const ioRotationMesh = ioRotation.getMesh();
ioSystem.add(ioRotationMesh);

// NOTE: Add solar system mesh GUI.
const visualisationInfo = {
    speed: 1
};
const visualisationGui = gui.addFolder("Visualisation");
visualisationGui.add(visualisationInfo, 'speed', 0.1, 5);
visualisationGui.open();

const rayCaster = new THREE.Raycaster();
let distanceDecrement = 3;
let distanceAcc = distanceDecrement;

// NOTE: Animate solar system at 60fps.
const EARTH_YEAR = 2 * Math.PI * (1 / 60) * (1 / 60);
const animate = () => {
    distanceDecrement = 3 * visualisationInfo.speed;

    sunMesh.rotation.y += 0.001 * visualisationInfo.speed;
    earthSystem.rotation.y += EARTH_YEAR * visualisationInfo.speed;
    jupiterSystem.rotation.y += EARTH_YEAR * 0.083 * visualisationInfo.speed;
    ioSystem.rotation.y += EARTH_YEAR * 5 * visualisationInfo.speed;

    const ioPosition = new THREE.Vector3();
    ioMesh.getWorldPosition(ioPosition);
    const earthPosition = new THREE.Vector3();
    earthMesh.getWorldPosition(earthPosition);

    const rayDirection = new THREE.Vector3();
    rayDirection.subVectors(earthPosition, ioPosition).normalize();
    rayCaster.set(ioPosition, rayDirection);
    const intersects = rayCaster.intersectObject(jupiterMesh, false);

    const distanceToEarth = ioPosition.distanceTo(earthPosition)
    let lineDistance = ioPosition.distanceTo(earthPosition);
    lineDistance -= distanceAcc;
    if (intersects.length) {
        if (lineDistance - distanceDecrement > 0) {
            distanceAcc += distanceDecrement;
        } else {
            lineDistance = 0;
        }
    } else {
        if (lineDistance + distanceDecrement < distanceToEarth) {
            distanceAcc -= distanceDecrement;
        } else {
            lineDistance = distanceToEarth;
        }
    }

    const lineEnd = earthPosition;
    lineEnd.addVectors(ioPosition, rayDirection.multiplyScalar(lineDistance));

    const lineGeom = new THREE.BufferGeometry().setFromPoints([ioPosition, lineEnd]);
    const lineMat = new THREE.LineBasicMaterial({
        color: "yellow"
    });
    const line = new THREE.Line(lineGeom, lineMat);
    test.scene.add(line);

    requestAnimationFrame(animate);
    setTimeout(() => {
        lineGeom.dispose();
        lineMat.dispose();
        test.scene.remove(line);
    }, 40);
};
animate();