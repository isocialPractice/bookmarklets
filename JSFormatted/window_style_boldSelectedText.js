javascript:(function() {
 /* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */
 var alertWithInstructions_boldText = 1;

 /* Define global variables.                    */ 
 var currentBoldCount = 1; /* count number of times run to get unique ids */
 var currentStyleOpenTag_boldText  = "<strong>";  /* open tag to style selection  */
 var currentStyleCloseTag_boldText = "</strong>"; /* close tag to style selection */
 
 /* Declare global variables */
 var range_boldText, selection_boldText, selectionParent_boldText, 
     selectedString_boldText, parentIDWithSelectedText_boldText;
 
 /***** MAIN FUNCTION *****/
 function keypressToBookmarklet_boldText() {
  /* keyboard combo that enablse text to be style bold */
  let lastBoldKeypress = sessionStorage.getItem("bm_last_bold_keypress");
  let currentBoldKeyPress = event.key;

  /* check if sessionStorage already contains data with above var names */
  if (lastBoldKeypress == null) {
   sessionStorage.setItem("bm_last_bold_keypress", event.key);
   lastBoldKeypress = sessionStorage.getItem("bm_last_bold_keypress");
  }
  /* variable to check key combo */
  let checkKeyComboBoldText = 
   lastBoldKeypress + "+" + currentBoldKeyPress;

  /* check if key combo is ctrl + b */
  if (checkKeyComboBoldText == "Control+b") {   
   currentBoldCount += 1;         /* increment count for unique id   */
   getParentElementOfSelection(); /* get parent of selected text     */
   
   /* add a delay to ensure two previous blocks run */ 
   setTimeout(function() { 
    boldTheSelectedText(); /* wrap the selected text in <strong> tag */
   }, 100);
  }
 }


 /***** Support Functions: *****/ 
 /* Get parent of selection, give it id and use it to style selected text. */
 const getParentElementOfSelection = () => {
   /* get the current selection */
   selection_boldText = window.getSelection();
   
   if (selection_boldText.rangeCount > 0) { /* ensure something is selected            */
    /* prepare elements to change selection                                  */
    range_boldText = selection_boldText.getRangeAt(0);  /* first object of selection       */
    selectionParent_boldText = range_boldText.commonAncestorContainer; /* node of selection */

    selectedString_boldText = range_boldText.toString(); /* store as string      */     
    /* ensure selection is a text node                                  */
    if (selectionParent_boldText.nodeType === 3) { /* if it is a text node        */
     let curPar = selectionParent_boldText.parentElement; /* store the parent element  */

     /* give parent a unique id */
     if (curPar.hasAttribute("id") == true) {
      let curID = curPar.id;
      if (curID.indexOf("bm_window_style_boldSelectedText_") > -1) {       
       /* don't include prior unique ids */
       curID = curID.replace(/bm_window_style_boldSelectedText_[0-9]+/g, "bm_window_style_boldSelectedText_" + currentBoldCount);
       /* set the parents' id to unique id */
       curPar.id = curID;
      } else {
       /* append unique id to the current id value */
       curPar.id += " bm_window_style_boldSelectedText_" + currentBoldCount;
      }
     } else {
      /* set the parents' id to unique id */
      curPar.setAttribute("id", "bm_window_style_boldSelectedText_" + currentBoldCount);
     }       

     /* select by id toget parentelement */
     parentIDWithSelectedText_boldText = 
      document.getElementById("bm_window_style_boldSelectedText_" + currentBoldCount);
    } else {
     let skip;
    }
   }
 };
 
 /* Style text using the ID added to parent element in getParentElementOfSelection(). */
 const boldTheSelectedText = () => {
  /* store the curren innerHTML to update with bold text */
  let curInnerHTML = parentIDWithSelectedText_boldText.innerHTML;

  /* wrap selection in HTML strong tag                                          */
  let boldStyleSelection = /* use variables defined at top and in main function */
   currentStyleOpenTag_boldText + selectedString_boldText + currentStyleCloseTag_boldText;
  
  /* if only one occurence of selected text in parent element */
  if (curInnerHTML.indexOf(selectedString_boldText) == 
      curInnerHTML.lastIndexOf(selectedString_boldText)) {
   /* replace selection with newly styled text */
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
 };

 /* Listen form key combo to bold text. */
 const addKeyDown_boldText = () => { 
  document.body.addEventListener("keydown", function() {
   keypressToBookmarklet_boldText();  
  }); 
 }; 
 
 /****************************************************************** 
   Listen for keydonw event, running main function and bold selected
   text if the keyboard input is "Ctrl + b".
 *******************************************************************/ 
 addKeyDown_boldText();
 
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructions_boldText != undefined && 
     alertWithInstructions_boldText == 1) {
  let alertText = "Press 'Ctrl + b' to make selected text bold. \n\n" +
        "For best results: \n\n" +
        " - Avoid selecting text with different sytling. \n"       +
        " - Avoid selecting a word that is often repeated. \n"     +
        " - Select text on the same line. \n"                      + 
        " - Ensure selection contains entire words. \n";   
  alert(alertText);
 } 
})();