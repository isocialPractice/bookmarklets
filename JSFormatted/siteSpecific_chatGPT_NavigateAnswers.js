javascript: (function () {
 /* Configurable variables. */
 var incrementCountNavigateAnswers = "PageDown"; 
 var decrementCountNavigateAnswers = "PageUp"; 
 var alertWithInstructionsNavigateAnswers = 1;

 /* Start with odd index for getting answers. */
 var countNavigateAnswers = 1; 
 
 /* Enable use of traverse back and forth. */
 var firstRunNavigateAnswers = 0;
 
 /**************************************************************/
 /*                         MAIN FUNCITON                      */
 /**************************************************************/
 /* Set main variables used. */
 var articlesNavigateAnswers = document.getElementsByTagName("article");
 var articlesNavigateAnswersLen = articlesNavigateAnswers.length;
 /* Session storage to get last page[press] to compensate. */
 sessionStorage.setItem("lastPageWhat", "0");
 var lastPageWhat = "";
 /* Traverse through each answer, showing one at a time. */
 function navigateAnswers(keyPress) {
  /* condition to enable reset */
  if (keyPress == incrementCountNavigateAnswers || keyPress == decrementCountNavigateAnswers) {
   if (countNavigateAnswers <= articlesNavigateAnswersLen &&
       countNavigateAnswers >= 1) {
    /* loop and turn all off */
    for (i = 0; i < articlesNavigateAnswersLen; i++) {
     /* hide all then view by current count of key variable */
     articlesNavigateAnswers[i].style.display = "none";
    }
    /* on initiating bookmarklet */
    if (firstRunNavigateAnswers == 0) {
     firstRunNavigateAnswers = 1;
     if (keyPress == incrementCountNavigateAnswers) {      
      /* go to first answer */
      articlesNavigateAnswers[countNavigateAnswers].style.display = "";      
     } 
     else if (keyPress == decrementCountNavigateAnswers)  {      
      /* go to last answer */      
      countNavigateAnswers = Number(articlesNavigateAnswersLen-1);;
      articlesNavigateAnswers[countNavigateAnswers].style.display = "";
     }
    } else {
     if (keyPress == incrementCountNavigateAnswers) { /* go to next answer */
      /* reset on last item */ 
      if (countNavigateAnswers >= Number(articlesNavigateAnswersLen-1)) {
       countNavigateAnswers = 1;
       articlesNavigateAnswers[countNavigateAnswers].style.display = "";
      } else {              
       countNavigateAnswers += 2;              
       articlesNavigateAnswers[countNavigateAnswers].style.display = "";
      }
     }
     else if (keyPress == decrementCountNavigateAnswers) { /* go to previous answer */
      /* reset on first item */
      if (countNavigateAnswers <= 1) {             
       countNavigateAnswers = Number(articlesNavigateAnswersLen-1);
       articlesNavigateAnswers[countNavigateAnswers].style.display = "";
      } else {
       countNavigateAnswers -= 2;
       articlesNavigateAnswers[countNavigateAnswers].style.display = "";
      }    
     }
    }
   } else {
    /* reset accordingly */
    if (keyPress == incrementCountNavigateAnswers) {
     /* reset to firest  */
     countNavigateAnswers = 1;
    } else {
     /* reset to last    */
     countNavigateAnswers = Number(articlesNavigateAnswersLen-1);
    }    
   }  
  }
 }
 
 /* Add event to listen for key press. */
 document.addEventListener("keydown", function () {
  navigateAnswers(event.key);
 });
 
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructionsNavigateAnswers != undefined && 
     alertWithInstructionsNavigateAnswers == 1) {
  let alertText = 
        "INSTRUCTIONS:     \n"   + 
        "*************     \n"   +
        "Press '" + incrementCountNavigateAnswers + "' to go to the " +
        "next answer in conversation.\n" +
        "Press '" + decrementCountNavigateAnswers + "' to go to prior answer.";      
  alert(alertText);
 } 
})();