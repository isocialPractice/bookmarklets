javascript:(function() {
 /* A fixture that opens a page in a new tab, the way a bookmarklet that picks a link and opens it
    does, so the harness has a new tab whose address it can expect. */
 var addressFixturePopupOpensANewTab = "https://fixtures.test/table.html";
 window.open(addressFixturePopupOpensANewTab, "_blank");
})();
