javascript:(function() {
 /* Configurable variables .*/
 const loadTextDomStopPageParsing =          /* lazy loader class name contains these       */ 
  ["lazy_loader", "lazy-loader", "lazyLoader", "lazyObject", "lazyData"];

 /* Global variables. */
 const allElementsDomStopPageParsing =  /* select all page HTML elements in the dom         */
  document.querySelectorAll('*');

 /**********************************************************************************************************************
 *                                                    MAIN FUNCTION                                                    *  
 *   Loop through DOM and check if class names match that of array loadTextDomStopPageParsing                          *
 ***********************************************************************************************************************/
 /*  Loop through each element and output class if match configu var. */
 var spinnerDomStopPageParsing, 
     spinnerDomStopPageParsingClassDomStopPageParsing = 0;
 function outloadTextDomStopPageParsing(curArray, curClass)  {
  let outClass = 0; /* store return in var and/or check if 0 later    */
  for (j in curArray) { /* loop arrary from parameter                 */
   let lowClass = curClass.toLowerCase(); /* enusre match case        */
   let lowArr = curArray[j].toLowerCase();/* enusre match case        */
   if (lowClass.indexOf(lowArr) > -1) { /* has class match            */
    if (document.getElementsByClassName(curClass).length == 1) {/* 1  */    
     outClass = curClass; /* good to go                               */
     break;
    }
   }
  }
  return outClass;
 };

 /**************  INITAL STATEMENTS **************/
 /* Go through all elements and chekc if lazy load class match. *******/
 allElementsDomStopPageParsing.forEach(element => { /* get class */
  if (spinnerDomStopPageParsingClassDomStopPageParsing == 0) {
  /* get the class list of the element                                */
  let classList = element.classList;

  /* check if the element has any classes                             */
  if (classList.length > 0) {
   /* loop through each class                                         */
   classList.forEach(className => {
    
    /* check if class name matches lazy load guess, store in var      */
    spinnerDomStopPageParsingClassDomStopPageParsing = 
     outloadTextDomStopPageParsing(loadTextDomStopPageParsing, className);
    });
   }
  }
 });
 
 /* If a class was output means on by that name so modify element. ****/
 if (spinnerDomStopPageParsingClassDomStopPageParsing != 0 ) { 
  spinnerDomStopPageParsing = /* only one so select at index 0   */
   document.getElementsByClassName(spinnerDomStopPageParsingClassDomStopPageParsing)[0];
  
  /* hide from dom so no random spinner going on                      */
  spinnerDomStopPageParsing.style.display = "none";
  let spinMark = spinnerDomStopPageParsing.previousElementSibling;
  if (spinMark) { /* may be the prior sibling as parse anchor       */ 
   if (spinMark.innerText.length <= 1) { /* make sure it's empty    */
     spinMark.remove(); /* looks like the tag looking for so remove */
     console.log("Parsing to Page has been Disabled:"); /* notify   */
   }
  }
 }

})(); 