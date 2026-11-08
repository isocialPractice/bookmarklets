javascript:(function() {
 /* A fixture that reads a selection and puts it in the address, so a run can be shown to make a
    selection and to see where the page ended up. Nothing else here reads either one. */
 var heldFixtureSelectionAnchorsTheSelection = String(window.getSelection() || "").trim();
 if (!heldFixtureSelectionAnchorsTheSelection) {
  heldFixtureSelectionAnchorsTheSelection = "nothing-selected";
 }
 location.hash = "selected=" + encodeURIComponent(heldFixtureSelectionAnchorsTheSelection);
})();
