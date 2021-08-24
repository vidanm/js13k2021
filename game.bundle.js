(function () {
	'use strict';

	let canvasEl,context,callbacks={};function on(t,e){callbacks[t]=callbacks[t]||[],callbacks[t].push(e);}function emit(t,...e){(callbacks[t]||[]).map((t=>t(...e)));}function getCanvas(){return canvasEl}function getContext(){return context}function init(t){if(canvasEl=document.getElementById(t)||t||document.querySelector("canvas"),!canvasEl)throw Error("You must provide a canvas element for the game");return context=canvasEl.getContext("2d"),context.imageSmoothingEnabled=!1,emit("init"),{canvas:canvasEl,context:context}}function rotatePoint(t,e){let i=Math.sin(e),s=Math.cos(e);return {x:t.x*s-t.y*i,y:t.x*i+t.y*s}}function clamp(t,e,i){return Math.min(Math.max(t,i),e)}function getWorldRect(t){let{x:e=0,y:i=0,width:s,height:n}=t.world||t;return t.mapwidth&&(s=t.mapwidth,n=t.mapheight),t.anchor&&(e-=s*t.anchor.x,i-=n*t.anchor.y),s<0&&(e+=s,s*=-1),n<0&&(i+=n,n*=-1),{x:e,y:i,width:s,height:n}}class Vector{constructor(t=0,e=0,i={}){this.x=t,this.y=e,i._c&&(this.clamp(i._a,i._b,i._d,i._e),this.x=t,this.y=e);}add(t){return new Vector(this.x+t.x,this.y+t.y,this)}subtract(t){return new Vector(this.x-t.x,this.y-t.y,this)}scale(t){return new Vector(this.x*t,this.y*t)}normalize(t=this.length()){return new Vector(this.x/t,this.y/t)}dot(t){return this.x*t.x+this.y*t.y}length(){return Math.hypot(this.x,this.y)}distance(t){return Math.hypot(this.x-t.x,this.y-t.y)}angle(t){return Math.acos(this.dot(t)/(this.length()*t.length()))}clamp(t,e,i,s){this._c=!0,this._a=t,this._b=e,this._d=i,this._e=s;}get x(){return this._x}get y(){return this._y}set x(t){this._x=this._c?clamp(this._a,this._d,t):t;}set y(t){this._y=this._c?clamp(this._b,this._e,t):t;}}function factory$1(){return new Vector(...arguments)}factory$1.prototype=Vector.prototype,factory$1.class=Vector;class Updatable{constructor(t){return this.init(t)}init(t={}){this.position=factory$1(),this.velocity=factory$1(),this.acceleration=factory$1(),this.ttl=1/0,Object.assign(this,t);}update(t){this.advance(t);}advance(t){let e=this.acceleration;t&&(e=e.scale(t)),this.velocity=this.velocity.add(e);let i=this.velocity;t&&(i=i.scale(t)),this.position=this.position.add(i),this._pc(),this.ttl--;}get dx(){return this.velocity.x}get dy(){return this.velocity.y}set dx(t){this.velocity.x=t;}set dy(t){this.velocity.y=t;}get ddx(){return this.acceleration.x}get ddy(){return this.acceleration.y}set ddx(t){this.acceleration.x=t;}set ddy(t){this.acceleration.y=t;}isAlive(){return this.ttl>0}_pc(){}}let noop=()=>{};class GameObject extends Updatable{init({width:t=0,height:e=0,context:i=getContext(),render:s=this.draw,update:n=this.advance,children:a=[],anchor:o={x:0,y:0},sx:r=0,sy:h=0,opacity:c=1,rotation:l=0,scaleX:d=1,scaleY:u=1,...p}={}){this.children=[],super.init({width:t,height:e,context:i,anchor:o,sx:r,sy:h,opacity:c,rotation:l,scaleX:d,scaleY:u,...p}),this._di=!0,this._uw(),a.map((t=>this.addChild(t))),this._rf=s,this._uf=n;}update(t){this._uf(t),this.children.map((e=>e.update&&e.update(t)));}render(t){let e=this.context;e.save(),(this.x||this.y)&&e.translate(this.x,this.y),this.rotation&&e.rotate(this.rotation),(this.sx||this.sy)&&e.translate(-this.sx,-this.sy),1==this.scaleX&&1==this.scaleY||e.scale(this.scaleX,this.scaleY);let i=-this.width*this.anchor.x,s=-this.height*this.anchor.y;(i||s)&&e.translate(i,s),this.context.globalAlpha=this.opacity,this._rf(),(i||s)&&e.translate(-i,-s);let n=this.children;t&&(n=n.filter(t)),n.map((t=>t.render&&t.render())),e.restore();}draw(){}_pc(t,e){this._uw(),this.children.map((t=>t._pc()));}get x(){return this.position.x}get y(){return this.position.y}set x(t){this.position.x=t,this._pc();}set y(t){this.position.y=t,this._pc();}get width(){return this._w}set width(t){this._w=t,this._pc();}get height(){return this._h}set height(t){this._h=t,this._pc();}_uw(){if(!this._di)return;let{_wx:t=0,_wy:e=0,_wo:i=1,_wr:s=0,_wsx:n=1,_wsy:a=1}=this.parent||{};this._wx=this.x,this._wy=this.y,this._ww=this.width,this._wh=this.height,this._wo=i*this.opacity,this._wr=s+this.rotation;let{x:o,y:r}=rotatePoint({x:this.x,y:this.y},s);this._wx=o,this._wy=r,this._wsx=n*this.scaleX,this._wsy=a*this.scaleY,this._wx=this.x*n,this._wy=this.y*a,this._ww=this.width*this._wsx,this._wh=this.height*this._wsy,this._wx+=t,this._wy+=e;}get world(){return {x:this._wx,y:this._wy,width:this._ww,height:this._wh,opacity:this._wo,rotation:this._wr,scaleX:this._wsx,scaleY:this._wsy}}addChild(t,{absolute:e=!1}={}){this.children.push(t),t.parent=this,t._pc=t._pc||noop,t._pc();}removeChild(t){let e=this.children.indexOf(t);-1!==e&&(this.children.splice(e,1),t.parent=null,t._pc());}get opacity(){return this._opa}set opacity(t){this._opa=t,this._pc();}get rotation(){return this._rot}set rotation(t){this._rot=t,this._pc();}setScale(t,e=t){this.scaleX=t,this.scaleY=e;}get scaleX(){return this._scx}set scaleX(t){this._scx=t,this._pc();}get scaleY(){return this._scy}set scaleY(t){this._scy=t,this._pc();}}function factory$2(){return new GameObject(...arguments)}factory$2.prototype=GameObject.prototype,factory$2.class=GameObject;class Sprite extends factory$2.class{init({image:t,width:e=(t?t.width:void 0),height:i=(t?t.height:void 0),...s}={}){super.init({image:t,width:e,height:i,...s});}get animations(){return this._a}set animations(t){let e,i;for(e in this._a={},t)this._a[e]=t[e].clone(),i=i||this._a[e];this.currentAnimation=i,this.width=this.width||i.width,this.height=this.height||i.height;}playAnimation(t){this.currentAnimation=this.animations[t],this.currentAnimation.loop||this.currentAnimation.reset();}advance(t){super.advance(t),this.currentAnimation&&this.currentAnimation.update(t);}draw(){this.image&&this.context.drawImage(this.image,0,0,this.image.width,this.image.height),this.currentAnimation&&this.currentAnimation.render({x:0,y:0,width:this.width,height:this.height,context:this.context}),this.color&&(this.context.fillStyle=this.color,this.context.fillRect(0,0,this.width,this.height));}}function factory$3(){return new Sprite(...arguments)}factory$3.prototype=Sprite.prototype,factory$3.class=Sprite;let pointers=new WeakMap,callbacks$1={},pressedButtons={},buttonMap={0:"left",1:"middle",2:"right"};function getPointer(t=getCanvas()){return pointers.get(t)}function circleRectCollision(t,e){let{x:i,y:s,width:n,height:a}=getWorldRect(t);do{i-=t.sx||0,s-=t.sy||0;}while(t=t.parent);let o=e.x-Math.max(i,Math.min(e.x,i+n)),r=e.y-Math.max(s,Math.min(e.y,s+a));return o*o+r*r<e.radius*e.radius}function getCurrentObject(t){let e=t._lf.length?t._lf:t._cf;for(let i=e.length-1;i>=0;i--){let s=e[i];if(s.collidesWithPointer?s.collidesWithPointer(t):circleRectCollision(s,t))return s}}function getPropValue(t,e){return parseFloat(t.getPropertyValue(e))||0}function getCanvasOffset(t){let{canvas:e,_s:i}=t,s=e.getBoundingClientRect(),n="none"!==i.transform?i.transform.replace("matrix(","").split(","):[1,1,1,1],a=parseFloat(n[0]),o=parseFloat(n[3]),r=(getPropValue(i,"border-left-width")+getPropValue(i,"border-right-width"))*a,h=(getPropValue(i,"border-top-width")+getPropValue(i,"border-bottom-width"))*o,c=(getPropValue(i,"padding-left")+getPropValue(i,"padding-right"))*a,l=(getPropValue(i,"padding-top")+getPropValue(i,"padding-bottom"))*o;return {scaleX:(s.width-r-c)/e.width,scaleY:(s.height-h-l)/e.height,offsetX:s.left+(getPropValue(i,"border-left-width")+getPropValue(i,"padding-left"))*a,offsetY:s.top+(getPropValue(i,"border-top-width")+getPropValue(i,"padding-top"))*o}}function pointerDownHandler(t){let e=void 0!==t.button?buttonMap[t.button]:"left";pressedButtons[e]=!0,pointerHandler(t,"onDown");}function pointerUpHandler(t){let e=void 0!==t.button?buttonMap[t.button]:"left";pressedButtons[e]=!1,pointerHandler(t,"onUp");}function mouseMoveHandler(t){pointerHandler(t,"onOver");}function blurEventHandler(t){pointers.get(t.target)._oo=null,pressedButtons={};}function pointerHandler(t,e){t.preventDefault();let i=t.target,s=pointers.get(i),{scaleX:n,scaleY:a,offsetX:o,offsetY:r}=getCanvasOffset(s);if(-1!==["touchstart","touchmove","touchend"].indexOf(t.type)){s.touches={};for(var h=0;h<t.touches.length;h++)s.touches[t.touches[h].identifier]={id:t.touches[h].identifier,x:(t.touches[h].clientX-o)/n,y:(t.touches[h].clientY-r)/a,changed:!1};for(h=t.changedTouches.length;h--;){const i=t.changedTouches[h].identifier;void 0!==s.touches[i]&&(s.touches[i].changed=!0);let c=t.changedTouches[h].clientX,l=t.changedTouches[h].clientY;s.x=(c-o)/n,s.y=(l-r)/a;let d=getCurrentObject(s);d&&d[e]&&d[e](t),callbacks$1[e]&&callbacks$1[e](t,d);}}else {s.x=(t.clientX-o)/n,s.y=(t.clientY-r)/a;let i=getCurrentObject(s);i&&i[e]&&i[e](t),callbacks$1[e]&&callbacks$1[e](t,i),"onOver"==e&&(i!=s._oo&&s._oo&&s._oo.onOut&&s._oo.onOut(t),s._oo=i);}}function initPointer({radius:t=5,canvas:e=getCanvas()}={}){let i=pointers.get(e);if(!i){let s=window.getComputedStyle(e);i={x:0,y:0,radius:t,touches:{},canvas:e,_cf:[],_lf:[],_o:[],_oo:null,_s:s},pointers.set(e,i);}return e.addEventListener("mousedown",pointerDownHandler),e.addEventListener("touchstart",pointerDownHandler),e.addEventListener("mouseup",pointerUpHandler),e.addEventListener("touchend",pointerUpHandler),e.addEventListener("touchcancel",pointerUpHandler),e.addEventListener("blur",blurEventHandler),e.addEventListener("mousemove",mouseMoveHandler),e.addEventListener("touchmove",mouseMoveHandler),i._t||(i._t=!0,on("tick",(()=>{i._lf.length=0,i._cf.map((t=>{i._lf.push(t);})),i._cf.length=0;}))),i}function clear(t){let e=t.canvas;t.clearRect(0,0,e.width,e.height);}function GameLoop({fps:t=60,clearCanvas:e=!0,update:i=noop,render:s,context:n=getContext(),blur:a=!1}={}){if(!s)throw Error("You must provide a render() function");let o,r,h,c,l,d=0,u=1e3/t,p=1/t,f=e?clear:noop,g=!0;function _(){if(r=requestAnimationFrame(_),g&&(h=performance.now(),c=h-o,o=h,!(c>1e3))){for(emit("tick"),d+=c;d>=u;)l.update(p),d-=u;f(n),l.render();}}return a||(window.addEventListener("focus",(()=>{g=!0;})),window.addEventListener("blur",(()=>{g=!1;}))),l={update:i,render:s,isStopped:!0,start(){o=performance.now(),this.isStopped=!1,requestAnimationFrame(_);},stop(){this.isStopped=!0,cancelAnimationFrame(r);},_frame:_,set _last(t){o=t;}},l}

	// Imports

	// Initialisation des variables
	init();

	initPointer();

	let stars = []; //Points d'accroches

	let line = factory$3({
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
		let sprite = factory$3({
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

	let background = factory$3({
		x: 0,
		y: 0,
		width: 500,
		height: 700,
		color: 'black'
	});



	let loop = GameLoop({
		update: function() {
			stars.forEach(function(item) {
				item.update();
			});
			line.update();
		},

		render: function() {
			background.render();
			line.render();
			stars.forEach(function(item) {
				item.render();
			});
		}
	});

	loop.start();

}());
