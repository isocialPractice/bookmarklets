// *********************************************************************************************** //
// test-bm                                                                                         //
// Run a bookmarklet in a real browser and say whether it still works.                             //
// *********************************************************************************************** //
// Needs Playwright: npm install, then npx playwright install chromium.
//
//   node test-bm.js <name> [--headed] [--slow-mo <ms>] [--capture]
//   node test-bm.js --all [--headed] [--slow-mo <ms>] [--capture]
//   node test-bm.js --scheduled
//   node test-bm.js --list
//   node test-bm.js --sign-in <site>
//
// <name>       A bookmarklet in JSFormatted, as "name", "name.js", or "JSFormatted/name.js".
// --all        Every file in JSFormatted, configured or not.
// --scheduled  Only the test-bm.json entries marked "scheduled": true, which is all a cron job or
//              a Windows scheduled task has to call. Nothing on this path waits for input.
// --list       What a run would do with each bookmarklet, without opening a browser.
// --sign-in    Ask the sign-in launcher to open <site> for signing in, then exit.
// --headed     Watch the run in a browser window.
// --slow-mo    Milliseconds between actions, for the same reason. Neither is ever needed.
// --capture    Capture every entry the run reaches, as an entry's "capture": true does for itself.
//
// Before any browser starts, the file is joined onto one line both ways a browser could join it -
// every line break replaced by a space, the way bookmarklet.js copy does it, and both characters
// of the break dropped with nothing in their place, the way a URL field does it - and parsed both
// ways. A file that parses one way and not the other has a line that only works by accident. The
// joined code is then percent-decoded, because a URL field decodes it: a modulo written as i%16
// turns into a control character on a real bookmarks bar, and that surfaces here.
//
// What the bookmarklet adds to the page still answers to the page's content security policy, so an
// injected <style> is refused on a strict site exactly as it would be for a reader.
//
// An entry's url may be "fixture:<file>.html", which is a page in test/fixtures/pages served from
// https://fixtures.test/ without a network. A real origin is what makes localStorage, the clipboard
// and location behave as they do on a site; file:// gives an opaque origin and refuses all three.
//
// It may instead name an environment variable, as "$OCTOPRINT_URL", for a page whose address does not
// belong in the repository. The address is read when the entry runs and never written down: every
// reason, report.json and summary.txt names the variable in its place, and the address is taken back
// out of anything the page itself said. An unset variable is a skip, not a failure.
//
// --capture, and an entry's "capture": true, write a screenshot of the page either side of the
// bookmarklet and a video of the whole entry, into test-results/test-bm/<run>/capture/<name>/. Each
// artifact's path, and the offset into the video at which every step started, go in the report, so a
// clip can be cut to the moment the bookmarklet ran without anyone scrubbing through it.
//
// Two captures of an unchanged bookmarklet are meant to match, so everything this harness decides is
// fixed: the viewport, the steps and their order, and what reaches the page, which is the bookmarklet
// and nothing else - no clock, no random value, no mark of its own. A capturing run also starts the
// browser with hinting, subpixel antialiasing and the colour profile settled, and takes each
// screenshot with animations stopped and no caret drawn. On a page that holds still that is
// byte-for-byte: two captures of example.com are the same file. What is left over is Chromium
// rasterizing the page itself - a handful of pixels either side of a glyph or a rounded border, a
// channel out by one - and no setting here reaches it.
//
// A failure keeps failure.png, the page as it stood when it failed, whether or not the entry was
// captured - except in an entry with auth, which captures nothing at all, because a signed-in page
// shows the account and what it holds.
//
// TEST_BM_JS_DIR and TEST_BM_CONFIG move the bookmarklet folder and the configuration file, which is
// how test/harness.test.js runs this harness against its own fixtures. Nothing else sets them.
//
// An entry with "auth": "<site>" needs a signed-in browser, and this harness never signs in or
// starts one itself. It loads the module TEST_BM_AUTH_LAUNCHER names, an absolute path outside the
// repository, and asks it for a Playwright BrowserContext with launch({ chromium, site }). Without a
// launcher, or with one that has no sign-in for the site, the entry is a skip. The entry also names
// "signedIn", a selector only a signed-in page has, and a page without it, or one that lands on
// another origin, is a skip reading "signed out of <site>". It runs read-only: a click, fill or
// press aimed at a form, a text area, an editable region or a submit control is refused before it
// acts. Nothing the page shows is written down. When the run ends, the launcher's
// signInState(states) hears which sites were found signed in. An entry with auth is never scheduled.
//
// No bookmarklet may do anything that could pass for malicious. Before any browser starts, a file
// that touches document.cookie, runs a string as code (eval, new Function, a string handed to
// setTimeout or setInterval, import()), or loads a <script> by its src without an integrity hash
// fails. During the run, every request started from the bookmarklet's code is noted, and one to a
// host other than the page's own fails the entry unless the entry names that host in "network"
// with the reason. A bookmarklet's own notes and settings in localStorage are
// its business, and nothing here judges them.
//
// Exit 0 nothing failed, 1 something failed, 2 usage or configuration error. A skip never fails a
// run. --all and --scheduled write test-results/test-bm/<YYYY-MM-DD_HHMMSS>/report.json and
// summary.txt.

var fs = require("fs");
var path = require("path");
var nodeUrl = require("url");
var vm = require("vm");

// Repo layout. The two folders a run reads can be moved, which is how the self-test points this
// harness at test/fixtures and checks the harness itself rather than a copy of it.
var rootDir = __dirname;
var jsDir = fromEnv("TEST_BM_JS_DIR", path.join(rootDir, "JSFormatted"));
var configFile = fromEnv("TEST_BM_CONFIG", path.join(rootDir, "test-bm.json"));
var resultsRoot = path.join(rootDir, "test-results", "test-bm");

// Local pages, served from an origin of their own rather than opened as file:// - an opaque origin
// refuses localStorage, the clipboard and a same-document navigation, so a bookmarklet that uses one
// of those would fail on the fixture and work on a site. Nothing here reaches the network, and the
// pages never change.
var fixtureOrigin = "https://fixtures.test";
var fixturePagesDir = path.join(rootDir, "test", "fixtures", "pages");
var fixtureTypes = {
 ".html": "text/html; charset=utf-8",
 ".css": "text/css; charset=utf-8",
 ".js": "text/javascript; charset=utf-8",
 ".json": "application/json; charset=utf-8",
 ".txt": "text/plain; charset=utf-8",
 ".svg": "image/svg+xml",
 ".png": "image/png",
 ".gif": "image/gif",
 ".jpg": "image/jpeg",
 ".jpeg": "image/jpeg",
 ".ico": "image/x-icon",
 ".webm": "video/webm",
 ".mp4": "video/mp4"
};

// What an entry gets when it does not say otherwise. example.com is reserved for documentation, so
// a default run has nothing to break.
var defaultUrl = "https://example.com/";
var defaultTimeout = 30000;
var defaultSettle = 500;
var requiresTimeout = 10000;
var viewport = { width: 1280, height: 720 };
var consoleLimit = 20;

// Exit codes.
var exitOk = 0;
var exitFailed = 1;
var exitConfig = 2;

// Entry and step shapes, which is also what validateConfig refuses anything outside of.
var entryKeys = ["url", "scheduled", "requires", "steps", "dialogs", "permissions", "skip",
 "timeout", "settle", "auth", "signedIn", "network", "capture"];
// A host a network entry names: an exact host, or "*." and a domain for any of its subdomains, as
// a media server picked per request is.
var hostPattern = /^(\*\.)?[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+(:\d+)?$/;
var stepActions = ["run", "click", "fill", "press", "select", "wait", "expect"];
var stepExtras = ["value", "text", "selector"];
var expectKeys = ["selector", "visible", "hidden", "count", "matches", "text", "clipboard", "location", "popup"];

// A url that names an environment variable holding the address, rather than holding it itself.
var urlVariablePattern = /^\$[A-Z][A-Z0-9_]*$/;

// A site name is all an entry with auth hands the sign-in launcher, so it is held to a shape that
// cannot carry anything else.
var siteNamePattern = /^[a-z0-9][a-z0-9-]{0,39}$/;
var launcherVariable = "TEST_BM_AUTH_LAUNCHER";
var withheldText = "(not recorded on a signed-in page)";

// How the code gets into the page, worked out once per browser by chooseInjector.
var injector = "";

// What a browser is started with when the run is going to capture something. Chromium's own text
// rasterizing is what moves between two runs of an unchanged bookmarklet - a handful of antialiased
// pixels either side of a glyph - and these three settle it: no hinting, no subpixel antialiasing,
// one colour profile. A run that captures nothing is started without them, so an ordinary test still
// meets the browser a reader has.
var captureArgs = ["--font-render-hinting=none", "--disable-lcd-text", "--force-color-profile=srgb"];

// One folder per run, holding its report and whatever any entry captured. It is made the first time
// something is written into it, so a run that captures nothing and writes no report leaves none.
var runStarted = null;
var runFolder = "";

// A folder named by the environment, read from the repository root when it is relative.
function fromEnv(name, fallback) {
 var value = process.env[name];
 if (!value || !String(value).trim()) { return fallback; }
 return path.resolve(rootDir, String(value).trim());
}

function runDir() {
 if (!runFolder) {
  runFolder = path.join(resultsRoot, stamp(runStarted || new Date()));
  fs.mkdirSync(runFolder, { recursive: true });
 }
 return runFolder;
}

function configError(message) {
 console.error("test-bm: " + message);
 process.exit(exitConfig);
}

function usage() {
 var lines = fs.readFileSync(__filename, "utf8").split(/\r?\n/);
 var out = [];
 for (var i = 4; i < lines.length && /^\/\//.test(lines[i]); i++) { out.push(lines[i].replace(/^\/\/ ?/, "")); }
 return out.join("\n");
}

function pad(text, width) {
 var s = String(text);
 while (s.length < width) { s += " "; }
 return s;
}

function cut(text) {
 var s = String(text).replace(/\s+/g, " ").trim();
 return s.length > 90 ? s.slice(0, 87) + "..." : s;
}

function escapeRegExp(text) { return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// A failure the run reports as it stands, rather than wrapping it again.
function failure(message) {
 var err = new Error(message);
 err.expected = true;
 return err;
}

// Playwright puts its own call in front of a page error. The bookmarklet's message is what matters.
function firstLine(err) {
 var text = String((err && err.message) || err || "");
 return text.replace(/^[a-z]+\.[a-zA-Z]+: /, "").split("\n")[0].trim();
}

// ----------------------------------------------------------------------------------------------- //
// The files
// ----------------------------------------------------------------------------------------------- //

// "name", "name.js", or "JSFormatted/name.js" -> name, the way bookmarklet.js copy resolves it.
function bookmarkletName(arg) {
 return path.basename(String(arg).trim()).replace(/\.js$/i, "");
}

function bookmarkletFile(name) { return path.join(jsDir, name + ".js"); }

// How a path reads in a message, which is from the repository root and with forward slashes.
function shownPath(full) { return path.relative(rootDir, full).replace(/\\/g, "/"); }

// "fixture:sidebar.html#intro" -> { page: "sidebar.html", rest: "#intro" }, and null for any other
// url. The page and what follows it are kept apart, because one names a file and one does not.
function fixtureName(url) {
 var m = /^fixture:([^?#]+)([?#].*)?$/.exec(String(url).trim());
 if (!m) { return null; }
 return { page: m[1].replace(/^\/+/, ""), rest: m[2] || "" };
}

// The url a run opens: a fixture name becomes an address on the fixture origin.
function resolveUrl(url) {
 var named = fixtureName(url);
 return named === null ? String(url) : fixtureOrigin + "/" + named.page + named.rest;
}

// "$OCTOPRINT_URL" -> "$OCTOPRINT_URL", and "" for a url that holds its own address. A page on the
// maintainer's own network has an address that does not belong in the repository, so the entry names
// the variable instead and the run reads it.
function urlVariable(url) {
 var text = String(url).trim();
 return urlVariablePattern.test(text) ? text : "";
}

// Anything written down about an entry whose url came from a variable, with the address the variable
// held taken out and the variable's name put in its place. A page can say its own address - in a
// console message, an error, a dialog - so taking it out afterwards is what keeps the guarantee.
function scrubbed(ctx, text) {
 var out = String(text);
 if (!ctx || !ctx.hidden) { return out; }
 if (ctx.url) { out = out.split(ctx.url).join(ctx.shown); }
 if (ctx.host) { out = out.split(ctx.host).join(ctx.shown); }
 return out;
}

// The file a fixture name is served from, or "" when it climbs out of the fixture folder.
function fixtureFile(name) {
 var full = path.resolve(fixturePagesDir, name);
 return full.indexOf(fixturePagesDir + path.sep) === 0 ? full : "";
}

function allNames() {
 if (!fs.existsSync(jsDir)) { configError("there is no " + shownPath(jsDir) + " to read bookmarklets from"); }
 return fs.readdirSync(jsDir)
  .filter(function (f) { return /\.js$/i.test(f); })
  .map(function (f) { return f.replace(/\.js$/i, ""); })
  .sort();
}

// The code a browser runs, which is the bookmarklet without its javascript: scheme, and how many
// characters the scheme took with it.
function stripScheme(line) {
 var m = /^\s*javascript:/i.exec(line);
 return m ? { code: line.slice(m[0].length), offset: m[0].length } : { code: line, offset: 0 };
}

function parseError(code, label) {
 try {
  new vm.Script(code, { filename: label });
  return null;
 } catch (err) {
  return err;
 }
}

// Where each file line starts in the lines joined with nothing between them.
function startsOf(lines) {
 var at = 0, starts = [];
 for (var i = 0; i < lines.length; i++) { starts.push(at); at += lines[i].length; }
 return starts;
}

// Percent escapes decoded the way a browser decodes a javascript: URL: a valid escape becomes the
// character it names, and anything that is not one is left as it stands, so a "100%" in a style
// string survives while the %16 in i%16 does not.
function percentDecode(text) {
 return String(text).replace(/(?:%[0-9A-Fa-f]{2})+/g, function (run) {
  try {
   return decodeURIComponent(run);
  } catch (err) {
   var out = "";
   for (var i = 0; i < run.length; i += 3) { out += String.fromCharCode(parseInt(run.substr(i + 1, 2), 16)); }
   return out;
  }
 });
}

// The file line whose end runs into the line below it once the breaks are gone. Putting one space
// back at a time finds it; where no single space is enough, every junction that merges two words is
// named instead.
function junctionNote(lines) {
 var i;
 for (i = 0; i < lines.length - 1; i++) {
  var probe = lines.slice(0, i + 1).join("") + " " + lines.slice(i + 1).join("");
  if (!parseError(stripScheme(probe).code, "junction")) { return "line " + (i + 1) + " runs into the line below it"; }
 }
 var merged = [];
 for (i = 0; i < lines.length - 1; i++) {
  if (/[A-Za-z0-9_$]$/.test(lines[i]) && /^[A-Za-z0-9_$]/.test(lines[i + 1])) { merged.push(i + 1); }
 }
 if (merged.length) { return "lines " + merged.join(", ") + " run into the lines below them"; }
 return "no single line break accounts for it";
}

// Lines holding something a URL field reads as a percent escape.
function percentNote(lines) {
 var found = [];
 for (var i = 0; i < lines.length; i++) {
  if (/%[0-9A-Fa-f]{2}/.test(lines[i])) { found.push(i + 1); }
 }
 if (!found.length) { return "somewhere in the file"; }
 return (found.length == 1 ? "line " : "lines ") + found.slice(0, 6).join(", ")
  + (found.length > 6 ? " and " + (found.length - 6) + " more" : "");
}

// A line comment swallows the rest of a bookmarklet once the breaks are gone, so it is worth
// naming when nothing parses.
function commentNote(lines) {
 var found = [];
 for (var i = 0; i < lines.length; i++) {
  if (/^\s*\/\//.test(lines[i])) { found.push(i + 1); }
 }
 if (!found.length) { return ""; }
 return " (" + (found.length == 1
  ? "line " + found[0] + " starts"
  : "lines " + found.slice(0, 6).join(", ") + " start")
  + " with a line comment, which swallows everything after it on one line)";
}

// What in the code could pass for malicious, read off the source with its block comments taken
// out so a comment that names a thing is not taken for the thing. The empty string when nothing.
function unsafeNote(code) {
 var bare = String(code).replace(/\/\*[\s\S]*?\*\//g, " ");
 if (/\bdocument\s*(\.\s*cookie\b|\[\s*["'`]cookie["'`]\s*\])/.test(bare)) {
  return "it touches document.cookie, and a bookmarklet never reads or writes cookies";
 }
 if (/\beval\s*\(/.test(bare)) { return "it runs a string as code with eval()"; }
 if (/\bnew\s+Function\s*\(|(^|[^.\w$])Function\s*\(/.test(bare)) { return "it runs a string as code with the Function constructor"; }
 if (/\bset(Timeout|Interval)\s*\(\s*["'`]/.test(bare)) { return "it runs a string as code by handing one to setTimeout or setInterval"; }
 if (/(^|[^.\w$])import\s*\(/.test(bare)) { return "it loads code at run time with import()"; }
 var makesScript = /createElement\s*\(\s*["'`]script["'`]\s*\)/i.test(bare);
 var setsSrc = /\.src\s*=|setAttribute\s*\(\s*["'`]src["'`]/.test(bare);
 var pinsIt = /\.integrity\s*=|setAttribute\s*\(\s*["'`]integrity["'`]/.test(bare);
 if (makesScript && setsSrc && !pinsIt) {
  return "it loads a <script> by its src with no integrity hash, so the file that runs is not"
   + " pinned to the file that was reviewed";
 }
 return "";
}

// Everything knowable about a bookmarklet without a browser.
function checkFile(file, name) {
 var text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
 var lines = text.split(/\r?\n/);

 var spaced = stripScheme(text.replace(/\s*\r?\n\s*/g, " ").trim());
 var strict = stripScheme(lines.join(""));

 var spacedErr = parseError(spaced.code, name + ".js");
 var strictErr = parseError(strict.code, name + ".js");

 if (spacedErr && strictErr) {
  return { ok: false, reason: "does not parse on one line: " + spacedErr.message + commentNote(lines) };
 }
 if (strictErr) {
  return { ok: false, reason: junctionNote(lines) + " once the line break is taken out with nothing in"
   + " its place, which is what a bookmarks bar does: " + strictErr.message };
 }
 if (spacedErr) {
  return { ok: false, reason: "parses with its line breaks taken out, but not with each one replaced"
   + " by a space, which is how bookmarklet.js copy joins it: " + spacedErr.message };
 }

 var decoded = percentDecode(strict.code);
 var changed = decoded !== strict.code;
 if (changed) {
  var decodedErr = parseError(decoded, name + ".js");
  if (decodedErr) {
   return { ok: false, reason: "a percent escape on " + percentNote(lines) + " decodes into the code"
    + " when the URL field reads it, the way the %16 in i%16 becomes a control character: "
    + decodedErr.message };
  }
 }

 var unsafe = unsafeNote(decoded);
 if (unsafe) { return { ok: false, reason: "unsafe: " + unsafe }; }

 return {
  ok: true,
  code: decoded,
  decodeChanged: changed,
  starts: startsOf(lines),
  offset: strict.offset,
  spacedLength: spaced.code.length,
  strictLength: strict.code.length
 };
}

// The line in the formatted file a column of the one line came from.
function lineOfColumn(check, column) {
 var at = column - 1 + check.offset;
 var line = 0;
 for (var i = 0; i < check.starts.length; i++) {
  if (check.starts[i] <= at) { line = i + 1; } else { break; }
 }
 return line;
}

// ----------------------------------------------------------------------------------------------- //
// test-bm.json
// ----------------------------------------------------------------------------------------------- //

function readConfig() {
 if (!fs.existsSync(configFile)) { return {}; }
 var raw;
 try {
  raw = JSON.parse(fs.readFileSync(configFile, "utf8").replace(/^﻿/, ""));
 } catch (err) {
  configError(shownPath(configFile) + " does not parse: " + err.message);
 }
 if (!raw || typeof raw != "object" || Array.isArray(raw)) { configError(shownPath(configFile) + " is not an object"); }
 var out = {};
 Object.keys(raw).forEach(function (key) {
  if (key != "$schema") { out[key] = raw[key]; }
 });
 return out;
}

function isStringList(value) {
 return Array.isArray(value) && value.every(function (v) { return typeof v == "string" && v.length; });
}

function validateStep(step, where, problems) {
 if (!step || typeof step != "object" || Array.isArray(step)) {
  problems.push(where + " is not an object");
  return;
 }
 var actions = Object.keys(step).filter(function (k) { return stepActions.indexOf(k) >= 0; });
 Object.keys(step).forEach(function (k) {
  if (stepActions.indexOf(k) < 0 && stepExtras.indexOf(k) < 0) { problems.push(where + ": unknown property " + k); }
 });
 if (actions.length != 1) {
  problems.push(where + " needs exactly one of " + stepActions.join(", ") + ", and carries " + actions.length);
  return;
 }
 var action = actions[0];
 if (action == "run" && step.run !== true) { problems.push(where + ": run takes true"); }
 if (action == "click" && typeof step.click != "string") { problems.push(where + ": click takes a selector"); }
 if (action == "press" && typeof step.press != "string") { problems.push(where + ": press takes a key"); }
 if (action == "select" && typeof step.select != "string") { problems.push(where + ": select takes a selector"); }
 if (action == "wait" && typeof step.wait != "number" && typeof step.wait != "string") {
  problems.push(where + ": wait takes milliseconds or a selector");
 }
 if (action == "fill") {
  var selector = typeof step.fill == "string" ? step.fill : (step.fill && step.fill.selector);
  var value = typeof step.fill == "string"
   ? (step.value !== undefined ? step.value : step.text)
   : (step.fill && step.fill.value);
  if (typeof selector != "string") { problems.push(where + ": fill takes a selector"); }
  if (value === undefined) { problems.push(where + ": fill takes a value"); }
 }
 if (action == "expect") {
  var want = step.expect;
  if (!want || typeof want != "object" || Array.isArray(want)) {
   problems.push(where + ": expect takes an object");
   return;
  }
  Object.keys(want).forEach(function (k) {
   if (expectKeys.indexOf(k) < 0) { problems.push(where + ": expect has no " + k); }
  });
  var valueOnly = want.clipboard !== undefined || want.location !== undefined || want.popup !== undefined;
  if (!valueOnly && typeof want.selector != "string") {
   problems.push(where + ": expect takes a selector, a clipboard value, a location, or a popup");
  }
  if (want.location !== undefined && typeof want.location != "string") { problems.push(where + ": location takes a string"); }
  if (want.popup !== undefined && (typeof want.popup != "string" || !want.popup.length)) {
   problems.push(where + ": popup takes the text the new tab's address holds");
  }
  if (!valueOnly && want.visible === undefined && want.hidden === undefined
   && want.count === undefined && want.matches === undefined && want.text === undefined) {
   problems.push(where + ": expect takes visible, hidden, count, matches, text, clipboard, location or popup");
  }
  if (want.count !== undefined && typeof want.count != "number") { problems.push(where + ": count takes a number"); }
  if (want.matches !== undefined && (typeof want.matches != "string" || !want.matches.length)) {
   problems.push(where + ": matches takes the selector to count against");
  }
  if (want.visible !== undefined && want.visible !== true) { problems.push(where + ": visible takes true - for the other way round, ask for hidden"); }
  if (want.hidden !== undefined && want.hidden !== true) { problems.push(where + ": hidden takes true - for the other way round, ask for visible"); }
 }
}

function validateConfig(config, names) {
 var problems = [];
 Object.keys(config).forEach(function (name) {
  if (names.indexOf(name) < 0) {
   problems.push(name + ": there is no " + shownPath(bookmarkletFile(name)));
   return;
  }
  var entry = config[name];
  if (!entry || typeof entry != "object" || Array.isArray(entry)) {
   problems.push(name + ": the entry is not an object");
   return;
  }
  Object.keys(entry).forEach(function (key) {
   if (entryKeys.indexOf(key) < 0) { problems.push(name + ": unknown property " + key); }
  });
  if (entry.url !== undefined && typeof entry.url != "string") { problems.push(name + ": url takes a string"); }
  if (typeof entry.url == "string" && /^\$/.test(entry.url.trim()) && !urlVariable(entry.url)) {
   problems.push(name + ": a url naming an environment variable is written as $NAME, in upper case");
  }
  if (typeof entry.url == "string" && !urlVariable(entry.url)) {
   var fixture = fixtureName(entry.url);
   if (fixture !== null) {
    var page = fixtureFile(fixture.page);
    if (!page) {
     problems.push(name + ": " + entry.url + " reaches outside " + shownPath(fixturePagesDir));
    } else if (!fs.existsSync(page)) {
     problems.push(name + ": there is no " + shownPath(page));
    }
   }
  }
  if (entry.scheduled !== undefined && typeof entry.scheduled != "boolean") { problems.push(name + ": scheduled takes true or false"); }
  if (entry.skip !== undefined && (typeof entry.skip != "string" || !entry.skip.length)) { problems.push(name + ": skip takes a reason"); }
  if (entry.timeout !== undefined && typeof entry.timeout != "number") { problems.push(name + ": timeout takes milliseconds"); }
  if (entry.settle !== undefined && typeof entry.settle != "number") { problems.push(name + ": settle takes milliseconds"); }
  if (entry.auth !== undefined && (typeof entry.auth != "string" || !siteNamePattern.test(entry.auth))) {
   problems.push(name + ": auth takes a site name of lower-case letters, digits and hyphens, such as chatgpt");
  }
  if (entry.auth !== undefined && (typeof entry.signedIn != "string" || !entry.signedIn.length)) {
   problems.push(name + ": an entry with auth names signedIn, a selector only a signed-in page has");
  }
  if (entry.signedIn !== undefined && entry.auth === undefined) { problems.push(name + ": signedIn goes with auth"); }
  if (entry.auth !== undefined && entry.scheduled === true) {
   problems.push(name + ": an entry with auth is never scheduled - an unattended run has no one to sign in");
  }
  if (entry.capture !== undefined && entry.capture !== true) { problems.push(name + ": capture takes true"); }
  if (entry.capture === true && entry.auth !== undefined) {
   problems.push(name + ": an entry with auth captures nothing - a signed-in page shows the account and what it holds");
  }
  if (entry.network !== undefined) {
   if (!Array.isArray(entry.network)) {
    problems.push(name + ": network takes a list of { host, reason }");
   } else {
    entry.network.forEach(function (n, i) {
     if (!n || typeof n != "object" || Array.isArray(n)) {
      problems.push(name + ": network " + (i + 1) + " is not an object");
      return;
     }
     Object.keys(n).forEach(function (k) {
      if (k != "host" && k != "reason") { problems.push(name + ": network " + (i + 1) + " has no " + k); }
     });
     if (typeof n.host != "string" || !hostPattern.test(n.host)) {
      problems.push(name + ": network " + (i + 1) + ": host takes a host name such as api.example.com, or *.example.com for its subdomains");
     }
     if (typeof n.reason != "string" || !n.reason.trim()) {
      problems.push(name + ": network " + (i + 1) + ": a host is named only with the reason it is needed");
     }
    });
   }
  }
  if (entry.requires !== undefined && !isStringList(entry.requires)) { problems.push(name + ": requires takes a list of selectors"); }
  if (entry.permissions !== undefined && !isStringList(entry.permissions)) { problems.push(name + ": permissions takes a list of names"); }
  if (entry.dialogs !== undefined) {
   if (!Array.isArray(entry.dialogs)) {
    problems.push(name + ": dialogs takes a list of answers");
   } else {
    entry.dialogs.forEach(function (answer, i) {
     if (!answer || typeof answer != "object" || Array.isArray(answer)) {
      problems.push(name + ": dialog " + (i + 1) + " is not an object");
      return;
     }
     Object.keys(answer).forEach(function (k) {
      if (k != "accept" && k != "text") { problems.push(name + ": dialog " + (i + 1) + " has no " + k); }
     });
     if (answer.accept !== undefined && typeof answer.accept != "boolean") {
      problems.push(name + ": dialog " + (i + 1) + ": accept takes true or false");
     }
    });
   }
  }
  if (entry.steps !== undefined) {
   if (!Array.isArray(entry.steps)) {
    problems.push(name + ": steps takes a list");
   } else {
    entry.steps.forEach(function (step, i) { validateStep(step, name + " step " + (i + 1), problems); });
   }
  }
 });
 if (problems.length) { configError(shownPath(configFile) + ":\n  " + problems.join("\n  ")); }
}

// ----------------------------------------------------------------------------------------------- //
// The sign-in launcher
// ----------------------------------------------------------------------------------------------- //

// True for the repository root and anything inside it.
function insideRepository(full) {
 var rel = path.relative(fs.realpathSync(rootDir), full);
 return rel === "" || (rel.split(path.sep)[0] != ".." && !path.isAbsolute(rel));
}

// The module an entry with auth gets its browser from. The launcher is the maintainer's own and is
// kept outside the repository, so nothing here knows how it signs in. An unset variable is a reason
// to skip rather than an error, so a machine without a launcher still runs everything else; a
// variable that is set but wrong is a configuration error.
async function loadLauncher() {
 var named = String(process.env[launcherVariable] || "").trim();
 if (!named) { return { api: null, why: "no sign-in launcher: " + launcherVariable + " is not set" }; }
 if (!path.isAbsolute(named)) { configError(launcherVariable + " must be an absolute path"); }
 var full = path.resolve(named);
 if (!fs.existsSync(full) || !fs.statSync(full).isFile()) { configError(launcherVariable + " names no file: " + full); }
 full = fs.realpathSync(full);
 if (insideRepository(full)) { configError(launcherVariable + " must name a file outside the repository"); }
 var loaded = null;
 try {
  loaded = await import(nodeUrl.pathToFileURL(full).href);
 } catch (err) {
  configError("the sign-in launcher would not load: " + firstLine(err));
 }
 var api = loaded && loaded.default && typeof loaded.default.launch == "function" ? loaded.default : loaded;
 if (!api || typeof api.launch != "function") { configError("the sign-in launcher has no launch function"); }
 return { api: api, why: "" };
}

// A signed-in context for one site, or the reason there is none.
async function openSignedIn(session, site) {
 if (!session.launcher.api) { return { context: null, why: session.launcher.why }; }
 var context = null;
 try {
  context = await session.launcher.api.launch({ chromium: session.chromium, site: site });
 } catch (err) {
  return { context: null, why: "the sign-in launcher could not open " + site + ": " + firstLine(err) };
 }
 if (!context) { return { context: null, why: "the sign-in launcher has no sign-in for " + site }; }
 if (typeof context.newPage != "function" || typeof context.close != "function") {
  return { context: null, why: "the sign-in launcher returned something other than a browser context for " + site };
 }
 return { context: context, why: "" };
}

function originOf(address) {
 try {
  return new URL(address).origin;
 } catch (err) {
  return "nowhere";
 }
}

// A signed-out page is the absence of a sign-in, not a fault in the bookmarklet, so it is a skip.
function signedOut(ctx, why) {
 var err = failure("signed out of " + ctx.auth + ": " + why);
 err.skip = true;
 ctx.signedInFound = false;
 return err;
}

async function checkSignedIn(page, ctx) {
 var wanted = originOf(ctx.url);
 if (originOf(page.url()) !== wanted) { throw signedOut(ctx, "the page went to " + originOf(page.url())); }
 try {
  await page.waitForSelector(ctx.signedIn, { state: "attached", timeout: Math.min(ctx.timeout, requiresTimeout) });
 } catch (err) {
  if (originOf(page.url()) !== wanted) { throw signedOut(ctx, "the page went to " + originOf(page.url())); }
  throw signedOut(ctx, ctx.signedIn + " is not on the page");
 }
 ctx.signedInFound = true;
}

// What a step on a signed-in page must never touch: everywhere a site sends a message or saves a
// change. It runs in the page against the live element, because a selector alone cannot say, and it
// is written to be sent there as source, so it uses nothing from this file.
function classifyTarget(el) {
 if (!el || el === document.body || el === document.documentElement) { return ""; }
 var tag = String(el.tagName || "").toLowerCase();
 var type = String((el.getAttribute && el.getAttribute("type")) || "").toLowerCase();
 if (tag == "iframe" || tag == "frame") { return "a frame"; }
 if (el.isContentEditable) { return "an editable region"; }
 if (tag == "textarea") { return "a text area"; }
 if ((tag == "input" && (type == "submit" || type == "image"))
  || (tag == "button" && el.form && (type == "" || type == "submit"))) { return "a submit control"; }
 if (el.form || (el.closest && el.closest("form"))) { return "a form"; }
 return "";
}

async function writesTo(page, selector) {
 if (selector) {
  await page.waitForSelector(selector, { state: "attached" });
  return page.locator(selector).first().evaluate(classifyTarget);
 }
 return page.evaluate("(" + classifyTarget.toString() + ")(document.activeElement)");
}

// ----------------------------------------------------------------------------------------------- //
// The browser
// ----------------------------------------------------------------------------------------------- //

function requirePlaywright() {
 try {
  return require("playwright");
 } catch (err) {
  configError("playwright is not installed - run npm install, then npx playwright install chromium");
 }
}

function sourceUrl(name) { return "bookmarklet/" + name + ".js"; }

// ----------------------------------------------------------------------------------------------- //
// Capturing an entry
// ----------------------------------------------------------------------------------------------- //

// Where this entry's screenshots and video go, made the first time one is written. An entry with
// auth never gets one: ctx.captures is false for it, and every call here answers to that.
function captureDir(ctx) {
 if (!ctx.captureFolder) {
  ctx.captureFolder = path.join(runDir(), "capture", ctx.name);
  fs.mkdirSync(ctx.captureFolder, { recursive: true });
 }
 return ctx.captureFolder;
}

// Where in the entry something happened, as milliseconds from the moment the page was opened, which
// is where the video starts too. It is what lets a clip be cut to the moment the bookmarklet ran
// rather than to a guess at it.
function mark(ctx, what) {
 if (!ctx.captures) { return; }
 ctx.timeline.push({ at: Date.now() - ctx.clock, what: scrubbed(ctx, what) });
}

// What a step is, for the timeline: its action, and what it aims at where that is a selector or a key.
function stepName(step) {
 for (var i = 0; i < stepActions.length; i++) {
  var action = stepActions[i];
  if (step[action] === undefined) { continue; }
  if (action == "run" || action == "expect") { return action; }
  var aimed = step[action];
  if (aimed && typeof aimed == "object") { aimed = aimed.selector; }
  return action + " " + cut(aimed);
 }
 return "step";
}

// The page as it stands, taken the same way every time so two captures of an unchanged bookmarklet
// match: the fixed viewport, no animation caught mid-frame, and no caret drawn. A screenshot that
// cannot be taken - a page already gone, a context already closed - is left out rather than fatal,
// because it is a record of the run and never the verdict.
async function shot(page, ctx, what) {
 if (!ctx.captures) { return; }
 var file = path.join(captureDir(ctx), what + ".png");
 try {
  await page.screenshot({ path: file, animations: "disabled", caret: "hide" });
 } catch (err) {
  return;
 }
 ctx.shots.push({ what: what, file: shownPath(file), at: Date.now() - ctx.clock });
}

// The video the context recorded, under a name of this run's choosing. Playwright names the file
// itself and finishes writing it only once the context has closed, so this runs after that.
async function saveVideo(page, ctx) {
 if (!ctx.capture) { return ""; }
 var video = page.video();
 if (!video) { return "the browser recorded no video for this entry"; }
 var file = path.join(captureDir(ctx), "entry.webm");
 try {
  await video.saveAs(file);
  await video.delete();
 } catch (err) {
  return "the video could not be saved: " + firstLine(err);
 }
 ctx.video = shownPath(file);
 return "";
}

// page.evaluate runs the code in the page's own global scope and leaves the page's content security
// policy to apply to whatever the bookmarklet then adds, which is what a bookmarklet meets. The
// sourceURL tag has to survive the trip, because the stack it leaves in an error is how the
// bookmarklet's errors are told apart from the page's own. Where it does not survive, Chromium's
// CDP Runtime.evaluate is the way in.
async function chooseInjector(page) {
 if (injector) { return injector; }
 var probe = "(function(){ try { null.x; } catch (e) { return String((e && e.stack) || \"\"); } })();"
  + "\n//# sourceURL=" + sourceUrl("__probe__");
 var survives = false;
 try {
  survives = /__probe__\.js/.test(String(await page.evaluate(probe)));
 } catch (err) {
  survives = false;
 }
 injector = survives ? "evaluate" : "cdp";
 return injector;
}

async function inject(page, code, name) {
 // The guard keeps a bookmarklet that returns a DOM node from failing on the way back.
 var text = code + "\n;undefined;\n//# sourceURL=" + sourceUrl(name);
 if (await chooseInjector(page) == "evaluate") {
  await page.evaluate(text);
  return;
 }
 var cdp = await page.context().newCDPSession(page);
 try {
  var answer = await cdp.send("Runtime.evaluate", { expression: text, awaitPromise: true, returnByValue: true });
  if (answer.exceptionDetails) {
   var details = answer.exceptionDetails;
   var described = (details.exception && details.exception.description) || details.text || "the bookmarklet threw";
   var err = new Error(String(described).split("\n")[0]);
   err.stack = String(described);
   throw err;
  }
 } finally {
  await cdp.detach().catch(function () { });
 }
}

// True when the bookmarklet's own code is anywhere in the synchronous stack that started a request,
// looking past an async boundary that left a level empty.
function startedBy(stack, url) {
 while (stack && !(stack.callFrames && stack.callFrames.length)) { stack = stack.parent; }
 return !!stack && stack.callFrames.some(function (f) { return f.url === url; });
}

// Requests started from the bookmarklet's code, told apart from the page's by the stack that started
// them, the way its errors are told apart. The whole synchronous stack is read rather than its
// innermost frame, because a site that wraps fetch, as GitHub does, puts its own frame on top of the
// bookmarklet's call. The price is that a page's own request, set off by a click the bookmarklet
// makes, counts too; it fails where it can be seen, and the entry can name the host with that
// reason. Moving the page itself is not counted: that is the reader going somewhere. Chromium's
// protocol is what carries the initiator, so this reads it directly.
async function watchRequests(page, ctx) {
 var allowed = ctx.network.map(function (n) { return n.host; });
 var session = await page.context().newCDPSession(page);
 var mainFrame = "";
 try {
  mainFrame = (await session.send("Page.getFrameTree")).frameTree.frame.id;
 } catch (err) {
  mainFrame = "";
 }
 function judge(address, home, initiator) {
  if (!startedBy(initiator && initiator.stack, sourceUrl(ctx.name))) { return; }
  var target;
  try { target = new URL(address); } catch (err) { return; }
  if (!/^(https?|wss?):$/.test(target.protocol)) { return; }
  if (target.host === home || allowed.some(function (h) {
   return h === target.host || (h.indexOf("*.") === 0 && target.host.slice(-(h.length - 1)) === h.slice(1));
  })) { return; }
  if (ctx.offHosts.indexOf(target.host) < 0) { ctx.offHosts.push(target.host); }
 }
 function hostOf(address) {
  try { return new URL(address).host; } catch (err) { return ""; }
 }
 session.on("Network.requestWillBeSent", function (event) {
  if (event.type == "Document" && event.frameId == mainFrame) { return; }
  judge(event.request.url, hostOf(event.documentURL), event.initiator);
 });
 session.on("Network.webSocketCreated", function (event) {
  judge(event.url, hostOf(page.url()), event.initiator);
 });
 await session.send("Network.enable");
 return session;
}

function offHostReason(ctx) {
 if (!ctx.offHosts.length) { return ""; }
 return "sends a request to " + ctx.offHosts.join(", ") + ", " + (ctx.offHosts.length == 1 ? "a host" : "hosts")
  + " other than the page's own - a bookmarklet sends nothing to another host unless its entry names"
  + " the host in network with the reason";
}

// Every request to the fixture origin is answered from test/fixtures/pages, so a fixture entry needs
// no network and cannot be changed by anyone but this repository. A path that is missing, or that
// climbs out of the folder, is a 404 the page sees rather than a crash the run reports. The route
// is the context's rather than the page's, because a tab the bookmarklet opens makes its first
// request before any route of its own could be added.
async function serveFixtures(page) {
 await page.context().route(fixtureOrigin + "/**", async function (route) {
  var asked = "";
  try {
   asked = decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\/+/, "");
  } catch (err) {
   asked = "";
  }
  var file = fixtureFile(asked || "index.html");
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
   await route.fulfill({ status: 404, contentType: "text/plain; charset=utf-8",
    body: "no fixture page: " + (asked || "index.html") }).catch(function () { });
   return;
  }
  await route.fulfill({
   status: 200,
   contentType: fixtureTypes[path.extname(file).toLowerCase()] || "application/octet-stream",
   body: fs.readFileSync(file)
  }).catch(function () { });
 });
}

// The whole entry inside its own time limit, so a page that never settles cannot hold up a
// scheduled run.
function withTimeout(promise, ms, message) {
 var timer = null;
 promise.catch(function () { });
 return Promise.race([
  promise,
  new Promise(function (resolve, reject) { timer = setTimeout(function () { reject(failure(message)); }, ms); })
 ]).then(function (value) {
  clearTimeout(timer);
  return value;
 }, function (err) {
  clearTimeout(timer);
  throw err;
 });
}

function attachListeners(page, result, ctx) {
 var answers = ctx.dialogs;
 var answered = 0;

 // On a signed-in page the page's own words are counted, never kept: its console, its errors, its
 // dialogs and the addresses its popups open can all carry the account and what it holds.
 page.on("console", function (msg) {
  var type = msg.type();
  if (type != "error" && type != "warning") { return; }
  if (ctx.private) {
   result.withheld.console++;
   return;
  }
  if (result.console.length >= consoleLimit) { return; }
  result.console.push({ type: type, text: cut(scrubbed(ctx, msg.text())) });
 });

 // Only the bookmarklet's errors fail the entry. The page's own are recorded and left alone.
 page.on("pageerror", function (err) {
  var stack = String((err && err.stack) || (err && err.message) || err || "");
  var from = stack.indexOf(sourceUrl(ctx.name)) >= 0 ? "bookmarklet" : "page";
  if (ctx.private && from == "page") {
   result.withheld.pageErrors++;
   return;
  }
  result.errors.push({
   from: from,
   message: scrubbed(ctx, firstLine(err)),
   at: ctx.private ? "" : scrubbed(ctx, stack.split("\n").slice(0, 4).join(" | "))
  });
 });

 page.on("dialog", function (dialog) {
  var answer = answers[answered++];
  var accept = !!(answer && answer.accept);
  result.dialogs.push({
   type: dialog.type(),
   message: ctx.private ? null : cut(scrubbed(ctx, dialog.message())),
   answered: accept ? "accepted" : "dismissed",
   text: answer && answer.text !== undefined ? String(answer.text) : ""
  });
  var done = accept
   ? dialog.accept(answer.text === undefined ? undefined : String(answer.text))
   : dialog.dismiss();
  done.catch(function () { });
 });

 // A popup's address is kept in memory for an expect on it, and written down only off a signed-in
 // page. Playwright raises the event once the popup's first response has started, so the address
 // is the one the bookmarklet opened.
 page.on("popup", function (popup) {
  ctx.popupUrls.push(popup.url());
  result.popups.push({ url: ctx.private ? null : scrubbed(ctx, popup.url()) });
  popup.close().catch(function () { });
 });
}

async function runBookmarklet(page, ctx) {
 ctx.ran = true;
 ctx.runs++;
 // A bookmarklet an entry runs twice, to check that the second run undoes the first, gets a numbered
 // pair for each run rather than one pair overwritten by the next.
 var which = ctx.runs > 1 ? "-" + ctx.runs : "";
 mark(ctx, "the bookmarklet runs");
 if (ctx.capture) { await shot(page, ctx, "before" + which); }
 try {
  await inject(page, ctx.check.code, ctx.name);
 } catch (err) {
  if (ctx.capture) { await shot(page, ctx, "after" + which); }
  var stack = String((err && err.stack) || (err && err.message) || err || "");
  if (stack.indexOf(sourceUrl(ctx.name)) >= 0) {
   throw failure("the bookmarklet threw: " + firstLine(err) + atLine(ctx, stack));
  }
  throw failure("the bookmarklet could not be run: " + firstLine(err));
 }
 if (ctx.capture) { await shot(page, ctx, "after" + which); }
}

// The line in the formatted file an error came from, read out of the one line the browser ran.
function atLine(ctx, stack) {
 if (ctx.check.decodeChanged) { return ""; }
 var m = new RegExp(escapeRegExp(sourceUrl(ctx.name)) + ":1:(\\d+)").exec(stack);
 if (!m) { return ""; }
 var line = lineOfColumn(ctx.check, Number(m[1]));
 return line ? " (line " + line + ")" : "";
}

async function checkRequires(page, ctx) {
 for (var i = 0; i < ctx.requires.length; i++) {
  var selector = ctx.requires[i];
  try {
   await page.waitForSelector(selector, { state: "attached", timeout: Math.min(ctx.timeout, requiresTimeout) });
  } catch (err) {
   throw failure("site changed: " + selector + " not found on " + ctx.shown);
  }
 }
}

async function doExpect(page, ctx, want, where) {
 if (want.popup !== undefined) {
  var holds = function (u) { return String(u).indexOf(String(want.popup)) >= 0; };
  var until = Date.now() + Math.min(ctx.timeout, requiresTimeout);
  while (!ctx.popupUrls.some(holds) && Date.now() < until) { await page.waitForTimeout(100); }
  if (!ctx.popupUrls.some(holds)) {
   throw failure(where + ": no new tab opened an address holding " + JSON.stringify(cut(want.popup))
    + (ctx.popupUrls.length ? " (" + ctx.popupUrls.length + " opened elsewhere)" : ""));
  }
  return;
 }
 if (want.location !== undefined) {
  var at = page.url();
  if (at.indexOf(String(want.location)) < 0) {
   throw failure(where + ": the page is at "
    + (ctx.private ? withheldText : JSON.stringify(cut(scrubbed(ctx, at))))
    + ", which does not hold " + JSON.stringify(cut(want.location)));
  }
  return;
 }
 if (want.clipboard !== undefined) {
  var held;
  try {
   held = await page.evaluate("navigator.clipboard.readText()");
  } catch (err) {
   throw failure(where + ": the clipboard could not be read - the entry needs \"permissions\":"
    + " [\"clipboard-read\"] (" + firstLine(err) + ")");
  }
  if (String(held).trim() !== String(want.clipboard).trim()) {
   throw failure(where + ": the clipboard holds " + (ctx.private ? withheldText : JSON.stringify(cut(held)))
    + ", not " + JSON.stringify(cut(want.clipboard)));
  }
  return;
 }
 var locator = page.locator(want.selector);
 if (want.hidden) {
  try {
   await locator.first().waitFor({ state: "hidden" });
  } catch (err) {
   throw failure(where + ": " + want.selector + " is still showing");
  }
  return;
 }
 if (want.visible) {
  try {
   await locator.first().waitFor({ state: "visible" });
  } catch (err) {
   throw failure(where + ": " + want.selector + " is not showing");
  }
  return;
 }
 if (want.count !== undefined) {
  var found = await locator.count();
  if (found !== want.count) {
   throw failure(where + ": " + want.selector + " matches " + found + ", not " + want.count);
  }
  return;
 }
 // Two selectors counted against each other, for one thing per row of something the page lists. The
 // count a page of its own would give changes whenever the page does, and the relation does not.
 if (want.matches !== undefined) {
  var mine = await locator.count();
  var theirs = await page.locator(want.matches).count();
  if (mine !== theirs) {
   throw failure(where + ": " + want.selector + " matches " + mine + ", and " + want.matches
    + " matches " + theirs);
  }
  return;
 }
 var reads = "";
 try {
  reads = await locator.first().innerText();
 } catch (err) {
  throw failure(where + ": " + want.selector + " has no text to read (" + firstLine(err) + ")");
 }
 if (reads.indexOf(String(want.text)) < 0) {
  throw failure(where + ": " + want.selector + " reads " + (ctx.private ? withheldText : JSON.stringify(cut(reads)))
   + ", which does not hold " + JSON.stringify(cut(want.text)));
 }
}

// A selection, which is what the bookmarklets that style selected text read. Dragging the mouse
// across the text selects whatever happens to lie under the pointer, so the range is set in the page
// instead. Nothing is focused afterwards, so the keys a bookmarklet listens for still reach the body.
async function selectText(page, selector) {
 await page.waitForSelector(selector, { state: "attached" });
 var held = await page.evaluate(function (sel) {
  var el = document.querySelector(sel);
  if (!el) { return ""; }
  var range = document.createRange();
  // A drag across a paragraph leaves the range inside the text node, and a bookmarklet that asks
  // for the selection parent reads that node. selectNodeContents would hand it the element
  // instead, which is a shape no reader can produce and which several of these refuse.
  var first = el.firstChild, last = el.lastChild;
  if (first && first.nodeType === 3 && first === last) {
   range.setStart(first, 0);
   range.setEnd(last, String(last.nodeValue).length);
  } else {
   range.selectNodeContents(el);
  }
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  return String(selection);
 }, selector);
 if (!held.trim()) { throw failure("there is no text to select in " + selector); }
}

async function doStep(page, ctx, step, index) {
 var where = "step " + index;
 if (ctx.private && (step.click !== undefined || step.fill !== undefined || step.press !== undefined)) {
  var aimed = step.click !== undefined ? step.click
   : step.fill !== undefined ? (typeof step.fill == "string" ? step.fill : step.fill.selector)
   : (typeof step.selector == "string" ? step.selector : "");
  var verb = step.click !== undefined ? "click" : step.fill !== undefined ? "type into" : "press a key in";
  var hit = await writesTo(page, aimed);
  if (hit) { throw failure("refused: " + where + " would " + verb + " " + hit + " on a signed-in page"); }
 }
 if (step.run) { return runBookmarklet(page, ctx); }
 if (step.click !== undefined) { return page.click(step.click); }
 if (step.fill !== undefined) {
  var selector = typeof step.fill == "string" ? step.fill : step.fill.selector;
  var value = typeof step.fill == "string"
   ? (step.value !== undefined ? step.value : step.text)
   : step.fill.value;
  return page.fill(selector, String(value));
 }
 if (step.press !== undefined) {
  if (typeof step.selector == "string") { return page.press(step.selector, step.press); }
  return page.keyboard.press(step.press);
 }
 if (step.select !== undefined) { return selectText(page, step.select); }
 if (step.wait !== undefined) {
  if (typeof step.wait == "number") { return page.waitForTimeout(step.wait); }
  return page.waitForSelector(step.wait, { state: "attached" });
 }
 return doExpect(page, ctx, step.expect, where);
}

async function playEntry(page, ctx) {
 mark(ctx, "open " + ctx.shown);
 try {
  await page.goto(ctx.url, { waitUntil: "load" });
 } catch (err) {
  throw failure("could not open " + ctx.shown + ": " + scrubbed(ctx, firstLine(err)));
 }
 if (ctx.private) { await checkSignedIn(page, ctx); }
 await checkRequires(page, ctx);
 // The bookmarklet runs after load when no step names it. A step that names it twice runs it
 // twice, which is how a bookmarklet that turns itself off on the second run is checked.
 if (!ctx.steps.some(function (step) { return step.run === true; })) { await runBookmarklet(page, ctx); }
 for (var i = 0; i < ctx.steps.length; i++) {
  mark(ctx, "step " + (i + 1) + ": " + stepName(ctx.steps[i]));
  try {
   await doStep(page, ctx, ctx.steps[i], i + 1);
  } catch (err) {
   if (err && err.expected) { throw err; }
   throw failure("step " + (i + 1) + " could not be done: " + firstLine(err));
  }
 }
 await page.waitForTimeout(ctx.settle);
}

async function runOne(browser, name, entry, session, options) {
 var started = Date.now();
 var result = {
  name: name,
  verdict: "pass",
  reason: "",
  url: "",
  configured: !!entry,
  scheduled: !!(entry && entry.scheduled),
  durationMs: 0,
  notes: [],
  dialogs: [],
  popups: [],
  console: [],
  errors: []
 };

 function close(verdict, reason) {
  result.verdict = verdict;
  result.reason = scrubbed(ctx, reason || "");
  result.durationMs = Date.now() - started;
  if (result.withheld && (result.withheld.console || result.withheld.pageErrors)) {
   result.notes.push("a signed-in page: " + result.withheld.console + " console messages and "
    + result.withheld.pageErrors + " page errors were counted and not recorded");
  }
  // The timeline rides with the artifacts rather than going into every result: an entry that was
  // captured, and a failing one, have something to point at, and a quiet pass has nothing to cut.
  if (ctx && (ctx.shots.length || ctx.video)) {
   result.capture = { video: ctx.video, screenshots: ctx.shots, timeline: ctx.timeline };
  }
  return result;
 }

 var file = bookmarkletFile(name);
 if (!fs.existsSync(file)) {
  return close("fail", "not found: " + shownPath(file));
 }
 if (entry && entry.skip) { return close("skip", entry.skip); }

 var check = checkFile(file, name);
 if (!check.ok) { return close("fail", check.reason); }
 if (check.decodeChanged) {
  result.notes.push("a percent escape in the file decodes on the way into the URL field, and the"
   + " decoded code is what ran");
 }
 result.notes.push("one line: " + check.strictLength + " characters with the breaks taken out, "
  + check.spacedLength + " with each break replaced by a space");

 // The address the entry asks for. A variable that names it is read here and nowhere else, so the
 // address reaches the browser and nothing that is written down.
 var asked = (entry && entry.url) || defaultUrl;
 var named = urlVariable(asked);
 if (named) {
  var held = String(process.env[named.slice(1)] || "").trim();
  if (!held) { return close("skip", "the page comes from " + named + ", which is not set"); }
  if (!/^https?:\/\//i.test(held)) {
   return close("fail", named + " holds something other than an http address");
  }
  asked = held;
 }

 var ctx = {
  name: name,
  check: check,
  url: resolveUrl(asked),
  timeout: (entry && typeof entry.timeout == "number") ? entry.timeout : defaultTimeout,
  settle: (entry && typeof entry.settle == "number") ? entry.settle : defaultSettle,
  requires: (entry && entry.requires) || [],
  steps: (entry && entry.steps) || [],
  dialogs: (entry && entry.dialogs) || [],
  ran: false,
  runs: 0,
  popupUrls: [],
  network: (entry && entry.network) || [],
  offHosts: [],
  private: !!(entry && entry.auth),
  auth: (entry && entry.auth) || "",
  signedIn: (entry && entry.signedIn) || "",
  signedInFound: undefined,
  hidden: !!named,
  shown: named || resolveUrl(asked),
  host: "",
  clock: started,
  captures: false,
  capture: false,
  captureFolder: "",
  shots: [],
  timeline: [],
  video: ""
 };
 ctx.host = named ? originOf(ctx.url).replace(/^https?:\/\//, "") : "";
 // An entry with auth is never captured, and nothing else about it is written down either, so the
 // whole of capturing answers to this one flag. Everything else may keep a failure's screenshot.
 ctx.captures = !ctx.private;
 ctx.capture = ctx.captures && !!((options && options.capture) || (entry && entry.capture === true));
 result.url = ctx.shown;
 if (ctx.private) {
  result.auth = ctx.auth;
  result.withheld = { console: 0, pageErrors: 0 };
  if (options && options.capture) {
   result.notes.push("nothing was captured: an entry with auth shows the account and what it holds");
  }
 }

 var context, page;
 try {
  if (ctx.private) {
   var opened = await openSignedIn(session, ctx.auth);
   if (!opened.context) { return close("skip", opened.why); }
   context = opened.context;
   if (entry.permissions && entry.permissions.length) { await context.grantPermissions(entry.permissions); }
   page = await context.newPage();
   await page.setViewportSize(viewport);
  } else {
   context = await browser.newContext({
    viewport: viewport,
    permissions: (entry && entry.permissions) || [],
    recordVideo: ctx.capture ? { dir: captureDir(ctx), size: viewport } : undefined
   });
   page = await context.newPage();
  }
 } catch (err) {
  if (context) { await context.close().catch(function () { }); }
  return close("fail", "the browser would not open a page for this entry: " + scrubbed(ctx, firstLine(err)));
 }
 // Time zero for the timeline, and where the video starts: the page exists and nothing has happened
 // on it yet.
 ctx.clock = Date.now();
 page.setDefaultTimeout(Math.min(ctx.timeout, requiresTimeout));
 attachListeners(page, result, ctx);
 try {
  await watchRequests(page, ctx);
 } catch (err) {
  await context.close().catch(function () { });
  return close("fail", "the requests the bookmarklet makes could not be watched: " + firstLine(err));
 }

 if (ctx.url.indexOf(fixtureOrigin + "/") === 0) {
  try {
   await serveFixtures(page);
  } catch (err) {
   await context.close().catch(function () { });
   return close("fail", "the fixture pages could not be served: " + firstLine(err));
  }
 }

 try {
  await withTimeout(playEntry(page, ctx), ctx.timeout + ctx.settle,
   "nothing finished inside the " + ctx.timeout + "ms this entry allows");
 } catch (err) {
  // The page as it stood when the entry failed, kept whether or not the entry was being captured:
  // it is the one thing nobody can go back for once the browser has closed.
  if (!(err && err.skip)) { await shot(page, ctx, "failure"); }
  await context.close().catch(function () { });
  var lost = await saveVideo(page, ctx);
  if (lost) { result.notes.push(lost); }
  if (typeof ctx.signedInFound == "boolean") { result.signedIn = ctx.signedInFound; }
  if (err && err.skip) { return close("skip", err.message); }
  if (offHostReason(ctx)) { return close("fail", offHostReason(ctx)); }
  return close("fail", err && err.expected ? err.message : "the run stopped: " + scrubbed(ctx, firstLine(err)));
 }
 await context.close().catch(function () { });
 var unsaved = await saveVideo(page, ctx);
 if (unsaved) { result.notes.push(unsaved); }
 if (typeof ctx.signedInFound == "boolean") { result.signedIn = ctx.signedInFound; }

 if (!ctx.ran) { return close("fail", "the bookmarklet never ran - no step named it and the entry had none"); }
 if (offHostReason(ctx)) { return close("fail", offHostReason(ctx)); }

 var thrown = result.errors.filter(function (e) { return e.from == "bookmarklet"; });
 if (thrown.length) {
  return close("fail", "the bookmarklet threw after it returned: " + thrown[0].message);
 }
 return close("pass", "");
}

// ----------------------------------------------------------------------------------------------- //
// Reporting
// ----------------------------------------------------------------------------------------------- //

function countOf(results) {
 return {
  run: results.length,
  passed: results.filter(function (r) { return r.verdict == "pass"; }).length,
  failed: results.filter(function (r) { return r.verdict == "fail"; }).length,
  skipped: results.filter(function (r) { return r.verdict == "skip"; }).length
 };
}

function tally(counts) {
 return "test-bm: " + counts.run + " run, " + counts.passed + " passed, " + counts.failed
  + " failed, " + counts.skipped + " skipped";
}

function seconds(ms) { return (ms / 1000).toFixed(1) + "s"; }

function summaryLine(result, width) {
 return pad(result.name, width) + "  " + pad(result.verdict, 4) + "  " + pad(seconds(result.durationMs), 6)
  + (result.reason ? "  " + result.reason : "");
}

function stamp(when) {
 function two(n) { return (n < 10 ? "0" : "") + n; }
 return when.getFullYear() + "-" + two(when.getMonth() + 1) + "-" + two(when.getDate()) + "_"
  + two(when.getHours()) + two(when.getMinutes()) + two(when.getSeconds());
}

function writeReport(results, mode, started, finished) {
 var counts = countOf(results);
 var dir = runDir();

 fs.writeFileSync(path.join(dir, "report.json"), JSON.stringify({
  tool: "test-bm",
  mode: mode,
  browser: "chromium",
  injected: injector || "none",
  started: started.toISOString(),
  finished: finished.toISOString(),
  counts: counts,
  results: results
 }, null, 1) + "\n");

 var width = 0;
 results.forEach(function (r) { if (r.name.length > width) { width = r.name.length; } });
 var lines = results.map(function (r) { return summaryLine(r, width); });
 lines.push(tally(counts));
 fs.writeFileSync(path.join(dir, "summary.txt"), lines.join("\n") + "\n");
 return dir;
}

function printList(names, config) {
 var width = 0;
 names.forEach(function (n) { if (n.length > width) { width = n.length; } });
 names.forEach(function (name) {
  var entry = config[name];
  var what = "default safe run";
  var extra = defaultUrl;
  if (entry && entry.skip) {
   what = "skip";
   extra = entry.skip;
  } else if (entry) {
   what = entry.auth ? "signed in" : "configured";
   extra = (entry.url || defaultUrl)
    + (entry.auth ? "  auth " + entry.auth : "")
    + (entry.scheduled ? "  scheduled" : "")
    + (entry.capture ? "  capture" : "")
    + (entry.requires && entry.requires.length ? "  requires " + entry.requires.length : "")
    + (entry.steps && entry.steps.length ? "  " + entry.steps.length + " steps" : "");
  }
  console.log(pad(name, width) + "  " + pad(what, 16) + "  " + extra);
 });
 var configured = names.filter(function (n) { return config[n]; }).length;
 var scheduled = names.filter(function (n) { return config[n] && config[n].scheduled; }).length;
 var signedIn = names.filter(function (n) { return config[n] && config[n].auth; }).length;
 console.log("");
 console.log("test-bm: " + names.length + " bookmarklets, " + configured + " configured, "
  + scheduled + " scheduled, " + signedIn + " signed in");
}

function printDetail(result) {
 result.notes.forEach(function (note) { console.log("  note: " + note); });
 if (result.capture) {
  result.capture.screenshots.forEach(function (s) { console.log("  " + s.what + ": " + s.file); });
  if (result.capture.video) { console.log("  video: " + result.capture.video); }
  result.capture.timeline.forEach(function (t) { console.log("  +" + t.at + "ms  " + t.what); });
 }
 result.dialogs.forEach(function (d) {
  console.log("  dialog: " + d.type + " " + (d.message === null ? withheldText : JSON.stringify(d.message)) + " " + d.answered);
 });
 result.popups.forEach(function (p) { console.log("  popup closed: " + (p.url === null ? withheldText : p.url)); });
 result.console.forEach(function (c) { console.log("  console " + c.type + ": " + c.text); });
 result.errors.forEach(function (e) { console.log("  " + e.from + " error: " + e.message); });
}

// ----------------------------------------------------------------------------------------------- //
// Main
// ----------------------------------------------------------------------------------------------- //

function readOptions(args) {
 var options = { mode: "", name: "", site: "", headed: false, slowMo: 0, capture: false };
 for (var i = 0; i < args.length; i++) {
  var arg = args[i];
  if (arg == "--all" || arg == "--scheduled" || arg == "--list" || arg == "--sign-in") {
   if (options.mode) { configError("--all, --scheduled, --list and --sign-in ask for different runs - pick one"); }
   options.mode = arg.slice(2);
   if (arg == "--sign-in") {
    options.site = String(args[++i] || "");
    if (!siteNamePattern.test(options.site)) {
     configError("--sign-in takes a site name of lower-case letters, digits and hyphens, such as chatgpt");
    }
   }
  } else if (arg == "--headed") {
   options.headed = true;
  } else if (arg == "--capture") {
   options.capture = true;
  } else if (arg == "--slow-mo") {
   var ms = Number(args[++i]);
   if (!isFinite(ms) || ms < 0) { configError("--slow-mo takes a number of milliseconds"); }
   options.slowMo = ms;
  } else if (/^-/.test(arg)) {
   configError("unknown option " + arg);
  } else if (options.name) {
   configError("one bookmarklet at a time - " + options.name + " and " + bookmarkletName(arg));
  } else {
   options.name = bookmarkletName(arg);
  }
 }
 if (options.mode == "sign-in" && options.name) { configError("--sign-in takes a site, not a bookmarklet"); }
 if (options.mode && options.name) { configError("--" + options.mode + " takes the whole set, so it takes no name"); }
 if (!options.mode && !options.name) { configError("name a bookmarklet, or use --all, --scheduled, --list or --sign-in"); }
 return options;
}

// Opening a site for signing in is the launcher's whole job; the harness only names the site.
async function signIn(site) {
 var loaded = await loadLauncher();
 if (!loaded.api) { configError(loaded.why); }
 if (typeof loaded.api.signIn != "function") { configError("the sign-in launcher has no signIn function"); }
 try {
  await loaded.api.signIn({ site: site });
 } catch (err) {
  configError("the sign-in launcher could not open " + site + ": " + firstLine(err));
 }
 console.log("test-bm: the sign-in launcher opened " + site);
}

// Which sites the run found signed in. A site seen signed out once stays signed out for the run.
function signInStates(results) {
 var states = {};
 results.forEach(function (r) {
  if (r.auth && typeof r.signedIn == "boolean") { states[r.auth] = states[r.auth] === false ? false : r.signedIn; }
 });
 return states;
}

async function reportSignIns(session, results) {
 var states = signInStates(results);
 if (!Object.keys(states).length || !session.launcher.api) { return; }
 if (typeof session.launcher.api.signInState != "function") { return; }
 try {
  await session.launcher.api.signInState(states);
 } catch (err) {
  console.error("test-bm: the sign-in launcher's signInState failed: " + firstLine(err));
 }
}

async function main() {
 var args = process.argv.slice(2);
 if (!args.length || args[0] == "--help" || args[0] == "-h" || args[0] == "/?") {
  console.log(usage());
  process.exit(args.length ? exitOk : exitConfig);
 }

 var options = readOptions(args);
 if (options.mode == "sign-in") {
  await signIn(options.site);
  process.exit(exitOk);
 }
 var names = allNames();
 var config = readConfig();
 validateConfig(config, names);

 if (options.mode == "list") {
  printList(names, config);
  process.exit(exitOk);
 }

 var queue;
 if (options.mode == "all") {
  queue = names;
 } else if (options.mode == "scheduled") {
  queue = names.filter(function (n) { return config[n] && config[n].scheduled === true; });
 } else {
  if (!fs.existsSync(bookmarkletFile(options.name))) {
   configError("not found: " + shownPath(bookmarkletFile(options.name)));
  }
  queue = [options.name];
 }

 var batch = options.mode == "all" || options.mode == "scheduled";
 var started = new Date();
 runStarted = started;
 var results = [];

 if (queue.length) {
  var playwright = requirePlaywright();
  // The launcher is loaded only when an entry needs it, and before any browser starts, so a
  // launcher that is set but wrong stops the run at once.
  var needsLauncher = queue.some(function (n) { return config[n] && config[n].auth && !config[n].skip; });
  var session = {
   chromium: playwright.chromium,
   launcher: needsLauncher ? await loadLauncher() : { api: null, why: "" }
  };
  // Whether anything in this queue is going to be captured decides how the browser is started, so it
  // is worked out before the launch rather than per entry.
  var capturing = options.capture || queue.some(function (n) {
   return config[n] && config[n].capture === true && !config[n].auth;
  });
  var browser = await playwright.chromium.launch({
   headless: !options.headed,
   slowMo: options.slowMo,
   args: capturing ? captureArgs : []
  });
  var width = 0;
  queue.forEach(function (n) { if (n.length > width) { width = n.length; } });
  try {
   for (var i = 0; i < queue.length; i++) {
    var result = await runOne(browser, queue[i], config[queue[i]] || null, session, options);
    results.push(result);
    console.log(summaryLine(result, width));
    if (!batch) { printDetail(result); }
   }
  } finally {
   await browser.close().catch(function () { });
  }
  await reportSignIns(session, results);
 }

 var counts = countOf(results);
 if (batch) {
  var dir = writeReport(results, options.mode, started, new Date());
  console.log(tally(counts));
  console.log("report: " + shownPath(dir));
 }
 process.exit(counts.failed ? exitFailed : exitOk);
}

main().catch(function (err) {
 console.error("test-bm: " + ((err && err.stack) || err));
 process.exit(exitConfig);
});
