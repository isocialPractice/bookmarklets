javascript:(function() {
 /* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */
 var alertWithInstructions_boldText = 1;  /* turn instruction alert on or off                 */
 var noPressKey_boldText = "SHIFT";       /* button to press when using with other bookmarkel */

 /* Define global variables. */ 
 var numberOfKeyPresses_boldText = 2;/* specify how many keypresses are used         */
 var currentStyleOpenTag_boldText  = "<strong>";  /* open tag to style selection     */
 var currentStyleCloseTag_boldText = "</strong>"; /* close tag to style selection    */ 
 var keyCombo_boldText = "Control+b"; /* key combo to change style        */ 
 
 /* Declare global variables */
 var range_boldText, selection_boldText, selectionParent_boldText, 
     selectedString_boldText, parentIDWithSelectedText_boldText;
 
 /******************************* MAIN FUNCTION *******************************/
 /*****************************************************************************/
 var keySwitch_boldText = 0;      
 var lastThreeKeys_boldText = []; /* enables last three key presses to be stored */
 function keypressToBookmarklet_boldText(key_press) {
  /* keyboard combo that enablse text to be style bold */       
  lastThreeKeys_boldText.push(key_press);
  
  /* keep only the last three keys */
  if (lastThreeKeys_boldText.length > numberOfKeyPresses_boldText) {
   lastThreeKeys_boldText.shift();
  }
  
  /* check key combo                                   */
  if (numberOfKeyPresses_boldText == 2) {      
   /* check if key combo is keyCombo_boldText variable */
   let checkIfKeyCombo_boldText = 
    lastThreeKeys_boldText[0] + "+" +
    lastThreeKeys_boldText[1];
   if (checkIfKeyCombo_boldText == keyCombo_boldText) {   
    getParentElementOfSelection_boldText(); /* get parent of selected text     */
   }
  } 
  else if (numberOfKeyPresses_boldText == 3) {
   /* check if key combo is keyCombo_boldText variable */
   let checkIfKeyCombo_boldText = 
    lastThreeKeys_boldText[0] + "+" +
    lastThreeKeys_boldText[1] + "+" +
    lastThreeKeys_boldText[2];   
   if (checkIfKeyCombo_boldText == keyCombo_boldText) {
    getParentElementOfSelection_boldText(); /* get parent of selected text     */
   }    
  }
  else {
   /* check if key combo is keyCombo_boldText variable */
   let checkIfKeyCombo_boldText = 
    lastThreeKeys_boldText[0];
   if (checkIfKeyCombo_boldText == keyCombo_boldText) {   
    getParentElementOfSelection_boldText(); /* get parent of selected text     */
   }
  }
 }


 /***** Support Functions: *****/ 
 /* Get parent of selection, give it id and use it to style selected text. */
  const getParentElementOfSelection_boldText = () => {
   /* get the current selection */
   selection_boldText = window.getSelection();
   
   if (selection_boldText.rangeCount > 0) { /* ensure something is selected            */
    /* prepare elements to change selection                                                 */
    range_boldText = selection_boldText.getRangeAt(0);  /* first object of selection        */
    selectionParent_boldText = range_boldText.commonAncestorContainer; /* node of selection */
 
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
    
     selectedString_boldText = range_boldText.toString(); /* store as string       */     
     /* ensure selection is a text node                                                      */
     if (selectionParent_boldText.nodeType === 3) { /* if it is a text node             */
      let curPar = selectionParent_boldText.parentElement; /* store the parent element  */
      let outText = curPar.outerHTML;  /* select all of the styled element                   */
      let keepText = curPar.innerText; /* select only the text of styled element             */
      let checkIfStyleApplied = /* check if the style has already been applied               */
       currentStyleOpenTag_boldText.replace(/[<>]/g, "").toUpperCase();
       
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
      parentIDWithSelectedText_boldText = 
       document.getElementById("bm_window_style");
      /* apply styling to selection */  
      boldTheSelectedText();
    }
   } 
  }
 };
 
 /* Style text using the ID added to parent element in getParentElementOfSelection_boldText(). */
 const boldTheSelectedText = () => {
  /* store the curren innerHTML to update with bold text */
  let curInnerHTML = parentIDWithSelectedText_boldText.innerHTML;

  /* wrap selection in HTML u tag                                          */
  let boldStyleSelection = /* use variables defined at top and in main function    */
   currentStyleOpenTag_boldText + selectedString_boldText + currentStyleCloseTag_boldText;
  
  /* if only one occurence of selected text in parent element */
  if (curInnerHTML.indexOf(selectedString_boldText) == 
      curInnerHTML.lastIndexOf(selectedString_boldText)) {
   /* replace selection with newly styled text  */
   curInnerHTML = curInnerHTML.replace(selectedString_boldText, boldStyleSelection);
   
   /* Update parent HTML with newly styled text */
   parentIDWithSelectedText_boldText.innerHTML = curInnerHTML;
  } else {
   /* variable used so insertion is not duplicated */
   let curLengthOfText = selectedString_boldText.length;   
   /* HOT-GLUE - make a good guess as to where index of current selection is within parent */
   var getCurIndex = () => {    
    /* Ensure parent is an element node */
    if (selectionParent_boldText.nodeType === Node.ELEMENT_NODE) {
     return range_boldText.startOffset;
    } else {
     return range_boldText.startOffset;         
    }
   };
   let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index             */
   var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new bold text */
    return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount));
   };   
   /* update the parent HTML with text containg bold selection */
   parentIDWithSelectedText_boldText.innerHTML = 
    insertAtIndex(curInnerHTML, boldStyleSelection, curIndex, curLengthOfText);
  }
  selection_boldText = undefined;
  lastThreeKeys_boldText = [];
 };

 /* Listen form key combo to bold text. */
 const addKeyDown_boldText = () => { 
  document.body.addEventListener("keydown", function(event) {
   keypressToBookmarklet_boldText(event.key);  
  });   
 }; 
 
 /****************************************************************** 
   Listen for keydonw event, running main function and bold selected
   text if the keyboard input is keyCombo_boldText variable.
 *******************************************************************/ 
 addKeyDown_boldText();
 
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructions_boldText != undefined && 
     alertWithInstructions_boldText == 1) {
  let alertText = 
        "INSTRUCTIONS:     \n"   + 
        "*************     \n"   +
        "Press '" + keyCombo_boldText + "' to make selected text bold.             \n" +
        "To remove press '" + keyCombo_boldText + "' some of previous styled text. \n\n" +
        "For best results: \n\n" +
        " - Avoid selecting text with different sytling.   \n"     +
        " - Avoid selecting a word that is often repeated. \n"     +
        " - Press each key specified one at a time.        \n"     +
        " - If using with another style bookmarklet, press '"      + noPressKey_boldText + "'\n" +
        "   button THREE times with NO text selected       \n"     +
        "   before styling another with a different style  \n"     +
        "   and key combo.                                 \n"     +
        " - If style is not applied, press just '" + 
        keyCombo_boldText[keyCombo_boldText.length-1] + "' again.";        
  alert(alertText);
 } 
})();