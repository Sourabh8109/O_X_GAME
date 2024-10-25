import React, { useState } from 'react';
import './App.css';

// Component for rendering a single square
const Square = ({ value, onSquareClick }) => {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

// Board component to render the 3x3 grid
const Board = ({ xIsNext, squares, onPlay }) => {
  // Handle click on a square
  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) {
      return; // If there's a winner or the square is already filled, do nothing
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O'; // Place X or O depending on the turn
    onPlay(nextSquares); // Pass updated state to the parent
  };

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(null); // To store the winner
  const [isDraw, setIsDraw] = useState(false); // If game is drawn
  const [isGameOver, setIsGameOver] = useState(false); // To check if game is over
  const [playerX, setPlayerX] = useState(''); // Name of player X
  const [playerO, setPlayerO] = useState(''); // Name of player O
  const [xIsNext, setXIsNext] = useState(true); // Boolean to track whose turn it is (X starts first)
  const [gameStarted, setGameStarted] = useState(false); // Whether the game has started or not

  const currentSquares = history[currentMove]; // Get current move's board state

  // Function to handle the play (called when a square is clicked)
  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); // Update the game history
    setCurrentMove(nextHistory.length - 1); // Update the current move
    setXIsNext(!xIsNext); // Alternate turns between X and O

    const gameWinner = calculateWinner(nextSquares); // Check if someone won
    if (gameWinner) {
      setWinner(gameWinner === 'X' ? playerX : playerO); // Set the winner
      setIsGameOver(true); // Mark game as over
    } else if (nextSquares.every(square => square !== null)) {
      setIsDraw(true); // If all squares are filled and no winner, it's a draw
      setIsGameOver(true);
    }
  };

  // Restart the game after it's over
  const restartGame = () => {
    setHistory([Array(9).fill(null)]); // Reset board
    setCurrentMove(0); // Reset move count
    setWinner(null); // Clear winner
    setIsDraw(false); // Reset draw
    setIsGameOver(false); // Mark game as not over
    setXIsNext(true); // X starts again
    setGameStarted(false); // Game needs to restart from name input
  };

  // Start the game once both player names are entered
  const handleStartGame = () => {
    if (playerX.trim() && playerO.trim()) {
      setGameStarted(true);
    } else {
      alert("Please enter valid names for both players."); // Validate name input
    }
  };

  // Capture the player names
  const handlePlayerNameChange = (e, player) => {
    if (player === 'X') {
      setPlayerX(e.target.value); // Set player X's name
    } else {
      setPlayerO(e.target.value); // Set player O's name
    }
  };

  return (
    <div className="game">
      {/* Render name input modal if game hasn't started */}
      {!gameStarted && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Enter Player Names</h2>
            <div>
              <input
                className="player-name"
                type="text"
                placeholder="Enter Player X's Name"
                value={playerX}
                onChange={(e) => handlePlayerNameChange(e, 'X')}
              />
            </div>
            <div>
              <input
                className="player-name"
                type="text"
                placeholder="Enter Player O's Name"
                value={playerO}
                onChange={(e) => handlePlayerNameChange(e, 'O')}
              />
            </div>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      )}

      {/* Render the game board and status */}
      {gameStarted && (
        <>
          <div className="status">
            {xIsNext ? `${playerX}'s turn (X)` : `${playerO}'s turn (O)`}
          </div>
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>
        </>
      )}

      {/* Modal for when there's a winner */}
      {isGameOver && winner && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Congratulations {winner}!</h2>
            <p>You won the game!</p>
            <button onClick={restartGame}>Restart Game</button>
          </div>
        </div>
      )}

      {/* Modal for a draw */}
      {isGameOver && isDraw && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>It's a Draw!</h2>
            <p>No one wins this round.</p>
            <button onClick={restartGame}>Restart Game</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to check if there's a winner
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default Game;
