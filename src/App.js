import React, {Component} from 'react';
import './scss/main.css';
import Page from './Page';
import Gallery from "./Gallery";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	withRouter
} from "react-router-dom";
/*
const Page = lazy(() => import('./Page'));
const Gallery = lazy(() => import('./Gallery'));
*/


const baseURL = "http://api.programator.sk";
export const dataURL = baseURL + "/gallery";
export const defaultPicURL = "https://via.placeholder.com/100x60/fff/fff";

export async function DeleteGalleryOrImage(path = "") {
	const realPath = dataURL + '/' + path;
	await fetch(realPath, {method: 'DELETE', body: {}});
}

export function PrintContacts() {
	return (
		<div className="contact">
			<a href="http://www.bart.sk">webdesign.bart.sk</a>
		</div>
	);

};

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			albums   : {
				__dummy: [{
					id      : 1,
					title   : null,
					imgSrc  : defaultPicURL,
					imgThumb: defaultPicURL,
					pathname: null,
				}]
			},
			isLoading: true
		};
		this.loadData();
	};


	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	loadData = async () => {
		let albums = {};
		await fetch(dataURL)
			.then(data => data.json())
			.then(data => {
				return data;
			})
			.then(async data => {
				await Promise.all(data.galleries.map((e) => {
					return fetch(dataURL + '/' + e.path)
						.then(response => response.json())
						.then(data => {
							albums[data.gallery.path] = [];
							data.images.length > 0 ?
								data.images.forEach((image, index) => {
									let photo = {};
									photo.id = index + 1;
									photo.title = data.gallery.name;
									photo.imageAlt = image.name;
									photo.imgSrc = photo.imgHref = baseURL + '/images/1000x600/' + image.fullpath;
									photo.imgThumb = baseURL + '/images/300x180/' + image.fullpath;
									photo.pathname = "/" + data.gallery.path;
									albums[data.gallery.path].push(photo);
								}) :
								albums[data.gallery.path] = [{
									id      : 1,
									title   : data.gallery.name,
									imgSrc  : defaultPicURL,
									imgThumb: defaultPicURL,
									pathname: "/" + data.gallery.path,
								}];
						});

				}));
				//console.log(albums);
				this.setState({isLoading: false, albums: albums});
			})
			.catch(error => {
				console.log('Error:', error);
				this.setState({isLoading: false});
			});
	};

	render() {
		const {albums, isLoading} = this.state;
		return (isLoading ? <h1>Loading...</h1> :
				<Router>
					<Switch>
						<Route exact path="/"
						       render={() => <Gallery albums={albums}/>}
						/>
						<Route exact path={albums.pathname}
						       render={() => <Page page={albums}/>}
						/>
					</Switch>
				</Router>
		);
	}
}

export default withRouter(App);
