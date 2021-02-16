import { a, useSpring } from '@react-spring/three';
import { meshBounds, useGLTF, useMatcapTexture } from '@react-three/drei';
import * as React from 'react';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { TSquare } from '../square/tsquare';
import { BoardProps } from '../types';

const DEG = Math.PI / 180;

const calc = (x: number, y: number) => ({ x: -(y - window.innerHeight / 2) / 50, y: -(x - window.innerWidth / 2) / 50, s: 1.05 });

export function TBoardGlb(props: BoardProps) {

  const [squares, setSquares] = useState(false);
  const [style, set] = useSpring<{ opacity: number, x: number, y: number, s: number }>(() => ({
    from: {
      opacity: 0,
      x: -45, y: 0, s: 1,
    },
    to: {
      opacity: 1,
      x: 0, y: 0, s: 1,
    },
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  }) as any);

  if (!squares) {
    setTimeout(() => {
      setSquares(true);
    }, 250);
  }

  // Loads model, uses CDN draco when needed
  const { nodes, materials } = useGLTF('/assets/models/tttoe-scaled.glb', true);
  // board, square, circle, cross
  const [matcap] = useMatcapTexture('E6E3E3_B5AFAF_CCC4C4_C4C4C4'); // ('EAEAEA_B5B5B5_CCCCCC_D4D4D4');

  const mesh = useRef<THREE.Object3D>();

  const rx = style.x.to([0, 1], [0, DEG]);
  const ry = style.y.to([0, 1], [0, DEG]);
  const s = style.s;
  // const o = style.opacity.to([0, 1], [0, 1]);

  // {...props}
  // <a.mesh ref={mesh} receiveShadow
  return (
    <a.mesh ref={mesh}
      rotation-x={rx} rotation-y={ry}
      scale-x={s} scale-y={s} scale-z={s}
      onPointerMove={({ clientX: x, clientY: y }) => set(calc(x, y))}
      onPointerOut={() => set({ x: 0, y: 0, s: 1 })}
      geometry={(nodes.board as THREE.Mesh).geometry}
      raycast={meshBounds}
    >
      <meshMatcapMaterial matcap={matcap} />
      {squares && (props.squares.map((v, i) => <TSquare
      square={nodes.square as THREE.Mesh} circle={nodes.circle as THREE.Mesh} cross={nodes.cross as THREE.Mesh}
      key={i} index={i} value={v} victory={props.victoryLine.indexOf(i) !== -1} onClick={props.onClick} />))}
    </a.mesh>
  );
}
// <meshStandardMaterial metalness={0.0} roughness={0.1} color={'#6060b4'} />

// <RoundedBox args={[5, 5, 1]} radius={0.5} smoothness={4} />
