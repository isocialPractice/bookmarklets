// *********************************************************************************************** //
// harness.test                                                                                    //
// Check test-bm.js against bookmarklets whose verdict is known before the run starts.             //
// *********************************************************************************************** //
// Run with node --test test/harness.test.js, which npm test does ahead of the bookmarklets
// themselves. The file is named rather than discovered on purpose: node --test treats every .js
// file under a folder called test as a test file, and test/fixtures/bookmarklets holds fourteen that
// are bookmarklets.
//
// No run here ever reaches a real sign-in or the everyday browser. Every run clears
// TEST_BM_AUTH_LAUNCHER and _TEST_BM_EVERYDAY_DRIVER unless the test sets one, and the tests that set
// one point it at a stub written into the temporary folder, which signs in to nothing and opens
// nothing.
//
// Each fixture under test/fixtures/bookmarklets carries one defect, or none, and the assertions
// below are the verdict and the reason test-bm.js gives for it. TEST_BM_JS_DIR and TEST_BM_CONFIG
// point the harness at those fixtures, so what is checked here is the harness itself rather than a
// copy of its reasoning.
//
// The reasons are matched on the part test-bm.js writes, not on the part V8 writes. "Unexpected
// token" is V8's wording and changes with Chromium; "does not parse on one line" is the harness's
// and does not.

var test = require("node:test");
var assert = require("node:assert");
var child = require("node:child_process");
var fs = require("node:fs");
var os = require("node:os");
var path = require("node:path");

var rootDir = path.join(__dirname, "..");
var jsDir = path.join("test", "fixtures", "bookmarklets");
var configFile = path.join("test", "fixtures", "test-bm.json");

// One run of every fixture, shared by the assertions below. A browser launch is the slow part, so
// the suite pays for one rather than one per fixture.
var report = null;

function runHarness(args, env) {
 var answer = child.spawnSync(process.execPath, ["test-bm.js"].concat(args), {
  cwd: rootDir,
  encoding: "utf8",
  env: Object.assign({}, process.env, { TEST_BM_AUTH_LAUNCHER: "", _TEST_BM_EVERYDAY_DRIVER: "" }, env || {})
 });
 return { status: answer.status, out: String(answer.stdout || ""), err: String(answer.stderr || "") };
}

function fixtureEnv(config) {
 return { TEST_BM_JS_DIR: jsDir, TEST_BM_CONFIG: config || configFile };
}

function readReport() {
 if (report) { return report; }
 var run = runHarness(["--all"], fixtureEnv());
 var named = /^report: (.+)$/m.exec(run.out);
 assert.ok(named, "the run should name the report it wrote:\n" + run.out + run.err);
 var file = path.join(rootDir, named[1].replace(/\//g, path.sep), "report.json");
 report = JSON.parse(fs.readFileSync(file, "utf8"));
 report.run = run;
 return report;
}

function resultFor(name) {
 var found = readReport().results.filter(function (r) { return r.name === name; });
 assert.strictEqual(found.length, 1, name + " should appear once in the report");
 return found[0];
}

// ----------------------------------------------------------------------------------------------- //
// The run as a whole
// ----------------------------------------------------------------------------------------------- //

test("every fixture is listed, and none of them needs a browser to be listed", function () {
 var run = runHarness(["--list"], fixtureEnv());
 assert.strictEqual(run.status, 0, run.err);
 assert.match(run.out, /14 bookmarklets, 14 configured, 0 scheduled, 1 signed in/);
 assert.match(run.out, /fixture:article\.html/);
 assert.match(run.out, /fixture_Auth_MarksTheSignedInPage\s+signed in\s+fixture:article\.html  auth fixture-site/);
});

test("a run of the fixtures ends in failure, because eight of them are meant to fail", function () {
 var counts = readReport().counts;
 assert.strictEqual(counts.run, 14);
 assert.strictEqual(counts.passed, 5);
 assert.strictEqual(counts.failed, 8);
 assert.strictEqual(counts.skipped, 1);
 assert.strictEqual(readReport().run.status, 1, "a failed run exits 1");
});

// ----------------------------------------------------------------------------------------------- //
// One fixture, one verdict
// ----------------------------------------------------------------------------------------------- //

test("a bookmarklet that works passes, and a second run of it undoes the first", function () {
 var result = resultFor("fixture_Pass_AddsAPanel");
 assert.strictEqual(result.verdict, "pass");
 assert.strictEqual(result.reason, "");
 assert.strictEqual(result.errors.length, 0);
 assert.match(result.notes.join("\n"), /one line: \d+ characters with the breaks taken out/);
});

test("a bookmarklet that throws fails, and the reason names the line it threw at", function () {
 var result = resultFor("fixture_Throw_ReadsAMissingThing");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^the bookmarklet threw: /);
 assert.match(result.reason, /\(line 4\)$/);
});

test("a line comment fails the parse, and the reason names the line it starts on", function () {
 var result = resultFor("fixture_Comment_LineCommentSwallowsIt");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^does not parse on one line: /);
 assert.match(result.reason, /\(line 5 starts with a line comment, which swallows everything after it on one line\)$/);
});

test("a percent escape fails once it is decoded, and the reason names the line holding it", function () {
 var result = resultFor("fixture_Percent_ModuloSixteen");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^a percent escape on line 6 decodes into the code when the URL field reads it/);
 assert.match(result.reason, /the %16 in i%16 becomes a control character/);
});

test("a missing semicolon fails both joins, and the reason names no junction and no comment", function () {
 var result = resultFor("fixture_Semicolon_MissingBetweenTwoLines");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^does not parse on one line: /);
 assert.doesNotMatch(result.reason, /line comment/);
 assert.doesNotMatch(result.reason, /runs into the line below/);
});

test("a line that runs into the one below it is named, with what a bookmarks bar does to it", function () {
 var result = resultFor("fixture_Junction_RunsIntoTheLineBelow");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^line 7 runs into the line below it once the line break is taken out/);
 assert.match(result.reason, /which is what a bookmarks bar does: /);
});

test("the page's own errors are recorded against the page, and the bookmarklet still passes", function () {
 var result = resultFor("fixture_PageNoise_PageLogsItsOwnError");
 assert.strictEqual(result.verdict, "pass");
 assert.strictEqual(result.reason, "");

 var fromPage = result.errors.filter(function (e) { return e.from === "page"; });
 assert.strictEqual(fromPage.length, 1, "the page's uncaught error should be recorded once");
 assert.match(fromPage[0].message, /an uncaught error of the page/);
 assert.strictEqual(result.errors.filter(function (e) { return e.from === "bookmarklet"; }).length, 0);

 var logged = result.console.filter(function (c) { return c.type === "error"; });
 assert.ok(logged.length >= 1, "the page's console error should be recorded");
 assert.ok(logged.some(function (c) { return /a console error of the page/.test(c.text); }),
  "the page's console error should be the one recorded: " + JSON.stringify(result.console));
});

// ----------------------------------------------------------------------------------------------- //
// Nothing that could pass for malicious
// ----------------------------------------------------------------------------------------------- //

test("a bookmarklet that touches the page's cookies is refused before any browser starts", function () {
 var result = resultFor("fixture_Cookie_ReadsTheCookies");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^unsafe: it touches document\.cookie, and a bookmarklet never reads or writes cookies$/);
 assert.strictEqual(result.url, "", "a refused file never reaches a page");
});

test("a bookmarklet that runs a string as code is refused before any browser starts", function () {
 var result = resultFor("fixture_Eval_RunsAString");
 assert.strictEqual(result.verdict, "fail");
 assert.strictEqual(result.reason, "unsafe: it runs a string as code with eval()");
});

test("a request the bookmarklet sends to another host fails the entry, named by its host", function () {
 var result = resultFor("fixture_Network_SendsToAnotherHost");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^sends a request to ping\.collector\.invalid, a host other than the page's own - /);
 assert.doesNotMatch(result.reason, /fixtures\.test\/article/, "the reason names the host, not the address it carried");
});

function runDeclaring(host) {
 var named = path.join(os.tmpdir(), "test-bm-network-named-" + process.pid + ".json");
 fs.writeFileSync(named, JSON.stringify({
  fixture_Network_SendsToAnotherHost: {
   url: "fixture:article.html",
   network: [{ host: host, reason: "a fixture showing a named host is allowed" }]
  }
 }));
 try {
  return runHarness(["fixture_Network_SendsToAnotherHost"], fixtureEnv(named));
 } finally {
  fs.rmSync(named, { force: true });
 }
}

test("a host the entry names in network, with its reason, is allowed", function () {
 var run = runDeclaring("ping.collector.invalid");
 assert.strictEqual(run.status, 0, run.out + run.err);
 assert.match(run.out, /fixture_Network_SendsToAnotherHost\s+pass/);
});

test("*. and a domain allows any of its subdomains, and only those", function () {
 var wide = runDeclaring("*.collector.invalid");
 assert.strictEqual(wide.status, 0, wide.out + wide.err);
 var other = runDeclaring("*.elsewhere.invalid");
 assert.strictEqual(other.status, 1, other.out + other.err);
 assert.match(other.out, /sends a request to ping\.collector\.invalid/);
});

test("a host named in network without its reason is a configuration error", function () {
 var bad = path.join(os.tmpdir(), "test-bm-network-unreasoned-" + process.pid + ".json");
 fs.writeFileSync(bad, JSON.stringify({ fixture_Network_SendsToAnotherHost: { network: [{ host: "ping.collector.invalid" }] } }));
 try {
  var run = runHarness(["--list"], fixtureEnv(bad));
  assert.strictEqual(run.status, 2, "a configuration error exits 2");
  assert.match(run.err, /network 1: a host is named only with the reason it is needed/);
 } finally {
  fs.rmSync(bad, { force: true });
 }
});

test("a <script> loaded by its src without an integrity hash is refused", function () {
 var js = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-unpinned-"));
 fs.writeFileSync(path.join(js, "fixture_Script_LoadsUnpinned.js"), [
  "javascript:(function() {",
  " /* loads a library from a cdn with nothing pinning the file that runs */",
  " var scriptFixtureScriptLoadsUnpinned = document.createElement(\"script\");",
  " scriptFixtureScriptLoadsUnpinned.src = \"https://cdn.invalid/library.js\";",
  " document.head.appendChild(scriptFixtureScriptLoadsUnpinned);",
  "})();"
 ].join("\n"));
 fs.writeFileSync(path.join(js, "test-bm.json"), "{}");
 try {
  var run = runHarness(["fixture_Script_LoadsUnpinned"], { TEST_BM_JS_DIR: js, TEST_BM_CONFIG: path.join(js, "test-bm.json") });
  assert.strictEqual(run.status, 1, run.out + run.err);
  assert.match(run.out, /unsafe: it loads a <script> by its src with no integrity hash/);
 } finally {
  removeDir(js);
 }
});

// ----------------------------------------------------------------------------------------------- //
// The fixture pages
// ----------------------------------------------------------------------------------------------- //

test("a fixture page is served from an origin, so local storage and location work on it", function () {
 var result = resultFor("fixture_Origin_UsesStorageAndLocation");
 assert.strictEqual(result.verdict, "pass");
 assert.strictEqual(result.url, "https://fixtures.test/self-test-noisy.html");
});

test("a run can make a selection, and can say where the page ended up", function () {
 var result = resultFor("fixture_Selection_AnchorsTheSelection");
 assert.strictEqual(result.verdict, "pass");
 assert.strictEqual(result.reason, "");
});

test("a run can say where a new tab the bookmarklet opened went, served from the fixture origin", function () {
 var result = resultFor("fixture_Popup_OpensANewTab");
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.deepStrictEqual(result.popups, [{ url: "https://fixtures.test/table.html" }]);
});

test("a fixture url naming a page that is not there is a configuration error", function () {
 var bad = path.join(os.tmpdir(), "test-bm-missing-fixture-" + process.pid + ".json");
 fs.writeFileSync(bad, JSON.stringify({ fixture_Pass_AddsAPanel: { url: "fixture:nothing-by-this-name.html" } }));
 try {
  var run = runHarness(["--list"], fixtureEnv(bad));
  assert.strictEqual(run.status, 2, "a configuration error exits 2");
  assert.match(run.err, /there is no test\/fixtures\/pages\/nothing-by-this-name\.html/);
 } finally {
  fs.rmSync(bad, { force: true });
 }
});

test("a fixture url reaching outside the fixture pages is a configuration error", function () {
 var bad = path.join(os.tmpdir(), "test-bm-escaping-fixture-" + process.pid + ".json");
 fs.writeFileSync(bad, JSON.stringify({ fixture_Pass_AddsAPanel: { url: "fixture:../../../package.json" } }));
 try {
  var run = runHarness(["--list"], fixtureEnv(bad));
  assert.strictEqual(run.status, 2, "a configuration error exits 2");
  assert.match(run.err, /reaches outside test\/fixtures\/pages/);
 } finally {
  fs.rmSync(bad, { force: true });
 }
});

// ----------------------------------------------------------------------------------------------- //
// Signed-in sites
// ----------------------------------------------------------------------------------------------- //

// A stand-in for the maintainer's sign-in launcher. It signs in to nothing: for the two sites it
// knows it opens a fresh headless browser on a profile of its own, and it writes down what the
// harness tells it so the assertions can read it back. It is written into the temporary folder
// because the harness refuses a launcher inside the repository.
var stubSource = [
 "import fs from \"node:fs\";",
 "import path from \"node:path\";",
 "import { fileURLToPath } from \"node:url\";",
 "var here = path.dirname(fileURLToPath(import.meta.url));",
 "var known = [\"fixture-site\", \"fixture-signed-out\"];",
 "export async function launch(options) {",
 " if (known.indexOf(options.site) < 0) { return null; }",
 " var profile = fs.mkdtempSync(path.join(here, \"profile-\"));",
 " return options.chromium.launchPersistentContext(profile, { headless: true, recordVideo: options.recordVideo });",
 "}",
 "export async function signIn(options) { fs.writeFileSync(path.join(here, \"signed-in.txt\"), options.site); }",
 "export async function signInState(states) { fs.writeFileSync(path.join(here, \"states.json\"), JSON.stringify(states)); }"
].join("\n") + "\n";

function makeStub() {
 var dir = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-stub-launcher-"));
 var file = path.join(dir, "stub-launcher.mjs");
 fs.writeFileSync(file, stubSource);
 return { dir: dir, file: file };
}

function removeDir(dir) {
 fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

var markSelector = "#mark--__-unlikely_-_name-__--fixtureAuthMarksTheSignedInPage";

// One entry per thing a signed-in run must do, each a copy of the same fixture bookmarklet, run
// together through the stub so the suite pays for one harness run rather than five.
var authScenarios = {
 fixture_Auth_Passes: {
  url: "fixture:article.html", auth: "fixture-site", signedIn: "main",
  steps: [{ run: true }, { expect: { selector: markSelector, text: "the signed-in fixture ran" } }]
 },
 fixture_Auth_SignedOut: {
  url: "fixture:article.html", auth: "fixture-signed-out", signedIn: "#no-such-account-menu",
  timeout: 3000, settle: 2000
 },
 fixture_Auth_Refused: {
  url: "fixture:form.html", auth: "fixture-site", signedIn: "form",
  steps: [{ fill: "#name", value: "Bob" }]
 },
 fixture_Auth_NoSignIn: {
  url: "fixture:article.html", auth: "fixture-unknown", signedIn: "main"
 },
 fixture_Auth_KeepsThePageOut: {
  url: "fixture:self-test-noisy.html", auth: "fixture-site", signedIn: "#target", settle: 1000,
  steps: [{ run: true }, { expect: { selector: "#target", text: "words the page never says" } }]
 }
};

var authRun = null;

function authReport() {
 if (authRun) { return authRun; }
 var stub = makeStub();
 var js = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-auth-fixtures-"));
 try {
  var source = fs.readFileSync(path.join(rootDir, jsDir, "fixture_Auth_MarksTheSignedInPage.js"));
  Object.keys(authScenarios).forEach(function (name) { fs.writeFileSync(path.join(js, name + ".js"), source); });
  var config = path.join(js, "test-bm.json");
  fs.writeFileSync(config, JSON.stringify(authScenarios));
  var run = runHarness(["--all"], { TEST_BM_JS_DIR: js, TEST_BM_CONFIG: config, TEST_BM_AUTH_LAUNCHER: stub.file });
  var named = /^report: (.+)$/m.exec(run.out);
  assert.ok(named, "the signed-in run should name the report it wrote:\n" + run.out + run.err);
  var file = path.join(rootDir, named[1].replace(/\//g, path.sep), "report.json");
  var statesFile = path.join(stub.dir, "states.json");
  authRun = {
   run: run,
   report: JSON.parse(fs.readFileSync(file, "utf8")),
   states: fs.existsSync(statesFile) ? JSON.parse(fs.readFileSync(statesFile, "utf8")) : null
  };
  return authRun;
 } finally {
  removeDir(stub.dir);
  removeDir(js);
 }
}

function authResult(name) {
 var found = authReport().report.results.filter(function (r) { return r.name === name; });
 assert.strictEqual(found.length, 1, name + " should appear once in the signed-in report");
 return found[0];
}

test("an entry with auth is a skip, never a failure, when no sign-in launcher is set", function () {
 var result = resultFor("fixture_Auth_MarksTheSignedInPage");
 assert.strictEqual(result.verdict, "skip");
 assert.strictEqual(result.reason, "no sign-in launcher: TEST_BM_AUTH_LAUNCHER is not set");
 assert.strictEqual(result.auth, "fixture-site");
});

test("an entry with auth runs on the context the launcher returns, and passes", function () {
 var result = authResult("fixture_Auth_Passes");
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.strictEqual(result.signedIn, true);
});

test("a page without its signedIn selector is a signed-out skip, not a site-changed failure", function () {
 var result = authResult("fixture_Auth_SignedOut");
 assert.strictEqual(result.verdict, "skip");
 assert.strictEqual(result.reason, "signed out of fixture-signed-out: #no-such-account-menu is not on the page");
 assert.strictEqual(result.signedIn, false);
});

test("a fill aimed at a form on a signed-in page is refused before it types", function () {
 var result = authResult("fixture_Auth_Refused");
 assert.strictEqual(result.verdict, "fail");
 assert.strictEqual(result.reason, "refused: step 1 would type into a form on a signed-in page");
});

test("a launcher with no sign-in for the site makes the entry a skip", function () {
 var result = authResult("fixture_Auth_NoSignIn");
 assert.strictEqual(result.verdict, "skip");
 assert.strictEqual(result.reason, "the sign-in launcher has no sign-in for fixture-unknown");
 assert.strictEqual(result.signedIn, undefined, "a site never reached is neither signed in nor out");
});

test("a signed-in page's own words are counted and never written down", function () {
 var result = authResult("fixture_Auth_KeepsThePageOut");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^step 2: #target reads \(not recorded on a signed-in page\), which does not hold "words the page never says"$/);
 assert.doesNotMatch(JSON.stringify(result), /A paragraph for a bookmarklet to change|a console error of the page|an uncaught error of the page/);
 assert.strictEqual(result.console.length, 0);
 assert.strictEqual(result.errors.filter(function (e) { return e.from === "page"; }).length, 0);
 assert.ok(result.withheld.console >= 1, "the page's console error should be counted: " + JSON.stringify(result.withheld));
 assert.ok(result.withheld.pageErrors >= 1, "the page's uncaught error should be counted: " + JSON.stringify(result.withheld));
});

test("the launcher hears once, at the end, which sites were found signed in", function () {
 assert.deepStrictEqual(authReport().states, { "fixture-site": true, "fixture-signed-out": false });
});

test("an entry with auth names signedIn and a plain site name, and is never scheduled", function () {
 var bad = path.join(os.tmpdir(), "test-bm-auth-config-" + process.pid + ".json");
 fs.writeFileSync(bad, JSON.stringify({
  fixture_Pass_AddsAPanel: { auth: "fixture-site", signedIn: "main", scheduled: true },
  fixture_Throw_ReadsAMissingThing: { auth: "fixture-site" },
  fixture_Comment_LineCommentSwallowsIt: { signedIn: "main" },
  fixture_Percent_ModuloSixteen: { auth: "Fixture Site", signedIn: "main" }
 }));
 try {
  var run = runHarness(["--list"], fixtureEnv(bad));
  assert.strictEqual(run.status, 2, "a configuration error exits 2");
  assert.match(run.err, /fixture_Pass_AddsAPanel: an entry with auth is never scheduled/);
  assert.match(run.err, /fixture_Throw_ReadsAMissingThing: an entry with auth names signedIn/);
  assert.match(run.err, /fixture_Comment_LineCommentSwallowsIt: signedIn goes with auth/);
  assert.match(run.err, /fixture_Percent_ModuloSixteen: auth takes a site name/);
 } finally {
  fs.rmSync(bad, { force: true });
 }
});

test("a launcher inside the repository, or named by a relative path, is refused before any browser starts", function () {
 var inside = runHarness(["fixture_Auth_MarksTheSignedInPage"],
  Object.assign(fixtureEnv(), { TEST_BM_AUTH_LAUNCHER: path.join(rootDir, "test", "harness.test.js") }));
 assert.strictEqual(inside.status, 2, inside.out + inside.err);
 assert.match(inside.err, /TEST_BM_AUTH_LAUNCHER must name a file outside the repository/);

 var relative = runHarness(["fixture_Auth_MarksTheSignedInPage"],
  Object.assign(fixtureEnv(), { TEST_BM_AUTH_LAUNCHER: "launcher.mjs" }));
 assert.strictEqual(relative.status, 2, relative.out + relative.err);
 assert.match(relative.err, /TEST_BM_AUTH_LAUNCHER must be an absolute path/);
});

test("--sign-in hands the launcher the site name and nothing else, and needs a launcher to do it", function () {
 var stub = makeStub();
 try {
  var run = runHarness(["--sign-in", "fixture-site"], { TEST_BM_AUTH_LAUNCHER: stub.file });
  assert.strictEqual(run.status, 0, run.err);
  assert.match(run.out, /the sign-in launcher opened fixture-site/);
  assert.strictEqual(fs.readFileSync(path.join(stub.dir, "signed-in.txt"), "utf8"), "fixture-site");

  var unset = runHarness(["--sign-in", "fixture-site"], {});
  assert.strictEqual(unset.status, 2);
  assert.match(unset.err, /no sign-in launcher: TEST_BM_AUTH_LAUNCHER is not set/);

  var odd = runHarness(["--sign-in", "Fixture Site"], { TEST_BM_AUTH_LAUNCHER: stub.file });
  assert.strictEqual(odd.status, 2);
  assert.match(odd.err, /--sign-in takes a site name of lower-case letters/);
 } finally {
  removeDir(stub.dir);
 }
});

// ----------------------------------------------------------------------------------------------- //
// Capturing an entry
// ----------------------------------------------------------------------------------------------- //

// One fixture, copied under as many names as the run needs entries, with a configuration of its own.
// It keeps these runs away from the shared fourteen, whose counts the assertions above pin down.
// A run of entries nothing else shares, each a copy of one bookmarklet written under the entry's own
// name. The bookmarklet is the passing fixture unless a test hands over its own source, which is how
// a test that needs a particular shape of bookmarklet - one that works asynchronously, say - gets one
// without adding a fifteenth file to test/fixtures/bookmarklets for every other test to count.
function runApart(entries, args, env, source) {
 var js = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-apart-"));
 if (source === undefined) { source = fs.readFileSync(path.join(rootDir, jsDir, "fixture_Pass_AddsAPanel.js")); }
 try {
  Object.keys(entries).forEach(function (name) { fs.writeFileSync(path.join(js, name + ".js"), source); });
  var config = path.join(js, "test-bm.json");
  fs.writeFileSync(config, JSON.stringify(entries));
  var run = runHarness(args, Object.assign({ TEST_BM_JS_DIR: js, TEST_BM_CONFIG: config }, env || {}));
  var named = /^report: (.+)$/m.exec(run.out);
  var report = null;
  if (named) {
   report = JSON.parse(fs.readFileSync(path.join(rootDir, named[1].replace(/\//g, path.sep), "report.json"), "utf8"));
  }
  return { run: run, report: report };
 } finally {
  removeDir(js);
 }
}

function onlyResult(answer) {
 assert.ok(answer.report, "the run should have written a report:\n" + answer.run.out + answer.run.err);
 assert.strictEqual(answer.report.results.length, 1);
 return answer.report.results[0];
}

var panelSelector = "#panel--__-unlikely_-_name-__--fixturePassAddsAPanel";

test("a captured entry writes a screenshot either side of the bookmarklet, and a video of the whole entry", function () {
 var answer = runApart({
  fixture_Capture_Captured: { url: "fixture:article.html", capture: true, steps: [{ run: true }] }
 }, ["--all"]);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.ok(result.capture, "a captured entry should carry its artifacts in the report");

 assert.deepStrictEqual(result.capture.screenshots.map(function (s) { return s.what; }), ["before", "after"]);
 result.capture.screenshots.forEach(function (s) {
  assert.ok(fs.existsSync(path.join(rootDir, s.file)), "there should be a file at " + s.file);
  assert.ok(fs.statSync(path.join(rootDir, s.file)).size > 0, s.file + " should not be empty");
  assert.ok(typeof s.at === "number" && s.at >= 0, "a screenshot carries its offset into the video");
 });

 assert.match(result.capture.video, /capture\/fixture_Capture_Captured\/entry\.webm$/);
 assert.ok(fs.statSync(path.join(rootDir, result.capture.video)).size > 0, "the video should not be empty");
});

test("the report says where in the video every step started, so a clip can be cut to the run", function () {
 var answer = runApart({
  fixture_Capture_Timed: {
   url: "fixture:article.html",
   capture: true,
   steps: [{ wait: 400 }, { run: true }, { expect: { selector: panelSelector, count: 1 } }]
  }
 }, ["--all"]);
 var timeline = onlyResult(answer).capture.timeline;
 assert.deepStrictEqual(timeline.map(function (t) { return t.what; }), [
  "open https://fixtures.test/article.html",
  "step 1: wait 400",
  "step 2: run",
  "the bookmarklet runs",
  "step 3: expect",
  "the result is on screen"
 ]);
 for (var i = 1; i < timeline.length; i++) {
  assert.ok(timeline[i].at >= timeline[i - 1].at, "the offsets should run forwards: " + JSON.stringify(timeline));
 }
 var ran = timeline.filter(function (t) { return t.what === "the bookmarklet runs"; })[0];
 assert.ok(ran.at >= 400, "the bookmarklet ran after the wait, so its offset is past it: " + ran.at);
});

test("a bookmarklet an entry runs twice gets a numbered pair of screenshots for the second run", function () {
 var answer = runApart({
  fixture_Capture_Twice: { url: "fixture:article.html", capture: true, steps: [{ run: true }, { run: true }] }
 }, ["--all"]);
 assert.deepStrictEqual(onlyResult(answer).capture.screenshots.map(function (s) { return s.what; }),
  ["before", "after", "before-2", "after-2"]);
});

// A bookmarklet whose work lands after the injection call has returned, which is every bookmarklet
// that fetches something or waits for the page to settle. Nothing on the page says it ran until the
// timer fires, so the after shot taken at the old moment was the before shot again.
var lateFixture = [
 "javascript:(function() {",
 " /* A fixture that paints nothing until a wait has passed, so the two shots of it differ only if",
 "    the after one was taken once the entry's steps had run. */",
 " var idFixtureLatePaintsAfterAWait = \"panel--__-unlikely_-_name-__--fixtureLatePaintsAfterAWait\";",
 " setTimeout(function() {",
 "  var panelFixtureLatePaintsAfterAWait = document.createElement(\"div\");",
 "  panelFixtureLatePaintsAfterAWait.id = idFixtureLatePaintsAfterAWait;",
 "  panelFixtureLatePaintsAfterAWait.textContent = \"the fixture ran\";",
 "  panelFixtureLatePaintsAfterAWait.style.setProperty(\"position\", \"fixed\");",
 "  panelFixtureLatePaintsAfterAWait.style.setProperty(\"inset\", \"0\");",
 "  panelFixtureLatePaintsAfterAWait.style.setProperty(\"background\", \"#0b4f9c\");",
 "  document.body.appendChild(panelFixtureLatePaintsAfterAWait);",
 " }, 600);",
 "})();"
].join("\n");

var lateSelector = "#panel--__-unlikely_-_name-__--fixtureLatePaintsAfterAWait";

test("the after shot waits for the entry's steps, so a bookmarklet that works late is in it", function () {
 var answer = runApart({
  fixture_Late_PaintsAfterAWait: {
   url: "fixture:article.html",
   capture: true,
   steps: [{ run: true }, { wait: 1200 }, { expect: { selector: lateSelector, count: 1 } }]
  }
 }, ["--all"], null, lateFixture);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
 var shots = result.capture.screenshots;
 assert.deepStrictEqual(shots.map(function (s) { return s.what; }), ["before", "after"]);
 var before = fs.readFileSync(path.join(rootDir, shots[0].file));
 var after = fs.readFileSync(path.join(rootDir, shots[1].file));
 assert.ok(!before.equals(after), "the after shot should show what the bookmarklet did, not the page before it");
 assert.ok(shots[1].at - shots[0].at >= 600,
  "the after shot is taken once the steps have run, so it is at least the bookmarklet's own wait later: "
  + JSON.stringify(shots.map(function (s) { return s.at; })));
});

test("an entry that fails keeps the page as it failed, and not the same picture under two names", function () {
 var answer = runApart({
  fixture_Late_FailsAfterItRan: {
   url: "fixture:article.html",
   capture: true,
   steps: [{ run: true }, { expect: { selector: lateSelector, count: 1 } }]
  }
 }, ["--all"], null, lateFixture);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "fail");
 assert.deepStrictEqual(result.capture.screenshots.map(function (s) { return s.what; }), ["before", "failure"]);
});

test("a failure keeps a screenshot of the page as it stood, with nothing asking for a capture", function () {
 var answer = runApart({
  fixture_Capture_Failed: {
   url: "fixture:article.html",
   steps: [{ expect: { selector: "#nothing-of-the-sort", visible: true } }]
  }
 }, ["--all"]);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "fail");
 assert.deepStrictEqual(result.capture.screenshots.map(function (s) { return s.what; }), ["failure"]);
 assert.ok(fs.existsSync(path.join(rootDir, result.capture.screenshots[0].file)));
 assert.strictEqual(result.capture.video, "", "nothing asked for a video, so there is none");
});

test("a quiet pass that nothing asked to capture carries no artifacts at all", function () {
 var answer = runApart({ fixture_Capture_Quiet: { url: "fixture:article.html" } }, ["--all"]);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.strictEqual(result.capture, undefined);
});

test("--capture captures every entry it reaches, and an entry with auth none of it", function () {
 var stub = makeStub();
 try {
  var answer = runApart({
   fixture_Capture_Open: { url: "fixture:article.html" },
   fixture_Capture_SignedIn: { url: "fixture:article.html", auth: "fixture-site", signedIn: "main" }
  }, ["--all", "--capture"], { TEST_BM_AUTH_LAUNCHER: stub.file });
  assert.ok(answer.report, answer.run.out + answer.run.err);

  var open = answer.report.results.filter(function (r) { return r.name === "fixture_Capture_Open"; })[0];
  assert.deepStrictEqual(open.capture.screenshots.map(function (s) { return s.what; }), ["before", "after"]);
  assert.match(open.capture.video, /entry\.webm$/);

  var signedIn = answer.report.results.filter(function (r) { return r.name === "fixture_Capture_SignedIn"; })[0];
  assert.strictEqual(signedIn.capture, undefined, "a signed-in page is never captured");
  assert.ok(signedIn.notes.some(function (n) { return /nothing was captured/.test(n); }),
   "the run says why it captured nothing: " + JSON.stringify(signedIn.notes));
 } finally {
  removeDir(stub.dir);
 }
});

test("an entry asking to capture a signed-in page is a configuration error", function () {
 var bad = path.join(os.tmpdir(), "test-bm-capture-auth-" + process.pid + ".json");
 fs.writeFileSync(bad, JSON.stringify({
  fixture_Auth_MarksTheSignedInPage: { auth: "fixture-site", signedIn: "main", capture: true }
 }));
 try {
  var run = runHarness(["--list"], fixtureEnv(bad));
  assert.strictEqual(run.status, 2, "a configuration error exits 2");
  assert.match(run.err, /an entry with auth captures nothing - a signed-in page shows the account/);
 } finally {
  fs.rmSync(bad, { force: true });
 }
});

// ----------------------------------------------------------------------------------------------- //
// Recording a short
// ----------------------------------------------------------------------------------------------- //

// ffmpeg writes the GIF, and nothing in this repository installs it. Without it there is no GIF to
// assert anything about, so the tests that need one say why they stopped rather than failing a
// suite over a tool the harness is right not to require.
function hasFfmpeg() {
 var answer = child.spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
 return !answer.error && answer.status === 0;
}

// A shorts folder of this run's own, so an assertion about what is in it is not an assertion about
// what the maintainer has recorded.
function shortsFolder() {
 return fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-shorts-"));
}

var sizeSelector = "#size--__-unlikely_-_name-__--sizeShowsTheViewport";

// A bookmarklet that writes the viewport it ran in onto the page, which is how an entry asserts the
// frame a short was recorded in rather than taking the flag's word for it.
var sizeSource = [
 "javascript:(function() {",
 " /* A fixture that shows the viewport, so an entry can assert the frame it ran in. */",
 " var panelSizeShowsTheViewport = document.createElement(\"div\");",
 " panelSizeShowsTheViewport.id = \"size--__-unlikely_-_name-__--sizeShowsTheViewport\";",
 " panelSizeShowsTheViewport.textContent = window.innerWidth + \"x\" + window.innerHeight;",
 " document.body.appendChild(panelSizeShowsTheViewport);",
 "})();"
].join("\n") + "\n";

// A bookmarklet that keeps the page moving: a block that changes colour every quarter second. A
// clip of it never holds still, so it is cut only for its length, never for a still.
var movingSource = [
 "javascript:(function() {",
 " /* A fixture that never holds still. */",
 " var blockKeepsThePageMoving = document.createElement(\"div\");",
 " blockKeepsThePageMoving.style.cssText = \"position:fixed;top:0;left:0;width:240px;height:240px;\";",
 " document.body.appendChild(blockKeepsThePageMoving);",
 " var tickKeepsThePageMoving = 0;",
 " setInterval(function() {",
 "  tickKeepsThePageMoving++;",
 "  blockKeepsThePageMoving.style.background = (tickKeepsThePageMoving % 2) ? \"#cc0000\" : \"#0000cc\";",
 " }, 250);",
 "})();"
].join("\n") + "\n";

// A bookmarklet that changes the page twice: a block when it runs, and a second block five seconds
// later. Between them, and after the second, the page holds still.
var twoBlockSource = [
 "javascript:(function() {",
 " /* A fixture that draws a block, then a second one five seconds later, and nothing else. */",
 " var blockFirstOfTwoBlocks = document.createElement(\"div\");",
 " blockFirstOfTwoBlocks.style.cssText = \"position:fixed;top:0;left:0;width:240px;height:240px;background:#cc0000;\";",
 " document.body.appendChild(blockFirstOfTwoBlocks);",
 " setTimeout(function() {",
 "  var blockSecondOfTwoBlocks = document.createElement(\"div\");",
 "  blockSecondOfTwoBlocks.style.cssText = \"position:fixed;top:300px;left:300px;width:240px;height:240px;background:#0000cc;\";",
 "  document.body.appendChild(blockSecondOfTwoBlocks);",
 " }, 5000);",
 "})();"
].join("\n") + "\n";

// The longest a GIF holds one frame, in seconds, read by ffmpeg the way the harness reads a clip:
// the longest gap between the frames mpdecimate keeps, or from the last of them to the GIF's end.
function longestStill(file) {
 var answer = child.spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-loglevel", "info", "-i", file,
  "-vf", "fps=10,mpdecimate=max=0,showinfo", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
 var moved = (String(answer.stderr || "").match(/pts_time:\s*\d+(?:\.\d+)?/g) || []).map(function (m) {
  return Number(/\d+(?:\.\d+)?/.exec(m)[0]);
 });
 var end = gifFrames(file) / 10;
 var longest = 0;
 moved.forEach(function (at, i) {
  var next = i + 1 < moved.length ? moved[i + 1] : end;
  longest = Math.max(longest, next - at);
 });
 return longest;
}

test("--short records the entry at 648x648 and writes a 10 fps GIF where the pipeline reads it", function (t) {
 if (!hasFfmpeg()) {
  t.skip("ffmpeg is not on the PATH, so there is no GIF to read");
  return;
 }
 var shorts = shortsFolder();
 try {
  var answer = runApart({
   fixture_Short_Square: {
    url: "fixture:article.html",
    steps: [{ run: true }, { expect: { selector: sizeSelector, text: "648x648" } }]
   }
  }, ["--all", "--short"], { TEST_BM_SHORTS_DIR: shorts }, sizeSource);
  var result = onlyResult(answer);
  assert.strictEqual(result.verdict, "pass", result.reason);
  assert.ok(result.short, "a short run reports the recording it wrote: " + JSON.stringify(result.notes));
  assert.strictEqual(result.short.fps, 10);
  assert.ok(result.short.seconds > 0 && result.short.seconds <= 30,
   "a short runs for thirty seconds at most, not " + result.short.seconds);
  assert.strictEqual(result.short.full, undefined, "a clip of fifteen seconds or less is not cut");
  assert.strictEqual(result.short.keep, undefined);

  var gif = path.join(shorts, "fixture_Short_Square.gif");
  assert.ok(fs.existsSync(gif), "there should be a GIF at " + gif);
  assert.ok(fs.statSync(gif).size > 0, "the GIF should not be empty");
  assert.strictEqual(fs.readFileSync(gif).slice(0, 6).toString("latin1"), "GIF89a",
   "the file should be a GIF, whatever it is named");
  assert.deepStrictEqual(fs.readdirSync(shorts), ["fixture_Short_Square.gif"], "one clip, one GIF");
 } finally {
  removeDir(shorts);
 }
});

// How many frames a GIF holds, read by ffmpeg, which is what tells a cut from the clip it came from
// without taking the report's word for either length.
function gifFrames(file) {
 var answer = child.spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-i", file, "-f", "null", "-"], { encoding: "utf8" });
 var counted = String(answer.stderr || "").match(/frame=\s*\d+/g);
 return counted ? Number(/\d+/.exec(counted[counted.length - 1])[0]) : -1;
}

// Whether any part a cut keeps reaches into the stretch from..to of the whole clip, in seconds.
function keepsAny(keep, from, to) {
 return keep.some(function (part) { return part[0] < to && part[1] > from; });
}

test("a clip over fifteen seconds is kept whole up to thirty, and cut to its runs and clicks for the short", function (t) {
 if (!hasFfmpeg()) {
  t.skip("ffmpeg is not on the PATH, so there is no GIF to read");
  return;
 }
 var shorts = shortsFolder();
 try {
  var answer = runApart({
   fixture_Short_Long: {
    url: "fixture:article.html", timeout: 60000,
    steps: [{ run: true }, { wait: 12000 }, { click: "h1" }, { wait: 19000 }]
   }
  }, ["--all", "--short"], { TEST_BM_SHORTS_DIR: shorts }, movingSource);
  var result = onlyResult(answer);
  assert.strictEqual(result.verdict, "pass", result.reason);
  assert.ok(result.short && result.short.full, "a long clip reports its whole clip and its cut: "
   + JSON.stringify(result.notes));

  assert.strictEqual(result.short.full.seconds, 30, "the clip ran past thirty seconds, so it stops at thirty");
  assert.match(result.short.full.file, /fixture_Short_Long_Full\.gif$/);
  assert.match(result.short.file, /fixture_Short_Long\.gif$/);
  assert.ok(result.short.seconds > 0 && result.short.seconds <= 15,
   "the cut keeps fifteen seconds at most, not " + result.short.seconds);

  assert.deepStrictEqual(result.short.moments.map(function (m) { return m.what; }),
   ["the bookmarklet runs", "step 3: click h1"], "the run and the click are the moments of use");
  var keep = result.short.keep;
  assert.strictEqual(keep.length, 3, "the run, the click and the end each keep a part: " + JSON.stringify(keep));
  assert.strictEqual(keep[0][0], 0, "the cut starts where the clip does, a lead before the run");
  assert.strictEqual(keep[keep.length - 1][1], 30, "the cut ends where the clip does, on the result");
  keep.forEach(function (part, i) {
   assert.ok(part[1] > part[0], "each part runs forward: " + JSON.stringify(part));
   if (i) { assert.ok(part[0] > keep[i - 1][1], "parts are in order and apart: " + JSON.stringify(keep)); }
  });
  assert.ok(!keepsAny(keep, 6.5, 11), "the first wait is dropped: " + JSON.stringify(keep));
  assert.ok(!keepsAny(keep, 18.5, 24.5), "the second wait is dropped: " + JSON.stringify(keep));

  var whole = path.join(shorts, "fixture_Short_Long_Full.gif");
  var cut = path.join(shorts, "fixture_Short_Long.gif");
  [whole, cut].forEach(function (gif) {
   assert.strictEqual(fs.readFileSync(gif).slice(0, 6).toString("latin1"), "GIF89a", gif + " should be a GIF");
  });
  var wholeFrames = gifFrames(whole);
  var cutFrames = gifFrames(cut);
  assert.ok(Math.abs(wholeFrames - 300) <= 3, "thirty seconds at 10 fps is about 300 frames, not " + wholeFrames);
  assert.ok(Math.abs(cutFrames - result.short.seconds * 10) <= 3,
   "the cut GIF holds the frames of the parts it keeps: " + cutFrames + " for " + result.short.seconds + "s");
  assert.strictEqual(result.short.stills, undefined, "a page that keeps moving has no still to cut");
 } finally {
  removeDir(shorts);
 }
});

// A reading taken off a real recording is at the mercy of the machine the suite runs on: Chromium's
// screencast hands over frames only as fast as a loaded box lets it, and the page's own timer can be
// starved past the end of the clip, so what moved can read short through nothing the harness did.
// One re-record answers that without loosening anything: the same reading is taken again, unchanged,
// and only a second disagreement is a failure. The failure names both attempts, so a reading that
// failed twice is told from one that failed once and passed.
function recordedTwice(t, attempt) {
 try {
  attempt();
  return;
 } catch (first) {
  t.diagnostic("the first recording read wrong, so the run was recorded again: " + first.message);
  try {
   attempt();
  } catch (again) {
   // A fresh failure rather than the second one with its message rewritten: a reporter prints the
   // stack, which carries the message the error was built with, so a rewritten message is not the
   // one that reaches the log. The second attempt's own stack goes in the text instead, where it is
   // read rather than reconstructed.
   assert.fail("both recordings read wrong, so this is the code and not the machine."
    + "\nattempt 1: " + first.message
    + "\nattempt 2: " + (again.stack || again.message));
  }
 }
}

test("a short never holds still for two seconds: each still keeps a second and a half, and the rest is cut", function (t) {
 if (!hasFfmpeg()) {
  t.skip("ffmpeg is not on the PATH, so there is no GIF to read");
  return;
 }
 recordedTwice(t, function () {
  var shorts = shortsFolder();
  try {
   var answer = runApart({
    fixture_Short_Still: { url: "fixture:article.html", timeout: 40000, steps: [{ run: true }, { wait: 8000 }] }
   }, ["--all", "--short"], { TEST_BM_SHORTS_DIR: shorts }, twoBlockSource);
   var result = onlyResult(answer);
   assert.strictEqual(result.verdict, "pass", result.reason);
   assert.ok(result.short, "a short run reports the recording it wrote: " + JSON.stringify(result.notes));
   assert.strictEqual(result.short.full, undefined, "what moves runs under fifteen seconds, so there is one GIF");
   assert.strictEqual(result.short.keep, undefined, "no fifteen second cut was made");

   var stills = result.short.stills;
   assert.ok(Array.isArray(stills) && stills.length === 2,
    "the wait between the blocks and the end on the result each held still: " + JSON.stringify(stills));
   assert.ok(stills[0][1] - stills[0][0] > 2.5, "most of the five seconds between the blocks is cut: " + JSON.stringify(stills));
   assert.ok(stills[1][0] > stills[0][1], "the second block is kept, after the first still: " + JSON.stringify(stills));
   assert.ok(result.short.seconds > 2 && result.short.seconds < 5,
    "the run, the second block and a second and a half of each are left: " + result.short.seconds + "s");

   var gif = path.join(shorts, "fixture_Short_Still.gif");
   var frames = gifFrames(gif);
   assert.ok(Math.abs(frames - result.short.seconds * 10) <= 3,
    "the GIF holds the frames of what was kept: " + frames + " for " + result.short.seconds + "s");
   var longest = longestStill(gif);
   assert.ok(longest < 2, "the GIF never holds one frame for two seconds, and held one for " + longest + "s");
  } finally {
   removeDir(shorts);
  }
 });
});

test("the cut of a signed-in entry is reported as seconds only, never as the steps it kept", function (t) {
 if (!hasFfmpeg()) {
  t.skip("ffmpeg is not on the PATH, so there is no GIF to read");
  return;
 }
 var stub = makeStub();
 var shorts = shortsFolder();
 try {
  var answer = runApart({
   fixture_Short_LongSignedIn: {
    url: "fixture:article.html", auth: "fixture-site", signedIn: "main", timeout: 40000,
    steps: [{ run: true }, { wait: 16500 }]
   }
  }, ["--all", "--short"], { TEST_BM_AUTH_LAUNCHER: stub.file, TEST_BM_SHORTS_DIR: shorts }, movingSource);
  var result = onlyResult(answer);
  assert.strictEqual(result.verdict, "pass", result.reason);
  assert.ok(result.short && result.short.full, "the clip ran over fifteen seconds: " + JSON.stringify(result.notes));
  assert.strictEqual(result.short.review, true, "a short of a signed-in page waits to be reviewed");
  assert.strictEqual(result.short.stills, undefined, "the recording is the entry's moving page, not the"
   + " blank page the launcher's context opened first");
  assert.ok(Array.isArray(result.short.keep) && result.short.keep.length > 0, "the parts are reported");
  assert.strictEqual(result.short.moments, undefined, "the steps of a signed-in entry stay in memory");
  assert.strictEqual(result.capture, undefined, "a signed-in page is still captured not at all");
  assert.ok(fs.existsSync(path.join(shorts, "fixture_Short_LongSignedIn_Full.gif")));
  assert.ok(fs.existsSync(path.join(shorts, "fixture_Short_LongSignedIn.gif")));
 } finally {
  removeDir(shorts);
  removeDir(stub.dir);
 }
});

test("a recording already there is kept, and the entry is not recorded again for it", function () {
 var shorts = shortsFolder();
 var mine = path.join(shorts, "fixture_Short_Kept.gif");
 try {
  fs.writeFileSync(mine, "a recording made by hand");
  var answer = runApart({
   fixture_Short_Kept: { url: "fixture:article.html", steps: [{ run: true }] }
  }, ["--all", "--short"], { TEST_BM_SHORTS_DIR: shorts });
  var result = onlyResult(answer);
  assert.strictEqual(result.verdict, "pass", result.reason);
  assert.strictEqual(result.short, undefined, "nothing was recorded, so there is no short to report");
  assert.ok(result.notes.some(function (n) { return /a recording is already there/.test(n); }),
   "the run says why it recorded nothing: " + JSON.stringify(result.notes));
  assert.strictEqual(fs.readFileSync(mine, "utf8"), "a recording made by hand",
   "the recording that was there should be untouched");
 } finally {
  removeDir(shorts);
 }
});

// A launcher that recorded only the first second of the entry: it plants a one second webm where
// the harness told it to record and opens a context that records nothing itself, which is a
// launcher free to ignore recordVideo doing exactly that. The clip then starts past the end of
// what there is, which is the one way an unattended run meets an ffmpeg that writes nothing.
var partialStubSource = [
 "import fs from \"node:fs\";",
 "import path from \"node:path\";",
 "import { fileURLToPath } from \"node:url\";",
 "var here = path.dirname(fileURLToPath(import.meta.url));",
 "export async function launch(options) {",
 " if (options.site !== \"fixture-site\") { return null; }",
 " if (options.recordVideo && options.recordVideo.dir) {",
 "  fs.mkdirSync(options.recordVideo.dir, { recursive: true });",
 "  fs.copyFileSync(path.join(here, \"partial.webm\"), path.join(options.recordVideo.dir, \"partial.webm\"));",
 " }",
 " var profile = fs.mkdtempSync(path.join(here, \"profile-\"));",
 " return options.chromium.launchPersistentContext(profile, { headless: true });",
 "}",
 "export async function signIn() { }",
 "export async function signInState() { }"
].join("\n") + "\n";

// The one second recording that stub plants. ffmpeg writes it, and a build of ffmpeg without the
// webm encoder says so rather than being worked around: the test that needs it skips instead.
function makePartialStub() {
 var dir = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-partial-launcher-"));
 var made = child.spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-loglevel", "error", "-n",
  "-f", "lavfi", "-i", "testsrc=duration=1:size=64x64:rate=10",
  "-c:v", "libvpx", path.join(dir, "partial.webm")], { encoding: "utf8" });
 if (made.error || made.status !== 0 || !fs.existsSync(path.join(dir, "partial.webm"))) {
  removeDir(dir);
  return null;
 }
 var file = path.join(dir, "partial-launcher.mjs");
 fs.writeFileSync(file, partialStubSource);
 return { dir: dir, file: file };
}

test("a GIF ffmpeg did not write is taken away, so the next run is not told one is already there", function (t) {
 if (!hasFfmpeg()) {
  t.skip("ffmpeg is not on the PATH, so there is no failed write to read");
  return;
 }
 var stub = makePartialStub();
 if (!stub) {
  t.skip("this ffmpeg writes no webm, so there is no partial recording to plant");
  return;
 }
 var shorts = shortsFolder();
 try {
  var answer = runApart({
   fixture_Short_Unwritten: {
    url: "fixture:article.html", auth: "fixture-site", signedIn: "main",
    timeout: 20000, steps: [{ wait: 2500 }, { run: true }]
   }
  }, ["--all", "--short"], { TEST_BM_AUTH_LAUNCHER: stub.file, TEST_BM_SHORTS_DIR: shorts });
  var result = onlyResult(answer);
  assert.strictEqual(result.verdict, "pass", result.reason);
  assert.strictEqual(result.short, undefined, "no GIF was written, so there is no short to report");
  assert.ok(result.notes.some(function (n) { return /^no short: ffmpeg wrote no GIF/.test(n); }),
   "the run says ffmpeg wrote nothing, in ffmpeg's own words: " + JSON.stringify(result.notes));
  assert.deepStrictEqual(fs.readdirSync(shorts), [],
   "an attempt that wrote no bytes is taken away, or every later run reads it as the recording");
 } finally {
  removeDir(shorts);
  removeDir(stub.dir);
 }
});

test("a failing entry gets no short, because that recording is not the bookmarklet's", function () {
 var shorts = shortsFolder();
 try {
  var answer = runApart({
   fixture_Short_Failed: {
    url: "fixture:article.html",
    requires: ["#no-such-thing-on-this-page"],
    timeout: 3000
   }
  }, ["--all", "--short"], { TEST_BM_SHORTS_DIR: shorts });
  var result = onlyResult(answer);
  assert.strictEqual(result.verdict, "fail");
  assert.strictEqual(result.short, undefined);
  assert.ok(result.notes.some(function (n) { return /no short: the entry did not pass/.test(n); }),
   "the run says why it wrote no short: " + JSON.stringify(result.notes));
  assert.deepStrictEqual(fs.readdirSync(shorts), [], "nothing should have been written");
 } finally {
  removeDir(shorts);
 }
});

test("an entry with auth records its short through the launcher, and it waits to be reviewed", function (t) {
 if (!hasFfmpeg()) {
  t.skip("ffmpeg is not on the PATH, so there is no GIF to read");
  return;
 }
 var stub = makeStub();
 var shorts = shortsFolder();
 try {
  var answer = runApart({
   fixture_Short_SignedIn: {
    url: "fixture:article.html", auth: "fixture-site", signedIn: "main",
    steps: [{ run: true }]
   }
  }, ["--all", "--short"], { TEST_BM_AUTH_LAUNCHER: stub.file, TEST_BM_SHORTS_DIR: shorts });
  var result = onlyResult(answer);
  assert.strictEqual(result.verdict, "pass", result.reason);
  assert.ok(result.short, "the launcher was handed recordVideo, so there is a short: "
   + JSON.stringify(result.notes));
  assert.strictEqual(result.short.review, true, "a short of a signed-in page waits to be reviewed");
  assert.strictEqual(result.capture, undefined, "a signed-in page is still captured not at all");
  assert.ok(result.notes.some(function (n) { return /stays on this machine until it has been reviewed/.test(n); }),
   "the run says the short is waiting: " + JSON.stringify(result.notes));
  assert.ok(fs.existsSync(path.join(shorts, "fixture_Short_SignedIn.gif")));
 } finally {
  removeDir(shorts);
  removeDir(stub.dir);
 }
});

// ----------------------------------------------------------------------------------------------- //
// failure.md
// ----------------------------------------------------------------------------------------------- //

function failureFileOf(run) {
 var named = /^failures: (.+)$/m.exec(run.out);
 assert.ok(named, "the run should name the failure report it wrote:\n" + run.out + run.err);
 return fs.readFileSync(path.join(rootDir, named[1].replace(/\//g, path.sep)), "utf8");
}

// One bookmarklet's part of the report, which is its level 2 heading down to the next one.
function sectionOf(text, name) {
 var parts = String(text).split(/^## /m);
 for (var i = 1; i < parts.length; i++) {
  if (parts[i].split("\n")[0].trim() === name) { return parts[i]; }
 }
 assert.fail(name + " should have a section in the failure report:\n" + text);
}

test("a failing run writes failure.md beside its report, one section per failing bookmarklet", function () {
 var text = failureFileOf(readReport().run);
 assert.match(text, /^# test-bm failures$/m);
 assert.match(text, /8 of 14 entries failed in the --all run that finished /);
 assert.match(text, /Read `AGENTS\.md` at the repository root/);
 var sections = text.match(/^## /gm) || [];
 assert.strictEqual(sections.length, 8, "a section for each of the eight failures");
});

test("a bookmarklet that threw is written up with its message and the lines it threw at", function () {
 var section = sectionOf(failureFileOf(readReport().run), "fixture_Throw_ReadsAMissingThing");
 assert.match(section, /### What it threw/);
 assert.match(section, /### Where it threw, in the formatted file/);
 assert.match(section, /4  document\.title = missingFixtureThrowReadsAMissingThing\.textContent;/,
  "the stack maps back onto the line of the formatted file:\n" + section);
 assert.match(section, /### The page when it failed/);
 assert.match(section, /failure\.png/);
});

test("a missing requires selector is written up with the lines using it and the region it was in", function () {
 var answer = runApart({
  fixture_Failure_Requires: {
   url: "fixture:table.html",
   requires: ["div.table_scroll table thead tr.header-row"],
   timeout: 3000
  }
 }, ["--all"], null, [
  "javascript:(function() {",
  " /* A fixture that reads the row an entry says must be there. */",
  " var rowsFixtureFailureRequires = document.querySelectorAll(\"div.table_scroll table thead tr.header-row\");",
  " document.title = \"rows: \" + rowsFixtureFailureRequires.length;",
  "})();"
 ].join("\n") + "\n");
 assert.strictEqual(onlyResult(answer).verdict, "fail");
 var section = sectionOf(failureFileOf(answer.run), "fixture_Failure_Requires");
 assert.match(section, /### The selector that is gone/);
 assert.match(section, /div\.table_scroll table thead tr\.header-row/);
 assert.match(section, /### Where the bookmarklet uses it/);
 assert.match(section, / 3  var rowsFixtureFailureRequires = document\.querySelectorAll/,
  "the line of the file that names the selector:\n" + section);
 assert.match(section, /### The region it was expected in/);
 assert.match(section, /`div\.table_scroll table thead` - the longest part of the selector still on the page\./);
 assert.match(section, /<thead/, "the region's markup is in the report:\n" + section);
});

test("a failing entry with auth gives the selector and its own lines, and nothing the page showed", function () {
 var stub = makeStub();
 try {
  var answer = runApart({
   fixture_Failure_SignedIn: {
    url: "fixture:article.html", auth: "fixture-site", signedIn: "main",
    requires: ["main .byline-that-went"], timeout: 3000
   }
  }, ["--all"], { TEST_BM_AUTH_LAUNCHER: stub.file });
  assert.strictEqual(onlyResult(answer).verdict, "fail", onlyResult(answer).reason);
  var section = sectionOf(failureFileOf(answer.run), "fixture_Failure_SignedIn");
  assert.match(section, /\*\*Signed in\*\*: fixture-site - nothing this page showed is in this report/);
  assert.match(section, /### The selector that is gone/);
  assert.match(section, /byline-that-went/);
  assert.doesNotMatch(section, /### The region it was expected in/,
   "a signed-in page gives no snapshot and no markup:\n" + section);
  assert.doesNotMatch(section, /### The page when it failed/,
   "a signed-in page gives no screenshot:\n" + section);
 } finally {
  removeDir(stub.dir);
 }
});

test("a run of one failing bookmarklet writes failure.md too, which is how an agent reads its verdict", function () {
 var run = runHarness(["fixture_Throw_ReadsAMissingThing"], fixtureEnv());
 assert.strictEqual(run.status, 1);
 var text = failureFileOf(run);
 assert.match(text, /1 of 1 entry failed in the single run that finished /);
 assert.match(text, /^## fixture_Throw_ReadsAMissingThing$/m);
});

test("a run that fails nothing writes no failure report at all", function () {
 var answer = runApart({
  fixture_Failure_None: { url: "fixture:article.html", steps: [{ run: true }] }
 }, ["--all"]);
 assert.strictEqual(onlyResult(answer).verdict, "pass");
 assert.doesNotMatch(answer.run.out, /^failures: /m);
 var named = /^report: (.+)$/m.exec(answer.run.out);
 assert.ok(named);
 assert.strictEqual(fs.existsSync(path.join(rootDir, named[1].replace(/\//g, path.sep), "failure.md")), false);
});

// ----------------------------------------------------------------------------------------------- //
// Two runs in one second
// ----------------------------------------------------------------------------------------------- //

// A run's folder is named for the second it started, as docs/testing.md gives it.
function secondOf(when) {
 function two(n) { return (n < 10 ? "0" : "") + n; }
 return when.getFullYear() + "-" + two(when.getMonth() + 1) + "-" + two(when.getDate()) + "_"
  + two(when.getHours()) + two(when.getMinutes()) + two(when.getSeconds());
}

// runApart, without waiting: the run is started and its answer comes when it exits, so a test can
// have two going at once.
function startApart(entries, source) {
 var js = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-apart-"));
 Object.keys(entries).forEach(function (name) { fs.writeFileSync(path.join(js, name + ".js"), source); });
 var config = path.join(js, "test-bm.json");
 fs.writeFileSync(config, JSON.stringify(entries));
 return new Promise(function (resolve) {
  var out = "";
  var err = "";
  var proc = child.spawn(process.execPath, ["test-bm.js", "--all"], {
   cwd: rootDir,
   env: Object.assign({}, process.env, { TEST_BM_AUTH_LAUNCHER: "", _TEST_BM_EVERYDAY_DRIVER: "", TEST_BM_JS_DIR: js,
    TEST_BM_CONFIG: config })
  });
  proc.stdout.on("data", function (chunk) { out += chunk; });
  proc.stderr.on("data", function (chunk) { err += chunk; });
  proc.on("close", function (status) {
   removeDir(js);
   var named = /^report: (.+)$/m.exec(out);
   resolve({ status: status, out: out, err: err, folder: named ? named[1] : "" });
  });
 });
}

test("two runs that start in the same second each write a folder of their own", async function () {
 var resultsDir = path.join(rootDir, "test-results", "test-bm");
 // Every second either run could start in already has a folder, made the way an earlier run makes
 // one, so both runs find their second taken whatever the clock says, and the two of them most
 // often find the same one.
 // A second that already has a folder, from a run of the test before this one, counts as taken, and
 // only the folders made here are checked and taken away again.
 var taken = [];
 var made = [];
 var now = Date.now();
 fs.mkdirSync(resultsDir, { recursive: true });
 for (var s = 0; s <= 60; s++) {
  var name = secondOf(new Date(now + s * 1000));
  taken.push(name);
  if (fs.existsSync(path.join(resultsDir, name))) { continue; }
  fs.mkdirSync(path.join(resultsDir, name));
  fs.writeFileSync(path.join(resultsDir, name, "failure.md"), "an earlier run's failure report\n");
  made.push(name);
 }
 try {
  var throwing = [
   "javascript:(function() {",
   " /* A fixture that reads a thing that is not there, so its run fails and writes failure.md. */",
   " document.title = missingFixtureSameSecondThrows.textContent;",
   "})();"
  ].join("\n") + "\n";
  var passing = fs.readFileSync(path.join(rootDir, jsDir, "fixture_Pass_AddsAPanel.js"));
  var both = await Promise.all([
   startApart({ fixture_SameSecond_Fails: { url: "fixture:article.html", steps: [{ run: true }] } }, throwing),
   startApart({ fixture_SameSecond_Passes: { url: "fixture:article.html", steps: [{ run: true }] } }, passing)
  ]);
  var failed = both[0];
  var passed = both[1];
  assert.strictEqual(failed.status, 1, failed.out + failed.err);
  assert.strictEqual(passed.status, 0, passed.out + passed.err);
  assert.ok(failed.folder && passed.folder, "both runs should name their folder:\n" + failed.out + passed.out);
  assert.notStrictEqual(failed.folder, passed.folder, "the two runs share " + passed.folder);
  [failed, passed].forEach(function (run) {
   var m = /^test-results\/test-bm\/(\d{4}-\d\d-\d\d_\d{6})-(\d+)$/.exec(run.folder);
   assert.ok(m, run.folder + " should be a taken second with a number after it");
   assert.ok(taken.indexOf(m[1]) >= 0, run.folder + " should start in one of the seconds made taken");
   assert.ok(Number(m[2]) >= 2, run.folder + " should be numbered from 2");
  });
  var passedDir = path.join(rootDir, passed.folder.replace(/\//g, path.sep));
  var failedDir = path.join(rootDir, failed.folder.replace(/\//g, path.sep));
  assert.strictEqual(fs.existsSync(path.join(passedDir, "failure.md")), false,
   "the passing run's folder holds the other run's failure report");
  assert.ok(fs.existsSync(path.join(failedDir, "failure.md")), "the failing run writes its own");
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(passedDir, "report.json"), "utf8")).results
   .map(function (r) { return r.name; }), ["fixture_SameSecond_Passes"]);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(failedDir, "report.json"), "utf8")).results
   .map(function (r) { return r.name; }), ["fixture_SameSecond_Fails"]);
  made.forEach(function (name) {
   assert.deepStrictEqual(fs.readdirSync(path.join(resultsDir, name)), ["failure.md"],
    "an earlier run's folder is left as it was: " + name);
  });
 } finally {
  made.forEach(function (name) { removeDir(path.join(resultsDir, name)); });
 }
});

// ----------------------------------------------------------------------------------------------- //
// One selector counted against another
// ----------------------------------------------------------------------------------------------- //

test("matches passes when two selectors match the same number of elements", function () {
 var answer = runApart({
  fixture_Matches_Same: {
   url: "fixture:article.html",
   steps: [{ run: true }, { expect: { selector: panelSelector, matches: "body" } }]
  }
 }, ["--all"]);
 assert.strictEqual(onlyResult(answer).verdict, "pass");
});

test("matches fails naming both counts, so a page listing more rows than it sized says so", function () {
 var answer = runApart({
  fixture_Matches_Short: {
   url: "fixture:article.html",
   steps: [{ run: true }, { expect: { selector: panelSelector, matches: "p" } }]
  }
 }, ["--all"]);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /matches 1, and p matches \d+$/);
});

test("matches with nothing to count against is a configuration error", function () {
 var bad = path.join(os.tmpdir(), "test-bm-matches-bad-" + process.pid + ".json");
 fs.writeFileSync(bad, JSON.stringify({
  fixture_Pass_AddsAPanel: { steps: [{ expect: { selector: "p", matches: "" } }] }
 }));
 try {
  var run = runHarness(["--list"], fixtureEnv(bad));
  assert.strictEqual(run.status, 2);
  assert.match(run.err, /matches takes the selector to count against/);
 } finally {
  fs.rmSync(bad, { force: true });
 }
});

// ----------------------------------------------------------------------------------------------- //
// Where an element's painted text lands
// ----------------------------------------------------------------------------------------------- //

// The one expectation that reads geometry. Every other one here is satisfied by an element that
// paints its text straight over the element beside it, which is how siteSpecific_GitHub_ShowFileSize
// passed for a day while its Size heading covered GitHub's own Last commit message heading on every
// folder page under 1366px wide.
//
// The four states are on test/fixtures/pages/self-test-overflow.html, sized there rather than here
// so the answers do not move with the font the machine has. Two of them overflow by the same amount
// and differ only in what the overflow lands on: a heading painting its own words, and a heading a
// site serves at font-size 0. Reading the overflow alone would call both of them a defect, and the
// second is the state the repository root is in.
function runOverflow(name, want) {
 var entry = {};
 entry[name] = {
  url: "fixture:self-test-overflow.html",
  steps: [{ run: true }, { wait: 500 }, { expect: want }]
 };
 return onlyResult(runApart(entry, ["--all"]));
}

test("clear passes for text that stays inside its own box", function () {
 var result = runOverflow("fixture_Clear_FitsInside", { selector: "#fitsInside", clear: true });
 assert.strictEqual(result.verdict, "pass", result.reason);
});

test("clear fails for text that runs out of its box over a heading painting its own words", function () {
 var result = runOverflow("fixture_Clear_RunsOverPainted", { selector: "#runsOverPainted", clear: true });
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /#runsOverPainted paints [\d.]+px of text past its own box, over th/);
 assert.match(result.reason, /"Last commit message"/);
 assert.match(result.reason, /the box holds \d+px of the \d+px it needs/);
});

test("clear passes for the same overflow onto a heading the page paints nothing in", function () {
 var result = runOverflow("fixture_Clear_RunsOverBlank", { selector: "#runsOverBlank", clear: true });
 assert.strictEqual(result.verdict, "pass", result.reason);
});

test("clear on an element that paints no text says so rather than passing quietly", function () {
 var result = runOverflow("fixture_Clear_PaintsNothing", { selector: "#paintsNothing", clear: true });
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /#paintsNothing paints no text, so where its text lands is not a question the page answers/);
});

// The element is handed to the measurement rather than the selector, so a selector Playwright
// resolves and the page does not - ":visible", which the ShowFileSize entry already uses on its own
// steps - measures rather than throwing a SyntaxError out of document.querySelector.
test("clear takes a selector Playwright resolves and the page would refuse", function () {
 var result = runOverflow("fixture_Clear_PlaywrightSelector",
  { selector: "#runsOverPainted:visible", clear: true });
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /paints [\d.]+px of text past its own box, over th/);
 assert.doesNotMatch(result.reason, /SyntaxError|not a valid selector/);
});

test("clear on a selector that matches nothing fails rather than reading as clear air", function () {
 var result = runOverflow("fixture_Clear_MatchesNothing", { selector: "#no-such-heading", clear: true });
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /#no-such-heading is not on the page to measure$/);
});

test("clear the other way round is a configuration error, since covered text is the defect", function () {
 refuses({ fixture_Pass_AddsAPanel: { steps: [{ expect: { selector: "p", clear: false } }] } },
  /clear takes true - text that runs over its neighbour is a defect/);
});

test("clear asked of a hidden element is a configuration error, because it paints nothing", function () {
 refuses({ fixture_Pass_AddsAPanel: { steps: [{ expect: { selector: "p", clear: true, hidden: true } }] } },
  /clear reads where an element's text is painted, and a hidden element paints none/);
});

// ----------------------------------------------------------------------------------------------- //
// A url the environment holds
// ----------------------------------------------------------------------------------------------- //

test("a url naming an unset variable is a skip, so a page nobody here can reach never fails a run", function () {
 var answer = runApart({ fixture_Env_Unset: { url: "$TEST_BM_NOT_SET_ANYWHERE" } }, ["--all"]);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "skip");
 assert.strictEqual(result.reason, "the page comes from $TEST_BM_NOT_SET_ANYWHERE, which is not set");
 assert.strictEqual(answer.run.status, 0, "a skip never fails a run");
});

test("the address a variable holds is used and never written down", function () {
 var answer = runApart({
  fixture_Env_Opened: { url: "$TEST_BM_FIXTURE_ADDRESS", steps: [{ run: true }] },
  fixture_Env_Missing: { url: "$TEST_BM_FIXTURE_ADDRESS", requires: ["#no-such-thing"], timeout: 4000 }
 }, ["--all"], { TEST_BM_FIXTURE_ADDRESS: "https://fixtures.test/article.html" });
 assert.ok(answer.report, answer.run.out + answer.run.err);

 var opened = answer.report.results.filter(function (r) { return r.name === "fixture_Env_Opened"; })[0];
 assert.strictEqual(opened.verdict, "pass", opened.reason);
 assert.strictEqual(opened.url, "$TEST_BM_FIXTURE_ADDRESS", "the report names the variable, not the address");

 var missing = answer.report.results.filter(function (r) { return r.name === "fixture_Env_Missing"; })[0];
 assert.strictEqual(missing.verdict, "fail");
 assert.strictEqual(missing.reason, "site changed: #no-such-thing not found on $TEST_BM_FIXTURE_ADDRESS");

 assert.doesNotMatch(JSON.stringify(answer.report), /fixtures\.test/,
  "nothing in the report says where the variable pointed");
 assert.doesNotMatch(answer.run.out, /fixtures\.test/, "and nothing the run printed says it either");
});

test("a url that opens with a dollar but is not a variable name is a configuration error", function () {
 var bad = path.join(os.tmpdir(), "test-bm-env-shape-" + process.pid + ".json");
 fs.writeFileSync(bad, JSON.stringify({ fixture_Pass_AddsAPanel: { url: "$octoprint url" } }));
 try {
  var run = runHarness(["--list"], fixtureEnv(bad));
  assert.strictEqual(run.status, 2);
  assert.match(run.err, /a url naming an environment variable is written as \$NAME, in upper case/);
 } finally {
  fs.rmSync(bad, { force: true });
 }
});

// ----------------------------------------------------------------------------------------------- //
// A run with variables set
// ----------------------------------------------------------------------------------------------- //

// A bookmarklet that asks to be edited before it is saved, the way one with var img = "CHANGE_IMAGE"
// does, and writes the value it ran with onto the page. The comment on its first line shows the same
// declaration again, which is not one. It throws on a line below the declaration when the value says
// so, which is how a set value that makes that line longer is seen to leave the line an error is read
// back to where it was.
var setSource = [
 "javascript:(function() {",
 " var labelFixtureSetsIt = \"as published\"; /* var labelFixtureSetsIt = \"in a comment\"; */",
 " var panelFixtureSetsIt = document.getElementById(\"set--__-unlikely_-_name-__--set\");",
 " if (!panelFixtureSetsIt) {",
 "  panelFixtureSetsIt = document.createElement(\"p\");",
 "  panelFixtureSetsIt.id = \"set--__-unlikely_-_name-__--set\";",
 "  document.body.appendChild(panelFixtureSetsIt);",
 " }",
 " panelFixtureSetsIt.textContent = \"label: \" + labelFixtureSetsIt;",
 " if (labelFixtureSetsIt.indexOf(\"throw\") === 0) { null.thrownFixtureSetsIt; }",
 "})();"
].join("\n");

var setPanel = "#set--__-unlikely_-_name-__--set";
var setQuoted = "a \"quoted\" word, it's a back\\slash, and */ a comment's end";
var setLong = "throw, with a value long enough to move every column after it well past the end of its line";

function setEntry(steps) { return { url: "fixture:article.html", steps: steps }; }

// The passing and throwing entries run together, so the suite pays for one browser rather than three.
var setRun = null;

function setResult(name) {
 if (!setRun) {
  setRun = runApart({
   fixture_Set_WritesTheValue: setEntry([
    { run: true },
    { expect: { selector: setPanel, text: "label: as published" } },
    { run: { set: { labelFixtureSetsIt: "from the entry" } } },
    { expect: { selector: setPanel, text: "label: from the entry" } },
    { run: true },
    { expect: { selector: setPanel, text: "label: as published" } }
   ]),
   fixture_Set_KeepsItAString: setEntry([
    { run: { set: { labelFixtureSetsIt: setQuoted } } },
    { expect: { selector: setPanel, text: "label: " + setQuoted } }
   ]),
   fixture_Set_ThrowsAtItsLine: setEntry([{ run: { set: { labelFixtureSetsIt: setLong } } }])
  }, ["--all"], undefined, setSource);
 }
 assert.ok(setRun.report, "the run should have written a report:\n" + setRun.run.out + setRun.run.err);
 var found = setRun.report.results.filter(function (r) { return r.name === name; });
 assert.strictEqual(found.length, 1, name + " should appear once in the report");
 return found[0];
}

// A configuration of entries on the set fixture, which has to be refused before any browser starts.
function refusesSet(entries, expected) {
 var answer = runApart(entries, ["--list"], undefined, setSource);
 assert.strictEqual(answer.run.status, 2, "a configuration error exits 2:\n" + answer.run.out + answer.run.err);
 assert.strictEqual(answer.run.out, "", "nothing is listed, and nothing is run, once the configuration is refused");
 assert.match(answer.run.err, expected);
}

test("a run that sets a variable runs the file with the value in, and a plain run the file as it is", function () {
 var result = setResult("fixture_Set_WritesTheValue");
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.ok(result.notes.indexOf("step 3 ran it with labelFixtureSetsIt set to \"from the entry\"") >= 0,
  "the report names the variable set and its value:\n" + result.notes.join("\n"));
 assert.strictEqual(result.notes.filter(function (n) { return / ran it with /.test(n); }).length, 1,
  "a plain run sets nothing, so only the run that set a value says it did");
});

test("a value goes in as a string literal, so its quotes, backslashes and comment marks stay inside it", function () {
 var result = setResult("fixture_Set_KeepsItAString");
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.ok(result.notes.indexOf("step 1 ran it with labelFixtureSetsIt set to " + JSON.stringify(setQuoted)) >= 0,
  result.notes.join("\n"));
});

test("a bookmarklet that throws with a value set is read back to the line it threw at", function () {
 var result = setResult("fixture_Set_ThrowsAtItsLine");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^the bookmarklet threw: .*\(line 10\)$/,
  "the value made the declaration longer, and the line is still the one that threw");
});

test("set on a name the bookmarklet never declares is refused before any browser starts", function () {
 refusesSet({ fixture_Set_Undeclared: setEntry([{ run: { set: { colourFixtureSetsIt: "red" } } }]) },
  /fixture_Set_Undeclared step 1: set names colourFixtureSetsIt, which the bookmarklet never declares/);
});

test("set on a name the bookmarklet declares twice is refused, since one edit could not reach both", function () {
 var twice = setSource.replace(" var panelFixtureSetsIt", " var labelFixtureSetsIt = \"again\";\n var panelFixtureSetsIt");
 var answer = runApart({ fixture_Set_Twice: setEntry([{ run: { set: { labelFixtureSetsIt: "red" } } }]) },
  ["--list"], undefined, twice);
 assert.strictEqual(answer.run.status, 2, answer.run.out + answer.run.err);
 assert.match(answer.run.err, /set names labelFixtureSetsIt, which the bookmarklet declares 2 times/);
});

test("set on a name the bookmarklet declares as anything but a string is refused", function () {
 refusesSet({ fixture_Set_NotAString: setEntry([{ run: { set: { panelFixtureSetsIt: "red" } } }]) },
  /set names panelFixtureSetsIt, which the bookmarklet does not declare as var panelFixtureSetsIt = "a string"/);
});

test("set with a value that is not a string is refused", function () {
 refusesSet({ fixture_Set_Number: setEntry([{ run: { set: { labelFixtureSetsIt: 5 } } }]) },
  /fixture_Set_Number step 1: set takes a string for labelFixtureSetsIt/);
});

test("set anywhere but inside a run step is refused", function () {
 refusesSet({
  fixture_Set_OnAClick: setEntry([{ click: "body", set: { labelFixtureSetsIt: "red" } }]),
  fixture_Set_OnItsOwn: setEntry([{ set: { labelFixtureSetsIt: "red" } }])
 }, /fixture_Set_OnAClick step 1: set goes inside a run step[\s\S]*fixture_Set_OnItsOwn step 1: set goes inside a run step/);
});

test("a run that is neither true nor an object holding set is refused", function () {
 refusesSet({
  fixture_Set_Word: setEntry([{ run: "yes" }]),
  fixture_Set_Extra: setEntry([{ run: { set: { labelFixtureSetsIt: "red" }, also: true } }]),
  fixture_Set_Empty: setEntry([{ run: { set: {} } }])
 }, /fixture_Set_Word step 1: run takes true, or[\s\S]*fixture_Set_Extra step 1: run has no also[\s\S]*fixture_Set_Empty step 1: set takes the variables to set/);
});

test("a value that would make the file fail its own check is refused, unsafe code included", function () {
 refusesSet({ fixture_Set_Unsafe: setEntry([{ run: { set: { labelFixtureSetsIt: "eval(1)" } } }]) },
  /fixture_Set_Unsafe step 1: with labelFixtureSetsIt set to "eval\(1\)", unsafe: it runs a string as code with eval\(\)/);
});

// ----------------------------------------------------------------------------------------------- //
// A viewport step
// ----------------------------------------------------------------------------------------------- //

// A bookmarklet that writes the size of the window it ran in onto the page, so each run says what
// the steps before it left the viewport at.
var windowSource = [
 "javascript:(function() {",
 " var panelFixtureReadsTheSize = document.getElementById(\"size--__-unlikely_-_name-__--size\");",
 " if (!panelFixtureReadsTheSize) {",
 "  panelFixtureReadsTheSize = document.createElement(\"p\");",
 "  panelFixtureReadsTheSize.id = \"size--__-unlikely_-_name-__--size\";",
 "  document.body.appendChild(panelFixtureReadsTheSize);",
 " }",
 " panelFixtureReadsTheSize.textContent = \"size: \" + window.innerWidth + \"x\" + window.innerHeight;",
 "})();"
].join("\n");

var windowPanel = "#size--__-unlikely_-_name-__--size";

function windowIs(text) { return { expect: { selector: windowPanel, text: "size: " + text } }; }

// A bookmarklet that adds a two-column header row whose first column is sized by the window, the
// way GitHub's file table narrows with it. The heading in it is held to one line, as the Size
// heading was, and the column beside it paints its own words. At 1280 the first column is 280px and
// the heading fits; at 1024 it is 24px and the heading runs over its neighbour. The row is fixed
// near the top of the window, so what its overflow lands on is always on screen to be read.
var narrowingSource = [
 "javascript:(function() {",
 " var tableFixtureNarrowsIt = document.createElement(\"table\");",
 " tableFixtureNarrowsIt.style.setProperty(\"position\", \"fixed\");",
 " tableFixtureNarrowsIt.style.setProperty(\"top\", \"200px\");",
 " tableFixtureNarrowsIt.style.setProperty(\"left\", \"0\");",
 " tableFixtureNarrowsIt.style.setProperty(\"z-index\", \"10\");",
 " tableFixtureNarrowsIt.style.setProperty(\"background\", \"#fff\");",
 " tableFixtureNarrowsIt.style.setProperty(\"table-layout\", \"fixed\");",
 " tableFixtureNarrowsIt.style.setProperty(\"border-collapse\", \"collapse\");",
 " tableFixtureNarrowsIt.style.setProperty(\"width\", \"calc(100vw - 600px)\");",
 " var rowFixtureNarrowsIt = tableFixtureNarrowsIt.insertRow(0);",
 " var heldFixtureNarrowsIt = document.createElement(\"th\");",
 " heldFixtureNarrowsIt.id = \"held--__-unlikely_-_name-__--held\";",
 " heldFixtureNarrowsIt.textContent = \"Size (rate limited)\";",
 " heldFixtureNarrowsIt.style.setProperty(\"width\", \"calc(100vw - 1000px)\");",
 " heldFixtureNarrowsIt.style.setProperty(\"white-space\", \"nowrap\");",
 " var nextFixtureNarrowsIt = document.createElement(\"th\");",
 " nextFixtureNarrowsIt.textContent = \"Last commit message\";",
 " nextFixtureNarrowsIt.style.setProperty(\"width\", \"400px\");",
 " [heldFixtureNarrowsIt, nextFixtureNarrowsIt].forEach(function(cellFixtureNarrowsIt) {",
 "  cellFixtureNarrowsIt.style.setProperty(\"font-size\", \"12px\");",
 "  cellFixtureNarrowsIt.style.setProperty(\"padding\", \"0\");",
 "  cellFixtureNarrowsIt.style.setProperty(\"text-align\", \"left\");",
 "  rowFixtureNarrowsIt.appendChild(cellFixtureNarrowsIt);",
 " });",
 " document.body.appendChild(tableFixtureNarrowsIt);",
 "})();"
].join("\n");

var heldHeading = "#held--__-unlikely_-_name-__--held";

test("a viewport step sizes the page for every step after it, until another one changes it", function () {
 var answer = runApart({
  fixture_Viewport_HoldsForWhatFollows: {
   url: "fixture:article.html",
   steps: [
    { run: true },
    windowIs("1280x720"),
    { viewport: { width: 1024, height: 720 } },
    { run: true },
    windowIs("1024x720"),
    { wait: 200 },
    { run: true },
    windowIs("1024x720"),
    { viewport: { width: 400, height: 800 } },
    { run: true },
    windowIs("400x800")
   ]
  }
 }, ["--all"], undefined, windowSource);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
});

test("the entry's own size comes back when it ends, and the next entry meets the default", function () {
 var answer = runApart({
  fixture_Viewport_A_Narrows: {
   url: "fixture:article.html",
   capture: true,
   steps: [{ viewport: { width: 800, height: 600 } }, { run: true }, windowIs("800x600")]
  },
  fixture_Viewport_B_Follows: { url: "fixture:article.html", steps: [{ run: true }, windowIs("1280x720")] }
 }, ["--all"], undefined, windowSource);
 assert.ok(answer.report, answer.run.out + answer.run.err);
 var narrows = answer.report.results.filter(function (r) { return r.name === "fixture_Viewport_A_Narrows"; })[0];
 var follows = answer.report.results.filter(function (r) { return r.name === "fixture_Viewport_B_Follows"; })[0];
 assert.strictEqual(narrows.verdict, "pass", narrows.reason);
 assert.strictEqual(follows.verdict, "pass", follows.reason);
 var said = narrows.capture.timeline.map(function (t) { return t.what; });
 assert.ok(said.indexOf("step 1: viewport 800x600") >= 0, "the timeline names the size the step asked for:\n" + said.join("\n"));
 assert.strictEqual(said[said.length - 1], "the viewport goes back to 1280x720",
  "the default comes back last, once the entry's steps are done:\n" + said.join("\n"));
});

test("clear at a narrower window fails where the default width passes, which is what the step is for", function () {
 var answer = runApart({
  fixture_Viewport_ClearAtDefault: {
   url: "fixture:article.html",
   steps: [{ run: true }, { expect: { selector: heldHeading, clear: true } }]
  },
  fixture_Viewport_ClearAtNarrow: {
   url: "fixture:article.html",
   steps: [
    { run: true },
    { expect: { selector: heldHeading, clear: true } },
    { viewport: { width: 1024, height: 720 } },
    { expect: { selector: heldHeading, clear: true } }
   ]
  }
 }, ["--all"], undefined, narrowingSource);
 assert.ok(answer.report, answer.run.out + answer.run.err);
 var wide = answer.report.results.filter(function (r) { return r.name === "fixture_Viewport_ClearAtDefault"; })[0];
 var narrow = answer.report.results.filter(function (r) { return r.name === "fixture_Viewport_ClearAtNarrow"; })[0];
 assert.strictEqual(wide.verdict, "pass", wide.reason);
 assert.strictEqual(narrow.verdict, "fail");
 assert.match(narrow.reason, /^step 4: #held--__-unlikely_-_name-__--held paints [\d.]+px of text past its own box, over th/,
  "the clear at the default passed, and the one after the step failed");
 assert.match(narrow.reason, /"Last commit message"/);
});

test("a viewport that is not a width and a height of whole pixels a window could have is refused", function () {
 refuses({
  fixture_Pass_AddsAPanel: {
   steps: [
    { viewport: "1024x720" },
    { viewport: { width: 1024 } },
    { viewport: { width: 1024.5, height: 720 } },
    { viewport: { width: 1024, height: 20 } },
    { viewport: { width: 1024, height: 720, scale: 2 } }
   ]
  }
 }, new RegExp([
  "step 1: viewport takes \\{ \"width\": <pixels>, \"height\": <pixels> \\}",
  "step 2: viewport takes a height of whole pixels from 100 to 4000",
  "step 3: viewport takes a width of whole pixels from 100 to 4000",
  "step 4: viewport takes a height of whole pixels from 100 to 4000",
  "step 5: viewport has no scale - it takes width and height"
 ].join("[\\s\\S]*")));
});

// ----------------------------------------------------------------------------------------------- //
// A host the entry answers, and a page the entry takes apart
// ----------------------------------------------------------------------------------------------- //

// A bookmarklet that asks a host for something and writes what it was told onto the page, so an
// entry answering that host can be seen to have been the one that answered. The .invalid name never
// resolves, so a run with nothing answering it reaches no network and says so on the page, which is
// what makes handing the host back something an assertion can see. It writes into one element
// rather than appending, so a second paste overwrites the first answer rather than sitting under it.
var askingSource = [
 "javascript:(function() {",
 " var sayFixtureAnswerReadsIt = function(text) {",
 "  var panelFixtureAnswerReadsIt = document.getElementById(\"answer--__-unlikely_-_name-__--answer\");",
 "  if (!panelFixtureAnswerReadsIt) {",
 "   panelFixtureAnswerReadsIt = document.createElement(\"p\");",
 "   panelFixtureAnswerReadsIt.id = \"answer--__-unlikely_-_name-__--answer\";",
 "   document.body.appendChild(panelFixtureAnswerReadsIt);",
 "  }",
 "  panelFixtureAnswerReadsIt.textContent = text;",
 " };",
 " fetch(\"https://api.collector.invalid/thing\").then(function(answer) {",
 "  return answer.text().then(function(body) {",
 "   sayFixtureAnswerReadsIt(answer.status + \" \" + body);",
 "  });",
 " }).catch(function() { sayFixtureAnswerReadsIt(\"nothing arrived\"); });",
 "})();"
].join("\n");

var askedHost = "api.collector.invalid";
var askedNetwork = [{ host: askedHost, reason: "a fixture showing a host the entry answers itself" }];
var answerPanel = "#answer--__-unlikely_-_name-__--answer";

function runAsking(entries) {
 return runApart(entries, ["--all"], undefined, askingSource);
}

var refusals = 0;

function refuses(config, expected) {
 var bad = path.join(os.tmpdir(), "test-bm-refused-" + (++refusals) + "-" + process.pid + ".json");
 fs.writeFileSync(bad, JSON.stringify(config));
 try {
  var run = runHarness(["--list"], fixtureEnv(bad));
  assert.strictEqual(run.status, 2, "a configuration error exits 2:\n" + run.out + run.err);
  assert.match(run.err, expected);
 } finally {
  fs.rmSync(bad, { force: true });
 }
}

test("a host the entry answers is answered by the entry, with the status and the body it names", function () {
 var answer = runAsking({
  fixture_Answer_ReadsIt: {
   url: "fixture:article.html",
   network: askedNetwork,
   steps: [
    { answer: { host: askedHost, status: 403, contentType: "application/json; charset=utf-8",
     body: "{\"message\":\"API rate limit exceeded\"}" } },
    { run: true },
    { wait: 1500 },
    { expect: { selector: answerPanel, text: "403 {\"message\":\"API rate limit exceeded\"}" } }
   ]
  }
 });
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
});

test("a host handed back to the network is no longer answered by the entry", function () {
 var answer = runAsking({
  fixture_Answer_HandsItBack: {
   url: "fixture:article.html",
   network: askedNetwork,
   steps: [
    { answer: { host: askedHost, status: 200, body: "a listing" } },
    { run: true },
    { wait: 1500 },
    { expect: { selector: answerPanel, text: "200 a listing" } },
    { answer: { host: askedHost, pass: true } },
    { run: true },
    { wait: 3000 },
    { expect: { selector: answerPanel, text: "nothing arrived" } }
   ]
  }
 });
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
});

test("requests counts what the bookmarklet sent to a host, since the last count of the same host", function () {
 var answer = runAsking({
  fixture_Answer_CountsThem: {
   url: "fixture:article.html",
   network: askedNetwork,
   steps: [
    { answer: { host: askedHost, status: 200, body: "a listing" } },
    { run: true },
    { wait: 1500 },
    { expect: { requests: askedHost, count: 1 } },
    { run: true },
    { wait: 1500 },
    { expect: { requests: askedHost, count: 1 } },
    { expect: { requests: askedHost, count: 0 } },
    { expect: { requests: askedHost, atMost: 2 } }
   ]
  }
 });
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
});

// A name standing for several hosts counts every host it stands for. The entry's network and an
// answer step both read "*." and a domain that way, so a count that read it as a host of its own
// would say nothing was sent while the same name was answering the requests.
test("a name standing for subdomains counts the requests sent to each of them", function () {
 var answer = runAsking({
  fixture_Answer_CountsSubdomains: {
   url: "fixture:article.html",
   network: [{ host: "*.collector.invalid", reason: "a fixture showing a host the entry answers itself" }],
   steps: [
    { answer: { host: "*.collector.invalid", status: 200, body: "a listing" } },
    { run: true },
    { wait: 1500 },
    { expect: { selector: answerPanel, text: "200 a listing" } },
    { expect: { requests: "*.collector.invalid", count: 1 } },
    { expect: { requests: "*.collector.invalid", count: 0 } }
   ]
  }
 });
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
});

test("a count of requests that is wrong fails, naming what was sent and what was wanted", function () {
 var answer = runAsking({
  fixture_Answer_CountsWrong: {
   url: "fixture:article.html",
   network: askedNetwork,
   steps: [
    { answer: { host: askedHost, status: 200, body: "a listing" } },
    { run: true },
    { wait: 1500 },
    { expect: { requests: askedHost, count: 3 } }
   ]
  }
 });
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /made 1 request to api\.collector\.invalid since the page opened, not 3$/);
});

test("atMost bounds a count rather than fixing it, and says so when the bound is passed", function () {
 var answer = runAsking({
  fixture_Answer_BoundsThem: {
   url: "fixture:article.html",
   network: askedNetwork,
   steps: [
    { answer: { host: askedHost, status: 200, body: "a listing" } },
    { run: true },
    { run: true },
    { wait: 2000 },
    { expect: { requests: askedHost, atMost: 1 } }
   ]
  }
 });
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /made 2 requests to api\.collector\.invalid since the page opened, more than the 1 this allows$/);
});

test("a detached piece of the page goes back where it came from, not merely back on the page", function () {
 var answer = runApart({
  fixture_Detach_PutsItBack: {
   url: "fixture:article.html",
   steps: [
    { run: true },
    { detach: "h2#routes", as: "routes" },
    { expect: { selector: "h2#routes", count: 0 } },
    { attach: "routes" },
    { expect: { selector: "h2#routes", count: 1 } },
    { expect: { selector: "h2#routes + p.try-styling", count: 1 } }
   ]
  }
 }, ["--all"]);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
});

test("a detach that matches nothing fails the entry rather than passing quietly", function () {
 var answer = runApart({
  fixture_Detach_MatchesNothing: {
   url: "fixture:article.html",
   steps: [{ run: true }, { detach: "#no-such-thing-is-here" }]
  }
 }, ["--all"]);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /nothing to detach: #no-such-thing-is-here matches nothing on the page$/);
});

test("an attach naming nothing an earlier step detached is a configuration error", function () {
 refuses({ fixture_Pass_AddsAPanel: { steps: [{ attach: "routes" }] } },
  /nothing earlier in this entry detached routes/);
});

test("a host handed back that nothing earlier answered is a configuration error", function () {
 refuses({
  fixture_Pass_AddsAPanel: {
   network: [{ host: "api.collector.invalid", reason: "a fixture" }],
   steps: [{ answer: { host: "api.collector.invalid", pass: true } }]
  }
 }, /nothing earlier in this entry answers api\.collector\.invalid/);
});

test("answering a host the entry does not name in its network is a configuration error", function () {
 refuses({
  fixture_Pass_AddsAPanel: { steps: [{ answer: { host: "api.collector.invalid", status: 403 } }] }
 }, /api\.collector\.invalid is answered by this entry and not named in its network/);
});

test("an answer that both answers a host and hands it back is a configuration error", function () {
 refuses({
  fixture_Pass_AddsAPanel: {
   network: [{ host: "api.collector.invalid", reason: "a fixture" }],
   steps: [{ answer: { host: "api.collector.invalid", status: 403, pass: true } }]
  }
 }, /answer either hands the host back to the network or answers it, never both/);
});

test("a count of requests aimed at a selector is a configuration error", function () {
 refuses({
  fixture_Pass_AddsAPanel: { steps: [{ expect: { requests: "api.collector.invalid", selector: "p", count: 1 } }] }
 }, /requests counts what the bookmarklet sent, and takes no selector/);
});

test("a count of requests with neither a count nor a bound is a configuration error", function () {
 refuses({
  fixture_Pass_AddsAPanel: { steps: [{ expect: { requests: "api.collector.invalid" } }] }
 }, /requests takes count, the number of requests to that host, or atMost, a bound on it/);
});

// ----------------------------------------------------------------------------------------------- //
// Another engine
// ----------------------------------------------------------------------------------------------- //

// Firefox is an install step of its own, npx playwright install firefox, which a machine may never
// have taken. The tests that run it say so and skip there, as the short tests do without ffmpeg; the
// ones that only read the configuration, or ask for an engine that is not there, run everywhere.
function hasFirefox() {
 try {
  return fs.existsSync(require("playwright").firefox.executablePath());
 } catch (err) {
  return false;
 }
}

var noFirefox = "firefox is not installed for Playwright here: npx playwright install firefox";

function resultsNamed(answer, name) {
 assert.ok(answer.report, "the run should have written a report:\n" + answer.run.out + answer.run.err);
 return answer.report.results.filter(function (r) { return r.name === name; });
}

test("--browser takes chromium or firefox, and nothing else, and goes with neither --sign-in nor --short", function () {
 var odd = runHarness(["--list", "--browser", "webkit"], fixtureEnv());
 assert.strictEqual(odd.status, 2);
 assert.match(odd.err, /--browser takes chromium or firefox/);
 var signIn = runHarness(["--sign-in", "fixture-site", "--browser", "firefox"], fixtureEnv());
 assert.strictEqual(signIn.status, 2);
 assert.match(signIn.err, /--sign-in opens the sign-in launcher's own browser, and takes no --browser/);
 var short = runHarness(["--all", "--short", "--browser", "firefox"], fixtureEnv());
 assert.strictEqual(short.status, 2);
 assert.match(short.err, /--short records in chromium, the browser the shorts are made in/);
});

test("browsers takes known engines, each once, and chromium alone for an entry with auth", function () {
 refuses({
  fixture_Pass_AddsAPanel: { browsers: [] },
  fixture_Origin_UsesStorageAndLocation: { browsers: ["chromium", "webkit"] },
  fixture_Popup_OpensANewTab: { browsers: ["firefox", "firefox"] },
  fixture_Selection_AnchorsTheSelection: { browsers: "firefox" },
  fixture_Auth_MarksTheSignedInPage: { auth: "fixture-site", signedIn: "body", browsers: ["chromium", "firefox"] }
 }, new RegExp([
  "fixture_Pass_AddsAPanel: browsers takes a list of engines",
  "fixture_Origin_UsesStorageAndLocation: browsers has no engine \"webkit\" - it takes chromium or firefox",
  "fixture_Popup_OpensANewTab: browsers names firefox twice",
  "fixture_Selection_AnchorsTheSelection: browsers takes a list of engines",
  "fixture_Auth_MarksTheSignedInPage: an entry with auth runs in chromium only"
 ].join("[\\s\\S]*")));
 var listed = runApart({ fixture_Engine_Listed: { url: "fixture:article.html", browsers: ["chromium", "firefox"] } }, ["--list"]);
 assert.strictEqual(listed.run.status, 0, listed.run.err);
 assert.match(listed.run.out, /fixture_Engine_Listed\s+configured\s+fixture:article\.html  browsers chromium, firefox/);
});

test("an engine Playwright has no build of stops the run before any entry, naming the install step", function () {
 var empty = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-no-browsers-"));
 try {
  var answer = runApart({ fixture_Engine_NotThere: { url: "fixture:article.html" } }, ["--all", "--browser", "firefox"],
   { PLAYWRIGHT_BROWSERS_PATH: empty });
  assert.strictEqual(answer.run.status, 2, answer.run.out + answer.run.err);
  assert.match(answer.run.err, /firefox is not installed for Playwright - run npx playwright install firefox/);
  assert.strictEqual(answer.report, null, "no entry ran, so no report was written");
 } finally {
  removeDir(empty);
 }
});

test("--browser firefox runs every entry in firefox, says so, and reads a throw back to its line", function (t) {
 if (!hasFirefox()) { t.skip(noFirefox); return; }
 var answer = runApart({
  fixture_Engine_WritesTheValue: setEntry([
   { run: true },
   { expect: { selector: setPanel, text: "label: as published" } },
   { run: { set: { labelFixtureSetsIt: "from the entry" } } },
   { expect: { selector: setPanel, text: "label: from the entry" } }
  ]),
  fixture_Engine_ThrowsAtItsLine: setEntry([{ run: { set: { labelFixtureSetsIt: setLong } } }])
 }, ["--all", "--browser", "firefox"], undefined, setSource);
 assert.ok(answer.report, answer.run.out + answer.run.err);
 assert.strictEqual(answer.report.browser, "firefox");
 assert.deepStrictEqual(answer.report.browsers, ["firefox"]);
 assert.strictEqual(answer.report.injected, "evaluate", "firefox keeps the sourceURL tag, so page.evaluate is the way in");
 var writes = resultsNamed(answer, "fixture_Engine_WritesTheValue");
 var throws = resultsNamed(answer, "fixture_Engine_ThrowsAtItsLine");
 assert.strictEqual(writes.length, 1);
 assert.strictEqual(writes[0].browser, "firefox");
 assert.strictEqual(writes[0].verdict, "pass", writes[0].reason);
 assert.strictEqual(throws[0].verdict, "fail");
 assert.match(throws[0].reason, /^the bookmarklet threw: .*\(line 10\)$/,
  "firefox's stack names the bookmarklet by its sourceURL, so the line is read back as in chromium");
 assert.match(answer.run.out, /fixture_Engine_WritesTheValue \[firefox\]\s+pass/);
 var failures = failureFileOf(answer.run);
 assert.match(failures, /## fixture_Engine_ThrowsAtItsLine \[firefox\]\n\n[\s\S]*- \*\*Browser\*\*: firefox - run it again with `--browser firefox`/);
});

test("an entry asking for firefox runs in both engines, and everything else in chromium alone", function (t) {
 if (!hasFirefox()) { t.skip(noFirefox); return; }
 var entries = {
  fixture_Engine_AsksForBoth: {
   url: "fixture:article.html",
   scheduled: true,
   browsers: ["chromium", "firefox"],
   steps: [{ viewport: { width: 1024, height: 720 } }, { run: true }, windowIs("1024x720")]
  },
  fixture_Engine_AsksForNothing: { url: "fixture:article.html", scheduled: true, steps: [{ run: true }, windowIs("1280x720")] }
 };
 var scheduled = runApart(entries, ["--scheduled"], undefined, windowSource);
 var both = resultsNamed(scheduled, "fixture_Engine_AsksForBoth");
 var plain = resultsNamed(scheduled, "fixture_Engine_AsksForNothing");
 assert.deepStrictEqual(both.map(function (r) { return r.browser; }), ["chromium", "firefox"]);
 assert.deepStrictEqual(plain.map(function (r) { return r.browser; }), ["chromium"]);
 both.concat(plain).forEach(function (r) { assert.strictEqual(r.verdict, "pass", r.browser + ": " + r.reason); });
 assert.deepStrictEqual(scheduled.report.browsers, ["chromium", "firefox"]);

 var named = runApart(entries, ["--scheduled", "--browser", "chromium"], undefined, windowSource);
 assert.deepStrictEqual(named.report.results.map(function (r) { return r.browser; }), ["chromium", "chromium"],
  "--browser names the one engine for every entry, whatever an entry asks for");
});

test("in firefox every request to another host after the run is the bookmarklet's, and a count of them is a skip", function (t) {
 if (!hasFirefox()) { t.skip(noFirefox); return; }
 var answer = runApart({
  fixture_Engine_NamesNothing: { url: "fixture:article.html", steps: [{ run: true }, { wait: 1500 }] },
  fixture_Engine_NamesTheHost: {
   url: "fixture:article.html",
   network: askedNetwork,
   steps: [
    { answer: { host: askedHost, status: 200, body: "a listing" } },
    { run: true },
    { wait: 1500 },
    { expect: { selector: answerPanel, text: "200 a listing" } }
   ]
  },
  fixture_Engine_CountsThem: {
   url: "fixture:article.html",
   network: askedNetwork,
   steps: [{ run: true }, { wait: 500 }, { expect: { requests: askedHost, count: 1 } }]
  }
 }, ["--all", "--browser", "firefox"], undefined, askingSource);
 var unnamed = resultsNamed(answer, "fixture_Engine_NamesNothing")[0];
 var named = resultsNamed(answer, "fixture_Engine_NamesTheHost")[0];
 var counts = resultsNamed(answer, "fixture_Engine_CountsThem")[0];
 assert.strictEqual(unnamed.verdict, "fail");
 assert.match(unnamed.reason, /^sends a request to api\.collector\.invalid, a host other than the page's own/);
 assert.strictEqual(named.verdict, "pass", named.reason);
 assert.strictEqual(counts.verdict, "skip");
 assert.match(counts.reason, /only chromium says which code sent a request - firefox would count the page's own as well/);
});

test("an entry with auth is a skip in firefox, and the sign-in launcher is never loaded for it", function (t) {
 if (!hasFirefox()) { t.skip(noFirefox); return; }
 // A launcher named by a path that holds nothing is a configuration error the moment it is loaded,
 // so a run that ends in a skip is a run that never loaded it.
 var nowhere = path.join(os.tmpdir(), "test-bm-no-launcher-" + process.pid, "missing-launcher.mjs");
 var answer = runApart({
  fixture_Engine_SignedIn: { url: "fixture:article.html", auth: "fixture-site", signedIn: "body" }
 }, ["--all", "--browser", "firefox"], { TEST_BM_AUTH_LAUNCHER: nowhere });
 assert.strictEqual(answer.run.status, 0, answer.run.out + answer.run.err);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "skip");
 assert.strictEqual(result.reason, "an entry with auth runs in chromium only - the sign-in launcher gives a chromium browser");
});

test("firefox leaves out the clipboard permissions it has no name for, and its clipboard still works", function (t) {
 if (!hasFirefox()) { t.skip(noFirefox); return; }
 var clipSource = [
  "javascript:(function() {",
  " navigator.clipboard.writeText(\"copied by the fixture\");",
  "})();"
 ].join("\n");
 var answer = runApart({
  fixture_Engine_Copies: {
   url: "fixture:article.html",
   permissions: ["clipboard-read", "clipboard-write"],
   steps: [{ run: true }, { wait: 300 }, { expect: { clipboard: "copied by the fixture" } }]
  }
 }, ["--all", "--browser", "firefox"], undefined, clipSource);
 var result = onlyResult(answer);
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.ok(result.notes.indexOf("firefox has no clipboard-read or clipboard-write permission to grant: its clipboard is open to the page") >= 0,
  result.notes.join("\n"));
});

// ----------------------------------------------------------------------------------------------- //
// A bookmarklet run first, the pointer, and what a bookmarklet stores
// ----------------------------------------------------------------------------------------------- //

// A run of bookmarklets of more than one shape, each file written under its own name, with a
// configuration of its own. It is what a test needs when one bookmarklet runs first and another
// reads what the first one added. Whatever the run wrote beside its report comes back with it.
function runFiles(files, entries, args, env) {
 var js = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-files-"));
 try {
  Object.keys(files).forEach(function (name) { fs.writeFileSync(path.join(js, name + ".js"), files[name]); });
  var config = path.join(js, "test-bm.json");
  fs.writeFileSync(config, JSON.stringify(entries));
  var run = runHarness(args, Object.assign({ TEST_BM_JS_DIR: js, TEST_BM_CONFIG: config }, env || {}));
  var answer = { run: run, report: null, summary: "", failures: "" };
  var named = /^report: (.+)$/m.exec(run.out);
  if (named) {
   var folder = path.join(rootDir, named[1].replace(/\//g, path.sep));
   answer.report = JSON.parse(fs.readFileSync(path.join(folder, "report.json"), "utf8"));
   answer.summary = fs.readFileSync(path.join(folder, "summary.txt"), "utf8");
   if (fs.existsSync(path.join(folder, "failure.md"))) {
    answer.failures = fs.readFileSync(path.join(folder, "failure.md"), "utf8");
   }
  }
  return answer;
 } finally {
  removeDir(js);
 }
}

function resultIn(answer, name) {
 assert.ok(answer.report, "the run should have written a report:\n" + answer.run.out + answer.run.err);
 var found = answer.report.results.filter(function (r) { return r.name === name; });
 assert.strictEqual(found.length, 1, name + " should appear once in the report");
 return found[0];
}

// The same file, one copy under each name.
function copiesOf(source, names) {
 var files = {};
 names.forEach(function (name) { files[name] = source; });
 return files;
}

var noteSelector = "#note--__-unlikely_-_name-__--fixtureStepsFirst";
var stepsMark = "#mark--__-unlikely_-_name-__--fixtureStepsWorker";
var stepsLink = "#link--__-unlikely_-_name-__--fixtureStepsWorker";
var sampleNote = "Sample Note: a placeholder for the test";

// Run first: a notebox for the other one to save, the way a note-taking bookmarklet adds one.
var firstSource = [
 "javascript:(function() {",
 " /* Run first by the step kinds fixture: a notebox for the other one to save. */",
 " var boxFixtureStepsFirst = document.createElement(\"textarea\");",
 " boxFixtureStepsFirst.id = \"note--__-unlikely_-_name-__--fixtureStepsFirst\";",
 " document.body.appendChild(boxFixtureStepsFirst);",
 "})();"
].join("\n");

// Saves what that notebox holds, adds a link that copies its own address, and marks where a pointer
// went over the page and which button it pressed on the heading.
var workerSource = [
 "javascript:(function() {",
 " /* The step kinds fixture: it saves the notebox run first, copies a link's address, and marks",
 "    each way a pointer reaches the page. */",
 " var boxFixtureStepsWorker = document.getElementById(\"note--__-unlikely_-_name-__--fixtureStepsFirst\");",
 " var markFixtureStepsWorker = document.createElement(\"div\");",
 " markFixtureStepsWorker.id = \"mark--__-unlikely_-_name-__--fixtureStepsWorker\";",
 " document.body.appendChild(markFixtureStepsWorker);",
 " if (boxFixtureStepsWorker) {",
 "  localStorage.setItem(\"fixtureStepsWorker\" + location.pathname, \"saved: \" + boxFixtureStepsWorker.value);",
 " }",
 " var linkFixtureStepsWorker = document.createElement(\"a\");",
 " linkFixtureStepsWorker.id = \"link--__-unlikely_-_name-__--fixtureStepsWorker\";",
 " linkFixtureStepsWorker.setAttribute(\"href\", \"#saved-notes\");",
 " linkFixtureStepsWorker.textContent = \"| # |\";",
 " linkFixtureStepsWorker.addEventListener(\"click\", function (ev) {",
 "  ev.preventDefault();",
 "  navigator.clipboard.writeText(linkFixtureStepsWorker.href);",
 " });",
 " document.body.appendChild(linkFixtureStepsWorker);",
 " document.addEventListener(\"mouseover\", function (ev) {",
 "  markFixtureStepsWorker.setAttribute(\"data-over\", ev.target.id || \"none\");",
 " });",
 " var headFixtureStepsWorker = document.querySelector(\"h1\");",
 " headFixtureStepsWorker.addEventListener(\"mousedown\", function (ev) {",
 "  var boxFixtureStepsWorkerHead = headFixtureStepsWorker.getBoundingClientRect();",
 "  var offFixtureStepsWorker = ev.clientX - (boxFixtureStepsWorkerHead.left + boxFixtureStepsWorkerHead.width / 2);",
 "  markFixtureStepsWorker.setAttribute(\"data-button\", String(ev.button));",
 "  markFixtureStepsWorker.setAttribute(\"data-side\", offFixtureStepsWorker > 20 ? \"right\" : \"centre\");",
 " });",
 "})();"
].join("\n");

var stepsRun = null;

// One run of every step kind case, shared by the assertions below, so the suite starts one browser
// for all of them.
function stepsReport() {
 if (stepsRun) { return stepsRun; }
 var files = copiesOf(workerSource, ["fixture_Steps_Worker", "fixture_Steps_StorageMismatch",
  "fixture_Steps_ClipboardShape", "fixture_Steps_FirstThrows"]);
 files.fixture_Steps_First = firstSource;
 files.fixture_Steps_Thrower = fs.readFileSync(path.join(rootDir, jsDir, "fixture_Throw_ReadsAMissingThing.js"), "utf8");
 var beforeTheRun = [
  { bookmarklet: "fixture_Steps_First" },
  { expect: { selector: noteSelector, count: 1 } },
  { fill: noteSelector, value: sampleNote },
  { run: true }
 ];
 stepsRun = runFiles(files, {
  fixture_Steps_First: { url: "fixture:article.html" },
  fixture_Steps_Thrower: { url: "fixture:article.html", skip: "run only as another entry's first bookmarklet" },
  fixture_Steps_Worker: {
   url: "fixture:article.html",
   permissions: ["clipboard-read", "clipboard-write"],
   steps: beforeTheRun.concat([
    { expect: { storage: "local", newKeys: 1, valueIncludes: sampleNote } },
    { expect: { storage: "local", newKeys: 0 } },
    { hover: "h2", withText: "Routes" },
    { expect: { selector: stepsMark + "[data-over='routes']", count: 1 } },
    { click: "h1", button: "right", at: { dx: 200, dy: 0 } },
    { expect: { selector: stepsMark + "[data-button='2'][data-side='right']", count: 1 } },
    { click: stepsLink },
    { wait: 300 },
    { expect: { clipboard: { selector: stepsLink, attr: "href" } } },
    { expect: { clipboard: { startsWith: "https://fixtures.test/", singleLine: true, nonEmpty: true } } }
   ])
  },
  fixture_Steps_StorageMismatch: {
   url: "fixture:article.html",
   steps: beforeTheRun.concat([{ expect: { storage: "local", valueIncludes: "words the note never held" } }])
  },
  fixture_Steps_ClipboardShape: {
   url: "fixture:article.html",
   permissions: ["clipboard-read", "clipboard-write"],
   steps: [{ run: true }, { click: stepsLink }, { wait: 300 }, { expect: { clipboard: { startsWith: "javascript:" } } }]
  },
  fixture_Steps_FirstThrows: {
   url: "fixture:article.html",
   steps: [{ bookmarklet: "fixture_Steps_Thrower" }, { run: true }]
  }
 }, ["--all"]);
 return stepsRun;
}

test("a bookmarklet step runs another bookmarklet first in the same page, and its storage is counted and removed", function () {
 var result = resultIn(stepsReport(), "fixture_Steps_Worker");
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.strictEqual(resultIn(stepsReport(), "fixture_Steps_First").verdict, "pass");
});

test("hover picks a match by its own text, and a click can press another button at an offset from the centre", function () {
 // Both are inside the passing entry above: a hover that landed on the wrong heading, or a click
 // that pressed the left button in the middle, fails its expect and the entry with it.
 var result = resultIn(stepsReport(), "fixture_Steps_Worker");
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.strictEqual(result.errors.length, 0);
});

test("a stored value that does not hold the text fails with counts, and never says what was stored", function () {
 var result = resultIn(stepsReport(), "fixture_Steps_StorageMismatch");
 assert.strictEqual(result.verdict, "fail");
 assert.strictEqual(result.reason, "step 5: a new localStorage key does not hold \"words the note never held\"");
 assert.doesNotMatch(JSON.stringify(result), /saved: Sample Note/);
});

test("a clipboard compared by its shape fails without saying what the clipboard held", function () {
 var result = resultIn(stepsReport(), "fixture_Steps_ClipboardShape");
 assert.strictEqual(result.verdict, "fail");
 assert.strictEqual(result.reason, "step 4: the clipboard does not start with \"javascript:\"");
 assert.doesNotMatch(JSON.stringify(result), /saved-notes/);
});

test("a bookmarklet run first that throws fails the entry, and says it was the one run first", function () {
 var result = resultIn(stepsReport(), "fixture_Steps_FirstThrows");
 assert.strictEqual(result.verdict, "fail");
 assert.match(result.reason, /^step 1: fixture_Steps_Thrower, run first, threw: /);
});

test("a bookmarklet step names another bookmarklet that is there, and the new step shapes are checked first", function () {
 var answer = runFiles(copiesOf(workerSource, ["fixture_Steps_Worker", "fixture_Steps_First",
  "fixture_Steps_StorageMismatch", "fixture_Steps_ClipboardShape"]), {
  fixture_Steps_Worker: { url: "fixture:article.html", steps: [{ bookmarklet: "fixture_Steps_Missing" }, { run: true }] },
  fixture_Steps_First: { url: "fixture:article.html", steps: [{ bookmarklet: "fixture_Steps_First" }, { run: true }] },
  fixture_Steps_StorageMismatch: { url: "fixture:article.html", steps: [{ bookmarklet: "fixture_Steps_First" }] },
  fixture_Steps_ClipboardShape: {
   url: "fixture:article.html",
   steps: [
    { hover: "h1", button: "right" },
    { click: "h1", at: { dx: "far", dy: 0 } },
    { expect: { clipboard: { selector: "a" } } },
    { expect: { storage: "cookie", newKeys: 1 } },
    { expect: { selector: "a", newKeys: 1 } }
   ]
  }
 }, ["--list"]);
 assert.strictEqual(answer.run.status, 2, "a configuration error exits 2");
 var err = answer.run.err;
 assert.match(err, /fixture_Steps_Worker step 1: there is no .*fixture_Steps_Missing\.js to run first/);
 assert.match(err, /fixture_Steps_First step 1: bookmarklet runs another bookmarklet first, and a run step runs this one/);
 assert.match(err, /fixture_Steps_StorageMismatch: a bookmarklet step runs another bookmarklet first, so the entry names its own run with a run step/);
 assert.match(err, /fixture_Steps_ClipboardShape step 1: button goes with a click/);
 assert.match(err, /fixture_Steps_ClipboardShape step 2: at takes a dx of CSS pixels/);
 assert.match(err, /fixture_Steps_ClipboardShape step 3: clipboard takes a selector and an attr together/);
 assert.match(err, /fixture_Steps_ClipboardShape step 4: storage takes local or session/);
 assert.match(err, /fixture_Steps_ClipboardShape step 5: newKeys goes with storage/);
});

// ----------------------------------------------------------------------------------------------- //
// The everyday browser
// ----------------------------------------------------------------------------------------------- //

// What a page could have shown, in words the stub hands back where a verdict holds none. If any of
// them reaches a report, a summary or the output, the harness kept something it should have dropped.
var pageWords = "Jane Doe watched Sample Video 42 from 123 Main Street";

// A stand-in for the maintainer's everyday driver. It opens nothing: it answers each entry by name,
// and writes down the job the harness handed it so the assertions can read it back. It is written
// into the temporary folder because the harness refuses a driver inside the repository.
var driverSource = [
 "import fs from \"node:fs\";",
 "import path from \"node:path\";",
 "import { fileURLToPath } from \"node:url\";",
 "var here = path.dirname(fileURLToPath(import.meta.url));",
 "var page = " + JSON.stringify(pageWords) + ";",
 "var said = {",
 " fixture_Everyday_Passes: { verdict: \"pass\", reason: \"kept only for a fail or a skip\", realRuns: 1,",
 "  inputs: [{ step: 3, via: \"desktop\" }, { step: 9, via: \"desktop\" }, { step: 1, via: \"telepathy\" }] },",
 " fixture_Everyday_Fails: { verdict: \"fail\", reason: \"step 3 (check) did not hold\", realRuns: 1 },",
 " fixture_Everyday_SignInWall: { verdict: \"skip\", reason: \"sign-in wall\", realRuns: 1 },",
 " fixture_Everyday_Chatty: { verdict: \"fail\", reason: \"step 1 (check) did not hold\", text: page, title: page,",
 "  steps: [{ text: page }], facts: { title: page }, inputs: [{ step: 1, via: \"cdp\", text: page }] },",
 " fixture_Everyday_NoVerdict: { verdict: \"maybe\", reason: page }",
 "};",
 "export async function run(job) {",
 " fs.writeFileSync(path.join(here, job.name + \".json\"), JSON.stringify(job));",
 " if (job.name == \"fixture_Everyday_Throws\") { throw new Error(\"the route could not be reached\"); }",
 " return said[job.name];",
 "}"
].join("\n") + "\n";

function makeDriver(source) {
 var dir = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-stub-driver-"));
 var file = path.join(dir, "stub-driver.mjs");
 fs.writeFileSync(file, source === undefined ? driverSource : source);
 return { dir: dir, file: file };
}

var passSource = fs.readFileSync(path.join(rootDir, jsDir, "fixture_Pass_AddsAPanel.js"), "utf8");
var everydayUrl = "https://www.example.com/";

var everydayScenarios = {
 fixture_Everyday_Passes: {
  url: everydayUrl, drive: "everyday", requires: ["main"], timeout: 20000, dialogs: [{ accept: true }],
  steps: [{ bookmarklet: "fixture_Everyday_Fails" }, { run: true }, { hover: "h1", via: "desktop" },
   { expect: { selector: "main", count: 1 } }]
 },
 fixture_Everyday_Fails: { url: everydayUrl, drive: "everyday" },
 fixture_Everyday_SignInWall: {
  url: everydayUrl + "feed/history", drive: "everyday", personal: true, signedIn: "#account",
  steps: [{ run: true }, { expect: { selector: "#panel", hidden: true } }]
 },
 fixture_Everyday_Chatty: { url: everydayUrl, drive: "everyday", steps: [{ click: "main" }] },
 fixture_Everyday_Throws: { url: everydayUrl, drive: "everyday" },
 fixture_Everyday_NoVerdict: { url: everydayUrl, drive: "everyday" },
 fixture_Everyday_Skipped: { url: everydayUrl, drive: "everyday", skip: "kept back by its own entry" }
};

var everydayRun = null;

// One run of every everyday case through the stub. Every entry is an everyday one, so the run
// starts no browser at all.
function everydayReport() {
 if (everydayRun) { return everydayRun; }
 var driver = makeDriver();
 try {
  var answer = runFiles(copiesOf(passSource, Object.keys(everydayScenarios)), everydayScenarios, ["--all"],
   { _TEST_BM_EVERYDAY_DRIVER: driver.file });
  answer.jobs = {};
  Object.keys(everydayScenarios).forEach(function (name) {
   var file = path.join(driver.dir, name + ".json");
   answer.jobs[name] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
  });
  everydayRun = answer;
  return answer;
 } finally {
  removeDir(driver.dir);
 }
}

test("an everyday entry is a skip, never a failure, when no everyday driver is set", function () {
 var answer = runFiles(copiesOf(passSource, ["fixture_Everyday_Fails"]),
  { fixture_Everyday_Fails: { url: everydayUrl, drive: "everyday" } }, ["--all"]);
 assert.strictEqual(answer.run.status, 0, answer.run.out + answer.run.err);
 var result = resultIn(answer, "fixture_Everyday_Fails");
 assert.strictEqual(result.verdict, "skip");
 assert.strictEqual(result.reason, "no everyday driver: _TEST_BM_EVERYDAY_DRIVER is not set");
 assert.strictEqual(result.drive, "everyday");
});

test("an everyday entry is handed to the driver whole, and the driver's pass is the entry's pass", function () {
 var result = resultIn(everydayReport(), "fixture_Everyday_Passes");
 assert.strictEqual(result.verdict, "pass", result.reason);
 assert.strictEqual(result.reason, "", "a pass keeps no reason");
 assert.strictEqual(result.personal, false);
 assert.deepStrictEqual(result.inputs, [{ step: 3, via: "desktop" }], "only an input for one of the entry's own steps is kept");
 assert.strictEqual(result.realRuns, 1);

 var job = everydayReport().jobs.fixture_Everyday_Passes;
 assert.ok(job, "the driver should have been handed the entry");
 assert.ok(path.isAbsolute(job.file) && /fixture_Everyday_Passes\.js$/.test(job.file), job.file);
 assert.doesNotMatch(job.code, /\n/, "the code is the one line the harness checked");
 assert.doesNotMatch(job.code, /^\s*javascript:/i, "the code is what runs, without its scheme");
 assert.strictEqual(job.url, everydayUrl);
 assert.deepStrictEqual(job.requires, ["main"]);
 assert.deepStrictEqual(job.steps, everydayScenarios.fixture_Everyday_Passes.steps);
 assert.deepStrictEqual(job.dialogs, [{ accept: true }]);
 assert.strictEqual(job.timeout, 20000);
 assert.strictEqual(job.settle, 500);
 assert.strictEqual(job.personal, false);
 assert.strictEqual(job.signedIn, "");
 assert.deepStrictEqual(Object.keys(job.bookmarklets), ["fixture_Everyday_Fails"]);
 assert.ok(path.isAbsolute(job.bookmarklets.fixture_Everyday_Fails.file));
 assert.doesNotMatch(job.bookmarklets.fixture_Everyday_Fails.code, /\n/);
});

test("the driver's fail is the entry's fail, with the driver's own reason, written up without the page", function () {
 var answer = everydayReport();
 var result = resultIn(answer, "fixture_Everyday_Fails");
 assert.strictEqual(result.verdict, "fail");
 assert.strictEqual(result.reason, "step 3 (check) did not hold");
 assert.strictEqual(answer.run.status, 1, "a failed entry fails the run");
 var section = sectionOf(answer.failures, "fixture_Everyday_Fails");
 assert.match(section, /\*\*Everyday browser\*\*: run by the everyday driver - nothing the page showed is in this report/);
 assert.match(section, /### What the everyday driver said/);
});

test("the driver's skip, such as a sign-in wall, is the entry's skip with its reason, and a personal page says so", function () {
 var result = resultIn(everydayReport(), "fixture_Everyday_SignInWall");
 assert.strictEqual(result.verdict, "skip");
 assert.strictEqual(result.reason, "sign-in wall");
 assert.strictEqual(result.personal, true);
 var job = everydayReport().jobs.fixture_Everyday_SignInWall;
 assert.strictEqual(job.personal, true);
 assert.strictEqual(job.signedIn, "#account");
});

test("nothing but the verdict, the reason, the inputs and the real runs reaches the report", function () {
 var answer = everydayReport();
 var result = resultIn(answer, "fixture_Everyday_Chatty");
 assert.strictEqual(result.verdict, "fail");
 assert.strictEqual(result.reason, "step 1 (check) did not hold");
 assert.deepStrictEqual(result.inputs, [{ step: 1, via: "cdp" }]);
 var words = new RegExp(pageWords.split(" ").slice(0, 3).join(" "));
 assert.doesNotMatch(JSON.stringify(answer.report), words, "report.json");
 assert.doesNotMatch(answer.summary, words, "summary.txt");
 assert.doesNotMatch(answer.failures, words, "failure.md");
 assert.doesNotMatch(answer.run.out + answer.run.err, words, "the run's own output");
});

test("a driver that throws or gives no verdict fails the entry, and a skipped entry never reaches the driver", function () {
 var answer = everydayReport();
 var threw = resultIn(answer, "fixture_Everyday_Throws");
 assert.strictEqual(threw.verdict, "fail");
 assert.strictEqual(threw.reason, "the everyday driver failed: the route could not be reached");
 var none = resultIn(answer, "fixture_Everyday_NoVerdict");
 assert.strictEqual(none.verdict, "fail");
 assert.strictEqual(none.reason, "the everyday driver gave no verdict");
 var kept = resultIn(answer, "fixture_Everyday_Skipped");
 assert.strictEqual(kept.verdict, "skip");
 assert.strictEqual(kept.reason, "kept back by its own entry");
 assert.strictEqual(answer.jobs.fixture_Everyday_Skipped, null, "a skipped entry is never handed to the driver");
});

test("a driver named by a relative path, inside the repository, or with no run function is refused before anything runs", function () {
 var one = { fixture_Everyday_Fails: { url: everydayUrl, drive: "everyday" } };
 var files = copiesOf(passSource, ["fixture_Everyday_Fails"]);
 var relative = runFiles(files, one, ["--all"], { _TEST_BM_EVERYDAY_DRIVER: "everyday.mjs" });
 assert.strictEqual(relative.run.status, 2, relative.run.out + relative.run.err);
 assert.match(relative.run.err, /_TEST_BM_EVERYDAY_DRIVER must be an absolute path/);

 var inside = runFiles(files, one, ["--all"], { _TEST_BM_EVERYDAY_DRIVER: path.join(rootDir, "test", "harness.test.js") });
 assert.strictEqual(inside.run.status, 2, inside.run.out + inside.run.err);
 assert.match(inside.run.err, /_TEST_BM_EVERYDAY_DRIVER must name a file outside the repository/);

 var driver = makeDriver("export function launch() { return null; }\n");
 try {
  var noRun = runFiles(files, one, ["--all"], { _TEST_BM_EVERYDAY_DRIVER: driver.file });
  assert.strictEqual(noRun.run.status, 2, noRun.run.out + noRun.run.err);
  assert.match(noRun.run.err, /the everyday driver has no run function/);
 } finally {
  removeDir(driver.dir);
 }

 // A driver named by a path that holds nothing is a configuration error the moment it is loaded, so
 // a run of only a skipped entry that ends in a skip is a run that never loaded it.
 var nowhere = path.join(os.tmpdir(), "test-bm-no-driver-" + process.pid, "missing-driver.mjs");
 var skipped = runFiles(files, { fixture_Everyday_Fails: { url: everydayUrl, drive: "everyday", skip: "kept back" } },
  ["--all"], { _TEST_BM_EVERYDAY_DRIVER: nowhere });
 assert.strictEqual(skipped.run.status, 0, skipped.run.out + skipped.run.err);
 assert.strictEqual(resultIn(skipped, "fixture_Everyday_Fails").reason, "kept back");
});

test("an everyday entry is never scheduled, signs in to nothing, records nothing, and opens a site's own page", function () {
 var entries = {
  fixture_Everyday_Scheduled: { drive: "everyday", url: everydayUrl, scheduled: true },
  fixture_Everyday_Auth: { drive: "everyday", url: everydayUrl, auth: "fixture-site", signedIn: "main" },
  fixture_Everyday_Capture: { drive: "everyday", url: everydayUrl, capture: true },
  fixture_Everyday_Permissions: { drive: "everyday", url: everydayUrl, permissions: ["clipboard-read"] },
  fixture_Everyday_Network: { drive: "everyday", url: everydayUrl, network: [{ host: "api.example.com", reason: "its own API" }] },
  fixture_Everyday_Fixture: { drive: "everyday", url: "fixture:article.html" },
  fixture_Everyday_Firefox: { drive: "everyday", url: everydayUrl, browsers: ["chromium", "firefox"] },
  fixture_Everyday_Prompt: { drive: "everyday", url: everydayUrl, dialogs: [{ accept: true, text: "Bob" }] },
  fixture_Everyday_Keys: {
   drive: "everyday", url: everydayUrl,
   steps: [{ press: "Enter" }, { press: "Escape", selector: "main" }, { select: "p" }, { expect: { location: "example" } }]
  },
  fixture_Everyday_Sometimes: { drive: "sometimes", url: everydayUrl }
 };
 var answer = runFiles(copiesOf(passSource, Object.keys(entries)), entries, ["--list"]);
 assert.strictEqual(answer.run.status, 2, "a configuration error exits 2");
 var err = answer.run.err;
 assert.match(err, /fixture_Everyday_Scheduled: an everyday entry is never scheduled/);
 assert.match(err, /fixture_Everyday_Auth: an everyday entry takes no auth/);
 assert.match(err, /fixture_Everyday_Capture: an everyday entry captures nothing/);
 assert.match(err, /fixture_Everyday_Permissions: an everyday entry grants no permissions/);
 assert.match(err, /fixture_Everyday_Network: an everyday entry names no network/);
 assert.match(err, /fixture_Everyday_Fixture: an everyday entry opens a site's own https page/);
 assert.match(err, /fixture_Everyday_Firefox: an everyday entry runs in the everyday browser, which is Chrome/);
 assert.match(err, /fixture_Everyday_Prompt: dialog 1: an everyday entry types into no prompt/);
 assert.match(err, /fixture_Everyday_Keys step 1: an everyday entry presses only Tab, Escape/);
 assert.match(err, /fixture_Everyday_Keys step 2: an everyday entry presses a key where the focus is/);
 assert.match(err, /fixture_Everyday_Keys step 3: an everyday entry has no select step/);
 assert.match(err, /fixture_Everyday_Keys step 4: an everyday entry has no expect on location/);
 assert.match(err, /fixture_Everyday_Sometimes: drive takes "everyday"/);
});

test("a personal page is kept to selectors, counts and states, and via and check go only in an everyday entry", function () {
 var entries = {
  fixture_Personal_NoSignedIn: { drive: "everyday", personal: true, url: everydayUrl },
  fixture_Personal_Reads: {
   drive: "everyday", personal: true, signedIn: "#account", url: everydayUrl,
   steps: [
    { hover: "h2", withText: "Routes" },
    { click: "h1", via: "desktop" },
    { run: true },
    { expect: { selector: "h1", text: "Jane" } },
    { expect: { clipboard: "copied" } },
    { expect: { storage: "local", valueIncludes: "Sample" } },
    { expect: { selector: "a", matches: "p" } },
    { expect: { check: "sample-check" } }
   ]
  },
  fixture_Personal_NoDrive: { personal: true, url: "fixture:article.html" },
  fixture_Outside_Via: { url: "fixture:article.html", steps: [{ click: "h1", via: "desktop" }, { expect: { check: "sample-check" } }] }
 };
 var answer = runFiles(copiesOf(passSource, Object.keys(entries)), entries, ["--list"]);
 assert.strictEqual(answer.run.status, 2, "a configuration error exits 2");
 var err = answer.run.err;
 assert.match(err, /fixture_Personal_NoSignedIn: a personal everyday entry names signedIn/);
 var kept = "a personal page is kept to selectors, counts and states, so it takes no ";
 assert.match(err, new RegExp("fixture_Personal_Reads step 1: " + kept + "withText"));
 assert.match(err, new RegExp("fixture_Personal_Reads step 2: " + kept + "desktop input"));
 assert.match(err, new RegExp("fixture_Personal_Reads step 4: " + kept + "expect on text"));
 assert.match(err, new RegExp("fixture_Personal_Reads step 5: " + kept + "expect on the clipboard"));
 assert.match(err, new RegExp("fixture_Personal_Reads step 6: " + kept + "valueIncludes"));
 assert.match(err, new RegExp("fixture_Personal_Reads step 7: " + kept + "matches"));
 assert.match(err, new RegExp("fixture_Personal_Reads step 8: " + kept + "check"));
 assert.match(err, /fixture_Personal_NoDrive: personal goes with drive everyday/);
 assert.match(err, /fixture_Outside_Via step 1: via says how the everyday driver sends a step's input, and goes in an entry with drive everyday/);
 assert.match(err, /fixture_Outside_Via step 2: check names a check the everyday driver holds, and goes in an entry with drive everyday/);
});

test("--list names an everyday entry and counts it", function () {
 var entries = {
  fixture_Everyday_Fails: { drive: "everyday", url: everydayUrl },
  fixture_Everyday_SignInWall: { drive: "everyday", url: everydayUrl, personal: true, signedIn: "#account" }
 };
 var answer = runFiles(copiesOf(passSource, Object.keys(entries)), entries, ["--list"]);
 assert.strictEqual(answer.run.status, 0, answer.run.err);
 assert.match(answer.run.out, /fixture_Everyday_Fails\s+everyday\s+https:\/\/www\.example\.com\/  drive everyday/);
 assert.match(answer.run.out, /fixture_Everyday_SignInWall\s+everyday\s+https:\/\/www\.example\.com\/  drive everyday  personal/);
 assert.match(answer.run.out, /2 bookmarklets, 2 configured, 0 scheduled, 0 signed in, 2 everyday/);
});

// ----------------------------------------------------------------------------------------------- //
// Entries kept out of every run: deprecated, and tested by hand
// ----------------------------------------------------------------------------------------------- //

// Every file here is the fixture whose line comment fails the parse, so an entry the harness checked
// or ran would fail rather than pass. A launcher and a driver named by paths that hold nothing, and
// a Playwright that has no browser to start, would each stop the run at once if anything reached
// for them. A run that ends in exit 0 is a run that reached for none of them.
var keptSource = fs.readFileSync(path.join(rootDir, jsDir, "fixture_Comment_LineCommentSwallowsIt.js"), "utf8");
var keptEntries = {
 fixture_Kept_SiteFeature: { deprecated: { why: "the site now has this feature itself" } },
 fixture_Kept_Replaced: { deprecated: { see: "https://example.org/the-replacement" } },
 fixture_Kept_Mailbox: {
  byHand: "it works on a signed-in mailbox, so a person tests and updates it",
  url: "https://www.example.com/", drive: "everyday", personal: true, signedIn: "#account",
  steps: [{ run: true }, { expect: { selector: "#panel", count: 1 } }]
 },
 fixture_Kept_SignedIn: {
  byHand: "it works on a signed-in dashboard, so a person tests and updates it",
  url: "fixture:article.html", auth: "fixture-site", signedIn: "main", browsers: ["chromium"]
 }
};

function keptApart(entries, args, extra) {
 var empty = fs.mkdtempSync(path.join(os.tmpdir(), "test-bm-kept-no-browsers-"));
 var nowhere = path.join(os.tmpdir(), "test-bm-kept-nowhere-" + process.pid);
 try {
  return runFiles(copiesOf(keptSource, Object.keys(entries)), entries, args, Object.assign({
   PLAYWRIGHT_BROWSERS_PATH: empty,
   TEST_BM_AUTH_LAUNCHER: path.join(nowhere, "missing-launcher.mjs"),
   _TEST_BM_EVERYDAY_DRIVER: path.join(nowhere, "missing-driver.mjs")
  }, extra || {}));
 } finally {
  removeDir(empty);
 }
}

test("a deprecated or by-hand entry is never run by --all: no check, no browser, no launcher, no driver", function () {
 var answer = keptApart(keptEntries, ["--all"]);
 assert.strictEqual(answer.run.status, 0, answer.run.out + answer.run.err);

 var feature = resultIn(answer, "fixture_Kept_SiteFeature");
 assert.strictEqual(feature.verdict, "deprecated");
 assert.strictEqual(feature.reason, "the site now has this feature itself");
 var replaced = resultIn(answer, "fixture_Kept_Replaced");
 assert.strictEqual(replaced.verdict, "deprecated");
 assert.strictEqual(replaced.reason, "replaced by https://example.org/the-replacement");
 assert.strictEqual(replaced.see, "https://example.org/the-replacement");
 var mailbox = resultIn(answer, "fixture_Kept_Mailbox");
 assert.strictEqual(mailbox.verdict, "by-hand");
 assert.strictEqual(mailbox.reason, "it works on a signed-in mailbox, so a person tests and updates it");
 assert.strictEqual(resultIn(answer, "fixture_Kept_SignedIn").verdict, "by-hand");

 answer.report.results.forEach(function (r) {
  assert.doesNotMatch(r.notes.join("\n"), /one line: /, "the file of " + r.name + " was never checked");
 });
 assert.deepStrictEqual(answer.report.browsers, [], "no engine ran anything");
 assert.strictEqual(answer.report.counts.deprecated, 2);
 assert.strictEqual(answer.report.counts.byHand, 2);
 assert.strictEqual(answer.report.counts.failed, 0);
 assert.match(answer.summary, /^test-bm: 4 run, 0 passed, 0 failed, 0 skipped, 2 deprecated, 2 by hand$/m);
 assert.match(answer.summary, /^fixture_Kept_Replaced\s+deprecated\s.*replaced by https:\/\/example\.org\/the-replacement$/m);
});

test("a deprecated or by-hand entry is never run by its name, --short or --scheduled either", function () {
 var one = keptApart(keptEntries, ["fixture_Kept_Mailbox"]);
 assert.strictEqual(one.run.status, 0, one.run.out + one.run.err);
 assert.match(one.run.out, /^fixture_Kept_Mailbox\s+by-hand\s.*it works on a signed-in mailbox, so a person tests and updates it$/m);
 var deprecated = keptApart(keptEntries, ["fixture_Kept_SiteFeature"]);
 assert.strictEqual(deprecated.run.status, 0, deprecated.run.out + deprecated.run.err);
 assert.match(deprecated.run.out, /^fixture_Kept_SiteFeature\s+deprecated\s.*the site now has this feature itself$/m);

 var shorts = shortsFolder();
 try {
  var short = keptApart(keptEntries, ["--all", "--short"], { TEST_BM_SHORTS_DIR: shorts });
  assert.strictEqual(short.run.status, 0, short.run.out + short.run.err);
  assert.ok(resultIn(short, "fixture_Kept_SiteFeature").notes.indexOf("no short: a deprecated bookmarklet is not recorded") >= 0);
  assert.ok(resultIn(short, "fixture_Kept_Mailbox").notes
   .indexOf("no short: a bookmarklet tested by hand is recorded by a person, never by a run") >= 0);
  short.report.results.forEach(function (r) { assert.strictEqual(r.short, undefined, r.name + " has no short"); });
  assert.deepStrictEqual(fs.readdirSync(shorts), [], "nothing was recorded");
 } finally {
  removeDir(shorts);
 }

 var scheduled = keptApart(keptEntries, ["--scheduled"]);
 assert.strictEqual(scheduled.run.status, 0, scheduled.run.out + scheduled.run.err);
 assert.strictEqual(scheduled.report.results.length, 0, "neither kind is ever scheduled");
});

test("--list names a deprecated and a by-hand entry, and counts each under its own word only", function () {
 var answer = runFiles(copiesOf(keptSource, Object.keys(keptEntries)), keptEntries, ["--list"]);
 assert.strictEqual(answer.run.status, 0, answer.run.err);
 assert.match(answer.run.out, /fixture_Kept_SiteFeature\s+deprecated\s+the site now has this feature itself/);
 assert.match(answer.run.out, /fixture_Kept_Replaced\s+deprecated\s+replaced by https:\/\/example\.org\/the-replacement/);
 assert.match(answer.run.out, /fixture_Kept_Mailbox\s+by-hand\s+it works on a signed-in mailbox, so a person tests and updates it/);
 assert.match(answer.run.out, /4 bookmarklets, 4 configured, 0 scheduled, 0 signed in, 0 everyday, 2 deprecated, 2 by hand/);
});

test("each way a deprecated or by-hand entry is written wrong is a configuration error, named", function () {
 var entries = {
  fixture_Kept_NotAnObject: { deprecated: "the site does this now" },
  fixture_Kept_Neither: { deprecated: {} },
  fixture_Kept_Both: { deprecated: { why: "the site now has this feature itself", see: "https://example.org/" } },
  fixture_Kept_Unknown: { deprecated: { why: "the site now has this feature itself", link: "https://example.org/" } },
  fixture_Kept_EmptyWhy: { deprecated: { why: " " } },
  fixture_Kept_PlainSee: { deprecated: { see: "http://example.org/the-replacement" } },
  fixture_Kept_HoldsMore: { deprecated: { why: "the site now has this feature itself" }, url: "fixture:article.html", steps: [{ run: true }] },
  fixture_Kept_BothKeys: { deprecated: { why: "the site now has this feature itself" }, byHand: "a person tests it" },
  fixture_Kept_EmptyByHand: { byHand: "" },
  fixture_Kept_ByHandSkip: { byHand: "a person tests it", skip: "kept back" },
  fixture_Kept_ByHandScheduled: { byHand: "a person tests it", url: "fixture:article.html", scheduled: true },
  fixture_Kept_ByHandCapture: { byHand: "a person tests it", url: "fixture:article.html", capture: true }
 };
 var answer = runFiles(copiesOf(keptSource, Object.keys(entries)), entries, ["--list"]);
 assert.strictEqual(answer.run.status, 2, "a configuration error exits 2");
 assert.strictEqual(answer.run.out, "", "nothing is listed once the configuration is refused");
 [
  "fixture_Kept_NotAnObject: deprecated takes { \"why\": <the reason> } or { \"see\": <the address of what replaces it> }",
  "fixture_Kept_Neither: deprecated takes why, the reason, or see, the address of what replaces it",
  "fixture_Kept_Both: deprecated takes why or see, not both",
  "fixture_Kept_Unknown: deprecated has no link - it takes why or see",
  "fixture_Kept_EmptyWhy: deprecated why takes the reason",
  "fixture_Kept_PlainSee: deprecated see takes the https address of what replaces it",
  "fixture_Kept_HoldsMore: a deprecated entry holds nothing else, since nothing runs it - url, steps",
  "fixture_Kept_BothKeys: deprecated and byHand - an entry is one or the other",
  "fixture_Kept_EmptyByHand: byHand takes the reason a person tests it rather than a run",
  "fixture_Kept_ByHandSkip: a by-hand entry is never run, so it takes no skip",
  "fixture_Kept_ByHandScheduled: a by-hand entry is never run, so it is never scheduled",
  "fixture_Kept_ByHandCapture: a by-hand entry is never run, so it captures nothing"
 ].forEach(function (said) {
  assert.ok(answer.run.err.indexOf(said) >= 0, "the error should say: " + said + "\n" + answer.run.err);
 });
});

// ----------------------------------------------------------------------------------------------- //
// No sign-in in test-bm.json
// ----------------------------------------------------------------------------------------------- //

// A value that stands for a credential. If it reaches anything the run wrote or printed, the
// refusal said what it refused.
var heldSecret = "s3cret-the-run-must-never-repeat";

// Every file a run left in its own folder, read as one text.
function runFolderText(run) {
 var named = /^report: (.+)$/m.exec(run.out);
 assert.ok(named, "the run should name the report it wrote:\n" + run.out + run.err);
 var dir = path.join(rootDir, named[1].replace(/\//g, path.sep));
 var text = "";
 (function read(at) {
  fs.readdirSync(at).forEach(function (f) {
   var full = path.join(at, f);
   if (fs.statSync(full).isDirectory()) { read(full); } else if (/\.(json|txt|md)$/.test(f)) { text += fs.readFileSync(full, "utf8"); }
  });
 })(dir);
 return text;
}

test("a url that carries a sign-in is a configuration error that never repeats the address", function () {
 ["https://demo-user:" + heldSecret + "@example.com/", "https://" + heldSecret + "@example.com/inbox",
  "https:\\demo-user:" + heldSecret + "@example.com/"].forEach(function (url) {
  var answer = runApart({ fixture_Pass_AddsAPanel: { url: url } }, ["--list"]);
  assert.strictEqual(answer.run.status, 2, "a configuration error exits 2:\n" + answer.run.out + answer.run.err);
  assert.strictEqual(answer.run.out, "", "nothing is listed once the configuration is refused");
  assert.match(answer.run.err, /fixture_Pass_AddsAPanel: url carries a sign-in/);
  assert.strictEqual((answer.run.out + answer.run.err).indexOf(heldSecret), -1, "the address is never repeated");
  assert.strictEqual((answer.run.out + answer.run.err).indexOf("demo-user"), -1, "nor the name in it");
 });
});

test("an address that only holds an @ after its host is not a sign-in", function () {
 var answer = runApart({ fixture_Pass_AddsAPanel: { url: "https://example.com/team/@jane?to=jane@example.com" } }, ["--list"]);
 assert.strictEqual(answer.run.status, 0, answer.run.err);
});

// Adds a password field, and a field marked for a new password, for a fill step to aim at.
var passwordSource = [
 "javascript:(function(){",
 " /* A fixture that adds the two kinds of password field a fill must never type into. */",
 " var formPasswordFieldsAdded = document.createElement(\"div\");",
 " formPasswordFieldsAdded.id = \"fields--__-unlikely_-_name-__--fixturePasswordFields\";",
 " var plainPasswordFieldsAdded = document.createElement(\"input\");",
 " plainPasswordFieldsAdded.type = \"text\";",
 " plainPasswordFieldsAdded.id = \"plain--__-unlikely_-_name-__--fixturePasswordFields\";",
 " var typedPasswordFieldsAdded = document.createElement(\"input\");",
 " typedPasswordFieldsAdded.type = \"password\";",
 " typedPasswordFieldsAdded.id = \"typed--__-unlikely_-_name-__--fixturePasswordFields\";",
 " var newPasswordFieldsAdded = document.createElement(\"input\");",
 " newPasswordFieldsAdded.type = \"text\";",
 " newPasswordFieldsAdded.setAttribute(\"autocomplete\", \"section-acme new-password\");",
 " newPasswordFieldsAdded.id = \"new--__-unlikely_-_name-__--fixturePasswordFields\";",
 " var labelPasswordFieldsAdded = document.createElement(\"label\");",
 " labelPasswordFieldsAdded.id = \"label--__-unlikely_-_name-__--fixturePasswordFields\";",
 " labelPasswordFieldsAdded.appendChild(document.createTextNode(\"Password\"));",
 " var labelledPasswordFieldsAdded = document.createElement(\"input\");",
 " labelledPasswordFieldsAdded.setAttribute(\"autocomplete\", \"current-password\");",
 " labelPasswordFieldsAdded.appendChild(labelledPasswordFieldsAdded);",
 " formPasswordFieldsAdded.appendChild(plainPasswordFieldsAdded);",
 " formPasswordFieldsAdded.appendChild(typedPasswordFieldsAdded);",
 " formPasswordFieldsAdded.appendChild(newPasswordFieldsAdded);",
 " formPasswordFieldsAdded.appendChild(labelPasswordFieldsAdded);",
 " document.body.appendChild(formPasswordFieldsAdded);",
 "})();",
 ""
].join("\n");

function passwordField(which) { return "#" + which + "--__-unlikely_-_name-__--fixturePasswordFields"; }

test("a fill into a password field fails the entry before it types, and never repeats the value", function () {
 var answer = runApart({
  fixture_Password_Typed: { url: "fixture:article.html", steps: [{ fill: passwordField("typed"), value: heldSecret }] },
  fixture_Password_New: { url: "fixture:article.html", steps: [{ fill: { selector: passwordField("new"), value: heldSecret } }] },
  fixture_Password_Label: { url: "fixture:article.html", steps: [{ wait: 1 }, { fill: passwordField("label"), text: heldSecret }] },
  fixture_Password_Plain: { url: "fixture:article.html", steps: [{ fill: passwordField("plain"), value: "a placeholder line" }] }
 }, ["--all"], undefined, passwordSource);
 assert.ok(answer.report, "the run should have written a report:\n" + answer.run.out + answer.run.err);
 function reasonOf(name) {
  var found = answer.report.results.filter(function (r) { return r.name === name; });
  assert.strictEqual(found.length, 1, name + " should appear once in the report");
  return found[0];
 }
 [["fixture_Password_Typed", 1], ["fixture_Password_New", 1], ["fixture_Password_Label", 2]].forEach(function (pair) {
  var result = reasonOf(pair[0]);
  assert.strictEqual(result.verdict, "fail");
  assert.strictEqual(result.reason, "step " + pair[1] + " fills a password field");
 });
 assert.strictEqual(reasonOf("fixture_Password_Plain").verdict, "pass", "a plain field is typed into as before");
 assert.match(answer.run.out, /fixture_Password_Typed\s+fail\s+\S+\s+step 1 fills a password field/);
 assert.strictEqual((answer.run.out + answer.run.err).indexOf(heldSecret), -1, "the value is never printed");
 assert.strictEqual(runFolderText(answer.run).indexOf(heldSecret), -1, "nor written into the run's folder");
});
