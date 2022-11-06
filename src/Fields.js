import React from "react";

function Fields(props) {
  function GetField(index, value) {
    return (
      <input
        type="button"
        disabled={props.gameHasFinished}
        value={value}
        key={index}
        id={index}
        onClick={() => props.handleClick(index)}
      />
    );
  }

  function GetFields() {
    const size = props.gameState.length;
    var grid = [];
    for (var i = 0; i < size; i++) {
      grid.push(GetField(i.toString(), props.gameState[i]));
      if ((i + 1) % Math.sqrt(size) === 0) {
        grid.push(<br key={"br" + i.toString()} />);
      }
    }

    return grid;
  }

  return <div className="center">{GetFields()}</div>;
}

export default Fields;
