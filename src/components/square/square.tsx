
import * as React from 'react';
import { useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { SquareProps } from '../types';
import './square.scss';

export function Square(props: SquareProps) {

  const [rotation, setRotation] = useState(180);

  const style = useSpring({
    from: {
      opacity: 0,
      transform: `perspective(600px) rotateY(${rotation}deg)`,
    },
    to: {
      opacity: 1,
      transform: `perspective(600px) rotateY(${rotation}deg)`,
    },
    delay: rotation === 180 ? 30 * props.index : 0,
  });

  useEffect(() => {
    if (props.value) {
      setRotation(rotation - 180);
    }
  }, [props.value]);

  return (
    <animated.button style={style} className={`tttoe__square${props.victory ? ' victory' : ''}`} onClick={(event) => props.onClick(event)}>
      <span>{props.value}</span>
    </animated.button>
  );
}
