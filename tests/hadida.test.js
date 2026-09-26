/* Locks for Flappy Hadida. Run with: node tests/hadida.test.js */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Feel = require("../js/feel.js");
const P = require("../js/physics.js");
const Meta = require("../js/meta.js");

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function gapX(a, b) {
  if (a.x + a.w <= b.x) return b.x - (a.x + a.w);
  if (b.x + b.w <= a.x) return a.x - (b.x + b.w);
  return 0;
}

function memory() {
  const data = Object.create(null);
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
    setItem: function (k, v) { data[k] = String(v); },
    raw: data,
  };
}

const C = Feel.CONFIG;
assert.strictEqual(C.GRAVITY, 1450);
assert.strictEqual(C.FLAP_IMPULSE, -440);
assert.strictEqual(C.MAX_FALL, 540);
assert.strictEqual(C.HITBOX_W, 34);
assert.strictEqual(C.HITBOX_H, 24);
assert.ok(P.runwaySeconds() >= 1.4);
assert.strictEqual(P.playerBox(100).w, 34);
assert.strictEqual(P.playerBox(100).h, 24);
assert.deepStrictEqual(Feel.PICKUPS, []);

const teach = Feel.feelAt(0);
assert.strictEqual(teach.name, "Teach");
assert.strictEqual(teach.scroll, 165);
assert.strictEqual(teach.gap, 155);
assert.strictEqual(teach.spacing, 220);
assert.deepStrictEqual(Feel.feelAt(5), teach);
const warm = Feel.feelAt(15);
assert.strictEqual(warm.name, "Warm");
assert.strictEqual(warm.scroll, 195);
assert.strictEqual(warm.gap, 148);
assert.strictEqual(warm.spacing, 220);
const rise = Feel.feelAt(30);
assert.strictEqual(rise.name, "Rise");
assert.strictEqual(rise.scroll, 225);
assert.strictEqual(rise.gap, 140);
assert.strictEqual(rise.spacing, 210);
const heat = Feel.feelAt(50);
assert.strictEqual(heat.name, "Heat");
assert.strictEqual(heat.scroll, 245);
assert.strictEqual(heat.gap, 135);
assert.strictEqual(heat.spacing, 205);
const legend = Feel.feelAt(51);
assert.strictEqual(legend.name, "Legend");
assert.strictEqual(legend.scroll, 250);
assert.strictEqual(legend.gap, 128);
assert.strictEqual(legend.spacing, 200);
for (let s = 0; s <= 80; s++) {
  const band = Feel.feelAt(s);
  assert.ok(band.gap >= 128, "gap " + s);
  assert.ok(band.scroll <= 250, "scroll " + s);
}

const peak = Feel.flapDraw(80);
assert.strictEqual(peak.frame, "F4");
assert.strictEqual(peak.sx, 0.88);
assert.strictEqual(peak.sy, 1.12);
assert.strictEqual(Feel.flapDraw(40).frame, "F3");
assert.strictEqual(Feel.flapDraw(90).frame, "F5");
assert.strictEqual(Feel.flapDraw(200).sx, 1);
assert.strictEqual(Feel.flapDraw(-1).frame, "F0");

assert.strictEqual(Feel.COSTUMES.length, 12);
const counts = { C: 0, R: 0, E: 0, L: 0 };
Feel.COSTUMES.forEach(function (c) { counts[c.rarity] += 1; });
assert.deepStrictEqual(counts, { C: 5, R: 4, E: 2, L: 1 });
assert.strictEqual(Feel.COSTUMES[0].id, "starter_hadida");
assert.strictEqual(Feel.rankTitle(4), "");
assert.strictEqual(Feel.rankTitle(5), "Chick");
assert.strictEqual(Feel.rankTitle(14), "Chick");
assert.strictEqual(Feel.rankTitle(15), "Rookie");
assert.strictEqual(Feel.rankTitle(29), "Rookie");
assert.strictEqual(Feel.rankTitle(30), "Squad");
assert.strictEqual(Feel.rankTitle(49), "Squad");
assert.strictEqual(Feel.rankTitle(50), "Legend");
assert.strictEqual(Feel.rankTitle(74), "Legend");
assert.strictEqual(Feel.rankTitle(75), "Flock Ace");
assert.strictEqual(Feel.rankTitle(99), "Flock Ace");
assert.strictEqual(Feel.rankTitle(100), "Hadida King");
assert.strictEqual(C.SKIM_PX, 6);
assert.strictEqual(C.SKIM_CAP, 8);
assert.deepStrictEqual(C.MILESTONES, [10, 25, 50, 100]);
assert.strictEqual(C.CLEAN_FLIGHT_SCORE, 15);
assert.strictEqual(C.CLEAN_FLIGHT_COINS, 25);
assert.strictEqual(C.REVEAL_LID, 0.6);
assert.ok(C.REVEAL_FLASH > 0 && C.REVEAL_FLASH <= 0.6);
assert.strictEqual(C.FEATHER_LIFE, 0.2);
assert.strictEqual(C.FREE_CHEST_COINS, 50);
assert.strictEqual(Feel.COPY.TAGLINE, "One flap. Haa-haa energy.");
assert.strictEqual(Feel.COPY.BROKE, "Earn coins on runs");
assert.strictEqual(Feel.COPY.CHALLENGE_PLUS, "Challenge +1");
assert.strictEqual(Feel.COPY.NEW_BEST, "New best");
const rankGifts = { Chick: 15, Rookie: 25, Squad: 40, Legend: 75, "Flock Ace": 100, "Hadida King": 150 };
assert.strictEqual(Feel.RANKS.length, 6);
Feel.RANKS.forEach(function (rank) {
  assert.strictEqual(rank.gift, rankGifts[rank.title]);
  assert.strictEqual(Feel.rankTitle(rank.best), rank.title);
});
assert.strictEqual(Feel.motifFor(0, 1), "braai_drum");
assert.strictEqual(Feel.motifFor(80, 1), "protea_column");

const run = P.createRun(7);
run.spawned = true;
run.gapY = 300;
run.packPairs = 4;
const riseStep = P.patternStep(run, 16);
assert.strictEqual(riseStep.pack, 1);
assert.strictEqual(riseStep.gapY, 314);
run.packPairs = 8;
run.gapY = 320;
const fall = P.patternStep(run, 16);
assert.strictEqual(fall.pack, 2);
assert.strictEqual(fall.gapY, 306);
run.packPairs = 12;
const breath = P.patternStep(run, 16);
assert.strictEqual(breath.pack, 3);
assert.strictEqual(breath.slot, 0);
assert.ok(Math.abs(breath.gapH - (Feel.gapHeight(16) + 12)) < 0.001);
assert.strictEqual(breath.bob, false);
const resume = P.patternStep(run, 16);
assert.strictEqual(resume.slot, 1);
assert.strictEqual(resume.gapH, Feel.gapHeight(16));

const bobRun = P.createRun(3);
bobRun.spawned = true;
bobRun.gapY = 300;
let bobbed = null;
for (let i = 0; i < 16; i++) {
  const shaped = P.patternStep(bobRun, 31);
  if (shaped.pack === 3) bobbed = shaped;
}
assert.ok(bobbed && bobbed.bob);

const flapped = P.createPlayer();
P.stepPlayer(flapped, 1 / 60, true, false);
assert.ok(Math.abs(flapped.vy - (C.FLAP_IMPULSE + C.GRAVITY / 60)) < 0.001);
assert.strictEqual(flapped.sx, 1);
assert.strictEqual(flapped.sy, 1);

const early = P.createRun(1);
const first = P.patternStep(early, 0);
assert.strictEqual(first.pack, -1);
assert.strictEqual(first.gapH, 155);

const box = P.playerBox(200);
const tower = { x: 0, gapY: 200, gapH: 155 };
const clearance = P.skimClearance(200, tower);
assert.ok(clearance > 6);
const lip = 200 - 155 / 2;
const skimY = lip + 12 + 4;
assert.ok(P.skimClearance(skimY, tower) <= 6);
assert.ok(P.skimClearance(skimY, tower) >= 0);

const store = memory();
store.setItem("flappyhadida.meta", JSON.stringify({
  nugs: 40,
  owned: ["default", "gold_chain", "og_heist", "starter_tee"],
  pipes: 2,
}));
let clock = Date.UTC(2026, 8, 1, 12);
const meta = Meta.create(store, function () { return clock; });
assert.strictEqual(meta.coins(), 40);
assert.strictEqual(meta.owns("starter_hadida"), true);
assert.strictEqual(meta.owns("starter_tee"), false);
assert.strictEqual(meta.owns("gold_chain"), false);
assert.strictEqual(meta.owns("bok_legend"), true);
assert.strictEqual(meta.owns("bok_jersey"), true);
assert.strictEqual(meta.owns("default"), false);
const again = Meta.create(store, function () { return clock; });
assert.strictEqual(again.coins(), 40);

clock = Date.UTC(2026, 8, 2, 9);
assert.strictEqual(meta.noteRun(), 10);
assert.strictEqual(meta.streak(), 1);
assert.strictEqual(meta.coins(), 50);
assert.strictEqual(meta.takeStreakToast(), "Streak 1 · +10 coins");
assert.strictEqual(meta.noteRun(), 0);
clock = Date.UTC(2026, 8, 3, 9);
assert.strictEqual(meta.noteRun(), 10);
assert.strictEqual(meta.streak(), 2);
clock = Date.UTC(2026, 8, 5, 9);
assert.strictEqual(meta.noteRun(), 10);
assert.strictEqual(meta.streak(), 1);

const rich = memory();
const shop = Meta.create(rich, function () { return clock; });
assert.strictEqual(typeof shop.buy, "undefined");
shop.addCoins(100);
const dupe = shop.open("street", function () { return 0; });
assert.strictEqual(dupe.dupe, true);
assert.strictEqual(dupe.id, "starter_hadida");
assert.strictEqual(dupe.refund, 40);
assert.strictEqual(shop.coins(), 40);

const pityStore = memory();
const pity = Meta.create(pityStore, function () { return clock; });
pity.addCoins(2000);
for (let i = 0; i < 10; i++) {
  const roll = pity.open("street", function () { return 0; });
  assert.strictEqual(roll.rarity, "C");
}
assert.strictEqual(pity.pity("street"), 10);
assert.strictEqual(pity.pityText("street"), "Rare+ next");
const forced = pity.open("street", function () { return 0; });
assert.ok(Feel.RARITY_RANK[forced.rarity] >= Feel.RARITY_RANK.R);
assert.strictEqual(pity.pity("street"), 0);

const town = Meta.create(memory(), function () { return clock; });
town.addCoins(300 * 6);
for (let i = 0; i < 5; i++) {
  const roll = town.open("township", function () { return 0; });
  assert.strictEqual(roll.rarity, "C");
}
const epic = town.open("township", function () { return 0; });
assert.ok(Feel.RARITY_RANK[epic.rarity] >= Feel.RARITY_RANK.E);

const kitStore = memory();
kitStore.setItem("flappyhadida.meta", JSON.stringify({
  coinsMigrated: true,
  coins: 750,
  owned: Feel.COSTUMES.map(function (c) { return c.id; }).filter(function (id) { return id !== "bok_legend"; }),
  fullKit: false,
  pity: { street: 0, township: 0, bok: 0 },
}));
const kit = Meta.create(kitStore, function () { return clock; });
const last = kit.open("bok", function () { return 0.95; });
assert.strictEqual(last.id, "bok_legend");
assert.strictEqual(last.dupe, false);
assert.strictEqual(last.full, 150);
assert.strictEqual(kit.coins(), 150);
assert.strictEqual(kit.takeFullKit(), 0);

assert.strictEqual(Feel.CHESTS[0].cost, 100);
assert.strictEqual(Feel.CHESTS[1].cost, 300);
assert.strictEqual(Feel.CHESTS[2].cost, 750);

global.FBFeel = Feel;
global.FBPhysics = P;
require("../js/render.js");
const home = global.FBDraw.homeLayout();
const death = global.FBDraw.deathLayout();
const stash = global.FBDraw.stashLayout(true);
assert.ok(home.play.h >= 56);
assert.ok(!overlaps(home.play, home.challenges));
assert.ok(!overlaps(home.play, home.chests));
assert.ok(!overlaps(home.play, home.collection));
assert.ok(gapX(home.challenges, home.chests) >= 16);
assert.ok(gapX(death.home, death.challenges) >= 16);
assert.ok(gapX(death.challenges, death.chests) >= 16);
assert.ok(death.restart.y - (stash.job.y + stash.job.h) >= 16);
assert.ok(!overlaps(death.restart, death.home));
assert.ok(!overlaps(death.restart, stash.coins));
assert.ok(!overlaps(death.restart, stash.job));
assert.strictEqual(P.createRun(1).unfair, false);

const root = path.join(__dirname, "..");
["index.html", "js/game.js", "js/meta.js", "js/render.js", "js/feel.js", "js/physics.js"].forEach(function (rel) {
  const src = fs.readFileSync(path.join(root, rel), "utf8");
  assert.ok(!/buy now/i.test(src), rel);
  assert.ok(!/gummies/i.test(src), rel);
  assert.ok(!/dab rocket/i.test(src), rel);
  assert.ok(!/pay-to-flap/i.test(src), rel);
});
const gameSrc = fs.readFileSync(path.join(root, "js/game.js"), "utf8");
assert.ok(gameSrc.indexOf("collectionHit") < gameSrc.indexOf("playHit(pt)"));
assert.ok(gameSrc.includes("run.unfair"));
assert.ok(gameSrc.includes("Challenge +1") || gameSrc.includes("CHALLENGE_PLUS"));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.ok(html.includes("One flap. Haa-haa energy."));

assert.strictEqual(Meta.WEEKLY.id, "week40");
assert.strictEqual(Meta.WEEKLY.goal, 40);
assert.strictEqual(Meta.WEEKLY.reward, 200);
assert.strictEqual(Meta.DAILY_POOL.length, 6);
const dailyIds = Meta.pickDaily(Date.UTC(2026, 8, 1));
assert.strictEqual(dailyIds.length, 3);
assert.strictEqual(new Set(dailyIds).size, 3);
assert.strictEqual(Meta.pickDaily(Date.UTC(2026, 8, 1)).join(), dailyIds.join());
dailyIds.forEach(function (id) {
  assert.ok(Meta.DAILY_POOL.some(function (m) { return m.id === id; }));
});

function makeMeta(t) {
  const box = { t: t };
  return {
    box: box,
    meta: Meta.create(memory(), function () { return box.t; }),
  };
}

const sample = makeMeta(Date.UTC(2026, 8, 1, 12));
const sampleMissions = sample.meta.missions();
assert.strictEqual(sampleMissions.length, 4);
assert.strictEqual(sampleMissions.filter(function (m) { return m.period === "day"; }).length, 3);
assert.strictEqual(sampleMissions[3].id, "week40");
assert.strictEqual(sample.meta.pityText("street"), "Rare+ in 10");
assert.strictEqual(sample.meta.pityText("township"), "Epic+ in 5");
assert.strictEqual(sample.meta.pityText("bok"), "Epic+ in 5");

const stableStore = memory();
const stableAt = Date.UTC(2026, 8, 1, 12);
const stableA = Meta.create(stableStore, function () { return stableAt; });
const stableIds = stableA.missions().map(function (m) { return m.id; }).join();
const stableB = Meta.create(stableStore, function () { return Date.UTC(2026, 8, 1, 18); });
assert.strictEqual(stableB.missions().map(function (m) { return m.id; }).join(), stableIds);

let dayClock = Date.UTC(2026, 8, 1, 23, 30);
const dayMeta = Meta.create(memory(), function () { return dayClock; });
for (let i = 0; i < 4; i++) dayMeta.noteDeath(1);
dayMeta.addCoins(80);
const dayIds = dayMeta.missions().map(function (m) { return m.id; }).join();
dayClock = Date.UTC(2026, 8, 1, 23, 50);
assert.strictEqual(dayMeta.missions().map(function (m) { return m.id; }).join(), dayIds);
assert.strictEqual(dayMeta.stat("deaths"), 4);
assert.strictEqual(dayMeta.stat("coinsToday"), 80);
dayClock = Date.UTC(2026, 8, 2, 0, 5);
assert.strictEqual(dayMeta.stat("deaths"), 0);
assert.strictEqual(dayMeta.stat("coinsToday"), 0);
dayMeta.missions().forEach(function (row) {
  if (row.period === "day") assert.strictEqual(row.progress, 0, row.id);
});

let weekClock = Date.UTC(2026, 8, 6, 22);
const weekMeta = Meta.create(memory(), function () { return weekClock; });
weekMeta.noteScore(40);
assert.strictEqual(weekMeta.missions().filter(function (m) { return m.id === "week40"; })[0].ready, true);
assert.strictEqual(weekMeta.claim("week40"), 200);
assert.strictEqual(weekMeta.claim("week40"), 0);
weekClock = Date.UTC(2026, 8, 7, 0, 10);
const resetWeek = weekMeta.missions().filter(function (m) { return m.id === "week40"; })[0];
assert.strictEqual(resetWeek.progress, 0);
assert.strictEqual(resetWeek.ready, false);

function findDaily(id) {
  for (let day = 1; day <= 48; day++) {
    const found = makeMeta(Date.UTC(2026, 0, day, 12));
    const row = found.meta.missions().filter(function (m) { return m.id === id; })[0];
    if (row) return found;
  }
  throw new Error("missing " + id);
}

const clearBox = findDaily("clear_8");
for (let i = 0; i < 7; i++) assert.strictEqual(clearBox.meta.notePipe(), 0);
assert.strictEqual(clearBox.meta.missions().filter(function (m) { return m.id === "clear_8"; })[0].ready, false);
clearBox.meta.notePipe();
assert.strictEqual(clearBox.meta.claim("clear_8"), 30);
assert.strictEqual(clearBox.meta.claim("clear_8"), 0);
assert.strictEqual(clearBox.meta.coins(), 30);

const scoreBox = findDaily("score_20");
scoreBox.meta.noteScore(19);
assert.strictEqual(scoreBox.meta.missions().filter(function (m) { return m.id === "score_20"; })[0].ready, false);
scoreBox.meta.noteScore(20);
assert.strictEqual(scoreBox.meta.claim("score_20"), 60);

const skimBox = findDaily("skim_3");
skimBox.meta.noteSkim(2);
assert.strictEqual(skimBox.meta.missions().filter(function (m) { return m.id === "skim_3"; })[0].ready, false);
skimBox.meta.noteSkim(3);
assert.strictEqual(skimBox.meta.claim("skim_3"), 40);

const coinBox = findDaily("coins_50");
coinBox.meta.addCoins(49);
assert.strictEqual(coinBox.meta.missions().filter(function (m) { return m.id === "coins_50"; })[0].ready, false);
coinBox.meta.addCoins(1);
assert.strictEqual(coinBox.meta.claim("coins_50"), 35);

const dieBox = findDaily("die_5");
for (let i = 0; i < 4; i++) dieBox.meta.noteDeath(1);
assert.strictEqual(dieBox.meta.missions().filter(function (m) { return m.id === "die_5"; })[0].ready, false);
dieBox.meta.noteDeath(1);
assert.strictEqual(dieBox.meta.claim("die_5"), 20);

const equipStore = memory();
equipStore.setItem("flappyhadida.meta", JSON.stringify({
  coinsMigrated: true,
  coins: 0,
  owned: ["starter_hadida", "bok_jersey"],
  pity: { street: 0, township: 0, bok: 0 },
}));
const equip = Meta.create(equipStore, function () { return Date.UTC(2026, 0, 15, 12); });
assert.strictEqual(equip.noteEquip("starter_hadida"), 0);
assert.strictEqual(equip.stat("equipped"), 0);
assert.strictEqual(equip.noteEquip("bok_jersey"), 1);
assert.strictEqual(equip.noteEquip("spaza_cap"), 0);
if (equip.missions().some(function (m) { return m.id === "equip_any"; })) {
  assert.strictEqual(equip.claim("equip_any"), 25);
}

const ladder = makeMeta(Date.UTC(2026, 8, 8, 12)).meta;
assert.strictEqual(ladder.claimRanks(4).length, 0);
const chick = ladder.claimRanks(5);
assert.strictEqual(chick.length, 1);
assert.strictEqual(chick[0].title, "Chick");
assert.strictEqual(chick[0].gift, 15);
assert.strictEqual(ladder.coins(), 15);
assert.strictEqual(ladder.claimRanks(14).length, 0);
const rest = ladder.claimRanks(100);
assert.strictEqual(rest.length, 5);
assert.strictEqual(ladder.coins(), 405);
assert.strictEqual(ladder.claimRanks(200).length, 0);

let cleanClock = Date.UTC(2026, 8, 9, 8);
const clean = Meta.create(memory(), function () { return cleanClock; });
assert.strictEqual(clean.noteCleanFlight(14), 0);
assert.strictEqual(clean.noteCleanFlight(15), 25);
assert.strictEqual(clean.noteCleanFlight(80), 0);
cleanClock = Date.UTC(2026, 8, 10, 1);
assert.strictEqual(clean.noteCleanFlight(15), 25);
assert.strictEqual(clean.coins(), 50);

let bokClock = Date.UTC(2026, 8, 4, 12);
const bok = Meta.create(memory(), function () { return bokClock; });
bok.addCoins(3000);
const bokSeq = [0.2, 0, 0, 0];
let bokStep = 0;
const rareFirst = bok.open("bok", function () { return bokSeq[bokStep++]; });
assert.strictEqual(rareFirst.bumped, false);
assert.strictEqual(rareFirst.rarity, "R");
const bumped = bok.open("bok", function () { return bokSeq[bokStep++]; });
assert.strictEqual(bumped.bumped, true);
assert.strictEqual(bumped.rarity, "R");
const stayed = bok.open("bok", function () { return 0; });
assert.strictEqual(stayed.bumped, false);
assert.strictEqual(stayed.rarity, "C");
bokClock = Date.UTC(2026, 8, 5, 12);
const bumpedAgain = bok.open("bok", function () { return 0; });
assert.strictEqual(bumpedAgain.bumped, true);
assert.strictEqual(bumpedAgain.rarity, "R");
assert.ok(bok.pity("bok") < 5);

let freeClock = Date.UTC(2026, 8, 1, 23);
const freeMeta = Meta.create(memory(), function () { return freeClock; });
const opened = freeMeta.openFree(function () { return 0; });
assert.strictEqual(opened.free, true);
assert.strictEqual(opened.dupe, true);
assert.strictEqual(opened.rarity, "C");
assert.strictEqual(opened.refund, 0);
assert.strictEqual(freeMeta.pity("street"), 0);
assert.strictEqual(freeMeta.coins(), 0);
assert.strictEqual(freeMeta.freeReady(), false);
assert.strictEqual(freeMeta.openFree().error, "wait");
freeClock = Date.UTC(2026, 8, 2, 1);
assert.strictEqual(freeMeta.freeReady(), false);
freeClock = Date.UTC(2026, 8, 2, 23);
assert.strictEqual(freeMeta.freeReady(), true);

const commons = Feel.COSTUMES.filter(function (c) { return c.rarity === "C"; }).map(function (c) { return c.id; });
const freeStore = memory();
freeStore.setItem("flappyhadida.meta", JSON.stringify({
  coinsMigrated: true,
  coins: 0,
  owned: commons,
  pity: { street: 0, township: 0, bok: 0 },
}));
const freeCoins = Meta.create(freeStore, function () { return Date.UTC(2026, 8, 3, 12); });
assert.strictEqual(freeCoins.freeLabel(), "FREE +50");
const payout = freeCoins.openFree(function () { return 0; });
assert.strictEqual(payout.coinsGrant, 50);
assert.strictEqual(payout.id, undefined);
assert.strictEqual(freeCoins.coins(), 50);
assert.strictEqual(freeCoins.ownedCount(), 5);
assert.strictEqual(freeCoins.freeReady(), false);
assert.ok(/^FREE IN /.test(freeCoins.freeLabel()));

console.log("hadida evolution tests passed");
