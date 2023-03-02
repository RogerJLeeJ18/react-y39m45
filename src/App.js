import React, { useState, useCallback } from 'react';
import './style.css';

// turn state
// board state
// potentially an array of rows bieng an array of strings
// [['', '', ''], ['', '', ''], ['', '', '']]
// win state
// if a row has all the same values ( x or o) then it is a win
// if the first value of each column is the same value it is a win
// diagonal wins encompass positions [00, 11, 22] or [02, 11, 20]

// reset game after win state
// set win message

export default function App() {
  const [boardState, setBoardState] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [turnState, setTurnState] = useState('O');
  const [winState, setWinState] = useState(null);

  const onTurn = useCallback(
    (position) => {
      if (winState !== null) return;
      const row = position[0];
      const column = position[1];

      const newBoardState = [...boardState];
      newBoardState[row][column] = turnState;
      setBoardState(newBoardState);

      setWinState(getWinState({ row, column }));
      // move turn state to keep order after wins
      const newTurnState = turnState === 'O' ? 'X' : 'O';
      setTurnState(newTurnState);
      return;
    },
    [turnState, boardState, setWinState, winState, setBoardState, setTurnState]
  );

  const getWinState = useCallback(
    ({ row, column }) => {
      const winningValue = `${turnState}${turnState}${turnState}`;
      // check row based on input row
      const horizontalValue = boardState[row].join('');

      // check column based on input column
      const verticalValue = `${boardState[0][column]}${boardState[1][column]}${boardState[2][column]}`;

      // check diagnols (TODO: find a way to check this more intuitively)
      const diagonal1 = `${boardState[0][0]}${boardState[1][1]}${boardState[2][2]}`;
      const diagonal2 = `${boardState[0][2]}${boardState[1][1]}${boardState[2][0]}`;

      if (horizontalValue === winningValue) {
        return { winner: turnState, winType: 'horizontally', winVariant: row };
      }
      if (verticalValue === winningValue) {
        return { winner: turnState, winType: 'vertically', winVariant: column };
      }
      if (diagonal1 === winningValue || diagonal2 === winningValue) {
        return {
          winner: turnState,
          winType: 'diagonally',
          winVariant: diagonal1 === '' ? 0 : 1,
        };
      }
      return null;
    },
    [boardState, turnState]
  );

  const onReset = useCallback(() => {
    setWinState(null);
    setBoardState([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  }, [setBoardState, setWinState]);

  // would like to create a line here that I can animatea cross on  win condition
  // const getCrossClass = useCallback(() => {
  // }, [winState]);

  return (
    <div id="board" align="center">
      {winState && (
        <>
          <p>{`Congratulations player ${winState.winner} you've won ${winState.winType}`}</p>
          <button className="playAgainButton" onClick={() => onReset()}>
            Play Again
          </button>
        </>
      )}
      <p>TIC - TAC - TOE</p>
      {boardState.map((rowValues, rowIndex) => (
        <div
          className={rowIndex === 2 ? 'boardRow' : 'boardRow rowWithBorder'}
          key={rowIndex}
        >
          {rowValues.map((columnValue, columnIndex) => (
            <div
              className={`boardColumn ${
                columnIndex !== 2 ? 'columnWithBorder' : ''
              }`}
              onClick={() => onTurn([rowIndex, columnIndex])}
              key={columnIndex}
            >
              <span>{columnValue}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
