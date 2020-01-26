import React from 'react';
import './scss/main.css';
import {IoMdArrowRoundBack} from 'react-icons/io';
import {MdAddAPhoto, TiDeleteOutline} from 'react-icons/all';
import './fancybox/core.css';
import './fancyboxJS/core.js';
import './scss/fontawesome.css';
import {BrowserRouter as Router, Route, Link, useHistory, withRouter} from "react-router-dom";
import FileList from "./FileList";
import {DeleteGalleryOrImage, PrintContacts} from "./App";
/** @jsx jsx */
import {css, jsx} from "@emotion/core";

function GallerySetPhotos(props) {
	let pagetitle = props.albums;
	if (!Array.isArray(props.albums)) {
		pagetitle = Array.of(props.albums)
	}

	const galleryPhoto = pagetitle.map((albums) => {
			return !albums.imgHref ? ""
				: <li className="cards__item">
					<a key={albums.id}
					   className="card card__body"
					   href={albums.imgHref}
					   data-fancybox="img"
					   rel="noopener noreferrer"
					>

						<img
							className="card__image"
							src={albums.imgSrc}
							alt={albums.imageAlt}
						/>
					</a>
					<button className="delete"
					        title="Vymazať"
					        onClick={e => {
						        const splittedURL = albums.imgSrc.split("/");
						        const image = splittedURL[splittedURL.length - 1];
						        const album = splittedURL[splittedURL.length - 2];
						        window.confirm("Naozaj chcete odstrániť fotografiu " + image + " z albumu " + album + "?") &&
						        DeleteGalleryOrImage(album + '/' + image) &&
						        document.location.reload();
						        e.stopPropagation();
						        e.preventDefault();
					        }}
					><TiDeleteOutline/></button>
				</li>;
		}
	);

	const addPhoto = (
		<li className="cards__item">
			<a data-fancybox="add" href="#addphoto" className="card card__button" id="card__button">

				<div className="card__button__add_photo ">
					<h1><MdAddAPhoto/></h1>
					<h6>Pridať fotky</h6>
				</div>

			</a>
		</li>
	);

	return (
		<div className="gallery-set">
			<ul className="cards">
				{galleryPhoto}
				{addPhoto}
			</ul>
			<div id="addphoto">
				<FileList galleryName={CurrentPage()}/>
			</div>
		</div>
	);


}

function CurrentPage() {
	return window.location.pathname.substr(1);
}

function CurrentPageName(props) {


	let pagetitle = props.page_title;
	let history = useHistory();
	if (!Array.isArray(props.page_title)) {
		pagetitle = Array.of(props.page_title)
	}
	/*
		const page_name = pagetitle.map((page_title) =>
			<h4><a onClick={(e) => { e.preventDefault(); history.goBack(); }}>
				<IoMdArrowRoundBack/></a>{page_title.title}</h4>
		);
	*/
	return (
		<div className="header-title">
			<h3>Fotogaléria</h3>
			{/*{page_name[0]}*/}
			<h4><Link to="/" onClick={history.goBack}><IoMdArrowRoundBack/></Link>{pagetitle[0].title}</h4>
		</div>
	);
}

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		//console.log("Page location", props.location, "Page history", props.history);
	}

	componentDidMount() {
	}

	PageCover = () => {
		const myContent = this.props.page[CurrentPage()];
		const cover = myContent[0].imgSrc;
		const bgStyle = css`
			background : linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${cover});
			background-size : cover;
			background-repeat :  no-repeat;
		`;
		return (
			<div className="cover" css={bgStyle}>
			</div>
		)
	};


	render() {
		return <Router>
			<Route path={window.location.pathname} render={() =>
				<div className={CurrentPage()}>
					<this.PageCover/>
					<div className="gallery">
						<div className="container">
							<CurrentPageName page_title={this.props.page[CurrentPage()]}/>
							<GallerySetPhotos albums={this.props.page[CurrentPage()]}/>
							<PrintContacts/>
						</div>
					</div>
				</div>
			}/>
		</Router>;
	}
}

export default withRouter(Page);
