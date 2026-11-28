// *********************************************************************************************** //
// make-install-page                                                                               //
// Write install.html: one row per bookmarklet, with a link to drag onto the bookmarks bar.        //
// *********************************************************************************************** //
// Run with node make-install-page.js, which npm run install-page does. --check writes nothing and
// exits 1 when install.html is not what this run would write, which is how a stale page is caught
// without a browser.
//
// A site can render <a href="javascript:...">, which a README cannot: GitHub strips a javascript:
// href out of rendered markdown, so the README can only ever tell a reader to open the raw file and
// copy it. This page is the one place in the repository a reader installs a bookmarklet by dragging
// it.
//
// GitHub Pages runs no build here, so the page is generated and the result committed. Regenerate it
// whenever a bookmarklet is added or repaired - test/install.test.js fails when the committed page is
// not what this writes, so a forgotten run shows up in npm test rather than on the site.
//
// What goes in each href is the join test-bm.js checks: every line of the file concatenated with
// nothing between them, the way a URL field joins what is pasted into it. That join is then
// percent-encoded whole, so the browser hands the bookmarklet back exactly as the file holds it -
// including a per cent sign, which is the one character a raw paste changes (the %16 in i%16 decodes
// to a control character on a real bookmarks bar). So what installs from this page is the code
// test-bm.js ran, character for character, and a file whose join does not parse gets no link at all.
//
// Everything a row says other than the code comes out of README.md, which is where it is already
// maintained: the navigation list gives each bookmarklet's status, and the entry gives the title,
// the one-line description, the raw file link that names the file, the gist, and the short if it has
// one. Nothing here reads .gists/, which is the maintainer's own.
//
// The page is about 760 KB, nearly all of it encoded code. It is repetitive text, so it gzips to
// about 136 KB, which is what Pages serves, and nothing on it is fetched after the page itself.

"use strict";

var fs = require("node:fs");
var path = require("node:path");
var vm = require("node:vm");

var root = __dirname;
var jsDir = path.join(root, "JSFormatted");
var readmeFile = path.join(root, "README.md");
var outFile = path.join(root, "install.html");

var REPO = "isocialPractice/bookmarklets";
var RAW = "https://raw.githubusercontent.com/" + REPO + "/main/JSFormatted/";
var README_URL = "https://github.com/" + REPO;

// ----------------------------------------------------------------------------------------------- //
// Reading README.md
// ----------------------------------------------------------------------------------------------- //

// GitHub's own anchor for a heading: lower case, the spaces hyphens, and nothing kept but word
// characters and hyphens. The navigation list is written by hand and its anchors do not always match
// the title beside them, so an entry's anchor is derived from the entry's own heading instead.
function anchorOf(title) {
 return String(title).toLowerCase().replace(/[^\w\- ]+/g, "").replace(/ /g, "-");
}

function textOf(markdown) {
 return String(markdown)
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
  .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/[*`_]/g, "")
  .replace(/\s+/g, " ")
  .trim();
}

// The status the navigation list gives each bookmarklet: "ready to use", "requires 1 change(s)",
// "deprecated", "tested by hand". It is keyed by the anchor, since that is the one part of a
// navigation line that is certainly the entry's.
function statusByAnchor(lines) {
 var found = {};
 lines.forEach(function (line) {
  var m = /^\s*-\s*\[([^\]]+)\]\(#([^)]+)\)\s*-\s*(.+?)\s*$/.exec(line);
  if (m) { found["#" + m[2]] = textOf(m[3]); }
 });
 return found;
}

// Each entry is a title line followed by a line of dashes - a setext heading - and runs to the next
// one or to the end of the file. The level 1 headings above them name the type.
function entriesOf(lines) {
 var found = [];
 var type = null;
 var open = null;
 lines.forEach(function (line, i) {
  var heading = /^#\s+(.*?)\s*:?\s*$/.exec(line);
  if (heading) {
   var named = heading[1].replace(/!\[[^\]]*\]\([^)]*\)/g, "").trim();
   if (/\bBookmarklets$/i.test(named) && !/^Browser\b/i.test(named)) {
    type = named.replace(/\s*Bookmarklets$/i, "").trim();
   }
   return;
  }
  if (i === 0 || !/^-{3,}\s*$/.test(line)) { return; }
  var title = lines[i - 1].replace(/\s*:\s*$/, "").trim();
  if (!title || /^[<\-#]/.test(title)) { return; }
  if (open) { open.to = i - 1; }
  open = { title: title, type: type, from: i + 1, to: lines.length };
  found.push(open);
 });
 return found.map(function (entry) {
  // The comments go, and they have to: an entry without a short keeps the line for one commented
  // out, placeholder address and all, so a row was built linking
  // https://www.youtube.com/shorts/<id> - a broken link, on a public page, for the one bookmarklet
  // that is deprecated. A comment can span lines, so this is done on the joined body.
  entry.body = lines.slice(entry.from, entry.to).join("\n").replace(/<!--[\s\S]*?-->/g, "");
  return entry;
 });
}

// How long a one-line description may run. The README's own descriptions go from 35 characters to
// 693, and a cell in a column of five has no room for the longest of them, so it is cut at the
// sentence that would take it past this. The row links the entry, which holds the whole of it.
var ONE_LINE = 180;

// A trailing label, such as the "Works with:" that introduces a list of companion bookmarklets. It
// is recognized by its shape rather than by its words - a short run with no sentence end before the
// colon - so a label nobody thought of here is dropped too.
function dropLabel(words) {
 // The space before the label is optional: one entry reads "columns.Works with:" with none.
 var cut = words.replace(/(^|[.!?])\s*[^.!?]{0,30}:\s*$/, "$1").trim();
 // A description that is itself one run ending in a colon has no label to drop, only the colon.
 return (cut || words).replace(/\s*:\s*$/, "").trim();
}

// The entry's first words, kept to a line: whole sentences, and as many of them as fit.
function oneLine(words) {
 var said = dropLabel(words);
 var sentences = said.match(/[^.!?]+(?:[.!?]+|$)/g) || [said];
 var out = "";
 for (var i = 0; i < sentences.length; i++) {
  if (out && (out + sentences[i]).trim().length > ONE_LINE) { break; }
  out += sentences[i];
 }
 out = dropLabel(out.trim());
 // One sentence longer than the line is the case the loop above cannot help: cut it at a word.
 if (out.length > ONE_LINE) { out = out.slice(0, ONE_LINE).replace(/\s+\S*$/, "") + " ..."; }
 return out;
}

// The description: the entry's own first words, which sit above its USE line.
function describe(body) {
 var said = [];
 var lines = body.split("\n");
 for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  if (/<strong>\s*USE/i.test(line) || /^#{2,}\s/.test(line)) { break; }
  if (/^\s*(?:[-*+]|\d+\.)\s/.test(line) && said.length) { break; }
  var words = textOf(line);
  if (!words) { if (said.length) { break; } continue; }
  said.push(words);
  if (/<br\s*\/?>\s*<br\s*\/?>\s*$/i.test(line.trim())) { break; }
 }
 return oneLine(said.join(" ").replace(/\s+/g, " ").trim());
}

function firstMatch(body, pattern) {
 var m = pattern.exec(body);
 return m ? m[1] : null;
}

function readReadme() {
 var lines = fs.readFileSync(readmeFile, "utf8").split(/\r?\n/);
 var status = statusByAnchor(lines);
 var rawPattern = new RegExp(RAW.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([A-Za-z0-9_]+)\\.js");
 var byName = {};
 entriesOf(lines).forEach(function (entry) {
  var file = firstMatch(entry.body, rawPattern);
  if (!file || byName[file]) { return; }
  var anchor = "#" + anchorOf(entry.title);
  byName[file] = {
   name: file,
   title: entry.title,
   type: entry.type || "Other",
   anchor: anchor,
   status: status[anchor] || "",
   description: describe(entry.body),
   gist: firstMatch(entry.body, /\((https:\/\/gist\.github\.com\/[^)\s]+)\)/),
   short: firstMatch(entry.body, /\((https:\/\/www\.youtube\.com\/shorts\/[^)\s]+)\)/)
  };
 });
 return byName;
}

// ----------------------------------------------------------------------------------------------- //
// Reading the bookmarklets
// ----------------------------------------------------------------------------------------------- //

// The file as a URL field joins it, and the address a bookmark holding it would carry. A join that
// does not parse gets no address: test-bm.js is what says a file is installable, and a page that
// handed out a broken one would be installing something nothing ever ran.
function addressOf(source) {
 var joined = source.split(/\r?\n/).join("");
 var code = joined.replace(/^\s*javascript:/i, "");
 if (code === joined) { return { error: "the file does not open with javascript:" }; }
 try {
  new vm.Script(code);
 } catch (err) {
  return { error: "the file joined onto one line does not parse: " + err.message };
 }
 return { href: "javascript:" + encodeURIComponent(code), length: code.length };
}

// ----------------------------------------------------------------------------------------------- //
// Writing the page
// ----------------------------------------------------------------------------------------------- //

function escapeHtml(text) {
 return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
}

// "requires 1 change(s)" and "requires 1 change" are the same thing said two ways in the README, and
// what a reader of this page is being told is whether to edit the file before saving it.
function statusWords(status) {
 var changes = /requires\s+(\d+)\s+change/i.exec(status || "");
 if (changes) {
  return { kind: "changes",
   words: "requires " + changes[1] + " change" + (changes[1] === "1" ? "" : "s") };
 }
 if (/deprecated/i.test(status)) { return { kind: "deprecated", words: "deprecated" }; }
 if (/by hand/i.test(status)) { return { kind: "byHand", words: "tested by hand" }; }
 if (/ready to use/i.test(status)) { return { kind: "ready", words: "ready to use" }; }
 return { kind: "unknown", words: status || "not stated in the README" };
}

var TYPES = ["DOM", "Navigation", "Style", "Site Specific", "Window", "Other"];

function rowOf(entry) {
 var state = statusWords(entry.status);
 var cells = [];
 cells.push('<th scope="row" data-label="Bookmarklet">' + escapeHtml(entry.title)
  + '<code class="file">' + escapeHtml(entry.name) + '.js</code></th>');
 cells.push('<td data-label="What it does">'
  + escapeHtml(entry.description || "No description in the README.") + '</td>');
 cells.push('<td data-label="Status"><span class="state ' + state.kind + '">'
  + escapeHtml(state.words) + '</span></td>');

 // A deprecated bookmarklet is kept in the repository as it is, because its site now does the job
 // itself or a better tool does. Handing a reader a link to install one would be offering a tool
 // that has been withdrawn, so the row says so in the link's place.
 if (state.kind === "deprecated") {
  cells.push('<td data-label="Drag to install"><span class="noDrag">withdrawn, nothing to '
   + 'install</span></td>');
 } else if (entry.address.error) {
  cells.push('<td data-label="Drag to install"><span class="noDrag">no link: '
   + escapeHtml(entry.address.error) + '</span></td>');
 } else {
  cells.push('<td data-label="Drag to install"><a class="drag" draggable="true"'
   + ' data-bookmarklet="' + escapeHtml(entry.name) + '.js" href="'
   + escapeHtml(entry.address.href) + '" title="Drag this onto the bookmarks bar">'
   + escapeHtml(entry.title) + '</a></td>');
 }

 var links = ['<a href="' + escapeHtml(README_URL + "/" + entry.anchor) + '">README</a>'];
 if (entry.gist) { links.push('<a href="' + escapeHtml(entry.gist) + '">gist</a>'); }
 if (entry.short) { links.push('<a href="' + escapeHtml(entry.short) + '">short</a>'); }
 links.push('<a href="' + escapeHtml(RAW + entry.name + ".js") + '">raw file</a>');
 cells.push('<td data-label="More">' + links.join(' <span aria-hidden="true">|</span> ')
  + '</td>');

 return " <tr>\n  " + cells.join("\n  ") + "\n </tr>";
}

function tableOf(type, rows) {
 var many = rows.length === 1 ? "" : "s";
 return '<h2 id="' + escapeHtml(anchorOf(type)) + '">' + escapeHtml(type) + ' bookmarklets</h2>\n'
  + '<div class="rows">\n'
  + '<table>\n'
  + ' <caption>' + rows.length + ' ' + escapeHtml(type.toLowerCase()) + ' bookmarklet' + many
  + ', each with the link to drag onto the bookmarks bar.</caption>\n'
  + ' <thead>\n'
  + '  <tr><th scope="col">Bookmarklet</th><th scope="col">What it does</th>'
  + '<th scope="col">Status</th><th scope="col">Drag to install</th>'
  + '<th scope="col">More</th></tr>\n'
  + ' </thead>\n'
  + ' <tbody>\n' + rows.join("\n") + '\n </tbody>\n'
  + '</table>\n</div>';
}

var STYLE = [
 "* {",
 " font-family: sans-serif, system-ui, helvetica;",
 " box-sizing: border-box;",
 "}",
 "body {",
 " margin: 0;",
 " padding: 0 20px 40px;",
 "}",
 "h1 {",
 " margin-left: 10px;",
 "}",
 "h2 {",
 " margin: 30px 10px 10px;",
 "}",
 "a:focus-visible {",
 " outline: 3px solid #0969da;",
 " outline-offset: 2px;",
 "}",
 ".intro {",
 " max-width: 70ch;",
 " margin: 0 10px 30px;",
 "}",
 ".intro p,",
 ".intro li {",
 " line-height: 1.5;",
 "}",
 "/* Under 760px the rows are laid out as blocks, each cell labelled from the column it came from,",
 "   which is what makes a five column table readable on a phone. Above it the table fits at every",
 "   width from 761px up, so nothing here scrolls and nothing here is a keyboard stop: a box with",
 "   nothing to scroll that Tab lands on is a stop with nothing to do on it, which is the defect",
 "   test/gallery.test.js reads for on the saved pages. overflow-x is the safety net alone - a cell",
 "   that ever did overflow would scroll its own box rather than the page, and the keyboard would",
 "   then want the tabindex those pages add at run time. test/install.test.js asserts that no box",
 "   has anything to scroll, so the day one does is the day that is read again. */",
 ".rows {",
 " overflow-x: auto;",
 " margin: 0 10px 20px;",
 "}",
 "table {",
 " width: 100%;",
 " border-collapse: collapse;",
 "}",
 "caption {",
 " margin-bottom: 8px;",
 " color: #021;",
 " text-align: left;",
 "}",
 "th, td {",
 " padding: 10px;",
 " border-bottom: 1px solid #d1d9e0;",
 " text-align: left;",
 " vertical-align: top;",
 " line-height: 1.5;",
 "}",
 "thead th {",
 " background: #021;",
 " color: white;",
 "}",
 "/* A file name is one unbreakable word and the longest is 57 characters, so left whole it is the",
 "   table's own minimum width: at 400px that made the table 448px and scrolled the page sideways,",
 "   and from 761px to 1030px it holds a column out of view. The floor here is what stops the column",
 "   being crushed to a few characters once the name is allowed to break. */",
 "tbody th {",
 " min-width: 17ch;",
 "}",
 "code.file {",
 " display: block;",
 " margin-top: 4px;",
 " font-family: ui-monospace, SFMono-Regular, Consolas, monospace;",
 " font-size: 85%;",
 " font-weight: normal;",
 "}",
 "/* The break, and the one band of widths that needs it. anywhere is the only value that lowers the",
 "   minimum width a box reports - break-word leaves it where it was - so it is what holds a 57",
 "   character name inside a narrow viewport, and it costs a name broken mid-word wherever it",
 "   applies. From 1031px up every table fits its box with the names whole, which is the figure",
 "   test/install.test.js reads back, so above that the break buys nothing and is not applied.",
 "   It sat in code.file unconditionally as well as under a breakpoint until 11.27.2026, and the",
 "   page was then exactly what that arrangement was written to avoid: read off the committed page,",
 "   51 of the 54 names were painted on more than one line at 1280px and 53 of 54 at 761px, each",
 "   broken mid-word - dom_Clipboard_ConvertPageT / oMarkdown.js at 1280px - while the table fitted",
 "   its box and the page scrolled neither way, which is why nothing here read it. */",
 "@media (max-width: 1030px) {",
 " code.file {",
 "  overflow-wrap: anywhere;",
 " }",
 "}",
 "/* The floor above is one value for the whole break band, and it is tuned for the narrow end of",
 "   it: at 761px 17ch is within two characters of the most that fits, which is why the floor reads",
 "   as correct when it is checked there alone. At the top of the band it gives up far more than the",
 "   overflow it recovers. At 1030px the break turns on to recover one pixel in one table of five,",
 "   and the first column falls from 282px to 181px for it, 53 of the 54 names broken mid-word with",
 "   11 of them on three lines - dom_Clutter_ClickToHid / e.js, a name that fitted whole one pixel",
 "   earlier - beside roughly 340px of empty row. A 1024px laptop is a common width and sits in the",
 "   worst of it. So the top of the band carries a floor of its own. 42ch is the widest that still",
 "   leaves every table inside its box at 960px, this band's bottom edge, read by walking the floor",
 "   up a character at a time at each width; 44ch fits from 1000px up and only 41ch at 950px, which",
 "   is what puts the edge at 960px. The band reads better than the width above the breakpoint on",
 "   both columns at once: at 1030px the first column holds at 374px with 10 names broken and none",
 "   on three lines, and the description column is 183px wide against the 134px it has at 1031px,",
 "   where the names are whole and the descriptions run to 14 lines. Both edges are figures about",
 "   this list's own longest name and longest description, so re-measure them when either grows. */",
 "@media (min-width: 960px) and (max-width: 1030px) {",
 " tbody th {",
 "  min-width: 42ch;",
 " }",
 "}",
 ".state {",
 " display: inline-block;",
 " padding: 3px 8px;",
 " border: 1px solid #021;",
 " border-radius: 10px;",
 " font-size: 90%;",
 " white-space: nowrap;",
 "}",
 ".state.ready {",
 " border-color: #1a7f37;",
 " color: #1a7f37;",
 "}",
 ".state.changes {",
 " border-color: #9a6700;",
 " color: #9a6700;",
 "}",
 ".state.deprecated,",
 ".state.byHand,",
 ".state.unknown {",
 " border-color: #59636e;",
 " color: #59636e;",
 "}",
 "/* deprecated and tested by hand are the two grey states a reader meets, and they mean opposite",
 "   things: one is withdrawn and not offered to install, the other is maintained and tested by a",
 "   person. Painted alike they were the same pill at a CIE76 dE of 0, with nothing but the words",
 "   between them. A third colour would weaken the three-way reading the other pills carry - ready",
 "   #1a7f37 at 5.08:1, requires N changes #9a6700 at 4.87:1 and these two at 6.11:1, all clear of",
 "   AA on the white row - so the break is the border's style and not its colour, which a reader",
 "   who sees no colour at all still reads. */",
 ".state.deprecated {",
 " border-style: dashed;",
 "}",
 ".drag {",
 " display: inline-block;",
 " padding: 8px 14px;",
 " border: 1px solid #021;",
 " border-radius: 5px;",
 " background: white;",
 " color: #021;",
 " text-decoration: none;",
 " cursor: grab;",
 "}",
 ".noDrag {",
 " color: #59636e;",
 "}",
 "@media (max-width: 760px) {",
 " .rows {",
 "  overflow-x: visible;",
 " }",
 " /* The table box itself stops being a table too. A display: table box is sized from the widest",
 "    thing in it whatever its width says, so rows laid out as blocks inside one still sit in a box",
 "    as wide as its widest cell ever wanted to be. */",
 " table,",
 " caption,",
 " tbody {",
 "  display: block;",
 " }",
 " thead {",
 "  position: absolute;",
 "  width: 1px;",
 "  height: 1px;",
 "  overflow: hidden;",
 "  clip-path: inset(50%);",
 " }",
 " tbody tr {",
 "  display: block;",
 "  margin-bottom: 20px;",
 "  border: 1px solid #d1d9e0;",
 "  border-radius: 5px;",
 " }",
 " tbody th,",
 " tbody td {",
 "  display: block;",
 "  border-bottom: 0;",
 " }",
 " tbody td::before {",
 '  content: attr(data-label) ": ";',
 "  display: block;",
 "  color: #59636e;",
 "  font-size: 90%;",
 " }",
 "}"
];

function page(entries) {
 var byType = {};
 entries.forEach(function (entry) {
  var type = TYPES.indexOf(entry.type) < 0 ? "Other" : entry.type;
  (byType[type] = byType[type] || []).push(entry);
 });
 var tables = TYPES.filter(function (type) { return byType[type]; }).map(function (type) {
  return tableOf(type, byType[type].map(rowOf));
 });
 var ready = entries.filter(function (e) { return statusWords(e.status).kind === "ready"; }).length;

 return [
  "<!doctype html>",
  '<html lang="en">',
  "<head>",
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  "<title>Install a Bookmarklet</title>",
  '<meta name="description" content="Every bookmarklet in the repository, each with a link to drag '
   + 'onto the bookmarks bar, its status, and links to its entry, gist and short.">',
  '<link rel="icon" href="favicon.png">',
  "<!-- Written by make-install-page.js. Edit that, not this: npm run install-page rewrites the",
  "     whole of this file, and test/install.test.js fails while the two disagree. -->",
  "<style>",
  STYLE.join("\n"),
  "</style>",
  "</head>",
  "",
  "<body>",
  "",
  "<h1>Install a Bookmarklet</h1>",
  "<hr>",
  "",
  '<section class="intro">',
  " <p>Drag a link in the <strong>Drag to install</strong> column onto the bookmarks bar, and that",
  "  bookmarklet is installed under the name on the link. It holds the same code the",
  '  <a href="' + README_URL + '">repository README</a> gives as a raw file to copy, joined onto one',
  "  line the way a bookmark's address field joins it, so a bookmarklet installed from here and one",
  "  pasted by hand are the same bookmarklet.</p>",
  " <p>No bookmarks bar to drag onto? Right click the link, copy its address, then make a new",
  "  bookmark and paste that as the URL. Or open the raw file, select all, copy, and paste that",
  "  instead, line breaks and all, which is what the files are written for.</p>",
  " <p>What the statuses mean:</p>",
  " <ul>",
  "  <li><strong>ready to use</strong> - install it and use it as it is. " + ready + " of the "
   + entries.length + " are.</li>",
  "  <li><strong>requires N changes</strong> - the file says near the top what to change, so open",
  "   the raw file, change those lines, and paste the result rather than dragging the link. The link",
  "   installs the file unchanged, which does less than the file can.</li>",
  "  <li><strong>tested by hand</strong> - still maintained, but its page is one no automated run",
  "   opens, so a person tests it.</li>",
  "  <li><strong>deprecated</strong> - kept in the repository as a record and not offered to",
  "   install: its site now does the job itself, or a better tool does. Its README entry says",
  "   which.</li>",
  " </ul>",
  ' <p>The <a href="./">example gallery</a> shows what some of them do, and lists practice pages to',
  "  try the ones that work on any page on.</p>",
  "</section>",
  "",
  tables.join("\n\n"),
  "",
  "</body>",
  "</html>",
  ""
 ].join("\n");
}

// ----------------------------------------------------------------------------------------------- //
// Running it
// ----------------------------------------------------------------------------------------------- //

function build() {
 var described = readReadme();
 var names = fs.readdirSync(jsDir).filter(function (f) { return /\.js$/i.test(f); })
  .map(function (f) { return f.replace(/\.js$/i, ""); }).sort();
 var problems = [];
 var entries = names.map(function (name) {
  var entry = described[name];
  if (!entry) {
   problems.push(name + ": no README entry links its raw file");
   entry = { name: name, title: name, type: "Other", anchor: "#" + anchorOf(name),
    status: "", description: "" };
  }
  entry.address = addressOf(fs.readFileSync(path.join(jsDir, name + ".js"), "utf8"));
  if (entry.address.error) { problems.push(name + ": " + entry.address.error); }
  return entry;
 });
 return { text: page(entries), entries: entries, problems: problems };
}

function main(argv) {
 var check = argv.indexOf("--check") >= 0;
 var built = build();
 built.problems.forEach(function (said) { console.log("make-install-page: " + said); });

 if (check) {
  var held = fs.existsSync(outFile) ? fs.readFileSync(outFile, "utf8") : null;
  if (held === built.text) {
   console.log("make-install-page: install.html is what this run would write, "
    + built.entries.length + " bookmarklets");
   return 0;
  }
  console.log("make-install-page: install.html is "
   + (held === null ? "not there" : "not what this run would write")
   + ", run npm run install-page");
  return 1;
 }

 fs.writeFileSync(outFile, built.text, "utf8");
 console.log("make-install-page: install.html written, " + built.entries.length
  + " bookmarklets, " + built.text.length + " characters");
 return built.problems.length ? 1 : 0;
}

if (require.main === module) { process.exit(main(process.argv.slice(2))); }

module.exports = { build: build, addressOf: addressOf, anchorOf: anchorOf, outFile: outFile };
