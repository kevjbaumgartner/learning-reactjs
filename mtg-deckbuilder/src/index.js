// Library imports
import React from 'react';
import ReactDOM from 'react-dom';

// Local imports
import {Preview, Menu, Search, Grid, Saved, Card}  from './function-components.js';

// CSS imports
import './index.css';

// ******************** REACT COMPONENTS ******************** //

// <Page /> parent component rendered at DOM 'root'
class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {					// State order:
			SearchBarValue: "", 		// 1. String - value searched for using the API
			APIArray: [], 				// 2. List - contains the exact JSON returned by the API
			PageState: 0, 				// 3. Int - tracks the current page state:
			// 0 = Searched
			// 1 = Saved
			ParsedArray: [],			// 4a. Array - APIArray JSON parsed into a dictionary (name:data)
			SavedArray: [], 			// 4b. Array - saved <Card /> elements
			VirtualDisplayedArray: [],	// 5a. Array - holds the currently displayed card's dictionary values
			PhysicalDisplayedArray: [], // 5b. Array - holds the currently displayed card's <Card /> elements
			VirtualPreviewArray: [],	// 6a. Array - holds the currently previewed card's dictionary values
			PhysicalPreviewArray: [],	// 6b. Array - holds the currently previewed card's <Card /> elements
			PreviewSaveValue: "",		// 7. String - value saved as the name for a saved deck
			SavedDecks: [],				// 8. Array - holds SavedArray arrays
			DeckFocus: null				// 9. Int - tracks the currently viewed saved deck
		};
	};

	// ******************** EVENT HANDLERS ******************** //

	// <Search /> input onChange handler
	// Add the typed char (e) to the input field value
	handleSearchChange = (e) => {
		this.setState({
			SearchBarValue: this.state.SearchBarValue = e.target.value
		});
	};

	// <Preview /> input onChange handler
	handlePreviewChange = (e) => {
		this.setState({
			PreviewSaveValue: this.state.PreviewSaveValue = e.target.value
		});
	};

	// <Search /> button onClick handler
	// Call the API using the search value in SearchBarValue
	handleSearch = () => {
		this.apiCall();
	};

	// <Preview /> button onClick Handler
	// Saves the currently previewed cards into the SavedDeck state with PreviewSaveValue as a key
	handleSaveDeck = () => {
		const SavedDecks = this.state.SavedDecks;

		let SavedArray = this.state.SavedArray;
		let PreviewSaveValue = this.state.PreviewSaveValue;

		if(SavedArray.length < 1) {
			console.log("Save deck error: no cards selected to save to deck.");
			return;
		} else if (PreviewSaveValue < 1) {
			console.log("Save deck error: no deck name entered.");
			return;
		};

		SavedDecks.push({
			name: PreviewSaveValue,
			cards: SavedArray
		});
		
		this.setState({
			SavedDecks: SavedDecks,
			SavedArray: [],
			PreviewSaveValue: ""
		}, function () {
			this.fulfillPreview();
		});
	};

	// <Saved /> <li> onClick handler
	handleSavedDeckClick = (val) => {
		this.setState({
			DeckFocus: val
		}, function () {
			this.fulfillPreview();
		});
	};

	// <Grid /> <Card /> adding onClick handler
	handleAdd(i) {
		let tempArray = this.state.SavedArray; // Mutable SavedArray
		let selectedObject = this.state.VirtualDisplayedArray[i];
		tempArray.push(selectedObject);
		this.setState({
			SavedArray: tempArray
		}, function () {
			this.fulfillPreview();
		});
	};

	// <Preview /> <Card /> removing onClick handler
	handleRemove(i) {
		let tempArray = [];

		if (this.state.PageState == 0) {
			tempArray = this.state.SavedArray;
			tempArray.splice(i, 1);
			this.setState({
				SavedArray: tempArray
			}, function () {
				this.fulfillPreview();
			});
		}
		else if (this.state.PageState == 1) {
			tempArray = this.state.SavedDecks;
			let subArray = tempArray[this.state.DeckFocus].cards;
			subArray.splice(i, 1);
			tempArray[this.state.DeckFocus].cards = subArray;
			this.setState({
				SavedDecks: tempArray
			}, function () {
				this.fulfillPreview();
			});
		};
	};

	// <Menu /> button page content changer
	changeTo(val) {
		this.setState({
			PageState: val
		}, function () {
			this.fulfillDisplay();
			this.fulfillPreview();
		});
	};

	// ******************** RENDER (function component) METHODS ******************** //

	// <Preview />
	renderPreview() {
		return (
			<Preview
				PageState={this.state.PageState}
				PhysicalPreviewArray={this.state.PhysicalPreviewArray}
				PreviewSaveValue={this.state.PreviewSaveValue}
				onChange={this.handlePreviewChange}
				onClick={this.handleSaveDeck}
			/>
		);
	};

	// <Menu />
	renderMenuBar() {
		return (
			<Menu
				PageState={this.state.PageState}
				onClick={this.handlePageSwap}
				changeToSearched={() => this.changeTo(0)}	// Search
				changeToSaved={() => this.changeTo(1)}		// Saved Decks
				renderSearchBar={() => this.renderSearchBar()}
			/>
		);
	};

	// <Search />
	renderSearchBar() {
		return (
			<Search
				SearchBarValue={this.state.SearchBarValue}
				onChange={this.handleSearchChange}
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

	// <Saved />
	renderSaved() {
		return (
			<Saved
				SavedDecks={this.state.SavedDecks}
				onClick={this.handleSavedDeckClick}
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
					if(json.status == undefined){
						this.setState({
							APIArray: json
						}, function () {
							this.parseResults();
						});
					} else {
						console.log("Error code: " + json.status);
					};
				}
			);
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

	// Renders the 'PreviewedArray'
	fulfillPreview() {
		let tempArray = [];

		if (this.state.PageState == 0) {
			tempArray = this.state.SavedArray;
		} else if (this.state.PageState == 1 && this.state.DeckFocus != null) {
			tempArray = this.state.SavedDecks[this.state.DeckFocus].cards;
		} else{
			this.setState({
				VirtualPreviewArray: [],
				PhysicalPreviewArray: []
			});
			return
		};

		let backendArray = tempArray;
		let frontendArray = [];

		for (let i = 0; i < backendArray.length; i++) {
			try {
				let key = ("card-" + i + "-" + backendArray[i].name);
				let cardName = backendArray[i].name;
				let cardSrc = (backendArray[i].data.image_uris.normal != undefined ? backendArray[i].data.image_uris.normal : "");
				let cardData = backendArray[i].data;
				let onClick = () => this.handleRemove(i);

				frontendArray.push(
					<Card
						key={key}
						cardName={cardName}
						cardSrc={cardSrc}
						cardAlt={cardName}
						cardData={cardData}
						onClick={onClick}
						hoverAction={"Remove"}
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
			VirtualPreviewArray: backendArray,
			PhysicalPreviewArray: frontendArray
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
				let onClick = () => this.handleAdd(i);

				frontendArray.push(
					<Card
						key={key}
						cardName={cardName}
						cardSrc={cardSrc}
						cardAlt={cardName}
						cardData={cardData}
						onClick={onClick}
						hoverAction={"+"}
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

		// <Menu />
		let menuElement = (
			this.renderMenuBar()
		);

		// <Grid />
		let gridElement = (
			this.renderGrid()
		);

		// <Saved />
		let savedElement = (
			this.renderSaved()
		);

		// <div id='display'></div>
		let displayElement = (
			<div id='display'>
				{this.state.PageState == 0 ? gridElement : savedElement}
			</div>
		);

		// <Preview />
		let previewElement = (
			this.renderPreview()
		);

		return (
			<div id='page'>
				{menuElement}
				{displayElement}
				{previewElement}
			</div>
		);
	};
};

// Render <Page /> at the 'root' div
ReactDOM.render(
	<Page />,
	document.getElementById('root')
);