
import { a, useSpring } from '@react-spring/three';
import { meshBounds, useMatcapTexture } from '@react-three/drei';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
// import { useFrame } from 'react-three-fiber';
import { BufferGeometry } from 'three';
import { SquareProps } from '../types';
import { Circle } from './circle';
import { Cross } from './cross';

const DEG = Math.PI / 180;

export function Square(props: SquareProps) {
  const [rotation, setRotation] = useState(180);

  const scaleSpring = useSpring({
    from: {
      scale: [0, 0, 0] as [x:number, y:number, z:number],
    },
    to: {
      scale: [1, 1, 1] as [x:number, y:number, z:number],
    },
    delay: 30 * props.index,
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  }) as any;

  const rotationSpring = useSpring({
    rotation: [0, rotation * DEG, 0],
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  }) as any;

  useEffect(() => {
    if (props.value) {
      setRotation(0);
    } else {
      setRotation(180);
    }
  }, [props.value]);

  const mesh = useRef<THREE.Object3D>();
  const geometry = useMemo<BufferGeometry>(() => props.square.geometry, []);
  const [matcap] = useMatcapTexture('E6E3E3_B5AFAF_CCC4C4_C4C4C4');

  const row = Math.floor(props.index / 3);
  const dy = 1 - row;
  const dx = -1 + props.index - row * 3;

  /*
  useFrame(() => {
    if (mesh && mesh.current) {
      mesh.current.rotation.y += (rotation * DEG - mesh.current.rotation.y) / 10;
    }
  })
  */

  // <a.mesh ref={mesh} castShadow receiveShadow
  return (
    <a.mesh ref={mesh}
    position-x={dx * 1.195}
    position-y={dy * 1.195}
    position-z={0}
    scale={scaleSpring.scale}
    rotation={rotationSpring.rotation}
    onClick={() => props.onClick(props.index)}
    geometry={geometry}
    raycast={meshBounds}
    >
      <meshMatcapMaterial matcap={matcap} color={props.victory ? '#ffff00' : '#ffffff'} />
      {props.value === 'X' && (
        <Cross cross={props.cross} />
      )}
      {props.value === 'O' && (
        <Circle circle={props.circle} />
      )}
    </a.mesh>
  );
  // <meshStandardMaterial metalness={0.0} roughness={0.1} color={props.victory ? '#ffff00' : '#ffffff'} />
  // <boxBufferGeometry args={[1, 1, 0.1]} />
}
