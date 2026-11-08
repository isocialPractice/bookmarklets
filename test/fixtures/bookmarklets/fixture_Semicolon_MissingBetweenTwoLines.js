javascript:(function() {
 /* A fixture missing the semicolon between two statements. No join repairs that, so neither parses
    and the harness reports it without naming a junction. */
 var firstFixtureSemicolonMissingBetweenTwoLines = 1
 var secondFixtureSemicolonMissingBetweenTwoLines = 2;
 document.title = "sum " + (firstFixtureSemicolonMissingBetweenTwoLines
  + secondFixtureSemicolonMissingBetweenTwoLines);
})();
