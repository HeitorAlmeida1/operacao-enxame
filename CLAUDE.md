# Operação Enxame — contexto do projeto

Este repositório contém **Operação Enxame**, um jogo de hordas ("bullet heaven") para navegador, feito para uso pessoal. A **jogabilidade** é uma recriação do modo temporário **Swarm** do League of Legends; o **visual** é de RPG 2D desenhado à mão, no espírito de Dofus. Nomes, personagens e arte são **originais**. O dono do projeto é estudante de ADS e fala português: responda e escreva textos do jogo em **português do Brasil**.

O jogo é publicado pelo **GitHub Pages** a partir da branch `main` (`index.html` na raiz, mais as pastas `css/` e `js/`). Toda mudança enviada para `main` vai direto para o site.

---

## 1. O que foi o Swarm do LoL (a referência)

Modo PvE temporário lançado em 17/07/2024 (patch 14.14), no evento Esquadrão Anima. Estilo *Vampire Survivors*, para 1 a 4 jogadores, com movimento em WASD e armas que atiram sozinhas.

**Regras básicas**
- WASD anda; tecla C alterna mira automática/manual. E = habilidade (libera no nível 3), R = ultimate (nível 6).
- Inimigos soltam orbes de EXP. Ao subir de nível o jogo pausa e oferece 3 cartas (armas ou passivas). Nível máximo 99.
- Inventário: 1 arma exclusiva do campeão + até 4 armas extras; passivas começam com 3 espaços (até 6). Armas e passivas sobem até o nível 5.
- Chefe aparece aos **15:00** e entra em **fúria aos 20:00**. Partida média de 20 a 35 min.
- Caixas destrutíveis soltam ouro, cura ou ímã. Uma NPC (Comandante Miss Fortune) luta junto.

**Evolução de armas (a mecânica principal)**
- Cada campeão tinha uma arma exclusiva que **escalava com um status** e evoluía com a passiva desse status (ex.: Jinx/Aceleração, Seraphine/Projéteis, Leona/Armadura, Illaoi/Duração, Briar/Vida Máxima, Yasuo/Crítico, Riven/Velocidade, Aurora/EXP, Xayah/Coleta).
- Toda arma comum também tinha **uma passiva específica** de evolução.
- Para evoluir: arma no **nível 5** + pelo menos **1 nível da passiva certa** + pegar um **Cartão de Acesso** (cai de elites e mini-chefes). O cartão abre uma escolha grátis que oferece a evolução.

**Mapas e chefes**: 4 mapas em sequência, cada um com uma mecânica (Fonte de Cura, Canhão de Íons com células de combustível, Bombas de Gelo, maré que sobe) e um chefe (Rek'Sai, Briar, Bel'Veth, Aatrox em 2 fases).

**Dificuldades**: História → Difícil → Extremo (vida dos inimigos 1x/3x/7x, ouro 1x/1,5x/2,25x).

**Torres de evento**: bênção temporária (Miss Fortune), missão da Yuumi que dá um aprimoramento (augment) para a partida, provação da Bel'Veth (Difícil+) que dá ouro e uma escolha extra.

**Progressão permanente**: ouro guardado mesmo perdendo; melhorias compradas no lobby; "Anima Power" com 100 níveis; objetivos que desbloqueiam campeões, armas, mapas e dificuldades.

---

## 2. O que já foi construído

HTML + CSS + JavaScript puro, **sem build e sem dependências** além das fontes do Google Fonts. O desenho é em **Canvas 2D**, estilo neon/vetorial, tudo gerado por código (sem imagens externas).

O código ficava num `index.html` único; em 2026-11-13 foi separado em arquivos (ver seção "Estrutura de arquivos" abaixo). A separação foi puramente mecânica: nenhuma linha de lógica mudou.

### Conteúdo atual
- **9 lutadores** (cada um com passiva, E, R e arma exclusiva que escala com um status):
  Kira (Aceleração), Lumen (Projéteis), Rhea (Armadura), Vex (Vida Máxima), Kaze (Crítico), Pluma (Coleta), Lebre (EXP), Tora (Duração), Rivka (Velocidade).
- **27 armas: 18 comuns + 9 exclusivas**, todas com evolução por passiva (conferido em 2026-11-13; o doc dizia 22+9, que estava errado).
- **12 passivas**: Dano, Aceleração, Área, Vida Máxima, Regeneração, Projéteis, Velocidade, Armadura, Crítico, Coleta, EXP, Duração.
- **4 mapas**: Distrito Industrial (Fonte de Cura, Rainha do Vazio), Periferia (Canhão de Íons, Colosso Primordial), Laboratório Subterrâneo (Bombas de Gelo, Devoradora do Vazio), Cabeça de Praia (maré subindo, Senhor da Maré com 2 fases). Cada chefe tem 3 mecânicas de ataque e uma tela de entrada.
- **Inimigos**: mini, brute, runner, spitter, sombra, bomba, blindado, saltador, elites (dourados) e mini-chefes.
- **3 dificuldades** (História / Difícil / Extremo), chefe aos 15:00 e fúria aos 20:00. Cada uma tem `hp`, `dmg` (ataque e contato), `sp` (habilidade de chefe e mecânica de mapa) e `gold`. Como no Swarm, `dmg` sobe mais rápido que `sp`.
- Torres de bênção, missão e provação; **17 aprimoramentos**; Comandante NPC; caixas.
- Ouro, **15 melhorias permanentes** (inclui Poder Anima), **33 objetivos** que desbloqueiam conteúdo, tela de recordes.
- Som e música gerados com Web Audio; tutorial na primeira partida; teclas configuráveis; suporte a gamepad; minimapa; números de dano; placar de dano por arma no fim da partida.
- Progresso salvo em `localStorage` na chave **`operacaoEnxame.v2`** (não mude a chave sem migrar os dados).

### Estrutura de arquivos

```
index.html          só o HTML (marcação da interface) + <link> do css + os <script src> na ordem
css/style.css       todo o CSS
js/core.js          canvas, resize, utilitários (TAU, rnd, d2, $, fmt, shuffle, segDist2),
                    SKEY/SAVE/save() e as variáveis de estado globais (CUR, CURE, P, G, ST, keys, mouse)
js/data.js          OBJ, UPG, upCost, PASSIVES, MAPS, DIFF, TYPES, AUGS, BOONS
js/stats.js         stats() — calcula ST a cada frame
js/combat.js        shootFrom/shoot, addZone/addMark/addTimer, nearest, aim, auraR, petMul, coneHit
js/weapons.js       WEAPONS (18 comuns + 9 exclusivas) e os auxiliares mineHop/recallFeathers
js/fighters.js      FIGHTERS, spawnTent, bigTarget
js/game.js          newGame, update, spawn, damage, kill, takeDamage, explode, bossAI,
                    mapUpdate, openChoice, pick
js/hud.js           bankGold, endScreen, victory/defeat, banner, hud()
js/draw.js          draw(), cache de blocos (getChunk), projéteis, zonas, efeitos,
                    ícones (iconURL/iconPaint), light(). As funções de personagem e de
                    chão que vivem aqui estão SUBSTITUÍDAS por js/toon.js (ver abaixo)
js/world.js         limites da arena, cenário em escala de mapa (macroPaint), paliçada
                    (arenaEdgePaint), minimapa (drawMinimap), hexA(), roundRect()
js/toon.js          o estilo de desenho: paleta T, tinta INK e as primitivas tBlob/tPoly/
                    tEye/tShadow/tTile/inked. REDEFINE drawFighter, drawEnemy, drawBoss
                    e paintChunk — por carregar depois do draw.js, as versões daqui valem
js/audio.js         AU, audioInit, sfx(), musicTick() + o setInterval da música
js/input.js         ACTIONS, DEFKEYS, teclas e gamepad (pollPad)
js/screens.js       tutorial (tip/tutUpdate), recordes (recordRun/renderRec), opções
js/main.js          loop (frame/requestAnimationFrame), setPause, ligação dos botões,
                    tabela do Tab, telas de melhorias/objetivos e showStart()
```

**Como os arquivos conversam (importante):** são **scripts clássicos**, não ES modules. Não existe `import`/`export`: todos compartilham o mesmo escopo global, exatamente como quando tudo estava num arquivo só. Por isso:

- **A ordem dos `<script src>` no `index.html` importa** e é a mesma ordem em que o código estava escrito antes. Não reordene sem conferir.
- Código que **roda no topo do arquivo** (não dentro de função) só enxerga o que foi declarado em arquivos **anteriores**. Dentro de funções tanto faz, porque tudo já carregou na hora da chamada.
- Como não há módulos, o jogo continua abrindo **direto pelo `index.html`**, sem servidor.

### Direção visual

Vetor chapado desenhado à mão, com **contorno escuro grosso** em tudo. Nada de neon, nada de vidro.

- **Tinta**: `INK` (`#2d1c10`, marrom bem escuro) — nunca preto puro. A espessura sai de `tk(r)`.
- **Preenchimento**: cor chapada + um brilho branco suave no alto. Sem degradê elaborado.
- **Paleta**: o objeto `T` em `js/toon.js` (creme, pergaminho, madeira, pedra, água, folha) mais os acentos vermelho-telha, dourado, roxo-cristal.
- **Personagens e monstros**: proporção chibi — cabeça grande, corpo pequeno, olhos grandes com reflexo (`tEye`). O rosto sempre olha na direção do alvo.
- **Chão**: losangos isométricos (`tTile`, `TW`/`TH` em toon.js) em dois tons MUITO próximos. Se os tons se afastam, a malha vira listra e cansa a vista.
- **Interface**: placas de pergaminho com borda escura de 3 px e sombra sólida embaixo (`0 4px 0 var(--wood-d)`), como madeira empilhada. Títulos usam contorno via `-webkit-text-stroke` + `paint-order:stroke fill`.
- **Fontes**: Baloo 2 (display, arredondada) e Nunito (corpo). O texto desenhado no canvas usa as mesmas.
- O brilho aditivo (`light()`) ficou em 30% da intensidade antiga: ele servia ao visual neon e agora só suja.

### Limites da arena

O mundo **não é mais infinito**. Cada mapa tem `rad` em `MAPS` (meia-largura de um quadrado centrado em 0,0).

- `clampWorld(o,pad)` prende um objeto dentro; `inWorld(x,y,pad)` testa; `spotNear(ox,oy,dMin,dMax,pad)` sorteia um ponto válido.
- O jogador e os inimigos são presos todo quadro, em `update()`.
- Quem nasce (inimigo, torre, caixa, célula, chefe) usa `spotNear`, nunca um ângulo solto.
- A paliçada é pintada dentro do cache de blocos por `arenaEdgePaint`, então não custa nada por quadro.

### Pontos centrais do código
- **Dados**: `OBJ` (objetivos), `UPG` (melhorias), `PASSIVES`, `MAPS`, `DIFF`, `TYPES` (inimigos), `AUGS`, `BOONS`, `WEAPONS`, `FIGHTERS`.
- **Estado**: `SAVE` (progresso salvo), `P` (jogador), `G` (partida), `ST` (status calculados por `stats()` a cada frame).
- **Armas**: cada item de `WEAPONS` tem `cd(w)` + `fire(w,j)` (disparo periódico) **ou** `tick(w,dt)` (contínuo). Campos: `evo` (passiva de evolução), `evoN`/`ed` (nome e efeito evoluído), `sig` (arma exclusiva de um lutador), `lock` (objetivo que desbloqueia), `proj` (conta como projétil para a passiva da Lumen).
- **Lutadores**: `FIGHTERS[id]` tem `sig`, `stat`, `armor`, `pas`, `E`, `R`, `useE()`, `useR()`, `lock`.
- **Regra importante de dano**: a variável global `CUR` guarda a fonte do dano (id da arma, `'E'`, `'R'`, `'cmd'`, `'mapa'`...) para o placar de dano. Use sempre `addZone()`, `addMark()` e `addTimer()` (em `js/combat.js`) em vez de dar `push` direto em `G.zones`, `G.marks` ou `G.timers`, porque essas funções guardam a fonte.
- **Visual**: cenário gerado em blocos de 512 px e guardado em cache (`getChunk`/`paintChunk`); ícones gerados em canvas (`iconURL`); iluminação aditiva com `light()`.
- **Som**: `sfx(nome)` para efeitos e `musicTick()` para a música; o áudio só começa após o primeiro clique ou tecla (regra dos navegadores). Para testar sem som, ponha `sfx` e `music` em 0 dentro de `SAVE.set`.

## 3. Regras para mexer no projeto

- **Mantenha a estrutura atual**: HTML em `index.html`, CSS em `css/`, JS em `js/`. Sem build, sem bundler e sem bibliotecas novas, a não ser que o dono peça.
- **Não troque para ES modules** (`type="module"` / `import`): isso quebraria abrir o jogo com duplo clique no `index.html`, porque o navegador bloqueia módulos em `file://`.
- Arquivo novo em `js/` só vale com o `<script src>` correspondente no `index.html`, **na posição certa da ordem**.
- **Nada de material da Riot**: não use nomes de campeões, artes, sons ou logos do LoL. Personagens e armas são versões originais inspiradas nos papéis e mecânicas.
- Textos do jogo em **português do Brasil**.
- Não quebre saves antigos: ao adicionar campos em `SAVE`, use valores padrão com `Object.assign`.
- Ao adicionar uma arma, inclua também o ícone em `iconPaint` e confira se a tabela de evoluções (Tab) continua certa.
- Para mexer no visual de personagem, monstro ou chão, edite **`js/toon.js`**, não o `draw.js`.
- Desenhou forma nova? Use `inked()`, `tBlob()` ou `tPoly()` para ela já sair com contorno. Forma sem contorno destoa na hora.
- **Não edite os arquivos com heredoc do shell**: cifrão seguido de aspa (`# Operação Enxame — contexto do projeto

Este repositório contém **Operação Enxame**, um jogo de hordas ("bullet heaven") para navegador, feito para uso pessoal. A **jogabilidade** é uma recriação do modo temporário **Swarm** do League of Legends; o **visual** é de RPG 2D desenhado à mão, no espírito de Dofus. Nomes, personagens e arte são **originais**. O dono do projeto é estudante de ADS e fala português: responda e escreva textos do jogo em **português do Brasil**.

O jogo é publicado pelo **GitHub Pages** a partir da branch `main` (`index.html` na raiz, mais as pastas `css/` e `js/`). Toda mudança enviada para `main` vai direto para o site.

---

## 1. O que foi o Swarm do LoL (a referência)

Modo PvE temporário lançado em 17/07/2024 (patch 14.14), no evento Esquadrão Anima. Estilo *Vampire Survivors*, para 1 a 4 jogadores, com movimento em WASD e armas que atiram sozinhas.

**Regras básicas**
- WASD anda; tecla C alterna mira automática/manual. E = habilidade (libera no nível 3), R = ultimate (nível 6).
- Inimigos soltam orbes de EXP. Ao subir de nível o jogo pausa e oferece 3 cartas (armas ou passivas). Nível máximo 99.
- Inventário: 1 arma exclusiva do campeão + até 4 armas extras; passivas começam com 3 espaços (até 6). Armas e passivas sobem até o nível 5.
- Chefe aparece aos **15:00** e entra em **fúria aos 20:00**. Partida média de 20 a 35 min.
- Caixas destrutíveis soltam ouro, cura ou ímã. Uma NPC (Comandante Miss Fortune) luta junto.

**Evolução de armas (a mecânica principal)**
- Cada campeão tinha uma arma exclusiva que **escalava com um status** e evoluía com a passiva desse status (ex.: Jinx/Aceleração, Seraphine/Projéteis, Leona/Armadura, Illaoi/Duração, Briar/Vida Máxima, Yasuo/Crítico, Riven/Velocidade, Aurora/EXP, Xayah/Coleta).
- Toda arma comum também tinha **uma passiva específica** de evolução.
- Para evoluir: arma no **nível 5** + pelo menos **1 nível da passiva certa** + pegar um **Cartão de Acesso** (cai de elites e mini-chefes). O cartão abre uma escolha grátis que oferece a evolução.

**Mapas e chefes**: 4 mapas em sequência, cada um com uma mecânica (Fonte de Cura, Canhão de Íons com células de combustível, Bombas de Gelo, maré que sobe) e um chefe (Rek'Sai, Briar, Bel'Veth, Aatrox em 2 fases).

**Dificuldades**: História → Difícil → Extremo (vida dos inimigos 1x/3x/7x, ouro 1x/1,5x/2,25x).

**Torres de evento**: bênção temporária (Miss Fortune), missão da Yuumi que dá um aprimoramento (augment) para a partida, provação da Bel'Veth (Difícil+) que dá ouro e uma escolha extra.

**Progressão permanente**: ouro guardado mesmo perdendo; melhorias compradas no lobby; "Anima Power" com 100 níveis; objetivos que desbloqueiam campeões, armas, mapas e dificuldades.

---

## 2. O que já foi construído

HTML + CSS + JavaScript puro, **sem build e sem dependências** além das fontes do Google Fonts. O desenho é em **Canvas 2D**, estilo neon/vetorial, tudo gerado por código (sem imagens externas).

O código ficava num `index.html` único; em 2026-11-13 foi separado em arquivos (ver seção "Estrutura de arquivos" abaixo). A separação foi puramente mecânica: nenhuma linha de lógica mudou.

### Conteúdo atual
- **9 lutadores** (cada um com passiva, E, R e arma exclusiva que escala com um status):
  Kira (Aceleração), Lumen (Projéteis), Rhea (Armadura), Vex (Vida Máxima), Kaze (Crítico), Pluma (Coleta), Lebre (EXP), Tora (Duração), Rivka (Velocidade).
- **27 armas: 18 comuns + 9 exclusivas**, todas com evolução por passiva (conferido em 2026-11-13; o doc dizia 22+9, que estava errado).
- **12 passivas**: Dano, Aceleração, Área, Vida Máxima, Regeneração, Projéteis, Velocidade, Armadura, Crítico, Coleta, EXP, Duração.
- **4 mapas**: Distrito Industrial (Fonte de Cura, Rainha do Vazio), Periferia (Canhão de Íons, Colosso Primordial), Laboratório Subterrâneo (Bombas de Gelo, Devoradora do Vazio), Cabeça de Praia (maré subindo, Senhor da Maré com 2 fases). Cada chefe tem 3 mecânicas de ataque e uma tela de entrada.
- **Inimigos**: mini, brute, runner, spitter, sombra, bomba, blindado, saltador, elites (dourados) e mini-chefes.
- **3 dificuldades** (História / Difícil / Extremo), chefe aos 15:00 e fúria aos 20:00. Cada uma tem `hp`, `dmg` (ataque e contato), `sp` (habilidade de chefe e mecânica de mapa) e `gold`. Como no Swarm, `dmg` sobe mais rápido que `sp`.
- Torres de bênção, missão e provação; **17 aprimoramentos**; Comandante NPC; caixas.
- Ouro, **15 melhorias permanentes** (inclui Poder Anima), **33 objetivos** que desbloqueiam conteúdo, tela de recordes.
- Som e música gerados com Web Audio; tutorial na primeira partida; teclas configuráveis; suporte a gamepad; minimapa; números de dano; placar de dano por arma no fim da partida.
- Progresso salvo em `localStorage` na chave **`operacaoEnxame.v2`** (não mude a chave sem migrar os dados).

### Estrutura de arquivos

```
index.html          só o HTML (marcação da interface) + <link> do css + os <script src> na ordem
css/style.css       todo o CSS
js/core.js          canvas, resize, utilitários (TAU, rnd, d2, $, fmt, shuffle, segDist2),
                    SKEY/SAVE/save() e as variáveis de estado globais (CUR, CURE, P, G, ST, keys, mouse)
js/data.js          OBJ, UPG, upCost, PASSIVES, MAPS, DIFF, TYPES, AUGS, BOONS
js/stats.js         stats() — calcula ST a cada frame
js/combat.js        shootFrom/shoot, addZone/addMark/addTimer, nearest, aim, auraR, petMul, coneHit
js/weapons.js       WEAPONS (18 comuns + 9 exclusivas) e os auxiliares mineHop/recallFeathers
js/fighters.js      FIGHTERS, spawnTent, bigTarget
js/game.js          newGame, update, spawn, damage, kill, takeDamage, explode, bossAI,
                    mapUpdate, openChoice, pick
js/hud.js           bankGold, endScreen, victory/defeat, banner, hud()
js/draw.js          draw(), cache de blocos (getChunk), projéteis, zonas, efeitos,
                    ícones (iconURL/iconPaint), light(). As funções de personagem e de
                    chão que vivem aqui estão SUBSTITUÍDAS por js/toon.js (ver abaixo)
js/world.js         limites da arena, cenário em escala de mapa (macroPaint), paliçada
                    (arenaEdgePaint), minimapa (drawMinimap), hexA(), roundRect()
js/toon.js          o estilo de desenho: paleta T, tinta INK e as primitivas tBlob/tPoly/
                    tEye/tShadow/tTile/inked. REDEFINE drawFighter, drawEnemy, drawBoss
                    e paintChunk — por carregar depois do draw.js, as versões daqui valem
js/audio.js         AU, audioInit, sfx(), musicTick() + o setInterval da música
js/input.js         ACTIONS, DEFKEYS, teclas e gamepad (pollPad)
js/screens.js       tutorial (tip/tutUpdate), recordes (recordRun/renderRec), opções
js/main.js          loop (frame/requestAnimationFrame), setPause, ligação dos botões,
                    tabela do Tab, telas de melhorias/objetivos e showStart()
```

**Como os arquivos conversam (importante):** são **scripts clássicos**, não ES modules. Não existe `import`/`export`: todos compartilham o mesmo escopo global, exatamente como quando tudo estava num arquivo só. Por isso:

- **A ordem dos `<script src>` no `index.html` importa** e é a mesma ordem em que o código estava escrito antes. Não reordene sem conferir.
- Código que **roda no topo do arquivo** (não dentro de função) só enxerga o que foi declarado em arquivos **anteriores**. Dentro de funções tanto faz, porque tudo já carregou na hora da chamada.
- Como não há módulos, o jogo continua abrindo **direto pelo `index.html`**, sem servidor.

### Direção visual

Vetor chapado desenhado à mão, com **contorno escuro grosso** em tudo. Nada de neon, nada de vidro.

- **Tinta**: `INK` (`#2d1c10`, marrom bem escuro) — nunca preto puro. A espessura sai de `tk(r)`.
- **Preenchimento**: cor chapada + um brilho branco suave no alto. Sem degradê elaborado.
- **Paleta**: o objeto `T` em `js/toon.js` (creme, pergaminho, madeira, pedra, água, folha) mais os acentos vermelho-telha, dourado, roxo-cristal.
- **Personagens e monstros**: proporção chibi — cabeça grande, corpo pequeno, olhos grandes com reflexo (`tEye`). O rosto sempre olha na direção do alvo.
- **Chão**: losangos isométricos (`tTile`, `TW`/`TH` em toon.js) em dois tons MUITO próximos. Se os tons se afastam, a malha vira listra e cansa a vista.
- **Interface**: placas de pergaminho com borda escura de 3 px e sombra sólida embaixo (`0 4px 0 var(--wood-d)`), como madeira empilhada. Títulos usam contorno via `-webkit-text-stroke` + `paint-order:stroke fill`.
- **Fontes**: Baloo 2 (display, arredondada) e Nunito (corpo). O texto desenhado no canvas usa as mesmas.
- O brilho aditivo (`light()`) ficou em 30% da intensidade antiga: ele servia ao visual neon e agora só suja.

### Limites da arena

O mundo **não é mais infinito**. Cada mapa tem `rad` em `MAPS` (meia-largura de um quadrado centrado em 0,0).

- `clampWorld(o,pad)` prende um objeto dentro; `inWorld(x,y,pad)` testa; `spotNear(ox,oy,dMin,dMax,pad)` sorteia um ponto válido.
- O jogador e os inimigos são presos todo quadro, em `update()`.
- Quem nasce (inimigo, torre, caixa, célula, chefe) usa `spotNear`, nunca um ângulo solto.
- A paliçada é pintada dentro do cache de blocos por `arenaEdgePaint`, então não custa nada por quadro.

### Pontos centrais do código
- **Dados**: `OBJ` (objetivos), `UPG` (melhorias), `PASSIVES`, `MAPS`, `DIFF`, `TYPES` (inimigos), `AUGS`, `BOONS`, `WEAPONS`, `FIGHTERS`.
- **Estado**: `SAVE` (progresso salvo), `P` (jogador), `G` (partida), `ST` (status calculados por `stats()` a cada frame).
- **Armas**: cada item de `WEAPONS` tem `cd(w)` + `fire(w,j)` (disparo periódico) **ou** `tick(w,dt)` (contínuo). Campos: `evo` (passiva de evolução), `evoN`/`ed` (nome e efeito evoluído), `sig` (arma exclusiva de um lutador), `lock` (objetivo que desbloqueia), `proj` (conta como projétil para a passiva da Lumen).
- **Lutadores**: `FIGHTERS[id]` tem `sig`, `stat`, `armor`, `pas`, `E`, `R`, `useE()`, `useR()`, `lock`.
- **Regra importante de dano**: a variável global `CUR` guarda a fonte do dano (id da arma, `'E'`, `'R'`, `'cmd'`, `'mapa'`...) para o placar de dano. Use sempre `addZone()`, `addMark()` e `addTimer()` (em `js/combat.js`) em vez de dar `push` direto em `G.zones`, `G.marks` ou `G.timers`, porque essas funções guardam a fonte.
- **Visual**: cenário gerado em blocos de 512 px e guardado em cache (`getChunk`/`paintChunk`); ícones gerados em canvas (`iconURL`); iluminação aditiva com `light()`.
- **Som**: `sfx(nome)` para efeitos e `musicTick()` para a música; o áudio só começa após o primeiro clique ou tecla (regra dos navegadores). Para testar sem som, ponha `sfx` e `music` em 0 dentro de `SAVE.set`.

## 3. Regras para mexer no projeto

- **Mantenha a estrutura atual**: HTML em `index.html`, CSS em `css/`, JS em `js/`. Sem build, sem bundler e sem bibliotecas novas, a não ser que o dono peça.
- **Não troque para ES modules** (`type="module"` / `import`): isso quebraria abrir o jogo com duplo clique no `index.html`, porque o navegador bloqueia módulos em `file://`.
- Arquivo novo em `js/` só vale com o `<script src>` correspondente no `index.html`, **na posição certa da ordem**.
- **Nada de material da Riot**: não use nomes de campeões, artes, sons ou logos do LoL. Personagens e armas são versões originais inspiradas nos papéis e mecânicas.
- Textos do jogo em **português do Brasil**.
- Não quebre saves antigos: ao adicionar campos em `SAVE`, use valores padrão com `Object.assign`.
 + `'`) vira citação ANSI-C no bash e come pedaços do arquivo. Escreva o patch num `.js` e rode com `node`.
- **Teste antes de enviar**:
  1. `node --check` em **cada arquivo** de `js/` (pega erro de sintaxe e bloco cortado pela metade):
     ```bash
     for f in js/*.js; do node --check "$f" || echo "FALHOU: $f"; done
     ```
  2. Rode uma simulação sem navegador: carregue os arquivos **na ordem do `index.html`, um a um** (com `vm.runInContext` no mesmo contexto, nunca concatenados — concatenar esconde erro de ordem de carregamento), com stub de `document`, `canvas` e `localStorage`, e chame `newGame()`, `update()` e `draw()` em loop para cada lutador em cada mapa.
  3. Se der, abra num navegador de verdade (`npx http-server`), confira que o console está limpo e tire capturas do menu, de uma partida, de um chefe e da tela de fim.
- Faça commits pequenos com mensagens claras em português.

---

## 4. Pendências e ideias

- **Equilíbrio** ainda não foi testado por jogadores: chefes do Laboratório e da Praia podem estar fortes; o Aniquilador tende a dominar o placar de dano.
- Leve emenda visível entre os blocos de cenário em alguns mapas.
- Ainda não existe co-op (só solo).
- Ideia em estudo: versão 3D com Three.js, mantendo a lógica atual e trocando só o desenho (estilo low-poly).
- **Estilo denso do código**: o JS foi escrito com várias instruções por linha (linhas de até 445 caracteres). A separação em arquivos melhorou a navegação, mas não isso. Ideia: ao mexer num arquivo, desdobrar as linhas mais densas dele — em commits separados dos de funcionalidade.
- Ainda não existe um harness de teste no repositório: o passo 2 de teste da seção 3 precisa ser remontado a cada vez. Valeria guardar um `tools/simular.js`.
- Os projéteis ainda são desenhados no estilo antigo (traço luminoso) em `draw.js`. Funcionam, mas destoam do contorno grosso do resto — vale passar por `inked()` quando sobrar fôlego.
- Os nomes dos chefes ainda são os do tema anterior (Rainha do Vazio, Colosso Primordial, Devoradora do Vazio, Senhor da Maré) enquanto os mapas já têm nome de RPG. Falta alinhar — lembrando de trocar também os textos em `OBJ`, que citam os chefes.
