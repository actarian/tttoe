import { SquareValue } from "../types";

const MAX_SCORE = 1000;

export class GameAi {

  static player: SquareValue = 'X';
  static opponent: SquareValue = 'O';

  static canMove(board: SquareValue[]): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        return true;
      }
    }
    return false;
  }

  static getScore(b: SquareValue[]): number {
    // Checking for Rows for X or O victory.
    for (let row = 0; row < 9; row+=3) {
      if (b[row] == b[row + 1] && b[row + 1] == b[row + 2]) {
        if (b[row] === GameAi.player) {
          return +10;
        } else if (b[row] === GameAi.opponent) {
          return -10;
        }
      }
    }
    // Checking for Columns for X or O victory.
    for (let col = 0; col < 3; col++) {
      if (b[col] === b[col + 3] && b[col + 3] === b[col + 6]) {
        if (b[col] === GameAi.player) {
          return +10;
        } else if (b[col] === GameAi.opponent) {
          return -10;
        }
      }
    }
    // Checking for Diagonals for X or O victory.
    if (b[0] === b[4] && b[4] === b[8]) {
      if (b[0] == GameAi.player) {
        return +10;
      } else if (b[0] == GameAi.opponent) {
        return -10;
      }
    }
    if (b[2] === b[4] && b[4] === b[6]) {
      if (b[2] == GameAi.player) {
        return +10;
      } else if (b[2] == GameAi.opponent) {
        return -10;
      }
    }
    // Else if none of them have won then return 0
    return 0;
  }

  // This is the minimax function. It considers all
  // the possible ways the game can go and returns
  // the value of the board
  static minimax(board: SquareValue[], depth: number, isMax: boolean): number {
    const score: number = GameAi.getScore(board);
    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10) {
      return score;
    }
    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10) {
      return score;
    }
    // If there are no more moves and
    // no winner then it is a tie
    if (!GameAi.canMove(board)) {
      return 0;
    }
    // If this maximizer's move
    let best: number;
    if (isMax) {
      best = -MAX_SCORE;
      // Traverse all cells
      for (let i = 0; i < 9; i++) {
        // Check if cell is empty
        if (board[i] === null) {
          // Make the move
          board[i] = GameAi.player;
          // Call minimax recursively and choose
          // the maximum value
          best = Math.max(best, GameAi.minimax(board, depth + 1, !isMax));
          // Undo the move
          board[i] = null;
        }
      }
    } else {
      // If this minimizer's move
      best = MAX_SCORE;
      // Traverse all cells
      for (let i = 0; i < 9; i++) {
        // Check if cell is empty
        if (board[i] === null) {
          // Make the move
          board[i] = GameAi.opponent;
          // Call minimax recursively and choose
          // the minimum value
          best = Math.min(best, GameAi.minimax(board, depth + 1, !isMax));
          // Undo the move
          board[i] = null;
        }
      }
    }
    return best;
  }

  // This will return the best possible
  // move for the player
  static findBestMove(board: SquareValue[]): number {
    let bestScore: number = -MAX_SCORE;
    let move: number = -1;
    // Traverse all cells, evaluate minimax function
    // for all empty cells. And return the cell
    // with optimal value.
    for (let i = 0; i < 9; i++) {
      // Check if cell is empty
      if (!board[i]) {
        // Make the move
        board[i] = GameAi.player;
        // compute evaluation function for this
        // move.
        const score: number = GameAi.minimax(board, 0, false);
        // Undo the move
        board[i] = null;
        // If the value of the current move is
        // more than the best value, then update
        // best/
        if (score > bestScore) {
          move = i;
          bestScore = score;
        }
      }
    }
    console.log(`The value of the best Move is: ${bestScore}`);
    return move;
  }

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

}

/*
type Move = {
  row: number;
  col: number;
}

export class GameAi {

  static player: SquareValue = 'X';
  static opponent: SquareValue = 'O';

  static canMove(board: SquareValue[][]): boolean {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          return true;
        }
      }
    }
    return false;
  }

  // This is the evaluation function as discussed
  // in the previous article ( http://goo.gl/sJgv68 )
  static getScore(b: SquareValue[][]): number {
    // Checking for Rows for X or O victory.
    for (let row = 0; row < 3; row++) {
      if (b[row][0] == b[row][1] && b[row][1] == b[row][2]) {
        if (b[row][0] == GameAi.player) {
          return +10;
        } else if (b[row][0] == GameAi.opponent) {
          return -10;
        }
      }
    }
    // Checking for Columns for X or O victory.
    for (let col = 0; col < 3; col++) {
      if (b[0][col] == b[1][col] &&
        b[1][col] == b[2][col]) {
        if (b[0][col] == GameAi.player) {
          return +10;
        } else if (b[0][col] == GameAi.opponent) {
          return -10;
        }
      }
    }
    // Checking for Diagonals for X or O victory.
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
      if (b[0][0] == GameAi.player) {
        return +10;
      } else if (b[0][0] == GameAi.opponent) {
        return -10;
      }
    }
    if (b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
      if (b[0][2] == GameAi.player) {
        return +10;
      } else if (b[0][2] == GameAi.opponent) {
        return -10;
      }
    }
    // Else if none of them have won then return 0
    return 0;
  }

  // This is the minimax function. It considers all
  // the possible ways the game can go and returns
  // the value of the board
  static minimax(board: SquareValue[][], depth: number, isMax: boolean): number {
    const score: number = GameAi.getScore(board);
    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10) {
      return score;
    }
    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10) {
      return score;
    }
    // If there are no more moves and
    // no winner then it is a tie
    if (!GameAi.canMove(board)) {
      return 0;
    }
    // If this maximizer's move
    if (isMax) {
      let best: number = -MAX_SCORE;
      // Traverse all cells
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Check if cell is empty
          if (board[i][j] === null) {
            // Make the move
            board[i][j] = GameAi.player;
            // Call minimax recursively and choose
            // the maximum value
            best = Math.max(best, GameAi.minimax(board, depth + 1, !isMax));
            // Undo the move
            board[i][j] = null;
          }
        }
      }
      return best;
    } else {
      // If this minimizer's move
      let best: number = MAX_SCORE;
      // Traverse all cells
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Check if cell is empty
          if (board[i][j] === null) {
            // Make the move
            board[i][j] = GameAi.opponent;
            // Call minimax recursively and choose
            // the minimum value
            best = Math.min(best, GameAi.minimax(board, depth + 1, !isMax));
            // Undo the move
            board[i][j] = null;
          }
        }
      }
      return best;
    }
  }

  // This will return the best possible
  // move for the player
  static findBestMove(board: SquareValue[][]): Move {
    let bestScore: number = -MAX_SCORE;
    let move: Move = { row: -1, col: -1 };
    // Traverse all cells, evaluate minimax function
    // for all empty cells. And return the cell
    // with optimal value.
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Check if cell is empty
        if (board[i][j] === null) {
          // Make the move
          board[i][j] = GameAi.player;
          // compute evaluation function for this
          // move.
          let score: number = GameAi.minimax(board, 0, false);
          // Undo the move
          board[i][j] = null;
          // If the value of the current move is
          // more than the best value, then update
          // best/
          if (score > bestScore) {
            move.row = i;
            move.col = j;
            bestScore = score;
          }
        }
      }
    }
    console.log(`The value of the best Move is: ${bestScore}`);
    return move;
  }

  // Driver code
  public static test(): void {
    let board: SquareValue[][] = [
      ['X', 'O', 'X'],
      ['O', 'O', 'X'],
      [null, null, null]
    ];
    const move: Move = GameAi.findBestMove(board);
    console.log(`The Optimal Move is ROW: ${move.row} COL: ${move.col}`);
  }

}
*/
