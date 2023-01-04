import Particle from "./Particle.js";

export var scene, camera, renderer;
export const particles = [];

export var mouseX, mouseY;

$(document).on('ready', () => {
	init();
});

function resize() {
	let width = $(window).width();
	let height = Math.max(width * (5 / 16), $('.effect-div > h2').height() + 60);
	
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
	$('#render-target').width(width).height(height).css('border-bottom', '2px solid #fa056f');
}

function init() {
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x282828);
	scene.add(new THREE.AmbientLight(0xffffff, 0.125));
	scene.add(new THREE.DirectionalLight(0xffffff, 0.25));
	
	camera = new THREE.PerspectiveCamera(60, 16 / 5, 0.01, 128);
	camera.position.set(0, 0, 50);
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById('render-target')});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize($(window).width(), $(window).width() * (5 / 16));
	
	$('.effect-div').append($('<h2>')
		.html('Eris Lindstrom<br/>full stack web developer')
		.css('color', '#ffffff')
		.css('text-align', 'center')
		.css('position', 'absolute')
		.css('top', '50%').css('left', '50%')
		.css('transform', 'translate(-50%, -50%)')
	);
	
	resize();
	$(window).on('resize', resize);
	
	var mouse = new THREE.Object3D();
	//var mouse = new Particle();
	//mouse.hasGravity = false;
	scene.add(mouse);
	
	var light = new THREE.SpotLight(0xffffff, 8, 100, Math.PI / 12, 0.5, 2);
	light.position.set(camera.position.x, camera.position.y, camera.position.z);
	light.target = mouse;
	scene.add(light);
	
	$('#render-target').on('mousemove', event => {
		let offset = $('#render-target').offset();
		let mousePos = screenToWorld(event.clientX, event.clientY - (offset.top - $('html').scrollTop()), -50);
		mouse.position.set(mousePos.x, mousePos.y, -50);
		mouseX = event.clientX;
		mouseY = event.clientY;
	});
	$(window).on('scroll', event => {
		let offset = $('#render-target').offset();
		let mousePos = screenToWorld(mouseX, mouseY - (offset.top - $('html').scrollTop()), -50);
		mouse.position.set(mousePos.x, mousePos.y, -50);
	});
	
	animate();
	
	for (var i = 0; i < 200; i++) {
		new Particle();
	}
	
}

export function screenToWorld(screenX, screenY, worldZ) {
	var ray = new THREE.Vector3(((screenX / renderer.domElement.clientWidth) * 2) - 1, -((screenY / renderer.domElement.clientHeight) * 2) + 1, 1);
	ray.unproject(camera);
	ray = ray.sub(camera.position).normalize();
	var distance = ((worldZ || 0) - camera.position.z) / ray.z;
	return camera.position.clone().add(ray.multiplyScalar(distance));
};

function animate() {
	requestAnimationFrame(animate);
	render();
};

function render() {
	particles.forEach(p => p.update());
	renderer.render(scene, camera);
};
