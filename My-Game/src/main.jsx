import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // Import global CSS styles
import Game from './App.jsx'; // Import the main Tic-Tac-Toe component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
