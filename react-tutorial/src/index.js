import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square" + ' ' + props.winner} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winner = ''
    if (this.props.winnerSquares){
      winner = this.props.winnerSquares.includes(i) ? 'winner' : 'loser '
    }
    return <Square value={this.props.squares[i]}
                   onClick={() => this.props.onClick(i)}
                   winner={winner}/>
  }

  render() {
    let board_structure = [];
    let count = 0
    for (let i = 0; i < 3; i++) {
      let lines = []
      for (let j = 0; j < 3; j++) {
        lines.push(this.renderSquare(count));
        count++;
      }
      board_structure.push(<div className="board-row">{lines}</div>);
    }

    return (
      <div>
        {board_structure}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares) || [];

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner[1]) {
      status = 'Winner: ' + winner[1];
    } else if (this.state.stepNumber == 9){
      status = 'It\'s a draw...';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerSquares={winner[0]}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  
function calculateWinner(squares) {
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
    const [a, b, c] = lines[i]; // multipla declaração: a == 0, b == 1, c == 2
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [lines[i], squares[a]];
    }
  }
  return null;
}
