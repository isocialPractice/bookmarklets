// *********************************************************************************************** //
// paste-ready.test                                                                                //
// Check that ChatGPT - Paste Ready Bookmark Response copies an answer as a bookmark that opens.    //
// *********************************************************************************************** //
// Run with node --test test/paste-ready.test.js, which npm test does after gallery.test.js. The file
// is named rather than discovered, for the reason harness.test.js is: node --test treats every .js
// file under a folder called test as a test file, and test/fixtures/bookmarklets holds fourteen that
// are bookmarklets.
//
// The bookmarklet's own entry in test-bm.json was a run on a signed-in page, which is a skip on every
// machine that is not signed in, so until this file nothing here could say it works. On 11.25.2026 it
// did not: the site had redrawn its conversation, none of the marks the file read were on the page,
// and a click on Copy ended in its REPAIR NEEDED alert with nothing on the clipboard. The entry is now a
// check on a fixture page, with the signed-in run beside it.
//
// The conversation here is built from the marks the file reads, filled with placeholder text. It is
// not the site's page, so it cannot say the site still draws those marks. What it does say is that a
// page drawing them gets a bookmark that opens, and what that bookmark shows.
//
// Two turns are on it. The first carries the marks the site draws now, and the second the ones it
// drew before, which the file keeps as fallbacks.
//
// Nothing here stops at the clipboard, because the clipboard held a bookmarklet that ran before this
// was finished: naming the two new marks alone was enough for that, and the page it opened carried
// each code block a second time as broken markup, its words loose as attributes. So what is copied is
// put through what a URL field does to it, run on an empty page, and read from the page it writes.

var test = require("node:test");
var assert = require("node:assert");
var fs = require("node:fs");
var path = require("node:path");
var vm = require("node:vm");
var playwright = require("playwright");

var bookmarkletFile = path.resolve(__dirname, "..", "JSFormatted",
 "siteSpecific_ChatGPT_PasteReadyBookmarkResponse.js");
var origin = "https://answers.test";

// The first code block, as the page keeps it for its own Copy code button. One of each thing the
// bookmarklet's string, a URL field or HTML could take for something else.
var KEPT_CODE = "def greet(name):\n"
 + "\tprint(f\"Hello, {name}\")  # it's a \\u0041 and a \\n\n"
 + "\tif 7 % 3 < 2 and name > '':\n"
 + "\t\treturn `100%25` & '%41'\n";

// What the code editor has drawn of it. Long code is drawn only where it can be seen, which is why
// the kept attribute is the one to read.
var DRAWN_CODE = ["def greet(name):"];

// The second code block carries no kept copy, so its drawn lines are all there is to read.
var LINES_CODE = ["first = 1", "", "second = first + 1"];

// A link holding the two escapes that end a string early once a URL field has decoded them, the
// quote of the bookmarklet's own string among them.
var LINK = "https://example.com/find?q=%22two%20words%22&note=it%27s&page=2";

function escapeHtml(text) {
 return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ----------------------------------------------------------------------------------------------- //
// The conversation
// ----------------------------------------------------------------------------------------------- //

function editorLines(lines) {
 return "<div class=\"cm-editor\"><div class=\"cm-content\" data-language=\"python\">"
  + lines.map(function (line) {
   return "<div class=\"cm-line\">" + (line ? escapeHtml(line) : "<br>") + "</div>";
  }).join("") + "</div></div>";
}

function toolbar(language) {
 return "<div data-markdown-copy=\"exclude\"><svg width=\"20\" height=\"20\"></svg><div>" + language + "</div>"
  + "<button type=\"button\" aria-label=\"Copy code\">Copy code</button>"
  + "<button type=\"button\" aria-label=\"Copy\" id=\"copy-in-code\">Copy</button></div>";
}

// The turn as the site draws it now: one block holding the question with its own button and the
// answer, then an empty element, then the answer's row of buttons. The empty element is what the climb
// past the buttons met when nothing else matched, and why it found no answer at all.
function turnNow() {
 return "<div data-virtualized-turn=\"\"><div data-turn-key=\"turn-one\"><div><div>"
  + "<div><div data-user-message-bubble=\"true\">A placeholder question.</div>"
  + "<button type=\"button\" aria-label=\"Copy message\">Copy message</button></div>"
  + "<div><div data-response-body=\"answer-one\">"
  + "<div class=\"group [&amp;&gt;*:first-child]:mt-0\" data-placeholder-id=\"one\">"
  + "<h2 class=\"Heading-a\" dir=\"auto\"><span>Placeholder heading</span></h2>"
  + "<p class=\"Paragraph-a\" dir=\"auto\"><span>A \"quoted\" word, an apostrophe's mark, a backslash "
  + "\\u0041 and 50%25 of it.</span> <strong class=\"font-semibold\"><span>Bold words.</span></strong></p>"
  + "<p class=\"Paragraph-a\" dir=\"auto\">Inline <code class=\"inline-a\">class=\"x\" \\u0042</code> code.</p>"
  + "<hr class=\"Rule-a\">"
  + "<p dir=\"auto\"><a class=\"link-a\" data-placeholder-id=\"two\" target=\"_blank\" rel=\"noopener\" href=\""
  + escapeHtml(LINK) + "\">Placeholder link</a> and <a class=\"link-a\" href=\"javascript:void(0)\">a word "
  + "that runs something</a>.</p>"
  + "<ul class=\"List-a\"><li><p dir=\"auto\">First point</p></li><li><p dir=\"auto\">Second point</p></li></ul>"
  + "<ol class=\"List-a\" start=\"3\"><li>Third step</li></ol>"
  + "<div class=\"table-a\"><button type=\"button\">Copy table</button><table class=\"Table-a\"><thead><tr>"
  + "<th class=\"a\" colspan=\"2\">Placeholder columns</th></tr></thead><tbody><tr><td class=\"a\">Cell one</td>"
  + "<td class=\"a\">Cell two</td></tr></tbody></table></div>"
  + "<div class=\"CodeBlock-a\" data-chatgpt-copy-code=\"" + escapeHtml(KEPT_CODE) + "\">"
  + "<div data-code-block=\"true\" data-markdown-copy=\"code-block\" data-theme=\"dark\">"
  + toolbar("Python") + editorLines(DRAWN_CODE) + "</div></div>"
  + "<div hidden=\"\">Placeholder the page never shows</div>"
  + "<div data-code-block=\"true\" data-markdown-copy=\"code-block\">"
  + "<div data-markdown-copy=\"exclude\"><div>Text</div></div>" + editorLines(LINES_CODE) + "</div>"
  + "<p dir=\"auto\">The last placeholder paragraph.</p>"
  + "</div></div></div></div>"
  + "<span aria-hidden=\"true\"></span>"
  + "<div class=\"actionRow-a\"><div><button type=\"button\" aria-label=\"Copy\" id=\"copy-now\">"
  + "<svg width=\"20\" height=\"20\"><path d=\"M0 0h20v20H0z\"></path></svg></button>"
  + "<button type=\"button\" aria-label=\"Share\">Share</button></div></div>"
  + "</div></div></div>";
}

// The turn as the site drew it before: an article, an author mark, and code in a pre.
function turnBefore() {
 return "<article data-testid=\"conversation-turn-2\" data-turn=\"assistant\">"
  + "<div data-message-author-role=\"assistant\"><div class=\"markdown prose\">"
  + "<h3 data-start=\"0\">Earlier heading</h3><p data-start=\"1\">An earlier placeholder paragraph.</p>"
  + "<pre class=\"overflow-visible!\"><div><div>python</div><div><button aria-label=\"Copy\">Copy code</button></div>"
  + "<div><code class=\"language-python\"><span>total = 1</span>\n<span>print(total)</span>\n</code></div></div></pre>"
  + "</div></div>"
  + "<div><button type=\"button\" aria-label=\"Copy\" id=\"copy-before\">Copy</button></div></article>";
}

function conversation() {
 return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Placeholder conversation</title>"
  + "</head><body><main>" + turnNow() + turnBefore() + "</main></body></html>";
}

// ----------------------------------------------------------------------------------------------- //
// Running it
// ----------------------------------------------------------------------------------------------- //

// What a URL field leaves of a pasted bookmarklet: no line breaks and no tabs.
function asUrlField(text) {
 return text.replace(/[\r\n\t]/g, "");
}

// Percent escapes decoded the way a browser decodes a javascript: URL, as test-bm.js does it: a valid
// escape becomes the character it names, and anything that is not one is left as it stands.
function percentDecode(text) {
 return text.replace(/(?:%[0-9A-Fa-f]{2})+/g, function (run) {
  try {
   return decodeURIComponent(run);
  } catch (err) {
   return run.replace(/%([0-9A-Fa-f]{2})/g, function (all, hex) { return String.fromCharCode(parseInt(hex, 16)); });
  }
 });
}

// The code a browser runs for a bookmark whose address is this text.
function asRun(text) {
 return percentDecode(asUrlField(text).replace(/^javascript:/, ""));
}

function parses(code) {
 try {
  new vm.Script(code);
  return null;
 } catch (err) {
  return err.message;
 }
}

// The page a saved bookmark opens, as a reader meets it.
function readOpened() {
 var box = document.getElementById("chatGPTPasteReadyBookmark");
 if (!box) { return null; }
 function words(el) { return (el.textContent || "").replace(/\s+/g, " ").trim(); }
 function all(selector) { return Array.prototype.slice.call(box.querySelectorAll(selector)); }
 var badge = box.querySelector("div[data-side='1']");
 var mine = all("*").filter(function (el) { return !badge.contains(el); });
 var names = {};
 mine.forEach(function (el) {
  el.getAttributeNames().forEach(function (name) { names[name] = true; });
 });
 return {
  text: words(box),
  headings: all("h1, h3, h2").filter(function (h) { return !badge.contains(h); }).map(words),
  paragraphs: all("p").map(words),
  bold: all("strong").map(words),
  inlineCode: all("code").map(function (el) { return el.textContent; }),
  links: all("a").map(function (a) { return { text: words(a), href: a.getAttribute("href") }; }),
  points: all("ul > li").map(words),
  steps: all("ol").map(function (ol) { return { start: ol.getAttribute("start"), first: words(ol.querySelector("li")) }; }),
  head: all("th").map(function (th) { return { text: words(th), colspan: th.getAttribute("colspan") }; }),
  cells: all("td").map(words),
  tableBoxes: all("table").filter(function (t) { return !!t.closest(".tableScrollPasteReady"); }).length,
  blocks: all(".codeBlockPasteReady").map(function (block) {
   var language = block.querySelector(".codeLangPasteReady");
   return { language: language ? language.textContent : "", code: block.querySelector("pre").innerText };
  }),
  attributes: Object.keys(names).sort(),
  classes: mine.map(function (el) { return el.getAttribute("class"); }).filter(Boolean)
   .filter(function (c, i, list) { return list.indexOf(c) === i; }).sort(),
  leftOver: (box.innerHTML.match(/codeblock_paste_ready_\d+_end|unlikely_line|&#92;/g) || [])
 };
}

// Run the bookmarklet once on the conversation, click one thing, and read what reached the clipboard.
async function copyWith(browser, selector) {
 var context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
 try {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: origin });
  var page = await context.newPage();
  await page.route(origin + "/**", function (route) {
   var asked = new URL(route.request().url()).pathname;
   return route.fulfill({ status: 200, contentType: "text/html; charset=utf-8",
    body: asked === "/opened" ? "<!doctype html><html lang=en><title>Empty page</title></html>" : conversation() })
    .catch(function () { });
  });
  var alerts = [], errors = [];
  page.on("dialog", async function (dialog) {
   alerts.push(dialog.message().split(/[:\n]/)[0].trim());
   await dialog.accept().catch(function () { });
  });
  page.on("pageerror", function (err) { errors.push(String(err)); });

  await page.goto(origin + "/", { waitUntil: "load" });
  await page.evaluate(function () { return navigator.clipboard.writeText("nothing copied"); });
  await page.evaluate(asRun(fs.readFileSync(bookmarkletFile, "utf8")));
  await page.locator(selector).first().click();
  // The bookmarklet waits two seconds before it writes, so the page's own copy goes first.
  await page.waitForTimeout(2600);
  var copied = await page.evaluate(function () { return navigator.clipboard.readText(); });

  var opened = null;
  if (/^javascript:/.test(copied) && !parses(asRun(copied))) {
   await page.goto(origin + "/opened", { waitUntil: "load" });
   await page.evaluate(asRun(copied));
   // The page's own script runs half a second in, and takes the line markers out.
   await page.waitForTimeout(1000);
   opened = await page.evaluate(readOpened);
  }
  return { alerts: alerts, errors: errors, copied: copied, opened: opened };
 } finally {
  await context.close();
 }
}

// ----------------------------------------------------------------------------------------------- //
// The colour scheme of the page the bookmark opens
// ----------------------------------------------------------------------------------------------- //

// The saved page follows the reader's scheme, and has since the color-scheme meta arrived on
// 11.25.2026: the meta names both schemes, and the 3% background on the body propagates to the
// canvas, so the canvas is painted with the scheme and the browser's own defaults give the headings,
// the body text and the table cells their colour from it. Before the meta it could not darken at
// all, which is why one outline-color served both from 11.22.2026; the meta arrived on 11.25.2026
// and the ring's second colour on 11.26.2026, the day this reading was written.
//
// It is read here rather than in gallery.test.js, which reads the five examples/ pages committed to
// the site. Those were saved before the meta, carry neither it nor a dark rule, and are painted
// alike in both schemes - so the reading there is true of them and says nothing about the page this
// file builds from the bookmarklet as it stands.
//
// The canvas is read as a pixel, because a painted canvas is not a computed style: the body's
// background composites over the browser's own base and nothing in the CSSOM says what came out. The
// ring is read as declared, from the rules that apply in the scheme, because gallery.test.js already
// shows that a ring declared on this box is painted; what is in question here is whether each
// surface is given a colour of its own.
var SCHEMES = ["light", "dark"];
var RING_CONTRAST = 3;

// A box ruled with a line, read against the canvas the scheme paints. The ceiling is what keeps the
// line a rule rather than a highlight, and the window is how far two boxes ruled at one weight may
// drift apart before they are two weights. The table's grid was #d9d9e3 in both schemes until
// 11.27.2026: 1.34:1 on the light canvas, 13.17:1 on the dark, which made it the one near-white box
// on a near-black page while the code block's own edge two paragraphs below it read 1.87:1.
var RULE_CEILING = 3;
var RULE_WINDOW = 0.5;

// The corner badge's 2px border against the canvas beside it. It is the block's own outline and the
// 80px rounded corner that is the shape of the badge, so it answers to 1.4.11 as the ring does. It
// was `2px solid black` on a #000 surface in both schemes until 11.27.2026: 20.08:1 against the
// light canvas and 1.14:1 against the dark, where the shape all but disappeared.
var BADGE_CONTRAST = 3;

// How far two canvases must differ, in any channel, to count as two surfaces rather than one. The
// two are rgb(249,250,250) and rgb(19,20,20), so the margin is wide; 2 is the figure gallery.test.js
// calls alike, and this is its opposite.
var SCHEMES_APART = 2;

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

function asRgb(text) {
 var m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(String(text || ""));
 return m ? [Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3])] : null;
}

// The mean of a clip, decoded in a page of its own: a canvas is the one PNG decoder to hand, as it
// is in gallery.test.js, so no image library joins the manifest for this.
function meanOfShot(shot) {
 return new Promise(function (res, rej) {
  var img = new Image();
  img.onerror = rej;
  img.onload = function () {
   var c = document.createElement("canvas");
   c.width = img.naturalWidth;
   c.height = img.naturalHeight;
   var g = c.getContext("2d", { willReadFrequently: true });
   g.drawImage(img, 0, 0);
   var d = g.getImageData(0, 0, c.width, c.height).data;
   var sum = [0, 0, 0];
   var n = d.length / 4;
   for (var i = 0; i < d.length; i += 4) {
    sum[0] += d[i]; sum[1] += d[i + 1]; sum[2] += d[i + 2];
   }
   res([Math.round(sum[0] / n), Math.round(sum[1] / n), Math.round(sum[2] / n)]);
  };
  img.src = "data:image/png;base64," + shot;
 });
}

// What the scheme leaves on the saved page, read in the page itself.
function readScheme() {
 // The byline block paints its own black surface and carries the only other heading, so the words
 // read here are the answer's own.
 function of(selector, property) {
  var box = document.getElementById("chatGPTPasteReadyBookmark");
  var badge = box && box.querySelector("div[data-side='1']");
  var found = Array.prototype.slice.call((box || document).querySelectorAll(selector))
   .filter(function (el) { return !badge || !badge.contains(el); })[0];
  return found ? getComputedStyle(found).getPropertyValue(property) : null;
 }
 // The outline-color the box would be ringed with, taken from the rules that apply rather than from
 // a focused element: the fixture's table fits its box, so the box is no keyboard stop here and
 // nothing on the page can be given the ring to read off.
 var want = "div.tableScrollPasteReady:focus-visible";
 var ring = null;
 Array.prototype.slice.call(document.styleSheets).forEach(function (sheet) {
  var rules;
  try { rules = Array.prototype.slice.call(sheet.cssRules); } catch (err) { return; }
  (function walk(list) {
   list.forEach(function (rule) {
    if (rule.media) {
     if (window.matchMedia(rule.conditionText).matches) {
      walk(Array.prototype.slice.call(rule.cssRules));
     }
     return;
    }
    if (rule.selectorText !== want) { return; }
    var said = rule.style.getPropertyValue("outline-color");
    if (said) { ring = said; }
   });
  })(rules);
 });
 // The two boxes the page rules a line around, and the corner badge's own edge. The badge is read
 // straight off the block, since of() skips everything inside it on purpose.
 var badge = document.querySelector("#chatGPTPasteReadyBookmark div[data-side='1']");
 var badgeStyle = badge ? getComputedStyle(badge) : null;
 return {
  text: of("p", "color"),
  heading: of("h1", "color"),
  cell: of("td", "color"),
  codeBlock: of("div.codeBlockPasteReady", "background-color"),
  code: of("pre.codePasteReady", "color"),
  grid: of("td", "border-top-color"),
  codeEdge: of("div.codeBlockPasteReady", "border-top-color"),
  badgeEdge: badgeStyle ? badgeStyle.getPropertyValue("border-top-color") : null,
  badgeFace: badgeStyle ? badgeStyle.getPropertyValue("background-color") : null,
  ring: ring
 };
}

// The page the bookmark opens, read in one scheme. The copy on the clipboard is reused rather than
// made again: what the scheme changes is how that one page is painted, not what was copied.
async function openIn(browser, copied, scheme) {
 var context = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 720 } });
 try {
  var page = await context.newPage();
  await page.route(origin + "/**", function (route) {
   return route.fulfill({ status: 200, contentType: "text/html; charset=utf-8",
    body: "<!doctype html><html lang=en><title>Empty page</title></html>" }).catch(function () { });
  });
  var errors = [];
  page.on("pageerror", function (err) { errors.push(String(err)); });
  await page.goto(origin + "/opened", { waitUntil: "load" });
  await page.evaluate(asRun(copied));
  // The page's own script runs half a second in, as it does for the readings above.
  await page.waitForTimeout(1000);
  var read = await page.evaluate(readScheme);
  // The body is half the page wide and centred, and the byline block is fixed to the left, so the
  // top right corner is the one place the canvas shows on its own.
  var shot = (await page.screenshot({ clip: { x: 1266, y: 4, width: 8, height: 8 } })).toString("base64");
  var decoder = await context.newPage();
  await decoder.goto("about:blank");
  read.canvas = await decoder.evaluate(meanOfShot, shot);
  read.errors = errors;
  read.scheme = scheme;
  return read;
 } finally {
  await context.close();
 }
}

// ----------------------------------------------------------------------------------------------- //
// Tests
// ----------------------------------------------------------------------------------------------- //

// One browser and one copy of each answer, shared: every reading below is of the same unchanged page.
// The copy the answer's own button makes is then opened once in each colour scheme, which is one
// page load apiece and no second copy.
var now, before, inCode;
var painted = {};

test.before(async function () {
 var browser = await playwright.chromium.launch();
 try {
  now = await copyWith(browser, "#copy-now");
  before = await copyWith(browser, "#copy-before");
  inCode = await copyWith(browser, "#copy-in-code");
  if (now.opened) {
   for (var s = 0; s < SCHEMES.length; s++) {
    painted[SCHEMES[s]] = await openIn(browser, now.copied, SCHEMES[s]);
   }
  }
 } finally {
  await browser.close();
 }
});

test("the answer's Copy button puts a bookmarklet on the clipboard, and asks for no repair", function () {
 assert.deepStrictEqual(now.alerts, ["INSTRUCTIONS", "Wait 2 seconds for content to generate as bookmarklet on clipboard."],
  "the click should end in the wait notice, it ended in: " + JSON.stringify(now.alerts));
 assert.ok(/^javascript:/.test(now.copied), "the clipboard should hold a bookmarklet, it holds: " + now.copied.slice(0, 60));
 assert.deepStrictEqual(now.errors, [], "neither the copy nor the page it opens should throw");
});

test("what is copied parses as a URL field leaves it, with and without its escapes decoded", function () {
 var code = now.copied.replace(/^javascript:/, "");
 assert.strictEqual(parses(asUrlField(code)), null, "the breaks taken out");
 assert.strictEqual(parses(code.replace(/\s*\r?\n\s*/g, " ")), null, "each break replaced by a space");
 assert.strictEqual(parses(asRun(now.copied)), null, "the breaks taken out and the percent escapes decoded");
 assert.ok(now.opened, "the bookmark should open a page");
});

test("the bookmark shows the answer's words, in its own headings, paragraphs, lists and table", function () {
 var page = now.opened;
 assert.deepStrictEqual(page.headings, ["ChatGPT Response", "Placeholder heading"]);
 assert.deepStrictEqual(page.paragraphs, [
  "A \"quoted\" word, an apostrophe's mark, a backslash \\u0041 and 50%25 of it. Bold words.",
  "Inline class=\"x\" \\u0042 code.",
  "Placeholder link and a word that runs something.",
  "First point", "Second point",
  "The last placeholder paragraph."
 ]);
 assert.deepStrictEqual(page.bold, ["Bold words."]);
 assert.deepStrictEqual(page.inlineCode, ["class=\"x\" \\u0042"]);
 assert.deepStrictEqual(page.points, ["First point", "Second point"]);
 assert.deepStrictEqual(page.steps, [{ start: "3", first: "Third step" }]);
 assert.deepStrictEqual(page.head, [{ text: "Placeholder columns", colspan: "2" }]);
 assert.deepStrictEqual(page.cells, ["Cell one", "Cell two"]);
 assert.strictEqual(page.tableBoxes, 1, "the table should be in a scrolling box of its own");
});

test("a link keeps its address, escapes and all, and one that runs something keeps none", function () {
 assert.deepStrictEqual(now.opened.links, [
  { text: "Placeholder link", href: LINK },
  { text: "a word that runs something", href: null }
 ]);
});

test("each code block is there once, whole, under its language", function () {
 assert.deepStrictEqual(now.opened.blocks, [
  { language: "Python", code: KEPT_CODE.replace(/\n+$/, "") },
  { language: "Text", code: LINES_CODE.join("\n") }
 ]);
 // The kept copy of the code is an attribute around the block. Left on, its quotes ended the attribute
 // early and the rest of the code became markup on the saved page.
 assert.strictEqual(now.opened.text.split("def greet").length - 1, 1, "the first block's code should be on the page once");
});

test("nothing that was the page's own is on the saved page", function () {
 var page = now.opened;
 assert.deepStrictEqual(page.attributes.filter(function (name) {
  return ["class", "colspan", "data-nav", "data-side", "dir", "href", "start", "role", "tabindex", "aria-label"].indexOf(name) < 0;
 }), [], "no attribute of the site's should be written into the bookmark");
 assert.deepStrictEqual(page.classes, ["codeBlockPasteReady", "codeLangPasteReady", "codePasteReady", "tableScrollPasteReady"]);
 ["placeholder question", "Copy code", "Copy table", "Copy message", "Share", "never shows"].forEach(function (said) {
  assert.ok(page.text.indexOf(said) < 0, "the saved page should not say \"" + said + "\"");
 });
 assert.deepStrictEqual(page.leftOver, [], "no marker of the bookmarklet's own should be left on the page");
});

test("a Copy button inside the answer is not taken for the answer's own", function () {
 assert.deepStrictEqual(inCode.alerts, ["INSTRUCTIONS"], "a code block's button should start nothing");
 assert.strictEqual(inCode.copied, "nothing copied");
});

test("an answer drawn with the marks the site used before is copied too", function () {
 assert.ok(before.opened, "the bookmark should open a page, the clipboard holds: " + before.copied.slice(0, 60));
 assert.deepStrictEqual(before.opened.headings, ["ChatGPT Response", "Earlier heading"]);
 assert.deepStrictEqual(before.opened.paragraphs, ["An earlier placeholder paragraph."]);
 assert.deepStrictEqual(before.opened.blocks, [{ language: "python", code: "total = 1\nprint(total)" }]);
 assert.deepStrictEqual(before.errors, []);
 assert.deepStrictEqual(before.opened.leftOver, []);
});

test("the page the bookmark opens is painted for the scheme the reader asked for", function () {
 SCHEMES.forEach(function (scheme) {
  assert.ok(painted[scheme], "the page was not opened in the " + scheme + " scheme");
  assert.deepStrictEqual(painted[scheme].errors, [], scheme + ": the page it opens should not throw");
 });
 var light = painted.light.canvas;
 var dark = painted.dark.canvas;
 var apart = Math.max(Math.abs(light[0] - dark[0]), Math.abs(light[1] - dark[1]),
  Math.abs(light[2] - dark[2]));
 assert.ok(apart > SCHEMES_APART, "the canvas is rgb(" + light + ") in light and rgb(" + dark
  + ") in dark, " + apart + " apart per channel. The color-scheme meta and the background on the "
  + "body are what darken it; a page painted alike in both has lost one of them, and the ring's "
  + "two colours then have one surface between them.");
 assert.ok(lum(dark) < lum(light), "the dark scheme should paint the darker canvas, it painted rgb("
  + dark + ") against rgb(" + light + ") in light");
});

test("the words on it are readable on the canvas the scheme painted, in both schemes", function () {
 SCHEMES.forEach(function (scheme) {
  var read = painted[scheme];
  var on = read.canvas;
  ["text", "heading", "cell", "code"].forEach(function (part) {
   var colour = asRgb(read[part]);
   assert.ok(colour, scheme + ": the " + part + " has no colour to read, it is "
    + JSON.stringify(read[part]));
   // The code block paints its own surface, so its words answer to that and not to the canvas.
   var behind = part === "code" ? asRgb(read.codeBlock) : on;
   var got = contrast(colour, behind);
   assert.ok(got >= 4.5, scheme + ": the " + part + " is rgb(" + colour + ") over rgb(" + behind
    + "), a contrast of " + got + ":1, under the 4.5:1 WCAG 1.4.3 asks of body text");
  });
 });
});

test("the table box's ring is coloured for the canvas of each scheme", function () {
 var colours = {};
 SCHEMES.forEach(function (scheme) {
  var read = painted[scheme];
  var ring = asRgb(read.ring);
  assert.ok(ring, scheme + ": no outline-color applies to the table box, the rules gave "
   + JSON.stringify(read.ring));
  colours[scheme] = ring;
  var got = contrast(ring, read.canvas);
  assert.ok(got >= RING_CONTRAST, scheme + ": the ring is rgb(" + ring + ") over the rgb("
   + read.canvas + ") the scheme paints, a contrast of " + got + ":1, under the " + RING_CONTRAST
   + ":1 WCAG 1.4.11 asks of a focus indicator");
 });
 assert.notDeepStrictEqual(colours.light, colours.dark, "both schemes draw the ring rgb("
  + colours.light + "). The page is painted light or dark with the scheme, so one colour is read on "
  + "two surfaces: #0969da is 4.97:1 on the light canvas and 3.55:1 on the dark, #58a6ff 2.42:1 on "
  + "the light and 7.31:1 on the dark.");
});

test("the table's grid is ruled for the scheme, at the weight of the code block's edge beside it",
 function () {
  var grids = {};
  SCHEMES.forEach(function (scheme) {
   var read = painted[scheme];
   var grid = asRgb(read.grid);
   var edge = asRgb(read.codeEdge);
   assert.ok(grid, scheme + ": the table's cells carry no border colour to read, they give "
    + JSON.stringify(read.grid));
   assert.ok(edge, scheme + ": the code block carries no border colour to read, it gives "
    + JSON.stringify(read.codeEdge));
   grids[scheme] = grid;
   var ruled = contrast(grid, read.canvas);
   var beside = contrast(edge, read.canvas);
   assert.ok(ruled <= RULE_CEILING, scheme + ": the grid is rgb(" + grid + ") over the rgb("
    + read.canvas + ") the scheme paints, a contrast of " + ruled + ":1, over the " + RULE_CEILING
    + ":1 that keeps a line a rule rather than a highlight");
   assert.ok(Math.abs(ruled - beside) <= RULE_WINDOW, scheme + ": the grid reads " + ruled
    + ":1 against the canvas and the code block's own edge reads " + beside + ":1, "
    + Math.round(Math.abs(ruled - beside) * 100) / 100 + " apart. The two boxes sit paragraphs "
    + "from each other on one page, so they are ruled at one weight or at two visibly different "
    + "ones.");
  });
  assert.notDeepStrictEqual(grids.light, grids.dark, "both schemes rule the table rgb("
   + grids.light + "). Every rule above the dark block leaves the grid at #d9d9e3, which is "
   + "1.34:1 on the light canvas and 13.17:1 on the dark - a quiet rule in one scheme and a "
   + "near-white grid on a near-black page in the other.");
 });

test("the corner badge keeps an edge of its own on the canvas each scheme paints", function () {
 var edges = {};
 SCHEMES.forEach(function (scheme) {
  var read = painted[scheme];
  var edge = asRgb(read.badgeEdge);
  var face = asRgb(read.badgeFace);
  assert.ok(edge, scheme + ": the badge carries no border colour to read, it gives "
   + JSON.stringify(read.badgeEdge));
  assert.ok(face, scheme + ": the badge carries no surface colour to read, it gives "
   + JSON.stringify(read.badgeFace));
  edges[scheme] = edge;
  assert.ok(lum(face) < 0.05, scheme + ": the badge's surface is rgb(" + face + "). The white "
   + "label on it is read against that surface, so the surface stays the dark one it has always "
   + "been and the border is what carries the shape.");
  var got = contrast(edge, read.canvas);
  assert.ok(got >= BADGE_CONTRAST, scheme + ": the badge's border is rgb(" + edge + ") over the "
   + "rgb(" + read.canvas + ") the scheme paints, a contrast of " + got + ":1, under the "
   + BADGE_CONTRAST + ":1 WCAG 1.4.11 asks of a shape a reader has to make out. The border is the "
   + "block's own outline and the 80px corner that is the shape of the badge, so under it the "
   + "block has no edge and no corner, however well the label on it reads.");
 });
 assert.notDeepStrictEqual(edges.light, edges.dark, "both schemes draw the badge's border rgb("
  + edges.light + "). Black on a black surface is 20.08:1 against the light canvas and 1.14:1 "
  + "against the dark, so one colour cannot hold the shape on both.");
});
