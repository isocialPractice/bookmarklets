javascript:(function() {
/* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */
 var alertWithInstructions_highlightText = 1;  /* turn instruction alert on or off                 */
 var noPressKey_highlightText = "SHIFT";       /* button to press when using with other bookmarkel */

 /* Define global variables. */ 
 var numberOfKeyPresses_highlightText = 3;/* specify how many keypresses are used            */
 var currentStyleOpenTag_highlightText  = "<span style='background:yellow'>";  /* open tag to style selection     */
 var currentStyleCloseTag_highlightText = "</span>"; /* close tag to style selection    */ 
 var keyCombo_highlightText = "Control+Shift+h"; /* key combo to change style         */ 
 
 /* Declare global variables */
 var range_highlightText, selection_highlightText, selectionParent_highlightText, 
     selectedString_highlightText, parentIDWithSelectedText_highlightText;
 
 /******************************* MAIN FUNCTION *******************************/
 /*****************************************************************************/
 var keySwitch_highlightText = 0;      
 var lastThreeKeys_highlightText = []; /* enables last three key presses to be stored */
 function keypressToBookmarklet_highlightText(key_press) {
  /* keyboard combo that enablse text to be style file */       
  lastThreeKeys_highlightText.push(key_press);
  
  /* keep only the last three keys */
  if (lastThreeKeys_highlightText.length > numberOfKeyPresses_highlightText) {
   lastThreeKeys_highlightText.shift();
  }
  
  /* check key combo                                   */
  if (numberOfKeyPresses_highlightText == 2) {      
   /* check if key combo is keyCombo_highlightText variable */
   let checkIfKeyCombo_highlightText = 
    lastThreeKeys_highlightText[0] + "+" +
    lastThreeKeys_highlightText[1];
   if (checkIfKeyCombo_highlightText == keyCombo_highlightText) {   
    getParentElementOfSelection_highlightText(); /* get parent of selected text     */
   }
  } 
  else if (numberOfKeyPresses_highlightText == 3) {
   /* check if key combo is keyCombo_highlightText variable */
   let checkIfKeyCombo_highlightText = 
    lastThreeKeys_highlightText[0] + "+" +
    lastThreeKeys_highlightText[1] + "+" +
    lastThreeKeys_highlightText[2];   
   if (checkIfKeyCombo_highlightText == keyCombo_highlightText) {
    getParentElementOfSelection_highlightText(); /* get parent of selected text     */
   }    
  }
  else {
   /* check if key combo is keyCombo_highlightText variable */
   let checkIfKeyCombo_highlightText = 
    lastThreeKeys_highlightText[0];
   if (checkIfKeyCombo_highlightText == keyCombo_highlightText) {   
    getParentElementOfSelection_highlightText(); /* get parent of selected text     */
   }
  }
 }


 /***** Support Functions: *****/ 
 /* Get parent of selection, give it id and use it to style selected text. */
 const getParentElementOfSelection_highlightText = () => {
   /* get the current selection */
   selection_highlightText = window.getSelection();
   
   if (selection_highlightText.rangeCount > 0) { /* ensure something is selected            */
    /* prepare elements to change selection                                                 */
    range_highlightText = selection_highlightText.getRangeAt(0);  /* first object of selection        */
    selectionParent_highlightText = range_highlightText.commonAncestorContainer; /* node of selection */
 
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
    
     selectedString_highlightText = range_highlightText.toString(); /* store as string       */     
     /* ensure selection is a text node                                                      */
     if (selectionParent_highlightText.nodeType === 3) { /* if it is a text node             */
      let curPar = selectionParent_highlightText.parentElement; /* store the parent element  */
      let outText = curPar.outerHTML;  /* select all of the styled element                   */
      let keepText = curPar.innerText; /* select only the text of styled element             */
      let checkIfStyleApplied = /* check if the style has already been applied               */
       currentStyleOpenTag_highlightText.replace(/[<>]/g, "").toUpperCase();
       /* account for  style attributes that may be applied intemplate                       */
       checkIfStyleApplied = checkIfStyleApplied.substr(0, checkIfStyleApplied.indexOf(" "));
      
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
      parentIDWithSelectedText_highlightText = 
       document.getElementById("bm_window_style");
      /* apply styling to selection */  
      fileTheSelectedText();
    }
   } 
  }
 };
 
 /* Style text using the ID added to parent element in getParentElementOfSelection_highlightText(). */
 const fileTheSelectedText = () => {
  /* store the curren innerHTML to update with file text */
  let curInnerHTML = parentIDWithSelectedText_highlightText.innerHTML;

  /* wrap selection in HTML u tag                                          */
  let fileStyleSelection = /* use variables defined at top and in main function    */
   currentStyleOpenTag_highlightText + selectedString_highlightText + currentStyleCloseTag_highlightText;
  
  /* if only one occurence of selected text in parent element */
  if (curInnerHTML.indexOf(selectedString_highlightText) == 
      curInnerHTML.lastIndexOf(selectedString_highlightText)) {
   /* replace selection with newly styled text  */
   curInnerHTML = curInnerHTML.replace(selectedString_highlightText, fileStyleSelection);
   
   /* Update parent HTML with newly styled text */
   parentIDWithSelectedText_highlightText.innerHTML = curInnerHTML;
  } else {
   /* variable used so insertion is not duplicated */
   let curLengthOfText = selectedString_highlightText.length;   
   /* HOT-GLUE - make a good guess as to where index of current selection is within parent */
   var getCurIndex = () => {    
    /* Ensure parent is an element node */
    if (selectionParent_highlightText.nodeType === Node.ELEMENT_NODE) {
     return range_highlightText.startOffset;
    } else {
     return range_highlightText.startOffset;         
    }
   };
   let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index             */
   var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new file text */
    return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount));
   };   
   /* update the parent HTML with text containg file selection */
   parentIDWithSelectedText_highlightText.innerHTML = 
    insertAtIndex(curInnerHTML, fileStyleSelection, curIndex, curLengthOfText);
  }
  selection_highlightText = undefined;
  lastThreeKeys_highlightText = [];
 };

 /* Listen form key combo to file text. */
 const addKeyDown_highlightText = () => { 
  document.body.addEventListener("keydown", function(event) {
   keypressToBookmarklet_highlightText(event.key);  
  });   
 }; 
 
 /****************************************************************** 
   Listen for keydonw event, running main function and file selected
   text if the keyboard input is keyCombo_highlightText variable.
 *******************************************************************/ 
 addKeyDown_highlightText();
 
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructions_highlightText != undefined && 
     alertWithInstructions_highlightText == 1) {
  let alertText = 
        "INSTRUCTIONS:     \n"   + 
        "*************     \n"   +
        "Press '" + keyCombo_highlightText + "' to make selected text file.             \n" +
        "To remove press '" + keyCombo_highlightText + "' some of previous styled text. \n\n" +
        "For best results: \n\n" +
        " - Avoid selecting text with different sytling.   \n"     +
        " - Avoid selecting a word that is often repeated. \n"     +
        " - Press each key specified one at a time.        \n"     +
        " - If using with another style bookmarklet, press '"      + noPressKey_highlightText + "'\n" +
        "   button THREE times with NO text selected       \n"     +
        "   before styling another with a different style  \n"     +
        "   and key combo.                                 \n"     +
        " - If style is not applied, press just '" + 
        keyCombo_highlightText[keyCombo_highlightText.length-1] + "' again.";        
  alert(alertText);
 } 

})();