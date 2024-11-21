const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

let boardState = Array(9).fill(null); // Game board state
let isPlayerTurn = true; // Player starts first

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize board
function createBoard() {
  board.innerHTML = ''; // Clear previous tiles
  boardState.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  });
}

// Handle cell click
function handleCellClick(event) {
  const cell = event.target;
  const index = parseInt(cell.dataset.index);

  // If cell is already taken or game is over, ignore click
  if (boardState[index] || checkWinner() || checkDraw()) return;

  // Player's move
  if (isPlayerTurn) {
    boardState[index] = 'X';
    cell.textContent = 'X';
    cell.classList.add('taken');
    if (checkWinner()) {
      statusText.textContent = 'You win! 🎉';
      return;
    }
    if (checkDraw()) {
      statusText.textContent = 'It’s a draw! 😐';
      return;
    }
    isPlayerTurn = false;
    statusText.textContent = 'Bot is thinking...';
    setTimeout(botMove, 500); // Bot moves after a delay
  }
}

// Bot's move using Minimax algorithm
function botMove() {
  const bestMove = findBestMove();
  boardState[bestMove] = 'O';
  const cell = document.querySelector(`[data-index="${bestMove}"]`);
  cell.textContent = 'O';
  cell.classList.add('taken');

  if (checkWinner()) {
    statusText.textContent = 'Bot wins! 😔 Better luck next time!';
    return;
  }
  if (checkDraw()) {
    statusText.textContent = 'It’s a draw! 😐';
    return;
  }

  isPlayerTurn = true;
  statusText.textContent = 'Your turn! Make your move.';
}

// Minimax algorithm to find the best move
function minimax(board, depth, isMaximizing) {
  const winner = evaluateBoard();

  // Terminal states
  if (winner === 'X') return -10 + depth; // Player wins
  if (winner === 'O') return 10 - depth;  // Bot wins
  if (checkDraw()) return 0;              // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null; // Undo move
        bestScore = Math.max(bestScore, score);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null; // Undo move
        bestScore = Math.min(bestScore, score);
      }
    }
    return bestScore;
  }
}

// Find the best move for the bot
function findBestMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < boardState.length; i++) {
    if (!boardState[i]) {
      boardState[i] = 'O'; // Simulate move
      const score = minimax(boardState, 0, false);
      boardState[i] = null; // Undo move
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

// Check for a winner
function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return true;
    }
  }
  return false;
}

// Evaluate the board for Minimax
function evaluateBoard() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a]; // Return 'X' or 'O' as the winner
    }
  }
  return null; // No winner
}

// Check for a draw
function checkDraw() {
  return boardState.every(cell => cell !== null);
}

// Reset the game
resetButton.addEventListener('click', resetGame);

function resetGame() {
  boardState = Array(9).fill(null);
  isPlayerTurn = true;
  statusText.textContent = 'Your turn! Make your move.';
  createBoard();
}

// Initialize the game
createBoard();
