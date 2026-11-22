// *********************************************************************************************** //
// gallery.test                                                                                    //
// Check the deployed gallery and the five examples it frames behave as a reader needs them to.     //
// *********************************************************************************************** //
// Run with node --test test/gallery.test.js, which npm test does after pages.test.js. The file is
// named rather than discovered, for the reason harness.test.js and pages.test.js are: node --test
// treats every .js file under a folder called test as a test file, and test/fixtures/bookmarklets
// holds fourteen that are bookmarklets.
//
// index.html and the five examples/ pages are the whole of the deployed site, and until this file
// nothing opened either: test/pages.test.js covers test/fixtures/pages/ only. Four defects sat in
// them while the suite stayed green. The slide show clicked a link whose target is the frame, and a
// frame navigation is a session history entry, so the page grew one entry every three seconds and
// Back rewound the show instead of leaving the gallery. It clicked every anchor on the page, so one
// without that target navigated the top level away from the site. Three of the five examples opened
// on a bare doctype and rendered in quirks mode, none of them named its language, every one skipped
// h1 to h3, and all five carried the same title and the same h1.
//
// A fifth sat in the two examples that hold a table: the box added to stop the article dragging
// sideways carried no tabindex and no role, so Tab never landed on it and the columns held out of
// view could not be reached without a pointer.
//
// The fifth's guards press the keys as well as reading the markup, because the attributes and the
// behaviour can part company: a box carrying tabindex and role that the page scrolls past, or that
// the arrow keys do not move, reads as repaired and is not.
//
// A sixth was in the ring that stop is drawn with. The saved page carries a background on its body,
// which propagates to the canvas, so the page is painted near-white whatever scheme the reader asks
// for - while a dark branch recoloured the ring alone, for a surface that never arrives. Read as
// painted, the dark scheme gave 2.42:1 where WCAG 1.4.11 asks 3:1, and the light scheme 4.97:1, so
// the dark branch made the ring harder to see than no branch at all.
//
// The sixth's guard reads pixels, because a declared colour cannot say what surface it landed on: a
// clip of the box is shot focused and shot again unfocused, and the difference is the ring and the
// page behind it. Its companion asserts the page is painted alike in both schemes, which is the whole
// reason one outline-color serves both, and is the reading to change if the page is ever given a real
// dark mode.
//
// That ring is read twice, because a reader meets it two ways and neither stands for the other: on
// the example opened on its own, and on the example as index.html frames it, which is how the
// deployed site shows it. The framed reading is also split by side, since the frame is the one thing
// that could take a side of the ring away, and a mean colour over the whole clip reads the same
// whether four sides were painted or three.
//
// What this file holds are the guards for those, measured from the rendered page. The wider gallery
// reading - the sizing interval, the navigation and frame at three widths, Tab order, the slide
// show pause control - is the roadmap item under ## Test Harness in TODO.md, which proposes the
// rest of the driver in .tmp/ui-ux-gallery/ be promoted here beside these.

var test = require("node:test");
var assert = require("node:assert");
var fs = require("node:fs");
var path = require("node:path");
var playwright = require("playwright");

var root = path.resolve(__dirname, "..");
var origin = "https://gallery.test";

var types = {
 ".html": "text/html; charset=utf-8",
 ".css": "text/css; charset=utf-8",
 ".js": "text/javascript; charset=utf-8",
 ".svg": "image/svg+xml",
 ".png": "image/png"
};

// The five pages the gallery frames, each with the word its own title has to carry. All five shared
// one title and one h1 until 11.20.2026, so in a tab, in history and in a bookmark they could not
// be told apart.
var EXAMPLES = [
 { file: "chatGPT_Bookmark_Schedule.html", names: "Schedule" },
 { file: "chatGPT_Bookmark_BroadwayMusical.html", names: "Broadway" },
 { file: "chatGPT_Bookmark_GreenMarketing.html", names: "Green" },
 { file: "chatGPT_Bookmark_IntroToComputerScience.html", names: "Computer Science" },
 { file: "chatGPT_Bookmark_SocialMediaMarketing.html", names: "Social Media" }
];

// A desktop width and a phone width. The table defect showed at the phone width alone: the document
// was 766px wide in a 390px viewport, and the reader dragged the whole article sideways.
var VIEWPORTS = [{ width: 1280, height: 800 }, { width: 390, height: 844 }];

// Two full cycles of the five example links at three seconds each, and a little over. The old slide
// show added a history entry every tick and reached every anchor on the page within one cycle, so a
// wait this long is what makes either defect unmistakable rather than marginal.
var WATCH_MS = 30000;

// The href the appended anchor points at. Nothing serves it, and that is the point: a 404 is still
// a navigation, so if the slide show clicks it the top level leaves /index.html and says so.
var APPENDED = "/appended-anchor-should-never-be-clicked.html";

// The one page served that is not a file in the repository: somewhere for Back to land, so a press
// of it can be told apart from a press that only rewound the slide show.
var BEFORE = "/start.html";

// How far two pixels must differ, in any channel, to count as changed between the shot with the box
// focused and the shot with focus taken off it. Eight is past the noise a lossless screenshot does
// not carry and well under the step from the page to a ring drawn over it.
var CHANGED = 8;

// The contrast a focus indicator owes the colour behind it (WCAG 1.4.11), and the two schemes a
// reader can ask for. Until 11.22.2026 the dark scheme drew the ring at 2.42:1: the saved page never
// darkens, since the background on its body propagates to the canvas, and the ring alone was
// recoloured for a dark surface, so the dark branch made it harder to see rather than easier.
var RING_CONTRAST = 3;
var SCHEMES = ["light", "dark"];

// The repository root, so index.html finds examples/ and the frame shares the origin of the page
// framing it, as it does on the deployed site. A path that climbs out of the root is a 404 the page
// sees.
function serveRoot(page) {
 return page.route(origin + "/**", async function (route) {
  var asked = "";
  try {
   asked = decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\/+/, "");
  } catch (err) {
   asked = "";
  }
  if ("/" + asked === BEFORE) {
   await route.fulfill({ status: 200, contentType: types[".html"],
    body: "<!doctype html><html lang=en><head><title>Before the gallery</title></head>"
     + "<body><h1>Before the gallery</h1></body></html>" }).catch(function () { });
   return;
  }
  var file = path.resolve(root, asked || "index.html");
  if ((file !== root && file.indexOf(root + path.sep) !== 0)
   || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
   await route.fulfill({ status: 404, contentType: "text/plain; charset=utf-8",
    body: "not served: " + asked }).catch(function () { });
   return;
  }
  await route.fulfill({ status: 200,
   contentType: types[path.extname(file).toLowerCase()] || "application/octet-stream",
   body: fs.readFileSync(file) }).catch(function () { });
 });
}

// ---- collectors, each evaluated whole inside the page ----

// What the page can say about the slide show without being touched: the entries behind it, where
// the top level is, and what the frame is showing.
function readGallery() {
 var frame = document.getElementsByTagName("iframe")[0];
 var shown = null;
 try { shown = frame.contentWindow.location.pathname; } catch (err) { shown = "(unreachable)"; }
 return {
  entries: history.length,
  here: location.pathname,
  shown: shown,
  marked: Array.prototype.filter.call(document.querySelectorAll("[data-active]"), function (a) {
   return a.dataset.active === "1";
  }).map(function (a) { return (a.textContent || "").trim(); })
 };
}

// One anchor appended to the navigation with no target of its own, which is what every link the
// queued "Explain the page above the gallery" item adds will be: a README link, a raw file link, a
// gist link, a short.
function appendPlainAnchor(href) {
 var nav = document.querySelector("div.sideNav");
 var added = document.createElement("a");
 added.href = href;
 added.textContent = "An ordinary link";
 nav.appendChild(added);
 return document.querySelectorAll("div.sideNav a").length;
}

// Every glyph run on the page against every element the page has taken out of the flow and left
// floating over it, which on an example is the fixed div[data-side='1'] holding the byline. Text
// inside that block is its own and is skipped. Measured as glyph runs through Range.getClientRects
// rather than as element boxes, for the reason test/pages.test.js gives: a wide paragraph whose
// words stop short of an overlay is not a defect, and its element box says it is.
function readCoveredText() {
 var floating = Array.prototype.filter.call(document.querySelectorAll("body *"), function (el) {
  var s = getComputedStyle(el);
  return (s.position === "fixed" || s.position === "sticky")
   && s.visibility !== "hidden" && s.display !== "none" && el.getClientRects().length > 0;
 });
 var named = floating.map(function (f) {
  var box = f.getBoundingClientRect();
  return f.tagName.toLowerCase() + (f.getAttribute("data-side") ? "[data-side]" : "")
   + " at " + Math.round(box.left) + "," + Math.round(box.top)
   + " " + Math.round(box.width) + "x" + Math.round(box.height);
 });
 if (floating.length === 0) { return { overlays: named, total: 0, hits: [] }; }

 var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
 var hits = [];
 var node = null;
 while ((node = walker.nextNode())) {
  if (!node.nodeValue || !node.nodeValue.trim()) { continue; }
  var owner = node.parentElement;
  if (!owner) { continue; }
  if (floating.some(function (f) { return f === owner || f.contains(owner); })) { continue; }
  var style = getComputedStyle(owner);
  if (style.visibility === "hidden" || style.display === "none") { continue; }
  var range = document.createRange();
  range.selectNodeContents(node);
  var runs = range.getClientRects();
  for (var i = 0; i < runs.length; i++) {
   var t = runs[i];
   if (!(t.width > 0 && t.height > 0)) { continue; }
   for (var j = 0; j < floating.length; j++) {
    var r = floating[j].getBoundingClientRect();
    var w = Math.min(r.right, t.right) - Math.max(r.left, t.left);
    var h = Math.min(r.bottom, t.bottom) - Math.max(r.top, t.top);
    // A pixel of overlap is a rounding edge, not text a reader cannot read.
    if (w > 1 && h > 1) {
     hits.push({ overlay: named[j], owner: owner.tagName.toLowerCase(),
      text: node.nodeValue.trim().slice(0, 48), overlap: Math.round(w) + "x" + Math.round(h) });
    }
   }
  }
 }
 return { overlays: named, total: hits.length, hits: hits.slice(0, 6) };
}

function readExample() {
 var doc = document.documentElement;
 var culprits = [];
 if (doc.scrollWidth > doc.clientWidth + 1) {
  Array.prototype.forEach.call(document.querySelectorAll("*"), function (el) {
   var box = el.getBoundingClientRect();
   if (box.width > 0 && box.right > doc.clientWidth + 1) {
    culprits.push(el.tagName.toLowerCase() + " right=" + Math.round(box.right));
   }
  });
 }
 return {
  compatMode: document.compatMode,
  lang: doc.lang,
  title: document.title,
  h1: Array.prototype.map.call(document.querySelectorAll("h1"), function (h) {
   return (h.textContent || "").trim();
  }),
  outline: Array.prototype.map.call(document.querySelectorAll("h1,h2,h3,h4,h5,h6"),
   function (h) {
    return { level: Number(h.tagName.slice(1)), text: (h.textContent || "").trim().slice(0, 50) };
   }),
  scrollWidth: doc.scrollWidth,
  clientWidth: doc.clientWidth,
  culprits: culprits.slice(0, 6),
  tables: Array.prototype.map.call(document.querySelectorAll("table"), function (t) {
   var box = t.closest(".tableScrollPasteReady");
   // A table wider than the page is the ordinary case here and not a defect: what decides is
   // whether the box it sits in scrolls instead of the document. So the table is measured against
   // its box, and the box against the page.
   return {
    boxed: !!box,
    boxScrolls: box ? box.scrollWidth > box.clientWidth : false,
    outgrowsBox: box ? Math.round(t.scrollWidth) > Math.round(box.clientWidth) + 1 : true,
    boxWider: box ? Math.round(box.getBoundingClientRect().width) > doc.clientWidth + 1 : true,
    // What a reader cannot see, and what the keyboard is offered for it. The box decides its own
    // marking from scrollWidth against clientWidth, so hidden is read the same way rather than from
    // the table against the box: the two can disagree by a pixel, and a guard that keyed on the
    // other measure would turn a rounding edge into a failed suite.
    hidden: box ? Math.max(0, Math.round(box.scrollWidth - box.clientWidth)) : 0,
    tabIndex: box ? box.tabIndex : -1,
    role: box ? box.getAttribute("role") : null,
    // The box holds no caption, so the name a screen reader announces on entering the region is
    // taken from the nearest heading above it.
    ariaLabel: box ? box.getAttribute("aria-label") : null
   };
  })
 };
}

// Two shots of the same clip, differenced inside a page of its own: a canvas is the one PNG decoder
// to hand, so no image library joins the manifest for this. Only focus changed between the shots, so
// every changed pixel is the ring, and what the second shot holds under those pixels is the page
// behind it. That is what makes the ring readable as painted rather than as declared, which is the
// whole of this reading: a declared colour cannot say what surface it landed on.
function diffShots(args) {
 function load(d) {
  return new Promise(function (res, rej) {
   var i = new Image();
   i.onload = function () { res(i); };
   i.onerror = rej;
   i.src = "data:image/png;base64," + d;
  });
 }
 function pixels(img) {
  var c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  var g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  return { w: c.width, h: c.height, d: g.getImageData(0, 0, c.width, c.height).data };
 }
 function lum(c) {
  var f = [c[0], c[1], c[2]].map(function (v) {
   v = v / 255;
   return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
 }
 function contrast(a, b) {
  var la = lum(a);
  var lb = lum(b);
  return Math.round(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)) * 100) / 100;
 }
 return Promise.all([load(args.focused), load(args.blurred)]).then(function (both) {
  var A = pixels(both[0]);
  var B = pixels(both[1]);
  if (A.w !== B.w || A.h !== B.h) { return { error: "the two shots differ in size" }; }
  var count = 0;
  var ring = [0, 0, 0];
  var back = [0, 0, 0];
  // Each changed pixel also sorted into the side of the box it sits outside, when the caller says
  // where in the clip the box's border edges fell. A ring that reads at 4.97:1 on its left and is
  // not painted at all on its right is a ring an edge has clipped, and one mean colour over the
  // whole clip cannot tell the two apart. A caller that gives no box asks only for that mean.
  var per = {};
  var sides = ["left", "right", "top", "bottom"];
  sides.forEach(function (k) { per[k] = { ring: [0, 0, 0], back: [0, 0, 0], n: 0 }; });
  var inside = 0;
  var edge = args.box ? {
   l: args.box.left - args.clip.x, r: args.box.right - args.clip.x,
   t: args.box.top - args.clip.y, b: args.box.bottom - args.clip.y
  } : null;
  for (var y = 0; y < A.h; y++) {
   for (var x = 0; x < A.w; x++) {
    var i = (y * A.w + x) * 4;
    var d = Math.max(Math.abs(A.d[i] - B.d[i]), Math.abs(A.d[i + 1] - B.d[i + 1]),
     Math.abs(A.d[i + 2] - B.d[i + 2]));
    if (d <= args.changed) { continue; }
    count++;
    ring[0] += A.d[i]; ring[1] += A.d[i + 1]; ring[2] += A.d[i + 2];
    back[0] += B.d[i]; back[1] += B.d[i + 1]; back[2] += B.d[i + 2];
    if (!edge) { continue; }
    var where = null;
    if (x < edge.l) { where = "left"; }
    else if (x >= edge.r) { where = "right"; }
    else if (y < edge.t) { where = "top"; }
    else if (y >= edge.b) { where = "bottom"; }
    if (!where) { inside++; continue; }
    var q = per[where];
    q.n++;
    q.ring[0] += A.d[i]; q.ring[1] += A.d[i + 1]; q.ring[2] += A.d[i + 2];
    q.back[0] += B.d[i]; q.back[1] += B.d[i + 1]; q.back[2] += B.d[i + 2];
   }
  }
  if (!count) { return { changed: 0 }; }
  var mean = function (t, n) {
   return [Math.round(t[0] / n), Math.round(t[1] / n), Math.round(t[2] / n)];
  };
  var r = mean(ring, count);
  var b = mean(back, count);
  var out = {
   changed: count,
   clip: { w: A.w, h: A.h },
   ringColor: r,
   behindColor: b,
   contrast: contrast(r, b)
  };
  if (!edge) { return out; }
  out.inside = inside;
  out.perSide = {};
  sides.forEach(function (k) {
   var q = per[k];
   if (!q.n) { out.perSide[k] = { painted: 0 }; return; }
   var sr = mean(q.ring, q.n);
   var sb = mean(q.back, q.n);
   out.perSide[k] = { painted: q.n, ringColor: sr, behindColor: sb, contrast: contrast(sr, sb) };
  });
  return out;
 });
}

// ---- the passes that fill the report ----

// The gallery left alone for half a minute, reached from a page before it so that Back has
// somewhere to land, with one ordinary anchor appended to its navigation before the watch starts.
// Both slide show defects are answered by the same wait, so there is one, and the press of Back
// that follows it is what a reader does rather than what history.length says.
async function watchGallery() {
 var browser = await playwright.chromium.launch();
 try {
  var ctx = await browser.newContext({ viewport: VIEWPORTS[0] });
  var page = await ctx.newPage();
  await serveRoot(page);
  var asked = [];
  page.on("request", function (req) {
   if (req.resourceType() === "document") { asked.push(new URL(req.url()).pathname); }
  });
  await page.goto(origin + BEFORE, { waitUntil: "load" });
  await page.goto(origin + "/index.html", { waitUntil: "load" });
  var navLinks = await page.evaluate(appendPlainAnchor, APPENDED);
  var atStart = await page.evaluate(readGallery);
  await page.waitForTimeout(WATCH_MS);
  var atEnd = await page.evaluate(readGallery);
  await page.goBack({ waitUntil: "load" });
  await page.waitForTimeout(500);
  var back = await page.evaluate(function () {
   return { here: location.pathname, title: document.title };
  });
  await ctx.close();
  return { navLinks: navLinks, atStart: atStart, atEnd: atEnd, asked: asked, back: back };
 } finally {
  await browser.close();
 }
}

// The box's stop used rather than described. Whether tabIndex and role are set is read above, from
// the markup; whether a reader can actually land on the box and bring the hidden columns into view
// is only answerable by pressing the keys, and the two can part company - a stop the page scrolls
// past, or one the arrow keys do not move, still carries the right attributes.
async function useTableBox(page) {
 await page.evaluate(function () {
  if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); }
  window.scrollTo(0, 0);
 });
 var onBox = function () {
  return page.evaluate(function () {
   var a = document.activeElement;
   return !!a && typeof a.className === "string"
    && a.className.indexOf("tableScrollPasteReady") >= 0;
  });
 };
 var scrolledTo = function () {
  return page.evaluate(function () {
   var a = document.activeElement;
   return a && a.scrollLeft !== undefined ? Math.round(a.scrollLeft) : -1;
  });
 };
 // Twelve is well past the handful of stops either example offers: the box is the first of them on
 // a page opened directly, and a page whose table fits never reaches it at all.
 var landedAt = null;
 for (var i = 1; i <= 12; i++) {
  await page.keyboard.press("Tab");
  if (await onBox()) { landedAt = i; break; }
 }
 if (!landedAt) { return { landedAt: null }; }
 var ring = await page.evaluate(function () {
  var a = document.activeElement;
  var s = getComputedStyle(a);
  a.scrollLeft = 0;
  return {
   focusVisible: a.matches(":focus-visible"),
   outlineStyle: s.outlineStyle,
   outlineWidth: parseFloat(s.outlineWidth) || 0,
   max: Math.max(0, Math.round(a.scrollWidth - a.clientWidth))
  };
 });
 await page.keyboard.press("ArrowRight");
 await page.waitForTimeout(150);
 var afterOne = await scrolledTo();
 // Chromium carries 40px a press and animates it, and a press sent while the last one is still
 // animating is coalesced rather than queued. So a count of presses measures the machine as much as
 // the box: twenty five sent back to back carried the whole 474px on one run, 160px on the next, and
 // a single ArrowLeft after them moved nothing at all, with no change between the runs. What these
 // readings want is where the box comes to rest, so a key is pressed until it has got there rather
 // than a fixed number of times, on a budget well past the widest run either example hides.
 var pressUntil = async function (key, reached) {
  var at = await scrolledTo();
  for (var p = 0; p < 60 && !reached(at); p++) {
   await page.keyboard.press(key);
   await page.waitForTimeout(40);
   at = await scrolledTo();
  }
  return at;
 };
 var afterMany = await pressUntil("ArrowRight", function (at) { return at >= ring.max - 1; });
 var afterLeft = await pressUntil("ArrowLeft", function (at) { return at < afterMany; });
 return { landedAt: landedAt, ring: ring, afterOne: afterOne, afterMany: afterMany,
  afterLeft: afterLeft };
}

// Each example opened directly rather than inside the frame, which is how a reader reaches one from
// a bookmark or a link, at both widths.
async function readExamples() {
 var browser = await playwright.chromium.launch();
 var pages = {};
 try {
  for (var v = 0; v < VIEWPORTS.length; v++) {
   var viewport = VIEWPORTS[v];
   var ctx = await browser.newContext({ viewport: viewport });
   var page = await ctx.newPage();
   await serveRoot(page);
   for (var e = 0; e < EXAMPLES.length; e++) {
    var resp = await page.goto(origin + "/examples/" + EXAMPLES[e].file, { waitUntil: "load" });
    // The pages write themselves with document.write and then tidy their own markup on a timer.
    await page.waitForTimeout(800);
    var found = await page.evaluate(readExample);
    found.covered = await page.evaluate(readCoveredText);
    found.status = resp ? resp.status() : 0;
    // Only the two examples that hold a table have a box to press keys at. Last of the three, so
    // the presses and the scrolling they cause cannot disturb the two readings above.
    found.keyboard = found.tables.length ? await useTableBox(page) : null;
    pages[EXAMPLES[e].file + " @" + viewport.width + "px"] = found;
   }
   await ctx.close();
  }
 } finally {
  await browser.close();
 }
 return pages;
}

// The box reached by Tab, shot focused, then shot again with focus taken off it at the same scroll
// position. Tab rather than box.focus(), because :focus-visible answers to how the element was
// reached: a programmatic focus is not a keyboard one, so the ring under test would not be drawn.
async function shootRing(page, decoder) {
 await page.evaluate(function () {
  if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); }
  window.scrollTo(0, 0);
 });
 var onBox = function () {
  return page.evaluate(function () {
   var a = document.activeElement;
   return !!a && typeof a.className === "string"
    && a.className.indexOf("tableScrollPasteReady") >= 0;
  });
 };
 var landed = false;
 for (var i = 1; i <= 12 && !landed; i++) {
  await page.keyboard.press("Tab");
  landed = await onBox();
 }
 if (!landed) { return { error: "twelve presses of Tab never landed on the box" }; }
 var box = await page.evaluate(function () {
  var a = document.activeElement;
  a.scrollLeft = 0;
  var r = a.getBoundingClientRect();
  return { focusVisible: a.matches(":focus-visible"), x: r.left, y: r.top, w: r.width, h: r.height };
 });
 // A margin either side of the box, so the ring and the page it is drawn over are both in the clip,
 // and no more of a tall box than the viewport holds.
 var pad = 10;
 var size = page.viewportSize();
 var clip = {
  x: Math.max(0, Math.floor(box.x - pad)),
  y: Math.max(0, Math.floor(box.y - pad)),
  width: Math.ceil(box.w + pad * 2),
  height: Math.ceil(Math.min(box.h, 220) + pad * 2)
 };
 clip.width = Math.min(clip.width, size.width - clip.x);
 clip.height = Math.min(clip.height, size.height - clip.y);
 if (clip.width <= 0 || clip.height <= 0) { return { error: "the box is out of the viewport" }; }
 var focused = (await page.screenshot({ clip: clip })).toString("base64");
 await page.evaluate(function () {
  if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); }
 });
 await page.waitForTimeout(150);
 var blurred = (await page.screenshot({ clip: clip })).toString("base64");
 var read = await decoder.evaluate(diffShots, { focused: focused, blurred: blurred, changed: CHANGED });
 read.focusVisible = box.focusVisible;
 return read;
}

// The ring measured on every example and width whose box is a stop, once in each colour scheme. The
// scheme is emulated on the one page rather than given to a context of its own, so a width costs one
// browser context however many schemes are read in it.
async function readRings(targets) {
 var browser = await playwright.chromium.launch();
 var found = {};
 try {
  var decoder = await (await browser.newContext()).newPage();
  for (var v = 0; v < VIEWPORTS.length; v++) {
   var viewport = VIEWPORTS[v];
   var here = targets.filter(function (t) { return t.width === viewport.width; });
   if (!here.length) { continue; }
   var ctx = await browser.newContext({ viewport: viewport });
   var page = await ctx.newPage();
   await serveRoot(page);
   for (var s = 0; s < SCHEMES.length; s++) {
    await page.emulateMedia({ colorScheme: SCHEMES[s] });
    for (var t = 0; t < here.length; t++) {
     await page.goto(origin + "/examples/" + here[t].file, { waitUntil: "load" });
     // The pages write themselves with document.write and then tidy their own markup on a timer.
     await page.waitForTimeout(800);
     var read = await shootRing(page, decoder);
     read.scheme = SCHEMES[s];
     read.at = here[t].file + " @" + viewport.width + "px";
     found[read.at + " " + SCHEMES[s]] = read;
    }
   }
   await ctx.close();
  }
 } finally {
  await browser.close();
 }
 return found;
}

// The gallery showing one chosen example, stopped the way a reader stops it. Hovering a nav link
// sets the page's own slide flag and the click then sets the clicked flag, so the slide show does
// not step on a reading halfway through it.
//
// The press is near the link's left edge rather than at its centre, because at 390px the floated
// frame is painted over the right 29px of every 49px-wide nav link and takes the press: that is the
// first ## Current item's work, queued, and not what this pass reads.
async function showFramed(page, file) {
 await page.goto(origin + "/index.html", { waitUntil: "load" });
 await page.waitForTimeout(400);
 var link = page.locator("div.sideNav a[href$='" + file + "']").first();
 var spot = { position: { x: 6, y: 10 } };
 await link.hover(spot);
 await link.click(spot);
 await page.waitForTimeout(1800);
 var frame = page.frames().find(function (f) {
  return f !== page.mainFrame() && f.url().indexOf(file) >= 0;
 });
 if (!frame) { return null; }
 await frame.waitForLoadState("load").catch(function () { });
 await page.waitForTimeout(600);
 return frame;
}

// The same ring, read on the page as the gallery frames it. A frame paints nothing outside its own
// rect, so this is where an edge could take a side of the ring away, and the whole clip's mean
// colour would still read 4.9:1 on the three sides that survived. So the reading is split by side,
// and a side is owed a ring only where the ring's reach lands inside both the frame's rect and the
// shot. Tab rather than box.focus(), for the reason shootRing gives.
async function shootFramedRing(page, frame, decoder) {
 var onBox = function () {
  return frame.evaluate(function () {
   var a = document.activeElement;
   var is = !!a && typeof a.className === "string"
    && a.className.indexOf("tableScrollPasteReady") >= 0;
   if (is) { a.setAttribute("data-ring-under-test", "1"); }
   return is;
  });
 };
 var landed = false;
 for (var i = 1; i <= 24 && !landed; i++) {
  await page.keyboard.press("Tab");
  landed = await onBox();
 }
 if (!landed) { return { error: "twenty four presses of Tab never reached the box in the frame" }; }
 var seen = await frame.evaluate(function () {
  var a = document.activeElement;
  a.scrollLeft = 0;
  return { focusVisible: a.matches(":focus-visible"), outline: getComputedStyle(a).outlineColor };
 });
 await page.waitForTimeout(120);
 // Located in the frame, because a page locator never reaches into one, but measured in main frame
 // coordinates, which is what boundingBox returns whatever frame the element sits in. So one clip
 // of the top level holds the ring the frame drew.
 var box = await frame.locator("[data-ring-under-test='1']").first().boundingBox();
 if (!box) { return { error: "the focused box has no box in the top level" }; }
 var size = page.viewportSize();
 var holder = await page.locator("iframe#examples").boundingBox();
 var edge = { left: box.x, right: box.x + box.width, top: box.y, bottom: box.y + box.height };
 var pad = 10;
 var clip = {
  x: Math.max(0, Math.floor(edge.left - pad)),
  y: Math.max(0, Math.floor(edge.top - pad)),
  width: Math.ceil(box.width + pad * 2),
  height: Math.ceil(box.height + pad * 2)
 };
 clip.width = Math.min(clip.width, size.width - clip.x);
 clip.height = Math.min(clip.height, size.height - clip.y);
 if (clip.width <= 0 || clip.height <= 0) { return { error: "the box is out of the viewport" }; }
 // A 3px outline at 2px offset reaches 5px past the border edge.
 var reach = 5;
 var holds = {
  left: Math.max(0, holder.x, clip.x),
  top: Math.max(0, holder.y, clip.y),
  right: Math.min(size.width, holder.x + holder.width, clip.x + clip.width),
  bottom: Math.min(size.height, holder.y + holder.height, clip.y + clip.height)
 };
 var owed = {
  left: edge.left - reach >= holds.left, right: edge.right + reach <= holds.right,
  top: edge.top - reach >= holds.top, bottom: edge.bottom + reach <= holds.bottom
 };
 var focused = (await page.screenshot({ clip: clip })).toString("base64");
 await frame.evaluate(function () {
  if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); }
 });
 await page.waitForTimeout(150);
 var blurred = (await page.screenshot({ clip: clip })).toString("base64");
 var read = await decoder.evaluate(diffShots,
  { focused: focused, blurred: blurred, changed: CHANGED, clip: clip, box: edge });
 read.focusVisible = seen.focusVisible;
 read.outline = seen.outline;
 read.owed = owed;
 read.boxAt = { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width),
  h: Math.round(box.height) };
 read.holds = holds;
 return read;
}

// The framed reading over the same targets and the same two schemes as readRings, one browser
// context a width. A fresh gallery is opened for each, because stopping the slide show is a thing
// done to a page once and the next reading wants it running again from the start.
async function readFramedRings(targets) {
 var browser = await playwright.chromium.launch();
 var found = {};
 try {
  var decoder = await (await browser.newContext()).newPage();
  for (var v = 0; v < VIEWPORTS.length; v++) {
   var viewport = VIEWPORTS[v];
   var here = targets.filter(function (t) { return t.width === viewport.width; });
   if (!here.length) { continue; }
   for (var s = 0; s < SCHEMES.length; s++) {
    var ctx = await browser.newContext({ viewport: viewport, colorScheme: SCHEMES[s] });
    var page = await ctx.newPage();
    await serveRoot(page);
    for (var t = 0; t < here.length; t++) {
     var frame = await showFramed(page, here[t].file);
     var at = here[t].file + " @" + viewport.width + "px framed";
     if (!frame) {
      found[at + " " + SCHEMES[s]] = { at: at, scheme: SCHEMES[s],
       error: "the frame never showed " + here[t].file };
      continue;
     }
     var read = await shootFramedRing(page, frame, decoder);
     read.scheme = SCHEMES[s];
     read.at = at;
     found[at + " " + SCHEMES[s]] = read;
    }
    await ctx.close();
   }
  }
 } finally {
  await browser.close();
 }
 return found;
}

var watched = null;
var examples = null;
var rings = null;
var framedRings = null;

function eachExample(run) {
 Object.keys(examples).forEach(function (at) { run(at, examples[at]); });
}

test.before(async function () {
 watched = await watchGallery();
 examples = await readExamples();
 // Only a box Tab reaches has a ring to measure, and which boxes those are is what the pass above
 // has just read, so the ring pass is handed its targets rather than opening all five pages to find
 // them. SocialMediaMarketing at 1280px holds nothing out of view, is correctly no stop at all, and
 // so is not among them.
 var targets = [];
 Object.keys(examples).forEach(function (at) {
  var found = examples[at];
  if (!found.tables.length || !found.tables[0].boxScrolls) { return; }
  if (!found.keyboard || !found.keyboard.landedAt) { return; }
  targets.push({ file: at.split(" @")[0], width: Number(/@(\d+)px/.exec(at)[1]) });
 });
 rings = await readRings(targets);
 framedRings = await readFramedRings(targets);
}, { timeout: 600000 });

// ----------------------------------------------------------------------------------------------- //
// The slide show, left alone
// ----------------------------------------------------------------------------------------------- //

test("the slide show advances on its own, so the two guards below are not green by accident",
 function () {
  assert.strictEqual(watched.navLinks, 6, "the navigation should hold the five example links and "
   + "the one appended for this test, it holds " + watched.navLinks);
  var framed = watched.asked.filter(function (at) { return at.indexOf("/examples/") === 0; });
  assert.ok(framed.length >= 3, "in " + (WATCH_MS / 1000) + " seconds the frame should have been "
   + "sent to at least three examples, it was sent to " + framed.length);
  assert.strictEqual(watched.atEnd.marked.length, 1,
   "one link should be marked as the open one, " + watched.atEnd.marked.length + " are");
 });

test("the slide show adds no session history entry, so Back can leave the gallery", function () {
 assert.strictEqual(watched.atEnd.entries, watched.atStart.entries,
  "left alone for " + (WATCH_MS / 1000) + " seconds the gallery went from "
  + watched.atStart.entries + " history entries to " + watched.atEnd.entries
  + ", so Back rewinds the slide show instead of leaving the page");
 // What a reader does, rather than what the count says: one press, after the show has run twice
 // round, from the page before the gallery. Counting entries and pressing Back can disagree, so
 // the press is here too.
 assert.strictEqual(watched.back.here, BEFORE, "one press of Back should land on the page before "
  + "the gallery (" + BEFORE + "), it landed on " + watched.back.here
  + " (" + watched.back.title + ")");
});

test("the slide show steps the example links only, and never navigates the top level", function () {
 assert.strictEqual(watched.atEnd.here, "/index.html",
  "the top level should still be the gallery, it is " + watched.atEnd.here);
 var offSite = watched.asked.filter(function (at) { return at === APPENDED; });
 assert.deepStrictEqual(offSite, [], "the appended anchor has no target of its own, so clicking it "
  + "navigates the top level off the site: the slide show asked for it " + offSite.length
  + " time(s)");
 assert.ok(watched.atEnd.shown.indexOf("/examples/") === 0,
  "the frame should be showing an example, it is showing " + watched.atEnd.shown);
});

// ----------------------------------------------------------------------------------------------- //
// The five pages the gallery frames
// ----------------------------------------------------------------------------------------------- //

test("every example is served, in standards mode, and names its language", function () {
 assert.strictEqual(Object.keys(examples).length, EXAMPLES.length * VIEWPORTS.length);
 eachExample(function (at, found) {
  assert.strictEqual(found.status, 200, at + ": should be served, got " + found.status);
  assert.strictEqual(found.compatMode, "CSS1Compat", at + ": a bare doctype has no name and is not "
   + "a doctype, so the page renders in quirks mode and its box sizing is not the one its style "
   + "was written against");
  assert.ok(found.lang, at + ": should name its language, so a screen reader does not guess it");
 });
});

test("no example skips a heading level going down its outline", function () {
 eachExample(function (at, found) {
  assert.ok(found.outline.length > 0, at + ": should carry headings");
  var prev = 0;
  found.outline.forEach(function (h) {
   if (prev > 0 && h.level > prev + 1) {
    assert.fail(at + ": outline skips h" + prev + " to h" + h.level + " at " + h.text);
   }
   prev = h.level;
  });
 });
});

test("each example names its own subject in its title and its one h1", function () {
 var titles = {};
 EXAMPLES.forEach(function (example) {
  VIEWPORTS.forEach(function (viewport) {
   var at = example.file + " @" + viewport.width + "px";
   var found = examples[at];
   assert.strictEqual(found.h1.length, 1,
    at + ": should carry exactly one h1, it carries " + found.h1.length);
   assert.ok(found.title.indexOf(example.names) >= 0, at + ": the title should name the subject of "
    + "the example (" + example.names + "), it reads " + JSON.stringify(found.title));
   assert.ok(found.h1[0].indexOf(example.names) >= 0, at + ": the h1 should name the subject of "
    + "the example (" + example.names + "), it reads " + JSON.stringify(found.h1[0]));
  });
  titles[examples[example.file + " @" + VIEWPORTS[0].width + "px"].title] = example.file;
 });
 assert.strictEqual(Object.keys(titles).length, EXAMPLES.length,
  "the five examples should carry five different titles, they carry "
  + Object.keys(titles).length + ": " + Object.keys(titles).join(" | "));
});

test("no example scrolls the document sideways, and a wide table scrolls in its own box",
 function () {
  eachExample(function (at, found) {
   assert.ok(found.scrollWidth <= found.clientWidth + 1, at + ": scrollWidth " + found.scrollWidth
    + " over clientWidth " + found.clientWidth + ", widened by " + found.culprits.join(", "));
   found.tables.forEach(function (t, n) {
    var which = at + ": table " + (n + 1);
    assert.ok(t.boxed, which + " should sit in a scrolling box of its own, so a table wider than "
     + "the page scrolls rather than the article");
    assert.ok(!t.boxWider, which + ": the box holding it is wider than the page it is on");
    if (t.outgrowsBox) {
     assert.ok(t.boxScrolls, which + " is wider than its box, so the box should have something to "
      + "scroll");
    }
   });
  });
 });

test("a table box on an example is a keyboard stop only where it scrolls", function () {
 eachExample(function (at, found) {
  found.tables.forEach(function (t, n) {
   var which = at + ": table " + (n + 1);
   if (t.boxScrolls) {
    assert.strictEqual(t.tabIndex, 0, which + ": " + t.hidden + "px of the table is out of view, "
     + "so the box should be a keyboard stop, its tabIndex is " + t.tabIndex);
    assert.strictEqual(t.role, "region", which + ": it scrolls, so it should be announced as a "
     + "region, its role is " + JSON.stringify(t.role));
   } else {
    assert.strictEqual(t.tabIndex, -1, which + ": the table fits its box, so the stop should not "
     + "be there, its tabIndex is " + t.tabIndex);
    assert.strictEqual(t.role, null, which + ": the table fits its box, so the region should not "
     + "be there, its role is " + JSON.stringify(t.role));
   }
  });
 });
});

test("Tab lands on a table box that scrolls, and passes one whose table fits", function () {
 eachExample(function (at, found) {
  if (!found.tables.length) { return; }
  var t = found.tables[0];
  var k = found.keyboard;
  if (t.boxScrolls) {
   assert.ok(k.landedAt, at + ": " + t.hidden + "px of the table is out of view, so Tab should "
    + "land on the box, twelve presses never did");
   assert.strictEqual(k.ring.focusVisible, true, at + ": reached by Tab, so the box should match "
    + ":focus-visible and be given a ring, it does not");
   assert.notStrictEqual(k.ring.outlineStyle, "none", at + ": the focused box draws no outline");
   assert.ok(k.ring.outlineWidth >= 2, at + ": the ring should be thick enough to see, it is "
    + k.ring.outlineWidth + "px");
  } else {
   assert.strictEqual(k.landedAt, null, at + ": the table fits its box, so Tab should pass the box "
    + "by, it landed on it at press " + k.landedAt);
  }
 });
});

test("the focus ring on a table box is visible against the page as it is painted, in both schemes",
 function () {
  var ids = Object.keys(rings);
  assert.ok(ids.length >= 2, "the ring should have been read in both schemes, it was read at "
   + JSON.stringify(ids));
  SCHEMES.forEach(function (scheme) {
   assert.ok(ids.some(function (id) { return rings[id].scheme === scheme; }),
    "nothing was read in the " + scheme + " scheme: " + JSON.stringify(ids));
  });
  ids.forEach(function (id) {
   var r = rings[id];
   assert.ok(!r.error, id + ": " + r.error);
   assert.strictEqual(r.focusVisible, true, id + ": the box was reached by Tab, so it should match "
    + ":focus-visible and be given a ring");
   assert.ok(r.changed > 0, id + ": focusing the box changed no pixel in the clip, so whatever the "
    + "ring is declared as, none was painted");
   assert.ok(r.contrast >= RING_CONTRAST, id + ": the ring is rgb(" + r.ringColor + ") over rgb("
    + r.behindColor + "), a contrast of " + r.contrast + ":1, under the " + RING_CONTRAST
    + ":1 WCAG 1.4.11 asks of a focus indicator");
  });
 });

// The same ring where a reader on the site actually meets it, inside index.html's frame, and split
// by side. The reading above opens the example on its own, which is the other way in; neither
// stands for the other, because the frame is the thing that could clip a side of the ring away, and
// a mean colour over the whole clip reads the same whether four sides were painted or three.
test("the focus ring survives the gallery frame, on every side the frame holds, in both schemes",
 function () {
  var ids = Object.keys(framedRings);
  assert.ok(ids.length >= 2, "the framed ring should have been read in both schemes, it was read at "
   + JSON.stringify(ids));
  SCHEMES.forEach(function (scheme) {
   assert.ok(ids.some(function (id) { return framedRings[id].scheme === scheme; }),
    "nothing was read framed in the " + scheme + " scheme: " + JSON.stringify(ids));
  });
  ids.forEach(function (id) {
   var r = framedRings[id];
   assert.ok(!r.error, id + ": " + r.error);
   assert.strictEqual(r.focusVisible, true, id + ": the box was reached by Tab through the frame, "
    + "so it should match :focus-visible and be given a ring");
   assert.ok(r.changed > 0, id + ": focusing the box changed no pixel in the clip, so the frame is "
    + "showing a box the ring is not painted on");
   assert.ok(r.contrast >= RING_CONTRAST, id + ": framed, the ring is rgb(" + r.ringColor
    + ") over rgb(" + r.behindColor + "), a contrast of " + r.contrast + ":1, under the "
    + RING_CONTRAST + ":1 WCAG 1.4.11 asks of a focus indicator");
   Object.keys(r.owed).forEach(function (side) {
    if (!r.owed[side]) { return; }
    var got = r.perSide[side];
    assert.ok(got && got.painted > 0, id + ": the " + side + " of the ring reaches no further than "
     + "the frame's own rect and the shot, and not a pixel of it was painted - the box is at "
     + JSON.stringify(r.boxAt) + " on a surface of " + JSON.stringify(r.holds) + ", so the frame "
     + "edge has clipped that side of it");
    assert.ok(got.contrast >= RING_CONTRAST, id + ": the " + side + " of the ring is rgb("
     + got.ringColor + ") over rgb(" + got.behindColor + "), " + got.contrast + ":1, under "
     + RING_CONTRAST + ":1");
   });
  });
 });

// The reading that explains the one above, and the one to change if the saved page is ever given a
// real dark mode: the ring carries a single colour because there is a single surface to draw it on.
test("the saved page is painted alike in both schemes, which is why the ring carries one colour",
 function () {
  var byPage = {};
  Object.keys(rings).forEach(function (id) {
   var r = rings[id];
   if (r.error) { return; }
   byPage[r.at] = byPage[r.at] || {};
   byPage[r.at][r.scheme] = r.behindColor;
  });
  var pages = Object.keys(byPage);
  assert.ok(pages.length > 0, "no ring was read, so there is nothing to compare");
  pages.forEach(function (at) {
   var light = byPage[at].light;
   var dark = byPage[at].dark;
   assert.ok(light && dark, at + ": the page was not read in both schemes");
   var apart = Math.max(Math.abs(light[0] - dark[0]), Math.abs(light[1] - dark[1]),
    Math.abs(light[2] - dark[2]));
   assert.ok(apart <= 2, at + ": the page behind the box is rgb(" + light + ") in light and rgb("
    + dark + ") in dark, " + apart + " apart per channel. It was alike in both until now, which is "
    + "why one outline-color serves both. A page that darkens wants a ring coloured for a dark "
    + "surface: give the dark scheme its own outline-color again, and measure it here.");
  });
 });

test("the arrow keys bring the hidden columns into view, and take them back out", function () {
 eachExample(function (at, found) {
  if (!found.tables.length || !found.tables[0].boxScrolls) { return; }
  var k = found.keyboard;
  assert.ok(k.afterOne > 0, at + ": one press of ArrowRight on the focused box moved it to "
   + k.afterOne);
  // A pixel of slack: scrollWidth and clientWidth are whole numbers while the extent scrollLeft
  // can reach is fractional, so a box reading 474px out of view stops scrolling at 473.
  assert.ok(k.afterMany >= k.ring.max - 1, at + ": the arrow keys should reach the end of the "
   + k.ring.max + "px held out of view, they reached " + k.afterMany);
  assert.ok(k.afterLeft < k.afterMany, at + ": ArrowLeft should take the columns back out, it went "
   + "from " + k.afterMany + " to " + k.afterLeft);
 });
});

test("a table box that scrolls is named from the nearest heading above it", function () {
 eachExample(function (at, found) {
  found.tables.forEach(function (t, n) {
   var which = at + ": table " + (n + 1);
   if (!t.boxScrolls) {
    assert.strictEqual(t.ariaLabel, null, which + ": the table fits, so the box should carry no "
     + "name either, it is named " + JSON.stringify(t.ariaLabel));
    return;
   }
   assert.ok(t.ariaLabel && t.ariaLabel.length > 0, which + ": a region with no name is announced "
    + "as an unnamed region, its aria-label is " + JSON.stringify(t.ariaLabel));
   var headings = found.outline.map(function (h) { return h.text; });
   assert.ok(headings.indexOf(t.ariaLabel) >= 0, which + ": the box is named "
    + JSON.stringify(t.ariaLabel) + ", which is not one of the page's headings "
    + JSON.stringify(headings));
  });
 });
});

test("the fixed byline block covers none of the article's text", function () {
 eachExample(function (at, found) {
  // The block is fixed at the top left corner at every width, and the article is centred inside
  // half the page, so the two clear each other by the margin alone. A heading's vertical margin
  // changes with its level, and the heading inside the block became an h2 on 11.20.2026, so the
  // block is a different height now than the page was drawn against.
  assert.ok(found.covered.overlays.length > 0,
   at + ": the byline block should be fixed over the page, nothing on it is");
  assert.strictEqual(found.covered.total, 0, at + ": the block " + found.covered.overlays[0]
   + " covers " + found.covered.total + " text run(s): " + JSON.stringify(found.covered.hits));
 });
});
