
import * as React from 'react';
import { ButtonProps } from '../types';
import './button.scss';

export function Button(props: ButtonProps) {
  return (
    <button className={'tttoe__btn' + (props.active ? ' active' : '')} onClick={props.onClick}>
      {props.label}
    </button>
  );
}
