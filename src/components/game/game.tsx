import * as React from 'react';
import { Dispatch } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { WebpackWorkerFactory } from 'worker-loader!*';
import { useTimeout } from '../@hooks/timeout/timeout';
import { useWorker } from '../@hooks/worker/worker';
import { Board } from '../board/board';
import { ButtonLink } from '../button-link/button-link';
import { Toast } from '../toast/toast';
import { Action, Actions, GameAction, GameProps, GameState } from '../types';
import './game.scss';
import { useStore } from './game.service';

export function Game(_: GameProps) {

  const playVsAi = useRouteMatch('/play-vs-ai');
  const aiVsAi = useRouteMatch('/ai-vs-ai');

  // const match = useRouteMatch();
  // const params = useParams();
  // const location = useLocation();
  // console.log('Game', match, params, location, playVsAi);

  const [state, dispatch] = useStore();

  const move = (state.index % 2) === 0 ? 'X' : 'O';
  const canMove = aiVsAi ? false : move === 'X';

  const [postMessage] = useWorker(async () => {
    const GameWorker = await import('./game.worker') as WebpackWorkerFactory;
    // console.log(GameWorker);
    return new GameWorker.default();
  }, (event: any) => {
    onSelectSquare(state, dispatch, event.data.bestMove, true);
  });

  useTimeout(() => {
    if (state.winner || state.tie) {
      dispatch({ type: Actions.SelectMove, i: 0 });
    } else if (move !== 'X' || aiVsAi) {
      postMessage({ board: state.boards[state.index].squares, player: move, opponent: (move === 'X' ? 'O' : 'X') });
    }
  }, [move, aiVsAi]); // playVsAi, aiVsAi, move

  return (
    <div className="tttoe__game">
      <Board squares={state.boards[state.index].squares} victoryLine={state.victoryLine} onClick={i => onSelectSquare(state, dispatch, i, canMove)} />
      {state.winner && (
        <Toast message={`${state.winner} wins!`} />
      )}
      {state.tie && (
        <Toast message={`tie!`} />
      )}
      <div className="tttoe__actions">
          <ButtonLink exact={true} to="/play-vs-ai" label="Play vs AI" />
          <ButtonLink exact={true} to="/ai-vs-ai" label="AI vs AI" />
          <ButtonLink exact={true} to="/leaderboard" label="Leaderboard" />
      </div>
    </div>
  );
}

// pure

function onSelectSquare(state: GameState, dispatch: Dispatch<GameAction> | Dispatch<Action>, i: number, canMove: boolean) {
  if (canMove && !(state.winner || state.tie) && state.boards[state.index].squares[i] == null) {
    dispatch({ type: Actions.SelectSquare, i });
  }
}
