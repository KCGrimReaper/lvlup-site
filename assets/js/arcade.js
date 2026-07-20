// =============================================
// BUSINESS AGILITY QUEST — MOTEUR PRINCIPAL DU JEU
// =============================================
(function() {

        const C = {
          primary: '#0ea5e9',
          panel:   '#1e293b',
          border:  '#334155',
          text:    '#e2e8f0',
          muted:   '#64748b',
          danger:  '#ef4444',
          success: '#22c55e',
          dark:    '#0d1424',
        };

        // Nœuds sur le SVG viewBox 900×160
        const NODES = [
          { id:0, label:'MUDAS',      zone:'Base Camp',    x:85,  y:148, game:'muda',       unlockAt:0 },
          { id:1, label:'KANBAN',     zone:'Col Est',      x:240, y:122, game:'kanban',     unlockAt:1 },
          { id:2, label:'BACKLOG',    zone:'Arête',        x:380, y:100, game:'backlog',    unlockAt:2 },
          { id:3, label:'FOCUS',      zone:'Glacier',      x:530, y:80,  game:'multitask',  unlockAt:3 },
          { id:4, label:'DELEGATION', zone:'Avant-sommet', x:690, y:58,  game:'delegation', unlockAt:4 },
          { id:5, label:'EMPATHIE',   zone:'SOMMET',       x:845, y:32,  game:'empathy',    unlockAt:5 },
        ];

        const S = { stars:{}, current:null };
        function totalStars(){ return Object.values(S.stars).reduce((a,b)=>a+b,0); }
        function unlocked(id){ return totalStars() >= NODES[id].unlockAt; }
        function shuffle(a){ return [...a].sort(()=>Math.random()-0.5); }
        function starsFor(e,t){ return e===0?3:e<=Math.ceil(t*0.25)?2:1; }

        // ── RENDER SVG MAP ──────────────────────────────────────────────
        function drawMap() {
          const xpPct = Math.min(100, Math.round(totalStars()/18*100));
          const xpBar = document.getElementById('baq-xp-bar');
          const xpTxt = document.getElementById('baq-xp-text');
          if(xpBar) xpBar.style.width = xpPct + '%';
          if(xpTxt) xpTxt.textContent = totalStars() + ' / 18';

          // Segments chemin
          const pathG = document.getElementById('baq-path-segments');
          if(pathG){
            pathG.innerHTML = NODES.slice(0,-1).map((n,i)=>{
              const next = NODES[i+1];
              const done = (S.stars[n.game]||0)>0;
              return `<line x1="${n.x}" y1="${n.y}" x2="${next.x}" y2="${next.y}"
                stroke="${done?C.primary:'#2a4060'}"
                stroke-width="${done?3:2}"
                stroke-dasharray="${done?'none':'6,4'}"
                opacity="${done?0.9:0.4}"/>`;
            }).join('');
          }

          // Nœuds
          const nodesG = document.getElementById('baq-nodes');
          if(nodesG){
            nodesG.innerHTML = NODES.map(n=>{
              const done   = (S.stars[n.game]||0)>0;
              const active = S.current===n.id;
              const open   = unlocked(n.id);
              const st     = S.stars[n.game]||0;
              const r      = n.id===5 ? 13 : 11;

              // Halo pulsant (actif)
              const halo = active
                ? `<rect x="${n.x-r-6}" y="${n.y-r-6}" width="${(r+6)*2}" height="${(r+6)*2}" rx="3" fill="${C.primary}" opacity="0.15"/>`
                : '';

              // Nœud carré style retro-gaming
              const nodeFill   = active?C.primary : done?'#0369a1' : open?'#1a2838':'#0a0f1e';
              const nodeBorder = active?'#fff'    : done?C.primary : open?'#2a4060':'#1a2838';
              const node = `<rect x="${n.x-r}" y="${n.y-r}" width="${r*2}" height="${r*2}" rx="2"
                fill="${nodeFill}" stroke="${nodeBorder}" stroke-width="${active?2.5:1.5}"/>`;

              // Contenu nœud
              const num = `<text x="${n.x}" y="${n.y}" text-anchor="middle" dominant-baseline="middle"
                font-size="${open?9:8}" font-family="monospace" font-weight="bold"
                fill="${done?'#7dd3fc':open?C.text:'#2a4060'}">${done?'✓':open?(n.id+1):'X'}</text>`;

              // Étoiles
              const stars = st>0
                ? `<text x="${n.x}" y="${n.y+r+9}" text-anchor="middle" font-size="8" fill="#fbbf24">${'★'.repeat(st)}</text>`
                : '';

              // Label
              const lbl = `<text x="${n.x}" y="${n.y-r-(st>0?17:9)}" text-anchor="middle"
                font-size="7" font-family="monospace" font-weight="bold"
                fill="${active?C.primary:open?'#94a3b8':'#1e3a5f'}">${n.label}</text>`;

              return `<g class="baq-node" data-id="${n.id}" style="cursor:${open?'pointer':'not-allowed'}">${halo}${node}${num}${stars}${lbl}</g>`;
            }).join('');

            nodesG.querySelectorAll('.baq-node').forEach(g=>{
              g.addEventListener('click',()=>{
                const id=parseInt(g.dataset.id);
                if(!unlocked(id)) return;
                S.current=id; drawMap(); openGame(NODES[id]);
              });
            });
          }

          // Personnage pixel art sur le nœud actif
          const av = S.current!==null ? NODES[S.current] : NODES[0];
          const charG = document.getElementById('baq-character');
          if(charG){
            const cx=av.x, cy=av.y-30;
            // Pixel art : tête (4×4), corps (4×6), jambes (2×3 chacune)
            charG.innerHTML = `
              <g>
                <!-- ombre portée -->
                <ellipse cx="${cx}" cy="${av.y+2}" rx="8" ry="3" fill="rgba(0,0,0,0.4)"/>
                <!-- Tête -->
                <rect x="${cx-4}" y="${cy-4}" width="8" height="8" fill="#fbbf24"/>
                <!-- Yeux -->
                <rect x="${cx-3}" y="${cy-2}" width="2" height="2" fill="#0f172a"/>
                <rect x="${cx+1}" y="${cy-2}" width="2" height="2" fill="#0f172a"/>
                <!-- Corps (bleu) -->
                <rect x="${cx-4}" y="${cy+4}" width="8" height="7" fill="${C.primary}"/>
                <!-- Bras gauche -->
                <rect x="${cx-6}" y="${cy+5}" width="2" height="5" fill="${C.primary}"/>
                <!-- Bras droit -->
                <rect x="${cx+4}" y="${cy+5}" width="2" height="5" fill="${C.primary}"/>
                <!-- Jambes -->
                <rect x="${cx-4}" y="${cy+11}" width="3" height="5" fill="#1e293b"/>
                <rect x="${cx+1}" y="${cy+11}" width="3" height="5" fill="#1e293b"/>
                <!-- Chaussures -->
                <rect x="${cx-5}" y="${cy+15}" width="4" height="2" fill="#475569"/>
                <rect x="${cx+1}" y="${cy+15}" width="4" height="2" fill="#475569"/>
                <!-- Drapeau si sommet complété -->
                ${(S.stars['empathy']||0)>0 ? `
                <rect x="${cx+4}" y="${cy-16}" width="2" height="14" fill="#fff"/>
                <rect x="${cx+6}" y="${cy-16}" width="8"  height="5"  fill="${C.primary}"/>
                ` : ''}
              </g>`;
          }
        }

        // ── OPEN GAME ──────────────────────────────────────────────────
        function openGame(node) {
          const st = S.stars[node.game]||0;
          document.getElementById('baq-game-content').innerHTML = `
            <div style="border-bottom:1px solid #1e3a5f;padding:0.75rem 1rem;background:#070b14;display:flex;align-items:center;gap:0.75rem;margin:-1.25rem -1.25rem 1rem;">
              <span style="font-family:monospace;font-size:0.65rem;color:#0ea5e9;background:#0d1424;border:1px solid #1e3a5f;padding:0.2rem 0.5rem;">${String(node.id+1).padStart(2,'0')}</span>
              <div>
                <div style="font-family:monospace;font-size:0.9rem;font-weight:700;color:#f8fafc;letter-spacing:1px;">${node.label}</div>
                <div style="font-family:monospace;font-size:0.58rem;color:#334155;letter-spacing:2px;">${node.zone}${st?' · '+'★'.repeat(st):''}</div>
              </div>
            </div>
            <div id="baq-inner"></div>`;
          const inner = document.getElementById('baq-inner');
          ({muda:gameMuda, kanban:gameKanban, backlog:gameBacklog,
            multitask:gameMultitask, delegation:gameDelegation, empathy:gameEmpathy})[node.game](inner);
        }

        // ── RESULT ─────────────────────────────────────────────────────
        function showResult(el, stars, msg, lesson, gk) {
          if(stars>(S.stars[gk]||0)) S.stars[gk]=stars;
          drawMap();
          const ni = NODES.findIndex(n=>n.game===gk)+1;
          const hasNext = ni<NODES.length && unlocked(ni);
          el.innerHTML = `
            <div style="background:#070b14;border:1px solid #1e3a5f;padding:1.25rem;text-align:center;margin-top:0.75rem;">
              <div style="font-family:monospace;font-size:0.6rem;color:#334155;letter-spacing:3px;margin-bottom:0.5rem;">— MISSION COMPLETE —</div>
              <div style="font-size:1.75rem;letter-spacing:6px;margin-bottom:0.6rem;">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
              <p style="font-family:monospace;color:${C.text};font-size:0.82rem;margin-bottom:0.4rem;">${msg}</p>
              <p style="font-family:monospace;color:${C.primary};font-size:0.75rem;margin-bottom:1rem;line-height:1.5;">// ${lesson}</p>
              ${totalStars()>=18?`<div style="font-family:monospace;background:#451a03;color:#fbbf24;border:1px solid #f59e0b;padding:0.6rem;margin-bottom:0.75rem;font-size:0.75rem;">*** AGILITY CHAMPION ***</div>`:''}
              <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;">
                <button onclick="baqReplay('${gk}')" style="font-family:monospace;background:#0d1424;color:#94a3b8;border:1px solid #334155;padding:0.5rem 1rem;font-size:0.75rem;cursor:pointer;">[ REJOUER ]</button>
                ${hasNext?`<button onclick="baqGoto(${ni})" style="font-family:monospace;background:${C.primary};color:#070b14;border:none;padding:0.5rem 1rem;font-size:0.75rem;font-weight:700;cursor:pointer;">[ NIVEAU ${ni+1} → ]</button>`:''}
              </div>
            </div>`;
        }
        window.baqReplay = function(gk){ const n=NODES.find(x=>x.game===gk); if(n){S.current=n.id;drawMap();openGame(n);} };
        window.baqGoto  = function(id){ S.current=id; drawMap(); openGame(NODES[id]); };

        // ── SHARED UI HELPERS ──────────────────────────────────────────
        function arcadeCard(content){
          return `<div style="background:#1e293b;border:1px solid #334155;border-radius:4px;padding:1.1rem;text-align:center;margin-bottom:1rem;font-size:0.92rem;font-weight:600;color:#f8fafc;line-height:1.5;">${content}</div>`;
        }
        function arcadeBtn(label, onclick, color='#0ea5e9', textColor='#070b14'){
          return `<button onclick="${onclick}" style="font-family:monospace;background:${color};color:${textColor};border:none;padding:0.6rem 1.1rem;font-size:0.8rem;font-weight:700;cursor:pointer;margin:0.25rem;">${label}</button>`;
        }
        function arcadeSecondaryBtn(label, onclick){
          return arcadeBtn(label, onclick, '#1e293b', '#94a3b8');
        }
        function scoreBar(score, errors, label){
          return `<div style="font-family:monospace;font-size:0.72rem;color:#475569;text-align:center;margin-top:0.75rem;">${label} | Erreurs : <span style="color:${errors?C.danger:C.success}">${errors}</span></div>`;
        }

        // =============================================
        // JEU 1 — MUDAS : QCM rapide avec timer
        // =============================================
        function gameMuda(el){
          const items = shuffle([
            {t:'Réunion 2h sans ordre du jour',m:true},
            {t:'Tests avec les utilisateurs',m:false},
            {t:'Validation par 4 managers',m:true},
            {t:'Développement d\'une feature',m:false},
            {t:'Copier-coller entre Excel',m:true},
            {t:'Correction bug critique',m:false},
            {t:'Attente env. test (3 jours)',m:true},
            {t:'Documentation que personne ne lit',m:true},
            {t:'Démo au client',m:false},
            {t:'Réunion pour planifier la réunion',m:true},
          ]);
          let idx=0, errors=0, timeLeft=45, timer=null, done=false;

          function render(){
            if(idx>=items.length){ finish(); return; }
            const item=items[idx];
            el.innerHTML=`
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                <span style="font-family:monospace;font-size:0.72rem;color:${C.muted};">${idx+1} / ${items.length}</span>
                <span id="muda-timer" style="font-family:monospace;font-size:1rem;font-weight:800;color:${timeLeft<=10?C.danger:C.primary};">${timeLeft}s</span>
                <span style="font-family:monospace;font-size:0.72rem;color:${C.danger};">Erreurs : ${errors}</span>
              </div>
              ${arcadeCard(item.t)}
              <div style="display:flex;gap:0.5rem;">
                <button onclick="mudaPick(true)" style="flex:1;background:#3b0a0a;border:1px solid #ef444466;color:#fca5a5;padding:0.75rem;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:monospace;">🗑️ MUDA</button>
                <button onclick="mudaPick(false)" style="flex:1;background:#052e16;border:1px solid #22c55e66;color:#86efac;padding:0.75rem;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:monospace;">✅ VALEUR</button>
              </div>`;
          }

          window.mudaPick = function(isMuda){
            if(done) return;
            const ok = isMuda===items[idx].m;
            if(!ok) errors++;
            const feedback = el.querySelector('div:nth-child(2)');
            if(feedback){
              feedback.style.background=ok?'#052e16':'#3b0a0a';
              feedback.style.color=ok?'#86efac':'#fca5a5';
              feedback.innerHTML = ok?'✅ Correct !':'❌ '+(items[idx].m?'C\'était un Muda !':'C\'était de la valeur !');
            }
            setTimeout(()=>{ idx++; render(); }, 500);
          };

          function tick(){
            timeLeft--;
            const el2=document.getElementById('muda-timer');
            if(el2){ el2.textContent=timeLeft+'s'; el2.style.color=timeLeft<=10?C.danger:C.primary; }
            if(timeLeft<=0){ clearInterval(timer); finish(); }
          }

          function finish(){
            if(done) return; done=true;
            clearInterval(timer);
            const score=idx*10-errors*5;
            showResult(el, starsFor(errors,items.length),
              `${idx} situations triées — ${errors} erreur(s)`,
              'Éliminer les Mudas libère de l\'énergie pour ce qui crée vraiment de la valeur.','muda');
          }

          render();
          timer=setInterval(tick,1000);
        }

        // =============================================
        // JEU 2 — KANBAN : drag HTML entre colonnes
        // =============================================
        function gameKanban(el){
          const WIP=2;
          let tickets=[
            {id:1,label:'🐛 Bug critique',col:0},
            {id:2,label:'✨ Feature A',col:0},
            {id:3,label:'📖 Story B',col:0},
            {id:4,label:'♻️ Refacto',col:0},
            {id:5,label:'🧪 Tests E2E',col:0},
          ];
          let moves=0,violations=0,msg='';

          function wipCount(){ return tickets.filter(t=>t.col===1).length; }
          function allDone(){ return tickets.every(t=>t.col===2); }

          function render(){
            const COLS=['À faire','En cours','Terminé ✓'];
            const CCOL=['#64748b','#0ea5e9','#22c55e'];
            el.innerHTML=`
              ${msg?`<div style="font-family:monospace;font-size:0.72rem;padding:0.4rem 0.6rem;background:#3b0a0a;color:#fca5a5;margin-bottom:0.6rem;">${msg}</div>`:''}
              <div style="font-family:monospace;font-size:0.72rem;color:${C.muted};margin-bottom:0.6rem;">Limite WIP "En cours" : <strong style="color:${C.text}">2 tickets max</strong>. Finissez avant d'en commencer d'autres.</div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:0.6rem;">
              ${COLS.map((col,ci)=>{
                const count=tickets.filter(t=>t.col===ci).length;
                const over=ci===1&&count>WIP;
                return `<div style="background:${over?'#2d0a0a':'#0a0f1e'};border:1px solid ${over?'#ef4444':C.border};border-radius:4px;padding:0.5rem;min-height:160px;">
                  <div style="font-family:monospace;font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${over?C.danger:CCOL[ci]};margin-bottom:0.4rem;display:flex;justify-content:space-between;">
                    <span>${col}</span>${ci===1?`<span style="background:${over?'#7f1d1d':'#1e293b'};color:${over?'#fca5a5':C.muted};padding:1px 5px;border-radius:2px;">${count}/${WIP}</span>`:`<span style="color:#334155">${count}</span>`}
                  </div>
                  ${tickets.filter(t=>t.col===ci).map(t=>`
                    <div style="background:#1e293b;border:1px solid #334155;border-radius:3px;padding:0.35rem 0.5rem;font-size:0.78rem;color:${C.text};margin-bottom:0.3rem;display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span>${t.label}</span>
                      ${ci<2?`<button onclick="kbMove(${t.id})" style="background:${C.primary};border:none;color:#070b14;border-radius:2px;padding:2px 7px;font-size:0.72rem;font-weight:700;cursor:pointer;">→</button>`:'<span style="color:#22c55e;">✓</span>'}
                    </div>`).join('')}
                  ${!tickets.filter(t=>t.col===ci).length?`<div style="color:#1e3a5f;font-size:0.7rem;text-align:center;padding:0.4rem;font-family:monospace;">vide</div>`:''}
                </div>`;
              }).join('')}
              </div>
              <div style="font-family:monospace;font-size:0.68rem;color:${C.muted};">Déplacements : <strong style="color:${C.text}">${moves}</strong> &nbsp;|&nbsp; Violations WIP : <strong style="color:${violations?C.danger:C.success}">${violations}</strong></div>`;

            if(allDone()){
              const stars=violations===0?3:violations<=2?2:1;
              setTimeout(()=>showResult(el,stars,
                `Tous livrés en ${moves} déplacements — ${violations} violation(s)`,
                'Limiter le WIP réduit le temps de cycle et révèle les goulets d\'étranglement.','kanban'),300);
            }
          }

          window.kbMove=function(id){
            const t=tickets.find(x=>x.id===id);
            if(t.col+1===1&&wipCount()>=WIP){ violations++; msg='⚠️ WIP plein — terminez un ticket d\'abord.'; }
            else msg='';
            t.col++; moves++; render();
          };
          render();
        }

        // =============================================
        // JEU 3 — BACKLOG : une story, 4 boutons
        // =============================================
        function gameBacklog(el){
          const stories=shuffle([
            {label:'Paiement en 1 clic',    q:0, why:'Haute valeur, faible effort → Quick Win évident.'},
            {label:'Dark mode',             q:2, why:'Faible valeur métier, effort raisonnable → Fill-in.'},
            {label:'Onboarding guidé',      q:0, why:'Réduit le churn J+1, simple à implémenter → Quick Win.'},
            {label:'Rapport BI très avancé',q:1, why:'Valeur forte mais développement très coûteux → Gros chantier.'},
            {label:'Notifications push',    q:1, why:'Fort potentiel, multi-plateforme complexe → Gros chantier.'},
            {label:'Refonte infra complète',q:3, why:'Effort maximal, valeur invisible utilisateur → À éviter.'},
          ]);
          const Q=[
            {label:'⚡ Quick Win',    sub:'Haute valeur · Faible effort', bg:'#064e3b', border:'#22c55e', tc:'#6ee7b7'},
            {label:'🏗️ Gros chantier',sub:'Haute valeur · Fort effort',   bg:'#1e3a5f', border:'#0ea5e9', tc:'#7dd3fc'},
            {label:'🧹 Fill-in',      sub:'Faible valeur · Faible effort', bg:'#1c1917', border:'#78716c', tc:'#a8a29e'},
            {label:'❌ À éviter',     sub:'Faible valeur · Fort effort',   bg:'#3b0a0a', border:'#ef4444', tc:'#fca5a5'},
          ];
          let idx=0,errors=0,showEx=false,lastOk=false,lastWhy='';

          function render(){
            if(idx>=stories.length){
              showResult(el,starsFor(errors,stories.length),
                `${stories.length} stories classées — ${errors} erreur(s)`,
                'Prioriser par valeur/effort permet de livrer le max d\'impact avec le minimum de ressources.','backlog');
              return;
            }
            const s=stories[idx];
            if(showEx){
              el.innerHTML=`
                <div style="text-align:center;margin-bottom:0.75rem;font-family:monospace;font-size:0.68rem;color:${C.muted};">${idx} / ${stories.length} classées</div>
                <div style="background:${lastOk?'#064e3b':'#3b0a0a'};border:1px solid ${lastOk?'#22c55e':'#ef4444'};border-radius:4px;padding:1.1rem;text-align:center;margin-bottom:1rem;">
                  <div style="font-size:1.4rem;margin-bottom:0.4rem;">${lastOk?'✅':'❌'}</div>
                  <div style="font-size:0.88rem;font-weight:700;color:#f8fafc;margin-bottom:0.3rem;">"${stories[idx-1].label}"</div>
                  <div style="font-family:monospace;font-size:0.72rem;color:${Q[stories[idx-1].q].tc};font-weight:700;margin-bottom:0.3rem;">→ ${Q[stories[idx-1].q].label}</div>
                  <div style="font-size:0.78rem;color:#94a3b8;">${lastWhy}</div>
                </div>
                <button onclick="blNext()" style="width:100%;font-family:monospace;background:${C.primary};color:#070b14;border:none;padding:0.65rem;font-size:0.82rem;font-weight:700;cursor:pointer;">${idx<stories.length?'STORY SUIVANTE →':'VOIR MON SCORE'}</button>`;
              return;
            }
            el.innerHTML=`
              <div style="text-align:center;font-family:monospace;font-size:0.68rem;color:${C.muted};margin-bottom:0.5rem;">Story ${idx+1} / ${stories.length}</div>
              ${arcadeCard(`"${s.label}"`)}
              <div style="font-family:monospace;font-size:0.72rem;color:${C.muted};text-align:center;margin-bottom:0.5rem;">Où la placez-vous ?</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;">
                ${Q.map((q,qi)=>`
                  <button onclick="blPick(${qi})" style="background:${q.bg};border:1px solid ${q.border};border-radius:4px;padding:0.7rem 0.5rem;cursor:pointer;text-align:left;">
                    <div style="font-size:0.85rem;font-weight:700;color:${q.tc};margin-bottom:0.15rem;">${q.label}</div>
                    <div style="font-family:monospace;font-size:0.6rem;color:#64748b;">${q.sub}</div>
                  </button>`).join('')}
              </div>
              ${scoreBar(0,errors,`${idx} classées`)}`;
          }
          window.blPick=function(qi){ const s=stories[idx]; lastOk=qi===s.q; if(!lastOk)errors++; lastWhy=s.why; idx++; showEx=true; render(); };
          window.blNext=function(){ showEx=false; render(); };
          render();
        }

        // =============================================
        // JEU 4 — MULTITÂCHE : chrono focus vs switch
        // =============================================
        function gameMultitask(el){
          const letters=['A','B','C','D','E'];
          const numbers=['1','2','3','4','5'];
          let phase=1,seq=[],idx=0,t1=0,start=0,timer=null;

          function setupPhase(p){
            phase=p; idx=0;
            seq=p===1?['1','2','3','4','5','A','B','C','D','E']:['1','A','2','B','3','C','4','D','5','E'];
            start=Date.now();
            if(timer) clearInterval(timer);
            timer=setInterval(()=>{ const e=document.getElementById('wip-chrono'); if(e) e.textContent=((Date.now()-start)/1000).toFixed(1)+'s'; },100);
            render();
          }

          function render(){
            const inst=phase===1
              ?'Étape 1/2 — FOCUS : cliquez 1→2→3→4→5 puis A→B→C→D→E'
              :'Étape 2/2 — MULTITÂCHE : alternez 1→A→2→B→3→C→…';
            el.innerHTML=`
              <div style="text-align:center;margin-bottom:0.75rem;">
                <div style="font-family:monospace;font-size:0.75rem;color:${C.primary};margin-bottom:0.5rem;">${inst}</div>
                <div id="wip-chrono" style="font-family:monospace;font-size:2.2rem;font-weight:800;color:${C.text};">0.0s</div>
              </div>
              <div style="display:flex;gap:0.4rem;justify-content:center;flex-wrap:wrap;margin-bottom:0.5rem;">
                ${numbers.map(n=>`<button onclick="wipClick('${n}')" id="wip-btn-${n}" style="width:52px;height:52px;background:${C.panel};border:2px solid ${C.border};border-radius:6px;color:${C.text};font-size:1.1rem;font-weight:700;cursor:pointer;">${n}</button>`).join('')}
              </div>
              <div style="display:flex;gap:0.4rem;justify-content:center;flex-wrap:wrap;">
                ${letters.map(l=>`<button onclick="wipClick('${l}')" id="wip-btn-${l}" style="width:52px;height:52px;background:${C.panel};border:2px solid ${C.border};border-radius:6px;color:${C.text};font-size:1.1rem;font-weight:700;cursor:pointer;">${l}</button>`).join('')}
              </div>`;
          }

          window.wipClick=function(val){
            const btn=document.getElementById('wip-btn-'+val);
            if(!btn||btn.disabled) return;
            if(val===seq[idx]){
              btn.style.background=C.primary; btn.style.borderColor=C.primary; btn.style.color='#fff'; btn.disabled=true; idx++;
              if(idx>=seq.length){
                clearInterval(timer);
                const t=((Date.now()-start)/1000).toFixed(2);
                if(phase===1){ t1=parseFloat(t); setTimeout(()=>setupPhase(2),600); }
                else{
                  const diff=(parseFloat(t)-t1).toFixed(2);
                  const pct=Math.round((parseFloat(diff)/t1)*100);
                  showResult(el, parseFloat(diff)<2?3:parseFloat(diff)<5?2:1,
                    `Focus : ${t1}s → Multitâche : ${t}s → Surcoût : +${diff}s (+${pct}%)`,
                    'Le changement de contexte coûte 20-40% de productivité. Arrêtez de commencer, commencez à finir !','multitask');
                }
              }
            } else {
              btn.style.background='#7f1d1d'; btn.style.borderColor=C.danger;
              setTimeout(()=>{ btn.style.background=C.panel; btn.style.borderColor=C.border; },300);
            }
          };
          setupPhase(1);
        }

        // =============================================
        // JEU 5 — DÉLÉGATION : scénario narratif
        // =============================================
        function gameDelegation(el){
          const situations=shuffle([
            {scene:'🖥️',ctx:'Votre équipe senior vous demande de choisir elle-même ses outils de dev. Vous n\'êtes pas expert technique.',
             opts:['Je leur impose notre stack actuelle.','On organise un vote collectif.','Ils choisissent, je valide le budget.'],
             ok:2,outcome:['❌ Démotivation. Ils connaissent mieux les outils adaptés.','⚠️ Bien intentionné mais le vote ne remplace pas l\'expertise.','✅ Délégation totale sur leur domaine. Vélocité +30%.'],
             why:'Une équipe experte doit être autonome sur son domaine technique.'},
            {scene:'🎤',ctx:'Un junior prépare seul sa 1ère présentation devant un client stratégique. Il panique.',
             opts:['Je prends sa place pour ne pas risquer.','On prépare ensemble, il présente.','Je le laisse gérer, c\'est formateur.'],
             ok:1,outcome:['❌ Vous lui volez son opportunité de grandir.','✅ Vous guidez sans remplacer. Il progresse ET le client est servi.','❌ Trop risqué sur un client stratégique.'],
             why:'La délégation progressive développe les compétences sans mettre en danger.'},
            {scene:'💰',ctx:'Décision d\'investissement à 800k€. Doit être prise cette semaine.',
             opts:['Je consulte l\'équipe puis je décide.','On vote en équipe.','Le chef de projet décide.'],
             ok:0,outcome:['✅ Vous consultez les expertises mais assumez la responsabilité.','❌ Un vote dilue la responsabilité. Ce n\'est pas de la démocratie.','❌ 800k€ dépasse le périmètre d\'un chef de projet.'],
             why:'Plus l\'enjeu est fort, plus la décision remonte. Consultez, mais décidez.'},
            {scene:'🏕️',ctx:'L\'équipe veut organiser son team building. Budget max : 1000€.',
             opts:['Je choisis la destination.','Je pose le budget, ils décident.','Je leur délègue tout y compris le budget.'],
             ok:1,outcome:['❌ C\'est leur moment. Décider à leur place casse l\'esprit d\'équipe.','✅ Contrainte claire, autonomie maximale. Engagement garanti.','⚠️ Sans garde-fou budget, risque de dérive involontaire.'],
             why:'Faible enjeu + fort impact motivation = déléguer au maximum.'},
          ]);
          let idx=0,errors=0,showEx=false,lastOk=false,lastOut='',lastWhy='';

          function render(){
            if(idx>=situations.length){
              showResult(el,starsFor(errors,situations.length),
                `${situations.length} situations — ${errors} erreur(s)`,
                'Le bon niveau de délégation dépend de la maturité de l\'équipe et de l\'enjeu. Management 3.0 !','delegation');
              return;
            }
            const sit=situations[idx];
            if(showEx){
              el.innerHTML=`
                <div style="text-align:center;font-family:monospace;font-size:0.68rem;color:${C.muted};margin-bottom:0.5rem;">${idx} / ${situations.length}</div>
                <div style="font-size:1.5rem;text-align:center;margin-bottom:0.4rem;">${lastOk?'✅':'❌'}</div>
                <div style="background:${lastOk?'#064e3b':'#3b0a0a'};border:1px solid ${lastOk?'#22c55e':'#ef4444'};border-radius:4px;padding:1.1rem;margin-bottom:1rem;">
                  <div style="font-size:0.88rem;color:${lastOk?'#86efac':'#fca5a5'};font-weight:700;margin-bottom:0.4rem;">${lastOut}</div>
                  <div style="font-family:monospace;font-size:0.72rem;color:#94a3b8;">💡 ${lastWhy}</div>
                </div>
                <button onclick="delNext()" style="width:100%;font-family:monospace;background:${C.primary};color:#070b14;border:none;padding:0.65rem;font-size:0.82rem;font-weight:700;cursor:pointer;">${idx<situations.length?'SITUATION SUIVANTE →':'VOIR MON SCORE'}</button>`;
              return;
            }
            el.innerHTML=`
              <div style="text-align:center;font-family:monospace;font-size:0.68rem;color:${C.muted};margin-bottom:0.4rem;">Situation ${idx+1} / ${situations.length}</div>
              <div style="font-size:1.75rem;text-align:center;">${sit.scene}</div>
              <div style="background:${C.panel};border:1px solid ${C.border};border-radius:4px;padding:0.9rem;font-size:0.88rem;color:${C.text};line-height:1.6;margin:0.6rem 0 0.9rem;">${sit.ctx}</div>
              <div style="font-family:monospace;font-size:0.7rem;color:${C.muted};text-align:center;margin-bottom:0.5rem;">Que faites-vous ?</div>
              <div style="display:flex;flex-direction:column;gap:0.4rem;">
                ${sit.opts.map((o,oi)=>`<button onclick="delPick(${oi})" style="background:${C.panel};border:1px solid ${C.border};color:${C.text};border-radius:4px;padding:0.75rem 0.9rem;font-size:0.85rem;cursor:pointer;text-align:left;">${['🎯','🤝','🚀'][oi]} ${o}</button>`).join('')}
              </div>
              ${scoreBar(0,errors,`${idx} analysées`)}`;
          }
          window.delPick=function(oi){ const sit=situations[idx]; lastOk=oi===sit.ok; if(!lastOk)errors++; lastOut=sit.outcome[oi]; lastWhy=sit.why; idx++; showEx=true; render(); };
          window.delNext=function(){ showEx=false; render(); };
          render();
        }

        // =============================================
        // JEU 6 — EMPATHIE : un verbatim, 4 boutons
        // =============================================
        function gameEmpathy(el){
          const verbatims=shuffle([
            {text:'"Je veux que ça soit rapide"',         q:0, why:'Parole exprimée à voix haute → Dit.'},
            {text:'"Ils ne comprennent pas mes besoins"', q:1, why:'Pensée intérieure rarement formulée → Pense.'},
            {text:'Il compare 5 outils en parallèle',     q:2, why:'Comportement observable → Fait.'},
            {text:'Frustration face aux longs formulaires',q:3, why:'Émotion vécue → Ressent.'},
            {text:'"Le prix me semble correct"',          q:0, why:'Verbatim exprimé lors d\'un entretien → Dit.'},
            {text:'"J\'ai peur de me tromper"',           q:1, why:'Doute intérieur rarement verbalisé → Pense.'},
            {text:'Il abandonne à l\'étape 3 du parcours',q:2, why:'Comportement mesurable → Fait.'},
            {text:'Enthousiasme lors de la démo produit', q:3, why:'Émotion observable → Ressent.'},
          ]);
          const Q=[
            {label:'💬 Dit',    sub:'Ce qu\'il exprime',    color:'#0ea5e9', bg:'#0c2a40'},
            {label:'💭 Pense',  sub:'Ce qu\'il pense seul', color:'#8b5cf6', bg:'#2a1a50'},
            {label:'🏃 Fait',   sub:'Ses actions',          color:'#f59e0b', bg:'#401800'},
            {label:'❤️ Ressent',sub:'Ses émotions',         color:'#ec4899', bg:'#400828'},
          ];
          let idx=0,errors=0,showEx=false,lastOk=false;

          function render(){
            if(idx>=verbatims.length){
              showResult(el,starsFor(errors,verbatims.length),
                `Empathy Map complétée — ${errors} erreur(s)`,
                'Distinguer Dit/Pense/Fait/Ressent révèle des besoins invisibles et guide la conception centrée utilisateur.','empathy');
              return;
            }
            const v=verbatims[idx];
            if(showEx){
              el.innerHTML=`
                <div style="text-align:center;font-family:monospace;font-size:0.68rem;color:${C.muted};margin-bottom:0.5rem;">${idx} / ${verbatims.length} placés</div>
                <div style="background:${lastOk?'#064e3b':'#3b0a0a'};border:1px solid ${lastOk?'#22c55e':'#ef4444'};border-radius:4px;padding:1.1rem;text-align:center;margin-bottom:1rem;">
                  <div style="font-size:1.4rem;margin-bottom:0.4rem;">${lastOk?'✅':'❌'}</div>
                  <div style="font-size:0.9rem;color:#f8fafc;font-weight:700;margin-bottom:0.3rem;">${verbatims[idx-1].text}</div>
                  <div style="font-size:0.82rem;font-weight:700;color:${Q[verbatims[idx-1].q].color};margin-bottom:0.3rem;">→ ${Q[verbatims[idx-1].q].label}</div>
                  <div style="font-family:monospace;font-size:0.7rem;color:#94a3b8;">${verbatims[idx-1].why}</div>
                </div>
                <button onclick="empNext()" style="width:100%;font-family:monospace;background:${C.primary};color:#070b14;border:none;padding:0.65rem;font-size:0.82rem;font-weight:700;cursor:pointer;">${idx<verbatims.length?'VERBATIM SUIVANT →':'VOIR MON SCORE'}</button>`;
              return;
            }
            el.innerHTML=`
              <div style="text-align:center;font-family:monospace;font-size:0.68rem;color:${C.muted};margin-bottom:0.5rem;">Verbatim ${idx+1} / ${verbatims.length}</div>
              ${arcadeCard(v.text)}
              <div style="font-family:monospace;font-size:0.72rem;color:${C.muted};text-align:center;margin-bottom:0.5rem;">Dans quel quadrant ?</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;">
                ${Q.map((q,qi)=>`
                  <button onclick="empPick(${qi})" style="background:${q.bg};border:1px solid ${q.color}55;border-radius:4px;padding:0.7rem 0.5rem;cursor:pointer;text-align:left;">
                    <div style="font-size:0.88rem;font-weight:700;color:${q.color};margin-bottom:0.15rem;">${q.label}</div>
                    <div style="font-family:monospace;font-size:0.6rem;color:#64748b;">${q.sub}</div>
                  </button>`).join('')}
              </div>
              ${scoreBar(0,errors,`${idx} placés`)}`;
          }
          window.empPick=function(qi){ lastOk=qi===verbatims[idx].q; if(!lastOk)errors++; idx++; showEx=true; render(); };
          window.empNext=function(){ showEx=false; render(); };
          render();
        }

        // ── INIT ───────────────────────────────────────────────────────
        drawMap();


})(); // fin IIFE
