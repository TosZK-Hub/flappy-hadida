/* Coins, challenges, ranks, and chest rolls. Costumes are not sold directly. */
(function (root, factory) {
  const Feel = typeof module !== "undefined" && module.exports ? require("./feel.js") : root.FBFeel;
  const api = factory(Feel);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.FBMeta = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Feel) {
  "use strict";
  const KEY = "flappyhadida.meta";
  const STARTER = "starter_hadida";
  const LEGACY = {
    starter_tee: "starter_hadida",
    default: "starter_hadida",
    township_tee: "starter_hadida",
    gold_chain: "bok_legend",
    og_heist: "bok_jersey",
    kraft: "starter_hadida",
    blunt: "starter_hadida",
    wrap: "starter_hadida",
  };
  const DAY = 24 * 60 * 60 * 1000;
  const WEEK = 7 * DAY;
  const FULL_KIT = 150;
  const STREAK_BONUS = 10;
  const DUPE_RATE = 0.4;

  const ROSTER = Feel.COSTUMES;
  const CHESTS = Feel.CHESTS;
  const RANK = Feel.RARITY_RANK;
  const RANKS = Feel.RANKS;

  const DAILY_POOL = [
    { id: "clear_8", name: "Clear 8 obstacles", goal: 8, reward: 30, stat: "pipes" },
    { id: "score_20", name: "Score 20 one run", goal: 20, reward: 60, stat: "bestRun" },
    { id: "skim_3", name: "3 near-misses one run", goal: 3, reward: 40, stat: "bestSkim" },
    { id: "coins_50", name: "Bank 50 coins today", goal: 50, reward: 35, stat: "coinsToday" },
    { id: "die_5", name: "Finish 5 runs", goal: 5, reward: 20, stat: "deaths" },
    { id: "equip_any", name: "Equip a costume", goal: 1, reward: 25, stat: "equipped" },
  ];

  const WEEKLY = {
    id: "week40",
    name: "Best score 40",
    goal: 40,
    reward: 200,
    period: "week",
    stat: "weekBest",
  };

  function chestById(id) {
    for (let i = 0; i < CHESTS.length; i++) if (CHESTS[i].id === id) return CHESTS[i];
    return null;
  }

  function dailyById(id) {
    for (let i = 0; i < DAILY_POOL.length; i++) if (DAILY_POOL[i].id === id) return DAILY_POOL[i];
    return null;
  }

  function known(id) {
    for (let i = 0; i < ROSTER.length; i++) if (ROSTER[i].id === id) return ROSTER[i];
    return null;
  }

  function localDay(t) {
    const d = new Date(t);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }

  /* Monday 00:00 local, stored as a stable day key. */
  function weekKey(t) {
    const d = new Date(t);
    const mondayOffset = (d.getDay() + 6) % 7;
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - mondayOffset);
    return Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate());
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function rng() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pickDaily(dayKey) {
    const pool = DAILY_POOL.map(function (m) { return m.id; });
    const rng = mulberry32(dayKey || 1);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    return pool.slice(0, 3);
  }

  function blank(now) {
    const day = localDay(now);
    return {
      coins: 0,
      coinsMigrated: true,
      owned: [STARTER],
      pity: { street: 0, township: 0, bok: 0 },
      ranks: {},
      dailyAt: now,
      weekAt: now,
      dayKey: day,
      weekKey: weekKey(now),
      dailyIds: pickDaily(day),
      pipes: 0,
      bestRun: 0,
      bestSkim: 0,
      coinsToday: 0,
      equipped: 0,
      deaths: 0,
      weekBest: 0,
      lifetimePipes: 0,
      pipe5: false,
      fullKit: false,
      claimed: {},
      lastRunDay: 0,
      streak: 0,
      pendingStreak: 0,
      cleanDay: 0,
      bokBumpDay: 0,
      freeChestAt: 0,
    };
  }

  function pickRarity(weights, rng) {
    const order = ["C", "R", "E", "L"];
    let t = rng();
    let acc = 0;
    for (let i = 0; i < order.length; i++) {
      acc += weights[order[i]] || 0;
      if (t < acc) return order[i];
    }
    return "L";
  }

  function poolFor(rarity) {
    const pool = [];
    for (let i = 0; i < ROSTER.length; i++) if (ROSTER[i].rarity === rarity) pool.push(ROSTER[i]);
    return pool;
  }

  function create(storage, nowFn) {
    const now = nowFn || function () { return Date.now(); };
    let state = blank(now());

    function save() {
      try {
        storage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        /* private mode */
      }
    }

    function owns(id) {
      return state.owned.indexOf(id) >= 0;
    }

    function ownsAll() {
      if (ROSTER.length < 12) return false;
      for (let i = 0; i < ROSTER.length; i++) if (!owns(ROSTER[i].id)) return false;
      return true;
    }

    function commonsAllOwned() {
      for (let i = 0; i < ROSTER.length; i++) {
        if (ROSTER[i].rarity === "C" && !owns(ROSTER[i].id)) return false;
      }
      return true;
    }

    function credit(n) {
      const add = Math.max(0, Math.floor(n || 0));
      if (!add) return 0;
      state.coins += add;
      state.coinsToday = (state.coinsToday || 0) + add;
      return add;
    }

    function grantFullKit() {
      if (state.fullKit || !ownsAll()) return 0;
      state.fullKit = true;
      credit(FULL_KIT);
      return FULL_KIT;
    }

    function clearDailyClaims() {
      for (let i = 0; i < DAILY_POOL.length; i++) state.claimed[DAILY_POOL[i].id] = false;
      state.claimed.pipes = false;
      state.claimed.run15 = false;
      state.claimed.deaths = false;
    }

    function refresh() {
      const t = now();
      const day = localDay(t);
      const week = weekKey(t);
      let changed = false;
      if (state.dayKey !== day) {
        state.pipes = 0;
        state.bestRun = 0;
        state.bestSkim = 0;
        state.coinsToday = 0;
        state.equipped = 0;
        state.deaths = 0;
        state.dailyIds = pickDaily(day);
        clearDailyClaims();
        state.dayKey = day;
        state.dailyAt = t;
        changed = true;
      } else if (!state.dailyIds || state.dailyIds.length !== 3) {
        state.dailyIds = pickDaily(day);
        changed = true;
      }
      if (state.weekKey !== week) {
        state.weekBest = 0;
        state.claimed.week40 = false;
        state.claimed.week30 = false;
        state.weekKey = week;
        state.weekAt = t;
        changed = true;
      }
      if (changed) save();
    }

    function bumpScore(score) {
      const n = score > 0 ? score : 0;
      if (n > state.bestRun) state.bestRun = n;
      if (n > state.weekBest) state.weekBest = n;
    }

    function mapId(id) {
      if (known(id)) return id;
      const next = LEGACY[id];
      return next && known(next) ? next : null;
    }

    function applyOwned(list) {
      state.owned = [STARTER];
      if (!Array.isArray(list)) return;
      for (let i = 0; i < list.length; i++) {
        const id = mapId(list[i]);
        if (id && id !== STARTER && state.owned.indexOf(id) < 0) state.owned.push(id);
      }
    }

    function load() {
      try {
        const raw = storage.getItem(KEY);
        if (!raw) {
          state = blank(now());
          save();
          return;
        }
        const parsed = JSON.parse(raw);
        state = blank(now());
        if (!parsed || typeof parsed !== "object") {
          save();
          return;
        }
        if (parsed.coinsMigrated) {
          if (Number.isFinite(parsed.coins) && parsed.coins > 0) state.coins = Math.floor(parsed.coins);
          state.coinsMigrated = true;
        } else {
          const nugs = Number.isFinite(parsed.nugs) && parsed.nugs > 0 ? Math.floor(parsed.nugs) : 0;
          state.coins = nugs;
          state.coinsMigrated = true;
        }
        applyOwned(parsed.owned);
        [
          "dailyAt", "weekAt", "pipes", "bestRun", "deaths", "weekBest", "lifetimePipes",
          "lastRunDay", "streak", "bestSkim", "coinsToday", "equipped", "cleanDay",
          "bokBumpDay", "freeChestAt", "dayKey", "weekKey",
        ].forEach(function (k) {
          if (Number.isFinite(parsed[k]) && parsed[k] >= 0) state[k] = parsed[k];
        });
        if (!Number.isFinite(parsed.dayKey)) {
          state.dayKey = Number.isFinite(parsed.dailyAt) ? localDay(parsed.dailyAt) : localDay(now());
        }
        if (!Number.isFinite(parsed.weekKey)) {
          state.weekKey = Number.isFinite(parsed.weekAt) ? weekKey(parsed.weekAt) : weekKey(now());
        }
        if (Array.isArray(parsed.dailyIds)) {
          const ids = [];
          for (let i = 0; i < parsed.dailyIds.length; i++) {
            if (dailyById(parsed.dailyIds[i]) && ids.indexOf(parsed.dailyIds[i]) < 0) ids.push(parsed.dailyIds[i]);
          }
          if (ids.length === 3) state.dailyIds = ids;
        }
        if (parsed.pipe5) state.pipe5 = true;
        if (parsed.fullKit) state.fullKit = true;
        if (parsed.claimed && typeof parsed.claimed === "object") state.claimed = parsed.claimed;
        if (parsed.ranks && typeof parsed.ranks === "object") {
          state.ranks = {};
          for (let i = 0; i < RANKS.length; i++) {
            if (parsed.ranks[RANKS[i].id]) state.ranks[RANKS[i].id] = true;
          }
        }
        if (parsed.pity && typeof parsed.pity === "object") {
          ["street", "township", "bok"].forEach(function (id) {
            if (Number.isFinite(parsed.pity[id]) && parsed.pity[id] > 0) state.pity[id] = Math.floor(parsed.pity[id]);
          });
        }
        if (Number.isFinite(parsed.pendingStreak) && parsed.pendingStreak > 0) {
          state.pendingStreak = Math.floor(parsed.pendingStreak);
        }
      } catch (e) {
        state = blank(now());
      }
      refresh();
      save();
    }

    function viewMission(m, period) {
      const progress = Math.min(m.goal, state[m.stat] || 0);
      const claimed = !!state.claimed[m.id];
      return {
        id: m.id,
        name: m.name,
        goal: m.goal,
        reward: m.reward,
        period: period || m.period || "day",
        progress: progress,
        claimed: claimed,
        ready: progress >= m.goal && !claimed,
      };
    }

    function missions() {
      refresh();
      const daily = [];
      const ids = state.dailyIds || [];
      for (let i = 0; i < ids.length; i++) {
        const def = dailyById(ids[i]);
        if (def) daily.push(viewMission(def, "day"));
      }
      daily.push(viewMission(WEEKLY, "week"));
      return daily;
    }

    function pityText(id) {
      const chest = chestById(id);
      if (!chest) return "";
      const misses = state.pity[id] || 0;
      const left = Math.max(0, chest.pityAfter - misses);
      const word = chest.pityRarity === "R" ? "Rare+" : "Epic+";
      if (left <= 0) return word + " next";
      return word + " in " + left;
    }

    function freeReady() {
      refresh();
      if (!state.freeChestAt) return true;
      return now() - state.freeChestAt >= DAY;
    }

    function rollCostume(rarity, random) {
      const pool = poolFor(rarity);
      const use = pool.length ? pool : poolFor("C");
      return use[Math.floor(random() * use.length) % use.length];
    }

    function finishPull(costume, chest, dupeCost) {
      const dupe = owns(costume.id);
      let refund = 0;
      if (dupe) {
        refund = Math.round((dupeCost || 0) * DUPE_RATE);
        credit(refund);
      } else {
        state.owned.push(costume.id);
      }
      const full = grantFullKit();
      return {
        id: costume.id,
        name: costume.name,
        rarity: costume.rarity,
        dupe: dupe,
        refund: refund,
        full: full,
        chest: chest ? chest.id : "street",
      };
    }

    load();

    return {
      CHESTS: CHESTS,
      ROSTER: ROSTER,
      DAY: DAY,
      WEEK: WEEK,
      FULL_KIT: FULL_KIT,
      DAILY_POOL: DAILY_POOL,
      WEEKLY: WEEKLY,
      pickDaily: pickDaily,
      coins: function () { refresh(); return state.coins; },
      streak: function () { return state.streak || 0; },
      pity: function (id) { refresh(); return state.pity[id] || 0; },
      pityText: function (id) { refresh(); return pityText(id); },
      owns: function (id) { refresh(); return owns(id); },
      ownedCount: function () { refresh(); return state.owned.length; },
      commonsAllOwned: function () { refresh(); return commonsAllOwned(); },
      freeReady: freeReady,
      freeLabel: function () {
        if (freeReady()) return commonsAllOwned() ? "FREE +50" : "DAILY FREE";
        const ms = Math.max(0, DAY - (now() - state.freeChestAt));
        const h = Math.ceil(ms / 3600000);
        if (h > 1) return "FREE IN " + h + "H";
        const m = Math.max(1, Math.ceil(ms / 60000));
        return "FREE IN " + m + "M";
      },
      stat: function (name) { refresh(); return state[name] || 0; },
      addCoins: function (n) {
        refresh();
        credit(n);
        save();
        return state.coins;
      },
      notePipe: function () {
        refresh();
        state.pipes += 1;
        state.lifetimePipes += 1;
        if (!state.pipe5 && state.lifetimePipes >= 5) state.pipe5 = true;
        save();
        return 0;
      },
      noteScore: function (score) {
        refresh();
        bumpScore(score);
        save();
      },
      noteSkim: function (n) {
        refresh();
        const skim = n > 0 ? Math.floor(n) : 0;
        if (skim > (state.bestSkim || 0)) state.bestSkim = skim;
        save();
      },
      noteDeath: function (score) {
        refresh();
        state.deaths += 1;
        bumpScore(score);
        save();
      },
      noteEquip: function (id) {
        refresh();
        if (!id || id === STARTER || !owns(id)) return 0;
        if (state.equipped) return 0;
        state.equipped = 1;
        save();
        return 1;
      },
      noteCleanFlight: function (score) {
        refresh();
        const need = Feel.CONFIG.CLEAN_FLIGHT_SCORE;
        if ((score || 0) < need) return 0;
        const today = localDay(now());
        if (state.cleanDay === today) return 0;
        state.cleanDay = today;
        const gift = Feel.CONFIG.CLEAN_FLIGHT_COINS;
        credit(gift);
        save();
        return gift;
      },
      claimRanks: function (best) {
        refresh();
        const n = best > 0 ? best : 0;
        const granted = [];
        if (!state.ranks || typeof state.ranks !== "object") state.ranks = {};
        for (let i = 0; i < RANKS.length; i++) {
          const rank = RANKS[i];
          if (n < rank.best || state.ranks[rank.id]) continue;
          state.ranks[rank.id] = true;
          credit(rank.gift);
          granted.push({ id: rank.id, title: rank.title, gift: rank.gift, best: rank.best });
        }
        if (granted.length) save();
        return granted;
      },
      noteRun: function () {
        refresh();
        const today = localDay(now());
        if (state.lastRunDay === today) return 0;
        const prev = state.lastRunDay || 0;
        state.lastRunDay = today;
        if (prev && today - prev === DAY) state.streak = Math.min(7, (state.streak || 0) + 1);
        else state.streak = 1;
        credit(STREAK_BONUS);
        state.pendingStreak = state.streak;
        save();
        return STREAK_BONUS;
      },
      takeStreakToast: function () {
        const n = state.pendingStreak || 0;
        if (!n) return "";
        state.pendingStreak = 0;
        save();
        return "Streak " + n + " · +10 coins";
      },
      missions: missions,
      claim: function (id) {
        const list = missions();
        let found = null;
        for (let i = 0; i < list.length; i++) if (list[i].id === id) found = list[i];
        if (!found || !found.ready) return 0;
        state.claimed[id] = true;
        credit(found.reward);
        save();
        return found.reward;
      },
      open: function (id, rng) {
        refresh();
        const chest = chestById(id);
        if (!chest) return { error: "missing" };
        if (state.coins < chest.cost) return { error: "broke" };
        const random = rng || Math.random;
        const misses = state.pity[chest.id] || 0;
        let rarity = pickRarity(chest.weights, random);
        if (misses >= chest.pityAfter && (RANK[rarity] || 0) < (RANK[chest.pityRarity] || 0)) {
          rarity = chest.pityRarity;
        }
        let bumped = false;
        if (chest.id === "bok" && rarity === "C") {
          const today = localDay(now());
          if (state.bokBumpDay !== today) {
            rarity = "R";
            bumped = true;
            state.bokBumpDay = today;
          }
        }
        const costume = rollCostume(rarity, random);
        state.coins -= chest.cost;
        const hit = (RANK[rarity] || 0) >= (RANK[chest.pityRarity] || 0);
        state.pity[chest.id] = hit ? 0 : misses + 1;
        const pulled = finishPull(costume, chest, chest.cost);
        save();
        return {
          ok: true,
          bumped: bumped,
          coins: state.coins,
          id: pulled.id,
          name: pulled.name,
          rarity: pulled.rarity,
          dupe: pulled.dupe,
          refund: pulled.refund,
          full: pulled.full,
          chest: pulled.chest,
        };
      },
      openFree: function (rng) {
        refresh();
        if (!freeReady()) return { error: "wait" };
        state.freeChestAt = now();
        if (commonsAllOwned()) {
          const gift = Feel.CONFIG.FREE_CHEST_COINS;
          credit(gift);
          save();
          return {
            ok: true,
            free: true,
            coinsGrant: gift,
            name: "+" + gift + " coins",
            coins: state.coins,
            chest: "street",
          };
        }
        const street = chestById("street");
        const random = rng || Math.random;
        const rarity = pickRarity(street.weights, random);
        const costume = rollCostume(rarity, random);
        const pulled = finishPull(costume, street, 0);
        save();
        return {
          ok: true,
          free: true,
          coins: state.coins,
          id: pulled.id,
          name: pulled.name,
          rarity: pulled.rarity,
          dupe: pulled.dupe,
          refund: pulled.refund,
          full: pulled.full,
          chest: "street",
        };
      },
      takeFullKit: function () {
        refresh();
        const n = grantFullKit();
        if (n) save();
        return n;
      },
    };
  }

  const browserStore = {
    getItem: function (k) {
      try { return localStorage.getItem(k); } catch (e) { return null; }
    },
    setItem: function (k, v) {
      try { localStorage.setItem(k, v); } catch (e) { /* ignore */ }
    },
  };

  const live = create(browserStore, function () { return Date.now(); });
  live.create = create;
  live.pickDaily = pickDaily;
  live.DAILY_POOL = DAILY_POOL;
  live.WEEKLY = WEEKLY;
  return live;
});
