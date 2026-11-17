// *********************************************************************************************** //
// test-bm                                                                                         //
// Run a bookmarklet in a real browser and say whether it still works.                             //
// *********************************************************************************************** //
// Needs Playwright: npm install, then npx playwright install chromium. A run in Firefox also needs
// npx playwright install firefox, once, on the machine that runs it.
//
//   node test-bm.js <name> [--browser <engine>] [--headed] [--slow-mo <ms>] [--capture] [--short]
//   node test-bm.js --all [--browser <engine>] [--headed] [--slow-mo <ms>] [--capture] [--short]
//   node test-bm.js --scheduled [--browser <engine>]
//   node test-bm.js --list
//   node test-bm.js --sign-in <site>
//
// <name>       A bookmarklet in JSFormatted, as "name", "name.js", or "JSFormatted/name.js".
// --all        Every file in JSFormatted, configured or not.
// --scheduled  Only the test-bm.json entries marked "scheduled": true, which is all a cron job or
//              a Windows scheduled task has to call. Nothing on this path waits for input.
// --list       What a run would do with each bookmarklet, without opening a browser.
// --sign-in    Ask the sign-in launcher to open <site> for signing in, then exit.
// --browser    The engine every entry runs in: chromium, the default, or firefox. Without it, an
//              entry runs in chromium and in any other engine its "browsers" names.
// --headed     Watch the run in a browser window.
// --slow-mo    Milliseconds between actions, for the same reason. Neither is ever needed.
// --capture    Capture every entry the run reaches, as an entry's "capture": true does for itself.
// --short      Record every entry the run reaches as a short: the bookmarklet's own recording, a
//              GIF in the square frame the video pipeline wants.
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
// A state only the site's own server can put the page in is reachable without waiting for the site
// to produce it. An "answer" step answers every request to a host from the entry itself, with a
// status, a content type and a body, until a later step hands the host back with "pass": true -
// which is how a bookmarklet is met with the 403 an API gives past its hourly limit. The answer
// carries access-control-allow-origin, as a site's own API does, so it reaches the bookmarklet's own
// code rather than being refused by the browser before the bookmarklet sees it. A host answered this
// way is still named in "network" with the reason, and still counted and judged like any other: a
// run that answers a host the entry does not name is a configuration error before any browser
// starts, so nothing here is a way around what a bookmarklet may reach. The answer is the network's
// for as long as it stands, so the page's own requests to that host are answered too, and a site
// that calls its own API says so in the console; what is counted is still only what the bookmarklet
// sent.
//
// A "detach" step takes the elements a selector matches off the page and keeps them, and "attach"
// puts them back where they came from, which is how a listing a site replaces for a moment is held
// in that state long enough for an entry to assert against it. Neither reaches the page's own scope:
// the nodes are held in a handle rather than anywhere on the page, so the bookmarklet meets a page
// that lost something, which is exactly what it meets on a site. "as" names what was taken, for an
// entry that detaches more than one thing; without it the selector is the name.
//
// expect { "requests": "<host>", "count": n } is how many requests the bookmarklet made to that
// host since the last expect that counted them, or since the page opened, and "atMost" bounds that
// count rather than fixing it, for a span a site's own re-render can legitimately add one to. It is
// what says a directory change costs one request rather than seven, which is a thing no selector on
// the page can show.
//
// expect { "selector": "<sel>", "clear": true } is the one expectation that reads geometry: the
// element's painted text stays inside its own border box, and where it runs past, nothing under the
// overflow paints text of its own. Every other expectation here is satisfied by an element that
// paints its text straight over the element beside it, which is how a heading held to one line in a
// cell too narrow for it passed while covering the heading next to it. Text is measured as glyph
// runs, through Range.getClientRects, rather than as element boxes, and what the overflow lands on
// is read with elementFromPoint: a cell served at font-size 0 paints nothing and is clear, and the
// same overflow onto a cell that paints its own text is not. A run of a pixel or less is a rounding
// edge rather than text a reader cannot read.
//
// It may instead name an environment variable, as "$OCTOPRINT_URL", for a page whose address does not
// belong in the repository. The address is read when the entry runs and never written down: every
// reason, report.json and summary.txt names the variable in its place, and the address is taken back
// out of anything the page itself said. An unset variable is a skip, not a failure.
//
// A run step may set variables first: { "run": { "set": { "img": "pic.png" } } } runs the bookmarklet
// with the one var img = "..." its file declares holding "pic.png" instead, which is the edit a reader
// makes to a bookmarklet that asks to be changed before it is saved. The value goes in as a string
// literal, so a quote or a backslash in it stays inside the string, and the file so changed is checked
// again the way the file itself was: both joins, the URL field's decoding, and nothing that could pass
// for malicious. A name the file does not declare exactly once as var <name> = "<string>", a value
// that is not a string, set anywhere but inside run, or a value that fails that check is a
// configuration error before any browser starts. The report names each variable set and its value,
// and a line an error is read back to is a line of the file with the value in. { "run": true } runs
// the file as it is, and nothing is ever written back to it.
//
// A viewport step sizes the page for the steps after it: { "viewport": { "width": 1024, "height": 720 } }
// lays the page out at 1024x720 from there on, and the entry's own size - 1280x720, or 648x648 for a
// short - comes back when the entry ends. It is how an expectation that reads geometry, as clear does,
// is asked at a width a reader's window has and the default does not: a heading that fits its column
// at 1280 can cover the one beside it at 1024. Width and height are whole pixels from 100 to 4000.
//
// --browser firefox runs the same checks in Firefox, the second most likely place a reader pastes a
// bookmarklet, and bookmarklets are handled differently there. Chromium stays the default, and the
// only engine --scheduled uses unless an entry asks for more with "browsers": ["chromium", "firefox"].
// Firefox keeps the sourceURL tag, so the bookmarklet's errors are told apart from the page's as they
// are in Chromium. It does not say which code started a request, so there every request to another
// host after the bookmarklet first ran is judged as the bookmarklet's: a page that keeps reaching other
// hosts on its own can fail in Firefox and pass in Chromium, and never the other way round. For the
// same reason an entry that counts requests is a skip in Firefox, and so is an entry with auth, whose
// launcher gives a Chromium browser. Firefox has no clipboard-read or clipboard-write permission to
// grant, because its clipboard is already open to the page; the entry's other permissions are granted
// as asked. A short is recorded in Chromium only.
//
// --capture, and an entry's "capture": true, write a screenshot of the page either side of the
// bookmarklet and a video of the whole entry, into test-results/test-bm/<run>/capture/<name>/. Each
// artifact's path, and the offset into the video at which every step started, go in the report, so a
// clip can be cut to the moment the bookmarklet ran without anyone scrubbing through it. The after
// shot waits for the entry's steps to have run rather than for the injection call to return: a
// bookmarklet that fetches, or waits, or needs a frame to paint has changed nothing by the time the
// call returns, and a shot taken there is the before shot again under another name.
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
// --short records what --capture records and turns it into the recording a short is made from: the
// viewport is 648x648, so the page itself lays out square rather than a wide page being squeezed
// into the frame afterwards, and the clip is cut to a little before the bookmarklet ran through to
// its result being on screen, at 10 fps and up to thirty seconds. The GIF goes to the folder
// TEST_BM_SHORTS_DIR names, test-results/shorts/ without one, as <name>.gif.
//
// A clip that runs over fifteen seconds is written twice. <name>_Full.gif is the whole clip, and
// <name>.gif is its 15 second cut: only the moments that show the bookmarklet's use, which are each
// time it runs and each click, fill, press or select a reader would make, every one from a little
// before it to an even share of fifteen seconds after it (two seconds at least), and the share
// before the clip's end, which is its result on screen. Parts that overlap are joined, and the
// waits, checks and set-up steps between them are dropped. A cut still over fifteen seconds is
// time-stretched to fifteen when the short is rendered. The report names both files, their
// lengths, and the parts of the whole clip the cut keeps.
//
// A recording already at <name>.gif is kept and the entry is not recorded again for it, because the
// maintainer's own recordings come first. Only an entry that passed gets one: a recording of a
// bookmarklet that did not work is not the bookmarklet's recording. ffmpeg on the PATH is what
// writes the GIF, and a machine without it leaves every short owed rather than failing the run.
//
// An entry with auth records its short through the sign-in launcher, which is handed recordVideo
// with the same { dir, size } a context takes; a launcher that ignores it records nothing, and the
// short is left to be made by hand. That recording stays on this machine for the maintainer to
// review, and nothing about the page goes into the report with it: its cut is reported as the
// parts it keeps, in seconds, and never as the steps they came from.
//
// A failure keeps failure.png, the page as it stood when it failed, whether or not the entry was
// captured - except in an entry with auth, which captures nothing at all, because a signed-in page
// shows the account and what it holds.
//
// A run that failed also writes failure.md beside report.json: one section per failing bookmarklet,
// holding what an agent needs to act on it without running anything again. For a missing "requires"
// selector that is the selector, the lines of the formatted file that use it, and an ARIA snapshot
// and trimmed markup of the part of the page it was expected in. For a bookmarklet that threw it is
// the message and the lines of the formatted file its stack came from. An entry with auth gives the
// selector or the message and the bookmarklet's own lines, and nothing the page said: no snapshot,
// no markup, no frames from the page, no screenshot.
//
// TEST_BM_JS_DIR and TEST_BM_CONFIG move the bookmarklet folder and the configuration file, which is
// how test/harness.test.js runs this harness against its own fixtures. Nothing else sets them.
//
// An entry with "auth": "<site>" needs a signed-in browser, and this harness never signs in or
// starts one itself. It loads the module TEST_BM_AUTH_LAUNCHER names, an absolute path outside the
// repository, and asks it for a Playwright BrowserContext with launch({ chromium, site, recordVideo })
// - recordVideo being set only for a short, and a launcher free to ignore it. Without a
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
var child = require("child_process");

// Repo layout. The two folders a run reads can be moved, which is how the self-test points this
// harness at test/fixtures and checks the harness itself rather than a copy of it.
var rootDir = __dirname;
var jsDir = fromEnv("TEST_BM_JS_DIR", path.join(rootDir, "JSFormatted"));
var configFile = fromEnv("TEST_BM_CONFIG", path.join(rootDir, "test-bm.json"));
var resultsRoot = path.join(rootDir, "test-results", "test-bm");
// Where a short run leaves its recordings. It is not under the run folder: a recording is the one
// thing a run makes that outlives the run, and the pipeline that makes a short reads it by name.
var shortsDir = fromEnv("TEST_BM_SHORTS_DIR", path.join(rootDir, "test-results", "shorts"));

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
 "timeout", "settle", "auth", "signedIn", "network", "capture", "browsers"];
// A host a network entry names: an exact host, or "*." and a domain for any of its subdomains, as
// a media server picked per request is.
var hostPattern = /^(\*\.)?[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+(:\d+)?$/;
var stepActions = ["run", "click", "fill", "press", "select", "wait", "answer", "detach", "attach",
 "viewport", "expect"];
// The sizes a viewport step may ask for, in whole pixels. Narrower than a phone or wider than a 4K
// screen is a typing slip rather than a reader's window.
var viewportLimits = { least: 100, most: 4000 };
var stepExtras = ["value", "text", "selector", "as"];
var expectKeys = ["selector", "visible", "hidden", "clear", "count", "matches", "text", "clipboard",
 "location", "popup", "requests", "atMost"];
var answerKeys = ["host", "status", "contentType", "body", "pass"];

// A url that names an environment variable holding the address, rather than holding it itself.
var urlVariablePattern = /^\$[A-Z][A-Z0-9_]*$/;

// A site name is all an entry with auth hands the sign-in launcher, so it is held to a shape that
// cannot carry anything else.
var siteNamePattern = /^[a-z0-9][a-z0-9-]{0,39}$/;
var launcherVariable = "TEST_BM_AUTH_LAUNCHER";
var withheldText = "(not recorded on a signed-in page)";

// The engines a run can use. Chromium is the default and the only one an entry gets without asking;
// it is also the only one the sign-in launcher, a short and the request watcher's initiators belong
// to.
var engines = ["chromium", "firefox"];
var defaultEngine = "chromium";
// The permissions Chromium grants and Firefox has no name for, because Firefox's clipboard is open
// to the page already. Any other permission an entry asks for is handed to the engine as it is.
var openInFirefox = ["clipboard-read", "clipboard-write"];

// How the code gets into the page, worked out once per engine by chooseInjector.
var injectors = {};

// What a browser is started with when the run is going to capture something. Chromium's own text
// rasterizing is what moves between two runs of an unchanged bookmarklet - a handful of antialiased
// pixels either side of a glyph - and these three settle it: no hinting, no subpixel antialiasing,
// one colour profile. A run that captures nothing is started without them, so an ordinary test still
// meets the browser a reader has.
var captureArgs = ["--font-render-hinting=none", "--disable-lcd-text", "--force-color-profile=srgb"];

// A short's frame, and what is cut out of the recording to fill it. The viewport is the frame, so
// the page lays out square and nothing is scaled afterwards. The lead is how long before the
// bookmarklet ran the clip starts, which is what shows a reader the page it ran on; the length is
// up to thirty seconds with that lead counted, the longest a short may run.
var shortViewport = { width: 648, height: 648 };
var shortFps = 10;
var shortSeconds = 30;
var shortLead = 400;
// A clip over this many seconds also gets its 15 second cut, the short that is posted with its GIF,
// since a GIF runs fifteen seconds at most where it is posted. The whole clip is <name>_Full.gif.
var shortCutSeconds = 15;
var shortFullSuffix = "_Full";
// The least a moment the cut keeps runs on after it, in milliseconds: enough to see what it did.
var shortHold = 2000;
// The steps a reader makes by hand. With each run of the bookmarklet they are the moments the cut
// keeps; a wait, a check or a step that sets the page up is the harness's, and the cut drops it.
var shortUseActions = ["click", "fill", "press", "select"];
// The mark the clip runs to: the entry's steps done and the page settled, which is the moment the
// bookmarklet's result is on screen.
var shortEndMark = "the result is on screen";
// A palette built from the clip rather than the colours a GIF defaults to, which is what keeps the
// page's text readable at ten frames a second. It is the filter the video pipeline on this machine
// already uses, so a recording made here matches one made by hand. A cut keeps only its parts of
// the clip, each from its start up to and not including its end, so the parts add up to the cut's
// length frame for frame, and each kept frame is placed straight after the one before it.
function gifFilter(keep) {
 var picked = "";
 if (keep) {
  picked = ",select='" + keep.map(function (part) {
   return "gte(t," + part[0].toFixed(3) + ")*lt(t," + part[1].toFixed(3) + ")";
  }).join("+") + "',setpts=N/(" + shortFps + "*TB)";
 }
 return "fps=" + shortFps + picked + ",split[s0][s1];[s0]palettegen=stats_mode=diff[p];"
  + "[s1][p]paletteuse=dither=bayer:bayer_scale=4";
}

// How much of a failing page goes into failure.md. Enough to recognize what replaced a selector,
// and not so much that the file stops being something an agent reads in one go.
var usesLimit = 6;
var ariaLimit = 4000;
var htmlLimit = 4000;

// One folder per run, holding its report and whatever any entry captured. It is made the first time
// something is written into it, so a run that captures nothing and writes no report leaves none.
var runStarted = null;
var runFolder = "";

// What was read off a failing page while it was still open, by the name of the bookmarklet it
// belongs to. It is kept here rather than on the result because failure.md is where it is written:
// report.json stays the run's verdicts, and a snapshot of a page is not one.
var diagnoses = {};

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

// Every match of a global pattern, handed over one at a time. A zero-width match would otherwise
// sit on the same index forever, so the index is moved past it.
function eachMatch(text, pattern, take) {
 var m;
 pattern.lastIndex = 0;
 while ((m = pattern.exec(String(text))) !== null) {
  take(m);
  if (m.index === pattern.lastIndex) { pattern.lastIndex++; }
 }
}

// A block of text held to a length, saying how much was left out rather than ending mid-word with
// nothing to say it did.
function cutText(text, limit) {
 var s = String(text === undefined || text === null ? "" : text);
 if (s.length <= limit) { return s; }
 return s.slice(0, limit) + "\n... " + (s.length - limit) + " more characters";
}

// A host an entry names, read against a host a request went to: an exact name, or "*." and a domain
// for any of its subdomains. The entry's network, an answer step and the request watcher all ask
// this one question, so a wildcard means the same thing in all three.
function hostNamed(named, host) {
 if (named === host) { return true; }
 return named.indexOf("*.") === 0 && host.slice(-(named.length - 1)) === named.slice(1);
}

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
 return checkText(fs.readFileSync(file, "utf8").replace(/^﻿/, ""), name);
}

function checkText(text, name) {
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
  // The file as it reads, which is what a failure report quotes: the browser ran one line, and
  // nobody debugging a bookmarklet reads that line.
  lines: lines,
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

// A run step that sets variables first, { "run": { "set": { "img": "pic.png" } } }, runs the file with
// the one string it declares as var img = "..." holding the entry's value instead, which is the edit
// a reader makes before saving a bookmarklet that asks to be changed. The value goes in as a string
// literal, so a quote or a backslash in it stays inside the string, and the file so changed is checked
// again from the top. Nothing is ever written back to the file.
var setNamePattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
var stringLiteralSource = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;

// The variables a run step sets, or null for a plain { "run": true }.
function setOf(step) {
 var run = step && step.run;
 return run && typeof run == "object" && run.set && typeof run.set == "object" ? run.set : null;
}

// How a set reads in a note or a reason: img set to "pic.png".
function setText(set) {
 return Object.keys(set).map(function (n) { return n + " set to " + JSON.stringify(set[n]); }).join(", ");
}

// Where a file declares a name, read with its block comments blanked rather than removed, so a comment
// that shows a declaration is not taken for one and every offset still points into the file. Every
// var, let and const of the name is counted; the string a set replaces is the one declared as
// var <name> = "<string>", with nothing after the string but the end of the declaration.
function declarationsOf(text, name) {
 var bare = String(text).replace(/\/\*[\s\S]*?\*\//g, function (c) { return c.replace(/[^\r\n]/g, " "); });
 var word = escapeRegExp(name);
 var all = 0;
 var strings = [];
 eachMatch(bare, new RegExp("(^|[^\\w$.])(var|let|const)\\s+" + word + "(?![\\w$])", "g"), function () { all++; });
 var declared = new RegExp("(^|[^\\w$.])var\\s+" + word + "\\s*=\\s*(" + stringLiteralSource + ")(?=\\s*[;,])", "g");
 eachMatch(bare, declared, function (m) {
  var end = m.index + m[0].length;
  strings.push({ start: end - m[2].length, end: end });
 });
 return { all: all, strings: strings };
}

// The file's text with each variable a set names holding the entry's value, or the reason it cannot.
function textWithSet(text, set) {
 var out = text;
 var names = Object.keys(set);
 for (var i = 0; i < names.length; i++) {
  var name = names[i];
  var found = declarationsOf(out, name);
  if (!found.all) { return { reason: "set names " + name + ", which the bookmarklet never declares" }; }
  if (found.all > 1) {
   return { reason: "set names " + name + ", which the bookmarklet declares " + found.all + " times, and set"
    + " changes the one declaration a reader would edit" };
  }
  if (found.strings.length != 1) {
   return { reason: "set names " + name + ", which the bookmarklet does not declare as var " + name
    + " = \"a string\"" };
  }
  var at = found.strings[0];
  out = out.slice(0, at.start) + JSON.stringify(String(set[name])) + out.slice(at.end);
 }
 return { text: out };
}

// What a run step that sets variables runs: the file with the values in, checked again exactly as the
// file itself was - both joins, the URL field's decoding, and nothing that could pass for malicious.
// The lines and where they start come from the changed file, so a line an error is read back to is
// still the line it came from, however much longer the value made the line it went into.
function checkWithSet(file, name, set) {
 var changed = textWithSet(fs.readFileSync(file, "utf8").replace(/^﻿/, ""), set);
 if (changed.reason) { return { ok: false, reason: changed.reason }; }
 var check = checkText(changed.text, name);
 if (!check.ok) { return { ok: false, reason: "with " + setText(set) + ", " + check.reason }; }
 check.set = set;
 return check;
}

// Why a run step's set is refused before any browser starts, or "" when it is not. A file that fails
// its own check is left to the run, which says what is wrong with the file itself.
function setRefusal(name, set) {
 var file = bookmarkletFile(name);
 if (!checkFile(file, name).ok) { return ""; }
 var check = checkWithSet(file, name, set);
 return check.ok ? "" : check.reason;
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

// A run step that is not { "run": true }: an object holding set, and set holding variable names, each
// with a string. Whether the bookmarklet declares them is read from its file by validateConfig.
function validateRunSet(run, where, problems) {
 if (!run || typeof run != "object" || Array.isArray(run)) {
  problems.push(where + ": run takes true, or { \"set\": { \"<name>\": \"<value>\" } } to run it with variables set");
  return;
 }
 Object.keys(run).forEach(function (k) {
  if (k != "set") { problems.push(where + ": run has no " + k + " - it takes set, or true"); }
 });
 var set = run.set;
 if (!set || typeof set != "object" || Array.isArray(set) || !Object.keys(set).length) {
  problems.push(where + ": set takes the variables to set and their values, such as { \"img\": \"pic.png\" }");
  return;
 }
 Object.keys(set).forEach(function (n) {
  if (!setNamePattern.test(n)) {
   problems.push(where + ": set takes variable names, and " + JSON.stringify(n) + " is not one");
  }
  if (typeof set[n] != "string") {
   problems.push(where + ": set takes a string for " + n + ", the text a reader would type between its quotes");
  }
 });
}

// A viewport step's size: a width and a height, each a whole number of pixels a window could have.
function validateViewport(size, where, problems) {
 var shape = "viewport takes { \"width\": <pixels>, \"height\": <pixels> }, such as { \"width\": 1024, \"height\": 720 }";
 if (!size || typeof size != "object" || Array.isArray(size)) {
  problems.push(where + ": " + shape);
  return;
 }
 Object.keys(size).forEach(function (k) {
  if (k != "width" && k != "height") { problems.push(where + ": viewport has no " + k + " - it takes width and height"); }
 });
 ["width", "height"].forEach(function (k) {
  var n = size[k];
  if (typeof n != "number" || !Number.isInteger(n) || n < viewportLimits.least || n > viewportLimits.most) {
   problems.push(where + ": viewport takes a " + k + " of whole pixels from " + viewportLimits.least
    + " to " + viewportLimits.most);
  }
 });
}

// The engines an entry runs in when the run names none: a list of known engines, each once.
function validateBrowsers(entry, name, problems) {
 if (entry.browsers === undefined) { return; }
 var list = entry.browsers;
 if (!Array.isArray(list) || !list.length) {
  problems.push(name + ": browsers takes a list of engines, such as [\"chromium\", \"firefox\"]");
  return;
 }
 list.forEach(function (b, i) {
  if (engines.indexOf(b) < 0) {
   problems.push(name + ": browsers has no engine " + JSON.stringify(b) + " - it takes " + engines.join(" or "));
  } else if (list.indexOf(b) !== i) {
   problems.push(name + ": browsers names " + b + " twice");
  }
 });
 if (entry.auth !== undefined && list.some(function (b) { return b != defaultEngine; })) {
  problems.push(name + ": an entry with auth runs in " + defaultEngine + " only - the sign-in launcher gives a "
   + defaultEngine + " browser");
 }
}

function validateStep(step, where, problems) {
 if (!step || typeof step != "object" || Array.isArray(step)) {
  problems.push(where + " is not an object");
  return;
 }
 var actions = Object.keys(step).filter(function (k) { return stepActions.indexOf(k) >= 0; });
 if (step.set !== undefined) {
  problems.push(where + ": set goes inside a run step, as { \"run\": { \"set\": { \"<name>\": \"<value>\" } } }");
 }
 Object.keys(step).forEach(function (k) {
  if (k != "set" && stepActions.indexOf(k) < 0 && stepExtras.indexOf(k) < 0) { problems.push(where + ": unknown property " + k); }
 });
 if (actions.length != 1) {
  problems.push(where + " needs exactly one of " + stepActions.join(", ") + ", and carries " + actions.length);
  return;
 }
 var action = actions[0];
 if (action == "run" && step.run !== true) { validateRunSet(step.run, where, problems); }
 if (action == "click" && typeof step.click != "string") { problems.push(where + ": click takes a selector"); }
 if (action == "press" && typeof step.press != "string") { problems.push(where + ": press takes a key"); }
 if (action == "select" && typeof step.select != "string") { problems.push(where + ": select takes a selector"); }
 if (action == "wait" && typeof step.wait != "number" && typeof step.wait != "string") {
  problems.push(where + ": wait takes milliseconds or a selector");
 }
 if (action == "detach" && (typeof step.detach != "string" || !step.detach.length)) {
  problems.push(where + ": detach takes a selector");
 }
 if (action == "attach" && (typeof step.attach != "string" || !step.attach.length)) {
  problems.push(where + ": attach takes the name a detach step gave what it took off the page");
 }
 if (action == "viewport") { validateViewport(step.viewport, where, problems); }
 if (step.as !== undefined) {
  if (step.detach === undefined) { problems.push(where + ": as names what a detach step took, and goes with one"); }
  if (typeof step.as != "string" || !step.as.length) { problems.push(where + ": as takes a name"); }
 }
 if (action == "answer") {
  var said = step.answer;
  if (!said || typeof said != "object" || Array.isArray(said)) {
   problems.push(where + ": answer takes { host, status } or { host, pass: true }");
  } else {
   Object.keys(said).forEach(function (k) {
    if (answerKeys.indexOf(k) < 0) { problems.push(where + ": answer has no " + k); }
   });
   if (typeof said.host != "string" || !hostPattern.test(said.host)) {
    problems.push(where + ": answer takes a host name such as api.example.com, or *.example.com for its subdomains");
   }
   if (said.pass !== undefined && said.pass !== true) { problems.push(where + ": pass takes true"); }
   if (said.pass === true && (said.status !== undefined || said.body !== undefined || said.contentType !== undefined)) {
    problems.push(where + ": answer either hands the host back to the network or answers it, never both");
   }
   if (said.pass === undefined) {
    if (typeof said.status != "number" || said.status < 100 || said.status > 599) {
     problems.push(where + ": answer takes the status to answer with, from 100 to 599, or pass: true to hand the host back to the network");
    }
    if (said.body !== undefined && typeof said.body != "string") {
     problems.push(where + ": body takes the text to answer with");
    }
    if (said.contentType !== undefined && (typeof said.contentType != "string" || !said.contentType.trim())) {
     problems.push(where + ": contentType takes a media type such as application/json");
    }
   }
  }
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
  var valueOnly = want.clipboard !== undefined || want.location !== undefined || want.popup !== undefined
   || want.requests !== undefined;
  if (!valueOnly && typeof want.selector != "string") {
   problems.push(where + ": expect takes a selector, a clipboard value, a location, a popup, or a count of requests");
  }
  if (want.requests !== undefined) {
   if (typeof want.requests != "string" || !hostPattern.test(want.requests)) {
    problems.push(where + ": requests takes a host name such as api.example.com");
   }
   if (want.selector !== undefined) {
    problems.push(where + ": requests counts what the bookmarklet sent, and takes no selector");
   }
   if ((want.count === undefined) === (want.atMost === undefined)) {
    problems.push(where + ": requests takes count, the number of requests to that host, or atMost, a bound on it");
   }
  }
  if (want.atMost !== undefined && typeof want.atMost != "number") { problems.push(where + ": atMost takes a number"); }
  if (want.atMost !== undefined && want.requests === undefined) {
   problems.push(where + ": atMost bounds a count of requests, and goes with requests");
  }
  if (want.location !== undefined && typeof want.location != "string") { problems.push(where + ": location takes a string"); }
  if (want.popup !== undefined && (typeof want.popup != "string" || !want.popup.length)) {
   problems.push(where + ": popup takes the text the new tab's address holds");
  }
  if (!valueOnly && want.visible === undefined && want.hidden === undefined && want.clear === undefined
   && want.count === undefined && want.matches === undefined && want.text === undefined) {
   problems.push(where + ": expect takes visible, hidden, clear, count, matches, text, clipboard, location, popup or requests");
  }
  if (want.count !== undefined && typeof want.count != "number") { problems.push(where + ": count takes a number"); }
  if (want.matches !== undefined && (typeof want.matches != "string" || !want.matches.length)) {
   problems.push(where + ": matches takes the selector to count against");
  }
  if (want.visible !== undefined && want.visible !== true) { problems.push(where + ": visible takes true - for the other way round, ask for hidden"); }
  if (want.hidden !== undefined && want.hidden !== true) { problems.push(where + ": hidden takes true - for the other way round, ask for visible"); }
  if (want.clear !== undefined && want.clear !== true) {
   problems.push(where + ": clear takes true - text that runs over its neighbour is a defect, and there is nothing to assert in it");
  }
  if (want.clear !== undefined && want.hidden !== undefined) {
   problems.push(where + ": clear reads where an element's text is painted, and a hidden element paints none");
  }
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
  validateBrowsers(entry, name, problems);
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
    // Each step on its own, then the three things only the whole list can say: that an attach has
    // something to put back, that a host handed to the network was being answered, and that a host
    // the entry answers is a host the entry owns up to reaching.
    var detached = [];
    var answering = [];
    var named = ((entry.network || []).map(function (n) { return n && n.host; }))
     .filter(function (h) { return typeof h == "string"; });
    entry.steps.forEach(function (step, i) {
     var where = name + " step " + (i + 1);
     var before = problems.length;
     validateStep(step, where, problems);
     if (!step || typeof step != "object") { return; }
     // A set that is well formed is read against the file it changes, so a name the bookmarklet does
     // not declare, or a value that would break it, stops the run here rather than in a browser.
     if (problems.length == before && setOf(step)) {
      var refused = setRefusal(name, setOf(step));
      if (refused) { problems.push(where + ": " + refused); }
     }
     if (typeof step.detach == "string" && step.detach.length) {
      var slot = typeof step.as == "string" && step.as.length ? step.as : step.detach;
      if (detached.indexOf(slot) < 0) { detached.push(slot); }
     }
     if (typeof step.attach == "string" && step.attach.length) {
      var held = detached.indexOf(step.attach);
      if (held < 0) {
       problems.push(where + ": nothing earlier in this entry detached " + step.attach);
      } else {
       detached.splice(held, 1);
      }
     }
     if (!step.answer || typeof step.answer != "object" || typeof step.answer.host != "string") { return; }
     if (step.answer.pass === true) {
      var answered = answering.indexOf(step.answer.host);
      if (answered < 0) {
       problems.push(where + ": nothing earlier in this entry answers " + step.answer.host);
      } else {
       answering.splice(answered, 1);
      }
     } else if (answering.indexOf(step.answer.host) < 0) {
      answering.push(step.answer.host);
     }
     if (!named.some(function (h) { return hostNamed(h, step.answer.host); })) {
      problems.push(where + ": " + step.answer.host + " is answered by this entry and not named in its"
       + " network - a host the bookmarklet reaches is named with the reason whoever answers it");
     }
    });
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

// A signed-in context for one site, or the reason there is none. recordVideo is the { dir, size } a
// context takes, handed over only for a short the maintainer asked for; a launcher that ignores it
// returns a context that records nothing, and the short is left to be made by hand.
async function openSignedIn(session, site, recordVideo) {
 if (!session.launcher.api) { return { context: null, why: session.launcher.why }; }
 var context = null;
 try {
  context = await session.launcher.api.launch({
   chromium: session.chromium,
   site: site,
   recordVideo: recordVideo || undefined
  });
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

// One engine, started the way the run asks. The capture settings are Chromium's own switches, so
// another engine starts without them. An engine Playwright has no build of on this machine is the
// one install step the run needs, and it is named as that rather than as Playwright's own message.
async function launchEngine(playwright, engine, options, capturing) {
 try {
  return await playwright[engine].launch({
   headless: !options.headed,
   slowMo: options.slowMo,
   args: capturing && engine == defaultEngine ? captureArgs : []
  });
 } catch (err) {
  if (/Executable doesn't exist|playwright install/i.test(String(err && err.message))) {
   var missing = new Error(engine + " is not installed for Playwright - run npx playwright install " + engine);
   missing.missingEngine = true;
   throw missing;
  }
  throw err;
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
  // An entry run in two engines captures twice, so the second engine's folder carries its name.
  ctx.captureFolder = path.join(runDir(), "capture",
   ctx.name + (ctx.engine && ctx.engine != defaultEngine ? "-" + ctx.engine : ""));
  fs.mkdirSync(ctx.captureFolder, { recursive: true });
 }
 return ctx.captureFolder;
}

// Where in the entry something happened, as milliseconds from the moment the page was opened, which
// is where the video starts too. It is what lets a clip be cut to the moment the bookmarklet ran
// rather than to a guess at it.
// A short is cut by these offsets as well, so an entry being recorded keeps a timeline even where it
// captures nothing else. Where the entry has auth the timeline stays in memory: close() hands it to
// the report only alongside an artifact, and an entry with auth has none.
function mark(ctx, what) {
 if (!ctx.captures && !ctx.short) { return; }
 ctx.timeline.push({ at: Date.now() - ctx.clock, what: scrubbed(ctx, what) });
}

function sizeText(size) { return (size && size.width) + "x" + (size && size.height); }

// What a step is, for the timeline: its action, and what it aims at where that is a selector or a key.
function stepName(step) {
 for (var i = 0; i < stepActions.length; i++) {
  var action = stepActions[i];
  if (step[action] === undefined) { continue; }
  if (action == "run" && setOf(step)) { return "run with " + cut(setText(setOf(step))); }
  if (action == "run" || action == "expect") { return action; }
  if (action == "viewport") { return "viewport " + sizeText(step.viewport); }
  var aimed = step[action];
  if (action == "answer") {
   return "answer " + cut(aimed && aimed.host) + (aimed && aimed.pass === true ? " from the network" : " " + (aimed && aimed.status));
  }
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

// The webm a context left in the folder it was told to record into, whatever Playwright named it.
function foundRecording(dir) {
 var found = [];
 try {
  found = fs.readdirSync(dir).filter(function (f) { return /\.webm$/i.test(f); });
 } catch (err) {
  return "";
 }
 return found.length ? path.join(dir, found[0]) : "";
}

// The video the context recorded, under a name of this run's choosing. Playwright names the file
// itself and finishes writing it only once the context has closed, so this runs after that. An
// entry recorded only for its short keeps the video out of the capture folder and out of the
// report: it is working material, and makeShort takes it away once the GIF is written.
//
// saveAs is the way to pick the file up, and it asks the browser for it - which a launcher's
// persistent context cannot answer, because closing that context closes the browser with it. So the
// folder it recorded into is read as well, which reaches the same file by another route.
async function saveVideo(page, ctx) {
 if (!ctx.capture && !ctx.short) { return ""; }
 var dir = ctx.capture ? captureDir(ctx) : shortWork(ctx);
 var file = path.join(dir, "entry.webm");
 var video = page.video();
 var lost = "";
 if (video) {
  try {
   await video.saveAs(file);
   await video.delete();
  } catch (err) {
   lost = firstLine(err);
  }
 }
 if (!fs.existsSync(file)) {
  var recorded = foundRecording(dir);
  if (recorded) {
   try {
    fs.renameSync(recorded, file);
   } catch (err) {
    file = recorded;
   }
  }
 }
 if (!fs.existsSync(file)) {
  if (!video) { return ctx.capture ? "the browser recorded no video for this entry" : ""; }
  return "the video could not be saved" + (lost ? ": " + lost : "");
 }
 ctx.videoFile = file;
 if (ctx.capture) { ctx.video = shownPath(file); }
 return "";
}

// ----------------------------------------------------------------------------------------------- //
// Recording a short
// ----------------------------------------------------------------------------------------------- //

// Where this entry's raw recording is kept while it is being turned into a GIF, inside the run
// folder rather than beside the finished recordings.
function shortWork(ctx) {
 if (!ctx.shortFolder) {
  ctx.shortFolder = path.join(runDir(), "shorts", ctx.name);
  fs.mkdirSync(ctx.shortFolder, { recursive: true });
 }
 return ctx.shortFolder;
}

// The one file a short run leaves for this bookmarklet, which is what the pipeline that makes the
// short reads.
function shortFile(name) { return path.join(shortsDir, name + ".gif"); }

// Where in the recording the clip starts and how long it runs, in seconds: a little before the
// bookmarklet ran, through to its result being on screen, and never longer than thirty seconds.
// The offsets are the timeline's, which starts where the video starts.
function shortClip(ctx) {
 var ran = 0;
 var found = false;
 var done = 0;
 for (var i = 0; i < ctx.timeline.length; i++) {
  if (!found && ctx.timeline[i].what == "the bookmarklet runs") {
   ran = ctx.timeline[i].at;
   found = true;
  }
  if (ctx.timeline[i].what == shortEndMark) { done = ctx.timeline[i].at; }
 }
 var from = Math.max(0, ran - shortLead);
 var span = done > from ? done - from : shortLead;
 return { from: from / 1000, span: Math.min(span, shortSeconds * 1000) / 1000 };
}

// The 15 second cut of a clip that runs longer, as the parts of the clip it keeps, in seconds from
// the clip's start. The moments it keeps are each time the bookmarklet runs and each step a reader
// makes by hand. Each keeps the lead before it and an even share of the fifteen seconds after it,
// never less than shortHold, and the clip's end keeps the same share before it, because that is
// the result on screen. Parts that overlap, or that are a frame or less apart, are joined;
// everything else is the waits, the checks and the set-up, and is dropped. The sum can still be
// over fifteen seconds where there are many moments, and then it is the render that stretches it.
function shortCut(ctx, clip) {
 var fromMs = clip.from * 1000;
 var endMs = clip.span * 1000;
 var byHand = new RegExp("^step \\d+: (" + shortUseActions.join("|") + ")( |$)");
 var moments = ctx.timeline.map(function (t) {
  return { at: t.at - fromMs, what: t.what };
 }).filter(function (t) {
  return t.at >= 0 && t.at <= endMs && (t.what == "the bookmarklet runs" || byHand.test(t.what));
 });
 var hold = Math.max(shortHold, (shortCutSeconds * 1000 - moments.length * shortLead) / (moments.length + 1));
 var parts = moments.map(function (m) {
  return [Math.max(0, m.at - shortLead), Math.min(endMs, m.at + hold)];
 });
 parts.push([Math.max(0, endMs - hold), endMs]);
 parts.sort(function (a, b) { return a[0] - b[0]; });
 var joined = [];
 parts.forEach(function (part) {
  var last = joined[joined.length - 1];
  if (last && part[0] <= last[1] + 1000 / shortFps) {
   last[1] = Math.max(last[1], part[1]);
  } else {
   joined.push([part[0], part[1]]);
  }
 });
 var keep = joined.map(function (part) {
  return [Number((part[0] / 1000).toFixed(3)), Number((part[1] / 1000).toFixed(3))];
 });
 return {
  keep: keep,
  seconds: keep.reduce(function (sum, part) { return sum + part[1] - part[0]; }, 0),
  moments: moments.map(function (m) { return { at: Number((m.at / 1000).toFixed(2)), what: m.what }; })
 };
}

// The recording as a GIF, cut to the moment the bookmarklet ran, or to the parts of that clip a
// cut keeps. ffmpeg is what writes it, as the video pipeline on this machine already does, and -n
// is how an unattended run refuses to overwrite a recording rather than stopping at a prompt about
// it. The empty string when it worked, and the reason it did not otherwise.
//
// A GIF ffmpeg did not write is taken away again, because the next run reads whatever is at this
// name as the recording that is already there and records nothing for it. ffmpeg opens the output
// before it encodes and leaves the file behind when the encode fails - a clip starting past the end
// of the recording exits 0 and writes no bytes at all - so an attempt left where it fell would be
// read as the finished recording by every run after it, and the short would be owed for good.
function writeShortGif(source, dest, clip, keep) {
 if (fs.existsSync(dest)) { return "a recording is already there, and it is kept: " + shownPath(dest); }
 fs.mkdirSync(path.dirname(dest), { recursive: true });
 var answer = child.spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-loglevel", "error", "-n",
  "-ss", clip.from.toFixed(3), "-t", clip.span.toFixed(3), "-i", source,
  "-vf", gifFilter(keep), "-loop", "0", dest], { encoding: "utf8" });
 // ffmpeg names the files it was given the way they were given, as absolute paths. A note reads
 // the way the rest of the report does, so they are put back the way this file shows a path.
 var said = String((answer && answer.stderr) || "").trim().split("\n")[0]
  .split(dest).join(shownPath(dest))
  .split(source).join(shownPath(source));
 if (answer.error) { return dropShortGif(dest, "ffmpeg could not be run: " + firstLine(answer.error)); }
 if (answer.status !== 0) {
  return dropShortGif(dest, "ffmpeg would not write the GIF: "
   + (said || "it exited " + answer.status));
 }
 if (!fs.existsSync(dest) || !fs.statSync(dest).size) {
  return dropShortGif(dest, "ffmpeg wrote no GIF" + (said ? ": " + said : ""));
 }
 return "";
}

// The output of an attempt that did not work, taken away so the name is free for the next run, and
// the reason handed back whether or not there was anything to take away.
function dropShortGif(dest, why) {
 try {
  if (fs.existsSync(dest)) { fs.unlinkSync(dest); }
 } catch (err) {
  return why + ", and what it did write is still at " + shownPath(dest);
 }
 return why;
}

// The short for an entry that passed. A failing entry never gets one, which is why this is called
// where the verdict is known and nowhere else.
function makeShort(ctx, result) {
 if (!ctx.short) { return; }
 if (!ctx.videoFile) {
  result.notes.push("no short: " + (ctx.private
   ? "the sign-in launcher opened a browser that records no video, so this short is made by hand"
   : "the browser recorded nothing for this entry"));
  return;
 }
 var clip = shortClip(ctx);
 // A clip over fifteen seconds is the whole one under <name>_Full.gif, and its cut is <name>.gif,
 // which is the short that is posted with its GIF. The cut is only ever written beside the whole
 // clip it came from: a cut that could not be written takes the whole clip away with it, so the
 // next run records both rather than finding one and keeping it.
 var cut = clip.span > shortCutSeconds ? shortCut(ctx, clip) : null;
 var full = shortFile(ctx.name + shortFullSuffix);
 var lost = cut ? writeShortGif(ctx.videoFile, full, clip) : "";
 var wroteFull = !!cut && !lost;
 if (!lost) { lost = writeShortGif(ctx.videoFile, shortFile(ctx.name), clip, cut && cut.keep); }
 if (lost && wroteFull) { lost = dropShortGif(full, lost + "; the whole clip was taken away with it"); }
 if (lost) {
  result.notes.push("no short: " + lost);
  return;
 }
 result.short = {
  file: shownPath(shortFile(ctx.name)),
  seconds: Number((cut ? cut.seconds : clip.span).toFixed(2)),
  fps: shortFps
 };
 if (cut) {
  result.short.full = { file: shownPath(full), seconds: Number(clip.span.toFixed(2)) };
  result.short.keep = cut.keep;
  // A signed-in entry's steps stay in memory, as its timeline does; the parts are only seconds.
  if (!ctx.private) { result.short.moments = cut.moments; }
 }
 // The recording is in the GIF now, so the working copy goes - unless the entry was captured too,
 // where the same file is an artifact the report points at.
 if (!ctx.capture) {
  try {
   fs.unlinkSync(ctx.videoFile);
  } catch (err) {
   result.notes.push("the recording this short was cut from is still at " + shownPath(ctx.videoFile));
  }
 }
 if (ctx.private) {
  result.short.review = true;
  result.notes.push("this short was recorded on a signed-in page: it stays on this machine until it"
   + " has been reviewed, and nothing the page showed is written down");
 }
}

// page.evaluate runs the code in the page's own global scope and leaves the page's content security
// policy to apply to whatever the bookmarklet then adds, which is what a bookmarklet meets. The
// sourceURL tag has to survive the trip, because the stack it leaves in an error is how the
// bookmarklet's errors are told apart from the page's own. Where it does not survive, Chromium's
// CDP Runtime.evaluate is the way in. Firefox has no CDP, so an engine other than Chromium that
// loses the tag has no way in at all, and says so rather than running code whose errors would all
// read as the page's.
async function chooseInjector(page, engine) {
 if (injectors[engine]) { return injectors[engine]; }
 var probe = "(function(){ try { null.x; } catch (e) { return String((e && e.stack) || \"\"); } })();"
  + "\n//# sourceURL=" + sourceUrl("__probe__");
 var survives = false;
 try {
  survives = /__probe__\.js/.test(String(await page.evaluate(probe)));
 } catch (err) {
  survives = false;
 }
 injectors[engine] = survives ? "evaluate" : engine == defaultEngine ? "cdp" : "none";
 return injectors[engine];
}

async function inject(page, code, name, engine) {
 // The guard keeps a bookmarklet that returns a DOM node from failing on the way back.
 var text = code + "\n;undefined;\n//# sourceURL=" + sourceUrl(name);
 var how = await chooseInjector(page, engine || defaultEngine);
 if (how == "evaluate") {
  await page.evaluate(text);
  return;
 }
 if (how == "none") {
  throw new Error(engine + " dropped the sourceURL tag, so the bookmarklet's errors could not be told"
   + " from the page's");
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
 if (ctx.engine && ctx.engine != defaultEngine) { return watchRequestEvents(page, ctx); }
 var session = await page.context().newCDPSession(page);
 var mainFrame = "";
 try {
  mainFrame = (await session.send("Page.getFrameTree")).frameTree.frame.id;
 } catch (err) {
  mainFrame = "";
 }
 function judge(address, home, initiator) {
  if (!startedBy(initiator && initiator.stack, sourceUrl(ctx.name))) { return; }
  judgeRequest(ctx, address, home);
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

function hostOf(address) {
 try { return new URL(address).host; } catch (err) { return ""; }
}

// A request held to be the bookmarklet's, counted and judged against the page's own host and the
// hosts the entry names.
function judgeRequest(ctx, address, home) {
 var target;
 try { target = new URL(address); } catch (err) { return; }
 if (!/^(https?|wss?):$/.test(target.protocol)) { return; }
 // Counted before it is judged, and whoever answers it: an entry answering a host itself still
 // wants to know how many times the bookmarklet asked, which is the whole of what a backing-off
 // retry can be seen by.
 ctx.requestCounts[target.host] = (ctx.requestCounts[target.host] || 0) + 1;
 if (target.host === home || ctx.network.some(function (n) { return hostNamed(n.host, target.host); })) { return; }
 if (ctx.offHosts.indexOf(target.host) < 0) { ctx.offHosts.push(target.host); }
}

// Firefox says nothing about which code started a request, so nothing here can tell the
// bookmarklet's from the page's. Every request made once the bookmarklet has first run is held to be
// its own, which judges more than Chromium does and never less: a host the page reaches by itself
// after that fails the entry here, and a host the bookmarklet reaches can never pass for the page's.
// The page's own load, before the bookmarklet ran, is left alone, and moving the page is the reader
// going somewhere, as it is in Chromium.
function watchRequestEvents(page, ctx) {
 page.on("request", function (request) {
  if (!ctx.ran) { return; }
  var frame = null;
  try { frame = request.frame(); } catch (err) { frame = null; }
  if (request.isNavigationRequest() && frame === page.mainFrame()) { return; }
  judgeRequest(ctx, request.url(), hostOf(frame ? frame.url() : page.url()));
 });
 page.on("websocket", function (socket) {
  if (ctx.ran) { judgeRequest(ctx, socket.url(), hostOf(page.url())); }
 });
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

// A host answered by the entry rather than by the network, so a state only the site's own server
// produces - the 403 an API gives past its hourly limit, say - is one a run can put the page in. The
// route is the context's, as the fixture pages' is, because a tab the bookmarklet opens makes its
// first request before any route of its own could be added. The answer carries
// access-control-allow-origin, as a site's own API does: without it the browser refuses the answer
// before the bookmarklet's own code sees it, and every status would read to the bookmarklet as a
// request that never arrived. Answering a host changes nothing about how its requests are judged.
async function answerHost(page, ctx, said) {
 await passHost(page, ctx, said.host);
 var predicate = function (url) { return hostNamed(said.host, url.host); };
 var handler = async function (route) {
  await route.fulfill({
   status: said.status,
   contentType: said.contentType || "text/plain; charset=utf-8",
   headers: { "access-control-allow-origin": "*" },
   body: said.body === undefined ? "" : said.body
  }).catch(function () { });
 };
 await page.context().route(predicate, handler);
 ctx.answers[said.host] = { predicate: predicate, handler: handler };
}

// The host handed back to the network, which is the other half of a state: refusing, then answering
// again, without the entry having to carry a copy of what the site would have said.
async function passHost(page, ctx, host) {
 var held = ctx.answers[host];
 if (!held) { return; }
 delete ctx.answers[host];
 await page.context().unroute(held.predicate, held.handler).catch(function () { });
}

// A piece of the page taken off it and kept, so a state a site produces for a moment - a listing
// replaced header row and all - lasts long enough for an entry to assert against it. The nodes are
// held in a handle rather than anywhere on the page, so nothing the harness does reaches the page's
// own scope: the bookmarklet meets a page that lost something, which is what it meets on a site.
// Each is remembered with the parent it hung from and the node it sat before, which is what attach
// puts it back by.
async function detachFrom(page, ctx, selector, slot) {
 var handle = await page.evaluateHandle(function (sel) {
  var held = [];
  var found = Array.prototype.slice.call(document.querySelectorAll(sel));
  for (var i = 0; i < found.length; i++) {
   if (!found[i].parentNode) { continue; }
   held.push({ node: found[i], parent: found[i].parentNode, next: found[i].nextSibling });
   found[i].parentNode.removeChild(found[i]);
  }
  return held;
 }, selector);
 var took = await handle.evaluate(function (held) { return held.length; });
 if (!took) {
  await handle.dispose().catch(function () { });
  throw failure("nothing to detach: " + selector + " matches nothing on the page");
 }
 if (ctx.detached[slot]) { await ctx.detached[slot].dispose().catch(function () { }); }
 ctx.detached[slot] = handle;
}

// What a detach took off, put back where it came from. A place that is itself gone - the whole table
// replaced since, say - is nowhere to put anything back, and that fails rather than passing quietly:
// an entry asserting what a page does once something is back wants to know the something is back.
async function attachTo(page, ctx, slot) {
 var handle = ctx.detached[slot];
 if (!handle) { throw failure("nothing is detached as " + slot); }
 var back = await handle.evaluate(function (held) {
  var put = 0;
  for (var i = held.length - 1; i >= 0; i--) {
   var parent = held[i].parent, next = held[i].next;
   if (!parent || !parent.isConnected) { continue; }
   if (next && next.parentNode === parent) { parent.insertBefore(held[i].node, next); }
   else { parent.appendChild(held[i].node); }
   put++;
  }
  return put;
 });
 delete ctx.detached[slot];
 await handle.dispose().catch(function () { });
 if (!back) { throw failure("nothing went back: where " + slot + " came from is no longer on the page"); }
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
  // The whole stack stays in memory for the failure report to map back to lines of the file. What
  // is written down is the four frames below, which is what a reader of the report wants.
  if (from == "bookmarklet") { ctx.thrownStacks.push(stack); }
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

// The after shot a run of the bookmarklet has asked for, taken at the next moment that ends its
// work: the entry's steps having run, or another run of the bookmarklet starting. A bookmarklet that
// works asynchronously has done nothing at the instant the injection call returns, so a shot taken
// there shows the page the before shot already showed. An entry that fails takes failure.png at that
// same moment under a name that says what it is, and drops whatever was pending rather than writing
// the same picture twice.
async function takePendingShot(page, ctx) {
 if (!ctx.pendingShot) { return; }
 var what = ctx.pendingShot;
 ctx.pendingShot = "";
 await shot(page, ctx, what);
}

async function runBookmarklet(page, ctx, index) {
 ctx.ran = true;
 ctx.runs++;
 // The code this run injects: the file as it is, or the file with a step's variables set. Whatever
 // ran last is what a stack is read against, because a value moves every column after it.
 ctx.check = (index && ctx.setChecks[index]) || ctx.baseCheck;
 if (ctx.check.set) { ctx.notes.push("step " + index + " ran it with " + setText(ctx.check.set)); }
 // A bookmarklet an entry runs twice, to check that the second run undoes the first, gets a numbered
 // pair for each run rather than one pair overwritten by the next.
 var which = ctx.runs > 1 ? "-" + ctx.runs : "";
 // Whatever the run before this one was waiting to show, this is the end of it.
 await takePendingShot(page, ctx);
 mark(ctx, "the bookmarklet runs");
 if (ctx.capture) { await shot(page, ctx, "before" + which); }
 try {
  await inject(page, ctx.check.code, ctx.name, ctx.engine);
 } catch (err) {
  if (ctx.capture) { await shot(page, ctx, "after" + which); }
  var stack = String((err && err.stack) || (err && err.message) || err || "");
  if (stack.indexOf(sourceUrl(ctx.name)) >= 0) {
   ctx.diagnosis = threwDiagnosis(ctx, firstLine(err), stack);
   throw failure("the bookmarklet threw: " + firstLine(err) + atLine(ctx, stack));
  }
  ctx.diagnosis = threwDiagnosis(ctx, firstLine(err), "");
  throw failure("the bookmarklet could not be run: " + firstLine(err));
 }
 if (ctx.capture) { ctx.pendingShot = "after" + which; }
}

// The line in the formatted file an error came from, read out of the one line the browser ran.
function atLine(ctx, stack) {
 if (ctx.check.decodeChanged) { return ""; }
 var m = new RegExp(escapeRegExp(sourceUrl(ctx.name)) + ":1:(\\d+)").exec(stack);
 if (!m) { return ""; }
 var line = lineOfColumn(ctx.check, Number(m[1]));
 return line ? " (line " + line + ")" : "";
}

// ----------------------------------------------------------------------------------------------- //
// Reading a failure
// ----------------------------------------------------------------------------------------------- //

// Every frame of a stack that lands in the bookmarklet, as lines of the formatted file. The browser
// ran the whole bookmarklet as one line, so a frame's column is what says where in the file it was.
// A file holding a percent escape has no such mapping - the URL field changed the code before it ran
// - and that is the one case this answers with nothing.
function linesOfStack(ctx, stack) {
 var out = [];
 if (ctx.check.decodeChanged) { return out; }
 var pattern = new RegExp(escapeRegExp(sourceUrl(ctx.name)) + ":1:(\\d+)", "g");
 eachMatch(stack, pattern, function (m) {
  var line = lineOfColumn(ctx.check, Number(m[1]));
  if (!line) { return; }
  if (out.some(function (f) { return f.line === line; })) { return; }
  out.push({ line: line, text: String(ctx.check.lines[line - 1] || "").trim() });
 });
 return out;
}

// The names inside a selector that a line of the bookmarklet would hold: ids, classes, attribute
// names and values, and tag names. The punctuation goes, because a bookmarklet rarely writes a
// selector the way an entry does - it builds it, or reads one part of it at a time.
//
// A tag name is only read where the selector names nothing else, because it is a word any file is
// full of: "div.listing" would otherwise point at every createElement("div") in the bookmarklet and
// say nothing about the listing.
function selectorParts(selector) {
 var text = String(selector);
 var named = {};
 var tags = {};
 function add(into, name) {
  var word = String(name || "").trim();
  if (word.length > 1) { into[word] = true; }
 }
 eachMatch(text, /#([A-Za-z][\w-]*)/g, function (m) { add(named, m[1]); });
 eachMatch(text, /\.([A-Za-z][\w-]*)/g, function (m) { add(named, m[1]); });
 eachMatch(text, /\[\s*([A-Za-z][\w-]*)(?:[^=\]]*=\s*["']?([^"'\]]*))?/g, function (m) {
  add(named, m[1]);
  add(named, m[2]);
 });
 eachMatch(text, /(?:^|[\s>+~(,])([A-Za-z][a-zA-Z0-9-]*)/g, function (m) { add(tags, m[1]); });
 var strong = Object.keys(named);
 return strong.length ? strong : Object.keys(tags);
}

// Where in the formatted file a selector is used. The whole selector first, because a bookmarklet
// usually holds it as one string; failing that, the lines that name most of its parts. It is a
// reader's answer rather than a parser's, and its job is to put an agent on the right lines without
// it having to open the file.
function linesUsing(check, selector) {
 var lines = (check && check.lines) || [];
 var whole = String(selector).trim();
 var out = [];
 var i;
 for (i = 0; i < lines.length; i++) {
  if (whole && lines[i].indexOf(whole) >= 0) { out.push({ line: i + 1, text: lines[i].trim() }); }
 }
 if (out.length) { return out.slice(0, usesLimit); }

 var parts = selectorParts(whole);
 if (!parts.length) { return []; }
 var scored = [];
 for (i = 0; i < lines.length; i++) {
  var line = lines[i];
  var named = parts.filter(function (part) { return line.indexOf(part) >= 0; });
  if (named.length) { scored.push({ line: i + 1, text: line.trim(), named: named }); }
 }
 scored.sort(function (a, b) { return b.named.length - a.named.length || a.line - b.line; });
 return scored.slice(0, usesLimit)
  .sort(function (a, b) { return a.line - b.line; })
  .map(function (s) { return { line: s.line, text: s.text, named: s.named.join(" ") }; });
}

// A selector split into its steps, at the whitespace and the combinators outside any bracket, quote
// or parenthesis. Each step carries the characters that join it to the one before, so the steps put
// back together are the selector again: an attribute value holding a space, or a :has() holding a
// combinator, is why this is read rather than split on a pattern.
function selectorSteps(selector) {
 var text = String(selector);
 var out = [];
 var piece = "";
 var join = "";
 var depth = 0;
 var quote = "";
 for (var i = 0; i < text.length; i++) {
  var ch = text[i];
  if (quote) {
   piece += ch;
   if (ch === quote && text[i - 1] !== "\\") { quote = ""; }
   continue;
  }
  if (ch === "\"" || ch === "'") { quote = ch; piece += ch; continue; }
  if (ch === "[" || ch === "(") { depth++; piece += ch; continue; }
  if (ch === "]" || ch === ")") { depth = Math.max(0, depth - 1); piece += ch; continue; }
  if (depth > 0) { piece += ch; continue; }
  if (/\s/.test(ch) || ch === ">" || ch === "+" || ch === "~") {
   if (piece) { out.push({ join: join, sel: piece }); piece = ""; join = ""; }
   join += ch;
   continue;
  }
  piece += ch;
 }
 if (piece) { out.push({ join: join, sel: piece }); }
 return out;
}

// The part of a missing selector that is still on the page, which is where the thing it names was
// expected: "div.listing table.files" with no table left answers "div.listing". A selector whose
// first step is gone too answers the body, because the page is the region then.
async function nearestRegion(page, selector) {
 var steps = selectorSteps(selector);
 for (var i = steps.length - 1; i > 0; i--) {
  var prefix = "";
  for (var j = 0; j < i; j++) { prefix += steps[j].join + steps[j].sel; }
  var count = 0;
  try {
   count = await page.locator(prefix).count();
  } catch (err) {
   count = 0;
  }
  if (count) { return { selector: prefix, why: "the longest part of the selector still on the page" }; }
 }
 return { selector: "body", why: "no part of the selector is on the page" };
}

// The region's markup, cut down to something a reader takes in at once: four levels deep, six
// children a level, and a line of any text or attribute value. It runs in the page against the live
// element, and it is written to be sent there as source, so it uses nothing from this file.
function readTrimmedHtml(el) {
 var maxDepth = 4;
 var maxChildren = 6;
 var maxText = 80;

 function shorten(text) {
  var s = String(text === undefined || text === null ? "" : text);
  return s.length > maxText ? s.slice(0, maxText) + "..." : s;
 }

 function copy(node, depth) {
  if (node.nodeType === 3) { return document.createTextNode(shorten(node.nodeValue)); }
  if (node.nodeType !== 1) { return null; }
  var made;
  try {
   made = document.createElement(String(node.tagName || "span").toLowerCase());
  } catch (err) {
   return null;
  }
  var attrs = node.attributes || [];
  for (var a = 0; a < attrs.length; a++) {
   try {
    made.setAttribute(attrs[a].name, shorten(attrs[a].value));
   } catch (err) {
    /* an attribute name the copy will not take says nothing a reader needs */
   }
  }
  var kids = node.childNodes || [];
  if (depth >= maxDepth) {
   if (kids.length) { made.appendChild(document.createComment(" " + kids.length + " nodes deeper ")); }
   return made;
  }
  var kept = 0;
  for (var k = 0; k < kids.length; k++) {
   if (kids[k].nodeType === 3 && !String(kids[k].nodeValue || "").trim()) { continue; }
   if (kept >= maxChildren) {
    made.appendChild(document.createComment(" and more "));
    break;
   }
   var child = copy(kids[k], depth + 1);
   if (child) {
    made.appendChild(child);
    kept++;
   }
  }
  return made;
 }

 var copied = copy(el, 0);
 return copied ? copied.outerHTML : "";
}

// What an agent needs about a selector that is not on the page any more, read while the page is
// still open. A signed-in page gives the selector and the bookmarklet's own lines and nothing else:
// a snapshot and the markup are the account's content as much as the page's.
async function diagnoseMissing(page, ctx, selector) {
 var found = { kind: "requires", selector: selector, uses: linesUsing(ctx.check, selector) };
 if (ctx.private) { return found; }
 var region = await nearestRegion(page, selector);
 found.region = { selector: region.selector, why: region.why, aria: "", html: "" };
 try {
  found.region.aria = cutText(await page.locator(region.selector).first().ariaSnapshot(), ariaLimit);
 } catch (err) {
  found.region.aria = "";
 }
 try {
  found.region.html = cutText(await page.locator(region.selector).first().evaluate(readTrimmedHtml), htmlLimit);
 } catch (err) {
  found.region.html = "";
 }
 return found;
}

// What an agent needs about a bookmarklet that threw: the message, and the lines of the formatted
// file the stack came from. Only the frames that land in the bookmarklet are kept, which is both
// what is worth reading and all a signed-in page may give.
function threwDiagnosis(ctx, message, stack) {
 return {
  kind: "threw",
  message: scrubbed(ctx, message),
  frames: linesOfStack(ctx, stack),
  mapped: !ctx.check.decodeChanged
 };
}

async function checkRequires(page, ctx) {
 for (var i = 0; i < ctx.requires.length; i++) {
  var selector = ctx.requires[i];
  try {
   await page.waitForSelector(selector, { state: "attached", timeout: Math.min(ctx.timeout, requiresTimeout) });
  } catch (err) {
   ctx.diagnosis = await diagnoseMissing(page, ctx, selector);
   throw failure("site changed: " + selector + " not found on " + ctx.shown);
  }
 }
}

// Where an element's painted text lands, and what it lands on. Runs in the page, for a "clear"
// expectation.
//
// The text is measured as glyph runs, through Range.getClientRects, rather than as the element's
// box: a cell wider than its words is not a collision and a box reads as one. Where a run leaves the
// element's own border box, elementFromPoint says what sits under the overflow, and that element's
// own glyph runs are measured against this one's. Reading the overflow alone would be wrong in both
// directions at once on the page this was written for: at a repository root GitHub serves the header
// row at font-size 0, so the overflow covers nothing a reader can see, and on a folder page the same
// row paints its three headings and the same overflow covers one of them.
//
// A pixel of run, or of overlap, is a rounding edge rather than text a reader cannot read, which is
// the measure test/pages.test.js already uses for the overlays a page floats over itself.
//
// It is handed the element rather than the selector, because an entry's selector is Playwright's
// and not always the page's: "a:visible" is a selector the harness resolves and document
// .querySelector throws on.
function readPaintedClear(el) {
 var edge = 1;

 // Every glyph run inside a node, with the text they carry, leaving out anything not rendered.
 function paintedRuns(node) {
  var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
  var runs = [], words = [], at = null;
  while ((at = walker.nextNode())) {
   if (!at.nodeValue || !at.nodeValue.trim()) { continue; }
   var owner = at.parentElement;
   if (owner) {
    var style = getComputedStyle(owner);
    if (style.visibility === "hidden" || style.display === "none") { continue; }
   }
   var range = document.createRange();
   range.selectNodeContents(at);
   var rects = range.getClientRects();
   var painted = false;
   for (var i = 0; i < rects.length; i++) {
    if (!(rects[i].width > edge && rects[i].height > edge)) { continue; }
    runs.push({ left: rects[i].left, right: rects[i].right, top: rects[i].top, bottom: rects[i].bottom });
    painted = true;
   }
   if (painted) { words.push(at.nodeValue.trim()); }
  }
  return { runs: runs, text: words.join(" ").slice(0, 120) };
 }

 var mine = paintedRuns(el);
 var box = el.getBoundingClientRect();
 var measured = {
  runs: mine.runs.length, text: mine.text, past: 0, over: null,
  scrollWidth: Math.round(el.scrollWidth), clientWidth: Math.round(el.clientWidth)
 };
 if (!mine.runs.length) { return measured; }

 // The points inside a run that fall outside the element's own box, plus each run's two tails,
 // which are the furthest its text reaches.
 var points = [], past = 0, step = 2;
 for (var r = 0; r < mine.runs.length; r++) {
  var run = mine.runs[r];
  var sides = [run.right - box.right, box.left - run.left, run.bottom - box.bottom, box.top - run.top];
  for (var s = 0; s < sides.length; s++) { if (sides[s] > past) { past = sides[s]; } }
  if (Math.max(sides[0], sides[1], sides[2], sides[3]) <= edge) { continue; }
  var middle = (run.top + run.bottom) / 2;
  points.push([run.right - 0.5, middle]);
  points.push([run.left + 0.5, middle]);
  for (var y = run.top + 1; y < run.bottom; y += step) {
   for (var x = run.left + 0.5; x < run.right; x += step) {
    var inside = x > box.left + edge && x < box.right - edge && y > box.top + edge && y < box.bottom - edge;
    if (!inside) { points.push([x, y]); }
   }
  }
 }
 measured.past = Math.round(past * 100) / 100;
 if (!points.length) { return measured; }
 if (points.length > 600) { points = points.slice(0, 600); }

 var hits = [], seen = [];
 for (var p = 0; p < points.length; p++) {
  var under = document.elementFromPoint(points[p][0], points[p][1]);
  // The element itself, anything inside it and anything holding it are all its own text.
  if (!under || under === el || el.contains(under) || under.contains(el)) { continue; }
  if (seen.indexOf(under) > -1) { continue; }
  seen.push(under);
  var theirs = paintedRuns(under);
  var worst = null;
  for (var t = 0; t < theirs.runs.length; t++) {
   for (var m = 0; m < mine.runs.length; m++) {
    var w = Math.min(theirs.runs[t].right, mine.runs[m].right) - Math.max(theirs.runs[t].left, mine.runs[m].left);
    var h = Math.min(theirs.runs[t].bottom, mine.runs[m].bottom) - Math.max(theirs.runs[t].top, mine.runs[m].top);
    if (w > edge && h > edge && (!worst || w > worst.w)) { worst = { w: w, h: h }; }
   }
  }
  if (!worst) { continue; }
  hits.push({
   element: under.tagName.toLowerCase() + (under.id ? "#" + under.id : ""),
   overlap: Math.round(worst.w) + "x" + Math.round(worst.h),
   text: theirs.text
  });
 }
 if (hits.length) { measured.over = hits.slice(0, 3); }
 return measured;
}

async function doExpect(page, ctx, want, where) {
 // What the bookmarklet sent, which is the one thing about a pass that is nowhere on the page. The
 // span is since the last count of the same host, so a step list reads as a request per directory
 // rather than as a running total nobody can work out by hand. The counts are kept under the host
 // each request went to, so a name standing for several - "*." and a domain, as the entry's network
 // and an answer step both read it - is the sum of the hosts it stands for rather than a host of
 // its own that nothing ever reaches.
 if (want.requests !== undefined) {
  var counted = 0;
  Object.keys(ctx.requestCounts).forEach(function (h) {
   if (hostNamed(want.requests, h)) { counted += ctx.requestCounts[h]; }
  });
  var asked = Object.prototype.hasOwnProperty.call(ctx.requestMarks, want.requests);
  var made = counted - (asked ? ctx.requestMarks[want.requests] : 0);
  ctx.requestMarks[want.requests] = counted;
  var bounded = want.atMost !== undefined;
  if (bounded ? made > want.atMost : made !== want.count) {
   throw failure(where + ": the bookmarklet made " + made + " request" + (made == 1 ? "" : "s")
    + " to " + want.requests + " since " + (asked ? "the last count" : "the page opened") + ", "
    + (bounded ? "more than the " + want.atMost + " this allows" : "not " + want.count));
  }
  return;
 }
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
 // Geometry, which no other expectation here reads: the element's painted text inside its own
 // border box, and where it runs past, over nothing that paints text of its own.
 if (want.clear) {
  try {
   await locator.first().waitFor({ state: "attached" });
  } catch (err) {
   throw failure(where + ": " + want.selector + " is not on the page to measure");
  }
  var painted = await locator.first().evaluate(readPaintedClear);
  if (!painted.runs) {
   throw failure(where + ": " + want.selector + " paints no text, so where its text lands is not a"
    + " question the page answers - ask for visible instead");
  }
  if (painted.over) {
   var covered = painted.over.map(function (hit) {
    return hit.element + " by " + hit.overlap
     + (ctx.private || !hit.text ? "" : " (" + JSON.stringify(cut(hit.text)) + ")");
   }).join(", ");
   throw failure(where + ": " + want.selector + " paints " + painted.past
    + "px of text past its own box, over " + covered
    + " (the box holds " + painted.clientWidth + "px of the " + painted.scrollWidth + "px it needs)");
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
 if (step.run) { return runBookmarklet(page, ctx, index); }
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
 if (step.answer !== undefined) {
  if (step.answer.pass === true) { return passHost(page, ctx, step.answer.host); }
  return answerHost(page, ctx, step.answer);
 }
 if (step.detach !== undefined) {
  return detachFrom(page, ctx, step.detach,
   typeof step.as == "string" && step.as.length ? step.as : step.detach);
 }
 if (step.attach !== undefined) { return attachTo(page, ctx, step.attach); }
 if (step.viewport !== undefined) { return setViewport(page, ctx, step.viewport); }
 return doExpect(page, ctx, step.expect, where);
}

// The size every step after this one meets, until another viewport step or the end of the entry.
async function setViewport(page, ctx, size) {
 ctx.viewportNow = { width: size.width, height: size.height };
 await page.setViewportSize(ctx.viewportNow);
}

// The entry's own size again, once its steps are done, so nothing a step asked for outlasts the
// entry that asked for it.
async function restoreViewport(page, ctx) {
 if (!ctx.viewportNow) { return; }
 ctx.viewportNow = null;
 mark(ctx, "the viewport goes back to " + sizeText(ctx.viewport));
 await page.setViewportSize(ctx.viewport);
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
 // twice, which is how a bookmarklet that turns itself off on the second run is checked. A run that
 // sets variables names it too.
 if (!ctx.steps.some(function (step) { return step.run !== undefined; })) { await runBookmarklet(page, ctx); }
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
 // Where the entry's work ended, which is where a short's clip is cut to.
 mark(ctx, shortEndMark);
 // The page with everything the entry asked for done, which is what the after shot is of.
 await takePendingShot(page, ctx);
 await restoreViewport(page, ctx);
}

// Whether an entry counts the requests the bookmarklet sent, which only Chromium can tell apart from
// the page's own.
function countsRequests(entry) {
 return !!(entry && Array.isArray(entry.steps) && entry.steps.some(function (step) {
  return step && step.expect && step.expect.requests !== undefined;
 }));
}

// Why an entry cannot be judged in an engine other than Chromium, or "" where it can.
function engineSkip(entry, engine) {
 if (engine == defaultEngine || !entry) { return ""; }
 if (entry.auth) {
  return "an entry with auth runs in " + defaultEngine + " only - the sign-in launcher gives a "
   + defaultEngine + " browser";
 }
 if (countsRequests(entry)) {
  return "it counts the requests the bookmarklet sent, and only " + defaultEngine + " says which code sent"
   + " a request - " + engine + " would count the page's own as well";
 }
 return "";
}

// The permissions an engine is handed for an entry. Firefox has no clipboard permission, its
// clipboard being open to the page already, so asking for one there is a note rather than an error.
function permissionsFor(engine, asked, notes) {
 var list = asked || [];
 if (engine == defaultEngine) { return list; }
 var open = list.filter(function (p) { return openInFirefox.indexOf(p) >= 0; });
 if (open.length) {
  notes.push(engine + " has no " + open.join(" or ") + " permission to grant: its clipboard is open to the page");
 }
 return list.filter(function (p) { return openInFirefox.indexOf(p) < 0; });
}

// How a result is named where an engine other than Chromium ran it, so two runs of one entry in one
// report read apart.
function labelOf(result) {
 return result.name + (result.browser && result.browser != defaultEngine ? " [" + result.browser + "]" : "");
}

async function runOne(browser, name, entry, session, options, engine) {
 var started = Date.now();
 engine = engine || defaultEngine;
 var result = {
  name: name,
  browser: engine,
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
  // What was read off the page while it was still open goes to failure.md rather than into the
  // report, so it is held by name until the run writes that file.
  if (ctx && ctx.diagnosis && verdict == "fail") { diagnoses[labelOf(result)] = ctx.diagnosis; }
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

 // Each run step that sets variables runs the file with the values in, checked here as the
 // configuration check already did before the browser started, and held by the step's number.
 var setChecks = {};
 var listed = (entry && entry.steps) || [];
 for (var s = 0; s < listed.length; s++) {
  var set = setOf(listed[s]);
  if (!set) { continue; }
  var variant = checkWithSet(file, name, set);
  if (!variant.ok) { return close("fail", "step " + (s + 1) + ": " + variant.reason); }
  setChecks[s + 1] = variant;
 }

 // What this engine cannot judge, said before any page opens. The file's own check above holds in
 // every engine, so a broken file still fails here rather than skipping.
 var cannot = engineSkip(entry, engine);
 if (cannot) { return close("skip", cannot); }

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
  engine: engine,
  check: check,
  baseCheck: check,
  setChecks: setChecks,
  notes: result.notes,
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
  requestCounts: {},
  requestMarks: {},
  answers: {},
  detached: {},
  private: !!(entry && entry.auth),
  auth: (entry && entry.auth) || "",
  signedIn: (entry && entry.signedIn) || "",
  signedInFound: undefined,
  hidden: !!named,
  shown: named || resolveUrl(asked),
  host: "",
  clock: started,
  viewport: (options && options.short) ? shortViewport : viewport,
  viewportNow: null,
  captures: false,
  capture: false,
  captureFolder: "",
  pendingShot: "",
  shots: [],
  timeline: [],
  video: "",
  short: false,
  shortFolder: "",
  videoFile: "",
  thrownStacks: [],
  diagnosis: null
 };
 ctx.host = named ? originOf(ctx.url).replace(/^https?:\/\//, "") : "";
 // An entry with auth is never captured, and nothing else about it is written down either, so the
 // whole of capturing answers to this one flag. Everything else may keep a failure's screenshot.
 ctx.captures = !ctx.private;
 ctx.capture = ctx.captures && !!((options && options.capture) || (entry && entry.capture === true));
 // A short is the entry's own recording, and it is the one artifact an entry with auth does make:
 // the maintainer asked for it, reviews it, and it never leaves this machine. A recording already
 // on disk is kept as it is, so the entry is not recorded again for one.
 ctx.short = !!(options && options.short);
 if (ctx.short && engine != defaultEngine) {
  ctx.short = false;
  result.notes.push("no short: a short is recorded in " + defaultEngine + ", and this run is " + engine + "'s");
 }
 if (ctx.short && fs.existsSync(shortFile(name))) {
  ctx.short = false;
  result.notes.push("no short: a recording is already there, and it is kept: "
   + shownPath(shortFile(name)));
 }
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
   var opened = await openSignedIn(session, ctx.auth,
    ctx.short ? { dir: shortWork(ctx), size: ctx.viewport } : undefined);
   if (!opened.context) { return close("skip", opened.why); }
   context = opened.context;
   if (entry.permissions && entry.permissions.length) { await context.grantPermissions(entry.permissions); }
   page = await context.newPage();
   await page.setViewportSize(ctx.viewport);
  } else {
   context = await browser.newContext({
    viewport: ctx.viewport,
    permissions: permissionsFor(engine, entry && entry.permissions, result.notes),
    recordVideo: (ctx.capture || ctx.short)
     ? { dir: ctx.capture ? captureDir(ctx) : shortWork(ctx), size: ctx.viewport }
     : undefined
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
  ctx.pendingShot = "";
  if (!(err && err.skip)) { await shot(page, ctx, "failure"); }
  await context.close().catch(function () { });
  var lost = await saveVideo(page, ctx);
  if (lost) { result.notes.push(lost); }
  if (ctx.short) {
   result.notes.push(err && err.skip
    ? "no short: the entry was skipped, so the bookmarklet never ran"
    : "no short: the entry did not pass, and a recording of a bookmarklet that did not work is"
    + " not the bookmarklet's recording");
  }
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
  ctx.diagnosis = threwDiagnosis(ctx, thrown[0].message, ctx.thrownStacks[0] || "");
  return close("fail", "the bookmarklet threw after it returned: " + thrown[0].message);
 }
 makeShort(ctx, result);
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
 return pad(labelOf(result), width) + "  " + pad(result.verdict, 4) + "  " + pad(seconds(result.durationMs), 6)
  + (result.reason ? "  " + result.reason : "");
}

function stamp(when) {
 function two(n) { return (n < 10 ? "0" : "") + n; }
 return when.getFullYear() + "-" + two(when.getMonth() + 1) + "-" + two(when.getDate()) + "_"
  + two(when.getHours()) + two(when.getMinutes()) + two(when.getSeconds());
}

// browser is the engine the run was asked for, and browsers every engine an entry ran in, in the
// order they first ran; each result names its own. injected is how the asked-for engine took the code.
function writeReport(results, mode, started, finished, engine) {
 var counts = countOf(results);
 var dir = runDir();
 var asked = engine || defaultEngine;
 var ran = [];
 results.forEach(function (r) { if (r.verdict != "skip" && ran.indexOf(r.browser) < 0) { ran.push(r.browser); } });

 fs.writeFileSync(path.join(dir, "report.json"), JSON.stringify({
  tool: "test-bm",
  mode: mode,
  browser: asked,
  browsers: ran,
  injected: injectors[asked] || "none",
  started: started.toISOString(),
  finished: finished.toISOString(),
  counts: counts,
  results: results
 }, null, 1) + "\n");

 var width = 0;
 results.forEach(function (r) { if (labelOf(r).length > width) { width = labelOf(r).length; } });
 var lines = results.map(function (r) { return summaryLine(r, width); });
 lines.push(tally(counts));
 fs.writeFileSync(path.join(dir, "summary.txt"), lines.join("\n") + "\n");
 return dir;
}

// ----------------------------------------------------------------------------------------------- //
// failure.md
// ----------------------------------------------------------------------------------------------- //

// A fenced block whose fence is longer than anything inside it, so a snapshot or a line of markup
// holding three backticks cannot end the block early.
function fence(language, text) {
 var body = String(text === undefined || text === null ? "" : text).replace(/\s+$/, "");
 var wall = "```";
 while (body.indexOf(wall) >= 0) { wall += "`"; }
 return [wall + language, body, wall, ""];
}

// Lines of a formatted file as they read in the report, each with its own number, which is what an
// agent needs to find them again.
function quotedLines(uses) {
 return uses.map(function (use) {
  return (use.line < 10 ? "  " : use.line < 100 ? " " : "") + use.line + "  " + use.text;
 }).join("\n");
}

// The screenshot of the page as it stood when the entry failed, where there is one. An entry with
// auth never has one.
function failureShot(result) {
 if (!result.capture || !result.capture.screenshots) { return ""; }
 var found = result.capture.screenshots.filter(function (s) { return s.what == "failure"; });
 return found.length ? found[0].file : "";
}

// One failing bookmarklet, as much of it as is knowable without running anything again.
function failureSection(result, diagnosis) {
 var out = ["## " + labelOf(result), ""];
 out.push("- **Verdict**: " + (result.reason || "fail"));
 out.push("- **Page**: " + (result.url || defaultUrl));
 out.push("- **File**: `" + shownPath(bookmarkletFile(result.name)) + "`");
 if (result.browser && result.browser != defaultEngine) {
  out.push("- **Browser**: " + result.browser + " - run it again with `--browser " + result.browser + "`");
 }
 if (result.auth) {
  out.push("- **Signed in**: " + result.auth + " - nothing this page showed is in this report");
 }
 out.push("");

 if (diagnosis && diagnosis.kind == "requires") {
  out.push("### The selector that is gone", "");
  out = out.concat(fence("", diagnosis.selector));
  out.push("### Where the bookmarklet uses it", "");
  if (diagnosis.uses.length) {
   out = out.concat(fence("javascript", quotedLines(diagnosis.uses)));
   if (diagnosis.uses[0].named) {
    out.push("Those lines name parts of the selector rather than the whole of it, so read them as"
     + " where it is built rather than as where it is written.", "");
   }
  } else {
   out.push("No line of the file holds the selector or any part of it, so the entry asks for"
    + " something the bookmarklet does not name. Read the entry's `requires` before the file.", "");
  }
  if (diagnosis.region) {
   out.push("### The region it was expected in", "");
   out.push("`" + diagnosis.region.selector + "` - " + diagnosis.region.why + ".", "");
   if (diagnosis.region.aria) {
    out.push("What a reader of that region hears:", "");
    out = out.concat(fence("yaml", diagnosis.region.aria));
   }
   if (diagnosis.region.html) {
    out.push("What it is made of, trimmed:", "");
    out = out.concat(fence("html", diagnosis.region.html));
   }
   if (!diagnosis.region.aria && !diagnosis.region.html) {
    out.push("The page would not say: it had gone by the time the region was read.", "");
   }
  }
 } else if (diagnosis && diagnosis.kind == "threw") {
  out.push("### What it threw", "");
  out = out.concat(fence("", diagnosis.message));
  out.push("### Where it threw, in the formatted file", "");
  if (diagnosis.frames.length) {
   out = out.concat(fence("javascript", quotedLines(diagnosis.frames)));
   out.push("Innermost frame first.", "");
  } else if (!diagnosis.mapped) {
   out.push("A percent escape in this file decodes on the way into the URL field, so the one line"
    + " the browser ran is not the file's lines and the stack cannot be mapped onto them.", "");
  } else {
   out.push("The stack named no line of this file, so the throw came from the page's own code"
    + " reached through the bookmarklet.", "");
  }
 } else {
  out.push("### What the run said", "");
  out = out.concat(fence("", result.reason || "fail"));
  out.push("Nothing was read off the page for this one: the entry got past what it `requires` and"
   + " the bookmarklet did not throw, so what failed is one of the entry's own expectations or"
   + " steps. The reason above names it.", "");
 }

 var shot = failureShot(result);
 if (shot) {
  out.push("### The page when it failed", "");
  out.push("`" + shot + "`", "");
 }
 result.errors.filter(function (e) { return e.from == "page"; }).slice(0, 3).forEach(function (e, i) {
  if (!i) { out.push("### What the page itself logged", ""); }
  out.push("- " + e.message);
  if (i == 2) { out.push(""); }
 });
 if (out[out.length - 1] !== "") { out.push(""); }
 return out;
}

// Everything that failed, in one file beside the report, written as text so any assistant reads it
// without a tool. It is written for a run of one bookmarklet as readily as for a run of all of
// them, because a run of one is how an agent checks the fix it just made.
function writeFailureReport(results, mode, finished) {
 var failed = results.filter(function (r) { return r.verdict == "fail"; });
 var out = [
  "# test-bm failures",
  "",
  failed.length + " of " + results.length + " "
   + (results.length == 1 ? "entry" : "entries") + " failed in the "
   + (mode ? "--" + mode : "single") + " run that finished " + finished.toISOString() + ".",
  "",
  "Everything needed to act on them is in this file, so nothing here needs the run again. Read"
   + " `AGENTS.md` at the repository root for what to do with it: the short of it is to find what"
   + " replaced what is missing, make the smallest edit to the bookmarklet, and run"
   + " `node test-bm.js <name>` for the verdict. Never loosen an expectation in `test-bm.json` to"
   + " make a test pass.",
  ""
 ];
 failed.forEach(function (result) {
  out = out.concat(failureSection(result, diagnoses[labelOf(result)] || null));
 });
 var file = path.join(runDir(), "failure.md");
 fs.writeFileSync(file, out.join("\n").replace(/\n+$/, "") + "\n");
 return file;
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
    + (entry.browsers ? "  browsers " + entry.browsers.join(", ") : "")
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
 if (result.short) {
  console.log("  short: " + result.short.file + "  " + result.short.seconds + "s at "
   + result.short.fps + " fps" + (result.short.review ? "  waiting to be reviewed" : ""));
  if (result.short.full) {
   console.log("  full: " + result.short.full.file + "  " + result.short.full.seconds + "s, cut to "
    + result.short.keep.map(function (part) { return part[0] + "-" + part[1] + "s"; }).join(", "));
  }
  (result.short.moments || []).forEach(function (m) { console.log("  kept +" + m.at + "s  " + m.what); });
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
 var options = { mode: "", name: "", site: "", headed: false, slowMo: 0, capture: false, short: false,
  browser: "" };
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
  } else if (arg == "--short") {
   options.short = true;
  } else if (arg == "--browser") {
   if (options.browser) { configError("--browser takes one engine for the whole run"); }
   options.browser = String(args[++i] || "");
   if (engines.indexOf(options.browser) < 0) { configError("--browser takes " + engines.join(" or ")); }
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
 if (options.mode == "sign-in" && options.browser) {
  configError("--sign-in opens the sign-in launcher's own browser, and takes no --browser");
 }
 if (options.short && options.browser && options.browser != defaultEngine) {
  configError("--short records in " + defaultEngine + ", the browser the shorts are made in, and takes no --browser "
   + options.browser);
 }
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

 // Each bookmarklet in each engine it runs in: the one --browser names for every entry, or else
 // Chromium and whatever else the entry's own browsers asks for.
 var jobs = [];
 queue.forEach(function (n) {
  var wanted = options.browser ? [options.browser] : ((config[n] && config[n].browsers) || [defaultEngine]);
  wanted.forEach(function (engine) { jobs.push({ name: n, engine: engine }); });
 });

 if (jobs.length) {
  var playwright = requirePlaywright();
  // The launcher is loaded only when an entry needs it, and before any browser starts, so a
  // launcher that is set but wrong stops the run at once. Only Chromium's runs of an entry use it.
  var needsLauncher = jobs.some(function (j) {
   return j.engine == defaultEngine && config[j.name] && config[j.name].auth && !config[j.name].skip;
  });
  var session = {
   chromium: playwright.chromium,
   launcher: needsLauncher ? await loadLauncher() : { api: null, why: "" }
  };
  // Whether anything in this queue is going to be captured decides how the browser is started, so it
  // is worked out before the launch rather than per entry.
  var capturing = options.capture || options.short || queue.some(function (n) {
   return config[n] && config[n].capture === true && !config[n].auth;
  });
  var browsers = {};
  var width = 0;
  jobs.forEach(function (j) {
   var shown = labelOf({ name: j.name, browser: j.engine });
   if (shown.length > width) { width = shown.length; }
  });
  try {
   // Every engine the run needs is started before any entry runs, so an engine that is not installed
   // stops the run at once rather than after an hour of the other one.
   for (var e = 0; e < engines.length; e++) {
    var engine = engines[e];
    if (!jobs.some(function (j) { return j.engine == engine; })) { continue; }
    try {
     browsers[engine] = await launchEngine(playwright, engine, options, capturing);
    } catch (err) {
     for (var launched in browsers) { await browsers[launched].close().catch(function () { }); }
     browsers = {};
     if (err && err.missingEngine) { configError(err.message); }
     throw err;
    }
   }
   for (var i = 0; i < jobs.length; i++) {
    var job = jobs[i];
    var result = await runOne(browsers[job.engine], job.name, config[job.name] || null, session, options, job.engine);
    results.push(result);
    console.log(summaryLine(result, width));
    if (!batch) { printDetail(result); }
   }
  } finally {
   for (var open in browsers) { await browsers[open].close().catch(function () { }); }
  }
  await reportSignIns(session, results);
 }

 var counts = countOf(results);
 if (batch) {
  var dir = writeReport(results, options.mode, started, new Date(), options.browser);
  console.log(tally(counts));
  console.log("report: " + shownPath(dir));
 }
 // A run of one bookmarklet writes this too: a run of one is how an agent checks the fix it has
 // just made, and it is the run that most needs somewhere to read the answer.
 if (counts.failed) {
  console.log("failures: " + shownPath(writeFailureReport(results, options.mode, new Date())));
 }
 process.exit(counts.failed ? exitFailed : exitOk);
}

main().catch(function (err) {
 console.error("test-bm: " + ((err && err.stack) || err));
 process.exit(exitConfig);
});
