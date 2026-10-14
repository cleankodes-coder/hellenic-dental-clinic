import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface DentalHero3DProps {
  onExploreTreatments?: () => void;
  onBookAppointment?: () => void;
}

export const DentalHero3D: React.FC<DentalHero3DProps> = ({
  onExploreTreatments,
  onBookAppointment,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [materialMode, setMaterialMode] = useState<'enamel' | 'ceramic' | 'sapphire'>('enamel');
  const [isInteractive, setIsInteractive] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const toothMeshRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRotating(false);
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 4.2);

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Lighting & Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.4);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (Subtle Royal Blue bounce)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    // Rim / Backlight
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.8);
    rimLight.position.set(0, -2, -3);
    scene.add(rimLight);

    // 4. Ground Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(15, 31, 56, 0.45)');
    grad.addColorStop(0.5, 'rgba(15, 31, 56, 0.2)');
    grad.addColorStop(1, 'rgba(15, 31, 56, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const shadowTexture = new THREE.CanvasTexture(canvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.35;
    scene.add(shadowPlane);

    // 5. Procedural Anatomical Tooth Sculpture
    const toothGroup = new THREE.Group();
    scene.add(toothGroup);
    toothMeshRef.current = toothGroup;

    // Pearlescent Enamel Material (Physical PBR)
    const enamelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfafcff,
      metalness: 0.05,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
      transmission: 0.15, // Subtle natural enamel translucency
      thickness: 0.8,
      ior: 1.54,
    });
    materialRef.current = enamelMaterial;

    // Build stylized anatomical tooth structure using smooth geometric compounds
    // Crown Main Body
    const crownGeo = new THREE.CylinderGeometry(0.85, 0.65, 1.0, 32, 16);
    // Deform vertices for natural crown curvature
    const pos = crownGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Gentle bulbous curvature in upper crown
      if (y > 0) {
        const factor = 1.0 + Math.sin((y + 0.5) * Math.PI) * 0.15;
        pos.setX(i, x * factor);
        pos.setZ(i, z * factor);
      }
    }
    crownGeo.computeVertexNormals();

    const crownMesh = new THREE.Mesh(crownGeo, enamelMaterial);
    crownMesh.position.y = 0.25;
    crownMesh.castShadow = true;
    toothGroup.add(crownMesh);

    // 4 Occlusal Cusps (Anatomical molar crests)
    const cuspPositions = [
      { x: -0.38, y: 0.8, z: -0.35, r: 0.38 },
      { x: 0.38, y: 0.8, z: -0.35, r: 0.38 },
      { x: -0.38, y: 0.78, z: 0.35, r: 0.36 },
      { x: 0.38, y: 0.78, z: 0.35, r: 0.36 },
    ];

    cuspPositions.forEach(c => {
      const cuspGeo = new THREE.SphereGeometry(c.r, 24, 24);
      const cuspMesh = new THREE.Mesh(cuspGeo, enamelMaterial);
      cuspMesh.position.set(c.x, c.y, c.z);
      cuspMesh.scale.set(1.0, 0.85, 1.0);
      cuspMesh.castShadow = true;
      toothGroup.add(cuspMesh);
    });

    // 2 Elegant Roots (Bifurcated anatomical roots)
    const rootPath1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, -0.2, 0),
      new THREE.Vector3(-0.35, -0.7, -0.05),
      new THREE.Vector3(-0.28, -1.25, -0.02)
    ]);
    const rootGeo1 = new THREE.TubeGeometry(rootPath1, 32, 0.24, 16, false);
    // Taper root end
    const rootPos1 = rootGeo1.attributes.position;
    for (let i = 0; i < rootPos1.count; i++) {
      const y = rootPos1.getY(i);
      if (y < -0.6) {
        const t = Math.max(0.3, 1.0 + (y + 0.6) * 0.8);
        rootPos1.setX(i, rootPos1.getX(i) * t);
        rootPos1.setZ(i, rootPos1.getZ(i) * t);
      }
    }
    rootGeo1.computeVertexNormals();
    const rootMesh1 = new THREE.Mesh(rootGeo1, enamelMaterial);
    rootMesh1.castShadow = true;
    toothGroup.add(rootMesh1);

    const rootPath2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, -0.2, 0),
      new THREE.Vector3(0.35, -0.7, 0.05),
      new THREE.Vector3(0.28, -1.25, 0.02)
    ]);
    const rootGeo2 = new THREE.TubeGeometry(rootPath2, 32, 0.24, 16, false);
    const rootPos2 = rootGeo2.attributes.position;
    for (let i = 0; i < rootPos2.count; i++) {
      const y = rootPos2.getY(i);
      if (y < -0.6) {
        const t = Math.max(0.3, 1.0 + (y + 0.6) * 0.8);
        rootPos2.setX(i, rootPos2.getX(i) * t);
        rootPos2.setZ(i, rootPos2.getZ(i) * t);
      }
    }
    rootGeo2.computeVertexNormals();
    const rootMesh2 = new THREE.Mesh(rootGeo2, enamelMaterial);
    rootMesh2.castShadow = true;
    toothGroup.add(rootMesh2);

    // Subtle Grecian Gold Orbit Accent Ring
    const orbitGeo = new THREE.TorusGeometry(1.4, 0.018, 16, 80);
    const orbitMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.15
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 3;
    orbitMesh.rotation.y = Math.PI / 6;
    toothGroup.add(orbitMesh);

    // Center offset
    toothGroup.position.y = 0.1;

    // Mouse Tracking Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Exponential damping mouse rotation
      mouseX = THREE.MathUtils.damp(mouseX, targetX, 4, delta);
      mouseY = THREE.MathUtils.damp(mouseY, targetY, 4, delta);

      if (toothMeshRef.current) {
        if (isRotating && !prefersReducedMotion) {
          toothMeshRef.current.rotation.y += delta * 0.4;
        }

        // Apply interactive mouse tilt
        toothMeshRef.current.rotation.x = THREE.MathUtils.damp(
          toothMeshRef.current.rotation.x,
          mouseY * 0.6,
          4,
          delta
        );
        toothMeshRef.current.rotation.z = THREE.MathUtils.damp(
          toothMeshRef.current.rotation.z,
          -mouseX * 0.4,
          4,
          delta
        );

        // Gentle breathing bobbing
        toothMeshRef.current.position.y = 0.1 + Math.sin(currentTime * 0.0015) * 0.06;

        // Counter-rotate orbit accent
        orbitMesh.rotation.z += delta * 0.2;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      crownGeo.dispose();
      rootGeo1.dispose();
      rootGeo2.dispose();
      orbitGeo.dispose();
      shadowGeo.dispose();
      enamelMaterial.dispose();
      orbitMat.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating]);

  // Update material preset on demand
  useEffect(() => {
    if (!materialRef.current) return;
    const mat = materialRef.current;

    if (materialMode === 'enamel') {
      mat.color.setHex(0xfafcff);
      mat.metalness = 0.05;
      mat.roughness = 0.12;
      mat.transmission = 0.15;
      mat.clearcoat = 1.0;
    } else if (materialMode === 'ceramic') {
      mat.color.setHex(0xffffff);
      mat.metalness = 0.0;
      mat.roughness = 0.22;
      mat.transmission = 0.05;
      mat.clearcoat = 0.6;
    } else if (materialMode === 'sapphire') {
      mat.color.setHex(0x2563eb);
      mat.metalness = 0.1;
      mat.roughness = 0.08;
      mat.transmission = 0.85;
      mat.clearcoat = 1.0;
    }
  }, [materialMode]);

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] flex items-center justify-center overflow-hidden">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        title="Interactive 3D Dental Sculpture — Hellenic Dental Clinic"
      />

      {/* Luxury Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-blue-500/10 via-transparent to-transparent z-0" />

      {/* Ergonomic Glassmorphic Bottom Dock (Following ThreeJS Skill Directives: Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-[420px] px-4 pointer-events-auto">
        <div className="backdrop-blur-md bg-slate-900/80 border border-slate-700/60 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-2">
          {/* Preset Finishes */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <span className="hidden sm:inline pl-1.5 text-slate-400">Finish:</span>
            <button
              type="button"
              onClick={() => setMaterialMode('enamel')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                materialMode === 'enamel'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Enamel
            </button>
            <button
              type="button"
              onClick={() => setMaterialMode('ceramic')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                materialMode === 'ceramic'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Ceramic
            </button>
            <button
              type="button"
              onClick={() => setMaterialMode('sapphire')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                materialMode === 'sapphire'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Sapphire
            </button>
          </div>

          {/* Rotation Toggle */}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Toggle automated rotation"
          >
            {isRotating ? 'Pause' : 'Rotate'}
          </button>
        </div>
      </div>

      {/* Static spec label */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:block">
        <div className="backdrop-blur-sm bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 font-mono tracking-wider">
          PBR ANATOMICAL SCULPTURE • 60 FPS
        </div>
      </div>
    </div>
  );
};
