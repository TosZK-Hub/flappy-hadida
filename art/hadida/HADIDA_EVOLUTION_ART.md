# Flappy Hadida — Evolution Pass (Art → Code drop-in)

**Owner:** Art (Blunt Art) · **Consumer:** Code · **Status:** Evolution bake (next ship after Feel CLEAR on current Hadida)  
**Director lock (Jesse):** Product = **Flappy Hadida** · Hero = **hadeda ibis** bill→right — **NOT** blunt / kraft / 420 · soft chests · **no IAP**  
**Live:** https://toszk-hub.github.io/flappy-hadida/  
**Base Art lock (holds):** [`FLAPPY_HADIDA.md`](./FLAPPY_HADIDA.md) + `art/hadida/`  
**Systems strings / juice beats:** [`HADIDA_EVOLUTION_SYSTEMS.md`](./HADIDA_EVOLUTION_SYSTEMS.md)  
**Physics / hitbox Feel-owned:** **1450 / −440** · hitbox start **34×24** class — Art juices only

**Sheets:** `art/hadida/evolution/`
- `evo-hero-depth.png`
- `evo-world-motifs.png`
- `evo-ui-chrome.png`

**Render path:** Canvas volumetric / sprite-sheet cartoon 3D-feel · **WebGL = NO (default)**  
GenerateImage preferred; this pass baked via node-canvas (same toolchain as base Hadida) after ElevenLabs quota shortfall.

---

## Ship order (Art)

1. Feel CLEAR on **current** Hadida main (base `FLAPPY_HADIDA.md`).  
2. Code copies **this file + evolution sheets** into flappy-hadida (can parallel Design systems wire).  
3. Feel Evolution re-gate on Pages.

---

## Recommendation — canvas volumetric (NO WebGL default)

| Flag | Value |
|------|--------|
| **WebGL** | **NO** (default) |
| When WebGL? | Only if Feel proves canvas cannot hold silhouette / 60fps at portrait mobile after this elevation |
| F0–F7 | **HOLD** Design squash **sx 0.88 / sy 1.12 @ 70–90ms** |
| Feel Class Above | Unchanged — Art does not thrash physics |

---

## Kill list — flat / toy tells on current ship

Elevate **paint + juice** only. Physics, AABB family, IA locks hold.

| Kill (current tell) | Elevate to |
|---------------------|------------|
| Flat / single-fill body (or weak 2-stop) | **5-stop IRI** + diagonal iri sheen overlay α≈0.40–0.45 |
| Hard wing silhouette / toy rectangle feathers | **Soft-edge tips** — α fade + white leading edge glow |
| Bill = flat grey wedge | **Bill specular streak** α≈0.55 + soft AO under bill |
| No rim / no AO → paper cutout | Rim top cream **α0.48** + underside AO **α0.38** |
| Motifs read as generic discs / pipes | Each motif **must read as itself** (braai / taxi / pylon / protea) |
| Flat PLAY / opaque secondary CTAs | Gold volumetric PLAY + **warm glass ghosts** |
| Coin reads leaf/nug/flat disc | Gold disc + **R** + specular + AO (HUD 28–32px) |
| Death = hard pop / no ash | Soft **grey-green ash** dissolve ≤200ms |
| Flap = silent sprite flip | **Iri feather motes** trail α≤35% |
| Near-miss invisible | **Skim spark** cream/gold on ≤6px lip |
| Chest open = instant swap | **0.6s lid** → C/R/E/L flash → Equip |
| Title flat cream sans | **Wanted-class** FLAPPY HADIDA gold-rim wordmark |

**Still killed (hard fail):** Blunt / kraft / 420 hero · Night Heist brand · grinders-as-420 · leaf/nug/blunt-tip coin · green Flappy pipes · IAP / ads / pay-to-flap · Gummies / Dab Rocket · WebGL default on · official Springbok logos.

---

## Hero depth (starter_hadida elevated)

Identity from base lock **holds**: plump hadeda, bill tip→right, white cheek, iridescent dark plumage, arcade eye. Evolution raises **material depth**.

### Material recipe (clip to body path)

```
0.00  HAD_HI      #5A8A6A
0.18  IRI_TEAL    #2A9A8A
0.45  HAD_MID     #2A3A38
0.72  IRI_PURPLE  #8A5AB8
1.00  HAD_SHADOW  #0E1418
```

**Diagonal iri overlay** (after base fill, clip body): green → purple → teal → bronze, peak α≈0.40–0.45 on starter; drop to ~0.30 on painted costumes so chrome reads.

| Layer | Spec |
|-------|------|
| Rim top | `rgba(255,248,236,0.48→0)` along crown |
| AO under | `rgba(14,24,20,0→0.38)` belly |
| Body specular | cream streak α≈0.32 along upper arc |
| **Bill specular** | primary streak α≈0.55 `#FFF8EC` + secondary soft sheen α≈0.22 · AO ellipse under bill α0.35 |
| Bill stops | `#8A8A94` → `BILL_HI` → `BILL` → `#2A2A30` → `BILL_TIP` |
| Cheek | subsurface radial white→`CHEEK`→warm fade |
| **Wing soft-edge** | 5 feathers/side · front α1 / back α0.68 offset (−4, −3·side) · tip α fade + `WING_EDGE` leading glow |
| Ink | **2.2px** `#0E1814` rounded paths only |
| Contact shadow | ellipse under feet α0.28 |

### Proportions / hitbox (HOLD)

Body core L≈**52–56** · bill≈**28–32** · silhouette tip-to-tail≈**74–82** · body R≈**20–22** · wing span/side≈**22–26**.  
Hitbox start **34×24** class — Feel rematches inset. Costume never changes gravity/gap/unfair hitbox.

### F0–F7 (HOLD)

| Frame | Pose | Timing | Draw squash |
|-------|------|--------|-------------|
| F0 | Idle mid | loop | 1 / 1 |
| F1 | Idle up | bob `sin(t*2.15)*6–7` | 1 / 1 |
| F2 | Anticipation wings up | 0–40ms | 1.02 / 0.98 |
| F3 | Downstroke start | 40–70ms | 0.95 / 1.05 |
| F4 | **Squash peak** | **70–90ms** | **sx 0.88 / sy 1.12** |
| F5 | Release | 90–140ms | 0.94 / 1.06 |
| F6 | Settle | 140–200ms → 1,1 | 0.98 / 1.02 |
| F7 | Idle down | bob | 1 / 1 |

Trail mid α ≤**35%**. **No flap camera shake.** Squash is draw-scale only around player origin.

---

## Motif readability (world)

**World hold:** Township Sunset / Veld — soft Table Mountain far (α≤0.55) · township + jacaranda mid · braai dust / veld near.  
**AABB family unchanged** — Art swaps paint only. Gap lip cream/gold hairline bloom **α≤0.10**.

| Motif id | Must read as | Elevate cues |
|----------|--------------|--------------|
| `braai_drum` | Charcoal **braai** drum | Metal gradient · **rust rim** · vent holes · warm **ember** under |
| `taxi_stack` | SA **minibus taxi** | Yellow `#FFB81C` · **green stripe `#007A4D`** · blue window · headlight specular |
| `pylon_disc` | Load-shedding **pylon** | Grey **lattice X** · insulator discs · soft **yellow tip lights** |
| `protea_column` | Cape **protea** | Pointed pink petals `#E85A8C` · gold center · green stem discs |

**Band hints hold:** braai Teach/Warm · taxi Warm/Rise · pylon Rise/Heat · protea Heat/Legend.

**Fail if:** player mistakes stack for green pipe, grinder, blunt tower, or generic cylinder.

---

## UI chrome

| Element | Evolution spec |
|---------|----------------|
| **Title** | Wanted-class **FLAPPY HADIDA** — cream→gold gradient fill · ink outline · soft gold rim glow |
| Tagline | **“One flap. Haa-haa energy.”** (`SUNSET` whisper) |
| **PLAY** | Soft gold `#FFB81C`→`#C88912` · cream text · specular top glass · **≥56px** · **only hot CTA** |
| **CHESTS / CHALLENGES** | Warm **glass ghosts** — frosted fill · cream outline **α0.35** · never start a run |
| **Coin HUD** | Gold disc + **R** · face `#FFD24A` · rim `#C88912` · specular arc · AO under · ~28–32px (chest reveal 2×) |
| Death | Gold **RESTART** only · ghost **HOME** · ghost CHESTS/CHALLENGES · **≥16px** gaps |
| Rank under best | Systems titles (Chick→Hadida King) — Art: cream whisper, no chrome fight with PLAY |
| Full-set toast | **“Full flock”** + **150 coins** |

**Zero IAP / ads / Buy now** chrome. Broke copy Art-safe: “Earn coins on runs”.

---

## Juice VFX recipes (Art · beats from Systems)

Wire to [`HADIDA_EVOLUTION_SYSTEMS.md`](./HADIDA_EVOLUTION_SYSTEMS.md) — Art owns look, not payout math.

| Id | Trigger | Recipe | Caps |
|----|---------|--------|------|
| `flap_feathers` | Each flap (F3–F5) | Soft iri **green/purple** feather motes from wing tips | Trail α≤**35%** · no camera shake |
| `skim_spark` | Near-miss ≤6px lip | Cream/gold star spark on lip + whisper `+1` | Cap **+8**/run · ≤180ms |
| `chest_lid` | Chest open | **0.6s** lid rotate → rarity flash **C/R/E/L** colors → Equip | Street/Township/Bok paint only |
| `death_ash` | Crash | Soft **grey-green ash** dissolve of hero | ≤**200ms** · never blocks RESTART |
| `milestone_toast` | 10/25/50/100 | Cream chip ≤1.2s | Never blocks flap |
| `clean_flight` | Systems daily | Soft gold feather whisper | Once/day copy from Design |
| `new_best` | New best | Gold feather burst | ≤200ms |
| `rank_gift` | First cross | Soft gold rim pulse under rank title | One-time |

**Rarity flash colors:** C `#8BC4A0` · R `#4EB8E8` · E `#E85A8C` · L `#FFB81C`.

Bloom global ≤**15%**. Particles die with α fade — no sticky sparks.

---

## Palette (Hadida lock — unchanged tokens)

Use tokens from [`FLAPPY_HADIDA.md`](./FLAPPY_HADIDA.md). Evolution does **not** introduce Night Heist purple noir as brand or kraft canvas hero wrap.

---

## Costume / economy hold

12 costumes C5/R4/E2/L1 · ids locked · paint on HADIDA body · chests only · starter `starter_hadida` free.  
Migrate `starter_tee` → `starter_hadida`. Cosmetics never change gravity/gap/hitbox.

Chest prices/weights/pity: [`TOTAL_UPGRADE_SA_CHESTS.md`](./TOTAL_UPGRADE_SA_CHESTS.md) hold.

---

## WebGL — NO (default)

Ship canvas volumetric. Revisit WebGL **only** if Feel documents: silhouette loss at portrait mobile, or sustained &lt;60fps after Evolution paint + juice at target device class. Do not flip WebGL “for premium.”

---

## Art QA checklist (Evolution re-gate)

- [ ] Hero reads **premium cartoon 3D** — 5-stop + diagonal iri + rim + AO + bill specular + wing soft-edge
- [ ] **Kill list** cleared: no flat body, hard toy wings, flat bill wedge, paper cutout
- [ ] Hero = **hadeda ibis** bill→right · **NOT** blunt / kraft / 420
- [ ] F0–F7 hold · squash **70–90ms sx0.88/sy1.12** · trail α≤35% · no flap camera shake
- [ ] Hitbox debug **34×24** class · physics **1450/−440** untouched
- [ ] Motifs **read as themselves**: braai / taxi / pylon / protea · gap lip bloom α≤0.10 · AABB paint-only
- [ ] World = Township Sunset / veld / soft Table Mountain · Night Heist / 420 killed
- [ ] Wanted-class **FLAPPY HADIDA** title · gold PLAY ≥56px · glass ghosts · coin **R**
- [ ] Juice: flap feathers · skim spark · chest lid 0.6s · death ash ≤200ms
- [ ] Systems strings honored (milestones, ranks, challenges, clean flight) without blocking PLAY/RESTART
- [ ] Zero IAP / ads / pay-to-flap / Gummies / Dab Rocket chrome
- [ ] **WebGL = NO** (default)
- [ ] Sheets present under `art/hadida/evolution/`

---

## Sheet index

| File | Contents |
|------|----------|
| `art/hadida/evolution/evo-hero-depth.png` | Elevated side hero + iri stops + bill specular + wing soft-edge vs kill |
| `art/hadida/evolution/evo-world-motifs.png` | Township mood strip + braai/taxi/pylon/protea readable stacks |
| `art/hadida/evolution/evo-ui-chrome.png` | Wanted title · PLAY/ghosts · coin R · death · juice VFX recipes |

**Base sheets remain LOCK** under `art/hadida/` until Evolution Feel CLEAR — then Evolution becomes ship look.

**Art does not edit playable JS. Do not push GitHub from Art. Code copies into flappy-hadida.**
