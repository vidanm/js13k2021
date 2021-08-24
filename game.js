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

class Line {
	constructor ({x=0, y=0, anchorX=0,anchorY=0,color='white',ctx=null}){
		this.x = x;
		this.y = y;
		this.anchorX = anchorX;
		this.anchorY = anchorY;
		this.color = color;
		this.ctx = ctx;
	}

	render(){
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = 3;
		this.ctx.beginPath();
		this.ctx.moveTo(this.anchorX,this.anchorY);
		this.ctx.lineTo(this.x,this.y);
		this.ctx.stroke();
	}

	update(){
		this.x = pointerX;
		this.y = pointerY;
	}
}

let pointerX = 0
let pointerY = 0
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let bg = new Sprite({x:250,y:350,color:'#040626',width:500,height:500,ctx:ctx});
let line = new Line({ctx:ctx});
let canvas_width = 500;
let canvas_height = 700;


// DRAW THINGS ON CANVAS
function draw(){
	bg.render();
	line.render();
}

// CLEAR CANVAS
function clear(){
	ctx.clearRect(0,0,canvas_width,canvas_height);
}

// UPDATE SPRITES AND OBJECTS
function update(){
	bg.update();
	line.update();
}

// TRACK MOUSE POSITION
document.addEventListener('mousemove', (event) => {
	    pointerX = event.clientX;
		pointerY = event.clientY;
});

// MAIN FUNCTION
function main(evt){
	setInterval(()=>{
	clear();
	update();
	draw();
	//choose next rectangle color before drawing
	//recalls the code above every frame at a rate of 60 per second
	},1000/60)
}

main();
