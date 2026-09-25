# Flappy Hadida — Design rename + systems brief

Director lock (Jesse via Code/CoS): product is **Flappy Hadida**. Hero = **hadida** (hadeda ibis) cartoon flyer — **not** a blunt / kraft cylinder / 420 wrap. Night Heist / Blunt brand **retired**. Soft-currency **chests only**; **no** IAP / ads / pay-to-flap. Physics start **1450 / −440** holds until Feel evidence. Blunt motif polish **cancelled**.

Art owns look: `FLAPPY_HADIDA.md` + sheets. This file owns **copy, ranks, chest economy alignment, costume ids**. Curve/packs still from `TOTAL_UPGRADE_MECHANICS.md` (Teach/Warm/Rise/Heat/Legend — no “Heist” strings). Economy numbers from `TOTAL_UPGRADE_SA_CHESTS.md` **hold**; ids/copy below supersede Blunt/420 naming.

Repo/Pages rename waits on Jesse — ship systems on current URL until then; all **user-facing** strings say **Flappy Hadida**.

---

## Product copy (lock)

| Surface | Copy |
|---------|------|
| Title | **Flappy Hadida** |
| Tagline | **“One flap. Haa-haa energy.”** (arcade-PG; Art may tweak SA line) |
| Score label | Score (plain) |
| Best | Best |
| Soft currency | **coins** (Art: coin disc — not leaf/nug/blunt tip) |
| Home CTAs | Gold **PLAY** · ghost **CHESTS** · ghost **CHALLENGES** |
| Death | Gold **RESTART** · ghost HOME · ghost CHESTS/CHALLENGES |
| Full-set toast | **“Full flock”** + **150 coins** (was Full kit/crew) |
| Death bank chip | `+N coins` |

Ranks (best-driven, cosmetic only):

| Best ≥ | Title |
|--------|--------|
| 10 | **Rookie** |
| 25 | **Squad** |
| 50 | **Legend** |

Kill from first paint: “Flappy Blunt”, blunt/kraft hero copy, nugs, leaf bank, Night Heist, Gummies, Dab Rocket, “One flap. Chill heist energy.”

---

## Core (unchanged)

- One-button set-vy flap · player X fixed · ≥1.4s runway  
- GRAVITY **1450** · FLAP **−440** · max fall **540**  
- Hitbox: rematch to **Hadida silhouette**; Feel owns inset fairness (start from **34×24** class)  
- Pattern packs + score bands per mechanics brief  
- Near-miss skim ≤6px → +1 coin · cap +5/run  
- Daily streak +10 coins/day · cap 7  

---

## Chests (numbers hold · SA names keep)

| Chest | Cost | Role |
|-------|------|------|
| **Street chest** | 100 | Common-heavy |
| **Township chest** | 300 | Better rare+ |
| **Bok chest** | 750 | Best odds + pity |

Weights + pity + dupe refund **40%** — same as `TOTAL_UPGRADE_SA_CHESTS.md`. Cosmetics **only** from chests (+ free starter). No direct buy-skin shop.

---

## Costume roster (Hadida-aligned · 5C / 4R / 2E / 1L)

Art paints; Design locks **ids + rarity** for pulls. All are **hadida** body + costume chrome — never a blunt cylinder.

| # | id | name | rarity |
|---|----|------|--------|
| 1 | `starter_hadida` | Park Hadida | **Common · FREE starter** |
| 2 | `spaza_cap` | Spaza Cap | Common |
| 3 | `yellow_taxi` | Minibus Yellow | Common |
| 4 | `braai_apron` | Braai Apron | Common |
| 5 | `takkie_run` | Takkie Runner | Common |
| 6 | `bok_jersey` | Springbok Green | **Rare** |
| 7 | `vuvuzela` | Vuvuzela Fan | Rare |
| 8 | `shweshwe` | Shweshwe Shirt | Rare |
| 9 | `cape_spice` | Cape Spice | Rare |
| 10 | `protea_royal` | Protea Royal | **Epic** |
| 11 | `rhino_guard` | Rhino Guard | Epic |
| 12 | `bok_legend` | Bok Legend | **Legendary** |

Migrate: if save has `starter_tee` / old Blunt skin ids → map to `starter_hadida` / nearest Hadida id once. Equipped defaults to `starter_hadida`.

Obstacles (Art): keep SA motif family (braai / taxi / pylon / protea) or Hadida-world variants — **not** grinders-as-420, **not** blunt towers. Collision AABB family unchanged.

---

## IA / anti-patterns

- PLAY-rect-only · chests/collection never start a run · RESTART only gold hot on death  
- No IAP · no ads · no real-money chests · no mid-run pay power-ups  
- Costume never changes gravity/gap/unfair hitbox  

---

## Ship order

1. Art drops `FLAPPY_HADIDA.md` + sheets (hero idle/flap + world + 12 costumes + coin).  
2. Code: one Hadida branch from this brief + Art drop; cancel blunt motif polish; #5 stays parked.  
3. User-facing rename now; repo/Pages slug when Jesse unlocks.  
4. Feel re-gates Hadida Pages (arc, hitbox, 60fps, juice, IA, chests).

## Pass / fail (Design)

- [ ] All chrome says Flappy Hadida / hadida — zero Blunt/420/Night Heist first paint  
- [ ] Chests + coins only; starter_hadida free; 12 ids pull-correct  
- [ ] Ranks Rookie/Squad/Legend · Full flock toast  
- [ ] One-button + 1450/−440 unchanged without Feel evidence  
