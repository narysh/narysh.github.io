(() => {
  'use strict';
  class OrbitControl {
    constructor(canvas,{change,paused,reset}) {
      this.canvas=canvas;this.change=change;this.paused=paused;this.onReset=reset;
      this.yaw=0;this.tilt=.5;this.vx=0;this.vy=0;this.drag=null;this.lastTap=null;this.resetting=false;
      canvas.addEventListener('pointerdown',e=>this.down(e));
      canvas.addEventListener('pointermove',e=>this.move(e));
      canvas.addEventListener('pointerup',e=>this.up(e));
      canvas.addEventListener('pointercancel',()=>{this.lastTap=null;this.stop();});
      canvas.addEventListener('lostpointercapture',()=>{if(this.drag)this.stop();});
      canvas.addEventListener('dblclick',e=>e.preventDefault());
      canvas.addEventListener('keydown',e=>{
        if(e.key==='Home'){e.preventDefault();this.reset();return;}
        const keys={ArrowLeft:[-.18,0],ArrowRight:[.18,0],ArrowUp:[0,-.14],ArrowDown:[0,.14]};
        if(!keys[e.key])return;e.preventDefault();this.stop();this.resetting=false;
        this.yaw+=keys[e.key][0];this.tilt=Math.max(-1.35,Math.min(1.35,this.tilt+keys[e.key][1]));this.change();
      });
      this.status('idle');
    }
    status(value){if(this.canvas.dataset.orbit!==value)this.canvas.dataset.orbit=value;}
    down(e){
      if(e.isPrimary===false){this.lastTap=null;this.stop();return;}
      if(e.button!==0||this.drag)return;
      this.vx=this.vy=0;this.resetting=false;
      this.drag={id:e.pointerId,type:e.pointerType,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,time:e.timeStamp,startTime:e.timeStamp,moved:false};
      this.canvas.setPointerCapture(e.pointerId);this.canvas.classList.add('is-grabbing');this.status('held');
    }
    move(e){
      const d=this.drag;if(!d||e.pointerId!==d.id)return;
      const totalX=e.clientX-d.startX,totalY=e.clientY-d.startY;
      // Native vertical scrolling and pinch zoom remain available on touchscreens.
      if(d.type==='touch'&&!d.moved&&Math.abs(totalY)>7&&Math.abs(totalY)>Math.abs(totalX)*1.25){this.lastTap=null;this.stop();return;}
      if(!d.moved&&Math.hypot(totalX,totalY)<5)return;
      if(!d.moved){d.moved=true;this.lastTap=null;}
      const dx=e.clientX-d.x,dy=e.clientY-d.y,dt=Math.max(.008,(e.timeStamp-d.time)/1000);
      this.yaw+=dx*.007;this.tilt=Math.max(-1.35,Math.min(1.35,this.tilt+dy*.006));
      this.vx=this.vx*.35+Math.max(-3,Math.min(3,dx*.007/dt))*.65;
      this.vy=this.vy*.35+Math.max(-2,Math.min(2,dy*.006/dt))*.65;
      d.x=e.clientX;d.y=e.clientY;d.time=e.timeStamp;
      this.status('dragging');this.change();
    }
    up(e){
      const d=this.drag;if(!d||e.pointerId!==d.id)return;
      this.drag=null;this.release(d.id);this.canvas.classList.remove('is-grabbing');
      if(d.moved){
        if(this.paused()||e.timeStamp-d.time>90)this.vx=this.vy=0;
        this.status(Math.abs(this.vx)+Math.abs(this.vy)>.01?'inertia':'idle');
      }else{
        this.vx=this.vy=0;this.status('idle');
        if(e.timeStamp-d.startTime>300){this.lastTap=null;return;}
        const last=this.lastTap;
        if(last&&e.timeStamp-last.time<330&&Math.hypot(e.clientX-last.x,e.clientY-last.y)<24){this.lastTap=null;this.reset();}
        else this.lastTap={x:e.clientX,y:e.clientY,time:e.timeStamp};
      }
    }
    release(id){if(this.canvas.hasPointerCapture(id))this.canvas.releasePointerCapture(id);}
    stop(){const d=this.drag;this.drag=null;if(d)this.release(d.id);this.vx=this.vy=0;this.canvas.classList.remove('is-grabbing');this.status('idle');}
    reset(){
      this.stop();this.lastTap=null;this.onReset();
      const wrapped=((this.yaw+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
      this.targetYaw=this.yaw-wrapped;
      this.resetting=!this.paused();
      if(!this.resetting){this.yaw=this.targetYaw;this.tilt=.5;}
      this.status(this.resetting?'resetting':'idle');this.change();
    }
    advance(dt){
      if(dt<=0||this.drag)return;
      if(this.resetting){
        const amount=1-Math.exp(-10*dt);this.yaw+=(this.targetYaw-this.yaw)*amount;this.tilt+=(.5-this.tilt)*amount;
        if(Math.abs(this.targetYaw-this.yaw)+Math.abs(.5-this.tilt)<.001){this.yaw=this.targetYaw;this.tilt=.5;this.resetting=false;this.status('idle');}
        return;
      }
      this.yaw+=(.13+this.vx)*dt;this.tilt=Math.max(-1.35,Math.min(1.35,this.tilt+this.vy*dt));
      const damping=Math.exp(-3.5*dt);this.vx*=damping;this.vy*=damping;
      if(Math.abs(this.vx)+Math.abs(this.vy)<.005){this.vx=this.vy=0;this.status('idle');}
    }
  }
  window.OrbitControl=OrbitControl;
})();
