javascript: (function () {
 /* Configurable variables. */
 var incrementCountNavigateAnswers = "PageDown"; 
 var decrementCountNavigateAnswers = "PageUp"; 
 var alertWithInstructionsNavigateAnswers = 1;

 /* Set main variables used in DOM selection. */
 var articlesNavigateAnswers = /* each answer by tag name article */
  document.getElementsByTagName("article");
 
 var articlesNavigateAnswersLen = /* length for looping each answer */
  articlesNavigateAnswers.length;

 /* Start with odd index for getting answers. */
 var countNavigateAnswers = 1; 
 
 /* Enable use of traverse back and forth. */
 var firstRunNavigateAnswers = 0;
 
 /* Get the URI of current chat. */
 var currentChatURINavigateAnswers = location.href;
 
 /* Get id of main element of conversation of page. */
 var mainIDNavigateAnswers = /* select by id */
  document.getElementById("main");
 
 var normalPageNavigateAnswers = /* make button to normal page  */
  document.createElement("div");
 
 /* Define class for normalize button. */
 normalPageNavigateAnswers.className = "normal-chat";
 
 /* Give inner html of button an X or O. */
 normalPageNavigateAnswers.innerHTML = "O";
 
 /* Give the toggle to normal page button styling. */
 var styleToggleBtnNavigateAnswers = `
  .normal-chat {
   display: inline-block;
   position: fixed;
   background: black;
   color: white;
   padding: 1px 10px 5px 10px;
   border-radius: 7px;
   box-shadow: 0.5px .20px 1px .1px rgba(255,255,255,.15);
   margin-left: 5px;
   margin-top: 5px;
   border: 2px solid rgba(255,255,255,0.5);
   top: 70px;
   z-index: 1;
   cursor: pointer;
 }`;
 
 /* Create style element that will hold toggle normal page styling. */
 var styleTagNavigateAnswers = /* create style tag */
  document.createElement("style");
  
 /* Insert the css into created style tag. */
 styleTagNavigateAnswers.innerHTML = styleToggleBtnNavigateAnswers;
 
 /********************** SUPPORT FUNCTIONS *********************/
 /* Turn the bookmarklet on or off */
 var currentBookmarkToggleNavigateAnswers = 0; /* default (0) off, 1 is on       */
 var initialToggleNavigateAnswers = 0;         /* turns to 1 on 1st nav keypress */
 
 /* Toggle bookmarklet status when button is pressed.  */
 const toggleBookmarkNavigateAnswers = () => {
  if (initialToggleNavigateAnswers == 1) {
   if (currentBookmarkToggleNavigateAnswers == 0) {
    console.log("on");
    currentBookmarkToggleNavigateAnswers = 1;  /* on - navigate answers              */
    navigateAnswers(incrementCountNavigateAnswers); /* reset to last answer in view  */
    navigateAnswers(decrementCountNavigateAnswers); /* reset to last answer in view  */
    normalPageNavigateAnswers.innerHTML = "X"; /* innerHTML change                   */
   } else {
    console.log("off");
    currentBookmarkToggleNavigateAnswers = 0;  /* off - normal page                  */        
    showOrHideAnswersNavigateAnswers();        /* show all answers as if normal page */    
    normalPageNavigateAnswers.innerHTML = "O"; /* innerHTML change                   */
   }  
  } else { /* do nothing */
   let skip;
  }
 };

 /* Show or hide the article tags for each answer. */
 const showOrHideAnswersNavigateAnswers = () => {
  /* loop and turn all on or off */
  for (i = 0; i < articlesNavigateAnswersLen; i++) {
   if (currentBookmarkToggleNavigateAnswers == 1) {
    /* hide all then view by current count of key variable */
    articlesNavigateAnswers[i].style.display = "none";
   } else { /* ensure that all answers are displayed       */
    articlesNavigateAnswers[i].style.display = "";
   }
  }
 };
 
 /**************************************************************/
 /*                         MAIN FUNCTION                      */
 /**************************************************************/
 /* Session storage to get last page[press] to compensate. */
 sessionStorage.setItem("lastPageWhat", "0");
 var lastPageWhat = "";
 /* Traverse through each answer, showing one at a time. */
 function navigateAnswers(keyPress) {
  let navToggleBtn = /* class name of toggle button */
   document.getElementsByClassName("normal-chat"); 
  /* check that the chat is same URI */
  if (location.href == 
      currentChatURINavigateAnswers) { /* navigate answers */
    /* show toggle button */
    navToggleBtn[0].style.display = ""; 
    
   /* condition to enable reset */
   if (keyPress == incrementCountNavigateAnswers || 
       keyPress == decrementCountNavigateAnswers) {
    /* set intialize variable on after first keypress of pagup or pagedown */
    if (initialToggleNavigateAnswers == 0) {
     initialToggleNavigateAnswers = 1;         /* bookmarklet initiated      */
     currentBookmarkToggleNavigateAnswers = 1; /* allow toggle functionality */
    } else { /* do nothing */ 
     let skip;
    }
    if (countNavigateAnswers <= articlesNavigateAnswersLen &&
        countNavigateAnswers >= 1) {     
     /* if toggle is set to normal, exit function */
     if (currentBookmarkToggleNavigateAnswers == 0) {
      return; /* exit function */
     } else {
      /* hide all snwers before showing current in nav */
      showOrHideAnswersNavigateAnswers();
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

  } else { /* hide button and don't navigate */   
   /* hide toggle button */
   navToggleBtn[0].style.display = "none";
   
   /* off - normal page                  */        
   currentBookmarkToggleNavigateAnswers = 0;  
   
   /* show all answers as if normal page */       
   showOrHideAnswersNavigateAnswers();
  } 
 }
 
 /* Add event to listen for key press. */
 document.addEventListener("keydown", function () {
  navigateAnswers(event.key);
 });
 
 /* Insert normalize button after main conversation element. */
 mainIDNavigateAnswers
 .insertAdjacentElement("afterbegin", normalPageNavigateAnswers);
 
 /* Give button onlcick attribute that calls support function. */
 normalPageNavigateAnswers
 .addEventListener("click", toggleBookmarkNavigateAnswers);
 
 /* Add additional style element to after body tag opens. */
 document.getElementsByTagName("body")[0]
 .insertAdjacentElement("afterbegin", styleTagNavigateAnswers);
 
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