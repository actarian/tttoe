
import * as React from 'react';
import { useState } from 'react';
import { animated, AnimatedValue, useSpring } from 'react-spring';
import { Square } from '../square/square';
import { BoardProps } from '../types';
import './board.scss';

const calc = (x: number, y: number) => [(y - window.innerHeight / 2) / 50, -(x - window.innerWidth / 2) / 50, 1.05]
const trans: any = (x: number, y: number, s: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export function Board(props: BoardProps) {

  const [squares, setSquares] = useState(false);
  const [style, set] = useSpring((): AnimatedValue<{ opacity: number, xys: number[] }> => ({
    from: {
      opacity: 0,
      xys: [-45, 0, 1],
    },
    to: {
      opacity: 1,
      xys: [0, 0, 1],
    },
    config: { mass: 1, tension: 180, friction: 12 },
  }) as any);

  if (!squares) {
    setTimeout(() => {
      setSquares(true);
    }, 250);
  }

  return (
    <animated.div className="tttoe__board"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: style.xys.interpolate(trans) }}>
      {squares && (props.squares.map((v, i) => <Square key={i} index={i} value={v} victory={props.victoryLine.indexOf(i) !== -1} onClick={() => props.onClick(i)} />))}
    </animated.div>
  );
}
