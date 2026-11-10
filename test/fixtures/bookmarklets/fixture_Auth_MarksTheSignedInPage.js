javascript:(function() {
 /* A fixture for an entry with auth. It marks the page it runs on, which is all such an entry needs
    to show the harness reached the page through the sign-in launcher and ran the bookmarklet there. */
 var idFixtureAuthMarksTheSignedInPage = "mark--__-unlikely_-_name-__--fixtureAuthMarksTheSignedInPage";
 var markFixtureAuthMarksTheSignedInPage = document.createElement("p");
 markFixtureAuthMarksTheSignedInPage.id = idFixtureAuthMarksTheSignedInPage;
 markFixtureAuthMarksTheSignedInPage.textContent = "the signed-in fixture ran";
 document.body.appendChild(markFixtureAuthMarksTheSignedInPage);
})();
