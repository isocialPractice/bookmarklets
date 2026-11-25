javascript:(function() {
 /* DOM variables. */
 var bodyChatGPTSearchChatHistory    =       /* to insert style after       */
  document.getElementsByTagName("body");
  
 var historyChatGPTSearchChatHistory;        /* chat history parent - later */

 var chatLinkChatGPTSearchChatHistory =      /* HOT-GLUE - chat link by url */
  "a[href*=\"/c/\"]";

 /* Create variables. */
 var searchParChatGPTSearchChatHistory =     /* parent for search           */
  document.createElement("div");

 var searchChatGPTSearchChatHistory =        /* search through chat history */
  document.createElement("input");
  
 var clearChatGPTSearchChatHistory =         /* clear search element        */
  document.createElement("span");

 /* Global variables defined later. */
 var historyTagChatGPTSearchChatHistory, historyTagChatGPTSearchChatHistoryLen,
     searchIDChatGPTSearchChatHistory, searchParIDChatGPTSearchChatHistory,
     clearIDChatGPTSearchChatHistory;
     
 /* Create raw html to insert */
 var styleChatGPTSearchChatHistory = `
 <style>
  /* search bar - sticks to top of chat history, top and background set by script */
  div#searchParChatGPTSearchChatHistory {
   position: sticky;
   top: 0;
   z-index: 20;
   display: flex;
   align-items: center;
   padding: 6px 8px;
  }

  /* search style - follows sidebar text color for light and dark themes */
  input.searchHistoryChatGPTSearchChatHistory {
   flex: 1;
   min-width: 0;
   padding: 4px 8px;
   border: 1px solid currentColor !important;
   border-radius: 6px;
   background: transparent !important;
   color: inherit !important;
   -webkit-text-fill-color: currentColor !important;
   caret-color: currentColor;
   font-size: 14px;
   opacity: .8;
  }
  input.searchHistoryChatGPTSearchChatHistory::placeholder {
   color: inherit;
   -webkit-text-fill-color: currentColor;
   opacity: .6;
  }

  /* hover and focus search */
  input.searchHistoryChatGPTSearchChatHistory:hover,
  input.searchHistoryChatGPTSearchChatHistory:focus {
   opacity: 1;
   outline: none;
  }

  /* clear style */
  span.clearChatGPTSearchChatHistory {
   cursor: pointer;
   margin-left: 6px;
   padding: 0 7px 2px;
   border: 1px solid currentColor;
   border-radius: 25px;
   opacity: .8;
  }

  /* hover clear */
  span.clearChatGPTSearchChatHistory:hover {
   opacity: 1;
   font-weight: bold;
  }
 </style>
 `;
 
 /* Debug variables. */
 var debugChatGPTSearchChatHistory = 0; /* 0 (default) 1 console.log()s     */

 /******************************** SUPPORT FUNCTIONS ********************************/

 /* Find chat history parent - nearest element holding every sidebar chat link. */
 const findHistoryChatGPTSearchChatHistory = () => {
  /* use history id if still on page */
  let curHistory = document.getElementById("history");
  if (curHistory) return curHistory;

  /* chat links outside of the conversation */
  let curLinks = Array.from(
   document.querySelectorAll(chatLinkChatGPTSearchChatHistory)
  ).filter((curLink) => !curLink.closest("main"));
  if (curLinks.length == 0) return null; /* sidebar closed or not loaded  */

  /* walk up from first chat link until last chat link is inside */
  let lastLink = curLinks[curLinks.length - 1];
  curHistory = curLinks[0].parentElement;
  while (curHistory && !curHistory.contains(lastLink)) {
   curHistory = curHistory.parentElement;
  }
  return curHistory;
 };

 /* Define chat history parent, stopping if not found. */
 historyChatGPTSearchChatHistory = findHistoryChatGPTSearchChatHistory();
 if (!historyChatGPTSearchChatHistory) {
  alert("Chat history not found - open the sidebar and run the bookmarklet again.");
  return;
 }

 /* Define variables for chat history, allowing updated list with search. */
 const defineHistoryChatGPTSearchChatHistory = () => {
  /* find again if chat history was redrawn by the page */
  if (!historyChatGPTSearchChatHistory.isConnected) {
   historyChatGPTSearchChatHistory =
    findHistoryChatGPTSearchChatHistory() || historyChatGPTSearchChatHistory;
  }

  historyTagChatGPTSearchChatHistory =    /* separate chat history        */
   historyChatGPTSearchChatHistory.querySelectorAll(chatLinkChatGPTSearchChatHistory);

  historyTagChatGPTSearchChatHistoryLen = /* for loop use                 */
   historyTagChatGPTSearchChatHistory.length;
 };
 defineHistoryChatGPTSearchChatHistory(); /* call and intial define chats */

 /* Keep search bar at top of scrolling chat history, under any sticky header. */
 const placeSearchChatGPTSearchChatHistory = () => {
  let curPar = searchParIDChatGPTSearchChatHistory;
  if (!curPar || !curPar.isConnected) return;

  /* scrolling parent of the search bar */
  let scrollBox = curPar.parentElement;
  while (scrollBox && scrollBox != document.body &&
         !/(auto|scroll)/.test(getComputedStyle(scrollBox).overflowY)) {
   scrollBox = scrollBox.parentElement;
  }

  /* height of sticky headers before the search bar - HOT-GLUE two levels deep */
  let stickyTop = 0;
  if (scrollBox && scrollBox != document.body) {
   scrollBox.querySelectorAll(":scope > *, :scope > * > *").forEach((curEl) => {
    if (curEl.contains(curPar) ||
        !(curEl.compareDocumentPosition(curPar) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
    let curStyle = getComputedStyle(curEl);
    if (curStyle.position == "sticky") {
     stickyTop = Math.max(stickyTop, (parseFloat(curStyle.top) || 0) + curEl.offsetHeight);
    }
   });
  }
  curPar.style.top = stickyTop + "px";

  /* background of the sidebar so scrolled chats do not show through */
  let bgEl = curPar.parentElement, curBg = "";
  while (bgEl && !curBg) {
   let curColor = getComputedStyle(bgEl).backgroundColor;
   if (curColor && curColor != "transparent" && !/^rgba\(.*,\s*0\)$/.test(curColor)) curBg = curColor;
   bgEl = bgEl.parentElement;
  }
  curPar.style.backgroundColor = curBg || "Canvas";
 };

 /* Search again when the page adds chats, as older chats load on scroll. */
 var searchTimerChatGPTSearchChatHistory = 0;
 const watchHistoryChatGPTSearchChatHistory = () => {
  new MutationObserver(() => {
   if (searchTimerChatGPTSearchChatHistory) return; /* already set to run      */
   searchTimerChatGPTSearchChatHistory = setTimeout(() => {
    searchTimerChatGPTSearchChatHistory = 0;

    /* put search bar back if the page redrew the sidebar */
    if (!searchParIDChatGPTSearchChatHistory.isConnected) {
     let curHistory = findHistoryChatGPTSearchChatHistory();
     if (!curHistory) return;
     historyChatGPTSearchChatHistory = curHistory;
     curHistory.insertAdjacentElement("beforebegin", searchParIDChatGPTSearchChatHistory);
     placeSearchChatGPTSearchChatHistory();
    }

    /* hide added chats that do not match the search */
    if (searchIDChatGPTSearchChatHistory.value) runSearchChatGPTSearchChatHistory();
   }, 150);
  }).observe(document.body, {childList: true, subtree: true});
 };
 
 /* Create the html elements of search above the chat history on left navbar. */
 const createHTMLChatGPTSearchChatHistory = () => {
  /* don't duplicate */
  if (!document.getElementById("searchParChatGPTSearchChatHistory")) {
   /* insert raw style element */
   bodyChatGPTSearchChatHistory[0]
   .insertAdjacentHTML("afterbegin", styleChatGPTSearchChatHistory);
  
   /* id to allow variable storage */
   searchParChatGPTSearchChatHistory.id = "searchParChatGPTSearchChatHistory";
   
   /* add search element parent */
   historyChatGPTSearchChatHistory
   .insertAdjacentElement("beforebegin", searchParChatGPTSearchChatHistory);
   
   /* define forward declared global */
   searchParIDChatGPTSearchChatHistory = /* variable for search parent */
    document.getElementById("searchParChatGPTSearchChatHistory");
 
   /* add attributes to seach element */
   searchChatGPTSearchChatHistory.id = "searchHistoryChatGPTSearchChatHistory";
   searchChatGPTSearchChatHistory.className = "searchHistoryChatGPTSearchChatHistory";
   searchChatGPTSearchChatHistory.type = "text";   
   searchChatGPTSearchChatHistory.placeholder = "Search Chat History";
   
   /* insert search element */
   searchParIDChatGPTSearchChatHistory
   .insertAdjacentElement("afterbegin", searchChatGPTSearchChatHistory);
   
   /* define forward declared global */
   searchIDChatGPTSearchChatHistory = /* variable for search input */
   document.getElementById("searchHistoryChatGPTSearchChatHistory");
   
   /* id to allow variable storage */
   clearChatGPTSearchChatHistory.id = "clearChatGPTSearchChatHistory";
   clearChatGPTSearchChatHistory.className = "clearChatGPTSearchChatHistory";
   clearChatGPTSearchChatHistory.innerText = "x";
   
   /* insert clear element */
   searchIDChatGPTSearchChatHistory
   .insertAdjacentElement("afterend", clearChatGPTSearchChatHistory);
   
   /* define forward declared global */
   clearIDChatGPTSearchChatHistory = /* varaible for clearing search */
    document.getElementById("clearChatGPTSearchChatHistory");
  } else {
   /* do nothing */
   let skip;
  }
 };

 /* Take search input and apply to history, hiding non-matching searches. */
 const runSearchChatGPTSearchChatHistory = () => {
  defineHistoryChatGPTSearchChatHistory(); /* call and redefine chats     */
  placeSearchChatGPTSearchChatHistory();   /* keep position and theme     */

  /* check if current search value matches chat history */ 
  for (i = 0; i < historyTagChatGPTSearchChatHistoryLen; i++) {
   let val = /* current input for search */
    searchIDChatGPTSearchChatHistory.value;

   val = val.toLowerCase(); /* easier search */

   let lowCaseChats =       /* easier search */
    historyTagChatGPTSearchChatHistory[i].textContent.toLowerCase();

   /* for debugging - ensure val is correct */
   if (debugChatGPTSearchChatHistory == 1) {
    console.log(val);
   }
   /* if chat has contents of search */
   if (lowCaseChats.indexOf(val) > -1) {
    historyTagChatGPTSearchChatHistory[i].style.display = /* show */
     "";
   } else {
    historyTagChatGPTSearchChatHistory[i].style.display = /* hide */
     "none";
   }
  }
 };
 
 /* Clear search results. */
 const runClearChatGPTSearchChatHistory = () => {
  searchIDChatGPTSearchChatHistory.value = ""; /* clear search */
  
  /* delay a bit */
  setTimeout(function() {
   runSearchChatGPTSearchChatHistory(); /* show chat history */
  }, 100);
 };
 
 
 /*********************************************************************************** 
                                    MAIN FUNCTION
 ***********************************************************************************/
 function createChatGPTSearchChatHistory() {
  /* create the search elements */
  createHTMLChatGPTSearchChatHistory();

  /* delay ensuring element creation */
  setTimeout(function() {
   /* search already on page from an earlier run - keep its events */
   if (!searchIDChatGPTSearchChatHistory) return;

   /* add to search element */
   searchIDChatGPTSearchChatHistory.addEventListener(
    "input",                         /* whenever search field has input */
    runSearchChatGPTSearchChatHistory /* show hide accordingly           */
   );
   
   /* add to clear element */
   clearIDChatGPTSearchChatHistory.addEventListener(
    "click",
    runClearChatGPTSearchChatHistory
   );

   /* stick search bar to top of chat history and watch for added chats */
   placeSearchChatGPTSearchChatHistory();
   watchHistoryChatGPTSearchChatHistory();
  }, 500);
 }
 
 /* Call main function. */ 
 createChatGPTSearchChatHistory();
})();