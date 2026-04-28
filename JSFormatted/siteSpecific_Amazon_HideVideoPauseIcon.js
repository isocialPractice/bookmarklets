javascript:(function() {
 /* Global variables */
 const playIconAmazonHideVideoPauseIcon = /* class name of pause icon */
  document.getElementsByClassName("vjs-big-play-button");

 /************************************* SUPPORT FUNCTIONS *************************************/
 /* Apply `display: none` to the element if pass playIconAmazonHideVideoPauseIcon check.     */
 const addDisplayNoneAmazonHideVideoPauseIcon = (cur) => {
  cur.setAttribute("style", "display: none"); /* style element, hiding it                    */
 };

 /* Check all elements with class name `vjs-big-play-button` and if not styled, apply style. */
 const hidePlayIconAmazonHideVideoPauseIcon = () => {
  let iconLen = playIconAmazonHideVideoPauseIcon.length; /* count all classes                */

  /* ensure there are elements with class name */
  if (iconLen > 0) {
   /* loop each with class, and add style display none */
   for (i = 0; i < iconLen; i++) {
    /* don't duplicate display none */
    if (playIconAmazonHideVideoPauseIcon[i].hasAttribute("style")) {
     if (playIconAmazonHideVideoPauseIcon[i].getAttribute("style")
         .indexOf("display: none") > -1) { /* check not passed - style is applied             */
      let skip;
     } else {
      /* add style="display: none"                                                            */
      addDisplayNoneAmazonHideVideoPauseIcon(playIconAmazonHideVideoPauseIcon[i]);
     }
    } else {
     /* add style="display: none"                                                             */
     addDisplayNoneAmazonHideVideoPauseIcon(playIconAmazonHideVideoPauseIcon[i]);
    }
   }
  } else {
   /* log no elements with class found */
   console.log("No play/pause icons with class `vjs-big-play-button` found.");
  }
 };

 /*********************************************************************************************
                                          MAIN FUNCTION
 *********************************************************************************************/
 /* Run support functions */
 function mainAmazonHideVideoPauseIcon() {
  /* run hidePlayIconAmazonHideVideoPauseIcon which checks and applies display: none */
  hidePlayIconAmazonHideVideoPauseIcon();
 }

 /* Run bookmarklet. */
 mainAmazonHideVideoPauseIcon();
})();
