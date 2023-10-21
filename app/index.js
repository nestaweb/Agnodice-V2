import "../styles/index.scss";
import Lenis from "@studio-freight/lenis";
import Home from "./pages/Home";

class App {
	constructor() {
		document.body.style.opacity = 1;
		this._createLenis();
		this._createHome();
		this._createNavigation();
		this._render();
	}

	_createLenis() {
		this.lenis = new Lenis({
			lerp: 0.15,
		});
	}

	_createHome() {
		this.home = new Home();
	}

	_createNavigation() {
		this.navigation = document.querySelector(".header__hamburger");
		if (!this.navigation) return;
		this.navigation.addEventListener("click", this._toggleNavigation.bind(this));
	}

	_toggleNavigation() {
		this.navigation.classList.toggle("header__hamburger--active");
		document.querySelector(".header__menu").classList.toggle("header__menu--active");
		document.body.classList.toggle("no-scroll");
	}

	_render(time) {
		this.lenis.raf(time);
		requestAnimationFrame(this._render.bind(this));
	}
}

new App();