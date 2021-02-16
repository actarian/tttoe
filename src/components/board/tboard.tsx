
import { a, useSpring } from '@react-spring/three';
import * as React from 'react';
import { useRef, useState } from 'react';
import { BoardProps } from '../types';

const DEG = Math.PI / 180;

const calc = (x: number, y: number) => ({ x: -(y - window.innerHeight / 2) / 50, y: -(x - window.innerWidth / 2) / 50, s: 1.05 });

export function TBoard(props: BoardProps) {

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

  const mesh = useRef<THREE.Object3D>();

  const rx = style.x.to([0, 1], [0, DEG]);
  const ry = style.y.to([0, 1], [0, DEG]);
  const s = style.s;
  // const o = style.opacity.to([0, 1], [0, 1]);

  // {...props}
  return (
    <a.mesh ref={mesh} receiveShadow
      rotation-x={rx} rotation-y={ry}
      scale-x={s} scale-y={s} scale-z={s}
      onPointerMove={({ clientX: x, clientY: y }) => set(calc(x, y))}
      onPointerOut={() => set({ x: 0, y: 0, s: 1 })}
    >
      <boxBufferGeometry args={[5, 5, 0.3]} />
      <meshStandardMaterial metalness={0.0} roughness={0.1} color={'#ffffff'} />
      </a.mesh>
  );
}

// {squares && (props.squares.map((v, i) => <Square key={i} index={i} value={v} victory={props.victoryLine.indexOf(i) !== -1} onClick={props.onClick} />))}

// <RoundedBox args={[5, 5, 1]} radius={0.5} smoothness={4} />
