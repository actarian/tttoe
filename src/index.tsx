import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ErrorBoundary } from './components/error-boundary/error-boundary';
import { Game } from './components/game/game';
import './styles.scss';
// console.log(document);
const mountNode = document.getElementById('app');
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Game />
    </ErrorBoundary>
  </React.StrictMode>, mountNode
);
