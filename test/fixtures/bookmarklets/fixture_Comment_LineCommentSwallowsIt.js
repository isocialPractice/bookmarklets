javascript:(function() {
 /* A fixture carrying a line comment, which swallows everything after it once the line breaks are
    gone. Neither join parses, and the harness names the line the comment is on. */
 var seenFixtureCommentLineCommentSwallowsIt = 1;
 // this line comment is the defect
 document.title = "seen " + seenFixtureCommentLineCommentSwallowsIt;
})();
