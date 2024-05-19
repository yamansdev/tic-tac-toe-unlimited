// minimax.ts

// Helper function to check if any player has won
function isWinner(board: (string | null)[], player: string): boolean {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningCombinations) {
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }

  return false;
}

// Minimax algorithm with alpha-beta pruning and increased randomness
function minimax(board: (string | null)[], depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
  const winner = isWinner(board, 'X') ? 'X' : isWinner(board, 'O') ? 'O' : null;

  if (winner === 'X') {
    return -1;
  } else if (winner === 'O') {
    return 1;
  } else if (!isMovesLeft(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    const availableMoves = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        availableMoves.push(i);
      }
    }

    // Introduce more randomness
    if (Math.random() < 0.2) { // 20% chance of making a random move
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      board[randomMove] = 'O';
      const score = minimax(board, depth + 1, false, alpha, beta);
      board[randomMove] = null;
      return score;
    }

    // Shuffle the available moves
    shuffleArray(availableMoves);

    for (const move of availableMoves) {
      board[move] = 'O';
      const score = minimax(board, depth + 1, false, alpha, beta);
      board[move] = null;
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) {
        break; // Pruning
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true, alpha, beta);
        board[i] = null;
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) {
          break; // Pruning
        }
      }
    }
    return bestScore;
  }
}

export function getBestMove(board: (string | null)[]): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  const availableMoves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      availableMoves.push(i);
    }
  }

  // Introduce more randomness
  if (Math.random() < 0.1) { // 10% chance of making a random move
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    return randomMove;
  }

  // Shuffle the available moves
  shuffleArray(availableMoves);

  for (const move of availableMoves) {
    board[move] = 'O';
    const score = minimax(board, 0, false, -Infinity, Infinity);
    board[move] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

export function isMovesLeft(board: (string | null)[]): boolean {
  return board.some((cell) => cell === null);
}

// Helper function to shuffle an array
function shuffleArray(array: number[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}