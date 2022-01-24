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
			<img id='menuLogo' className='menuItem' src='' alt='logo' />
			<button className={props.PageState == 0 ? 'menuItem selected' : 'menuItem'} onClick={props.changeToSearched}>Search</button>
			<button className={props.PageState == 1 ? 'menuItem selected' : 'menuItem'} onClick={props.changeToSaved}>Saved</button>
		</div>
	);
};

// <Search /> rendered in <Page />
function Search(props) {
	return (
		<div id="search">
			<input
				type='field'
				value={props.SearchBarValue}
				onChange={props.onChange}
			/>
			<button onClick={props.onClick}>
				Search
			</button>
		</div>
	);
};

// <Card /> arrays calculated in <Page /> then rendered in <Grid />
function Card(props) {
	return (
		<img
			className='grid-card'
			src={props.cardSrc}
			alt={props.cardAlt}
			onClick={props.onClick}
		/>
	);
};

// <Grid /> rendered in <Page />
function Grid(props) {
	return (
		<div id="grid">
			{props.PhysicalDisplayedArray}
		</div>
	);
};

// ******************** REACT COMPONENTS ******************** //

// <Page /> parent component rendered at DOM 'root'
class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {					// State order:
			SearchBarValue: "", 		// 1. String - value searched for using the API
			APIArray: [], 				// 2. List - contains the exact JSON returned by the API
			PageState: 0, 			// 3. Boolean - true = show SavedArray <Card />s, false = show <Search /> bar and ParsedArray <Card />s
			ParsedArray: [],			// 4a. Array - APIArray JSON parsed into a dictionary (name:data)
			SavedArray: [], 			// 4b. Array - saved <Card /> elements
			VirtualDisplayedArray: [],	// 5a. Array - holds the currently displayed card's dictionary values
			PhysicalDisplayedArray: [] 	// 5b. Array - holds the currently displayed card's <Card /> elements
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
	handleClick(i) {
		let tempArray = this.state.SavedArray; // Mutable SavedArray

		if (this.state.PageState == 1) { // Remove the clicked <Card /> element's entry from SavedArray
			tempArray.splice(i, 1);
		} else { // Get the clicked <Card /> element's entry from the VirtualDisplayedArray and add it to the SavedArray
			let selectedObject = this.state.VirtualDisplayedArray[i];
			tempArray.push(selectedObject);
		};

		this.setState({
			SavedArray: tempArray
		}, function () {
			this.fulfillDisplay();
		});
	};

	// <Menu /> button page content changer
	changeTo(val) {
		this.setState({
			PageState: val
		}, function () {
			this.fulfillDisplay();
		});
	};

	// ******************** RENDER (function component) METHODS ******************** //

	// <Menu />
	renderMenuBar() {
		return (
			<Menu
				PageState={this.state.PageState}
				onClick={this.handlePageSwap}
				changeToSearched={() => this.changeTo(0)}
				changeToSaved={() => this.changeTo(1)}
			/>
		);
	};

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
				PhysicalDisplayedArray={this.state.PhysicalDisplayedArray}
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
		};
	};

	// Pass card data into a key:value array (dictionary), and pass that to ParsedArray
	parseResults() {
		const rawResults = this.state.APIArray;
		let rawData = rawResults.data; // Actual card data is stored in the [Object].data

		let ParsedArray = []; // name : data 
		for (let i = 0; i < rawData.length; i++) {
			ParsedArray.push({
				name: rawData[i].name,
				data: rawData[i]
			});
		};

		this.setState({
			ParsedArray: ParsedArray
		}, function () {
			this.fulfillDisplay();
		});
	};

	// Renders the 'DisplayedArray' corresponding to the status of PageState
	// Splits the <Grid /> component into PhysicalDisplayedArray and VirtualDisplayedArray
	// Physical contains the actual <Card /> elements,
	// Virtual contains the respective dictionary values (name:data)
	fulfillDisplay() {
		const ParsedArray = this.state.ParsedArray; // Cards searched for
		const SavedArray = this.state.SavedArray; 	// Cards saved
		const PageState = this.state.PageState;

		let backendArray = PageState == 0 ? ParsedArray : SavedArray;
		let frontendArray = [];

		for (let i = 0; i < backendArray.length; i++) {
			try {
				let key = ("card-" + i + "-" + backendArray[i].name);
				let cardName = backendArray[i].name;
				let cardSrc = (backendArray[i].data.image_uris.normal != undefined ? backendArray[i].data.image_uris.normal : "");
				let cardData = backendArray[i].data;
				let onClick = () => this.handleClick(i);

				frontendArray.push(
					<Card
						key={key}
						cardName={cardName}
						cardSrc={cardSrc}
						cardAlt={cardName}
						cardData={cardData}
						onClick={onClick}
					/>
				);
			} catch (error) {
				backendArray.splice(i, 1); // If any of the variables above cannot be retrieved, remove that entry
				i--; // Decrement to accomodate for the missing entry
				console.log(error);
				continue;
			};
		};

		this.setState({
			VirtualDisplayedArray: backendArray,
			PhysicalDisplayedArray: frontendArray
		});
	};

	// <Page /> render return
	render() {
		return (
			<div id='page'>
				{this.renderMenuBar()}
				{this.state.PageState == 0 ? this.renderSearchBar() : ""}
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