let scene, camera, renderer;
let particles = [];
let mousePos = { x: 0, y: 0 };
let prevMousePos = { x: 0, y: 0 };
let currentStyle = 0;
let galaxyParticles;

const MAX_PARTICLES = 200;
const colorPalettes = [
  [0xff006e, 0xfb5607, 0xffbe0b, 0x8338ec, 0x3a86ff],
  [0xf72585, 0x7209b7, 0x3a0ca3, 0x4361ee, 0x4cc9f0],
  [0x06ffa5, 0x00d9ff, 0x7b2cbf, 0xff006e, 0xffbe0b],
  [0xff0a54, 0xff477e, 0xff5c8a, 0xff7096, 0xff85a1]
];
let currentPalette = 0;

function init() {
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;
  
  renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('canvas'),
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Create galaxy background
  createGalaxy();
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add point lights
  const light1 = new THREE.PointLight(0xff00ff, 2, 100);
  light1.position.set(10, 10, 10);
  scene.add(light1);
  
  const light2 = new THREE.PointLight(0x00ffff, 2, 100);
  light2.position.set(-10, -10, 10);
  scene.add(light2);
  
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onMouseMove);
  
  animate();
}

function onMouseMove(e) {
  prevMousePos = { ...mousePos };
  mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
  
  // Create new particles
  const worldPos = screenToWorld(e.clientX, e.clientY);
  createParticle(worldPos);
}

function screenToWorld(x, y) {
  const vector = new THREE.Vector3();
  vector.x = (x / window.innerWidth) * 2 - 1;
  vector.y = -(y / window.innerHeight) * 2 + 1;
  vector.z = 0.5;
  vector.unproject(camera);
  
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));
  
  return pos;
}

function createParticle(position) {
  const palette = colorPalettes[currentPalette];
  const color = palette[Math.floor(Math.random() * palette.length)];
  
  let geometry, material, particle;
  
  if (currentStyle === 0) {
    // Sphere style
    geometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.3, 16, 16);
    material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      shininess: 100,
      transparent: true,
      opacity: 1
    });
  } else {
    // Tube/Cylinder style
    geometry = new THREE.CylinderGeometry(0.15, 0.15, 1 + Math.random(), 8);
    material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.6,
      shininess: 100,
      transparent: true,
      opacity: 1
    });
  }
  
  particle = new THREE.Mesh(geometry, material);
  particle.position.copy(position);
  particle.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  
  const velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1
  );
  
  scene.add(particle);
  particles.push({
    mesh: particle,
    velocity: velocity,
    life: 1,
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.1,
      y: (Math.random() - 0.5) * 0.1,
      z: (Math.random() - 0.5) * 0.1
    }
  });
  
  // Remove oldest particles if too many
  if (particles.length > MAX_PARTICLES) {
    const removed = particles.shift();
    scene.remove(removed.mesh);
    removed.mesh.geometry.dispose();
    removed.mesh.material.dispose();
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  // Slowly rotate the galaxy
  if (galaxyParticles) {
    galaxyParticles.rotation.y += 0.0002;
    galaxyParticles.rotation.x += 0.0001;
  }
  
  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    
    // Update position
    p.mesh.position.add(p.velocity);
    
    // Update rotation
    p.mesh.rotation.x += p.rotationSpeed.x;
    p.mesh.rotation.y += p.rotationSpeed.y;
    p.mesh.rotation.z += p.rotationSpeed.z;
    
    // Fade out
    p.life -= 0.01;
    p.mesh.material.opacity = p.life;
    p.mesh.scale.set(p.life, p.life, p.life);
    
    // Remove dead particles
    if (p.life <= 0) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      particles.splice(i, 1);
    }
  }
  
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function changeColors() {
  currentPalette = (currentPalette + 1) % colorPalettes.length;
}

function toggleStyle() {
  currentStyle = (currentStyle + 1) % 2;
}

function createGalaxy() {
  const starCount = 5000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  
  const galaxyColors = [
    { r: 0.5, g: 0.2, b: 0.8 },  // Purple
    { r: 0.2, g: 0.5, b: 1.0 },  // Blue
    { r: 1.0, g: 0.4, b: 0.7 },  // Pink
    { r: 0.3, g: 0.8, b: 0.9 }   // Cyan
  ];
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    
    // Create spiral galaxy shape
    const radius = Math.random() * 100;
    const spinAngle = radius * 0.1;
    const branchAngle = ((i % 3) / 3) * Math.PI * 2;
    
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 5;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 5;
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 5;
    
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    
    // Mix colors based on distance from center
    const colorIndex = Math.floor(Math.random() * galaxyColors.length);
    const mixedColor = galaxyColors[colorIndex];
    const colorMix = Math.random() * 0.5 + 0.5;
    
    colors[i3] = mixedColor.r * colorMix;
    colors[i3 + 1] = mixedColor.g * colorMix;
    colors[i3 + 2] = mixedColor.b * colorMix;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.3,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    blending: THREE.AdditiveBlending
  });
  
  galaxyParticles = new THREE.Points(geometry, material);
  galaxyParticles.position.z = -50;
  scene.add(galaxyParticles);
}

init();