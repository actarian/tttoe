
import * as React from 'react';
import { useRef } from 'react';
import { useFrame } from 'react-three-fiber';

const DEG = Math.PI / 180;

export function Loading() {

  const mesh = useRef<THREE.Object3D>();

  useFrame(() => {
    if (mesh && mesh.current) {
      mesh.current.rotation.y += DEG * 2;
      mesh.current.rotation.x += DEG * 2;
    }
  });

  return (
    <mesh ref={mesh}
    >
      <icosahedronBufferGeometry args={[0.6, 0]} />
      <meshStandardMaterial metalness={0.0} roughness={0.1} color={'#ffffff'} />
    </mesh>
  );
}
