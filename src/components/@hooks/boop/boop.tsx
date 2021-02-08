
import * as React from 'react';
import { Component, CSSProperties, useCallback, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

export type BoopProps = {
  x?:number;
  y?:number;
  rotation?:number;
  scale?:number;
  timing?:number;
  config?: { tension:number, friction:number };
  children?: Component<any, any>;
}

export function useBoop(props:BoopProps): [CSSProperties, () => void] {
  const { x = 0, y = 0, rotation = 0, scale = 1, timing = 150, config = {
    tension: 300,
    friction: 10,
  } } = props;

  const [booped, setBooped] = useState(false);
  const style = useSpring({
    display: 'inline-block',
    backfaceVisibility: 'hidden',
    transform: booped ?
    `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})` :
    `translate(0px, 0px) rotate(0deg) scale(1)`,
    config,
  });
  useEffect(() => {
    if (!booped) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setBooped(false);
    }, timing);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [booped, timing]);
  const trigger = useCallback(() => {
    setBooped(true);
  }, []);
  return [style, trigger];
}

export function Boop(props:BoopProps) {
  const { children, ...boopConfig } = props;
  const [style, trigger] = useBoop(boopConfig);
  return (
    <animated.span onMouseEnter={trigger} style={style}>
      {children}
    </animated.span>
  );
};
