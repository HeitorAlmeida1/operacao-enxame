/* ---------- Arena: limites, cenário em escala grande e minimapa ----------
   O mundo é um quadrado de 2*rad centrado em (0,0). Tudo aqui é desenhado
   dentro do cache de blocos (paintChunk, em toon.js) ou por cima, na tela.
   Estilo: vetor chapado com contorno escuro, igual ao resto. */

/* cor hex + alfa → rgba() */
function hexA(hex, a){
  const n = parseInt(hex.slice(1), 16);
  return 'rgba(' + ((n>>16)&255) + ',' + ((n>>8)&255) + ',' + (n&255) + ',' + a + ')';
}

/* retângulo arredondado (define o caminho, não pinta) */
function roundRect(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
}

/* ---------- Cenário em escala grande ----------
   Desenhado em coordenadas de MUNDO, para que as formas atravessem vários
   blocos e o mapa tenha geografia de verdade: caminhos, lago, leito seco,
   corredores de caverna, linha de praia. */
function macroPaint(map, cx, cy){
  const M = MAPS[map], R = M.rad;
  const wx = cx * CH, wy = cy * CH;
  ctx.save();
  ctx.translate(-wx, -wy);
  ctx.lineJoin = 'round';

  if(map === 'distrito'){
    // caminhos de terra batida em cruz
    ctx.strokeStyle = '#b08a52'; ctx.lineWidth = 150; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-R, 0); ctx.lineTo(R, 0);
    ctx.moveTo(0, -R); ctx.lineTo(0, R); ctx.stroke();
    ctx.strokeStyle = 'rgba(45,28,16,.18)'; ctx.lineWidth = 4;
    for(const h of [true,false]) for(const sd of [-1,1]){
      ctx.beginPath();
      if(h){ ctx.moveTo(-R, sd*75); ctx.lineTo(R, sd*75); }
      else { ctx.moveTo(sd*75, -R); ctx.lineTo(sd*75, R); }
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(45,28,16,.12)';
    for(let i=-R;i<R;i+=90){
      ctx.beginPath(); ctx.ellipse(i+((i*7)%40)-20, ((i*13)%90)-45, 9, 6, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(((i*11)%90)-45, i+((i*5)%40)-20, 9, 6, 0, 0, TAU); ctx.fill();
    }
    // lago a nordeste
    const lx = R*0.52, ly = -R*0.5;
    ctx.beginPath(); ctx.ellipse(lx, ly, R*0.24, R*0.17, 0.3, 0, TAU);
    ctx.fillStyle = T.water; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(lx - R*0.06, ly - R*0.04, R*0.1, R*0.055, 0.3, 0, TAU);
    ctx.fillStyle = hexA(T.waterL, .55); ctx.fill();
    // bosque a sudoeste
    for(let i=0;i<22;i++){
      const a = i*2.4, d = R*0.18 + (i%5)*R*0.045;
      const tx = -R*0.55 + Math.cos(a)*d, ty = R*0.5 + Math.sin(a)*d*0.6;
      ctx.beginPath(); ctx.ellipse(tx, ty+14, 22, 8, 0, 0, TAU);
      ctx.fillStyle = INK_S; ctx.fill();
      ctx.strokeStyle = T.bark; ctx.lineWidth = 9; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(tx, ty+10); ctx.lineTo(tx, ty-14); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(tx, ty-30, 30, 26, 0, 0, TAU);
      ctx.fillStyle = T.leaf; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(tx-10, ty-38, 11, 8, -0.4, 0, TAU);
      ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fill();
    }
  }
  else if(map === 'periferia'){
    // leito de rio seco
    ctx.strokeStyle = '#b8955c'; ctx.lineWidth = 190; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-R, -R*0.4);
    ctx.bezierCurveTo(-R*0.3, -R*0.1, R*0.2, -R*0.6, R, -R*0.15);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(45,28,16,.22)'; ctx.lineWidth = 5; ctx.stroke();
    // fendas irradiando do centro
    ctx.strokeStyle = 'rgba(45,28,16,.3)'; ctx.lineCap = 'round';
    for(let i=0;i<10;i++){
      const a = i*TAU/10 + 0.3;
      ctx.lineWidth = 7 - (i%3)*1.6;
      let px = Math.cos(a)*R*0.14, py = Math.sin(a)*R*0.14;
      ctx.beginPath(); ctx.moveTo(px, py);
      for(let k=0;k<7;k++){
        px += Math.cos(a + Math.sin(k*2.3)*0.5) * R*0.12;
        py += Math.sin(a + Math.sin(k*2.3)*0.5) * R*0.12;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.beginPath(); ctx.ellipse(0, 0, R*0.19, R*0.16, 0, 0, TAU);
    ctx.fillStyle = '#a07a44'; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
    // mesas de rocha
    for(const [mx,my,ms] of [[-R*0.6,-R*0.55,1],[R*0.58,R*0.5,0.8],[-R*0.5,R*0.62,0.65]]){
      ctx.beginPath(); ctx.ellipse(mx, my+ms*30, ms*120, ms*34, 0, 0, TAU);
      ctx.fillStyle = INK_S; ctx.fill();
      roundRect(mx-ms*110, my-ms*70, ms*220, ms*110, ms*20);
      ctx.fillStyle = T.rock; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
      roundRect(mx-ms*100, my-ms*62, ms*200, ms*26, ms*14);
      ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill();
    }
  }
  else if(map === 'lab'){
    // galerias de caverna
    ctx.fillStyle = '#7d796e';
    const step = R/2.4;
    for(let k=-2;k<=2;k++){
      roundRect(-R, k*step-78, R*2, 156, 60); ctx.fill();
      roundRect(k*step-78, -R, 156, R*2, 60); ctx.fill();
    }
    ctx.beginPath(); ctx.ellipse(0, 0, R*0.3, R*0.26, 0, 0, TAU);
    ctx.fillStyle = '#8a867a'; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
    // estalagmites em volta da câmara
    for(let i=0;i<16;i++){
      const a = i*TAU/16, px = Math.cos(a)*R*0.3, py = Math.sin(a)*R*0.26;
      ctx.beginPath();
      ctx.moveTo(px-14, py+10); ctx.lineTo(px, py-34); ctx.lineTo(px+14, py+10);
      ctx.closePath();
      ctx.fillStyle = T.rockD; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke();
    }
    // veios de cristal
    ctx.strokeStyle = hexA(T.purple,.5); ctx.lineWidth = 9; ctx.lineCap='round';
    for(let i=0;i<7;i++){
      const a = i*TAU/7 + 0.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*R*0.35, Math.sin(a)*R*0.35);
      ctx.lineTo(Math.cos(a+0.3)*R*0.85, Math.sin(a+0.3)*R*0.85);
      ctx.stroke();
    }
  }
  else {
    // mar a oeste, areia a leste
    const shore = y => -R*0.1 + Math.sin(y*0.0015)*R*0.18;
    ctx.beginPath();
    ctx.moveTo(-R, -R);
    for(let y=-R; y<=R; y+=100) ctx.lineTo(shore(y), y);
    ctx.lineTo(-R, R); ctx.closePath();
    ctx.fillStyle = T.water; ctx.fill();
    // espuma na beira
    ctx.strokeStyle = '#f4f0e2'; ctx.lineWidth = 11; ctx.lineCap='round';
    ctx.beginPath();
    for(let y=-R; y<=R; y+=60){
      const px = shore(y) + Math.sin(y*0.02)*9;
      y === -R ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    // marcas de maré na areia
    ctx.strokeStyle = 'rgba(45,28,16,.12)'; ctx.lineWidth = 4;
    for(let k=1;k<=5;k++){
      ctx.beginPath();
      for(let y=-R;y<=R;y+=80){ const px = shore(y)+k*70; y===-R?ctx.moveTo(px,y):ctx.lineTo(px,y); }
      ctx.stroke();
    }
    // rochedos na água
    for(const [rx,ry,rs] of [[-R*0.55,-R*0.3,1],[-R*0.72,R*0.35,0.75],[-R*0.4,R*0.62,0.6]]){
      ctx.beginPath();
      ctx.moveTo(rx-60*rs, ry+30*rs); ctx.lineTo(rx-22*rs, ry-52*rs);
      ctx.lineTo(rx+26*rs, ry-40*rs); ctx.lineTo(rx+62*rs, ry+30*rs);
      ctx.closePath();
      ctx.fillStyle = T.rock; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    }
  }
  ctx.restore();
}

/* ---------- Barreira da arena: paliçada de madeira ----------
   Pintada dentro do bloco, então entra no cache e não custa por quadro. */
function arenaEdgePaint(map, cx, cy){
  const M = MAPS[map], R = M.rad, wx = cx*CH, wy = cy*CH;
  if(wx >= -R && wx+CH <= R && wy >= -R && wy+CH <= R) return;

  ctx.save();
  ctx.translate(-wx, -wy);
  ctx.lineJoin = 'round';

  // terreno de fora, escuro
  ctx.beginPath();
  ctx.rect(wx-4, wy-4, CH+8, CH+8);
  ctx.rect(R, -R, -(R*2), R*2);
  ctx.fillStyle = '#2b2a22';
  ctx.fill('evenodd');

  // mato fechado lá fora
  ctx.save();
  ctx.beginPath();
  ctx.rect(wx-4, wy-4, CH+8, CH+8);
  ctx.rect(R, -R, -(R*2), R*2);
  ctx.clip('evenodd');
  const RR = srand((cx*2654435761) ^ (cy*40503) ^ 7);
  for(let k=0;k<26;k++){
    const bx = wx + RR()*CH, by = wy + RR()*CH, bs = 16 + RR()*22;
    ctx.beginPath(); ctx.ellipse(bx, by, bs, bs*0.8, 0, 0, TAU);
    ctx.fillStyle = RR() < 0.5 ? '#3d4a2c' : '#2f3a22';
    ctx.fill();
    ctx.strokeStyle = 'rgba(20,16,10,.6)'; ctx.lineWidth = 3; ctx.stroke();
  }
  ctx.restore();

  // estacas pontudas
  const stakeW = 34, TT = 30;
  const stake = (px, py, horiz) => {
    ctx.save(); ctx.translate(px, py); if(!horiz) ctx.rotate(Math.PI/2);
    ctx.beginPath();
    ctx.moveTo(-stakeW/2, TT/2); ctx.lineTo(-stakeW/2, -TT/2);
    ctx.lineTo(0, -TT/2 - 11); ctx.lineTo(stakeW/2, -TT/2); ctx.lineTo(stakeW/2, TT/2);
    ctx.closePath();
    ctx.fillStyle = M.wall; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.strokeStyle = 'rgba(45,28,16,.3)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-stakeW*0.18, TT/2); ctx.lineTo(-stakeW*0.18, -TT/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(stakeW*0.2, TT/2); ctx.lineTo(stakeW*0.2, -TT/2-4); ctx.stroke();
    ctx.restore();
  };
  const nearX = p => Math.abs(wx + CH/2 - p) < CH;
  const nearY = p => Math.abs(wy + CH/2 - p) < CH;
  for(let p = -R; p <= R; p += stakeW - 4){
    if(p > wx - stakeW && p < wx + CH + stakeW){
      if(nearY(-R)) stake(p, -R, true);
      if(nearY( R)) stake(p,  R, true);
    }
    if(p > wy - stakeW && p < wy + CH + stakeW){
      if(nearX(-R)) stake(-R, p, false);
      if(nearX( R)) stake( R, p, false);
    }
  }
  // travessa amarrando tudo
  ctx.strokeStyle = M.wall; ctx.lineWidth = 9;
  ctx.strokeRect(-R, -R, R*2, R*2);
  ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
  ctx.strokeRect(-R, -R, R*2, R*2);

  // torres de canto com bandeirinha
  for(const sx of [-1,1]) for(const sy of [-1,1]){
    const px = sx*R, py = sy*R;
    if(!nearX(px) || !nearY(py)) continue;
    ctx.beginPath(); ctx.ellipse(px, py+14, 50, 18, 0, 0, TAU);
    ctx.fillStyle = INK_S; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 44, 0, TAU);
    ctx.fillStyle = T.stone; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.arc(px, py, 30, 0, TAU);
    ctx.fillStyle = T.stoneD; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(px, py-30); ctx.lineTo(px, py-72); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, py-72); ctx.lineTo(px+34, py-62); ctx.lineTo(px, py-52); ctx.closePath();
    ctx.fillStyle = M.neon; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
  }
  ctx.restore();
}

/* ---------- Minimapa (canto inferior esquerdo), em pergaminho ---------- */
function drawMinimap(){
  if(W < 520) return;
  const S = Math.min(200, Math.max(148, Math.round(H*0.25)));
  const pad = 16;
  const x0 = pad, y0 = H - S - pad - 40;
  const R = mapRad(), sc = S/(R*2), cx = x0 + S/2, cy = y0 + S/2;
  const M = MAPS[G.map];
  const wx = o => cx + o.x*sc, wy = o => cy + o.y*sc;

  ctx.save();
  // moldura de madeira
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
  roundRect(x0-10, y0-24, S+20, S+20+24, 10);
  ctx.fillStyle = T.wood; ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke();
  // pergaminho por dentro
  roundRect(x0-4, y0-4, S+8, S+8, 5);
  ctx.fillStyle = T.parch; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();

  ctx.fillStyle = T.cream;
  ctx.font = '700 11px "Baloo 2","Chakra Petch",sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(M.n, x0 - 2, y0 - 9);

  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, S, S); ctx.clip();
  ctx.fillStyle = M.sky || M.bg; ctx.fillRect(x0, y0, S, S);
  ctx.strokeStyle = 'rgba(45,28,16,.16)'; ctx.lineWidth = 1;
  for(let k=1;k<4;k++){
    ctx.beginPath(); ctx.moveTo(x0+S*k/4, y0); ctx.lineTo(x0+S*k/4, y0+S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, y0+S*k/4); ctx.lineTo(x0+S, y0+S*k/4); ctx.stroke();
  }
  if(G.sea){ ctx.fillStyle = hexA(T.water,.6); ctx.fillRect(x0, y0, Math.max(0, wx(G.sea)-x0), S); }

  const dot = (o, r, c) => {
    ctx.beginPath(); ctx.arc(wx(o), wy(o), r, 0, TAU);
    ctx.fillStyle = c; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
  };

  ctx.fillStyle = 'rgba(45,28,16,.6)';
  for(let i=0;i<G.enemies.length;i+=3){ const e = G.enemies[i];
    if(!e.elite && !e.boss && !e.miniboss) ctx.fillRect(wx(e)-1, wy(e)-1, 2.4, 2.4); }

  if(G.map==='distrito') dot(G.fountain, 4, G.fountain.cd>0 ? T.stoneD : T.grassL);
  if(G.map==='periferia'){ dot(G.cannon, 4, T.waterL); for(const f of G.fuel) dot(f, 3, T.grass); }
  if(G.map==='lab') for(const b of G.bombs) dot(b, 4, b.cd>0 ? T.stoneD : T.waterL);

  for(const s of G.spires){
    const c = {boon:T.yellow, quest:T.purple, trial:T.red}[s.type];
    dot(s, 4, c);
    ctx.strokeStyle = c; ctx.lineWidth = 1.4; ctx.globalAlpha = .7;
    ctx.beginPath(); ctx.arc(wx(s), wy(s), 7 + Math.sin(G.t*4)*1.6, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  if(G.quest && G.quest.kind==='zona') dot(G.quest, 4.5, T.purple);
  for(const c of G.cards) dot(c, 3, T.yellow);
  for(const e of G.enemies){
    if(e.boss) dot(e, 6, T.red);
    else if(e.miniboss) dot(e, 4, T.purple);
    else if(e.elite) dot(e, 3, T.yellow);
  }

  ctx.strokeStyle = 'rgba(45,28,16,.4)'; ctx.lineWidth = 1.2;
  ctx.strokeRect(wx(P) - W*sc/2, wy(P) - H*sc/2, W*sc, H*sc);
  ctx.restore();

  ctx.beginPath(); ctx.arc(wx(P), wy(P), 4, 0, TAU);
  ctx.fillStyle = '#fffaf0'; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();

  ctx.restore();
}
