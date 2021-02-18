import { Environment, Html, Stats } from '@react-three/drei';
import * as React from 'react';
import { Dispatch } from 'react';
import { Canvas } from 'react-three-fiber';
import { useAgoraRtm } from '../@hooks/agora-rtm/agora-rtm';
import { Board } from '../board/board';
import { TNav } from '../nav/tnav';
import { Toast } from '../toast/toast';
import { Action, Actions, GameAction, GameProps, GameState, State, Status } from '../types';
import { GameAi } from './game.ai';
import './game.scss';
import { useStore } from './game.service';

export function Game(_: GameProps) {

  const [gameState, dispatchGame] = useStore();
  const [rtmState, dispatchRtm] = useAgoraRtm();

  const state = rtmState.status === Status.Playing ? rtmState : gameState;
  const dispatch = rtmState.status === Status.Playing ? dispatchRtm : dispatchGame;

  const move = (state.index % 2) === 0 ? 'X' : 'O';
  const canMove = rtmState.status === Status.Playing ? rtmState.sign === move : true;
  const hasMenu = rtmState.status !== Status.Playing;

  setTimeout(() => {
    if (state.winner || state.tie) {
      dispatch({ type: Actions.SelectMove, i : 0 });
    } else if (move !== 'X') {
      GameAi.player = move;
      GameAi.opponent = move === 'X' ? 'O' : 'X';
      const m = GameAi.findBestMove(state.boards[state.index].squares);
      console.log('nextBestMove', m);
      onSelectSquare(state, dispatch, m, true);
    }
  }, 1000);

  // console.log('Game.render', rtmState.status, rtmState.opponent, rtmState.messages.map(x => `${x.timeStamp} ${x.text}`).join('\n'));

  /*
  <Canvas className="tttoe__canvas" shadowMap={true}>
  <spotLight color={'#ffffff'} position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
  <pointLight color={'#ffffff'} position={[10, 10, 10]} castShadow />
  <pointLight color={'#ffffff'} position={[-10, -10, 10]} castShadow />
  */
  /*
  <spotLight color={'#ffffff'} position={[-10, -10, 10]} angle={0.15}
        intensity={1.5}
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        penumbra={1} castShadow />
  */
  return (
    <div className="tttoe__game">
      <Canvas className="tttoe__canvas">
        {false && (
          <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[2.5, 8, 5]} />
            <spotLight color={'#ffffff'} position={[-10, -10, 10]} angle={0.15} intensity={1.5} penumbra={1} />
            <spotLight color={'#ffffff'} position={[10, 10, 10]} angle={0.15} intensity={1.5} penumbra={1} />
          </>
        )}
        <React.Suspense fallback={<Html center>loading</Html>}>
          {false && (
            <Environment path={'/assets/hdri/hdri-01/'} background={false} />
          )}
          <Board squares={state.boards[state.index].squares} victoryLine={state.victoryLine} onClick={i => onSelectSquare(state, dispatch, i, canMove)} />
          {hasMenu && (
          <TNav boards={state.boards} index={state.index} move={move} onClick={(i) => dispatch({ type: Actions.SelectMove, i })} ></TNav>
          )}
        </React.Suspense>
        {true && (
          <Stats
            showPanel={0} // Start-up panel (default=0)
            className="stats" // Optional className to add to the stats container dom element
            // {...props} // All stats.js props are valid
          />
        )}
      </Canvas>
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

/*
{hasMenu && (
  <Nav boards={state.boards} index={state.index} move={move} onClick={(i) => dispatch({ type: Actions.SelectMove, i })} />
)}
*/

/*
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
*/

// pure

function onSelectSquare(state: GameState | State, dispatch: Dispatch<GameAction> | Dispatch<Action>, i: number, canMove: boolean) {
  if (canMove && !state.winner && state.boards[state.index].squares[i] == null) {
    console.log('onSelectSquare', i);
    dispatch({ type: Actions.SelectSquare, i });
  }
}

function onFindMatch(state: State, dispatch: Dispatch<Action>): void {
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
