// Puzzle generation + KDP geometry. Pure logic, no DOM.

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ---------------------------------------------------------------- themes */

export const THEMES = {
  none: { label: "No theme (mixed vocabulary)", cat: "General", words: ["LANTERN","HARVEST","MARBLE","JOURNEY","WHISTLE","CABIN","RIBBON","MEADOW","COMPASS","KETTLE","VELVET","ORCHARD","SATCHEL","BEACON","THIMBLE","CANDLE","PEBBLE","WILLOW","BRONZE","HOLLOW"] },
  earth: { label: "Earth & rocks", cat: "Nature", words: ["GRANITE","BASALT","QUARTZ","MINERAL","CANYON","PLATEAU","BEDROCK","SEDIMENT","MOUNTAIN","VALLEY","FOSSIL","CRYSTAL","MARBLE","SLATE","GEODE","RIDGE","CAVERN","DUNE","CLAY","MESA"] },
  water: { label: "Water", cat: "Nature", words: ["CURRENT","LAGOON","ESTUARY","GLACIER","TIDE","RIPPLE","DELTA","SPRING","CASCADE","HARBOR","REEF","BASIN","MIST","STREAM","EDDY","FJORD","MARSH","SURF","DEPTH","WAVE"] },
  fire:  { label: "Fire", cat: "Nature", words: ["EMBER","KINDLE","BLAZE","CINDER","FLICKER","SCORCH","FORGE","HEARTH","LANTERN","BEACON","SPARK","SMOKE","LAVA","GLOW","TORCH","FLAME","ASH","COAL","FLARE","HEAT"] },
  air:   { label: "Air & sky", cat: "Nature", words: ["ZEPHYR","GUST","CIRRUS","CUMULUS","BREEZE","THERMAL","VAPOR","DRIFT","SQUALL","UPDRAFT","HAZE","CLOUD","WIND","SKY","FEATHER","GLIDE","BILLOW","STORM","CHILL","SOAR"] },
  space: { label: "Space", cat: "Nature", words: ["NEBULA","QUASAR","ORBIT","COMET","GALAXY","ECLIPSE","METEOR","CRATER","PULSAR","COSMOS","LUNAR","SOLAR","STELLAR","VOID","AURORA","PLASMA","APOGEE","TRANSIT","ASTEROID","ZENITH"] },
  folklore: { label: "Folklore & myth", cat: "Culture", words: ["LEGEND","RIDDLE","OMEN","TOTEM","LANTERN","WANDER","MYTH","ORACLE","TALISMAN","FABLE","SPIRIT","CHARM","RELIC","QUEST","EMBLEM","GRIMOIRE","WRAITH","SAGA","RUNE","VESSEL"] },
  garden: { label: "Garden", cat: "Home & hobby", words: ["TRELLIS","COMPOST","SEEDLING","BLOSSOM","PRUNE","MULCH","ORCHID","FERN","IVY","LAVENDER","THYME","BASIL","SPROUT","PETAL","ROOT","HEDGE","ARBOR","NECTAR","POLLEN","BLOOM"] },
  kitchen: { label: "Kitchen", cat: "Home & hobby", words: ["SKILLET","WHISK","LADLE","SIMMER","KNEAD","MORTAR","COLANDER","GRATER","SAUCEPAN","MINCE","BRAISE","ZEST","PANTRY","APRON","BATTER","SEAR","DOUGH","SPICE","BROTH","GLAZE"] },
  travel: { label: "Travel", cat: "Places & travel", words: ["PASSPORT","SUITCASE","ITINERARY","TERMINAL","VOYAGE","JOURNEY","COMPASS","LODGING","LANDMARK","POSTCARD","RAILWAY","HARBOR","SUMMIT","TRAIL","CABIN","FERRY","ROUTE","VISA","ATLAS","DEPART"] },
  birds: { label: "Birds", cat: "Animals", words: ["SPARROW","HERON","FALCON","WARBLER","PLOVER","OSPREY","KESTREL","EGRET","PUFFIN","RAVEN","FINCH","THRUSH","GROUSE","LOON","SWIFT","WREN","IBIS","CRANE","TALON","PLUMAGE"] },
  weather: { label: "Weather", cat: "Nature", words: ["FORECAST","BAROMETER","MONSOON","DRIZZLE","BLIZZARD","THUNDER","HUMIDITY","FROST","OVERCAST","DOWNPOUR","LIGHTNING","SLEET","HAIL","DEW","RAINBOW","PRESSURE","FUNNEL","GALE","CLIMATE","SEASON"] },
  music: { label: "Music", cat: "Culture", words: ["HARMONY","CADENCE","OCTAVE","TREBLE","RHYTHM","MELODY","TEMPO","CHORUS","SONATA","BALLAD","LYRIC","BRIDGE","REFRAIN","TIMBRE","PRELUDE","ANTHEM","CHORD","SCALE","VERSE","TUNE"] },
  cats: { label: "Cats", cat: "Animals", words: ["WHISKER","PURRING","TABBY","CALICO","SIAMESE","KITTEN","CATNIP","PROWL","PERSIAN","SCRATCH","PAWS","MITTENS","FELINE","TAIL","NAPPING","SUNBEAM","MEOW","CLAWS","COLLAR","TUXEDO"] },
  dogs: { label: "Dogs", cat: "Animals", words: ["BEAGLE","TERRIER","POODLE","RETRIEVER","COLLIE","SPANIEL","HUSKY","BOXER","PUPPY","LEASH","FETCH","KENNEL","BONE","WAGGING","MUZZLE","HOUND","PAWPRINT","MUTT","WHISTLE","HARNESS"] },
  farm: { label: "Farm & country", cat: "Animals", words: ["BARNYARD","TRACTOR","PASTURE","HAYLOFT","SILO","HARVEST","ROOSTER","HEIFER","PADDOCK","ORCHARD","FURROW","BUSHEL","SCARECROW","MEADOW","CREAMERY","PLOW","FENCE","TROUGH","SHEARING","GRANARY"] },
  ocean: { label: "Ocean life", cat: "Animals", words: ["DOLPHIN","BARNACLE","SEAWEED","PLANKTON","URCHIN","MANATEE","NARWHAL","STARFISH","CORAL","ANEMONE","MOLLUSK","KELP","OTTER","TIDEPOOL","WALRUS","SEAHORSE","MARLIN","OYSTER","CRAB","WHALE"] },
  holidays: { label: "Winter holidays", cat: "Seasonal", words: ["MISTLETOE","GARLAND","REINDEER","CHIMNEY","CAROLS","SLEIGH","TINSEL","WREATH","COCOA","STOCKING","SNOWMAN","GINGER","CANDLE","RIBBON","FROST","NUTCRACKER","ORNAMENT","PEPPERMINT","MITTENS","YULE"] },
  autumn: { label: "Autumn", cat: "Seasonal", words: ["PUMPKIN","HARVEST","CIDER","FOLIAGE","BONFIRE","SWEATER","ACORN","MAPLE","CHESTNUT","SCARECROW","GOURD","CRISP","AMBER","RAKE","CINNAMON","FLANNEL","ORCHARD","BUSHEL","DUSK","MIGRATE"] },
  spring: { label: "Spring", cat: "Seasonal", words: ["BLOSSOM","THAW","SEEDLING","ROBIN","SHOWERS","TULIP","DAFFODIL","PUDDLE","NESTING","GREENERY","POLLEN","BREEZE","SPROUT","LAMB","CROCUS","RENEWAL","MEADOW","DRIZZLE","BUDDING","LILAC"] },
  summer: { label: "Summer & beach", cat: "Seasonal", words: ["SANDCASTLE","BOARDWALK","LEMONADE","SUNSCREEN","HAMMOCK","SEASHELL","POPSICLE","SNORKEL","UMBRELLA","BAREFOOT","COOLER","SUNSET","SURFBOARD","PICNIC","FIREFLY","MARINA","TIDE","CABANA","GRILL","BREEZE"] },
  sports: { label: "Sports", cat: "Leisure", words: ["DRIBBLE","OFFSIDE","INNING","TOUCHDOWN","RACKET","HURDLE","PENALTY","STADIUM","REFEREE","DUGOUT","MARATHON","SPRINT","GOALIE","PADDLE","HELMET","BULLPEN","RALLY","TROPHY","COACH","PITCH"] },
  movies: { label: "Movies & TV", cat: "Culture", words: ["MATINEE","SCREENPLAY","DIRECTOR","CLOSEUP","MONTAGE","SEQUEL","CASTING","STUNT","PREMIERE","SOUNDTRACK","BOXOFFICE","TRAILER","EPISODE","SCENE","SUBTITLE","PRODUCER","STUDIO","CREDITS","REEL","CAMEO"] },
  books: { label: "Books & writing", cat: "Culture", words: ["CHAPTER","PROLOGUE","NARRATOR","MEMOIR","BINDING","LIBRARY","AUTHOR","PARAGRAPH","MARGIN","EPILOGUE","NOVELLA","PLOT","VERSE","EDITOR","PAPERBACK","INDEX","QUILL","FABLE","STANZA","PREFACE"] },
  history: { label: "History", cat: "Culture", words: ["DYNASTY","EMPIRE","TREATY","ARTIFACT","MONARCH","CENTURY","REVOLT","ARCHIVE","COLONY","CRUSADE","PARCHMENT","FORTRESS","CHRONICLE","CENSUS","MEDIEVAL","RUINS","SCRIBE","CAVALRY","EDICT","LEGACY"] },
  usa: { label: "US states & cities", cat: "Places & travel", words: ["MONTANA","VERMONT","OREGON","GEORGIA","ARIZONA","MAINE","NEVADA","KANSAS","BOSTON","SEATTLE","DENVER","AUSTIN","PORTLAND","SAVANNAH","BANGOR","TUCSON","OMAHA","MOBILE","ALBANY","SALEM"] },
  world: { label: "World geography", cat: "Places & travel", words: ["PENINSULA","ARCHIPELAGO","SAVANNA","TUNDRA","ISTHMUS","PLATEAU","EQUATOR","MERIDIAN","CONTINENT","STRAIT","OASIS","FJORD","DELTA","CANAL","HARBOR","SUMMIT","BASIN","CAPE","RIDGE","GULF"] },
  food: { label: "Food & baking", cat: "Home & hobby", words: ["SOURDOUGH","CARAMEL","MERINGUE","PASTRY","CUSTARD","BRIOCHE","FROSTING","PRALINE","GANACHE","SCONE","TART","YEAST","WHISK","CRUMB","SUGAR","BUTTER","VANILLA","COBBLER","PECAN","HONEY"] },
  crafts: { label: "Crafts & sewing", cat: "Home & hobby", words: ["THIMBLE","BOBBIN","CROCHET","QUILTING","PATTERN","STITCH","SKEIN","NEEDLE","APPLIQUE","EMBROIDER","SPOOL","FABRIC","SEAM","YARN","HEMLINE","BASTING","LOOM","FELT","TASSEL","BUTTON"] },
  fishing: { label: "Fishing & camping", cat: "Leisure", words: ["TACKLE","CASTING","LANTERN","CANTEEN","CAMPFIRE","BAITBOX","TROUT","WADERS","PORTAGE","CANOE","TENT","BEDROLL","REEL","LURE","COMPASS","KINDLING","TRAILHEAD","BACKPACK","MOSQUITO","SUNRISE"] },
  cars: { label: "Cars & motors", cat: "Leisure", words: ["CHASSIS","PISTON","CAMSHAFT","MUFFLER","IGNITION","CARBURETOR","RADIATOR","CHROME","CONVERTIBLE","ROADSTER","GEARBOX","CLUTCH","AXLE","HUBCAP","BUMPER","ENGINE","TORQUE","FENDER","WIPER","TRUNK"] },
  medical: { label: "Health & body", cat: "Science", words: ["CAPILLARY","TENDON","CARTILAGE","PLASMA","NEURON","CORTEX","ARTERY","VERTEBRA","MOLAR","RETINA","MARROW","ENZYME","THYROID","PULSE","SINEW","LIGAMENT","ALVEOLI","CRANIUM","IMMUNE","REFLEX"] },
  science: { label: "Science lab", cat: "Science", words: ["BEAKER","CATALYST","ISOTOPE","MOLECULE","PIPETTE","SPECTRUM","VACUUM","FRICTION","GRAVITY","NUCLEUS","ELECTRON","POLYMER","SOLVENT","KINETIC","LATTICE","VECTOR","PRISM","ALLOY","ORBITAL","ENTROPY"] },
  tech: { label: "Technology", cat: "Science", words: ["ALGORITHM","FIREWALL","KEYBOARD","PIXEL","BANDWIDTH","DATABASE","ROUTER","CIPHER","BINARY","CIRCUIT","CACHE","SERVER","MODEM","BACKUP","CURSOR","SCRIPT","KERNEL","PROTOCOL","SENSOR","BUFFER"] },
  faith: { label: "Faith & gratitude", cat: "Inspiration", words: ["BLESSING","GRATITUDE","MERCY","PSALM","HARVEST","COVENANT","SHEPHERD","PILGRIM","PRAISE","SANCTUARY","HYMN","GRACE","FAITH","HOPE","CHARITY","PATIENCE","KINDNESS","PROMISE","STEWARD","RENEWAL"] },
  selfcare: { label: "Calm & self-care", cat: "Inspiration", words: ["BREATHE","UNWIND","STILLNESS","BALANCE","RITUAL","LINGER","GENTLE","REST","SOOTHE","MINDFUL","QUIET","COMFORT","SLOWDOWN","CANDLE","WARMTH","PATIENCE","NOURISH","RENEW","SETTLE","EASE"] },
  kidsfun: { label: "Kids: playground", cat: "Kids", words: ["SWINGSET","SEESAW","SANDBOX","BUBBLES","KITE","MARBLES","JUMPROPE","SLIDE","TAG","HOPSCOTCH","BALLOON","CRAYON","PUPPY","COOKIE","GIGGLE","RECESS","CARTWHEEL","SNEAKERS","WHISTLE","FRIEND"] },
  dinosaurs: { label: "Kids: dinosaurs", cat: "Kids", words: ["TRICERATOPS","STEGOSAURUS","RAPTOR","FOSSIL","JURASSIC","CRETACEOUS","PTEROSAUR","HERBIVORE","CARNIVORE","TARPIT","AMBER","SKELETON","CLAW","SPIKES","EGGSHELL","PALEO","TAIL","SCALES","ROAR","EXTINCT"] },
  jobs: { label: "Jobs & trades", cat: "General", words: ["CARPENTER","ELECTRICIAN","MACHINIST","WELDER","SURVEYOR","PLUMBER","MASON","BAKER","FLORIST","LIBRARIAN","NURSE","PILOT","FARMER","TAILOR","BARBER","COBBLER","POTTER","GLAZIER","COOPER","SMITH"] },
  idioms: { label: "Everyday sayings", cat: "General", words: ["BALLPARK","SHOESTRING","UPHILL","HANDSHAKE","SILVER","CLOCKWORK","HOMESTRETCH","BACKBURNER","LANDSLIDE","BOOTSTRAP","NUTSHELL","KEYSTONE","WATERSHED","BENCHMARK","MILESTONE","THRESHOLD","GROUNDWORK","CROSSROAD","TAILWIND","HEADWAY"] },
};

export function customTheme(label, raw) {
  const lines = String(raw || "").split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
  const words = [], clues = {};
  for (const line of lines) {
    const m = line.match(/^(.+?)\s*(?:[-–:|]\s*(.+))?$/);
    if (!m) continue;
    const w = m[1].toUpperCase().replace(/[^A-Z]/g, "");
    if (w.length < 3 || w.length > 14) continue;
    words.push(w);
    if (m[2]) clues[w] = m[2].trim();
  }
  return { label: label || "Custom list", cat: "Yours", words, clues, custom: true };
}

// Short clues used for crossword generation.
const CLUES = {
  GRANITE:"Speckled hard rock", QUARTZ:"Common crystal mineral", CANYON:"Deep river-cut gorge", VALLEY:"Low land between hills",
  FOSSIL:"Ancient remains in stone", MARBLE:"Polished sculptor's stone", RIDGE:"Long crest of a hill", CAVERN:"Large cave",
  DUNE:"Wind-built sand hill", CLAY:"Potter's earth", MESA:"Flat-topped hill", CRYSTAL:"Ordered mineral form",
  CURRENT:"Flow in a river", TIDE:"Daily rise of the sea", DELTA:"River mouth deposit", SPRING:"Water rising from ground",
  REEF:"Coral ridge", MIST:"Fine airborne water", STREAM:"Small flowing water", SURF:"Breaking waves", WAVE:"Swell on the sea",
  MARSH:"Soggy lowland", DEPTH:"How far down", HARBOR:"Sheltered anchorage",
  EMBER:"Glowing coal", BLAZE:"Bright fire", CINDER:"Burnt fragment", FORGE:"Smith's fire", HEARTH:"Fireplace floor",
  BEACON:"Warning light", SPARK:"Tiny flash", SMOKE:"Fire's plume", LAVA:"Molten rock", GLOW:"Soft light",
  TORCH:"Handheld flame", FLAME:"Tongue of fire", ASH:"Fire's residue", COAL:"Black fuel", HEAT:"Warmth",
  GUST:"Sudden wind", BREEZE:"Gentle wind", VAPOR:"Gas from liquid", DRIFT:"Slow float", HAZE:"Thin obscuring air",
  CLOUD:"Sky's water mass", WIND:"Moving air", SKY:"Overhead expanse", GLIDE:"Sail without power", STORM:"Violent weather",
  SOAR:"Rise on the air", CHILL:"Slight cold",
  NEBULA:"Interstellar cloud", ORBIT:"Path around a body", COMET:"Icy visitor with a tail", GALAXY:"Vast star system",
  METEOR:"Shooting star", CRATER:"Impact bowl", COSMOS:"All that exists", LUNAR:"Of the moon", SOLAR:"Of the sun",
  VOID:"Empty space", AURORA:"Polar light show", PLASMA:"Ionized gas", ZENITH:"Highest point",
  LEGEND:"Story handed down", RIDDLE:"Puzzling question", OMEN:"Sign of things to come", MYTH:"Old sacred tale",
  ORACLE:"Teller of fates", FABLE:"Tale with a moral", SPIRIT:"Unseen presence", CHARM:"Lucky object",
  RELIC:"Surviving artifact", QUEST:"Long search", RUNE:"Old carved letter", SAGA:"Long heroic tale",
  BLOSSOM:"Open flower", PRUNE:"Trim a plant", FERN:"Frond plant", IVY:"Climbing vine", THYME:"Kitchen herb",
  BASIL:"Pesto herb", SPROUT:"Young shoot", PETAL:"Flower leaf", ROOT:"Underground anchor", HEDGE:"Living fence",
  NECTAR:"Flower's sweet", POLLEN:"Flower dust", BLOOM:"Flourish",
  WHISK:"Egg beater", LADLE:"Soup server", SIMMER:"Cook just below boiling", KNEAD:"Work dough", MINCE:"Chop finely",
  ZEST:"Citrus peel", PANTRY:"Food closet", APRON:"Cook's cover", BATTER:"Pourable mix", SEAR:"Brown quickly",
  DOUGH:"Bread base", SPICE:"Flavoring", BROTH:"Thin soup", GLAZE:"Shiny coating",
  VOYAGE:"Long trip", COMPASS:"Direction finder", TRAIL:"Marked path", CABIN:"Small lodge", FERRY:"Water shuttle",
  ROUTE:"Way taken", VISA:"Travel permit", ATLAS:"Map book", SUMMIT:"Peak", DEPART:"Set out",
  RAVEN:"Big black bird", FINCH:"Small seed-eater", CRANE:"Tall wader", TALON:"Raptor's claw", HERON:"Long-legged fisher",
  FALCON:"Fast raptor", SWIFT:"Rapid flier", WREN:"Tiny songbird", IBIS:"Curved-bill wader",
  FROST:"Icy coating", HAIL:"Ice pellets", DEW:"Morning damp", SLEET:"Icy rain", GALE:"Strong wind",
  SEASON:"Quarter of the year", CLIMATE:"Long-term weather", THUNDER:"Storm's rumble", RAINBOW:"Arc of color",
  HARMONY:"Notes together", OCTAVE:"Eight-note span", RHYTHM:"Beat pattern", MELODY:"Tune", TEMPO:"Speed of music",
  CHORUS:"Repeated part", LYRIC:"Song words", BRIDGE:"Contrasting passage", CHORD:"Stacked notes", SCALE:"Note ladder",
  VERSE:"Song stanza", TUNE:"Air", ANTHEM:"Rallying song", PRELUDE:"Opening piece",
};

// Short public-domain sayings and proverbs for cryptograms.
const SAYINGS = [
  ["Little strokes fell great oaks","Benjamin Franklin"],
  ["Well begun is half done","Proverb"],
  ["Still waters run deep","Proverb"],
  ["The tide waits for no one","Proverb"],
  ["Nothing is so strong as gentleness","Francis de Sales"],
  ["Look deep into nature and you will understand everything better","Albert Einstein"],
  ["Simplicity is the ultimate sophistication","Leonardo da Vinci"],
  ["A stone in the river shapes the water","Proverb"],
  ["Every mile is two in winter","George Herbert"],
  ["The mountain does not move but the path is found","Proverb"],
  ["Great things are done by a series of small things","Vincent van Gogh"],
  ["He who has a garden has a future","Proverb"],
  ["Small rain lays great dust","Proverb"],
  ["Where there is no wind row","Proverb"],
  ["The sea refuses no river","Proverb"],
  ["Slow fire makes sweet malt","Proverb"],
  ["Light tomorrow with today","Elizabeth Barrett Browning"],
  ["A calm sea never made a skilled sailor","Proverb"],
  ["Storms make trees take deeper roots","Proverb"],
  ["The stars are not afraid to look like fireflies","Proverb"],
];

/* ---------------------------------------------------------------- sudoku */

function solveCount(g, limit) {
  const idx = g.indexOf(0);
  if (idx === -1) return 1;
  const r = (idx / 9) | 0, c = idx % 9;
  let count = 0;
  for (let v = 1; v <= 9; v++) {
    if (ok(g, r, c, v)) {
      g[idx] = v;
      count += solveCount(g, limit - count);
      g[idx] = 0;
      if (count >= limit) return count;
    }
  }
  return count;
}
function ok(g, r, c, v) {
  for (let i = 0; i < 9; i++) { if (g[r * 9 + i] === v || g[i * 9 + c] === v) return false; }
  const br = r - (r % 3), bc = c - (c % 3);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (g[(br + i) * 9 + bc + j] === v) return false;
  return true;
}
function fill(g, pos = 0) {
  if (pos === 81) return true;
  if (g[pos]) return fill(g, pos + 1);
  const r = (pos / 9) | 0, c = pos % 9;
  for (const v of shuffle([1,2,3,4,5,6,7,8,9])) {
    if (ok(g, r, c, v)) { g[pos] = v; if (fill(g, pos + 1)) return true; g[pos] = 0; }
  }
  return false;
}
const SUDOKU_GIVENS = { beginner: 46, easy: 40, medium: 33, hard: 28, expert: 24 };

export function sudoku(difficulty = "medium") {
  const sol = new Array(81).fill(0);
  fill(sol);
  const target = SUDOKU_GIVENS[difficulty] || 33;
  const puz = sol.slice();
  let given = 81;
  for (const i of shuffle([...Array(81).keys()])) {
    if (given <= target) break;
    const keep = puz[i];
    puz[i] = 0;
    const t = puz.slice();
    if (solveCount(t, 2) !== 1) puz[i] = keep; else given--;
  }
  return { kind: "sudoku", grid: puz, solution: sol, difficulty };
}

/* ----------------------------------------------------------- word search */

const DIRS = [[1,0],[0,1],[1,1],[1,-1],[-1,0],[0,-1],[-1,-1],[-1,1]];

export function wordSearch(words, size = 15, opts = {}) {
  const { backwards = true, diagonal = true } = opts;
  const dirs = DIRS.filter((d, i) => (diagonal || d[0] === 0 || d[1] === 0) && (backwards || i < 4));
  const grid = Array.from({ length: size }, () => new Array(size).fill(""));
  const placed = [];
  for (const w of words) {
    if (w.length > size) continue;
    let done = false;
    for (let a = 0; a < 300 && !done; a++) {
      const [dr, dc] = dirs[rnd(dirs.length)];
      const r0 = rnd(size), c0 = rnd(size);
      const rE = r0 + dr * (w.length - 1), cE = c0 + dc * (w.length - 1);
      if (rE < 0 || rE >= size || cE < 0 || cE >= size) continue;
      let fits = true;
      for (let i = 0; i < w.length; i++) {
        const ch = grid[r0 + dr * i][c0 + dc * i];
        if (ch && ch !== w[i]) { fits = false; break; }
      }
      if (!fits) continue;
      for (let i = 0; i < w.length; i++) grid[r0 + dr * i][c0 + dc * i] = w[i];
      placed.push({ word: w, r: r0, c: c0, dr, dc });
      done = true;
    }
  }
  const pool = placed.map((p) => p.word).join("") || LETTERS;
  const filled = grid.map((row) => row.map((ch) => ch || (Math.random() < 0.55 ? pool[rnd(pool.length)] : LETTERS[rnd(26)])));
  return { kind: "wordsearch", grid: filled, words: placed.map((p) => p.word), placements: placed, size };
}

/* ------------------------------------------------------------- cryptogram */

export function cryptogram(i) {
  const [text, author] = SAYINGS[i % SAYINGS.length];
  let map;
  do {
    const from = LETTERS.split(""), to = shuffle(from);
    map = {};
    from.forEach((c, k) => (map[c] = to[k]));
  } while (Object.keys(map).some((k) => map[k] === k));
  const up = text.toUpperCase();
  const encoded = up.split("").map((ch) => (map[ch] ? map[ch] : ch));
  const words = [];
  let cur = [];
  encoded.forEach((ch, k) => {
    if (up[k] === " ") { words.push(cur); cur = []; } else cur.push({ c: ch, plain: up[k] });
  });
  if (cur.length) words.push(cur);
  const hint = { letter: up.replace(/[^A-Z]/g, "")[0], cipher: map[up.replace(/[^A-Z]/g, "")[0]] };
  return { kind: "cryptogram", words, plain: text, author, hint };
}

/* --------------------------------------------------------- word scramble */

export function scramble(words, count = 12) {
  const picks = shuffle(words).slice(0, count);
  return {
    kind: "scramble",
    items: picks.map((w) => {
      let s = w;
      let guard = 0;
      while (s === w && guard++ < 20) s = shuffle(w.split("")).join("");
      return { scrambled: s, answer: w };
    }),
  };
}

/* --------------------------------------------------------------- math */

const MATH_SPECS = {
  beginner: { ops: ["+","-"], max: 20, count: 24 },
  easy:     { ops: ["+","-"], max: 50, count: 24 },
  medium:   { ops: ["+","-","×"], max: 12, count: 24 },
  hard:     { ops: ["+","-","×","÷"], max: 12, count: 20 },
  expert:   { ops: ["×","÷"], max: 15, count: 20 },
};

export function mathDrill(difficulty = "medium") {
  const s = MATH_SPECS[difficulty] || MATH_SPECS.medium;
  const items = [];
  for (let i = 0; i < s.count; i++) {
    const op = s.ops[rnd(s.ops.length)];
    let a = 1 + rnd(s.max), b = 1 + rnd(s.max), ans;
    if (op === "+") ans = a + b;
    else if (op === "-") { if (b > a) [a, b] = [b, a]; ans = a - b; }
    else if (op === "×") ans = a * b;
    else { ans = a; a = a * b; }
    items.push({ q: `${a} ${op} ${b} =`, a: String(ans) });
  }
  return { kind: "math", items, difficulty };
}

/* --------------------------------------------------------------- maze */

const MAZE_SIZES = { beginner: 10, easy: 14, medium: 18, hard: 24, expert: 30 };

export function maze(difficulty = "medium") {
  const n = MAZE_SIZES[difficulty] || 18;
  const cells = Array.from({ length: n }, () => Array.from({ length: n }, () => ({ N: 1, E: 1, S: 1, W: 1, v: 0 })));
  const opp = { N: "S", S: "N", E: "W", W: "E" };
  const step = { N: [-1, 0], S: [1, 0], E: [0, 1], W: [0, -1] };
  const stack = [[0, 0]];
  cells[0][0].v = 1;
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const options = shuffle(["N","E","S","W"]).filter((d) => {
      const [dr, dc] = step[d], nr = r + dr, nc = c + dc;
      return nr >= 0 && nr < n && nc >= 0 && nc < n && !cells[nr][nc].v;
    });
    if (!options.length) { stack.pop(); continue; }
    const d = options[0], [dr, dc] = step[d], nr = r + dr, nc = c + dc;
    cells[r][c][d] = 0;
    cells[nr][nc][opp[d]] = 0;
    cells[nr][nc].v = 1;
    stack.push([nr, nc]);
  }
  // BFS solve corner to corner
  const prev = new Map();
  const q = [[0, 0]];
  const seen = new Set(["0,0"]);
  while (q.length) {
    const [r, c] = q.shift();
    if (r === n - 1 && c === n - 1) break;
    for (const d of ["N","E","S","W"]) {
      if (cells[r][c][d]) continue;
      const [dr, dc] = step[d], nr = r + dr, nc = c + dc, k = `${nr},${nc}`;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || seen.has(k)) continue;
      seen.add(k); prev.set(k, `${r},${c}`); q.push([nr, nc]);
    }
  }
  const path = [];
  let k = `${n - 1},${n - 1}`;
  while (k) { const [r, c] = k.split(",").map(Number); path.unshift([r, c]); k = prev.get(k); }
  return { kind: "maze", n, cells, path };
}

/* ------------------------------------------------------------ crossword */

// A themed crossword must actually contain the theme. Without a floor, a
// theme with few or no clued words of its own still "succeeds" by padding
// the grid with unrelated clued filler under that theme's heading — a "Dogs"
// puzzle with none of its own vocabulary in it. Today's theme lists split
// cleanly into "well covered" (9+ of 20 words clued) and "barely or not at
// all" (4 or fewer) — nothing sits in between — so 5 is the floor below which
// crossword() refuses the theme instead.
const CROSSWORD_CLUE_FLOOR = 5;

export function crossword(theme, difficulty = "medium") {
  const size = difficulty === "beginner" || difficulty === "easy" ? 11 : difficulty === "expert" ? 15 : 13;
  const th = theme && theme.words ? theme : THEMES.none;
  const clueFor = (w) => (th.clues && th.clues[w]) || CLUES[w] || null;
  // Only words with a real clue are eligible — an unclued word placed in the
  // grid has nothing honest to print next to its number.
  const cluedPool = shuffle(th.words.filter((w) => w.length <= size && clueFor(w)));
  if (th !== THEMES.none && cluedPool.length < CROSSWORD_CLUE_FLOOR) return null;
  const extra = shuffle(Object.keys(CLUES)).filter((w) => w.length <= size && !cluedPool.includes(w));
  const words = cluedPool.concat(extra);
  if (!words.length) return null;
  const grid = Array.from({ length: size }, () => new Array(size).fill(null));
  const entries = [];
  const put = (w, r, c, horiz) => {
    for (let i = 0; i < w.length; i++) grid[r + (horiz ? 0 : i)][c + (horiz ? i : 0)] = w[i];
    entries.push({ word: w, r, c, horiz, clue: clueFor(w) });
  };
  const fitsAt = (w, r, c, horiz) => {
    if (horiz ? c + w.length > size : r + w.length > size) return false;
    if (r < 0 || c < 0) return false;
    let crosses = 0;
    // no touching before/after
    const bR = r - (horiz ? 0 : 1), bC = c - (horiz ? 1 : 0);
    const aR = r + (horiz ? 0 : w.length), aC = c + (horiz ? w.length : 0);
    if (bR >= 0 && bC >= 0 && grid[bR][bC]) return false;
    if (aR < size && aC < size && grid[aR][aC]) return false;
    for (let i = 0; i < w.length; i++) {
      const rr = r + (horiz ? 0 : i), cc = c + (horiz ? i : 0);
      const g = grid[rr][cc];
      if (g) { if (g !== w[i]) return false; crosses++; continue; }
      // side neighbours must be empty (no accidental parallel words)
      const s1 = horiz ? [rr - 1, cc] : [rr, cc - 1];
      const s2 = horiz ? [rr + 1, cc] : [rr, cc + 1];
      for (const [sr, sc] of [s1, s2]) if (sr >= 0 && sr < size && sc >= 0 && sc < size && grid[sr][sc]) return false;
    }
    return crosses > 0;
  };
  const first = words[0];
  put(first, (size / 2) | 0, Math.max(0, (((size - first.length) / 2) | 0)), true);
  const target = difficulty === "expert" ? 20 : 14;
  for (const w of words.slice(1)) {
    if (entries.length >= target) break;
    let done = false;
    const spots = [];
    for (let r = 0; r < size && !done; r++) for (let c = 0; c < size; c++) {
      if (!grid[r][c]) continue;
      for (let i = 0; i < w.length; i++) {
        if (w[i] !== grid[r][c]) continue;
        spots.push([w, r, c - i, true], [w, r - i, c, false]);
      }
    }
    for (const [ww, r, c, h] of shuffle(spots)) {
      if (r < 0 || c < 0) continue;
      if (fitsAt(ww, r, c, h)) { put(ww, r, c, h); done = true; break; }
    }
  }
  // number entries in reading order
  const starts = entries.slice().sort((a, b) => a.r - b.r || a.c - b.c);
  const numAt = new Map();
  let num = 0;
  for (const e of starts) {
    const k = `${e.r},${e.c}`;
    if (!numAt.has(k)) numAt.set(k, ++num);
    e.num = numAt.get(k);
  }
  return {
    kind: "crossword", size, grid, entries,
    across: entries.filter((e) => e.horiz).sort((a, b) => a.num - b.num),
    down: entries.filter((e) => !e.horiz).sort((a, b) => a.num - b.num),
    numbers: [...numAt.entries()].map(([k, n]) => ({ r: +k.split(",")[0], c: +k.split(",")[1], n })),
  };
}

/* --------------------------------------------------------------- kenken */

const KEN_SIZES = { beginner: 4, easy: 4, medium: 5, hard: 6, expert: 6 };

function latin(n) {
  const base = shuffle([...Array(n).keys()].map((i) => i + 1));
  const rows = shuffle([...Array(n).keys()]);
  return rows.map((off) => base.map((_, i) => base[(i + off) % n]));
}
function kenSolutions(sol, cages, n, limit = 2) {
  const grid = Array.from({ length: n }, () => new Array(n).fill(0));
  const cageOf = new Map();
  cages.forEach((cg, i) => cg.cells.forEach(([r, c]) => cageOf.set(`${r},${c}`, i)));
  let found = 0;
  const cageOk = (i) => {
    const cg = cages[i];
    const vals = cg.cells.map(([r, c]) => grid[r][c]);
    if (vals.some((v) => !v)) return true;
    if (cg.op === "=") return vals[0] === cg.target;
    if (cg.op === "+") return vals.reduce((a, b) => a + b, 0) === cg.target;
    if (cg.op === "×") return vals.reduce((a, b) => a * b, 1) === cg.target;
    if (cg.op === "-") return Math.abs(vals[0] - vals[1]) === cg.target;
    const [a, b] = vals.sort((x, y) => y - x);
    return a / b === cg.target;
  };
  const partialOk = (i) => {
    const cg = cages[i];
    const vals = cg.cells.map(([r, c]) => grid[r][c]).filter(Boolean);
    if (cg.op === "+") return vals.reduce((a, b) => a + b, 0) <= cg.target;
    if (cg.op === "×") return cg.target % vals.reduce((a, b) => a * b, 1) === 0;
    return true;
  };
  const rec = (pos) => {
    if (found >= limit) return;
    if (pos === n * n) { found++; return; }
    const r = (pos / n) | 0, c = pos % n;
    for (let v = 1; v <= n; v++) {
      let clash = false;
      for (let i = 0; i < n; i++) if (grid[r][i] === v || grid[i][c] === v) { clash = true; break; }
      if (clash) continue;
      grid[r][c] = v;
      const ci = cageOf.get(`${r},${c}`);
      if (partialOk(ci) && cageOk(ci)) rec(pos + 1);
      grid[r][c] = 0;
    }
  };
  rec(0);
  return found;
}

export function kenken(difficulty = "medium") {
  const n = KEN_SIZES[difficulty] || 5;
  for (let attempt = 0; attempt < 40; attempt++) {
    const sol = latin(n);
    const unassigned = shuffle([...Array(n * n).keys()]);
    const owner = new Array(n * n).fill(-1);
    const cages = [];
    for (const start of unassigned) {
      if (owner[start] !== -1) continue;
      const maxSize = Math.random() < 0.15 ? 1 : 2 + rnd(difficulty === "beginner" ? 1 : 2);
      const cellsIdx = [start];
      owner[start] = cages.length;
      while (cellsIdx.length < maxSize) {
        const from = cellsIdx[rnd(cellsIdx.length)];
        const r = (from / n) | 0, c = from % n;
        const nb = shuffle([[r-1,c],[r+1,c],[r,c-1],[r,c+1]]).find(([rr, cc]) => rr >= 0 && rr < n && cc >= 0 && cc < n && owner[rr * n + cc] === -1);
        if (!nb) break;
        const idx = nb[0] * n + nb[1];
        owner[idx] = cages.length;
        cellsIdx.push(idx);
      }
      const cells = cellsIdx.map((i) => [(i / n) | 0, i % n]);
      const vals = cells.map(([r, c]) => sol[r][c]);
      let op = "=", target = vals[0];
      if (cells.length === 2) {
        const [a, b] = vals.slice().sort((x, y) => y - x);
        const choices = [["+", a + b], ["-", a - b]];
        if (a % b === 0) choices.push(["÷", a / b]);
        if (difficulty !== "beginner") choices.push(["×", a * b]);
        [op, target] = choices[rnd(choices.length)];
      } else if (cells.length > 2) {
        op = Math.random() < 0.6 ? "+" : "×";
        target = op === "+" ? vals.reduce((a, b) => a + b, 0) : vals.reduce((a, b) => a * b, 1);
      }
      cages.push({ cells, op, target });
    }
    if (kenSolutions(sol, cages, n) === 1) {
      const cageIdx = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => owner[r * n + c]));
      return { kind: "kenken", n, cages, solution: sol, cageIdx, difficulty };
    }
  }
  return kenken("beginner");
}

/* ------------------------------------------------------------- KDP math */

export const TRIMS = [
  { id: "5.5x8.5", w: 5.5, h: 8.5, label: '5.5 × 8.5"' },
  { id: "6x9", w: 6, h: 9, label: '6 × 9"' },
  { id: "7x10", w: 7, h: 10, label: '7 × 10"' },
  { id: "8x10", w: 8, h: 10, label: '8 × 10"' },
  { id: "8.5x11", w: 8.5, h: 11, label: '8.5 × 11"' },
  { id: "a4", w: 8.27, h: 11.69, label: "A4 (21 × 29.7 cm)" },
];

export const PAPER = { white: 0.002252, cream: 0.0025, color: 0.002347 };

export function gutter(pages) {
  if (pages <= 150) return 0.375;
  if (pages <= 300) return 0.5;
  if (pages <= 500) return 0.625;
  if (pages <= 700) return 0.75;
  return 0.875;
}

export function kdpSpec({ trim, pages, paper = "white", bleed = false }) {
  const t = TRIMS.find((x) => x.id === trim) || TRIMS[1];
  const spine = +(pages * PAPER[paper]).toFixed(4);
  const outside = bleed ? 0.5 : 0.375;
  return {
    trim: t,
    pages,
    paper,
    spine,
    gutter: gutter(pages),
    outside,
    top: bleed ? 0.5 : 0.375,
    live: { w: +(t.w - outside - gutter(pages)).toFixed(3), h: +(t.h - 2 * (bleed ? 0.5 : 0.375)).toFixed(3) },
    cover: {
      w: +(t.w * 2 + spine + 0.25).toFixed(3),
      h: +(t.h + 0.25).toFixed(3),
      safe: 0.25,
      spineTextOk: pages >= 79,
    },
  };
}
