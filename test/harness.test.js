// *********************************************************************************************** //
// harness.test                                                                                    //
// Check test-bm.js against bookmarklets whose verdict is known before the run starts.             //
// *********************************************************************************************** //
// Run with node --test test/harness.test.js, which npm test does ahead of the bookmarklets
// themselves. The file is named rather than discovered on purpose: node --test treats every .js
// file under a folder called test as a test file, and test/fixtures/bookmarklets holds nine that
// are bookmarklets.
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
  env: Object.assign({}, process.env, env || {})
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
 assert.match(run.out, /9 bookmarklets, 9 configured/);
 assert.match(run.out, /fixture:article\.html/);
});

test("a run of the fixtures ends in failure, because five of them are meant to fail", function () {
 var counts = readReport().counts;
 assert.strictEqual(counts.run, 9);
 assert.strictEqual(counts.passed, 4);
 assert.strictEqual(counts.failed, 5);
 assert.strictEqual(counts.skipped, 0);
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
