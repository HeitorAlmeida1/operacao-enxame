const cv=document.getElementById('c');let ctx=cv.getContext('2d');
let W=0,H=0;
function resize(){const d=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',resize);resize();

const TAU=Math.PI*2, BOSS_T=900, RAGE_T=1200;
const rnd=(a,b)=>a+Math.random()*(b-a);
const d2=(a,b)=>{const x=a.x-b.x,y=a.y-b.y;return x*x+y*y};
const $=id=>document.getElementById(id);
const fmt=t=>{t=Math.max(0,Math.floor(t));return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function segDist2(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1;let t=((px-x1)*dx+(py-y1)*dy)/l;t=Math.max(0,Math.min(1,t));const ex=x1+t*dx-px,ey=y1+t*dy-py;return ex*ex+ey*ey}

/* ---------- Progresso salvo ---------- */
const SKEY='operacaoEnxame.v2';
let SAVE={gold:0,up:{},done:{},tot:{}};
try{const s=JSON.parse(localStorage.getItem(SKEY));if(s)SAVE=Object.assign(SAVE,s)}catch(e){}
SAVE.tot=Object.assign({elites:0,fonte:0,minis:0,prov:0,pods:0,kills:0},SAVE.tot||{});
SAVE.set=Object.assign({nums:true,shake:true,sfx:0.6,music:0.45},SAVE.set||{});SAVE.winsF=SAVE.winsF||{};
function save(){try{localStorage.setItem(SKEY,JSON.stringify(SAVE))}catch(e){}}

let CURE=false,CUR='?',P,G,ST,cdMul=1,manual=false,paused=false,lastFighter='kira',selMap='distrito',selDiff='normal';
const keys={},mouse={x:0,y:0};
