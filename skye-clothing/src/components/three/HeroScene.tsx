"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  Sphere,
  Torus,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { heroScrollProgress } from "@/lib/scroll-progress";

const mouse2D = { x: 0, y: 0 };

function useGlobalMouse() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse2D.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse2D.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

function CameraRig() {
  const { camera } = useThree();
  useGlobalMouse();

  useFrame(() => {
    const sp = heroScrollProgress.current;
    const baseZ = 8 + sp * 4;
    camera.position.x += (mouse2D.x * 0.3 - camera.position.x) * 0.03;
    camera.position.y +=
      (mouse2D.y * 0.2 + sp * 1.5 - camera.position.y) * 0.03;
    camera.position.z += (baseZ - camera.position.z) * 0.06;
    camera.lookAt(0, 0.6, 0);
  });

  return null;
}

function InteractiveGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current) return;
    targetRotation.current.y = mouse2D.x * 0.35;
    targetRotation.current.x = -mouse2D.y * 0.25;
    groupRef.current.rotation.y +=
      (targetRotation.current.y - groupRef.current.rotation.y) * 0.06;
    groupRef.current.rotation.x +=
      (targetRotation.current.x - groupRef.current.rotation.x) * 0.06;
  });

  return <group ref={groupRef}>{children}</group>;
}

function BirdLogo() {
  const texture = useTexture("/skye-bird.png");
  const meshRef = useRef<THREE.Mesh>(null);

  texture.repeat.set(1, 0.42);
  texture.offset.set(0, 0.58);

  useFrame(() => {
    if (!meshRef.current) return;
    const sp = heroScrollProgress.current;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 1 - sp * 1.5;
  });

  return (
    <Float speed={0.6} rotationIntensity={0.03} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0.8, 0.5]}>
        <planeGeometry args={[4.2, 2.1]} />
        <meshBasicMaterial
          map={texture}
          blending={THREE.AdditiveBlending}
          color="#ffffff"
          transparent
          opacity={1}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

function StardustRing({
  radius,
  rotation,
  position,
  ringRef,
}: {
  radius: number;
  rotation: [number, number, number];
  position: [number, number, number];
  ringRef: React.RefObject<THREE.Group | null>;
}) {
  const additiveMat = (color: string, opacity: number) => (
    <meshBasicMaterial
      color={color}
      transparent
      opacity={opacity}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      toneMapped={false}
      side={THREE.DoubleSide}
    />
  );

  const r = radius;

  return (
    <group ref={ringRef} rotation={rotation} position={position}>
      {/* Thin bright core */}
      <Torus args={[r, 0.018, 32, 300]}>
        {additiveMat("#a0c8ff", 0.6)}
      </Torus>

      {/* Inner white-blue glow */}
      <Torus args={[r, 0.04, 32, 300]}>
        {additiveMat("#c0d8ff", 0.35)}
      </Torus>

      {/* Mid blue aura */}
      <Torus args={[r, 0.08, 24, 300]}>
        {additiveMat("#4080d0", 0.15)}
      </Torus>

      {/* Outer soft bloom */}
      <Torus args={[r, 0.15, 16, 300]}>
        {additiveMat("#2050a0", 0.06)}
      </Torus>

      {/* Sparkle wisps */}
      <Torus args={[r * 1.02, 0.05, 16, 300]} rotation={[0.1, 0.18, 0]}>
        {additiveMat("#80b0ff", 0.12)}
      </Torus>
      <Torus args={[r * 0.98, 0.04, 16, 300]} rotation={[-0.08, -0.12, 0.06]}>
        {additiveMat("#6090e0", 0.1)}
      </Torus>
    </group>
  );
}

function OrbitalRings() {
  const ringsRef = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Group>(null);
  const ring2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sp = heroScrollProgress.current;
    const expansion = 1 + sp * 2.5;

    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.04;
    }

    if (ring1.current) {
      ring1.current.scale.setScalar(expansion);
      ring1.current.rotation.z = t * 0.07 + sp * Math.PI * 0.5;
    }
    if (ring2.current) {
      ring2.current.scale.setScalar(expansion);
      ring2.current.rotation.z = -t * 0.05 + sp * Math.PI * 0.3;
    }
  });

  return (
    <group ref={ringsRef}>
      <StardustRing
        ringRef={ring1}
        radius={1.9}
        rotation={[Math.PI / 5, 0.15, 0]}
        position={[0, 0.7, 0]}
      />
      <StardustRing
        ringRef={ring2}
        radius={2.2}
        rotation={[Math.PI / 3.5, -0.4, 0.15]}
        position={[0, 0.6, 0]}
      />
    </group>
  );
}

function CosmicSpheres() {
  const refs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const basePositions = useMemo(
    () => [
      new THREE.Vector3(2.2, 2.2, 1.0),
      new THREE.Vector3(-1.8, 2.4, 0.5),
      new THREE.Vector3(2.5, 0.3, 0.8),
      new THREE.Vector3(-2.4, 0.4, -0.3),
    ],
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sp = heroScrollProgress.current;
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      const bp = basePositions[i];
      const drift = 1 + sp * 3;
      ref.current.position.set(
        bp.x * drift + Math.sin(t * (0.3 + i * 0.1)) * 0.3,
        bp.y * drift + Math.sin(t * (0.4 + i * 0.15)) * 0.4,
        bp.z * drift + Math.cos(t * (0.2 + i * 0.1)) * 0.2,
      );
    });
  });

  const sizes = [0.16, 0.11, 0.08, 0.13];

  return (
    <>
      {refs.map((ref, i) => (
        <Sphere key={i} ref={ref} args={[sizes[i], 32, 32]}>
          <meshStandardMaterial
            color="#c0c8d8"
            emissive="#404860"
            emissiveIntensity={0.3}
            roughness={0.7}
            metalness={0.1}
            envMapIntensity={0.6}
          />
        </Sphere>
      ))}
    </>
  );
}

function CosmicParticles() {
  const ref = useRef<THREE.Points>(null);
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={600}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#a0c0ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function MouseGlow() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!lightRef.current) return;
    const tx = mouse2D.x * 4;
    const ty = mouse2D.y * 3 + 0.5;
    lightRef.current.position.x +=
      (tx - lightRef.current.position.x) * 0.08;
    lightRef.current.position.y +=
      (ty - lightRef.current.position.y) * 0.08;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0.5, 4]}
      intensity={0.8}
      color="#4080c0"
      distance={8}
      decay={2}
    />
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Cosmic space background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, #0a1628 0%, #050d18 100%)
          `,
        }}
      />
      {/* Nebula clouds */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse 45% 55% at 75% 40%, rgba(30,60,140,0.4) 0%, transparent 70%),
            radial-gradient(ellipse 50% 45% at 20% 60%, rgba(20,50,120,0.3) 0%, transparent 65%),
            radial-gradient(ellipse 35% 40% at 85% 70%, rgba(40,80,160,0.25) 0%, transparent 55%),
            radial-gradient(ellipse 30% 35% at 10% 30%, rgba(25,55,130,0.2) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 50% 45%, rgba(15,35,80,0.15) 0%, transparent 75%)
          `,
        }}
      />
      {/* Star sparkles via CSS */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(1px 1px at 15% 25%, rgba(180,210,255,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 82% 18%, rgba(200,220,255,0.8) 0%, transparent 100%),
            radial-gradient(2px 2px at 45% 85%, rgba(160,200,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 68% 72%, rgba(180,210,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 68%, rgba(200,225,255,0.7) 0%, transparent 100%),
            radial-gradient(2px 2px at 90% 55%, rgba(170,200,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 12%, rgba(190,215,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 8% 82%, rgba(180,210,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 35% 42%, rgba(200,220,255,0.4) 0%, transparent 100%),
            radial-gradient(2px 2px at 72% 38%, rgba(160,200,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 5% 50%, rgba(190,220,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 95% 85%, rgba(180,210,255,0.4) 0%, transparent 100%)
          `,
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        className="relative z-[2]"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} color="#a0c0e0" />
          <pointLight position={[4, 3, 5]} intensity={1.5} color="#4080c0" />
          <pointLight position={[-3, -2, 4]} intensity={0.8} color="#3060a0" />
          <pointLight position={[0, 0.5, 6]} intensity={0.5} color="#c0d8ff" />
          <MouseGlow />
          <CameraRig />
          <InteractiveGroup>
            <BirdLogo />
            <OrbitalRings />
            <CosmicSpheres />
          </InteractiveGroup>
          <CosmicParticles />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
