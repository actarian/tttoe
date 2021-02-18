import { SquareValue } from "../types";

const MAX_SCORE = Number.POSITIVE_INFINITY;

export class GameAi {

  static canMove(board: SquareValue[]): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        return true;
      }
    }
    return false;
  }

  static getScore(b: SquareValue[], player: SquareValue, opponent: SquareValue): number {
    // Checking for Rows for X or O victory.
    for (let row = 0; row < 9; row+=3) {
      if (b[row] == b[row + 1] && b[row + 1] == b[row + 2]) {
        if (b[row] === player) {
          return +10;
        } else if (b[row] === opponent) {
          return -10;
        }
      }
    }
    // Checking for Columns for X or O victory.
    for (let col = 0; col < 3; col++) {
      if (b[col] === b[col + 3] && b[col + 3] === b[col + 6]) {
        if (b[col] === player) {
          return +10;
        } else if (b[col] === opponent) {
          return -10;
        }
      }
    }
    // Checking for Diagonals for X or O victory.
    if (b[0] === b[4] && b[4] === b[8]) {
      if (b[0] == player) {
        return +10;
      } else if (b[0] == opponent) {
        return -10;
      }
    }
    if (b[2] === b[4] && b[4] === b[6]) {
      if (b[2] == player) {
        return +10;
      } else if (b[2] == opponent) {
        return -10;
      }
    }
    // Else if none of them have won then return 0
    return 0;
  }

  // This is the minimax function. It considers all
  // the possible ways the game can go and returns
  // the value of the board
  static minimax(board: SquareValue[], depth: number, isMax: boolean, player: SquareValue, opponent: SquareValue, stats: { matches: number, win: number, loss: number }): number {
    const score: number = GameAi.getScore(board, player, opponent);
    /*
    console.log(board.map((x,i) => {
      return (x || '_') + ((i + 1) % 3 === 0 ? '\n' : '');
    }).join(' '), score);
    */
    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10) {
      stats.win ++;
      stats.matches ++;
      return score;
    }
    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10) {
      stats.loss ++;
      stats.matches ++;
      return score;
    }
    // If there are no more moves and
    // no winner then it is a tie
    if (!GameAi.canMove(board)) {
      stats.matches ++;
      return 0;
    }
    // If this maximizer's move
    let best: number;
    if (isMax) {
      best = -MAX_SCORE;
      // Traverse all cells
      for (let i = 0; i < 9; i++) {
        const b = board.slice();
        // Check if cell is empty
        if (b[i] === null) {
          // Make the move
          b[i] = player;
          // Call minimax recursively and choose
          // the maximum value
          best = Math.max(best, GameAi.minimax(b, depth + 1, !isMax, player, opponent, stats));
          // Undo the move
          // board[i] = null;
        }
      }
    } else {
      // If this minimizer's move
      best = MAX_SCORE;
      // Traverse all cells
      for (let i = 0; i < 9; i++) {
        const b = board.slice();
        // Check if cell is empty
        if (b[i] === null) {
          // Make the move
          b[i] = opponent;
          // Call minimax recursively and choose
          // the minimum value
          best = Math.min(best, GameAi.minimax(b, depth + 1, !isMax, player, opponent, stats));
          // Undo the move
          // board[i] = null;
        }
      }
    }
    return best;
  }

  // This will return the best possible
  // move for the player
  static findBestMove(board: SquareValue[], player:SquareValue, opponent: SquareValue): number {
    let bestScore: number = -MAX_SCORE;
    const moves: { score: number, move: number }[] = [];
    let move: number = -1;
    // Traverse all cells, evaluate minimax function
    // for all empty cells. And return the cell
    // with optimal value.
    const stats = { matches: 0, win: 0, loss: 0 };
    for (let i = 0; i < 9; i++) {
      const b = board.slice();
      // Check if cell is empty
      if (!b[i]) {
        // Make the move
        b[i] = player;
        // compute evaluation function for this
        // move.
        const score: number = GameAi.minimax(b, 0, false, player, opponent, stats);
        moves.push({ score, move: i });
        // Undo the move
        // b[i] = null;
        // If the value of the current move is
        // more than the best value, then update
        // best/
        if (score > bestScore) {
          move = i;
          bestScore = score;
        }
      }
    }
    const best = moves.reduce((p, c) => {
      return c.score > p ? c.score : p;
    }, -MAX_SCORE);
    const bestMoves = moves.filter(x => x.score === best);
    if (bestMoves.length) {
      const i = Math.floor(bestMoves.length * Math.random());
      return bestMoves[i].move;
    } else {
      return -1;
    }
    // console.log(`best move ${move}, best score ${bestScore}`, stats);
    return move;
  }

  /*
  // Driver code
  public static test(): void {
    let board: SquareValue[] = [
      'X', 'O', 'X',
      'O', 'O', 'X',
      null, null, null
    ];
    const move: number = GameAi.findBestMove(board);
    console.log(`The Optimal Move is ${move}`);
  }
  */

}
