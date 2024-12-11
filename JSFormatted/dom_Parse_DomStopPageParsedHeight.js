javascript:(function() {
 /* Configurable variables .*/
 const noPageParseDomStopPageParsedHeight = 0;    /* prevent new items from being parsed to page */
 const loadTextDomStopPageParsedHeight =          /* lazy loader class name contains these       */ 
  ["lazy_loader", "lazy-loader", "lazyLoader", "lazyObject", "lazyData"];
 const tagCheckDomStopPageParsedHeight =          /* parent element where content may be parsed   */
  ["div", "ol", "ul", "section", "span", "p", "article", "aside"];
 const tagCheckDomStopPageParsedHeightLen =       /*length of above array                        */ 
  tagCheckDomStopPageParsedHeight.length;
 var numberOfRecursDomStopPageParsedHeight = 500; /* times to recurse befor removing listener    */

 /* Global variables. */
 const allElementsDomStopPageParsedHeight = document.querySelectorAll('*');
 const docBodyDomStopPageParsedHeight = document.getElementsByTagName("body");
 var docScrollHeightDomStopPageParsedHeight = docBodyDomStopPageParsedHeight[0].scrollHeight;

 /*  Switches to go through guess array tagCheckDomStopPageParsedHeight. */
 var useNextTagDomStopPageParsedHeight = 1;

 /*  Declare and define or redefined later. */
 var listWithParseFeedDomStopPageParsedHeight;

 /*  Set and reset sessionStorage items. */
 {
 if (sessionStorage.getItem("initialBodyHeightDomStopPageParsedHeight") != null) {
  sessionStorage.removeItem("initialBodyHeightDomStopPageParsedHeight");    
 }
 if (sessionStorage.getItem("indexGuessDomStopPageParsedHeight") != null) {
  sessionStorage.removeItem("indexGuessDomStopPageParsedHeight");
 }
 sessionStorage.setItem("initialBodyHeightDomStopPageParsedHeight", docScrollHeightDomStopPageParsedHeight);
 sessionStorage.removeItem("indexedListWithParseFeedDomStopPageParsedHeight");
 }

 /**********************************************************************************************************************
 *                                                    MAIN FUNCTION                                                    *  
 *    Sets seesionStorage to check against each elements child count, and marking target when child count changes.     *   
 ***********************************************************************************************************************/
 function checkForParsedItemsDomStopPageParsedHeight() {    
  /* loop through elements from array tagCheckDomStopPageParsedHeight */
  let skip; /* used to skip over elements not in HTML DOM             */
  var loopAndCheckElement = (curEl) => {
   let targetElement = document.getElementsByTagName(curEl);
   let targetElementLen = targetElement.length;        
   /* ready local functino variables                                  */
   let childCount=0, listItem=0, guestimateIndex;   
   if (targetElementLen == 0) { /* if none then exit out of loop      */ 
    skip = 1; /*reset in loop calling local function                  */
    return;
   } else {
    for (i = 0; i < targetElementLen; i++) {/* check for new items    */
     if (targetElement[i].scrollHeight > 500) { /* ensure height      */
      if (sessionStorage.getItem("listItemDomStopPageParsedHeight" + curEl + i)==null) {
       sessionStorage.setItem( /* set by element and loop index       */
        "listItemDomStopPageParsedHeight" + curEl +i, targetElement[i].children.length
       );
      } else {
       /* used to compare against changes of items being added        */ 
       listItem = /* last count                                       */
        sessionStorage.getItem("listItemDomStopPageParsedHeight" + curEl + i);
       
       childCount = /* current count                                  */
        targetElement[i].children.length;
      }   
      if (String(childCount) == String(listItem)) { /* store count    */
       sessionStorage.setItem( /* used in next recurse from listener  */
        "listItemDomStopPageParsedHeight" + curEl + i, targetElement[i].children.length
       );
      } else { /* may be items parsed to dom, may be tag looking for   */
       sessionStorage.setItem( /* store to check against              */
        "listItemDomStopPageParsedHeight" + curEl + i, targetElement[i].children.length
       );
       /* set storage if not set                                      */
       if (sessionStorage.getItem("indexGuessDomStopPageParsedHeight" + curEl) == null) {
        sessionStorage.setItem("indexGuessDomStopPageParsedHeight" + curEl, i);                    
       } else {
        /* extract storage and define local variable to check against */
        guestimateIndex = /* check previouly stored index             */
         sessionStorage.getItem("indexGuessDomStopPageParsedHeight" + curEl);
        
        sessionStorage.setItem( /* store current iteration index      */
         "indexGuessDomStopPageParsedHeight" + curEl, i
        );
       }
       /* ensure guess is curren index of loop                        */
       if (i == guestimateIndex) { /* define switch session storage   */ 
        if (sessionStorage.getItem("indexedListWithParseFeedDomStopPageParsedHeight") == null) {
         listWithParseFeedDomStopPageParsedHeight = /* select html    */
          targetElement[i];
         sessionStorage.setItem( /* set session storage switch        */
          "indexedListWithParseFeedDomStopPageParsedHeight", 1
         );
         /* style to prevent page height from growing with parsing     */
         listWithParseFeedDomStopPageParsedHeight.setAttribute("style", `
          overflow-y: scroll !important; 
          height: ${listWithParseFeedDomStopPageParsedHeight.scrollHeight}px !important; 
          max-height: ${listWithParseFeedDomStopPageParsedHeight.scrollHeight}px !important;`
         );                        
         /* finalize with some double checkin in function checkGuessDomStopPageParsedHeight   */
         document.addEventListener("scroll", checkGuessDomStopPageParsedHeight);                                
         useNextTagDomStopPageParsedHeight = 0; /* set switch var.    */                        
         sessionStorage.removeItem( /* remove session storage item    */ 
          "indexGuessDomStopPageParsedHeight" + curEl
         );
         break;
        }                    
       }                 
      }
     }
    }  
   }
  };
  /* switch not off, loop array tagCheckDomStopPageParsedHeight       */
  if (useNextTagDomStopPageParsedHeight == 1) {  /* switch is on      */
   for (j = 0; j < tagCheckDomStopPageParsedHeightLen; j++) { /* loop */ 
    loopAndCheckElement(tagCheckDomStopPageParsedHeight[j]); /*  tag  */   
    if (skip == 1) { skip = 0; continue; } /* reset and skip if none  */
   }
  }
 }

 /***********************  SUPPORT FUNCTIONS ************************/
 /* Refine handling of selected element at set scroll height. *******/
 const checkGuessDomStopPageParsedHeight = () => {
   docScrollHeightDomStopPageParsedHeight = /* current page height  */
    docBodyDomStopPageParsedHeight[0].scrollHeight;
   
   let listScrollHeight =  /* element height                        */
    listWithParseFeedDomStopPageParsedHeight.style.height.replace("px", "");
   
   let checkHeightDiff =   /* check difference                      */
    Number(docScrollHeightDomStopPageParsedHeight) - Number(listScrollHeight);
   
   /* Get the current scroll position                               */
   let scrollTop = window.pageYOffset;
   if (checkHeightDiff >= 500) { /* estimate were check on scroll   */
    if (scrollTop >= Number(listScrollHeight - 500)) { /* around it */
     let initialHeight = /* check last stored page height           */
      sessionStorage.getItem("initialBodyHeight");
      
     if (initialHeight == docScrollHeightDomStopPageParsedHeight) {
      /* looks like gueses were wrong - maybe this will work        */
      listWithParseFeedDomStopPageParsedHeight = docBodyDomStopPageParsedHeight[0];
      
      sessionStorage.setItem( /* prevent any more tags being marked */
       "indexedListWithParseFeedDomStopPageParsedHeight", 1
      );
      /* style body tag of html page                                */
      listWithParseFeedDomStopPageParsedHeight.setAttribute("style", `
       overflow-y: scroll !important; 
       height: ${listWithParseFeedDomStopPageParsedHeight.scrollHeight}px !important; 
       max-height: ${listWithParseFeedDomStopPageParsedHeight.scrollHeight}px !important;`
      );                     
      
      /* remove listener                                            */
      document.removeEventListener("scroll", checkForParsedItemsDomStopPageParsedHeight);                    
     } 
    }
   }
 };

 /*  Loop through each element and output class if match configu var. */
 var spinnerDomStopPageParsedHeight, 
     spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight = 0;
 const outloadTextDomStopPageParsedHeight = (curArray, curClass) => {
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
 allElementsDomStopPageParsedHeight.forEach(element => { /* get class */
  if (spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight == 0) {
  /* get the class list of the element                                */
  let classList = element.classList;

  /* check if the element has any classes                             */
  if (classList.length > 0) {
   /* loop through each class                                         */
   classList.forEach(className => {
    
    /* check if class name matches lazy load guess, store in var      */
    spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight = 
     outloadTextDomStopPageParsedHeight(loadTextDomStopPageParsedHeight, className);
    });
   }
  }
 });
 
 /* If a class was output means on by that name so modify element. ****/
 if (spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight != 0 ) { 
  spinnerDomStopPageParsedHeight = /* only one so select at index 0   */
   document.getElementsByClassName(spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight)[0];
  
  /* hide from dom so no random spinner going on                      */
  spinnerDomStopPageParsedHeight.style.display = "none";
 }
 
 /*  Remove after items has been styled. ******************************/
 const checkAndRemoveListener = () => { /* if configed to stop parse  */
  let checkNoPageParse = () => {
   if (noPageParseDomStopPageParsedHeight == 1) { /* stop parsing     */
    let spinMark = spinnerDomStopPageParsedHeight.previousElementSibling;
    if (spinMark) { /* may be the prior sibling as parse anchor       */ 
     if (spinMark.innerText.length <= 1) { /* make sure it's empty    */
       spinMark.remove(); /* looks like the tag looking for so remove */
       console.log("Parsing to Page has been Disabled:"); /* notify   */
     }
    }
   }
  };
  /* Remove scroll listener if parse tag has been marked and styled. ***************/
  setTimeout(function() { /* */
   if (useNextTagDomStopPageParsedHeight == 0) { /* switch is of remove listener   */
    document.removeEventListener("scroll", checkForParsedItemsDomStopPageParsedHeight);    
    console.log("Event Removed:"); /* norify                                       */
    checkNoPageParse();  /* check additional config is on or not to stop parse     */
   } else {
    if (numberOfRecursDomStopPageParsedHeight >= 0) { /* have not reached limit    */
     numberOfRecursDomStopPageParsedHeight--; /* decrement value                   */
     checkAndRemoveListener(); /* recurs                                           */
    } else { /* readched limit, notify, and remove listener                        */
     console.log("No parent tag was marked.\n" + 
      "Try editing array tagCheckDomStopPageParsedHeight manually.\n" +
      "Event Removed:");
     checkNoPageParse();  /* check additional config is on or not to stop parse    */
    }
   }
  }, 100);
 };

 /* Set listener to elements from  array tagCheckDomStopPageParsedHeight defined ***
    at the top. ********************************************************************/
 document.addEventListener( /* add listener to check for changes and mark tag      */
  "scroll", checkForParsedItemsDomStopPageParsedHeight
 );

 /* remove event listener after it has styled page */
 checkAndRemoveListener();

})(); 