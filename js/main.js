/* ---------- Loop e entrada ---------- */
let last=performance.now();
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;pollPad();
  if(G&&G.state==='play'&&!paused){update(dt);G.hudT-=dt;if(G.hudT<=0){G.hudT=0.08;hud()}}
  else if(G&&G.state==='choice')choiceTick(dt);
  draw();requestAnimationFrame(frame)}
requestAnimationFrame(frame);

/* 30 s para escolher; no fim, a primeira carta é escolhida sozinha */
function choiceTick(dt){
  if(G.choiceT===undefined)return;
  G.choiceT=Math.max(0,G.choiceT-dt);
  const el=$('choiceTimer');
  el.firstElementChild.style.width=(G.choiceT/30*100)+'%';
  el.classList.toggle('urgent',G.choiceT<=5);
  if(G.choiceT<=0&&curOpts.length)pick(curOpts[0]);
}
function setPause(v){if(!G||G.state==='over')return;if(G.state==='choice'&&v)return;paused=v;$('pause').hidden=!v}
addEventListener('keydown',e=>{
  if(['Tab','Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  audioInit();
  if(rebinding){if(e.code!=='Escape'){for(const a in SAVE.keys)if(SAVE.keys[a]===e.code)SAVE.keys[a]=SAVE.keys[rebinding];SAVE.keys[rebinding]=e.code;save()}rebinding=null;renderOptions();e.preventDefault();return}
  keys[e.code]=true;if(e.repeat)return;
  if(G&&G.state==='choice'){const i=['Digit1','Digit2','Digit3'].indexOf(e.code);if(i>=0&&curOpts[i])pick(curOpts[i]);return}
  if(e.code===SAVE.keys.E)useAbility('E');if(e.code===SAVE.keys.R)useAbility('R');
  if(e.code===SAVE.keys.aim&&G&&G.state==='play'){manual=!manual;hud()}
  if((e.code===SAVE.keys.pause||e.code==='Escape')&&G&&G.state==='play'&&$('options').hidden)setPause(!paused);
  if(e.code==='Tab'&&G&&G.state!=='over'){renderLegend();$('legend').hidden=false}});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Tab')$('legend').hidden=true});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;$('legend').hidden=true;if(G&&G.state==='play')setPause(true)});
addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});
$('resume').onclick=()=>setPause(false);
$('pauseOpt').onclick=()=>openOptions('pause');$('openOpt').onclick=()=>openOptions('start');
$('optBack').onclick=()=>{rebinding=null;$('options').hidden=true;if(optReturn==='start')showStart();else $('pause').hidden=false};
$('keyReset').onclick=()=>{SAVE.keys=Object.assign({},DEFKEYS);save();renderOptions()};
$('optTut').onclick=()=>{SAVE.tut=false;save();$('optTut').textContent='Tutorial volta na próxima partida'};
$('openRec').onclick=()=>{renderRec();$('start').hidden=true;$('records').hidden=false};$('recBack').onclick=()=>{$('records').hidden=true;showStart()};
document.addEventListener('click',e=>{audioInit();if(e.target&&e.target.closest&&e.target.closest('button'))sfx('ui')},true);
$('quit').onclick=()=>{paused=false;bankGold();G=null;showStart()};
$('again').onclick=()=>newGame(lastFighter);
$('menu').onclick=()=>{G=null;showStart()};
$('openUp').onclick=()=>{renderUp();$('start').hidden=true;$('upgrades').hidden=false};
$('upBack').onclick=()=>{$('upgrades').hidden=true;showStart()};
$('openObj').onclick=()=>{renderObj();$('start').hidden=true;$('objectives').hidden=false};
$('objBack').onclick=()=>{$('objectives').hidden=true;showStart()};

function renderLegend(){
  const tb=$('legBody');tb.innerHTML='';
  for(const id in WEAPONS){
    const d=WEAPONS[id],tr=document.createElement('tr');
    tr.innerHTML='<td></td><td></td><td class="g"></td>';
    tr.children[0].textContent=d.n+(d.sig?' ('+FIGHTERS[d.sig].n+')':'');
    tr.children[1].textContent=PASSIVES[d.evo].n;
    tr.children[2].textContent=d.evoN;
    // em destaque: arma que você tem, no nível 5, com a passiva certa
    if(G&&P){const w=P.weapons.find(x=>x.id===id);
      if(w&&!w.evo&&w.lvl>=5&&(P.pas[d.evo]||0)>0)tr.className='have'}
    tb.appendChild(tr);
  }
  const sb=$('statBody');if(!sb)return;sb.innerHTML='';
  if(!G||!P||!ST){sb.textContent='Entre numa partida para ver os status.';return}
  const pct=v=>Math.round(v*100)+'%';
  const linhas=[
    ['Dano',pct(ST.dmg)],
    ['Aceleração',Math.round(ST.haste)],
    ['Área',pct(ST.area)],
    ['Duração',pct(ST.dur)],
    ['Crítico',pct(ST.crit)],
    ['Projéteis extras',ST.proj],
    ['Velocidade',Math.round(ST.spd)],
    ['Vida máxima',ST.maxHp],
    ['Armadura',Math.round(ST.armor)],
    ['Regeneração',ST.regen.toFixed(1)+'/s'],
    ['Raio de coleta',Math.round(ST.pick)],
    ['Ganho de EXP',pct(ST.xp)],
    ['Ganho de ouro',pct(ST.gold)],
  ];
  for(const [a,b] of linhas){
    const r=document.createElement('div');r.className='statrow';
    r.innerHTML='<span></span><span></span>';
    r.firstChild.textContent=a;r.lastChild.textContent=b;sb.appendChild(r);
  }
}
renderLegend();

function renderUp(){$('upGold').textContent=SAVE.gold;const l=$('upList');l.innerHTML='';
  for(const k in UPG){const u=UPG[k],lv=SAVE.up[k]||0,row=document.createElement('div');row.className='row';
    row.innerHTML='<div class="grow"><span class="t1"></span><span class="t2"></span></div><button class="btn"></button>';
    row.querySelector('.t1').textContent=u.n+' · '+lv+'/'+u.max;row.querySelector('.t2').textContent=u.d;const b=row.querySelector('button');
    if(lv>=u.max){b.textContent='Máximo';b.disabled=true}else{const c=upCost(k);b.textContent='Comprar · '+c;b.disabled=SAVE.gold<c;
      b.onclick=()=>{if(SAVE.gold<c)return;SAVE.gold-=c;SAVE.up[k]=lv+1;save();renderUp()}}
    l.appendChild(row)}}
function renderObj(){const l=$('objList');l.innerHTML='';
  for(const o of OBJ){const row=document.createElement('div');row.className='row'+(SAVE.done[o.id]?' done':'');
    row.innerHTML='<div class="grow"><span class="t1"></span><span class="t2"></span></div>';
    let prog='';if(o.k&&!SAVE.done[o.id])prog=' ('+Math.min(o.n,SAVE.tot[o.k]||0)+'/'+o.n+')';
    row.querySelector('.t1').textContent=o.d+prog;row.querySelector('.t2').textContent='Recompensa: '+o.r;l.appendChild(row)}}
const reqText=id=>{const o=OBJ.find(x=>x.id===id);return 'Bloqueado: '+o.d.charAt(0).toLowerCase()+o.d.slice(1)};

function showStart(){['end','pause','choice','legend','upgrades','objectives','options','records','tip'].forEach(i=>$(i).hidden=true);['top','left','right','abil','xp','aimMode'].forEach(i=>$(i).hidden=true);
  $('start').hidden=false;$('startGold').textContent=SAVE.gold;$('title').hidden=!SAVE.done.extremo;
  if(MAPS[selMap].req&&!SAVE.done[MAPS[selMap].req])selMap='distrito';if(DIFF[selDiff].req&&!SAVE.done[DIFF[selDiff].req])selDiff='normal';
  const ms=$('mapSel');ms.innerHTML='';
  for(const id in MAPS){const m=MAPS[id],b=document.createElement('button'),lock=m.req&&!SAVE.done[m.req];b.className=id===selMap?'on':'';b.disabled=!!lock;
    b.innerHTML='<span></span><small></small>';b.firstChild.textContent=m.n;b.lastChild.textContent=lock?reqText(m.req).replace('Bloqueado: ',''):m.mech+' · '+m.boss;b.onclick=()=>{selMap=id;showStart()};ms.appendChild(b)}
  const ds=$('diffSel');ds.innerHTML='';
  for(const id in DIFF){const m=DIFF[id],b=document.createElement('button'),lock=m.req&&!SAVE.done[m.req];b.className=id===selDiff?'on':'';b.disabled=!!lock;
    b.innerHTML='<span></span><small></small>';b.firstChild.textContent=m.n;b.lastChild.textContent=lock?reqText(m.req).replace('Bloqueado: ',''):m.s;b.onclick=()=>{selDiff=id;showStart()};ds.appendChild(b)}
  const box=$('fighters');box.innerHTML='';
  for(const id in FIGHTERS){const f=FIGHTERS[id],b=document.createElement('button'),lock=f.lock&&!SAVE.done[f.lock];b.className='card fighter';b.disabled=!!lock;
    b.innerHTML=`<span class="tag"></span><span class="nm"><img class="ico big" alt=""><span></span></span><ul><li><b>Arma:</b> <span class="a"></span></li><li><b>Escala com:</b> <span class="s"></span></li><li><b>Passiva:</b> <span class="p"></span></li><li><b>E:</b> <span class="e"></span></li><li><b>R:</b> <span class="r"></span></li></ul>${lock?'<span class="lockmsg"></span>':''}`;
    b.querySelector('.tag').textContent=f.t;b.querySelector('img').src=iconURL('f:'+id);b.querySelector('.nm span:last-child').textContent=f.n;
    b.querySelector('.a').textContent=WEAPONS[f.sig].n;b.querySelector('.s').textContent=f.stat+' (evolui a arma)';b.querySelector('.p').textContent=f.pas;
    b.querySelector('.e').textContent=f.E.n+'. '+f.E.d;b.querySelector('.r').textContent=f.R.n+'. '+f.R.d;if(lock)b.querySelector('.lockmsg').textContent=reqText(f.lock);
    b.onclick=()=>{if(!lock)newGame(id)};box.appendChild(b)}}
showStart();
