// <Preview /> rendered in <Page />
function Preview(props) {
	return (
		<div id="preview">
			<div id='preview-options' className={props.PageState != 0 ? 'display-none' : ''}>
				Save deck as:
				<input
					type='field'
					value={props.PreviewSaveValue}
					onChange={props.onChange}
					placeholder='Enter a deck name!'
				/>
				<button onClick={props.onClick}>
					<i className="fas fa-save"></i>
				</button>
			</div>
			{props.PhysicalPreviewArray}
		</div>
	);
};

// <Menu /> rendered in <Page />
function Menu(props) {
	return (
		<div id='menu'>
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
		<div id='grid'>
			{props.PhysicalDisplayedArray}
		</div>
	);
};

// <Saved /> rendered in <Page />
function Saved(props) {
	const SavedDecksList = props.SavedDecks.map((deck, index) =>
		<li key={index} onClick={() => props.onClick(index)}>
			{deck.name}
			<br />
			Cards: {deck.cards.length}
		</li>
	);

	return (
		<div id='saved'>
			<ul>
				{SavedDecksList}
			</ul>
		</div>
	);
};

export {
	Preview,
	Menu,
	Search,
	Card,
	Grid,
	Saved
};