import { Sprite } from './sprite.js'
import { writeText } from './font.js'

var pointerX = 0;
var pointerY = 0;
document.addEventListener('mousemove',(event) => {
	var rect = canvas.getBoundingClientRect();
	pointerX = event.clientX - rect.left;
	pointerY = event.clientY - rect.top;
});

function distance(x1, y1, x2, y2){
	return Math.sqrt(
		Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
	)
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
	constructor ({x=0, y=0, anchorX=canvas.width/2,anchorY=canvas.height,color='white',ctx=null}){
		this.x = x;
		this.y = y;
		this.score_to_add = 0;
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
				writeText(Math.floor(this.score_to_add).toString(),
						  this.x,
						  this.y -50,
						  15,
						  'white');
			}
			this.ctx.stroke();
		}
	}

	update(pointerX, pointerY){
		this.x = pointerX;
		this.y = pointerY;
		let len = this.anchors.length;
		this.score_to_add = distance(this.x,this.y,this.anchors[len-1].spr.x,this.anchors[len-1].spr.y)
	}
}


export { Line, Anchor, pointerX, pointerY }
