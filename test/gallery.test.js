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
 // Twenty five presses carry 1000px at Chromium's 40px a press, past the widest run either example
 // holds out of view.
 for (var p = 1; p < 25; p++) { await page.keyboard.press("ArrowRight"); }
 await page.waitForTimeout(250);
 var afterMany = await scrolledTo();
 await page.keyboard.press("ArrowLeft");
 await page.waitForTimeout(150);
 return { landedAt: landedAt, ring: ring, afterOne: afterOne, afterMany: afterMany,
  afterLeft: await scrolledTo() };
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

var watched = null;
var examples = null;

function eachExample(run) {
 Object.keys(examples).forEach(function (at) { run(at, examples[at]); });
}

test.before(async function () {
 watched = await watchGallery();
 examples = await readExamples();
}, { timeout: 300000 });

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
