
import * as React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { animated, AnimatedValue, useSpring } from 'react-spring';
import { ButtonLinkProps } from '../types';
import './button-link.scss';

const calc = (x: number, y: number) => [(y - window.innerHeight / 2) / 50, -(x - window.innerWidth / 2) / 50, 1.05]
const trans: any = (x: number, y: number, s: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export function ButtonLink(props: ButtonLinkProps) {

  const match = useRouteMatch({
    exact: props.exact,
    path: props.to,
  });

  const [style, set] = useSpring((): AnimatedValue<{ opacity: number, xys: number[] }> => ({
    from: {
      opacity: 0,
      xys: [-45, 0, 1],
      // transform: `perspective(600px) rotateX(-45deg)`,
    },
    to: {
      opacity: 1,
      xys: [0, 0, 1],
      // transform: `perspective(600px) rotateX(0)`,
    },
    config: { mass: 4, tension: 400, friction: 30 },
    /*
    onRest: () => {
      if (!squares) {
        setSquares(true);
      }
    },
    */
  }) as any);

  return (
    <animated.div className={'tttoe__custom-link' + (match ? ' active' : '')}
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: style.xys.interpolate(trans) }}
    >
      <Link to={props.to}>{props.label}</Link>
    </animated.div>
  );
}
