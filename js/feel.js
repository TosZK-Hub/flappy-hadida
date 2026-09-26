/* Design lock. Every tunable number for feel lives here and nowhere else. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.FBFeel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CONFIG = {
    /* 60fps physics. A press SETS vy to FLAP_IMPULSE; it does not add. */
    GRAVITY: 1450,
    FLAP_IMPULSE: -440,
    MAX_FALL: 540,
    /* Axis-aligned box. Draw squash never changes this. */
    HITBOX_W: 34,
    HITBOX_H: 24,

    /* Drawn hadeda. Larger than the inset hitbox. Bill points right. */
    BODY_L: 80,
    BODY_D: 42,
    TIP_RATIO: 0.55,

    /* Juice. Positive degrees point the tip up. */
    FLAP_TIP_DEG: 12,
    FALL_TIP_DEG: -8,
    HIT_FLASH: 0.08,
    SPARK_MIN: 3,
    SPARK_MAX: 5,
    /* Draw-only flap squash. Peak is sx 0.88 / sy 1.12 for 70–90ms. */
    FLAP_SQUASH_MS: 20,
    SKIM_PX: 6,
    /* Near-miss coins. Cap is +8 per run (evolution). Detection stays ≤6px. */
    SKIM_CAP: 8,
    /* Score loop. Gravity / flap / max fall above stay 1450 / −440 / 540. */
    CLEAN_FLIGHT_SCORE: 15,
    CLEAN_FLIGHT_COINS: 25,
    MILESTONES: [10, 25, 50, 100],
    REVEAL_LID: 0.6,
    REVEAL_FLASH: 0.4,
    FEATHER_LIFE: 0.2,
    FREE_CHEST_COINS: 50,

    /* Teach band holds these. Later bands live in feelAt(). */
    SCROLL_START: 165,
    SCROLL_CAP: 250,
    GAP_START: 155,
    GAP_FLOOR: 128,
    PIPE_SPACING: 220,
    FIRST_PIPE_DELAY: 1.4,

    /* Death: freeze the scroll, play the beat, then RESTART. */
    DEATH_FREEZE: 0.15,
    DEATH_BEAT: 0.4,

    /* Pattern packs after this score. Bob packs after the next gate. */
    PATTERN_SCORE: 16,
    BOB_SCORE: 31,
    BOB_PX: 8,
    BOB_HZ: 0.55,
    BREATH_PX: 12,
    RISE_PX: 14,
  };

  const PALETTE = {
    HAD_HI: "#5A8A6A",
    HAD_MID: "#2A3A38",
    HAD_DEEP: "#1A2428",
    HAD_SHADOW: "#0E1418",
    IRI_GREEN: "#3DDB8A",
    IRI_PURPLE: "#8A5AB8",
    IRI_BRONZE: "#C8894A",
    IRI_TEAL: "#2A9A8A",
    CHEEK: "#F5F0E8",
    BILL: "#3A3A40",
    BILL_HI: "#C8C8D0",
    BILL_TIP: "#1A1A20",
    BOK_GREEN: "#007A4D",
    BOK_GOLD: "#FFB81C",
    SKY_SA: "#4EB8E8",
    SUNSET_ORANGE: "#F26A3D",
    PROTEA_PINK: "#E85A8C",
    EARTH_WARM: "#C4783A",
    EARTH_DEEP: "#6B3A1F",
    BODY_CREAM: "#FFE8C8",
    BODY_MID: "#F0C898",
    BODY_SHADOW: "#C48A58",
    FACE_WARM: "#FFF1DC",
    WING_SOFT: "#FFF6E8",
    WING_EDGE: "#E8C9A0",
    GLOW_NOSE: "#FF8A3D",
    GLOW_HOT: "#FF5A1F",
    INK: "#1A2A22",
    CREAM_UI: "#FFF8EC",
    PANEL_TOP: "#0E5C3A",
    PANEL_BOT: "#063024",
    TOWNSHIP_SKY_A: "#FFB36A",
    TOWNSHIP_SKY_B: "#6B3FA0",
    TOWNSHIP_SKY_C: "#1E3A5F",
    SHWESHWE_BLUE: "#1E4D8C",
    RHINO_GREY: "#9AA3A8",
    RHINO_DEEP: "#5C656A",
    COIN_FACE: "#FFD24A",
    COIN_RIM: "#C88912",
    COIN_HI: "#FFE9A0",
    /* Aliases the chrome still reads by short name. */
    CREAM: "#FFF8EC",
    GOLD: "#FFB81C",
    GOLD_DEEP: "#C88912",
    GOLD_SHADOW: "#8A5A10",
    EMBER: "#FF8A3D",
    HOT: "#FF5A1F",
    EMBER_HOT: "#FF5A1F",
    DEATH: "#F26A3D",
    ASH: "#8A8178",
    NIGHT_INK: "#1A2A22",
  };

  /* 5 common / 4 rare / 2 epic / 1 legendary. starter_hadida is free. */
  const COSTUMES = [
    { id: "starter_hadida", name: "Park Hadida", rarity: "C", trail: "#5A8A6A" },
    { id: "spaza_cap", name: "Spaza Cap", rarity: "C", trail: "#E8C9A0" },
    { id: "yellow_taxi", name: "Minibus Yellow", rarity: "C", trail: "#FFB81C" },
    { id: "braai_apron", name: "Braai Apron", rarity: "C", trail: "#A0A0A0" },
    { id: "takkie_run", name: "Takkie Runner", rarity: "C", trail: "#FFFFFF" },
    { id: "bok_jersey", name: "Springbok Green", rarity: "R", trail: "#3DDB6A" },
    { id: "vuvuzela", name: "Vuvuzela Fan", rarity: "R", trail: "#F26A3D" },
    { id: "shweshwe", name: "Shweshwe Shirt", rarity: "R", trail: "#6A9AE8" },
    { id: "cape_spice", name: "Cape Spice", rarity: "R", trail: "#FF8A3D" },
    { id: "protea_royal", name: "Protea Royal", rarity: "E", trail: "#E85A8C" },
    { id: "rhino_guard", name: "Rhino Guard", rarity: "E", trail: "#C0C8CC" },
    { id: "bok_legend", name: "Bok Legend", rarity: "L", trail: "#FFB81C" },
  ];

  const RARITY_NAME = { C: "Common", R: "Rare", E: "Epic", L: "Legendary" };
  const RARITY_RANK = { C: 0, R: 1, E: 2, L: 3 };

  const CHESTS = [
    {
      id: "street",
      name: "Street",
      cost: 100,
      weights: { C: 0.7, R: 0.24, E: 0.055, L: 0.005 },
      pityAfter: 10,
      pityRarity: "R",
    },
    {
      id: "township",
      name: "Township",
      cost: 300,
      weights: { C: 0.4, R: 0.4, E: 0.17, L: 0.03 },
      pityAfter: 5,
      pityRarity: "E",
    },
    {
      id: "bok",
      name: "Bok",
      cost: 750,
      weights: { C: 0.15, R: 0.4, E: 0.35, L: 0.1 },
      pityAfter: 5,
      pityRarity: "E",
    },
  ];

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* Score bands. Values ramp to the listed end of each band. Gap never under 128. Scroll caps at 250. */
  function feelAt(score) {
    const s = score > 0 ? score : 0;
    let scroll = 165;
    let gap = 155;
    let spacing = 220;
    let name = "Teach";
    if (s <= 5) {
      scroll = 165;
      gap = 155;
      spacing = 220;
      name = "Teach";
    } else if (s <= 15) {
      const t = (s - 5) / 10;
      scroll = lerp(165, 195, t);
      gap = lerp(155, 148, t);
      spacing = 220;
      name = "Warm";
    } else if (s <= 30) {
      const t = (s - 15) / 15;
      scroll = lerp(195, 225, t);
      gap = lerp(148, 140, t);
      spacing = lerp(220, 210, t);
      name = "Rise";
    } else if (s <= 50) {
      const t = (s - 30) / 20;
      scroll = lerp(225, 245, t);
      gap = lerp(140, 135, t);
      spacing = lerp(210, 205, t);
      name = "Heat";
    } else {
      scroll = 250;
      gap = 128;
      spacing = 200;
      name = "Legend";
    }
    return {
      name: name,
      scroll: Math.min(CONFIG.SCROLL_CAP, scroll),
      gap: Math.max(CONFIG.GAP_FLOOR, gap),
      spacing: spacing,
    };
  }

  function scrollSpeed(score) {
    return feelAt(score).scroll;
  }

  function gapHeight(score) {
    return feelAt(score).gap;
  }

  function pairSpacing(score) {
    return feelAt(score).spacing;
  }

  /* Hold the art keyframe across each window so 70–90ms is exactly sx 0.88 / sy 1.12. */
  function flapDraw(ms) {
    if (ms == null || ms < 0) return { sx: 1, sy: 1, wing: 0, frame: "F0" };
    if (ms < 40) return { sx: 1.02, sy: 0.98, wing: -0.55, frame: "F2" };
    if (ms < 70) return { sx: 0.95, sy: 1.05, wing: -0.12, frame: "F3" };
    if (ms < 90) return { sx: 0.88, sy: 1.12, wing: 0.55, frame: "F4" };
    if (ms < 140) return { sx: 0.94, sy: 1.06, wing: 0.22, frame: "F5" };
    if (ms < 200) return { sx: 0.98, sy: 1.02, wing: 0.06, frame: "F6" };
    return { sx: 1, sy: 1, wing: 0, frame: "F7" };
  }

  function bodyDraw() {
    return {
      L: CONFIG.BODY_L,
      D: CONFIG.BODY_D,
      tipD: CONFIG.BODY_D * CONFIG.TIP_RATIO,
      scale: 1,
    };
  }

  function tipRadians(deg) {
    return (-deg * Math.PI) / 180;
  }

  function costumeById(id) {
    for (let i = 0; i < COSTUMES.length; i++) if (COSTUMES[i].id === id) return COSTUMES[i];
    return COSTUMES[0];
  }

  function motifFor(score, seed) {
    const roll = Math.abs(seed | 0) % 2;
    const s = score > 0 ? score : 0;
    if (s <= 5) return "braai_drum";
    if (s <= 15) return roll ? "taxi_stack" : "braai_drum";
    if (s <= 30) return roll ? "pylon_disc" : "taxi_stack";
    if (s <= 50) return roll ? "protea_column" : "pylon_disc";
    return "protea_column";
  }

  /* Cosmetic ladder. Gifts are one-time and never gate PLAY or chests. */
  const RANKS = [
    { id: "chick", best: 5, title: "Chick", gift: 15 },
    { id: "rookie", best: 15, title: "Rookie", gift: 25 },
    { id: "squad", best: 30, title: "Squad", gift: 40 },
    { id: "legend", best: 50, title: "Legend", gift: 75 },
    { id: "ace", best: 75, title: "Flock Ace", gift: 100 },
    { id: "king", best: 100, title: "Hadida King", gift: 150 },
  ];

  const COPY = {
    TAGLINE: "One flap. Haa-haa energy.",
    BROKE: "Earn coins on runs",
    CLEAN: "Clean flight",
    NEW_BEST: "New best",
    CHALLENGE_PLUS: "Challenge +1",
    CLAIM_READY: "Challenge claim ready",
    FULL_FLOCK: "Full flock",
  };

  function rankTitle(best) {
    const n = best > 0 ? best : 0;
    let title = "";
    for (let i = 0; i < RANKS.length; i++) {
      if (n >= RANKS[i].best) title = RANKS[i].title;
    }
    return title;
  }

  return {
    CONFIG: CONFIG,
    PALETTE: PALETTE,
    COSTUMES: COSTUMES,
    SKINS: COSTUMES,
    CHESTS: CHESTS,
    RARITY_NAME: RARITY_NAME,
    RARITY_RANK: RARITY_RANK,
    RANKS: RANKS,
    COPY: COPY,
    PICKUPS: [],
    clamp: clamp,
    lerp: lerp,
    feelAt: feelAt,
    scrollSpeed: scrollSpeed,
    gapHeight: gapHeight,
    pairSpacing: pairSpacing,
    flapDraw: flapDraw,
    bodyDraw: bodyDraw,
    tipRadians: tipRadians,
    costumeById: costumeById,
    motifFor: motifFor,
    rankTitle: rankTitle,
  };
});
