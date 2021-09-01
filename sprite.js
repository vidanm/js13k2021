

class Sprite {
	constructor ({x=0, y=0, dx=0, dy=0, dr=0, width=50, height=50, color='white', image=null, ctx=null}){
		this.x = x;
		this.y = y;
		this.r = 0;
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
		this.r += this.dr;
	}
}

class Filante extends Sprite {
	render(){
		let rot=Math.PI/2*3;
		let spikes = 5;
		let x=this.x;
		let y=this.y;
		let step=Math.PI/spikes;
		let outerRadius = this.width/1.5;
		let innerRadius = this.height;
		this.ctx.beginPath();
		this.ctx.moveTo(x,y-outerRadius)
		for(var i=0;i<spikes;i++){
			x=this.x+Math.cos(rot)*outerRadius;
		  	y=this.y+Math.sin(rot)*outerRadius;
		 	this.ctx.lineTo(x,y)
		  	rot+=step
		  	x=this.x+Math.cos(rot)*innerRadius;
		  	y=this.y+Math.sin(rot)*innerRadius;
		  	this.ctx.lineTo(x,y)
		  	rot+=step
		}
		this.ctx.lineTo(this.x,this.y-outerRadius);
		this.ctx.closePath();
		this.ctx.lineWidth=7;
		this.ctx.strokeStyle=this.color;
		this.ctx.stroke();
		this.ctx.fillStyle='white';
		this.ctx.fill();
	}
}

export { Sprite, Filante }
