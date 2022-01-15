// Library Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Global Variables
const buttonRows = 3;
const buttonCols = 3;

// CalculatorButton - React function component to render the calculator buttons
function CalculatorButton(props) {
	return (
		<button className='calculatorButton' onClick={props.onClick}>
			{props.value}
		</button>
	);
}

// CalculatorScreen - React function component to render the calculator display screen
function CalculatorScreen(props) {
	return (
		<input
			id='calculatorScreen'
			type='field'
			name='calculatorScreen'
			value={props.CurrentEquation}
			onChange={(e) => console.log(e.target.value)}
		/>
	);
}

// Calculator - React class component to encapsulate and handle the state of all prior function components
class Calculator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			CalculatorButtons: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
			OperatorButtons: ['+', '-', '*', '/', '%', '='],
			CurrentOperation: null,
			CurrentStep: 0,
			History: [
				{
					CurrentValue: null,
					CurrentEquation: ""
				}
			],
			CurrentValue: null,
			CurrentEquation: ""
		}
	}

	// Return a CalculatorButton element with a number within it
	renderButton(i) {
		return (
			<CalculatorButton
				key={'button-' + i}
				value={this.state.CalculatorButtons[i]}
				onClick={() => this.handleButton(i)}
			/>
		);
	}

	// Return a CalculatorButton element with an operator within it
	renderOperator(i) {
		const symbolArray = [];
		symbolArray[i] = this.state.OperatorButtons[i];

		return (
			<CalculatorButton
				key={'operator-' + i}
				value={symbolArray[i]}
				onClick={() => this.handleButton(symbolArray[i])}
			/>
		);
	}

	// Return a CalculatorScreen element
	renderScreen() {
		return (
			<CalculatorScreen
				CurrentValue={this.state.CurrentValue}
				CurrentEquation={this.state.CurrentEquation}
			/>
		);
	}

	// Set the state of the calculator elements to a previous version held within the History property
	// i, represents the Objects
	// j, represents the Step
	loadBackup(i, j) {
		this.setState({
			CurrentStep: j,
			CurrentValue: i.CurrentValue,
			CurrentEquation: i.CurrentEquation
		});
	}

	// Resolve the input of a CalculatorButton onClick event
	handleButton(i) {
		//Determine what the input was
		const isEqual = (this.state.OperatorButtons[this.state.OperatorButtons.length - 1]) == i ? true : false;
		// If Equals and the equation isn't empty, try evaluating
		if (isEqual && !this.state.CurrentEquation == '') {
			try {
				this.evaluateEquation();
			} catch (error) {
				return;
			}
			return;
		}
		// If Equals and the equation is empty, do nothing
		else if (isEqual && this.state.CurrentEquation == '') {
			return;
		}
		else {
			const curStep = this.state.CurrentStep;
			const mutaHistory = [this.state.History.slice(0, this.state.CurrentStep + 1)];
			const curVal = i;
			let curEq = mutaHistory[0][curStep].CurrentEquation;
			curEq += ("" + curVal);
			this.setState(
				{
					CurrentValue: curVal,
					CurrentEquation: curEq
				}, () => {
					this.updateHistory();
				}
			);
		}
	}

	// Callback function for handleButton()
	updateHistory() {
		const mutaHistory = [this.state.History.slice(0, this.state.CurrentStep + 1)][0];
		this.setState({
			History: mutaHistory.concat([{
				CurrentValue: this.state.CurrentValue,
				CurrentEquation: this.state.CurrentEquation
			}]),
			CurrentStep: mutaHistory.length
		});
	}

	// Use the "eval" method to evaluate all values and operators in the CurrentEquation property to a solvable equation
	evaluateEquation() {
		const equation = this.state.History[this.state.CurrentStep].CurrentEquation;
		let answer = eval(equation);
		this.setState({
			CurrentValue: answer,
			CurrentEquation: ("" + answer)
		}, () => {
			this.updateHistory();
		});
	}

	render() {
		const backups = this.state.History.map((objects, step) => {
			return (
				<li key={step} className='backupItem'>
					<button onClick={() => this.loadBackup(objects, step)}>
						Back to step {step}: {this.state.History[step].CurrentEquation}
					</button>
				</li>
			)
		});

		const buttonGrid = [];
		for (let i = 1; i <= buttonRows; i++) {
			const offset = (i - 1) * buttonCols;
			for (let j = 1; j <= buttonCols; j++) {
				buttonGrid.push(
					this.renderButton(offset + j)
				);
			}
			buttonGrid.push(
				<br key={'break-' + i} />
			)
		};
		buttonGrid.push(
			this.renderButton(0)
		);

		const operatorGrid = [];
		for (let i = 0; i < this.state.OperatorButtons.length - 1; i++) {
			operatorGrid.push(
				this.renderOperator(i)
			)
		};
		operatorGrid.push(
			this.renderOperator(this.state.OperatorButtons.length - 1)
		);

		return (
			<div>
				{this.renderScreen()}
				<br /><br />
				{buttonGrid}
				<br /><br />
				{operatorGrid}
				<br /><br />
				<ol>
					{backups}
				</ol>
			</div>
		)
	}
};

// DOM Render
ReactDOM.render(
	<Calculator />,
	document.getElementById('root')
);