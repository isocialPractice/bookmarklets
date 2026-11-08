javascript:(function() {
 /* A fixture that works, so the harness has a pass to report. It also turns itself off on a second
    run, which is how the two run steps in the fixture configuration tell a toggle from a stack. */
 var idFixturePassAddsAPanel = "panel--__-unlikely_-_name-__--fixturePassAddsAPanel";
 var foundFixturePassAddsAPanel = document.getElementById(idFixturePassAddsAPanel);
 if (foundFixturePassAddsAPanel) {
  foundFixturePassAddsAPanel.remove();
  return;
 }
 var panelFixturePassAddsAPanel = document.createElement("div");
 panelFixturePassAddsAPanel.id = idFixturePassAddsAPanel;
 panelFixturePassAddsAPanel.textContent = "the fixture ran";
 panelFixturePassAddsAPanel.style.setProperty("position", "fixed");
 panelFixturePassAddsAPanel.style.setProperty("top", "0");
 panelFixturePassAddsAPanel.style.setProperty("left", "0");
 panelFixturePassAddsAPanel.style.setProperty("padding", "4px 8px");
 panelFixturePassAddsAPanel.style.setProperty("background", "#f6f8fa");
 document.body.appendChild(panelFixturePassAddsAPanel);
})();
