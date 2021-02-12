import * as React from 'react';
import { useAgoraRtm } from '../@hooks/agora-rtm/agora-rtm';
import { Board } from '../board/board';
import { Toast } from '../toast/toast';
import { Action, Actions, GameAction, GameProps, GameState, State, Status } from '../types';
import './game.scss';
import { useStore } from './game.service';
// import { useStore$ } from './game.service';

export function Game(_: GameProps) {

  const [gameState, dispatchGame] = useStore();
  const [rtmState, dispatchRtm] = useAgoraRtm();

  console.log('Game.render', rtmState.status, rtmState.opponent, rtmState.messages.map(x => `${x.timeStamp} ${x.text}`).join('\n'));

  const state = rtmState.status === Status.Playing ? rtmState : gameState;
  const dispatch = rtmState.status === Status.Playing ? dispatchRtm : dispatchGame;

  const move = (state.index % 2) === 0 ? 'X' : 'O';
  const canMove = rtmState.status === Status.Playing ? rtmState.sign === move : true;
  const hasMenu = rtmState.status !== Status.Playing;

  /*
  const onSelectSquare = (i: number) => {
    if (canMove && !state.winner && state.boards[state.index].squares[i] == null) {
      dispatch({ type: Actions.SelectSquare, i });
    }
  }

  const onFindMatch = () => {
    if (rtmState.status === Status.Connected ||
      (rtmState.status === Status.Playing && rtmState.winner)) {
      dispatchRtm({ type: Actions.FindMatch });
    }
  }

  const getFindMatchLabel = (): string => {
    switch (rtmState.status) {
      case Status.Waiting:
        return 'Waiting Buddy';
      case Status.Playing:
        if (rtmState.winner) {
          return 'Play Again';
        } else if (canMove) {
          return 'Your Turn';
        } else {
          return rtmState.opponent as string;
        }
      default:
        return 'Invite Buddy';
    }
  }

  */

  return (
    <div className="tttoe__game">
      <Board squares={state.boards[state.index].squares} victoryLine={state.victoryLine} onClick={i => onSelectSquare(state, dispatch, i, canMove)} />
      {hasMenu && (
        <ul className="tttoe__nav">
        {state.boards.map((_, i) => (
          <li key={i}>
            <button className={state.index === i ? 'active' : void 0} onClick={() => dispatch({ type: Actions.SelectMove, i })}>
              {i == 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.5 2c-5.288 0-9.649 3.914-10.377 9h-3.123l4 5.917 4-5.917h-2.847c.711-3.972 4.174-7 8.347-7 4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5c-3.015 0-5.662-1.583-7.171-3.957l-1.2 1.775c1.916 2.536 4.948 4.182 8.371 4.182 5.797 0 10.5-4.702 10.5-10.5s-4.703-10.5-10.5-10.5z"/></svg>
              ) : (
                `${i}`
              )}
            </button>
          </li>
        ))}
        <li><span>{move}</span></li>
      </ul>
      )}
      {state.winner && (
        <Toast message={`${state.winner} wins!`} />
      )}
      {state.tie && (
        <Toast message={`tie!`} />
      )}
      <button className="tttoe__invite" onClick={() => onFindMatch(rtmState, dispatchRtm)}>{getFindMatchLabel(rtmState, canMove)}</button>
    </div>
  );
}

// pure

function onSelectSquare(state: GameState | State, dispatch: React.Dispatch<GameAction> | React.Dispatch<Action>, i: number, canMove: boolean) {
  if (canMove && !state.winner && state.boards[state.index].squares[i] == null) {
    dispatch({ type: Actions.SelectSquare, i });
  }
}

function onFindMatch(state: State, dispatch: React.Dispatch<Action>): void {
  if (state.status === Status.Connected ||
    (state.status === Status.Playing && state.winner)) {
      dispatch({ type: Actions.FindMatch });
  }
}

function getFindMatchLabel(state: State, canMove: boolean): string {
  switch (state.status) {
    case Status.Waiting:
      return 'Waiting Buddy';
    case Status.Playing:
      if (state.winner) {
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
