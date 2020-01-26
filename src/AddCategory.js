import React, {Component} from "react";
import {AiOutlinePlus} from "react-icons/all";
import {dataURL} from './App';


async function postData(url = '', data = {}) {

	const response = await fetch(url, {
		method : 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body   : JSON.stringify(data)
	});

	if (!response.ok) {
		let responseText = "<p> HTTP status code: " + response.status;
		switch (response.status) {
			case 400:
				responseText += " Chybne zadaný request - nevhodný obsah podľa schémy. </p>";
				break;
			case 409:
				responseText += " Galéria so zadaným názvom už existuje. </p>";
				break;
			default:
				responseText += " Nedefinovaná chyba </p>";
		}

		document.getElementById("questionForm").innerHTML = responseText;
	} else {
		let responseText = "<p> HTTP status code " + response.status + " Galeria bola vytvorená </p>";
		document.getElementById("questionForm").innerHTML = responseText;
		return await response.json();
	}
}


class AddCategory extends Component {


	switchContent(event) {

		const galleryName = event.target['newGalleryName'].value.trim();
		let responseText = "";
		if (galleryName.length < 1) {
			responseText = "<p> Prilis kratky nazov!</p>";
		} else {
			postData(dataURL, {name: galleryName})
				.then(async (data) => {
					responseText = await data;
					//console.log(data);
				});
		}
		document.getElementById("questionForm").innerHTML = responseText;

		setTimeout(function () {
			document.location.reload()
		}, 2000);

	}

	render() {
		return (
			<div id="addcategory">
				<div id="questionForm">
					<form action="" encType="multipart/data" onSubmit={this.switchContent.bind(this)}>
						<div className="container2">
							<h3>Pridať kategóriu</h3>
							<div className="addCategory">
								<p>
									<input className="button-input" type="text" name="newGalleryName"
									       placeholder="zadajte názov kategórie"
									       required='required'/>
								</p>
								<button className="button-add" type="submit"><AiOutlinePlus/> Pridať</button>
							</div>
						</div>
					</form>
				</div>
			</div>

		)
	}
};

export default AddCategory;

