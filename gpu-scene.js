(() => {
  'use strict';
  const vertex = `
    precision highp float;
    attribute vec3 aPosition;
    attribute vec3 aMeta;
    uniform vec2 uResolution, uCenter;
    uniform float uBase, uRotation, uTilt, uBurst, uProgress, uJourney, uCount, uDpr, uTime;
    varying float vGlyph, vAlpha;
    float ease(float t) { return t*t*(3.0-2.0*t); }
    void main() {
      float spread = 1.0 + uBurst*aMeta.y;
      vec3 v = aPosition*spread;
      float c=cos(uRotation),s=sin(uRotation),ct=cos(uTilt),st=sin(uTilt);
      float x=v.x*c+v.z*s,z=-v.x*s+v.z*c;
      float y=v.y*ct-z*st, depth=v.y*st+z*ct;
      float perspective=5.0/max(.8,5.0+depth);
      vec2 point=uCenter+vec2(x,y)*uBase*perspective;
      float size=clamp(7.8*perspective,6.0,11.0);
      float alpha=clamp((2.9-depth)/4.4,.15,1.0)*.9;
      if(uJourney>.5) {
        float p=uProgress;
        float into=ease(clamp(p/.35,0.0,1.0));
        float phone=ease(clamp((p-.3)/.18,0.0,1.0));
        float index=ease(clamp((p-.64)/.21,0.0,1.0));
        float zoom=1.0+pow(into,3.0)*5.0;
        point=uCenter+vec2(x,y)*uBase*perspective*zoom;
        float pw=uResolution.x<700.0?190.0:260.0,ph=pw*1.5;
        float edge=aMeta.z/uCount*4.0,part=fract(edge);
        vec2 phonePoint;
        if(edge<1.0)phonePoint=vec2(-pw/2.0+part*pw,-ph/2.0);
        else if(edge<2.0)phonePoint=vec2(pw/2.0,-ph/2.0+part*ph);
        else if(edge<3.0)phonePoint=vec2(pw/2.0-part*pw,ph/2.0);
        else phonePoint=vec2(-pw/2.0,ph/2.0-part*ph);
        phonePoint+=vec2(sin(aMeta.z),cos(aMeta.z))*3.0;
        // Gentle idle breathing keeps the phone perimeter alive without moving the UI.
        phonePoint*=1.0+.012*sin(uTime*.8);
        point=mix(point,uCenter+phonePoint,phone);
        float col=mod(aMeta.z,30.0),row=mod(floor(aMeta.z/30.0),45.0);
        float iw=uResolution.x*(uResolution.x<700.0?.73:.43),ih=uResolution.y*.46;
        float edgeId=mod(aMeta.z,24.0), t=fract(aMeta.z/24.0/18.0);
        float ring=floor(edgeId/8.0), a=mod(edgeId,8.0)*.785398;
        float b=a+(ring<1.0?.785398:1.570796);
        vec3 start=vec3(cos(a),sin(a),ring-1.0);
        vec3 end=ring<2.0?vec3(cos(b),sin(b),ring):vec3(cos(b),sin(b),-1.0);
        vec3 graph=mix(start,end,t);
        float gr=uTime*.15, gc=cos(gr),gs=sin(gr);
        vec3 spun=vec3(graph.x*gc+graph.z*gs,graph.y,-graph.x*gs+graph.z*gc);
        float gp=3.0/(3.0+spun.z*.45);
        vec2 indexPoint=uCenter+vec2(spun.x*iw*.42,spun.y*ih*.55)*gp;
        indexPoint+=vec2(sin(aMeta.z),cos(aMeta.z))*.8;
        point=mix(point,indexPoint,index);
        alpha=clamp((3.0-depth)/5.0,.15,1.0)*.8;
        if(index>.6)alpha*=mix(.3,1.0,pow(abs(cos(t*3.14159)),12.0));
        if(phone>.8 && index<.2)alpha*=.35;
        size=mix(clamp(6.5*perspective*zoom,6.0,18.0),6.0,phone);
      }
      gl_Position=vec4(point/uResolution*vec2(2.0,-2.0)+vec2(-1.0,1.0),0.0,1.0);
      gl_PointSize=size*1.5*uDpr;
      vGlyph=aMeta.x;vAlpha=alpha;
    }`;
  const fragment = `
    precision mediump float;
    uniform sampler2D uAtlas;
    uniform float uGlyphCount;
    uniform vec3 uColor;
    varying float vGlyph,vAlpha;
    void main(){
      vec2 uv=vec2((vGlyph+gl_PointCoord.x)/uGlyphCount,(4.0+gl_PointCoord.y)/5.0);
      float alpha=texture2D(uAtlas,uv).a*vAlpha;
      if(alpha<.01)discard;
      gl_FragColor=vec4(uColor*alpha,alpha);
    }`;
  class GlyphScene {
    constructor(overlay) {
      this.overlay=overlay;this.points=[];this.last=null;this.lost=false;
      const surface=document.createElement('canvas');
      surface.className='gpu-surface';surface.setAttribute('aria-hidden','true');
      surface.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
      overlay.before(surface);this.surface=surface;
      const gl=surface.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true,powerPreference:'default'});
      this.gl=gl;
      if(gl){
        try{this.init();}catch(error){console.warn('WebGL unavailable; using Canvas fallback.',error);this.gl=null;surface.remove();}
      }else surface.remove();
      overlay.dataset.renderer=this.gl?'webgl':'canvas-fallback';
      surface.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;overlay.dataset.renderer='context-lost';});
      surface.addEventListener('webglcontextrestored',()=>{try{this.init();this.lost=false;this.upload();overlay.dataset.renderer='webgl';if(this.last)this.render(this.last);}catch(error){console.warn('WebGL recovery failed.',error);}});
    }
    init(){
      const gl=this.gl;
      const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;};
      const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
      const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
      gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
      this.program=program;gl.useProgram(program);this.buffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
      for(const [name,offset]of[['aPosition',0],['aMeta',12]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,24,offset);}
      this.uniforms={};
      for(const name of ['Resolution','Center','Base','Rotation','Tilt','Burst','Progress','Journey','Count','Dpr','Time','GlyphCount','Color','Atlas'])this.uniforms[name]=gl.getUniformLocation(program,'u'+name);
      const texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,RenderKit.atlas(false));
      gl.uniform1i(this.uniforms.Atlas,0);gl.uniform1f(this.uniforms.GlyphCount,RenderKit.glyphs.length);
      gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
    }
    setPoints(points){this.points=points;this.upload();}
    upload(){if(!this.gl||this.lost)return;const data=new Float32Array(this.points.length*6);this.points.forEach((p,i)=>data.set([p.x,p.y,p.z,p.g,p.scatter||0,i],i*6));const gl=this.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);}
    render(options){
      this.last=options;
      if(!this.gl||this.lost){this.fallback(options);return;}
      const gl=this.gl,u=this.uniforms,o=options;
      if(this.surface.width!==this.overlay.width||this.surface.height!==this.overlay.height){this.surface.width=this.overlay.width;this.surface.height=this.overlay.height;}
      gl.viewport(0,0,this.surface.width,this.surface.height);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);
      gl.uniform2f(u.Resolution,o.w,o.h);gl.uniform2f(u.Center,o.cx,o.cy);
      for(const [key,value]of Object.entries({Base:o.base,Rotation:o.rotation,Tilt:o.tilt,Burst:o.burst||0,Progress:o.p||0,Journey:o.journey?1:0,Count:this.points.length,Dpr:this.surface.width/o.w,Time:o.time||0}))gl.uniform1f(u[key],value);
      gl.uniform3f(u.Color,...(o.human?[.57,.263,.153]:[.71,1,.235]));
      gl.drawArrays(gl.POINTS,0,this.points.length);
      if(RenderKit.profile){this.overlay.dataset.sceneTime=(o.time||0).toFixed(3);this.overlay.dataset.rotation=o.rotation.toFixed(4);}
    }
    fallback(o){
      const ctx=this.overlay.getContext('2d'),clamp=(n,a,b)=>Math.min(b,Math.max(a,n)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
      const c=Math.cos(o.rotation),s=Math.sin(o.rotation),ct=Math.cos(o.tilt),st=Math.sin(o.tilt),p=o.p||0;
      const phone=ease(clamp((p-.3)/.18,0,1)),index=ease(clamp((p-.64)/.21,0,1)),zoom=1+Math.pow(ease(clamp(p/.35,0,1)),3)*5;
      this.points.forEach((v,i)=>{
        const spread=1+(o.burst||0)*(v.scatter||0),x=v.x*spread,y=v.y*spread,z=v.z*spread;
        const xx=x*c+z*s,zz=-x*s+z*c,yy=y*ct-zz*st,depth=y*st+zz*ct,pr=5/Math.max(.8,5+depth);
        let px=o.cx+xx*o.base*pr,py=o.cy+yy*o.base*pr,size=clamp(7.8*pr,6,11),alpha=clamp((2.9-depth)/4.4,.15,1)*.9;
        if(o.journey){
          px=o.cx+xx*o.base*pr*zoom;py=o.cy+yy*o.base*pr*zoom;
          const pw=o.w<700?190:260,ph=pw*1.5,edge=i/this.points.length*4,part=edge%1;
          let tx=edge<1?-pw/2+part*pw:edge<2?pw/2:edge<3?pw/2-part*pw:-pw/2,ty=edge<1?-ph/2:edge<2?-ph/2+part*ph:edge<3?ph/2:ph/2-part*ph;
          const breath=1+.012*Math.sin((o.time||0)*.8);tx=(tx+Math.sin(i)*3)*breath;ty=(ty+Math.cos(i)*3)*breath;
          px=mix(px,o.cx+tx,phone);py=mix(py,o.cy+ty,phone);
          const col=i%30,row=Math.floor(i/30)%45,iw=o.w*(o.w<700?.73:.43),ih=o.h*.46;
          const edgeId=i%24,t=(i/24/18)%1,ring=Math.floor(edgeId/8),a=(edgeId%8)*Math.PI/4,b=a+(ring<1?Math.PI/4:Math.PI/2),gx=mix(Math.cos(a),Math.cos(b),t),gy=mix(Math.sin(a),Math.sin(b),t),gz=mix(ring-1,ring<2?ring:-1,t),gr=(o.time||0)*.15,xx=gx*Math.cos(gr)+gz*Math.sin(gr),zz=-gx*Math.sin(gr)+gz*Math.cos(gr),gp=3/(3+zz*.45);px=mix(px,o.cx+xx*iw*.42*gp,index);py=mix(py,o.cy+gy*ih*.55*gp,index);
          alpha=clamp((3-depth)/5,.15,1)*.8*(index>.6&&col%5!==0&&row%7!==0?.16:1);
          if(phone>.8&&index<.2)alpha*=.35;
          size=mix(clamp(6.5*pr*zoom,6,18),6,phone);
        }
        if(px< -30||px>o.w+30||py< -30||py>o.h+30)return;
        RenderKit.glyph(ctx,v.g,px,py,size,alpha,o.human);
      });
    }
  }
  window.GlyphScene=GlyphScene;
})();
