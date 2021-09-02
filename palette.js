let lightPalette = ['#48A9A6','#D4B483','#c1666b'];
let darkPalette = ['#000220'];

function randomColorFromPalette(palette){
	let rand = Math.floor(Math.random()*palette.length);
	return palette[rand];
}

export { lightPalette, darkPalette, randomColorFromPalette }
