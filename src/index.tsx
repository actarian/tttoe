import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Game } from './components/game/game';
// import { Game$ } from './components/game/game$';
import './styles.scss';
console.log(document);
const mountNode = document.getElementById('app');
// ReactDOM.render(<Game$ />, mountNode);
ReactDOM.render(<Game />, mountNode);
