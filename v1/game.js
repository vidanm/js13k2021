// Imports
import { init, initPointer, getPointer, Sprite, GameLoop } from './kontra.mjs';

// Initialisation des variables
let {
	canvas
} = init();

initPointer();

let stars = [] //Points d'accroches
let lines = [] //Ligne

let line = Sprite({
	x: 0,
	y: 0,
	pointerx: 0,
	pointery: 0,
	color: 'gray',
	render: function() {
		this.context.strokeStyle = this.color;
		this.context.lineWidth = 3;
		this.context.beginPath();
		this.context.moveTo(this.pointerx, this.pointery);
		this.context.lineTo(250,700);
		this.context.closePath();
		this.context.stroke();
		
	},
	update: function() {
		let pointer = getPointer();
		this.pointerx = pointer.x;
		this.pointery = pointer.y;
		this.render();
	}
});


for (var i = 0; i < 5; i++) {
	let sprite = Sprite({
		x: Math.random() * 250,
		y: Math.random() * 350,
		color: 'white',
		radius: 3 + Math.random() * 2,
		render: function() {
			this.context.fillStyle = this.color;
			this.context.beginPath();
			this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			this.context.fill();
		}
	});
	stars.push(sprite);
}

let background = Sprite({
	x: 0,
	y: 0,
	width: 500,
	height: 700,
	color: 'black'
});



let loop = GameLoop({
	update: function() {
		stars.forEach(function(item) {
			item.update()
		});
		line.update();
	},

	render: function() {
		background.render();
		line.render();
		stars.forEach(function(item) {
			item.render()
		});
	}
});

loop.start();
