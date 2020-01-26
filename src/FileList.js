import React, {Component} from 'react';
import Dropzone from "react-dropzone";
import {AiOutlinePlus, MdAddAPhoto} from "react-icons/all";
import {dataURL} from "./App";


async function postData(url = '', files = []) {
	const formData = new FormData();

	for (var i = 0; i < files.files.length; i++) {
		formData.append('file' + i, files.files[i]);
	}
	/*
		for (var pair of formData.entries()) {
			console.log(pair[0]+ ',', pair[1]);
		}*/

	const response = await fetch(url, {
		method: 'POST',
		body  : formData
	});

	if (!response.ok) {
		let responseText = "<p> HTTP status code: " + response.status;
		switch (response.status) {
			case 400:
				responseText += " Chybný request - nenašiel sa súbor pre upload. </p>";
				break;
			case 404:
				responseText += " Galéria pre upload sa nenašla. </p>";
				break;
			default:
				responseText += " Nedefinovaná chyba </p>";
		}

		document.getElementById("toSwitch").innerHTML = responseText;
	} else {
		let responseText = "<p> HTTP status code " + response.status + " Súbor bol pridaný. </p>";
		document.getElementById("toSwitch").innerHTML = responseText;
		return await response.json();
	}
}


class FileList extends Component {
	state = {
		galleryName: this.props.galleryName,
		files      : []
	};

	handleDrop = (files) => {
		let fileList = this.state.files;
		for (var i = 0; i < files.length; i++) {
			if (!files[i].name) return;
			fileList.push(files[i]);
		}

		fileList = [...new Map(fileList.map(file =>
			[file['path'], file])).values()];

		this.setState({files: fileList});
	};

	switchContent() {

		const filesToAdd = this.state.files;
		let responseText = "";
		if (filesToAdd.length < 1) {
			responseText = "<p> Prazdny zoznam!</p>";
		} else {
			const files = this.state.files.map(file => (
				"<li>"
				+ file.path +
				"</li>"
			));

			responseText = "<ul>"

				+ files +

				"</ul>";
			//console.log("filestoadd:",filesToAdd);

			postData(dataURL + "/" + this.state.galleryName, {files: filesToAdd})
				.then(async (data) => {
					responseText = await data;
					//console.log(data);
				});

		}
		document.getElementById("toSwitch").innerHTML = responseText;


		setTimeout(function () {
			document.location.reload()
		}, 2500);


	}


	render() {
		const files = this.state.files.map(file => (
			<li key={file.name}>
				{file.name} - {file.size} bytes
			</li>
		));

		return (
			<div id="toSwitch">
				<form action="" encType="multiparta/form-data" onSubmit={this.switchContent.bind(this)}>
					<div className="container2">
						<h3>Pridať fotky</h3>
						<Dropzone onDrop={this.handleDrop} accept="image/jpeg">
							{({getRootProps, getInputProps}) => (
								<div>
									<div {...getRootProps({className: 'dropzone'})}>
										<div className="box">
											<div className="box-input">

												<MdAddAPhoto class="box-icon"/>
												<input className="box-file"
												       multiple {...getInputProps()}/>
												<label htmlFor="file"><strong>Sem presunte fotky</strong>
													<span>alebo</span>
													<div
														className="box-dragndrop">vyberte súbory
													</div>
												</label>

												<ul>{files}</ul>

											</div>

										</div>
									</div>
									<button className="box-button" type="submit"><AiOutlinePlus/> Pridať</button>
								</div>
							)}
						</Dropzone>
					</div>
				</form>
			</div>
		);
	}
}

export default FileList;
