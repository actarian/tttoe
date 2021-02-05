import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Game } from './components/game';
import './styles.scss';
console.log(document);
const mountNode = document.getElementById('app');
// ReactDOM.render(<App />, mountNode);
ReactDOM.render(<Game />, mountNode);
