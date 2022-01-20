// Library imports
import React from 'react';
import ReactDOM from 'react-dom';

// CSS imports
import './index.css';

// ******************** FUNCTION COMPONENTS ******************** //

// <Menu /> rendered in <Page />
function Menu(props) {
	return (
		<div id="menu">
			<button onClick={props.onClick}>{!props.ShowSaved ? "Saved Cards" : "Search"}</button>
		</div>
	);
};

// <Search /> rendered in <Page />
function Search(props) {
	return (
		<div id="search">
			<input type='field' value={props.SearchBarValue} onChange={props.onChange} />
			<button onClick={props.onClick}>Search</button>
		</div>
	);
};

// <Card /> arrays calculated in <Page /> then rendered in <Grid />
function Card(props) {
	return (
		<img className='grid-card' src={props.cardImg} alt={props.cardAlt} onClick={props.cardOnClick} />
	);
};

// <Grid /> rendered in <Page />
function Grid(props) {
	return (
		<div id="grid">
			{props.DisplayedArray}
		</div>
	);
};

// ******************** REACT COMPONENTS ******************** //

// <Page /> parent component rendered at DOM 'root'
class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {				// State order:
			SearchBarValue: "", 	// 1. String - value searched for using the API
			APIArray: null, 		// 2. List - contains the exact JSON returned by the API
			ShowSaved: false, 		// 3. Boolean - true = show SavedArray <Card />s, false = show <Search /> bar and SearchedArray <Card />s
			SearchedArray: null,	// 4a. Array - APIArray JSON parsed into <Card /> elements
			SavedArray: [], 		// 4b. Array - saved <Card /> elements
			DisplayedArray: null 	// 5. Array - holds the currently displayed <Card /> elements dependant on ShowSaved
		};
	};

	// ******************** EVENT HANDLERS ******************** //

	// <Search /> input onChange handler
	// Add the typed char (e) to the input field value
	handleChange = (e) => {
		this.setState({
			SearchBarValue: this.state.SearchBarValue = e.target.value
		});
	};

	// <Search /> button onClick handler
	// Call the API using the search value in SearchBarValue
	handleSearch = () => {
		this.apiCall();
	};

	// <Grid /> <Card /> onClick handler
	// Get the clicked <Card /> element from the SearchedArray and add it to the SavedArray
	handleClick(i) {
		console.log(i);
		let selectedObject = this.state.SearchedArray[i];
		console.log(selectedObject);
		const tempArray = this.state.SavedArray;
		tempArray.push(selectedObject);

		this.setState({
			SavedArray: tempArray
		}, function () {
			console.log(this.state.SavedArray);
		});
	};

	// <Menu /> button onClick handler
	handlePageSwap = () => {
		this.setState({
			ShowSaved: (!this.state.ShowSaved ? true : false)
		}, function (){
			this.fillDisplayedArray();
		});
	};

	// ******************** RENDER (function component) METHODS ******************** //

	// <Menu />
	renderMenuBar() {
		return (
			<Menu
				ShowSaved={this.state.ShowSaved}
				onClick={this.handlePageSwap}
			/>
		)
	}

	// <Search />
	renderSearchBar() {
		return (
			<Search
				SearchBarValue={this.state.SearchBarValue}
				onChange={this.handleChange}
				onClick={this.handleSearch}
			/>
		);
	};

	// <Grid />
	renderGrid() {
		return (
			<Grid
				DisplayedArray={this.state.DisplayedArray}
			/>
		);
	};

	// ******************** STATE METHODS ******************** //

	// GET search results from the Scryfall API
	// Store the results in APIArray and call parseResults in the callback
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
						this.parseResults();
					});
				}
			)
		} catch (error) {
			console.log(error);
		}
	};

	// Parse important data from the raw JSON return and store it in SearchedArray
	parseResults() {
		let unparsedArray = this.state.APIArray; // Create mutable version of the results
		let SearchedArray = []; // local SearchedArray to be returned for the state SearchedArray

		// Variables to parse results for
		let cardName = "";
		let cardImg = "";
		let cardAlt = "";

		// If the JSON returned actually has content
		if (unparsedArray != null && unparsedArray.status != 400) {
			console.log("Unparsed Array:")
			console.log(unparsedArray);
			for (let i = 0; i < unparsedArray.data.length; i++) {
				try {
					cardName = unparsedArray.data[i].name;
					cardImg = unparsedArray.data[i].image_uris.normal;
					cardAlt = cardName;
				} catch (error) {
					unparsedArray.data.splice(i, 1); // If any of the variables above cannot be parsed, remove that entry from the mutable array
					i--; // Decrement to accomodate for the missing card
					console.log(error);
					continue;
				}
				console.log(unparsedArray.data[i]);
				
				SearchedArray.push(
					<Card
						key={"card-" + cardName}
						cardName={cardName}
						cardImg={cardImg}
						cardAlt={cardAlt}
						cardOnClick={() => this.handleClick(i)}
					/>
				);
			};
			console.log("Return Array:")
			console.log(SearchedArray);

			// Set the state SearchedArray to this local now-parsed SearchedArray
			// Call fillDisplayedArray in the callback
			this.setState({
				SearchedArray: SearchedArray
			}, function () {
				this.fillDisplayedArray();
			});
		};
	};

	// Determine the state of the page using ShowSaved and fill the DisplayedArray with the respective <Card /> objects
	fillDisplayedArray() {
		const toBeDisplayedArray = this.state.ShowSaved ? this.state.SavedArray : this.state.SearchedArray;
		this.setState({
			DisplayedArray: toBeDisplayedArray
		}, function () {
			//console.log(this.state.DisplayedArray);
		});
	};

	render() {
		return (
			<div>
				{this.renderMenuBar()}
				{!this.state.ShowSaved ? this.renderSearchBar() : ""}
				{this.renderGrid()}
			</div>
		);
	};
};

// Render <Page /> at the 'root' div
ReactDOM.render(
	<Page />,
	document.getElementById('root')
);