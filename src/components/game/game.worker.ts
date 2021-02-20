// worker

const ctx: Worker = self as any;

import { GameAi } from './game.ai';

console.log('game.worker.ts', ctx);

ctx.addEventListener('message', (event) => {
  // console.log('game.worker.ts', event);
  if (event && event.data) { // && event.data.type === 'findBestMove'
    const data = event.data;
    const bestMove = GameAi.findBestMove(data.board, data.player, data.opponent);
    postMessage({ bestMove });
  }
});
