// Auto-generated from the ES modules. Do not edit by hand.

/* ===== puzzle-engine.js -> globalThis.PZ_ENGINE ===== */
(function(){
// Puzzle generation + KDP geometry. Pure logic, no DOM.

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ---------------------------------------------------------------- themes */

const THEMES = {
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

function customTheme(label, raw) {
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

function sudoku(difficulty = "medium") {
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

function wordSearch(words, size = 15, opts = {}) {
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

function cryptogram(i) {
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

function scramble(words, count = 12) {
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

function mathDrill(difficulty = "medium") {
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

function maze(difficulty = "medium") {
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

function crossword(theme, difficulty = "medium") {
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

function kenken(difficulty = "medium") {
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

const TRIMS = [
  { id: "5.5x8.5", w: 5.5, h: 8.5, label: '5.5 × 8.5"' },
  { id: "6x9", w: 6, h: 9, label: '6 × 9"' },
  { id: "7x10", w: 7, h: 10, label: '7 × 10"' },
  { id: "8x10", w: 8, h: 10, label: '8 × 10"' },
  { id: "8.5x11", w: 8.5, h: 11, label: '8.5 × 11"' },
  { id: "a4", w: 8.27, h: 11.69, label: "A4 (21 × 29.7 cm)" },
];

const PAPER = { white: 0.002252, cream: 0.0025, color: 0.002347 };

function gutter(pages) {
  if (pages <= 150) return 0.375;
  if (pages <= 300) return 0.5;
  if (pages <= 500) return 0.625;
  if (pages <= 700) return 0.75;
  return 0.875;
}

function kdpSpec({ trim, pages, paper = "white", bleed = false }) {
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

globalThis.PZ_ENGINE = { THEMES, customTheme, sudoku, wordSearch, cryptogram, scramble, mathDrill, maze, crossword, kenken, TRIMS, PAPER, gutter, kdpSpec };
})();

/* ===== puzzle-engine-extra.js -> globalThis.PZ_EXTRA ===== */
(function(){
// Additional puzzle generators. Every generator returns a puzzle with a known,
// verified solution. Pure logic, no DOM.

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const range = (n) => [...Array(n).keys()];

/* ============================================================ sudoku variants
   One generalised engine: any size, any region map, optional diagonal rule. */

function regionsBox(n, bh, bw) {
  const map = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) map[r * n + c] = Math.floor(r / bh) * (n / bw) + Math.floor(c / bw);
  return map;
}

function regionsJigsaw(n) {
  // grow n contiguous regions of n cells each
  for (let attempt = 0; attempt < 60; attempt++) {
    const map = new Array(n * n).fill(-1);
    const seeds = shuffle(range(n * n)).slice(0, n);
    const frontier = seeds.map((s, i) => { map[s] = i; return [s]; });
    const sizes = new Array(n).fill(1);
    let placed = n, ok = true;
    while (placed < n * n) {
      let moved = false;
      for (let i = 0; i < n; i++) {
        if (sizes[i] >= n) continue;
        const cands = [];
        for (const cell of frontier[i]) {
          const r = (cell / n) | 0, c = cell % n;
          for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
            if (map[nr * n + nc] === -1) cands.push(nr * n + nc);
          }
        }
        if (!cands.length) continue;
        const pick = cands[rnd(cands.length)];
        map[pick] = i; frontier[i].push(pick); sizes[i]++; placed++; moved = true;
      }
      if (!moved) { ok = false; break; }
    }
    if (ok && sizes.every((s) => s === n)) return map;
  }
  return regionsBox(9, 3, 3);
}

function makeSolver(n, regions, diagonals) {
  const peers = [];
  for (let i = 0; i < n * n; i++) {
    const r = (i / n) | 0, c = i % n, set = new Set();
    for (let k = 0; k < n; k++) { set.add(r * n + k); set.add(k * n + c); }
    for (let j = 0; j < n * n; j++) if (regions[j] === regions[i]) set.add(j);
    if (diagonals) {
      if (r === c) for (let k = 0; k < n; k++) set.add(k * n + k);
      if (r + c === n - 1) for (let k = 0; k < n; k++) set.add(k * n + (n - 1 - k));
    }
    set.delete(i);
    peers.push([...set]);
  }
  const ok = (g, i, v) => !peers[i].some((p) => g[p] === v);
  const count = (g, limit) => {
    let best = -1, bestOpts = null;
    for (let i = 0; i < g.length; i++) {
      if (g[i]) continue;
      const opts = [];
      for (let v = 1; v <= n; v++) if (ok(g, i, v)) opts.push(v);
      if (!opts.length) return 0;
      if (!bestOpts || opts.length < bestOpts.length) { best = i; bestOpts = opts; if (opts.length === 1) break; }
    }
    if (best === -1) return 1;
    let found = 0;
    for (const v of bestOpts) {
      g[best] = v;
      found += count(g, limit - found);
      g[best] = 0;
      if (found >= limit) break;
    }
    return found;
  };
  const fill = (g, pos = 0) => {
    if (pos === g.length) return true;
    if (g[pos]) return fill(g, pos + 1);
    for (const v of shuffle(range(n).map((x) => x + 1))) {
      if (ok(g, pos, v)) { g[pos] = v; if (fill(g, pos + 1)) return true; g[pos] = 0; }
    }
    return false;
  };
  return { ok, count, fill, peers };
}

const GIVEN_RATIO = { beginner: 0.58, easy: 0.5, medium: 0.42, hard: 0.34, expert: 0.28 };

function sudokuVariant(opts = {}) {
  const { size = 9, variant = "classic", difficulty = "medium" } = opts;
  const n = size;
  const regions = variant === "irregular" ? regionsJigsaw(n)
    : n === 6 ? regionsBox(6, 2, 3)
    : n === 12 ? regionsBox(12, 3, 4)
    : n === 4 ? regionsBox(4, 2, 2)
    : regionsBox(9, 3, 3);
  const diagonals = variant === "x";
  const S = makeSolver(n, regions, diagonals);
  const sol = new Array(n * n).fill(0);
  S.fill(sol);
  const target = Math.round(n * n * (GIVEN_RATIO[difficulty] || 0.42));
  const puz = sol.slice();
  let given = n * n;
  for (const i of shuffle(range(n * n))) {
    if (given <= target) break;
    const keep = puz[i];
    puz[i] = 0;
    if (S.count(puz.slice(), 2) !== 1) puz[i] = keep; else given--;
  }
  return {
    kind: variant === "classic" ? (n === 9 ? "sudoku" : "sudokuN") : variant === "x" ? "xsudoku" : "irregular",
    n, regions, diagonals, grid: puz, solution: sol, difficulty, givens: given,
    title: variant === "x" ? "X-Sudoku" : variant === "irregular" ? "Jigsaw Sudoku" : `Sudoku ${n}×${n}`,
  };
}

/* ==================================================================== kakuro */

function runSums(len, target, maxDigit = 9) {
  // all sets of `len` distinct digits 1..maxDigit summing to target
  const out = [];
  const rec = (start, left, sum, acc) => {
    if (!left) { if (sum === 0) out.push(acc.slice()); return; }
    for (let d = start; d <= maxDigit; d++) {
      if (d > sum) break;
      acc.push(d); rec(d + 1, left - 1, sum - d, acc); acc.pop();
    }
  };
  rec(1, len, target, []);
  return out;
}

// Digits that can legally appear anywhere in a run of `len` distinct digits
// summing to `target`. Used to prune the uniqueness search hard.
const RUN_DIGIT_CACHE = new Map();
function runDigits(len, target) {
  const k = len * 100 + target;
  const hit = RUN_DIGIT_CACHE.get(k);
  if (hit !== undefined) return hit;
  let mask = 0;
  for (const combo of runSums(len, target)) for (const d of combo) mask |= 1 << d;
  RUN_DIGIT_CACHE.set(k, mask);
  return mask;
}

// Denser block patterns mean shorter runs, which is what makes a kakuro
// uniquely solvable at all — sparse grids with long runs admit many solutions
// and the uniqueness search then costs seconds for nothing.
const KAKURO_SHAPE = {
  beginner: { n: 6, density: 0.42 },
  easy: { n: 7, density: 0.44 },
  medium: { n: 8, density: 0.46 },
  hard: { n: 9, density: 0.48 },
  expert: { n: 10, density: 0.5 },
};

function kakuro(difficulty = "medium") {
  const order = ["expert", "hard", "medium", "easy", "beginner"];
  const want = KAKURO_SHAPE[difficulty] ? difficulty : "medium";
  // Try the requested shape, then progressively smaller ones, each with a time
  // budget. Never recurses, so a pathological search can not spin forever.
  for (let s = Math.max(0, order.indexOf(want)); s < order.length; s++) {
    const got = kakuroAttempt(KAKURO_SHAPE[order[s]], difficulty, 400);
    if (got) return got;
  }
  // Last resort: smallest grid, longest budget. Bounded, and in practice never
  // reached — beginner succeeds in tens of milliseconds.
  return kakuroAttempt(KAKURO_SHAPE.beginner, difficulty, 3000) || kakuroAttempt({ n: 5, density: 0.45 }, difficulty, 3000);
}

function kakuroAttempt(shape, difficulty, budgetMs) {
  const n = shape.n;
  const deadline = Date.now() + budgetMs;
  for (let attempt = 0; attempt < 4000; attempt++) {
    if (Date.now() > deadline) return null;
    // block pattern: first row/col are clue cells, plus scattered blocks
    const block = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => r === 0 || c === 0));
    for (let r = 1; r < n; r++) for (let c = 1; c < n; c++) if (Math.random() < shape.density) block[r][c] = true;
    // reject runs of length 1 or > 9
    const runsOf = (horiz) => {
      const runs = [];
      for (let a = 1; a < n; a++) {
        let cur = [];
        for (let b = 1; b < n; b++) {
          const r = horiz ? a : b, c = horiz ? b : a;
          if (block[r][c]) { if (cur.length) runs.push(cur); cur = []; }
          else cur.push([r, c]);
        }
        if (cur.length) runs.push(cur);
      }
      return runs;
    };
    const across = runsOf(true), down = runsOf(false);
    // Repair rather than reject: a length-1 run has no sum puzzle in it, so turn
    // that cell into a block and re-derive. Cells only ever become blocks, so
    // this converges. Rejecting instead made almost every pattern unusable.
    let repaired = true, guard = 0;
    while (repaired && guard++ < n * n) {
      repaired = false;
      for (const run of runsOf(true).concat(runsOf(false))) {
        if (run.length === 1) { block[run[0][0]][run[0][1]] = true; repaired = true; }
      }
    }
    const all = runsOf(true).concat(runsOf(false));
    const openCount = all.reduce((a, r) => a + r.length, 0);
    if (!all.length || all.some((r) => r.length < 2 || r.length > 9)) continue;
    // too sparse and the grid is mostly blocks rather than a puzzle
    if (openCount < (n - 1) * (n - 1) * 0.3) continue;
    // fill values: distinct within each run
    const val = Array.from({ length: n }, () => new Array(n).fill(0));
    const fits = (r, c, v) => {
      for (const run of all) if (run.some(([rr, cc]) => rr === r && cc === c) && run.some(([rr, cc]) => val[rr][cc] === v)) return false;
      return true;
    };
    const cells = [];
    for (let r = 1; r < n; r++) for (let c = 1; c < n; c++) if (!block[r][c]) cells.push([r, c]);
    const fill = (i) => {
      if (i === cells.length) return true;
      const [r, c] = cells[i];
      for (const v of shuffle(range(9).map((x) => x + 1))) {
        if (fits(r, c, v)) { val[r][c] = v; if (fill(i + 1)) return true; val[r][c] = 0; }
      }
      return false;
    };
    if (!fill(0)) continue;
    const clueList = all.map((run) => ({
      cells: run,
      horiz: run.length > 1 && run[0][0] === run[1][0],
      sum: run.reduce((s, [r, c]) => s + val[r][c], 0),
    }));
    // uniqueness: solve by run-combination search. -1 means the search blew its
    // node budget, which is treated exactly like "not unique" — discard and retry.
    const solutions = kakuroSolutions(n, block, clueList, 2, 40000);
    if (solutions !== 1) continue;
    const clues = Array.from({ length: n }, () => new Array(n).fill(null));
    for (const cl of clueList) {
      const [r0, c0] = cl.cells[0];
      const r = cl.horiz ? r0 : r0 - 1, c = cl.horiz ? c0 - 1 : c0;
      clues[r][c] = clues[r][c] || { across: null, down: null };
      if (cl.horiz) clues[r][c].across = cl.sum; else clues[r][c].down = cl.sum;
    }
    return { kind: "kakuro", n, block, clues, solution: val, runs: clueList, difficulty };
  }
  return null;
}

// Returns the number of solutions found (capped at `limit`), or -1 if the node
// budget was exhausted before the search completed.
function kakuroSolutions(n, block, runs, limit, budget = 120000) {
  const grid = Array.from({ length: n }, () => new Array(n).fill(0));
  const open = [];
  for (let r = 1; r < n; r++) for (let c = 1; c < n; c++) if (!block[r][c]) open.push([r, c]);

  const key = (r, c) => r * n + c;
  const runsFor = new Map();
  open.forEach(([r, c]) => runsFor.set(key(r, c), runs.filter((run) => run.cells.some(([rr, cc]) => rr === r && cc === c))));
  // Precomputed legal-digit mask per run — the strongest available pruning.
  const maskOf = new Map();
  for (const run of runs) maskOf.set(run, runDigits(run.cells.length, run.sum));

  // Order cells so each one shares a run with cells already placed; this makes
  // both across and down constraints bite immediately instead of at the leaves.
  const cells = [];
  const placed = new Set();
  const touch = new Map(open.map(([r, c]) => [key(r, c), 0]));
  while (cells.length < open.length) {
    let best = null, bestScore = -Infinity;
    for (const [r, c] of open) {
      const k = key(r, c);
      if (placed.has(k)) continue;
      const score = touch.get(k) * 100 - runsFor.get(k).reduce((a, run) => a + run.cells.length, 0);
      if (score > bestScore) { bestScore = score; best = [r, c]; }
    }
    const k = key(best[0], best[1]);
    placed.add(k);
    cells.push(best);
    for (const run of runsFor.get(k)) {
      for (const [rr, cc] of run.cells) {
        const kk = key(rr, cc);
        if (!placed.has(kk)) touch.set(kk, (touch.get(kk) || 0) + 1);
      }
    }
  }

  let found = 0, nodes = 0, blown = false;
  const rec = (i) => {
    if (blown || found >= limit) return;
    if (++nodes > budget) { blown = true; return; }
    if (i === cells.length) { found++; return; }
    const [r, c] = cells[i];
    const mine = runsFor.get(key(r, c));
    let allowed = 0x3fe; // digits 1..9
    for (const run of mine) allowed &= maskOf.get(run);
    for (let v = 1; v <= 9; v++) {
      if (!(allowed & (1 << v))) continue;
      let ok = true;
      for (const run of mine) {
        let sum = v, empty = 0, dup = false;
        for (const [rr, cc] of run.cells) {
          if (rr === r && cc === c) continue;
          const g = grid[rr][cc];
          if (g === v) { dup = true; break; }
          if (g) sum += g; else empty++;
        }
        // remaining cells need distinct unused digits, so bound the tail sum
        if (dup || sum + empty > run.sum || (empty === 0 && sum !== run.sum)) { ok = false; break; }
      }
      if (!ok) continue;
      grid[r][c] = v; rec(i + 1); grid[r][c] = 0;
      if (blown || found >= limit) return;
    }
  };
  rec(0);
  return blown ? -1 : found;
}

/* ================================================================= nonogram */

function nonogram(difficulty = "medium") {
  const n = { beginner: 5, easy: 8, medium: 10, hard: 12, expert: 15 }[difficulty] || 10;
  const density = 0.55;
  const nodeBudget = 400000;
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    const g = Array.from({ length: n }, () => Array.from({ length: n }, () => (Math.random() < density ? 1 : 0)));
    const clues = (line) => {
      const out = [];
      let run = 0;
      line.forEach((v) => { if (v) run++; else if (run) { out.push(run); run = 0; } });
      if (run) out.push(run);
      return out.length ? out : [0];
    };
    const rows = g.map(clues);
    const cols = range(n).map((c) => clues(g.map((row) => row[c])));
    if (rows.some((r) => r[0] === 0) || cols.some((c) => c[0] === 0)) continue;
    // "inconclusive" (budget blown) is treated exactly like "ambiguous" — a
    // grid we cannot prove unique is not safe to print either.
    const u = nonogramSolutions(rows, cols, n, 2, nodeBudget);
    if (u.blown || u.count !== 1) continue;
    return { kind: "nonogram", n, rows, cols, solution: g, difficulty };
  }
  return null;
}

function linePatterns(clue, len) {
  const out = [];
  const rec = (i, pos, acc) => {
    if (i === clue.length) { out.push(acc.concat(new Array(len - acc.length).fill(0))); return; }
    const remaining = clue.slice(i).reduce((a, b) => a + b, 0) + (clue.length - i - 1);
    for (let s = pos; s <= len - remaining; s++) {
      const next = acc.concat(new Array(s - acc.length).fill(0), new Array(clue[i]).fill(1));
      if (i < clue.length - 1) next.push(0);
      rec(i + 1, next.length, next);
    }
  };
  rec(0, 0, []);
  return out;
}

// Returns { count, blown } — count capped at `limit`; blown means the node
// budget ran out before the search could finish, which the caller treats
// exactly like "not unique" rather than assuming success.
function nonogramSolutions(rows, cols, n, limit, nodeBudget) {
  const rowOpts = rows.map((c) => linePatterns(c, n));
  if (rowOpts.some((o) => !o.length)) return { count: 0, blown: false };
  let found = 0, nodes = 0, blown = false;
  const grid = [];
  const colOk = (depth) => {
    for (let c = 0; c < n; c++) {
      const partial = [];
      for (let r = 0; r < depth; r++) partial.push(grid[r][c]);
      // prefix feasibility against col clue
      const need = cols[c];
      const runs = [];
      let run = 0;
      partial.forEach((v) => { if (v) run++; else if (run) { runs.push(run); run = 0; } });
      const closed = runs.length;
      if (closed > need.length) return false;
      for (let i = 0; i < closed; i++) if (runs[i] !== need[i]) return false;
      if (run && (closed >= need.length || run > need[closed])) return false;
      const placed = runs.reduce((a, b) => a + b, 0) + run;
      const total = need.reduce((a, b) => a + b, 0);
      if (placed > total) return false;
      if (depth === n && (placed !== total || (run ? closed + 1 : closed) !== need.length)) return false;
    }
    return true;
  };
  const rec = (r) => {
    if (blown || found >= limit) return;
    if (++nodes > nodeBudget) { blown = true; return; }
    if (r === n) { found++; return; }
    for (const opt of rowOpts[r]) {
      grid[r] = opt;
      if (colOk(r + 1)) rec(r + 1);
      if (blown || found >= limit) return;
    }
    grid.length = r;
  };
  rec(0);
  return { count: found, blown };
}

/* ============================================================== logic grids */

const LOGIC_SETS = [
  { subject: "Neighbour", items: ["Alice", "Bram", "Cleo", "Dov", "Esme"], cats: [
    { name: "House colour", items: ["blue", "green", "grey", "yellow", "red"] },
    { name: "Pet", items: ["cat", "dog", "parrot", "turtle", "rabbit"] },
    { name: "Car", items: ["estate", "hatchback", "pickup", "saloon", "van"] },
    { name: "Street", items: ["Ash Lane", "Birch Row", "Cedar Way", "Dell Road", "Elm Rise"] }] },
  { subject: "Friend", items: ["Nadia", "Otto", "Pia", "Quinn", "Rex"], cats: [
    { name: "Drink", items: ["coffee", "cocoa", "tea", "cider", "lemonade"] },
    { name: "Day off", items: ["Monday", "Tuesday", "Friday", "Sunday", "Thursday"] },
    { name: "Hobby", items: ["birding", "knitting", "pottery", "running", "sketching"] },
    { name: "Hometown", items: ["Bangor", "Denver", "Mobile", "Salem", "Tucson"] }] },
  { subject: "Baker", items: ["Ruth", "Sam", "Tess", "Uma", "Vince"], cats: [
    { name: "Bake", items: ["brioche", "scones", "tart", "rye loaf", "babka"] },
    { name: "Ribbon", items: ["first", "second", "third", "fourth", "fifth"] },
    { name: "Filling", items: ["apple", "cherry", "custard", "pecan", "plum"] },
    { name: "Oven", items: ["back left", "back right", "centre", "front left", "front right"] }] },
  { subject: "Gardener", items: ["Vic", "Wren", "Xan", "Yuri", "Zola"], cats: [
    { name: "Plant", items: ["basil", "dahlia", "fern", "tomato", "lupin"] },
    { name: "Plot", items: ["north", "south", "east", "west", "centre"] },
    { name: "Tool", items: ["dibber", "hoe", "rake", "trowel", "shears"] },
    { name: "Watering day", items: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"] }] },
  { subject: "Sailor", items: ["Bo", "Cass", "Dee", "Finn", "Gale"], cats: [
    { name: "Boat", items: ["Kestrel", "Mariner", "Petrel", "Sandpiper", "Tern"] },
    { name: "Sail colour", items: ["amber", "crimson", "ivory", "navy", "teal"] },
    { name: "Catch", items: ["cod", "haddock", "mackerel", "pollock", "skate"] },
    { name: "Berth", items: ["one", "two", "three", "four", "five"] }] },
  { subject: "Camper", items: ["Hal", "Iris", "Jo", "Kit", "Lena"], cats: [
    { name: "Tent colour", items: ["blue", "forest", "orange", "sand", "slate"] },
    { name: "Site", items: ["creekside", "hilltop", "meadow", "pine grove", "lakeside"] },
    { name: "Supper", items: ["chilli", "foil packets", "pancakes", "stew", "tacos"] },
    { name: "Arrival", items: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }] },
];

const LOGIC_SHAPE = {
  beginner: { n: 3, c: 2 },
  easy: { n: 4, c: 2 },
  medium: { n: 4, c: 3 },
  hard: { n: 5, c: 3 },
  expert: { n: 5, c: 4 },
};

function permutations(n) {
  const out = [];
  const rec = (acc, left) => {
    if (!left.length) { out.push(acc.slice()); return; }
    for (let i = 0; i < left.length; i++) {
      acc.push(left[i]);
      rec(acc, left.slice(0, i).concat(left.slice(i + 1)));
      acc.pop();
    }
  };
  rec([], range(n));
  return out;
}

// A clue is a predicate over `assign` (assign[ci][subjectIndex] = itemIndex),
// plus the categories it mentions so the solver knows when it can be tested.
function logicCluePool(set, n, c, assign) {
  const sub = (i) => set.items[i];
  const cat = (ci) => set.cats[ci].name.toLowerCase();
  const item = (ci, vi) => set.cats[ci].items[vi];
  const out = [];
  for (let si = 0; si < n; si++) {
    for (let ci = 0; ci < c; ci++) {
      out.push({ cats: [ci], weight: 1,
        text: `${sub(si)}'s ${cat(ci)} is ${item(ci, assign[ci][si])}.`,
        test: (a) => a[ci][si] === assign[ci][si] });
      for (let vi = 0; vi < n; vi++) {
        if (vi === assign[ci][si]) continue;
        out.push({ cats: [ci], weight: 3,
          text: `${sub(si)}'s ${cat(ci)} is not ${item(ci, vi)}.`,
          test: (a) => a[ci][si] !== vi });
      }
    }
  }
  for (let a1 = 0; a1 < c; a1++) for (let b1 = 0; b1 < c; b1++) {
    if (a1 === b1) continue;
    for (let si = 0; si < n; si++) {
      const xa = assign[a1][si], yb = assign[b1][si];
      out.push({ cats: [a1, b1], weight: 2,
        text: `Whoever has ${item(a1, xa)} for ${cat(a1)} also has ${item(b1, yb)} for ${cat(b1)}.`,
        test: (arr) => { const i = arr[a1].indexOf(xa); return i >= 0 && arr[b1][i] === yb; } });
      for (let vj = 0; vj < n; vj++) {
        if (vj === yb) continue;
        out.push({ cats: [a1, b1], weight: 4,
          text: `Whoever has ${item(a1, xa)} for ${cat(a1)} does not have ${item(b1, vj)} for ${cat(b1)}.`,
          test: (arr) => { const i = arr[a1].indexOf(xa); return i >= 0 && arr[b1][i] !== vj; } });
      }
    }
  }
  return out;
}

function logicSolutions(clues, n, c, perms, limit) {
  let found = 0, nodes = 0;
  const chosen = [];
  const rec = (ci) => {
    if (found >= limit || ++nodes > 300000) return;
    if (ci === c) { found++; return; }
    for (const p of perms) {
      chosen[ci] = p;
      let ok = true;
      for (const cl of clues) {
        if (cl.cats.some((x) => x > ci)) continue;
        if (!cl.test(chosen)) { ok = false; break; }
      }
      if (ok) rec(ci + 1);
      if (found >= limit) { chosen.length = ci; return; }
    }
    chosen.length = ci;
  };
  rec(0);
  return found;
}

function logicGrid(difficulty = "medium", seed = 0) {
  const shape = LOGIC_SHAPE[difficulty] || LOGIC_SHAPE.medium;
  const n = shape.n, c = shape.c;
  const base = LOGIC_SETS[seed % LOGIC_SETS.length];
  const catPick = shuffle(range(base.cats.length)).slice(0, c).sort((a, b) => a - b);
  const set = {
    subject: base.subject,
    items: base.items.slice(0, n),
    cats: catPick.map((i) => ({ name: base.cats[i].name, items: base.cats[i].items.slice(0, n) })),
  };
  const perms = permutations(n);
  const assign = set.cats.map(() => shuffle(range(n)));
  // Clue mix matters more than clue count. Sorting purely by weight fills the
  // list with "X's pet is the dog" givens until the grid is simply stated — a
  // lookup table, not a deduction. So allow only a couple of outright givens
  // and make the solver work from negatives and cross-category links.
  const pool = logicCluePool(set, n, c, assign);
  const posQuota = difficulty === "beginner" ? 2 : 1;
  const positives = shuffle(pool.filter((cl) => cl.weight === 1)).slice(0, posQuota);
  const rest = shuffle(pool.filter((cl) => cl.weight !== 1));
  const clues = [];
  // Growing one clue at a time means a full solve per clue, which at 5×4 costs
  // about a second. Add in small batches, then let the prune pass below remove
  // whatever the batch overshot — same result, roughly a third of the solves.
  const batch = n * c >= 15 ? 4 : n * c >= 12 ? 3 : 1;
  const queue = positives.concat(rest);
  for (let i = 0; i < queue.length; i += batch) {
    if (logicSolutions(clues, n, c, perms, 2) === 1) break;
    for (let j = i; j < Math.min(i + batch, queue.length); j++) clues.push(queue[j]);
  }
  for (let i = clues.length - 1; i >= 0; i--) {
    const without = clues.slice(0, i).concat(clues.slice(i + 1));
    if (logicSolutions(without, n, c, perms, 2) === 1) clues.splice(i, 1);
  }
  const truth = set.items.map((_, i) => set.cats.map((cat, ci) => cat.items[assign[ci][i]]));
  return {
    kind: "logicgrid", subject: base.subject, subjects: set.items, cats: set.cats,
    unique: logicSolutions(clues, n, c, perms, 2) === 1,
    clues: shuffle(clues).map((cl, i) => ({ n: i + 1, text: cl.text })),
    solution: truth, difficulty,
  };
}

/* ============================================================== word ladder */

const LADDER_DICT = "ABLE ACHE ACID AGED AIDE ALSO AREA BAKE BALD BALE BALL BAND BANE BANK BARE BARK BARN BASE BASK BATE BEAD BEAM BEAN BEAR BEAT BELL BELT BEND BENT BEST BIKE BILL BIND BIRD BITE BLED BLOW BLUE BOAR BOAT BOLD BOLT BONE BOOK BOOM BOOT BORE BORN BOWL BRAG BRAN BRED BREW BRIM BROW BUCK BULK BULL BUMP BUNK BUNT BURN BURY BUSH BUST BUSY CAGE CAKE CALF CALL CALM CAME CAMP CANE CAPE CARD CARE CARP CART CASE CASH CAST CAVE CELL CHAT CHEW CHIN CHIP CHOP CITY CLAD CLAM CLAN CLAP CLAW CLAY CLIP CLOG CLOT CLUB CLUE COAL COAT CODE COIL COIN COLD COLT COMB COME CONE COOK COOL COPE CORD CORE CORK CORN COST COVE CRAB CRAM CREW CRIB CROP CROW CUBE CURB CURD CURE CURL DAMP DARE DARK DARN DART DASH DATE DAWN DEAF DEAL DEAN DEAR DEBT DECK DEED DEEP DEER DENT DESK DIAL DIET DIME DINE DIRT DISH DISK DIVE DOCK DOLL DOME DONE DOOM DOOR DOSE DOVE DOWN DRAG DRAW DREW DRIP DROP DRUM DUCK DUNE DUSK DUST EACH EARL EARN EASE EAST EDGE FACE FACT FADE FAIL FAIR FALL FAME FARE FARM FAST FATE FEAR FEAT FEED FEEL FELL FELT FERN FILE FILL FILM FIND FINE FIRE FIRM FISH FIST FIVE FLAG FLAP FLAT FLAW FLED FLEE FLEW FLIP FLOW FOAM FOLD FOLK FOND FOOD FOOL FOOT FORD FORE FORK FORM FORT FOUL FOUR FOWL FROG FROM FUEL FULL FUND FUSE GAIN GAIT GALE GAME GATE GAVE GEAR GERM GIFT GILD GIRL GIVE GLAD GLEN GLOW GLUE GOAL GOAT GOLD GOLF GONE GOOD GOWN GRAB GRAM GRAY GREW GRID GRIM GRIN GRIP GROW GULF GULL GUSH HAIL HAIR HALF HALL HALT HAND HANG HARD HARE HARM HARP HASH HATE HAUL HAVE HAWK HAZE HEAD HEAL HEAP HEAR HEAT HEEL HELD HELM HELP HERD HERO HIDE HIGH HIKE HILL HINT HIRE HIVE HOLD HOLE HOLY HOME HOOD HOOF HOOK HOOP HOPE HORN HOSE HOST HOUR HUNT HURT HUSH ICON IDEA IDLE INCH IRON ITEM JADE JAIL JAZZ JEST JOIN JOKE JUMP JUNE JURY JUST KEEL KEEN KEEP KELP KEPT KICK KILN KILT KIND KING KISS KITE KNEE KNEW KNIT KNOB KNOT LACE LACK LAKE LAMB LAME LAMP LAND LANE LAST LATE LAWN LEAD LEAF LEAK LEAN LEAP LEFT LEND LENS LENT LESS LIAR LIFE LIFT LIKE LIMB LIME LIMP LINE LINK LION LIST LIVE LOAD LOAF LOAM LOAN LOCK LODE LOFT LONE LONG LOOK LOOM LOOP LORD LORE LOSE LOSS LOST LOUD LOVE LUCK LUNG LURE LUSH MADE MAID MAIL MAIN MAKE MALE MALL MALT MANE MANY MARE MARK MASK MAST MATE MAZE MEAL MEAN MEAT MEET MELT MEND MENU MERE MESH MICE MILD MILE MILK MILL MIND MINE MINT MIST MOAT MODE MOLD MOLE MOOD MOON MOOR MORE MOSS MOST MOTH MOVE MUCH MULE MUTE NAIL NAME NEAR NEAT NECK NEED NEST NEWS NEXT NICE NINE NODE NONE NOON NORM NOSE NOTE NOUN OATH OBEY ODDS OMEN ONCE OPEN OVAL OVEN OWED PACE PACK PAGE PAID PAIL PAIN PAIR PALE PALM PANE PARK PART PASS PAST PATH PAVE PEAK PEAL PEAR PEAT PECK PEEL PEER PELT PERK PEST PICK PIER PIKE PILE PILL PINE PINK PINT PIPE PITY PLAN PLAY PLEA PLOT PLOW PLUG PLUM POEM POET POLE POLL POND PONY POOL POOR PORE PORK PORT POSE POST POUR PRAY PREY PROP PULL PUMP PURE PUSH QUIT RACE RACK RAFT RAGE RAID RAIL RAIN RAKE RAMP RANG RANK RARE RASH RATE READ REAL REAP REAR REED REEF REEL REND RENT REST RICE RICH RIDE RIFT RIND RING RINK RIPE RISE RISK ROAD ROAM ROAR ROBE ROCK RODE ROLE ROLL ROOF ROOM ROOT ROPE ROSE RUDE RUIN RULE RUSH RUST SAFE SAGE SAID SAIL SAKE SALE SALT SAME SAND SANE SANG SANK SASH SAVE SCAN SCAR SEAL SEAM SEAT SEED SEEK SEEM SEEN SELF SELL SEND SENT SHED SHIN SHIP SHOE SHOP SHOT SHOW SHUT SICK SIDE SIGN SILK SILL SING SINK SITE SIZE SKIN SKIP SLAB SLAM SLAP SLED SLID SLIM SLIP SLOT SLOW SNAP SNOW SOAK SOAP SOAR SOCK SOFT SOIL SOLD SOLE SOME SONG SOON SORE SORT SOUL SOUP SOUR SPAN SPAR SPIN SPOT SPUR STAR STAY STEM STEP STEW STIR STOP STOW SUCH SUIT SUNG SUNK SURE SWAM SWAN SWAP SWAY SWIM TACK TAIL TAKE TALE TALK TALL TAME TANK TAPE TASK TEAL TEAM TEAR TELL TEND TENT TERM TEST TEXT THAN THAT THAW THEM THEN THEY THIN THIS THUS TIDE TIDY TIED TILE TILL TILT TIME TINY TIRE TOAD TOIL TOLD TOLL TOMB TONE TOOK TOOL TORE TORN TOSS TOUR TOWN TRAM TRAP TRAY TREE TRIM TRIP TROT TRUE TUBE TUCK TUNE TURF TURN TWIG TWIN TYPE VAIN VALE VAN VASE VAST VEIL VEIN VENT VERB VERY VEST VIEW VINE VOTE WADE WAGE WAIL WAIT WAKE WALK WALL WAND WANE WANT WARD WARM WARN WARP WASH WASP WAVE WEAK WEAR WEED WEEK WEEP WELD WELL WENT WERE WEST WHAT WHEN WHIP WIDE WIFE WILD WILL WIND WINE WING WINK WIRE WISE WISH WITH WOLF WOOD WOOL WORD WORE WORK WORM WORN WRAP YARD YARN YEAR YELL YOUR ZEAL ZONE".split(" ");

function wordLadder(difficulty = "medium", seed = 0) {
  const steps = { beginner: 3, easy: 4, medium: 5, hard: 6, expert: 7 }[difficulty] || 5;
  const words = LADDER_DICT.filter((w) => w.length === 4);
  const set = new Set(words);
  const neighbours = (w) => {
    const out = [];
    for (let i = 0; i < w.length; i++) for (let ch = 65; ch <= 90; ch++) {
      const c = String.fromCharCode(ch);
      if (c === w[i]) continue;
      const cand = w.slice(0, i) + c + w.slice(i + 1);
      if (set.has(cand)) out.push(cand);
    }
    return out;
  };
  for (let attempt = 0; attempt < 400; attempt++) {
    const start = words[rnd(words.length)];
    // BFS to depth `steps` and take an endpoint at exactly that distance
    let frontier = [[start]];
    const seen = new Set([start]);
    for (let d = 0; d < steps; d++) {
      const next = [];
      for (const path of frontier) for (const nb of shuffle(neighbours(path[path.length - 1]))) {
        if (seen.has(nb)) continue;
        seen.add(nb);
        next.push(path.concat([nb]));
      }
      frontier = next;
      if (!frontier.length) break;
    }
    if (!frontier.length) continue;
    const path = frontier[rnd(frontier.length)];
    // confirm the shortest route really is this long
    if (path.length !== steps + 1) continue;
    return {
      kind: "wordladder", start: path[0], end: path[path.length - 1],
      rungs: path.length - 2, solution: path, difficulty,
    };
  }
  return { kind: "wordladder", start: "COLD", end: "WARM", rungs: 3, solution: ["COLD","CORD","WORD","WARD","WARM"], difficulty };
}

/* ============================================================ anagram pairs */

function anagramMatch(words, count = 10) {
  const picks = shuffle(words.filter((w) => w.length >= 4)).slice(0, count);
  const scrambled = picks.map((w) => {
    let s = w, guard = 0;
    while (s === w && guard++ < 20) s = shuffle(w.split("")).join("");
    return s;
  });
  const order = shuffle(range(picks.length));
  return {
    kind: "anagram",
    left: scrambled.map((s, i) => ({ label: String.fromCharCode(65 + i), text: s, answerIdx: order.indexOf(i) })),
    right: order.map((i, pos) => ({ label: String(pos + 1), text: picks[i] })),
    solution: scrambled.map((s, i) => ({ from: String.fromCharCode(65 + i), to: String(order.indexOf(i) + 1), word: picks[i] })),
  };
}

/* ============================================================== fill-in grid */

// A bank of same-length words does not always drop into a grid's slots only
// one way — two 5-letter entries can be swappable if nothing crosses to pin
// them down. makeCrossword is called again on each retry so the arrangement
// changes; regenerating the fill-in from the same crossword would repeat the
// same ambiguity forever. Follows the kakuro pattern: generate, verify,
// discard and rebuild, all under a deadline plus a node budget. On budget
// exhaustion this returns null rather than shipping an unproven placement.
function fillIn(makeCrossword, opts = {}) {
  const budgetMs = opts.budgetMs ?? 5000;
  const nodeBudget = opts.nodeBudget ?? 400000;
  const maxAttempts = opts.maxAttempts ?? 30;
  const deadline = Date.now() + budgetMs;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (Date.now() > deadline) return null;
    const cw = makeCrossword();
    if (!cw) return null; // crossword generation itself refused; retrying will not change that
    const bank = cw.entries.map((e) => e.word).sort((a, b) => a.length - b.length || a.localeCompare(b));
    const slots = fillInSlots(cw.grid, cw.size);
    // A crossing entry can fill the one gap cell between two otherwise-separate
    // entries, welding them into a single contiguous run — the grid then has
    // fewer slots than bank words and cannot be a valid fill-in at all.
    if (slots.length !== bank.length) continue;
    const u = fillInSolutions(slots, bank, 2, nodeBudget);
    if (u.blown || u.count !== 1) continue; // ambiguous or inconclusive — treated the same
    return {
      kind: "fillin", size: cw.size, grid: cw.grid, entries: cw.entries, numbers: cw.numbers,
      bank, solution: cw.grid.map((row) => row.slice()),
    };
  }
  return null;
}

function fillInSlots(grid, size) {
  const out = [];
  for (let r = 0; r < size; r++) {
    let run = [];
    for (let c = 0; c <= size; c++) {
      const on = c < size && grid[r][c];
      if (on) run.push([r, c]);
      else { if (run.length > 1) out.push({ cells: run, horiz: true }); run = []; }
    }
  }
  for (let c = 0; c < size; c++) {
    let run = [];
    for (let r = 0; r <= size; r++) {
      const on = r < size && grid[r][c];
      if (on) run.push([r, c]);
      else { if (run.length > 1) out.push({ cells: run, horiz: false }); run = []; }
    }
  }
  return out;
}

// Returns { count, blown } — count capped at `limit`; blown means the node
// budget ran out before the search finished, treated exactly like "not
// unique" by the caller.
function fillInSolutions(slots, bank, limit, budget) {
  const order = slots.slice().sort((a, b) => b.cells.length - a.cells.length);
  const used = new Array(bank.length).fill(false);
  const board = {};
  let found = 0, nodes = 0, blown = false;
  const rec = (i) => {
    if (blown || found >= limit) return;
    if (++nodes > budget) { blown = true; return; }
    if (i === order.length) { found++; return; }
    const slot = order[i];
    for (let w = 0; w < bank.length; w++) {
      if (used[w]) continue;
      const word = bank[w];
      if (word.length !== slot.cells.length) continue;
      let ok = true;
      const wrote = [];
      for (let j = 0; j < slot.cells.length; j++) {
        const k = slot.cells[j][0] + "," + slot.cells[j][1];
        const have = board[k];
        if (have && have !== word[j]) { ok = false; break; }
        if (!have) { board[k] = word[j]; wrote.push(k); }
      }
      if (ok) { used[w] = true; rec(i + 1); used[w] = false; }
      for (const z of wrote) delete board[z];
      if (blown || found >= limit) return;
    }
  };
  rec(0);
  return { count: found, blown };
}

/* ================================================================== trivia */

const TRIVIA = [
  ["Which planet is closest to the sun?", "Mercury", "Science"],
  ["How many strings does a standard violin have?", "Four", "Music"],
  ["What is the largest ocean on Earth?", "The Pacific", "Geography"],
  ["Which gas do plants absorb from the air?", "Carbon dioxide", "Science"],
  ["What is the tallest mountain above sea level?", "Mount Everest", "Geography"],
  ["How many sides does a hexagon have?", "Six", "Math"],
  ["What is the main ingredient in traditional hummus?", "Chickpeas", "Food"],
  ["Which metal is liquid at room temperature?", "Mercury", "Science"],
  ["How many minutes are in a full day?", "1,440", "Math"],
  ["What is a group of crows called?", "A murder", "Nature"],
  ["Which sea creature has three hearts?", "The octopus", "Nature"],
  ["What is the smallest prime number?", "Two", "Math"],
  ["Which country gave us the tulip trade boom?", "The Netherlands", "History"],
  ["What do you call a shape with eight sides?", "An octagon", "Math"],
  ["Which vitamin does sunlight help your body make?", "Vitamin D", "Health"],
  ["What is the hardest natural substance?", "Diamond", "Science"],
  ["How many bones are in the adult human body?", "206", "Health"],
  ["Which bird can fly backwards?", "The hummingbird", "Nature"],
  ["What is the longest river in South America?", "The Amazon", "Geography"],
  ["How many degrees are in a circle?", "360", "Math"],
  ["What is dried plum called?", "A prune", "Food"],
  ["Which instrument has 88 keys?", "The piano", "Music"],
  ["What is the study of fossils called?", "Palaeontology", "Science"],
  ["How many players are on a baseball field per team?", "Nine", "Sports"],
];

function trivia(count = 10, seed = 0) {
  const picks = shuffle(TRIVIA).slice(0, count);
  return {
    kind: "trivia",
    items: picks.map(([q, a, cat], i) => ({ n: i + 1, q, a, cat })),
    solution: picks.map(([, a]) => a),
  };
}

/* ============================================================== dot to dot */
// Parametric outlines only — plain geometry, numbered in order.

const SHAPES = {
  star: (t, k) => { const r = k % 2 ? 0.42 : 1; return [Math.cos(t) * r, Math.sin(t) * r]; },
  flower: (t) => { const r = 0.55 + 0.45 * Math.cos(6 * t); return [Math.cos(t) * r, Math.sin(t) * r]; },
  heart: (t) => [0.62 * Math.pow(Math.sin(t), 3), -(0.5 * Math.cos(t) - 0.2 * Math.cos(2 * t) - 0.09 * Math.cos(3 * t) - 0.02 * Math.cos(4 * t))],
  spiral: (t) => { const r = 0.15 + (t / (Math.PI * 6)) * 0.85; return [Math.cos(t) * r, Math.sin(t) * r]; },
  moon: (t) => { const r = 0.9 - 0.35 * Math.max(0, Math.cos(t)); return [Math.cos(t) * r, Math.sin(t) * r]; },
  leaf: (t) => { const r = Math.abs(Math.sin(t)) * 0.5 + 0.5 * Math.abs(Math.cos(t / 2)); return [Math.cos(t) * r * 0.8, Math.sin(t) * r]; },
};

function dotToDot(difficulty = "easy", seed = 0) {
  const names = Object.keys(SHAPES);
  const name = names[seed % names.length];
  const count = { beginner: 14, easy: 20, medium: 28, hard: 38, expert: 48 }[difficulty] || 24;
  const turns = name === "spiral" ? 6 : 2;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * turns;
    const [x, y] = SHAPES[name](t, i);
    pts.push({ n: i + 1, x: +(50 + x * 44).toFixed(2), y: +(50 + y * 44).toFixed(2) });
  }
  return { kind: "dottodot", shape: name, points: pts, solution: name, difficulty };
}

/* =========================================================== coloring page */
// Geometric repeat patterns built from primitives — no illustration required.

function coloringPattern(seed = 0) {
  const styles = ["rings", "tiles", "petals", "scales"];
  const style = styles[seed % styles.length];
  const cells = [];
  if (style === "rings") {
    for (let i = 0; i < 9; i++) cells.push({ size: 100 - i * 10, rot: i * 10, shape: i % 2 ? "circle" : "square" });
  } else if (style === "tiles") {
    for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) cells.push({ r, c, shape: (r + c) % 3 === 0 ? "circle" : (r + c) % 3 === 1 ? "square" : "diamond", rot: ((r * 5 + c) % 4) * 15 });
  } else if (style === "petals") {
    for (let i = 0; i < 12; i++) cells.push({ rot: i * 30, shape: "petal" });
  } else {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 7; c++) cells.push({ r, c, shape: "arc", rot: 0 });
  }
  return { kind: "coloring", style, cells, solution: null };
}

globalThis.PZ_EXTRA = { sudokuVariant, kakuro, nonogram, logicGrid, wordLadder, anagramMatch, fillIn, trivia, dotToDot, coloringPattern };
})();

/* ===== kdp-guru.js -> globalThis.PZ_GURU ===== */
(function(){
// KDP domain knowledge: geometry, costs, metadata strategy, cover families,
// audience styling, launch checklist. Grounded in 2026 category research.

const TRIMS = [
  { id: "5.5x8.5", w: 5.5, h: 8.5, label: '5.5 × 8.5"', note: "travel / stocking stuffer" },
  { id: "6x9", w: 6, h: 9, label: '6 × 9"', note: "portable, $7.99–8.99" },
  { id: "7x10", w: 7, h: 10, label: '7 × 10"', note: "roomy grids" },
  { id: "8x10", w: 8, h: 10, label: '8 × 10"', note: "large print sweet spot" },
  { id: "8.5x11", w: 8.5, h: 11, label: '8.5 × 11"', note: "biggest grids, best $/puzzle" },
  { id: "a4", w: 8.27, h: 11.69, label: "A4", note: "metric markets" },
];

const PAPER_THICKNESS = { white: 0.002252, cream: 0.0025, color: 0.002347 };

function gutterFor(pages) {
  if (pages <= 150) return 0.375;
  if (pages <= 300) return 0.5;
  if (pages <= 500) return 0.625;
  if (pages <= 700) return 0.75;
  return 0.875;
}

function kdpSpec({ trim, pages, paper = "white", bleed = false }) {
  const t = TRIMS.find((x) => x.id === trim) || TRIMS[4];
  const spine = +(pages * PAPER_THICKNESS[paper]).toFixed(4);
  const outside = bleed ? 0.5 : 0.375;
  const gutter = gutterFor(pages);
  return {
    trim: t, pages, paper, bleed, spine, gutter, outside, top: bleed ? 0.5 : 0.375,
    live: { w: +(t.w - outside - gutter).toFixed(3), h: +(t.h - 2 * (bleed ? 0.5 : 0.375)).toFixed(3) },
    cover: {
      w: +(t.w * 2 + spine + 0.25).toFixed(3),
      h: +(t.h + 0.25).toFixed(3),
      spineTextOk: pages >= 79,
      barcode: { w: 2, h: 1.2 },
    },
  };
}

// US paperback. KDP publishes these as fixed + per-page bands. Standard colour
// costs roughly three times black ink per page, which is why colour interiors
// are only worth it for children's books.
function printCost({ trim, pages, paper, color }) {
  const t = TRIMS.find((x) => x.id === trim) || TRIMS[4];
  const large = t.w > 6.12 || t.h > 9;
  if (color) return +(1.0 + pages * (large ? 0.0525 : 0.0405)).toFixed(2);
  if (pages <= 108) return large ? 2.84 : 2.30;
  return +(0.85 + pages * (large ? 0.017 : 0.012)).toFixed(2);
}

function royalty({ price, trim, pages, paper, color }) {
  const rate = price >= 2.99 && price <= 9.99 ? 0.6 : 0.35;
  const cost = printCost({ trim, pages, paper, color });
  return { rate, cost, net: +(price * rate - cost).toFixed(2) };
}

// Price ladder: what each list price actually earns.
function priceLadder({ trim, pages, paper }) {
  return [5.99, 6.99, 7.99, 8.99, 9.99, 10.99, 12.99].map((price) => {
    const r = royalty({ price, trim, pages, paper });
    return { price, ...r, warn: price > 9.99 ? "drops to 35%" : r.net < 1.5 ? "thin margin" : null };
  });
}

/* -------------------------------------------------- audience style profiles */

const AUDIENCES = {
  senior: {
    label: "Seniors", note: "large print",
    minGridPt: 20, minBodyPt: 14, perPage: 1, largePrint: true,
    palette: ["#1d4e6e", "#f4c145", "#fdfbf6"], cover: "senior",
    voice: "calm, dignified, never patronising",
    keywords: ["large print", "for seniors", "easy on the eyes", "big font"],
    titleBenefit: "Extra-Large Print, Easy on the Eyes",
  },
  adult: {
    label: "Adults", note: "general",
    minGridPt: 12, minBodyPt: 10, perPage: 2, largePrint: false,
    palette: ["#14312e", "#d8622f", "#f6f1e6"], cover: "newsstand",
    voice: "brisk, confident, a little wry",
    keywords: ["for adults", "brain games", "puzzle book"],
    titleBenefit: "Sharpen Your Focus",
  },
  kids: {
    label: "Kids 6–12", note: "playful",
    minGridPt: 16, minBodyPt: 13, perPage: 1, largePrint: false,
    palette: ["#2f6fd0", "#ffc93c", "#fff8ec"], cover: "kid",
    voice: "warm, fun, direct — short sentences",
    keywords: ["for kids", "ages 8-12", "activity book", "fun"],
    titleBenefit: "Hours of Screen-Free Fun",
  },
  gift: {
    label: "Gift / seasonal", note: "occasion",
    minGridPt: 14, minBodyPt: 11, perPage: 1, largePrint: false,
    palette: ["#7a2230", "#e8b64c", "#fbf4ea"], cover: "seasonal",
    voice: "charming, giftable, occasion-forward",
    keywords: ["gift", "stocking stuffer", "gifts for"],
    titleBenefit: "The Perfect Gift",
  },
  memory: {
    label: "Memory care", note: "gentle",
    minGridPt: 22, minBodyPt: 15, perPage: 1, largePrint: true,
    palette: ["#3c6e57", "#f2d3a0", "#fdfaf4"], cover: "senior",
    voice: "gentle, encouraging, zero pressure",
    keywords: ["memory care", "dementia", "large print easy", "calming"],
    titleBenefit: "Gentle, Calming, Never Frustrating",
  },
};

/* ------------------------------------------------------- cover families */

const COVER_FAMILIES = {
  newsstand: {
    label: "Classic newsstand", note: "bold banner, big number",
    fonts: { display: "'Bodoni Moda', serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#0f2b45", panel: "#f7f1e4", ink: "#0f2b45", accent: "#d33a2c", counter: "#f4c145" },
    describe: "A banner across the top, the puzzle count set enormous, high contrast. Reads at thumbnail size like a magazine on a rack.",
  },
  grid: {
    label: "Modern grid", note: "flat blocks, geometric",
    fonts: { display: "'Archivo', sans-serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#f2ede2", panel: "#14312e", ink: "#14312e", accent: "#d8622f", counter: "#14312e" },
    describe: "Flat colour blocks in a strict grid, confident type, no ornament. Feels designed rather than assembled.",
  },
  cozy: {
    label: "Cozy illustrated", note: "warm scene",
    fonts: { display: "'Bodoni Moda', serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#f6e7d0", panel: "#7a4a2b", ink: "#43301f", accent: "#b6552f", counter: "#7a4a2b" },
    describe: "Warm ground, hand-lettered feel, room for a seasonal scene. Sells on comfort.",
  },
  minimal: {
    label: "Minimal type", note: "typography only",
    fonts: { display: "'Bodoni Moda', serif", ui: "'IBM Plex Mono', monospace" },
    palette: { bg: "#f7f4ec", panel: "#1a1a18", ink: "#1a1a18", accent: "#b3402f", counter: "#1a1a18" },
    describe: "All typography, no art needed. The cheapest to produce and the hardest to get wrong.",
  },
  kid: {
    label: "Kid playful", note: "bright, rounded",
    fonts: { display: "'Archivo', sans-serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#2f6fd0", panel: "#ffc93c", ink: "#123a6d", accent: "#ff5c5c", counter: "#fff8ec" },
    describe: "Bright primaries, rounded shapes, energy. Parents scan for age range — it goes on the cover.",
  },
  seasonal: {
    label: "Seasonal / gift", note: "occasion framing",
    fonts: { display: "'Bodoni Moda', serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#7a2230", panel: "#f6ead2", ink: "#4a151f", accent: "#2f6b4f", counter: "#e8b64c" },
    describe: "Occasion first: the holiday or event is the headline, the puzzle type is the subhead.",
  },
  senior: {
    label: "Large-print senior", note: "calm, uncluttered",
    fonts: { display: "'Archivo', sans-serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#1d4e6e", panel: "#fdfbf6", ink: "#12354d", accent: "#f4c145", counter: "#fdfbf6" },
    describe: "Enormous title, calm ground, LARGE PRINT set as a badge. Nothing competes with the words.",
  },
};

/* --------------------------------------------------------- metadata guru */

const CATEGORY_TREE = {
  wordsearch: [
    "Books > Humor & Entertainment > Puzzles & Games > Word Search",
    "Books > Humor & Entertainment > Puzzles & Games > Logic & Brain Teasers",
    "Books > Health, Fitness & Dieting > Aging > Medical Conditions & Diseases",
  ],
  sudoku: [
    "Books > Humor & Entertainment > Puzzles & Games > Sudoku",
    "Books > Humor & Entertainment > Puzzles & Games > Logic & Brain Teasers",
    "Books > Science & Math > Mathematics > Recreation & Games",
  ],
  crossword: [
    "Books > Humor & Entertainment > Puzzles & Games > Crosswords",
    "Books > Humor & Entertainment > Puzzles & Games > Logic & Brain Teasers",
    "Books > Reference > Words, Language & Grammar > Vocabulary",
  ],
  mixed: [
    "Books > Humor & Entertainment > Puzzles & Games > Logic & Brain Teasers",
    "Books > Humor & Entertainment > Puzzles & Games > Word Search",
    "Books > Self-Help > Memory Improvement",
  ],
  kids: [
    "Books > Children's Books > Activities, Crafts & Games > Puzzle Books",
    "Books > Children's Books > Activities, Crafts & Games > Activity Books",
    "Books > Children's Books > Education & Reference > Vocabulary & Spelling",
  ],
};

// Puzzle-count expectations by type. Undershooting reads as thin; overshooting
// costs pages with no extra royalty.
const EXPECTED_COUNT = {
  wordsearch: [50, 100], sudoku: [200, 400], crossword: [50, 100],
  cryptogram: [80, 150], maze: [60, 120], math: [80, 200],
  mixed: [100, 250], kids: [60, 100],
};

const STOP = new Set(["the", "a", "an", "of", "for", "and", "with", "in", "to"]);

// What buyers actually type. Internal type ids must never reach listing copy.
const TYPE_PHRASE = {
  wordsearch: "word search", sudoku: "sudoku", sudoku6: "easy sudoku", sudoku12: "large grid sudoku",
  xsudoku: "sudoku x", irregular: "jigsaw sudoku", crossword: "crossword", fillin: "fill in crossword",
  cryptogram: "cryptogram", scramble: "word scramble", anagram: "anagram", wordladder: "word ladder",
  kenken: "kenken", kakuro: "kakuro", math: "math", nonogram: "nonogram picross", logicgrid: "logic",
  maze: "maze", trivia: "trivia", dottodot: "dot to dot", coloring: "coloring", mixed: "puzzle",
};
const typePhrase = (id) => TYPE_PHRASE[id] || "puzzle";

const TYPE_TITLE = {
  wordsearch: "Word Search", sudoku: "Sudoku", sudoku6: "Easy Sudoku", sudoku12: "Large Grid Sudoku",
  xsudoku: "Sudoku X", irregular: "Jigsaw Sudoku", crossword: "Crossword", fillin: "Fill-In Crossword",
  cryptogram: "Cryptogram", scramble: "Word Scramble", anagram: "Anagram", wordladder: "Word Ladder",
  kenken: "KenKen", kakuro: "Kakuro", math: "Math", nonogram: "Nonogram", logicgrid: "Logic",
  maze: "Maze", trivia: "Trivia", dottodot: "Dot-to-Dot", coloring: "Coloring", mixed: "Puzzle",
};

function keywordSet({ types, audience, themes, count, largePrint, trim, difficulties }) {
  const aud = AUDIENCES[audience] || AUDIENCES.adult;
  const primary = typePhrase(types[0]);
  const lp = largePrint ? "large print " : "";
  const theme = String((themes || [])[0] || "").toLowerCase().trim();
  const audWord = audience === "senior" ? "seniors" : audience === "kids" ? "kids ages 8-12" : audience === "memory" ? "memory care" : audience === "gift" ? "gifts" : "adults";
  const raw = [
    `${lp}${primary} puzzle book for ${audWord}`,
    theme ? `${theme} ${primary} puzzles ${largePrint ? "large print" : "book"}` : `themed ${primary} puzzle book`,
    `${count} ${primary} puzzles with answers`,
    `${lp}activity book for ${audWord}`,
    audience === "kids" ? "screen free activity book for kids" : "brain games to keep the mind sharp",
    `${primary} book ${(difficulties || ["easy"]).join(" to ")} difficulty`,
    audience === "gift" ? "puzzle book gift for puzzle lovers" : `${lp}puzzle book gift`,
  ];
  return raw.map((s) => s.replace(/\s+/g, " ").trim()).slice(0, 7);
}

function categoriesFor({ types, audience }) {
  if (audience === "kids") return CATEGORY_TREE.kids;
  if (types.length > 2) return CATEGORY_TREE.mixed;
  return CATEGORY_TREE[types[0]] || CATEGORY_TREE.mixed;
}

// Broad category + specific audience + clear benefit.
function titleFormula({ type, audience, themeLabel, count, largePrint, volume }) {
  const aud = AUDIENCES[audience] || AUDIENCES.adult;
  const lp = largePrint ? "Large Print " : "";
  const typeName = TYPE_TITLE[type] || "Puzzle";
  const audTag = { senior: "for Seniors", kids: "for Kids Ages 8–12", memory: "for Memory Care", gift: "", adult: "for Adults" }[audience] || "";
  const theme = String(themeLabel || "").trim();
  const title = theme
    ? `${lp}${theme} ${typeName} Puzzles ${audTag}`.replace(/\s+/g, " ").trim()
    : `${lp}${typeName} Puzzles ${audTag}`.replace(/\s+/g, " ").trim();
  const sub = `${count} ${audience === "kids" ? "Fun" : ""} Puzzles with Complete Solutions — ${aud.titleBenefit}`.replace(/\s+/g, " ");
  return { title: volume ? `${title} — Volume ${volume}` : title, sub };
}

function seriesPlan({ baseType, audience, themeLabels, volumes = 5 }) {
  const rotate = ["Word Search", "Sudoku", "Crosswords", "Mixed Puzzles", "Holiday Special"];
  return Array.from({ length: volumes }, (_, i) => ({
    volume: i + 1,
    focus: i === 0 ? baseType : rotate[i % rotate.length],
    theme: themeLabels[i % Math.max(1, themeLabels.length)] || "Mixed",
    note: i === 0 ? "Anchor title — carries the series keywords" : i === volumes - 1 ? "Seasonal hook for Q4 traffic" : "Read-through volume",
  }));
}

const LAUNCH_CHECKLIST = [
  { phase: "Before upload", items: [
    "Interior PDF exported at trim size with no bleed unless art runs to the edge",
    "Answer key checked against the printed puzzle numbers — wrong answers are the #1 review killer",
    "Cover PDF matches the spine width for the FINAL page count",
    "Title and subtitle carry the audience and the benefit, not just the puzzle type",
    "Cover legible at 200 px wide — check it as a thumbnail before you commit",
  ] },
  { phase: "In KDP", items: [
    "Paperback, black & white interior, white or cream paper",
    "Categories: pick from Puzzles & Games — a solutions section makes this an activity book, not low content",
    "All 7 keyword slots filled with phrases, not single words",
    "Large print flagged in title AND description if the interior is large print",
    "Price inside $2.99–$9.99 to keep the 60% royalty rate",
  ] },
  { phase: "First 90 days", items: [
    "Publish 3 volumes close together so the series looks established",
    "Order a proof copy and check the gutter — the inside margin is where books fail",
    "Amazon Ads on 10–15 high-intent keywords at low CPC",
    "Gift copies to activity directors or teachers if it is a senior or kids title",
    "Add 1–2 volumes a month for six months; steady state usually lands around month 4–5",
  ] },
];

const REVIEW_KILLERS = [
  "Missing or misnumbered solutions",
  "Puzzles with more than one answer",
  "Text lost in the gutter",
  "Grids too small for the stated audience",
  "Generic cover that looks like fifty others",
];

/* ------------------------------------------------------- accessibility check */

function accessibilityReport({ audience, gridPt, bodPt, largePrint, contrast }) {
  const a = AUDIENCES[audience] || AUDIENCES.adult;
  const out = [];
  out.push({ ok: gridPt >= a.minGridPt, label: `Grid type ${gridPt.toFixed(1)}pt`, want: `≥ ${a.minGridPt}pt for ${a.label.toLowerCase()}` });
  out.push({ ok: bodPt >= a.minBodyPt, label: `Body type ${bodPt.toFixed(1)}pt`, want: `≥ ${a.minBodyPt}pt` });
  out.push({ ok: !a.largePrint || largePrint, label: largePrint ? "Large print on" : "Large print off", want: a.largePrint ? "required for this audience" : "optional" });
  out.push({ ok: contrast >= 7, label: `Grid contrast ${contrast.toFixed(1)}:1`, want: "≥ 7:1 for print legibility" });
  return out;
}

/* ------------------------------------------------- difficulty calibration */
// Deterministic scores so "hard" can be checked rather than asserted.

function calibrate(puzzle) {
  const k = puzzle.kind;
  if (k === "sudoku" || k === "sudokuN" || k === "xsudoku" || k === "irregular") {
    const n = puzzle.n || 9;
    const cells = n * n;
    const givens = puzzle.grid.filter(Boolean).length;
    return { score: +(((cells - givens) / cells) * 100).toFixed(1), unit: "% empty", basis: `${givens}/${cells} givens` };
  }
  if (k === "wordsearch") {
    const diag = puzzle.placements.some((p) => p.dr && p.dc);
    const back = puzzle.placements.some((p) => p.dr < 0 || p.dc < 0);
    return { score: +(puzzle.words.length * (diag ? 1.4 : 1) * (back ? 1.3 : 1)).toFixed(1), unit: "load", basis: `${puzzle.words.length} words${diag ? ", diagonals" : ""}${back ? ", reversed" : ""}` };
  }
  if (k === "crossword" || k === "fillin") return { score: puzzle.entries.length, unit: "entries", basis: `${puzzle.size}×${puzzle.size} grid` };
  if (k === "kenken") return { score: puzzle.cages.length, unit: "cages", basis: `${puzzle.n}×${puzzle.n}` };
  if (k === "kakuro") return { score: puzzle.runs.length, unit: "runs", basis: `${puzzle.n}×${puzzle.n}` };
  if (k === "nonogram") return { score: puzzle.n, unit: "grid", basis: `${puzzle.n}×${puzzle.n}` };
  if (k === "maze") return { score: puzzle.path.length, unit: "path cells", basis: `${puzzle.n}×${puzzle.n}` };
  if (k === "wordladder") return { score: puzzle.rungs, unit: "rungs", basis: `${puzzle.start}→${puzzle.end}` };
  if (k === "logicgrid") return { score: puzzle.clues.length, unit: "clues", basis: `${puzzle.subjects.length} subjects` };
  if (k === "math") return { score: puzzle.items.length, unit: "problems", basis: puzzle.difficulty };
  if (k === "cryptogram") return { score: puzzle.plain.replace(/[^A-Za-z]/g, "").length, unit: "letters", basis: "1 letter given" };
  return { score: 0, unit: "", basis: "" };
}

globalThis.PZ_GURU = { TRIMS, PAPER_THICKNESS, gutterFor, kdpSpec, printCost, royalty, priceLadder, AUDIENCES, COVER_FAMILIES, CATEGORY_TREE, EXPECTED_COUNT, TYPE_PHRASE, typePhrase, keywordSet, categoriesFor, titleFormula, seriesPlan, LAUNCH_CHECKLIST, REVIEW_KILLERS, accessibilityReport, calibrate };
})();
