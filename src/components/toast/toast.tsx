
import * as React from 'react';
import { animated, useSpring } from 'react-spring';
import { ToastProps } from '../types';
import './toast.scss';

export function Toast(props: ToastProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: `perspective(600px) rotateY(-45deg)`,
    },
    to: {
      opacity: 1,
      transform: `perspective(600px) rotateY(0deg)`,
    },
    /*
    onRest: () => {
      if (clicked) {
        setClicked(false);
        console.log('rest')
      }
    },
    */
  });
  return (
    <animated.div style={style} className="tttoe__toast">
      <span>{props.message}</span>
    </animated.div>
  );
}
