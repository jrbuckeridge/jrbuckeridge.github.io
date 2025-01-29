(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const h of s)if(h.type==="childList")for(const d of h.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function e(s){const h={};return s.integrity&&(h.integrity=s.integrity),s.referrerPolicy&&(h.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?h.credentials="include":s.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function i(s){if(s.ep)return;s.ep=!0;const h=e(s);fetch(s.href,h)}})();class o{constructor(t,e,i,s){this.x=t,this.y=e,this.width=i,this.height=s}scaled(t){return new o(this.x*t,this.y*t,this.width*t,this.height*t)}collidesWith(t){return this.x<t.x+t.width&&this.x+this.width>t.x&&this.y<t.y+t.height&&this.y+this.height>t.y}}class c{constructor(t,e,i){this.width=t,this.height=e,this.scale=i||1}}const S=5,G=10;class y{constructor(t,e,i,s,h,d){this.player=t,this.id=e,this.numFrames=s,this.images=[];for(let f=1;f<=s;f++){const v=new Image,l=String(f).padStart(2,"0");v.src=i+l+".png",this.images.push(v)}this.size=h,this.size.scale=this.size.scale||1,this.resize(t.game.size),this.timeInState=0,this.hitBox=d}reset(){this.timeInState=0}getHitBox(){return this.hitBox}resize(t){this.size.scaledWidth=this.size.width*this.size.scale*this.player.game.ratio.yScale,this.size.scaledHeight=this.size.height*this.size.scale*this.player.game.ratio.yScale}handleControlsInput(t){}}class H extends y{constructor(t){super(t,"idle","img/hero-girl/Golden_Kunoichi_Idle_",8,new c(200,300),new o(50,50,100,225))}handleInput(t){if(!t.released)switch(t.key){case"ArrowUp":this.player.tryJump();break;case"ArrowDown":this.player.tryCrouch();break;case"ArrowRight":this.player.tryRun();break;case" ":this.player.tryAttack();break}}handleControlsInput(t){super.handleControlsInput(t),t.right()&&!t.down()&&this.player.tryRun(),t.up()?this.player.tryJump():t.down()&&this.player.tryCrouch(),t.isAttack()&&this.player.tryAttack()}update(t){this.timeInState+=t*.5,this.player.speedY=0,this.player.speedX>0?this.player.speedX-=S:this.player.x>this.player.initialXPosition&&(this.player.x-=5)}}class E extends y{constructor(t){super(t,"jump","img/hero-girl/Golden_Kunoichi_Jump_",14,new c(250,300),new o(50,50,150,150)),this.allowedTimeInState=2*233.31}handleInput(t){}handleControlsInput(t){super.handleControlsInput(t)}update(t){this.timeInState+=t*.75,this.timeInState<this.allowedTimeInState/2||this.timeInState>=this.allowedTimeInState/2&&this.timeInState<this.allowedTimeInState||(this.player.speedY=0,this.player.tryIdle())}}class C extends y{constructor(t){super(t,"run","img/hero-girl/Golden_Kunoichi_Run_",8,new c(250,300),new o(50,50,150,225))}handleInput(t){if(!t.released){switch(t.key){case"ArrowUp":this.player.tryJump();break;case" ":this.player.tryAttack();break}return}switch(t.key){case"ArrowRight":this.player.tryIdle();break}}handleControlsInput(t){super.handleControlsInput(t),t.right()&&!t.down()&&this.player.tryRun(),t.up()?this.player.tryJump():t.down()&&this.player.tryCrouch(),t.isAttack()&&this.player.tryAttack(),t.idle()&&this.player.tryIdle()}update(t){this.timeInState+=t,this.player.speedY=0,this.player.speedX<G&&(this.player.speedX+=S)}}class B extends y{constructor(t){super(t,"attack","img/hero-girl/Golden_Kunoichi_Attack_",17,new c(500,350),new o(200,50,250,250)),this.sounds=[],["sounds/swish-9.wav","sounds/swish-10.wav"].forEach(i=>{const s=new Audio;s.src=i,this.sounds.push(s)})}reset(){super.reset(),this.sounds[0].play()}handleInput(t){}handleControlsInput(t){super.handleControlsInput(t)}update(t){this.timeInState+=t,this.player.speedX=0,this.player.speedY=0,this.timeInState>=566&&this.player.tryIdle()}}class A extends y{constructor(t){super(t,"hurt","img/hero-girl/Golden_Kunoichi_Hurt_",3,new c(200,300),new o(0,0,0,0)),this.sounds=[],["sounds/blub_hurt.wav"].forEach(i=>{const s=new Audio;s.src=i,this.sounds.push(s)})}reset(){super.reset(),this.sounds[0].play()}handleInput(t){}handleControlsInput(t){super.handleControlsInput(t)}update(t){this.timeInState+=t,this.player.speedX=0,this.player.speedY=0,this.timeInState>=400&&this.player.tryIdle()}}class D extends y{constructor(t){super(t,"faint","img/hero-girl/Golden_Kunoichi_Faint_",14,new c(250,300),new o(0,0,0,0)),this.sounds=[],["sounds/blub_hurt.wav"].forEach(i=>{const s=new Audio;s.src=i,this.sounds.push(s)})}reset(){super.reset(),this.sounds[0].play()}handleInput(t){}handleControlsInput(t){super.handleControlsInput(t)}update(t){this.timeInState+=t*.25,this.player.speedX=0,this.player.speedY=0,this.timeInState>=450&&(this.player.gameOver=!0)}}class M extends y{constructor(t){super(t,"crouch","img/hero-girl/Golden_Kunoichi_Crouch_",2,new c(200,300),new o(50,125,100,100))}handleInput(t){if(t.released)switch(t.key){case"ArrowDown":this.player.tryIdle();break}}handleControlsInput(t){super.handleControlsInput(t),(!t.down()||t.idle())&&this.player.tryIdle()}update(t){this.timeInState+=t*.1,this.player.speedX=0,this.player.speedY=0}}const x=100,V=10;class _{constructor(t){this.game=t,this.states={},this.states.idle=new H(this),this.states.jump=new E(this),this.states.run=new C(this),this.states.attack=new B(this),this.states.crouch=new M(this),this.states.faint=new D(this),this.states.hurt=new A(this),this.state=this.states.idle,this.initialXPosition=this.game.size.width*.25-this.state.size.width/2,this.x=this.initialXPosition,this.y=this.game.size.height-this.state.size.height*this.game.ratio.yScale,this.speedX=0,this.speedY=0,this.life=x,this.gameOver=!1}resize(t){for(let e in this.states)this.states[e].resize(t);this.groundHero()}draw(t,e){const i=Math.floor(this.state.timeInState/33.33)%this.state.images.length;t.drawImage(this.state.images[i],0,0,this.state.size.width,this.state.size.height,this.x,this.y,this.state.size.scaledWidth,this.state.size.scaledHeight)}update(t){if(this.gameOver)return;this.state.update(t),this.x+=this.speedX;const e=this.game.size.width-this.state.size.scaledWidth;this.x>e&&(this.x=e),this.y+=this.speedY+V,this.y<this.game.size.height*.2?this.y=this.game.size.height*.2:this.y>this.game.size.height-this.state.size.scaledHeight&&(this.y=this.game.size.height-this.state.size.scaledHeight)}handleInput(t){this.state.handleInput(t)}handleControlsInput(t){this.state.handleControlsInput(t)}tryJump(){this.setState("jump"),this.speedY=-50}tryIdle(){this.setState("idle"),this.speedX=0}tryRun(){this.setState("run"),this.speedX=10}tryAttack(){this.setState("attack")}tryGetHit(){this.state.id!=="hurt"&&(this.life-=15,this.life<0&&(this.life=0),this.isDefeated()?this.setState("faint"):this.setState("hurt"))}tryCrouch(){this.setState("crouch"),this.speedX=0}isAttacking(){return this.state===this.states.attack}setState(t){this.state=this.states[t],this.state.reset(),this.groundHero()}groundHero(){this.y=this.game.size.height-this.state.size.scaledHeight}getHitBox(){let t=this.state.getHitBox().scaled(this.game.ratio.yScale);return new o(this.x+t.x,this.y+this.speedY+t.y,t.width,t.height)}increaseLife(t){this.life+=t,this.life>x&&(this.life=x)}isDefeated(){return this.life<=0}}class m{constructor(t,e,i){this.image=new Image,this.image.src=t,this.x=0,this.xScale=e,this.width=2048,this.height=1536,this.gameSize=i,this.aspectRatio=this.width/this.height}resize(t,e){this.gameSize=t}computedWidth(){return this.gameSize.height*this.aspectRatio}update(t){this.x-=t*this.xScale,(this.x>=this.width||this.x<=-this.width)&&(this.x=this.x%this.width)}draw(t,e){let i=Math.floor((this.width-this.x)*this.aspectRatio);t.drawImage(this.image,this.x,0,this.width-this.x,this.height,0,0,i,this.gameSize.height),i<this.gameSize.width&&t.drawImage(this.image,0,0,this.width,this.height,i,0,i+Math.floor(this.width*this.aspectRatio),this.gameSize.height)}}class I{constructor(t,e){this.gameWidth=t.width,this.gameHeight=t.height,this.oscillatingFactor=1+Math.random(),this.oscillatingScalePercent=Math.random()*.05,this.yOffsetPercent=Math.random()<.5?75:50,this.states={},this.width=1261,this.height=747,this.scale=.1,this.states.flying=new O(this,"img/villains/"+e+"/skeleton-flying_",10),this.states.defeated=new T(this,"img/villains/"+e+"/skeleton-defeated_",20),this.state=this.states.flying,this.x=this.gameWidth*1.1,this.y=this.gameHeight*.65,this.disabled=!1,this.defeated=!1,this.scoreValue=80+Math.floor(Math.random()*20)}setPosition(t,e){this.x=t,this.y=e}resize(t,e){this.gameWidth=t.width,this.gameHeight=t.height}draw(t,e){if(this.disabled)return;const i=Math.floor(this.state.timeInState/33.33)%this.state.images.length;t.drawImage(this.state.images[i],0,0,this.width,this.height,this.x,this.y,this.width*this.scale,this.height*this.scale)}update(t){this.disabled||this.state.update(t)}tryDefeated(){this.state=this.states.defeated,this.state.reset(),this.defeated=!0}getHitBox(){return new o(this.x+30,this.y,(this.width-500)*this.scale,(this.height-250)*this.scale)}}let L=class{constructor(t,e,i){this.villain=t,this.images=[];for(let s=1;s<=i;s++){const h=new Image;h.src=e+s+".png",this.images.push(h)}this.timeInState=0}reset(){this.timeInState=0}update(t){this.timeInState+=t}};class O extends L{constructor(t,e,i){super(t,e,i)}update(t){super.update(t),this.villain.x-=t*.15;const e=this.villain.oscillatingScalePercent*this.villain.gameHeight/100;this.villain.y=e*Math.sin(this.villain.oscillatingFactor*this.timeInState/100)+this.villain.yOffsetPercent*this.villain.gameHeight/100}}class T extends L{constructor(t,e,i){super(t,e,i)}update(t){super.update(t),this.timeInState>20*33.33&&(this.villain.disabled=!0)}}class b{constructor(t,e,i,s){this.gameWidth=t,this.gameHeight=e,this.states={},this.size=i,this.states.moving=new U(this,s),this.state=this.states.moving,this.x=this.gameWidth*1.1,this.yOffsetPercent=55+(Math.random()-.5)*30,this.y=this.gameHeight*this.yOffsetPercent/100,this.disabled=!1,this.scoreValue=0,this.lifeValue=0}setPosition(t,e){this.x=t,this.y=e}resize(t,e){this.gameWidth=t.width,this.gameHeight=t.height,this.y=this.gameHeight*this.yOffsetPercent/100}draw(t,e){if(this.disabled)return;const i=Math.floor(this.state.timeInState/33.33)%this.state.images.length;t.drawImage(this.state.images[i],0,0,this.size.width,this.size.height,this.x,this.y,this.size.width*this.size.scale,this.size.height*this.size.scale)}update(t){this.disabled||this.state.update(t)}tryCapture(){this.disabled=!0}getHitBox(){return new o(this.x,this.y,this.size.width*this.size.scale,this.size.height*this.size.scale)}}class k extends b{constructor(t){super(t.width,t.height,new c(266,268,.2),{imagePrefix:"img/coins/gold-coins/frame-",numStates:8}),this.scoreValue=20+Math.floor(Math.random()*20),this.lifeValue=15}}class X extends b{constructor(t){super(t.width,t.height,new c(299,297,.15),{imagePrefix:"img/health/red-health/frame-",numStates:6}),this.scoreValue=0,this.lifeValue=15}}class R{constructor(t,e){this.powerUp=t,this.images=[];for(let i=1;i<=e.numStates;i++){const s=new Image;s.src=e.imagePrefix+i+".png",this.images.push(s)}this.timeInState=0}reset(){this.timeInState=0}update(t){this.timeInState+=t}}class U extends R{constructor(t,e){super(t,e)}update(t){super.update(t),this.powerUp.x-=t*.2}}const r=new c(61,75),a=new c(75,61),g=new c(80,80);function p(n){const t=new Image;return t.src=n,t}const W=p("./img/controller/up-dark.png"),K=p("./img/controller/up-transparent.png"),Y=p("./img/controller/down-dark.png"),F=p("./img/controller/down-transparent.png"),$=p("./img/controller/left-dark.png"),J=p("./img/controller/left-transparent.png"),N=p("./img/controller/right-dark.png"),q=p("./img/controller/right-transparent.png"),j=p("./img/controller/attack-dark.png"),Z=p("./img/controller/attack-transparent.png");class Q{constructor(){this.horizontal=0,this.vertical=0,this.attack=!0}right(){return this.horizontal>0}left(){return this.horizontal<0}up(){return this.vertical<0}down(){return this.vertical>0}isAttack(){return this.attack}idle(){return this.horizontal===0&&this.vertical===0&&!this.attack}}class tt{constructor(t,e,i){this.controls=new Q,this.directionsPosition=e,this.actionsPosition=i,this.directionPointerId=void 0,this.attackPointerId=void 0,this.directionHitBoxes=void 0,this.attackHitBox=void 0,this.initControlHitBoxes(),this.keyDownEventListener=s=>{switch(s.key){case"ArrowUp":this.controls.vertical=-1;break;case"ArrowDown":this.controls.vertical=1;break;case"ArrowLeft":this.controls.horizontal=-1;break;case"ArrowRight":this.controls.horizontal=1;break;case" ":this.controls.attack=!0;break}t.handleInput({key:s.key,released:!1})},this.keyUpEventListener=s=>{switch(s.key){case"ArrowUp":this.controls.vertical<0&&(this.controls.vertical=0);break;case"ArrowDown":this.controls.vertical>0&&(this.controls.vertical=0);break;case"ArrowLeft":this.controls.horizontal<0&&(this.controls.horizontal=0);break;case"ArrowRight":this.controls.horizontal>0&&(this.controls.horizontal=0);break;case" ":this.controls.attack=!1;break}t.handleInput({key:s.key,released:!0})},this.touchStartEventListener=s=>{s.preventDefault();for(const h of s.changedTouches){const d=new o(h.pageX-h.radiusX/2,h.pageY-h.radiusY/2,h.radiusX*2,h.radiusY*2);this.directionPointerId===void 0&&(this.directionHitBoxes.up.collidesWith(d)?(this.directionPointerId=h.identifier,this.controls.vertical=-1):this.directionHitBoxes.down.collidesWith(d)&&(this.directionPointerId=h.identifier,this.controls.vertical=1),this.directionHitBoxes.left.collidesWith(d)?(this.directionPointerId=h.identifier,this.controls.horizontal=-1):this.directionHitBoxes.right.collidesWith(d)&&(this.directionPointerId=h.identifier,this.controls.horizontal=1)),this.attackPointerId===void 0&&this.attackHitBox.collidesWith(d)&&(this.attackPointerId=h.identifier,this.controls.attack=!0)}t.handleControlsInput(this.controls)},this.touchEndEventListener=s=>{s.preventDefault();for(const h of s.changedTouches)this.directionPointerId!==void 0&&this.directionPointerId===h.identifier&&(this.directionPointerId=void 0,this.controls.horizontal=0,this.controls.vertical=0),this.attackPointerId!==void 0&&this.attackPointerId===h.identifier&&(this.attackPointerId=void 0,this.controls.attack=!1);t.handleControlsInput(this.controls)},this.touchCancelEventListener=s=>{s.preventDefault();for(const h of s.changedTouches)this.directionPointerId!==void 0&&this.directionPointerId===h.identifier&&(this.directionPointerId=void 0,this.controls.horizontal=0,this.controls.vertical=0),this.attackPointerId!==void 0&&this.attackPointerId===h.identifier&&(this.attackPointerId=void 0,this.controls.attack=!1);t.handleControlsInput(this.controls)}}registerListeners(){window.addEventListener("keydown",this.keyDownEventListener,{passive:!1}),window.addEventListener("keyup",this.keyUpEventListener,{passive:!1}),window.addEventListener("touchstart",this.touchStartEventListener,{passive:!1}),window.addEventListener("touchend",this.touchEndEventListener,{passive:!1}),window.addEventListener("touchcancel",this.touchCancelEventListener,{passive:!1}),window.addEventListener("touchmove",t=>{t.preventDefault()},{passive:!1})}unregisterListeners(){window.removeEventListener("keydown",this.keyDownEventListener),window.removeEventListener("keyup",this.keyUpEventListener),window.removeEventListener("touchstart",this.touchStartEventListener),window.removeEventListener("touchend",this.touchEndEventListener),window.removeEventListener("touchcancel",this.touchCancelEventListener)}initControlHitBoxes(){this.directionHitBoxes={},this.directionHitBoxes.up=new o(this.directionsPosition.x-a.width,this.directionsPosition.y-r.height,a.width*2,r.height*.6),this.directionHitBoxes.down=new o(this.directionsPosition.x-a.width,this.directionsPosition.y+r.height*.4,a.width*2,r.height*.6),this.directionHitBoxes.left=new o(this.directionsPosition.x-a.width,this.directionsPosition.y-r.height,a.width*.6,r.height*2),this.directionHitBoxes.right=new o(this.directionsPosition.x+a.width*.4,this.directionsPosition.y-r.height,a.width*.6,r.height*2),this.attackHitBox=new o(this.actionsPosition.x-g.width,this.actionsPosition.y-g.height/2,g.width,g.height)}resize(t,e){this.directionsPosition.x=Math.floor(t.width*this.directionsPosition.xPercent/100),this.directionsPosition.y=Math.floor(t.height*this.directionsPosition.yPercent/100),this.actionsPosition.x=Math.floor(t.width*this.actionsPosition.xPercent/100),this.actionsPosition.y=Math.floor(t.height*this.actionsPosition.yPercent/100),this.initControlHitBoxes()}draw(t,e){const i=this.controls.vertical<0?K:W,s=this.controls.vertical>0?F:Y,h=this.controls.horizontal<0?J:$,d=this.controls.horizontal>0?q:N,f=this.controls.attack?Z:j;t.drawImage(i,0,0,r.width,r.height,this.directionsPosition.x-r.width/2,this.directionsPosition.y-r.height,r.width,r.height),t.drawImage(s,0,0,r.width,r.height,this.directionsPosition.x-r.width/2,this.directionsPosition.y,r.width,r.height),t.drawImage(h,0,0,a.width,a.height,this.directionsPosition.x-a.width,this.directionsPosition.y-a.height/2,a.width,a.height),t.drawImage(d,0,0,a.width,a.height,this.directionsPosition.x,this.directionsPosition.y-a.height/2,a.width,a.height),t.drawImage(f,0,0,g.width,g.height,this.actionsPosition.x-g.width,this.actionsPosition.y-g.height/2,g.width,g.height)}debugDraw(t,e){t.strokeRect(e.x,e.y,e.width,e.height)}update(){}}class et{constructor(t,e,i,s){this.game=t,this.context=t.context,this.levelDetails=e,this.hero=i,this.goals=s,this.controller=new tt(i,{x:t.size.width*.1,y:t.size.height*.9,xPercent:10,yPercent:90},{x:t.size.width*.9,y:t.size.height*.95,xPercent:95,yPercent:90}),this.controller.registerListeners(),this.backgrounds=[],this.villains=[],this.coins=[],this.powerUps=[],this.targetGoal=s,this.resize(this.game.size,this.game.ratio)}isLevelCompleted(){return this.targetGoal.isAchieved(this.game.score)}start(t){this.targetGoal=this.goals.add(t)}resize(t,e){const i=Math.floor(20*e.xScale);this.context.font=`${i}px Bungee`,this.hero.resize(t,e),this.controller.resize(t,e)}}class it{constructor(t){this.levelNumber=t}}class st extends et{constructor(t,e,i,s){super(t,e,i,s),this.timeSinceDefeated=0,this.gameOverListenersSet=!1,this.renderGoals=!0,this.timeSinceRenderGoals=0,this.renderGoalsKeyListener=l=>{l.preventDefault(),window.fullscreenEnabled||t.canvas.requestFullscreen(),!(this.timeSinceRenderGoals<2e3)&&(this.renderGoals=!1,window.removeEventListener("keypress",this.renderGoalsKeyListener),window.removeEventListener("touchstart",this.renderGoalsTouchListener))},this.renderGoalsTouchListener=l=>{l.preventDefault(),window.fullscreenEnabled||t.canvas.requestFullscreen(),!(this.timeSinceRenderGoals<2e3)&&(this.renderGoals=!1,window.removeEventListener("keypress",this.renderGoalsKeyListener),window.removeEventListener("touchstart",this.renderGoalsTouchListener))},window.addEventListener("keypress",this.renderGoalsKeyListener,{passive:!1}),window.addEventListener("touchstart",this.renderGoalsTouchListener,{passive:!1}),this.backgrounds.push(new m("img/background/nature-landscape/layer-1.png",0,t.size)),this.backgrounds.push(new m("img/background/nature-landscape/layer-2.png",-.05,t.size)),this.backgrounds.push(new m("img/background/nature-landscape/layer-3.png",-.1,t.size)),this.backgrounds.push(new m("img/background/nature-landscape/layer-4.png",-.15,t.size)),this.backgrounds.push(new m("img/background/nature-landscape/layer-5.png",-.25,t.size)),this.backgrounds.push(new m("img/background/nature-landscape/layer-6.png",-.25,t.size)),this.backgrounds.push(new m("img/background/nature-landscape/layer-7.png",-.5,t.size));const h=50,d=["bat01","bat02","bat03"];for(let l=1;l<=h;l++){let w=new I(t.size,d[Math.floor(Math.random()*100%d.length)]);w.setPosition(t.size.width*1.1+this.game.size.width*.5*l+(Math.random()-.5)*50,this.game.size.height/2+(Math.random()-.5)*200),this.villains.push(w)}const f=100;for(let l=1;l<=f;l++){let w=new k(this.game.size);w.setPosition(this.game.size.width*1.1+this.game.size.width*.25*l+(Math.random()-.5)*50,w.y),this.coins.push(w)}const v=Math.floor(h/15);for(let l=1;l<=v;l++){let w=new X(this.game.size);w.setPosition(this.villains[l*15-1].x+(Math.random()-.5)*50,this.game.size.height/2),this.powerUps.push(w)}}resize(t,e){super.resize(t,e);for(let i of this.backgrounds)i.resize(t,e);for(let i of this.villains)i.resize(t,e),i.setPosition(i.x,this.game.size.height*.5);for(let i of this.coins)i.resize(t,e);for(let i of this.powerUps)i.resize(t,e)}renderLevelGoals(t,e){this.timeSinceRenderGoals+=e,this.backgrounds[0].draw(t,e),this.context.save(),this.context.textAlign="center",this.context.fillText(`Level ${this.levelDetails.levelNumber}`,this.game.size.width*.5,this.game.size.height*.3),this.context.fillText(`Collect ${this.goals.coins} coins`,this.game.size.width*.5,this.game.size.height*.4);const i=new k(this.game.size);if(i.setPosition(this.game.size.width*.325,this.game.size.height*.39-36),i.draw(t,0),this.goals.defeatedVillains>0){this.context.fillText(`Defeat ${this.goals.defeatedVillains} villains`,this.game.size.width*.5,this.game.size.height*.5);const s=new I(this.game.size,"bat01");s.setPosition(this.game.size.width*.285,this.game.size.height*.5),s.draw(t,0)}this.timeSinceRenderGoals>1500&&this.context.fillText("Press anywhere to continue...",this.game.size.width*.5,this.game.size.height*.7),this.context.restore()}draw(t,e){if(this.renderGoals){this.renderLevelGoals(t,e);return}for(let i of this.backgrounds)i.draw(this.context,e);for(let i of this.villains)i.draw(this.context,e);for(let i of this.coins)i.draw(this.context,e);for(let i of this.powerUps)i.draw(this.context,e);this.hero.draw(this.context,e),this.controller.draw(t,e)}update(t){if(!this.renderGoals){if(this.isLevelCompleted()){this.game.levelCompleted(this);return}for(let e of this.backgrounds)e.update(t);for(let e of this.villains)e.update(t);for(let e of this.coins)e.update(t);for(let e of this.powerUps)e.update(t);if(this.hero.update(t),this.context.fillText(`Score: ${this.game.score.points}`,this.game.size.width*.025,this.game.size.height*.1),this.context.fillText(`Coins: ${this.game.score.coins}`,this.game.size.width*.025,this.game.size.height*.15),this.context.fillText(`Villains: ${this.game.score.defeatedVillains}`,this.game.size.width*.025,this.game.size.height*.2),this.context.fillText(`Life: ${this.hero.life}`,this.game.size.width*.025,this.game.size.height*.25),this.context.fillText(`Sound: ${this.game.soundOn?"On":"Off"}`,this.game.size.width*.025,this.game.size.height*.3),this.hero.isDefeated())this.timeSinceDefeated+=t;else{for(let e of this.villains){if(e.defeated||e.disabled)continue;const i=this.hero.getHitBox(),s=e.getHitBox();i.collidesWith(s)&&(this.hero.isAttacking()?(e.tryDefeated(),this.game.score.defeatedVillain(e)):this.hero.tryGetHit())}for(let e of this.coins){if(e.disabled||this.hero.isAttacking())continue;const i=this.hero.getHitBox(),s=e.getHitBox();i.collidesWith(s)&&(e.tryCapture(),this.game.score.addPoints(e.scoreValue),this.game.score.addCoins(1))}for(let e of this.powerUps){if(e.disabled||this.hero.isAttacking())continue;const i=this.hero.getHitBox(),s=e.getHitBox();i.collidesWith(s)&&(e.tryCapture(),this.game.score.addPoints(e.scoreValue),this.hero.increaseLife(e.lifeValue))}}this.hero.gameOver&&(this.context.save(),this.game.context.textAlign="center",this.context.fillText("Game Over.",this.game.size.width*.5,this.game.size.height*.4),this.timeSinceDefeated>2e3&&(this.context.fillText("Press anywhere to continue....",this.game.size.width*.5,this.game.size.height*.45),this.gameOverListenersSet||(this.gameOverListenersSet=!0,this.renderGoalsKeyListener=e=>{e.preventDefault(),window.removeEventListener("keypress",this.renderGoalsKeyListener),window.removeEventListener("touchstart",this.renderGoalsTouchListener),this.game.restart()},this.renderGoalsTouchListener=e=>{e.preventDefault(),window.removeEventListener("keypress",this.renderGoalsKeyListener),window.removeEventListener("touchstart",this.renderGoalsTouchListener),this.game.restart()},window.addEventListener("keypress",this.renderGoalsKeyListener,{passive:!1}),window.addEventListener("touchstart",this.renderGoalsTouchListener,{passive:!1}))),this.context.restore())}}}class u{constructor(t,e,i){this.coins=t,this.defeatedVillains=e,this.timeInMillis=i}add(t){return new u(this.coins+t.coins,this.defeatedVillains+t.defeatedVillains,this.timeInMillis)}isAchieved(t){return!(this.coins&&t.coins<this.coins||this.defeatedVillains&&t.defeatedVillains<this.defeatedVillains)}}class ht{constructor(){this.points=0,this.coins=0,this.defeatedVillains=0}addPoints(t){this.points+=t,this.points<0&&(this.points=0)}addCoins(t){this.coins+=t,this.coins<0&&(this.coins=0)}defeatedVillain(t){this.points+=t.scoreValue,this.defeatedVillains++}}const P=new c(1180,820,1);class nt{constructor(t){this.xScale=t.width/P.width,this.yScale=t.height/P.height}}window.onload=function(){new z().start()};class z{constructor(){this.canvas=document.getElementById("canvas"),this.context=this.canvas.getContext("2d"),this.resize(new c(window.innerWidth,window.innerHeight)),this.soundOn=!1,this.currentLevel=void 0,this.score=new ht,this.allGoals=[],this.currentGoalIndex=0,window.addEventListener("resize",t=>{this.resize(new c(t.currentTarget.innerWidth,t.currentTarget.innerHeight))})}resize(t){this.size=t,this.ratio=new nt(t),this.canvas.width=t.width,this.canvas.height=t.height,this.canvas.fontFamily="Bungee",this.currentLevel&&this.currentLevel.resize(this.size,this.ratio)}start(){let t=new Audio("sounds/Fun-Background.mp3");t.loop=!0,window.addEventListener("keypress",i=>{i.key==="s"&&(this.soundOn=!this.soundOn,this.soundOn?t.play():t.pause())}),this.hero=new _(this),this.allGoals.push(new u(10)),this.allGoals.push(new u(20,5)),this.allGoals.push(new u(35,10)),this.allGoals.push(new u(50,20)),this.allGoals.push(new u(60,30)),this.allGoals.push(new u(30,5)),this.allGoals.push(new u(35,10)),this.allGoals.push(new u(50,20)),this.allGoals.push(new u(60,30)),this.currentLevel=this.getCurrentLevel();let e=new Date().getTime();this.gameLoop=(function(){this.context.clearRect(0,0,this.size.width,this.size.height);const i=new Date().getTime(),s=i-e;e=i,this.currentLevel.draw(this.context,s),this.currentLevel.update(s),requestAnimationFrame(this.gameLoop)}).bind(this),this.gameLoop()}getCurrentLevel(){return new st(this,new it(this.currentGoalIndex+1),this.hero,this.allGoals[this.currentGoalIndex])}levelCompleted(t){this.currentGoalIndex++,this.currentLevel=this.getCurrentLevel(),this.currentLevel.start(this.score)}restart(){new z().start()}}
