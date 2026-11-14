/* ---------- Fim ---------- */
function bankGold(){if(G.banked)return;G.banked=true;SAVE.gold+=Math.round(G.gold);addTot('kills',G.kills);save()}
function endScreen(win){G.state='over';$('tip').hidden=true;recordRun(win);sfx(win?'win':'lose');['top','left','right','abil','xp','aimMode'].forEach(i=>$(i).hidden=true);
  if(win){complete({distrito:'win1',periferia:'win2',lab:'win3',praia:'win4'}[G.map]);if(G.diff!=='normal')complete('hard');if(G.diff!=='normal'&&G.map==='praia')complete('hard4');if(G.diff==='extremo')complete('extremo');if(G.map==='distrito'&&G.diff!=='normal')complete('win1h');if(G.rage)complete('furia');if(!SAVE.winsF[P.fid]){SAVE.winsF[P.fid]=1;SAVE.tot.winsF=Object.keys(SAVE.winsF).length;if(SAVE.tot.winsF>=9)complete('todos');save()}}
  bankGold();
  $('endTitle').textContent=win?'Vitória!':'Derrota';
  $('endText').textContent=win?'Você derrotou '+MAPS[G.map].boss+'. Gaste o ouro em Melhorias e confira os Objetivos.':'As hordas do Vazio te pegaram, mas o ouro da partida ficou guardado.';
  $('endStats').innerHTML='';[['Tempo',fmt(G.t)],['Nível',P.lvl],['Abates',G.kills],['Evoluções',P.weapons.filter(w=>w.evo).length],['Ouro',Math.round(G.gold)]].forEach(([a,b])=>{const d=document.createElement('div');d.innerHTML='<span></span><small></small>';d.firstChild.textContent=b;d.lastChild.textContent=a;$('endStats').appendChild(d)});
  const dl=$('dmgList');dl.innerHTML='';const ent=Object.entries(G.dmgBy).filter(([k,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,9),mx=ent.length?ent[0][1]:1;
  for(const [k,v] of ent){const w=P.weapons.find(x=>x.id===k);const nm=WEAPONS[k]?(w&&w.evo?WEAPONS[k].evoN:WEAPONS[k].n):({E:'Habilidade E · '+P.f.E.n,R:'Ultimate · '+P.f.R.n,cmd:'Comandante',mapa:'Mecânica do mapa',campo:'Campo Radiante',trem:'Trem Expresso'}[k]||'Outros');
    const row=document.createElement('div');row.className='dmg';row.innerHTML='<b></b><div class="bg"><i></i></div><span></span>';row.querySelector('b').textContent=nm;row.querySelector('i').style.width=(v/mx*100)+'%';row.querySelector('span').textContent=v>=1e6?(v/1e6).toFixed(1)+' mi':v>=1e3?(v/1e3).toFixed(1)+' mil':Math.round(v);dl.appendChild(row)}
  setTimeout(()=>{$('end').hidden=false},win?900:500)}
function victory(){if(G.state!=='over')endScreen(true)}
function defeat(){if(G.state!=='over')endScreen(false)}

/* ---------- HUD ---------- */
let bannerT=0;
function banner(t){const b=$('banner');b.textContent=t;b.style.opacity=1;clearTimeout(bannerT);bannerT=setTimeout(()=>b.style.opacity=0,2600)}
function pipsHTML(n,cls){return '<span class="pips'+(cls?' '+cls:'')+'">'+[1,2,3,4,5].map(i=>`<span class="${i<=n?'on':''}"></span>`).join('')+'</span>'}
function hud(){
  $('timer').textContent=fmt(G.t);
  if(!G.bossSpawned)$('bossNote').textContent=MAPS[G.map].boss+' em '+fmt(BOSS_T-G.t);
  else if(G.boss){$('bossBar').firstElementChild.style.width=Math.max(0,G.boss.hp/G.boss.max*100)+'%';if(G.boss.p2)$('bossNote').textContent=MAPS[G.map].boss+' · 2ª fase'}
  const qt=G.quest?'Missão: '+G.quest.got+'/'+G.quest.need+' · '+Math.ceil(G.quest.t)+' s':G.trial?'Provação: fique no círculo · '+Math.ceil(G.trial.t)+' s':'';
  $('quest').hidden=!qt;$('quest').textContent=qt;
  $('lvl').textContent='Nível '+P.lvl;$('hpTxt').textContent=Math.ceil(P.hp)+'/'+ST.maxHp;
  if(!G.faceSet){G.faceSet=true;$('pFace').src=iconURL('f:'+P.fid);$('fname').textContent=P.f.n+' · '+P.f.t;
    $('animaMark').hidden=(SAVE.up.anima||0)<100}
  $('hpBar').firstElementChild.style.width=(P.hp/ST.maxHp*100)+'%';$('shBar').style.width=Math.min(100,P.shield/ST.maxHp*100)+'%';
  $('kills').textContent=G.kills+' abates';$('goldTxt').textContent=Math.round(G.gold)+' ouro';$('xp').firstElementChild.style.width=(P.xp/P.xpNext*100)+'%';
  $('aimMode').textContent='Mira: '+(manual?'mouse':'automática')+' (C)'+(P.carry?' · carregando célula':'');
  for(const [k,lv,cd,max] of [['E',3,P.eCd,P.f.E.cd*cdMul],['R',6,P.rCd,P.f.R.cd*cdMul*(P.aug.ult?0.5:1)]]){const el=$('ab'+k);
    el.classList.toggle('lock',P.lvl<lv);el.classList.toggle('ready',P.lvl>=lv&&cd<=0);
    el.querySelector('.cd').style.height=(P.lvl<lv?100:Math.min(100,cd/max*100))+'%';el.querySelector('.t').textContent=P.lvl<lv?'Nv '+lv:(cd>0?Math.ceil(cd):'')}
  if(G.invDirty){G.invDirty=false;const r=$('right');r.innerHTML='';const H4=t=>{const h=document.createElement('h4');h.textContent=t;r.appendChild(h)};
    H4('Armas ('+P.weapons.length+'/5)');
    for(const w of P.weapons){const d=WEAPONS[w.id],row=document.createElement('div');row.className='inv';row.innerHTML='<img class="ico s" alt=""><b></b>'+pipsHTML(w.lvl);row.querySelector('img').src=iconURL('w:'+w.id);
      const b=row.querySelector('b');b.textContent=w.evo?'★ '+d.evoN:d.n;if(w.evo)b.className='evo';r.appendChild(row);
      if(!w.evo){const ok=(P.pas[d.evo]||0)>0,n=document.createElement('div');n.className='need'+(ok&&w.lvl>=5?' ready':'');
        n.textContent=(ok&&w.lvl>=5?'★ pronta — pegue um Cartão':'evolui com '+PASSIVES[d.evo].n+(ok?' ✓':''));r.appendChild(n)}}
    H4('Passivas ('+Object.keys(P.pas).length+'/'+slots()+')');
    for(const id in P.pas){const row=document.createElement('div');row.className='inv';row.innerHTML='<img class="ico s" alt=""><b></b>'+pipsHTML(P.pas[id],'p');row.querySelector('img').src=iconURL('p:'+id);row.querySelector('b').textContent=PASSIVES[id].n;r.appendChild(row)}
    const ak=Object.keys(P.aug),ab=$('augs');ab.innerHTML='';ab.hidden=!ak.length;
    if(ak.length){const h=document.createElement('div');h.className='ahead';h.textContent='Aprimoramentos';ab.appendChild(h);
      for(const id of ak){const row=document.createElement('div');row.className='augchip';row.innerHTML='<img class="ico s" alt=""><span></span>';row.firstChild.src=iconURL('aug');row.lastChild.textContent=AUGS[id].n;ab.appendChild(row)}}}
}

