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

function OrbitalRings() {
  const ringsRef = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sp = heroScrollProgress.current;
    const expansion = 1 + sp * 2.5;

    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.04;
    }

    [ring1, ring2, ring3].forEach((ref) => {
      if (ref.current) {
        ref.current.scale.setScalar(expansion);
      }
    });

    if (ring1.current)
      ring1.current.rotation.z = t * 0.07 + sp * Math.PI * 0.5;
    if (ring2.current)
      ring2.current.rotation.z = -t * 0.05 + sp * Math.PI * 0.3;
    if (ring3.current)
      ring3.current.rotation.x =
        -Math.PI / 4.5 + t * 0.04 + sp * Math.PI * 0.4;
  });

  const ringMat = (color: string, opacity: number) => (
    <meshBasicMaterial
      color={color}
      transparent
      opacity={opacity}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      toneMapped={false}
    />
  );

  return (
    <group ref={ringsRef}>
      <Torus
        ref={ring1}
        args={[1.8, 0.015, 48, 200]}
        rotation={[Math.PI / 5, 0.15, 0]}
        position={[0, 0.7, 0]}
      >
        {ringMat("#c9a96e", 0.35)}
      </Torus>

      <Torus
        ref={ring2}
        args={[2.1, 0.012, 48, 200]}
        rotation={[Math.PI / 3.5, -0.4, 0.15]}
        position={[0, 0.6, 0]}
      >
        {ringMat("#e8c864", 0.25)}
      </Torus>

      <Torus
        ref={ring3}
        args={[1.5, 0.018, 48, 200]}
        rotation={[Math.PI / 4, 0.5, -0.1]}
        position={[0, 0.8, 0]}
      >
        {ringMat("#d4af37", 0.3)}
      </Torus>
    </group>
  );
}

function ChromeSpheres() {
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

  const sizes = [0.18, 0.12, 0.09, 0.14];

  return (
    <>
      {refs.map((ref, i) => (
        <Sphere key={i} ref={ref} args={[sizes[i], 32, 32]}>
          <meshStandardMaterial
            color="#cccccc"
            roughness={0.02}
            metalness={1}
            envMapIntensity={2.5}
          />
        </Sphere>
      ))}
    </>
  );
}

function GoldenParticles() {
  const ref = useRef<THREE.Points>(null);
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={400}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#c9a96e"
        transparent
        opacity={0.45}
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
      intensity={1.2}
      color="#e8c864"
      distance={8}
      decay={2}
    />
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse 50% 70% at 78% 38%, rgba(180,140,50,0.32) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 85% 55%, rgba(160,120,40,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 18% 55%, rgba(140,110,40,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(100,80,30,0.06) 0%, transparent 80%)
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
          <ambientLight intensity={0.25} color="#ffe8c0" />
          <pointLight position={[4, 3, 5]} intensity={2.5} color="#D4AF37" />
          <pointLight position={[-3, -2, 4]} intensity={1} color="#c9a96e" />
          <pointLight position={[0, 0.5, 6]} intensity={0.8} color="#ffe0a0" />
          <MouseGlow />
          <CameraRig />
          <InteractiveGroup>
            <BirdLogo />
            <OrbitalRings />
            <ChromeSpheres />
          </InteractiveGroup>
          <GoldenParticles />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
