javascript:(function(){ 
/* Configuration variables. */
 var instructionAlert = 1; /* <-- CONFIGURATION - 1 is on (alert), 0 is off (no alert) */
 var useRunningFix    = 1; /* <-- CONFIGURATION - 1 is on (find and replace), 0 is off */
 var replaceAllRunFix = 1; /* <-- CONFIGURATION - 1 is on (replace all), 0 is off      */
 
 /* Optional variables. */
 var pageTitle = "ChatGPT Bookmark"; /* <-- OPTIONAL - change title */
 var pageHead  = "ChatGPT Response"; /* <-- OPTIONAL - change head  */
 var buttonTextChatGPTPasteReadyBookmark = "Bookmarklet"; /* <-- OPTIONAL - button text */

 /* DOM variables. */
 /* Copy button that starts the bookmark, matched from the clicked element.    */
 var copyButtonSelector =       /* HOT-GLUE - select copy button by attribute  */
  "[aria-label=\"Copy\"], [aria-label=\"Copy response\"], " +
  "[data-testid=\"copy-turn-action-button\"]";

 /* Copy buttons inside these are skipped - code block and prompt copy buttons. */
 var skipCopySelector =         /* HOT-GLUE - likely to change                 */
  "pre, .markdown, [data-response-body], [data-turn=\"user\"], " +
  "[data-code-block], [data-chatgpt-copy-code], [data-user-message-bubble], " +
  "[data-paste-ready-bookmark]";

 /* Conversation turn holding one response and its button row.                 */
 var turnSelector =             /* HOT-GLUE - likely to change                 */
  "[data-virtualized-turn], [data-turn-key], article, [data-turn], " +
  "[data-testid^=\"conversation-turn\"], [data-content-search-turn-key]";

 /* Row of buttons under a response - the bookmark button is added at its end.  */
 var buttonRowSelectorChatGPTPasteReadyBookmark = /* HOT-GLUE - likely to change */
  "[class*=\"turn-action-controls\"] > div, [class*=\"turn-action-controls\"], " +
  "[data-testid*=\"turn-action\"]";

 /* Marks the bookmark button, and the window key holding a run's state.        */
 var markAttributeChatGPTPasteReadyBookmark = "data-paste-ready-bookmark";
 var stateKeyChatGPTPasteReadyBookmark =
  "pasteReady--__-unlikely_-_name-__--PasteReadyBookmarkResponse";

 /* Answer area in the turn - first selector with a match is used.             */
 var answerAreaSelector = [     /* HOT-GLUE - likely to change                 */
  "[data-response-body]",
  "[data-markdown-text-style]",
  "[data-message-author-role=\"assistant\"] .markdown",
  ".markdown",
  "[data-message-author-role=\"assistant\"]"
 ];

 /* Whole code of a block, kept by the page for its own copy button.           */
 var codeKeptAttributeChatGPTPasteReadyBookmark = /* HOT-GLUE                  */
  "data-chatgpt-copy-code";

 /* Code block marked by the page, such as code with a Run button.             */
 var codeBlockSelector =        /* HOT-GLUE - likely to change                 */
  "[" + codeKeptAttributeChatGPTPasteReadyBookmark + "], " +
  "[data-code-block], [data-markdown-copy=\"code-block\"]";

 /* Code text in a block - code editor lines first, then code, then pre.       */
 var codeTextSelector = [".cm-content", "code", "pre"]; /* HOT-GLUE            */

 /* Code block - parents climbed from code to the whole block with its toolbar. */
 var codeBlockClimbTags = ["DIV", "PRE", "SPAN"]; /* HOT-GLUE - likely to change */
 var codeBlockToolbarLimit = 60; /* most characters of toolbar text in a block   */

 /* Parts of the answer that are the page's own controls, or not shown.         */
 var leaveOutSelectorChatGPTPasteReadyBookmark = /* HOT-GLUE                   */
  "button, svg, [hidden], [data-markdown-copy=\"exclude\"]";

 /* Attributes the answer keeps - any other is the page's own, and stays there. */
 var keepAttributesChatGPTPasteReadyBookmark =
  ["href", "alt", "dir", "start", "colspan", "rowspan"];

 /* Switch variables. */
 var onOffPasteReadyBookmarkResponse = 1; /* 1 (default) on, 0 is off */
 
 /********************************************************************************** 
  NOTE - 'HOT-GLUE' comments for fast; ok this works, and/or good enough patch, 
          or DOM element that changes frequently.  
  NOTE - use embedded object 'RUNNING_FIX', following syntax as illustrated below.
 
  RUNNING_FIX ILLUSTRATION:
  *************************
  NOTE - this is mainly intended for code examples given by chatGPT.
  NOTE - if config is 1 (on), and no value or object undefined, bookmarklet still works.
  For items that transcripted unexpectedly in code boxes.  
  TO USE - Follow pattern:
    "1": {one: "replace what", two: "with this"},
    "2": {one: "replace what", two: "with this"},
    etc...  
  For each numeric nested object; property one is replaced with property two.
  Object is utilized in support funciton "runningFixChatGPTPasteReadyBookmark()". 
 ***********************************************************************************/  
 
 /*********** 
  RUNNING_FIX EXAMPLE:
  ********************
  Best to keep a running object of this. 
  Based upon answer where code for C++ was written as
  ` #include <iostream>using namespace std;int main() { `
  after being bookmarked using bookmarklet.
  Here a question was asked were several code examples in several
  languages were given, but for some reason C++ did not transpose correctly,
  NOTE - code blocks are now copied as plain text and skip RUNNING_FIX, so the
         C++ items are gone; add items here for text outside of code blocks.
 ***********/
 var RUNNING_FIX = {
 "1": {
  one: "\\",   /* IMPORTANT - this needs to stay */
  two: "&#92;" /* IMPORTANT - this needs to stay */
 }
 };

 /* Style the bookmarked page. The body's background propagates to the canvas, so the saved page is
    painted near-white whatever colour scheme the reader asks for. The focus ring is coloured for that
    surface and for no other: #0969da reads at 4.97:1 against it, where the #58a6ff meant for a dark
    surface read at 2.42:1, under the 3:1 WCAG 1.4.11 asks of a focus indicator. A dark override
    belongs here only once the page itself darkens, so that the two move together. The corner badge is
    a share of the page, so its label is sized as one too: at a phone width a fixed 12pt label left
    the black shape it is written on and was painted over the heading beside it. The padding keeps
    the label clear of the rounded corner, and the overflow clips anything that still is not. The
    overflow clips along the padding box, whose bottom-right radius is the 80px asked for less the
    2px border, so the label's own padding-right is what holds its line off that curve. A line that
    only just fits on one line ends about 61px above the padding box's bottom edge, where the curve
    has already come 1.8px in, and took the end of the final k off at 840px to 849px and 1191px to
    1199px of page width. 8px is the least reserve that is not the binding figure at any width from
    320px up: past it the longest word in the label is what ends the line, and it leaves 6px of
    clearance at the closest approach. A wider label or a wider radius is read again. */
 {
 var bookmarkPageStyle = `
<style>
 * {
  font-family: sans-serif,system-ui;
 } 
 body {
  max-width: 50%;
  margin-left:auto;
  margin-right: auto;
  background:rgb(47 79 79 / 3%);
 }
 p {
  font-size: 12pt;
  margin: 0 0 1em;
  line-height: 1.5;
  display: block;
 }
 li > p {
  margin: 0;
 }
 code {
  padding: .2em .4em;
  border-radius: 6px;
  background-color: rgba(129, 139, 152, .12);
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace !important;
  font-size: 85%;
 }
 div.codeBlockPasteReady {
  margin: 16px 0;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  background: #f6f8fa;
  overflow: hidden;
 }
 div.codeLangPasteReady {
  padding: 6px 16px;
  border-bottom: 1px solid #d1d9e0;
  color: #59636e !important;
  font-size: 12px;
 }
 pre.codePasteReady {
  display: block;
  max-width: none;
  margin: 0;
  padding: 16px;
  overflow: auto;
  border: 0;
  border-radius: 0;
  background: none !important;
  color: #1f2328 !important;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace !important;
  font-size: 13.6px;
  line-height: 1.45;
  white-space: pre;
 }
 @media (prefers-color-scheme: dark) {
  div.codeBlockPasteReady {
   border-color: #3d444d;
   background: #151b23;
  }
  div.codeLangPasteReady {
   border-color: #3d444d;
   color: #9198a1 !important;
  }
  pre.codePasteReady {
   color: #f0f6fc !important;
  }
 }
 div[data-side='1'] {
  display:inline-block;
  position:fixed;
  left:0px;
  top: 0px;
  width:20%;
  height:auto;
  padding-bottom: 2rem;
  overflow: hidden;
  border: 2px solid black;
  border-bottom-right-radius: 80px;
  background: #000;
 }
 div[data-side='1'] svg, 
 div[data-side='1'] path,
 div[data-side='1'] h2 {
  display: inline-block;
 }
 div[data-side='1'] svg {
  color: #000;
  background: white;
  border-radius: 100%;
  margin-top: 20px;
  margin-left: min(20px, 2vw);
  padding:3px;    
 }
 div[data-side='1'] h2 {    
  position: relative;   
  font-size: min(12pt, 3.2vw);
  margin-left: min(20px, 2vw);
  padding-right: 8px;
  top: -15px !important;
  color: white;
 }   
 table,th,td {   
  border: 1px solid #d9d9e3;
 }
 table {    
  border-collapse: separate;
  border-spacing: 0px;
  border-radius: 5px;
  width: 100%;
 }
 div.tableScrollPasteReady {
  overflow-x: auto;
  max-width: 100%;
 }
 div.tableScrollPasteReady:focus-visible {
  outline: 3px solid #0969da;
  outline-offset: 2px;
 }
 th,td {
  padding: 5px 5px;     
 }
 th {
  background-color: rgba(236,236,241,.2); 
 } 
 button {
  display: none;
 }
 ul li,
 ol li {
  margin-top: 12px;    
 }
</style>
`;
 }
 
 /******************************** SUPPORT FUNCTIONS ********************************/
 /* Add click event to document, running bookmark when a response copy button is clicked. */
 const docEventChatGPTPasteReadyBookmark = () => {
  /* add a click event listener to the document */
  document.addEventListener('click', function(event) {
   /* ensure bookmarklet is on and an error was not found */
   if (onOffPasteReadyBookmarkResponse != 1) return; /* defined at top          */

   /* clicked element can be the button, its svg, or the svg path */
   let clickedItem = event.target;
   if (!clickedItem || !clickedItem.closest) return; /* not an element          */

   /* select the copy button holding the clicked element */
   let copyButton = clickedItem.closest(copyButtonSelector);

   /* run if copy button is not a code block or prompt copy button */
   if (copyButton && !copyButton.closest(skipCopySelector)) {
    /* call main function */
    pasteReadyBookmarkResponse(copyButton, 0);
   }
  }, true); /* capture - runs before the page's own handlers can stop the click */
 };

 /* Write text to the clipboard, else through a selected text box and the copy command. */
 const writeClipboardChatGPTPasteReadyBookmark = (curText, onDone) => {
  let copyCommand = () => {
   let curBox = document.createElement("textarea");
   curBox.value = curText;
   curBox.setAttribute("readonly", "");
   curBox.style.setProperty("position", "fixed");
   curBox.style.setProperty("top", "0");
   curBox.style.setProperty("left", "0");
   curBox.style.setProperty("opacity", "0");
   document.body.appendChild(curBox);
   curBox.select();
   let curCopied = false;
   try { curCopied = document.execCommand("copy"); } catch (err) { curCopied = false; }
   curBox.remove();
   return curCopied;
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
   navigator.clipboard.writeText(curText).then(
    () => onDone(true),
    () => onDone(copyCommand())
   );
  } else {
   onDone(copyCommand());
  }
 };

 /* Row of buttons under a response, found from its copy button. */
 const findButtonRowChatGPTPasteReadyBookmark = (copyButton) =>
  copyButton.closest(buttonRowSelectorChatGPTPasteReadyBookmark) || copyButton.parentElement;

 /* Bookmark button, drawn like the page's copy button beside it. */
 const makeButtonChatGPTPasteReadyBookmark = (copyButton) => {
  let curButton = document.createElement("button");
  curButton.type = "button";
  curButton.className = copyButton.className; /* the page's own look for its row */
  curButton.setAttribute(markAttributeChatGPTPasteReadyBookmark, "button");
  curButton.setAttribute("aria-label", "Copy as bookmarklet");
  curButton.title = "Copy as bookmarklet";
  curButton.style.setProperty("display", "inline-flex");
  curButton.style.setProperty("align-items", "center");
  curButton.style.setProperty("gap", "4px");
  curButton.style.setProperty("width", "auto");
  curButton.style.setProperty("padding", "2px 8px");
  curButton.style.setProperty("font-size", "13px");

  /* bookmark icon */
  let svgSpace = "http://www.w3.org/2000/svg";
  let curIcon = document.createElementNS(svgSpace, "svg");
  curIcon.setAttribute("width", "16");
  curIcon.setAttribute("height", "16");
  curIcon.setAttribute("viewBox", "0 0 24 24");
  curIcon.setAttribute("fill", "none");
  curIcon.setAttribute("stroke", "currentColor");
  curIcon.setAttribute("stroke-width", "2");
  curIcon.setAttribute("aria-hidden", "true");
  let curPath = document.createElementNS(svgSpace, "path");
  curPath.setAttribute("d", "M6 3h12v18l-6-4-6 4z");
  curIcon.appendChild(curPath);
  curButton.appendChild(curIcon);
  curButton.appendChild(document.createTextNode(buttonTextChatGPTPasteReadyBookmark));

  /* copy at once - no page copy to wait for, and the click still counts as the reader's */
  curButton.addEventListener("click", function(event) {
   event.preventDefault();
   event.stopPropagation(); /* the row's own handlers never see this click */
   pasteReadyBookmarkResponse(curButton, 1);
  });
  return curButton;
 };

 /* Add the bookmark button to each response's button row that lacks one. */
 const addButtonsChatGPTPasteReadyBookmark = () => {
  document.querySelectorAll(copyButtonSelector).forEach((copyButton) => {
   if (copyButton.closest(skipCopySelector)) return; /* code block or prompt copy button */
   let curRow = findButtonRowChatGPTPasteReadyBookmark(copyButton);
   if (!curRow) return;
   if (curRow.querySelector("[" + markAttributeChatGPTPasteReadyBookmark + "]")) return;
   curRow.appendChild(makeButtonChatGPTPasteReadyBookmark(copyButton));
  });
 };

 /* Watch for rows the page draws later - new answers, and turns drawn again on scroll. */
 const watchRowsChatGPTPasteReadyBookmark = () => {
  let curTimer = 0;
  let curWatch = new MutationObserver(function() {
   if (curTimer) return;
   curTimer = setTimeout(function() {
    curTimer = 0;
    addButtonsChatGPTPasteReadyBookmark();
   }, 400);
  });
  curWatch.observe(document.body, {childList: true, subtree: true});
  addButtonsChatGPTPasteReadyBookmark();
 };
 
 /* Find and replace items in object "RUNNING_FIX". */
 const runningFixChatGPTPasteReadyBookmark = (curContent) => {
  /* ensure that syntax  of object is followed */
  let followingSyntax = 0; /* turns on if first is good, assumes remaining syntax */
  
  if (RUNNING_FIX && /* if object is declared */
                     /* and is defined        */
      (RUNNING_FIX != undefined) || (RUNNING_FIX != null)
     ) {
  for (i in RUNNING_FIX) {
   /* check if first nested object follows syntax */
   if (i == 1) {
    followingSyntax = 1;
    break;
   } else { /* end after one */
    break;
   }
  }
   /* if syntax passed, continue; assuming remaining nested objects pass */
   if (followingSyntax == 1) {     
    for (i in RUNNING_FIX) {
    /* use a marking value with an unlikely string for an answer */
    let unlikelyValue =  
     "unlikely_v_a_l_u_e_for_a_random_book_m-a-r-k-l-e-t_RUNNING_FIX_un_like_ly";
    
    /* check if replace all is turned on */
    if (replaceAllRunFix == 1) {       
     let gotAll = 0; /* variable 0 until all marked for replacement */
     while (gotAll == 0) {
      /* while items found to be replace, mark with unlikely value */
      if (curContent.indexOf(RUNNING_FIX[i].one) > -1) {
       curContent = curContent.replace(RUNNING_FIX[i].one, unlikelyValue); 
      } else {
       /* marked all to be replaced */
       gotAll = 1;
      }
     }
     gotAll = 0; /* variable 0 until all marked for replacement */
     while (gotAll == 0) {
      /* while items marked with unlikely value, replace them   */
      if (curContent.indexOf(unlikelyValue) > -1) {
       curContent = curContent.replace(unlikelyValue, RUNNING_FIX[i].two); 
      } else {
       /* replaced all marked values */
       gotAll = 1;
      }
     }
    } else { /* replace first occurence */
     curContent = curContent.replace(RUNNING_FIX[i].one, RUNNING_FIX[i].two);
    }          
   }
  }
  return curContent;
  }
 };
 
 /* Find the answer area for the copy button that was clicked. */
 const findAnswerAreaChatGPTPasteReadyBookmark = (copyButton) => {
  /* conversation turn holding the copy button */
  let curTurn = copyButton.closest(turnSelector);

  /* use first answer area selector with a match in the turn */
  if (curTurn) {
   for (let i = 0; i < answerAreaSelector.length; i++) {
    let curAnswer = curTurn.querySelectorAll(answerAreaSelector[i]);
    if (curAnswer.length > 0) {
     return Array.from(curAnswer); /* response can have more than one part  */
    }
   }
  }

  /* fallback - check the element before each parent of the copy button */
  let buttonRow = copyButton.parentElement;
  for (let i = 0; i < 20 && buttonRow && buttonRow != curTurn; i++) { /* safety limit */
   let answerRow = buttonRow.previousElementSibling;
   if (answerRow && answerRow.innerText.trim().length >= 100) { /* probably match */
    return [answerRow];
   }
   buttonRow = buttonRow.parentElement; /* check next top-level element         */
  }

  /* answer area not found */
  return [];
 };

 /* Plain text of code, as the page keeps it, else from its code editor. */
 const codeTextChatGPTPasteReadyBookmark = (curCode) => {
  let curText = "";
  let curKept = curCode.closest("[" + codeKeptAttributeChatGPTPasteReadyBookmark + "]");
  if (curKept && curKept.getAttribute(codeKeptAttributeChatGPTPasteReadyBookmark)) {
   curText = curKept.getAttribute(codeKeptAttributeChatGPTPasteReadyBookmark);
  } else if (curCode.classList.contains("cm-content")) {
   /* whole document from the editor, as long code may only draw lines in view */
   let curRef = curCode.cmView || curCode.cmTile;
   let curView = curRef && (curRef.view || (curRef.rootView && curRef.rootView.view) ||
                            (curRef.root && curRef.root.view));
   if (curView && curView.state && curView.state.doc) {
    curText = curView.state.doc.toString();
   } else { /* one editor line per element */
    curText = Array.from(curCode.querySelectorAll(".cm-line"))
     .map((curLine) => curLine.textContent).join("\n");
   }
  } else { /* line breaks and indents as shown on the page */
   curText = curCode.innerText || curCode.textContent;
  }
  /* no-break spaces to spaces, and no trailing line breaks */
  return curText.split(String.fromCharCode(160)).join(" ").replace(/\n+$/, "");
 };

 /* Mark each code block in the answer, saving its language and plain text. */
 const markCodeBlocksChatGPTPasteReadyBookmark = (curArea, codeBlocks) => {
  /* mark block so its copy is swapped for a token */
  let markBlock = (curBlock, curCode) => {
   /* language from toolbar text, else from the code's language attribute or class */
   let curLang = "";
   let curWalker = document.createTreeWalker(curBlock, NodeFilter.SHOW_TEXT);
   while (!curLang && curWalker.nextNode()) {
    let curNode = curWalker.currentNode;
    if (curCode.contains(curNode) || curNode.parentElement.closest("button")) continue;
    curLang = curNode.textContent.trim().slice(0, 30);
   }
   if (!curLang) {
    let langMatch = /language-([\w#+.-]+)/.exec(curCode.className);
    curLang = curCode.getAttribute("data-language") || (langMatch ? langMatch[1] : "");
   }

   curBlock.setAttribute("data-paste-ready-code", codeBlocks.length);
   codeBlocks.push({lang: curLang, text: codeTextChatGPTPasteReadyBookmark(curCode)});
  };

  /* blocks the page marks as code blocks, such as code with a Run button */
  curArea.querySelectorAll(codeBlockSelector).forEach((curBlock) => {
   if (curBlock.closest("[data-paste-ready-code]")) return; /* already in a block   */
   let curCode = null;
   for (let i = 0; i < codeTextSelector.length && !curCode; i++) {
    curCode = curBlock.querySelector(codeTextSelector[i]);
   }
   if (curCode) markBlock(curBlock, curCode);
  });

  /* count of code and pre elements, including the element */
  let codeCount = (curEl) =>
   curEl.querySelectorAll("code, pre").length + (curEl.matches("code, pre") ? 1 : 0);

  /* other code that is a block - in a pre, has a language, or more than one line */
  let curCodes = Array.from(curArea.querySelectorAll("pre, code")).filter((curCode) =>
   (curCode.tagName == "PRE" && !curCode.querySelector("code")) ||
   (curCode.tagName == "CODE" && (curCode.closest("pre") ||
    /language-/.test(curCode.className) || curCode.textContent.indexOf("\n") > -1))
  );

  curCodes.forEach((curCode) => {
   if (curCode.closest("[data-paste-ready-code]")) return; /* already in a block   */
   let codeLength = curCode.textContent.length;

   /* climb to the parent holding only this code and its toolbar */
   let curBlock = curCode.closest("pre") || curCode;
   let curPar = curBlock.parentElement;
   while (curPar && curPar != curArea &&
          codeBlockClimbTags.indexOf(curPar.tagName) > -1 &&
          curPar.querySelectorAll("code, pre").length == codeCount(curBlock) &&
          curPar.textContent.length - codeLength <= codeBlockToolbarLimit) {
    curBlock = curPar;
    curPar = curBlock.parentElement;
   }
   markBlock(curBlock, curCode);
  });
 };

 /* Write a code block as html, safe in the bookmarklet string and the URL field. */
 const codeBlockHTMLChatGPTPasteReadyBookmark = (curBlock) => {
  let encode = (curText) => curText
   .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\\/g, "&#x5c;")
   .replace(/`/g, "&#96;").replace(/%/g, "&#37;").replace(/\t/g, "&#9;")
   .replace(/\r/g, "").replace(/\n/g, "<br>");
  return "<div class='codeBlockPasteReady'>" +
   (curBlock.lang ? "<div class='codeLangPasteReady'>" + encode(curBlock.lang) + "</div>" : "") +
   "<pre class='codePasteReady'>" + encode(curBlock.text) + "</pre></div>";
 };

 /*********************************************************************************** 
  MAIN FUNCTION
  ***********************************************************************************/
 function pasteReadyBookmarkResponse(aWhat, ownButton) {
  /* select the answer area for the button that was clicked */
  let answerArea = findAnswerAreaChatGPTPasteReadyBookmark(aWhat);

  /* dry alert - repair needed */
  let dryAlert = () => {
   alert("REPAIR NEEDED:\n\n" +
         " Please report issue on GitHub repo\n" +
         " https://github.com/isocialPractice/bookmarklets"
        );
   /* turn off bookmarklet */
   onOffPasteReadyBookmarkResponse = 0;
  };
  
  /* define function variables */
  let copiedContent, codeBlocks = [];
  /* ensure that answer area has been found */
  if (answerArea.length == 0) { /* answer area not found */
   console.log(aWhat);
   /* alert repair is needed        */
   dryAlert();
   /* exit function */
   return;
  } else { /* found from function findAnswerAreaChatGPTPasteReadyBookmark */
   /* now the answer's div elements should be extracted, code blocks as tokens */
   copiedContent = answerArea.map((curArea) => {
    markCodeBlocksChatGPTPasteReadyBookmark(curArea, codeBlocks);
    let curClone = curArea.cloneNode(true);
    curClone.querySelectorAll("[data-paste-ready-code]").forEach((curBlock) => {
     curBlock.replaceWith(
      "codeblock_paste_ready_" + curBlock.getAttribute("data-paste-ready-code") + "_end"
     );
    });
    /* the page's controls and attributes stay on the page */
    curClone.querySelectorAll(leaveOutSelectorChatGPTPasteReadyBookmark).forEach((curEl) => {
     curEl.remove();
    });
    curClone.querySelectorAll("*").forEach((curEl) => {
     Array.from(curEl.attributes).forEach((curAttr) => {
      let curKeep = keepAttributesChatGPTPasteReadyBookmark.indexOf(curAttr.name) > -1;
      /* an address is kept only where it opens a page or an email */
      if (curAttr.name == "href" && !/^(https?:|mailto:)/i.test(curAttr.value)) curKeep = false;
      if (!curKeep) curEl.removeAttribute(curAttr.name);
     });
    });
    /* each table in a scrolling box of its own, so a wide table scrolls and the page does not */
    curClone.querySelectorAll("table").forEach((curTable) => {
     if (!curTable.parentNode) { return; }
     let curTableBox = document.createElement("div");
     curTableBox.className = "tableScrollPasteReady";
     curTable.parentNode.insertBefore(curTableBox, curTable);
     curTableBox.appendChild(curTable);
    });
    return curClone.innerHTML;
   }).join("");

   /* remove code block marks from the page */
   document.querySelectorAll("[data-paste-ready-code]").forEach((curBlock) => {
    curBlock.removeAttribute("data-paste-ready-code");
   });
  }

  /* attributes in single quotes, as the bookmarklet's string is in double quotes */
  copiedContent = copiedContent.replace(/<[a-z](?:"[^"]*"|[^"<>])*>/gi, (curTag) =>
   curTag.replace(/="([^"]*)"/g, (curAttr, curValue) =>
    "='" + curValue.replace(/'/g, "&#39;") + "'"
   )
  );

  /* clean up a bit */       
  copiedContent = copiedContent.replace(/%/g, "&#37;");           /* a URL field reads a percent sign as an escape     */
  copiedContent = copiedContent.replace(/\n/g, "--new-line_unlikely_line-new--"); /* new line marker replaced later    */
  copiedContent = copiedContent.replace(/\"/g, '&#92;&quot;');    /* use html encoding for escaped double quotes       */
  copiedContent = copiedContent.replace(/"/g, '\"');              /* keep double quotes as needed for inline html      */
  copiedContent = copiedContent.replace(/\'/g, "&#92;&apos;'");   /* use html encoding for escaped single quotes       */
  copiedContent = copiedContent.replace(/'/g, "'");               /* keep single quotes as needed for inline html      */

  /* utilize "RUNNING_FIX" to correctly write unexpected outputs */
  copiedContent = runningFixChatGPTPasteReadyBookmark(copiedContent);

  /* swap code block tokens for plain text code blocks */
  copiedContent = copiedContent.replace(/codeblock_paste_ready_(\d+)_end/g,
   (curToken, curIndex) => codeBlockHTMLChatGPTPasteReadyBookmark(codeBlocks[curIndex])
  );

  /* HOT-GLUE - replace new line characters only in pre tags with <br> */
             /* remove unlikely new line marker in remaining html      */
  var pageScript = `<script>
setTimeout(function() {
 /* get id of div after opening html */
 var chatGPTPasteReadyBookmark = 
  document.getElementById('chatGPTPasteReadyBookmark');
 
 /* ready to loop pre tag */
 var preTag = chatGPTPasteReadyBookmark.getElementsByTagName('pre');
 var preTagLen = preTag.length;
 
 /*loop pre tag if any bookmark */
 if (preTagLen >= 1) { /* in bookmark so loop */
  for (i = 0; i < preTagLen; i++) {  
    let curInnerHTML = /* current html */
     preTag[i].innerHTML;
     
    curInnerHTML = /* replace new line marker with <br> */
     curInnerHTML.replace(/--new-line_unlikely_line-new--/g, '<br>');      

    /* replace existing html with updated html */
    preTag[i].innerHTML = curInnerHTML;  
  }  
 }
 /* remove remaining new line markers */
 chatGPTPasteReadyBookmark.innerHTML = /* replace with empty string */
  chatGPTPasteReadyBookmark.innerHTML.replace(/--new-line_unlikely_line-new--/g, '');
 /* dark theme comes from the color-scheme meta tag and the style media query */
 /* A table box is a keyboard stop only while it has something to scroll, so Tab reaches the
    columns held out of view and never rings a box that cannot move. Read here, after the markup
    above is final, and again on every resize, because the answer changes with the viewport. */
 var markTableBoxesChatGPTPasteReadyBookmark = function() {
  var curBoxes = /* every box the bookmark wrote around a table */
   chatGPTPasteReadyBookmark.getElementsByClassName('tableScrollPasteReady');
  for (var b = 0; b < curBoxes.length; b++) {
   var curBox = curBoxes[b];
   if (curBox.scrollWidth > curBox.clientWidth) { /* columns are out of view */
    curBox.setAttribute('role', 'region');
    curBox.setAttribute('tabindex', '0');
    /* name the region from the nearest heading above it, since these tables carry no caption */
    var curNamer = curBox.previousElementSibling;
    while (curNamer && !/^H[1-6]$/.test(curNamer.tagName)) {
     curNamer = curNamer.previousElementSibling;
    }
    if (curNamer) {
     curBox.setAttribute('aria-label', (curNamer.textContent || '').trim());
    }
   } else { /* the table fits, so there is nothing to scroll to */
    curBox.removeAttribute('role');
    curBox.removeAttribute('tabindex');
    curBox.removeAttribute('aria-label');
   }
  }
 };
 markTableBoxesChatGPTPasteReadyBookmark();
 window.addEventListener('resize', markTableBoxesChatGPTPasteReadyBookmark);
}, 500);
</script>
`;

  /* store new bookmarklet to be written to clipboard */
  var bookmarklet = 'javascript:(function() {document.write("' + 
   /* write html head content */
   "<!DOCTYPE HTML><html lang='en'><head><meta name='color-scheme' content='light dark'>" +
   "<title>" + pageTitle + "</title>" +
   /* style a bit */
   bookmarkPageStyle + 
   /* add page body and div */
   "</head><body><div id='chatGPTPasteReadyBookmark'>" + 
   "<h1>" + pageHead + "</h1><hr>" +
   /* sidebarlink to original answer */
   "<div data-side='1' data-nav='0'>" +
   "<svg width='41' height='41' viewBox='0 0 41 41' fill='none' xmlns='http://www.w3.org/2000/svg' class='h-2/3 w-2/3' role='img'><text x='-9999' y='-9999'>ChatGPT</text><path d='M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z' fill='currentColor'></path></svg>" +
   '<h2>ChatGPT Bookmark</h2></div>' +   
   /* cleaned copied content */
   copiedContent +
   /* close page div and add pageScript */
   "</div> " + pageScript + 
   /* close html */
   "</body></html>" +
   /* close bookmarklet */
   '");})()';

   /* HOT-GLUE - remove unwanted escaped double quotes - HOT-GLUE */
   bookmarklet = bookmarklet.replace(/&#92;&quot;/g, "&quot;");
   /* HOT-GLUE - remove unwanted escaped single quotes - HOT-GLUE */
   bookmarklet = bookmarklet.replace(/&#92;&apos;/g, "");
   /* HOT-GLUE - remove bactic as probably md styling - HOT-GLUE */
   bookmarklet = bookmarklet.replace(/`/g, "");

   /* the clipboard did not take it - say so, rather than leave the answer's text there */
   let failedAlert = () => {
    alert("COPY FAILED:\n\n" +
          " The bookmarklet did not reach the clipboard.\n" +
          " Click the page once, then click \"" + buttonTextChatGPTPasteReadyBookmark +
          "\" under the answer again."
         );
   };

   if (ownButton == 1) {
    /* bookmark button - copy now, while the click still counts as the reader's */
    writeClipboardChatGPTPasteReadyBookmark(bookmarklet, (curCopied) => {
     if (!curCopied) { failedAlert(); return; }
     alert(
      "Copied as a bookmarklet. \n\n" +
      "Open the bookmark manager, make a new bookmark, and paste into its URL field."
     );
    });
   } else {
    /* page copy button - wait, so the bookmarklet is copied after the answer's text */
    alert(
     "Wait 2 seconds for content to generate as bookmarklet on clipboard. \n" +
     "Then open bookmark manager and make new bookmark by pasting into url field. \n\n" +
     "The \"" + buttonTextChatGPTPasteReadyBookmark + "\" button under the answer " +
     "copies it without the wait."
    );
    setTimeout(function () {
     writeClipboardChatGPTPasteReadyBookmark(bookmarklet, (curCopied) => {
      if (!curCopied) failedAlert();
     });
    }, 2000);
   }
 }
 
 /* A second run reuses the first run's click handler and row watcher, turning it back on and
    adding any missing buttons, rather than stacking a second copy of either. */
 var runStateChatGPTPasteReadyBookmark = window[stateKeyChatGPTPasteReadyBookmark];
 if (runStateChatGPTPasteReadyBookmark) {
  runStateChatGPTPasteReadyBookmark.turnOn();
  runStateChatGPTPasteReadyBookmark.addButtons();
 } else {
  /* run function that checks whenever a click event fires on page */
  docEventChatGPTPasteReadyBookmark();
  /* add the bookmark button under each response, now and as the page draws more */
  watchRowsChatGPTPasteReadyBookmark();
  window[stateKeyChatGPTPasteReadyBookmark] = {
   turnOn: function() { onOffPasteReadyBookmarkResponse = 1; },
   addButtons: addButtonsChatGPTPasteReadyBookmark
  };
 }

 /* If instruction alert is on. */
 if (instructionAlert == 1) {
  alert(
  "INSTRUCTIONS: \n" +
  "**************** \n" +
  "IMPORTANT - use the \"" + buttonTextChatGPTPasteReadyBookmark +
  "\" button in the row of buttons below an answer. \n\n" +
  "1. Run bookmarklet. \n" +
  "2. Click \"" + buttonTextChatGPTPasteReadyBookmark + "\" below the answer. \n" +
  "   The answer's own copy button works too, after a 2 second wait. \n" +
  "3. Create a new bookmark, pasting contents of clipboard in the URL box.");
 }
}
)();