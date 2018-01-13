import {particles} from "./index.js";
import {screenToWorld} from "./index.js";
import {camera, scene, renderer} from "./index.js";

const particleGeometry = new THREE.BoxBufferGeometry(0.625, 0.625, 0.625);
const particleEdgeGeometry = new THREE.EdgesGeometry(particleGeometry);
const particleMat = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	metalness: 1.0,
	roughness: 0.5,
});
const particleEdgeMat = new THREE.LineBasicMaterial({color: 0x05eafa,});

var gravity = -0.1;

class Particle extends THREE.Mesh {
	
	constructor() {
		super(particleGeometry, particleMat);
		this.screenPos = new THREE.Vector3();
		this.add(new THREE.LineSegments(particleEdgeGeometry, particleEdgeMat));
		
		this.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
		
		this.hasGravity = true;
		
		particles.push(this);
		scene.add(this);
		this.randomPosition();
	}
	
	update() {
		this.rotation.x += 0.01;
		this.rotation.y += 0.01;
		this.rotation.z += 0.01;
		
		if (this.hasGravity === true) {
			this.position.y += gravity;
			if (gravity > 0 && this.screenPosition.y < -10) {
				this.randomPosition();
				this.position.y = screenToWorld(0, renderer.domElement.clientHeight + 10, this.position.z).y;
			} else if (gravity < 0 && this.screenPosition.y > renderer.domElement.clientHeight + 10) {
				this.randomPosition();
				this.position.y = screenToWorld(0, -10, this.position.z).y;
			}
		}
	}
	
	randomPosition() {
		let z = (Math.random() * 30) - 20;
		let minPos = screenToWorld(0, 0, z);
		let maxPos = screenToWorld(renderer.domElement.clientWidth, renderer.domElement.clientHeight, z);
		this.position.set(Math.random() * (maxPos.x - minPos.x) + minPos.x, Math.random() * (maxPos.y - minPos.y) + minPos.y, z);
	}
	
	get screenPosition() {
		this.screenPos.set(this.position.x, this.position.y, this.position.z);
		this.screenPos.project(camera);
		
		this.screenPos.x = ((this.screenPos.x + 1) / 2) * renderer.domElement.clientWidth;
    this.screenPos.y = (-(this.screenPos.y - 1) / 2) * renderer.domElement.clientHeight;
		
		return this.screenPos;
	}
	
}

export default Particle;