javascript:(function() {
 /* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */
 var alertWithInstructions_italicText = 1;

 /* Define global variables.                    */ 
 var currentItalicCount = 1; /* count number of times run to get unique ids */
 var currentStyleOpenTag_italicText  = "<em>";  /* open tag to style selection  */
 var currentStyleCloseTag_italicText = "</em>"; /* close tag to style selection */
 
 /* Declare global variables */
 var range_italicText, selection_italicText, selectionParent_italicText, 
     selectedString_italicText, parentIDWithSelectedText_italicText;
 
 /***** MAIN FUNCTION *****/
 function keypressToBookmarklet_italicText() {
  /* keyboard combo that enablse text to be style italic */
  let lastItalicKeypress = sessionStorage.getItem("bm_last_italic_keypress");
  let currentItalicKeyPress = event.key;

  /* check if sessionStorage already contains data with above var names */
  if (lastItalicKeypress == null) {
   sessionStorage.setItem("bm_last_italic_keypress", event.key);
   lastItalicKeypress = sessionStorage.getItem("bm_last_italic_keypress");
  }
  /* variable to check key combo */
  let checkKeyComboItalicText = 
   lastItalicKeypress + "+" + currentItalicKeyPress;

  /* check if key combo is ctrl + i */
  if (checkKeyComboItalicText == "Control+i") {   
   currentItalicCount += 1;         /* increment count for unique id   */
   getParentElementOfSelection(); /* get parent of selected text     */
   
   /* add a delay to ensure two previous blocks run */ 
   setTimeout(function() { 
    italicTheSelectedText(); /* wrap the selected text in <strong> tag */
   }, 100);
  }
 }


 /***** Support Functions: *****/ 
 /* Get parent of selection, give it id and use it to style selected text. */
 const getParentElementOfSelection = () => {
   /* get the current selection */
   selection_italicText = window.getSelection();
   
   if (selection_italicText.rangeCount > 0) { /* ensure something is selected            */
    /* prepare elements to change selection                                  */
    range_italicText = selection_italicText.getRangeAt(0);  /* first object of selection       */
    selectionParent_italicText = range_italicText.commonAncestorContainer; /* node of selection */

    selectedString_italicText = range_italicText.toString(); /* store as string      */     
    /* ensure selection is a text node                                  */
    if (selectionParent_italicText.nodeType === 3) { /* if it is a text node        */
     let curPar = selectionParent_italicText.parentElement; /* store the parent element  */

     /* give parent a unique id */
     if (curPar.hasAttribute("id") == true) {
      let curID = curPar.id;
      if (curID.indexOf("bm_window_style_italicSelectedText_") > -1) {       
       /* don't include prior unique ids */
       curID = curID.replace(/bm_window_style_italicSelectedText_[0-9]+/g, "bm_window_style_italicSelectedText_" + currentItalicCount);
       /* set the parents' id to unique id */
       curPar.id = curID;
      } else {
       /* append unique id to the current id value */
       curPar.id += " bm_window_style_italicSelectedText_" + currentItalicCount;
      }
     } else {
      /* set the parents' id to unique id */
      curPar.setAttribute("id", "bm_window_style_italicSelectedText_" + currentItalicCount);
     }       

     /* select by id toget parentelement */
     parentIDWithSelectedText_italicText = 
      document.getElementById("bm_window_style_italicSelectedText_" + currentItalicCount);
    } else {
     let skip;
    }
   }
 };
 
 /* Style text using the ID added to parent element in getParentElementOfSelection(). */
 const italicTheSelectedText = () => {
  /* store the curren innerHTML to update with italic text */
  let curInnerHTML = parentIDWithSelectedText_italicText.innerHTML;

  /* wrap selection in HTML strong tag                                          */
  let italicStyleSelection = /* use variables defined at top and in main function */
   currentStyleOpenTag_italicText + selectedString_italicText + currentStyleCloseTag_italicText;
  
  /* if only one occurence of selected text in parent element */
  if (curInnerHTML.indexOf(selectedString_italicText) == 
      curInnerHTML.lastIndexOf(selectedString_italicText)) {
   /* replace selection with newly styled text */
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
 };

 /* Listen form key combo to italic text. */
 const addKeyDown_italicText = () => { 
  document.body.addEventListener("keydown", function() {
   keypressToBookmarklet_italicText();  
  }); 
 }; 
 
 /****************************************************************** 
   Listen for keydonw event, running main function and italic selected
   text if the keyboard input is "Ctrl + i".
 *******************************************************************/ 
 addKeyDown_italicText();
 
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructions_italicText != undefined && 
     alertWithInstructions_italicText == 1) {
  let alertText = "Press 'Ctrl + i' to make selected text italic. \n\n" +
        "For best results: \n\n" +
        " - Avoid selecting text with different sytling. \n"       +
        " - Avoid selecting a word that is often repeated. \n"     +
        " - Select text on the same line. \n"                      + 
        " - Ensure selection contains entire words. \n";   
  alert(alertText);
 } 
})();