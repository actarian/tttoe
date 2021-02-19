
import * as React from 'react';
import { ToastProps } from '../types';
import './toast.scss';

export function Toast(props: ToastProps) {
  return (
    <div className="tttoe__toast">
      <span>{props.message}</span>
    </div>
  );
}
