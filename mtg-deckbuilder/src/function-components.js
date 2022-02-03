// <Intro /> rendered in <Page />
function Intro(props) {
	return (
		<div id='intro' className={props.IntroState == 1 ? 'opacity-zero pointer-events-none' : ''}>
			<h1>MTG: Deck Builder</h1>
			<div>
				<input
					type='field'
					value={props.SearchBarValue}
					onChange={props.onChange}
					placeholder='Start by entering a card name!'
				/>
				<button onClick={props.onClick}>
					<i className='fas fa-search'></i>
				</button>
			</div>
		</div>
	);
};

// <Preview /> rendered in <Page />
function Preview(props) {
	return (
		<div id='preview' className={props.PhysicalPreviewArray.length == 0 ? 'preview-is-empty' : ''}>
			<div id='preview-content' className={props.PhysicalPreviewArray.length == 0 ? 'display-none' : ''}>
				<div id='preview-options' className={props.PageState != 0 ? '' : ''}>
					{props.PageState != 0 ? 'Delete deck?' : 'Save deck as:'}
					<br />
					<input
						type='field'
						value={props.PreviewSaveValue}
						onChange={props.onChange}
						placeholder='Enter a deck name!'
						className={props.PageState != 0 ? 'display-none' : ''}
					/>
					<button onClick={props.PageState != 0 ? props.onDelete : props.onSave}>
						<i className={props.PageState != 0 ? 'fas fa-trash' : 'fas fa-save'}></i>
					</button>
				</div>
				{props.PhysicalPreviewArray}
			</div>
			<div id='preview-empty' className={props.PhysicalPreviewArray.length != 0 ? 'display-none' : ''}>
				{props.PageState != 0 ? 'Pick a deck to start editing it!' : 'Pick out some cards to start building a deck!'}
			</div>
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
		<div id='search'>
			Search
			<input
				type='field'
				value={props.SearchBarValue}
				onChange={props.onChange}
				placeholder='Enter a card name!'
			/>
			<button onClick={props.onClick}>
				<i className='fas fa-search'></i>
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
		<li key={index} className='grid-card' onClick={() => props.onClick(index)}>
			<img
				src={deck.cards[0].data.image_uris.normal}
				alt={deck.cards[0].data.name}
			/>
			<div
				className='grid-card-hover'
			>
				<h1>{deck.name}</h1>
				Cards: {deck.cards.length}
			</div>
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

// Export all of the components
export {
	Intro,
	Preview,
	Menu,
	Search,
	Card,
	Grid,
	Saved
};