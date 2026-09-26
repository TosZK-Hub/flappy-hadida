/* Canvas volumetric hadeda. No WebGL. Bill points right. */
(function (root) {
  "use strict";

  const P = root.FBPhysics;
  const Feel = root.FBFeel;
  const Pal = Feel.PALETTE;
  const FONT = '"Lilita One", sans-serif';
  const SLAB = '"Anton", "Lilita One", sans-serif';

  const STARTER = "starter_hadida";

  const LOOK = {
    starter_hadida: { stops: ["#5A8A6A", "#2A9A8A", "#2A3A38", "#8A5AB8", "#0E1418"], wing: "#243430", wingTip: "#E8E0D4", iri: 0.85 },
    spaza_cap: { stops: ["#E8F6EC", "#3DDB8A", "#007A4D", "#0C5C38", "#063024"], wing: "#143028", wingTip: "#FFB81C", iri: 0.35, cap: true },
    yellow_taxi: { stops: ["#FFF6D0", "#FFE28A", "#FFB81C", "#C88912", "#6B4A08"], wing: "#3A3010", wingTip: "#007A4D", iri: 0.35, stripes: "#007A4D" },
    braai_apron: { stops: ["#F0D8C0", "#C4783A", "#6B3A1F", "#3A2214", "#1A120E"], wing: "#2A2018", wingTip: "#C8C0B8", iri: 0.35, apron: true },
    takkie_run: { stops: ["#F4FBFF", "#D7F3FF", "#8FCBE4", "#2A6A78", "#143038"], wing: "#E8FBFF", wingTip: "#FFFFFF", iri: 0.35, sport: true },
    bok_jersey: { stops: ["#B8F0D0", "#3DDB8A", "#007A4D", "#045C38", "#03281A"], wing: "#0C3020", wingTip: "#FFB81C", iri: 0.35, chevron: true },
    vuvuzela: { stops: ["#FFE0D0", "#FFB088", "#F26A3D", "#A84820", "#4A2010"], wing: "#3A2018", wingTip: "#FFB81C", iri: 0.35, vuvu: true },
    shweshwe: { stops: ["#D0DCF0", "#6A9AE8", "#1E4D8C", "#14325C", "#0C1C34"], wing: "#14243C", wingTip: "#E8E0D4", iri: 0.35, print: true },
    cape_spice: { stops: ["#FFE0C0", "#F0A06A", "#F26A3D", "#A84820", "#4A2410"], wing: "#3A2014", wingTip: "#FF8A3D", iri: 0.35, spice: true },
    protea_royal: { stops: ["#FFD0E0", "#F4A0BE", "#E85A8C", "#A83868", "#4A1830"], wing: "#3A1828", wingTip: "#E85A8C", iri: 0.35, protea: true },
    rhino_guard: { stops: ["#E8EEF0", "#C0C8CC", "#9AA3A8", "#5C656A", "#2A3034"], wing: "#3A4246", wingTip: "#E8E0D4", iri: 0.35, plates: true, nub: true },
    bok_legend: { stops: ["#FFF3C4", "#FFE08A", "#FFB81C", "#C88912", "#5A3E08"], wing: "#2A240C", wingTip: "#007A4D", iri: 0.35, legend: true, chevron: true },
  };

  let grainPat = null;
  let chromeTime = 0;
  let pressedPt = null;

  function setChrome(t, pt) {
    chromeTime = t || 0;
    pressedPt = pt || null;
  }

  function pathRound(ctx, x, y, w, h, r) {
    const rr = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function clipRound(ctx, x, y, w, h, r) {
    if (r <= 0) {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      return;
    }
    pathRound(ctx, x, y, w, h, r);
  }

  function hitRect(pt, r) {
    return !!r && pt.x >= r.x && pt.x <= r.x + r.w && pt.y >= r.y && pt.y <= r.y + r.h;
  }

  function text(ctx, str, x, y, size, fill, stroke) {
    ctx.font = size + "px " + FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    if (stroke) {
      ctx.lineWidth = Math.max(3, size * 0.14);
      ctx.strokeStyle = stroke;
      ctx.strokeText(str, x, y);
    }
    ctx.fillStyle = fill;
    ctx.fillText(str, x, y);
  }

  function stamp(ctx, str, x, y, size, fill) {
    ctx.save();
    ctx.font = size + "px " + SLAB;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, size * 0.12);
    ctx.strokeStyle = Pal.INK;
    ctx.strokeText(str, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(str, x, y);
    ctx.restore();
  }

  function noiseCanvas(size, cell, lo, hi) {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const g = c.getContext("2d");
    const img = g.createImageData(size, size);
    const cells = size / cell;
    const field = new Uint8Array(cells * cells);
    for (let i = 0; i < field.length; i++) field[i] = lo + ((Math.random() * (hi - lo)) | 0);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n = field[((y / cell) | 0) * cells + ((x / cell) | 0)];
        const i = (y * size + x) * 4;
        img.data[i] = n;
        img.data[i + 1] = n;
        img.data[i + 2] = n;
        img.data[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  function grainPattern(ctx) {
    if (grainPat) return grainPat;
    grainPat = ctx.createPattern(noiseCanvas(96, 1, 214, 255), "repeat");
    return grainPat;
  }

  function lookFor(id) {
    return LOOK[id] || LOOK[STARTER];
  }

  function drawFeatherWing(ctx, angle, fill, edge, alpha, shift) {
    ctx.save();
    ctx.translate(-8 + (shift || 0), -2 + (shift ? -2 : 0));
    ctx.rotate((angle || 0) * 0.9);
    ctx.globalAlpha *= alpha == null ? 1 : alpha;
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate(-0.95 + i * 0.42);
      const len = 24 - i * 1.6;
      const ry = 4.6 - i * 0.28;
      const g = ctx.createLinearGradient(0, -ry, len, ry);
      g.addColorStop(0, fill || "#243430");
      g.addColorStop(0.62, "#3D6A55");
      g.addColorStop(1, edge || "#E8E0D4");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(len * 0.46, 0, len * 0.48, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0E1814";
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.strokeStyle = "rgba(232, 224, 212, 0.9)";
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      ctx.moveTo(3, -ry * 0.55);
      ctx.quadraticCurveTo(len * 0.45, -ry * 1.05, len * 0.92, -0.4);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function bodyPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(-26, 1);
    ctx.bezierCurveTo(-32, -12, -14, -20, 0, -17);
    ctx.bezierCurveTo(12, -19, 24, -12, 26, -2);
    ctx.bezierCurveTo(28, 8, 16, 19, 0, 17);
    ctx.bezierCurveTo(-16, 18, -28, 12, -26, 1);
    ctx.closePath();
  }

  function paintMarks(ctx, look) {
    if (!look) return;
    if (look.stripes) {
      ctx.fillStyle = look.stripes;
      ctx.fillRect(-18, -3, 40, 4.5);
      ctx.fillRect(-14, 5, 34, 3);
    }
    if (look.chevron) {
      ctx.strokeStyle = "#FFB81C";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-10, -6);
      ctx.lineTo(0, 4);
      ctx.lineTo(12, -6);
      ctx.stroke();
    }
    if (look.print) {
      ctx.fillStyle = "#6A9AE8";
      for (let i = 0; i < 4; i++) {
        const x = -14 + i * 8;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 3, -6);
        ctx.lineTo(x + 6, 0);
        ctx.lineTo(x + 3, 5);
        ctx.closePath();
        ctx.fill();
      }
    }
    if (look.spice) {
      ctx.fillStyle = "rgba(255, 220, 170, 0.7)";
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.arc(-14 + (i * 6) % 28, -6 + (i % 3) * 5, 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (look.plates) {
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      pathRound(ctx, -10, -8, 16, 7, 3);
      ctx.fill();
      pathRound(ctx, -6, 2, 14, 6, 3);
      ctx.fill();
    }
  }

  function fillBody(ctx, look, ash) {
    const stops = ash
      ? ["#C8C4BE", "#8E8A84", "#5A5652", "#3A3634", "#1A1816"]
      : look.stops;
    ctx.save();
    bodyPath(ctx);
    ctx.clip();
    const g = ctx.createLinearGradient(-8, -20, 6, 18);
    g.addColorStop(0.0, stops[0]);
    g.addColorStop(0.18, stops[1]);
    g.addColorStop(0.45, stops[2]);
    g.addColorStop(0.72, stops[3]);
    g.addColorStop(1.0, stops[4]);
    ctx.fillStyle = g;
    ctx.fillRect(-48, -36, 96, 72);
    if (!ash) paintMarks(ctx, look);
    if (!ash) {
      const iri = ctx.createLinearGradient(-30, -16, 28, 14);
      iri.addColorStop(0, "#3DDB8A");
      iri.addColorStop(0.38, "#8A5AB8");
      iri.addColorStop(0.68, "#2A9A8A");
      iri.addColorStop(1, "#C8894A");
      ctx.save();
      ctx.globalCompositeOperation = "soft-light";
      ctx.globalAlpha = look.iri == null ? 0.35 : look.iri;
      ctx.fillStyle = iri;
      ctx.fillRect(-48, -36, 96, 72);
      ctx.restore();
    }
    const rim = ctx.createLinearGradient(0, -20, 0, 2);
    rim.addColorStop(0, "rgba(255, 248, 236, 0.45)");
    rim.addColorStop(1, "rgba(255, 248, 236, 0)");
    ctx.fillStyle = rim;
    ctx.fillRect(-40, -24, 80, 22);
    ctx.fillStyle = "rgba(14, 24, 20, 0.28)";
    ctx.beginPath();
    ctx.ellipse(-2, 11, 18, 5.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 248, 236, 0.30)";
    ctx.beginPath();
    ctx.ellipse(-6, -8, 12, 2.4, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    bodyPath(ctx);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0E1814";
    ctx.stroke();
  }

  function drawHead(ctx, look, ash) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(16, -2, 13, 12, -0.12, 0, Math.PI * 2);
    const hg = ctx.createRadialGradient(10, -8, 2, 16, 0, 14);
    hg.addColorStop(0, ash ? "#B0ACA6" : (look.stops[0] || "#5A8A6A"));
    hg.addColorStop(0.55, ash ? "#6A6662" : (look.stops[2] || "#2A3A38"));
    hg.addColorStop(1, ash ? "#3A3634" : (look.stops[4] || "#0E1418"));
    ctx.fillStyle = hg;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0E1814";
    ctx.stroke();
    ctx.fillStyle = ash ? "#D8D4CE" : "#F5F0E8";
    ctx.beginPath();
    ctx.ellipse(14, 4.5, 7.4, 5.1, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(14, 24, 20, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#FFFEFB";
    ctx.beginPath();
    ctx.ellipse(20.5, -3.2, 5.1, 5.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0E1814";
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = "#C8894A";
    ctx.beginPath();
    ctx.arc(21.6, -2.8, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1A1A20";
    ctx.beginPath();
    ctx.arc(22.1, -2.6, 1.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(22.8, -3.7, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0E1814";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(15.2, -8.6);
    ctx.quadraticCurveTo(20.4, -11.2, 26.2, -7.6);
    ctx.stroke();
    if (look && look.nub && !ash) {
      ctx.fillStyle = "#9AA3A8";
      ctx.strokeStyle = "#0E1814";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(12, -12);
      ctx.lineTo(15, -18);
      ctx.lineTo(18, -11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBill(ctx, ash) {
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(26, -1);
    ctx.quadraticCurveTo(40, 1, 54, 12);
    ctx.quadraticCurveTo(42, 7, 28, 3.2);
    ctx.closePath();
    const g = ctx.createLinearGradient(26, -2, 54, 14);
    g.addColorStop(0, ash ? "#8A8680" : "#6A6A72");
    g.addColorStop(0.55, ash ? "#5A5652" : "#3A3A40");
    g.addColorStop(1, ash ? "#2A2826" : "#1A1A20");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "#0E1814";
    ctx.lineWidth = 1.35;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(27, 4);
    ctx.quadraticCurveTo(40, 8, 52, 14);
    ctx.quadraticCurveTo(40, 11, 28, 6);
    ctx.closePath();
    ctx.fillStyle = ash ? "#4A4642" : "#2E2E34";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawTail(ctx, look, ash) {
    ctx.save();
    ctx.translate(-28, 3);
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate(-0.42 + i * 0.32);
      ctx.fillStyle = ash ? "#5A5652" : (look.stops[3] || "#1A2428");
      ctx.beginPath();
      ctx.ellipse(-7, 0, 9, 3.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0E1814";
      ctx.lineWidth = 1.15;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawLegs(ctx, look, ash) {
    ctx.save();
    ctx.strokeStyle = ash ? "#6A6662" : "#3A3A40";
    ctx.lineWidth = 1.7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-4, 15);
    ctx.lineTo(-6, 23);
    ctx.moveTo(4, 15);
    ctx.lineTo(6, 23);
    ctx.stroke();
    if (look && look.sport && !ash) {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.ellipse(-6, 23, 3.2, 1.6, 0, 0, Math.PI * 2);
      ctx.ellipse(6, 23, 3.2, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawAccessory(ctx, look) {
    if (!look) return;
    if (look.cap) {
      ctx.save();
      ctx.translate(10, -14);
      ctx.fillStyle = "#007A4D";
      pathRound(ctx, -12, -3, 24, 10, 4);
      ctx.fill();
      ctx.strokeStyle = "#0E1814";
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.fillStyle = "#FFB81C";
      pathRound(ctx, -12, 5, 20, 3.5, 1.5);
      ctx.fill();
      ctx.restore();
    }
    if (look.apron) {
      ctx.save();
      ctx.translate(-2, 2);
      ctx.fillStyle = "#2C2826";
      pathRound(ctx, -8, -2, 16, 14, 4);
      ctx.fill();
      ctx.strokeStyle = "#E7D2B8";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-3, 2);
      ctx.lineTo(6, 2);
      ctx.moveTo(1.5, 2);
      ctx.lineTo(1.5, 9);
      ctx.stroke();
      ctx.restore();
    }
    if (look.vuvu) {
      ctx.save();
      ctx.translate(18, -14);
      ctx.rotate(-0.35);
      ctx.fillStyle = "#F26A3D";
      pathRound(ctx, 0, -3, 16, 6, 3);
      ctx.fill();
      ctx.fillStyle = "#FFB81C";
      ctx.beginPath();
      ctx.arc(16, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (look.protea) {
      ctx.save();
      ctx.translate(12, -16);
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.fillStyle = i % 2 ? "#F4A0BE" : "#E85A8C";
        ctx.beginPath();
        ctx.ellipse(0, -6.5, 3, 5.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#FFE08A";
      ctx.beginPath();
      ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawHero(ctx, skin, opts) {
    const o = opts || {};
    const ash = !!o.ash;
    const id = ash ? STARTER : (skin || STARTER);
    const look = lookFor(id);
    const wing = o.wing || 0;
    if (!ash && look.legend) {
      ctx.save();
      ctx.fillStyle = "rgba(0, 122, 77, 0.28)";
      ctx.beginPath();
      ctx.ellipse(0, 6, 32, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    drawTail(ctx, look, ash);
    drawFeatherWing(ctx, wing, ash ? "#8A8680" : look.wing, ash ? "#C8C4BE" : look.wingTip, 0.72, -2.5);
    drawLegs(ctx, look, ash);
    fillBody(ctx, look, ash);
    drawHead(ctx, look, ash);
    drawBill(ctx, ash);
    if (!ash) drawAccessory(ctx, look);
    drawFeatherWing(ctx, wing, ash ? "#8A8680" : look.wing, ash ? "#C8C4BE" : look.wingTip, 1, 0);
  }

  function drawCoinIcon(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(26, 42, 34, 0.25)";
    ctx.beginPath();
    ctx.ellipse(0, r * 0.28, r * 0.82, r * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
    const g = ctx.createRadialGradient(-r * 0.34, -r * 0.38, r * 0.08, 0, 0, r);
    g.addColorStop(0, Pal.COIN_HI);
    g.addColorStop(0.42, Pal.COIN_FACE);
    g.addColorStop(1, Pal.COIN_RIM);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = Math.max(1.4, r * 0.09);
    ctx.strokeStyle = Pal.COIN_RIM;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, r * 0.055);
    ctx.strokeStyle = "rgba(255, 233, 160, 0.55)";
    ctx.stroke();
    ctx.strokeStyle = "rgba(200, 137, 18, 0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 0.4, Math.sin(a) * r * 0.4);
      ctx.lineTo(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6);
      ctx.stroke();
    }
    ctx.fillStyle = Pal.BOK_GREEN;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, "R", 0, r * 0.02, Math.max(8, r * 0.4), Pal.CREAM_UI, null);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = Math.max(1, r * 0.07);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.58, Math.PI * 1.15, Math.PI * 1.72);
    ctx.stroke();
    ctx.restore();
  }

  function drawBackground(ctx, scroll, time) {
    const sky = ctx.createLinearGradient(0, 0, 0, P.GROUND_Y);
    sky.addColorStop(0, Pal.TOWNSHIP_SKY_A);
    sky.addColorStop(0.38, "#E8896A");
    sky.addColorStop(0.62, Pal.TOWNSHIP_SKY_B);
    sky.addColorStop(1, Pal.TOWNSHIP_SKY_C);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, P.W, P.H);

    const sunX = 300 - ((scroll * 0.05) % 30);
    const sunY = P.GROUND_Y - 168;
    const sun = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 90);
    sun.addColorStop(0, "rgba(255, 220, 150, 0.42)");
    sun.addColorStop(0.45, "rgba(255, 179, 106, 0.16)");
    sun.addColorStop(1, "rgba(255, 179, 106, 0)");
    ctx.fillStyle = sun;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
    ctx.fill();

    drawMountain(ctx, scroll);
    drawTownship(ctx, scroll, time);
    const veil = ctx.createLinearGradient(0, P.GROUND_Y - 90, 0, P.GROUND_Y);
    veil.addColorStop(0, "rgba(107, 58, 31, 0)");
    veil.addColorStop(1, "rgba(58, 34, 20, 0.35)");
    ctx.fillStyle = veil;
    ctx.fillRect(0, P.GROUND_Y - 90, P.W, 90);
  }

  function drawMountain(ctx, scroll) {
    const base = P.GROUND_Y - 18;
    const shift = (scroll * 0.15) % 520;
    ctx.save();
    ctx.translate(-shift, 0);
    ctx.fillStyle = "rgba(58, 36, 84, 0.5)";
    for (let i = -1; i < 3; i++) {
      const x = i * 520;
      ctx.beginPath();
      ctx.moveTo(x, base);
      ctx.lineTo(x + 70, base - 36);
      ctx.lineTo(x + 120, base - 92);
      ctx.lineTo(x + 310, base - 98);
      ctx.lineTo(x + 360, base - 54);
      ctx.lineTo(x + 430, base - 28);
      ctx.lineTo(x + 520, base);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTownship(ctx, scroll, time) {
    const base = P.GROUND_Y - 6;
    const span = P.W + 200;
    for (let i = 0; i < 8; i++) {
      const w = 34 + (i % 3) * 18;
      const h = 26 + (i % 4) * 16;
      const x = ((i * 86 - scroll * 0.35) % span + span) % span - 80;
      ctx.fillStyle = i % 2 ? "#C4783A" : "#8A4A28";
      pathRound(ctx, x, base - h, w, h + 10, 3);
      ctx.fill();
      ctx.fillStyle = i % 2 ? "#E4E0D8" : "#C9C4BA";
      ctx.beginPath();
      ctx.moveTo(x - 3, base - h + 8);
      ctx.lineTo(x + w * 0.5, base - h - 12);
      ctx.lineTo(x + w + 3, base - h + 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255, 184, 28, 0.7)";
      pathRound(ctx, x + w * 0.62, base - h * 0.55, 7, 6, 1.5);
      ctx.fill();
      if (i % 3 === 0) {
        ctx.fillStyle = Pal.BOK_GREEN;
        pathRound(ctx, x + 4, base - h - 22, 22, 10, 2);
        ctx.fill();
        ctx.fillStyle = Pal.BOK_GOLD;
        ctx.fillRect(x + 7, base - h - 18, 16, 2);
      }
    }
    const tx = ((scroll * -0.35 + 40) % span + span) % span - 40;
    ctx.strokeStyle = "#6B3A1F";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx, base);
    ctx.lineTo(tx + 8, base - 48);
    ctx.moveTo(tx + 22, base);
    ctx.lineTo(tx + 14, base - 48);
    ctx.stroke();
    ctx.fillStyle = "#8A4A28";
    pathRound(ctx, tx + 2, base - 60, 20, 14, 3);
    ctx.fill();
    const bloom = 0.22 + 0.06 * Math.sin((time || 0) * 1.3);
    ctx.fillStyle = "rgba(168, 96, 176, " + bloom.toFixed(3) + ")";
    for (let i = 0; i < 5; i++) {
      const x = ((i * 130 - scroll * 0.35) % span + span) % span - 20;
      ctx.beginPath();
      ctx.arc(x, base - 52 - (i % 2) * 10, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawGround(ctx, scroll, time) {
    const y = P.GROUND_Y;
    const soil = ctx.createLinearGradient(0, y, 0, P.H);
    soil.addColorStop(0, Pal.EARTH_DEEP);
    soil.addColorStop(1, "#3A2214");
    ctx.fillStyle = soil;
    ctx.fillRect(0, y, P.W, P.GROUND_H);
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = "rgba(255, 232, 200, 0.35)";
    ctx.lineWidth = 2;
    const smokeShift = scroll * 0.65;
    for (let i = 0; i < 4; i++) {
      const x0 = ((i * 140 - smokeShift) % (P.W + 40) + (P.W + 40)) % (P.W + 40) - 20;
      ctx.beginPath();
      ctx.moveTo(x0, y + 8);
      ctx.quadraticCurveTo(x0 + 24, y - 10 + Math.sin((time || 0) + i) * 3, x0 + 54, y + 6);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(255, 248, 236, 0.28)";
    ctx.lineWidth = 1.3;
    const shift = -((scroll * 0.65) % 28);
    for (let x = shift; x < P.W; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 8);
      ctx.quadraticCurveTo(x + 8, y + 2, x + 12, y + 9);
      ctx.stroke();
    }
  }

  function discPath(ctx, x, y, w, h) {
    pathRound(ctx, x, y, w, h, Math.min(8, h / 2));
  }

  function drawDisc(ctx, motif, x, y, w, h, i) {
    ctx.save();
    discPath(ctx, x, y, w, h);
    ctx.clip();
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    if (motif === "taxi_stack") {
      g.addColorStop(0, "#FFF3C4");
      g.addColorStop(0.35, "#FFB81C");
      g.addColorStop(1, "#C88912");
    } else if (motif === "pylon_disc") {
      g.addColorStop(0, "#D5DCE0");
      g.addColorStop(0.4, "#9AA3A8");
      g.addColorStop(1, "#5C656A");
    } else if (motif === "protea_column") {
      g.addColorStop(0, "#9BE7C0");
      g.addColorStop(0.45, "#007A4D");
      g.addColorStop(1, "#064E32");
    } else {
      g.addColorStop(0, "#6A5648");
      g.addColorStop(0.4, "#3A302C");
      g.addColorStop(1, "#1C1614");
    }
    ctx.fillStyle = g;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = "rgba(255, 248, 236, 0.22)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 3, w * 0.32, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    if (motif === "taxi_stack") {
      ctx.fillStyle = Pal.BOK_GREEN;
      ctx.fillRect(x + 4, y + h * 0.42, w - 8, 3.5);
    } else if (motif === "pylon_disc") {
      ctx.strokeStyle = "rgba(26, 42, 34, 0.35)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x + 6, y + 3);
      ctx.lineTo(x + w - 6, y + h - 3);
      ctx.moveTo(x + w - 6, y + 3);
      ctx.lineTo(x + 6, y + h - 3);
      ctx.stroke();
    } else if (motif === "protea_column" && i % 2 === 0) {
      ctx.fillStyle = Pal.PROTEA_PINK;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, 5.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (motif === "braai_drum") {
      ctx.strokeStyle = "rgba(196, 120, 58, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 3, y + 2);
      ctx.lineTo(x + 3, y + h - 2);
      ctx.moveTo(x + w - 3, y + 2);
      ctx.lineTo(x + w - 3, y + h - 2);
      ctx.stroke();
      if (i % 2 === 0) {
        const ember = ctx.createRadialGradient(x + w / 2, y + h, 1, x + w / 2, y + h, 10);
        ember.addColorStop(0, "rgba(255, 90, 31, 0.45)");
        ember.addColorStop(1, "rgba(255, 90, 31, 0)");
        ctx.fillStyle = ember;
        ctx.fillRect(x, y, w, h);
      }
    }
    ctx.restore();
  }

  function drawGapLip(ctx, x, y, w) {
    const bloom = ctx.createRadialGradient(x + w / 2, y, 1, x + w / 2, y, w * 0.42);
    bloom.addColorStop(0, "rgba(255, 184, 28, 0.10)");
    bloom.addColorStop(1, "rgba(255, 184, 28, 0)");
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y, w * 0.42, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 248, 236, 0.92)";
    ctx.lineWidth = 2.7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + w - 6, y);
    ctx.stroke();
  }

  function drawColumn(ctx, tower, faceY, farY) {
    const motif = tower.motif || "braai_drum";
    const bodyW = P.COL_W;
    const left = tower.x + (P.VIS_W - bodyW) / 2;
    const lipIsBottom = faceY >= farY;
    const top = Math.min(faceY, farY);
    const bot = Math.max(faceY, farY);
    const capH = 10;
    const pitch = 24;
    const discH = 18;
    const bodyTop = lipIsBottom ? top : top + capH;
    const bodyBot = lipIsBottom ? bot - capH : bot;
    let i = 0;
    for (let y = bodyTop; y < bodyBot - 4; y += pitch) {
      const bulge = i % 2 === 0 ? 6 : 2;
      drawDisc(ctx, motif, left - bulge, y, bodyW + bulge * 2, Math.min(discH, bodyBot - y), i);
      i += 1;
    }
    const capY = lipIsBottom ? faceY - capH : faceY;
    const capX = left - 6;
    const capW = bodyW + 12;
    const cap = ctx.createLinearGradient(0, capY, 0, capY + capH);
    if (motif === "taxi_stack") {
      cap.addColorStop(0, "#FFE28A");
      cap.addColorStop(1, "#C88912");
    } else if (motif === "pylon_disc") {
      cap.addColorStop(0, "#EEF2F4");
      cap.addColorStop(1, "#6E777C");
    } else if (motif === "protea_column") {
      cap.addColorStop(0, "#F4A0BE");
      cap.addColorStop(1, "#E85A8C");
    } else {
      cap.addColorStop(0, "#8A6A52");
      cap.addColorStop(1, "#3A302C");
    }
    ctx.fillStyle = cap;
    pathRound(ctx, capX, capY, capW, capH, 4);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = Pal.INK;
    ctx.stroke();
    if (motif === "pylon_disc") {
      ctx.fillStyle = Pal.BOK_GOLD;
      ctx.beginPath();
      ctx.arc(capX + capW / 2, capY + capH / 2, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    const hy = lipIsBottom ? faceY - 1.5 : faceY + 1.5;
    drawGapLip(ctx, capX, hy, capW);
    if (tower.pulse) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 184, 28, 0.9)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      const mark = Math.min(P.W - 8, Math.max(tower.x, P.W - 22));
      ctx.beginPath();
      ctx.moveTo(mark, faceY);
      ctx.lineTo(mark + 12, faceY);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawTowers(ctx, towers) {
    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      const gapTop = t.gapY - t.gapH / 2;
      const gapBot = t.gapY + t.gapH / 2;
      drawColumn(ctx, t, gapTop, -40);
      drawColumn(ctx, t, gapBot, P.GROUND_Y + 8);
    }
  }

  function drawPlayer(ctx, p, time) {
    const age = p.flapAt != null && time != null ? (time - p.flapAt) * 1000 : -1;
    let pose = Feel.flapDraw(age);
    let wing = pose.wing;
    if (p.dead) {
      pose = { sx: 1.04, sy: 0.94 };
      wing = 0.4;
    } else if (age < 0 || age >= 200) {
      pose = { sx: 1, sy: 1 };
      wing = Math.sin((time || 0) * 2.15) * 0.16;
    }
    ctx.save();
    ctx.translate(P.PLAYER_X, p.y);
    ctx.rotate(p.rot || 0);
    ctx.scale(pose.sx, pose.sy);
    drawHero(ctx, p.skin || "starter_hadida", {
      ash: p.ash,
      wing: wing,
      time: time,
      emberKick: p.emberKick,
    });
    ctx.restore();
  }

  function drawShadow(ctx, p) {
    const body = Feel.bodyDraw();
    const depth = Math.max(0, Math.min(1, (P.GROUND_Y - p.y) / 420));
    ctx.save();
    ctx.translate(P.PLAYER_X, P.GROUND_Y - 1);
    ctx.scale(1.05 - depth * 0.3, 0.28);
    ctx.fillStyle = "rgba(26, 42, 34, " + (0.3 - depth * 0.14).toFixed(3) + ")";
    ctx.beginPath();
    ctx.ellipse(0, 0, body.L * 0.42, body.D * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function paintPlate(ctx, x, y, w, h, rad) {
    let r = rad == null ? 22 : rad;
    r = Math.max(8, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    pathRound(ctx, x, y, w, h, r);
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, Pal.PANEL_TOP);
    g.addColorStop(1, Pal.PANEL_BOT);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
    ctx.save();
    pathRound(ctx, x, y, w, h, r);
    ctx.clip();
    const tl = ctx.createLinearGradient(x, y, x + w * 0.7, y + h * 0.45);
    tl.addColorStop(0, "rgba(255, 248, 236, 0.16)");
    tl.addColorStop(0.5, "rgba(255, 248, 236, 0)");
    ctx.fillStyle = tl;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
    pathRound(ctx, x, y, w, h, r);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255, 184, 28, 0.35)";
    ctx.stroke();
  }

  function drawGoldButton(ctx, r, label) {
    const hot = pressedPt && hitRect(pressedPt, r);
    const dy = hot ? 2 : 0;
    const rad = Math.min(28, Math.max(22, r.h / 2));
    const y = r.y + dy;
    ctx.save();
    if (!hot) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
    }
    pathRound(ctx, r.x, y, r.w, r.h, rad);
    const g = ctx.createLinearGradient(r.x, y, r.x, y + r.h);
    g.addColorStop(0, "#FFE9A0");
    g.addColorStop(0.42, Pal.BOK_GOLD);
    g.addColorStop(1, Pal.COIN_RIM);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
    text(ctx, label, r.x + r.w / 2, y + r.h / 2 + 1, r.h > 52 ? 22 : 16, Pal.CREAM_UI, Pal.INK);
  }

  function drawGhostButton(ctx, r, label) {
    const hot = pressedPt && hitRect(pressedPt, r);
    const dy = hot ? 1 : 0;
    const rad = Math.min(22, Math.max(16, r.h / 2));
    const y = r.y + dy;
    ctx.save();
    pathRound(ctx, r.x, y, r.w, r.h, rad);
    ctx.fillStyle = hot ? "rgba(6, 48, 36, 0.55)" : "rgba(6, 48, 36, 0.4)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 248, 236, 0.35)";
    ctx.stroke();
    ctx.restore();
    const size = label.length > 10 ? 11 : label.length > 8 ? 12 : 14;
    text(ctx, label, r.x + r.w / 2, y + r.h / 2 + 1, size, Pal.CREAM_UI, null);
  }

  function homeLayout() {
    const slot = 30;
    const count = Feel.COSTUMES.length;
    const collection = { x: (P.W - count * slot) / 2, y: 218, w: count * slot, h: 40, slot: slot };
    return {
      plate: { x: 16, y: 56, w: 388, h: 600 },
      play: { x: 48, y: 448, w: 324, h: 64 },
      challenges: { x: 36, y: 568, w: 166, h: 48 },
      chests: { x: 218, y: 568, w: 166, h: 48 },
      collection: collection,
    };
  }

  function deathLayout() {
    const panel = { x: 18, y: 118, w: 384, h: 514 };
    const top = panel.y + 16;
    return {
      panel: panel,
      home: { x: 32, y: top, w: 84, h: 44 },
      challenges: { x: 132, y: top, w: 140, h: 44 },
      chests: { x: 288, y: top, w: 98, h: 44 },
      restart: { x: 36, y: panel.y + panel.h - 18 - 64, w: 348, h: 64 },
    };
  }

  function menuLayout(mode) {
    if (mode === "over") return deathLayout();
    return homeLayout();
  }

  function drawMenu(ctx, mode, claimable) {
    const m = menuLayout(mode);
    if (m.home) drawGhostButton(ctx, m.home, "HOME");
    drawGhostButton(ctx, m.challenges, "CHALLENGES");
    drawGhostButton(ctx, m.chests, "CHESTS");
    if (claimable) {
      ctx.fillStyle = Pal.BOK_GOLD;
      ctx.beginPath();
      ctx.arc(m.challenges.x + m.challenges.w - 10, m.challenges.y + 10, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function menuHit(pt, mode) {
    const m = menuLayout(mode);
    if (m.home && hitRect(pt, m.home)) return "home";
    if (hitRect(pt, m.challenges)) return "challenges";
    if (hitRect(pt, m.chests)) return "chests";
    return null;
  }

  function playHit(pt) {
    return hitRect(pt, homeLayout().play);
  }

  function restartHit(pt) {
    return hitRect(pt, deathLayout().restart);
  }

  function collectionLayout() {
    return homeLayout().collection;
  }

  function collectionHit(pt) {
    return hitRect(pt, collectionLayout());
  }

  function stashLayout(showJob) {
    const d = deathLayout();
    const h = 28;
    const gap = 16;
    const n = showJob ? 2 : 1;
    const stackH = n * h + (n - 1) * gap;
    const y = d.restart.y - 16 - stackH;
    const w = 236;
    const x = (P.W - w) / 2;
    return {
      coins: { x: x, y: y, w: w, h: h },
      job: showJob ? { x: x, y: y + h + gap, w: w, h: h } : null,
    };
  }

  function stashHit(pt, showJob) {
    const s = stashLayout(!!showJob);
    if (s.job && hitRect(pt, s.job)) return "challenges";
    return null;
  }

  function drawCreamChip(ctx, r, label) {
    pathRound(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.fillStyle = "rgba(6, 48, 36, 0.72)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = Pal.CREAM_UI;
    ctx.stroke();
    text(ctx, label, r.x + r.w / 2, r.y + r.h / 2 + 1, 13, Pal.CREAM_UI, null);
  }

  function drawCollection(ctx, ui) {
    const strip = collectionLayout();
    const skins = Feel.COSTUMES;
    const owns = ui.owns || function () { return false; };
    for (let i = 0; i < skins.length; i++) {
      const id = skins[i].id;
      const owned = !!owns(id);
      const cx = strip.x + strip.slot * i + strip.slot / 2;
      const cy = strip.y + strip.h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = "rgba(6, 24, 16, 0.35)";
      ctx.beginPath();
      ctx.ellipse(0, 3, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.scale(0.30, 0.30);
      if (!owned) ctx.globalAlpha = 0.78;
      drawHero(ctx, id, { time: ui.time || 0 });
      ctx.restore();
      if (owned && ui.skin === id) {
        ctx.strokeStyle = Pal.BOK_GOLD;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 12, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function panelFrame() {
    return {
      panel: { x: 16, y: 64, w: 388, h: 612 },
      close: { x: 342, y: 76, w: 48, h: 44 },
    };
  }

  function chestView() {
    const frame = panelFrame();
    const free = {
      x: frame.panel.x + 18,
      y: frame.panel.y + 102,
      w: frame.panel.w - 36,
      h: 44,
    };
    const chests = Feel.CHESTS;
    const rows = chests.map(function (c, i) {
      const y = frame.panel.y + 158 + i * 128;
      return {
        id: c.id,
        name: c.name,
        cost: c.cost,
        x: frame.panel.x + 18,
        y: y,
        w: frame.panel.w - 36,
        h: 116,
        open: { x: frame.panel.x + frame.panel.w - 36 - 112, y: y + 58, w: 112, h: 46 },
      };
    });
    return { panel: frame.panel, close: frame.close, free: free, rows: rows };
  }

  function drawChestGlyph(ctx, x, y, kind) {
    ctx.save();
    ctx.translate(x, y);
    const lid = kind === "bok" ? Pal.BOK_GOLD : kind === "township" ? Pal.SKY_SA : "#C4783A";
    ctx.fillStyle = "#063024";
    pathRound(ctx, -22, -6, 44, 28, 6);
    ctx.fill();
    ctx.strokeStyle = lid;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = lid;
    pathRound(ctx, -24, -16, 48, 14, 5);
    ctx.fill();
    ctx.fillStyle = Pal.BOK_GOLD;
    ctx.beginPath();
    ctx.arc(0, 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawChests(ctx, ui) {
    const view = chestView();
    ctx.fillStyle = "rgba(4, 24, 16, 0.72)";
    ctx.fillRect(0, 0, P.W, P.H);
    paintPlate(ctx, view.panel.x, view.panel.y, view.panel.w, view.panel.h, 24);
    stamp(ctx, "CHESTS", view.panel.x + 120, view.panel.y + 36, 26, Pal.CREAM_UI);
    drawCoinIcon(ctx, view.panel.x + 48, view.panel.y + 78, 14);
    text(ctx, String(ui.coins), view.panel.x + 92, view.panel.y + 78, 18, Pal.CREAM_UI, Pal.INK);
    drawGhostButton(ctx, view.close, "X");
    for (let i = 0; i < view.rows.length; i++) {
      const row = view.rows[i];
      pathRound(ctx, row.x, row.y, row.w, row.h, 16);
      ctx.fillStyle = "rgba(6, 30, 22, 0.45)";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255, 248, 236, 0.2)";
      ctx.stroke();
      drawChestGlyph(ctx, row.x + 40, row.y + 48, row.id);
      stamp(ctx, row.name.toUpperCase(), row.x + 150, row.y + 28, 16, Pal.CREAM_UI);
      drawCoinIcon(ctx, row.x + 108, row.y + 56, 11);
      text(ctx, String(row.cost), row.x + 146, row.y + 56, 16, Pal.BOK_GOLD, null);
      const pity = ui.pityText ? ui.pityText(row.id) : "";
      if (pity) text(ctx, pity, row.x + 118, row.y + 92, 12, Pal.CREAM_UI, null);
      const afford = ui.coins >= row.cost;
      if (afford) drawGoldButton(ctx, row.open, "OPEN");
      else drawGhostButton(ctx, row.open, "OPEN");
    }
    if (ui.freeReady) drawGoldButton(ctx, view.free, ui.freeLabel || "DAILY FREE");
    else drawGhostButton(ctx, view.free, ui.freeLabel || "DAILY FREE");
    if (ui.whisper) stamp(ctx, Feel.COPY.BROKE, P.W / 2, view.panel.y + view.panel.h - 22, 13, Pal.CREAM_UI);
    else text(ctx, "Costumes come from chests.", P.W / 2, view.panel.y + view.panel.h - 18, 12, Pal.CREAM_UI, null);
  }

  function chestHit(pt) {
    const view = chestView();
    if (hitRect(pt, view.close)) return { action: "close" };
    if (view.free && hitRect(pt, view.free)) return { action: "free" };
    for (let i = 0; i < view.rows.length; i++) {
      if (hitRect(pt, view.rows[i].open)) return { action: "open", id: view.rows[i].id };
    }
    if (!hitRect(pt, view.panel)) return { action: "close" };
    return null;
  }

  function collectionView() {
    const frame = panelFrame();
    const costumes = Feel.COSTUMES;
    const cols = 4;
    const cardW = 84;
    const cardH = 118;
    const gapX = 8;
    const gapY = 8;
    const gridW = cols * cardW + (cols - 1) * gapX;
    const x0 = frame.panel.x + (frame.panel.w - gridW) / 2;
    const y0 = frame.panel.y + 108;
    const cards = costumes.map(function (c, i) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        id: c.id,
        name: c.name,
        rarity: c.rarity,
        x: x0 + col * (cardW + gapX),
        y: y0 + row * (cardH + gapY),
        w: cardW,
        h: cardH,
      };
    });
    return {
      panel: frame.panel,
      close: frame.close,
      chests: { x: frame.panel.x + frame.panel.w - 36 - 120, y: frame.panel.y + frame.panel.h - 62, w: 120, h: 44 },
      cards: cards,
    };
  }

  function drawCollectionPanel(ctx, ui) {
    const view = collectionView();
    const owns = ui.owns || function () { return false; };
    ctx.fillStyle = "rgba(4, 24, 16, 0.72)";
    ctx.fillRect(0, 0, P.W, P.H);
    paintPlate(ctx, view.panel.x, view.panel.y, view.panel.w, view.panel.h, 24);
    stamp(ctx, "COLLECTION", view.panel.x + 150, view.panel.y + 34, 22, Pal.CREAM_UI);
    text(ctx, (ui.owned || 0) + " / 12", view.panel.x + 70, view.panel.y + 68, 14, Pal.BOK_GOLD, null);
    drawGhostButton(ctx, view.close, "X");
    for (let i = 0; i < view.cards.length; i++) {
      const card = view.cards[i];
      const owned = !!owns(card.id);
      const equipped = ui.skin === card.id;
      pathRound(ctx, card.x, card.y, card.w, card.h, 12);
      ctx.fillStyle = "rgba(6, 30, 22, 0.55)";
      ctx.fill();
      ctx.save();
      ctx.translate(card.x + card.w / 2, card.y + 46);
      ctx.scale(0.28, 0.28);
      if (!owned) ctx.globalAlpha = 0.4;
      drawHero(ctx, card.id, { time: ui.time || 0 });
      ctx.restore();
      const bits = card.name.split(" ");
      text(ctx, bits[0], card.x + card.w / 2, card.y + 84, 10, Pal.CREAM_UI, null);
      if (bits.length > 1) text(ctx, bits.slice(1).join(" "), card.x + card.w / 2, card.y + 96, 10, Pal.CREAM_UI, null);
      const tag = equipped ? "ON" : owned ? Feel.RARITY_NAME[card.rarity] : "CHEST";
      text(ctx, tag, card.x + card.w / 2, card.y + 110, 9, equipped ? Pal.BOK_GOLD : Pal.CREAM_UI, null);
      if (equipped) {
        pathRound(ctx, card.x + 1, card.y + 1, card.w - 2, card.h - 2, 12);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = Pal.BOK_GOLD;
        ctx.stroke();
      } else {
        pathRound(ctx, card.x, card.y, card.w, card.h, 12);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,248,236,0.18)";
        ctx.stroke();
      }
    }
    drawGhostButton(ctx, view.chests, "CHESTS");
  }

  function collectionPanelHit(pt) {
    const view = collectionView();
    if (hitRect(pt, view.close)) return { action: "close" };
    if (hitRect(pt, view.chests)) return { action: "chests" };
    for (let i = 0; i < view.cards.length; i++) {
      if (hitRect(pt, view.cards[i])) return { action: "card", id: view.cards[i].id };
    }
    if (!hitRect(pt, view.panel)) return { action: "close" };
    return null;
  }

  function revealLayout(coinsOnly) {
    const card = { x: 48, y: coinsOnly ? 220 : 168, w: 324, h: coinsOnly ? 280 : 420 };
    if (coinsOnly) {
      return {
        card: card,
        equip: null,
        ok: { x: card.x + 72, y: card.y + card.h - 74, w: 180, h: 52 },
      };
    }
    return {
      card: card,
      equip: { x: card.x + 18, y: card.y + card.h - 74, w: 140, h: 52 },
      ok: { x: card.x + card.w - 18 - 140, y: card.y + card.h - 74, w: 140, h: 52 },
    };
  }

  function rarityInk(code) {
    if (code === "L") return Pal.BOK_GOLD;
    if (code === "E") return Pal.PROTEA_PINK;
    if (code === "R") return "#7EE0A0";
    return Pal.CREAM_UI;
  }

  function drawReveal(ctx, ui) {
    const result = ui.result || {};
    const phase = ui.phase || (ui.life > 0 ? "lid" : "card");
    const coinsOnly = !!result.coinsGrant;
    ctx.fillStyle = "rgba(4, 24, 16, 0.55)";
    ctx.fillRect(0, 0, P.W, P.H);
    if (phase === "lid") {
      const life = ui.life > 0 ? ui.life : 0.001;
      const open = 1 - life / Feel.CONFIG.REVEAL_LID;
      ctx.save();
      ctx.translate(P.W / 2, 360);
      drawChestGlyph(ctx, 0, 10, result.chest || "street");
      ctx.translate(0, -18 - open * 28);
      ctx.fillStyle = Pal.BOK_GOLD;
      pathRound(ctx, -36, -8, 72, 16, 6);
      ctx.fill();
      ctx.restore();
      stamp(ctx, "OPENING", P.W / 2, 460, 16, Pal.CREAM_UI);
      return;
    }
    if (phase === "flash") {
      const code = result.rarity || "C";
      const ink = rarityInk(code);
      ctx.save();
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.16;
      ctx.fillRect(0, 0, P.W, P.H);
      ctx.restore();
      drawWord(ctx, code, P.W / 2, P.H / 2 - 16, 120, ink);
      stamp(ctx, (Feel.RARITY_NAME[code] || "").toUpperCase(), P.W / 2, P.H / 2 + 78, 18, ink);
      return;
    }
    const box = revealLayout(coinsOnly);
    paintPlate(ctx, box.card.x, box.card.y, box.card.w, box.card.h, 24);
    if (coinsOnly) {
      drawCoinIcon(ctx, P.W / 2, box.card.y + 110, 28);
      stamp(ctx, "DAILY CHEST", P.W / 2, box.card.y + 40, 16, Pal.BOK_GOLD);
      stamp(ctx, "+" + result.coinsGrant + " COINS", P.W / 2, box.card.y + 168, 18, Pal.CREAM_UI);
      drawGoldButton(ctx, box.ok, "OK");
      return;
    }
    const rarity = Feel.RARITY_NAME[result.rarity] || "";
    stamp(ctx, rarity.toUpperCase(), P.W / 2, box.card.y + 36, 14, rarityInk(result.rarity));
    ctx.save();
    ctx.translate(P.W / 2, box.card.y + 150);
    ctx.scale(1.35, 1.35);
    drawHero(ctx, result.id || "starter_hadida", { time: ui.time || 0 });
    ctx.restore();
    stamp(ctx, (result.name || "").toUpperCase(), P.W / 2, box.card.y + 250, 16, Pal.CREAM_UI);
    if (result.dupe) stamp(ctx, "Duplicate · +" + result.refund + " coins", P.W / 2, box.card.y + 286, 13, Pal.BOK_GOLD);
    else if (result.full) stamp(ctx, Feel.COPY.FULL_FLOCK + " · +150 coins", P.W / 2, box.card.y + 286, 13, Pal.BOK_GOLD);
    else text(ctx, "New costume", P.W / 2, box.card.y + 286, 13, Pal.CREAM_UI, null);
    drawGoldButton(ctx, box.equip, "EQUIP");
    drawGhostButton(ctx, box.ok, "OK");
  }

  function revealHit(pt, reveal) {
    const life = reveal && reveal.life ? reveal.life : 0;
    const phase = reveal && reveal.phase ? reveal.phase : (life > 0 ? "lid" : "card");
    if (phase === "lid" || phase === "flash") return { action: "skip" };
    const result = (reveal && reveal.result) || {};
    const box = revealLayout(!!result.coinsGrant);
    if (box.equip && hitRect(pt, box.equip)) return { action: "equip" };
    if (hitRect(pt, box.ok)) return { action: "ok" };
    return { action: "ok" };
  }

  function challengeView() {
    const frame = panelFrame();
    const list = root.FBMeta.missions();
    const rows = list.map(function (m, i) {
      const y = frame.panel.y + 108 + i * 112;
      return {
        id: m.id,
        name: m.name,
        goal: m.goal,
        reward: m.reward,
        progress: m.progress,
        claimed: m.claimed,
        ready: m.ready,
        period: m.period,
        x: frame.panel.x + 16,
        y: y,
        w: frame.panel.w - 32,
        h: 100,
        claim: { x: frame.panel.x + frame.panel.w - 16 - 110, y: y + 48, w: 110, h: 44 },
      };
    });
    return { panel: frame.panel, close: frame.close, rows: rows };
  }

  function drawChallenges(ctx) {
    const view = challengeView();
    ctx.fillStyle = "rgba(4, 24, 16, 0.72)";
    ctx.fillRect(0, 0, P.W, P.H);
    paintPlate(ctx, view.panel.x, view.panel.y, view.panel.w, view.panel.h, 24);
    stamp(ctx, "CHALLENGES", view.panel.x + 160, view.panel.y + 36, 22, Pal.CREAM_UI);
    drawGhostButton(ctx, view.close, "X");
    for (let i = 0; i < view.rows.length; i++) {
      const row = view.rows[i];
      pathRound(ctx, row.x, row.y, row.w, row.h, 14);
      ctx.fillStyle = "rgba(6, 30, 22, 0.45)";
      ctx.fill();
      const label = (row.period === "week" ? "WEEK · " : "DAY · ") + row.name;
      const labelSize = label.length > 26 ? 11 : 12;
      stamp(ctx, label.toUpperCase(), row.x + row.w / 2, row.y + 22, labelSize, Pal.CREAM_UI);
      const trackX = row.x + 14;
      const trackW = row.claim.x - trackX - 12;
      pathRound(ctx, trackX, row.y + 40, trackW, 12, 6);
      ctx.fillStyle = "#063024";
      ctx.fill();
      const fill = Math.max(0, Math.min(1, row.progress / row.goal)) * (trackW - 4);
      if (fill > 2) {
        const g = ctx.createLinearGradient(trackX, 0, trackX + trackW, 0);
        g.addColorStop(0, Pal.BOK_GOLD);
        g.addColorStop(1, Pal.BOK_GREEN);
        ctx.fillStyle = g;
        pathRound(ctx, trackX + 2, row.y + 42, fill, 8, 4);
        ctx.fill();
      }
      text(ctx, row.progress + "/" + row.goal, trackX + 28, row.claim.y + 22, 12, Pal.CREAM_UI, null);
      drawCoinIcon(ctx, row.claim.x - 28, row.claim.y + 22, 12);
      text(ctx, String(row.reward), row.claim.x - 28, row.claim.y + 40, 11, Pal.BOK_GOLD, null);
      if (row.ready) drawGoldButton(ctx, row.claim, "CLAIM");
      else drawGhostButton(ctx, row.claim, row.claimed ? "GOT" : "CLAIM");
    }
  }

  function challengeHit(pt) {
    const view = challengeView();
    if (hitRect(pt, view.close)) return { action: "close" };
    for (let i = 0; i < view.rows.length; i++) {
      if (view.rows[i].ready && hitRect(pt, view.rows[i].claim)) return { action: "claim", id: view.rows[i].id };
    }
    if (!hitRect(pt, view.panel)) return { action: "close" };
    return null;
  }

  function coinBox() {
    return { x: 270, y: 14, w: 136, h: 44 };
  }

  function drawCoins(ctx, n, pop) {
    const b = coinBox();
    const lift = pop > 0 ? pop : 0;
    pathRound(ctx, b.x, b.y, b.w, b.h, 22);
    ctx.fillStyle = "rgba(6, 48, 36, 0.72)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = Pal.BOK_GOLD;
    ctx.stroke();
    ctx.save();
    ctx.translate(b.x + 24, b.y + b.h / 2);
    ctx.scale(1 + lift * 0.35, 1 + lift * 0.35);
    drawCoinIcon(ctx, 0, 0, 13);
    ctx.restore();
    text(ctx, String(n), b.x + 84, b.y + b.h / 2 + 1, 18, Pal.CREAM_UI, Pal.INK);
  }

  function drawToast(ctx, toast) {
    if (!toast || toast.life <= 0 || !toast.text) return;
    const fade = toast.life < 0.28 ? Math.max(0, toast.life / 0.28) : 1;
    ctx.save();
    ctx.globalAlpha = fade;
    stamp(ctx, toast.text, P.W / 2, toast.y || 148, 15, Pal.CREAM_UI);
    ctx.restore();
  }

  function drawParticles(ctx, list, front, hud) {
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      if (!!p.hud !== !!hud) continue;
      if (!!p.front !== front) continue;
      const a = Math.max(0, p.life / p.max);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = a;
      if (p.kind === "coin") {
        ctx.rotate(p.rot || 0);
        drawCoinIcon(ctx, 0, 0, 7 * (p.size || 1));
        ctx.restore();
        continue;
      }
      if (p.kind === "feather") {
        ctx.rotate(p.rot || 0);
        ctx.fillStyle = p.color || Pal.BOK_GOLD;
        ctx.beginPath();
        ctx.ellipse(0, 0, 8 * (p.size || 1), 2.4 * (p.size || 1), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = Pal.CREAM_UI;
        ctx.globalAlpha = a * 0.75;
        ctx.beginPath();
        ctx.ellipse(-2.2, 0, 3.1, 1.05, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }
      if (p.kind === "ember") {
        ctx.globalAlpha = a * 0.15;
        ctx.fillStyle = p.color || Pal.HOT;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = a;
      }
      if (p.kind === "smoke") ctx.globalAlpha = Math.min(0.35, a * 0.35);
      ctx.fillStyle = p.color || (p.kind === "dust" ? Pal.ASH : Pal.HOT);
      const radius = p.kind === "smoke" ? Math.min(p.size, 8) : p.size;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawRings(ctx, rings) {
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i];
      const a = Math.max(0, r.life / r.max);
      ctx.strokeStyle = "rgba(255, 248, 236, " + (a * 0.75).toFixed(3) + ")";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawFloaters(ctx, list) {
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, f.life / f.max);
      text(ctx, f.text, f.x, f.y, 22, f.color || Pal.CREAM_UI, Pal.INK);
      ctx.restore();
    }
  }

  function drawHomeWorld(ctx, scroll) {
    const span = 640;
    const drift = ((scroll * 0.42) % span + span) % span;
    ctx.save();
    ctx.globalAlpha = 0.9;
    drawTowers(ctx, [
      { x: -180 - drift, gapY: 340, gapH: 250, motif: "braai_drum" },
      { x: 120 - drift, gapY: 390, gapH: 230, motif: "taxi_stack" },
      { x: 420 - drift, gapY: 360, gapH: 240, motif: "protea_column" },
    ]);
    ctx.restore();
  }

  function drawWord(ctx, str, x, y, size, face) {
    ctx.save();
    ctx.font = size + "px " + SLAB;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 0;
    ctx.lineWidth = size * 0.1;
    ctx.strokeStyle = Pal.INK;
    ctx.strokeText(str, x, y);
    ctx.fillStyle = face || Pal.CREAM_UI;
    ctx.fillText(str, x, y);
    ctx.restore();
  }

function drawTitle(ctx, ui) {
  const home = homeLayout();
  ctx.fillStyle = "rgba(6, 32, 24, 0.12)";
  ctx.fillRect(0, 0, P.W, P.H);
  paintPlate(ctx, home.plate.x, 78, home.plate.w, 122, 22);
  drawWord(ctx, "FLAPPY HADIDA", P.W / 2, 112, 28, Pal.BOK_GOLD);
    stamp(ctx, Feel.COPY.TAGLINE, P.W / 2, 148, 13, Pal.CREAM_UI);
    text(ctx, "best  " + (ui.best || 0), P.W / 2, 176, 16, Pal.CREAM_UI, null);
    const rank = Feel.rankTitle(ui.best);
    if (rank) stamp(ctx, rank.toUpperCase(), P.W / 2, 190, 12, Pal.BOK_GOLD);
    drawCollection(ctx, ui);
    const bob = Math.sin((ui.time || 0) * 2.15) * 6.5;
    const wing = Math.sin((ui.time || 0) * 2.15) * 0.18;
    if (ui.equippedRing) {
      ctx.save();
      ctx.translate(P.W / 2, 340 + bob);
      ctx.strokeStyle = Pal.BOK_GOLD;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.ellipse(0, 0, 58, 30, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(P.W / 2, 340 + bob);
    ctx.rotate(ui.rot || 0);
    ctx.scale(1.02, 1.02);
    drawHero(ctx, ui.skin || "starter_hadida", { time: ui.time || 0, wing: wing });
    ctx.restore();
    const play = home.play;
    const pulse = 1 + Math.sin((ui.time || 0) * 3.2) * 0.012;
    ctx.save();
    ctx.translate(play.x + play.w / 2, play.y + play.h / 2);
    ctx.scale(pulse, pulse);
    ctx.translate(-(play.x + play.w / 2), -(play.y + play.h / 2));
    drawGoldButton(ctx, play, "PLAY");
    ctx.restore();
    stamp(ctx, "Tap / Space to flap.", P.W / 2, 524, 13, Pal.CREAM_UI);
    if (ui.whisper) stamp(ctx, "Clear the stacks.", P.W / 2, 542, 11, Pal.CREAM_UI);
  }

  function drawHUD(ctx, ui) {
    const w = 132;
    const h = 58;
    const x = (P.W - w) / 2;
    const y = 72;
    const flip = ui.flip > 0 ? Math.cos((ui.flip / 0.12) * Math.PI * 0.5) : 1;
    const pop = Math.min(ui.pop || 1, 1.15);
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(pop, pop * (Math.abs(flip) < 0.08 ? 0.08 : flip));
    pathRound(ctx, -w / 2, -h / 2, w, h, 12);
    ctx.fillStyle = Pal.INK;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = Pal.BOK_GOLD;
    ctx.stroke();
    text(ctx, String(ui.score), 0, 2, 36, Pal.CREAM_UI, null);
    ctx.restore();
  }

  function drawGameOver(ctx, ui) {
    const scrim = ctx.createRadialGradient(P.W / 2, 420, 40, P.W / 2, 460, 520);
    scrim.addColorStop(0, "rgba(4, 24, 16, 0.15)");
    scrim.addColorStop(1, "rgba(4, 24, 16, 0.78)");
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, P.W, P.H);
    const d = deathLayout();
    const panel = d.panel;
    paintPlate(ctx, panel.x, panel.y, panel.w, panel.h, 24);
    drawWord(ctx, "GAME OVER", P.W / 2, panel.y + 92, 32, Pal.CREAM_UI);
    if (ui.newBest) stamp(ctx, Feel.COPY.NEW_BEST, P.W / 2, panel.y + 128, 14, Pal.BOK_GOLD);
    stamp(ctx, "SCORE", P.W / 2, panel.y + 164, 14, Pal.CREAM_UI);
    drawWord(ctx, String(ui.score), P.W / 2, panel.y + 214, 52, Pal.CREAM_UI);
    stamp(ctx, "BEST", P.W / 2, panel.y + 262, 13, Pal.BOK_GOLD);
    stamp(ctx, String(ui.best || 0), P.W / 2, panel.y + 292, 24, Pal.BOK_GOLD);
    const rank = Feel.rankTitle(ui.best);
    if (rank) text(ctx, rank, P.W / 2, panel.y + 320, 13, Pal.BOK_GOLD, null);
    const stash = stashLayout(!!ui.jobClaim);
    drawCreamChip(ctx, stash.coins, "+" + (ui.banked || 0) + " coins");
    if (stash.job) drawGhostButton(ctx, stash.job, Feel.COPY.CLAIM_READY);
    if (ui.ready) drawGoldButton(ctx, d.restart, "RESTART");
    else stamp(ctx, "…", P.W / 2, d.restart.y + d.restart.h / 2, 18, Pal.CREAM_UI);
  }

  function drawFlash(ctx, amount, x, y) {
    if (amount <= 0) return;
    const cx = x == null ? P.PLAYER_X : x;
    const cy = y == null ? P.H * 0.45 : y;
    const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, 72);
    g.addColorStop(0, "rgba(242, 106, 61, " + (amount * 0.4).toFixed(3) + ")");
    g.addColorStop(1, "rgba(242, 106, 61, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, 72, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawWhite(ctx, amount) {
    if (amount <= 0) return;
    ctx.fillStyle = "rgba(255, 248, 236, " + (amount * 0.7).toFixed(3) + ")";
    ctx.fillRect(0, 0, P.W, P.H);
  }

  function drawSkim(ctx, flash) {
    if (!flash || flash.a <= 0) return;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 184, 28, " + (flash.a * 0.9).toFixed(3) + ")";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    const top = flash.y - flash.h / 2;
    const bot = flash.y + flash.h / 2;
    ctx.beginPath();
    ctx.moveTo(flash.x - 40, top);
    ctx.lineTo(flash.x + 40, top);
    ctx.moveTo(flash.x - 40, bot);
    ctx.lineTo(flash.x + 40, bot);
    ctx.stroke();
    ctx.restore();
  }

  function drawVignette(ctx) {
    const g = ctx.createRadialGradient(P.W / 2, P.H / 2, P.H * 0.34, P.W / 2, P.H * 0.55, P.H * 0.72);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(6, 32, 24, 0.38)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, P.W, P.H);
  }

  function mutePos() {
    return { x: 40, y: 36, r: 18 };
  }

  function drawMute(ctx, muted) {
    const m = mutePos();
    ctx.save();
    ctx.fillStyle = "rgba(6, 48, 36, 0.55)";
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = Pal.CREAM_UI;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(m.x - 7, m.y - 3);
    ctx.lineTo(m.x - 2, m.y - 3);
    ctx.lineTo(m.x + 4, m.y - 8);
    ctx.lineTo(m.x + 4, m.y + 8);
    ctx.lineTo(m.x - 2, m.y + 3);
    ctx.lineTo(m.x - 7, m.y + 3);
    ctx.closePath();
    ctx.stroke();
    if (muted) {
      ctx.strokeStyle = Pal.SUNSET_ORANGE;
      ctx.beginPath();
      ctx.moveTo(m.x - 8, m.y - 8);
      ctx.lineTo(m.x + 8, m.y + 8);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawDebug(ctx, run) {
    const box = P.playerBox(run.player.y);
    ctx.save();
    ctx.strokeStyle = "rgba(242, 106, 61, 0.95)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = "rgba(255, 184, 28, 0.9)";
    for (let i = 0; i < run.towers.length; i++) {
      const cols = P.towerColliders(run.towers[i]);
      for (let k = 0; k < cols.length; k++) {
        const col = cols[k];
        ctx.strokeRect(col.x, col.y, col.w, col.h);
      }
    }
    ctx.restore();
  }

  root.FBDraw = {
    setChrome: setChrome,
    pathRound: pathRound,
    clipRound: clipRound,
    text: text,
    drawBackground: drawBackground,
    drawTowers: drawTowers,
    drawGround: drawGround,
    drawPlayer: drawPlayer,
    drawHero: drawHero,
    drawCoinIcon: drawCoinIcon,
    drawChests: drawChests,
    chestHit: chestHit,
    drawCollectionPanel: drawCollectionPanel,
    collectionPanelHit: collectionPanelHit,
    drawReveal: drawReveal,
    revealHit: revealHit,
    drawChallenges: drawChallenges,
    challengeHit: challengeHit,
    drawMenu: drawMenu,
    menuHit: menuHit,
    playHit: playHit,
    restartHit: restartHit,
    collectionHit: collectionHit,
    stashHit: stashHit,
    drawCoins: drawCoins,
    drawToast: drawToast,
    drawShadow: drawShadow,
    drawParticles: drawParticles,
    drawRings: drawRings,
    drawFloaters: drawFloaters,
    drawHomeWorld: drawHomeWorld,
    drawTitle: drawTitle,
    drawHUD: drawHUD,
    drawHint: function () {},
    drawGameOver: drawGameOver,
    drawFlash: drawFlash,
    drawWhite: drawWhite,
    drawSkim: drawSkim,
    drawVignette: drawVignette,
    drawMute: drawMute,
    drawDebug: drawDebug,
    mutePos: mutePos,
    homeLayout: homeLayout,
    deathLayout: deathLayout,
    stashLayout: stashLayout,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
