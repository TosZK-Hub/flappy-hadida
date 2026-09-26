# Flappy Hadida

A one-button township flyer. The hero is a cartoon hadeda ibis, bill to the right. The gates are braai drums, minibus slices, pylon discs, and protea columns. One flap. Haa-haa energy.

Canvas volumetric cartoon. No WebGL. Soft-currency chests only.

## Play

[https://toszk-hub.github.io/flappy-hadida/](https://toszk-hub.github.io/flappy-hadida/)

The playable is on `main` and is meant to be served from `/` (root). Publishing needs a repository admin to open Settings → Pages and choose Deploy from a branch, `main`, `/ (root)`. Creating that site from this token returned 403: GitHub requires `pages=write` and `administration=write`.

```bash
git clone https://github.com/TosZK-Hub/flappy-hadida.git
cd flappy-hadida
npx serve
```

Open the URL `npx serve` prints. Serve the folder that contains `index.html`.

## Controls

**PLAY** is the gold button. Only that rectangle starts a run, along with Space or Arrow Up. The hero, the collection strip, and the sky do not.

In the air, tap or press Space to flap. A held key does nothing extra.

After a crash:

- **HOME** returns to the menu and does not restart.
- **CHALLENGES** and **CHESTS** open those panels and do not start a run.
- **RESTART** is the only gold button. A tap away from it does not start the next run.

- **M** mutes the beeps. The speaker chip does too.
- **1–9** equip a costume you already own. **Q** / **[** and **E** / **]** / **C** cycle owned costumes.
- **H** draws the 34×24 hitbox.
- **Escape** closes chests, collection, or challenges.

## Coins and chests

Coins are the only soft currency. They stay in this browser. An old nug balance migrates to coins once, one for one. A save that still says `starter_tee` (or an older blunt skin id) maps onto the Hadida roster once.

A run banks **+1 coin per stack cleared**, plus a near-miss skim of **+1** when the hitbox edge passes within 6px of a lip, capped at **+8** per run. The first run of a calendar day adds **+10** coins. The streak count caps at **7** and resets after a missed day.

Score **10 / 25 / 50 / 100** each show one short toast. They never block a flap. Dying at **15+** with a fair run toasts **Clean flight** and banks **+25** coins, once per local day. A new best plays a gold feather burst and whispers **New best**. The death card still shows cream **+N coins** for the run bank.

Best-score titles are cosmetic. They never gate PLAY or chests. Each title pays its coin gift once, the first time that best is reached:

| Best | Title | Gift |
|------|--------|------|
| 5 | Chick | 15 |
| 15 | Rookie | 25 |
| 30 | Squad | 40 |
| 50 | Legend | 75 |
| 75 | Flock Ace | 100 |
| 100 | Hadida King | 150 |

| Chest | Cost | Pull |
|-------|------|------|
| Street | 100 | Common 70% · Rare 24% · Epic 5.5% · Legendary 0.5% |
| Township | 300 | Common 40% · Rare 40% · Epic 17% · Legendary 3% |
| Bok | 750 | Common 15% · Rare 40% · Epic 35% · Legendary 10% |

Costumes come from chests. Park Hadida (`starter_hadida`) is free. A duplicate refunds **40%** of that chest. After 10 Street opens with no Rare or better, the next Street pull is at least Rare. After 5 Township or Bok opens with no Epic or better, the next pull is at least Epic. The chest panel whispers that meter (`Rare+ in N`, or `Epic+ in N` on Township and Bok). Owning all 12 costumes grants **Full flock** and **+150** coins once.

The first Bok pull of a local day that would have been Common is bumped to Rare, once. A **daily free** chest is ready every 24 hours and uses Street weights. If every Common costume is already owned, that free open pays **+50** coins instead. Opening without enough coins says **Earn coins on runs**.

Challenges refresh at **00:00** local. Three dailies are drawn from Clear 8, Score 20, Skim 3, Bank 50, Finish 5 runs, and Equip a costume. The weekly asks for a best of **40** and pays **200** coins. Claim is gold only when the goal is met. A death that moved a challenge shows **Challenge +1** and does not block RESTART.

There is no skin shop, no IAP, no ads, and no mid-run pay power-up.

## Feel lock

Numbers live in `js/feel.js`. A flap **sets** upward speed to **−440**. Gravity is **1450**. Fall caps at **540**. The hitbox is **34×24** and does not change with costume or squash.

Scroll, gap, and spacing follow Teach, Warm, Rise, Heat, and Legend in `art/hadida/TOTAL_UPGRADE_MECHANICS.md`. Gap never goes under **128**. Scroll caps at **250**. The first gate can touch you **1.4s** after the run starts.

From score **16**, pairs cycle Straight, Rise, Fall, and Breath. From score **31**, one pack in four bobs **±8px** at **0.55 Hz**, with an amber lip mark before it enters. Flap squash is draw-only: **sx 0.88 / sy 1.12** for **70–90ms**.

Best score titles: **Chick** at 5, **Rookie** at 15, **Squad** at 30, **Legend** at 50, **Flock Ace** at 75, **Hadida King** at 100. The title sits under best on the home card.

## Layout

- `index.html` — page shell
- `js/feel.js` — palette, costumes, bands, flap squash
- `js/physics.js` — simulation
- `js/meta.js` — coins, chests, challenges
- `js/render.js` — canvas hadeda, obstacles, UI
- `js/game.js` — home, flight, results
- `art/hadida/` — art lock and the design briefs
