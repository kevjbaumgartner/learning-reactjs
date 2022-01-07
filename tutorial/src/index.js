// Library imports
import React from 'react';
import ReactDOM from 'react-dom';

// CSS imports
import './index.css';

// Square - function component
function Square(props) {
	// Return a button element,
	// with class "square", and an onClick property given from the Board component
	// The button has its value within it ('X', 'O', or null)
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

// Board - react component
class Board extends React.Component {
	// renderSquare(i), method that returns a square component
	renderSquare(i) {
		// Return a square component,
		// Pass the squares[i] and onClick(i) props given from the game component
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	// Renders a board component containing a 3 div by 3 square component grid
	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

// Game - react component
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{ squares: Array(9).fill(null) }],
			stepNumber: 0,
			xIsNext: true
		};
	}

	// Render
	render() {
		// Variables,
		// history, from the game component's state,
		// current, is the board history at the current step,
		// winner, calculated at each render using the current,
		// moves, list created by a mapping of the history array
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move + " (" + history[move].location + ")" :
				'Go to game start';
			// Returns a list item with a button element that has a jumpTo for the associated move
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			)
		})

		// Tracks and updates the status of the game,
		// Who's turn it is next, and who wins
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		}
		// Improvement #6: When no one wins, display a message about the result being a draw
		else if (this.state.stepNumber == 9 && winner == null) {
			status = 'Draw, no turns left';
		}
		else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		// Returns a board component, passes down the squares array at its current move, and the onClick method
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}

	// jumpTo(step), method that sets the state of the game component back to a specified move
	jumpTo(move) {
		this.setState({
			stepNumber: move,
			xIsNext: (move % 2) === 0,
		});
	}

	// handleClick(i), method passed down to the square components that handles their click event
	handleClick(i) {
		// Improvement #1: Display the location for each move in the format (col, row) in the move history list
		const locations = [
			[1, 1],
			[2, 1],
			[3, 1],
			[1, 2],
			[2, 2],
			[3, 2],
			[1, 3],
			[2, 3],
			[3, 3]
		];
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		// Actively calculates if there's a winner once a square component is clicked
		if (calculateWinner(squares) || squares[i] != null) {
			return;
		}

		// Update the next player if there's no winner, as well as the game component's state
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				location: locations[i]
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}
}

// calculateWinner(squares), calculates if there's any entry of 3 in a row to determine a winner
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
		const [a, b, c] = lines[i];
		if ((squares[a] && (squares[a] === squares[b])) && (squares[a] === squares[c])) {
			return squares[a];
		}
	}
	return null;
}

// Render the instance: Game component into the root div
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);