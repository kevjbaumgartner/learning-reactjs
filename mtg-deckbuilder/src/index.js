import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Search(props) {
	return (
		<div>
			<input type='input' value={props.SearchBarValue} onChange={props.onChange} />
			<button onClick={props.onClick}>Search</button>
		</div>
	);
};

function Card(props) {
	return (
		<div key={"card-" + props.cardName} className='grid-card' onClick={props.onClick}>
			<img src={props.cardImg} />
		</div>
	);
};

class Grid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	};

	render() {
		return (
			<div>

			</div>
		);
	};
};

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			SearchBarValue: "",
			APIArray: null
		};
	};

	handleChange = (e) => {
		this.setState({
			SearchBarValue: this.state.SearchBarValue = e.target.value
		});
	};

	handleClick = () => {
		this.apiCall();
	};

	renderSearchBar() {
		return (
			<Search
				SearchBarValue={this.state.SearchBarValue}
				onChange={this.handleChange}
				onClick={this.handleClick}
			/>
		);
	};

	apiCall() {
		const searchString = "https://api.scryfall.com/cards/search?q=";
		let queryString = searchString + this.state.SearchBarValue;
		fetch(queryString).then(
			results => results.json()).then(
				(json) => {
					this.setState({
						APIArray: json
					});
				}
			)
	}

	render() {
		return (
			<div>
				{this.renderSearchBar()}
				<Grid />
			</div>
		);
	};
};

ReactDOM.render(
	<Page />,
	document.getElementById('root')
);