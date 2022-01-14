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
				CurrentEquation={this.state.CurrentEquation}
			/>
		);
	}

	loadBackup(i, j){
		this.setState({
			CurrentStep: j,
			CurrentValue: i.CurrentValue,
			CurrentEquation: i.CurrentEquation
		}, ()=>{
			console.log(this.state.CurrentStep)
		});
	}

	handleButton(i) {
		//Determine what the input was
		const isEqual = (this.state.OperatorButtons[this.state.OperatorButtons.length - 1]) == i ? true : false;
		// If Equals and the equation isn't empty, try evaluating
		if (isEqual && !this.state.CurrentEquation == '') {
			try{
				this.evaluateEquation();
			}catch(error){
				return;
			}
			return;
		}
		// If Equals and the equation is empty, do nothing
		else if (isEqual && this.state.CurrentEquation == '') {
			return;
		}
		else {
			const mutaHistory = [this.state.History.slice(0, this.state.CurrentStep)];

			const curStep = this.state.CurrentStep;
			console.log("curstep:" + curStep);
			const curVal = i;

			let curEq = mutaHistory[curStep].CurrentEquation;
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

	// Callback functions
	updateHistory() {
		const mutaHistory = [this.state.History.slice(0, this.state.CurrentStep)];
		this.setState({
			History: mutaHistory.concat([{
				CurrentValue: this.state.CurrentValue,
				CurrentEquation: this.state.CurrentEquation
			}]),
			CurrentStep: this.state.History.length
		},
			() => {
				console.log("step:" + this.state.CurrentStep);
				console.log(this.state.History);
			}
		)
	}

	evaluateEquation() {
		const equation = this.state.History[this.state.CurrentStep].CurrentEquation;
		console.log(equation);
		let answer = eval(equation);
		console.log(answer);
		this.setState({
			//CurrentStep: this.state.History.length,
			CurrentValue: answer,
			CurrentEquation: ("" + answer)
		}, () => {
			this.updateHistory();
		});
	}

	render() {
		const backups = this.state.History.map((objects, step) => {
			return(
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