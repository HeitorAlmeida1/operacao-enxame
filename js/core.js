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
SAVE.tot=Object.assign({elites:0,fonte:0,minis:0,prov:0,pods:0,kills:0,imas:0},SAVE.tot||{});
SAVE.set=Object.assign({nums:true,shake:true,sfx:0.6,music:0.45},SAVE.set||{});SAVE.winsF=SAVE.winsF||{};
function save(){try{localStorage.setItem(SKEY,JSON.stringify(SAVE))}catch(e){}}

/* Migração única: o portão das passivas e os 3 espaços iniciais vieram depois.
   Quem já tinha progresso não pode ser punido por uma mudança de regra. */
if(!SAVE.mig1){
  SAVE.mig1=true;
  const d=SAVE.done||{}, t=SAVE.tot||{};
  const veterano = SAVE.gold>0 || Object.keys(d).length>0;
  // o quarto espaço era de graça; quem já jogava continua com ele
  if(veterano) SAVE.up.slot=Math.min(3,(SAVE.up.slot||0)+1);
  // devolve as passivas cujo feito a pessoa comprovadamente já fez
  if(d.evo1)                          d.p_proj=true;
  if(d.lvl15||d.lvl30)                d.p_vel=true;
  if(d.win1||d.win2||d.win3||d.win4)  d.p_regen=true;
  if((t.elites||0)>=15)               d.p_area=true;
  if((t.pods||0)>=200)                d.p_exp=true;
  SAVE.done=d;
  save();
}

let CURE=false,CUR='?',P,G,ST,cdMul=1,manual=false,paused=false,lastFighter='kira',selMap='distrito',selDiff='normal';
const keys={},mouse={x:0,y:0};
