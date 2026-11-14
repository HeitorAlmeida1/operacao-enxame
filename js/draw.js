/* ---------- Desenho ---------- */
function circle(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()}
function ring(x,y,r,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke()}
function poly(pts,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.closePath();ctx.fill()}
function withCtx(c,fn){const o=ctx;ctx=c;try{fn()}finally{ctx=o}}
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function srand(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const shadeCache=new Map();
function shade(hex,k){const key=hex+k;let v=shadeCache.get(key);if(v)return v;const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
  if(k>0){r+=(255-r)*k;g+=(255-g)*k;b+=(255-b)*k}else{r*=1+k;g*=1+k;b*=1+k}v='rgb('+(r|0)+','+(g|0)+','+(b|0)+')';shadeCache.set(key,v);return v}
function shadow(x,y,rx,ry){ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill()}
function glowDot(x,y,r,c,a){ctx.globalAlpha=a;circle(x,y,r,c);ctx.globalAlpha=1}

/* cenário em blocos gerados e guardados */
const CH=512,chunkCache=new Map();
function getChunk(map,cx,cy){const k=map+':'+cx+','+cy;let c=chunkCache.get(k);if(c){chunkCache.delete(k);chunkCache.set(k,c);return c}
  c=mkCanvas(CH,CH);withCtx(c.getContext('2d'),()=>paintChunk(map,cx,cy));chunkCache.set(k,c);
  if(chunkCache.size>48)chunkCache.delete(chunkCache.keys().next().value);return c}
function paintChunk(map,cx,cy){const M=MAPS[map],R=srand((cx*73856093)^(cy*19349663)^(map.charCodeAt(0)*83492791));
  ctx.fillStyle=M.bg;ctx.fillRect(0,0,CH,CH);
  for(let i=0;i<90;i++){ctx.globalAlpha=0.2+R()*0.35;ctx.fillStyle=M.grid;const s=1+R()*3;ctx.fillRect(R()*CH,R()*CH,s,s)}ctx.globalAlpha=1;
  if(map==='distrito'){
    ctx.fillStyle='#0f1328';ctx.fillRect(0,0,CH,72);ctx.fillRect(0,0,72,CH);
    ctx.strokeStyle='#1d2446';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(72,72);ctx.lineTo(CH,72);ctx.moveTo(72,72);ctx.lineTo(72,CH);ctx.stroke();
    ctx.strokeStyle='#4a4426';ctx.lineWidth=3;ctx.setLineDash([22,18]);ctx.beginPath();ctx.moveTo(0,36);ctx.lineTo(CH,36);ctx.moveTo(36,0);ctx.lineTo(36,CH);ctx.stroke();ctx.setLineDash([]);
    for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=100+i*205+R()*14,y=100+j*205+R()*14,w=150+R()*30,h=150+R()*30;
      if(R()<0.28){for(let k=0;k<4;k++){const bx=x+R()*(w-30),by=y+R()*(h-30),s=18+R()*12;ctx.fillStyle='#2a2136';ctx.fillRect(bx,by,s,s);ctx.strokeStyle='#3e3150';ctx.lineWidth=2;ctx.strokeRect(bx,by,s,s);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+s,by+s);ctx.stroke()}continue}
      ctx.fillStyle='#070912';ctx.fillRect(x+10,y+10,w,h);
      ctx.fillStyle='#141a33';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#232c52';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);
      ctx.strokeStyle='#1a2142';ctx.lineWidth=1;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(x+k*w/4,y);ctx.lineTo(x+k*w/4,y+h);ctx.stroke()}
      for(let k=0;k<3;k++){ctx.fillStyle='#1e2647';const ax=x+10+R()*(w-40),ay=y+10+R()*(h-40);ctx.fillRect(ax,ay,20+R()*12,14+R()*10);circle(ax+8,ay+7,4,'#28325c')}
      if(R()<0.7){const nc=['#4fe3d6','#ff5fa2','#ffcc4d','#9b7bff'][Math.floor(R()*4)];ctx.globalAlpha=0.6;ctx.fillStyle=nc;ctx.fillRect(x+8,y+h-9,w-16,3);ctx.globalAlpha=0.12;ctx.fillRect(x-6,y+h,w+12,18);ctx.globalAlpha=1}}
    const g=ctx.createRadialGradient(76,76,0,76,76,110);g.addColorStop(0,'rgba(255,204,77,.14)');g.addColorStop(1,'rgba(255,204,77,0)');ctx.fillStyle=g;ctx.fillRect(0,0,200,200);circle(76,76,4,'#ffd98a');
  }else if(map==='periferia'){
    ctx.strokeStyle='#24161f';ctx.lineWidth=2;for(let i=0;i<7;i++){let x=R()*CH,y=R()*CH;ctx.beginPath();ctx.moveTo(x,y);for(let k=0;k<5;k++){x+=rnd(-40,40);y+=rnd(-40,40);ctx.lineTo(x,y)}ctx.stroke()}
    for(let i=0;i<5;i++){const x=R()*CH,y=R()*CH,s=14+R()*26,pts=[];for(let k=0;k<7;k++){const a=k*TAU/7,rr=s*(0.7+R()*0.4);pts.push(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}
      ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x+5,y+s*0.6,s,s*0.4,0,0,TAU);ctx.fill();poly(pts,'#2a2131');ctx.globalAlpha=0.5;circle(x-s*0.25,y-s*0.3,s*0.3,'#3b2e45');ctx.globalAlpha=1}
    ctx.strokeStyle='#3a2b23';ctx.lineWidth=2;for(let i=0;i<4;i++){const x=R()*CH,y=R()*CH;for(let k=0;k<6;k++){const a=-Math.PI/2+(k-2.5)*0.35;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*14,y+Math.sin(a)*14);ctx.stroke()}}
    for(let i=0;i<3;i++){const x=R()*CH,y=R()*CH;ctx.save();ctx.translate(x,y);ctx.rotate(R()*TAU);ctx.fillStyle='#3a3340';ctx.fillRect(-22,-5,44,10);ctx.fillStyle='#55324a';ctx.fillRect(-8,-8,10,16);ctx.restore()}
  }else if(map==='lab'){
    ctx.strokeStyle='#12252b';ctx.lineWidth=2;for(let i=0;i<=CH;i+=64){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,CH);ctx.moveTo(0,i);ctx.lineTo(CH,i);ctx.stroke()}
    ctx.strokeStyle='#0a181c';ctx.lineWidth=1;for(let i=0;i<=CH;i+=64){ctx.beginPath();ctx.moveTo(i+2,0);ctx.lineTo(i+2,CH);ctx.moveTo(0,i+2);ctx.lineTo(CH,i+2);ctx.stroke()}
    for(let i=0;i<8;i++){const x=Math.floor(R()*8)*64,y=Math.floor(R()*8)*64;ctx.fillStyle=R()<0.5?'#0f1d22':'#0c171b';ctx.fillRect(x+4,y+4,56,56);circle(x+10,y+10,2,'#1d3a42');circle(x+54,y+54,2,'#1d3a42')}
    if(R()<0.6){const x=Math.floor(R()*7)*64,y=Math.floor(R()*7)*64;ctx.save();ctx.beginPath();ctx.rect(x,y,128,24);ctx.clip();for(let k=-2;k<12;k++){ctx.fillStyle=k%2?'#2a2610':'#121414';ctx.beginPath();ctx.moveTo(x+k*16,y+24);ctx.lineTo(x+k*16+16,y);ctx.lineTo(x+k*16+32,y);ctx.lineTo(x+k*16+16,y+24);ctx.fill()}ctx.restore()}
    const py=Math.floor(R()*7)*64+32;ctx.strokeStyle='#18414a';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(CH,py);ctx.stroke();ctx.strokeStyle='#2a6670';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,py-3);ctx.lineTo(CH,py-3);ctx.stroke();
    for(let k=0;k<CH;k+=128){ctx.fillStyle='#22525b';ctx.fillRect(k+40,py-8,10,16)}
    for(let i=0;i<2;i++){if(R()<0.5)continue;const x=60+R()*(CH-120),y=60+R()*(CH-120);const g=ctx.createRadialGradient(x,y,0,x,y,60);g.addColorStop(0,'rgba(79,227,214,.18)');g.addColorStop(1,'rgba(79,227,214,0)');ctx.fillStyle=g;ctx.fillRect(x-60,y-60,120,120);
      circle(x,y,22,'#0e2a2e');ring(x,y,22,'#2a6670',3);ctx.globalAlpha=0.6;circle(x,y,15,'#4fe3d6');ctx.globalAlpha=1;circle(x-5,y-5,3,'#c9fff8')}
  }else{
    ctx.strokeStyle='#202640';ctx.lineWidth=2;for(let i=0;i<6;i++){const y=R()*CH;ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<=CH;x+=32)ctx.lineTo(x,y+Math.sin(x*0.02+i)*10);ctx.stroke()}
    for(let i=0;i<4;i++){const x=R()*CH,y=R()*CH,s=10+R()*22;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x+4,y+s*0.5,s,s*0.35,0,0,TAU);ctx.fill();ctx.fillStyle='#262a40';ctx.beginPath();ctx.ellipse(x,y,s,s*0.7,R(),0,TAU);ctx.fill()}
    for(let i=0;i<14;i++){const x=R()*CH,y=R()*CH;circle(x,y,1.5+R()*2,R()<0.5?'#d8c7a8':'#ff9fb8')}
    if(R()<0.5){const x=R()*CH,y=R()*CH;ctx.fillStyle='rgba(60,120,220,.22)';ctx.beginPath();ctx.ellipse(x,y,40,22,R(),0,TAU);ctx.fill();ctx.strokeStyle='rgba(150,200,255,.25)';ctx.lineWidth=1.5;ctx.stroke()}
    for(let i=0;i<3;i++){const x=R()*CH,y=R()*CH;ctx.strokeStyle='#1f5040';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+10,y-15,x+4,y-28);ctx.moveTo(x,y);ctx.quadraticCurveTo(x-12,y-12,x-10,y-24);ctx.stroke()}
  }
}

/* lutadores */
function drawFighter(id,x,y,t,mv,face,aa,s,k){s=s||1;k=k||0;const dirK=['vex','rivka','tora','rhea','kaze'].includes(id)?1:-1;x+=Math.cos(aa)*k*5*dirK;y+=Math.sin(aa)*k*5*dirK;const f=FIGHTERS[id],c=f.c,r=14*s,bob=mv?Math.sin(t*14)*1.6*s:Math.sin(t*3)*0.8*s,y0=y+bob,back=face+Math.PI;
  shadow(x,y+r*0.95,r*0.95,r*0.36);ctx.lineCap='round';
  if(id==='kira'){const w=Math.sin(t*8)*0.5;ctx.strokeStyle=shade(c,-0.15);ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(x+Math.cos(back)*r*0.7,y0+Math.sin(back)*r*0.7);
    ctx.quadraticCurveTo(x+Math.cos(back+w)*r*1.8,y0+Math.sin(back+w)*r*1.8-6*s,x+Math.cos(back-w)*r*2.2,y0+Math.sin(back-w)*r*2.2-10*s);ctx.stroke()}
  if(id==='lumen'||id==='pluma'){const fl=Math.sin(t*(mv?16:5))*0.35;for(const sd of[-1,1]){ctx.save();ctx.translate(x+sd*r*0.6,y0-2*s);ctx.scale(sd,1);ctx.rotate(-0.3+fl);
      if(id==='lumen'){ctx.fillStyle='#ffe3f0';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(r*1.4,-r*1.2,r*1.9,-r*0.2);ctx.quadraticCurveTo(r*1.2,r*0.1,r*1.5,r*0.5);ctx.quadraticCurveTo(r*0.8,r*0.4,0,r*0.4);ctx.fill();ctx.strokeStyle='#ffb3d6';ctx.lineWidth=1;ctx.stroke()}
      else{ctx.fillStyle='#6a2160';ctx.beginPath();ctx.moveTo(0,-r*0.2);ctx.lineTo(r*1.9,-r*0.9);ctx.quadraticCurveTo(r*1.6,-r*0.1,r*1.9,r*0.3);ctx.quadraticCurveTo(r*1.3,0,r*1.2,r*0.5);ctx.quadraticCurveTo(r*0.7,r*0.2,0,r*0.5);ctx.fill();ctx.strokeStyle='#ff7ad9';ctx.lineWidth=1;ctx.stroke()}
      ctx.restore()}}
  if(id==='rhea')for(let i=0;i<14;i++){const a=i*TAU/14+t*0.3;poly([x+Math.cos(a-0.2)*r*0.85,y0+Math.sin(a-0.2)*r*0.85,x+Math.cos(a)*r*1.45,y0+Math.sin(a)*r*1.45,x+Math.cos(a+0.2)*r*0.85,y0+Math.sin(a+0.2)*r*0.85],i%2?'#b88a33':'#ffcc4d')}
  if(id==='vex')for(let i=0;i<7;i++){const a=back+(i-3)*0.32,L=r*(1.55+0.15*Math.sin(t*10+i));poly([x+Math.cos(a-0.16)*r*0.8,y0+Math.sin(a-0.16)*r*0.8,x+Math.cos(a)*L,y0+Math.sin(a)*L,x+Math.cos(a+0.16)*r*0.8,y0+Math.sin(a+0.16)*r*0.8],'#7a1020')}
  if(id==='kaze'){ctx.strokeStyle='#4fa3ff';ctx.lineWidth=3.5*s;for(const off of[-0.25,0.25]){const wv=Math.sin(t*10+off*8)*6*s;ctx.beginPath();ctx.moveTo(x+Math.cos(back)*r*0.6,y0+Math.sin(back)*r*0.6);
      ctx.quadraticCurveTo(x+Math.cos(back+off)*r*1.6+wv,y0+Math.sin(back+off)*r*1.6,x+Math.cos(back+off*1.5)*r*2.4,y0+Math.sin(back+off*1.5)*r*2.4+wv);ctx.stroke()}}
  const g=ctx.createRadialGradient(x-r*0.35,y0-r*0.4,r*0.1,x,y0,r);g.addColorStop(0,shade(c,0.5));g.addColorStop(1,shade(c,-0.3));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y0,r,0,TAU);ctx.fill();
  ring(x,y0,r,shade(c,-0.55),1.5*s);
  ctx.fillStyle='rgba(10,12,24,.5)';ctx.beginPath();ctx.arc(x,y0,r*0.97,0.18*Math.PI,0.82*Math.PI);ctx.fill();
  if(id==='kira')for(const sd of[-1,1]){poly([x+sd*r*0.2,y0-r*0.82,x+sd*r*0.85,y0-r*1.55,x+sd*r*0.92,y0-r*0.45],shade(c,-0.1));poly([x+sd*r*0.38,y0-r*0.8,x+sd*r*0.78,y0-r*1.28,x+sd*r*0.8,y0-r*0.62],'#ff7ab0')}
  if(id==='lumen'){ctx.strokeStyle='#ffe066';ctx.lineWidth=2*s;ctx.beginPath();ctx.ellipse(x,y0-r*1.25,r*0.6,r*0.2,0,0,TAU);ctx.stroke()}
  if(id==='pluma')for(const sd of[-1,1])poly([x+sd*r*0.25,y0-r*0.85,x+sd*r*0.5,y0-r*1.4,x+sd*r*0.72,y0-r*0.7],'#5a1a50');
  if(id==='kaze'){ctx.fillStyle='#e8f4ff';ctx.fillRect(x-r*0.9,y0-r*0.45,r*1.8,r*0.22)}
  if(id==='lebre'||id==='rivka')for(const sd of[-1,1]){ctx.save();ctx.translate(x+sd*r*0.35,y0-r*0.75);ctx.rotate(sd*0.28+Math.sin(t*4+sd)*0.08);ctx.fillStyle=shade(c,-0.05);ctx.beginPath();ctx.ellipse(0,-r*0.6,r*0.22,r*0.72,0,0,TAU);ctx.fill();ctx.fillStyle=id==='lebre'?'#efe8ff':'#ffe0f1';ctx.beginPath();ctx.ellipse(0,-r*0.6,r*0.1,r*0.5,0,0,TAU);ctx.fill();ctx.restore()}
  if(id==='tora')for(const sd of[-1,1]){circle(x+sd*r*0.64,y0-r*0.72,r*0.33,shade(c,-0.25));circle(x+sd*r*0.64,y0-r*0.72,r*0.15,'#b8ffe0')}
  if(id==='lebre')glowDot(x,y0-r*1.2,r*0.35,'#e0d4ff',0.35+0.2*Math.sin(t*5));
  const ex=Math.cos(aa)*r*0.35,ey=Math.sin(aa)*r*0.3,eyeC=id==='vex'?'#ff3b3b':'#ffffff';
  for(const sd of[-1,1]){const px=-Math.sin(aa)*sd*r*0.28,py=Math.cos(aa)*sd*r*0.28;circle(x+ex+px,y0+ey+py-r*0.1,r*0.17,'#0b0d18');circle(x+ex+px+Math.cos(aa)*r*0.05,y0+ey+py-r*0.12,r*0.08,eyeC)}
  if(id==='rhea'){ctx.save();ctx.translate(x+Math.cos(aa)*r*1.1,y0+Math.sin(aa)*r*1.1);ctx.rotate(aa);ctx.fillStyle='#e0c27a';ctx.beginPath();ctx.ellipse(0,0,r*0.35,r*0.78,0,0,TAU);ctx.fill();ctx.strokeStyle='#8a6a2a';ctx.lineWidth=1.5;ctx.stroke();circle(0,0,r*0.2,'#ffcc4d');ctx.restore()}
  if(id==='kaze'){const sa=aa+0.9;ctx.strokeStyle='#e8f4ff';ctx.lineWidth=2.5*s;ctx.beginPath();ctx.moveTo(x+Math.cos(sa)*r*0.8,y0+Math.sin(sa)*r*0.8);ctx.lineTo(x+Math.cos(sa)*r*0.8+Math.cos(aa)*r*1.5,y0+Math.sin(sa)*r*0.8+Math.sin(aa)*r*1.5);ctx.stroke()}
  if(id==='vex'){ctx.strokeStyle='#ffd0d6';ctx.lineWidth=2*s;for(let k=-1;k<=1;k++){const a=aa+k*0.28;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r*1.0,y0+Math.sin(a)*r*1.0);ctx.lineTo(x+Math.cos(a)*r*1.5,y0+Math.sin(a)*r*1.5);ctx.stroke()}}
  if(id==='tora'){const ix=x+Math.cos(aa)*r*1.2,iy=y0+Math.sin(aa)*r*1.2;circle(ix,iy,r*0.38,'#1f6b52');circle(ix,iy,r*0.2,'#7affc8');glowDot(ix,iy,r*0.5,'#7affc8',0.25)}
  if(id==='rivka'){ctx.save();ctx.translate(x+Math.cos(aa+0.8)*r*0.8,y0+Math.sin(aa+0.8)*r*0.8);ctx.rotate(aa-0.25+k*0.6);ctx.fillStyle='#d9e6ff';ctx.fillRect(0,-3.5*s,r*1.8,7*s);ctx.fillStyle='#7ae0ff';ctx.fillRect(r*0.3,-1.5*s,r*1.4,3*s);ctx.fillStyle='#5a3a6a';ctx.fillRect(-r*0.3,-2.5*s,r*0.35,5*s);ctx.restore()}
  if(id==='lebre'){const hx=x+Math.cos(aa)*r*1.05,hy=y0+Math.sin(aa)*r*1.05;glowDot(hx,hy,r*0.45,'#b8a4ff',0.35+0.35*k);circle(hx,hy,r*0.18,'#ffffff')}
  if(id==='kira'||id==='lumen'){ctx.save();ctx.translate(x+Math.cos(aa)*r*0.95,y0+Math.sin(aa)*r*0.95);ctx.rotate(aa);if(id==='kira'){ctx.fillStyle='#2a3350';ctx.fillRect(0,-3*s,r*0.9,6*s);ctx.fillStyle=c;ctx.fillRect(r*0.6,-2*s,r*0.35,4*s)}else{ctx.fillStyle='#ffe066';ctx.fillRect(0,-1.5*s,r*0.5,3*s);circle(r*0.6,0,r*0.22,'#ff5fa2')}ctx.restore()}
  ctx.lineCap='butt';
}

/* inimigos */
function drawEnemy(e,t){const c=e.c,r=e.r,a=Math.atan2(P.y-e.y,P.x-e.x),ty=e.type,ph=t*10+(e.x+e.y)*0.01;
  if(r>12)shadow(e.x,e.y+r*0.85,r*0.9,r*0.3);
  if(e.elite)glowDot(e.x,e.y,r*1.5,'#ffcc4d',0.22+0.12*Math.sin(t*6));
  if(e.miniboss)glowDot(e.x,e.y,r*1.4,'#ff5fa2',0.25);
  const dark=shade(c,-0.45),light=shade(c,0.35),light_=light;
  if(ty==='sombra'){ctx.globalAlpha=0.55+0.3*Math.sin(t*9+e.x);circle(e.x,e.y,r*1.15,shade(c,-0.5));circle(e.x,e.y,r,c);ctx.globalAlpha=1;for(let k=0;k<4;k++){const an=a+Math.PI+(k-1.5)*0.5;poly([e.x+Math.cos(an-0.2)*r*0.7,e.y+Math.sin(an-0.2)*r*0.7,e.x+Math.cos(an)*r*1.7,e.y+Math.sin(an)*r*1.7,e.x+Math.cos(an+0.2)*r*0.7,e.y+Math.sin(an+0.2)*r*0.7],shade(c,-0.35))}}
  else if(ty==='bomba'){circle(e.x,e.y,r,c);circle(e.x-r*0.3,e.y-r*0.3,r*0.35,light_);ctx.strokeStyle='#3a2a1a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.x,e.y-r);ctx.quadraticCurveTo(e.x+5,e.y-r-6,e.x+2,e.y-r-10);ctx.stroke();glowDot(e.x+2,e.y-r-10,3+Math.random()*2,'#ffe066',0.9)}
  else if(ty==='blindado'){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(a);ctx.fillStyle=dark;ctx.fillRect(-r,-r,r*2,r*2);ctx.fillStyle=c;ctx.fillRect(-r*0.85,-r*0.85,r*1.7,r*1.7);ctx.fillStyle=light_;ctx.fillRect(r*0.4,-r*0.9,r*0.6,r*1.8);for(const yy of[-0.5,0,0.5])circle(-r*0.4,yy*r,r*0.12,dark);ctx.restore()}
  else if(ty==='saltador'){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(a);if(e.lt>0){ctx.globalAlpha=0.35;poly([-r,0,-r*2.6,r*0.6,-r*2.6,-r*0.6],c);ctx.globalAlpha=1}poly([r*1.3,0,r*0.2,r*0.95,-r*1.1,r*0.4,-r*1.5,r*0.9,-r*1.2,0,-r*1.5,-r*0.9,-r*1.1,-r*0.4,r*0.2,-r*0.95],c);poly([r*0.9,0,0,r*0.4,0,-r*0.4],light_);ctx.restore()}
  else if(ty==='runner'){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(a);ctx.globalAlpha=0.35;poly([-r,0,-r*2.4,r*0.5,-r*2.4,-r*0.5],c);ctx.globalAlpha=1;poly([r*1.4,0,-r,r*0.85,-r*0.45,0,-r,-r*0.85],c);poly([r*1.1,0,-r*0.2,r*0.35,-r*0.2,-r*0.35],light);ctx.restore()}
  else if(ty==='brute'){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(a);
    for(const sd of[-1,1])poly([r*0.3,sd*r*0.6,r*1.1,sd*r*1.25,r*0.75,sd*r*0.45],'#e8d5ff');
    const p=[];for(let k=0;k<6;k++){const an=k*TAU/6+Math.PI/6;p.push(Math.cos(an)*r,Math.sin(an)*r)}poly(p,c);
    const p2=[];for(let k=0;k<6;k++){const an=k*TAU/6+Math.PI/6;p2.push(Math.cos(an)*r*0.6-r*0.15,Math.sin(an)*r*0.6)}poly(p2,dark);ctx.restore()}
  else if(ty==='spitter'){circle(e.x,e.y,r,c);circle(e.x-r*0.3,e.y-r*0.3,r*0.35,light);ctx.save();ctx.translate(e.x,e.y);ctx.rotate(a);ctx.fillStyle=dark;ctx.fillRect(r*0.5,-r*0.3,r*0.9,r*0.6);circle(r*1.4,0,r*0.35,'#ffcf8a');ctx.restore()}
  else if(ty==='chefe'){const sp=[];for(let k=0;k<16;k++){const an=k*TAU/16+t*0.6,rr=k%2?r*0.95:r*1.35;sp.push(e.x+Math.cos(an)*rr,e.y+Math.sin(an)*rr)}poly(sp,dark);circle(e.x,e.y,r*0.92,c);circle(e.x-r*0.3,e.y-r*0.35,r*0.35,light)}
  else{ctx.strokeStyle=dark;ctx.lineWidth=2;for(let k=0;k<6;k++){const an=a+Math.PI+(k-2.5)*0.45,wv=Math.sin(ph+k)*0.25;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(an+wv)*r*1.45,e.y+Math.sin(an+wv)*r*1.45);ctx.stroke()}
    circle(e.x,e.y,r,c);circle(e.x-r*0.3,e.y-r*0.3,r*0.38,light)}
  if(ty==='chefe'){for(let k=-1;k<=1;k++){const px=e.x+Math.cos(a)*r*0.45-Math.sin(a)*k*r*0.35,py=e.y+Math.sin(a)*r*0.45+Math.cos(a)*k*r*0.35;circle(px,py,r*0.14,'#0b0414');circle(px,py,r*0.07,'#ffd0ea')}}
  else if(ty!=='runner'&&ty!=='brute'&&ty!=='blindado'&&ty!=='saltador'){for(const sd of[-1,1]){const px=e.x+Math.cos(a)*r*0.45-Math.sin(a)*sd*r*0.3,py=e.y+Math.sin(a)*r*0.45+Math.cos(a)*sd*r*0.3;circle(px,py,r*0.2,'#120820');circle(px,py,r*0.1,'#f6e8ff')}}
  else if(ty==='brute'){const px=e.x+Math.cos(a)*r*0.55,py=e.y+Math.sin(a)*r*0.55;circle(px,py,r*0.22,'#120820');circle(px,py,r*0.11,'#ffb3d6')}
  if(e.frozenT>0)glowDot(e.x,e.y,r*1.05,'#bfe8ff',0.55);
  if(e.critT>0)glowDot(e.x,e.y,r,'#ffe066',0.7);else if(e.hitT>0)glowDot(e.x,e.y,r,'#ffffff',0.6);
  if(e.slowT>0&&e.frozenT<=0)ring(e.x,e.y,r+2,'#ff5fa2',1.5);
  if(e.elite)ring(e.x,e.y,r+3,'#ffcc4d',2);
  if(e.elite||e.miniboss){const w=Math.max(30,e.r*2);ctx.fillStyle='#1a0c18';ctx.fillRect(e.x-w/2,e.y-e.r-14,w,5);ctx.fillStyle=e.miniboss?'#ff5fa2':'#ffcc4d';ctx.fillRect(e.x-w/2,e.y-e.r-14,w*Math.max(0,e.hp/e.max),5)}
}
function drawBoss(e,t){const r=e.r,a=Math.atan2(P.y-e.y,P.x-e.x),c=e.c,enr=G.rage;
  if(e.teleT>0){ctx.strokeStyle='rgba(255,93,108,'+(0.3+0.4*Math.sin(t*30))+')';ctx.lineWidth=r*1.2;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(a)*380,e.y+Math.sin(a)*380);ctx.stroke()}
  shadow(e.x,e.y+r*0.9,r*1.1,r*0.38);
  glowDot(e.x,e.y,r*1.8,enr?'#ff3b3b':c,0.12+0.06*Math.sin(t*4));
  if(e.kind==='rainha'){for(let k=0;k<4;k++){const sd=k<2?-1:1,b=a+Math.PI+sd*(0.5+0.35*(k%2)),wv=Math.sin(t*4+k)*0.3;ctx.strokeStyle=shade(c,-0.35);ctx.lineWidth=r*0.28;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(e.x,e.y);
      ctx.quadraticCurveTo(e.x+Math.cos(b+wv)*r*1.6,e.y+Math.sin(b+wv)*r*1.6,e.x+Math.cos(b-wv)*r*2.4,e.y+Math.sin(b-wv)*r*2.4);ctx.stroke()}ctx.lineCap='butt';
    circle(e.x,e.y,r,c);circle(e.x-r*0.3,e.y-r*0.35,r*0.4,shade(c,0.3));
    for(let k=0;k<5;k++){const an=-Math.PI/2+(k-2)*0.35;poly([e.x+Math.cos(an-0.12)*r*0.85,e.y+Math.sin(an-0.12)*r*0.85,e.x+Math.cos(an)*r*1.45,e.y+Math.sin(an)*r*1.45,e.x+Math.cos(an+0.12)*r*0.85,e.y+Math.sin(an+0.12)*r*0.85],'#ffcc4d')}
    for(let k=-1;k<=1;k++){const px=e.x+Math.cos(a)*r*0.4-Math.sin(a)*k*r*0.32,py=e.y+Math.sin(a)*r*0.4+Math.cos(a)*k*r*0.32;circle(px,py,r*0.13,'#1a0612');circle(px,py,r*0.06,'#ffe0ef')}}
  else if(e.kind==='colosso'){const R=srand(7);const p=[];for(let k=0;k<11;k++){const an=k*TAU/11,rr=r*(0.85+R()*0.25);p.push(e.x+Math.cos(an)*rr,e.y+Math.sin(an)*rr)}poly(p,'#2c4a3c');
    ctx.strokeStyle=enr?'#ff7a3d':'#5dffa8';ctx.lineWidth=3;ctx.globalAlpha=0.6+0.3*Math.sin(t*5);for(let k=0;k<5;k++){const an=k*1.3;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(an)*r*0.8,e.y+Math.sin(an)*r*0.8);ctx.stroke()}ctx.globalAlpha=1;
    for(const sd of[-1,1]){const an=a+sd*1.2,sw=Math.sin(t*3)*0.2*sd;circle(e.x+Math.cos(an+sw)*r*1.05,e.y+Math.sin(an+sw)*r*1.05,r*0.42,'#3a5e4c')}
    circle(e.x+Math.cos(a)*r*0.4,e.y+Math.sin(a)*r*0.4,r*0.18,'#0a120e');circle(e.x+Math.cos(a)*r*0.4,e.y+Math.sin(a)*r*0.4,r*0.09,enr?'#ff7a3d':'#5dffa8')}
  else if(e.kind==='devoradora'){for(let k=0;k<8;k++){const an=k*TAU/8+t*0.8;poly([e.x+Math.cos(an-0.2)*r*0.9,e.y+Math.sin(an-0.2)*r*0.9,e.x+Math.cos(an)*r*1.6,e.y+Math.sin(an)*r*1.6,e.x+Math.cos(an+0.2)*r*0.9,e.y+Math.sin(an+0.2)*r*0.9],'#5a2a99')}
    circle(e.x,e.y,r,c);circle(e.x+Math.cos(a)*r*0.15,e.y+Math.sin(a)*r*0.15,r*0.62,'#14051f');
    for(let k=0;k<12;k++){const an=k*TAU/12+t;const cx=e.x+Math.cos(a)*r*0.15,cy=e.y+Math.sin(a)*r*0.15;poly([cx+Math.cos(an-0.15)*r*0.62,cy+Math.sin(an-0.15)*r*0.62,cx+Math.cos(an)*r*0.38,cy+Math.sin(an)*r*0.38,cx+Math.cos(an+0.15)*r*0.62,cy+Math.sin(an+0.15)*r*0.62],'#f2e6ff')}
    glowDot(e.x+Math.cos(a)*r*0.15,e.y+Math.sin(a)*r*0.15,r*0.2,'#c08bff',0.8)}
  else{const n=e.p2?4:3;for(let k=0;k<n;k++){const an=k*TAU/n+t*(e.p2?1.6:1);ctx.save();ctx.translate(e.x+Math.cos(an)*r*1.15,e.y+Math.sin(an)*r*1.15);ctx.rotate(an+Math.PI/2);ctx.fillStyle=e.p2?'#9fd4ff':'#5fa8ff';ctx.beginPath();ctx.arc(0,0,r*0.55,Math.PI*0.1,Math.PI*0.9);ctx.arc(0,-r*0.15,r*0.48,Math.PI*0.88,Math.PI*0.12,true);ctx.fill();ctx.restore()}
    const g=ctx.createRadialGradient(e.x-r*0.3,e.y-r*0.3,r*0.1,e.x,e.y,r);g.addColorStop(0,'#9fd4ff');g.addColorStop(1,e.p2?'#1a3a8a':'#24509a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x,e.y,r,0,TAU);ctx.fill();
    for(let k=0;k<3;k++){ctx.strokeStyle='rgba(200,230,255,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,r*(0.4+k*0.18),t+k,t+k+2);ctx.stroke()}
    for(const sd of[-1,1]){const px=e.x+Math.cos(a)*r*0.45-Math.sin(a)*sd*r*0.3,py=e.y+Math.sin(a)*r*0.45+Math.cos(a)*sd*r*0.3;circle(px,py,r*0.13,'#071530');circle(px,py,r*0.07,'#e6f4ff')}}
  if(e.frozenT>0)glowDot(e.x,e.y,r*1.05,'#bfe8ff',0.4);
  if(e.critT>0)glowDot(e.x,e.y,r,'#ffe066',0.45);else if(e.hitT>0)glowDot(e.x,e.y,r,'#ffffff',0.3);
}

/* marcos dos mapas */
function drawStation(o,label,col,charge,full,kind,t){const off=o.cd>0;
  // base de pedra assentada no chão, com borda de blocos
  tShadow(o.x,o.y+o.r*0.5,o.r*1.02,o.r*0.4);
  ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,TAU);inked(off?'#8a8578':'#b3ae9e',4.5);
  ctx.beginPath();ctx.arc(o.x,o.y,o.r-11,0,TAU);inked(off?'#6e6b61':'#cfc9b6',3.5);
  for(let k=0;k<10;k++){const an=k*TAU/10;
    ctx.beginPath();ctx.arc(o.x+Math.cos(an)*(o.r-5.5),o.y+Math.sin(an)*(o.r-5.5),4,0,TAU);
    inked(off?'#5c594f':col,2)}
  if(kind==='fonte'){ctx.beginPath();ctx.arc(o.x,o.y,24,0,TAU);inked(off?'#4b5a50':'#5bb6d6',3);if(!off)for(let k=0;k<3;k++)ring(o.x,o.y,(t*20+k*10)%30,'rgba(190,255,200,.5)',1.5);circle(o.x,o.y,10,off?'#203a2c':'#c9ffd0')}
  else{ctx.fillStyle=off?'#1e2a3c':'#bfe8ff';ctx.save();ctx.translate(o.x,o.y);for(let k=0;k<6;k++){ctx.rotate(TAU/6);ctx.fillRect(-2,-22,4,22)}ctx.restore();circle(o.x,o.y,10,off?'#1e2a3c':'#e6f7ff');if(!off)glowDot(o.x,o.y,30,'#9fd4ff',0.18+0.1*Math.sin(t*4))}
  if(charge>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=6;ctx.beginPath();ctx.arc(o.x,o.y,o.r-4,-Math.PI/2,-Math.PI/2+TAU*charge/full);ctx.stroke()}
  ctx.lineWidth=5;ctx.strokeStyle=INK;ctx.lineJoin='round';
  ctx.strokeText(off?Math.ceil(o.cd)+' s':label,o.x,o.y+o.r+20);
  ctx.fillStyle='#f6e7c6';ctx.fillText(off?Math.ceil(o.cd)+' s':label,o.x,o.y+o.r+20)}
function drawCannon(c,t){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(c.x,c.y,c.r+6,0,TAU);ctx.fill();
  ctx.fillStyle='#1a2238';ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,TAU);ctx.fill();ring(c.x,c.y,c.r,c.active>0?'#9be7ff':'#3a4a66',3);
  ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.ang||0);ctx.fillStyle='#2e3a5c';ctx.fillRect(-18,-18,36,36);ctx.fillStyle=c.active>0?'#9be7ff':'#46557e';ctx.fillRect(10,-7,38,14);ctx.fillStyle='#0b0d18';ctx.fillRect(40,-4,8,8);ctx.restore();
  if(c.active>0)glowDot(c.x,c.y,c.r*0.8,'#9be7ff',0.15+0.1*Math.sin(t*10));
  ctx.fillStyle='#a7b0d8';ctx.fillText(c.active>0?'Ativo · '+Math.ceil(c.active)+' s':'Canhão de Íons',c.x,c.y+c.r+18)}

/* ícones (cartas e inventário) */
const iconCache={};
function iconPaint(key,S){const c=S/2,[kind,id]=key.split(':');
  ctx.fillStyle='#141a2e';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(1,1,S-2,S-2,S*0.2);else ctx.rect(1,1,S-2,S-2);ctx.fill();
  let col=kind==='w'?WEAPONS[id].c:kind==='p'?PASSIVES[id].c:kind==='aug'?'#9b7bff':kind==='gold'?'#ffcc4d':'#7ee081';
  ctx.strokeStyle=col;ctx.lineWidth=S*0.05;ctx.stroke();ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineWidth=S*0.07;ctx.lineCap='round';const u=S/64;
  const L=(x1,y1,x2,y2)=>{ctx.beginPath();ctx.moveTo(x1*u,y1*u);ctx.lineTo(x2*u,y2*u);ctx.stroke()},C=(x,y,r)=>circle(x*u,y*u,r*u,col),A=(x,y,r,a0,a1)=>{ctx.beginPath();ctx.arc(x*u,y*u,r*u,a0,a1);ctx.stroke()},PL=(...p)=>poly(p.map(v=>v*u),col);
  switch(kind==='w'||kind==='p'?id:kind){
    case 'rajada':C(22,40,5);C(34,32,5);C(46,24,5);break;
    case 'onda':for(const r of[10,18,26])A(14,46,r,-1.3,0.1);break;
    case 'escudo':case 'arm':PL(32,12,50,20,46,42,32,54,18,42,14,20);break;
    case 'garra':for(const k of[-10,0,10])L(20+k,16,40+k,50);break;
    case 'tempestade':for(let k=0;k<3;k++)A(32,32,8+k*7,k,k+3.6);break;
    case 'pena':PL(48,14,22,46,18,50,30,30);L(18,50,30,38);break;
    case 'blaster':L(14,32,50,32);C(52,32,5);break;
    case 'ciclone':for(let k=0;k<3;k++){const a=k*TAU/3;PL(32+Math.cos(a)*22,32+Math.sin(a)*22,32+Math.cos(a+0.6)*10,32+Math.sin(a+0.6)*10,32+Math.cos(a-0.4)*8,32+Math.sin(a-0.4)*8)}break;
    case 'campo':ctx.globalAlpha=0.35;C(32,32,20);ctx.globalAlpha=1;A(32,32,20,0,TAU);C(32,32,6);break;
    case 'arco':A(26,32,20,-1.2,1.2);L(16,32,52,32);PL(52,32,44,27,44,37);break;
    case 'mina':C(32,32,12);for(let k=0;k<8;k++){const a=k*TAU/8;L(32+Math.cos(a)*12,32+Math.sin(a)*12,32+Math.cos(a)*20,32+Math.sin(a)*20)}break;
    case 'gelo':for(let k=0;k<3;k++){const a=k*Math.PI/3;L(32-Math.cos(a)*20,32-Math.sin(a)*20,32+Math.cos(a)*20,32+Math.sin(a)*20)}break;
    case 'orbital':A(32,32,16,0,TAU);L(32,10,32,22);L(32,42,32,54);L(10,32,22,32);L(42,32,54,32);C(32,32,4);break;
    case 'estatica':PL(36,10,18,36,30,36,26,54,46,26,34,26);break;
    case 'drone':C(32,34,15);PL(20,24,22,10,30,22);PL(44,24,42,10,34,22);ctx.fillStyle='#141a2e';circle(26*u,32*u,3*u,'#141a2e');circle(38*u,32*u,3*u,'#141a2e');break;
    case 'trem':ctx.fillRect(10*u,22*u,44*u,20*u);ctx.fillStyle='#141a2e';ctx.fillRect(16*u,26*u,8*u,7*u);ctx.fillRect(28*u,26*u,8*u,7*u);ctx.fillRect(40*u,26*u,8*u,7*u);C(18,46,4);C(46,46,4);break;
    case 'feitico':PL(32,10,37,27,54,32,37,37,32,54,27,37,10,32,27,27);ctx.fillStyle='#141a2e';circle(32*u,32*u,5*u,'#141a2e');break;
    case 'tentaculo':ctx.beginPath();ctx.moveTo(22*u,54*u);ctx.quadraticCurveTo(10*u,30*u,30*u,24*u);ctx.quadraticCurveTo(48*u,18*u,40*u,10*u);ctx.lineWidth=7*u;ctx.stroke();break;
    case 'salto':A(32,40,18,Math.PI,0);PL(50,40,44,30,56,30);break;
    case 'luva':for(let k=0;k<6;k++){const a=k*0.9;C(32+Math.cos(a)*(6+k*3),32+Math.sin(a)*(6+k*3),3)}break;
    case 'balestra':for(const a of[-0.5,0,0.5])L(14,46,14+Math.cos(a-0.8)*36,46+Math.sin(a-0.8)*36);break;
    case 'rastro':C(20,40,8);C(32,34,10);C(44,40,8);break;
    case 'urso':C(32,34,15);C(20,20,6);C(44,20,6);ctx.fillStyle='#141a2e';circle(26*u,32*u,3*u,'#141a2e');circle(38*u,32*u,3*u,'#141a2e');break;
    case 'minas':for(let k=0;k<6;k++){const a=k*TAU/6;C(32+Math.cos(a)*16,32+Math.sin(a)*16,4)}break;
    case 'bumerangue':PL(14,18,32,32,50,18,46,26,32,40,18,26);break;
    case 'gatling':for(const a of[-0.3,0,0.3])L(12,32,12+Math.cos(a)*42,32+Math.sin(a)*42);break;
    case 'dur':PL(18,12,46,12,32,32);PL(18,52,46,52,32,32);break;
    case 'aniquilador':C(32,30,16);ctx.fillStyle='#141a2e';circle(26*u,28*u,4*u,'#141a2e');circle(38*u,28*u,4*u,'#141a2e');ctx.fillStyle=col;ctx.fillRect(24*u,44*u,16*u,8*u);break;
    case 'dano':PL(32,10,38,26,54,32,38,38,32,54,26,38,10,32,26,26);break;
    case 'acel':A(32,32,18,0,TAU);L(32,32,32,18);L(32,32,42,38);break;
    case 'area':A(32,32,8,0,TAU);A(32,32,15,0,TAU);A(32,32,22,0,TAU);break;
    case 'vida':PL(32,52,12,30,14,18,24,14,32,22,40,14,50,18,52,30);break;
    case 'regen':ctx.fillRect(28*u,12*u,8*u,40*u);ctx.fillRect(12*u,28*u,40*u,8*u);break;
    case 'proj':C(18,32,6);C(32,32,6);C(46,32,6);break;
    case 'vel':L(16,18,30,32);L(30,32,16,46);L(32,18,46,32);L(46,32,32,46);break;
    case 'crit':PL(32,10,38,26,54,26,41,36,46,52,32,42,18,52,23,36,10,26,26,26);break;
    case 'coleta':A(32,30,14,Math.PI,0);L(18,30,18,46);L(46,30,46,46);break;
    case 'exp':PL(32,10,48,32,32,54,16,32);break;
    case 'aug':PL(32,10,51,21,51,43,32,54,13,43,13,21);ctx.fillStyle='#141a2e';circle(32*u,32*u,7*u,'#141a2e');break;
    case 'gold':C(32,32,16);ctx.fillStyle='#a87a12';circle(32*u,32*u,7*u,'#a87a12');break;
    default:ctx.fillRect(28*u,12*u,8*u,40*u);ctx.fillRect(12*u,28*u,40*u,8*u)}
  ctx.lineCap='butt'}
function iconURL(key){if(iconCache[key]!==undefined)return iconCache[key];let url='';
  try{const c=mkCanvas(64,64);const x=c.getContext('2d');if(key.startsWith('f:'))withCtx(x,()=>{x.fillStyle='#f6e7c6';x.fillRect(0,0,64,64);drawFighter(key.slice(2),32,36,0.5,false,Math.PI/2,0.35,1.5)});else withCtx(x,()=>iconPaint(key,64));url=c.toDataURL()}catch(e){url=''}
  return iconCache[key]=url}

/* efeitos */
function burst(x,y,c,n,sp){if(G.parts.length>650)return;sp=sp||170;for(let i=0;i<n;i++){const a=Math.random()*TAU,v=rnd(0.3,1)*sp;G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rnd(0.25,0.6),max:0.6,c,s:rnd(1.5,3.5)})}}
function smoke(x,y,r,c){if(G.parts.length>650)return;const n=r>16?3:1;for(let i=0;i<n;i++)G.parts.push({smoke:true,x:x+rnd(-r,r)*0.4,y:y+rnd(-r,r)*0.4,vx:rnd(-20,20),vy:rnd(-40,-10),life:0.55,max:0.55,s:r*0.7,c:shade(c,-0.55)})}
const glowCache=new Map();
function glowSprite(c){let g=glowCache.get(c);if(g)return g;g=mkCanvas(64,64);const x=g.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,c);gr.addColorStop(0.35,c);gr.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=1;x.fillStyle=gr;x.fillRect(0,0,64,64);glowCache.set(c,g);return g}
function light(x,y,R,c,a){if(a<=0.01)return;ctx.globalAlpha=Math.min(1,a*0.3);ctx.drawImage(glowSprite(c),x-R,y-R,R*2,R*2)}
function shakeIt(v){if(SAVE.set.shake)G.shake=Math.max(G.shake,v)}

/* minimapa */
function drawMinimap(){if(W<760)return;const S=150,x0=W-S-Math.max(16,0)-4,y0=H-S-30,R=1600,sc=S/2/R,cx=x0+S/2,cy=y0+S/2;
  ctx.fillStyle='rgba(45,28,16,.55)';ctx.fillRect(x0,y0,S,S);ctx.strokeStyle='#2a3354';ctx.lineWidth=1;ctx.strokeRect(x0+.5,y0+.5,S-1,S-1);
  ctx.save();ctx.beginPath();ctx.rect(x0,y0,S,S);ctx.clip();
  const pt=(o,r,c)=>{const px=cx+(o.x-P.x)*sc,py=cy+(o.y-P.y)*sc;ctx.fillStyle=c;ctx.fillRect(px-r,py-r,r*2,r*2)};
  if(G.sea){const sx=cx+(G.sea.x-P.x)*sc;ctx.fillStyle='rgba(60,120,220,.35)';ctx.fillRect(x0,y0,Math.max(0,sx-x0),S)}
  for(let i=0;i<G.enemies.length;i+=3){const e=G.enemies[i];if(!e.elite&&!e.boss&&!e.miniboss)pt(e,1,'#6b4fd0')}
  if(G.map==='distrito')pt(G.fountain,3,G.fountain.cd>0?'#2c4a3a':'#7ee081');
  if(G.map==='periferia'){pt(G.cannon,3,'#9be7ff');for(const f of G.fuel)pt(f,2.5,'#39d98a')}
  if(G.map==='lab')for(const b of G.bombs)pt(b,3,b.cd>0?'#2a3550':'#9fd4ff');
  for(const s of G.spires)pt(s,3,{boon:'#ffcc4d',quest:'#9b7bff',trial:'#ff5d6c'}[s.type]);
  for(const c of G.cards)pt(c,2,'#ffcc4d');
  for(const e of G.enemies){if(e.boss)pt(e,5,'#ff5fa2');else if(e.miniboss)pt(e,3.5,'#ff5fa2');else if(e.elite)pt(e,2.5,'#ffcc4d')}
  ctx.restore();circle(cx,cy,3,'#ffffff');ctx.fillStyle='#8d97c2';ctx.font='600 10px Nunito,sans-serif';ctx.textAlign='left';ctx.fillText('MAPA',x0+6,y0+13)}

function draw(){
  const M=G?MAPS[G.map]:MAPS.distrito;ctx.fillStyle=M.bg;ctx.fillRect(0,0,W,H);if(!G)return;const t=G.t;
  let sx_=0,sy_=0;if(G.shake>0){sx_=rnd(-1,1)*G.shake;sy_=rnd(-1,1)*G.shake}
  const ox=Math.round(W/2-P.x+sx_),oy=Math.round(H/2-P.y+sy_);
  // chão
  const c0=Math.floor((P.x-W/2)/CH),c1=Math.floor((P.x+W/2)/CH),r0=Math.floor((P.y-H/2)/CH),r1=Math.floor((P.y+H/2)/CH);
  for(let cx=c0;cx<=c1;cx++)for(let cy=r0;cy<=r1;cy++){const ch=getChunk(G.map,cx,cy);ctx.drawImage(ch,cx*CH+ox,cy*CH+oy)}
  ctx.save();ctx.translate(ox,oy);
  ctx.font='600 12px Nunito,sans-serif';ctx.textAlign='center';
  if(G.map==='distrito')drawStation(G.fountain,'Fonte de Cura','#7ee081',G.fountain.charge,2.5,'fonte',t);
  else if(G.map==='periferia'){drawCannon(G.cannon,t);for(const f of G.fuel){glowDot(f.x,f.y,22,'#39d98a',0.2+0.1*Math.sin(t*6));ctx.fillStyle='#1a3a2a';ctx.fillRect(f.x-8,f.y-12,16,24);ctx.fillStyle='#39d98a';ctx.fillRect(f.x-5,f.y-8,10,16-((t*20)%8))}}
  else if(G.map==='lab')for(const b of G.bombs)drawStation(b,'Bomba de Gelo','#9fd4ff',b.charge,1.5,'gelo',t);
  if(G.sea){const sx=G.sea.x;ctx.fillStyle='rgba(30,80,180,.42)';ctx.fillRect(P.x-W,P.y-H,sx-(P.x-W),H*2);
    ctx.strokeStyle='rgba(170,215,255,.7)';ctx.lineWidth=3;ctx.beginPath();for(let y=P.y-H/2-40;y<P.y+H/2+40;y+=12){const xx=sx+Math.sin(y*0.05+t*4)*8;y===P.y-H/2-40?ctx.moveTo(xx,y):ctx.lineTo(xx,y)}ctx.stroke()}
  for(const pd of G.pods){ tShadow(pd.x,pd.y+13,14,5);
    ctx.beginPath();ctx.rect(pd.x-13,pd.y-13,26,26);inked('#b07f45',3);
    ctx.strokeStyle=INK;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(pd.x-13,pd.y-4);ctx.lineTo(pd.x+13,pd.y-4);ctx.moveTo(pd.x-13,pd.y+5);ctx.lineTo(pd.x+13,pd.y+5);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pd.x-13,pd.y-13);ctx.lineTo(pd.x+13,pd.y+13);ctx.stroke() }
  for(const h of G.hazards){glowDot(h.x,h.y,h.r,'#5a1fb0',h.arm>0?0.15:0.35);ring(h.x,h.y,h.r*(h.arm>0?1-h.arm/0.8:1),'#b06bff',2);if(h.arm<=0)for(let k=0;k<3;k++)glowDot(h.x+Math.cos(t*2+k*2)*h.r*0.5,h.y+Math.sin(t*2+k*2)*h.r*0.5,4,'#d9b3ff',0.6)}
  if(G.trial){ctx.setLineDash([12,8]);ring(G.trial.x,G.trial.y,G.trial.r,'#ff5d6c',3);ctx.setLineDash([]);glowDot(G.trial.x,G.trial.y,G.trial.r,'#ff5d6c',0.05)}
  for(const s of G.spires){const c={boon:'#ffcc4d',quest:'#9b7bff',trial:'#ff5d6c'}[s.type];ctx.setLineDash([6,6]);ring(s.x,s.y,70,c,2);ctx.setLineDash([]);
    shadow(s.x,s.y+14,16,5);glowDot(s.x,s.y-6,26,c,0.15+0.1*Math.sin(t*5));poly([s.x,s.y-30,s.x+13,s.y+12,s.x-13,s.y+12],c);poly([s.x,s.y-22,s.x+6,s.y+6,s.x-6,s.y+6],'#ffffff');
    if(s.cap>0){ctx.strokeStyle=c;ctx.lineWidth=6;ctx.beginPath();ctx.arc(s.x,s.y,62,-Math.PI/2,-Math.PI/2+TAU*s.cap/2.5);ctx.stroke()}
    const nm={boon:'Bênção',quest:'Missão',trial:'Provação'}[s.type];
    ctx.lineWidth=5;ctx.strokeStyle=INK;ctx.lineJoin='round';ctx.strokeText(nm,s.x,s.y+34);
    ctx.fillStyle=c;ctx.fillText(nm,s.x,s.y+34)}
  for(const z of G.zones){const a=Math.min(1,z.life)*0.3;glowDot(z.x,z.y,z.r,z.c,a);for(let k=0;k<3;k++)glowDot(z.x+Math.cos(t*3+k*2.1+z.x)*z.r*0.5,z.y+Math.sin(t*3+k*2.1)*z.r*0.5,z.r*0.18,'#ffd27a',a)}
  for(const m of G.marks){const k=1-m.t/m.max;if(m.mine){circle(m.x,m.y,7,'#3a1a10');glowDot(m.x,m.y,5,m.c,0.6+0.4*Math.sin(t*(8+k*20)));ring(m.x,m.y,m.r*k,'rgba(255,122,89,.5)',1.5)}else{ring(m.x,m.y,m.r,m.c,2);glowDot(m.x,m.y,m.r*k,m.c,0.28)}}
  for(const l of G.lines){const k=1-l.t/l.max;ctx.strokeStyle='rgba(159,212,255,'+(0.12+0.4*k)+')';ctx.lineWidth=l.w;ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(l.x2,l.y2);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1;ctx.stroke()}
  for(const f of G.feathers){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(0.6);glowDot(0,0,7,'#ff7ad9',0.25);ctx.fillStyle='#ff7ad9';ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(3,5);ctx.lineTo(-3,5);ctx.fill();ctx.restore()}
  const cw=P.weapons.find(w=>w.id==='campo');if(cw){const R=auraR(cw);glowDot(P.x,P.y,R,cw.evo?'#b6ff9e':'#7ee081',0.1);ctx.setLineDash([4,6]);ctx.lineDashOffset=-t*20;ring(P.x,P.y,R,'rgba(126,224,129,.6)',1.5);ctx.setLineDash([])}
  for(const o of G.orbs){
    if(o.heal){ tBlob(o.x,o.y,9,9,'#e8785f',2.2,true);
      ctx.fillStyle='#fffaf0';ctx.fillRect(o.x-5,o.y-1.8,10,3.6);ctx.fillRect(o.x-1.8,o.y-5,3.6,10) }
    else if(o.gold){ tBlob(o.x,o.y,6.5,6.5,'#f2c14e',2);
      ctx.beginPath();ctx.arc(o.x,o.y,2.6,0,TAU);ctx.strokeStyle='rgba(45,28,16,.45)';ctx.lineWidth=1.6;ctx.stroke() }
    else{ const big=o.v>5,s=big?8:5.2;
      ctx.beginPath();ctx.moveTo(o.x,o.y-s);ctx.lineTo(o.x+s*0.78,o.y);ctx.lineTo(o.x,o.y+s);ctx.lineTo(o.x-s*0.78,o.y);ctx.closePath();
      inked(big?'#8e6bb0':'#5bb6d6',big?2.4:2);
      ctx.beginPath();ctx.moveTo(o.x,o.y-s*0.55);ctx.lineTo(o.x+s*0.3,o.y-s*0.1);ctx.lineTo(o.x,o.y+s*0.2);ctx.closePath();
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.fill() }}
  for(const c of G.cards){ctx.save();ctx.translate(c.x,c.y+Math.sin(t*4)*3);ctx.rotate(Math.sin(t*3)*0.18);
    roundRect(-11,-14,22,28,4);inked('#f6e7c6',3);
    ctx.strokeStyle='rgba(45,28,16,.55)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-6,-6);ctx.lineTo(6,-6);ctx.moveTo(-6,0);ctx.lineTo(4,0);ctx.moveTo(-6,6);ctx.lineTo(6,6);ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,-14,11,3.5,0,0,TAU);inked('#d8c08a',2.4);
    ctx.restore()}
  for(const tr of G.trains){const x1=tr.vx>0?tr.x-tr.len:tr.x;shadow(x1+tr.len/2,tr.y+tr.h/2+4,tr.len/2,6);ctx.fillStyle='#2a1c12';ctx.fillRect(x1,tr.y-tr.h/2,tr.len,tr.h);
    for(let i=0;i<4;i++){ctx.fillStyle='#ff8a3d';ctx.fillRect(x1+8+i*(tr.len/4),tr.y-tr.h/2+4,tr.len/4-16,tr.h-8);ctx.fillStyle='#ffd27a';ctx.fillRect(x1+14+i*(tr.len/4),tr.y-tr.h/2+7,tr.len/4-28,5)}
    const hx=tr.vx>0?tr.x:x1;glowDot(hx,tr.y,tr.h,'#ffe9a8',0.35)}
  for(const rg of G.rings){const a=Math.min(1,rg.life);ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*40;ring(rg.x,rg.y,rg.r,'rgba(184,164,255,'+(0.8*a)+')',4);ctx.setLineDash([]);glowDot(rg.x,rg.y,rg.r,'#b8a4ff',0.05*a);for(let k=0;k<6;k++){const an=t*0.8+k*TAU/6;glowDot(rg.x+Math.cos(an)*rg.r,rg.y+Math.sin(an)*rg.r,6,'#efe8ff',0.8*a)}}
  for(const tn of G.tents){const a=Math.min(1,tn.life*2),L=tn.r*(1.1+(tn.slam>0?0.35:0)),bx=tn.x,by=tn.y;ctx.globalAlpha=a;shadow(bx,by+6,tn.r*0.45,tn.r*0.16);circle(bx,by,tn.r*0.32,'#123d30');
    ctx.strokeStyle='#2fae86';ctx.lineCap='round';ctx.lineWidth=tn.r*0.32;ctx.beginPath();ctx.moveTo(bx,by);const wv=Math.sin(t*6+tn.x)*0.35;ctx.quadraticCurveTo(bx+Math.cos(tn.a+wv)*L*0.6,by+Math.sin(tn.a+wv)*L*0.6,bx+Math.cos(tn.a)*L,by+Math.sin(tn.a)*L);ctx.stroke();
    ctx.strokeStyle='#7affc8';ctx.lineWidth=tn.r*0.1;ctx.stroke();ctx.lineCap='butt';if(tn.slam>0)glowDot(bx+Math.cos(tn.a)*L,by+Math.sin(tn.a)*L,tn.r*0.8,'#7affc8',0.35);ctx.globalAlpha=1}
  for(const e of G.enemies)if(!e.boss)drawEnemy(e,t);
  const ur=P.weapons.find(w=>w.id==='urso');if(ur&&ur.st.b){const b=ur.st.b,big=ur.evo?1.35:1,R=15*big,f=b.face||0;shadow(b.x,b.y+R,R,R*0.35);circle(b.x,b.y,R,ur.evo?'#ff7a3d':'#ffb36b');
    for(const sd of[-1,1])circle(b.x+sd*R*0.7,b.y-R*0.75,R*0.35,ur.evo?'#c94f1f':'#d98a3f');circle(b.x+Math.cos(f)*R*0.4,b.y+Math.sin(f)*R*0.4,R*0.32,'#3a2a1a');
    for(const sd of[-1,1])glowDot(b.x+Math.cos(f)*R*0.35-Math.sin(f)*sd*R*0.35,b.y+Math.sin(f)*R*0.35+Math.cos(f)*sd*R*0.35,R*0.12,'#7af0ff',0.9);
    if(b.sw>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,(ur.evo?75:52)*ST.area,f-1,f+1);ctx.stroke()}}
  if(G.boss&&!G.boss.dead)drawBoss(G.boss,t);
  // comandante
  const c=G.cmd;shadow(c.x,c.y+10,8,3);glowDot(c.x,c.y,14,'#ffcc4d',0.18);ctx.save();ctx.translate(c.x,c.y);ctx.rotate(t*0.8);ctx.fillStyle='#ffcc4d';ctx.beginPath();for(let i=0;i<10;i++){const r=i%2?4:10,an=i*Math.PI/5-Math.PI/2;ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r)}ctx.fill();ctx.restore();
  const dr=P.weapons.find(w=>w.id==='drone');if(dr&&dr.st.x!==undefined){const s=dr.st,hb=Math.sin(t*6)*3;shadow(s.x,s.y+16,9,3);circle(s.x,s.y+hb,11,'#ffd27a');poly([s.x-9,s.y-6+hb,s.x-7,s.y-17+hb,s.x-2,s.y-9+hb],'#ffd27a');poly([s.x+9,s.y-6+hb,s.x+7,s.y-17+hb,s.x+2,s.y-9+hb],'#ffd27a');
    circle(s.x-4,s.y-1+hb,2.2,'#141a2e');circle(s.x+4,s.y-1+hb,2.2,'#141a2e');ctx.setLineDash([3,5]);ring(s.x,s.y,45*ST.area,'rgba(255,210,122,.3)',1);ctx.setLineDash([])}
  // jogador
  if(P.invuln>0)glowDot(P.x,P.y,P.r+12,'#ffffff',0.22);
  if((SAVE.up.anima||0)>=100)glowDot(P.x,P.y,P.r+16,'#ffcc4d',0.18+0.08*Math.sin(t*5));
  if(P.carry){ctx.fillStyle='#39d98a';ctx.fillRect(P.x-5,P.y-P.r-26,10,16);glowDot(P.x,P.y-P.r-18,12,'#39d98a',0.3)}
  const fa=aim();drawFighter(P.fid,P.x,P.y,t,P.moving,P.face,fa,1,Math.min(1,P.atkT/0.14));
  if(P.fid==='lebre'){const n=Math.floor(P.lvl/7);for(let i=0;i<n;i++){const a=P.spA+i*TAU/n,sx=P.x+Math.cos(a)*40,sy=P.y+Math.sin(a)*40+Math.sin(t*5+i)*3;glowDot(sx,sy,9,'#b8a4ff',0.35);circle(sx,sy,4,'#efe8ff')}}
  if(P.shield>0){ring(P.x,P.y,P.r+8,'rgba(159,212,255,.85)',3);glowDot(P.x,P.y,P.r+8,'#9fd4ff',0.12)}
  const ts=P.weapons.find(w=>w.id==='tempestade');if(ts){ctx.strokeStyle='#bfe8ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(P.x,P.y,P.r+13,-Math.PI/2,-Math.PI/2+TAU*(ts.st.flow||0)/100);ctx.stroke()}
  if(P.buffs.some(b=>b.haste||b.spd)){ctx.strokeStyle='rgba(79,227,214,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(P.x,P.y,P.r+5+Math.sin(t*12)*2,0,TAU);ctx.stroke()}
  if(!manual){ctx.globalAlpha=0.5;poly([P.x+Math.cos(fa)*(P.r+26),P.y+Math.sin(fa)*(P.r+26),P.x+Math.cos(fa+0.18)*(P.r+18),P.y+Math.sin(fa+0.18)*(P.r+18),P.x+Math.cos(fa-0.18)*(P.r+18),P.y+Math.sin(fa-0.18)*(P.r+18)],P.f.c);ctx.globalAlpha=1}
  const cy=P.weapons.find(w=>w.id==='ciclone');if(cy&&cy.st.active){const s=cy.st;for(let i=0;i<s.n;i++){const a=s.a+i*TAU/s.n,bx=P.x+Math.cos(a)*s.R,by=P.y+Math.sin(a)*s.R;
    ctx.globalAlpha=0.3;ctx.strokeStyle=cy.evo?'#ffcc4d':'#c9b8ff';ctx.lineWidth=s.br;ctx.beginPath();ctx.arc(P.x,P.y,s.R,a-0.5,a);ctx.stroke();ctx.globalAlpha=1;
    ctx.save();ctx.translate(bx,by);ctx.rotate(a*3);poly([0,-s.br*1.4,s.br*0.6,0,0,s.br*1.4,-s.br*0.6,0],cy.evo?'#ffcc4d':'#e2d8ff');ctx.restore()}}
  // projéteis
  ctx.lineCap='round';
  for(const p of G.proj){
    if(p.wave){const a=Math.atan2(p.vy,p.vx);ctx.globalAlpha=p.ret?0.55:0.9;ctx.strokeStyle=p.c;ctx.lineWidth=5;ctx.beginPath();ctx.arc(p.x-Math.cos(a)*p.r,p.y-Math.sin(a)*p.r,p.r,a-0.9,a+0.9);ctx.stroke();
      ctx.lineWidth=2;ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.arc(p.x-Math.cos(a)*p.r,p.y-Math.sin(a)*p.r,p.r*0.8,a-0.7,a+0.7);ctx.stroke();ctx.globalAlpha=1}
    else if(p.whirl){glowDot(p.x,p.y,p.r,p.c,0.35);ctx.strokeStyle='#ffffff';ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(p.x,p.y,p.r*(0.35+k*0.22),t*12+k,t*12+k+2.2);ctx.stroke()}}
    else if(p.spin){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(t*18);for(let k=0;k<(p.evo?4:2);k++){ctx.rotate(Math.PI/(p.evo?2:1));poly([0,-p.r*1.3,p.r*0.35,0,0,p.r*0.25,-p.r*0.35,0],p.c)}ctx.restore()}
    else if(p.feather){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));glowDot(0,0,9,p.c,0.25);ctx.fillStyle=p.c;ctx.beginPath();ctx.moveTo(11,0);ctx.lineTo(-9,4);ctx.lineTo(-6,0);ctx.lineTo(-9,-4);ctx.fill();ctx.restore()}
    else if(p.rocket){ctx.strokeStyle='rgba(255,180,90,.5)';ctx.lineWidth=p.r*1.2;ctx.beginPath();ctx.moveTo(p.x-p.vx*0.06,p.y-p.vy*0.06);ctx.lineTo(p.x,p.y);ctx.stroke();circle(p.x,p.y,p.r,p.c);circle(p.x,p.y,p.r*0.5,'#ffffff')}
    else{ctx.globalAlpha=0.45;ctx.strokeStyle=p.c;ctx.lineWidth=p.r*1.6;ctx.beginPath();ctx.moveTo(p.x-p.vx*0.03,p.y-p.vy*0.03);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalAlpha=1;circle(p.x,p.y,p.r,p.c);circle(p.x,p.y,p.r*0.45,'#ffffff')}}
  ctx.lineCap='butt';
  for(const p of G.proj)if(p.evo&&!p.wave&&!p.whirl)ring(p.x,p.y,p.r+3,'rgba(255,204,77,.85)',1.5);
  for(const b of G.eproj){glowDot(b.x,b.y,b.r*1.8,b.c||'#ff5d6c',0.25);circle(b.x,b.y,b.r,b.c||'#ff5d6c');circle(b.x,b.y,b.r*0.45,'#ffe0e4')}
  for(const wl of G.walls)if(wl.p){ctx.lineCap='round';ctx.strokeStyle='rgba(191,232,255,.35)';ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(wl.p[0],wl.p[1]);ctx.lineTo(wl.p[2],wl.p[3]);ctx.stroke();ctx.strokeStyle='rgba(235,248,255,.9)';ctx.lineWidth=6;ctx.stroke();ctx.lineCap='butt'}
  for(const b of G.beams){ctx.globalAlpha=Math.min(1,b.life/0.15);ctx.strokeStyle=b.c;ctx.lineWidth=b.w;ctx.beginPath();ctx.moveTo(b.x1,b.y1);ctx.lineTo(b.x2,b.y2);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(1,b.w*0.3);ctx.stroke();ctx.globalAlpha=1}
  for(const b of G.bolts){for(const [col,w] of [['rgba(122,168,255,.5)',6],['#e6efff',2]]){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(b.pts[0].x,b.pts[0].y);for(let i=1;i<b.pts.length;i++){const p0=b.pts[i-1],p1=b.pts[i];ctx.lineTo((p0.x+p1.x)/2+rnd(-12,12),(p0.y+p1.y)/2+rnd(-12,12));ctx.lineTo(p1.x,p1.y)}ctx.stroke()}}
  for(const x of G.fxs){const k=1-x.life/x.max;ctx.globalAlpha=x.life/x.max;
    if(x.cone){ctx.fillStyle=x.c;ctx.globalAlpha*=0.45;ctx.beginPath();ctx.moveTo(x.x,x.y);ctx.arc(x.x,x.y,x.R,x.a-x.sp,x.a+x.sp);ctx.closePath();ctx.fill();ctx.globalAlpha=x.life/x.max;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x.x,x.y,x.R,x.a-x.sp,x.a+x.sp);ctx.stroke()}
    else{const rr=x.r+(x.R-x.r)*k;ctx.globalAlpha*=0.18;circle(x.x,x.y,rr,x.c);ctx.globalAlpha=x.life/x.max;ring(x.x,x.y,rr,x.c,4)}ctx.globalAlpha=1}
  for(const p of G.parts){const k=Math.max(0,p.life/p.max);if(p.smoke){ctx.globalAlpha=k*0.5;circle(p.x,p.y,p.s*(1.6-k),p.c)}else{ctx.globalAlpha=k;ctx.fillStyle=p.c;ctx.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s)}}ctx.globalAlpha=1;
  ctx.globalCompositeOperation='lighter';
  let lc=0;for(const p of G.proj){if(lc++>220)break;light(p.x,p.y,(p.wave||p.whirl?p.r*1.6:p.r*4+6)*(p.evo?1.5:1),p.evo?'#ffcc4d':p.c,0.22)}
  for(const b of G.eproj)light(b.x,b.y,b.r*4,b.c||'#ff5d6c',0.25);
  for(const x of G.fxs)if(!x.cone){const k=1-x.life/x.max;light(x.x,x.y,(x.r+(x.R-x.r)*k)*1.3,x.c,0.35*x.life/x.max)}
  for(const z of G.zones)light(z.x,z.y,z.r*1.4,z.c,0.12*Math.min(1,z.life));
  for(const b of G.beams)light((b.x1+b.x2)/2,(b.y1+b.y2)/2,40,b.c,0.3);
  for(const e of G.enemies)if(e.elite||e.miniboss||e.boss)light(e.x,e.y,e.r*3,e.boss?e.c:e.elite?'#ffcc4d':'#ff5fa2',0.18);
  light(P.x,P.y,90,P.f.c,0.16);if(G.map==='distrito'&&G.fountain.cd<=0)light(0,0,120,'#7ee081',0.2);if(G.map==='lab')for(const b of G.bombs)if(b.cd<=0)light(b.x,b.y,110,'#9fd4ff',0.18);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  ctx.textAlign='center';for(const n of G.nums){ctx.globalAlpha=Math.min(1,n.life/0.3);ctx.font=(n.cr?'700 17px ':'700 13px ')+'"Baloo 2",sans-serif';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.7)';ctx.strokeText(n.v,n.x,n.y);ctx.fillStyle=n.cr?'#ffe066':'#ffffff';ctx.fillText(n.v,n.x,n.y)}ctx.globalAlpha=1;
  ctx.restore();
  // luz e vinheta
  const vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.35,W/2,H/2,Math.max(W,H)*0.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,G.hurtT>0?'rgba(150,10,30,'+(0.35+G.hurtT)+')':(P.hp<ST.maxHp*0.3?'rgba(120,10,30,'+(0.25+0.12*Math.sin(t*6))+')':'rgba(0,0,0,.55)'));ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(G.flash>0){ctx.fillStyle='rgba(255,95,162,'+(G.flash*0.5)+')';ctx.fillRect(0,0,W,H)}
  if(G.intro){const it=G.intro,el=it.max-it.t,inA=Math.min(1,el/0.4),outA=Math.min(1,it.t/0.5),a=Math.min(inA,outA),bh=Math.round(H*0.12*a);
    ctx.fillStyle='#000';ctx.fillRect(0,0,W,bh);ctx.fillRect(0,H-bh,W,bh);
    ctx.save();ctx.globalAlpha=a;ctx.fillStyle='rgba(255,40,80,.18)';ctx.fillRect(0,H/2-70,W,140);
    ctx.fillStyle='rgba(255,93,108,.9)';for(let x=-80+((el*120)%40);x<W+80;x+=40){ctx.beginPath();ctx.moveTo(x,H/2-70);ctx.lineTo(x+20,H/2-70);ctx.lineTo(x+4,H/2-58);ctx.lineTo(x-16,H/2-58);ctx.fill();ctx.beginPath();ctx.moveTo(x,H/2+58);ctx.lineTo(x+20,H/2+58);ctx.lineTo(x+4,H/2+70);ctx.lineTo(x-16,H/2+70);ctx.fill()}
    ctx.textAlign='center';ctx.fillStyle='#ff5d6c';ctx.font='700 14px "Baloo 2",sans-serif';ctx.fillText('ALERTA · CHEFE',W/2,H/2-30);
    const sc=1+0.15*(1-inA);ctx.font='700 '+Math.round(Math.min(64,W/12)*sc)+'px "Baloo 2",sans-serif';ctx.lineWidth=6;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(it.name.toUpperCase(),W/2,H/2+18);ctx.fillStyle='#ffffff';ctx.fillText(it.name.toUpperCase(),W/2,H/2+18);
    ctx.font='600 15px Nunito,sans-serif';ctx.fillStyle='#ffb3c0';ctx.fillText(it.sub,W/2,H/2+46);ctx.restore()}
  ctx.font='600 12px Nunito,sans-serif';
  if(G.map==='distrito'){if(G.fountain.cd<=0)edgeArrow(0,0,'#7ee081')}
  else if(G.map==='periferia'){if(P.carry)edgeArrow(G.cannon.x,G.cannon.y,'#9be7ff');else for(const f of G.fuel)edgeArrow(f.x,f.y,'#39d98a')}
  else if(G.map==='lab'){for(const b of G.bombs)if(b.cd<=0)edgeArrow(b.x,b.y,'#9fd4ff')}
  for(const s of G.spires)edgeArrow(s.x,s.y,{boon:'#ffcc4d',quest:'#9b7bff',trial:'#ff5d6c'}[s.type]);
  if(G.boss&&!G.boss.dead)edgeArrow(G.boss.x,G.boss.y,'#ff5fa2');
  drawMinimap();
  if(manual){ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(mouse.x,mouse.y,9,0,TAU);ctx.moveTo(mouse.x-14,mouse.y);ctx.lineTo(mouse.x+14,mouse.y);ctx.moveTo(mouse.x,mouse.y-14);ctx.lineTo(mouse.x,mouse.y+14);ctx.stroke()}
}
function edgeArrow(x,y,c){const sx=x-P.x+W/2,sy=y-P.y+H/2;if(sx>0&&sx<W&&sy>0&&sy<H)return;const a=Math.atan2(sy-H/2,sx-W/2),R=Math.min(W,H)/2-44;
  ctx.save();ctx.translate(W/2+Math.cos(a)*R,H/2+Math.sin(a)*R);ctx.rotate(a);glowDot(0,0,14,c,0.2);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-8,-9);ctx.lineTo(-8,9);ctx.fill();ctx.restore()}
