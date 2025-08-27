'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Компонент для создания медленно дрейфующего облака частиц
function FloatingCloud() {
  const ref = useRef();
  const count = 3000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Распределение частиц в более компактном объеме
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.05; // Замедлим движение
    if (ref.current) {
      ref.current.rotation.y = time * 0.1; // Очень медленное вращение по оси Y
      ref.current.rotation.x = time * 0.05; // Очень медленное вращение по оси X
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#B58C5A" // Золотистый цвет
        size={0.08} // Сделаем частицы побольше
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function AnimVote() {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <color attach="background" args={['#0A0A0A']} />
      <fog attach="fog" args={['#0A0A0A', 5, 25]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFD700" />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />
      
      <FloatingCloud />
      <Sparkles count={100} speed={0.5} opacity={0.5} color="#FFA500" scale={10} />
    </Canvas>
  );
}