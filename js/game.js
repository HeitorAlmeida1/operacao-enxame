/* ---------- Partida ---------- */
function xpNext(l){return Math.floor(5+l*5+Math.pow(l,1.75))}
function newGame(fid){
  lastFighter=fid;const f=FIGHTERS[fid];
  P={x:0,y:240,r:14,hp:100,lastMax:100,f,fid,face:-Math.PI/2,weapons:[{id:f.sig,lvl:1,evo:false,cd:0.3,st:{}}],pas:{},aug:{},collected:0,lvl:1,xp:0,xpNext:xpNext(1),eCd:0,rCd:0,shield:0,shieldT:0,invuln:0,buffs:[],killsP:0,pickP:0,atkT:0,spA:0,spCd:1,carry:false,moving:false,dash:null};
  G={t:0,map:selMap,diff:selDiff,enemies:[],proj:[],eproj:[],zones:[],marks:[],lines:[],hazards:[],orbs:[],cards:[],fxs:[],timers:[],explQ:[],beams:[],bolts:[],spires:[],fuel:[],pods:[],feathers:[],trains:[],walls:[],tents:[],rings:[],intro:null,
     spawnAcc:0,eliteNext:40,miniNext:150,spireNext:60,spireType:0,fuelNext:30,podNext:3,imaT:45,kills:0,gold:0,boss:null,bossSpawned:false,rage:false,quest:null,trial:null,sea:null,flash:0,pendLv:0,pendCard:0,pendAug:0,state:'play',
     fountain:{x:0,y:0,r:70,charge:0,cd:0},cannon:{x:0,y:0,r:70,active:0,tick:0},bombs:[{x:-MAPS[selMap].rad*0.45,y:-MAPS[selMap].rad*0.2,r:60,charge:0,cd:0},{x:MAPS[selMap].rad*0.45,y:MAPS[selMap].rad*0.2,r:60,charge:0,cd:0}],
     cmd:{x:60,y:180,cd:1,storm:15,a:0},tut:!SAVE.tut,tips:{},parts:[],nums:[],shake:0,hurtT:0,dmgBy:{},maxKillsRun:0,invDirty:true,hudT:0};
  ST=stats();P.hp=ST.maxHp;P.lastMax=ST.maxHp;manual=false;paused=false;
  ['start','end','pause','choice','upgrades','objectives','options','records'].forEach(i=>$(i).hidden=true);audioInit();MUS.step=0;
  ['top','left','right','abil','xp','aimMode'].forEach(i=>$(i).hidden=false);
  $('bossBar').hidden=true;$('quest').hidden=true;
  $('abE').querySelector('.n').textContent=f.E.n;$('abR').querySelector('.n').textContent=f.R.n;
  banner(MAPS[G.map].n+' · '+DIFF[G.diff].n);
}
const diffMul=()=>DIFF[G.diff];

function damage(e,amt){if(e.dead)return;let m=ST.dmg;e.critT=Math.min(e.critT||0,0.1);if(Math.random()<ST.crit){m*=2;e.critT=0.12}
  if(P.aug.perto||P.aug.longe){const d=Math.sqrt(d2(e,P));if(P.aug.perto)m*=1+0.3*Math.max(0,1-d/300);if(P.aug.longe)m*=1+0.3*Math.min(1,d/450)}
  if(P.aug.elite&&(e.elite||e.boss||e.miniboss))m*=1.3;
  if(e.tough)m*=e.tough;if(P.fid==='rivka'){const dd=Math.sqrt(d2(e,P));m*=1+0.25*Math.max(0,1-dd/250)}
  const v=amt*m;if(P.fid==='rivka'&&v<1e8){P.shield=Math.min(0.3*ST.maxHp,P.shield+v*0.01);P.shieldT=Math.max(P.shieldT,2)}G.dmgBy[CUR]=(G.dmgBy[CUR]||0)+Math.min(v,Math.max(0,e.hp));
  if(SAVE.set.nums&&v>=1&&v<1e8&&G.nums.length<45&&(e.boss?Math.random()<0.5:e.critT>0.11&&Math.random()<0.6))G.nums.push({x:e.x+rnd(-10,10),y:e.y-e.r-4,v:Math.round(v),cr:e.critT>0.11,life:0.8});
  e.hp-=v;e.hitT=0.08;if(e.hp<=0)kill(e)}
function push(e,fx_,fy,f){if(e.boss)return;const dx=e.x-fx_,dy=e.y-fy,d=Math.hypot(dx,dy)||1;e.kx+=dx/d*f;e.ky+=dy/d*f}
function fx(x,y,r,R,c,life){G.fxs.push({x,y,r,R,c,life,max:life})}
function explode(x,y,r,dm,c,missing){fx(x,y,r*0.2,r,c,0.35);burst(x,y,c,r>100?14:5,r*2);if(r>110){shakeIt(5);sfx('explode')}
  for(const e of G.enemies){if(e.dead)continue;const rr=r+e.r;if((e.x-x)**2+(e.y-y)**2<rr*rr)damage(e,missing?dm*(1+(1-e.hp/e.max)):dm)}}
function dropGold(x,y,v){G.orbs.push({x:x+rnd(-6,6),y:y+rnd(-6,6),gold:Math.max(1,Math.round(v))})}
function kill(e){
  if(e.boss&&e.kind==='mare'&&!e.p2){e.p2=true;const dm=diffMul(),mm=MAPS[G.map].mul;shakeIt(12);e.max=e.hp=10000*dm.hp*mm*2.2;e.r=72;e.spd=90;e.slash=1.5;e.summon=4;
    G.sea={x:-mapRad()-200,to:mapRad()*0.75,t:0};fx(e.x,e.y,20,260,'#5fa8ff',0.8);banner('Segunda fase! A maré está subindo');return}
  e.dead=true;G.kills++;if(!e.boss)sfx('kill');smoke(e.x,e.y,e.r,e.c);burst(e.x,e.y,e.c,e.boss?50:(e.elite||e.miniboss)?16:3);if(e.elite||e.miniboss)shakeIt(4);if(G.kills>=1000)complete('mil');
  if(G.quest)G.quest.got++;
  for(const b of P.buffs){if(b.lifeOnKill)P.hp=Math.min(ST.maxHp,P.hp+b.lifeOnKill);if(b.goldOnKill&&Math.random()<0.3)dropGold(e.x,e.y,1)}
  if(e.boss){fx(e.x,e.y,20,300,'#ff8fb8',1);G.gold+=Math.round(250*ST.gold);victory();return}
  G.orbs.push({x:e.x,y:e.y,v:(e.elite?15:e.xpv)*(e.bonus?4:1)});
  if(e.bonus&&Math.random()<0.15)dropGold(e.x,e.y,2*ST.gold);
  if(e.elite||e.miniboss){G.cards.push({x:e.x,y:e.y});fx(e.x,e.y,10,80,'#ffcc4d',0.5);dropGold(e.x,e.y,(e.miniboss?30:15)*ST.gold);
    if(e.miniboss)addTot('minis',1);else addTot('elites',1);
    if(P.aug.elite)addMark({x:e.x,y:e.y,r:110*ST.area,t:0.8,max:0.8,dmg:60+5*P.lvl,c:'#ff9a3d'})}
  if(Math.random()<0.025+(P.aug.impostos?0.04:0))dropGold(e.x,e.y,rnd(1,3)*ST.gold);
  if(Math.random()<(P.aug.peixe?0.04:0.006))G.orbs.push({x:e.x+10,y:e.y,heal:true});
  const cw=P.weapons.find(w=>w.id==='campo'&&w.evo);
  if(cw){const R=auraR(cw);if(d2(e,P)<R*R)G.explQ.push({x:e.x,y:e.y,r:45*ST.area,dmg:0.15*ST.maxHp})}
  if(P.fid==='kira'&&++P.killsP>=60){P.killsP=0;P.buffs.push({t:6,spd:0.35,haste:40});fx(P.x,P.y,14,90,'#4fe3d6',0.5)}
}
function takeDamage(a){if(P.invuln>0||G.state!=='play')return;a*=100/(100+Math.max(0,ST.armor))*(1-ST.dr);
  if(P.shield>0){const s=Math.min(P.shield,a);P.shield-=s;a-=s}P.hp-=a;if(a>1){G.hurtT=0.2;sfx('hurt');shakeIt(Math.min(9,2+a/5))}if(P.hp<=0){P.hp=0;defeat()}}

function addEnemy(type,elite,x,y,mini){const b=TYPES[type],dm=diffMul(),hm=(1+G.t/150)*(elite?14:1)*dm.hp*MAPS[G.map].mul;
  if(x===undefined){const D=Math.hypot(W,H)/2+50;let a=Math.random()*TAU,ok=false;
    for(let i=0;i<12&&!ok;i++){x=P.x+Math.cos(a)*D;y=P.y+Math.sin(a)*D;if(inWorld(x,y,10))ok=true;else a+=TAU/12}
    if(!ok){const p=spotNear(P.x,P.y,D*0.6,D,10);x=p.x;y=p.y}}
  const e={x,y,r:b.r*(elite?1.7:1),hp:b.hp*hm,max:b.hp*hm,spd:b.spd*(elite?0.85:1)*(1+G.t/2700),
    dmg:b.dmg*(1+G.t/720)*(elite?1.5:1)*dm.dmg,c:b.c,type,elite,miniboss:!!mini,ranged:b.ranged,blink:b.blink,bomb:b.bomb,tough:b.tough,leap:b.leap,bt:rnd(1,3),lt:0,shootT:rnd(1,3),slamT:4,xpv:b.xp,kx:0,ky:0,slowT:0,frozenT:0,hitT:0};
  G.enemies.push(e);return e}
function spawnBoss(){G.bossSpawned=true;const a=Math.random()*TAU,dm=diffMul(),mm=MAPS[G.map].mul;
  const b={distrito:{kind:'rainha',r:46,hp:7000,spd:72,dmg:40,c:'#e0457b'},periferia:{kind:'colosso',r:62,hp:9000,spd:55,dmg:50,c:'#3fbf7f'},
    lab:{kind:'devoradora',r:52,hp:9000,spd:80,dmg:45,c:'#9b4dff'},praia:{kind:'mare',r:58,hp:9000,spd:65,dmg:50,c:'#3f8cff'}}[G.map];
  const bp=spotNear(P.x,P.y,380,460,120);
  G.boss=Object.assign({boss:true,x:bp.x,y:bp.y,atk:2,dash:5,slam:3,summon:6,pools:3,slash:2,half:false,teleT:0,dashT:0,dvx:0,dvy:0,kx:0,ky:0,slowT:0,frozenT:0,hitT:0},b);
  G.boss.hp*=dm.hp*mm*2.2;G.boss.max=G.boss.hp;G.boss.dmg*=dm.dmg;
  G.enemies.push(G.boss);$('bossBar').hidden=false;$('bossNote').textContent=MAPS[G.map].boss;
  G.intro={t:3.4,max:3.4,name:MAPS[G.map].boss,sub:{distrito:'A senhora das hordas',periferia:'O punho da terra primordial',lab:'A fome que não acaba',praia:'O dono do mar escuro'}[G.map]};P.invuln=Math.max(P.invuln,2);shakeIt(14);sfx('alert');setTimeout(()=>sfx('boss'),700)}

function spawn(dt){const t=G.t,rate=t<BOSS_T?Math.min(16,1.4+t*0.016):6;G.spawnAcc+=rate*dt;
  while(G.spawnAcc>=1){G.spawnAcc--;if(G.enemies.length<380){let ty='mini';const r=Math.random();
    if(t>240&&r<0.22)ty='brute';else if((G.map==='periferia'||G.map==='praia')&&r>0.72)ty='runner';else if((G.map==='lab'||G.map==='praia')&&t>150&&r>0.6&&r<0.72)ty='spitter';if(ty==='mini'&&r>0.5&&r<0.6){const sp={distrito:['sombra',180],periferia:['bomba',120],lab:['blindado',200],praia:['saltador',120]}[G.map];if(t>sp[1])ty=sp[0]}addEnemy(ty,false)}}
  if(t>=G.eliteNext){G.eliteNext+=Math.max(30,45-t/60);addEnemy(['mini','brute','runner'][Math.floor(Math.random()*3)],true)}
  if(t>=G.miniNext&&t<BOSS_T){G.miniNext+=150;addEnemy('chefe',false,undefined,undefined,true);banner('Mini-chefe apareceu!')}
  if(t>=BOSS_T&&!G.bossSpawned)spawnBoss();
  if(G.boss&&!G.rage&&t>=RAGE_T){G.rage=true;banner('O chefe entrou em fúria!')}
  if(t>=G.spireNext&&t<BOSS_T){G.spireNext+=95;const types=G.diff==='normal'?['boon','quest']:['boon','quest','trial'];const ty=types[G.spireType++%types.length];
    const sp=spotNear(P.x,P.y,350,520,140);G.spires.push({x:sp.x,y:sp.y,type:ty,cap:0,life:45});
    banner({boon:'Torre de bênção apareceu (dourada)',quest:'Torre de missão apareceu (roxa)',trial:'Torre de provação apareceu (vermelha)'}[ty])}
  if(G.map==='periferia'&&t>=G.fuelNext){G.fuelNext+=55;const fp=spotNear(G.cannon.x,G.cannon.y,450,750,120);G.fuel.push({x:fp.x,y:fp.y});banner('Célula de combustível caiu! Leve até o canhão')}
  if(t>=G.podNext){G.podNext+=6;if(G.pods.length<7){const pp=spotNear(P.x,P.y,250,600,80);G.pods.push({x:pp.x,y:pp.y})}}
}

function bossAI(e,dt,dx,dy,d){const dm=diffMul().sp;
  if(e.kind==='rainha'){
    e.atk-=dt;e.dash-=dt;e.spiral=(e.spiral??6)-dt;
    if(e.hp<e.max*0.6&&e.spiral<=0){e.spiral=G.rage?6:9;for(let i=0;i<30;i++)addTimer({t:i*0.08,fn(){if(e.dead)return;const a=i*0.5;for(const o of[0,Math.PI])G.eproj.push({x:e.x,y:e.y,vx:Math.cos(a+o)*190,vy:Math.sin(a+o)*190,r:7,dmg:10*dm,life:4,c:'#ff8fb8'})}})}
    if(e.teleT>0){e.teleT-=dt;if(e.teleT<=0){e.dashT=0.55;e.dvx=dx/d*640;e.dvy=dy/d*640}}
    else if(e.dashT>0){e.dashT-=dt;e.x+=e.dvx*dt;e.y+=e.dvy*dt}
    else{e.x+=dx/d*e.spd*dt;e.y+=dy/d*e.spd*dt;
      if(e.dash<=0){e.dash=G.rage?3.5:6.5;e.teleT=0.7}
      if(e.atk<=0){e.atk=G.rage?1.1:2.3;const n=16,o=Math.random();for(let i=0;i<n;i++){const a=o+i*TAU/n;G.eproj.push({x:e.x,y:e.y,vx:Math.cos(a)*170,vy:Math.sin(a)*170,r:8,dmg:(G.rage?18:12)*dm,life:5})}}}
  }else if(e.kind==='colosso'){
    e.slam-=dt;e.summon-=dt;e.x+=dx/d*e.spd*(G.rage?1.4:1)*dt;e.y+=dy/d*e.spd*(G.rage?1.4:1)*dt;
    e.quake=(e.quake??5)-dt;if(e.quake<=0){e.quake=G.rage?4.5:7;const o=Math.random();for(let k=0;k<8;k++){const an=o+k*TAU/8;G.lines.push({x:e.x,y:e.y,x2:e.x+Math.cos(an)*650,y2:e.y+Math.sin(an)*650,w:40,t:1.1,max:1.1,dmg:28*dm})}}
    if(e.slam<=0){e.slam=G.rage?2.4:4;addMark({x:P.x,y:P.y,r:140,t:1.0,max:1.0,enemy:true,dmg:35*dm,c:'#ff5d6c'})}
    if(e.summon<=0){e.summon=G.rage?6:9;for(let i=0;i<10;i++){const a=i*TAU/10;addEnemy(Math.random()<0.5?'runner':'mini',false,e.x+Math.cos(a)*90,e.y+Math.sin(a)*90)}fx(e.x,e.y,20,120,'#3fbf7f',0.5)}
  }else if(e.kind==='devoradora'){
    e.atk-=dt;e.pools-=dt;e.x+=dx/d*e.spd*dt;e.y+=dy/d*e.spd*dt;
    e.pull=(e.pull??8)-dt;if(e.pull<=0){e.pull=G.rage?7:10;addMark({x:e.x,y:e.y,r:420,t:1,max:1,enemy:true,dmg:0,c:'#b06bff'});banner('A Devoradora está te puxando!');addTimer({t:1,fn(){e.pullT=1.6}})}
    if(e.pullT>0){e.pullT-=dt;P.x-=dx/d*170*dt;P.y-=dy/d*170*dt}
    if(e.atk<=0){e.atk=G.rage?1.3:2.4;const base=Math.atan2(dy,dx);for(let k=0;k<3;k++)addTimer({t:k*0.25,fn(){if(e.dead)return;const b0=Math.atan2(P.y-e.y,P.x-e.x);for(let i=-3;i<=3;i++){const a=b0+i*0.14;G.eproj.push({x:e.x,y:e.y,vx:Math.cos(a)*230,vy:Math.sin(a)*230,r:7,dmg:11*dm,life:4,c:'#c08bff'})}}})}
    if(e.pools<=0){e.pools=G.rage?3:5;for(let i=0;i<3;i++)G.hazards.push({x:P.x+rnd(-120,120),y:P.y+rnd(-120,120),r:70,life:9,dps:22*dm,arm:0.8})}
    if(!e.half&&e.hp<e.max/2){e.half=true;banner('A Devoradora chamou reforços!');for(let i=0;i<2;i++)addEnemy('brute',true,e.x+rnd(-80,80),e.y+rnd(-80,80))}
  }else{
    e.slash-=dt;e.summon-=dt;e.x+=dx/d*e.spd*dt;e.y+=dy/d*e.spd*dt;
    e.gey=(e.gey??4)-dt;if(e.gey<=0){e.gey=e.p2?4:6;for(let k=0;k<6;k++)addMark({x:P.x+rnd(-170,170),y:P.y+rnd(-170,170),r:60,t:1.1,max:1.1,enemy:true,dmg:22*dm,c:'#5fa8ff'})}
    if(e.slash<=0){e.slash=e.p2?(G.rage?1.6:2.2):3;const a=Math.atan2(dy,dx);const angs=e.p2?[a,a+Math.PI/2]:[a];
      for(const an of angs)G.lines.push({x:e.x-Math.cos(an)*350,y:e.y-Math.sin(an)*350,x2:e.x+Math.cos(an)*700,y2:e.y+Math.sin(an)*700,w:46,t:0.85,max:0.85,dmg:30*dm})}
    if(e.summon<=0){e.summon=e.p2?7:10;for(let i=0;i<6;i++)addEnemy('brute',false,e.x+rnd(-120,120),e.y+rnd(-120,120))}
  }}

function updateWeapon(w,dt){CUR=w.id;CURE=w.evo;const d=WEAPONS[w.id];if(d.tick){d.tick(w,dt);return}
  w.cd-=dt;if(w.cd<=0){w.cd=d.cd(w)*cdMul;if(d.sig){P.atkT=0.14;sfx('shoot')}d.fire(w,0);if(P.fid==='lumen'&&d.proj&&Math.random()<0.33)d.fire(w,0.16)}}

function update(dt){
  G.t+=dt;if(G.t>=300)complete('p_regen');P.buffs=P.buffs.filter(b=>(b.t-=dt)>0);ST=stats();P.lastMax=ST.maxHp;cdMul=100/(100+Math.max(-50,ST.haste));
  let mx=(bind('right')?1:0)-(bind('left')?1:0),my=(bind('down')?1:0)-(bind('up')?1:0);if(PAD.mx||PAD.my){mx=PAD.mx;my=PAD.my}
  P.moving=!!(mx||my);
  if(P.dash){CUR='E';P.dash.t-=dt;P.x+=P.dash.vx*dt;P.y+=P.dash.vy*dt;for(const e of G.enemies){if(e.dead||P.dash.hit.has(e))continue;if(d2(e,P)<(e.r+30)**2){P.dash.hit.add(e);damage(e,P.dash.dmg)}}if(P.dash.t<=0)P.dash=null}
  else if(P.moving){const l=Math.hypot(mx,my),sp=ST.spd*(P.carry?0.85:1);P.x+=mx/l*sp*dt;P.y+=my/l*sp*dt;P.face=Math.atan2(my,mx)}
  clampWorld(P,P.r);                      // a barreira da arena segura o jogador
  for(const e of G.enemies)clampWorld(e,e.r*0.5);
  let heal=ST.regen;for(const b of P.buffs)if(b.heal)heal+=b.heal*ST.maxHp;P.hp=Math.min(ST.maxHp,P.hp+heal*dt);
  for(const tm of G.timers){tm.t-=dt;if(tm.t<=0){tm.done=true;CUR=tm.src;tm.fn()}}G.timers=G.timers.filter(t=>!t.done);
  P.eCd=Math.max(0,P.eCd-dt);P.rCd=Math.max(0,P.rCd-dt);P.invuln-=dt;P.shieldT-=dt;if(P.shieldT<=0)P.shield=0;G.flash=Math.max(0,G.flash-dt);
  for(const w of P.weapons)updateWeapon(w,dt);
  P.atkT=Math.max(0,P.atkT-dt);
  if(P.fid==='lebre'){const n=Math.floor(P.lvl/7);P.spA+=dt*1.6;P.spCd-=dt;if(n>0&&P.spCd<=0){P.spCd=1*cdMul;CUR='passiva';CURE=false;
    for(let i=0;i<n;i++){const a=P.spA+i*TAU/n,sx=P.x+Math.cos(a)*40,sy=P.y+Math.sin(a)*40,e=nearest(500,{x:sx,y:sy});if(e)shootFrom(sx,sy,Math.atan2(e.y-sy,e.x-sx),520,{r:4,dmg:10+2*P.lvl,life:1,c:'#e0d4ff',home:e})}}}
  CUR='tentaculo';let near=0;for(const tn of G.tents){tn.life-=dt;tn.cd-=dt;tn.slam=Math.max(0,tn.slam-dt);if(d2(tn,P)<260*260)near++;const e=nearest(140+tn.r,tn);if(e)tn.a=Math.atan2(e.y-tn.y,e.x-tn.x);
    if(tn.cd<=0&&e){tn.cd=1.3;tn.slam=0.25;const hp={x:tn.x+Math.cos(tn.a)*tn.r*1.2,y:tn.y+Math.sin(tn.a)*tn.r*1.2};for(const o of G.enemies){if(o.dead)continue;if(d2(o,hp)<(tn.r+o.r)**2){damage(o,tn.dmg);if(tn.big&&!o.boss)o.frozenT=Math.max(o.frozenT,0.5)}}}}
  G.tents=G.tents.filter(t=>t.life>0);if(P.fid==='tora')P.hp=Math.min(ST.maxHp,P.hp+0.6*near*dt);
  CUR='R';for(const rg of G.rings){rg.life-=dt;rg.tick-=dt;if(rg.tick<=0){rg.tick=0.25;for(const e of G.enemies){if(e.dead)continue;const dd=Math.sqrt(d2(e,rg));if(Math.abs(dd-rg.r)<26+e.r)damage(e,rg.dmg)}}}G.rings=G.rings.filter(r=>r.life>0);
  if(G.intro){G.intro.t-=dt;if(G.intro.t<=0)G.intro=null}
  spawn(dt);
  // comandante
  const c=G.cmd,tx=P.x+60,ty=P.y-55;c.x+=(tx-c.x)*Math.min(1,dt*3);c.y+=(ty-c.y)*Math.min(1,dt*3);c.cd-=dt;c.storm-=dt;
  CUR='cmd';CURE=false;if(c.cd<=0){const e=nearest(480,c);if(e){c.cd=0.6;shootFrom(c.x,c.y,Math.atan2(e.y-c.y,e.x-c.x),620,{r:4,dmg:10+2*P.lvl,life:0.9,c:'#ffcc4d'})}}
  if(c.storm<=0){const e=nearest(480,c);if(e){c.storm=18;const a=Math.atan2(e.y-c.y,e.x-c.x);for(let i=0;i<22;i++)addTimer({t:i*0.04,fn(){shootFrom(c.x,c.y,a+rnd(-0.45,0.45),700,{r:4,dmg:14+2*P.lvl,life:0.8,c:'#ffe066'})}})}}
  for(const e of G.enemies){if(e.dead)continue;e.hitT-=dt;e.critT=(e.critT||0)-dt;const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;
    if(e.frozenT>0)e.frozenT-=dt;
    else{if(e.slowT>0)e.slowT-=dt;
      if(e.boss)bossAI(e,dt,dx,dy,d);
      else{let sp=e.spd*(e.slowT>0?0.4:1);if(e.ranged&&d<260)sp=0;e.x+=dx/d*sp*dt;e.y+=dy/d*sp*dt;
        if(e.ranged){e.shootT-=dt;if(e.shootT<=0&&d<520){e.shootT=3;const a=Math.atan2(dy,dx);G.eproj.push({x:e.x,y:e.y,vx:Math.cos(a)*210,vy:Math.sin(a)*210,r:6,dmg:e.dmg,life:3.5})}}
        if(e.blink){e.bt-=dt;if(e.bt<=0&&d>200){e.bt=3.5;fx(e.x,e.y,4,24,'#8f7dff',0.25);e.x+=dx/d*150;e.y+=dy/d*150;fx(e.x,e.y,4,24,'#8f7dff',0.25)}}
        if(e.bomb&&d<e.r+P.r+16){e.dead=true;burst(e.x,e.y,'#ff9a3d',8);addMark({x:e.x,y:e.y,r:70,t:0.35,max:0.35,enemy:true,dmg:e.dmg*3.5,c:'#ff9a3d'})}
        if(e.leap){e.bt-=dt;if(e.lt>0){e.lt-=dt;e.x+=e.lvx*dt;e.y+=e.lvy*dt}else if(e.bt<=0&&d<320){e.bt=3;e.lt=0.35;e.lvx=dx/d*470;e.lvy=dy/d*470}}
        if(e.miniboss){e.slamT-=dt;if(e.slamT<=0&&d<420){e.slamT=5;addMark({x:P.x,y:P.y,r:90,t:1,max:1,enemy:true,dmg:e.dmg*0.9,c:'#ff5d6c'})}}}
      if(d<e.r+P.r)takeDamage(e.dmg*dt)}
    e.x+=e.kx*dt;e.y+=e.ky*dt;const k=Math.pow(0.02,dt);e.kx*=k;e.ky*=k;
    if(!e.boss&&!e.elite&&!e.miniboss&&d>1500){const a=Math.random()*TAU,D=Math.hypot(W,H)/2+50;e.x=P.x+Math.cos(a)*D;e.y=P.y+Math.sin(a)*D}}
  separate();
  for(const p of G.proj){if(p.dead)continue;CUR=p.src;
    if(p.ret){const dx=P.x-p.x,dy=P.y-p.y,d=Math.hypot(dx,dy)||1;p.rs+=600*dt;p.vx=dx/d*p.rs;p.vy=dy/d*p.rs;if(d<20){p.dead=true;continue}}
    if(p.home){if(p.home.dead)p.home=null;else{const a=Math.atan2(p.home.y-p.y,p.home.x-p.x),sp=Math.hypot(p.vx,p.vy),cur=Math.atan2(p.vy,p.vx),df=Math.atan2(Math.sin(a-cur),Math.cos(a-cur)),na=cur+Math.max(-7*dt,Math.min(7*dt,df));p.vx=Math.cos(na)*sp;p.vy=Math.sin(na)*sp}}
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(!p.noHit)for(const e of G.enemies){if(e.dead||p.hit.has(e))continue;const rr=p.r+e.r;
      if(d2(p,e)<rr*rr){p.hit.add(e);damage(e,p.dmg);if(p.onHit)p.onHit(p,e);if(p.pierce--<=0){p.dead=true;if(p.onEnd)p.onEnd(p);break}}}
    if(!p.dead&&p.life<=0){if(p.evoRet&&!p.ret){p.ret=true;p.rs=150;p.hit.clear();p.life=3;if(p.fan)for(let k=0;k<6;k++)shootFrom(p.x,p.y,k*TAU/6,420,{r:4,dmg:p.dmg*0.5,life:0.5,c:'#c4f06b',src:p.src,evo:true})}else{p.dead=true;if(p.onEnd)p.onEnd(p)}}}
  G.proj=G.proj.filter(p=>!p.dead);
  for(const z of G.zones){CUR=z.src;z.age+=dt;z.life-=dt;z.r=z.grow?z.base*(1+z.age*0.45):z.base;z.t-=dt;
    if(z.t<=0){z.t=0.4;const dm=z.dmg*(z.grow?1+z.age*0.5:1);for(const e of G.enemies){if(e.dead)continue;const rr=z.r+e.r;if(d2(e,z)<rr*rr)damage(e,dm)}}
    if(z.poison&&d2(z,P)<z.r*z.r){P.shield=Math.min(0.3*ST.maxHp,P.shield+0.04*ST.maxHp*dt);P.shieldT=Math.max(P.shieldT,1)}}
  G.zones=G.zones.filter(z=>z.life>0);
  for(const m of G.marks){CUR=m.src;m.t-=dt;if(m.t<=0){m.done=true;
    if(m.enemy){fx(m.x,m.y,10,m.r,m.c,0.4);if(d2(m,P)<(m.r+P.r)**2)takeDamage(m.dmg)}
    else{explode(m.x,m.y,m.r,m.dmg,m.c);if(m.split)for(let k=0;k<3;k++){const an=Math.random()*TAU;addMark({x:m.x+Math.cos(an)*m.r,y:m.y+Math.sin(an)*m.r,r:m.r*0.6,t:0.25,max:0.25,dmg:m.dmg*0.5,c:m.c})}if(m.stun)for(const e of G.enemies)if(!e.dead&&!e.boss&&d2(e,m)<m.r*m.r)e.frozenT=Math.max(e.frozenT,m.stun);
      if(m.fire)addZone({x:m.x,y:m.y,base:m.r*0.8,r:m.r*0.8,dmg:10+2*P.lvl,t:0,life:4,age:0,c:'#ff8a3d'})}}}
  G.marks=G.marks.filter(m=>!m.done);
  for(const l of G.lines){l.t-=dt;if(l.t<=0){l.done=true;G.beams.push({x1:l.x,y1:l.y,x2:l.x2,y2:l.y2,life:0.2,c:'#9fd4ff',w:l.w});if(segDist2(P.x,P.y,l.x,l.y,l.x2,l.y2)<(l.w/2+P.r)**2)takeDamage(l.dmg)}}
  G.lines=G.lines.filter(l=>!l.done);
  for(const h of G.hazards){h.life-=dt;h.arm-=dt;if(h.arm<=0&&d2(h,P)<h.r*h.r)takeDamage(h.dps*dt)}G.hazards=G.hazards.filter(h=>h.life>0);
  for(const tr of G.trains){CUR='trem';tr.x+=tr.vx*dt;tr.life-=dt;tr.et-=dt;const x1=Math.min(tr.x,tr.x+(tr.vx>0?-tr.len:tr.len)),x2=Math.max(tr.x,tr.x+(tr.vx>0?-tr.len:tr.len));
    for(const e of G.enemies){if(e.dead||tr.hit.has(e))continue;if(e.x>x1-e.r&&e.x<x2+e.r&&Math.abs(e.y-tr.y)<tr.h/2+e.r){tr.hit.add(e);damage(e,tr.dmg);if(!e.boss)e.frozenT=Math.max(e.frozenT,0.4);
      if(tr.evo&&e.dead&&Math.random()<0.1)dropGold(e.x,e.y,1)}}
    if(tr.evo&&tr.et<=0){tr.et=0.12;explode(tr.x,tr.y,50*ST.area,tr.dmg*0.4,'#ff8a3d')}}
  G.trains=G.trains.filter(t=>t.life>0);
  for(const wl of G.walls){wl.life-=dt;wl.x+=wl.vx*dt;wl.y+=wl.vy*dt;const nx=Math.cos(wl.a+Math.PI/2),ny=Math.sin(wl.a+Math.PI/2),x1=wl.x-nx*wl.len/2,y1=wl.y-ny*wl.len/2,x2=wl.x+nx*wl.len/2,y2=wl.y+ny*wl.len/2;wl.p=[x1,y1,x2,y2];
    for(const e of G.enemies)if(!e.dead&&!e.boss&&segDist2(e.x,e.y,x1,y1,x2,y2)<(e.r+14)**2){e.kx=Math.cos(wl.a)*420;e.ky=Math.sin(wl.a)*420}
    for(const b of G.eproj)if(segDist2(b.x,b.y,x1,y1,x2,y2)<(b.r+14)**2)b.life=0}
  G.walls=G.walls.filter(w=>w.life>0);
  for(const b of G.eproj){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;const rr=b.r+P.r;if(b.life>0&&d2(b,P)<rr*rr){takeDamage(b.dmg);b.life=0}}
  G.eproj=G.eproj.filter(b=>b.life>0);
  const q=G.explQ;G.explQ=[];CUR='campo';for(const x of q)explode(x.x,x.y,x.r,x.dmg,'#7ee081');
  // coleta
  if(P.aug.ima){G.imaT-=dt;if(G.imaT<=0){G.imaT=45;for(const o of G.orbs)o.mag=true;banner('Ímã: tudo puxado!')}}
  for(const o of G.orbs){const d=d2(o,P);if(d<ST.pick*ST.pick)o.mag=true;
    if(o.mag){const dd=Math.sqrt(d)||1;o.x+=(P.x-o.x)/dd*Math.max(620,dd*2)*dt;o.y+=(P.y-o.y)/dd*Math.max(620,dd*2)*dt;
      if(dd<P.r+8){o.done=true;collectP();if(o.heal){P.hp=Math.min(ST.maxHp,P.hp+0.2*ST.maxHp);fx(P.x,P.y,10,40,'#7ee081',0.3)}else if(o.gold){G.gold+=o.gold;sfx('pickup')}else{addXp(o.v*ST.xp);sfx('xp')}}}}
  G.orbs=G.orbs.filter(o=>!o.done);
  while(G.orbs.length>500){const o=G.orbs.shift();if(o.gold)G.gold+=o.gold;else if(!o.heal)addXp(o.v*ST.xp)}
  for(const c2 of G.cards)if(d2(c2,P)<36*36){c2.done=true;G.pendCard++;if(P.aug.colecionador)P.collected++}
  G.cards=G.cards.filter(c2=>!c2.done);
  for(const pd of G.pods)if(d2(pd,P)<34*34){pd.done=true;addTot('pods',1);fx(pd.x,pd.y,6,40,'#c9b8ff',0.3);const r=Math.random();
    if(r<0.5)dropGold(pd.x,pd.y,5*ST.gold);else if(r<0.75)G.orbs.push({x:pd.x,y:pd.y,heal:true});else{for(const o of G.orbs)o.mag=true;addTot('imas',1);banner('Ímã: tudo puxado!')}}
  G.pods=G.pods.filter(p=>!p.done);
  G.enemies=G.enemies.filter(e=>!e.dead);
  mapUpdate(dt);tutUpdate();
  for(const s of G.spires){s.life-=dt;if(d2(s,P)<70*70){s.cap+=dt;if(s.cap>=2.5){s.done=true;spireDone(s)}}else s.cap=Math.max(0,s.cap-dt*0.5);if(s.life<=0)s.done=true}
  G.spires=G.spires.filter(s=>!s.done);
  if(G.quest){G.quest.t-=dt;if(G.quest.got>=G.quest.need){G.quest=null;G.pendAug++;complete('quest');banner('Missão cumprida! Escolha um aprimoramento')}else if(G.quest.t<=0){G.quest=null;banner('Missão falhou')}}
  if(G.trial){const tr=G.trial;tr.t-=dt;if(d2(tr,P)>tr.r*tr.r){G.trial=null;banner('Provação falhou: você saiu da área')}
    else if(tr.t<=0){G.trial=null;addTot('prov',1);complete('prov1');G.gold+=Math.round(60*ST.gold);addXp(P.xpNext*0.6);G.pendLv++;banner('Provação vencida! Ouro, EXP e uma escolha extra')}}
  for(const p of G.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=0.9;p.vy*=0.9}G.parts=G.parts.filter(p=>(p.life-=dt)>0);for(const n of G.nums)n.y-=40*dt;G.nums=G.nums.filter(n=>(n.life-=dt)>0);G.shake=Math.max(0,G.shake-30*dt);G.hurtT=Math.max(0,G.hurtT-dt);
  G.fxs=G.fxs.filter(x=>(x.life-=dt)>0);G.beams=G.beams.filter(b=>(b.life-=dt)>0);G.bolts=G.bolts.filter(b=>(b.life-=dt)>0);
  if(G.state==='play'){if(G.pendLv>0){G.pendLv--;openChoice('level')}else if(G.pendCard>0){G.pendCard--;openChoice('card')}else if(G.pendAug>0){G.pendAug--;openChoice('aug')}}
}
function separate(){const cs=46,grid=new Map();for(const e of G.enemies){if(e.dead||e.boss)continue;const k=Math.floor(e.x/cs)*100003+Math.floor(e.y/cs);let b=grid.get(k);if(!b){b=[];grid.set(k,b)}b.push(e)}
  for(const b of grid.values()){const n=Math.min(b.length,40);for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const a=b[i],c=b[j],dx=c.x-a.x,dy=c.y-a.y,rr=a.r+c.r,dd=dx*dx+dy*dy;
    if(dd<rr*rr&&dd>0.01){const d=Math.sqrt(dd),o=(rr-d)*0.3,nx=dx/d,ny=dy/d;a.x-=nx*o;a.y-=ny*o;c.x+=nx*o;c.y+=ny*o}}}}
function collectP(){if(P.fid==='pluma'&&++P.pickP>=150){P.pickP=0;P.buffs.push({t:6,haste:40});fx(P.x,P.y,14,80,'#ff7ad9',0.4)}}
function spireDone(s){sfx('spire');
  if(s.type==='boon'){const b=BOONS[Math.floor(Math.random()*BOONS.length)];if(b.b)P.buffs.push(Object.assign({},b.b));if(b.f)b.f();banner('Bênção: '+b.n+'. '+b.d);fx(s.x,s.y,10,120,'#ffcc4d',0.6)}
  else if(s.type==='quest'){G.quest={need:40+Math.floor(G.t/25),got:0,t:25};banner('Missão: derrote '+G.quest.need+' inimigos em 25 s');fx(s.x,s.y,10,120,'#9b7bff',0.6)}
  else{G.trial={x:s.x,y:s.y,r:260,t:20};banner('Provação: fique dentro do círculo por 20 s');for(let i=0;i<36;i++){const a=i*TAU/36;addEnemy(i%6?'mini':'brute',false,s.x+Math.cos(a)*300,s.y+Math.sin(a)*300)}fx(s.x,s.y,10,260,'#ff5d6c',0.6)}}
function mapUpdate(dt){CUR='mapa';
  if(G.map==='distrito'){const f=G.fountain;f.cd-=dt;
    if(f.cd<=0&&d2(f,P)<f.r*f.r){f.charge+=dt;if(f.charge>=2.5){f.charge=0;f.cd=60;P.hp=Math.min(ST.maxHp,P.hp+0.5*ST.maxHp);fx(f.x,f.y,20,160,'#7ee081',0.7);banner('Fonte de Cura: +50% de vida');addTot('fonte',1)}}
    else f.charge=Math.max(0,f.charge-dt)}
  else if(G.map==='periferia'){const c=G.cannon;
    for(const f of G.fuel)if(!P.carry&&d2(f,P)<30*30){f.done=true;P.carry=true;banner('Você pegou a célula. Leve até o canhão!')}
    G.fuel=G.fuel.filter(f=>!f.done);
    if(P.carry&&d2(c,P)<c.r*c.r){P.carry=false;c.active=20;banner('Canhão de Íons ativado por 20 s!')}
    if(c.active>0){c.active-=dt;c.tick-=dt;if(c.tick<=0){c.tick=0.25;const list=G.enemies.filter(e=>!e.dead&&d2(e,c)<750*750);
      if(list.length){const e=list[Math.floor(Math.random()*list.length)];c.ang=Math.atan2(e.y-c.y,e.x-c.x);G.beams.push({x1:c.x,y1:c.y,x2:e.x,y2:e.y,life:0.15,c:'#bff4ff',w:3});explode(e.x,e.y,45,60+3*P.lvl,'#9be7ff')}}}}
  else if(G.map==='lab'){for(const b of G.bombs){b.cd-=dt;
    if(b.cd<=0&&d2(b,P)<b.r*b.r){b.charge+=dt;if(b.charge>=1.5){b.charge=0;b.cd=40;sfx('freeze');fx(b.x,b.y,20,480,'#9fd4ff',0.8);banner('Bomba de Gelo detonada!');
      for(const e of G.enemies)if(!e.dead&&d2(e,b)<480*480){if(e.boss)e.slowT=3;else e.frozenT=Math.max(e.frozenT,3);damage(e,40+4*P.lvl)}}}
    else b.charge=Math.max(0,b.charge-dt)}}
  else if(G.sea){const s=G.sea;s.t+=dt;s.x=Math.min(s.to,s.x+49*dt);if(P.x<s.x)takeDamage(40*diffMul().sp*dt)}
}
const LVL_MAX=99;                      // mesmo teto do Swarm
function addXp(v){
  if(P.lvl>=LVL_MAX){P.xp=P.xpNext;return}
  P.xp+=v;
  while(P.xp>=P.xpNext&&P.lvl<LVL_MAX){P.xp-=P.xpNext;P.lvl++;P.xpNext=xpNext(P.lvl);G.pendLv++;G.gold+=Math.round(10*ST.gold);
    if(P.aug.festa)P.buffs.push({t:8,dmg:0.25,spd:0.3,haste:40});
    if(P.lvl===3)banner('E liberado: '+P.f.E.n);if(P.lvl===6)banner('R liberado: '+P.f.R.n);if(P.lvl===LVL_MAX)banner('Nível máximo!');
    if(P.lvl>=10)complete('p_vel');
    if(P.lvl>=15)complete('lvl15');if(P.lvl>=30)complete('lvl30');
    if(P.fid==='kira'&&P.lvl>=25)complete('kira25');if(P.fid==='kaze'&&P.lvl>=30)complete('kaze30');
    if(P.fid==='rivka'&&P.lvl>=35)complete('rivka35');if(P.fid==='rhea'&&P.lvl>=25)complete('rhea25');
    if(P.fid==='tora'&&P.lvl>=25)complete('p_dur')}
  if(P.lvl>=LVL_MAX)P.xp=P.xpNext}

function useAbility(k){if(!G||G.state!=='play'||paused)return;
  CUR=k;CURE=false;if(k==='E'){if(P.lvl<3||P.eCd>0)return;sfx('ability');P.f.useE();P.eCd=P.f.E.cd*cdMul}
  else{if(P.lvl<6||P.rCd>0)return;sfx('ult');P.f.useR();P.rCd=P.f.R.cd*cdMul*(P.aug.ult?0.5:1)}}

/* ---------- Escolhas ---------- */
const slots=()=>3+(SAVE.up.slot||0);   // Swarm começa em 3 e vai até 6
const pasUnlocked=id=>{const l=PASSIVES[id].lock;return !l||SAVE.done[l]};
function wUnlocked(id){const l=WEAPONS[id].lock;return !l||SAVE.done[l]}
function buildOptions(n){const o=[],extra=P.weapons.filter(w=>!WEAPONS[w.id].sig).length;
  for(const id in WEAPONS){const d=WEAPONS[id];if(d.sig&&d.sig!==P.fid)continue;const w=P.weapons.find(x=>x.id===id);
    if(w){if(w.lvl<5)o.push({type:'w',id,lvl:w.lvl+1})}else if(!d.sig&&extra<4&&wUnlocked(id))o.push({type:'w',id,lvl:1})}
  const pc=Object.keys(P.pas).length;
  for(const id in PASSIVES){const l=P.pas[id]||0;
    if(l>0&&l<5)o.push({type:'p',id,lvl:l+1});
    else if(!l&&pc<slots()&&pasUnlocked(id))o.push({type:'p',id,lvl:1})}
  const r=shuffle(o).slice(0,n);
  if(r.length)return r;
  // build fechada: a partir daqui só vêm as duas cartas de bônus
  return shuffle([{type:'heal'},{type:'gold'}]).slice(0,Math.max(1,Math.min(2,n)))}
function eligible(){return P.weapons.filter(w=>w.lvl>=5&&!w.evo&&(P.pas[WEAPONS[w.id].evo]||0)>0)}

function optCard(o,i){const b=document.createElement('button');b.className='card';let tag,nm,ds,hint='',c,ribbon='';
  if(o.type==='w'){const d=WEAPONS[o.id];c=d.c;nm=d.n;tag=o.lvl===1?'Nova arma':'Arma · nível '+o.lvl;ds=o.lvl===1?d.d:d.up;b.classList.add('wCard');
    const tem=(P.pas[d.evo]||0)>0;hint='Evolui com '+PASSIVES[d.evo].n+(tem?' (você já tem)':'');
    if(tem&&o.lvl>=5)ribbon='Pronta p/ evoluir'}
  else if(o.type==='p'){const d=PASSIVES[o.id];c=d.c;nm=d.n;tag=o.lvl===1?'Nova passiva':'Passiva · nível '+o.lvl;ds=d.d;b.classList.add('pCard');
    const ks=P.weapons.filter(w=>WEAPONS[w.id].evo===o.id&&!w.evo);if(ks.length)hint='Chave de evolução: '+ks.map(w=>WEAPONS[w.id].n).join(', ');
    if(ks.some(w=>w.lvl>=5))ribbon='Destrava evolução'}
  else if(o.type==='evo'){const d=WEAPONS[o.id];c='#ffcc4d';b.classList.add('evoCard');tag='Evolução';nm=d.evoN;ds=d.ed;hint=d.n+' + '+PASSIVES[d.evo].n;ribbon='Evolução'}
  else if(o.type==='aug'){const d=AUGS[o.id];c='#9b7bff';b.classList.add('augCard');tag='Aprimoramento';nm=d.n;ds=d.d;hint='Vale até o fim da partida'}
  else if(o.type==='gold'){c='#ffcc4d';b.classList.add('bCard');tag='Bônus';nm='Ouro';ds='Ganha 25 de ouro.'}
  else{c='#7ee081';b.classList.add('bCard');tag='Bônus';nm='Cura';ds='Recupera 30% da vida.'}
  b.innerHTML=`${ribbon?'<span class="ribbon"></span>':''}<span class="tag"></span><span class="nm"><img class="ico" alt=""><span></span></span><span class="ds"></span>${hint?'<span class="hint"></span>':''}<span class="key">${i+1}</span>`;
  if(ribbon)b.querySelector('.ribbon').textContent=ribbon;
  const ik=o.type==='w'||o.type==='evo'?'w:'+o.id:o.type==='p'?'p:'+o.id:o.type;b.querySelector('.tag').textContent=tag;b.querySelector('img').src=iconURL(ik);b.querySelector('.nm span:last-child').textContent=nm;b.querySelector('.ds').textContent=ds;if(hint)b.querySelector('.hint').textContent=hint;
  b.onclick=()=>pick(o);return b}
let curOpts=[];
function openChoice(kind){G.state='choice';let title;
  if(kind==='aug'){curOpts=shuffle(Object.keys(AUGS).filter(k=>!P.aug[k])).slice(0,3).map(id=>({type:'aug',id}));title='Escolha um aprimoramento'}
  else if(kind==='card'){const ev=eligible();curOpts=ev.length?[{type:'evo',id:ev[0].id}]:buildOptions(1);title=ev.length?'Cartão de Acesso: evolução!':'Cartão de Acesso'}
  else{curOpts=buildOptions(3);title='Subiu para o nível '+P.lvl+'!'}
  if(!curOpts.length)curOpts=[{type:'heal'}];
  G.choiceT=30;$('choiceTimer').classList.remove('urgent');$('choiceTimer').firstElementChild.style.width='100%';
  PAD.sel=0;sfx(kind==='level'?'level':'card');if(G.tut&&kind==='level')tip('choice','Escolha 1 carta. A linha dourada mostra a passiva que evolui cada arma: arma no nível 5 + essa passiva + um Cartão de Acesso.');
  $('choiceTitle').textContent=title;const box=$('choiceCards');box.innerHTML='';curOpts.forEach((o,i)=>box.appendChild(optCard(o,i)));$('choice').hidden=false;
  setTimeout(()=>{const f=box.querySelector('button');if(f)f.focus()},50)}
function pick(o){if(G.state!=='choice')return;
  if(o.type==='w'){const w=P.weapons.find(x=>x.id===o.id);if(w)w.lvl++;else P.weapons.push({id:o.id,lvl:1,evo:false,cd:0,st:{}});
    if(o.id==='arco'&&o.lvl>=3)complete('arco3');
    if(o.id==='bumerangue'&&o.lvl>=2)complete('p_acel');
    if(o.id==='luva'&&o.lvl>=4)complete('p_crit')}
  else if(o.type==='p'){P.pas[o.id]=o.lvl;if(o.id==='vida')P.hp+=25}
  else if(o.type==='evo'){P.weapons.find(x=>x.id===o.id).evo=true;banner(WEAPONS[o.id].n+' evoluiu: '+WEAPONS[o.id].evoN);fx(P.x,P.y,10,140,'#ffcc4d',0.7);complete('evo1');complete('p_proj');sfx('evolve');if(P.weapons.filter(w=>w.evo).length>=3)complete('evo3');if(P.weapons.filter(w=>w.evo).length>=4)complete('evo4')}
  else if(o.type==='aug'){P.aug[o.id]=true;if(Object.keys(P.aug).length>=3)complete('aug3')}
  else if(o.type==='gold')G.gold+=25;
  else P.hp+=0.3*ST.maxHp;
  if(P.weapons.filter(w=>w.lvl>=5).length>=5)complete('cinco5');
  if(P.weapons.length>=5&&P.weapons.every(w=>w.lvl>=5)&&Object.keys(P.pas).length>=slots()&&Object.values(P.pas).every(l=>l>=5))complete('cheio');
  ST=stats();P.hp=Math.min(P.hp,ST.maxHp);$('choice').hidden=true;G.state='play';G.invDirty=true}
