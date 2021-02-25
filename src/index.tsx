import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import { Game } from './components/game/game';
import { Leaderboard } from './components/leaderboard/leaderboard';
import './styles.scss';

const mountNode = document.getElementById('app');
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="/">
        <Game />
        <Route path="/play-vs-ai" />
        <Route path="/ai-vs-ai" />
        <Route path="/leaderboard" children={<Leaderboard />} />
        <Route exact path="/" render={() => <Redirect to="/play-vs-ai" />} />
      </Route>
    </Router>
  </React.StrictMode>, mountNode
);

/*
<Route path="/" component={Game}>
  <Route path="play-vs-ai" component={Calendar} />
  <Route path="ai-vs-ai" component={Calendar} />
  <Route path="match/:player/vs/:opponent" components={{ calendar: Calendar }} />
</Route>
*/
