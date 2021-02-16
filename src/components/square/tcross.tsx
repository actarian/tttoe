
import { a, useSpring } from '@react-spring/three';
import { meshBounds, useMatcapTexture } from '@react-three/drei';
import * as React from 'react';
import { useMemo, useRef } from 'react';
import { BufferGeometry } from 'three';
import { CrossProps } from '../types';

const DEG = Math.PI / 180;

export function TCross(props: CrossProps) {

  const spring = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  });

  const mesh = useRef<THREE.Object3D>();
  const geometry = useMemo<BufferGeometry>(() => props.cross.geometry, []);
  const [matcap] = useMatcapTexture('2A2A2A_B3B3B3_6D6D6D_848C8C');

  // <a.mesh ref={mesh} castShadow
  return (
    <a.mesh ref={mesh}
    position-z={0.1}
    scale-x={spring.opacity}
    scale-y={spring.opacity}
    scale-z={spring.opacity}
    geometry={geometry}
    raycast={meshBounds}
    >
      <meshMatcapMaterial matcap={matcap} />
    </a.mesh>
  );
  // <meshStandardMaterial metalness={0.0} roughness={0.1} color={'#111111'} />
  // <cylinderBufferGeometry args={[0.08, 0.08, 0.7, 12]} />
}