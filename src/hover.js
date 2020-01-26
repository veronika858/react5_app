import React, {useState} from "react";
import {css} from "@emotion/core";

function HoverOnElement() {
	const [isShown, setIsShown] = useState(false);
	return (
		<div>
			<button onMouseEnter={() => setIsShown(true)}
			        onMouseLeave={() => setIsShown(false)}>

			</button>
			{isShown && (<div>Kuk</div>)}
		</div>
	);

	function changeBackground(e) {
		e.target.style.background = 'red';
	}

	return (
		<button
			onMouseOver={changeBackground}>
		</button>
	);

}

export default HoverOnElement;

function Album() {
	const[background, setBackground] = useState("#99ff55");
	const setStyle = (background) => {setBackground(background)};
	const cover = css`

    background: ${background};
      `;
	return(
		<div className="cover"
		     onMouseEnter={()=> {setStyle("#ff9966")}}>
		</div>
	);
};

