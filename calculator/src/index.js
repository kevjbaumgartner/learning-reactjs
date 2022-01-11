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

	renderScreen() {
		return (
			<CalculatorScreen
				CurrentValue={this.state.CurrentValue}
			/>
		);
	}

	handleButton(i) {

		const mutaHistory = [...this.state.History];

		const CurStep = this.state.CurrentStep;
		const CurVal = i;

		let CurEq = mutaHistory[CurStep].CurrentEquation;
		CurEq += ("" + CurVal);

		this.setState(
			{
				CurrentStep: this.state.History.length,
				CurrentValue: CurVal,
				CurrentEquation: CurEq
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
		}
		buttonGrid.push(
			this.renderButton(0)
		);

		return (
			<div>
				{this.renderScreen()}
				<br />
				{buttonGrid}
			</div>
		)
	}
};

// DOM Render
ReactDOM.render(
	<Calculator />,
	document.getElementById('root')
);