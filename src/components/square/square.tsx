
import * as React from 'react';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { SquareProps } from '../types';
// import { useBoop } from '../@hooks/boop/boop';
import './square.scss';

export function Square(props: SquareProps) {
  // const style = useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, config: { delay: 100 * props.index }});
  const [rotation, setRotation] = useState(180);
  // const [clicked, setClicked] = useState(false);
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
    /*
    onRest: () => {
      if (clicked) {
        setClicked(false);
        console.log('rest')
      }
    },
    */
  });
  /*
  const [style, setStyle] = useSpring(() => ({
    opacity: 0,
    transform: clicked ? `perspective(600px) rotateX(180deg) rotateY(180deg)` : `perspective(600px) rotateX(0deg) rotateY(0deg)`,
    delay: 40 * props.index
  }));
  */

  // reset timeout on change;
  /*
  useEffect(() => {
    if (!clicked) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setClicked(false);
    }, 1000);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clicked]);
  */

  /*
  useEffect(() => {
    setStyle({
      opacity: 1,
      transform: clicked ? `perspective(600px) rotateX(180deg) rotateY(180deg)` : `perspective(600px) rotateX(0deg) rotateY(0deg)`,
      delay: 40 * props.index });
  }, [clicked]);
  */

  const onClick = (e: any) => {
    // setClicked(true);
    if (!props.value) {
      setRotation(rotation - 180);
    }
    props.onClick(e);
  }

  // const [boopStyle, boopTrigger] = useBoop({ x: 10, y: 10 });

  return (
    <animated.button style={style} className={`tttoe__square${props.victory ? ' victory' : ''}`} onClick={onClick}>
      <span>{props.value}</span>
    </animated.button>
  );
}

/*
    <animated.button style={style} className={`tttoe__square${props.victory ? ' victory' : ''}`} onClick={onClick}>
      <animated.span style={boopStyle} onClick={boopTrigger}>{props.value}</animated.span>
    </animated.button>
*/
