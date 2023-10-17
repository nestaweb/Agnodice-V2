import "../styles/index.scss";
import Lenis from "@studio-freight/lenis";

import TextReveal from "./animations/textReveal";
import Button from "./animations/button";

class App {
	constructor() {
		this._createLenis();
		this._createTextReveals();
		this._createButtons();
		this._render();
	}

	_createLenis() {
		this.lenis = new Lenis({
			lerp: 0.15,
		})
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

	_render(time) {
		this.lenis.raf(time);

		requestAnimationFrame(this._render.bind(this))
	}
}

new App();