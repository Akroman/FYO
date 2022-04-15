import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default class SceneInit {
    constructor(fov = 36, camera, scene, stats, controls, renderer) {
        this.fov = fov;
        this.scene = scene;
        this.stats = stats;
        this.camera = camera;
        this.controls = controls;
        this.renderer = renderer;
    }

    initScene() {
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.z = 128;

        this.scene = new THREE.Scene();

        // specify a canvas which is already created in the HTML file and tagged by an id
        // aliasing enabled
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("main-canvas"),
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
        this.scene.add(pointLight);

        const loader = new THREE.CubeTextureLoader();
        this.scene.background = loader.load([
            'textures/space.jpg',
            'textures/space.jpg',
            'textures/space.jpg',
            'textures/space.jpg',
            'textures/space.jpg',
            'textures/space.jpg'
        ]);

        // if window resizes
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    animate() {
        // requestAnimationFrame(this.animate.bind(this));
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.stats.update();
        // this.controls.update();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}