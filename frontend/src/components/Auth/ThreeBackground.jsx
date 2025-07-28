import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const FloatingParticle = ({ position, speed, color, size = 0.1 }) => {
  const meshRef = useRef();
  const initialPosition = useMemo(() => position, []);
  const time = useRef(0);

  useFrame((state) => {
    time.current += 0.01;
    const mesh = meshRef.current;
    
    // Gentle floating animation
    mesh.position.y = initialPosition[1] + Math.sin(time.current * speed) * 0.3;
    mesh.position.x = initialPosition[0] + Math.sin(time.current * 0.5) * 0.2;
    mesh.position.z = initialPosition[2] + Math.cos(time.current * 0.5) * 0.2;
    
    // Subtle rotation
    mesh.rotation.x += 0.005 * speed;
    mesh.rotation.y += 0.005 * speed;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <Sphere args={[size, 8, 8]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.3}
      />
    </mesh>
  );
};

const ThreeBackground = () => {
  const particles = useMemo(() => [
    { position: [-8, 2, -5], speed: 0.8, color: '#10b981', size: 0.08 },
    { position: [8, -1, -3], speed: 1.2, color: '#3b82f6', size: 0.06 },
    { position: [-6, 4, -8], speed: 0.6, color: '#8b5cf6', size: 0.07 },
    { position: [6, 1, -6], speed: 1.0, color: '#06b6d4', size: 0.05 },
    { position: [-4, -2, -4], speed: 0.9, color: '#f59e0b', size: 0.04 },
    { position: [4, 3, -7], speed: 0.7, color: '#ec4899', size: 0.06 },
    { position: [-2, 5, -9], speed: 1.1, color: '#84cc16', size: 0.03 },
    { position: [2, -3, -5], speed: 0.8, color: '#ef4444', size: 0.05 },
    { position: [-7, 1, -6], speed: 0.9, color: '#10b981', size: 0.04 },
    { position: [7, 2, -4], speed: 0.7, color: '#3b82f6', size: 0.05 },
    { position: [-5, -1, -7], speed: 1.0, color: '#8b5cf6', size: 0.06 },
    { position: [5, 4, -8], speed: 0.8, color: '#06b6d4', size: 0.04 },
  ], []);

  return (
    <>
      {/* Subtle ambient light */}
      <ambientLight intensity={0.2} />
      
      {/* Floating particles */}
      {particles.map((particle, index) => (
        <FloatingParticle key={index} {...particle} />
      ))}
    </>
  );
};

export default ThreeBackground; 