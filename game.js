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
		this.ctx.lineWidth = 3;
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
			let anchor = new Anchor({spr:element,color:'green'});
			line.addAnchor(anchor);
		}
	});
	return null;
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
for (var i = 0;i<30;i++){
	let dy = Math.random()*1;
	//let color = ( dy < 2 ) ? 'white' : 'darkblue';
	let color = 'white';
	let star = new Sprite({
					x:Math.random()*canvas_width,
					y:Math.random()*canvas_height,
					dy:dy,
					color:color,
					width:5+3*Math.random(),
					height:5+3*Math.random(),
					ctx:ctx});
	stars.push(star);
}

/* DRAW THINGS ON CANVAS */
function draw(){
	bg.render();
	line.render();
	stars.forEach((element) => element.render());
}

/* CLEAR CANVAS */
function clear(){
	ctx.clearRect(0,0,canvas_width,canvas_height);
}

/* UPDATE SPRITES AND OBJECTS*/
function update(){
	bg.update();
	line.update();
	stars.forEach((element) => element.update());
	isLineColliding();
}

/* TRACK MOUSE POSITION */
document.addEventListener('mousemove', (event) => {
		var rect = canvas.getBoundingClientRect();
	    pointerX = event.clientX - rect.left;
		pointerY = event.clientY - rect.top;
});

/* MAIN FUNCTION */
function main(evt){
	setInterval(()=>{
	clear();
	update();
	draw();
	},1000/60)
}

main();
