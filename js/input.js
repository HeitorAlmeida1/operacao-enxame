/* ---------- Controles: teclas e controle ---------- */
const ACTIONS={up:'Andar para cima',down:'Andar para baixo',left:'Andar para a esquerda',right:'Andar para a direita',E:'Habilidade (E)',R:'Ultimate (R)',aim:'Trocar mira',pause:'Pausar'};
const DEFKEYS={up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD',E:'KeyE',R:'KeyR',aim:'KeyC',pause:'KeyP'};
SAVE.keys=Object.assign({},DEFKEYS,SAVE.keys||{});
const ARROW={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
const bind=a=>!!(keys[SAVE.keys[a]]||(ARROW[a]&&keys[ARROW[a]]));
const keyName=c=>c.replace(/^Key/,'').replace(/^Digit/,'').replace('Space','Espaço').replace('ShiftLeft','Shift').replace('ShiftRight','Shift dir.').replace('ArrowUp','↑').replace('ArrowDown','↓').replace('ArrowLeft','←').replace('ArrowRight','→');
let rebinding=null;
const PAD={mx:0,my:0,aim:null,prev:[],sel:0,on:false};
function pollPad(){let gp=null;try{gp=navigator.getGamepads&&navigator.getGamepads()[0]}catch(e){}if(!gp){PAD.mx=PAD.my=0;PAD.aim=null;PAD.on=false;return}PAD.on=true;
  const dz=v=>Math.abs(v)<0.25?0:v;PAD.mx=dz(gp.axes[0]||0);PAD.my=dz(gp.axes[1]||0);const b=gp.buttons.map(x=>x&&x.pressed),pr=i=>b[i]&&!PAD.prev[i];
  if(b[12])PAD.my=-1;if(b[13])PAD.my=1;if(b[14])PAD.mx=-1;if(b[15])PAD.mx=1;
  const ax=gp.axes[2]||0,ay=gp.axes[3]||0;PAD.aim=Math.hypot(ax,ay)>0.45?Math.atan2(ay,ax):null;
  if(G&&G.state==='choice'){if(pr(14)||pr(4))PAD.sel=Math.max(0,PAD.sel-1);if(pr(15)||pr(5))PAD.sel=Math.min(curOpts.length-1,PAD.sel+1);
    const bt=$('choiceCards').querySelectorAll('button');if(bt[PAD.sel]&&bt[PAD.sel].focus)bt[PAD.sel].focus();if(pr(0)&&curOpts[PAD.sel])pick(curOpts[PAD.sel])}
  else if(G&&G.state==='play'){if(pr(9))setPause(!paused);else if(paused){if(pr(0)||pr(1))setPause(false)}else{if(pr(0)||pr(6))useAbility('E');if(pr(1)||pr(7))useAbility('R')}}
  else if(G&&G.state==='over'){if(pr(0))newGame(lastFighter)}
  PAD.prev=b}
