javascript:(function() {
/* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */
 var alertWithInstructions_fileText = 1;  /* turn instruction alert on or off                 */
 var noPressKey_fileText = "SHIFT";       /* button to press when using with other bookmarkel */

 /* Define global variables. */ 
 var numberOfKeyPresses_fileText = 3;/* specify how many keypresses are used            */
 var currentStyleOpenTag_fileText  = "<_tagName_>";  /* open tag to style selection     */
 var currentStyleCloseTag_fileText = "</_tagName_>"; /* close tag to style selection    */ 
 var keyCombo_fileText = "Control+Shift+_CHANGE_"; /* key combo to change style         */ 
 
 /* Declare global variables */
 var range_fileText, selection_fileText, selectionParent_fileText, 
     selectedString_fileText, parentIDWithSelectedText_fileText;
 
 /******************************* MAIN FUNCTION *******************************/
 /*****************************************************************************/
 var keySwitch_fileText = 0;      
 var lastThreeKeys_fileText = []; /* enables last three key presses to be stored */
 function keypressToBookmarklet_fileText(key_press) {
  /* keyboard combo that enablse text to be style file */       
  lastThreeKeys_fileText.push(key_press);
  
  /* keep only the last three keys */
  if (lastThreeKeys_fileText.length > numberOfKeyPresses_fileText) {
   lastThreeKeys_fileText.shift();
  }
  
  /* check key combo                                   */
  if (numberOfKeyPresses_fileText == 2) {      
   /* check if key combo is keyCombo_fileText variable */
   let checkIfKeyCombo_fileText = 
    lastThreeKeys_fileText[0] + "+" +
    lastThreeKeys_fileText[1];
   if (checkIfKeyCombo_fileText == keyCombo_fileText) {   
    getParentElementOfSelection_fileText(); /* get parent of selected text     */
   }
  } 
  else if (numberOfKeyPresses_fileText == 3) {
   /* check if key combo is keyCombo_fileText variable */
   let checkIfKeyCombo_fileText = 
    lastThreeKeys_fileText[0] + "+" +
    lastThreeKeys_fileText[1] + "+" +
    lastThreeKeys_fileText[2];   
   if (checkIfKeyCombo_fileText == keyCombo_fileText) {
    getParentElementOfSelection_fileText(); /* get parent of selected text     */
   }    
  }
  else {
   /* check if key combo is keyCombo_fileText variable */
   let checkIfKeyCombo_fileText = 
    lastThreeKeys_fileText[0];
   if (checkIfKeyCombo_fileText == keyCombo_fileText) {   
    getParentElementOfSelection_fileText(); /* get parent of selected text     */
   }
  }
 }


 /***** Support Functions: *****/ 
 /* Get parent of selection, give it id and use it to style selected text. */
 const getParentElementOfSelection_fileText = () => {
   /* get the current selection */
   selection_fileText = window.getSelection();
   
   if (selection_fileText.rangeCount > 0) { /* ensure something is selected            */
    /* prepare elements to change selection                                                 */
    range_fileText = selection_fileText.getRangeAt(0);  /* first object of selection        */
    selectionParent_fileText = range_fileText.commonAncestorContainer; /* node of selection */
 
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
    
     selectedString_fileText = range_fileText.toString(); /* store as string       */     
     /* ensure selection is a text node                                                      */
     if (selectionParent_fileText.nodeType === 3) { /* if it is a text node             */
      let curPar = selectionParent_fileText.parentElement; /* store the parent element  */
      let outText = curPar.outerHTML;  /* select all of the styled element                   */
      let keepText = curPar.innerText; /* select only the text of styled element             */
      let checkIfStyleApplied = /* check if the style has already been applied               */
       currentStyleOpenTag_fileText.replace(/[<>]/g, "").toUpperCase();
      
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
      parentIDWithSelectedText_fileText = 
       document.getElementById("bm_window_style");
      /* apply styling to selection */  
      fileTheSelectedText();
    }
   } 
  }
 };
 
 /* Style text using the ID added to parent element in getParentElementOfSelection_fileText(). */
 const fileTheSelectedText = () => {
  /* store the curren innerHTML to update with file text */
  let curInnerHTML = parentIDWithSelectedText_fileText.innerHTML;

  /* wrap selection in HTML u tag                                          */
  let fileStyleSelection = /* use variables defined at top and in main function    */
   currentStyleOpenTag_fileText + selectedString_fileText + currentStyleCloseTag_fileText;
  
  /* if only one occurence of selected text in parent element */
  if (curInnerHTML.indexOf(selectedString_fileText) == 
      curInnerHTML.lastIndexOf(selectedString_fileText)) {
   /* replace selection with newly styled text  */
   curInnerHTML = curInnerHTML.replace(selectedString_fileText, fileStyleSelection);
   
   /* Update parent HTML with newly styled text */
   parentIDWithSelectedText_fileText.innerHTML = curInnerHTML;
  } else {
   /* variable used so insertion is not duplicated */
   let curLengthOfText = selectedString_fileText.length;   
   /* HOT-GLUE - make a good guess as to where index of current selection is within parent */
   var getCurIndex = () => {    
    /* Ensure parent is an element node */
    if (selectionParent_fileText.nodeType === Node.ELEMENT_NODE) {
     return range_fileText.startOffset;
    } else {
     return range_fileText.startOffset;         
    }
   };
   let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index             */
   var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new file text */
    return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount));
   };   
   /* update the parent HTML with text containg file selection */
   parentIDWithSelectedText_fileText.innerHTML = 
    insertAtIndex(curInnerHTML, fileStyleSelection, curIndex, curLengthOfText);
  }
  selection_fileText = undefined;
  lastThreeKeys_fileText = [];
 };

 /* Listen form key combo to file text. */
 const addKeyDown_fileText = () => { 
  document.body.addEventListener("keydown", function(event) {
   keypressToBookmarklet_fileText(event.key);  
  });   
 }; 
 
 /****************************************************************** 
   Listen for keydonw event, running main function and file selected
   text if the keyboard input is keyCombo_fileText variable.
 *******************************************************************/ 
 addKeyDown_fileText();
 
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructions_fileText != undefined && 
     alertWithInstructions_fileText == 1) {
  let alertText = 
        "INSTRUCTIONS:     \n"   + 
        "*************     \n"   +
        "Press '" + keyCombo_fileText + "' to make selected text file.             \n" +
        "To remove press '" + keyCombo_fileText + "' some of previous styled text. \n\n" +
        "For best results: \n\n" +
        " - Avoid selecting text with different sytling.   \n"     +
        " - Avoid selecting a word that is often repeated. \n"     +
        " - Press each key specified one at a time.        \n"     +
        " - If using with another style bookmarklet, press '"      + noPressKey_fileText + "'\n" +
        "   button THREE times with NO text selected       \n"     +
        "   before styling another with a different style  \n"     +
        "   and key combo.                                 \n"     +
        " - If style is not applied, press just '" + 
        keyCombo_fileText[keyCombo_fileText.length-1] + "' again.";        
  alert(alertText);
 } 

})();