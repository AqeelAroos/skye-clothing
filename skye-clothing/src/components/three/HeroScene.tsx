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
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.3 - camera.position.y) * 0.04;
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
    meshRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.25) * 0.1;
    meshRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.04;
  });

  return (
    <Float speed={1} rotationIntensity={0.08} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[0, 0.3, 0.5]}>
        <planeGeometry args={[7, 3.5]} />
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

function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
        <Torus args={[3.2, 0.07, 32, 128]} rotation={[Math.PI / 5, 0.2, 0]}>
          <meshStandardMaterial
            color="#c9a96e"
            roughness={0.12}
            metalness={1}
            transparent
            opacity={0.9}
          />
        </Torus>
      </Float>

      <Float speed={0.7} rotationIntensity={0.15} floatIntensity={0.3}>
        <Torus
          args={[3.8, 0.055, 32, 128]}
          rotation={[Math.PI / 2.8, -0.6, 0.3]}
        >
          <meshStandardMaterial
            color="#b8943e"
            roughness={0.18}
            metalness={1}
            transparent
            opacity={0.7}
          />
        </Torus>
      </Float>

      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.5}>
        <Torus
          args={[2.4, 0.05, 32, 128]}
          rotation={[-Math.PI / 4.5, 0.8, -0.2]}
        >
          <meshStandardMaterial
            color="#dfc399"
            roughness={0.1}
            metalness={1}
            transparent
            opacity={0.8}
          />
        </Torus>
      </Float>

      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Torus
          args={[4.2, 0.035, 32, 128]}
          rotation={[Math.PI / 2.2, 0.4, -0.5]}
        >
          <meshStandardMaterial
            color="#c9a96e"
            roughness={0.22}
            metalness={0.9}
            transparent
            opacity={0.4}
          />
        </Torus>
      </Float>

      <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.35}>
        <Torus
          args={[2.9, 0.04, 32, 128]}
          rotation={[Math.PI / 1.7, -0.3, 0.7]}
        >
          <meshStandardMaterial
            color="#a68a4b"
            roughness={0.15}
            metalness={1}
            transparent
            opacity={0.55}
          />
        </Torus>
      </Float>
    </group>
  );
}

function ChromeSpheres() {
  return (
    <>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.18, 32, 32]} position={[2.8, 1.8, 1]}>
          <meshStandardMaterial
            color="#999"
            roughness={0.03}
            metalness={1}
            envMapIntensity={2}
          />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
        <Sphere args={[0.13, 32, 32]} position={[-2, 2.4, 0.5]}>
          <meshStandardMaterial
            color="#aaa"
            roughness={0.03}
            metalness={1}
            envMapIntensity={2}
          />
        </Sphere>
      </Float>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
        <Sphere args={[0.09, 32, 32]} position={[1.2, -2.2, 0.8]}>
          <meshStandardMaterial
            color="#bbb"
            roughness={0.03}
            metalness={1}
            envMapIntensity={2}
          />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.8}>
        <Sphere args={[0.15, 32, 32]} position={[-3.2, -0.5, -0.5]}>
          <meshStandardMaterial
            color="#999"
            roughness={0.03}
            metalness={1}
            envMapIntensity={2}
          />
        </Sphere>
      </Float>
    </>
  );
}

function GoldenParticles() {
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(350 * 3);
    for (let i = 0; i < 350; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={350}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#c9a96e"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
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
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 50%, rgba(201,169,110,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 65% 35%, rgba(201,169,110,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 45% 50% at 30% 65%, rgba(140,110,50,0.08) 0%, transparent 50%)
          `,
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        className="relative z-[2]"
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#c9a96e" />
          <pointLight position={[0, 0, 3]} intensity={1.2} color="#c9a96e" />
          <pointLight position={[3, 2, 2]} intensity={0.5} color="#dfc399" />
          <pointLight position={[-3, -2, 2]} intensity={0.3} color="#b8943e" />
          <CameraRig />
          <BirdLogo />
          <OrbitalRings />
          <ChromeSpheres />
          <GoldenParticles />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
