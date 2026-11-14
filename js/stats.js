function stats(){const p=P.pas,u=SAVE.up,a=P.aug;let bs=0,bh=0,bp=0,ba=0,barm=0,bd=0,dr=0;
  for(const b of P.buffs){bs+=b.spd||0;bh+=b.haste||0;bp+=b.proj||0;ba+=b.area||0;barm+=b.arm||0;bd+=b.dmg||0;dr+=b.dr||0}
  const L=k=>p[k]||0,U=k=>u[k]||0,an=U('anima');
  const missing=P.fid==='vex'?Math.max(0,1-P.hp/(P.lastMax||100)):0;
  const armor=P.f.armor+8*L('arm')+3*U('arm')+barm+(a.blindado?20:0);
  let spdMul=1+0.09*L('vel')+0.04*U('vel')+0.01*an+bs+(a.mini?0.2:0)+(a.veloz?0.1:0)+0.6*missing;if(a.gigante)spdMul*=0.85;
  const dmg=1+0.1*L('dano')+0.05*U('dano')+0.01*an+bd+(a.vidro?0.4:0)+(a.pesado?0.5:0)-(a.spray?0.3:0)+0.05*P.collected+(a.blindado?0.005*armor:0)+(a.veloz?Math.max(0,spdMul-1):0)+0.5*missing;
  let area=1+0.11*L('area')+0.04*U('area')+ba+(a.gigante?0.3:0);if(P.fid==='rhea')area+=0.01*armor;
  const maxHp=Math.round((100+25*L('vida')+10*U('vida'))*(a.vidro?0.6:1)*(a.mini?0.8:1)*(a.gigante?1.3:1));
  return{dmg,haste:10*L('acel')+5*U('acel')+an+bh-(a.pesado?30:0)+(a.mini?36:0),area,armor,maxHp,dr:Math.min(0.6,dr),
    dur:1+0.12*L('dur')+0.05*U('dur'),regen:L('regen')+0.5*U('regen'),crit:0.05+0.08*L('crit')+0.03*U('crit')+(P.fid==='kaze'?0.15:0),
    proj:[0,1,1,2,2,3][L('proj')]+U('proj')+bp+(a.spray?3:0),spd:200*spdMul,xp:1+0.1*U('xp')+0.1*L('exp'),
    pick:110*(1+0.2*U('pick')+0.35*L('coleta')+0.01*an)*(P.fid==='pluma'?1.5:1)*(a.ima?0.2:1),gold:(1+0.15*U('gold'))*DIFF[G.diff].gold}}
