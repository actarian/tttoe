
import { a, useSpring } from '@react-spring/three';
import { meshBounds } from '@react-three/drei';
import * as React from 'react';
import { useMemo, useRef } from 'react';
import { BufferGeometry } from 'three';
import { CircleProps } from '../types';

export function Circle(props: CircleProps) {

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
  const geometry = useMemo<BufferGeometry>(() => props.circle.geometry, []);

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
      <meshMatcapMaterial matcap={props.black} />
    </a.mesh>
  );
  // <meshStandardMaterial metalness={0.0} roughness={0.1} color={'#111111'} />
  // <torusBufferGeometry args={[0.35, 0.08, 18, 36, 6.3]} />
}
