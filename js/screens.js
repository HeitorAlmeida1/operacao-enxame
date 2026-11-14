/* ---------- Tutorial ---------- */
let tipT=0;
function tip(key,text){if(!G||!G.tut||G.tips[key])return;G.tips[key]=1;const el=$('tip');el.textContent=text;el.hidden=false;clearTimeout(tipT);tipT=setTimeout(()=>{el.hidden=true},7500)}
function tutUpdate(){if(!G.tut)return;
  if(G.t>0.5)tip('move','Ande com '+keyName(SAVE.keys.up)+keyName(SAVE.keys.left)+keyName(SAVE.keys.down)+keyName(SAVE.keys.right)+' ou pelo controle. Suas armas atiram sozinhas.');
  if(G.t>9)tip('xp','Pegue os cristais azuis que os inimigos soltam para subir de nível.');
  if(P.lvl>=3)tip('e','Sua habilidade '+keyName(SAVE.keys.E)+' está liberada. No nível 6 vem a ultimate ('+keyName(SAVE.keys.R)+').');
  if(G.enemies.some(e=>e.elite))tip('elite','Elites dourados soltam Cartões de Acesso. É com eles que as armas evoluem.');
  if(G.spires.length)tip('spire','Torres apareceram! Fique dentro do círculo para ativá-las. As setas na borda da tela mostram onde estão.');
  if(G.t>45)tip('tab','Segure Tab para ver qual passiva evolui cada arma.');
  if(G.t>150&&!SAVE.tut){SAVE.tut=true;save()}}

/* ---------- Recordes ---------- */
SAVE.rec=Object.assign({runs:0,wins:0,bestLvl:0,bestKills:0,bestDmg:0,fastest:{}},SAVE.rec||{});
function recordRun(win){const r=SAVE.rec,dmg=Object.values(G.dmgBy).reduce((a,b)=>a+b,0);r.runs++;if(win)r.wins++;r.bestLvl=Math.max(r.bestLvl,P.lvl);r.bestKills=Math.max(r.bestKills,G.kills);r.bestDmg=Math.max(r.bestDmg,Math.round(dmg));
  if(win){const k=G.map+'|'+G.diff;if(!r.fastest[k]||G.t<r.fastest[k].t)r.fastest[k]={t:Math.round(G.t),f:P.fid}}save()}
const bigNum=v=>v>=1e6?(v/1e6).toFixed(1)+' mi':v>=1e3?(v/1e3).toFixed(1)+' mil':String(Math.round(v));
function renderRec(){const r=SAVE.rec,l=$('recList');l.innerHTML='';const add=(a,b)=>{const row=document.createElement('div');row.className='row';row.innerHTML='<div class="grow"><span class="t1"></span></div><span class="gold"></span>';row.querySelector('.t1').textContent=a;row.querySelector('.gold').textContent=b;l.appendChild(row)};
  add('Partidas jogadas',r.runs);add('Vitórias',r.wins);add('Maior nível',r.bestLvl);add('Mais abates numa partida',r.bestKills);add('Mais dano numa partida',bigNum(r.bestDmg));add('Ouro guardado',SAVE.gold);
  for(const m in MAPS)for(const d in DIFF){const v=r.fastest[m+'|'+d];if(v)add('Vitória mais rápida · '+MAPS[m].n+' · '+DIFF[d].n,fmt(v.t)+' com '+FIGHTERS[v.f].n)}}

/* ---------- Opções ---------- */
let optReturn='start';
function openOptions(from){optReturn=from;$(from).hidden=true;renderOptions();$('options').hidden=false}
function renderOptions(){
  for(const [id,k] of [['volSfx','sfx'],['volMus','music']]){const el=$(id);el.value=Math.round(SAVE.set[k]*100);el.oninput=()=>{SAVE.set[k]=el.value/100;applyVol();save();if(k==='sfx')sfx('ui')}}
  for(const [id,k,t] of [['optNums','nums','Números de dano'],['optShake','shake','Tremor de tela'],['optJuice','juice','Impacto no golpe']]){const b=$(id);b.textContent=t+': '+(SAVE.set[k]?'ligado':'desligado');b.setAttribute('aria-pressed',SAVE.set[k]?'true':'false');b.onclick=()=>{SAVE.set[k]=!SAVE.set[k];save();renderOptions()}}
  const l=$('keyList');l.innerHTML='';for(const a in ACTIONS){const row=document.createElement('div');row.className='row';row.innerHTML='<div class="grow"><span class="t1"></span></div><button class="btn"></button>';
    row.querySelector('.t1').textContent=ACTIONS[a];const b=row.querySelector('button');b.textContent=rebinding===a?'Aperte uma tecla…':keyName(SAVE.keys[a]);b.onclick=()=>{rebinding=a;renderOptions()};l.appendChild(row)}
  $('padNote').textContent=PAD.on?'Controle conectado: analógico esquerdo anda, direito mira, A/LT = E, B/RT = R, Start pausa.':'Controle (gamepad): conecte e aperte qualquer botão. Analógico esquerdo anda, direito mira, A/LT = E, B/RT = R, Start pausa.'}
