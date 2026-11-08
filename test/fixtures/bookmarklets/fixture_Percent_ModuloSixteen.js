javascript:(function() {
 /* A fixture holding a percent escape, which a URL field decodes before the code ever runs. Both
    joins parse; the modulo is what breaks, and only once the escape has been decoded. */
 var seenFixturePercentModuloSixteen = 0;
 for (var i = 0; i < 32; i++) {
  if (i%16 === 0) { seenFixturePercentModuloSixteen++; }
 }
 document.title = "seen " + seenFixturePercentModuloSixteen;
})();
