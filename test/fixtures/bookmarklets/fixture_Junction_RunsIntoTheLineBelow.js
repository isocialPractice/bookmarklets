javascript:(function() {
 /* A fixture whose line ends mid-expression and whose next line starts hard against the margin. It
    parses with each break replaced by a space, the way bookmarklet.js copy joins it, and not with
    the break taken out and nothing in its place, which is what a bookmarks bar does. */
 var stopsFixtureJunctionRunsIntoTheLineBelow = { depot: 1, library: 3 };
 var seenFixtureJunctionRunsIntoTheLineBelow = 0;
 for (var keyFixtureJunctionRunsIntoTheLineBelow in
stopsFixtureJunctionRunsIntoTheLineBelow) { seenFixtureJunctionRunsIntoTheLineBelow++; }
 document.title = "seen " + seenFixtureJunctionRunsIntoTheLineBelow;
})();
