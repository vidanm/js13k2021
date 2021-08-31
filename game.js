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
		this.renderShadow();
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

	renderShadow(){
		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
		this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
		this.ctx.lineWidth = 5;
		this.ctx.arc(this.x+8,this.y+8,this.width,0,2*Math.PI);
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
	constructor ({x=0, y=0, anchorX=canvas.width/2,anchorY=canvas.height,color='white',ctx=null}){
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

function drawLogo({x=0, y=0, ctx=null, shadow=true}){
	
	ctx.beginPath();
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'; // Shadows
	ctx.lineWidth = 50;
	if (shadow == false)
		ctx.strokeStyle= '#48A9A6';
	ctx.arc(x+100, y+350, 50, Math.PI*2, Math.PI+Math.PI/2);
	ctx.stroke();
	
	ctx.beginPath();
	if (shadow == false)
		ctx.strokeStyle= '#D4B483';
	ctx.moveTo(x+100, y+300);
	ctx.lineTo(x+350, y+300);
	ctx.stroke();

	ctx.moveTo(x+225, y+300);
	ctx.lineTo(x+225, y+425);
	ctx.stroke();

	ctx.beginPath();
	if (shadow == false)
		ctx.strokeStyle= '#C1666B';
	ctx.moveTo(x+325,y+275);
	ctx.lineTo(x+325,y+425);
	ctx.stroke();

	ctx.moveTo(x+325,y+400);
	ctx.lineTo(x+425,y+400);
	ctx.stroke();
}

function initBackgroundStar(begin){
	let dy = Math.random()+0.2;
	let color = 'white';
	let y = 0;
	if (begin == true){
		y = Math.random()*canvas.height;
	}

	return new Sprite({
		x:Math.random()*canvas.width,
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
					x:Math.random()*canvas.width,
					y:0-Math.random()*canvas.height,
					dy:dy,
					color:color,
					width:5+3*Math.random(),
					height:5+3*Math.random(),
					ctx:ctx});
}

let pointerX = 0;
let pointerY = 0;

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

let bg = new Sprite({x:250,y:350,color:'#000220',width:canvas.width,height:canvas.height,ctx:ctx});
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
		x:Math.random()*canvas.width,
		y:Math.random()*canvas.height/4,
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

function clear(){ctx.clearRect(0,0,canvas.width,canvas.height);}

function update(){
	bg.update();
	line.update();
	stars.forEach((element) => element.update());
	bgStars.forEach((element) => element.update());
	enemies.forEach((element) => element.update());
	isLineColliding();

	/*for (var i=0;i<line.anchors.length;i++){
		if (line.anchors[i].spr == null || line.anchors[i].spr.y > canvas.height*0.8){
			line.anchors.splice(i,1);
		}
	}*/

	for (var i=0;i<stars.length;i++){
		if (stars[i].y > canvas.height*1.5){
			let star = initStar();
			stars.splice(i,1,star);
		}
	}

	for (var i=0;i<bgStars.length;i++){
		if (bgStars[i].y > canvas.height*1.5){
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
	drawLogo({x:10,y:10,ctx:ctx,shadow:true});
	drawLogo({x:0,y:0,ctx:ctx,shadow:false});
	},1000/60)
}

main();
