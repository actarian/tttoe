import { a, useSpring } from '@react-spring/three';
import { meshBounds, useGLTF, useMatcapTexture } from '@react-three/drei';
import * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Square } from '../square/square';
import { BoardProps, MATCAP_BLACK, MATCAP_WHITE } from '../types';

const DEG = Math.PI / 180;

const calc = (x: number, y: number, size: number) => ({ x: -(y - window.innerHeight / 2) / 50, y: -(x - window.innerWidth / 2) / 50, s: size * 1.05 });

export function Board(props: BoardProps) {

  const [spring, setSpring] = useSpring<{ x: number, y: number, s: number }>(() => ({
    from: {
      x: -45, y: 0, s: calcScale(),
    },
    to: {
      x: 0, y: 0, s: calcScale(),
    },
    config: { mass: 6, tension: 400, friction: 30, precision: 0.0001 },
  }) as any);

  useLayoutEffect(() => {
    function onResize() {
      const scale = calcScale();
      setSpring({ x: 0, y: 0, s: scale });
    }
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [squares, setSquares] = useState(false);

  if (!squares) {
    setTimeout(() => {
      setSquares(true);
    }, 250);
  }

  // Loads model, uses CDN draco when needed
  const { nodes, materials } = useGLTF('/assets/models/tttoe-scaled.glb', true);
  // board, square, circle, cross
  const white = useMatcapTexture(MATCAP_WHITE)[0];
  const black = useMatcapTexture(MATCAP_BLACK)[0];

  const mesh = useRef<THREE.Object3D>();

  const rotationX = spring.x.to([0, 1], [0, DEG]);
  const rotationY = spring.y.to([0, 1], [0, DEG]);
  const scale = spring.s;

  // {...props}
  // <a.mesh ref={mesh} receiveShadow
  return (
    <a.mesh ref={mesh}
      rotation-x={rotationX} rotation-y={rotationY}
      scale-x={scale} scale-y={scale} scale-z={scale}
      onPointerMove={({ clientX: x, clientY: y }) => setSpring(calc(x, y, calcScale()))}
      onPointerOut={() => setSpring({ x: 0, y: 0, s: calcScale() })}
      geometry={(nodes.board as THREE.Mesh).geometry}
      raycast={meshBounds}
    >
      <meshMatcapMaterial matcap={white} />
      {squares && (props.squares.map((v, i) => <Square
      square={nodes.square as THREE.Mesh} circle={nodes.circle as THREE.Mesh} cross={nodes.cross as THREE.Mesh}
      key={i} index={i} white={white} black={black} value={v} victory={props.victoryLine.indexOf(i) !== -1} onClick={props.onClick} />))}
    </a.mesh>
  );
}
// <meshStandardMaterial metalness={0.0} roughness={0.1} color={'#6060b4'} />

// <RoundedBox args={[5, 5, 1]} radius={0.5} smoothness={4} />

function calcScale() {
  return Math.min(window.innerWidth, window.innerHeight) / 700;
}

/*
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function onResize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}
*/
