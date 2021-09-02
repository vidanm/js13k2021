import { font } from './tiny.js'
import { initFont } from './index.js'
import { Sprite, Filante } from './sprite.js'
import { Anchor, Line, pointerX, pointerY } from './player.js'

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
	ctx.arc(x, y+50, 50, Math.PI*2, Math.PI+Math.PI/2);
	ctx.stroke();
	
	ctx.beginPath();
	if (shadow == false)
		ctx.strokeStyle= '#D4B483';
	ctx.moveTo(x, y);
	ctx.lineTo(x+250, y);
	ctx.stroke();

	ctx.moveTo(x+125, y);
	ctx.lineTo(x+125, y+125);
	ctx.stroke();

	ctx.beginPath();
	if (shadow == false)
		ctx.strokeStyle= '#C1666B';
	ctx.moveTo(x+225,y-25);
	ctx.lineTo(x+225,y+125);
	ctx.stroke();

	ctx.moveTo(x+225,y+100);
	ctx.lineTo(x+325,y+100);
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
	let dy = 1+Math.random()*2;
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

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const writeText = initFont(font, ctx);
let gameStatus = 'intro'

let bg = new Sprite({x:canvas.width/2,y:canvas.height/2,color:'#000220',width:canvas.width*canvas.height,ctx:ctx});
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
	let spr = new Filante({
		x:Math.random()*canvas.width,
		y:0-Math.random()*canvas.height,
		dx:2*(Math.random()-0.5),
		dy:2*(Math.random()),
		dr:Math.random()*10,
		width:10,
		height:10,
		ctx:ctx,
		color:'#C1666B'});
	enemies.push(spr);
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
	line.update(pointerX, pointerY);
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


// INTRO VARIABLES
const logoDownY = canvas.height+200;
let logoY = logoDownY;
let logoX = canvas.width/2-120;
const logoCenterY = canvas.height/2-50;
const speed = 0.05;
let show = true;

let textOpacity = 0.5;
let textOpacityDirection = false; // false -> goes down | true -> goes up
const textOpacitySpeed = 0.02;


function intro(evt){
	clear();
	bg.render();
	bgStars.forEach((element) => element.render());
	drawLogo({x:logoX-10,y:logoY-10,ctx:ctx,shadow:true});
	drawLogo({x:logoX,y:logoY,ctx:ctx,shadow:false});
	writeText("CLICK TO PLAY",logoX+40,logoY+150,18,'rgba(255,255,255,'+textOpacity.toString()+')');
	
	if (show)
		logoY += (logoCenterY - logoY)*speed;
	else {
		logoY += (logoDownY - logoY)*speed;
		if (Math.abs(logoDownY - logoY) < 50)
			gameStatus = 'game';
	}
	
	if (textOpacityDirection){
		textOpacity += textOpacitySpeed;
		if (textOpacity >= 1)
			textOpacityDirection = false;
	}
	else{
		textOpacity += -textOpacitySpeed; 
		if (textOpacity <= 0.5)
			textOpacityDirection = true;
	}
	bgStars.forEach((element) => element.update());

}

document.addEventListener('click', (event) => {
	console.log("CLICK");
	if ( gameStatus == 'intro' ){
		show = false;
	}
}, false);

function game(evt){
	clear();
	update();
	draw();
}

function gameLoop(){
	switch (gameStatus){
		case 'intro':
			intro()
			break;
		case 'game':
			game()
			break;
		case 'outro':
			//outro();
			break;
	}
}

let currentIntervalID = setInterval(() => {
	gameLoop();
},1000/60);
