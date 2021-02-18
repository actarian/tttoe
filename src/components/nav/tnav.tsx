
import { a, useSpring } from '@react-spring/three';
import { meshBounds, Text, useMatcapTexture } from '@react-three/drei';
import * as React from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import Bangers from '../../../assets/fonts/bangers/bangers-subset.json';
import { MATCAP_WHITE, NavProps } from '../types';

export function TNav(props: NavProps) {

  return (
    <group dispose={null}
      position-x={-4.5}
      rotation-y={Math.PI / 180 * 40}
    >
      {props.boards.map((_, i, a) => (
        <TextLetter key={i} t={a.length} i={i} {...props}></TextLetter>
      ))}
    </group>
  );
}

const DEG = Math.PI / 180;

export function TextLetter(props: NavProps & { t:number, i:number }) {

  const [rotation, setRotation] = useState(props.index === props.i ? 360 : 0);

  const calc = (x: number, y: number, size: number) => ({ x: -(y - window.innerHeight / 2) / 50 * DEG, y: (rotation -(x - window.innerWidth / 2) / 50) * DEG, s: size * 1.05 });

  const [spring, setSpring] = useSpring<{ x: number, y: number, s: number }>(() => ({
    from: {
      x: -45 * DEG, y: 0, s: 0.5,
    },
    to: {
      x: 0, y: rotation * DEG, s: 1,
    },
    delay: 30 * props.index,
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  }) as any);

  useLayoutEffect(() => {
    setRotation(props.index === props.i ? 360 : 0);
  }, [props.index]);

  const h = 0.6;
  const s = h * 0.8;

  return (
    <a.group dispose={null}
      position-y={props.t / 2 * h - h / 2 - h * props.i}
      rotation-x={spring.x} rotation-y={spring.y}
      scale-x={spring.s} scale-y={spring.s} scale-z={spring.s}
      onPointerMove={({ clientX: x, clientY: y }) => setSpring(calc(x, y, 1.2))}
      onPointerOut={() => setSpring({ x: 0, y: rotation * DEG, s: 1 })}
      onClick={() => props.onClick(props.i)}
    >
      <Text
      color={props.index === props.i ? 'black' : 'white'}
      fontSize={0.5}
      maxWidth={2}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign={'center'}
      font="https://fonts.gstatic.com/s/raleway/v19/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVtapYCM.woff"
      anchorX="center"
      anchorY="middle"
    >{props.i.toString()}</Text>
    </a.group>
  );
}

/*
fillOpacity={0}
strokeWidth={'2.5%'}
strokeColor="#ffffff"

outlineOffsetX={'10%'}
outlineOffsetY={'10%'}
outlineBlur={'30%'}
outlineOpacity={0.3}
outlineColor="#000000"
*/

export function Letter(props: NavProps & { t:number, i:number }) {

  const [rotation, setRotation] = useState(props.index === props.i ? 360 : 0);

  const calc = (x: number, y: number, size: number) => ({ x: -(y - window.innerHeight / 2) / 50 * DEG, y: (rotation -(x - window.innerWidth / 2) / 50) * DEG, s: size * 1.05 });

  const [spring, setSpring] = useSpring<{ x: number, y: number, s: number }>(() => ({
    from: {
      x: -45 * DEG, y: 0, s: 0.5,
    },
    to: {
      x: 0, y: rotation * DEG, s: 1,
    },
    delay: 30 * props.index,
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  }) as any);

  useLayoutEffect(() => {
    setRotation(props.index === props.i ? 360 : 0);
  }, [props.index]);

  const font = useMemo(() => new THREE.FontLoader().parse(Bangers), []);

  // configure font geometry
  const letter = props.i.toString();

  const h = 0.6;
  const s = h * 0.8;

  const textOptions = {
    font,
    size: s,
    height: s / 3,
  };

  const [matcap] = useMatcapTexture(MATCAP_WHITE);

  return (
    <a.mesh
      raycast={meshBounds}
      position-y={props.t / 2 * h - h / 2 - h * props.i}
      rotation-x={spring.x} rotation-y={spring.y}
      scale-x={spring.s} scale-y={spring.s} scale-z={spring.s}
      onPointerMove={({ clientX: x, clientY: y }) => setSpring(calc(x, y, 1.2))}
      onPointerOut={() => setSpring({ x: 0, y: rotation * DEG, s: 1 })}
      onClick={() => props.onClick(props.i)}
    >
      <textGeometry attach='geometry' args={[letter, textOptions]} />
      <meshMatcapMaterial matcap={matcap} color={props.index === props.i ? 'black' : 'white'} />
    </a.mesh>
  );
}

/*
{false && (
  <ul className="tttoe__nav">
    {props.boards.map((_, i) => (
      <li key={i}>
        <button className={props.index === i ? 'active' : void 0} onClick={() => props.onClick(i) }>
          {i == 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.5 2c-5.288 0-9.649 3.914-10.377 9h-3.123l4 5.917 4-5.917h-2.847c.711-3.972 4.174-7 8.347-7 4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5c-3.015 0-5.662-1.583-7.171-3.957l-1.2 1.775c1.916 2.536 4.948 4.182 8.371 4.182 5.797 0 10.5-4.702 10.5-10.5s-4.703-10.5-10.5-10.5z"/></svg>
          ) : (
            `${i}`
          )}
        </button>
      </li>
    ))}
    <li><span>{props.move}</span></li>
  </ul>
)}
*/
