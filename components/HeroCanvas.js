// zexus-governance/components/HeroCanvas.js

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Sparkles, PerspectiveCamera } from '@react-three/drei';

// Компонент для создания вращающейся сферы из частиц
function ParticleSphere() {
  const ref = useRef();

  const positions = useMemo(() => {
    const count = 10000;
    const temp = new Float32Array(count * 3);
    const radius = 4.5;

    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002;
      ref.current.rotation.x -= 0.0001; 
    }
  });

  return (
    <points ref={ref} position={[0, -0.5, -5]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFA500"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Компонент для создания вращающегося кольца из частиц
function ParticleRing() {
  const ref = useRef();

  const positions = useMemo(() => {
    const count = 15000;
    const temp = new Float32Array(count * 3);
    const innerRadius = 5.5;
    const outerRadius = 6.5;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.lerp(innerRadius, outerRadius, Math.random());
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 0.5;
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Постоянное вращение по горизонтали
      ref.current.rotation.y += 0.0005; 
      // Небольшой статический наклон для эффекта
      ref.current.rotation.x = 0.3; 
      
      const scale = 1 + Math.sin(clock.elapsedTime * 0.8) * 0.02;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <points ref={ref} position={[0, -0.5, -5]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#B58C5A"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Компонент для создания заметных фоновых частиц
function BackgroundPoints() {
  const ref = useRef();
  
  const points = useMemo(() => {
    const count = 500;
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#B58C5A"
        size={0.05}
        sizeAttenuation
        transparent
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <PerspectiveCamera makeDefault position={[0, -0.75, 8]} />
      <color attach="background" args={['#0A0A0A']} /> 
      <fog attach="fog" args={['#0A0A0A', 5, 25]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFD700" />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />
      
      <ParticleSphere />
      <ParticleRing />
      <BackgroundPoints />
      <Sparkles count={100} speed={0.5} opacity={0.5} color="#FFA500" scale={10} />
    </Canvas>
  );
}