javascript:(function() {
 /* A fixture that only works on a real origin. Local storage throws on an opaque origin, which is
    what a file:// page has, so this one passing is what says the fixture pages are being served
    rather than opened. */
 var keyFixtureOriginUsesStorageAndLocation = "fixtureOriginUsesStorageAndLocation";
 localStorage.setItem(keyFixtureOriginUsesStorageAndLocation, "kept");
 var keptFixtureOriginUsesStorageAndLocation =
  localStorage.getItem(keyFixtureOriginUsesStorageAndLocation);
 localStorage.removeItem(keyFixtureOriginUsesStorageAndLocation);
 var markFixtureOriginUsesStorageAndLocation = document.getElementById("target");
 if (markFixtureOriginUsesStorageAndLocation) {
  markFixtureOriginUsesStorageAndLocation.textContent =
   keptFixtureOriginUsesStorageAndLocation + " at " + location.origin;
 }
})();
