javascript:(function() {
 /* Define global variables. */
 var currentPage = 
  location.href.replace(/#~:text=*/g, ""); /* current uri              */
 var initTextAnchor = "#:~:text=";         /* anchor syntax for text   */
 
 /* Store highlighted text in a variable using function.               */
 const selectHighlightedText = () => {
   let selection = window.getSelection(); /* use window property       */
   if (selection.rangeCount > 0) {        /* if some text selected     */
     return encodeURI(selection         /* return it as am emcpded     */
     .getRangeAt(0).toString()          /* URI string replacing        */ 
     .replace(/ {2,}/g, " ")            /* two or more spaces          */
     .replace(/\n/g, ""));              /* and rendered new lines str  */ 
   } else {                                     /* if none selected    */
     return "";                                 /* return empty string */
   }
 };
 
 /* Store results of selectHighlightedText() call. */
 var selectedText = selectHighlightedText();
 
 /* Set URI with anchor to highlighted text.       */
 location.href = `${currentPage}${initTextAnchor}${selectedText}`;
})(); 