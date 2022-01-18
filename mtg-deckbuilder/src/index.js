import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Search(props) {
	return (
		<div>
			<input type='input' value={props.searchValue} onChange={props.onChange} />
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
			SearchItem: null
		};
	};

	handleChange() {

	};

	handleClick() {

	};

	renderSearchBar() {
		return (
			<Search
				searchValue=""
				onChange={this.handleChange}
				onClick={this.handleClick}
			/>
		);
	};

	render() {

		const searchString = "https://api.scryfall.com/cards/search?q=";
		let queryString = "";

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