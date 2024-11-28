javascript:(function() {
 /* Simple process; select body, make style element, add CSS rules, and insert. */
 var videoPageBodyElement = document.getElementsByTagName("body");

 /* Create an HTML style tag to insert into page. */
 var styleVideoBottomControls = document.createElement("style");
 
 /* Make CSS rules to use for bottom controls. */
 var cssVideoBottomControls = `
  /* style control text */
  div.ytp-time-display span {
   color: black;
  }

  /* style elements in controls */
  div.ytp-progress-bar-container + div.ytp-chrome-controls {
   color: black;    
  }

  /* style control icons */
  div.ytp-progress-bar-container + div.ytp-chrome-controls path {
   fill: black; 
  }

  /* style toggle */
  div.ytp-autonav-toggle-button {
   background: black !important;
  }
`;

/* Add CSS rules to the created style tag. */
styleVideoBottomControls.innerText = cssVideoBottomControls;

videoPageBodyElement[0] /* insert the style tag after body element begins. */
.insertAdjacentElement("afterbegin", styleVideoBottomControls);
})();
