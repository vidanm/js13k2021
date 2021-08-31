class Sprite {
	constructor ({x=0, y=0, dx=0, dy=0, width=50, height=50, color='white', image=null, ctx=null}){
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.color = color;
		this.image = image;
		this.ctx = ctx;
		this.width = width;
		this.height = height;
	}

	render(){
		this.ctx.beginPath();
		this.ctx.fillStyle = this.color;
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = 5;
		if (this.image != null)
			this.ctx.drawImage(this.image,this.x,this.y);
		else
			this.ctx.arc(this.x, this.y, this.width, 0, 2  * Math.PI);
		this.ctx.fill();
	}

	update(){
		this.x += this.dx;
		this.y += this.dy;
	}
}

class Anchor {
	constructor ({spr=null,color='white'}){
		this.spr = spr;
		let rand = Math.random()*3;
		this.color = ( rand > 1) ? '#48A9A6' : '#D4B483';
		this.color = ( rand > 2 ) ? '#C1666B' : this.color;
	}
}

class Enemy {
	constructor (spr){
		this.spr = spr;
	}

	render(){
		this.spr.render();
	}

	update(){
		this.spr.update();
	}
}

class Line {
	constructor ({x=0, y=0, anchorX=250,anchorY=700,color='white',ctx=null}){
		this.x = x;
		this.y = y;
		this.color = color;
		this.ctx = ctx;
		let anchor = new Anchor({spr:new Sprite({x:anchorX, y:anchorY}),color:'white'});
		this.anchors = [anchor];
	}

	addAnchor(anchor){
		this.anchors.push(anchor);
	}

	render(){
		this.ctx.lineWidth = 5;
		for (var i = 0;i<this.anchors.length;i++){
			this.ctx.beginPath();
			if ( i < this.anchors.length -1 ){
				this.ctx.moveTo(this.anchors[i].spr.x, this.anchors[i].spr.y);
				this.ctx.lineTo(this.anchors[i+1].spr.x, this.anchors[i+1].spr.y);
				this.ctx.strokeStyle = this.anchors[i].color;
			}
			else {
				this.ctx.moveTo(this.anchors[i].spr.x, this.anchors[i].spr.y);
				this.ctx.lineTo(this.x, this.y);
				this.ctx.strokeStyle = this.color;
			}
			this.ctx.stroke();
		}
	}

	update(){
		this.x = pointerX;
		this.y = pointerY;
	}
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(
		Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2)
	)
}

function isLineColliding(){
	stars.forEach((element) => {
	
		let anlen = line.anchors.length;
		let distab = distance(line.x, line.y, element.x, element.y);
		let distbc = distance(element.x, element.y, line.anchors[anlen -1].spr.x, line.anchors[anlen-1].spr.y);
		let distac = distance(line.x, line.y, line.anchors[anlen-1].spr.x, line.anchors[anlen-1].spr.y);

		if ((distab + distbc) -distac <= 1){
			let anchor = new Anchor({spr:element});
			line.addAnchor(anchor);
		}
	});
	return null;
}

function drawLogo(ctx){
	ctx.beginPath();
	ctx.lineWidth = 50;
	ctx.strokeStyle= '#48A9A6';
	ctx.arc(100, 350, 50, Math.PI*2, Math.PI+Math.PI/2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle= '#D4B483';
	ctx.moveTo(100, 300);
	ctx.lineTo(350, 300);
	ctx.stroke();

	ctx.moveTo(225, 300);
	ctx.lineTo(225, 425);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle= '#C1666B';
	ctx.moveTo(325,275);
	ctx.lineTo(325,425);
	ctx.stroke();

	ctx.moveTo(325,400);
	ctx.lineTo(425,400);
	ctx.stroke();
}

function initBackgroundStar(begin){
	let dy = Math.random()+0.2;
	let color = 'white';
	let y = 0;
	if (begin == true){
		y = Math.random()*canvas_height;
	}

	return new Sprite({
		x:Math.random()*canvas_width,
		y:y,
		dy:dy,
		color:color,
		width:Math.random()+0.1,
		height:Math.random()+0.1,
		ctx:ctx
	});
}

function initStar(){
	let dy = 2+Math.random();
	//let color = ( dy < 2 ) ? 'white' : 'darkblue';
	let color = 'white';
	return new Sprite({
					x:Math.random()*canvas_width,
					y:0-Math.random()*canvas_height,
					dy:dy,
					color:color,
					width:5+3*Math.random(),
					height:5+3*Math.random(),
					ctx:ctx});
}

let pointerX = 0;
let pointerY = 0;

let canvas = document.getElementById('canvas');
let canvas_width = 500;
let canvas_height = 700;
let ctx = canvas.getContext('2d');

let bg = new Sprite({x:250,y:350,color:'#000220',width:500,height:500,ctx:ctx});
let line = new Line({ctx:ctx});
let stars = []
let bgStars = []
for (var i = 0;i<30;i++){
	let star = initStar();
	stars.push(star);
}

for (var i = 0;i < 200; i++){
	let star = initBackgroundStar(true);
	bgStars.push(star);
}

let enemies = []
for (var i = 0; i< 20;i++){
	let spr = new Sprite({
		x:Math.random()*canvas_width,
		y:Math.random()*canvas_height/4,
		dx:2*(Math.random()-0.5),
		dy:2*(Math.random()),
		width:5,
		height:5,
		ctx:ctx,
		color:'red'});
	let enemy = new Enemy(spr);
	enemies.push(enemy);
}

function draw(){
	bg.render();
	line.render();
	stars.forEach((element) => element.render());
	bgStars.forEach((element) => element.render());
	enemies.forEach((element) => element.render());
}

function clear(){ctx.clearRect(0,0,canvas_width,canvas_height);}

function update(){
	bg.update();
	line.update();
	stars.forEach((element) => element.update());
	bgStars.forEach((element) => element.update());
	enemies.forEach((element) => element.update());
	isLineColliding();

	/*for (var i=0;i<line.anchors.length;i++){
		if (line.anchors[i].spr == null || line.anchors[i].spr.y > canvas_height*0.8){
			line.anchors.splice(i,1);
		}
	}*/

	for (var i=0;i<stars.length;i++){
		if (stars[i].y > canvas_height*1.5){
			let star = initStar();
			stars.splice(i,1,star);
		}
	}

	for (var i=0;i<bgStars.length;i++){
		if (bgStars[i].y > canvas_height*1.5){
			let star = initBackgroundStar(false);
			bgStars.splice(i,1,star);
		}
	}
}

document.addEventListener('mousemove', (event) => {
		var rect = canvas.getBoundingClientRect();
	    pointerX = event.clientX - rect.left;
		pointerY = event.clientY - rect.top;
});

function main(evt){
	setInterval(()=>{
	clear();
	update();
	draw();
	//drawLogo(ctx);
	},1000/60)
}

main();
