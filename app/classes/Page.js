import TextReveal from "../animations/TextReveal";
import Button from "../animations/Button";
import ParallaxImage from "../animations/ParallaxImage";

export default class Page {
	constructor() {
		this._createTextReveals();
		this._createButtons();
		this._createParallaxImages();
	}

	_createTextReveals() {
		const textItems = [...document.querySelectorAll("[data-animation='text-reveal']")];

		textItems.forEach((textItem) => {
			new TextReveal({
				element: textItem
			});
		});
	}

	_createButtons() {
		const buttons = [...document.querySelectorAll("[data-animation='button']")];

		buttons.forEach((button) => {
			new Button({
				element: button
			});
		});
	}

	_createParallaxImages() {
		const images = [...document.querySelectorAll("[data-animation='parallax-image']")];

		images.forEach((image) => {
			new ParallaxImage({
				imageSection: image
			});
		});
	}
}
