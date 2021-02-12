
import * as React from 'react';
import { useState } from 'react';
import { animated, AnimatedValue, useSpring } from 'react-spring';
import { Square } from '../square/square';
import { BoardProps } from '../types';
import './board.scss';

const calc = (x:number, y:number) => [(y - window.innerHeight / 2) / 50, -(x - window.innerWidth / 2) / 50, 1.05]
const trans:any = (x:number, y:number, s:number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export function Board(props: BoardProps) {
  // const [style, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 80 } }))
  const [squares, setSquares] = useState(false);
  const [style, set] = useSpring(():AnimatedValue<{ opacity: number, xys: number[] }> => ({
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
    config: { mass: 1, tension: 180, friction: 12 },
    /*
    onRest: () => {
      if (!squares) {
        setSquares(true);
      }
    },
    */
  }) as any);
  /*
  const style_ = useSpring({
    from: {
      opacity: 0,
      transform: `perspective(600px) rotateX(-45deg)`,
    },
    to: {
      opacity: 1,
      transform: `perspective(600px) rotateX(0)`,
    },
    onRest: () => {
      setSquares(true);
    },
  });
  */

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

/*
import * as React from 'react';
import { animated, useTransition } from 'react-spring';
import { BoardProps } from '../types';
import './board.scss';

export function Board(props: BoardProps) {
  const items = props.squares.map((v, i) => ({ key:i, value: v }));
  const transitions = useTransition(items, x => x.key, {
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    enter: { opacity: 1, transform: 'translate3d(0,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(0,40px,0)' },
    trail: 50,
  });
  return (
    <div className="tttoe__board">
      {transitions.map((t, i) => {
        return <animated.button style={t.props} key={i} className={`tttoe__square${props.victoryLine.indexOf(i) !== -1 ? ' victory' : ''}`} onClick={() => props.onClick(i)}>{t.item.value}</animated.button>
      })}
    </div>
  )
}
*/

/*
export class Board extends React.Component<BoardProps> {
  render() {
    return (
      <div className="tttoe__board">
        {this.props.squares.map((square, i) => <Square key={i} value={square} victory={this.props.victoryLine.indexOf(i) !== -1} onClick={() => this.props.onClick(i)} />)}
      </div>
    );
  }
}
*/
