import * as React from 'react';
import { Dispatch, useState } from 'react';
import { WebpackWorkerFactory } from 'worker-loader!*';
import { useAgoraRtm } from '../@hooks/agora-rtm/agora-rtm';
import { useTimeout } from '../@hooks/timeout/timeout';
import { useWorker } from '../@hooks/worker/worker';
import { Board } from '../board/board';
import { Button } from '../button/button';
import { Nav } from '../nav/nav';
import { Toast } from '../toast/toast';
import { Action, Actions, GameAction, GameProps, GameState, State, Status } from '../types';
import './game.scss';
import { useStore } from './game.service';

export function Game(_: GameProps) {

  const [mode, setMode] = useState(0);
  const [gameState, dispatchGame] = useStore();
  const [rtmState, dispatchRtm] = useAgoraRtm();

  const playing = rtmState.status === Status.Playing;
  const state = playing ? rtmState : gameState;
  const dispatch = playing ? dispatchRtm : dispatchGame;
  const playerVsAi = mode === 0; // !playing;
  const aiVsAi = mode === 1; // false;
  const playerVsPlayer = mode === 2; // playing;
  const move = (state.index % 2) === 0 ? 'X' : 'O';
  const canMove = aiVsAi ? false : (playing ? rtmState.sign === move : move === 'X');

  const [postMessage] = useWorker(async () => {
    const GameWorker = await import('./game.worker') as WebpackWorkerFactory;
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
        <Button active={playerVsPlayer} onClick={() => onFindMatch(rtmState, dispatchRtm, setMode)} label={getFindMatchLabel(rtmState, canMove)} />
        {playerVsPlayer && (
          <Button onClick={() => onLeaveMatch(rtmState, dispatchRtm, setMode)} label="Leave Match" />
        )}
      </div>
    </div>
  );
}

// pure

function onSelectSquare(state: GameState | State, dispatch: Dispatch<GameAction> | Dispatch<Action>, i: number, canMove: boolean) {
  if (canMove && !(state.winner || state.tie) && state.boards[state.index].squares[i] == null) {
    // console.log('onSelectSquare', i);
    dispatch({ type: Actions.SelectSquare, i });
  }
}

function onFindMatch(state: State, dispatch: Dispatch<Action>, setMode: React.Dispatch<React.SetStateAction<number>>): void {
  if (state.status === Status.Connected ||
    (state.status === Status.Playing && (state.winner || state.tie))) {
    setMode(2);
    dispatch({ type: Actions.FindMatch });
  }
}

function onLeaveMatch(state: State, dispatch: Dispatch<Action>, setMode: React.Dispatch<React.SetStateAction<number>>): void {
  dispatch({ type: Actions.LeaveMatch });
  setMode(0);
}

function getFindMatchLabel(state: State, canMove: boolean): string {
  switch (state.status) {
    case Status.Waiting:
      return 'Waiting Buddy';
    case Status.Playing:
      if (state.winner || state.tie) {
        return 'Play Again';
      } else if (canMove) {
        return 'Your Turn';
      } else {
        return state.opponent as string;
      }
    default:
      return 'Invite Buddy';
  }
}
