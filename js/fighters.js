const FIGHTERS={
  kira:{n:'Kira',t:'Atiradora felina',sig:'rajada',c:'#4fe3d6',stat:'Aceleração',armor:0,
    pas:'Empolgação: a cada 60 abates ganha +35% de velocidade e +40 de aceleração por 6 s.',
    E:{n:'Foguetes',cd:7,d:'Leque de 9 foguetes que explodem.'},R:{n:'Míssil Supremo',cd:40,d:'Míssil gigante; mais dano em inimigos já feridos.'},
    useE(){const a=aim(),n=9+2*ST.proj;for(let i=0;i<n;i++)shoot(a+(i/(n-1)-0.5)*1.1,480,{r:7,dmg:0,life:0.65,c:'#ffcc4d',rocket:true,onEnd:p=>explode(p.x,p.y,55*ST.area,30+3*P.lvl,'#ffcc4d')})},
    useR(){const t=bigTarget(),tx=t?t.x:P.x+Math.cos(P.face)*300,ty=t?t.y:P.y+Math.sin(P.face)*300,dd=Math.hypot(tx-P.x,ty-P.y);
      shoot(Math.atan2(ty-P.y,tx-P.x),720,{r:11,noHit:true,life:dd/720,c:'#ff5d6c',rocket:true,onEnd:p=>explode(p.x,p.y,170*ST.area,200+12*P.lvl,'#ff5d6c',true)});
      // cada ponto de Projéteis manda um míssil de apoio
      for(let i=0;i<ST.proj;i++)addTimer({t:0.12*(i+1),fn(){const an=Math.atan2(ty-P.y,tx-P.x)+(i%2?0.22:-0.22)*(1+Math.floor(i/2));
        shoot(an,660,{r:7,noHit:true,life:dd/660,c:'#ff8f7a',rocket:true,onEnd:p=>explode(p.x,p.y,95*ST.area,90+6*P.lvl,'#ff8f7a')})}})}},
  lumen:{n:'Lumen',t:'Cantora das ondas',sig:'onda',c:'#ff5fa2',stat:'Projéteis',armor:0,
    pas:'Eco: 33% de chance de disparar cada arma de projétil duas vezes.',
    E:{n:'Escudo Sonoro',cd:10,d:'Escudo de 35% da vida e muita velocidade por 3 s.'},R:{n:'Nota Perfeita',cd:45,d:'Congela todos os inimigos por 3 s e depois solta uma onda de choque.'},
    useE(){P.shield=0.35*ST.maxHp;P.shieldT=3*ST.dur;P.buffs.push({t:3*ST.dur,spd:0.6});fx(P.x,P.y,10,60,'#9fd4ff',0.4)},
    useR(){for(const e of G.enemies)if(!e.dead)e.frozenT=(e.boss?1.5:3)*ST.dur;P.invuln=3*ST.dur;fx(P.x,P.y,10,Math.max(W,H),'#bfe8ff',0.8);
      sfx('freeze');
      const ondas=1+ST.proj;                               // Projéteis = mais ondas de choque
      for(let i=0;i<ondas;i++)addTimer({t:3*ST.dur+i*0.17,fn(){const R=(380-i*45)*ST.area;
        explode(P.x,P.y,R,(140+8*P.lvl)*(i?0.55:1),'#ff5fa2');
        for(const e of G.enemies)if(!e.dead&&d2(e,P)<R*R)push(e,P.x,P.y,500)}})}},
  rhea:{n:'Rhea',t:'Guardiã solar',sig:'escudo',c:'#e0c27a',stat:'Armadura',armor:15,lock:'arco3',
    pas:'Luz Solar: cada ponto de armadura dá +1% de área.',
    E:{n:'Eclipse',cd:9,d:'+30 de armadura e escudo por 3 s; depois explode em volta.'},R:{n:'Raio Solar',cd:45,d:'Raio do céu que atordoa por 2 s e deixa o chão em chamas.'},
    useE(){P.buffs.push({t:3*ST.dur,arm:30});P.shield=Math.max(P.shield,0.25*ST.maxHp);P.shieldT=3*ST.dur;fx(P.x,P.y,10,50,'#ffcc4d',0.4);
      addTimer({t:3*ST.dur,fn(){explode(P.x,P.y,120*ST.area,40+4*P.lvl+ST.armor,'#ffcc4d')}})},
    useR(){const t=bigTarget(),x=t?t.x:P.x+Math.cos(P.face)*250,y=t?t.y:P.y+Math.sin(P.face)*250,R=130*ST.area;
      addMark({x,y,r:R,t:0.5,max:0.5,dmg:150+10*P.lvl,c:'#ffcc4d',stun:2*ST.dur,fire:true});
      for(let i=0;i<ST.proj;i++){const an=i*TAU/Math.max(1,ST.proj)+0.6;   // raios menores em volta
        addMark({x:x+Math.cos(an)*R*1.15,y:y+Math.sin(an)*R*1.15,r:R*0.55,t:0.5+i*0.07,max:0.5+i*0.07,
          dmg:70+5*P.lvl,c:'#ffcc4d',stun:1*ST.dur,fire:true})}}},
  vex:{n:'Vex',t:'Fera primordial',sig:'garra',c:'#ff4d6d',stat:'Vida Máxima',armor:5,lock:'win3',
    pas:'Instinto: quanto menos vida, mais dano (até +50%) e velocidade (até +60%).',
    E:{n:'Frenesi',cd:9,d:'Por 4 s: ataques muito rápidos, −25% de dano recebido e cura contínua.'},R:{n:'Mergulho',cd:35,d:'Salta no alvo mais forte causando dano em área e entra em frenesi.'},
    useE(){P.buffs.push({t:4*ST.dur,haste:90,dr:0.25,heal:0.03});fx(P.x,P.y,10,60,'#ff4d6d',0.4)},
    useR(){const t=bigTarget();if(t){P.x=t.x-Math.cos(Math.atan2(t.y-P.y,t.x-P.x))*(t.r+16);P.y=t.y-Math.sin(Math.atan2(t.y-P.y,t.x-P.x))*(t.r+16)}
      P.invuln=Math.max(P.invuln,0.6);explode(P.x,P.y,140*ST.area,120+10*P.lvl,'#ff4d6d');P.buffs.push({t:6*ST.dur,haste:90,dr:0.25,heal:0.03})}},
  kaze:{n:'Kaze',t:'Espadachim do vento',sig:'tempestade',c:'#bfe8ff',stat:'Crítico',armor:0,lock:'minis',
    pas:'Caminho do Errante: +15% de chance de crítico desde o início.',
    E:{n:'Investida',cd:3,d:'Avança rápido na direção em que anda, cortando e ganhando um pequeno escudo.'},R:{n:'Muralha de Vento',cd:40,d:'Muro que avança empurrando inimigos e bloqueando tiros por 5 s.'},
    useE(){const a=P.moving?P.face:aim();P.dash={t:0.2,vx:Math.cos(a)*1100,vy:Math.sin(a)*1100,hit:new Set(),dmg:25+5*P.lvl};P.invuln=Math.max(P.invuln,0.22);P.shield=Math.max(P.shield,0.1*ST.maxHp);P.shieldT=2*ST.dur},
    useR(){const a=aim();G.walls.push({x:P.x+Math.cos(a)*70,y:P.y+Math.sin(a)*70,a,len:(240+45*ST.proj)*ST.area,vx:Math.cos(a)*60,vy:Math.sin(a)*60,life:5*ST.dur})}},
  pluma:{n:'Pluma',t:'Morcego das penas',sig:'pena',c:'#ff7ad9',stat:'Coleta',armor:0,lock:'prov',
    pas:'Asas de Morcego: +50% de raio de coleta; a cada 150 coletas ganha +40 de aceleração por 6 s.',
    E:{n:'Chamado das Penas',cd:6,d:'Todas as penas no chão voltam até você, ferindo e prendendo inimigos.'},R:{n:'Tempestade de Penas',cd:40,d:'Fica intocável, explode em volta e espalha 12 penas.'},
    useE(){recallFeathers()},
    useR(){P.invuln=Math.max(P.invuln,1.2*ST.dur);explode(P.x,P.y,160*ST.area,120+8*P.lvl,'#ff7ad9');
      const n=12+2*ST.proj;
      for(let i=0;i<n;i++){const a=i*TAU/n;G.feathers.push({x:P.x+Math.cos(a)*140*ST.area,y:P.y+Math.sin(a)*140*ST.area})}}},
  lebre:{n:'Lebre',t:'Coelha mística',sig:'feitico',c:'#b8a4ff',stat:'EXP',armor:0,lock:'minis25',
    pas:'Espíritos: a cada 7 níveis ganha um espírito que dispara sozinho.',
    E:{n:'Entre Véus',cd:6,d:'Salta para onde está andando, intocável, ferindo quem atravessa.'},R:{n:'Entre Mundos',cd:40,d:'Cria um anel de 10 s que fere todo inimigo que cruza a borda.'},
    useE(){const a=P.moving?P.face:aim();P.dash={t:0.22,vx:Math.cos(a)*1000,vy:Math.sin(a)*1000,hit:new Set(),dmg:20+4*P.lvl};P.invuln=Math.max(P.invuln,0.6)},
    useR(){G.rings.push({x:P.x,y:P.y,r:220*ST.area,life:10*ST.dur,tick:0,dmg:25+3*P.lvl});
      for(let i=1;i<=ST.proj;i++)G.rings.push({x:P.x,y:P.y,r:(220-i*42)*ST.area,life:10*ST.dur,tick:0,dmg:(25+3*P.lvl)*0.6})}},
  tora:{n:'Tora',t:'Ursa sacerdotisa',sig:'tentaculo',c:'#3fd0a0',stat:'Duração',armor:8,lock:'evo3',
    pas:'Resiliência: regenera vida para cada tentáculo perto de você.',
    E:{n:'Golpe do Ídolo',cd:7,d:'Golpe em linha que arremessa inimigos e deixa um tentáculo na ponta.'},R:{n:'Salto de Fé',cd:40,d:'Golpe em área, 6 tentáculos em volta e muita aceleração por 10 s.'},
    useE(){const a=aim(),L=260*ST.area,x2=P.x+Math.cos(a)*L,y2=P.y+Math.sin(a)*L;G.beams.push({x1:P.x,y1:P.y,x2,y2,life:0.25,c:'#3fd0a0',w:40});
      for(const e of G.enemies)if(!e.dead&&segDist2(e.x,e.y,P.x,P.y,x2,y2)<(28+e.r)**2){damage(e,30+4*P.lvl);if(!e.boss)e.frozenT=Math.max(e.frozenT,0.7)}spawnTent(x2,y2,P.weapons[0])},
    useR(){explode(P.x,P.y,160*ST.area,80+8*P.lvl,'#3fd0a0');const n=6+ST.proj;for(let i=0;i<n;i++){const a=i*TAU/n;spawnTent(P.x+Math.cos(a)*120,P.y+Math.sin(a)*120,P.weapons[0])}P.buffs.push({t:10*ST.dur,haste:60})}},
  rivka:{n:'Rivka',t:'Coelha guerreira',sig:'salto',c:'#ff9ad5',stat:'Velocidade',armor:3,lock:'win1h',
    pas:'Lâmina Rúnica: até +25% de dano em inimigos perto; parte do dano vira escudo.',
    E:{n:'Valor',cd:5,d:'Avança e atordoa os inimigos em volta de onde parar.'},R:{n:'Lâmina do Exílio',cd:40,d:'Por 8 s: +100% de velocidade e cada salto solta uma onda cortante.'},
    useE(){const a=P.moving?P.face:aim();P.dash={t:0.16,vx:Math.cos(a)*1050,vy:Math.sin(a)*1050,hit:new Set(),dmg:20+4*P.lvl};addTimer({t:0.17,fn(){fx(P.x,P.y,10,90,'#ff9ad5',0.3);for(const e of G.enemies)if(!e.dead&&!e.boss&&d2(e,P)<(90*ST.area)*(90*ST.area))e.frozenT=Math.max(e.frozenT,1)}})},
    useR(){P.buffs.push({t:8*ST.dur,spd:1.0,exile:true});fx(P.x,P.y,10,100,'#ff9ad5',0.5)}},
};
function spawnTent(x,y,w){const big=!!(w&&w.evo),lv=w&&w.lvl?w.lvl:1;if(G.tents.length>=12)G.tents.shift();
  G.tents.push({x,y,life:(big?7:4.5)*ST.dur,max:(big?7:4.5)*ST.dur,cd:0.3,r:(big?60:44)*ST.area,dmg:8+3*lv,big,slam:0,a:Math.random()*TAU})}
function bigTarget(){if(G.boss&&!G.boss.dead&&d2(G.boss,P)<800*800)return G.boss;let best=null,bd=700*700;for(const e of G.enemies)if(!e.dead&&(e.elite||e.miniboss)&&d2(e,P)<bd){bd=d2(e,P);best=e}return best||nearest(700)}
