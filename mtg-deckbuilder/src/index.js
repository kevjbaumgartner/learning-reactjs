import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
		<img key={"card-" + props.cardName} className='grid-card' src={props.cardImg} alt={props.cardAlt} onClick={props.cardOnClick} />
	);
};

function Grid(props) {
	const cardArray = props.cardArray;
	let returnArray = [];

	let cardName = "";
	let cardImg = "";
	let cardAlt = "";

	if (cardArray != null && cardArray.status != 400) {
		console.log("Card Array:")
		console.log(cardArray);
		for (let i = 0; i < cardArray.data.length; i++) {

			try{
				cardName = cardArray.data[i].name;
				cardImg = cardArray.data[i].image_uris.normal;
				cardAlt = cardName;	
			}catch(error){
				console.log(error)
				continue;
			}
			

			console.log(cardArray.data[i]);
			returnArray.push(
				<Card
					cardName={cardName}
					cardImg={cardImg}
					cardAlt={cardAlt}
					cardOnClick={props.cardOnClick}
				/>
			);
		}
		console.log("Return Array:")
		console.log(returnArray);
	}

	return (
		<div id="grid">
			{returnArray}
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
			SavedArray: null,
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

	handleClick = (e) => {
		console.log(e.target.alt);
	};

	renderSearchBar() {
		return (
			<Search
				SearchBarValue={this.state.SearchBarValue}
				onChange={this.handleChange}
				onClick={this.handleSearch}
			/>
		);
	};

	renderGrid() {
		return (
			<Grid
				cardArray={this.state.APIArray}
				cardOnClick={this.handleClick}
			/>
		);
	};

	apiCall() {
		const searchString = "https://api.scryfall.com/cards/search?q=";
		let queryString = searchString + this.state.SearchBarValue;
		try {
			fetch(queryString).then(
				results => results.json()
			).then(
				(json) => {
					this.setState({
						APIArray: json
					});
				}
			)
		} catch (error) {
			console.log(error);
		}
		console.log("API call made: " + queryString);
	}

	render() {
		return (
			<div>
				{this.renderSearchBar()}
				{this.renderGrid()}
			</div>
		);
	};
};

ReactDOM.render(
	<Page />,
	document.getElementById('root')
);