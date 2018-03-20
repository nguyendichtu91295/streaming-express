const filesElement = document.querySelectorAll('.js-item-link');
let activeDom = null;
const buttonLink = document.querySelector('.js-button-link');
const popup = document.querySelector('.js-popup-backdrop');
const popupContent = document.querySelector('.js-popup-content');
const popupFileName = document.querySelector('.js-popup-file-name');
const popupClose = document.querySelector('.js-popup-close');
const popupClassName = 'popup-backdrop js-popup-backdrop';
const fileExtensionMap = {
	'.mp3': 'audio',
	'.wav': 'audio',
	'.flac': 'audio',
	'.wmv': 'video',
	'.mkv': 'video',
	'.mov': 'video',
	'.mp4': 'video',
	'.avi': 'video',
	'.gif': 'img',
	'.bmp': 'img',
	'.tiff': 'img',
	'.png': 'img',
	'.jpeg': 'img',
	'.jpg': 'img',
};

openFile = e => {
	const dataAttr = e.currentTarget.dataset;

	const file = {};

	file.path = dataAttr.path;
	file.name = decodeURI(dataAttr.name);
	file.extension = dataAttr.extension;
	file.type = fileExtensionMap[`${file.extension}`];

	if (processFile(file)) {
		e.preventDefault();
	}
};

closePopup = e => {
	e.preventDefault();
	popup.className = popupClassName;
	popupContent.removeChild(activeDom);
};

processFile = file => {
	const { name, type } = file;

	if (!type) {
		return false;
	}

	popupFileName.innerHTML = name;
	activeDom = createDom(file, type);

	if (type === 'video') {
		checkLoadedBuffer();
	}

	popupContent.appendChild(activeDom);
	popup.className += ' popup-backdrop-shown';

	return true;
};

createDom = (file, type) => {
	const domElement = document.createElement(type);
	domElement.src = file.path;

	if (type === 'video' || type === 'audio') {
		domElement.volume = 1.0;
		domElement.setAttribute('controls', '');
		domElement.setAttribute('autoplay', '');
	}

	return domElement;
};

checkLoadedBuffer = () => {
	activeDom.addEventListener('progress', function() {
		if (this.duration) {
			var loadedPercentage = this.buffered.end(0) / this.duration * 100;
			console.log('loaded', loadedPercentage);
		}
	});
};

backToFolder = e => {
	const windowHref = window.location.href;

	if (!windowHref.split('/')[3]) {
		e.preventDefault();
	}
};

(function() {
	popupClose.addEventListener('click', closePopup);

	if (buttonLink) {
		buttonLink.addEventListener('click', backToFolder);
	}

	if (filesElement) {
		filesElement.forEach(fileElement => {
			fileElement.addEventListener('click', openFile);
		});
	}
})();
