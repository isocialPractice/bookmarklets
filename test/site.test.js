// *********************************************************************************************** //
// site.test                                                                                       //
// Check the deployed site: every page its navigation reaches opens, and none of them complains.    //
// *********************************************************************************************** //
// Run with node --test test/site.test.js, which npm run test:site does, and which the scheduled run
// does after the bookmarklets: an unattended job calls npm run test:scheduled and then this, as two
// commands rather than one, so a failing bookmarklet cannot hide a site that is down. It is not in
// npm test, and deliberately: everything npm test reads up to its last stage is in the repository or
// on a fake origin, so the suite needs no network until then, and a reading of a live site never
// could.
//
// What this answers is the one question the rest of the suite cannot. test/gallery.test.js and
// test/install.test.js read the committed files, which is what makes them fast and offline - but
// GitHub Pages serves what it last built, from its own branch, with its own base path. A page that
// is right in the repository and 404 on the site reads as passing everywhere else. So does a
// relative link that resolves beside the file locally and above the base path on the site.
//
// Scope is the navigation: index.html, every example and practice page it links, the pages those
// link in turn, and the install page. A link to another site is reported and never failed on - a
// third party answering an automated request with a 403 is not a defect in this site, and the
// README's own outbound links are not this site's navigation.
//
// A console error is counted only when the script that logged it is the site's own. The examples are
// saved pages carrying a script of their own, and that script is the site's; anything logged from
// another origin is not, and there is nothing here that could fix it.
//
// Nothing answering at all is a failure rather than a skip, unlike a missing sign-in or a missing
// driver elsewhere in this repository. Those are things the run has no way of having; a site that
// does not answer is the thing being checked. A check that passed when the site was down would be
// worth nothing on the one morning it mattered.

var test = require("node:test");
var assert = require("node:assert");
var child = require("node:child_process");
var fs = require("node:fs");
var path = require("node:path");
var playwright = require("playwright");

var root = path.resolve(__dirname, "..");

// The deployed site. The variable is for a run against a branch preview or a local server; without
// it the live site is what is read.
var SITE = process.env._BOOKMARKLETS_SITE_URL || "https://isocialpractice.github.io/bookmarklets/";
var REPO = "isocialPractice/bookmarklets";

// How long to wait for a Pages build that is still running, and how often to ask. A build of this
// site takes about 35 seconds; three minutes is room for a queue in front of it.
var BUILD_WAIT_MS = 180000;
var BUILD_ASK_MS = 10000;

// How many of the site's own pages to open. The site has fifteen; the bound is what stops a link
// loop or an unexpected directory listing turning this into a crawl of GitHub.
var MOST_PAGES = 40;

var base = new URL(SITE.endsWith("/") ? SITE : SITE + "/");

function isThisSite(address) {
 try {
  var at = new URL(address, base);
  return at.origin === base.origin && at.pathname.indexOf(base.pathname) === 0;
 } catch (err) {
  return false;
 }
}

function withoutHash(address) {
 var at = new URL(address, base);
 at.hash = "";
 return at.href;
}

// ----------------------------------------------------------------------------------------------- //
// Waiting for the build
// ----------------------------------------------------------------------------------------------- //

// Pages builds after a push, and the build takes a while, so a run started by the same automation
// that pushed can read the site as it was before. gh is asked what the latest build is doing and the
// run waits while it is still going.
//
// A gh that is not installed, not signed in, or refused is not a failure here: it means this run
// cannot know, and the pages are read as they stand. The note says which happened, because "the site
// was fine" and "the site was a build behind and nobody knew" look identical in a passing run.
function latestBuild() {
 try {
  var said = child.execFileSync("gh", ["api", "repos/" + REPO + "/pages/builds/latest"],
   { encoding: "utf8", timeout: 30000, stdio: ["ignore", "pipe", "pipe"] });
  var read = JSON.parse(said);
  return { status: read.status, commit: read.commit, at: read.updated_at,
   error: read.error && read.error.message };
 } catch (err) {
  return { unknown: String(err.message || err).split("\n")[0] };
 }
}

// The commit in the working tree, for the run's own output.
function headCommit() {
 try {
  return child.execFileSync("git", ["rev-parse", "HEAD"],
   { cwd: root, encoding: "utf8", timeout: 20000, stdio: ["ignore", "pipe", "pipe"] }).trim();
 } catch (err) {
  return null;
 }
}

// Whether the commit Pages last built held this file. Pages serves what it built, so a page added
// since that build is not on the site and is not missing from it either, and the difference is not
// visible from the site at all: a run that has just written a new page would otherwise read it as a
// page the site has lost.
//
// Anything git cannot answer - no git, a build commit this clone does not hold, no build read at
// all - counts the page as owed. That is the direction to be wrong in: a page wrongly read as owed
// fails loudly and is understood in a second, and one wrongly excused is never read again.
function inBuiltCommit(where) {
 if (!build || !build.commit) { return true; }
 try {
  child.execFileSync("git", ["cat-file", "-e", build.commit + ":" + where],
   { cwd: root, timeout: 20000, stdio: ["ignore", "ignore", "ignore"] });
  return true;
 } catch (err) {
  try {
   child.execFileSync("git", ["cat-file", "-e", build.commit + "^{commit}"],
    { cwd: root, timeout: 20000, stdio: ["ignore", "ignore", "ignore"] });
   // The commit is here and the file is not in it, so the page is waiting for a build.
   return false;
  } catch (missing) {
   return true;
  }
 }
}

// Every page of its own the committed gallery links, read from the file rather than from a list kept
// here: a page dropped from the navigation stops being owed by this reading at the same moment it
// stops being reachable, which is the point. install.html is added because the gallery links it and
// because it is a page of the site in its own right.
function owedPages() {
 var owed = {};
 // The comments go first. index.html keeps a commented-out navigation line as the pattern for
 // adding an example, and the page it names has never existed.
 var home = fs.readFileSync(path.join(root, "index.html"), "utf8").replace(/<!--[\s\S]*?-->/g, "");
 var link = /(?:href|src)="([^"]+)"/g;
 var found;
 while ((found = link.exec(home))) {
  var where = found[1];
  if (/^(?:https?:|mailto:|javascript:|#|\/\/)/i.test(where)) { continue; }
  if (!/\.html$/i.test(where)) { continue; }
  owed[where.replace(/^\.\//, "")] = true;
 }
 if (fs.existsSync(path.join(root, "install.html"))) { owed["install.html"] = true; }
 return Object.keys(owed).sort();
}

async function waitForBuild(notes) {
 var build = latestBuild();
 if (build.unknown) {
  notes.push("the Pages build was not asked about: " + build.unknown);
  return build;
 }
 var waited = 0;
 while (build.status === "building" && waited < BUILD_WAIT_MS) {
  await new Promise(function (res) { setTimeout(res, BUILD_ASK_MS); });
  waited += BUILD_ASK_MS;
  build = latestBuild();
  if (build.unknown) {
   notes.push("the Pages build stopped answering after " + (waited / 1000) + "s: " + build.unknown);
   return build;
  }
 }
 notes.push("the Pages build is " + build.status + " at " + String(build.commit).slice(0, 7)
  + ", " + build.at + (waited ? ", waited " + (waited / 1000) + "s for it" : ""));
 return build;
}

// ----------------------------------------------------------------------------------------------- //
// Reading the site
// ----------------------------------------------------------------------------------------------- //

// Every link the page carries, and whether the page itself says anything. The frame on the gallery
// is followed as a page of its own, since its example is what a reader is actually looking at.
function readLinks() {
 return {
  title: document.title,
  links: Array.prototype.slice.call(document.querySelectorAll("a[href]")).map(function (a) {
   return { href: a.href, text: (a.textContent || "").replace(/\s+/g, " ").trim(),
    // A link in a generated table row, which the install page has one of per bookmarklet. The
    // drag link holds a whole bookmarklet as its address and is not a link to anywhere; the three
    // beside it are the README, the gist and the raw file, with a fourth to the short where there
    // is one, and node ._bookmarklet.js verify --online checks the raw ones for every bookmarklet
    // at once. Reading 168 of them from here every morning would say nothing new and ask a great
    // deal of GitHub.
    generated: !!a.closest("td[data-label]") };
  }),
  frames: Array.prototype.slice.call(document.querySelectorAll("iframe[src]")).map(function (f) {
   return f.src;
  }),
  headings: Array.prototype.slice.call(document.querySelectorAll("h1")).length
 };
}

// One page of the site, opened and read: the status it answered with, anything its own scripts said,
// and anything of its own it failed to fetch.
async function openPage(context, address) {
 var page = await context.newPage();
 var said = [];
 var failed = [];
 page.on("console", function (message) {
  if (message.type() !== "error") { return; }
  var at = (message.location() && message.location().url) || "";
  // Only the site's own scripts. An error logged by something on another origin is not this
  // repository's to answer for, and an error with no location at all is kept, since a page that
  // throws before its script has a URL is the site's own problem.
  if (!at || isThisSite(at)) { said.push(message.text()); }
 });
 page.on("pageerror", function (err) { said.push("threw: " + String(err).split("\n")[0]); });
 page.on("requestfailed", function (request) {
  if (isThisSite(request.url())) {
   failed.push(request.url() + ": " + ((request.failure() || {}).errorText || "failed"));
  }
 });
 var answers = [];
 page.on("response", function (response) {
  if (isThisSite(response.url()) && response.status() >= 400) {
   answers.push(response.url() + ": " + response.status());
  }
 });

 var read = { at: address, status: null, error: null, said: said, failed: failed,
  answers: answers, links: [], frames: [], title: "" };
 try {
  var answer = await page.goto(address, { waitUntil: "load", timeout: 45000 });
  read.status = answer ? answer.status() : null;
  // The gallery sizes its frame from the example inside it, and the examples run a script half a
  // second in. A second is enough for both, and nothing here waits on a network idle that an
  // embedded frame keeps busy.
  await page.waitForTimeout(1000);
  var found = await page.evaluate(readLinks);
  read.title = found.title;
  read.links = found.links;
  read.frames = found.frames;
  read.headings = found.headings;
 } catch (err) {
  read.error = String(err.message || err).split("\n")[0];
 }
 await page.close();
 return read;
}

// ----------------------------------------------------------------------------------------------- //
// Tests
// ----------------------------------------------------------------------------------------------- //

var notes = [];
var build = null;
var head = null;
var pages = {};
var outbound = {};

test.before(async function () {
 head = headCommit();
 build = await waitForBuild(notes);
 notes.push(head ? "the working tree is at " + head.slice(0, 7)
  : "the working tree's commit could not be read, so every page is read as owed");

 var browser = await playwright.chromium.launch();
 try {
  var context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  var queue = [base.href];
  var seen = {};
  while (queue.length && Object.keys(pages).length < MOST_PAGES) {
   var address = queue.shift();
   if (seen[address]) { continue; }
   seen[address] = true;
   var read = await openPage(context, address);
   pages[address] = read;
   // Only what the site's own navigation reaches, one page at a time outward from the gallery.
   read.frames.concat(read.links.map(function (link) { return link.href; }))
    .forEach(function (href) {
     if (!isThisSite(href)) { return; }
     var without = withoutHash(href);
     if (!seen[without] && queue.indexOf(without) < 0) { queue.push(without); }
    });
   read.links.forEach(function (link) {
    if (isThisSite(link.href) || link.generated) { return; }
    // A javascript: address is a bookmarklet, not a link to anywhere, and there is nothing to ask
    // of it. So is a mailto: or any other scheme that is not the web.
    if (!/^https?:\/\//i.test(link.href)) { return; }
    outbound[link.href] = outbound[link.href] || { from: [], text: link.text };
    if (outbound[link.href].from.indexOf(address) < 0) { outbound[link.href].from.push(address); }
   });
  }
  await context.close();
 } finally {
  await browser.close();
 }

 notes.push("read " + Object.keys(pages).length + " page(s) of the site and found "
  + Object.keys(outbound).length + " link(s) to other sites");
 notes.forEach(function (said) { console.log("site: " + said); });
});

test("the site answers, and the gallery is the page it serves", function () {
 var home = pages[base.href];
 assert.ok(home, "the site's own address was never read");
 assert.strictEqual(home.error, null, base.href + " could not be opened: " + home.error
  + ". Either the site is down or this machine has no route to it, and a check that passed on "
  + "either would be worth nothing.");
 assert.strictEqual(home.status, 200, base.href + " answered " + home.status);
 assert.ok(/Bookmarklet/i.test(home.title), "the gallery's title reads "
  + JSON.stringify(home.title));
 assert.ok(home.links.length > 10, "the gallery carries " + home.links.length + " links, which is "
  + "too few to be the page with the examples and the practice pages on it");
});

test("every page the navigation reaches opens", function () {
 var broken = Object.keys(pages).filter(function (at) {
  return pages[at].error || pages[at].status !== 200;
 }).map(function (at) {
  return at + " -> " + (pages[at].error || pages[at].status);
 });
 assert.deepStrictEqual(broken, [], "pages the site links and does not serve. A page right in the "
  + "repository and missing here is a page Pages has not built, or one whose link resolves above "
  + "the site's base path.");
 assert.ok(Object.keys(pages).length < MOST_PAGES, "the crawl stopped at its bound of " + MOST_PAGES
  + " pages, so something on the site links further than its own navigation and this reading is "
  + "incomplete");
});

test("every page the committed gallery links is on the site", function () {
 var owed = owedPages();
 assert.ok(owed.length >= 14, "the committed index.html links " + owed.length + " pages of its "
  + "own, which is fewer than the five examples and the nine practice pages it is meant to");
 var missing = owed.filter(function (where) {
  var read = pages[new URL(where, base).href];
  return !read || read.status !== 200;
 });
 // A page the built commit never held is waiting for a build, not missing from the site.
 var waiting = missing.filter(function (where) { return !inBuiltCommit(where); });
 waiting.forEach(function (where) {
  console.log("site: " + where + " is not on the site and is not in "
   + String(build && build.commit).slice(0, 7) + ", the commit Pages built, so it is waiting for "
   + "a build of the working tree at " + String(head).slice(0, 7) + " rather than missing");
 });
 var gone = missing.filter(function (where) { return waiting.indexOf(where) < 0; });
 assert.deepStrictEqual(gone, [], "the committed gallery links these from its navigation, the "
  + "commit Pages built held them, and the site does not serve them");
});

test("nothing of the site's own failed to load, on any page it serves", function () {
 var trouble = [];
 Object.keys(pages).forEach(function (at) {
  pages[at].failed.forEach(function (said) { trouble.push(at + ": " + said); });
  pages[at].answers.forEach(function (said) { trouble.push(at + ": " + said); });
 });
 assert.deepStrictEqual(trouble, [], "a page of the site asked for something of the site's own and "
  + "did not get it - a stylesheet, an image or a frame that is in the repository and not on the "
  + "site, or named by a path that resolves differently here");
});

test("no page of the site logs an error of its own", function () {
 var noisy = [];
 Object.keys(pages).forEach(function (at) {
  pages[at].said.forEach(function (said) { noisy.push(at + ": " + said); });
 });
 assert.deepStrictEqual(noisy, [], "the site's own scripts should run quietly on the site. Only "
  + "errors logged from this site's own addresses are counted here, so nothing in this list "
  + "belongs to anybody else.");
});

// Reported, never failed on. A site that answers an automated request with a 403 or a redirect to a
// consent page is behaving normally towards a robot, and nothing in this repository can change it.
// What this is for is a link that has rotted: it goes in the run's output for a person to read.
test("the links to other sites are reported", async function () {
 var addresses = Object.keys(outbound);
 if (!addresses.length) {
  console.log("site: no links to other sites were found, which is itself worth a look");
  return;
 }
 var browser = await playwright.chromium.launch();
 try {
  var context = await browser.newContext();
  for (var i = 0; i < addresses.length; i++) {
   var address = addresses[i];
   var answer = null;
   try {
    var got = await context.request.get(address, { timeout: 20000, maxRedirects: 5 });
    answer = got.status();
   } catch (err) {
    answer = String(err.message || err).split("\n")[0];
   }
   console.log("site: " + (answer === 200 ? "ok  " : "see ") + answer + "  " + address
    + "  (from " + outbound[address].from.length + " page(s))");
  }
  await context.close();
 } finally {
  await browser.close();
 }
});
