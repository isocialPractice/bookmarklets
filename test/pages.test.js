// *********************************************************************************************** //
// pages.test                                                                                      //
// Check the practice pages under test/fixtures/pages are fit to show a reader.                     //
// *********************************************************************************************** //
// Run with node --test test/pages.test.js, which npm test does between harness.test.js and the
// bookmarklets themselves. The file is named rather than discovered, for the reason harness.test.js
// is: node --test treats every .js file under a folder called test as a test file, and
// test/fixtures/bookmarklets holds nine that are bookmarklets.
//
// These pages are two things at once - the fixtures test-bm.js runs against, and the practice pages
// the deployed site links to. test-bm.js proves the bookmarklets still work on them, and
// harness.test.js proves the harness reads them correctly. Neither asserts the pages are fit to
// show anyone, which is what this file is for. Three defects sat in them from the day they were
// committed while the suite stayed green: a heading level skipped on six of the nine, a table that
// scrolled the whole document sideways under 400px, and a fixed readout sitting on top of the text
// it reports on.
//
// Everything is measured from the rendered page at two viewports, served from the same fake origin
// test-bm.js uses so links, anchors and the embedded frame resolve as they would on a site. Text is
// measured as glyph runs, through Range.getClientRects, rather than as element boxes: a wide list
// item whose words stop short of an overlay is not a defect, and an element box says it is.

var test = require("node:test");
var assert = require("node:assert");
var fs = require("node:fs");
var path = require("node:path");
var playwright = require("playwright");

var pagesDir = path.resolve(__dirname, "fixtures", "pages");
var origin = "https://fixtures.test";

var types = {
 ".html": "text/html; charset=utf-8",
 ".css": "text/css; charset=utf-8",
 ".js": "text/javascript; charset=utf-8",
 ".svg": "image/svg+xml",
 ".png": "image/png"
};

// The nine pages a reader is shown. self-test-noisy.html sits in the same folder and is not one of
// them: it logs a console error and throws on purpose, for harness.test.js to read.
var PAGES = ["index.html", "article.html", "table.html", "form.html", "sidebar.html",
 "video.html", "lazy.html", "scroll.html", "snippet.html"];

// A desktop width and a phone width. Two of the three defects showed at one and not the other.
var VIEWPORTS = [{ width: 1280, height: 720 }, { width: 400, height: 720 }];

// snippet.html's table carries no caption, and is the one table here that should not. That page is a
// converter fixture holding one of each construct, and dom_Clipboard_ConvertPageToMarkdown pins its
// whole markdown output in test-bm.json, which a caption would change. Every table a reader reads as
// content is on table.html, and both of those are captioned.
var UNCAPTIONED = ["snippet.html"];

// ----------------------------------------------------------------------------------------------- //
// Measuring
// ----------------------------------------------------------------------------------------------- //

// The same fake origin test-bm.js serves, so a page's own links and its embedded frame resolve. A
// path that is missing, or that climbs out of the folder, is a 404 the page sees.
async function serveFixtures(page) {
 await page.route(origin + "/**", async function (route) {
  var asked = "";
  try {
   asked = decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\/+/, "");
  } catch (err) {
   asked = "";
  }
  var file = path.resolve(pagesDir, asked || "index.html");
  if (file.indexOf(pagesDir + path.sep) !== 0
   || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
   await route.fulfill({ status: 404, contentType: "text/plain; charset=utf-8",
    body: "no fixture page: " + asked }).catch(function () { });
   return;
  }
  await route.fulfill({ status: 200,
   contentType: types[path.extname(file).toLowerCase()] || "application/octet-stream",
   body: fs.readFileSync(file) }).catch(function () { });
 });
}

// ---- collectors, each evaluated whole inside the page ----

function readHeadings() {
 var first = document.querySelector("h1");
 return {
  title: document.title,
  h1s: document.querySelectorAll("h1").length,
  h1: first ? (first.textContent || "").trim() : null
 };
}

function readOutline() {
 var heads = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
 return Array.prototype.map.call(heads, function (h) {
  return { level: Number(h.tagName.slice(1)), text: (h.textContent || "").trim().slice(0, 50) };
 });
}

function readOverflow() {
 var d = document.documentElement;
 var culprits = [];
 if (d.scrollWidth > d.clientWidth + 1) {
  Array.prototype.forEach.call(document.querySelectorAll("*"), function (el) {
   var r = el.getBoundingClientRect();
   if (r.width > 0 && r.right > d.clientWidth + 1) {
    culprits.push(el.tagName.toLowerCase() + (el.id ? "#" + el.id : "")
     + " right=" + Math.round(r.right));
   }
  });
 }
 return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, culprits: culprits.slice(0, 6) };
}

// Every glyph run on the page against every element the page has taken out of the flow and left
// floating over it. Text inside such an element is the overlay's own and is skipped, as is text
// that is not rendered at all.
function readCoveredText() {
 var floating = Array.prototype.filter.call(document.querySelectorAll("body *"), function (el) {
  var s = getComputedStyle(el);
  return (s.position === "fixed" || s.position === "sticky")
   && s.visibility !== "hidden" && el.getClientRects().length > 0;
 });
 if (floating.length === 0) { return { overlays: 0, total: 0, hits: [] }; }

 var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
 var hits = [];
 var node = null;
 while ((node = walker.nextNode())) {
  if (!node.nodeValue || !node.nodeValue.trim()) { continue; }
  var owner = node.parentElement;
  if (!owner) { continue; }
  var mine = floating.some(function (f) { return f === owner || f.contains(owner); });
  if (mine) { continue; }
  var style = getComputedStyle(owner);
  if (style.visibility === "hidden" || style.display === "none") { continue; }

  var range = document.createRange();
  range.selectNodeContents(node);
  var runs = range.getClientRects();
  for (var i = 0; i < runs.length; i++) {
   var t = runs[i];
   if (!(t.width > 0 && t.height > 0)) { continue; }
   for (var j = 0; j < floating.length; j++) {
    var over = floating[j];
    var r = over.getBoundingClientRect();
    var w = Math.min(r.right, t.right) - Math.max(r.left, t.left);
    var h = Math.min(r.bottom, t.bottom) - Math.max(r.top, t.top);
    // A pixel of overlap is a rounding edge, not text a reader cannot read.
    if (w > 1 && h > 1) {
     hits.push({
      overlay: over.tagName.toLowerCase() + (over.id ? "#" + over.id : ""),
      text: node.nodeValue.trim().slice(0, 50),
      overlap: Math.round(w) + "x" + Math.round(h)
     });
    }
   }
  }
 }
 return { overlays: floating.length, total: hits.length, hits: hits.slice(0, 6) };
}

function readTables() {
 return Array.prototype.map.call(document.querySelectorAll("table"), function (t) {
  var cap = t.querySelector("caption");
  return {
   caption: cap ? (cap.textContent || "").trim() : null,
   captionVisible: cap ? cap.getClientRects().length > 0 : false,
   headers: t.querySelectorAll("th").length,
   headerRow: !!t.querySelector("thead tr th")
  };
 });
}

function readControls() {
 var found = document.querySelectorAll("input,select,textarea");
 return Array.prototype.map.call(found, function (c) {
  var tied = c.id ? document.querySelector("label[for=" + JSON.stringify(c.id) + "]") : null;
  var label = tied || c.closest("label");
  return {
   tag: c.tagName.toLowerCase(),
   id: c.id || null,
   tiedByFor: !!tied,
   text: label ? (label.textContent || "").trim() : null,
   visible: label ? label.getClientRects().length > 0 : false
  };
 });
}

function readBackLink() {
 var link = Array.prototype.filter.call(document.querySelectorAll("a"), function (a) {
  return /all practice pages/i.test((a.textContent || "").trim());
 })[0];
 return link ? link.getAttribute("href") : null;
}

function readIndexLinks() {
 return Array.prototype.map.call(document.querySelectorAll("main ul li a"), function (a) {
  return { href: a.getAttribute("href"), text: (a.textContent || "").trim() };
 });
}

function readScrollRange() {
 var d = document.documentElement;
 return d.scrollHeight - d.clientHeight;
}

// ---- the pass that fills the report ----

// One browser, one pass, every page at every viewport. The launch is the slow part, so the
// assertions below share a single pass the way harness.test.js shares a single harness run.
async function measure() {
 var browser = await playwright.chromium.launch();
 var report = { pages: {}, backLinks: {}, indexLinks: [] };
 try {
  for (var v = 0; v < VIEWPORTS.length; v++) {
   var viewport = VIEWPORTS[v];
   var ctx = await browser.newContext({ viewport: viewport });
   var page = await ctx.newPage();
   await serveFixtures(page);

   for (var p = 0; p < PAGES.length; p++) {
    var name = PAGES[p];
    var resp = await page.goto(origin + "/" + name, { waitUntil: "load" });
    var found = {
     status: resp ? resp.status() : 0,
     heads: await page.evaluate(readHeadings),
     outline: await page.evaluate(readOutline),
     overflow: await page.evaluate(readOverflow),
     tables: await page.evaluate(readTables),
     controls: await page.evaluate(readControls),
     covered: []
    };

    // The readout defect only showed once the page had moved, so the overlay check is taken at
    // rest and at offsets down the page rather than at the top alone.
    var range = await page.evaluate(readScrollRange);
    var stops = [0, 300, 900, 1500, range].filter(function (y, i, all) {
     return y >= 0 && y <= range && all.indexOf(y) === i;
    });
    for (var s = 0; s < stops.length; s++) {
     await page.evaluate(function (y) { window.scrollTo(0, y); }, stops[s]);
     var seen = await page.evaluate(readCoveredText);
     if (seen.total > 0) { found.covered.push({ at: stops[s], seen: seen }); }
    }

    report.pages[name + " @" + viewport.width + "px"] = found;
   }
   await ctx.close();
  }

  // Where a link goes is an answer about the pages, not about a viewport, so it is asked once.
  var linkCtx = await browser.newContext({ viewport: VIEWPORTS[0] });
  var linkPage = await linkCtx.newPage();
  await serveFixtures(linkPage);

  for (var b = 0; b < PAGES.length; b++) {
   if (PAGES[b] === "index.html") { continue; }
   await linkPage.goto(origin + "/" + PAGES[b], { waitUntil: "load" });
   var href = await linkPage.evaluate(readBackLink);
   var landed = null;
   if (href) {
    var backResp = await linkPage.goto(new URL(href, origin + "/" + PAGES[b]).href,
     { waitUntil: "load" });
    landed = {
     status: backResp ? backResp.status() : 0,
     h1: (await linkPage.evaluate(readHeadings)).h1
    };
   }
   report.backLinks[PAGES[b]] = { href: href, landed: landed };
  }

  await linkPage.goto(origin + "/index.html", { waitUntil: "load" });
  var listed = await linkPage.evaluate(readIndexLinks);
  for (var i = 0; i < listed.length; i++) {
   var hit = await linkPage.goto(new URL(listed[i].href, origin + "/").href, { waitUntil: "load" });
   report.indexLinks.push({
    href: listed[i].href,
    text: listed[i].text,
    status: hit ? hit.status() : 0,
    h1s: (await linkPage.evaluate(readHeadings)).h1s
   });
  }
  await linkCtx.close();
 } finally {
  await browser.close();
 }
 return report;
}

var report = null;

function eachPage(run) {
 Object.keys(report.pages).forEach(function (at) { run(at, report.pages[at]); });
}

function onlyPage(name, run) {
 Object.keys(report.pages).filter(function (at) {
  return at.indexOf(name + " @") === 0;
 }).forEach(function (at) { run(at, report.pages[at]); });
}

test.before(async function () {
 report = await measure();
}, { timeout: 300000 });

// ----------------------------------------------------------------------------------------------- //
// Every page, at both viewports
// ----------------------------------------------------------------------------------------------- //

test("every page is served, titled, and carries exactly one h1", function () {
 assert.strictEqual(Object.keys(report.pages).length, PAGES.length * VIEWPORTS.length);
 eachPage(function (at, found) {
  assert.strictEqual(found.status, 200, at + ": should be served, got " + found.status);
  assert.ok(found.heads.title, at + ": should have a title");
  assert.strictEqual(found.heads.h1s, 1,
   at + ": should have exactly one h1, found " + found.heads.h1s);
 });
});

test("no page skips a heading level going down its outline", function () {
 eachPage(function (at, found) {
  var prev = 0;
  found.outline.forEach(function (h) {
   if (prev > 0 && h.level > prev + 1) {
    assert.fail(at + ": outline skips h" + prev + " to h" + h.level + " at " + h.text);
   }
   prev = h.level;
  });
 });
});

test("no page scrolls the document sideways", function () {
 eachPage(function (at, found) {
  assert.ok(found.overflow.scrollWidth <= found.overflow.clientWidth + 1,
   at + ": scrollWidth " + found.overflow.scrollWidth + " over clientWidth "
   + found.overflow.clientWidth + ", widened by " + found.overflow.culprits.join(", "));
 });
});

test("nothing a page floats over itself covers the text underneath it", function () {
 eachPage(function (at, found) {
  if (found.covered.length === 0) { return; }
  var worst = found.covered[0];
  assert.fail(at + ": scrolled to " + worst.at + ", " + worst.seen.total
   + " text run(s) covered: " + JSON.stringify(worst.seen.hits));
 });
});

test("every table has a header row, and a caption where a reader reads it as content", function () {
 eachPage(function (at, found) {
  var name = at.split(" @")[0];
  found.tables.forEach(function (t, n) {
   var which = at + ": table " + (n + 1);
   assert.ok(t.headerRow, which + " should have a header row");
   assert.ok(t.headers > 0, which + " should have header cells");
   if (UNCAPTIONED.indexOf(name) >= 0) { return; }
   assert.ok(t.caption, which + " should have a caption");
   assert.ok(t.captionVisible, which + " should show its caption");
  });
 });
});

test("every form control has a visible label tied to it by for and id", function () {
 var counted = 0;
 eachPage(function (at, found) {
  found.controls.forEach(function (c) {
   counted++;
   var which = at + ": " + c.tag + "#" + (c.id || "(no id)");
   assert.ok(c.id, which + " should have an id for a label to point at");
   assert.ok(c.tiedByFor, which + " should have a label[for] naming it");
   assert.ok(c.text, which + " should have label text");
   assert.ok(c.visible, which + " should show its label");
  });
 });
 assert.ok(counted > 0, "the form page should have contributed controls to check");
});

// ----------------------------------------------------------------------------------------------- //
// The pages a reader moves between
// ----------------------------------------------------------------------------------------------- //

test("every page links back to the index, and the link reaches it", function () {
 var names = Object.keys(report.backLinks);
 assert.strictEqual(names.length, PAGES.length - 1);
 names.forEach(function (name) {
  var back = report.backLinks[name];
  assert.ok(back.href, name + ": should carry an All practice pages link");
  assert.ok(back.landed, name + ": the back link should have been followed");
  assert.strictEqual(back.landed.status, 200,
   name + ": the back link should answer 200, got " + back.landed.status);
  assert.strictEqual(back.landed.h1, "Practice pages",
   name + ": the back link should reach the index, it reached " + back.landed.h1);
 });
});

test("every page the index lists resolves", function () {
 assert.ok(report.indexLinks.length > 0, "the index should list pages");
 report.indexLinks.forEach(function (link) {
  assert.strictEqual(link.status, 200,
   "index link " + link.href + " should answer 200, got " + link.status);
  assert.strictEqual(link.h1s, 1,
   "index link " + link.href + " should reach a page with one h1");
 });
});

// ----------------------------------------------------------------------------------------------- //
// The three defects this file was written for, named so a regression reads as itself
// ----------------------------------------------------------------------------------------------- //

test("the Try these on this page box does not skip a level", function () {
 var seen = 0;
 eachPage(function (at, found) {
  var box = found.outline.filter(function (h) {
   return h.text === "Try these on this page";
  })[0];
  if (!box) { return; }
  seen++;
  assert.strictEqual(box.level, 2, at + ": the try box should be an h2, it is an h" + box.level);
 });
 assert.ok(seen > 0, "the try box should appear on the pages that carry it");
});

test("table.html keeps its wide table inside its own scrolling box", function () {
 onlyPage("table.html", function (at, found) {
  assert.ok(found.overflow.scrollWidth <= found.overflow.clientWidth + 1,
   at + ": the table should scroll in its box rather than widen the document");
  assert.strictEqual(found.tables.length, 2, at + ": should still hold two real tables");
 });
});

test("scroll.html keeps its readout clear of the log at every offset", function () {
 onlyPage("scroll.html", function (at, found) {
  assert.strictEqual(found.covered.length, 0,
   at + ": the readout covers text at " + JSON.stringify(found.covered.map(function (c) {
    return { at: c.at, hits: c.seen.hits };
   })));
 });
});
