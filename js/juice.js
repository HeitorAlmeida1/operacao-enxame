/* =========================================================================
   Sensação de impacto

   Três camadas, seguindo a escala de importância do guia de VFX da Riot:
   partícula parada → ataque básico → habilidade → ultimate → virada de jogo.
   A cada degrau sobem tamanho, movimento e o quanto a tela reage.

     1. TREMOR em camadas   — shakeTier('elite') em vez de números soltos
     2. HIT-STOP            — congela o jogo por 2 ou 3 quadros no golpe pesado
     3. ONDAS               — a ultimate abre uma onda de choque na tela

   Ambas as camadas respeitam as opções do jogador: quem desliga "Tremor de
   tela" não treme, quem desliga "Impacto" não congela.
   ========================================================================= */

/* ---------- 1. Tremor em camadas ----------
   Antes quase tudo tremia parecido (4 ou 5). Agora a força diz o que houve. */
const SHAKE = {
  explosao:     4.5,   // explosão comum de arma
  elite:        3.5,   // morte de elite
  mini:         6,     // morte de mini-chefe
  chefeAtaque:  8,     // o chefe bateu no chão
  habilidade:   3,     // tecla E
  ult:          11,    // tecla R
  fase:         12,    // chefe virou de fase
  chefeMorte:   16,    // o chefe caiu
};
const shakeTier = k => shakeIt(SHAKE[k] || 3);

/* ---------- 2. Hit-stop ----------
   Congelar o jogo por um instante é o truque mais barato para dar peso a um
   golpe. Usado com parcimônia: só em morte de elite para cima, na ultimate e
   em crítico grande — e com intervalo mínimo, senão vira engasgo. */
function hitStop(s){
  if(!G || !SAVE.set.juice) return;
  G.stop = Math.max(G.stop || 0, s);
}
/* versão com intervalo mínimo, para eventos que acontecem em rajada */
function hitStopRaro(s, intervalo){
  if(!G || !SAVE.set.juice) return;
  if((G.stopCd || 0) > 0) return;
  G.stopCd = intervalo || 0.35;
  G.stop = Math.max(G.stop || 0, s);
}

/* ---------- 3. Ondas de choque ----------
   Anel que abre a partir de um ponto. Tem antecipação (nasce pequeno e
   forte), ação (abre rápido) e dissipação (some ao chegar no raio). */
function addWave(x, y, max, c, w, dur){
  if(!G) return;
  (G.waves = G.waves || []).push({ x, y, r:0, max, c, w:w||7, t:0, dur:dur||0.45 });
}
function updateWaves(dt){
  if(!G.waves || !G.waves.length) return;
  for(const o of G.waves){
    o.t += dt;
    const k = Math.min(1, o.t / o.dur);
    o.r = o.max * (1 - Math.pow(1 - k, 3));   // abre rápido e desacelera
  }
  G.waves = G.waves.filter(o => o.t < o.dur);
}
function drawWaves(){
  if(!G.waves) return;
  for(const o of G.waves){
    const k = Math.min(1, o.t / o.dur), a = 1 - k;
    ctx.strokeStyle = hexA(o.c, 0.85 * a);
    ctx.lineWidth = o.w * (1 - k * 0.65);
    ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = hexA('#2d1c10', 0.5 * a);
    ctx.lineWidth = Math.max(1, o.w * (1 - k * 0.65) * 0.35);
    ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, TAU); ctx.stroke();
  }
}

/* ---------- A apresentação de cada degrau ---------- */

/* Tecla E: forte, mas claramente menor que a ultimate. */
function abilityBurst(){
  shakeTier('habilidade');
  addWave(P.x, P.y, 150 * ST.area, MAPS[G.map].neon, 5, 0.34);
}

/* Tecla R: tem de parecer absurda ao lado de uma arma comum.
   Três anéis escalonados, clarão, tremor forte e um congelamento curto. */
function ultBurst(){
  shakeTier('ult');
  hitStop(0.085);
  G.flash = Math.max(G.flash, 0.3);
  addWave(P.x, P.y, 330 * ST.area, '#f6e7c6', 11, 0.5);
  addTimer({ t:0.07, fn(){ addWave(P.x, P.y, 250 * ST.area, '#f2c14e', 8, 0.45) } });
  addTimer({ t:0.15, fn(){ addWave(P.x, P.y, 420 * ST.area, '#e8873a', 5, 0.55) } });
  // raios saindo do lutador, só no quadro do disparo
  for(let i=0;i<14;i++){
    const a = i * TAU / 14 + Math.random() * 0.2;
    burst(P.x + Math.cos(a) * 26, P.y + Math.sin(a) * 26, '#f2c14e', 1, 420);
  }
}

/* Morte de inimigo importante: o peso sobe com a categoria. */
function deathBurst(e){
  if(e.boss){
    shakeTier('chefeMorte');
    hitStop(0.22);
    G.flash = Math.max(G.flash, 0.45);
    addWave(e.x, e.y, 520, '#f6e7c6', 14, 0.7);
    addTimer({ t:0.12, fn(){ addWave(e.x, e.y, 380, '#d0503c', 9, 0.6) } });
  }else if(e.miniboss){
    shakeTier('mini');
    hitStop(0.07);
    addWave(e.x, e.y, 210, '#8e6bb0', 8, 0.45);
  }else if(e.elite){
    shakeTier('elite');
    hitStopRaro(0.045, 0.25);
    addWave(e.x, e.y, 140, '#f2c14e', 6, 0.38);
  }
}
