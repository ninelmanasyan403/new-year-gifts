const PALETTES = {
  aket: {
    bg: "#e7f7ec",
    main: "#1f7a45",
    dark: "#145c33",
    light: "#c8edd4",
    accent: "#f2c14e",
    soft: "#fff8f2"
  },
  "money-merch": {
    bg: "#f4ffd4",
    main: "#1c1c1c",
    dark: "#111111",
    light: "#dfff6a",
    accent: "#ff5f93",
    soft: "#fffdf6"
  },
  prezentum: {
    bg: "#fff3e6",
    main: "#d08a3c",
    dark: "#8d5a22",
    light: "#ffe3bf",
    accent: "#e25b6a",
    soft: "#fffaf4"
  },
  merchify: {
    bg: "#f3ecff",
    main: "#6d4aff",
    dark: "#3c278f",
    light: "#ddd0ff",
    accent: "#ffb7d5",
    soft: "#fff8fc"
  }
};

function eyes(x, y) {
  return `<circle cx="${x - 7}" cy="${y}" r="2.2" fill="#5c3a32"/>
    <circle cx="${x + 7}" cy="${y}" r="2.2" fill="#5c3a32"/>
    <path d="M${x - 5} ${y + 6} Q${x} ${y + 11} ${x + 5} ${y + 6}" stroke="#5c3a32" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
}

function belly(x, y) {
  return `<ellipse cx="${x}" cy="${y}" rx="18" ry="13" fill="#fff7ef"/>${eyes(x, y - 1)}`;
}

function snow(p) {
  return `<circle cx="22" cy="24" r="3" fill="#fff" opacity="0.85"/>
    <circle cx="176" cy="36" r="2.2" fill="#fff" opacity="0.75"/>
    <circle cx="168" cy="132" r="3" fill="${p.accent}" opacity="0.55"/>
    <path d="M30 128 l3.2 1.2 1.2 3.2 1.2-3.2 3.2-1.2-3.2-1.2-1.2-3.2-1.2 3.2z" fill="#fff" opacity="0.9"/>`;
}

function frame(p, inner) {
  return `<svg viewBox="0 0 200 156" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="200" height="156" rx="28" fill="${p.bg}"/>
    ${snow(p)}
    ${inner}
  </svg>`;
}

const KINDS = {
  hoodie(p) {
    return frame(p, `
      <path d="M58 58 L46 74 V108 L70 100 V118 H130 V100 L154 108 V74 L142 58 Q100 40 58 58Z" fill="${p.main}"/>
      <path d="M58 62 Q100 78 142 62 L136 74 Q100 88 64 74Z" fill="${p.dark}"/>
      <path d="M78 96 H122 V114 H78Z" fill="${p.dark}" opacity="0.35"/>
      ${belly(100, 92)}`);
  },
  tshirt(p) {
    return frame(p, `
      <path d="M62 52 L40 68 L52 84 L70 74 V112 H130 V74 L148 84 L160 68 L138 52 Q100 40 62 52Z" fill="${p.main}"/>
      <path d="M78 54 Q100 70 122 54" fill="${p.dark}"/>
      ${belly(100, 88)}`);
  },
  sweat(p) {
    return frame(p, `
      <path d="M56 56 L42 74 V104 L68 96 V120 H132 V96 L158 104 V74 L144 56 Q100 40 56 56Z" fill="${p.main}"/>
      <path d="M74 58 Q100 74 126 58" fill="${p.dark}"/>
      <rect x="86" y="86" width="28" height="16" rx="6" fill="${p.light}"/>
      ${belly(100, 96)}`);
  },
  longsleeve(p) {
    return frame(p, `
      <path d="M64 50 L36 70 L46 86 L68 76 V118 H132 V76 L154 86 L164 70 L136 50 Q100 38 64 50Z" fill="${p.main}"/>
      <path d="M80 52 Q100 66 120 52" fill="${p.dark}"/>
      ${belly(100, 90)}`);
  },
  bomber(p) {
    return frame(p, `
      <path d="M60 54 L44 72 V112 L72 104 V122 H128 V104 L156 112 V72 L140 54 Q100 40 60 54Z" fill="${p.main}"/>
      <path d="M78 56 H122 L116 70 H84Z" fill="${p.light}"/>
      <path d="M96 70 V118" stroke="${p.accent}" stroke-width="4"/>
      <circle cx="100" cy="92" r="4" fill="${p.accent}"/>
      ${belly(100, 100)}`);
  },
  tote(p) {
    return frame(p, `
      <path d="M70 48 Q100 28 130 48" stroke="${p.dark}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="58" y="58" width="84" height="70" rx="16" fill="${p.main}"/>
      <path d="M58 78 H142" stroke="${p.light}" stroke-width="6"/>
      <path d="M92 34 Q100 18 108 34" stroke="${p.accent}" stroke-width="4" fill="none"/>
      ${belly(100, 100)}`);
  },
  cap(p) {
    return frame(p, `
      <path d="M48 86 Q48 48 100 48 Q152 48 152 86Z" fill="${p.main}"/>
      <path d="M40 88 H128 Q150 88 156 98 Q120 108 48 96Z" fill="${p.dark}"/>
      <circle cx="100" cy="70" r="6" fill="${p.accent}"/>
      ${belly(100, 74)}`);
  },
  socks(p) {
    return frame(p, `
      <g transform="rotate(-12 86 90)">
        <path d="M70 40 H102 V92 Q102 112 82 112 H64 Q52 112 52 100 V92 H70Z" fill="${p.main}"/>
        <rect x="70" y="40" width="32" height="14" rx="4" fill="${p.light}"/>
      </g>
      <g transform="rotate(10 118 90)">
        <path d="M104 46 H136 V98 Q136 118 116 118 H98 Q86 118 86 106 V98 H104Z" fill="${p.dark}"/>
        <rect x="104" y="46" width="32" height="14" rx="4" fill="${p.accent}"/>
      </g>`);
  },
  mug(p) {
    return frame(p, `
      <path d="M118 62 H132 Q150 62 150 82 Q150 102 132 102 H118" stroke="${p.dark}" stroke-width="6" fill="none"/>
      <rect x="58" y="52" width="70" height="68" rx="18" fill="${p.main}"/>
      <path d="M78 42 Q84 28 90 42" stroke="${p.light}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M96 40 Q102 24 108 40" stroke="${p.accent}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${belly(92, 86)}`);
  },
  backpack(p) {
    return frame(p, `
      <path d="M78 48 Q100 36 122 48" stroke="${p.dark}" stroke-width="5" fill="none"/>
      <rect x="62" y="50" width="76" height="74" rx="22" fill="${p.main}"/>
      <rect x="78" y="70" width="44" height="28" rx="8" fill="${p.light}"/>
      <path d="M100 50 V124" stroke="${p.dark}" stroke-width="4" opacity="0.35"/>
      ${belly(100, 84)}`);
  },
  messenger(p) {
    return frame(p, `
      <path d="M46 70 H150 L140 118 H58Z" fill="${p.main}"/>
      <path d="M46 70 H150 L120 52 H74Z" fill="${p.dark}"/>
      <path d="M78 52 Q100 28 122 70" stroke="${p.accent}" stroke-width="5" fill="none"/>
      <rect x="86" y="84" width="28" height="16" rx="5" fill="${p.light}"/>
      ${eyes(100, 92)}`);
  },
  powerbank(p) {
    return frame(p, `
      <rect x="70" y="36" width="60" height="92" rx="16" fill="${p.main}"/>
      <rect x="90" y="28" width="20" height="12" rx="4" fill="${p.dark}"/>
      <path d="M100 62 L88 84 H98 L94 104 L114 78 H102 Z" fill="${p.accent}"/>
      ${belly(100, 78)}`);
  },
  pins(p) {
    return frame(p, `
      <circle cx="78" cy="78" r="26" fill="${p.main}"/>
      <circle cx="122" cy="74" r="26" fill="${p.dark}"/>
      <circle cx="100" cy="104" r="26" fill="${p.accent}"/>
      ${eyes(78, 76)}
      ${eyes(122, 72)}
      ${eyes(100, 102)}`);
  },
  giftbox(p) {
    return frame(p, `
      <rect x="52" y="70" width="96" height="56" rx="10" fill="${p.main}"/>
      <rect x="48" y="58" width="104" height="18" rx="6" fill="${p.dark}"/>
      <path d="M100 58 V126" stroke="${p.accent}" stroke-width="10"/>
      <path d="M48 78 H152" stroke="${p.accent}" stroke-width="8"/>
      <path d="M100 58 C88 40 70 46 78 58 C88 46 100 50 100 58 C100 50 112 46 122 58 C130 46 112 40 100 58Z" fill="${p.accent}"/>
      ${belly(100, 102)}`);
  },
  notebook(p) {
    return frame(p, `
      <rect x="56" y="36" width="92" height="96" rx="8" fill="${p.main}"/>
      <rect x="68" y="36" width="80" height="96" rx="6" fill="${p.soft}"/>
      <path d="M84 56 H132 M84 70 H132 M84 84 H120" stroke="${p.light}" stroke-width="4" stroke-linecap="round"/>
      <path d="M118 28 V70 L128 60 L138 70 V28Z" fill="${p.accent}"/>
      ${eyes(104, 102)}`);
  },
  pen(p) {
    return frame(p, `
      <g transform="rotate(-38 100 82)">
        <rect x="78" y="36" width="22" height="78" rx="8" fill="${p.main}"/>
        <rect x="78" y="36" width="22" height="16" fill="${p.accent}"/>
        <path d="M78 114 H100 L89 132 Z" fill="${p.dark}"/>
        <rect x="82" y="58" width="14" height="8" rx="2" fill="${p.light}"/>
      </g>`);
  },
  blanket(p) {
    return frame(p, `
      <path d="M46 64 Q70 44 100 58 Q130 44 154 64 V112 Q100 126 46 112Z" fill="${p.main}"/>
      <path d="M46 80 Q70 68 100 78 Q130 68 154 80" stroke="${p.light}" stroke-width="6" fill="none"/>
      <path d="M62 96 Q100 84 138 96" stroke="${p.accent}" stroke-width="6" fill="none"/>
      ${belly(100, 92)}`);
  },
  candles(p) {
    return frame(p, `
      <rect x="48" y="78" width="22" height="42" rx="6" fill="${p.light}"/>
      <rect x="86" y="62" width="26" height="58" rx="6" fill="${p.main}"/>
      <rect x="126" y="84" width="20" height="36" rx="6" fill="${p.dark}"/>
      <path d="M59 78 Q59 62 66 70 Q62 60 59 78Z" fill="${p.accent}"/>
      <path d="M99 62 Q99 42 108 54 Q102 40 99 62Z" fill="${p.accent}"/>
      <path d="M136 84 Q136 70 142 76 Q138 66 136 84Z" fill="${p.accent}"/>
      ${eyes(99, 96)}`);
  },
  sweets(p) {
    return frame(p, `
      <rect x="50" y="72" width="100" height="48" rx="12" fill="${p.main}"/>
      <path d="M50 84 Q100 64 150 84 V96 Q100 78 50 96Z" fill="${p.dark}"/>
      <circle cx="78" cy="66" r="12" fill="${p.accent}"/>
      <circle cx="100" cy="56" r="14" fill="${p.light}"/>
      <circle cx="124" cy="66" r="11" fill="${p.soft}"/>
      ${eyes(100, 98)}`);
  },
  stickers(p) {
    return frame(p, `
      <rect x="48" y="70" width="78" height="58" rx="10" fill="${p.dark}" transform="rotate(-8 87 99)"/>
      <rect x="70" y="48" width="82" height="62" rx="12" fill="${p.main}"/>
      <path d="M126 48 V70 H148" fill="${p.light}"/>
      <path d="M126 48 L148 70 H126Z" fill="${p.accent}"/>
      ${eyes(108, 80)}
      <path d="M96 100 H132" stroke="${p.soft}" stroke-width="4" stroke-linecap="round"/>`);
  }
};

function productArt(companyId, kind) {
  const palette = PALETTES[companyId] || PALETTES.aket;
  const draw = KINDS[kind] || KINDS.giftbox;
  return draw(palette);
}
