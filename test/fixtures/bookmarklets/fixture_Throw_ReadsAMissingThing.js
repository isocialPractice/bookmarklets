javascript:(function() {
 /* A fixture that throws, so the harness has a thrown error to report and a line to name it at. */
 var missingFixtureThrowReadsAMissingThing = document.getElementById("nothing-by-this-name");
 document.title = missingFixtureThrowReadsAMissingThing.textContent;
})();
