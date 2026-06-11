"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshWobbleMaterial,
  Sphere,
  Torus,
  Box,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

// Nudge the camera with the mouse for depth parallax
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.4 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function BirdLogo() {
  const texture = useTexture("/skye-bird.png");
  const meshRef = useRef<THREE.Mesh>(null);

  texture.repeat.set(1, 0.42);
  texture.offset.set(0, 0.58);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.06;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <planeGeometry args={[3.2, 1.5]} />
        <meshBasicMaterial
          map={texture}
          blending={THREE.AdditiveBlending}
          color="#c9a96e"
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

// Orbiting rings, accent spheres, particles — unchanged
function Orbits() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main orbital ring */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <Torus args={[2.5, 0.05, 16, 100]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#c9a96e"
            roughness={0.3}
            metalness={0.9}
            transparent
            opacity={0.6}
          />
        </Torus>
      </Float>

      {/* Secondary tilted ring */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <Torus
          args={[3.2, 0.03, 16, 100]}
          position={[0, 0, 0]}
          rotation={[Math.PI / 4, 0, 0]}
        >
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.9}
            transparent
            opacity={0.3}
          />
        </Torus>
      </Float>

      {/* Accent spheres */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.15, 16, 16]} position={[2, 1.5, 0.5]}>
          <MeshWobbleMaterial
            color="#c9a96e"
            factor={0.6}
            speed={2}
            roughness={0.1}
            metalness={1}
          />
        </Sphere>
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1}>
        <Box args={[0.3, 0.3, 0.3]} position={[-2, -1, 1]} rotation={[0.5, 0.5, 0]}>
          <meshStandardMaterial
            color="#c9a96e"
            roughness={0.2}
            metalness={0.9}
            transparent
            opacity={0.7}
          />
        </Box>
      </Float>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        <Sphere args={[0.1, 16, 16]} position={[-1.5, 2, -0.5]}>
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={1} />
        </Sphere>
      </Float>

      {/* Particle field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#c9a96e"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <planeGeometry args={[3, 3]} />
      <meshStandardMaterial color="#c9a96e" wireframe />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#c9a96e" />
          {/* Warm glow behind the bird */}
          <pointLight position={[0, 0, 2]} intensity={0.8} color="#c9a96e" />
          <CameraRig />
          <BirdLogo />
          <Orbits />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
