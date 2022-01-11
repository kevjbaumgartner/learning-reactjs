// Library Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Global Variables
const buttonRows = 3;
const buttonCols = 3;

// CalculatorButton - React function component to generate the 10 number buttons
function CalculatorButton(props) {
	return (
		<button className='calculatorButton' onClick={props.onClick}>
			{props.value}
		</button>
	)
};

// CalculatorScreen - React class component to generate the calculator display screen
class CalculatorScreen extends React.Component{
	constructor(props){
		super(props);
		this.setState = {
			CurrentValue: null,
			CurrentOperation: null
		}
	}

	render(){
		return(
			<input id='calculatorScreen' type='field'/>
		)
	}
};

// Calculator - React class component to encapsulate and handle the state of all prior components
class Calculator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			CalculatorButtons: ['0','1','2','3','4','5','6','7','8','9'],
			CalculatorValue: 0
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

	renderScreen(){
		return(
			<CalculatorScreen
				CurrentValue={this.state.CalculatorValue}
			/>
		)
	}

	handleButton(i){

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