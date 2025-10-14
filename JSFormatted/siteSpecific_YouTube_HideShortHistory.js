javascript:(function() {
 /* Global  variables. */
 var shortParentHideShortHistroy = /* select parent tag of short history */
  "ytd-reel-shelf-renderer";

  var docBodyHideShortHistory = /* select the documen body tag */
  document.getElementsByTagName("body");

  var styleHideShortHistory =   /* style to add to page */
  `
  ${shortParentHideShortHistroy} {
    display: none;
  }
 `;

 /* To ensure current page in browse is youtube history */
 var currentPageHideShortHistory =
  location.href.toLowerCase();
 var historyHideShortHistory     = /* ensure on history page */
  "youtube.com/feed/history";

 /************************************* SUPPORT FUNCTIONS *************************************/
 
 /* Ensure current page is youtube history.  */
 const checkIfYouTubeHistoryHideShortHistory = () => {
  if (currentPageHideShortHistory.indexOf(historyHideShortHistory) > -1) {
   return true;
  } else {
   return false;
  }
 };

 /* Add style element to page. */
 const addStyleTagHideShortHistory = () => {
  let doc = docBodyHideShortHistory[0]; /* body element */
  let sTag = document.createElement("style"); /* create sytle tag   */  
  sTag.innerText = styleHideShortHistory; /* use data from variable */
  /* insert into page */
  doc.insertAdjacentElement("afterbegin", sTag);
 };

 /*********************************************************************************************
                                          MAIN FUNCTION
 *********************************************************************************************/
 function hideShortHistory() {
  /* check if current page is history feed */
  if (checkIfYouTubeHistoryHideShortHistory() == true) {
   /* on history continue bookmarklet */
   setTimeout(addStyleTagHideShortHistory, 100); /* delay a bit */
  } else {
   /* do nothing */
   let skip;
  }
 }

 /* Call main function. */
 hideShortHistory();
})();
