javascript:(function() {
 /* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */
 var alertWithInstructions_italicText = 1;  /* turn instruction alert on or off                 */
 var noPressKey_italicText = "SHIFT";       /* button to press when using with other bookmarkel */

 /* Define global variables. */ 
 var numberOfKeyPresses_italicText = 2;/* specify how many keypresses are used            */
 var currentStyleOpenTag_italicText  = "<em>";  /* open tag to style selection     */
 var currentStyleCloseTag_italicText = "</em>"; /* close tag to style selection    */ 
 var keyCombo_italicText = "Control+i"; /* key combo to change style         */ 
 
 /* Declare global variables */
 var range_italicText, selection_italicText, selectionParent_italicText, 
     selectedString_italicText, parentIDWithSelectedText_italicText;
 
 /******************************* MAIN FUNCTION *******************************/
 /*****************************************************************************/
 var keySwitch_italicText = 0;      
 var lastThreeKeys_italicText = []; /* enables last three key presses to be stored */
 function keypressToBookmarklet_italicText(key_press) {
  /* keyboard combo that enablse text to be style italic */       
  lastThreeKeys_italicText.push(key_press);
  
  /* keep only the last three keys */
  if (lastThreeKeys_italicText.length > numberOfKeyPresses_italicText) {
   lastThreeKeys_italicText.shift();
  }
  
  /* check key combo                                   */
  if (numberOfKeyPresses_italicText == 2) {      
   /* check if key combo is keyCombo_italicText variable */
   let checkIfKeyCombo_italicText = 
    lastThreeKeys_italicText[0] + "+" +
    lastThreeKeys_italicText[1];
   if (checkIfKeyCombo_italicText == keyCombo_italicText) {   
    getParentElementOfSelection_italicText(); /* get parent of selected text     */
   }
  } 
  else if (numberOfKeyPresses_italicText == 3) {
   /* check if key combo is keyCombo_italicText variable */
   let checkIfKeyCombo_italicText = 
    lastThreeKeys_italicText[0] + "+" +
    lastThreeKeys_italicText[1] + "+" +
    lastThreeKeys_italicText[2];   
   if (checkIfKeyCombo_italicText == keyCombo_italicText) {
    getParentElementOfSelection_italicText(); /* get parent of selected text     */
   }    
  }
  else {
   /* check if key combo is keyCombo_italicText variable */
   let checkIfKeyCombo_italicText = 
    lastThreeKeys_italicText[0];
   if (checkIfKeyCombo_italicText == keyCombo_italicText) {   
    getParentElementOfSelection_italicText(); /* get parent of selected text     */
   }
  }
 }


 /***** Support Functions: *****/ 
 /* Get parent of selection, give it id and use it to style selected text. */
 const getParentElementOfSelection_italicText = () => {
   /* get the current selection */
   selection_italicText = window.getSelection();
   
   if (selection_italicText.rangeCount > 0) { /* ensure something is selected            */
    /* prepare elements to change selection                                                 */
    range_italicText = selection_italicText.getRangeAt(0);  /* first object of selection        */
    selectionParent_italicText = range_italicText.commonAncestorContainer; /* node of selection */
 
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
    
     selectedString_italicText = range_italicText.toString(); /* store as string       */     
     /* ensure selection is a text node                                                      */
     if (selectionParent_italicText.nodeType === 3) { /* if it is a text node             */
      let curPar = selectionParent_italicText.parentElement; /* store the parent element  */
      let outText = curPar.outerHTML;  /* select all of the styled element                   */
      let keepText = curPar.innerText; /* select only the text of styled element             */
      let checkIfStyleApplied = /* check if the style has already been applied               */
       currentStyleOpenTag_italicText.replace(/[<>]/g, "").toUpperCase();
      
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
      parentIDWithSelectedText_italicText = 
       document.getElementById("bm_window_style");
      /* apply styling to selection */  
      italicTheSelectedText();
    }
   } 
  }
 };
 
 /* Style text using the ID added to parent element in getParentElementOfSelection_italicText(). */
 const italicTheSelectedText = () => {
  /* store the curren innerHTML to update with italic text */
  let curInnerHTML = parentIDWithSelectedText_italicText.innerHTML;

  /* wrap selection in HTML u tag                                          */
  let italicStyleSelection = /* use variables defined at top and in main function    */
   currentStyleOpenTag_italicText + selectedString_italicText + currentStyleCloseTag_italicText;
  
  /* if only one occurence of selected text in parent element */
  if (curInnerHTML.indexOf(selectedString_italicText) == 
      curInnerHTML.lastIndexOf(selectedString_italicText)) {
   /* replace selection with newly styled text  */
   curInnerHTML = curInnerHTML.replace(selectedString_italicText, italicStyleSelection);
   
   /* Update parent HTML with newly styled text */
   parentIDWithSelectedText_italicText.innerHTML = curInnerHTML;
  } else {
   /* variable used so insertion is not duplicated */
   let curLengthOfText = selectedString_italicText.length;   
   /* HOT-GLUE - make a good guess as to where index of current selection is within parent */
   var getCurIndex = () => {    
    /* Ensure parent is an element node */
    if (selectionParent_italicText.nodeType === Node.ELEMENT_NODE) {
     return range_italicText.startOffset;
    } else {
     return range_italicText.startOffset;         
    }
   };
   let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index             */
   var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new italic text */
    return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount));
   };   
   /* update the parent HTML with text containg italic selection */
   parentIDWithSelectedText_italicText.innerHTML = 
    insertAtIndex(curInnerHTML, italicStyleSelection, curIndex, curLengthOfText);
  }
  selection_italicText = undefined;
  lastThreeKeys_italicText = [];
 };

 /* Listen form key combo to italic text. */
 const addKeyDown_italicText = () => { 
  document.body.addEventListener("keydown", function(event) {
   keypressToBookmarklet_italicText(event.key);  
  });   
 }; 
 
 /****************************************************************** 
   Listen for keydonw event, running main function and italic selected
   text if the keyboard input is keyCombo_italicText variable.
 *******************************************************************/ 
 addKeyDown_italicText();
 
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructions_italicText != undefined && 
     alertWithInstructions_italicText == 1) {
  let alertText = 
        "INSTRUCTIONS:     \n"   + 
        "*************     \n"   +
        "Press '" + keyCombo_italicText + "' to make selected text italic.             \n" +
        "To remove press '" + keyCombo_italicText + "' some of previous styled text. \n\n" +
        "For best results: \n\n" +
        " - Avoid selecting text with different sytling.   \n"     +
        " - Avoid selecting a word that is often repeated. \n"     +
        " - Press each key specified one at a time.        \n"     +
        " - If using with another style bookmarklet, press '"      + noPressKey_italicText + "'\n" +
        "   button THREE times with NO text selected       \n"     +
        "   before styling another with a different style  \n"     +
        "   and key combo.                                 \n"     +
        " - If style is not applied, press just '" + 
        keyCombo_italicText[keyCombo_italicText.length-1] + "' again.";        
  alert(alertText);
 } 
})();