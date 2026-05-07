'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface STLViewerProps {
  geometry: THREE.BufferGeometry | null; 
}

function ModelMesh({ geometry }: { geometry: THREE.BufferGeometry }) {
  return (
    <Center> 
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#2563EB" roughness={0.4} metalness={0.2} />
      </mesh>
    </Center>
  );
}

export default function STLViewer({ geometry }: STLViewerProps) {
  if (!geometry) return null;

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 100], fov: 50 }}>
        <Suspense fallback={null}> 
          <Stage environment="city" intensity={0.6}>
            <ModelMesh geometry={geometry} />
          </Stage>
          <ContactShadows opacity={0.7} blur={2} />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={false} />
      </Canvas>
    </div>
  );
}