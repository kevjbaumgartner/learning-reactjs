// Library imports
import React from 'react';
import ReactDOM from 'react-dom';

// CSS imports
import './index.css';

// Variables
const numBoardRows = 3;
const numBoardCols = 3;
let winningArray = [];

// Square - function component
function Square(props) {
	// Return a button element,
	// with class "square", and an onClick property given from the Board component
	// The button has its value within it ('X', 'O', or null)
	return (
		<button className={props.winningSquare ? "square win" : "square"} onClick={props.onClick}>
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
				key={"square" + i}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}

				// Improvement #5: When someone wins, highlight the three squares that caused the win
				winningSquare={winningArray.includes(i) ? true : false}
			/>
		);
	}

	// Improvement #3: Rewrite Board to use two loops to make the squares instead of hardcoding them
	// renderRow(row), renders 3 square components within a board-row div and returns them
	renderRow(numRows) {
		const cols = [];
		const offset = numRows * numBoardCols;
		for (let i = 0; i < numBoardCols; i++) {
			cols.push(
				this.renderSquare(offset + i)
			);
		}
		return (
			<div className="board-row" key={"row" + numRows}>
				{cols}
			</div>
		)
	}

	// Renders a board component containing 3 rows of 3 square components
	render() {
		const board = [];
		for (let i = 0; i < numBoardRows; i++) {
			board.push(
				this.renderRow(i)
			);
		}
		return (
			<div>{board}</div>
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
			xIsNext: true,
			sortDescending: false
		};
	}

	// Improvement #4: Add a toggle button that lets you sort the moves in either ascending or descending order
	// changeSort(), reverses the order of the sorting between ascending and descending
	changeSort() {
		this.setState({
			sortDescending: !this.state.sortDescending
		});
	}

	// jumpTo(step), method that sets the state of the game component back to a specified move
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
		winningArray = [];
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
		// Return early if so
		if (calculateWinner(squares) || squares[i] != null) {
			return;
		}

		// Update the next player if there's no winner, as well as the game component's state
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				// Store the placement of the square components,
				// the location of the most recent play,
				// and whether it was an 'X', or 'O'
				squares: squares,
				location: locations[i],
				entry: this.state.xIsNext ? 'X' : 'O'
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
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
				'Go to move #' + move + " - " + history[move].entry + " at (" + history[move].location + ")" :
				'Go to game start';
			// Returns a list item with a button element that has a jumpTo for the associated move
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>
						{/* Improvement #2: Bold the currently selected item in the move list */}
						{move == this.state.stepNumber ? <b>{desc}</b> : desc}
					</button>
				</li>
			);
		})

		// Tracks and updates the status of the game,
		// Who's turn it is next, and who wins
		let status;
		if (winner) {
			status = 'Winner: ' + winner[0];
			winningArray = winner[1];
			console.log(winningArray);
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
						winningSquare={false}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{this.state.sortDescending ? moves.reverse() : moves}</ol>
					<button onClick={() => this.changeSort()}>Sort: </button>
				</div>
			</div>
		);
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
			return(
				[squares[a], lines[i]]
			);
		}
	}
	return null;
}

// Render the instance: Game component into the root div
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);