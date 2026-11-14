/* ---------- Som (gerado por código) ---------- */
const AU={ctx:null,sfx:null,mus:null,last:{}};
function audioInit(){if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return}
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AU.ctx=new C();const m=AU.ctx.createGain();m.connect(AU.ctx.destination);
    const comp=AU.ctx.createDynamicsCompressor();comp.connect(m);AU.sfx=AU.ctx.createGain();AU.mus=AU.ctx.createGain();AU.sfx.connect(comp);AU.mus.connect(comp);applyVol()}catch(e){AU.ctx=null}}
function applyVol(){if(!AU.ctx)return;AU.sfx.gain.value=SAVE.set.sfx;AU.mus.gain.value=SAVE.set.music*0.55}
function tone(f,dur,type,vol,f2,when,dest){const a=AU.ctx,t=when||a.currentTime,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.008);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(dest||AU.sfx);o.start(t);o.stop(t+dur+0.02)}
let noiseBuf=null;
function noise(dur,vol,freq,when,dest,type){const a=AU.ctx,t=when||a.currentTime;if(!noiseBuf){noiseBuf=a.createBuffer(1,a.sampleRate,a.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const s=a.createBufferSource();s.buffer=noiseBuf;const f=a.createBiquadFilter();f.type=type||'lowpass';f.frequency.value=freq;const g=a.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(f);f.connect(g);g.connect(dest||AU.sfx);s.start(t);s.stop(t+dur+0.02)}
const SFX_GAP={shoot:0.06,kill:0.045,xp:0.04,hit:0.05,explode:0.08,hurt:0.12,pickup:0.05};
function sfx(n){if(!AU.ctx||SAVE.set.sfx<=0)return;const now=AU.ctx.currentTime,gap=SFX_GAP[n]||0;if(gap&&AU.last[n]&&now-AU.last[n]<gap)return;AU.last[n]=now;
  try{switch(n){
    case 'shoot':tone(rnd(700,900),0.05,'square',0.025,420);break;
    case 'kill':tone(rnd(260,340),0.09,'triangle',0.05,90);break;
    case 'xp':tone(rnd(1150,1500),0.04,'sine',0.025);break;
    case 'pickup':tone(660,0.06,'sine',0.05,990);break;
    case 'explode':noise(0.35,0.22,700);tone(110,0.25,'sine',0.12,40);break;
    case 'hurt':tone(220,0.16,'sawtooth',0.07,70);noise(0.08,0.06,2000);break;
    case 'level':[523,659,784,1046].forEach((f,i)=>tone(f,0.16,'triangle',0.07,null,now+i*0.07));break;
    case 'card':tone(880,0.1,'sine',0.07,null,now);tone(1320,0.18,'sine',0.06,null,now+0.08);break;
    case 'evolve':[392,523,659,784,1046,1318].forEach((f,i)=>tone(f,0.22,'triangle',0.08,null,now+i*0.06));noise(0.6,0.05,6000,now+0.3,null,'highpass');break;
    case 'ability':tone(330,0.12,'sawtooth',0.05,660);noise(0.15,0.05,3000);break;
    case 'ult':tone(160,0.5,'sawtooth',0.09,640);noise(0.5,0.08,1500);break;
    case 'freeze':[1800,2400,3000].forEach((f,i)=>tone(f,0.25,'sine',0.03,null,now+i*0.04));break;
    case 'boss':tone(70,1.4,'sawtooth',0.18,35);tone(105,1.4,'square',0.06,52);noise(1.2,0.12,400);break;
    case 'alert':for(let i=0;i<3;i++)tone(880,0.12,'square',0.05,null,now+i*0.25);break;
    case 'win':[523,659,784,1046,1318].forEach((f,i)=>tone(f,0.3,'triangle',0.09,null,now+i*0.12));break;
    case 'lose':[392,330,262,196].forEach((f,i)=>tone(f,0.35,'triangle',0.08,null,now+i*0.15));break;
    case 'ui':tone(600,0.04,'sine',0.04);break;
    case 'spire':tone(523,0.12,'sine',0.06,null,now);tone(784,0.2,'sine',0.06,null,now+0.1);break;
  }}catch(e){}}
const MUS={step:0,next:0};
const SCALES={distrito:[57,60,62,64,67,69,72,74],periferia:[50,53,55,57,60,62,65,67],lab:[52,53,55,57,59,60,62,64],praia:[48,52,54,55,57,59,62,64]};
const mtof=m=>440*Math.pow(2,(m-69)/12);
function musicTick(){if(!AU.ctx||SAVE.set.music<=0||!G||G.state==='over'||paused){MUS.next=0;return}
  const a=AU.ctx,boss=G.boss&&!G.boss.dead,bpm=boss?(G.rage?150:138):112,spb=60/bpm/4,sc=SCALES[G.map];if(MUS.next<a.currentTime)MUS.next=a.currentTime+0.05;
  while(MUS.next<a.currentTime+0.3){const s=MUS.step,bar=Math.floor(s/16)%4,root=[0,5,3,4][bar],st=s%16,t=MUS.next;
    if(st%4===0){tone(mtof(sc[root]-24),spb*3.6,'triangle',0.2,null,t,AU.mus);tone(140,0.12,'sine',0.25,45,t,AU.mus)}
    if(st%8===4)noise(0.12,0.08,1800,t,AU.mus,'bandpass');
    if(boss&&st%2===1)noise(0.04,0.03,7000,t,AU.mus,'highpass');
    if(st%2===0){const deg=root+[0,2,4,2,0,4,6,4][(st/2)%8];tone(mtof(sc[deg%8]+(deg>=8?12:0)),spb*1.7,'square',0.03,null,t,AU.mus)}
    if(G.t>BOSS_T*0.5&&st%4===2){const deg=root+4;tone(mtof(sc[deg%8]+12),spb*2,'sine',0.03,null,t,AU.mus)}
    MUS.step++;MUS.next+=spb}}
setInterval(musicTick,70);
