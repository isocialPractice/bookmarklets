javascript: (function () {
 var composerBackground;    /* ELMERS-GLUE - defined later - select the parent holding prompt and UI elements.      */
 var composerBackgroundPar; /* ELMERS-GLUE - defined later - parent of above.                                       */
 var promptTextarea = "prompt-textarea"; /* HOT-GLUE - select id of text prompt.                                    */
 var selectFormChildIndex = 0; /*           HOT-GLUE - select nested form element child index - see bottom.         */
 var selectedFormElement;      /*           HOT-GLUED - see bottom function selectFormParent.                       */
 var startingFormWidth, curState = 1; /* Switch to run different conditions in selectFormParent function at bottom. */
 /* The 2 variables below will set a general value for resizing.                */
 /******************** SET CUSTOM RESIZE VALUES *********************************/
 var setMaxHeight = "600px"; /* specify max height for resizing.                */
 var setMaxWidth =  "95%";   /* Specify max width for resizing.                 */
 var setMinHeight = "40px";  /* specify min height for resizing.                */
 var setMinWidth =  "280px"; /* Specify min width for resizing.                 */ 
 var promptTextarea = document.getElementById(promptTextarea);
 var promptPar = promptTextarea.parentElement;
 var subButton;
 const styleSubButton = () => {
  subButton.style.position = "absolute";
  subButton.style.bottom = "10px"; 
 };
 if (promptPar.nextElementSibling) {
  subButton = promptPar.nextElementSibling;
  styleSubButton();
 } else if (promptPar.previousElementSibling) {
  subButton = promptPar.previousElementSibling;
  styleSubButton();
 }
 var parElement = promptPar.parentElement; 
 var grandParElement = parElement.parentElement; 
 var greatGrandParElement = grandParElement.parentElement;
 var textareaParent = parElement.children[0]; 
 var formParent;
 /*************************************SUPPORT FUNCTIONS*************************************/ 
 /* Add style element to mark important overrides. */
 var neededStyling;
 const importantOverrideChatGPTResizePrompt = () => {
  neededStyling = document.createElement("style");
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
 `;
  document.body.appendChild(neededStyling);
 };
 
 /* Set UI parent and elements within reasonable range with timeout. */
 var uiParAndAdjacentElements = 0;
 const setUIParAndAdjacentElements = () => {
  setTimeout(function() {
   /* ELMERS-GLUE - declared at top - select the parent holding prompt and UI elements. */
   composerBackground = document.getElementById("composer-background"); 
   if (composerBackground) {
    /* ELMERS-GLUE - declared at top - parent of above                                   */
    composerBackgroundPar = composerBackground.parentElement; 
    /* style parent of ui elements and its' parents within reasonable range */
    uiParAndAdjacentElements = 1; /* turn of threepeatLoop() run in main function  */
    composerBackground.style.display = "inline-block";
    composerBackgroundPar.style.display = "inline-block";
    composerBackgroundPar.style.width = "100%";  
   }
  }, 100);
 };
 
 /* Recurse function to get top-most form element of prompt. */
 const selectFormParent = (cur) => { /* HOT GLUE - depends on nesting of elements */  
  let curElement = cur;
  formParent = curElement.parentElement;  
  if (formParent.tagName == "FORM") {
   /* found it */
   if (curState == 1) {
    curState = 2;
    startingFormWidth = formParent.scrollWidth;
    if (formParent.innerText == "") {
     grandParElement.style.width = "868px";
    } else {
     grandParElement.style.width = Number(startingFormWidth+100) + "px";
    }
    selectFormParent(formParent.children[0]);
   } else {
    curElement = formParent.children[selectFormChildIndex].children;
    for (i = 0; i < curElement.length; i++) {
     if (curElement[i].children.length >= 1) {
      selectedFormElement = curElement[i]; /* need this element to fit box to contents pn resize */
      break;
     }
    }
    selectedFormElement.style.width = "auto";   
    selectedFormElement.children[0].style.width = "auto";          
   }
  } else {
   /* not element we're looking for - try again */
   selectFormParent(formParent);
  }
 }; 
 
 /* Ensure transform box was rotated. */
 const ensureRotate = () => {  
  if (parElement.style.transform == "none") {
   ensureRotate();
  } 
  parElement.style.transform = "rotateX(180deg)";
 }; 
 
 /*******************************************************************************************
  MAIN FUNCTION - STYLE ELEMENTS FOR RESIZE
 ********************************************************************************************/
 function styleElementsForResizeChatGPTResizePrompt() {
  /* style parents within reasonable range of textarea */
  grandParElement.style.transform = "rotateX(180deg)";
  grandParElement.style.overflow = "auto";
  grandParElement.style.resize = "both";  
  grandParElement.style.minHeight = "100px";
  grandParElement.style.maxHeight = "100%";
  grandParElement.style.minWidth = "20px"; 
  grandParElement.style.maxWidth = "1000px"; 
  grandParElement.style.padding = "10px";
  grandParElement.style.background ="rgb(244, 244, 244)";
  grandParElement.style.borderRadius = "25px";
  grandParElement.children[0].style.paddingLeft = "10px";
  greatGrandParElement.style.minWidth = "100%";
  greatGrandParElement.style.maxWidth = "100%";
  greatGrandParElement.style.background = "none";
  greatGrandParElement.style.display = "inline-block";
  parElement.style.display = "inline-block";
  parElement.style.transform = "rotateX(180deg)"; 
  parElement.style.maxWidth = "100%";
  parElement.style.height = "inherit";
  parElement.style.minHeight = "95%";
  promptPar.style.paddingLeft = "30px";
  promptPar.style.height = "inherit"; 
  promptTextarea.style.paddingRight = "100px";
  promptTextarea.style.paddingLeft = "30px";  
  textareaParent.style.minHeight = "100%";
  
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
 
 /* Run bookmarklet functions. */
 setTimeout(function() {
  styleElementsForResizeChatGPTResizePrompt();
 }, 100);
})();   