// *********************************************************************************************** //
// harness.test                                                                                    //
// Check test-bm.js against bookmarklets whose verdict is known before the run starts.             //
// *********************************************************************************************** //
// Run with node --test test/harness.test.js, which npm test does ahead of the bookmarklets
// themselves. The file is named rather than discovered on purpose: node --test treats every .js
// file under a folder called test as a test file, and test/fixtures/bookmarklets holds eleven that
// are bookmarklets.
//
// No run here ever reaches a real sign-in. Every run clears TEST_BM_AUTH_LAUNCHER unless the test
// sets it, and the tests that set it point it at a stub written into the temporary folder, which
// signs in to nothing.
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
  env: Object.assign({}, process.env, { TEST_BM_AUTH_LAUNCHER: "" }, env || {})
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
 assert.match(run.out, /11 bookmarklets, 11 configured, 0 scheduled, 1 signed in/);
 assert.match(run.out, /fixture:article\.html/);
 assert.match(run.out, /fixture_Auth_MarksTheSignedInPage\s+signed in\s+fixture:article\.html  auth fixture-site/);
});

test("a run of the fixtures ends in failure, because five of them are meant to fail", function () {
 var counts = readReport().counts;
 assert.strictEqual(counts.run, 11);
 assert.strictEqual(counts.passed, 5);
 assert.strictEqual(counts.failed, 5);
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
 " return options.chromium.launchPersistentContext(profile, { headless: true });",
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
