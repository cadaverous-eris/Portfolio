var scene, camera, renderer;

var dodecahedron, dodecahedron2;

$(document).on('ready', () => {
	
	init();
	
});

function resize() {
	let width = $(window).width();
	renderer.setSize(width, width * (9 / 16));
	$('#render-target').width(width).height(width * (9 / 16)).css('border-bottom', '2px solid #fa056f');
}

function init() {
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x282828);
	scene.add(new THREE.AmbientLight(0xffffff, 0.125));
	
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
	//directionalLight.position.set(0, 100, -200);
	directionalLight.target = new THREE.Object3D();
	scene.add(directionalLight);
	
	camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.01, 128);
	camera.position.set(0, 0, 10);
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById('render-target')});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize($(window).width(), $(window).width() * (9 / 16));
	
	const groundGeometry = new THREE.PlaneBufferGeometry(256, 256, 128, 128);
	const groundMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		metalness: 0.875,
		roughness: 0.5,
		clearCoat: 1.0,
		clearCoatRoughness: 0.0,
		reflectivity: 1.0,
	});
	const ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -8;
	const groundLineVerts = [];
	for (var x = -128; x <= 128; x += 4) {
		groundLineVerts.push(x, -128, 0.01);
		groundLineVerts.push(x, 128, 0.01);
	}
	for (var y = -128; y <= 128; y += 4) {
		groundLineVerts.push(-128, y, 0.01);
		groundLineVerts.push(128, y, 0.01);
	}
	const groundLinesGeom = new THREE.BufferGeometry();
	groundLinesGeom.addAttribute('position', new THREE.Float32BufferAttribute(groundLineVerts, 3));
	const groundLinesMat = new THREE.LineBasicMaterial({color: 0x05eafa, linewidth: 1,});
	const groundLines = new THREE.LineSegments(groundLinesGeom, groundLinesMat);
	scene.add(ground);
	ground.add(groundLines);
	
	const dodecGeometry = new THREE.DodecahedronBufferGeometry(3, 0);
	const dodecMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		metalness: 1.0,
		roughness: 0.5,
		clearCoat: 1.0,
		clearCoatRoughness: 0.0,
		reflectivity: 1.0,
	});
	const dodecEdgeGeometry = new THREE.EdgesGeometry(dodecGeometry);
	const dodecEdgeMaterial = new THREE.LineBasicMaterial({color: 0xfa056f,});
	dodecahedron = new THREE.Mesh(dodecGeometry, dodecMaterial);
	dodecahedron2 = new THREE.Mesh(dodecGeometry, dodecMaterial);
	const dodecEdges = new THREE.LineSegments(dodecEdgeGeometry, dodecEdgeMaterial);
	const dodecEdges2 = new THREE.LineSegments(dodecEdgeGeometry, dodecEdgeMaterial);
	dodecahedron.position.set(-16, 0, -12);
	dodecahedron2.position.set(16, 0, -12);
	dodecahedron.y = 0;
	dodecahedron2.y = 0;
	scene.add(dodecahedron);
	scene.add(dodecahedron2);
	dodecahedron.add(dodecEdges);
	dodecahedron2.add(dodecEdges2);
	dodecahedron2.rotation.y = 0.78;
	
	resize();
	$(window).on('resize', () => {
		resize();
	});
	
	animate();
	
}

function animate() {
	requestAnimationFrame(animate);
	
	dodecahedron.position.y = dodecahedron.y + Math.sin(Date.now() / 1000);
	dodecahedron.rotation.y += 0.01;
	
	dodecahedron2.position.y = dodecahedron.y + Math.sin(Date.now() / 1000 + 300);
	dodecahedron2.rotation.y += 0.01;
	
	render();
};

function render() {
	renderer.render(scene, camera);
};
