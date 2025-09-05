javascript: (function () {
 var composerBgChatGPTResizePrompt;    /* ELMERS-GLUE - defined later - select the parent holding prompt and UI elements.      */
 var composerBgParChatGPTResizePrompt; /* ELMERS-GLUE - defined later - parent of above.                                       */
 var promptTextareaChatGPTResizePrompt = "prompt-textarea"; /* HOT-GLUE - select id of text prompt.                                    */
 var selectFormChildIndexChatGPTResizePrompt = 1; /*           HOT-GLUE - select nested form element child index - see bottom.         */
 var selectedFormElementChatGPTResizePrompt;      /*           HOT-GLUED - see bottom function selectFormParentChatGPTResizePrompt.    */
 var startingFormWidthChatGPTResizePrompt; /* defined later */
 var curStateChatGPTResizePrompt = 1; /* Switch to run different conditions in selectFormParentChatGPTResizePrompt function at bottom. */
 var htmlTagChatGPTResizePrompt = document.getElementsByTagName("html"); /* To check current color theme; light, dark.                 */
 var formTagChatGPTResizePrompt = document.getElementsByTagName("form"); /* To resize last aesthetic styled parent of prompt box.      */
 /* Select styled parent of prompt box, and form tag.*/
 var resizeLastPromptBoxChatGPTResizePrompt;
 var formChildChatGPTResizePrompt = /* first child of form element is rounded box holding prompt tools */
  formTagChatGPTResizePrompt[0].children;
 
  /* Select form child holding prompt box. */
 resizeLastPromptBoxChatGPTResizePrompt = /* HOT-GLUE */  
 (formChildChatGPTResizePrompt[0].getAttribute("class").indexOf("hidden") > -1) ?
  resizeLastPromptBoxChatGPTResizePrompt = formChildChatGPTResizePrompt[1]  /* Select second child of html form element. */
  : /* else */
  resizeLastPromptBoxChatGPTResizePrompt = formChildChatGPTResizePrompt[0]; /* Select first child of html form element.  */
 
  /* Select form parent, assumes one form tag. */
 var formTagParChatGPTResizePrompt = formTagChatGPTResizePrompt[0].parentElement;

 /* The 2 variables below will set a general value for resizing.                */
 /******************** SET CUSTOM RESIZE VALUES *********************************/
 var setMaxHeightChatGPTResizePrompt = "600px"; /* specify max height for resizing.                */
 var setMaxWidthChatGPTResizePrompt =  "95%";   /* Specify max width for resizing.                 */
 var setMinHeightChatGPTResizePrompt = "40px";  /* specify min height for resizing.                */
 var setMinWidthChatGPTResizePrompt =  "280px"; /* Specify min width for resizing.                 */

 /* DOM element variables. */
 var promptTextareaChatGPTResizePrompt  = document.getElementById(promptTextareaChatGPTResizePrompt);
 var promptParChatGPTResizePrompt       = promptTextareaChatGPTResizePrompt.parentElement;
 var parElementChatGPTResizePrompt      = promptParChatGPTResizePrompt.parentElement;
 var grandParElementChatGPTResizePrompt = parElementChatGPTResizePrompt.parentElement;
 var greatGrandParElChatGPTResizePrompt = grandParElementChatGPTResizePrompt.parentElement;
 var textareaParentChatGPTResizePrompt  = parElementChatGPTResizePrompt.children[0];
 var currentChatChatGPTResizePrompt     = location.href;
 var formParentChatGPTResizePrompt; /* defined later */

 /* Siblings of parent element. */
 var parSiblingOneChatGPTResizePrompt = (parElementChatGPTResizePrompt.nextElementSibling) ?
  parElementChatGPTResizePrompt.nextElementSibling : 0;    /* currently "+" add files btn */

 var parSiblingTwoChatGPTResizePrompt = 
  (parSiblingOneChatGPTResizePrompt != 0 && 
   parSiblingOneChatGPTResizePrompt.nextElementSibling) ?
  parSiblingOneChatGPTResizePrompt.nextElementSibling : 0; /* currently "+" add files btn */

 /*************************************SUPPORT FUNCTIONS*************************************/
 /* Add style element to mark important overrides. */
 var neededStylingChatGPTResizePrompt; /* created HTML element in function */
 const importantOverrideChatGPTResizePrompt = () => {
  neededStylingChatGPTResizePrompt = /* create style element */
   document.createElement("style"); 

  /* insert styling for resizeablility */
  neededStylingChatGPTResizePrompt.innerHTML = `
   form.w-full {
    width: 100% !important;    
    border-radius: 10px;
   }
   form.w-full [data-shadow="1"] > div[data-rotate="1"] {
    box-shadow: -1px -1px 5px 1px #ffffff50;
   }
   textarea#prompt-textarea {
    max-height: 800px !important;
    min-height: 100% !important;
    height: inherit !important;
    overflow: scroll !important;
   }
   form div.relative.flex.h-full.flex-1 div + div.flex.w-full.items-center {
    min-height: ${setMinHeightChatGPTResizePrompt} !important;
    max-height: ${setMaxHeightChatGPTResizePrompt} !important;
    min-width:  ${setMinWidthChatGPTResizePrompt} !important;
    max-width:  ${setMaxWidthChatGPTResizePrompt} !important;
   }
   [data-rotate="1"] {
    transform: rotateX(180deg) !important;
   }
   [data-rotate="2"] {
    transform: rotate(180deg) !important;
   }
   [data-resizeprompt="auto"] {
    width: auto;
   }
   [data-resizeprompt="fit"] {
    width: fit-content;
   }
 `;

  /* add to page */
  document.body.insertAdjacentElement("afterbegin", neededStylingChatGPTResizePrompt);
 };

 /* Set UI parent and elements within reasonable range with timeout. */
 var uiParAdjacentElChatGPTResizePrompt = 0; /* switch variable */
 const setUIParAndAdjacentElementsChatGPTResizePrompt = () => {
  setTimeout(function() {
   /* ELMERS-GLUE - declared at top - select the parent holding prompt and UI elements.  */
   composerBgChatGPTResizePrompt = document.getElementById("composer-background");
   if (composerBgChatGPTResizePrompt) {
    /* ELMERS-GLUE - declared at top - parent of above                                   */
    composerBgParChatGPTResizePrompt = composerBgChatGPTResizePrompt.parentElement;

    /* style parent of ui elements and its' parents within reasonable range              */
    uiParAdjacentElChatGPTResizePrompt = 1; /* turn of threepeatLoop() run in main function        */

    /* style element                                                                     */
    composerBgChatGPTResizePrompt.style.display = "inline-block";
    composerBgParChatGPTResizePrompt.style.display = "inline-block";
    composerBgParChatGPTResizePrompt.style.width = "100%";
   }
  }, 100);
 };

 /* Recurse function to get top-most form element of prompt. */
 const selectFormParentChatGPTResizePrompt = (cur) => { /* HOT GLUE - depends on nesting of elements */
  let curElement = cur; /* the current element in recurse */
  formParentChatGPTResizePrompt = curElement.parentElement; /* goal is form  */
  if (formParentChatGPTResizePrompt.tagName == "FORM") {
   /* found it */
   if (curStateChatGPTResizePrompt == 1) { /* if not toggled */
    curStateChatGPTResizePrompt = 2; /* toggle current state */

    /* get orginal width of prompt */
    startingFormWidthChatGPTResizePrompt = formParentChatGPTResizePrompt.scrollWidth;
    if (formParentChatGPTResizePrompt.innerText == "") { /* style per innerText */
     grandParElementChatGPTResizePrompt.style.width = "868px";
    } else {
     grandParElementChatGPTResizePrompt.style.width = 
      Number(startingFormWidthChatGPTResizePrompt+100) + "px";
    }
    /* HOT-GLUE - unset max-width of form parent */
    let formPar = formParentChatGPTResizePrompt.parentElement;
    formPar.style.maxWidth = "unset";

    /* call with state toggled for phase 2 */
    selectFormParentChatGPTResizePrompt(formParentChatGPTResizePrompt.children[0]);
   } else { /* phase 2 */
    /* selectFormChildIndexChatGPTResizePrompt declared at top */
    curElement = formParentChatGPTResizePrompt.children[selectFormChildIndexChatGPTResizePrompt].children;

    /* get element for resizing */
    for (i = 0; i < curElement.length; i++) {
     if (curElement[i].children.length >= 1) {
      /* need this element to fit box to contents on resize */
      selectedFormElementChatGPTResizePrompt = curElement[i];

      /* got it - end loop */
      break;
     }
    }
    /* style element from above loop */
    selectedFormElementChatGPTResizePrompt.style.width = "auto";
    selectedFormElementChatGPTResizePrompt.children[0].style.width = "auto";
   }
  } else {
   /* not element we're looking for - try again */
   selectFormParentChatGPTResizePrompt(formParentChatGPTResizePrompt);
  }
 };

 /* HOT-GLUE - Ensure transform box was rotated. */
 var dataRotateChatGPTResizePrompt = 0;
 const ensureRotateChatGPTResizePrompt = () => {
  parElementChatGPTResizePrompt.setAttribute("data-rotate", "1");
  grandParElementChatGPTResizePrompt.setAttribute("data-rotate", "1");
  if (parElementChatGPTResizePrompt.style.transform == "none" && dataRotateChatGPTResizePrompt == 0) {
   dataRotateChatGPTResizePrompt = 1;
   ensureRotateChatGPTResizePrompt();
  }
  parElementChatGPTResizePrompt.style.transform      = "rotateX(180deg)";
  grandParElementChatGPTResizePrompt.style.transform = "rotateX(180deg)";
  /* style sibling if exists */
  /* mainly rotating back, leaving at top */
  if (parSiblingOneChatGPTResizePrompt != 0 && parSiblingTwoChatGPTResizePrompt != 0) {
   parSiblingOneChatGPTResizePrompt.setAttribute("data-rotate", "2");
   parSiblingTwoChatGPTResizePrompt.setAttribute("data-rotate", "2");
   parSiblingOneChatGPTResizePrompt.style.transform = "rotate(180deg)";
   parSiblingTwoChatGPTResizePrompt.style.transform = "rotate(180deg)";
  } else if (parSiblingOneChatGPTResizePrompt != 0) {
   parSiblingOneChatGPTResizePrompt.setAttribute("data-rotate", "2");
   parSiblingOneChatGPTResizePrompt.style.transform = "rotate(180deg)";
  } else {
   let skip; /* do nothing */
  }
 };

 /* HOT-GLUE - Ensure some elements are style using data attributes. */
 const ensureStyleChatGPTResizePrompt = () => {    
  if (!formTagParChatGPTResizePrompt.getAttribute("data-resizeprompt")) {
   formTagParChatGPTResizePrompt.setAttribute("data-resizeprompt", "auto");
   resizeLastPromptBoxChatGPTResizePrompt.setAttribute("data-shadow", "1");
  }
  /* apply inline styling */
  formTagParChatGPTResizePrompt.style.width = "fit-content !important";
 };

 /* Update prompt color according to theme */
 const colorByThemeChatGPTResizePrompt = (status) => {
  if (status == undefined) { status = 0; } /* empty */

  /* set style by theme color, or clear on page change */
  if (status == 1) {   /* no page change, set by theme */
   grandParElementChatGPTResizePrompt
   .style.background = /* set by current color theme */
     (htmlTagChatGPTResizePrompt[0].className.replace(/.*(dark).*/, "$1") == "dark")
                                       ? "rgba(33, 33, 33, 0.75)"
                                       : "rgb(244, 244, 244)";
  } else { /* page change clear style     */
   grandParElementChatGPTResizePrompt.style.background = ""; /* empty on page change */
  }
 };

 /* Resize all prompt box by current resized width. */
 const resizesLastPromptBoxChatGPTResizePrompt = 
  new ResizeObserver(curEl => {
  /* get current width of resizable prompt box */
  let width = promptTextareaChatGPTResizePrompt.getBoundingClientRect().width;
  /* add 130 - safe estimate */
  let newWidth = width + 130;
  /* resize last aethetically visible styled element of prompt box html */
  resizeLastPromptBoxChatGPTResizePrompt.style.width = `${newWidth}px`;
  /* resize form box accordingly */
  formTagChatGPTResizePrompt[0].style.width = `${newWidth}px`;
 });

 /* Resize prompt background when box is resized. */
 const resizePromptBackgroundChatGPTResizePrompt = () => {
  let curWidth = grandParElementChatGPTResizePrompt.offsetWidth;
  return curWidth + "px";
 };

 /* Add inital styling. */
 const initialStylingChatGPTResizePrompt = () => {
  /* style ancestors within reasonable range of textarea */
  parElementChatGPTResizePrompt.style.display           = "inline-block";
  parElementChatGPTResizePrompt.style.transform         = "rotate(180deg)";
  parElementChatGPTResizePrompt.style.maxWidth          = "100%";
  parElementChatGPTResizePrompt.style.height            = "inherit";
  parElementChatGPTResizePrompt.style.minHeight         = "95%";
  parElementChatGPTResizePrompt.style.paddingBottom     = "30px";
  parElementChatGPTResizePrompt.style.overflow          = "hidden"; /* prevent scroll bar clutter */
  grandParElementChatGPTResizePrompt.style.transform    = "rotateX(180deg)";
  grandParElementChatGPTResizePrompt.style.overflow     = "auto";
  grandParElementChatGPTResizePrompt.style.resize       = "both";
  grandParElementChatGPTResizePrompt.style.minHeight    = "50px";
  grandParElementChatGPTResizePrompt.style.maxHeight    = "1200px";
  grandParElementChatGPTResizePrompt.style.minWidth     = "20px";
  grandParElementChatGPTResizePrompt.style.maxWidth     = "100%";
  grandParElementChatGPTResizePrompt.style.padding      = "10px";
  grandParElementChatGPTResizePrompt.style.borderRadius = "25px";
  colorByThemeChatGPTResizePrompt(1); /* grandParElementChatGPTResizePrompt.style.background */
  grandParElementChatGPTResizePrompt.children[0].style.paddingLeft = "10px";
  greatGrandParElChatGPTResizePrompt.style.minWidth    = "100%";
  greatGrandParElChatGPTResizePrompt.style.maxWidth    = "100%";
  greatGrandParElChatGPTResizePrompt.style.background  = "none";
  greatGrandParElChatGPTResizePrompt.style.display     = "inline-block";
  promptParChatGPTResizePrompt.style.paddingLeft       = "30px";
  promptParChatGPTResizePrompt.style.height            = "inherit";
  promptTextareaChatGPTResizePrompt.style.paddingRight = "10px";
  promptTextareaChatGPTResizePrompt.style.paddingLeft  = "10px";
  textareaParentChatGPTResizePrompt.style.minHeight    = "100%";

  /* call support functions */
  let tunrOffThreepeatLoop = 0; /* safe switch */
  let threepeatLoop = function() {
   while (tunrOffThreepeatLoop < 10) {
    if (uiParAdjacentElChatGPTResizePrompt == 1) {
     tunrOffThreepeatLoop = 10; /* styles applied - turn off loop */
    } else {
     tunrOffThreepeatLoop++;    /* increment safe switch  */
     setUIParAndAdjacentElementsChatGPTResizePrompt(); /* call ui styling    */
    }
   }
  };

  /* call threepeatLoop */
  threepeatLoop();
 };

 /* Run support functions sequentially. */
 const seqSupportChatGPTResizePrompt = () => {
  /* add inserted style element with important overrides */
  importantOverrideChatGPTResizePrompt();

  /* select form element parent and style */
  selectFormParentChatGPTResizePrompt(parElementChatGPTResizePrompt);

  /* ensure that the resizeable element rotates correctly */
  ensureRotateChatGPTResizePrompt();

  /* ensure elements are style */
  ensureStyleChatGPTResizePrompt();
 };

 /* Add observe event to resize elements with each other. */
 const resizeFormChatGPTResizezPrompt = () => {
  /* add resizability to entire aesthetically styled prompt box */
  resizesLastPromptBoxChatGPTResizePrompt.observe(promptTextareaChatGPTResizePrompt);

  /* stop checking for color theme if page change            */
  checkPageChange = /* enusre color matches theme changes    */
   setInterval(function() {
    if (currentChatChatGPTResizePrompt !=
        location.href.replace("#settings", "")) {
     /* ensure element changes with theme   */
     colorByThemeChatGPTResizePrompt(0);
     
     /* stop resizeability to styled prompt box */
     resizesLastPromptBoxChatGPTResizePrompt.unobserve(promptTextareaChatGPTResizePrompt);
     
     /* stop checking theme */
     clearInterval(checkPageChange); 
    } else { /* still on chat page        */
     /* ensure element changes with theme */
     colorByThemeChatGPTResizePrompt(1);
    }
   }, 2000); /* check every 2 seconds               */
   /* resize background of prompt area when resized */
   let sizeAll = setInterval(function() {
     let gGreatGrandPar =  /* select element behind prompt   */
      greatGrandParElChatGPTResizePrompt.parentElement;
     
      /* reset - remove current style and using current width */
     gGreatGrandPar.removeAttribute("style");
     gGreatGrandPar.style.width = /* return current width */
      resizePromptBackgroundChatGPTResizePrompt();
   }, 1);
 };

 /* Run support functions per timeout. */
 var timeChatGPTResizePrompt = 100; /* initial time for each timeout - increments by 100 */
 const timeSupportChatGPTResizePrompt = (func) => {
  setTimeout(function() {
   func;
  }, timeChatGPTResizePrompt);
  /* increment next timeout by 100 */
  timeChatGPTResizePrompt += 100;
 };

 /*******************************************************************************************
  MAIN FUNCTION - STYLE ELEMENTS FOR RESIZE
 ********************************************************************************************/
 /* Run support functions utilizing timeout, incrementing by 100. */
 function chatGPTResizePrompt() {
  /* apply initial styles */
  timeSupportChatGPTResizePrompt(initialStylingChatGPTResizePrompt());

  /* run support functions sequentiall */
  timeSupportChatGPTResizePrompt(seqSupportChatGPTResizePrompt());

  /* set intervals to resize elements together */
  timeSupportChatGPTResizePrompt(resizeFormChatGPTResizezPrompt());
 }

 /* Start bookmarklet. */
 chatGPTResizePrompt();
})();