// Library Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Global Variables
const buttonRows = 3;
const buttonCols = 3;

// CalculatorButton - React function component to render the 10 number buttons
function CalculatorButton(props) {
	return (
		<button className='calculatorButton' onClick={props.onClick}>
			{props.value}
		</button>
	);
};

// CalculatorScreen - React function component to render the calculator display screen
function CalculatorScreen(props) {
	return (
		<input
			id='calculatorScreen'
			type='field'
			name='calculatorScreen'
			value={props.CurrentValue}
			onChange={(e) => console.log(e.target.value)}
		/>
	);
};

// Calculator - React class component to encapsulate and handle the state of all prior components
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
					CurrentValue: 0,
					CurrentEquation: ""
				}
			],
			CurrentValue: 0,
			CurrentEquation: ""
		}
	}

	renderButton(i) {
		return (
			<CalculatorButton
				key={'button-' + i}
				value={this.state.CalculatorButtons[i]}
				onClick={() => this.handleButton(i)}
			/>
		);
	}

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

	renderScreen() {
		return (
			<CalculatorScreen
				CurrentValue={this.state.CurrentValue}
			/>
		);
	}

	handleButton(i) {

		const isEqual = (this.state.OperatorButtons[this.state.OperatorButtons.length - 1]) == i ? true : false;
		if (isEqual) {
			this.Evaluate();
			return;
		}

		const mutaHistory = [...this.state.History];

		const curStep = this.state.CurrentStep;
		const curVal = i;

		let curEq = mutaHistory[curStep].CurrentEquation;
		curEq += ("" + curVal);

		this.setState(
			{
				CurrentStep: this.state.History.length,
				CurrentValue: curVal,
				CurrentEquation: curEq
			}, () => {
				this.updateHistory(mutaHistory);
			}
		);
	}

	// Callback functions
	updateHistory(mutaHistory) {
		this.setState({
			History: mutaHistory.concat([{
				CurrentValue: this.state.CurrentValue,
				CurrentEquation: this.state.CurrentEquation
			}])
		},
			() => {
				console.log("step:" + this.state.CurrentStep);
				console.log(this.state.History);
			}
		)
	}

	Evaluate() {
		const equation = this.state.History[this.state.CurrentStep].CurrentEquation;
		console.log(equation);
		let answer = eval(equation);
		console.log(answer);
		this.setState({
			CurrentValue: answer
		});
	}

	render() {
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
				<br />
				{buttonGrid}
				<br />
				{operatorGrid}
				<br />
			</div>
		)
	}
};

// DOM Render
ReactDOM.render(
	<Calculator />,
	document.getElementById('root')
);