javascript: (function () {
 var composerBackground;    /* ELMERS-GLUE - defined later - select the parent holding prompt and UI elements.      */
 var composerBackgroundPar; /* ELMERS-GLUE - defined later - parent of above.                                       */
 var promptTextarea = "prompt-textarea"; /* HOT-GLUE - select id of text prompt.                                    */
 var selectFormChildIndex = 1; /*           HOT-GLUE - select nested form element child index - see bottom.         */
 var selectedFormElement;      /*           HOT-GLUED - see bottom function selectFormParent.                       */
 var startingFormWidth, curState = 1; /* Switch to run different conditions in selectFormParent function at bottom. */
 var htmlTag = document.getElementsByTagName("html"); /* To check current color theme; light, dark.                 */
 var formTag = document.getElementsByTagName("form"); /* To resize last aesthetic styled parent of prompt box.      */
 /* Select styled parent of prompt box.*/
 var formChild           = formTag[0].children;  /* First child of form element is rounded box holding prompt tools. */
 var resizeLastPromptBox = formChild[0];         /* HOT-GLUE -Select first child of html form element (currently 1). */
 
 /* The 2 variables below will set a general value for resizing.                */
 /******************** SET CUSTOM RESIZE VALUES *********************************/
 var setMaxHeight = "600px"; /* specify max height for resizing.                */
 var setMaxWidth =  "95%";   /* Specify max width for resizing.                 */
 var setMinHeight = "40px";  /* specify min height for resizing.                */
 var setMinWidth =  "280px"; /* Specify min width for resizing.                 */ 
 
 /* DOM element variables. */
 var promptTextarea = document.getElementById(promptTextarea);
 var promptPar = promptTextarea.parentElement; 
 var parElement = promptPar.parentElement; 
 var grandParElement = parElement.parentElement; 
 var greatGrandParElement = grandParElement.parentElement; 
 var textareaParent = parElement.children[0]; 
 var currentChat = location.href;
 var formParent; /* defined later */
 
 /*************************************SUPPORT FUNCTIONS*************************************/ 
 /* Add style element to mark important overrides. */
 var neededStyling; /* created HTML element in function */
 const importantOverrideChatGPTResizePrompt = () => {
  neededStyling = document.createElement("style"); /* create style element */
  
  /* insert styling for resizeablility */
  neededStyling.innerHTML = `
   form.w-full {
    width: 100% !important;
   }
   textarea#prompt-textarea {   
    max-height: 800px !important;   
    min-height: 100% !important;   
    height: inherit !important;
    overflow: scroll !important;  
   }  
   form div.relative.flex.h-full.flex-1 div + div.flex.w-full.items-center {   
    min-height: ${setMinHeight} !important;   
    max-height: ${setMaxHeight} !important;   
    min-width:  ${setMinWidth} !important;   
    max-width:  ${setMaxWidth} !important;  
   } 
   [data-rotate] {
    transform: rotateX(180deg) !important;
   }
 `;
 
  /* add to page */
  document.body.insertAdjacentElement("afterbegin", neededStyling);
 };
 
 /* Set UI parent and elements within reasonable range with timeout. */
 var uiParAndAdjacentElements = 0; /* switch variable */
 const setUIParAndAdjacentElements = () => {
  setTimeout(function() {
   /* ELMERS-GLUE - declared at top - select the parent holding prompt and UI elements.  */
   composerBackground = document.getElementById("composer-background"); 
   if (composerBackground) {
    /* ELMERS-GLUE - declared at top - parent of above                                   */
    composerBackgroundPar = composerBackground.parentElement; 
    
    /* style parent of ui elements and its' parents within reasonable range              */
    uiParAndAdjacentElements = 1; /* turn of threepeatLoop() run in main function        */
    
    /* style element                                                                     */
    composerBackground.style.display = "inline-block";
    composerBackgroundPar.style.display = "inline-block";
    composerBackgroundPar.style.width = "100%";  
   }
  }, 100);
 };
 
 /* Recurse function to get top-most form element of prompt. */
 const selectFormParent = (cur) => { /* HOT GLUE - depends on nesting of elements */  
  let curElement = cur; /* the current element in recurse */
  formParent = curElement.parentElement; /* goal is form  */
  if (formParent.tagName == "FORM") {
   /* found it */
   if (curState == 1) { /* if not toggled */
    curState = 2; /* toggle current state */
    
    /* get orginal width of prompt */
    startingFormWidth = formParent.scrollWidth;
    if (formParent.innerText == "") { /* style per innerText */
     grandParElement.style.width = "868px";
    } else {
     grandParElement.style.width = Number(startingFormWidth+100) + "px";
    }
    /* HOT-GLUE - unset max-width of form parent */
    let formPar = formParent.parentElement;
    formPar.style.maxWidth = "unset"; 
    
    /* call with state toggled for phase 2 */
    selectFormParent(formParent.children[0]);
   } else { /* phase 2 */
    /* selectFormChildIndex declared at top */
    curElement = formParent.children[selectFormChildIndex].children;
    
    /* get element for resizing */
    for (i = 0; i < curElement.length; i++) {
     if (curElement[i].children.length >= 1) {
      /* need this element to fit box to contents on resize */
      selectedFormElement = curElement[i]; 
      
      /* got it - end loop */
      break;
     }
    }
    /* style element from above loop */
    selectedFormElement.style.width = "auto";   
    selectedFormElement.children[0].style.width = "auto";          
   }
  } else {
   /* not element we're looking for - try again */
   selectFormParent(formParent);
  }
 }; 
 
 /* Ensure transform box was rotated. */
 var dataRotate = 0;
 const ensureRotate = () => {  
  parElement.setAttribute("data-rotate", "1");
  if (parElement.style.transform == "none" && dataRotate == 0) {
   dataRotate = 1;
   ensureRotate();
  } 
  parElement.style.transform = "rotateX(180deg)";
 }; 
 
 /* Update prompt color according to theme */
 const colorByTheme = (status) => {
  if (status == undefined) { status = 0; } /* empty */
  
  /* set style by theme color, or clear on page change */
  if (status == 1) {   /* no page change, set by theme */
   grandParElement
   .style.background = /* set by current color theme */
     (htmlTag[0].className.replace(/.*(dark).*/, "$1") == "dark") 
                                       ? "rgba(33, 33, 33, 0.75)"
                                       : "rgb(244, 244, 244)"; 
  } else { /* page change clear style     */
   grandParElement.style.background = ""; /* empty on page change */
  }
 };
 
 /* Resize all prompt box by current resized width. */
 const resizesLastPromptBox = new ResizeObserver(curEl => {  
  /* get current width of resizable prompt box */
  let width = promptTextarea.getBoundingClientRect().width;
  /* add 130 - safe estimate */
  let newWidth = width + 130;
  /* resize last aethetically visible styled element of prompt box html */
  resizeLastPromptBox.style.width = `${newWidth}px`;  
 });

 /* Resize prompt background when box is resized. */
 const resizePromptBackground = () => {
  let curWidth = grandParElement.offsetWidth;
  return curWidth + "px";
 };
 
 /*******************************************************************************************
  MAIN FUNCTION - STYLE ELEMENTS FOR RESIZE
 ********************************************************************************************/
 function styleElementsForResizeChatGPTResizePrompt() {  
  /* style parents within reasonable range of textarea */
  grandParElement.style.transform = "rotateX(180deg)";
  grandParElement.style.overflow  = "auto";
  grandParElement.style.resize    = "both";
  grandParElement.style.minHeight = "50px";
  grandParElement.style.maxHeight = "1200px";
  grandParElement.style.minWidth  = "20px";
  grandParElement.style.maxWidth  = "100%";
  grandParElement.style.padding   = "10px";
  colorByTheme(1); /* grandParElement.style.background */
  grandParElement /* border radius   */
  .style.borderRadius             = "25px";
  grandParElement /* padding left    */
  .children[0].style.paddingLeft  = "10px";
  greatGrandParElement  /* min width */
  .style.minWidth                 = "100%";
  greatGrandParElement /* max width  */
  .style.maxWidth                 = "100%";
  greatGrandParElement /* background */
  .style.background               = "none";
  greatGrandParElement /* display    */
  .style.display                  = "inline-block";
  parElement.style.display        = "inline-block";
  parElement.style.transform      = "rotateX(180deg)";
  parElement.style.maxWidth       = "100%";
  parElement.style.height         = "inherit";
  parElement.style.minHeight      = "95%";
  parElement.style.paddingBottom  = "30px";
  promptPar.style.paddingLeft     = "30px";
  promptPar.style.height          = "inherit";
  promptTextarea.style /* padding right */
  .paddingRight                   = "10px";
  promptTextarea.style /* padding left  */
  .paddingLeft                    = "10px";
  textareaParent.style.minHeight  = "100%";
  
  /* call support functions */
  let tunrOffThreepeatLoop = 0; /* safe switch */
  let threepeatLoop = function() {
   while (tunrOffThreepeatLoop < 10) {
    if (uiParAndAdjacentElements == 1) {
     tunrOffThreepeatLoop = 10; /* styles applied - turn off loop */
    } else {
     tunrOffThreepeatLoop++;    /* increment safe switch  */
     setUIParAndAdjacentElements(); /* call ui styling    */
    }
   }
  };
  /* call threepeatLoop */
  threepeatLoop();
  
  /* add inserted style element with important overrides */
  importantOverrideChatGPTResizePrompt();
  
  /* select form element parent and style */  
  selectFormParent(parElement);
  
  /* ensure that the resizeable element rotates correctly */
  ensureRotate();
 }  
 
 /* Run bookmarklet functions: 1 = add style, 2 = resize entire prompt */
 var currentStep = 1; /* switch variable for 1 and 2 noted above       */
 setTimeout(function() {
  styleElementsForResizeChatGPTResizePrompt(); /* add styling for resizability */
  currentStep = 2; /* set nest step switch variable to 2                       */
 }, 100);
 
 /* Defined at end of step two in next SetTimeout(). */
 var checkPageChange;
 /* Wait for step 1 to finish then run 2. */
 setTimeout(function() {
  let checkStep = () => {
   if (currentStep == 2) {
    /* add resizability to entire aesthetically styled prompt box */
    resizesLastPromptBox.observe(promptTextarea);
    
    /* stop checking for color theme if page change            */
    checkPageChange = /* enusre color matches theme changes    */
     setInterval(function() {
      if (currentChat != 
          location.href.replace("#settings", "")) {
       colorByTheme(0); /* ensure element changes with theme   */
       /* stop resizeability to styled prompt box              */
       resizesLastPromptBox.unobserve(promptTextarea); 
       clearInterval(checkPageChange); /* stop checking theme  */
      } else {          /* still on chat page                  */
       colorByTheme(1); /* ensure element changes with theme   */
      }
     }, 2000); /* check every 2 seconds                        */
     /* resize background of prompt area when resized */
     let sizeAll = setInterval(function() {
       let gGreatGrandPar =  /* select element behind prompt   */
        greatGrandParElement.parentElement;
       /* reset - remove current style and using current width */
       gGreatGrandPar.removeAttribute("style");       
       gGreatGrandPar.style.width = /* return current width */
        resizePromptBackground();
     }, 1);
   } else {
    /* recheck status */
    currentStep = currentStep;  
    checkStep();
   }
  };
  checkStep();
 }, 200);
})();   