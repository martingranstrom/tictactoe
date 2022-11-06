import React, { useEffect, useState } from "react";
import Fields from "./Fields";
import "./App.css";

const startingSize = 3;

const setInitialGameValues = (size) => new Array(size * size).fill("");

const allEqual = (arr) => arr.every((v) => v === arr[0] && arr[0] !== "");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getDiagInds(rowNo, rowLength) {
  var diagInds = [];
  for (var i = 0; i <= rowNo; i++) {
    diagInds.push(i.toString());
  }
  var allButLast = diagInds.slice(0, -1);
  var last = diagInds.at(-1);
  diagInds = [last].concat(allButLast).reverse();
  for (var ii = 0; ii < diagInds.length - 1; ii++) {
    diagInds[ii] = (Number(diagInds[ii]) + rowLength * (ii + 1)).toString();
  }
  return diagInds;
}

function isWin(state) {
  const rowLength = Math.sqrt(state.length);

  // Check rows
  var grid = [];
  for (let r = 0; r < state.length; r += rowLength) {
    const row = state.slice(r, r + rowLength);
    if (allEqual(row)) {
      var rowWinInd = [];
      for (let w = r; w < r + rowLength; w++) {
        rowWinInd.push(w.toString());
      }
      return rowWinInd;
    }
    grid.push(row);
  }

  // Check columns
  for (let c = 0; c < rowLength; c++) {
    var col = [];
    var colWinInd = [];
    for (let i = 0; i < rowLength; i++) {
      col.push(grid[i][c]);
      colWinInd.push((c + i * rowLength).toString());
    }
    if (allEqual(col)) {
      return colWinInd;
    }
  }

  // Check diagonals
  var diag = [];
  var diagWinInd = [];
  for (let d1 = 0; d1 < rowLength; d1++) {
    diag.push(grid[d1][d1]);
    diagWinInd.push((d1 + d1 * rowLength).toString());
  }
  if (allEqual(diag)) {
    return diagWinInd;
  }
  diag = [];
  diagWinInd = [];
  for (let d2 = 0; d2 < rowLength; d2++) {
    diag.push(grid[d2][rowLength - 1 - d2]);
    diagWinInd.push(((rowLength - 1) * (d2 + 1)).toString());
  }
  if (allEqual(diag)) {
    return diagWinInd;
  }
}

function App() {
  const [gameState, setGameState] = useState(
    setInitialGameValues(startingSize)
  );
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gameHasFinished, setGameHasFinished] = useState(false);
  const [isXTurn, setIsXTurn] = useState(true); // Player X starts

  const handleChange = (event) => {
    //console.log(window.navigator.language);
    //if (navigator.geolocation) {
    //  window.navigator.geolocation.getCurrentPosition((pos) => {
    //    console.log(pos);
    //  });
    //} else {
    //  console.log("No pos");
    //}

    setGameState(setInitialGameValues(event.target.value));
  };

  const resetGame = () => {
    setGameState(setInitialGameValues(Math.sqrt(gameState.length)));
    setGameHasFinished(false);
    setGameHasStarted(false);
    setIsXTurn(true);
    document.querySelectorAll(".winner").forEach((winner) => {
      winner.className = "";
    });
  };

  function handleClick(index) {
    setGameHasStarted(true);

    if (gameState[index] !== "") {
      return;
    }

    const newState = gameState.map((val, ind) =>
      ind.toString() === index && val === "" ? (isXTurn ? "X" : "O") : val
    );

    const winningInd = isWin(newState);
    if (winningInd) {
      const loop = async () => {
        for (let element of winningInd) {
          document.getElementById(element).setAttribute("class", "winner");
          await wait(40);
        }
      };
      loop();
      setGameHasFinished(true);
    } else if (!newState.includes("")) {
      setGameHasFinished(true);
    }

    setGameState(newState);
    setIsXTurn(isXTurn ? false : true);
  }

  useEffect(() => {
    for (var i = 0; i < gameState.length; i++) {
      document.getElementById(i.toString()).setAttribute("class", "");
    }
    const loop = async () => {
      const rowLength = Math.sqrt(gameState.length);
      var initInds = [];
      for (var i = 0; i < rowLength; i++) {
        initInds.push(getDiagInds(i, rowLength));
      }

      // Add second half diags
      for (var k = rowLength - 1; k > 0; k--) {
        initInds.push(
          initInds[k].map((d) => {
            return (gameState.length - Number(d)).toString();
          })
        );
      }

      for (var ii = 0; ii < initInds.length; ii++) {
        await wait(60);
        for (var iii = 0; iii < initInds[ii].length; iii++) {
          document
            .getElementById(initInds[ii][iii])
            .setAttribute("class", "initButton");
        }
      }
    };
    loop();
  }, [gameState.length]);

  return (
    <>
      <input
        className="sizeSlider"
        type={"range"}
        min="3"
        max="6"
        defaultValue={startingSize}
        onChange={handleChange}
        disabled={gameHasStarted}
      ></input>
      <div>
        <button hidden={!gameHasFinished} onClick={resetGame}>
          Nytt spel
        </button>
      </div>
      <Fields
        gameState={gameState}
        handleClick={handleClick}
        gameHasFinished={gameHasFinished}
      />
    </>
  );
}

export default App;
