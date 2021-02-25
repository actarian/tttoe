
import * as React from 'react';
import { animated, AnimatedValue, useSpring } from 'react-spring';
import './submit.scss';

export type SubmitProps = {
  label: string;
}

const calc = (x: number, y: number) => [(y - window.innerHeight / 2) / 50, -(x - window.innerWidth / 2) / 50, 1.05]
const trans: any = (x: number, y: number, s: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export function Submit(props: SubmitProps) {

  const [style, set] = useSpring((): AnimatedValue<{ opacity: number, xys: number[] }> => ({
    from: {
      opacity: 0,
      xys: [-45, 0, 1],
    },
    to: {
      opacity: 1,
      xys: [0, 0, 1],
    },
    config: { mass: 4, tension: 400, friction: 30 },
  }) as any);

  return (
    <animated.button className="tttoe__btn" type="submit"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: style.xys.interpolate(trans) }}
    >
      {props.label}
    </animated.button>
  );
}
