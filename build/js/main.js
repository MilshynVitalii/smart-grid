document.addEventListener("DOMContentLoaded", () => {
	const burgerButton = document.querySelector('.navigation__burger');
	const nav = document.querySelector('.header__nav');
	const overlay = document.querySelector('.overlay');

	burgerButton.addEventListener('click', event => {
		nav.classList.toggle('active');
		overlay.classList.toggle('active');
	});

	overlay.addEventListener('click', event => {
		nav.classList.toggle('active');
		overlay.classList.toggle('active');
	});
});