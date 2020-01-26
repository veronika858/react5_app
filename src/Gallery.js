import React from 'react';
import './scss/main.css';
import './fancybox/core.css';
import './fancyboxJS/core.js';
import {AiOutlinePlusCircle, TiDeleteOutline} from 'react-icons/all';
import {BrowserRouter as Router, withRouter} from "react-router-dom";
import AddCategory from "./AddCategory";
import {DeleteGalleryOrImage, PrintContacts} from "./App";
/** @jsx jsx */
import {css, jsx} from "@emotion/core";


class Gallery extends React.Component {
	state = {lastActiveGallery: ""};

	constructor(props) {
		super(props);

		const myContent = Object.keys(props.albums)[0];
		this.state.lastActiveGallery = props.albums[myContent][0].imgSrc;
	}

	GallerySet = () => {
		const galleryCards = Object.values(this.props.albums).map(album =>
			album[0].title &&
			<li className="cards__item">
				<Router>
					<a key={album[0].id}
					   className="card"
					   href={album[0].pathname}

					   onMouseOver={() => this.setState({lastActiveGallery: album[0].imgSrc})}
					   rel="noopener noreferrer"
					>
						<button className="delete"
						        title="Vymazať"
						        onClick={e => {
							        window.confirm("Naozaj chcete odstrániť kategóriu " + album[0].title + "?") &&
							        DeleteGalleryOrImage(album[0].title) &&
							        document.location.reload();
							        e.stopPropagation();
							        e.preventDefault();
						        }}
						><TiDeleteOutline/></button>
						<img
							className="card__image"
							src={album[0].imgThumb}
							alt={album[0].imageAlt}
						/>

						<div className="card__content">
							<h6 className="card__title"> {album[0].title}</h6>
							<p className="card__counter"> {album.length > 1 ? (album.length > 4 ? album.length + ' fotiek' : album.length + ' fotky') : ''}</p>
						</div>
					</a>
				</Router>
			</li>
		);

		const addCategory = (
			<li className="cards__item">
				<a data-fancybox="img" href="#addcategory" className="card card__button">
					<div className="card__button__add_category ">
						<h1><AiOutlinePlusCircle/></h1>
						<h6>Pridať kategóriu</h6>
					</div>

				</a>
			</li>
		);

		return (
			<div className="gallery-set">
				<ul className="cards">
					{galleryCards}
					{addCategory}
				</ul>
				<AddCategory/>
			</div>
		);
	};


	componentDidMount() {

	}

	GalleryCover = () => {
		const bgStyle = css`
			background : linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${this.state.lastActiveGallery});
			background-size : cover;
			background-repeat :  no-repeat;
		`;
		return (
			<div className="cover" css={bgStyle}>
			</div>
		)
	};

	render() {
		return (
			<div className="main">
				<this.GalleryCover/>

				<div className="gallery">
					<div className="container">
						<div className="header-title">
							<h3>Fotogaléria</h3>
							<h4>Kategórie</h4>
						</div>
						<this.GallerySet/>

						<PrintContacts/>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Gallery);
