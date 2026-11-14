/* =========================================================================
   Estilo "toon": vetor chapado com contorno escuro grosso, proporção chibi
   e paleta quente — no espírito dos RPGs 2D desenhados à mão.

   Este arquivo é carregado DEPOIS do draw.js e REDEFINE drawFighter,
   drawEnemy, drawBoss e paintChunk. O draw.js continua cuidando de
   projéteis, zonas, HUD do mundo e efeitos; aqui ficam os personagens,
   os monstros e o chão.
   ========================================================================= */

/* ---------- tinta e paleta ---------- */
const INK   = '#2d1c10';          // contorno: marrom bem escuro, nunca preto puro
const INK_S = 'rgba(45,28,16,.30)';
const T = {
  cream:'#f6e7c6', parch:'#e8d5a8', sand:'#dfc183', sandD:'#c49f5e',
  grass:'#7fb749', grassD:'#55893a', grassL:'#a3d363',
  wood:'#8a5a2b', woodD:'#5c3a19', woodL:'#b07f45',
  stone:'#9d9a8e', stoneD:'#6e6b61', stoneL:'#c2bfb2',
  water:'#5bb6d6', waterD:'#3c86a8', waterL:'#8fd8ee',
  rock:'#7a6a5c', rockD:'#4e4239',
  leaf:'#4e8f3d', bark:'#6b4a2a',
  red:'#d0503c', orange:'#e8873a', yellow:'#f2c14e',
  purple:'#8e6bb0', pink:'#e07ba8', blue:'#5a8fd0',
};

/* espessura de contorno proporcional ao tamanho */
const tk = r => Math.max(1.8, r * 0.2);

/* preenche o caminho atual e contorna */
function inked(fill, w, ink){
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = ink || INK; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke();
}
/* bolha: elipse com contorno e brilho no alto */
function tBlob(x, y, rx, ry, fill, w, noShine){
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  inked(fill, w === undefined ? tk(rx) : w);
  if(!noShine){
    ctx.beginPath();
    ctx.ellipse(x - rx*0.34, y - ry*0.38, rx*0.3, ry*0.22, -0.5, 0, TAU);
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fill();
  }
}
/* polígono com contorno */
function tPoly(pts, fill, w){
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for(let i=2;i<pts.length;i+=2) ctx.lineTo(pts[i], pts[i+1]);
  ctx.closePath(); inked(fill, w || 2.5);
}
/* olho grande: branco, pupila escura e reflexo */
function tEye(x, y, r, dx, dy, closed){
  if(closed){
    ctx.beginPath(); ctx.moveTo(x-r, y); ctx.quadraticCurveTo(x, y+r*0.7, x+r, y);
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1.4, r*0.4); ctx.lineCap='round'; ctx.stroke();
    return;
  }
  ctx.beginPath(); ctx.ellipse(x, y, r, r*1.12, 0, 0, TAU);
  inked('#fffaf0', Math.max(1.2, r*0.34));
  const px = x + (dx||0)*r*0.3, py = y + (dy||0)*r*0.3;
  ctx.beginPath(); ctx.ellipse(px, py, r*0.46, r*0.56, 0, 0, TAU);
  ctx.fillStyle = INK; ctx.fill();
  ctx.beginPath(); ctx.arc(px - r*0.18, py - r*0.24, r*0.17, 0, TAU);
  ctx.fillStyle = '#ffffff'; ctx.fill();
}
/* sombra de contato, bem suave */
function tShadow(x, y, rx, ry){
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  ctx.fillStyle = INK_S; ctx.fill();
}
/* losango isométrico (um ladrilho de chão) */
function tTile(cx, cy, w, h, fill, line){
  ctx.beginPath();
  ctx.moveTo(cx, cy - h/2); ctx.lineTo(cx + w/2, cy);
  ctx.lineTo(cx, cy + h/2); ctx.lineTo(cx - w/2, cy); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if(line){ ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke(); }
}

/* =========================================================================
   Chão: ladrilhos isométricos por mapa
   ========================================================================= */
const TW = 128, TH = 64;                // largura e altura do losango

function paintChunk(map, cx, cy){
  const M = MAPS[map];
  const R = srand((cx*73856093) ^ (cy*19349663) ^ (map.charCodeAt(0)*83492791));
  const wx = cx*CH, wy = cy*CH;

  ctx.fillStyle = M.bg; ctx.fillRect(0, 0, CH, CH);

  const pal = {
    distrito:['#84bb52','#79ad4b','#8fc65d'],
    periferia:['#dcc089','#d1b27c','#e6cd98'],
    lab:['#8e8a7e','#827e73','#9a9589'],
    praia:['#e0c48e','#d6b982','#ead09c'],
  }[map];

  // malha de losangos, alternando dois tons
  ctx.save();
  ctx.translate(-wx, -wy);
  const i0 = Math.floor((wx - TW) / (TW/2)), i1 = Math.ceil((wx + CH + TW) / (TW/2));
  const j0 = Math.floor((wy - TH) / (TH/2)), j1 = Math.ceil((wy + CH + TH) / (TH/2));
  for(let j=j0;j<=j1;j++){
    for(let i=i0;i<=i1;i++){
      if(((i + j) & 1) !== 0) continue;        // malha em xadrez isométrico
      const tx = i*TW/2, ty = j*TH/2;
      const n = ((i*7 + j*13) % 7 + 7) % 7;
      const fill = n === 0 ? pal[2] : n === 1 ? pal[1] : pal[0];
      tTile(tx, ty, TW, TH, fill, 'rgba(45,28,16,.07)');
    }
  }
  ctx.restore();

  // detalhes espalhados, sorteados por bloco
  ctx.save(); ctx.translate(-wx, -wy);
  const put = (n, fn) => { for(let k=0;k<n;k++) fn(wx + R()*CH, wy + R()*CH, R()); };

  if(map === 'distrito'){
    // tufos de grama, pedras e arbustos
    put(14, (x,y)=>{ ctx.strokeStyle=T.grassD; ctx.lineWidth=2.4; ctx.lineCap='round';
      for(let k=-1;k<=1;k++){ ctx.beginPath(); ctx.moveTo(x+k*4,y); ctx.quadraticCurveTo(x+k*6,y-8,x+k*9,y-12); ctx.stroke(); } });
    put(5, (x,y,r)=>{ tBlob(x, y, 9+r*7, 7+r*5, T.stone, 2.4); });
    put(4, (x,y,r)=>{ const s=16+r*10;
      tBlob(x, y, s, s*0.82, T.leaf, 3);
      tBlob(x-s*0.3, y-s*0.2, s*0.45, s*0.38, '#5ea348', 2.2, true); });
    put(3, (x,y,r)=>{ // florzinhas
      for(let k=0;k<5;k++){ const a=k*TAU/5; tBlob(x+Math.cos(a)*5, y+Math.sin(a)*5, 3.4, 3.4, k%2?T.yellow:'#f4a0c0', 1.4, true); }
      tBlob(x, y, 2.6, 2.6, T.orange, 1.2, true); });
  }
  else if(map === 'periferia'){
    put(9, (x,y,r)=>{ tBlob(x, y, 11+r*12, 8+r*8, T.rock, 2.6); });
    put(6, (x,y,r)=>{ // cactos tortos
      const h=22+r*18; tPoly([x-5,y, x-5,y-h, x+5,y-h, x+5,y], '#6f9a4a', 2.6);
      tPoly([x+5,y-h*0.6, x+15,y-h*0.6, x+15,y-h*0.85, x+9,y-h*0.85, x+9,y-h*0.7, x+5,y-h*0.7], '#6f9a4a', 2.2); });
    put(10, (x,y)=>{ ctx.strokeStyle='rgba(45,28,16,.2)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(x-14,y); ctx.quadraticCurveTo(x,y-5,x+14,y); ctx.stroke(); });
    put(3, (x,y,r)=>{ // ossos
      ctx.save(); ctx.translate(x,y); ctx.rotate(r*TAU);
      tPoly([-14,-2,14,-2,14,2,-14,2], T.cream, 2);
      tBlob(-14,0,4,4.4,T.cream,2,true); tBlob(14,0,4,4.4,T.cream,2,true); ctx.restore(); });
  }
  else if(map === 'lab'){
    put(8, (x,y,r)=>{ tBlob(x, y, 10+r*10, 8+r*7, T.rockD, 2.6); });
    put(6, (x,y,r)=>{ // cristais
      const h=18+r*20; tPoly([x,y-h, x+7,y-h*0.35, x+4,y, x-4,y, x-7,y-h*0.35], T.purple, 2.6);
      tPoly([x,y-h, x+7,y-h*0.35, x+1,y-h*0.3], '#a98ac8', 1.6); });
    put(5, (x,y)=>{ // poças luminosas
      tBlob(x, y, 15, 9, 'rgba(142,107,176,.4)', 2); });
    put(4, (x,y,r)=>{ // cogumelos
      const h=10+r*8; tPoly([x-3,y, x-3,y-h, x+3,y-h, x+3,y], T.cream, 2);
      tBlob(x, y-h, 9+r*4, 6+r*3, T.red, 2.4);
      tBlob(x-3, y-h-1, 2.2, 1.6, T.cream, 1.2, true); });
  }
  else { // praia
    put(10, (x,y,r)=>{ tBlob(x, y, 7+r*6, 5+r*4, '#b79a66', 2.2); });
    put(5, (x,y,r)=>{ // conchas
      ctx.save(); ctx.translate(x,y); ctx.rotate(r*TAU);
      ctx.beginPath(); ctx.arc(0,0,8,Math.PI,0); ctx.closePath(); inked('#f3dcc4', 2);
      ctx.strokeStyle=INK; ctx.lineWidth=1.2;
      for(let k=-2;k<=2;k++){ ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(k*3.2,-7.5); ctx.stroke(); }
      ctx.restore(); });
    put(4, (x,y,r)=>{ // palmeiras pequenas
      const h=26+r*16; ctx.strokeStyle=T.bark; ctx.lineWidth=5; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(x,y); ctx.quadraticCurveTo(x+5,y-h*0.6,x+2,y-h); ctx.stroke();
      for(let k=0;k<5;k++){ const a=-Math.PI/2+(k-2)*0.6;
        tPoly([x+2,y-h, x+2+Math.cos(a)*22, y-h+Math.sin(a)*22-4, x+2+Math.cos(a)*16, y-h+Math.sin(a)*16+5], T.leaf, 2); } });
    put(6, (x,y)=>{ ctx.strokeStyle='rgba(91,182,214,.35)'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(x-18,y); ctx.quadraticCurveTo(x-9,y-5,x,y); ctx.quadraticCurveTo(x+9,y+5,x+18,y); ctx.stroke(); });
  }
  ctx.restore();

  macroPaint(map, cx, cy);
  arenaEdgePaint(map, cx, cy);
}

/* =========================================================================
   Lutadores: chibi de cabeça grande, corpinho pequeno, contorno grosso
   ========================================================================= */
function drawFighter(id, x, y, t, mv, face, aa, s, k){
  s = s || 1; k = k || 0;
  const f = FIGHTERS[id], c = f.c, r = 15 * s;
  const bob = mv ? Math.sin(t*13)*2.0*s : Math.sin(t*2.6)*1.0*s;
  const yb = y + bob;                       // corpo balança
  const hx = x, hy = yb - r*0.72;           // centro da cabeça
  const look = Math.cos(aa), lookY = Math.sin(aa);
  const W_ = tk(r);

  tShadow(x, y + r*1.02, r*0.92, r*0.34);

  // perninhas
  const stride = mv ? Math.sin(t*13)*r*0.3 : 0;
  ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = W_*1.9;
  for(const sd of [-1,1]){
    ctx.beginPath();
    ctx.moveTo(x + sd*r*0.26, yb + r*0.42);
    ctx.lineTo(x + sd*r*0.26 + sd*stride*0.5, y + r*0.98);
    ctx.stroke();
  }
  // corpo: gota pequena
  ctx.beginPath();
  ctx.ellipse(x, yb + r*0.16, r*0.52, r*0.56, 0, 0, TAU);
  inked(shade(c, -0.12), W_);

  // bracinhos
  ctx.strokeStyle = INK; ctx.lineWidth = W_*1.7;
  for(const sd of [-1,1]){
    const sw = mv ? -Math.sin(t*13)*sd*r*0.26 : Math.sin(t*2.6)*sd*r*0.08;
    ctx.beginPath();
    ctx.moveTo(x + sd*r*0.46, yb + r*0.06);
    ctx.lineTo(x + sd*r*0.72, yb + r*0.36 + sw);
    ctx.stroke();
  }

  // ---- cabeça: cada lutador tem um formato próprio ----
  const headR = r*0.86;
  if(id === 'kira' || id === 'tora'){                 // felina / ursa: orelhas triangulares
    for(const sd of [-1,1])
      tPoly([hx + sd*headR*0.62, hy - headR*0.5,
             hx + sd*headR*0.95, hy - headR*1.35,
             hx + sd*headR*0.18, hy - headR*0.92], c, W_);
    tBlob(hx, hy, headR, headR*0.94, c, W_);
    for(const sd of [-1,1])
      tPoly([hx + sd*headR*0.6, hy - headR*0.58,
             hx + sd*headR*0.8, hy - headR*1.08,
             hx + sd*headR*0.34, hy - headR*0.8], '#f0b6c8', 1.4);
  }
  else if(id === 'lumen' || id === 'pluma'){          // aladas: asinhas atrás da cabeça
    for(const sd of [-1,1]){
      ctx.save(); ctx.translate(hx + sd*headR*0.8, hy - headR*0.1); ctx.scale(sd,1);
      ctx.beginPath(); ctx.moveTo(0,0);
      ctx.quadraticCurveTo(headR*1.1, -headR*0.9, headR*1.5, headR*0.1);
      ctx.quadraticCurveTo(headR*0.9, headR*0.1, 0, headR*0.45);
      ctx.closePath(); inked(id==='lumen' ? '#fdf0f6' : '#d9a7ea', 2.2);
      ctx.restore();
    }
    tBlob(hx, hy, headR, headR*0.96, c, W_);
  }
  else if(id === 'rhea' || id === 'vex'){             // capacete / chifres
    tBlob(hx, hy, headR, headR*0.94, c, W_);
    for(const sd of [-1,1])
      tPoly([hx + sd*headR*0.7, hy - headR*0.35,
             hx + sd*headR*1.25, hy - headR*0.95,
             hx + sd*headR*0.55, hy - headR*0.78],
            id==='rhea' ? T.yellow : '#9e3b4e', 2.2);
    // aba do capacete
    ctx.beginPath();
    ctx.ellipse(hx, hy - headR*0.5, headR*0.98, headR*0.4, 0, Math.PI, 0);
    inked(shade(c, -0.3), 2.2);
  }
  else if(id === 'kaze' || id === 'rivka'){           // bandana / capuz
    tBlob(hx, hy, headR, headR*0.94, c, W_);
    ctx.beginPath();
    ctx.ellipse(hx, hy - headR*0.42, headR*1.0, headR*0.46, 0, Math.PI, 0);
    inked(id==='kaze' ? '#4f7fd0' : '#c45a8e', 2.2);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(hx - headR*0.95, hy - headR*0.5);
    ctx.quadraticCurveTo(hx - headR*1.6, hy - headR*0.1 + Math.sin(t*6)*3, hx - headR*1.45, hy + headR*0.5);
    ctx.stroke();
  }
  else {                                              // lebre: orelhas compridas
    for(const sd of [-1,1]){
      const wob = Math.sin(t*4 + sd)*0.12;
      ctx.save(); ctx.translate(hx + sd*headR*0.4, hy - headR*0.6); ctx.rotate(sd*(0.25+wob));
      ctx.beginPath(); ctx.ellipse(0, -headR*0.85, headR*0.3, headR*0.95, 0, 0, TAU);
      inked(c, 2.2);
      ctx.beginPath(); ctx.ellipse(0, -headR*0.85, headR*0.15, headR*0.6, 0, 0, TAU);
      ctx.fillStyle = '#f0b6c8'; ctx.fill();
      ctx.restore();
    }
    tBlob(hx, hy, headR, headR*0.94, c, W_);
  }

  // rosto
  const er = headR*0.27;
  tEye(hx - headR*0.34, hy + headR*0.06, er, look, lookY);
  tEye(hx + headR*0.34, hy + headR*0.06, er, look, lookY);
  // boquinha
  ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hx - headR*0.14, hy + headR*0.46);
  ctx.quadraticCurveTo(hx, hy + headR*0.62, hx + headR*0.14, hy + headR*0.46);
  ctx.stroke();
  // bochechas
  ctx.globalAlpha = .5;
  tBlob(hx - headR*0.66, hy + headR*0.3, headR*0.17, headR*0.12, '#ef9ab4', 0, true);
  tBlob(hx + headR*0.66, hy + headR*0.3, headR*0.17, headR*0.12, '#ef9ab4', 0, true);
  ctx.globalAlpha = 1;
}

/* =========================================================================
   Monstros: bichinhos redondos de olhos grandes, cada tipo com uma silhueta
   ========================================================================= */
function drawEnemy(e, t){
  const c = e.c, r = e.r, ty = e.type;
  const a = Math.atan2(P.y - e.y, P.x - e.x);
  const look = Math.cos(a), lookY = Math.sin(a);
  const hop = Math.sin(t*7 + e.x*0.05) * r*0.1;      // pulinho de idle
  const x = e.x, y = e.y + hop;
  const W_ = tk(r);

  tShadow(e.x, e.y + r*0.92, r*0.82, r*0.3);
  if(e.elite)   { ctx.globalAlpha=.3+.12*Math.sin(t*6); tBlob(x,y,r*1.5,r*1.5,T.yellow,0,true); ctx.globalAlpha=1; }
  if(e.miniboss){ ctx.globalAlpha=.3; tBlob(x,y,r*1.45,r*1.45,T.purple,0,true); ctx.globalAlpha=1; }

  if(ty === 'runner'){                       // bicho magro e rápido, de pernas longas
    ctx.strokeStyle=INK; ctx.lineWidth=W_*1.6; ctx.lineCap='round';
    for(const sd of [-1,1]){ ctx.beginPath();
      ctx.moveTo(x+sd*r*0.3, y+r*0.4); ctx.lineTo(x+sd*r*0.5+Math.sin(t*16+sd)*r*0.3, y+r*1.0); ctx.stroke(); }
    tBlob(x, y, r*0.92, r*0.8, c, W_);
  }
  else if(ty === 'brute'){                   // gordo, com chifres
    for(const sd of [-1,1])
      tPoly([x+sd*r*0.6, y-r*0.5, x+sd*r*1.15, y-r*1.15, x+sd*r*0.3, y-r*0.86], T.cream, 2.4);
    tBlob(x, y, r, r*0.92, c, W_);
    ctx.globalAlpha=.25; tBlob(x, y+r*0.3, r*0.6, r*0.3, INK, 0, true); ctx.globalAlpha=1;
  }
  else if(ty === 'blindado'){                // casco de pedra por cima
    tBlob(x, y, r*0.95, r*0.88, c, W_);
    ctx.beginPath(); ctx.ellipse(x, y-r*0.14, r*1.02, r*0.72, 0, Math.PI, 0);
    inked(T.stone, W_);
    ctx.strokeStyle=INK; ctx.lineWidth=1.6;
    for(let k=-1;k<=1;k++){ ctx.beginPath(); ctx.moveTo(x+k*r*0.4, y-r*0.14); ctx.lineTo(x+k*r*0.5, y-r*0.76); ctx.stroke(); }
  }
  else if(ty === 'bomba'){                   // redondo com pavio
    tBlob(x, y, r*0.95, r*0.95, c, W_);
    ctx.strokeStyle=T.bark; ctx.lineWidth=2.4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x, y-r*0.9); ctx.quadraticCurveTo(x+r*0.4, y-r*1.4, x+r*0.15, y-r*1.7); ctx.stroke();
    const fl = 2.5 + Math.sin(t*22)*1.2;
    tBlob(x+r*0.15, y-r*1.75, fl, fl*1.3, T.orange, 1.2, true);
  }
  else if(ty === 'spitter'){                 // boca grande, cospe
    tBlob(x, y, r*0.98, r*0.9, c, W_);
    ctx.save(); ctx.translate(x,y); ctx.rotate(a);
    ctx.beginPath(); ctx.ellipse(r*0.5, 0, r*0.4, r*0.3, 0, 0, TAU);
    inked('#5a2030', 2); ctx.restore();
  }
  else if(ty === 'sombra'){                  // fantasminha de barra ondulada
    ctx.globalAlpha = .82;
    ctx.beginPath();
    ctx.arc(x, y-r*0.1, r*0.9, Math.PI, 0);
    for(let k=0;k<=6;k++){ const px=x+r*0.9-(k*r*1.8/6), py=y+r*0.75+Math.sin(t*8+k)*r*0.18; ctx.lineTo(px,py); }
    ctx.closePath(); inked(c, W_);
    ctx.globalAlpha = 1;
  }
  else if(ty === 'saltador'){                // pernas de mola
    ctx.strokeStyle=INK; ctx.lineWidth=W_*1.5; ctx.lineCap='round';
    for(const sd of [-1,1]){ ctx.beginPath();
      ctx.moveTo(x+sd*r*0.35, y+r*0.35);
      ctx.quadraticCurveTo(x+sd*r*0.9, y+r*0.6, x+sd*r*0.5, y+r*1.0); ctx.stroke(); }
    tBlob(x, y, r*0.9, r*0.84, c, W_);
  }
  else if(ty === 'chefe'){                   // mini-chefe: coroa de espinhos
    for(let k=0;k<10;k++){ const an=k*TAU/10 + t*0.4;
      tPoly([x+Math.cos(an-0.16)*r*0.9, y+Math.sin(an-0.16)*r*0.9,
             x+Math.cos(an)*r*1.4,      y+Math.sin(an)*r*1.4,
             x+Math.cos(an+0.16)*r*0.9, y+Math.sin(an+0.16)*r*0.9], shade(c,-0.3), 2); }
    tBlob(x, y, r, r*0.95, c, W_);
  }
  else {                                     // comum: bolinha simpática
    tBlob(x, y, r*0.95, r*0.9, c, W_);
  }

  // rosto (o sombra e o blindado não mostram)
  if(ty !== 'sombra'){
    const hr = r*0.9, er = hr*0.3;
    const ey = ty === 'blindado' ? y + r*0.12 : y - r*0.04;
    tEye(x - hr*0.34, ey, er, look, lookY);
    tEye(x + hr*0.34, ey, er, look, lookY);
    if(ty === 'brute' || ty === 'chefe'){    // dentinhos
      ctx.beginPath();
      ctx.moveTo(x-hr*0.3, ey+hr*0.5); ctx.lineTo(x+hr*0.3, ey+hr*0.5);
      ctx.lineTo(x+hr*0.18, ey+hr*0.78); ctx.lineTo(x, ey+hr*0.55);
      ctx.lineTo(x-hr*0.18, ey+hr*0.78); ctx.closePath();
      inked('#fffaf0', 1.6);
    }
  }else{
    const er = r*0.26;
    tEye(x - r*0.3, y - r*0.15, er, look, lookY);
    tEye(x + r*0.3, y - r*0.15, er, look, lookY);
  }

  // estados
  if(e.frozenT > 0){ ctx.globalAlpha=.55; tBlob(x,y,r*1.1,r*1.1,'#bfe8ff',2,true); ctx.globalAlpha=1; }
  if(e.critT > 0){ ctx.globalAlpha=.7; tBlob(x,y,r,r,T.yellow,0,true); ctx.globalAlpha=1; }
  else if(e.hitT > 0){ ctx.globalAlpha=.6; tBlob(x,y,r,r,'#ffffff',0,true); ctx.globalAlpha=1; }
  if(e.slowT > 0 && e.frozenT <= 0){ ctx.strokeStyle=T.pink; ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.arc(x,y,r+2,0,TAU); ctx.stroke(); }
  if(e.elite){ ctx.strokeStyle=T.yellow; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.arc(x,y,r+3,0,TAU); ctx.stroke(); }

  // barra de vida de elite e mini-chefe, em madeira
  if(e.elite || e.miniboss){
    const w = Math.max(32, r*2.2);
    ctx.beginPath(); roundRect(x-w/2, y-r-16, w, 7, 3.5);
    inked(T.woodD, 1.6);
    ctx.fillStyle = e.miniboss ? T.purple : T.yellow;
    ctx.fillRect(x-w/2+1.6, y-r-14.4, (w-3.2)*Math.max(0,e.hp/e.max), 3.8);
  }
}

/* =========================================================================
   Chefes: o mesmo vocabulário, em escala grande
   ========================================================================= */
function drawBoss(e, t){
  const r = e.r, c = e.c, x = e.x, y = e.y + Math.sin(t*3)*r*0.04;
  const a = Math.atan2(P.y - e.y, P.x - e.x);
  const look = Math.cos(a), lookY = Math.sin(a);
  const W_ = Math.max(3.5, r*0.1);
  const enr = G.rage;

  tShadow(e.x, e.y + r*0.95, r*0.95, r*0.3);
  if(enr){ ctx.globalAlpha=.22+.1*Math.sin(t*7); tBlob(x,y,r*1.5,r*1.5,T.red,0,true); ctx.globalAlpha=1; }

  if(e.kind === 'rainha'){            // insetoide: mandíbulas e carapaça
    for(const sd of [-1,1])
      tPoly([x+sd*r*0.5, y-r*0.45, x+sd*r*1.3, y-r*1.3, x+sd*r*0.15, y-r*0.95], shade(c,-0.25), W_);
    tBlob(x, y, r, r*0.95, c, W_);
    ctx.save(); ctx.translate(x,y); ctx.rotate(a);
    for(const sd of [-1,1]){
      ctx.beginPath(); ctx.moveTo(r*0.6, sd*r*0.3);
      ctx.quadraticCurveTo(r*1.25, sd*r*0.5, r*1.15, sd*r*0.08);
      ctx.strokeStyle=INK; ctx.lineWidth=W_*1.4; ctx.lineCap='round'; ctx.stroke();
    }
    ctx.restore();
  }
  else if(e.kind === 'colosso'){      // bloco de pedra com braços
    tBlob(x, y+r*0.1, r*1.0, r*0.9, T.rock, W_);
    ctx.beginPath(); roundRect(x-r*0.75, y-r*0.95, r*1.5, r*1.1, r*0.25); inked(c, W_);
    for(const sd of [-1,1]){
      ctx.beginPath(); roundRect(x+sd*r*0.95-r*0.22, y-r*0.3, r*0.44, r*0.9, r*0.18);
      inked(shade(c,-0.18), W_*0.8);
    }
  }
  else if(e.kind === 'devoradora'){   // gosma com tentáculos
    for(let k=0;k<7;k++){
      const an = k*TAU/7 + t*0.5, L = r*(1.15+0.12*Math.sin(t*4+k));
      ctx.strokeStyle=INK; ctx.lineWidth=W_*2.2; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(x,y);
      ctx.quadraticCurveTo(x+Math.cos(an)*L*0.7, y+Math.sin(an)*L*0.7,
                           x+Math.cos(an+0.4)*L, y+Math.sin(an+0.4)*L);
      ctx.stroke();
      ctx.strokeStyle=shade(c,-0.1); ctx.lineWidth=W_*1.5; ctx.stroke();
    }
    tBlob(x, y, r*0.92, r*0.88, c, W_);
  }
  else {                              // maré: onda com coroa
    tBlob(x, y, r, r*0.92, c, W_);
    ctx.beginPath();
    ctx.moveTo(x-r*0.85, y-r*0.5);
    for(let k=0;k<=5;k++) ctx.lineTo(x-r*0.85 + k*r*0.34, y-r*0.5 + (k%2?-r*0.45:0));
    ctx.lineTo(x+r*0.85, y-r*0.2); ctx.lineTo(x-r*0.85, y-r*0.2); ctx.closePath();
    inked(T.waterL, W_*0.8);
    if(e.p2){ ctx.globalAlpha=.4; tBlob(x,y,r*1.2,r*1.2,T.water,0,true); ctx.globalAlpha=1; }
  }

  // rosto grande
  const er = r*0.2;
  tEye(x - r*0.33, y - r*0.02, er, look, lookY);
  tEye(x + r*0.33, y - r*0.02, er, look, lookY);
  // sobrancelhas bravas
  ctx.strokeStyle=INK; ctx.lineWidth=W_*0.9; ctx.lineCap='round';
  for(const sd of [-1,1]){
    ctx.beginPath();
    ctx.moveTo(x + sd*r*0.16, y - r*0.26);
    ctx.lineTo(x + sd*r*0.52, y - r*0.42);
    ctx.stroke();
  }
  // boca
  ctx.beginPath();
  ctx.moveTo(x-r*0.3, y+r*0.42);
  ctx.quadraticCurveTo(x, y+r*0.28, x+r*0.3, y+r*0.42);
  ctx.lineTo(x+r*0.22, y+r*0.6); ctx.lineTo(x-r*0.22, y+r*0.6); ctx.closePath();
  inked('#5a2030', W_*0.8);

  if(e.frozenT > 0){ ctx.globalAlpha=.5; tBlob(x,y,r*1.1,r*1.1,'#bfe8ff',2,true); ctx.globalAlpha=1; }
  if(e.hitT > 0){ ctx.globalAlpha=.45; tBlob(x,y,r,r,'#ffffff',0,true); ctx.globalAlpha=1; }
}
