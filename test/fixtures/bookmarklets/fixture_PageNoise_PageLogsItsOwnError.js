javascript:(function() {
 /* A fixture that works on a page raising errors of its own, so the harness can be seen to record
    the page's console error and the page's uncaught error without failing the bookmarklet for
    either of them. */
 var markFixturePageNoisePageLogsItsOwnError = document.getElementById("target");
 if (markFixturePageNoisePageLogsItsOwnError) {
  markFixturePageNoisePageLogsItsOwnError.textContent = "the fixture ran";
 }
})();
