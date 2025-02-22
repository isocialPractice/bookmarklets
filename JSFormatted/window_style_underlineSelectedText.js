javascript:(function() {
 /* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */
 var alertWithInstructions_underlineText = 1;  /* turn instruction alert on or off                 */
 var noPressKey_underlineText = "SHIFT";       /* button to press when using with other bookmarkel */

 /* Define global variables. */ 
 var numberOfKeyPresses_underlineText = 3;/* specify how many keypresses are used            */
 var currentStyleOpenTag_underlineText  = "<u>";  /* open tag to style selection     */
 var currentStyleCloseTag_underlineText = "</u>"; /* close tag to style selection    */ 
 var keyCombo_underlineText = "Control+Shift+u"; /* key combo to change style         */ 
 
 /* Declare global variables */
 var range_underlineText, selection_underlineText, selectionParent_underlineText, 
     selectedString_underlineText, parentIDWithSelectedText_underlineText;
 
 /******************************* MAIN FUNCTION *******************************/
 /*****************************************************************************/
 var keySwitch_underlineText = 0;      
 var lastThreeKeys_underlineText = []; /* enables last three key presses to be stored */
 function keypressToBookmarklet_underlineText(key_press) {
  /* keyboard combo that enablse text to be style underline */       
  lastThreeKeys_underlineText.push(key_press);
  
  /* keep only the last three keys */
  if (lastThreeKeys_underlineText.length > numberOfKeyPresses_underlineText) {
   lastThreeKeys_underlineText.shift();
  }
  
  /* check key combo                                   */
  if (numberOfKeyPresses_underlineText == 2) {      
   /* check if key combo is keyCombo_underlineText variable */
   let checkIfKeyCombo_underlineText = 
    lastThreeKeys_underlineText[0] + "+" +
    lastThreeKeys_underlineText[1];
   if (checkIfKeyCombo_underlineText == keyCombo_underlineText) {   
    getParentElementOfSelection_underlineText(); /* get parent of selected text     */
   }
  } 
  else if (numberOfKeyPresses_underlineText == 3) {
   /* check if key combo is keyCombo_underlineText variable */
   let checkIfKeyCombo_underlineText = 
    lastThreeKeys_underlineText[0] + "+" +
    lastThreeKeys_underlineText[1] + "+" +
    lastThreeKeys_underlineText[2];   
   if (checkIfKeyCombo_underlineText == keyCombo_underlineText) {
    getParentElementOfSelection_underlineText(); /* get parent of selected text     */
   }    
  }
  else {
   /* check if key combo is keyCombo_underlineText variable */
   let checkIfKeyCombo_underlineText = 
    lastThreeKeys_underlineText[0];
   if (checkIfKeyCombo_underlineText == keyCombo_underlineText) {   
    getParentElementOfSelection_underlineText(); /* get parent of selected text     */
   }
  }
 }


 /***** Support Functions: *****/ 
 /* Get parent of selection, give it id and use it to style selected text. */
 const getParentElementOfSelection_underlineText = () => {
   /* get the current selection */
   selection_underlineText = window.getSelection();
   
   if (selection_underlineText.rangeCount > 0) { /* ensure something is selected            */
    /* prepare elements to change selection                                                 */
    range_underlineText = selection_underlineText.getRangeAt(0);  /* first object of selection        */
    selectionParent_underlineText = range_underlineText.commonAncestorContainer; /* node of selection */
 
    let temp = document.getElementById("bm_window_style");
    if (temp) {
     /* don't include prior global style ids */       
     let tempID = temp.getAttribute("id");
     if (tempID == "bm_window_style") {
      temp.removeAttribute("id");
     } else {
      temp.setAttribute("id", tempID.replace("bm_window_style", ""));
     }     
    }
    
     selectedString_underlineText = range_underlineText.toString(); /* store as string       */     
     /* ensure selection is a text node                                                      */
     if (selectionParent_underlineText.nodeType === 3) { /* if it is a text node             */
      let curPar = selectionParent_underlineText.parentElement; /* store the parent element  */
      let outText = curPar.outerHTML;  /* select all of the styled element                   */
      let keepText = curPar.innerText; /* select only the text of styled element             */
      let checkIfStyleApplied = /* check if the style has already been applied               */
       currentStyleOpenTag_underlineText.replace(/[<>]/g, "").toUpperCase();
      
      /* account for  style attributes that may be applied intemplate                        */
      if (checkIfStyleApplied.indexOf(" ") > -1) {
        checkIfStyleApplied = /* extract only the tag name                                   */
         checkIfStyleApplied.substr(0, checkIfStyleApplied.indexOf(" "));
      }
      
      if (checkIfStyleApplied == curPar.tagName) { /* remove if already applied              */
        let grandParentOfSelection = curPar.parentElement; /* get tag nesting selection      */
        let curChildStyle = /* get all tag names used from top style configuration           */
         grandParentOfSelection.getElementsByTagName(curPar.tagName);
         
        for (j = 0; j < curChildStyle.length; j++) { /* loop with all tags and check text     */
          let curCheck = curChildStyle[j]; /* get each tag with configged style tag           */
          let text = curCheck.innerText;   /* extract the text from tag                       */         
          /* HOT-GLUE - makes a pretty good guess as to whether or not this is selection      */
          if (outText.indexOf(text) > -1) { /* out text - selection parent outerHTML          */
            curCheck.outerText = text; /* Replace outerText which removes stringed style      */
            /* end loop as this is probably the selected text and no more styled tags to rm   */
            break;
          } else {
            /* Do nothing - not the tag to remove                                             */
            let skip;
          }
        }
      } else {
      /* give parent a global style id                    */
      if (curPar.hasAttribute("id") == true) {
       let curID = curPar.id;
       if (curID.indexOf("bm_window_style") > -1) {              
        /* set the parents' id to global style id         */
        curPar.id = "bm_window_style";
       } else {
        /* append global style id to the current id value */
        curPar.id += " bm_window_style";
       }
      } else {
       /* set the parents' id to global style id */
       curPar.setAttribute("id", "bm_window_style");
      }       
    
      /* select by id to get parent element */
      parentIDWithSelectedText_underlineText = 
       document.getElementById("bm_window_style");
      /* apply styling to selection */  
      underlineTheSelectedText();
    }
   } 
  }
 };
 
 /* Style text using the ID added to parent element in getParentElementOfSelection_underlineText(). */
 const underlineTheSelectedText = () => {
  /* store the curren innerHTML to update with underline text */
  let curInnerHTML = parentIDWithSelectedText_underlineText.innerHTML;

  /* wrap selection in HTML u tag                                          */
  let underlineStyleSelection = /* use variables defined at top and in main function    */
   currentStyleOpenTag_underlineText + selectedString_underlineText + currentStyleCloseTag_underlineText;
  
  /* if only one occurence of selected text in parent element */
  if (curInnerHTML.indexOf(selectedString_underlineText) == 
      curInnerHTML.lastIndexOf(selectedString_underlineText)) {
   /* replace selection with newly styled text  */
   curInnerHTML = curInnerHTML.replace(selectedString_underlineText, underlineStyleSelection);
   
   /* Update parent HTML with newly styled text */
   parentIDWithSelectedText_underlineText.innerHTML = curInnerHTML;
  } else {
   /* variable used so insertion is not duplicated */
   let curLengthOfText = selectedString_underlineText.length;   
   /* HOT-GLUE - make a good guess as to where index of current selection is within parent */
   var getCurIndex = () => {    
    /* Ensure parent is an element node */
    if (selectionParent_underlineText.nodeType === Node.ELEMENT_NODE) {
     return range_underlineText.startOffset;
    } else {
     return range_underlineText.startOffset;         
    }
   };
   let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index             */
   var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new underline text */
    return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount));
   };   
   /* update the parent HTML with text containg underline selection */
   parentIDWithSelectedText_underlineText.innerHTML = 
    insertAtIndex(curInnerHTML, underlineStyleSelection, curIndex, curLengthOfText);
  }
  selection_underlineText = undefined;
  lastThreeKeys_underlineText = [];
 };

 /* Listen form key combo to underline text. */
 const addKeyDown_underlineText = () => { 
  document.body.addEventListener("keydown", function(event) {
   keypressToBookmarklet_underlineText(event.key);  
  });   
 }; 
 
 /****************************************************************** 
   Listen for keydonw event, running main function and underline selected
   text if the keyboard input is keyCombo_underlineText variable.
 *******************************************************************/ 
 addKeyDown_underlineText();
 
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructions_underlineText != undefined && 
     alertWithInstructions_underlineText == 1) {
  let alertText = 
        "INSTRUCTIONS:     \n"   + 
        "*************     \n"   +
        "Press '" + keyCombo_underlineText + "' to make selected text underline.             \n" +
        "To remove press '" + keyCombo_underlineText + "' some of previous styled text. \n\n" +
        "For best results: \n\n" +
        " - Avoid selecting text with different sytling.   \n"     +
        " - Avoid selecting a word that is often repeated. \n"     +
        " - Press each key specified one at a time.        \n"     +
        " - If using with another style bookmarklet, press '"      + noPressKey_underlineText + "'\n" +
        "   button THREE times with NO text selected       \n"     +
        "   before styling another with a different style  \n"     +
        "   and key combo.                                 \n"     +
        " - If style is not applied, press just '" + 
        keyCombo_underlineText[keyCombo_underlineText.length-1] + "' again.";        
  alert(alertText);
 } 
})();