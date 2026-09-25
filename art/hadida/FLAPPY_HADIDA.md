# Flappy Hadida — Art → Code drop-in

**Owner:** Art (Blunt Art) · **Consumer:** Code · **Status:** Art LOCK  
**Director lock (Jesse):** Product = **Flappy Hadida** · Hero = **hadida / hadeda ibis** cartoon flyer — **NOT** a blunt / kraft cylinder / 420 wrap  
**Ship surface:** new repo/Pages **flappy-hadida** (`https://toszk-hub.github.io/flappy-hadida/`) — Code copies from this tree  
**Design (copy / ranks / costume ids):** [`FLAPPY_HADIDA_DESIGN.md`](./FLAPPY_HADIDA_DESIGN.md)  
**Economy numbers hold:** [`TOTAL_UPGRADE_SA_CHESTS.md`](./TOTAL_UPGRADE_SA_CHESTS.md) · **Curve:** [`TOTAL_UPGRADE_MECHANICS.md`](./TOTAL_UPGRADE_MECHANICS.md) (Teach/Warm/Rise/Heat/Legend — no “Heist”)

**Sheets:** `art/hadida/`
- `hadida-hero-turnaround.png`
- `hadida-flap-sheet.png`
- `hadida-world-obstacles.png`
- `hadida-costume-roster.png`
- `hadida-coin-icon.png`

---

## Recommendation — **canvas volumetric (NO WebGL default)**

Ship **Canvas 2D pseudo-3D cartoon**: multi-stop iridescent body fills + soft AO + rim light + specular streak + **front/back wing layers** (2.5D). Sprite-sheet OR procedural draw both fine.

| Flag | Value |
|------|--------|
| **WebGL** | **NO** (default) |
| When WebGL? | Only if Feel proves canvas cannot hold silhouette / 60fps at portrait mobile scale |
| Feel Class Above squash | Keep Design squash **sx 0.88 / sy 1.12 @ 70–90ms** |

---

## Hard locks

| Lock | Value |
|------|--------|
| Player | Premium cartoon 3D-feel **hadeda ibis (hadida)** — long curved bill tip→right, iridescent dark body (greens/purples/bronze), white cheek + optional white wing-edge accents, expressive eye, readable silhouette facing flight direction |
| Hitbox | Rematch to **hadida silhouette**; Feel owns inset fairness — **start from 34×24 class** |
| Proportions | Body core L≈**52–56** · bill≈**28–32** · visual silhouette tip-to-tail≈**74–82** · body R≈**20–22** · wing span/side≈**22–26** |
| Physics | Design GRAVITY **1450** / FLAP **−440** / max fall **540** — Art syncs juice only |
| Monetize | **Off** · soft-currency **chests only** · **no IAP / ads / pay-to-flap** |
| Brand | Flappy Hadida · Night Heist / Blunt / 420 brand **killed for this ship** |
| Prior “not a bird” lock | **OVERRIDDEN** — hero **IS** a bird (hadida) |
| Tagline | **“One flap. Haa-haa energy.”** |

---

## Palette (Hadida lock)

| Token | Hex | Use |
|-------|-----|-----|
| `HAD_HI` | `#5A8A6A` | Body highlight / iri green mid |
| `HAD_MID` | `#2A3A38` | Body mid |
| `HAD_DEEP` | `#1A2428` | Body deep |
| `HAD_SHADOW` | `#0E1418` | Underside AO |
| `IRI_GREEN` | `#3DDB8A` | Iridescent green sheen |
| `IRI_PURPLE` | `#8A5AB8` | Iridescent purple sheen |
| `IRI_BRONZE` | `#C8894A` | Bronze sheen / iris hint |
| `IRI_TEAL` | `#2A9A8A` | Teal wing / body stop |
| `CHEEK` | `#F5F0E8` | White cheek patch |
| `WING_EDGE` | `#E8E0D4` | White wing-edge accent |
| `BILL` | `#3A3A40` | Bill mid |
| `BILL_HI` | `#6A6A72` | Bill highlight |
| `BILL_TIP` | `#1A1A20` | Bill tip |
| `BOK_GREEN` | `#007A4D` | SA accents / jersey / world |
| `BOK_GOLD` | `#FFB81C` | PLAY / coin rim / rare+ |
| `SKY_SA` | `#4EB8E8` | Sky / UI cool |
| `SUNSET_ORANGE` | `#F26A3D` | Veld sunset / vuvuzela |
| `PROTEA_PINK` | `#E85A8C` | Protea Epic |
| `EARTH_WARM` | `#C4783A` | Braai / township |
| `EARTH_DEEP` | `#6B3A1F` | Ground |
| `INK` | `#0E1814` | Outline |
| `CREAM_UI` | `#FFF8EC` | UI text |
| `SHWESHWE_BLUE` | `#1E4D8C` | Pattern materials (not logo) |
| `RHINO_GREY` | `#9AA3A8` | Rhino Guard plates |
| `COIN_FACE` | `#FFD24A` | Soft-currency coin |
| `COIN_RIM` | `#C88912` | Coin rim |
| `COIN_HI` | `#FFE9A0` | Coin specular |
| `TOWNSHIP_SKY_A` | `#FFB36A` | Parallax sunset top |
| `TOWNSHIP_SKY_B` | `#6B3FA0` | Parallax dusk mid |
| `TOWNSHIP_SKY_C` | `#1E3A5F` | Parallax far cool |

**Kill from first paint:** kraft canvas hero wrap, neon leaf bank glyph, leaf/nug/blunt-tip coin, Night Heist purple noir as brand, blunt cylinder / 420 wrap silhouette.

---

## Hero identity (Art lock)

- **Form:** Premium cartoon 3D-feel **hadeda ibis** — plump readable flyer, long downward-curved bill pointing **right** (flight), iridescent dark plumage with green/purple/bronze sheen, **white cheek** patch + optional white wing-edge accents, large expressive arcade eye.
- **Face:** White cheek, oversized eye with bronze iris hint + highlight, soft brow — arcade-PG, haa-haa energy.
- **Bill:** Distinctive curved grey-black bill (~28–32 visual) — primary silhouette read; tip→right.
- **Materials:** Soft subsurface on cheek, **5-stop iridescent body**, rim light top `rgba(255,248,236,0.45→0)`, AO under `rgba(14,24,20,0.28)`, specular streak α≈0.30, ink outline **2px** `#0E1814`. Rounded paths only.
- **Wings:** Front/back layers (back α≈0.72, offset −2..−3px). 4–5 feathers/side with iri + white leading edge. Flap ±0.55 rad from rest.

### Material recipe (default starter — clip to body path)

```
0.00  HAD_HI      #5A8A6A
0.18  IRI_TEAL    #2A9A8A
0.45  HAD_MID     #2A3A38
0.72  IRI_PURPLE  #8A5AB8
1.00  HAD_SHADOW  #0E1418
```

Iridescent overlay (α≈0.85 on starter; lower on painted costumes): green → purple → teal → bronze diagonal sheen.

Costume body wraps (when `body` stops provided) replace the 5-stop base; iridescence α drops to ~0.35 so chrome reads.

---

## Idle + flap cycle (F0–F7 — keep Design squash)

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

Trail mid α ≤**35%**. **No flap camera shake.** Squash is draw-scale only around player origin. Hitbox starts **34×24** class — Feel rematches inset to hadida silhouette; costume never changes gravity/gap/unfair hitbox.

---

## World (Township Sunset / Veld — Hadida world)

**Stick to one world:** warm **township sunset** with soft **Table Mountain** far silhouette + jacaranda + veld — not Night Heist purple alley, not green Flappy pipes, not blunt towers.

### Parallax layers

| Layer | Motif | Scroll | Notes |
|-------|-------|--------|-------|
| Far | Soft Table Mountain + dusk sky (orange→violet→navy) | ~0.15× | Soft silhouette α≤0.55 |
| Mid | Township skyline (zinc roofs, spaza, water towers) + jacaranda | ~0.35× | Warm earth roofs |
| Near | Braai smoke wisps / dusty ground / soft veld grass | ~0.65× | Ground `#6B3A1F` → `#3A2214` |

### Obstacle motif stacks (NOT grinders-as-420, NOT blunt towers)

Stack **disc / drum / column** modules with clear gap lips (2.5–3px cream/gold hairline bloom α≤0.10). AABB family unchanged — Art swaps paint only.

| Motif id | Look | Band hint |
|----------|------|-----------|
| `braai_drum` | Charcoal braai drum towers (metal + rust rim + warm ember under) | Teach / Warm |
| `taxi_stack` | Minibus-taxi body slices (yellow `#FFB81C` + green stripe `#007A4D`) | Warm / Rise |
| `pylon_disc` | Load-shedding pylon disc stacks (grey lattice, soft yellow tip lights) | Rise / Heat |
| `protea_column` | Cape flora / protea column (pink `#E85A8C` bloom + green stem discs) | Heat / Legend |

---

## UI chrome (Art designs · IA from Design)

| Element | Spec |
|---------|------|
| **PLAY** | Soft gold `#FFB81C` → `#C88912` · cream text · ≥56px · only hot CTA |
| **CHESTS / CHALLENGES** | Ghost chips — warm glass, cream outline α0.35 |
| **Coin HUD** | Gold disc with **R** (see recipe) — **NOT** leaf/nug/blunt tip |
| Tagline | **“One flap. Haa-haa energy.”** |
| Death | Gold **RESTART** only; ghost HOME; ghost CHESTS/CHALLENGES; ≥16px gaps |
| Full-set toast | **“Full flock”** + **150 coins** |

---

## Soft-currency coin icon recipe

- Disc face `#FFD24A` · rim `#C88912` · inner ring `#FFE9A0` α0.55
- Center mark: stylized **“R”** — **NOT** cannabis leaf, **NOT** nug, **NOT** blunt tip
- Specular arc top-left α0.45 · soft AO under α0.25
- HUD size ~28–32px; chest reveal can scale 2×

---

## Costume roster (ids + rarity LOCKED — paint on HADIDA body)

**12 costumes = 5 Common / 4 Rare / 2 Epic / 1 Legendary** · free starter · chests only

| # | id | name | rarity | look | trail |
|---|----|------|--------|------|-------|
| 1 | `starter_hadida` | Park Hadida | **Common · FREE starter** | Default iridescent dark hadida + white cheek · no chrome | Soft green dust `#5A8A6A` |
| 2 | `spaza_cap` | Spaza Cap | Common | Cap on crown · green/gold shop-stripe accents | Warm dust `#E8C9A0` |
| 3 | `yellow_taxi` | Minibus Yellow | Common | Yellow body wrap + green racing stripes | Taxi streak `#FFB81C` |
| 4 | `braai_apron` | Braai Apron | Common | Apron bib + tongs pin on hadida torso | Smoke wisps `#A0A0A0` |
| 5 | `takkie_run` | Takkie Runner | Common | Cyan-white sneaker-glow on wing tips / feet | Speed dust `#FFFFFF` |
| 6 | `bok_jersey` | Springbok Green | **Rare** | Jersey wrap `#007A4D` / gold trim · soft generic chevron | Green spark `#3DDB6A` |
| 7 | `vuvuzela` | Vuvuzela Fan | Rare | Orange horn accent + fan scarf wrap | Orange horn spark `#F26A3D` |
| 8 | `shweshwe` | Shweshwe Shirt | Rare | Geometric blue print materials `#1E4D8C` — **pattern-inspired, not brand logo** | Blue geometric glitter `#6A9AE8` |
| 9 | `cape_spice` | Cape Spice | Rare | Warm Malay-spice oranges/reds · spice-dust speckles | Spice ember `#FF8A3D` |
| 10 | `protea_royal` | Protea Royal | **Epic** | Pink protea crown accents `#E85A8C` · petal wing tips | Pink petal trail `#E85A8C` |
| 11 | `rhino_guard` | Rhino Guard | Epic | Soft grey armor plates — **cute not violent** · tiny horn nub | Stone dust `#C0C8CC` |
| 12 | `bok_legend` | Bok Legend | **Legendary** | Gold emblem armor `#FFB81C` + green underglow · premium rim | Gold bok trail `#FFB81C` |

**Migrate:** `starter_tee` → `starter_hadida`. Old Blunt skin ids → nearest Hadida id once. Equipped defaults to `starter_hadida`.

**Cosmetics only** — never change gravity, gap, or hitbox unfairly.

---

## Art QA checklist (Pages / Feel re-gate)

- [ ] Reads **premium cartoon 3D** (multi-stop + rim + AO + iridescence) — not flat kraft, not silhouette-only
- [ ] Hero = **hadeda ibis** bill→right — **IS a bird** · **NOT** blunt / kraft cylinder / 420 wrap
- [ ] Iridescent dark body (greens/purples/bronze) + white cheek readable at mobile portrait
- [ ] Idle bob + flap F0–F7; squash **70–90ms sx0.88/sy1.12**
- [ ] Front/back wing parallax visible on flap
- [ ] Hitbox debug starts **34×24** class · Feel rematch to silhouette · physics **1450/−440** · trails ≤35% · bloom ≤15%
- [ ] Obstacles = braai / taxi / pylon / protea — **not** grinders-as-420, **not** blunt towers, **not** green pipes
- [ ] World = Township Sunset / veld / soft Table Mountain
- [ ] Coin = gold disc with **R** — **not** leaf/nug/blunt tip
- [ ] All **12** costume ids present; starter `starter_hadida` free; rarities C5/R4/E2/L1
- [ ] Migrate path `starter_tee` → `starter_hadida` documented for Code
- [ ] UI: gold PLAY · ghost CHESTS/CHALLENGES · tagline **“One flap. Haa-haa energy.”**
- [ ] Chrome says **Flappy Hadida** — zero Blunt / 420 / Night Heist first paint
- [ ] **Zero** IAP / ads / pay-to-flap / Gummies / Dab Rocket chrome
- [ ] **WebGL = NO** (default)

---

## Kills (hard fail this ship)

| Kill | Why |
|------|-----|
| Blunt / kraft cylinder / 420 wrap as hero | Product is Hadida bird |
| Night Heist brand / purple noir first paint | Brand retired |
| Grinder towers as 420 | SA motif stacks replace |
| Leaf / nug / blunt-tip soft-currency glyph | Coin = gold disc + R |
| Flat silhouette / paper cutout hero | Must read cartoon 3D volumetric |
| Green Flappy Bird pipes | Banned obstacle family |
| IAP / ads / real-money chests / pay-to-flap | Design lock |
| Magic Gummies / Dab Rocket mid-run pay PUs | Design lock |
| Official Springbok / brand logos as assets | Generic chevron / pattern-inspired only |
| WebGL on by default | Canvas volumetric unless Feel proves need |

---

## Sheet index

| File | Contents |
|------|----------|
| `art/hadida/hadida-hero-turnaround.png` | Front / ¾ / side / rear + proportion + 34×24 hitbox class |
| `art/hadida/hadida-flap-sheet.png` | Idle + flap F0–F7 labeled + squash note |
| `art/hadida/hadida-world-obstacles.png` | Township sunset mood + braai/taxi/pylon/protea |
| `art/hadida/hadida-costume-roster.png` | All 12 costumes labeled id + rarity C/R/E/L |
| `art/hadida/hadida-coin-icon.png` | Soft-currency gold disc + R |

**Archived this ship (do not first-paint):** `art/sa-cartoon/` Blunt-mascot SA sheets · `art/total-upgrade/` 3D blunt · Night Heist / V2 / Visual Class kraft kits under `art/`.

**Art does not edit playable JS. Do not push GitHub from Art. Code copies into flappy-hadida.**
