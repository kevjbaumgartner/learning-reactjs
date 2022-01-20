import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Menu(props) {
	return (
		<div id="menu">
			<button onClick={props.onClick}>Saved Cards</button>
		</div>
	);
};

function Search(props) {
	return (
		<div id="search">
			<input type='input' value={props.SearchBarValue} onChange={props.onChange} />
			<button onClick={props.onClick}>Search</button>
		</div>
	);
};

function Card(props) {
	return (
		<img className='grid-card' src={props.cardImg} alt={props.cardAlt} onClick={props.cardOnClick} />
	);
};

function Grid(props) {
	return (
		<div id="grid">
			{props.DisplayedArray}
		</div>
	);
};

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			SearchBarValue: "",
			APIArray: null,
			DisplayedArray: null,
			SavedArray: [],
			ShowSaved: false
		};
	};

	handleChange = (e) => {
		this.setState({
			SearchBarValue: this.state.SearchBarValue = e.target.value
		});
	};

	handleSearch = () => {
		this.apiCall();
	};

	handleClick(i) {
		let selectedObject = this.state.DisplayedArray[i];
		const tempArray = this.state.SavedArray;
		tempArray.push(selectedObject);

		this.setState({
			SavedArray: tempArray
		}, function () {
			console.log(this.state.SavedArray);
		});
	};

	handlePageSwap = () => {
		this.setState({
			ShowSaved: true
		});
	};

	renderMenuBar() {
		return (
			<Menu
				onClick={this.handlePageSwap}
			/>
		)
	}

	renderSearchBar() {
		return (
			<Search
				SearchBarValue={this.state.SearchBarValue}
				onChange={this.handleChange}
				onClick={this.handleSearch}
			/>
		);
	};

	renderGrid(bool) {
		return (
			<Grid
				DisplayedArray={!bool ? this.state.DisplayedArray : this.state.SavedArray}
			/>
		);
	};

	apiCall() {
		const searchString = "https://api.scryfall.com/cards/search?q=";
		let queryString = searchString + this.state.SearchBarValue;
		try {
			console.log("API call made: " + queryString);
			fetch(queryString).then(
				results => results.json()
			).then(
				(json) => {
					this.setState({
						APIArray: json
					}, function () {
						this.fillDisplayedArray();
					});
				}
			)
		} catch (error) {
			console.log(error);
		}
	};

	fillDisplayedArray() {
		const cardArray = this.state.APIArray;
		let returnArray = [];

		let cardName = "";
		let cardImg = "";
		let cardAlt = "";

		if (cardArray != null && cardArray.status != 400) {
			console.log("Card Array:")
			console.log(cardArray);
			for (let i = 0; i < cardArray.data.length; i++) {
				try {
					cardName = cardArray.data[i].name;
					cardImg = cardArray.data[i].image_uris.normal;
					cardAlt = cardName;
				} catch (error) {
					console.log(error)
					continue;
				}

				console.log(cardArray.data[i]);
				returnArray.push(
					<Card
						key={"card-" + cardName}
						cardName={cardName}
						cardImg={cardImg}
						cardAlt={cardAlt}
						cardOnClick={() => this.handleClick(i)}
					/>
				);
			}
			console.log("Return Array:")
			console.log(returnArray);

			this.setState({
				DisplayedArray: returnArray
			}, function () {
				console.log(this.state.DisplayedArray);
			});
		};
	};

	render() {
		return (
			<div>
				{this.renderMenuBar()}
				{!this.state.ShowSaved ? this.renderSearchBar() : ""}
				{!this.state.ShowSaved ? this.renderGrid(false) : this.renderGrid(true)}
			</div>
		);
	};
};

ReactDOM.render(
	<Page />,
	document.getElementById('root')
);