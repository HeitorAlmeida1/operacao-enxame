function mineHop(x,y,target,w,left,hit){
  shootFrom(x,y,Math.atan2(target.y-y,target.x-x),520,{r:7,dmg:0,life:0.9,c:'#ff9a3d',rocket:true,
    onHit:(p,e)=>{explode(e.x,e.y,38*ST.area,12+4*w.lvl,'#ff9a3d');hit.add(e);
      if(left>0){let nx=null,bd=260*260;for(const o of G.enemies){if(o.dead||hit.has(o))continue;const dd=d2(o,e);if(dd<bd){bd=dd;nx=o}}
        if(nx)mineHop(e.x,e.y,nx,w,left-1,hit)}}})}
function recallFeathers(){const dm=10+2*P.lvl;sfx('ability');for(const f of G.feathers){const dd=Math.sqrt(d2(f,P))||1;shootFrom(f.x,f.y,Math.atan2(P.y-f.y,P.x-f.x),760,{r:7,dmg:dm,life:dd/760,pierce:999,feather:true,c:'#ff7ad9',onHit:(p,e)=>{if(!e.boss)e.frozenT=Math.max(e.frozenT,0.8)}})}G.feathers=[]}

const WEAPONS={
  rajada:{n:'Rajada Felina',evoN:'Barragem Felina',evo:'acel',sig:'kira',proj:true,c:'#4fe3d6',
    d:'Rajada de balas na direção da mira.',up:'+1 bala e mais dano',ed:'Balas saem em dobro e atravessam inimigos.',
    cd:()=>0.85,fire(w,j){const a=aim()+j;let n=2+w.lvl+ST.proj;if(w.evo)n*=2;const sp=0.42+0.03*n;
      for(let i=0;i<n;i++){const ang=a+(n>1?(i/(n-1)-0.5)*sp:0)+rnd(-.04,.04);shoot(ang,580,{r:5,dmg:9+3*w.lvl,life:0.8,pierce:w.evo?2:0,c:'#4fe3d6'})}}},
  onda:{n:'Onda Sonora',evoN:'Eco Anima',evo:'proj',sig:'lumen',proj:true,c:'#ff5fa2',
    d:'Ondas largas que atravessam tudo e deixam os inimigos lentos.',up:'+1 onda e mais dano',ed:'As ondas voltam até você, acertando de novo.',
    cd:()=>1.6,fire(w,j){const a=aim()+j,n=w.lvl+ST.proj,sp=n>1?Math.min(1.3,0.28*n):0;
      for(let i=0;i<n;i++){const ang=a+(n>1?(i/(n-1)-0.5)*sp:0);shoot(ang,330,{r:17*ST.area,dmg:16+5*w.lvl,life:0.9,pierce:999,wave:true,evoRet:w.evo,c:'#ff5fa2',onHit:(p,e)=>{e.slowT=2}})}}},
  escudo:{n:'Golpe de Escudo',evoN:'Escudo Solar',evo:'arm',sig:'rhea',c:'#e0c27a',
    d:'Golpe em cone à frente. Escala com Armadura.',up:'Cone maior e mais dano',ed:'O golpe atordoa e deixa o chão em chamas.',
    cd:()=>1.25,fire(w,j){const a=aim()+j,R=(105+8*w.lvl)*ST.area,sp=0.65;G.fxs.push({x:P.x,y:P.y,cone:true,a,sp,R,c:w.evo?'#ffcc4d':'#e0c27a',life:0.22,max:0.22});
      coneHit(a,R,sp,14+4*w.lvl+ST.armor,e=>{push(e,P.x,P.y,180);if(w.evo&&!e.boss)e.frozenT=Math.max(e.frozenT,0.5)});
      if(w.evo)addZone({x:P.x+Math.cos(a)*R*0.6,y:P.y+Math.sin(a)*R*0.6,base:R*0.4,r:R*0.4,dmg:6+2*w.lvl,t:0,life:2,age:0,c:'#ff8a3d'})}},
  garra:{n:'Garra Feroz',evoN:'Corte Selvagem',evo:'vida',sig:'vex',c:'#ff4d6d',
    d:'Golpes rápidos à frente. Escala com Vida Máxima.',up:'Mais alcance e dano',ed:'Golpeia em círculo e cura um pouco a cada acerto.',
    cd:()=>0.55,fire(w,j){const a=aim()+j,R=(75+5*w.lvl)*ST.area,sp=w.evo?Math.PI:0.9;G.fxs.push({x:P.x,y:P.y,cone:true,a,sp,R,c:'#ff4d6d',life:0.15,max:0.15});
      const n=coneHit(a,R,sp,10+3*w.lvl+0.05*ST.maxHp,e=>push(e,P.x,P.y,90));if(w.evo&&n)P.hp=Math.min(ST.maxHp,P.hp+Math.min(n,8)*0.003*ST.maxHp)}},
  tempestade:{n:'Tempestade de Aço',evoN:'Tempestades Errantes',evo:'crit',sig:'kaze',c:'#bfe8ff',
    d:'Junta Fluxo andando; com 100 de Fluxo solta um redemoinho em linha.',up:'Redemoinho maior e mais forte',ed:'Solta três redemoinhos de uma vez.',
    tick(w,dt){const s=w.st;s.flow=(s.flow||0)+(28+(P.moving?40:0))*dt/cdMul;if(s.flow<100)return;s.flow=0;
      const a=aim(),n=(w.evo?3:1)+ST.proj;                 // Projéteis = mais redemoinhos
      const rr=(20+2*w.lvl)*ST.area*(1+ST.crit*0.5);       // Crítico, o status do Kaze, engrossa o funil
      for(let i=0;i<n;i++)shoot(a+(n>1?(i-(n-1)/2)*0.34:0),520,{r:rr,dmg:24+8*w.lvl,life:0.75*ST.dur,pierce:999,whirl:true,c:'#bfe8ff',onHit:(p,e)=>{if(!e.boss)e.frozenT=Math.max(e.frozenT,0.35)}})}},
  feitico:{n:'Feitiço Guia',evoN:'Feitiço Saltitante',evo:'exp',sig:'lebre',proj:true,c:'#b8a4ff',
    d:'Raios teleguiados que marcam os inimigos; a 3ª marca causa dano dobrado.',up:'+raios e mais dano',ed:'A 3ª marca também explode em área.',
    cd:()=>0.8,fire(w,j){const n=1+Math.floor(w.lvl/2)+ST.proj,dm=10+4*w.lvl;const list=G.enemies.filter(e=>!e.dead&&d2(e,P)<600*600).sort((a,b)=>d2(a,P)-d2(b,P)).slice(0,n);
      list.forEach((e,i)=>shoot(Math.atan2(e.y-P.y,e.x-P.x)+j+(i-(list.length-1)/2)*0.35,430,{r:6,dmg:dm,life:1.6,home:e,c:'#b8a4ff',onHit:(p,t)=>{t.hex=(t.hex||0)+1;if(t.hex>=3){t.hex=0;damage(t,dm*2);fx(t.x,t.y,4,30,'#e0d4ff',0.25);if(w.evo)explode(t.x,t.y,70*ST.area,dm,'#b8a4ff')}}}))}},
  tentaculo:{n:'Tentáculo',evoN:'Tentáculo Colossal',evo:'dur',sig:'tora',c:'#3fd0a0',
    d:'Golpe no chão que deixa um tentáculo atacando por um tempo. Escala com Duração.',up:'Mais dano e tentáculos mais fortes',ed:'Tentáculos maiores, que duram mais e arremessam inimigos.',
    cd:()=>1.6,fire(w,j){const e=nearest(420);const x=e?e.x:P.x+Math.cos(aim())*120,y=e?e.y:P.y+Math.sin(aim())*120;explode(x,y,60*ST.area,14+4*w.lvl,'#3fd0a0');spawnTent(x,y,w)}},
  salto:{n:'Salto Coelho',evoN:'Impacto Cenoura',evo:'vel',sig:'rivka',c:'#ff9ad5',
    d:'Carrega enquanto você anda; carga cheia vira um salto com dano em área. Escala com Velocidade.',up:'Mais dano e área',ed:'A área dobra e cada salto solta uma onda cortante.',
    tick(w,dt){const s=w.st;if(P.moving)s.c=(s.c||0)+ST.spd*dt;if((s.c||0)<300)return;s.c=0;s.n=(s.n||0)+1;const a=aim(),cx=P.x+Math.cos(a)*55,cy=P.y+Math.sin(a)*55,R=(70+5*w.lvl)*ST.area*(w.evo?1.4:1);
      P.atkT=0.2;sfx('shoot');G.fxs.push({x:cx,y:cy,r:10,R,c:'#ff9ad5',life:0.3,max:0.3});const dm=18+6*w.lvl+0.08*Math.max(0,ST.spd-200),pt={x:cx,y:cy};
      for(const e of G.enemies){if(e.dead)continue;if(d2(e,pt)<(R+e.r)**2){damage(e,dm);if(s.n%2===0&&!e.boss)e.frozenT=Math.max(e.frozenT,0.6)}}
      if(w.evo||P.buffs.some(b=>b.exile))shoot(a,540,{r:20*ST.area,dmg:dm*0.8,life:0.6,pierce:999,whirl:true,c:'#ff9ad5'})}},
  pena:{n:'Pena Alada',evoN:'Retorno das Penas',evo:'coleta',sig:'pluma',proj:true,c:'#ff7ad9',
    d:'Penas perfurantes que ficam cravadas no chão. Use o E para chamá-las de volta.',up:'Mais dano',ed:'Lança 3 penas e chama todas de volta sozinha a cada 4 s.',
    cd:()=>0.9,fire(w,j){const a=aim()+j,n=(w.evo?3:1)+ST.proj;for(let i=0;i<n;i++)shoot(a+(n>1?(i/(n-1)-0.5)*0.5:0),560,{r:6,dmg:12+4*w.lvl,life:0.55,pierce:999,feather:true,c:'#ff7ad9',
        onEnd:p=>{G.feathers.push({x:p.x,y:p.y});if(G.feathers.length>45)G.feathers.shift()}});
      if(w.evo&&G.t-(w.st.last||0)>4){w.st.last=G.t;addTimer({t:0.6,fn:recallFeathers})}}},
  blaster:{n:'Blaster Pixel',evoN:'Blaster Turbo',evo:'acel',proj:true,c:'#9be7ff',
    d:'Lasers rápidos nos inimigos mais próximos.',up:'Mais dano',ed:'Atira duas vezes mais rápido.',
    cd:w=>w.evo?0.2:0.42,fire(w,j){const n=1+ST.proj;const list=G.enemies.filter(e=>!e.dead&&d2(e,P)<650*650).sort((a,b)=>d2(a,P)-d2(b,P)).slice(0,n);
      for(const e of list)shoot(Math.atan2(e.y-P.y,e.x-P.x)+j,650,{r:4,dmg:7+3*w.lvl,life:1,c:'#9be7ff'})}},
  ciclone:{n:'Lâminas Ciclone',evoN:'Ciclone Eterno',evo:'regen',c:'#c9b8ff',
    d:'Lâminas giram em volta de você e empurram os inimigos.',up:'+1 lâmina e mais dano',ed:'As lâminas giram sem parar.',
    tick(w,dt){const s=w.st;s.a=(s.a||0)+3.4*dt;if(s.on===undefined){s.on=3*ST.dur;s.off=0}
      if(!w.evo){if(s.on>0){s.on-=dt;if(s.on<=0)s.off=2*cdMul}else{s.off-=dt;if(s.off<=0)s.on=3*ST.dur}}
      s.active=w.evo||s.on>0;if(!s.active)return;
      const n=1+w.lvl+ST.proj,R=82*ST.area,br=11*ST.area;s.n=n;s.R=R;s.br=br;
      for(let i=0;i<n;i++){const a=s.a+i*TAU/n,bx=P.x+Math.cos(a)*R,by=P.y+Math.sin(a)*R;
        for(const e of G.enemies){if(e.dead||(e.cyc||0)>G.t)continue;const rr=br+e.r,dx=e.x-bx,dy=e.y-by;
          if(dx*dx+dy*dy<rr*rr){e.cyc=G.t+0.35;damage(e,8+3*w.lvl);push(e,P.x,P.y,280)}}}}},
  campo:{n:'Campo Radiante',evoN:'Abraço Explosivo',evo:'vida',c:'#7ee081',
    d:'Aura que queima quem chega perto. Escala com Vida Máxima.',up:'Aura maior e mais dano',ed:'Inimigos mortos dentro da aura explodem.',
    tick(w,dt){w.st.t=(w.st.t||0)-dt;if(w.st.t>0)return;w.st.t=0.5;const R=auraR(w),dm=4+2*w.lvl+0.04*ST.maxHp;
      for(const e of G.enemies){if(e.dead)continue;const rr=R+e.r;if(d2(e,P)<rr*rr)damage(e,dm)}}},
  arco:{n:'Arco Ardente',evoN:'Brasa Viva',evo:'area',proj:true,c:'#ffb84d',
    d:'Flechas que deixam áreas de fogo no chão.',up:'Mais dano e fogo mais forte',ed:'O fogo cresce e fica mais forte com o tempo.',
    cd:()=>1.4,fire(w,j){const c=G.enemies.filter(e=>!e.dead&&d2(e,P)<450*450);if(!c.length)return;const e=c[Math.floor(Math.random()*c.length)];
      shoot(Math.atan2(e.y-P.y,e.x-P.x)+j,430,{r:5,dmg:10+3*w.lvl,life:Math.sqrt(d2(e,P))/430+0.05,c:'#ffb84d',
        onEnd:p=>addZone({x:p.x,y:p.y,base:42*ST.area,r:42*ST.area,dmg:5+2*w.lvl,t:0,life:2.6,age:0,grow:w.evo,c:'#ff8a3d'})})}},
  mina:{n:'Mina Saltitante',evoN:'Mina Sem Fim',evo:'dano',proj:true,lock:'lvl15',c:'#ff9a3d',
    d:'Explosivo que pula de inimigo em inimigo.',up:'+1 pulo e mais dano',ed:'Pula sem parar enquanto houver alvo por perto.',
    cd:()=>1.7,fire(w,j){const e=nearest(500);if(!e)return;mineHop(P.x,P.y,e,w,w.evo?40:1+w.lvl+ST.proj,new Set())}},
  gelo:{n:'Armadura Glacial',evoN:'Congelamento Profundo',evo:'arm',lock:'fonte',c:'#9fd4ff',
    d:'De tempos em tempos congela tudo em volta. Escala com Armadura e Vida.',up:'Área maior e mais dano',ed:'Cada pulso também te dá um escudo.',
    tick(w,dt){w.st.t=(w.st.t??1)-dt;if(w.st.t>0)return;w.st.t=4*cdMul;const R=(95+6*w.lvl)*ST.area,dm=10+3*w.lvl+0.6*ST.armor+0.03*ST.maxHp;
      fx(P.x,P.y,10,R,'#9fd4ff',0.4);for(const e of G.enemies){if(e.dead)continue;const rr=R+e.r;if(d2(e,P)<rr*rr){damage(e,dm);if(e.boss)e.slowT=1.5;else e.frozenT=Math.max(e.frozenT,1.2)}}
      if(w.evo){P.shield=Math.max(P.shield,0.15*ST.maxHp);P.shieldT=4}}},
  orbital:{n:'Bombardeio Orbital',evoN:'Chuva Orbital',evo:'crit',lock:'elites',c:'#ffe066',
    d:'Ataques do céu em inimigos aleatórios. Escala com Crítico.',up:'+ataques e mais dano',ed:'Bombardeio triplo que termina num ataque gigante.',
    cd:()=>2.2,fire(w,j){const c=G.enemies.filter(e=>!e.dead&&d2(e,P)<520*520);if(!c.length)return;
      let n=1+Math.floor(w.lvl/2)+ST.proj;if(w.evo)n*=3;const dm=(18+6*w.lvl)*(1+2*(ST.crit-0.05));
      for(let i=0;i<n;i++){const e=c[Math.floor(Math.random()*c.length)];addMark({x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),r:50*ST.area,t:0.6+i*0.07,max:0.6+i*0.07,dmg:dm,c:'#ffe066'})}
      if(w.evo){const e=c[Math.floor(Math.random()*c.length)];addMark({x:e.x,y:e.y,r:130*ST.area,t:1.4,max:1.4,dmg:dm*3,c:'#ffcc4d'})}}},
  estatica:{n:'Espada Estática',evoN:'Tempestade Elétrica',evo:'vida',lock:'pods',c:'#7aa8ff',
    d:'Raio que salta entre os inimigos com mais vida. Escala com Vida Máxima.',up:'+1 salto e mais dano',ed:'Cria uma tempestade elétrica em cada alvo.',
    cd:()=>1.2,fire(w,j){const c=G.enemies.filter(e=>!e.dead&&d2(e,P)<520*520).sort((a,b)=>b.hp-a.hp).slice(0,2+w.lvl+ST.proj);if(!c.length)return;
      const pts=[{x:P.x,y:P.y}],dm=20+6*w.lvl+0.03*ST.maxHp;for(const e of c){pts.push({x:e.x,y:e.y});damage(e,dm);
        if(w.evo)addZone({x:e.x,y:e.y,base:40*ST.area,r:40*ST.area,dmg:dm*0.25,t:0,life:2,age:0,c:'#7aa8ff'})}
      G.bolts.push({pts,life:0.18})}},
  drone:{n:'Drone Felino',evoN:'Drone Final_FINAL',evo:'coleta',lock:'kills',pet:true,c:'#ffd27a',
    d:'Drone que caça inimigos, arremessa e puxa experiência para você.',up:'Mais dano e área',ed:'O drone solta kits de cura enquanto luta.',
    tick(w,dt){const s=w.st;if(s.x===undefined){s.x=P.x;s.y=P.y;s.t=0;s.acc=0}
      const t=nearest(450,P)||P;const dx=t.x-s.x,dy=t.y-s.y,d=Math.hypot(dx,dy)||1;const sp=Math.min(d,320*dt);s.x+=dx/d*sp;s.y+=dy/d*sp;
      if(d2(s,P)>500*500){s.x=P.x;s.y=P.y}
      for(const o of G.orbs)if(!o.mag&&d2(o,s)<90*90)o.mag=true;
      s.t-=dt;if(s.t<=0){s.t=0.5*cdMul;const R=45*ST.area,dm=(8+3*w.lvl)*petMul();let hits=0;
        for(const e of G.enemies){if(e.dead)continue;if(d2(e,s)<(R+e.r)**2){damage(e,dm);hits++;if(!e.boss&&Math.random()<0.25)e.frozenT=Math.max(e.frozenT,0.4)}}
        if(w.evo){s.acc+=hits*dm;if(s.acc>600){s.acc=0;G.orbs.push({x:s.x,y:s.y,heal:true})}}}}},
  trem:{n:'Trem Expresso',evoN:'Expresso Limitado',evo:'dano',lock:'rhea25',pet:true,c:'#ff8a3d',
    d:'De tempos em tempos um trem atravessa a tela atropelando tudo.',up:'Mais dano e trens mais largos',ed:'O trem explode por onde passa e às vezes solta ouro.',
    cd:()=>5.5,fire(w){const dir=Math.random()<0.5?1:-1,y=P.y+rnd(-180,180),len=420;
      G.trains.push({x:P.x-dir*(W/2+len+40),y,vx:dir*1100,len,h:(30+3*w.lvl)*ST.area,hit:new Set(),dmg:(40+12*w.lvl)*petMul(),evo:w.evo,life:2.2,et:0})}},
  luva:{n:'Luva Vórtice',evoN:'Manopla da Tempestade',evo:'regen',lock:'kira25',c:'#7af0ff',
    d:'Dispara uma corrente de projéteis que gira ao seu redor.',up:'Mais dano e cadência',ed:'Uma segunda corrente gira no sentido oposto.',
    tick(w,dt){const s=w.st;s.a=(s.a||0)+2.4*dt;s.t=(s.t||0)-dt;if(s.t>0)return;s.t=Math.max(0.06,0.14-0.01*w.lvl)*cdMul;const arms=1+Math.floor(ST.proj/2);
      for(let k=0;k<arms;k++){shoot(s.a+k*TAU/arms,430,{r:4,dmg:5+2*w.lvl,life:0.75,c:'#7af0ff'});if(w.evo)shoot(-s.a+k*TAU/arms,430,{r:4,dmg:5+2*w.lvl,life:0.75,c:'#c9f9ff'})}}},
  balestra:{n:'Balestra Coelha',evoN:'Balista Prime',evo:'crit',lock:'kaze30',proj:true,c:'#ffd6ec',
    d:'Leque de flechas; acertos críticos atravessam inimigos. Escala com Crítico.',up:'+flechas e mais dano',ed:'Dispara um semicírculo de flechas.',
    cd:()=>1.2,fire(w,j){const a=aim()+j,n=(w.evo?9:3+w.lvl)+ST.proj,sp=w.evo?Math.PI*0.9:0.5,dm=(8+3*w.lvl)*(1+2*(ST.crit-0.05));
      for(let i=0;i<n;i++)shoot(a+(i/(n-1||1)-0.5)*sp,600,{r:4,dmg:dm,life:0.7,c:'#ffd6ec',onHit:(p,e)=>{if(e.critT>0.11)p.pierce=Math.max(p.pierce,3)}})}},
  rastro:{n:'Rastro Venenoso',evoN:'Dispensador Químico',evo:'vel',lock:'rivka35',c:'#9be36b',
    d:'Deixa nuvens de veneno por onde você passa.',up:'Mais dano e nuvens maiores',ed:'Ficar sobre o rastro gera escudo.',
    tick(w,dt){w.st.t=(w.st.t||0)-dt;if(!P.moving||w.st.t>0)return;w.st.t=0.16;const r=(22+2*w.lvl)*ST.area;addZone({x:P.x,y:P.y,base:r,r,dmg:3+1.5*w.lvl,t:0,life:2.2,age:0,c:'#6bbf3a',poison:w.evo})}},
  urso:{n:'Robô Urso',evoN:'Robô Urso Gigante',evo:'dur',lock:'cinco5',pet:true,c:'#ffb36b',
    d:'Invoca um urso robô que ataca o inimigo com mais vida por perto.',up:'Mais dano e mais tempo em campo',ed:'O urso fica enfurecido: maior, mais rápido e mais forte.',
    tick(w,dt){const s=w.st;s.cd=(s.cd??1)-dt;if(!s.b&&s.cd<=0)s.b={x:P.x+30,y:P.y,life:(6+w.lvl)*ST.dur,hit:0,sw:0};if(!s.b)return;const b=s.b;b.life-=dt;if(b.life<=0){fx(b.x,b.y,6,50,'#ffb36b',0.3);s.b=null;s.cd=10*cdMul;return}
      let t=null,bh=0;for(const e of G.enemies)if(!e.dead&&d2(e,P)<520*520&&e.hp>bh){bh=e.hp;t=e}const tg=t||P,dx=tg.x-b.x,dy=tg.y-b.y,dd=Math.hypot(dx,dy)||1,sp=w.evo?330:240;
      if(dd>30){b.x+=dx/dd*Math.min(dd,sp*dt);b.y+=dy/dd*Math.min(dd,sp*dt);b.face=Math.atan2(dy,dx)}
      b.hit-=dt;b.sw=Math.max(0,b.sw-dt);if(b.hit<=0&&t&&dd<80){b.hit=w.evo?0.4:0.6;b.sw=0.18;const R=(w.evo?75:52)*ST.area;for(const e of G.enemies)if(!e.dead&&d2(e,b)<(R+e.r)**2)damage(e,(16+5*w.lvl)*(w.evo?1.6:1)*petMul())}}},
  minas:{n:'Minas Anima',evoN:'Tri-Dinamite',evo:'area',lock:'prov1',c:'#ff7a59',
    d:'Espalha um anel de minas que explodem depois de um tempo.',up:'+minas e mais dano',ed:'Cada mina solta mais três explosões.',
    cd:()=>3.4,fire(w){const n=5+w.lvl+ST.proj,o=Math.random();for(let i=0;i<n;i++){const a=o+i*TAU/n;addMark({x:P.x+Math.cos(a)*110,y:P.y+Math.sin(a)*110,r:55*ST.area,t:1.6,max:1.6,dmg:20+6*w.lvl,c:'#ff7a59',split:w.evo,mine:true})}}},
  bumerangue:{n:'Lâmina Bumerangue',evoN:'Quadrumerangue',evo:'vel',c:'#c4f06b',
    d:'Lâminas que vão até o inimigo mais próximo e voltam.',up:'Mais dano',ed:'Na volta, cada lâmina explode num leque de mísseis.',
    cd:()=>1.3,fire(w,j){const n=1+ST.proj,e=nearest(500),a0=e?Math.atan2(e.y-P.y,e.x-P.x):aim();for(let i=0;i<n;i++)shoot(a0+j+(i-(n-1)/2)*0.4,480,{r:9,dmg:10+4*w.lvl,life:0.6,pierce:999,evoRet:true,spin:true,fan:w.evo,c:'#c4f06b'})}},
  gatling:{n:'Metralhadora Coelha',evoN:'Barragem Dupla',evo:'dur',c:'#ffe48a',
    d:'Dano contínuo em cone à frente.',up:'Cone maior e mais dano',ed:'Inimigos atingidos ficam lentos e acabam atordoados.',
    tick(w,dt){w.st.t=(w.st.t||0)-dt;if(w.st.t>0)return;w.st.t=0.1;const a=aim(),R=(140+8*w.lvl)*ST.area,sp=0.32;w.st.fl=(w.st.fl||0)+1;if(w.st.fl%2)G.fxs.push({x:P.x,y:P.y,cone:true,a,sp,R,c:'#ffe48a',life:0.1,max:0.1});
      coneHit(a,R,sp,2+0.9*w.lvl,e=>{if(w.evo&&!e.boss){e.slowT=0.5;e.gat=(e.gat||0)+0.1*ST.dur;if(e.gat>1.5){e.gat=0;e.frozenT=Math.max(e.frozenT,1)}}})}},
  aniquilador:{n:'Aniquilador',evoN:'Apocalipse Anima',evo:'exp',lock:'lvl30',c:'#ff5fa2',
    d:'Golpe gigante que mata todos os inimigos comuns e fere muito elites. Recarga longa.',up:'Recarga menor e mais dano em elites',ed:'Inimigos mortos soltam muito mais experiência e ouro.',
    cd:w=>30-2*w.lvl,fire(w){G.flash=0.5;sfx('ult');addTimer({t:0.5,fn(){fx(P.x,P.y,30,Math.max(W,H)*0.6,'#ff5fa2',0.6);
      for(const e of G.enemies){if(e.dead||d2(e,P)>620*620)continue;if(e.elite||e.boss||e.miniboss)damage(e,200+60*w.lvl);else{if(w.evo)e.bonus=true;damage(e,1e9)}}}})}},
};
