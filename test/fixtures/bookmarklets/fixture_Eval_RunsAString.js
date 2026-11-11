javascript:(function() {
 /* A fixture that runs a string as code, which no bookmarklet may do, so the harness has the
    refusal to report before any browser starts. */
 var sumFixtureEvalRunsAString = eval("1 + 1");
 document.title = String(sumFixtureEvalRunsAString);
})();
