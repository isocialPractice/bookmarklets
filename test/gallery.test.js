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
// A sixth was in the ring that stop is drawn with. These five pages carry a background on their
// body, which propagates to the canvas, so each is painted near-white whatever scheme the reader
// asks for - while a dark branch recoloured the ring alone, for a surface that never arrives. Read
// as painted, the dark scheme gave 2.42:1 where WCAG 1.4.11 asks 3:1, and the light scheme 4.97:1,
// so the dark branch made the ring harder to see than no branch at all.
//
// The sixth's guard reads pixels, because a declared colour cannot say what surface it landed on: a
// clip of the box is shot focused and shot again unfocused, and the difference is the ring and the
// page behind it. Its companion asserts these five are painted alike in both schemes, which is the
// whole reason one outline-color serves them.
//
// That is a reading of the five pages committed here and of nothing else. They were saved before the
// color-scheme meta the bookmarklet added on 11.25.2026 and carry neither it nor a dark rule, so
// they cannot darken and one ring colour is right for them. The page the bookmarklet writes now
// does darken, and is read in test/paste-ready.test.js, which builds one from the file as it stands:
// the canvas there is rgb(249,250,250) in light and rgb(19,20,20) in dark, and the ring carries
// #0969da and #58a6ff. Bringing these five in step with it - the meta and the two dark rules, by
// hand or by a re-save - is what would bring that reading here, and the pages would then want the
// ring measured on both surfaces.
//
// That ring is read twice, because a reader meets it two ways and neither stands for the other: on
// the example opened on its own, and on the example as index.html frames it, which is how the
// deployed site shows it. The framed reading is also split by side, since the frame is the one thing
// that could take a side of the ring away, and a mean colour over the whole clip reads the same
// whether four sides were painted or three.
//
// A seventh was in the corner badge the saved page carries its byline on. The block is a share of
// the page wide and its label was a fixed 12pt, so the two parted company as the page narrowed: at a
// phone width the words were painted outside the black shape they are written on, white on a
// near-white page, and what was left of them landed on the h1 beside it. The guard above passes
// here, and correctly: it skips every run inside the block as the block's own text, so a label that
// leaves the block is invisible to it.
//
// The seventh's companion reads the block's own runs twice over - against the block's painted box,
// and against the heading's runs - on the example opened on its own and on the example as the
// gallery frames it. Both failed, and the framed one by more: there the label ended 21px and 31px
// past the block's right edge and covered 8x17px and 18x5px of the h1, against 8px and 18px past
// the edge and 3x5px of the h1 on the page opened on its own. The frame is 330px of a 390px
// viewport and lays the example out in 328px of that.
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
 ".png": "image/png",
 ".gif": "image/gif"
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

// The widths the gallery's own layout is read at: a desktop, a narrow laptop, and a phone. The
// phone width is the one the absolutely positioned navigation and the floated frame failed at, each
// laid over the other; 1024 is the width either side of the stacking break worth reading, since the
// grid stacks below 760.
var GALLERY_WIDTHS = [1280, 1024, 390];

// Long enough for two advances at three seconds, and a little over, which is what makes "it stopped"
// and "it is between ticks" different readings.
var SHOW_WATCH_MS = 7400;

// The two examples the sizing is read with: the tallest of the five and the shortest. A frame left
// at the height of the page before is only visible as a defect when the two differ, so the pair is
// named rather than taken in file order.
var TALLEST = "chatGPT_Bookmark_IntroToComputerScience";
var SHORTEST = "chatGPT_Bookmark_Schedule";

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
// reader can ask for. Until 11.22.2026 the dark scheme drew the ring at 2.42:1 on these five pages:
// none of them darkens, since the background on its body propagates to the canvas and no
// color-scheme meta was saved with it, and the ring alone was recoloured for a dark surface, so the
// dark branch made it harder to see rather than easier.
var RING_CONTRAST = 3;
var SCHEMES = ["light", "dark"];

// The widths the byline block's own layout is stepped across, and the step between them. The two
// readings above are taken at 390px and at 1280px, and the defect this one answers lies between
// them: at 840px to 849px and at 1191px to 1199px of the example's own layout width the label just
// fits on one line, so its tail reaches the block's rounded corner and the overflow that clips
// there took the end of the final letter off. A 1px step is what makes a band ten widths wide
// visible at all, and 1281 of them are read in a second.
//
// The range is of the example's own layout width rather than of a window, so it covers the example
// as index.html frames it too: the frame lays an example out narrower than the viewport holding it,
// and every width it can hand an example inside this range is a width stepped here. A viewport of
// 1137px to 1146px laid one out at 840px to 847px, and 1576px to 1584px at 1191px to 1197px.
var CORNER_WIDTHS = { from: 320, to: 1600, step: 1 };

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
  hash: location.hash,
  // The open example is marked with aria-current, which a screen reader announces. It was
  // data-active until 11.23.2026, an attribute nothing but the style sheet ever read.
  marked: Array.prototype.filter.call(document.querySelectorAll(".sideNav a"), function (a) {
   return a.getAttribute("aria-current") === "page";
  }).map(function (a) { return (a.textContent || "").trim(); }),
  stale: document.querySelectorAll("[data-active]").length
 };
}

// One anchor appended to the navigation with no target of its own, which is what every link the
// queued "Explain the page above the gallery" item adds will be: a README link, a raw file link, a
// gist link, a short.
function appendPlainAnchor(href) {
 var nav = document.querySelector(".sideNav");
 var added = document.createElement("a");
 added.href = href;
 added.textContent = "An ordinary link";
 nav.appendChild(added);
 return document.querySelectorAll(".sideNav a").length;
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

// The byline block's own label, read against the block it is written on and against the heading
// beside it. readCoveredText above cannot answer either question: it skips every run inside the
// block as the block's own text, which is what the block is for, so a label that leaves the block
// is invisible to it.
//
// Both readings are glyph runs rather than element boxes, for the reason readCoveredText gives. The
// right and bottom edges are the two that matter: the block is fixed at the top left corner, so
// nothing can leave it by the left or the top.
//
// The svg carries its accessible name as a <text> parked at -9999, which no reader ever sees. A run
// that ends at or before the block's left edge is that name and nothing else, since the block's
// visible content starts inside it.
function readByline() {
 var block = document.querySelector("div[data-side='1']");
 if (!block) { return { error: "the page carries no byline block" }; }
 var box = block.getBoundingClientRect();
 var heading = [];
 var h1 = document.querySelector("h1");
 if (h1) {
  var headWalker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
  var headNode = null;
  while ((headNode = headWalker.nextNode())) {
   if (!headNode.nodeValue || !headNode.nodeValue.trim()) { continue; }
   var headRange = document.createRange();
   headRange.selectNodeContents(headNode);
   var headRuns = headRange.getClientRects();
   for (var h = 0; h < headRuns.length; h++) {
    if (headRuns[h].width > 0 && headRuns[h].height > 0) { heading.push(headRuns[h]); }
   }
  }
 }
 var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
 var label = [];
 var past = [];
 var onHeading = [];
 var node = null;
 while ((node = walker.nextNode())) {
  if (!node.nodeValue || !node.nodeValue.trim()) { continue; }
  var range = document.createRange();
  range.selectNodeContents(node);
  var runs = range.getClientRects();
  for (var i = 0; i < runs.length; i++) {
   var t = runs[i];
   if (!(t.width > 0 && t.height > 0) || t.right <= box.left) { continue; }
   var said = node.nodeValue.trim().slice(0, 24);
   label.push(said + " at " + Math.round(t.left) + "," + Math.round(t.top)
    + " to " + Math.round(t.right) + "," + Math.round(t.bottom));
   // A pixel either way is a rounding edge, not a word a reader watches leave the shape.
   if (t.right > box.right + 1) {
    past.push(said + " ends " + Math.round(t.right - box.right) + "px past the right edge");
   }
   if (t.bottom > box.bottom + 1) {
    past.push(said + " ends " + Math.round(t.bottom - box.bottom) + "px below the bottom edge");
   }
   for (var j = 0; j < heading.length; j++) {
    var w = Math.min(heading[j].right, t.right) - Math.max(heading[j].left, t.left);
    var d = Math.min(heading[j].bottom, t.bottom) - Math.max(heading[j].top, t.top);
    if (w > 1 && d > 1) {
     onHeading.push(said + " is painted over the heading by "
      + Math.round(w) + "x" + Math.round(d) + "px");
    }
   }
  }
 }
 return {
  page: document.documentElement.clientWidth,
  block: Math.round(box.left) + "," + Math.round(box.top) + " "
   + Math.round(box.width) + "x" + Math.round(box.height),
  label: label, past: past, onHeading: onHeading,
  heading: heading.map(function (r) { return Math.round(r.left) + ".." + Math.round(r.right); })
 };
}

// The byline block's own label against the corner the block is clipped by. The two readings above
// answer whether the label leaves the block; this one answers whether it lands on the curve while
// still inside it, which is a different edge. overflow: hidden clips along the padding box, and the
// curve it clips with is the border-box radius less the border width, so neither the border box nor
// the radius the style sheet asks for is the figure to measure against: read against the border box
// and the asked 80px, a label the clip was visibly biting into came out 0.3px clear.
//
// The used radius is read rather than taken from the declaration, because CSS scales every radius
// on a box by one factor when a pair of them overruns the side they share. The block is a share of
// the page wide, so below about 400px of page the 80px it asks for is wider than the block is and
// the corner a reader sees is smaller than the one declared. The inner curve is an ellipse rather
// than a circle where the two borders differ, so its axes are taken separately.
//
// A run's lowest pixel is the one nearest the curve, so the ellipse is solved at that pixel's
// height above the padding box's bottom edge. The rect is the glyph run's own box and carries the
// font's ascent and descent, so a crossing here runs a little ahead of the ink: this reads the
// bands as 840px to 849px and 1191px to 1199px, where differencing a clipped shot of the badge
// against a released one showed ink actually going at 840px to 847px and 1191px to 1197px.
function readBadgeCorner() {
 var block = document.querySelector("div[data-side='1']");
 if (!block) { return { error: "the page carries no byline block" }; }
 var box = block.getBoundingClientRect();
 var style = getComputedStyle(block);
 var borderRight = parseFloat(style.borderRightWidth) || 0;
 var borderBottom = parseFloat(style.borderBottomWidth) || 0;
 var asked = parseFloat(style.borderBottomRightRadius) || 0;
 var scale = asked > 0 ? Math.min(1, box.width / asked, box.height / asked) : 1;
 var rx = Math.max(0, asked * scale - borderRight);
 var ry = Math.max(0, asked * scale - borderBottom);
 var right = box.right - borderRight;
 var bottom = box.bottom - borderBottom;
 var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
 var worst = null;
 var runs = 0;
 var node = null;
 while ((node = walker.nextNode())) {
  if (!node.nodeValue || !node.nodeValue.trim()) { continue; }
  var range = document.createRange();
  range.selectNodeContents(node);
  var rects = range.getClientRects();
  for (var i = 0; i < rects.length; i++) {
   var t = rects[i];
   // The svg's accessible name is a <text> parked at -9999, which no reader ever sees; it ends
   // left of the block, where the block's visible content never starts. readByline above skips it
   // the same way.
   if (!(t.width > 0 && t.height > 0) || t.right <= box.left) { continue; }
   runs++;
   var gap = bottom - t.bottom;
   var limit = gap >= ry || ry <= 0 || rx <= 0
    ? right
    : right - rx + rx * Math.sqrt(Math.max(0, 1 - ((ry - gap) / ry) * ((ry - gap) / ry)));
   var over = t.right - limit;
   if (worst === null || over > worst.over) {
    worst = {
     said: node.nodeValue.trim().slice(0, 24),
     right: Math.round(t.right * 10) / 10,
     limit: Math.round(limit * 10) / 10,
     gap: Math.round(gap * 10) / 10,
     over: Math.round(over * 100) / 100
    };
   }
  }
 }
 return {
  page: document.documentElement.clientWidth,
  block: Math.round(box.width * 10) / 10 + "x" + Math.round(box.height * 10) / 10,
  radius: Math.round(rx * 10) / 10 + "x" + Math.round(ry * 10) / 10,
  runs: runs,
  worst: worst
 };
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

// What the gallery says about itself in its own markup: the parts a validator reads, the parts a
// phone needs, and the parts a reader is owed above the frame. Read from the rendered page rather
// than from the file, so an attribute the parser dropped is absent here too.
function readIdentity() {
 function at(sel, name) {
  var el = document.querySelector(sel);
  return el ? el.getAttribute(name) : null;
 }
 var frame = document.getElementById("examples");
 var toggle = document.getElementById("showToggle");
 var text = (document.body.textContent || "").replace(/\s+/g, " ");
 return {
  lang: document.documentElement.lang,
  viewport: at("meta[name='viewport']", "content"),
  description: at("meta[name='description']", "content"),
  icon: at("link[rel~='icon']", "href"),
  title: document.title,
  h1: Array.prototype.map.call(document.querySelectorAll("h1"), function (h) {
   return (h.textContent || "").trim();
  }),
  outline: Array.prototype.map.call(document.querySelectorAll("h1,h2,h3,h4,h5,h6"),
   function (h) { return Number(h.tagName.slice(1)); }),
  frameTitle: frame ? frame.getAttribute("title") : null,
  frameBorder: frame ? frame.getAttribute("frameborder") : null,
  frameName: frame ? frame.getAttribute("name") : null,
  // The attribute the open example used to be marked with, and the inline handlers the hover
  // behaviour used to live in. Both should be gone from the page entirely.
  staleActive: document.querySelectorAll("[data-active]").length,
  inlineHandlers: Array.prototype.filter.call(document.querySelectorAll("*"), function (el) {
   return el.hasAttribute("onclick") || el.hasAttribute("onmouseover");
  }).length,
  controls: toggle ? 1 : 0,
  toggleText: toggle ? (toggle.textContent || "").trim() : null,
  links: Array.prototype.map.call(document.querySelectorAll(".sideNav a[data-example]"),
   function (a) { return a.getAttribute("data-example"); }),
  practice: Array.prototype.map.call(document.querySelectorAll(".practice a"),
   function (a) { return a.getAttribute("href"); }),
  practiceNames: Array.prototype.map.call(document.querySelectorAll(".practice li"),
   function (li) { return (li.textContent || "").replace(/\s+/g, " ").trim(); }),
  installImg: at(".install img", "src"),
  installAlt: at(".install img", "alt"),
  // An 11 MB animation is a page nobody on a phone asked to download, so it waits for a
  // disclosure and loads lazily. Both together are what keep it off the first paint.
  installLazy: at(".install img", "loading"),
  installFolded: !!document.querySelector(".install details img"),
  tells: text
 };
}

// The navigation against the frame, at whatever width the viewport is set to. The two were an
// absolutely positioned block and a float until 11.23.2026, so at 390px the frame was painted over
// the right 29px of every 49px-wide nav link and took any press aimed there.
function readGalleryLayout() {
 var nav = document.querySelector(".sideNav");
 var frame = document.getElementById("examples");
 nav.scrollIntoView({ block: "start" });
 var navBox = nav.getBoundingClientRect();
 var frameBox = frame.getBoundingClientRect();
 var over = Math.min(navBox.right, frameBox.right) - Math.max(navBox.left, frameBox.left);
 var tall = Math.min(navBox.bottom, frameBox.bottom) - Math.max(navBox.top, frameBox.top);
 var covered = [];
 var clipped = [];
 Array.prototype.forEach.call(document.querySelectorAll(".sideNav a[data-example]"),
  function (a) {
   var name = a.getAttribute("data-example");
   var box = a.getBoundingClientRect();
   // A link's own words against the box they are laid in. A block link wraps, so this only ever
   // fires on a box too narrow for one word of it or on an overflow that hides the rest.
   if (a.scrollWidth > a.clientWidth + 1 || a.scrollHeight > a.clientHeight + 1) {
    clipped.push(name + " " + a.scrollWidth + "x" + a.scrollHeight + " in "
     + a.clientWidth + "x" + a.clientHeight);
   }
   var x = Math.round(box.left + Math.min(box.width / 2, 40));
   var y = Math.round(box.top + box.height / 2);
   if (y < 0 || y > window.innerHeight - 1 || x < 0 || x > window.innerWidth - 1) {
    covered.push(name + " is off screen at " + x + "," + y);
    return;
   }
   var top = document.elementFromPoint(x, y);
   if (!top || !(top === a || a.contains(top))) {
    covered.push(name + " at " + x + "," + y + " is under "
     + (top ? top.tagName.toLowerCase() + "." + String(top.className || "") : "nothing"));
   }
  });
 return {
  // Overlap only counts where both axes overlap: two boxes side by side share a band of rows and
  // no columns, which is not one painted over the other.
  overlaps: over > 1 && tall > 1,
  overlap: Math.round(over) + "x" + Math.round(tall),
  nav: Math.round(navBox.left) + "," + Math.round(navBox.top)
   + " " + Math.round(navBox.width) + "x" + Math.round(navBox.height),
  frame: Math.round(frameBox.left) + "," + Math.round(frameBox.top)
   + " " + Math.round(frameBox.width) + "x" + Math.round(frameBox.height),
  stacked: Math.round(navBox.bottom) <= Math.round(frameBox.top) + 1,
  covered: covered,
  clipped: clipped,
  sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth
 };
}

// The frame's height against the height of the page inside it. The old sizing ran an interval every
// 100 ms and cleared it after 300, whether or not the example had arrived, so a frame could be left
// at the height of the page before.
function readFit() {
 var frame = document.getElementById("examples");
 var inside = null;
 try {
  var doc = frame.contentDocument;
  inside = {
   content: Math.round(doc.documentElement.getBoundingClientRect().height),
   scrollsInside: doc.documentElement.scrollHeight > doc.documentElement.clientHeight + 1
  };
 } catch (err) {
  inside = null;
 }
 var shows = "(unreachable)";
 try { shows = frame.contentWindow.location.pathname; } catch (err2) { shows = "(unreachable)"; }
 var style = getComputedStyle(frame);
 return {
  frameHeight: Math.round(frame.getBoundingClientRect().height),
  minHeight: Math.round(parseFloat(style.minHeight) || 0),
  // The frame is a border box, so its two pixels of border come out of the viewport the example
  // gets. A height set to the example's own height leaves it scrolling inside the frame by that.
  border: style.boxSizing === "border-box"
   ? Math.round((parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0))
   : 0,
  shows: shows,
  content: inside ? inside.content : 0,
  scrollsInside: inside ? inside.scrollsInside : false
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

// The gallery page itself: what it says in its markup, how it lays out at three widths, where Tab
// goes, what it logs, how the frame is sized, and what the address bar holds. One page serves all
// of it, because every reading is of the same unchanged page and the only thing that costs time is
// opening it.
async function readSite() {
 var browser = await playwright.chromium.launch();
 try {
  var ctx = await browser.newContext({ viewport: { width: GALLERY_WIDTHS[0], height: 800 } });
  var page = await ctx.newPage();
  await serveRoot(page);
  var logged = [];
  page.on("console", function (msg) { logged.push(msg.type() + ": " + msg.text()); });
  page.on("pageerror", function (err) { logged.push("pageerror: " + String(err && err.message)); });
  await page.goto(origin + "/index.html", { waitUntil: "load" });
  await page.waitForTimeout(900);
  var identity = await page.evaluate(readIdentity);

  var layout = {};
  for (var w = 0; w < GALLERY_WIDTHS.length; w++) {
   await page.setViewportSize({ width: GALLERY_WIDTHS[w], height: 844 });
   await page.waitForTimeout(400);
   layout[GALLERY_WIDTHS[w]] = await page.evaluate(readGalleryLayout);
  }
  await page.setViewportSize({ width: GALLERY_WIDTHS[0], height: 800 });
  await page.waitForTimeout(300);

  // Tab from the top of the page. The first press is also a key press, which stops the slide show,
  // so focus stays where it is put for the rest of the walk.
  await page.evaluate(function () {
   window.scrollTo(0, 0);
   if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); }
  });
  var stops = [];
  for (var t = 0; t < 24; t++) {
   await page.keyboard.press("Tab");
   var at = await page.evaluate(function () {
    var a = document.activeElement;
    if (!a || a === document.body) { return null; }
    var s = getComputedStyle(a);
    return {
     tag: a.tagName.toLowerCase(),
     example: a.getAttribute ? a.getAttribute("data-example") : null,
     // A ring a reader can see, read from the focused element rather than from the style sheet:
     // :focus-visible is what decides whether the ring is drawn at all.
     marked: a.matches(":focus-visible") && s.outlineStyle !== "none"
      && (parseFloat(s.outlineWidth) || 0) >= 1,
     text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40)
    };
   });
   stops.push(at);
   if (at && at.tag === "iframe") { break; }
  }

  // The frame sized to the example it is showing. The tallest of the five, then the shortest: a
  // frame left at the height of the page before shows as the second reading matching the first.
  var fit = {};
  var names = [TALLEST, SHORTEST];
  for (var f = 0; f < names.length; f++) {
   await page.locator(".sideNav a[data-example='" + names[f] + "']").click();
   await page.waitForTimeout(1500);
   fit[names[f]] = await page.evaluate(readFit);
  }

  // The address bar, and Back through it. Reached from a page before the gallery so the count of
  // entries this page adds can be told from the entries that were already there.
  await page.goto(origin + BEFORE, { waitUntil: "load" });
  await page.goto(origin + "/index.html", { waitUntil: "load" });
  await page.waitForTimeout(600);
  var atOpen = await page.evaluate(readGallery);
  await page.locator(".sideNav a[data-example='chatGPT_Bookmark_GreenMarketing']").click();
  await page.waitForTimeout(900);
  var firstPick = await page.evaluate(readGallery);
  await page.locator(".sideNav a[data-example='chatGPT_Bookmark_SocialMediaMarketing']").click();
  await page.waitForTimeout(900);
  var secondPick = await page.evaluate(readGallery);
  // history.back() rather than Playwright's goBack: this is a same-document navigation, and what
  // is being read is what the page does with it.
  await page.evaluate(function () { history.back(); });
  await page.waitForTimeout(900);
  var afterBack = await page.evaluate(readGallery);

  // The address a reader was given, used as an address: the gallery opened on it directly.
  await page.goto(origin + "/index.html#chatGPT_Bookmark_BroadwayMusical", { waitUntil: "load" });
  await page.waitForTimeout(1200);
  var opened = await page.evaluate(readGallery);

  await ctx.close();
  return { identity: identity, layout: layout, stops: stops, fit: fit, logged: logged,
   atOpen: atOpen, firstPick: firstPick, secondPick: secondPick, afterBack: afterBack,
   opened: opened };
 } finally {
  await browser.close();
 }
}

// The pause control used. Content that moves on its own owes a reader a way to stop it (WCAG
// 2.2.2), and the only reading that settles whether it has one is pressing it: watch the frame
// advance, press pause, watch it not advance, press play, watch it advance again.
async function usePauseControl() {
 var browser = await playwright.chromium.launch();
 try {
  var ctx = await browser.newContext({ viewport: { width: GALLERY_WIDTHS[0], height: 800 } });
  var page = await ctx.newPage();
  await serveRoot(page);
  var asked = [];
  page.on("request", function (req) {
   if (req.resourceType() === "document" && req.url().indexOf("/examples/") >= 0) {
    asked.push(new URL(req.url()).pathname);
   }
  });
  var toggle = page.locator("#showToggle");
  await page.goto(origin + "/index.html", { waitUntil: "load" });
  await page.waitForTimeout(SHOW_WATCH_MS);
  var running = asked.length;
  var saysRunning = (await toggle.textContent()).trim();
  await toggle.click();
  await page.waitForTimeout(300);
  var atPause = asked.length;
  var saysPaused = (await toggle.textContent()).trim();
  await page.waitForTimeout(SHOW_WATCH_MS);
  var paused = asked.length;
  await toggle.click();
  await page.waitForTimeout(SHOW_WATCH_MS);
  var played = asked.length;
  var saysPlaying = (await toggle.textContent()).trim();
  await ctx.close();
  return { running: running, atPause: atPause, paused: paused, played: played,
   saysRunning: saysRunning, saysPaused: saysPaused, saysPlaying: saysPlaying };
 } finally {
  await browser.close();
 }
}

// The gallery opened by a reader whose system asks for reduced motion. The frame's own src is one
// document request and is not the show moving, so one request over this wait is the show never
// having started.
async function readReducedMotion() {
 var browser = await playwright.chromium.launch();
 try {
  var ctx = await browser.newContext({ viewport: { width: GALLERY_WIDTHS[0], height: 800 },
   reducedMotion: "reduce" });
  var page = await ctx.newPage();
  await serveRoot(page);
  var asked = [];
  page.on("request", function (req) {
   if (req.resourceType() === "document" && req.url().indexOf("/examples/") >= 0) {
    asked.push(new URL(req.url()).pathname);
   }
  });
  await page.goto(origin + "/index.html", { waitUntil: "load" });
  await page.waitForTimeout(SHOW_WATCH_MS + 2000);
  var found = await page.evaluate(function () {
   var toggle = document.getElementById("showToggle");
   var state = document.getElementById("showState");
   return {
    asks: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    toggleText: toggle ? (toggle.textContent || "").trim() : null,
    stateText: state ? (state.textContent || "").trim() : null
   };
  });
  var atRest = asked.length;
  // The reader asking for reduced motion is still owed the show if they want it, so the control
  // is pressed here too: paused by default is not the same as taken away.
  await page.locator("#showToggle").click();
  await page.waitForTimeout(SHOW_WATCH_MS);
  var afterPlay = asked.length;
  await ctx.close();
  return { asks: found.asks, toggleText: found.toggleText, stateText: found.stateText,
   navs: asked.slice(0, 8), atRest: atRest, afterPlay: afterPlay };
 } finally {
  await browser.close();
 }
}

// The install animation costs 11 MB, and two things together keep it off the first paint: the
// disclosure it sits behind, and loading="lazy". readIdentity reads both from the markup, and the
// markup and the behaviour can part company here as everywhere else - a details given an open
// attribute, an img lifted out of it, a lazy attribute dropped - each of which reads the same in
// one of the two attributes and still costs a phone 11 MB before anything is asked for. So the
// request itself is counted: every URL the page asks for while it paints, then every URL it asks
// for once the disclosure is opened. Read at the phone width, since that is the reader the
// download is heaviest for.
async function readInstallCost() {
 var browser = await playwright.chromium.launch();
 try {
  var ctx = await browser.newContext({ viewport: { width: GALLERY_WIDTHS[2], height: 844 } });
  var page = await ctx.newPage();
  var asked = [];
  page.on("request", function (req) { asked.push(new URL(req.url()).pathname); });
  await serveRoot(page);
  await page.goto(origin + "/index.html", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  var onPaint = asked.slice();
  await page.evaluate(function () {
   var summary = document.querySelector(".install details summary");
   if (summary) { summary.click(); }
  });
  await page.waitForTimeout(2500);
  var shown = await page.evaluate(function () {
   var details = document.querySelector(".install details");
   var img = document.querySelector(".install img");
   return { open: !!(details && details.open), complete: !!(img && img.complete),
    natural: img ? img.naturalWidth : 0 };
  });
  await ctx.close();
  return { onPaint: onPaint, afterOpening: asked.slice(), shown: shown };
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
    found.byline = await page.evaluate(readByline);
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
// The press lands on the link itself. Until 11.23.2026 it had to be aimed near the link's left edge,
// because at 390px the floated frame was painted over the right 29px of every 49px-wide nav link and
// took the press; the grid that replaced the float leaves the two side by side at every width.
async function showFramed(page, file) {
 await page.goto(origin + "/index.html", { waitUntil: "load" });
 await page.waitForTimeout(400);
 var link = page.locator(".sideNav a[href$='" + file + "']").first();
 await link.click();
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

// The byline reading on each example as index.html frames it, over all five and both widths. One
// browser context a width and a fresh gallery for each, as readFramedRings does. All five rather
// than the ring pass's targets, because every one of them carries the block and the defect this
// answers showed on every one of them.
async function readFramedBylines() {
 var browser = await playwright.chromium.launch();
 var found = {};
 try {
  for (var v = 0; v < VIEWPORTS.length; v++) {
   var viewport = VIEWPORTS[v];
   var ctx = await browser.newContext({ viewport: viewport });
   var page = await ctx.newPage();
   await serveRoot(page);
   for (var e = 0; e < EXAMPLES.length; e++) {
    var at = EXAMPLES[e].file + " @" + viewport.width + "px framed";
    var frame = await showFramed(page, EXAMPLES[e].file);
    if (!frame) {
     found[at] = { error: "the frame never showed " + EXAMPLES[e].file };
     continue;
    }
    found[at] = await frame.evaluate(readByline);
   }
   await ctx.close();
  }
 } finally {
  await browser.close();
 }
 return found;
}

// The corner reading on each example at every width in CORNER_WIDTHS, over all five. All five
// rather than one, because the rule lives in the bookmarklet and is copied inline into each of the
// five pages, so the copies are where it can part company - and the two byline readings, taken at
// 390px and at 1280px, are both outside either band, so a copy left unfixed would pass them.
//
// One context and one page for the whole pass: the viewport is what is stepped, and reloading
// between steps would cost the 800ms each of these pages takes to write itself far more often than
// it would buy anything. The height never changes, since the block is fixed to the top left corner
// and its own height follows its content.
async function readCornerSweep() {
 var browser = await playwright.chromium.launch();
 var found = {};
 try {
  var ctx = await browser.newContext({ viewport: { width: 900, height: 900 } });
  var page = await ctx.newPage();
  await serveRoot(page);
  for (var e = 0; e < EXAMPLES.length; e++) {
   await page.goto(origin + "/examples/" + EXAMPLES[e].file, { waitUntil: "load" });
   // The pages write themselves with document.write and then tidy their own markup on a timer.
   await page.waitForTimeout(800);
   var on = [];
   var closest = null;
   var steps = 0;
   var broke = null;
   for (var w = CORNER_WIDTHS.from; w <= CORNER_WIDTHS.to; w += CORNER_WIDTHS.step) {
    await page.setViewportSize({ width: w, height: 900 });
    var read = await page.evaluate(readBadgeCorner);
    if (read.error) {
     broke = read.error;
     break;
    }
    steps++;
    if (!read.worst) {
     broke = w + "px: the block holds no label run to read";
     break;
    }
    if (closest === null || read.worst.over > closest.over) {
     closest = { at: w, over: read.worst.over, block: read.block, radius: read.radius,
      said: read.worst.said, right: read.worst.right, limit: read.worst.limit,
      gap: read.worst.gap };
    }
    if (read.worst.over > 0) {
     on.push(w + "px: " + JSON.stringify(read.worst.said) + " ends at " + read.worst.right
      + ", " + read.worst.over + "px past the curve's " + read.worst.limit + " at "
      + read.worst.gap + "px above the bottom edge (block " + read.block + ", radius "
      + read.radius + ")");
    }
   }
   found[EXAMPLES[e].file] = broke ? { error: broke }
    : { steps: steps, on: on, closest: closest };
  }
  await ctx.close();
 } finally {
  await browser.close();
 }
 return found;
}

var watched = null;
var cornerSweep = null;
var examples = null;
var rings = null;
var framedRings = null;
var framedBylines = null;
var site = null;
var paused = null;
var reduced = null;
var install = null;

function eachExample(run) {
 Object.keys(examples).forEach(function (at) { run(at, examples[at]); });
}

// Both ways a reader meets an example, for the byline readings: opened on its own, and framed by
// the gallery. Neither stands for the other, since the frame is narrower than the viewport holding
// it, so a label that fits standalone can still leave the block in the frame.
function eachByline(run) {
 Object.keys(examples).forEach(function (at) { run(at, examples[at].byline); });
 Object.keys(framedBylines).forEach(function (at) { run(at, framedBylines[at]); });
}

test.before(async function () {
 watched = await watchGallery();
 site = await readSite();
 paused = await usePauseControl();
 reduced = await readReducedMotion();
 install = await readInstallCost();
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
 framedBylines = await readFramedBylines();
 cornerSweep = await readCornerSweep();
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
// The slide show, with a reader at it
// ----------------------------------------------------------------------------------------------- //

test("a reader is given a control that pauses the slide show, and starts it again", function () {
 assert.strictEqual(site.identity.controls, 1, "the page should carry one slide show control, it "
  + "carries " + site.identity.controls);
 assert.ok(paused.running >= 3, "in " + (SHOW_WATCH_MS / 1000) + " seconds the show should have "
  + "moved the frame at least twice past its own src, it asked for " + paused.running
  + " example(s) in all");
 assert.strictEqual(paused.saysRunning, "Pause the slide show", "while the show runs the control "
  + "should offer to pause it, it reads " + JSON.stringify(paused.saysRunning));
 assert.strictEqual(paused.paused, paused.atPause, "paused, the show should move the frame no "
  + "further: it went from " + paused.atPause + " to " + paused.paused + " examples over "
  + (SHOW_WATCH_MS / 1000) + " seconds");
 assert.strictEqual(paused.saysPaused, "Play the slide show", "paused, the control should offer to "
  + "play it, it reads " + JSON.stringify(paused.saysPaused));
 assert.ok(paused.played > paused.paused, "played again, the show should move the frame: it stayed "
  + "at " + paused.played + " examples");
 assert.strictEqual(paused.saysPlaying, "Pause the slide show", "playing again, the control should "
  + "offer to pause it, it reads " + JSON.stringify(paused.saysPlaying));
});

test("the slide show never starts for a reader who asks for reduced motion", function () {
 assert.ok(reduced.asks, "the context should be asking for reduced motion");
 assert.strictEqual(reduced.atRest, 1, "the frame's own src is one document request and is not the "
  + "show moving, so " + (SHOW_WATCH_MS + 2000) / 1000 + " seconds should hold exactly that one: "
  + JSON.stringify(reduced.navs));
 assert.strictEqual(reduced.toggleText, "Play the slide show", "the control should offer to play "
  + "the show, it reads " + JSON.stringify(reduced.toggleText));
 assert.ok(/reduced motion/i.test(String(reduced.stateText)), "the page should say why the show is "
  + "not running, it says " + JSON.stringify(reduced.stateText));
 assert.ok(reduced.afterPlay > reduced.atRest, "a reader asking for reduced motion who presses "
  + "play should get the show: it stayed at " + reduced.afterPlay + " example(s)");
});

// ----------------------------------------------------------------------------------------------- //
// The example a reader is looking at, and its address
// ----------------------------------------------------------------------------------------------- //

test("choosing an example names it in the address bar, and adds one entry per choice", function () {
 assert.strictEqual(site.firstPick.hash, "#chatGPT_Bookmark_GreenMarketing",
  "choosing an example should name it in the address bar, it reads "
  + JSON.stringify(site.firstPick.hash));
 assert.ok(site.firstPick.shown.indexOf("GreenMarketing") >= 0,
  "the frame should be showing the chosen example, it shows " + site.firstPick.shown);
 assert.strictEqual(site.secondPick.entries - site.atOpen.entries, 2,
  "two choices should add two history entries, they added "
  + (site.secondPick.entries - site.atOpen.entries));
});

test("Back returns to the example chosen before it", function () {
 assert.strictEqual(site.afterBack.hash, "#chatGPT_Bookmark_GreenMarketing",
  "one press of Back should return to the example chosen before, the address reads "
  + JSON.stringify(site.afterBack.hash));
 assert.ok(site.afterBack.shown.indexOf("GreenMarketing") >= 0,
  "and the frame should be showing it, it shows " + site.afterBack.shown);
 assert.deepStrictEqual(site.afterBack.marked, ["ChatGPT - Green Marketing"],
  "and its link should be the one marked as open, these are: "
  + JSON.stringify(site.afterBack.marked));
});

test("opening the gallery on an example's address shows that example", function () {
 assert.ok(site.opened.shown.indexOf("BroadwayMusical") >= 0,
  "opened on #chatGPT_Bookmark_BroadwayMusical the frame should show that example, it shows "
  + site.opened.shown);
 assert.deepStrictEqual(site.opened.marked, ["ChatGPT - Broadway Musical"],
  "and its link should be the one marked as open, these are: "
  + JSON.stringify(site.opened.marked));
});

test("the open example is marked with aria-current, and nothing with data-active", function () {
 assert.strictEqual(site.identity.staleActive, 0, "data-active was read by the style sheet alone "
  + "and says nothing to a screen reader: " + site.identity.staleActive + " element(s) carry it");
 assert.strictEqual(site.atOpen.stale, 0, "and none should appear once the page has run");
 assert.strictEqual(site.atOpen.marked.length, 1, "one link should be marked as the open one, "
  + site.atOpen.marked.length + " are");
});

// ----------------------------------------------------------------------------------------------- //
// The gallery page itself
// ----------------------------------------------------------------------------------------------- //

test("the gallery names its language, asks a phone to lay it out, and describes itself",
 function () {
  assert.ok(site.identity.lang, "the page should name its language, so a screen reader does not "
   + "guess it");
  assert.ok(/width=device-width/.test(String(site.identity.viewport)),
   "the page should carry a viewport meta, so a phone lays it out at its own width rather than at "
   + "980px scaled down: " + JSON.stringify(site.identity.viewport));
  assert.ok(String(site.identity.description).length > 40, "the page should carry a description, "
   + "it carries " + JSON.stringify(site.identity.description));
  assert.strictEqual(site.identity.icon, "favicon.png", "the page should use the repository's own "
   + "favicon, it names " + JSON.stringify(site.identity.icon));
 });

test("the tab's title and the page's heading read the same", function () {
 assert.deepStrictEqual(site.identity.h1, [site.identity.title], "the title and the one h1 should "
  + "read alike; the title is " + JSON.stringify(site.identity.title) + " and the h1s are "
  + JSON.stringify(site.identity.h1));
});

test("the frame is named for a reader, and carries no obsolete attribute", function () {
 assert.ok(/example/i.test(String(site.identity.frameTitle)), "the frame should carry a title "
  + "naming what it holds, it carries " + JSON.stringify(site.identity.frameTitle));
 assert.strictEqual(site.identity.frameBorder, null, "the frameborder attribute is obsolete and is "
  + "a validator error; the border is CSS. It reads "
  + JSON.stringify(site.identity.frameBorder));
 assert.strictEqual(site.identity.frameName, "examples", "the frame should keep its name, so a "
  + "link's target still reaches it with the page's script off");
 assert.strictEqual(site.identity.inlineHandlers, 0, "the hover that the slide show read as a "
  + "click lived in an inline handler; " + site.identity.inlineHandlers + " element(s) still carry "
  + "one");
});

test("no heading level is skipped going down the gallery's outline", function () {
 var levels = site.identity.outline;
 assert.ok(levels.length >= 4, "the page should have an outline to read, it has " + levels.length
  + " heading(s)");
 assert.strictEqual(levels[0], 1, "the outline should open at h1, it opens at h" + levels[0]);
 for (var i = 1; i < levels.length; i++) {
  assert.ok(levels[i] <= levels[i - 1] + 1, "h" + levels[i - 1] + " is followed by h" + levels[i]
   + ", which skips a level");
 }
});

test("the page says what the examples are and where they came from", function () {
 var tells = site.identity.tells;
 assert.ok(/bookmarklet/i.test(tells), "the page should say the examples came from a bookmarklet");
 assert.ok(/Paste Ready Bookmark Response/.test(tells), "and name the bookmarklet that saved them");
 assert.ok(/github\.com|repositor/i.test(tells), "and point at the repository");
 assert.ok(/gist/i.test(tells), "and link its gist");
 assert.ok(/short/i.test(tells), "and link its short");
 assert.strictEqual(site.identity.installImg, "support/Demo-ReadyToUse.gif",
  "the install note should show the repository's own install animation, it shows "
  + JSON.stringify(site.identity.installImg));
 assert.ok(String(site.identity.installAlt).length > 20, "the animation should describe itself for "
  + "a reader who cannot see it, its alt reads " + JSON.stringify(site.identity.installAlt));
 assert.strictEqual(site.identity.installLazy, "lazy", "an 11 MB animation should load when it is "
  + "asked for, not on the first paint; its loading attribute reads "
  + JSON.stringify(site.identity.installLazy));
 assert.ok(site.identity.installFolded, "and it should sit behind a disclosure, which is what "
  + "keeps a lazy image out of the first paint");
});

test("the install animation is fetched when a reader opens it, and never on the first paint",
 function () {
  var gif = site.identity.installImg;
  var where = GALLERY_WIDTHS[2] + "px";
  var onPaint = install.onPaint.filter(function (url) { return url.indexOf(gif) >= 0; });
  assert.deepStrictEqual(onPaint, [], where + ": the page should paint without fetching the 11 MB "
   + "animation, it asked for " + JSON.stringify(onPaint) + " of "
   + install.onPaint.length + " requests");
  var afterOpening = install.afterOpening.filter(function (url) { return url.indexOf(gif) >= 0; });
  assert.strictEqual(afterOpening.length, 1, where + ": opening the disclosure should fetch the "
   + "animation once, it was fetched " + afterOpening.length + " time(s)");
  assert.ok(install.shown.open, where + ": the disclosure should be open after its summary is "
   + "pressed");
  assert.ok(install.shown.complete && install.shown.natural > 0, where + ": and the animation "
   + "should have arrived, it reads complete=" + install.shown.complete + " naturalWidth="
   + install.shown.natural);
 });

test("the gallery lists the practice pages, each with what to try on it", function () {
 var wanted = ["article", "table", "form", "sidebar", "video", "lazy", "scroll", "snippet"];
 wanted.forEach(function (page) {
  var href = "test/fixtures/pages/" + page + ".html";
  assert.ok(site.identity.practice.indexOf(href) >= 0, "the practice list should link " + href
   + ", it links " + JSON.stringify(site.identity.practice));
 });
 assert.ok(site.identity.practice.indexOf("test/fixtures/pages/index.html") >= 0,
  "and the index of the practice pages");
 assert.strictEqual(site.identity.practiceNames.length, wanted.length, "one entry per page: "
  + site.identity.practiceNames.length + " entries for " + wanted.length + " pages");
 site.identity.practiceNames.forEach(function (said) {
  assert.ok(/try/i.test(said), "each entry should name the bookmarklets to try on its page: "
   + JSON.stringify(said.slice(0, 60)));
 });
});

test("the navigation and the frame never overlap, at a desktop, a laptop or a phone", function () {
 GALLERY_WIDTHS.forEach(function (width) {
  var at = site.layout[width];
  var where = width + "px";
  assert.ok(!at.overlaps, where + ": the navigation and the frame should not be laid over each "
   + "other, they overlap by " + at.overlap + " (nav " + at.nav + ", frame " + at.frame + ")");
  assert.deepStrictEqual(at.covered, [], where + ": every example link should be the thing under "
   + "the pointer at its own middle");
  assert.deepStrictEqual(at.clipped, [], where + ": a link's own words should fit the box they are "
   + "laid in");
  assert.ok(!at.sideways, where + ": the page should not scroll sideways, it is " + at.scrollWidth
   + " wide in " + at.clientWidth);
 });
 assert.ok(site.layout[390].stacked, "390px: the navigation should stack above the frame rather "
  + "than beside it (nav " + site.layout[390].nav + ", frame " + site.layout[390].frame + ")");
 assert.ok(!site.layout[1280].stacked, "1280px: the navigation should sit beside the frame (nav "
  + site.layout[1280].nav + ", frame " + site.layout[1280].frame + ")");
});

test("Tab reaches the five example links in the order they are listed, each visibly marked",
 function () {
  var reached = site.stops.filter(function (at) { return at && at.example; });
  assert.deepStrictEqual(reached.map(function (at) { return at.example; }),
   site.identity.links, "Tab should reach the five example links in the order the navigation "
   + "lists them, it reached " + JSON.stringify(reached.map(function (at) { return at.example; })));
  var unmarked = reached.filter(function (at) { return !at.marked; })
   .map(function (at) { return at.example; });
  assert.deepStrictEqual(unmarked, [], "every focused link should be drawn with a ring a reader "
   + "can see; these were not: " + JSON.stringify(unmarked));
 });

test("the frame is sized to the example it is showing, not to the one before it", function () {
 var tall = site.fit[TALLEST];
 var short = site.fit[SHORTEST];
 assert.ok(tall.shows.indexOf(TALLEST) >= 0, "the first reading should be of " + TALLEST
  + ", it is of " + tall.shows);
 assert.ok(short.shows.indexOf(SHORTEST) >= 0, "the second reading should be of " + SHORTEST
  + ", it is of " + short.shows);
 assert.ok(tall.content - short.content > 100, "the two examples should differ in height by enough "
  + "for a frame left at the first one's height to show: " + tall.content + " and " + short.content);
 [[TALLEST, tall], [SHORTEST, short]].forEach(function (pair) {
  var at = pair[1];
  var want = Math.max(at.content + at.border, at.minHeight);
  assert.ok(Math.abs(at.frameHeight - want) <= 4, pair[0] + ": the frame should be "
   + want + "px for " + at.content + "px of page, plus " + at.border + "px of border (min-height "
   + at.minHeight + "), it is " + at.frameHeight + "px");
  assert.ok(!at.scrollsInside, pair[0] + ": the example should be read down the gallery rather "
   + "than inside a frame with a scrollbar of its own");
 });
});

test("the gallery's own script logs nothing", function () {
 var bad = site.logged.filter(function (said) {
  return !/^(log|debug|info):/.test(said);
 });
 assert.deepStrictEqual(bad, [], "the page should raise nothing over a run that opens it, resizes "
  + "it three times, walks it with Tab and clicks through it: " + JSON.stringify(bad));
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

// The reading that explains the one above: each of these five carries a single colour because there
// is a single surface to draw it on. It is about the pages committed here and not about the
// bookmarklet, whose own page has darkened with the reader's scheme since 11.25.2026 and is read in
// test/paste-ready.test.js. What would change this reading is bringing these five in step with that
// bookmarklet, which brings the color-scheme meta with it; the ring then wants measuring on each
// surface, as it is measured there.
test("each committed example is painted alike in both schemes, which is why its ring carries one colour",
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
    + "why one outline-color serves it. This page now darkens, so it was saved from a bookmarklet "
    + "carrying the color-scheme meta: give it the ring's two colours, #0969da and #58a6ff, and "
    + "measure each against the surface its own scheme paints here.");
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

test("the byline block's own label stays inside the block", function () {
 assert.strictEqual(Object.keys(framedBylines).length, EXAMPLES.length * VIEWPORTS.length,
  "the framed reading should cover all five examples at both widths, it covers "
  + Object.keys(framedBylines).length);
 eachByline(function (at, read) {
  assert.ok(read && !read.error, at + ": " + (read ? read.error : "no byline reading"));
  assert.ok(read.label.length > 0, at + ": the block should hold a label, it holds none");
  assert.deepStrictEqual(read.past, [], at + ": the block is " + read.block + " on a " + read.page
   + "px page, and its own label leaves it: " + JSON.stringify(read.past));
 });
});

// The widths between the two the readings above are taken at. The label's tail reached the curve
// the block is clipped by at 840px to 849px and at 1191px to 1199px, where it just fits on one
// line, and the clip took about a square pixel off the final letter at the first band and two at
// the second. Both words still read at both bands, so this was a look rather than a break, and it
// is the same shape of thing as the dark focus ring was: correct at the two widths anybody read.
test("the byline block's label lands on the block's rounded corner at no width", function () {
 var names = Object.keys(cornerSweep);
 assert.strictEqual(names.length, EXAMPLES.length, "the sweep should cover all five examples, it "
  + "covers " + names.length + ": " + JSON.stringify(names));
 var expected = Math.floor((CORNER_WIDTHS.to - CORNER_WIDTHS.from) / CORNER_WIDTHS.step) + 1;
 names.forEach(function (file) {
  var read = cornerSweep[file];
  assert.ok(read && !read.error, file + ": " + (read ? read.error : "no corner reading"));
  assert.strictEqual(read.steps, expected, file + ": the sweep should read " + expected
   + " widths from " + CORNER_WIDTHS.from + "px, it read " + read.steps);
  // No tolerance is allowed here, and none is wanted: this is layout geometry rather than pixels,
  // so it repeats exactly, and the run rect crosses the curve a little before the ink does. The
  // reserve on the label leaves 6px between the two at the closest approach.
  assert.deepStrictEqual(read.on, [], file + ": the label lands on the block's rounded corner at "
   + read.on.length + " of " + read.steps + " widths, the first of them " + read.on[0]);
 });
});

test("the byline block's own label is painted over none of the heading beside it", function () {
 eachByline(function (at, read) {
  assert.ok(read && !read.error, at + ": " + (read ? read.error : "no byline reading"));
  assert.deepStrictEqual(read.onHeading, [], at + ": the label is at " + JSON.stringify(read.label)
   + " and the heading's runs at " + JSON.stringify(read.heading) + ": "
   + JSON.stringify(read.onHeading));
 });
});
