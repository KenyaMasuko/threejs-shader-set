import * as THREE from "three";

import vertexSource from "./_shader.vert";
import fragmentSource from "./_shader.frag";

export default class Canvas {
	constructor() {
		// canvas要素を取得
		this.canvasEl = document.querySelector("#webgl-canvas");

		//window幅を取得
		this.w = window.innerWidth;
		this.h = window.innerHeight;

		//renderer
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasEl });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.w, this.h);

		//camera
		const fov = 60;
		const fovRad = (fov / 2) * (Math.PI / 180);
		const dist = this.h / 2 / Math.tan(fovRad);

		this.camera = new THREE.PerspectiveCamera(fov, this.w / this.h, 0.1, 1000);
		this.camera.position.z = dist;

		//scene
		this.scene = new THREE.Scene();

		//loader
		const loader = new THREE.TextureLoader();
		const texture = loader.load("https://source.unsplash.com/whOkVvf0_hU/"); //読み込ませたい画像のパスを書き込む(自分のファイルにある画像を読み込めないので修正する)

		//uniforms変数を定義
		const uniforms = {
			uTexture: { value: texture },
			uImageAspect: { value: 1920 / 1280 },
			uPlaneAspect: { value: 800 / 500 },
		};

		//geometry, material, mesh
		const geometry = new THREE.PlaneBufferGeometry(800, 500, 100, 100);
		const material = new THREE.ShaderMaterial({
			uniforms,
			vertexShader: vertexSource,
			fragmentShader: fragmentSource,
		});

		this.mesh = new THREE.Mesh(geometry, material);

		this.scene.add(this.mesh);

		this.render();
	}

	render() {
		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(() => {
			this.render();
		});
	}
}
