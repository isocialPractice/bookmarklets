javascript:(function(){ 
 var pageDownBy = 500; /* <-- CHANGE - pixels to page down by. ****/
 /* The above variable sets the pixels for custom page down. ******/
 /* Page down via function using argument from "addEventListener" */ 
 function runPageDown(y) { /* y is essentially pageDownBy value. **/
  scrollTo(0, y);          /* y is set when the page is clicked. **/
 }
 /* Next add click event to page so that clicking calls function. */
 /* Click performs "runPageDown()" with argument & Y position.*****/
 document.body.addEventListener("click", 
  function() {
    pageDown = pageYOffset + pageDownBy; 
    runPageDown(pageDown)
  }
 );
})();
