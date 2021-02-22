import * as React from 'react';
import { Dispatch, useState } from 'react';
import { WebpackWorkerFactory } from 'worker-loader!*';
import { useTimeout } from '../@hooks/timeout/timeout';
import { useWorker } from '../@hooks/worker/worker';
import { Board } from '../board/board';
import { Button } from '../button/button';
import { Nav } from '../nav/nav';
import { Toast } from '../toast/toast';
import { Action, Actions, GameAction, GameProps, GameState } from '../types';
import './game.scss';
import { useStore } from './game.service';

export function Game(_: GameProps) {

  const [mode, setMode] = useState(0);
  const [state, dispatch] = useStore();

  const playerVsAi = mode === 0;
  const aiVsAi = mode === 1;
  const playerVsPlayer = mode === 2;
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
    if (playerVsAi || aiVsAi) {
      if (state.winner || state.tie) {
        dispatch({ type: Actions.SelectMove, i: 0 });
      } else if (move !== 'X' || aiVsAi) {
        postMessage({ board: state.boards[state.index].squares, player: move, opponent: (move === 'X' ? 'O' : 'X') });
      }
    }
  }, [playerVsAi, aiVsAi, move]);

  return (
    <div className="tttoe__game">
      <Board squares={state.boards[state.index].squares} victoryLine={state.victoryLine} onClick={i => onSelectSquare(state, dispatch, i, canMove)} />
      {false && playerVsAi && (
        <Nav boards={state.boards} index={state.index} move={move} onClick={(i) => dispatch({ type: Actions.SelectMove, i })} />
      )}
      {state.winner && (
        <Toast message={`${state.winner} wins!`} />
      )}
      {state.tie && (
        <Toast message={`tie!`} />
      )}
      <div className="tttoe__actions">
        {!playerVsPlayer && (
          <>
            <Button active={playerVsAi} onClick={() => setMode(0)} label="Play vs AI" />
            <Button active={aiVsAi} onClick={() => setMode(1)} label="AI vs AI" />
          </>
        )}
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
