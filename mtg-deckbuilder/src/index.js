// Library imports
import React from 'react';
import ReactDOM from 'react-dom';

// CSS imports
import './index.css';

// ******************** FUNCTION COMPONENTS ******************** //

// <Preview /> rendered in <Page />
function Preview(props) {
	return (
		<div id="preview">
			Save deck as:
			<input
				type='field'
			/>
			<button>
				Save
			</button>
			{props.PhysicalPreviewArray}
		</div>
	);
};

// <Menu /> rendered in <Page />
function Menu(props) {
	return (
		<div id="menu">
			<img id='menuLogo' className='menuItem' src='./logo.png' alt='logo' />
			<div className={props.PageState == 0 ? 'menuButton selected' : 'menuButton'} onClick={props.changeToSearched}>{props.renderSearchBar()}</div>
			<button className={props.PageState == 1 ? 'menuButton selected' : 'menuButton'} onClick={props.changeToSaved}>Saved Decks</button>
		</div>
	);
};

// <Search /> rendered in <Menu />
function Search(props) {
	return (
		<div id="search">
			Search
			<input
				type='field'
				value={props.SearchBarValue}
				onChange={props.onChange}
				placeholder='Enter a card name!'
			/>
			<button onClick={props.onClick}>
				<i className="fas fa-search"></i>
			</button>
		</div>
	);
};

// <Card /> arrays calculated in <Page /> then rendered in <Grid />
function Card(props) {
	return (
		<div className='grid-card'>
			<img
				src={props.cardSrc}
				alt={props.cardAlt}
			/>
			<div 
				className='grid-card-hover'
				onClick={props.onClick}
			>
				<button>
					{props.hoverAction}
				</button>
			</div>
		</div>
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
			PageState: 0, 				// 3. Int - Holds the current page state:
			// 0 = Searched
			// 1 = Saved
			ParsedArray: [],			// 4a. Array - APIArray JSON parsed into a dictionary (name:data)
			SavedArray: [], 			// 4b. Array - saved <Card /> elements
			VirtualDisplayedArray: [],	// 5a. Array - holds the currently displayed card's dictionary values
			PhysicalDisplayedArray: [], // 5b. Array - holds the currently displayed card's <Card /> elements

			VirtualPreviewArray: [],	//
			PhysicalPreviewArray: [],	//
			DeckFocus: "unnamedDeck",	//
			SavedDecks: []				//
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

		// if (this.state.PageState == 1) { // Remove the clicked <Card /> element's entry from SavedArray
		// 	tempArray.splice(i, 1);
		// } else { // Get the clicked <Card /> element's entry from the VirtualDisplayedArray and add it to the SavedArray
			let selectedObject = this.state.VirtualDisplayedArray[i];
			tempArray.push(selectedObject);
		//};

		this.setState({
			SavedArray: tempArray
		}, function () {
			this.fulfillPreview();
		});
	};

	handleRemove(i) {
		let tempArray = this.state.SavedArray;

		tempArray.splice(i , 1);
		this.setState({
			SavedArray: tempArray
		}, function () {
			this.fulfillPreview();
		});
	}

	// <Menu /> button page content changer
	changeTo(val) {
		this.setState({
			PageState: val
		}, function () {
			this.fulfillDisplay();
		});
	};

	// ******************** RENDER (function component) METHODS ******************** //

	// <Preview />
	renderPreview() {
		return (
			<Preview
				PhysicalPreviewArray={this.state.PhysicalPreviewArray}
			/>
		);
	};

	// <Menu />
	renderMenuBar() {
		return (
			<Menu
				PageState={this.state.PageState}
				onClick={this.handlePageSwap}
				changeToSearched={() => this.changeTo(0)}
				changeToSaved={() => this.changeTo(1)}
				renderSearchBar={() => this.renderSearchBar()}
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

	// 
	fulfillPreview() {
		const SavedArray = this.state.SavedArray;

		let backendArray = SavedArray;
		let frontendArray = [];

		for(let i = 0; i < backendArray.length; i++) {
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
				let onClick = () => this.handleClick(i);

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
		return (
			<div id='page'>
				{this.renderMenuBar()}
				<div id='display'>
					{this.renderGrid()}
				</div>
				{this.renderPreview()}
			</div>
		);
	};
};

// Render <Page /> at the 'root' div
ReactDOM.render(
	<Page />,
	document.getElementById('root')
);