# Browser Bookmarklets ![repo icon](favicon.png)
<!-- Navigation -->
<div> 
<details>
<summary>Document Navigation: </summary>

- [DOM Bookmarklets](#dom-bookmarklets)
  - [Parse - Dom Stop Page Parsing](#parse---dom-stop-page-parsing) - ready to use 
  - [Parse - Dom Stop Page Parsed Height](#parse---dom-stop-page-parsed-height) - ready to use   
  - [Video - Dom Take Video Notes](#video---dom-take-video-notes) - ready to use 
- [Navigation Bookmarklets](#navigation-bookmarklets)
  - [Sidebar - Fix And Scroll Side Menu](#sidebar---fix-and-scroll-side-menu) - ready to use 
  - [Sidebar - Highlight Current Page](#sidebar---highlight-current-page) - ready to use
  - [Sidebar - Underline Anchor Linke](#sidebar---underline-anchor-link) - ready to use  
- [Style Bookmarklets](#style-bookmarklets)
  - [Favicon - Change or Add Favicon](#favicon---change-or-add-favicon) - requires 1 change(s)
- [Site Specific Bookmarklets](#site-specific-bookmarklets)
  - [ChatGPT - Bookmark a specific response](#chatgpt---bookmark-a-specific-response) - requires 1 change
  - [ChatGPT - Navigate Answers](#chatgpt--navigate-answers) - ready to use 
  - [ChatGPT - Paste Ready Bookmark Response](#chatgpt---paste-ready-bookmark-response) - ready to use
  - [ChatGPT - Resize Prompt](#chatgpt---resize-prompt) - ready to use
  - [GitHub - Alternate Row Color](#github---alternate-row-color) - ready to use
  - [GitHub - Show File Size](#github---show-file-size) - ready to use
  - [Gmail - Style Sponsored Email](#gmail---style-sponsored-email) - ready to use 
  - [Google - Paste Ready Bookmark AI Response](#google---paste-ready-bookmark-ai-response) - ready to use
  - [OctoPrint - Change Graph Image](#octoprint---change-graph-image) - ready to use - <em>1 optional change</em>
  - [Stackoverflow - Add Answer Anchor Links](#stackoverflow---add-answer-anchor-links) - ready to use
  - [Stackoverflow - Copy Answer Anchor Links](#stackoverflow---copy-answer-anchor-links) - ready to use
  - [YouTube - Add Time Marks](#youtube---add-time-marks) - ready to use
  - [YouTube - Darken Bottom Controls](#youtube---darken-bottom-controls) - ready to use 
  - [YouTube - Save Page Notes to Local Storage](#youtube---save-page-notes-to-local-storage) - ready to use 
  - [YouTube - Saved Page Notes to Notebox](#youtube---saved-page-notes-to-notebox) - ready to use 
  - [YouTube - Show Short Release Date](#you-tube--show-short-release-date) - ready to use 
  - [YouTube - Stack User Playlist Feed](#youtube---stack-user-playlist-feed) - ready to use 
  - [YouTube - Sync Audio](#you-tube---sync-audio) - ready to use 
  - [YouTube - Take Notes and Add Removable Time Marks](#youtube---take-notes-and-add-removable-time-marks) - ready to use
  - [YouTube - Take Video Notes](#youtube---take-video-notes) - ready to use 
  - [YouTube - Watch Random Video](#youtube---watch-random-video) - ready to use 
- [Window Bookmarklets](#window-bookmarklets)
  - [Page Offset - Custom Page Down](#page-offset---custom-page-down) - ready to use
  - [Style - Bold Selected Text](#style---bold-selected-text) - ready to use 
  - [Style- Highlight Selected Text](#style--highlight-selected-text) - ready to use 
  - [Style - Italic Selected Text](#style---italic-selected-text) - ready to use 
  - [Style - Underline Selected Text](#style---underline-selected-text) - ready to use 
  - [URI - Anchor Higlighted Text](#uri---anchor-higlighted-text) - ready to use 
</details>
</div>
<!-- Ready to Use Demo -->
<div>
<details>
<summary>Video Demonstration for Ready to Use Bookmarklets</summary>

![ready to use demo](support/Demo-ReadyToUse.gif)
</details>
</div>
<!-- Description -->
<div>
 
`Ctrl + click` to see example of some [bookmarklets](https://isocialpractice.github.io/bookmarklets/)


This is a running list of browser bookmarklets. Below each listed 
bookmarklet is a collapsible section with the bookmarklet ready 
to copy and paste. The root of the repo contains the bookmarklets
ready to use. In the folder JSFormatted are the bookmarklets as 
uncondensed JavaScript.


`Ctrl + click` for more info on [Browser Bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet). <br>
`Ctrl + click` for more info on [Making Bookmarklets](https://gist.github.com/caseywatts/c0cec1f89ccdb8b469b1).


In short a bookmarklet is saved as a browser bookmark, but in 
lieu of URL is condensed JavaScript. When on a page select the
bookmark (<em>best to have bookmarklets on bookmark bar</em>) where
the bookmarklet was saved. This will then change the current page in
the browser according to the bookmarket's JavaScript. Below are two 
blank canvas bookmarklet ready to copy/paste: 


<strong>NOTE</strong> - if modifying best to ensure final JS is condensed (<em>one line little space</em>):

<strong>JS Formatted:</strong>
```markdown
javascript:(function(){ 
/*
 INSTURCTIONS:
  Copy paste 
  Add JavaScript
  When done condense the JavaScript
  Make new bookmark in browser
  Name then paste final condensed JS in lieu of URL
*/ })();
```

<strong>Condensed Ready:</strong>
```markdown
javascript:(function() {  })();
```
</div>
<hr><br>
<!-- START BOOKMARKLETS -->

# DOM Bookmarklets:
<div>
The below bookmarklets are for pages with parsed DOM content,
or when editing the structure and/or adjusting HTML DOM.


Parse - Dom Stop Page Parsing: 
----
<dl><dd><dl><dd>

Page usese lazy loading and prevnet parsed content as scrolling down, making it hard to ready last few posts or footer from being viewed <br><br>

<!------------------------------------------
Page usese lazy loading and prevnet parsed content as scrolling down, making it hard to ready last few posts or footer from being viewed. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

Loosely Teste on [taxnotes.com](https://www.taxnotes.com/). <br>
Page tested - **[Featured News](https://www.taxnotes.com/featured-news)**.

<details>

<summary>dom_Parse_DomStopPageParsing.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [dom_Parse_DomStopPageParsing.js](https://gist.github.com/jhauga/bd8d1598d8731d242e0f18100b27edd9)

```markdown
javascript:(function() { /* Configurable variables .*/ const loadTextDomStopPageParsing = /* lazy loader class name contains these */ ["lazy_loader", "lazy-loader", "lazyLoader", "lazyObject", "lazyData"]; /* Global variables. */ const allElementsDomStopPageParsing = /* select all page HTML elements in the dom */ document.querySelectorAll('*'); /********************************************************************************************************************** * MAIN FUNCTION * * Loop through DOM and check if class names match that of array loadTextDomStopPageParsing * ***********************************************************************************************************************/ /* Loop through each element and output class if match configu var. */ var spinnerDomStopPageParsing, spinnerDomStopPageParsingClassDomStopPageParsing = 0; function outloadTextDomStopPageParsing(curArray, curClass) { let outClass = 0; /* store return in var and/or check if 0 later */ for (j in curArray) { /* loop arrary from parameter */ let lowClass = curClass.toLowerCase(); /* enusre match case */ let lowArr = curArray[j].toLowerCase();/* enusre match case */ if (lowClass.indexOf(lowArr) > -1) { /* has class match */ if (document.getElementsByClassName(curClass).length == 1) {/* 1 */ outClass = curClass; /* good to go */ break; } } } return outClass; }; /************** INITAL STATEMENTS **************/ /* Go through all elements and chekc if lazy load class match. *******/ allElementsDomStopPageParsing.forEach(element => { /* get class */ if (spinnerDomStopPageParsingClassDomStopPageParsing == 0) { /* get the class list of the element */ let classList = element.classList; /* check if the element has any classes */ if (classList.length > 0) { /* loop through each class */ classList.forEach(className => { /* check if class name matches lazy load guess, store in var */ spinnerDomStopPageParsingClassDomStopPageParsing = outloadTextDomStopPageParsing(loadTextDomStopPageParsing, className); }); } } }); /* If a class was output means on by that name so modify element. ****/ if (spinnerDomStopPageParsingClassDomStopPageParsing != 0 ) { spinnerDomStopPageParsing = /* only one so select at index 0 */ document.getElementsByClassName(spinnerDomStopPageParsingClassDomStopPageParsing)[0]; /* hide from dom so no random spinner going on */ spinnerDomStopPageParsing.style.display = "none"; let spinMark = spinnerDomStopPageParsing.previousElementSibling; if (spinMark) { /* may be the prior sibling as parse anchor */ if (spinMark.innerText.length <= 1) { /* make sure it's empty */ spinMark.remove(); /* looks like the tag looking for so remove */ console.log("Parsing to Page has been Disabled:"); /* notify */ } } }})(); 
```
</details>
</dd></dl></dd></dl>

Parse - Dom Stop Page Parsed Height: 
----
<dl><dd><dl><dd>

Page loads parsed content as scrolling down, making it hard to ready last few posts and preventing footer from being viewed <br><br>

<!------------------------------------------
Page loads parsed content as scrolling down, making it hard to ready last few posts and preventing footer from being viewed. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

Loosely Teste on [taxnotes.com](https://www.taxnotes.com/). <br>
Page tested - **[Featured News](https://www.taxnotes.com/featured-news)**.

<details>

<summary>dom_Parse_DomStopPageParsedHeight.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [dom_Parse_DomStopPageParsedHeight.js](https://gist.github.com/jhauga/e150dbfc1471cfd4d62367ea3084aa19)

```markdown
javascript:(function() { /* Configurable variables .*/ const noPageParseDomStopPageParsedHeight = 0; /* prevent new items from being parsed to page */ const loadTextDomStopPageParsedHeight = /* lazy loader class name contains these */ ["lazy_loader", "lazy-loader", "lazyLoader", "lazyObject", "lazyData"]; const tagCheckDomStopPageParsedHeight = /* parent element where content may be parsed */ ["div", "ol", "ul", "section", "span", "p", "article", "aside"]; const tagCheckDomStopPageParsedHeightLen = /*length of above array */ tagCheckDomStopPageParsedHeight.length; var numberOfRecursDomStopPageParsedHeight = 500; /* times to recurse befor removing listener */ /* Global variables. */ const allElementsDomStopPageParsedHeight = document.querySelectorAll('*'); const docBodyDomStopPageParsedHeight = document.getElementsByTagName("body"); var docScrollHeightDomStopPageParsedHeight = docBodyDomStopPageParsedHeight[0].scrollHeight; /* Switches to go through guess array tagCheckDomStopPageParsedHeight. */ var useNextTagDomStopPageParsedHeight = 1; /* Declare and define or redefined later. */ var listWithParseFeedDomStopPageParsedHeight; /* Set and reset sessionStorage items. */ { if (sessionStorage.getItem("initialBodyHeightDomStopPageParsedHeight") != null) { sessionStorage.removeItem("initialBodyHeightDomStopPageParsedHeight"); } if (sessionStorage.getItem("indexGuessDomStopPageParsedHeight") != null) { sessionStorage.removeItem("indexGuessDomStopPageParsedHeight"); } sessionStorage.setItem("initialBodyHeightDomStopPageParsedHeight", docScrollHeightDomStopPageParsedHeight); sessionStorage.removeItem("indexedListWithParseFeedDomStopPageParsedHeight"); } /********************************************************************************************************************** * MAIN FUNCTION * * Sets seesionStorage to check against each elements child count, and marking target when child count changes. * ***********************************************************************************************************************/ function checkForParsedItemsDomStopPageParsedHeight() { /* loop through elements from array tagCheckDomStopPageParsedHeight */ let skip; /* used to skip over elements not in HTML DOM */ var loopAndCheckElement = (curEl) => { let targetElement = document.getElementsByTagName(curEl); let targetElementLen = targetElement.length; /* ready local functino variables */ let childCount=0, listItem=0, guestimateIndex; if (targetElementLen == 0) { /* if none then exit out of loop */ skip = 1; /*reset in loop calling local function */ return; } else { for (i = 0; i < targetElementLen; i++) {/* check for new items */ if (targetElement[i].scrollHeight > 500) { /* ensure height */ if (sessionStorage.getItem("listItemDomStopPageParsedHeight" + curEl + i)==null) { sessionStorage.setItem( /* set by element and loop index */ "listItemDomStopPageParsedHeight" + curEl +i, targetElement[i].children.length ); } else { /* used to compare against changes of items being added */ listItem = /* last count */ sessionStorage.getItem("listItemDomStopPageParsedHeight" + curEl + i); childCount = /* current count */ targetElement[i].children.length; } if (String(childCount) == String(listItem)) { /* store count */ sessionStorage.setItem( /* used in next recurse from listener */ "listItemDomStopPageParsedHeight" + curEl + i, targetElement[i].children.length ); } else { /* may be items parsed to dom, may be tag looking for */ sessionStorage.setItem( /* store to check against */ "listItemDomStopPageParsedHeight" + curEl + i, targetElement[i].children.length ); /* set storage if not set */ if (sessionStorage.getItem("indexGuessDomStopPageParsedHeight" + curEl) == null) { sessionStorage.setItem("indexGuessDomStopPageParsedHeight" + curEl, i); } else { /* extract storage and define local variable to check against */ guestimateIndex = /* check previouly stored index */ sessionStorage.getItem("indexGuessDomStopPageParsedHeight" + curEl); sessionStorage.setItem( /* store current iteration index */ "indexGuessDomStopPageParsedHeight" + curEl, i ); } /* ensure guess is curren index of loop */ if (i == guestimateIndex) { /* define switch session storage */ if (sessionStorage.getItem("indexedListWithParseFeedDomStopPageParsedHeight") == null) { listWithParseFeedDomStopPageParsedHeight = /* select html */ targetElement[i]; sessionStorage.setItem( /* set session storage switch */ "indexedListWithParseFeedDomStopPageParsedHeight", 1 ); /* style to prevent page height from growing with parsing */ listWithParseFeedDomStopPageParsedHeight.setAttribute("style", ` overflow-y: scroll !important; height: ${listWithParseFeedDomStopPageParsedHeight.scrollHeight}px !important; max-height: ${listWithParseFeedDomStopPageParsedHeight.scrollHeight}px !important;` ); /* finalize with some double checkin in function checkGuessDomStopPageParsedHeight */ document.addEventListener("scroll", checkGuessDomStopPageParsedHeight); useNextTagDomStopPageParsedHeight = 0; /* set switch var. */ sessionStorage.removeItem( /* remove session storage item */ "indexGuessDomStopPageParsedHeight" + curEl ); break; } } } } } } }; /* switch not off, loop array tagCheckDomStopPageParsedHeight */ if (useNextTagDomStopPageParsedHeight == 1) { /* switch is on */ for (j = 0; j < tagCheckDomStopPageParsedHeightLen; j++) { /* loop */ loopAndCheckElement(tagCheckDomStopPageParsedHeight[j]); /* tag */ if (skip == 1) { skip = 0; continue; } /* reset and skip if none */ } } } /*********************** SUPPORT FUNCTIONS ************************/ /* Refine handling of selected element at set scroll height. *******/ const checkGuessDomStopPageParsedHeight = () => { docScrollHeightDomStopPageParsedHeight = /* current page height */ docBodyDomStopPageParsedHeight[0].scrollHeight; let listScrollHeight = /* element height */ listWithParseFeedDomStopPageParsedHeight.style.height.replace("px", ""); let checkHeightDiff = /* check difference */ Number(docScrollHeightDomStopPageParsedHeight) - Number(listScrollHeight); /* Get the current scroll position */ let scrollTop = window.pageYOffset; if (checkHeightDiff >= 500) { /* estimate were check on scroll */ if (scrollTop >= Number(listScrollHeight - 500)) { /* around it */ let initialHeight = /* check last stored page height */ sessionStorage.getItem("initialBodyHeight"); if (initialHeight == docScrollHeightDomStopPageParsedHeight) { /* looks like gueses were wrong - maybe this will work */ listWithParseFeedDomStopPageParsedHeight = docBodyDomStopPageParsedHeight[0]; sessionStorage.setItem( /* prevent any more tags being marked */ "indexedListWithParseFeedDomStopPageParsedHeight", 1 ); /* style body tag of html page */ listWithParseFeedDomStopPageParsedHeight.setAttribute("style", ` overflow-y: scroll !important; height: ${listWithParseFeedDomStopPageParsedHeight.scrollHeight}px !important; max-height: ${listWithParseFeedDomStopPageParsedHeight.scrollHeight}px !important;` ); /* remove listener */ document.removeEventListener("scroll", checkForParsedItemsDomStopPageParsedHeight); } } } }; /* Loop through each element and output class if match configu var. */ var spinnerDomStopPageParsedHeight, spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight = 0; const outloadTextDomStopPageParsedHeight = (curArray, curClass) => { let outClass = 0; /* store return in var and/or check if 0 later */ for (j in curArray) { /* loop arrary from parameter */ let lowClass = curClass.toLowerCase(); /* enusre match case */ let lowArr = curArray[j].toLowerCase();/* enusre match case */ if (lowClass.indexOf(lowArr) > -1) { /* has class match */ if (document.getElementsByClassName(curClass).length == 1) {/* 1 */ outClass = curClass; /* good to go */ break; } } } return outClass; }; /************** INITAL STATEMENTS **************/ /* Go through all elements and chekc if lazy load class match. *******/ allElementsDomStopPageParsedHeight.forEach(element => { /* get class */ if (spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight == 0) { /* get the class list of the element */ let classList = element.classList; /* check if the element has any classes */ if (classList.length > 0) { /* loop through each class */ classList.forEach(className => { /* check if class name matches lazy load guess, store in var */ spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight = outloadTextDomStopPageParsedHeight(loadTextDomStopPageParsedHeight, className); }); } } }); /* If a class was output means on by that name so modify element. ****/ if (spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight != 0 ) { spinnerDomStopPageParsedHeight = /* only one so select at index 0 */ document.getElementsByClassName(spinnerDomStopPageParsedHeightClassDomStopPageParsedHeight)[0]; /* hide from dom so no random spinner going on */ spinnerDomStopPageParsedHeight.style.display = "none"; } /* Remove after items has been styled. ******************************/ const checkAndRemoveListener = () => { /* if configed to stop parse */ let checkNoPageParse = () => { if (noPageParseDomStopPageParsedHeight == 1) { /* stop parsing */ let spinMark = spinnerDomStopPageParsedHeight.previousElementSibling; if (spinMark) { /* may be the prior sibling as parse anchor */ if (spinMark.innerText.length <= 1) { /* make sure it's empty */ spinMark.remove(); /* looks like the tag looking for so remove */ console.log("Parsing to Page has been Disabled:"); /* notify */ } } } }; /* Remove scroll listener if parse tag has been marked and styled. ***************/ setTimeout(function() { /* */ if (useNextTagDomStopPageParsedHeight == 0) { /* switch is of remove listener */ document.removeEventListener("scroll", checkForParsedItemsDomStopPageParsedHeight); console.log("Event Removed:"); /* norify */ checkNoPageParse(); /* check additional config is on or not to stop parse */ } else { if (numberOfRecursDomStopPageParsedHeight >= 0) { /* have not reached limit */ numberOfRecursDomStopPageParsedHeight--; /* decrement value */ checkAndRemoveListener(); /* recurs */ } else { /* readched limit, notify, and remove listener */ console.log("No parent tag was marked.\n" + "Try editing array tagCheckDomStopPageParsedHeight manually.\n" + "Event Removed:"); checkNoPageParse(); /* check additional config is on or not to stop parse */ } } }, 100); }; /* Set listener to elements from array tagCheckDomStopPageParsedHeight defined *** at the top. ********************************************************************/ document.addEventListener( /* add listener to check for changes and mark tag */ "scroll", checkForParsedItemsDomStopPageParsedHeight ); /* remove event listener after it has styled page */ checkAndRemoveListener();})(); 
```
</details>
</dd></dl></dd></dl>

Video - Dom Take Video Notes: 
----
<dl><dd><dl><dd>

Take notes on a html page with video tag or iframe playing video or videos. <br><br>

<!------------------------------------------
Take notes on a html page with video tag or iframe playing video or videos. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

Loosely Teste on [zaproxy.org](https://www.zaproxy.org/). <br>
Page tested - **[ZAP in Ten](https://www.zaproxy.org/zap-in-ten/)**.

<details>

<summary>dom_Video_DomTakeVideoNotes.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [dom_Video_DomTakeVideoNotes.js](https://gist.github.com/jhauga/5a246efafe3dd894c93d6725978651a1)

```markdown
javascript:(function() { /* OPTIONAL FUNCTIONALITY VARIABLES ///////////////////////////////////////////////////*/ /* OPTIONAL - use key press events */ var allowKeyPressDomTakeVideoNotes = 1; /* OPTIONAL - prompt with instructions */ var promptInstructionsDomTakeVideoNotes = 1; /* CONFIG VARIABLES ///////////////////////////////////////////////////*/ /* Keys pressed that do not active not box. */ var ignoredKeysDomTakeVideoNotes = "Home End PageUp PageDown"; /* Set max height and width that note box can be sest to. */ var maxWidthDomTakeVideoNotes = "1000px"; var maxHeightDomTakeVideoNotes = "600px"; /* HTML PAGE ELEMENTS ///////////////////////////////////////////////////*/ /* Lookout for a video tag. */ var checkVideoTagDomTakeVideoNotes = document.getElementsByTagName("video"); /* Lookout for an iframe tag. */ var checkIframeDomTakeVideoNotes = document.getElementsByTagName("iframe"); /* style applied to video area. */ var noteBoxStyling = ` div#noteBoxDomTakeVideoNotes { position: fixed; z-index: 1; bottom: 10px; max-width: 500px; max-height: 500px; margin-left: 20px; margin-bottom: 20px; } div#closeDomTakeVideoNotes { box-sizing: content-box; cursor: pointer; display: inline-block; position: absolute; z-index: 2; width: 15px; height: 15px; padding: 5px 5px 15px 5px; margin-top: -15px; margin-left: 5px; background: red; color: white; border-radius: 5px; text-align: center; } div#showHideNoteBoxDomTakeVideoNotes, textarea#textareaDomTakeVideoNotes { max-width: ${maxWidthDomTakeVideoNotes} !important; max-height: ${maxHeightDomTakeVideoNotes} !important; } div#showHideNoteBoxDomTakeVideoNotes { resize: both !important; overflow: auto; transform: rotateX(180deg); height: 200px; width: 600px; padding: 0px; } textarea#textareaDomTakeVideoNotes { box-sizing: border-box; position: absolute; z-index: 1; resize: none; transform: rotateX(180deg); height: inherit; width: inherit; margin-left: 10px; margin-bottom: 10px; padding: 25px; } `; /* Make sure page has either a video tag or an iframe tag. */ if ( checkVideoTagDomTakeVideoNotes.length > 1 || checkIframeDomTakeVideoNotes.length > 1 ) { /* create elements for take notes area */ let noteBoxStyleDomTakeVideoNotes = document.createElement("style"); let noteBoxDomTakeVideoNotes = document.createElement("div"); let closeDomTakeVideoNotes = document.createElement("div"); let showHideNoteBoxDomTakeVideoNotes = document.createElement("div"); let textareaDomTakeVideoNotes = document.createElement("textarea"); /* add id for styling and additional functionality */ noteBoxStyleDomTakeVideoNotes.id = "noteBoxStyleDomTakeVideoNotes"; /* checks if notebox exist */ noteBoxDomTakeVideoNotes.id = "noteBoxDomTakeVideoNotes"; /* hold all */ closeDomTakeVideoNotes.id ="closeDomTakeVideoNotes"; /* show and hide notes */ showHideNoteBoxDomTakeVideoNotes.id = "showHideNoteBoxDomTakeVideoNotes"; /* style with display none */ textareaDomTakeVideoNotes.id = "textareaDomTakeVideoNotes"; /* text box for notes */ /* first check if bookmarklet has been applied */ let checkIfDomTakeVideoNotes = document.getElementById("noteBoxStyleDomTakeVideoNotes"); /* if not applied apply bookmarklet and add note elements */ if (!checkIfDomTakeVideoNotes) { /* insert style tag and use noteBoxStyling defined at start */ document.body.appendChild(noteBoxStyleDomTakeVideoNotes); noteBoxStyleDomTakeVideoNotes.innerText = noteBoxStyling; /* insert and select newly inserted element */ document.body.appendChild(noteBoxDomTakeVideoNotes); let noteBoxDomTakeVideoNotesID = document.getElementById("noteBoxDomTakeVideoNotes"); /* insert and select newly inserted element */ noteBoxDomTakeVideoNotesID .insertAdjacentElement("afterbegin", closeDomTakeVideoNotes); let closeDomTakeVideoNotesID = document.getElementById("closeDomTakeVideoNotes"); /* insert and select newly inserted element */ closeDomTakeVideoNotesID .insertAdjacentElement("afterend", showHideNoteBoxDomTakeVideoNotes); let showHideNoteBoxDomTakeVideoNotesID = document.getElementById("showHideNoteBoxDomTakeVideoNotes"); /* insert and select newly inserted element */ showHideNoteBoxDomTakeVideoNotesID .insertAdjacentElement("afterbegin", textareaDomTakeVideoNotes); let textareaDomTakeVideoNotesID = document.getElementById("textareaDomTakeVideoNotes"); /* add ablility for not box to be hidden */ closeDomTakeVideoNotesID.innerText = "x"; closeDomTakeVideoNotesID.dataset.showhide = "0"; closeDomTakeVideoNotesID.addEventListener("click", function() { if (this.dataset.showhide == "0") { this.dataset.showhide = "1"; this.innerText = "o"; this.nextElementSibling.style.display = "none"; } else { this.dataset.showhide = "0"; this.innerText = "x"; this.nextElementSibling.style.display = ""; } }); /***** KEY PRESS FUNCTIONS *****/ if (allowKeyPressDomTakeVideoNotes == 1) { /* Copy notes in textare to clipboard. */ function copyNotesDomTakeVideoNotes() { textareaDomTakeVideoNotesID.select(); navigator.clipboard.writeText(textareaDomTakeVideoNotesID.value); } /* Focus on textarea whenever keydown occurs. */ function keypressToNoteDomTakeVideoNotes() { let activeID = document.activeElement.id; let lastKeyPressDomTakeVideoNotes; /* used to check for key combos */ lastKeyPressDomTakeVideoNotes = sessionStorage.getItem("lastKeyPressDomTakeVideoNotes"); /* for first key press */ if (lastKeyPressDomTakeVideoNotes == null) { sessionStorage.setItem("lastKeyPressDomTakeVideoNotes", event.key); lastKeyPressDomTakeVideoNotes = sessionStorage.getItem("lastKeyPressDomTakeVideoNotes"); } /* store key press and check active element */ let currentKeyPress = event.key; /* start conditions to activate note box or run function accordingly */ /* if any of these elements have focus */ /** ignoredKeysDomTakeVideoNotes = "comments search contenteditable-root playerTakeNotes"; **/ /* then don't take notes - note - variable defined at start */ for (i in ignoredKeysDomTakeVideoNotes) { if (activeID == ignoredKeysDomTakeVideoNotes[i]) { /* quit function */ return; } } /* else */ { /* the active element is not in ignored list, run function */ let checkKeyCombo = /* check for combos */ lastKeyPressDomTakeVideoNotes + "+" + currentKeyPress; /* check key combos and run function accordingly */ if (checkKeyCombo == "Control+Shift") { textareaDomTakeVideoNotesID.blur(); /* out of note box */ } /* select and copy notes to clipboard */ else if (checkKeyCombo == "Alt+a") { copyNotesDomTakeVideoNotes(); } else { /* only if note box is not active element */ if (activeID != "textareaDomTakeVideoNotesID") { /* prevent fullscreen from occuring *//* /* USE VARIABLE FOR CONDITIONS */ let noIgnoredKeys = ignoredKeysDomTakeVideoNotes.indexOf(event.key) == -1; let notPauseShortcut = checkKeyCombo != "Shift+ "; if (noIgnoredKeys) { if (notPauseShortcut) { textareaDomTakeVideoNotesID.focus(); } } } } } /* store key press for next key combo check */ sessionStorage.setItem("lastKeyPressDomTakeVideoNotes", event.key); } /* Begin taking notes. */ textareaDomTakeVideoNotes.focus(); /* Quickly get back to notes */ const addKeyDownDomTakeVideoNotes = () => { document.body.addEventListener("keydown", function() { keypressToNoteDomTakeVideoNotes(); }); }; const addKeyUpDomTakeVideoNotes = () => { document.body.addEventListener("keyup", function() { keypressToNoteDomTakeVideoNotes(); }); }; /* Listen for keydonw event. */ addKeyDownDomTakeVideoNotes(); } } } /* Prompt with instructions if turned on - variable at top is 1. */ if (promptInstructionsDomTakeVideoNotes == 1) { alert(`TAKE VIDEO NOTES INSTRUCTIONS:\n\n I. Taking Notes:\n *************\n\n - Start typing to take notes.\n - Press 'Ctrl + Shift' to unfocus note box.\n - Start typing again to take notes.\n - Press 'Alt + a' to copy all in note box.\n - To hide notes and have option to save click\n the red button at top left of notes.\n\n `/************************************************* MAYBE LATER ************************************************* II. Saving Notes:\n - Press 'Save Notes' button adjacent to close\n button when notes are closed to save notes.**************************************************/ ); }})(); 
```
</details>
</dd></dl></dd></dl>

</div>
<hr><br>

# Navigation Bookmarklets:
<div>
The below bookmarklets are for pages with a side nav with many links.
Copy and paste (<em>making any needed adjustments</em>) to use.

Sidebar - Fix And Scroll Side Menu: 
----
<dl><dd><dl><dd>

Fix side navigation and aside to position of page, and make it scrollable. <br><br>

<!------------------------------------------
fix side navigation and aside to position of page, and make it scrollable. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>nav_Sidebar_FixAndScrollSideMenu.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [nav_Sidebar_FixAndScrollSideMenu.js](https://gist.github.com/jhauga/68d76f72d3adfebfb99cc34b459e2cc6)

```markdown
javascript:(function() { /* HTML DOM variables. */ var headSidebarFixAndScrollSideMenu = /* select head element */ document.getElementsByTagName("head"); /* Create HTML variables. */ var styleSidebarFixAndScrollSideMenu = /* create style tag */ document.createElement("style"); /* CSS to be inserted in created style element. */ var cssSidebarFixAndScrollSideMenu = /* side nav css style */` nav, aside:first-of-type { height: 80%; position: sticky !important; top: 0 !important; overflow-y: auto; max-height: 800px !important; left: 10px !important; margin-left: 0 !important; z-index: 1 } nav a.active, aside:first-of-type a.active { top: 0 !important } /* Designing for scroll-bar thanks to: https://www.geeksforgeeks.org/how-to-change-the-position-of-scrollbar-using-css/ */ ::-webkit-scrollbar { width: 5px; } /* Track */ ::-webkit-scrollbar-track { border-radius: 5px; } /* Handle */ ::-webkit-scrollbar-thumb { background: white; border-radius: 5px; } /* Handle on hover */ ::-webkit-scrollbar-thumb:hover { background: #555; } `; /* Add CSS to style tag to be inserted. */ styleSidebarFixAndScrollSideMenu.innerText = /* use css from above */ cssSidebarFixAndScrollSideMenu; /* Insert the style tag to end of head element. */ headSidebarFixAndScrollSideMenu[0].appendChild(styleSidebarFixAndScrollSideMenu);})();
```
</details>
</dd></dl></dd></dl>

Sidebar - Highlight Current Page:
----
<dl><dd><dl><dd>

If a page has side navigation that doesn't hightlight the current page
then use this bookmarklet: <br><br>

<strong>USE - ready to use</strong>
<details>

<summary>nav_Sidebar_HighlightCurrentPage.js</summary><br>

Gist page for [nav_Sidebar_HighlightCurrentPage.js](https://gist.github.com/jhauga/716cd39dc31ac9f607993f709cc48f60)

```markdown
javascript:(function(){var styleBackground="white";/*<<--CHANGE*/var styleColor="black";/*<<--CHANGE*/var pathName=location.pathname;var allATags=document.getElementsByTagName("a");for(i=0;i<allATags.length;i++){let currentATag=allATags[i];let currentHref=currentATag.href;if(currentHref.indexOf(pathName)>-1){currentATag.style.background=styleBackground;currentATag.style.color=styleColor;}}})();
```
</details>
</dd></dl></dd></dl>

Sidebar - Underline Anchor Link:
----
<dl><dd><dl><dd>

If a page has a side navigation with many anchor links, which do not underline
when clicked use this bookmarklet: <br><br>

<strong>USE - ready to use</strong>
<details>

<summary>nav_Sidebar_UnderlineAnchorLink.js</summary><br>

Gist page for [nav_Sidebar_UnderlineAnchorLink.js](https://gist.github.com/jhauga/34b965a0e2a49fdf075fdf44d15306d0)

```markdown
javascript:(function(){var a=document.getElementsByTagName("a");var aLen=a.length;var oneCheck=0;for(i=0;i<a.length;i++){if(a[i].href.indexOf(location.href.substr(location.href.lastIndexOf("#")+1))>-1&&oneCheck==0){a[i].style.textDecoration="underline";oneCheck=1;}a[i].addEventListener("click",function(){if(this.href.indexOf("#")>-1){for(j=0;j<aLen;j++){if(a[j].href.indexOf("#")>-1){a[j].style.textDecoration="";}}this.style.textDecoration="underline";}});}})();
```
</details>
</dd></dl></dd></dl>
</div>
<hr><br>

# Style Bookmarklets
<div>
The below bookmarklets are to change style elements (<em>images, background, text, etc.</em>) of a web page.
Copy and paste (<em>making any needed adjustments</em>) to use.

Favicon - Change or Add Favicon: 
----
<dl><dd><dl><dd>

Change or add a website favicon. For fun or to help identify sites by tab or bookmark icons; e.g. add an icon to appear in bookmarks when bookmarking a site without a favicon. Works with:

1. Remote URL - website or application
2. Local URL - locally hosted website or application

<strong>USE - requires 1 change</strong>

<details>

<summary>style_Favicon_ChangeOrAddFavicon.js</summary><br>

<strong>Required \(x1\)</strong>
 1. Change value of `faviconImageURL` variable to image's url.

<!-- PASTE VIDEO HERE -->

Gist page for [style_Favicon_ChangeOrAddFavicon](https://gist.github.com/jhauga/82ddb109ee790c2a3670457a8cbbff73)

```markdown
javascript:(function() {var faviconImageURL = "CHANGE"; /* CHANGE - url where image is located. Locally hosted urls will work. */ document.getElementsByTagName("head")[0].innerHTML += "<link rel='icon' href='" + faviconImageURL + "' type='image/x-icon'>"; /* Append a link tag to head HTML tag and done. */})();
```
</details>
</dd></dl></dd></dl>
</div>
<hr><br>

# Site Specific Bookmarklets:
<div>
The below bookmarklets will only work when used on the website specified.

ChatGPT - Bookmark a specific response
----
<dl><dd><dl><dd>

Bookmark ChatGPT response as basic text or HTML. Change variable textOut to 1 for text and 0 for HTML.
If any error, escape quotes and special characters in text and repaste. <br><br>

<strong>USE - requires 1 change </strong>
<details>

<summary>siteSpecific_chatGPT_BookmarkResponse.js</summary><br>

<strong>Required \(x1\)</strong>
 1. Paste response from clipboard in lieu of "PASTE_RESPONSE". 
 
<strong>Optional \(x2\)</strong> 
 1. Change "DEFAULT_TITLE" 
 2. Change ``textOut`` variable \(<em>i.e. HTML not parsing right</em>\). 

<strong>NOTE</strong> - two spaces in pasted text will add line break.<br>

Gist page for [siteSpecific_chatGPT_BookmarkResponse.js](https://gist.github.com/jhauga/328eccd84d072664c68bf2079fd11bab)

```markdown
javascript:(function(){var rawText="PASTE_RESPONSE";var textOut=0;var changeTitle="DEFAULT_TITLE";var htmlOut;if(textOut==1){htmlOut=0;}else{htmlOut=1;}var styleEl="<style>p, ol, ul { +  max-width: 90%; } p {  line-height: 18pt;  font-size: 16pt; } ol, ul {  margin: 10px 3px; } ul {  list-style: disc; } li {  margin: 3px 0;  font-size: 14pt; } div div, pre div {  background:black;  color:white;  max-width: 800px;  margin:0 10px;  overflow:auto } div pre {  padding-left:10px }</style>";let onWord=0;var makeMarks=function(){rawText=rawText.replace(/\n/g,"\\n");rawText=rawText.replace(/(([0-9]+)\.)/g,"  $1");rawText=rawText.replace(/(\w[:'"`])\.([A-Z])/g,"$1. $2");rawText=rawText.replace(/```((active directory operations)|(algorithm optimization)|(angular)|(api integration)|(array[s])|(assignment[s])|(asynchronous programming)|(authentication)|(authorization)|(backup and recovery)|(bash)|(basic command line navigation)|(batch file basics)|(batch file functions)|(batch file input)|(batch file output)|(batch file variables)|(batch)|(boolean)|(boolean[s])|(c#)|(c\+\+)|(callback[s])|(class)|(class[s])|(closure[s])|(cloud computing)|(cloud services)|(cmd)|(code analysis)|(code comments)|(code refactoring)|(collection[s])|(command substitution)|(comment[s])|(conditional[s])|(conditional[s])|(configuration)|(constructor[s])|(container management \(docker\))|(containerization)|(cron jobs and scheduling)|(css)|(cybersecurity)|(data backup)|(data migration)|(data retrieval)|(data structures)|(data type[s])|(database management)|(database)|(declaration[s])|(dependency injection)|(design patterns)|(destructor[s])|(devops)|(dictionary[s])|(disaster recovery)|(disk space management)|(django)|(dns configuration)|(docker)|(dom manipulation)|(enumeration[s])|(environment variables)|(environment variables)|(error handling)|(error handling)|(event handling)|(event[s])|(excel)|(exception[s])|(express.js)|(expression[s])|(file and directory operations)|(file and folder operations)|(file compression and archiving)|(file handling)|(file system analysis)|(file upload)|(firewall setup)|(flask)|(float[s])|(for loop[s])|(function)|(function)|(function[s])|(functional programming)|(garbage collection)|(git)|(go)|(graph algorithms)|(hash table[s])|(html)|(if statements)|(import[s])|(incident response)|(infrastructure as code)|(inheritance[s])|(input and output redirection)|(integer[s])|(interface)|(interface[s])|(it compliance)|(it documentation)|(it policies and procedures)|(java)|(javascript)|(json)|(lambda[s])|(library[s])|(linked list)|(linked list[s])|(load balancing)|(loop)|(loop[s])|(mac and linux command line titles:)|(memory management)|(method[s])|(module[s])|(multithreading)|(mutex[s])|(network configuration)|(network configuration)|(network security)|(networking and ip configuration)|(networking)|(node.js)|(object)|(object-oriented programming)|(object[s])|(operator[s])|(package management \(apt, yum, brew\))|(package[s])|(parallel computing)|(parameter[s])|(performance profiling)|(perl)|(permissions and ownership)|(php)|(pipes and filters)|(pointer[s])|(powershell scripting)|(powershell)|(process management)|(python)|(queue[s])|(react)|(recursion)|(recursion[s])|(registry editing)|(regular expression)|(regular expression)|(regular expressions in the command line)|(remote desktop connection)|(rest api)|(return[s])|(ruby on rails)|(ruby)|(rust)|(scripting with bash)|(semaphore[s])|(server administration)|(set[s])|(shell script debugging)|(shell script functions)|(shell script)|(singleton[s])|(software deployment)|(sorting algorithms)|(sorting)|(spring boot)|(sql)|(ssh and remote access)|(stack[s])|(statement[s])|(string manipulation)|(string[s])|(swift)|(switch)|(syntax[s])|(system monitoring \(top, ps\))|(system monitoring)|(system updates and upgrades)|(task scheduling)|(text file processing)|(text file processing)|(text processing with awk)|(thread[s])|(tree traversal)|(tuple[s])|(typescript)|(unit test)|(unit testing framework)|(user account management)|(variable)|(variable[s])|(version control \(git\))|(virtual private cloud \(vpc\))|(virtualization)|(vpn configuration)|(vue.js)|(websockets)|(while loop[s])|(windows command prompt tips)|(windows event logs)|(windows management instrumentation \(wmi\))|(windows script host)|(windows security policies)|(windows services)|(xml))/g,"```");rawText=rawText.replace(/(```)*((\{(?![a-zA-Z]))|(\[)|(\()) {1,}/g,"$1$2\n  ");rawText=rawText.replace(/(```)*(( {1,}\})|( {1,}\])|( {1,}\)))/g,"$1$2 \n  ");rawText=rawText.replace(/(((?!`)(&lt;\/[a-zA-Z]+&gt;)|(&lt;[a-zA-Z]+&gt;)(?!`)))/g,"$1<br>");rawText=rawText.replace(/(?!\()(\$[a-zA-Z]+)/g,"<br>$1");let checkEx=1;let onoff=0;while(checkEx==1){if(rawText.indexOf("**")>-1){if(onoff==0){rawText=rawText.replace("**","<strong>");onoff=1;}else{rawText=rawText.replace("**","</strong>: ");onoff=0;}}else{checkEx=0;}}checkEx=1;onoff=0;while(checkEx==1){if(rawText.indexOf("```")>-1){checkEx=1;if(onoff==0){if(textOut==1){rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","<hr><div><code>");}else{rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","<hr><div><pre><code>");}onoff=1;}else{if(textOut==1){rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","</code></div><hr>");}else{rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","</code></pre></div><hr>");}onoff=0;}}else{checkEx=0;}}rawText=rawText.replace(/ {2,}([0-9]+)/g,"\n\n$1 ");rawText=rawText.replace(/ {2,}(-)/g,"\n$1");rawText=rawText.replace(/: {2,}/g,"\n");rawText=rawText.replace(/ {2,}/g," \n\n");if(htmlOut==1){rawText=rawText.replace(/\n/g,"<br>");}};var checkNest=function(){if(liHTML==1){nestedList=1;}};var checkState=function(swOne,swTwo,htmlOne,htmlTwo){checkNest();outText+=htmlOne+htmlTwo;};let setMaxWords=25,count=1;var parseHTML=function(cw,curCount){outText+=cw+" ";count=curCount;};let outText="";if(changeTitle=="DEFAULT_TITLE"){changeTitle="ChatGPT Bookmarklet Response";outText="<h1>"+changeTitle+"</h1><hr>";}else{outText="<h1>"+changeTitle+"</h1><hr>";}if(textOut==1){outText+="<pre>";makeMarks();}else{outText+="<div>";makeMarks();}let rawTextArr=rawText.split(" ");for(i in rawTextArr){if(rawTextArr[i].indexOf("\n")>-1||rawTextArr[i].indexOf("<br>")>-1){count=1;}if(textOut==1){if(count>=setMaxWords){parseHTML("\n"+rawTextArr[i],1);}else{parseHTML(rawTextArr[i],Number(count+1));}}else{if(count>=setMaxWords){parseHTML("<br>"+rawTextArr[i],1);}else{parseHTML(rawTextArr[i],Number(count+1));}}}if(textOut==1){outText+="</pre>";}else{outText+="</div>";}outText=outText.replace(/\.([A-Z])/g,". $1");document.write("<title>"+changeTitle+"</title>"+styleEl+outText);})();
```
</details>
</dd></dl></dd></dl>

ChatGPT- Navigate Answers: 
----
<dl><dd><dl><dd>

Navigate through long chatGPT conversations one answer at a time. <br><br>

<!------------------------------------------
Navigate through long chatGPT conversations one answer at a time.. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>siteSpecific_chatGPT_NavigateAnswers.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_chatGPT_NavigateAnswers.js](https://gist.github.com/jhauga/ada256a97a9725a7ba117de31909b4cd)

```markdown
javascript: (function () { /* Configurable variables. */ var incrementCountNavigateAnswers = "PageDown"; var decrementCountNavigateAnswers = "PageUp"; var alertWithInstructionsNavigateAnswers = 1; /* Start with odd index for getting answers. */ var countNavigateAnswers = 1; /* Enable use of traverse back and forth. */ var firstRunNavigateAnswers = 0; /**************************************************************/ /* MAIN FUNCITON */ /**************************************************************/ /* Set main variables used. */ var articlesNavigateAnswers = document.getElementsByTagName("article"); var articlesNavigateAnswersLen = articlesNavigateAnswers.length; /* Session storage to get last page[press] to compensate. */ sessionStorage.setItem("lastPageWhat", "0"); var lastPageWhat = ""; /* Traverse through each answer, showing one at a time. */ function navigateAnswers(keyPress) { /* condition to enable reset */ if (keyPress == incrementCountNavigateAnswers || keyPress == decrementCountNavigateAnswers) { if (countNavigateAnswers <= articlesNavigateAnswersLen && countNavigateAnswers >= 1) { /* loop and turn all off */ for (i = 0; i < articlesNavigateAnswersLen; i++) { /* hide all then view by current count of key variable */ articlesNavigateAnswers[i].style.display = "none"; } /* on initiating bookmarklet */ if (firstRunNavigateAnswers == 0) { firstRunNavigateAnswers = 1; if (keyPress == incrementCountNavigateAnswers) { /* go to first answer */ articlesNavigateAnswers[countNavigateAnswers].style.display = ""; } else if (keyPress == decrementCountNavigateAnswers) { /* go to last answer */ countNavigateAnswers = Number(articlesNavigateAnswersLen-1);; articlesNavigateAnswers[countNavigateAnswers].style.display = ""; } } else { if (keyPress == incrementCountNavigateAnswers) { /* go to next answer */ /* reset on last item */ if (countNavigateAnswers >= Number(articlesNavigateAnswersLen-1)) { countNavigateAnswers = 1; articlesNavigateAnswers[countNavigateAnswers].style.display = ""; } else { countNavigateAnswers += 2; articlesNavigateAnswers[countNavigateAnswers].style.display = ""; } } else if (keyPress == decrementCountNavigateAnswers) { /* go to previous answer */ /* reset on first item */ if (countNavigateAnswers <= 1) { countNavigateAnswers = Number(articlesNavigateAnswersLen-1); articlesNavigateAnswers[countNavigateAnswers].style.display = ""; } else { countNavigateAnswers -= 2; articlesNavigateAnswers[countNavigateAnswers].style.display = ""; } } } } else { /* reset accordingly */ if (keyPress == incrementCountNavigateAnswers) { /* reset to firest */ countNavigateAnswers = 1; } else { /* reset to last */ countNavigateAnswers = Number(articlesNavigateAnswersLen-1); } } } } /* Add event to listen for key press. */ document.addEventListener("keydown", function () { navigateAnswers(event.key); }); /* Add alert event so that instructions for use are communicated. */ if (alertWithInstructionsNavigateAnswers != undefined && alertWithInstructionsNavigateAnswers == 1) { let alertText = "INSTRUCTIONS: \n" + "************* \n" + "Press '" + incrementCountNavigateAnswers + "' to go to the " + "next answer in conversation.\n" + "Press '" + decrementCountNavigateAnswers + "' to go to prior answer."; alert(alertText); } })();
```
</details>
</dd></dl></dd></dl>

ChatGPT - Paste Ready Bookmark Response:
----
<dl><dd><dl><dd>

Copy a ready bookmarklet to the clipboard. Once run all copied answers will be copied and ready to paste as new bookmarklet. Works with:

1. ChatGPT - Resize Prompt

<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_chatGPT_PasteReadyBookmarkResponse.js</summary><br>

<strong>Video Demonstration for Use:</strong>

`Ctrl + click` link to view demo on YouTube [ChatGPT - Paste Ready Bookmark Response](https://youtu.be/0aGQyrg7vo0)


Gist page for [siteSpecific_chatGPT_PasteReadyBookmarkResponse.js](https://gist.github.com/jhauga/d8c3b593e6a7d38d2338b8092e86e3e2) 

```markdown
javascript:(function(){ /* Configuration variables. */ var instructionAlert = 1; /* <-- CONFIGURATION - 1 is on (alert), 0 is off (no alert) */ var useRunningFix = 1; /* <-- CONFIGURATION - 1 is on (find and replace), 0 is off */ var replaceAllRunFix = 1; /* <-- CONFIGURATION - 1 is on (replace all), 0 is off */ /* Optional variables. */ var pageTitle = "ChatGPT Bookmark"; /* <-- OPTIONAL - change title */ var pageHead = "ChatGPT Response"; /* <-- OPTIONAL - change head */ /********************************************************************************** NOTE - 'HOT-GLUE' comments for fast; ok this works, and/or good enough patch, or DOM element that changes frequently. NOTE - use embedded object 'RUNNING_FIX', following syntax as illustrated below. RUNNING_FIX ILLUSTRATION: ************************* NOTE - this is mainly intended for code examples given by chatGPT. NOTE - if config is 1 (on), and no value or object undefined, bookmarklet still works. For items that transcripted unexpectedly in code boxes. TO USE - Follow pattern: "1": {one: "replace what", two: "with this"}, "2": {one: "replace what", two: "with this"}, etc... For each numeric nested object; property one is replaced with property two. Object is utilized in support funciton "runningFixChatGPTPasteReadyBookmark()". ***********************************************************************************/ /*********** RUNNING_FIX EXAMPLE: ******************** Best to keep a running object of this. Based upon answer where code for C++ was written as ` #include <iostream>using namespace std;int main() { ` after being bookmarked using bookmarklet. Here a question was asked were several code examples in several languages were given, but for some reason C++ did not transpose correctly, ***********/ var RUNNING_FIX = { "1": { one: "&lt;iostream&gt;", two: "&lt;iostream&gt;<br>" }, "2": { one: " std;", two: " std;<br>" }, "3": { one: ";\n}", two: ";<br>}" } }; /* Class names to identify div that is parent of button row. */ var copyButtonSelector = /* select copy button by attribute */ "[aria-label=\"Copy\"]"; /* Class names to identify the answer area sibling so answer area can be selected. */ var answerAreaClassNameIdentifier = /* HOT-GLUE - likely to change */ "flex absolute left-0 right-0 flex justify-start"; /* Define variables for later use. */ var answerRow, buttonRow, copyButton, cancelWhile = 0, answerArea, answerDIV, answerDIVLen, answerText, currentButtonsPath, currentButtonsPathLen, currentButton, currentButtonsPathArr, currentSelection, priorSelection, copyButtonIndex, priorSelectionIndex, pathPar, pathGrandPar, pathGreatGrandPar; /* Select all copy buttons and use in loop. */ currentButtonsPath = document.querySelectorAll(copyButtonSelector); currentButtonsPathLen = currentButtonsPath.length; /* Style the bookmarked page. */ { var bookmarkPageStyle = `<style> * { font-family: sans-serif,system-ui; } body { max-width: 50%; margin-left:auto; margin-right: auto; background:rgb(47 79 79 / 3%); } p code { color: black; font-size: 12pt; font-weight: 600; } p { font-size: 12pt; margin-bottom: 1.25em; margin-top: 1.25em; line-height: 16pt; } pre { max-width: 800px; overflow-x: scroll; padding: 20px; border-radius: 30px; border: 1px solid #d6d6d6; background: #d3d3d342; color: black; } code, pre { line-height: 14pt; font-family: monospace !important; background-color: #f0f0f4; } pre div.dark.bg-gray-950 div.flex.items-center.relative span { background: rgb(55 55 55); display: block; width: 110%; padding: 8px 0 0 25px; left: -3.5%; position: relative; top: -20px; color: #cdcdcd; font-size: 10pt; } pre div.bg-black.rounded-md code { line-height: 1; } pre code * { padding: 2px 0px; display: inline-block; font-family: system-ui !important; } pre div.bg-black.rounded-md code .hljs-comment, pre div.bg-black.rounded-md code .hljs-meta, pre span.hljs-comment { display: block; color: hsla(200, 20%, 40%, 1); } pre div.bg-black.rounded-md code .hljs-meta:first-of-type { display: inline-block; position: relative; top: -20px; line-height: 2; } pre div.bg-black.rounded-md code .hljs-meta:last-of-type { display: block; margin-bottom: -10px; line-height: 1.5; } pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800, pre div.bg-black.rounded-md button { vertical-align: middle; padding: 5px 40px; color: rgb(217,217,227); } pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800 { display: inline-block; position: relative; width: 100%; top: -20px; right: -5% !important; margin-left: -8% !important; overflow-x: hidden !important; background: rgb(52,53,65); } pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800 span:first-of-type { line-height: 2; } pre div.bg-black.rounded-md button { display: inline-block; float: right; cursor: pointer; max-width:150px; background: none; border: none; text-decoration: line-through; } pre div.bg-black.rounded-md button svg { height: 15px; width: 20px; margin-right: 3px; } .hljs-doctag, .hljs-formula, .hljs-keyword, .hljs-literal { color: #2e95d3; } .hljs-comment { color: hsla(0,0%,100%,.5); } .hljs-addition, .hljs-attribute, .hljs-meta-string, .hljs-regexp, .hljs-string { color: #00a67d; } .hljs-built_in, .hljs-class .hljs-title { color: #e9950c; } .hljs-attr, .hljs-number, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-pseudo, .hljs-template-variable, .hljs-type, .hljs-variable { color: #df3079; } div[data-side='1'] { display:inline-block; position:fixed; left:0px; top: 0px; width:20%; height:auto; border: 2px solid black; border-bottom-right-radius: 80px; background: #000; } div[data-side='1'] svg, div[data-side='1'] path, div[data-side='1'] h3 { display: inline-block; } div[data-side='1'] svg { background: white; border-radius: 100%; margin-top: 20px; margin-left: 20px; padding:3px; } div[data-side='1'] h3 { position: relative; font-size: 12pt; margin-left: 20px; top: -15px !important; color: white; } table,th,td { border: 1px solid #d9d9e3; } table { border-collapse: separate; border-spacing: 0px; border-radius: 5px; width: 100%; max-width: none !important; } th,td { padding: 5px 5px; } th { background-color: rgba(236,236,241,.2); } button { display: none; } ul li, ol li { margin-top: 12px; } ul li code, ol li code { color: black; background: #ececec; border-radius: .25rem; font-size: 1.115em; font-weight: 500; padding: .15rem .3rem; } ul li code::before, ul li code::after, ol li code::before, ol li code::after { content: '\`'; } code[class*='hljs language-'] { background: none !important; font-size: 12pt; } </style>`; } /******************************** SUPPORT FUNCTIONS ********************************/ /* Increments so no duplicate ids for marker ids, */ var numID = 0; /* Add click event to document and check elements, running bookmark accordingly. */ const docEventChatGPTPasteReadyBookmark = () => { /* add a click event listener to the document */ document.addEventListener('click', function(event) { /* check if the clicked element or any of its parents has the attribute */ let clickedItem = event.target; let curID; /* check if id has been assigned */ if (clickedItem.hasAttribute("id") && clickedItem.id.indexOf( "unexpected_value_bookmarklet_chatgpt_pasteReadyBookmark" ) > -1) { /* define current id */ curID = clickedItem.id; } else { /* define current id */ curID = /* use current value of incrementing number */ "unexpected_value_bookmarklet_chatgpt_pasteReadyBookmark" + numID; clickedItem.setAttribute( "id", "unexpected_value_bookmarklet_chatgpt_pasteReadyBookmark" + numID ); /* increment number id for unique id value */ numID++; } /* select current item with unique id */ let curItem = document.getElementById(curID); /* check if the copy button was clicked */ if (curItem.parentElement.hasAttribute("aria-label") && curItem.parentElement.getAttribute("aria-label") == "Copy") { pasteReadyBookmarkResponse(curItem.parentElement); } }); }; /* Find and replace items in object "RUNNING_FIX". */ const runningFixChatGPTPasteReadyBookmark = (curContent) => { /* ensure that syntax of object is followed */ let followingSyntax = 0; /* turns on if first is good, assumes remaining syntax */ if (RUNNING_FIX && /* if object is declared */ /* and is defined */ (RUNNING_FIX != undefined) || (RUNNING_FIX != null) ) { for (i in RUNNING_FIX) { /* check if first nested object follows syntax */ if (i == 1) { followingSyntax = 1; break; } else { /* end after one */ break; } } /* if syntax passed, continue; assuming remaining nested objects pass */ if (followingSyntax == 1) { for (i in RUNNING_FIX) { /* use a marking value with an unlikely string for an answer */ let unlikelyValue = "unlikely_v_a_l_u_e_for_a_random_book_m-a-r-k-l-e-t_RUNNING_FIX_un_like_ly"; /* check if replace all is turned on */ if (replaceAllRunFix == 1) { let gotAll = 0; /* variable 0 until all marked for replacement */ while (gotAll == 0) { /* while items found to be replace, mark with unlikely value */ if (curContent.indexOf(RUNNING_FIX[i].one) > -1) { curContent = curContent.replace(RUNNING_FIX[i].one, unlikelyValue); } else { /* marked all to be replaced */ gotAll = 1; } } gotAll = 0; /* variable 0 until all marked for replacement */ while (gotAll == 0) { /* while items marked with unlikely value, replace them */ if (curContent.indexOf(unlikelyValue) > -1) { curContent = curContent.replace(unlikelyValue, RUNNING_FIX[i].two); } else { /* replaced all marked values */ gotAll = 1; } } } else { /* replace first occurence */ curContent = curContent.replace(RUNNING_FIX[i].one, RUNNING_FIX[i].two); } } } return curContent; } }; /* sort the class name that is used to identify answer area. */ const sortClassIdentityChatGPTPasteReadyBookmark = (arr) => { let splitArr = arr.split(" "); /* make argument an array */ splitArr.sort(); /* sort the array */ let stringArr = ""; /* define empty variable for final output */ /* fill empty variable with sorted array */ for (i = 0; i < splitArr.length; i++) { /* add each item in array to empty variable with appending space */ if (i == Number(splitArr.length-1)) { /* don't add space for last item */ stringArr += splitArr[i]; } else { /* append item and a space */ stringArr += splitArr[i] + " "; } } /* return te final sorted string variable */ return stringArr; }; /* Redefine variable used to identify answer ares, sorting it. */ answerAreaClassNameIdentifier = /* use output from support function */ sortClassIdentityChatGPTPasteReadyBookmark(answerAreaClassNameIdentifier); /*********************************************************************************** MAIN FUNCTION ***********************************************************************************/ function pasteReadyBookmarkResponse(aWhat) { buttonRow = aWhat.parentElement; /* start process to select answer ares */ let checkForAnswerArea = function() { /* variable to hold each sorted class value */ let sortClass = "no"; if (buttonRow.hasAttribute("class")) { sortClass = /* reset to sorted value of elements class attribute */ sortClassIdentityChatGPTPasteReadyBookmark(buttonRow.className); } if (sortClass != "no" && /* has been redefined witn sorted class */ sortClass.indexOf(answerAreaClassNameIdentifier) > -1 /* class names match */ ) { /* found it, define global declared at top */ answerRow = buttonRow.previousElementSibling; } else { cancelWhile+=1; /********************** increment safety linit */ buttonRow = buttonRow.parentElement; /* check nxt top-level element */ if (cancelWhile < 20) { /* recurs are below safety limit */ checkForAnswerArea(); } else { /* do nothing ********************************/ let skip; } } }; checkForAnswerArea(); answerArea = answerRow; answerDIV = answerArea.getElementsByTagName("div"); answerDIVLen = answerDIV.length; /* start process to get div holding answer <-- ASSUMES HTML SEMATICS*/ let j = 0; /* <-- switch to turn off loop */ let l = 0; /* increase nested div tag */ let errOut = 0; /* extract div holding answer */ while (j != 1) { let isItAnswer = answerDIV[l].children[0].tagName; if (isItAnswer != "div" || isItAnswer != "DIV") { answerText = answerDIV[l]; j = 1; } else { /* increment and continue loop */ l+=1; errOut+=1; } if (errOut >= 20) { break; } } /* now the answer's div element should be extracted */ let copiedContent = /* get the content being copied */ answerText.innerHTML; /* clean up a bit */ copiedContent = copiedContent.replace(/<code /g, "<pre "); /* change opening code HTML tags to pre tags */ copiedContent = copiedContent.replace(/<\/code>/g, "</pre>"); /* change closing code HTML tags to pre tags */ copiedContent = copiedContent.replace(/\"/g, '&#92;&quot;'); /* use html encoding for escaped double quotes */ copiedContent = copiedContent.replace(/"/g, '\"'); /* keep double quotes as needed for inline html */ copiedContent = copiedContent.replace(/\'/g, "&#92;&apos;'"); /* use html encoding for escaped single quotes */ copiedContent = copiedContent.replace(/'/g, "'"); /* keep single quotes as needed for inline html */ copiedContent = copiedContent.replace(/([ ]{2,})/g, "<br>$1"); /* replace 2 or momre spaces with <br> tag */ copiedContent = copiedContent.replace(/class=&#92;&quot;/g, "class='"); /* HOT-GLUE - correct open class - HOT-GLUE */ copiedContent = copiedContent.replace(/&#92;&quot;>/g, "'>"); /* HOT-GLUE - correct close class - HOT-GLUE */ /* utilize "RUNNING_FIX" to correctly write unexpected outputs */ copiedContent = runningFixChatGPTPasteReadyBookmark(copiedContent); /* alert to wait - if pasted immediately = does not work */ alert("Wait 2 seconds for content to generate as bookmarklet on clipboard. \nThen open bookmark manager and make new bookmark by pasting into url field"); /* HOT-GLUE - replace new line characters only in pre tags */ var pageScript = `<script>var preTag = document.getElementsByTagName('pre');var preTagLen = preTag.length;if (preTagLen >= 1) { for (i = 0; i < preTagLen; i++) { setTimeout(function() { let curInnerHTML = preTag[i].innerHTML; curInnerHTML = curInnerHTML.replace(/\\\\n/g, '<br>'); /* update code blocks with HOT-GLUE fix */ preTag[i].innerHTML = curInnerHTML; }, 500); }}</script>`; /* store new bookmarklet to be written to clipboard */ var bookmarklet = 'javascript:(function() {document.write("' + /* write html head content */ "<!DOCTYPE HTML><html><head><title>" + pageTitle + "</title>" + /* style a bit */ bookmarkPageStyle + "</head><body><h1>" + pageHead + "</h1><hr>" + /* sidebarlink to original answer */ "<div data-side='1' data-nav='0'>" + "<svg width='41' height='41' viewBox='0 0 41 41' fill='none' xmlns='http://www.w3.org/2000/svg' class='h-2/3 w-2/3' role='img'><text x='-9999' y='-9999'>ChatGPT</text><path d='M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z' fill='currentColor'></path></svg>" + '<h3>ChatGPT Bookmark</h3></div>' + /* output copied content */ copiedContent + /* add pageScript */ pageScript + /* close html */ "</body></html>" + /* close bookmarklet */ '");})()'; /* HOT-GLUE - remove unwanted escaped double quotes - HOT-GLUE */ bookmarklet = bookmarklet.replace(/&#92;&quot;/g, "&quot;"); /* HOT-GLUE - remove unwanted escaped single quotes - HOT-GLUE */ bookmarklet = bookmarklet.replace(/&#92;&apos;/g, ""); /* HOT-GLUE - remove bactic as probably md styling - HOT-GLUE */ bookmarklet = bookmarklet.replace(/`/g, ""); /* set timeout so bookmarklet content is copied after answers' text */ setTimeout(function () { navigator.clipboard.writeText(bookmarklet); }, 2000); } /* Run function that checks whenever a click event fires on page. */ docEventChatGPTPasteReadyBookmark(); /* If instruction alert is on. */ if (instructionAlert == 1) { alert( "INSTRUCTIONS: \n" + "**************** \n" + "IMPORTANT - click copy button around bottom. \n\n" + "1. Run bookmarklet. \n" + "2. Click the copy answer button (at bottom of button). \n" + "3. Create a new bookmarket, pasting contents of clipboard in the URL box."); }})();
```
</details>
</dd></dl></dd></dl>

ChatGPT - Resize Prompt
----
<dl><dd><dl><dd>

Resize the ChatGPT text prompt. Works with:

1. ChatGPT - Paste Ready Bookmark Response

<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_chatGPT_ResizePrompt.js</summary><br>

Gist page for [siteSpecific_chatGPT_ResizePrompt.js](https://gist.github.com/jhauga/edf8e8a842ebe8b00e1a5ff3ec24892c)

```markdown
javascript: (function () { var composerBackground; /* ELMERS-GLUE - defined later - select the parent holding prompt and UI elements. */ var composerBackgroundPar; /* ELMERS-GLUE - defined later - parent of above. */ var promptTextarea = "prompt-textarea"; /* HOT-GLUE - select id of text prompt. */ var selectFormChildIndex = 0; /* HOT-GLUE - select nested form element child index - see bottom. */ var selectedFormElement; /* HOT-GLUED - see bottom function selectFormParent. */ var startingFormWidth, curState = 1; /* Switch to run different conditions in selectFormParent function at bottom. */ /* The 2 variables below will set a general value for resizing. */ /******************** SET CUSTOM RESIZE VALUES *********************************/ var setMaxHeight = "600px"; /* specify max height for resizing. */ var setMaxWidth = "95%"; /* Specify max width for resizing. */ var setMinHeight = "40px"; /* specify min height for resizing. */ var setMinWidth = "280px"; /* Specify min width for resizing. */ /* DOM element variables. */ var promptTextarea = document.getElementById(promptTextarea); var promptPar = promptTextarea.parentElement; var parElement = promptPar.parentElement; var grandParElement = parElement.parentElement; var greatGrandParElement = grandParElement.parentElement; var textareaParent = parElement.children[0]; var formParent; /* defined later */ /*************************************SUPPORT FUNCTIONS*************************************/ /* Add style element to mark important overrides. */ var neededStyling; /* created HTML element in function */ const importantOverrideChatGPTResizePrompt = () => { neededStyling = document.createElement("style"); /* create style element */ /* insert styling for resizeablility */ neededStyling.innerHTML = ` form.w-full { width: 100% !important; } textarea#prompt-textarea { max-height: 800px !important; min-height: 100% !important; height: inherit !important; overflow: scroll !important; } form div.relative.flex.h-full.flex-1 div + div.flex.w-full.items-center { min-height: ${setMinHeight} !important; max-height: ${setMaxHeight} !important; min-width: ${setMinWidth} !important; max-width: ${setMaxWidth} !important; } `; /* add to page */ document.body.appendChild(neededStyling); }; /* Set UI parent and elements within reasonable range with timeout. */ var uiParAndAdjacentElements = 0; /* switch variable */ const setUIParAndAdjacentElements = () => { setTimeout(function() { /* ELMERS-GLUE - declared at top - select the parent holding prompt and UI elements. */ composerBackground = document.getElementById("composer-background"); if (composerBackground) { /* ELMERS-GLUE - declared at top - parent of above */ composerBackgroundPar = composerBackground.parentElement; /* style parent of ui elements and its' parents within reasonable range */ uiParAndAdjacentElements = 1; /* turn of threepeatLoop() run in main function */ /* style element */ composerBackground.style.display = "inline-block"; composerBackgroundPar.style.display = "inline-block"; composerBackgroundPar.style.width = "100%"; } }, 100); }; /* Recurse function to get top-most form element of prompt. */ const selectFormParent = (cur) => { /* HOT GLUE - depends on nesting of elements */ let curElement = cur; /* the current element in recurse */ formParent = curElement.parentElement; /* goal is form */ if (formParent.tagName == "FORM") { /* found it */ if (curState == 1) { /* if not toggled */ curState = 2; /* toggle current state */ /* get orginal width of prompt */ startingFormWidth = formParent.scrollWidth; if (formParent.innerText == "") { /* style per innerText */ grandParElement.style.width = "868px"; } else { grandParElement.style.width = Number(startingFormWidth+100) + "px"; } /* HOT-GLUE - unset max-width of form parent */ let formPar = formParent.parentElement; formPar.style.maxWidth = "unset"; /* call with state toggled for phase 2 */ selectFormParent(formParent.children[0]); } else { /* phase 2 */ /* selectFormChildIndex declared at top */ curElement = formParent.children[selectFormChildIndex].children; /* get element for resizing */ for (i = 0; i < curElement.length; i++) { if (curElement[i].children.length >= 1) { /* need this element to fit box to contents on resize */ selectedFormElement = curElement[i]; /* got it - end loop */ break; } } /* style element from above loop */ selectedFormElement.style.width = "auto"; selectedFormElement.children[0].style.width = "auto"; } } else { /* not element we're looking for - try again */ selectFormParent(formParent); } }; /* Ensure transform box was rotated. */ const ensureRotate = () => { if (parElement.style.transform == "none") { ensureRotate(); } parElement.style.transform = "rotateX(180deg)"; }; /******************************************************************************************* MAIN FUNCTION - STYLE ELEMENTS FOR RESIZE ********************************************************************************************/ function styleElementsForResizeChatGPTResizePrompt() { /* style parents within reasonable range of textarea */ grandParElement.style.transform = "rotateX(180deg)"; grandParElement.style.overflow = "auto"; grandParElement.style.resize = "both"; grandParElement.style.minHeight = "50px"; grandParElement.style.maxHeight = "100%"; grandParElement.style.minWidth = "20px"; grandParElement.style.maxWidth = "100%"; grandParElement.style.padding = "10px"; grandParElement.style.background ="rgb(244, 244, 244)"; grandParElement.style.borderRadius = "25px"; grandParElement.children[0].style.paddingLeft = "10px"; greatGrandParElement.style.minWidth = "100%"; greatGrandParElement.style.maxWidth = "100%"; greatGrandParElement.style.background = "none"; greatGrandParElement.style.display = "inline-block"; parElement.style.display = "inline-block"; parElement.style.transform = "rotateX(180deg)"; parElement.style.maxWidth = "100%"; parElement.style.height = "inherit"; parElement.style.minHeight = "95%"; promptPar.style.paddingLeft = "30px"; promptPar.style.height = "inherit"; promptTextarea.style.paddingRight = "100px"; promptTextarea.style.paddingLeft = "30px"; textareaParent.style.minHeight = "100%"; /* call support functions */ let tunrOffThreepeatLoop = 0; /* safe switch */ let threepeatLoop = function() { while (tunrOffThreepeatLoop < 10) { if (uiParAndAdjacentElements == 1) { tunrOffThreepeatLoop = 10; /* styles applied - turn off loop */ } else { tunrOffThreepeatLoop++; /* increment safe switch */ setUIParAndAdjacentElements(); /* call ui styling */ } } }; /* call threepeatLoop */ threepeatLoop(); /* add inserted style element with important overrides */ importantOverrideChatGPTResizePrompt(); /* select form element parent and style */ selectFormParent(parElement); /* ensure that the resizeable element rotates correctly */ ensureRotate(); } /* Run bookmarklet functions. */ setTimeout(function() { styleElementsForResizeChatGPTResizePrompt(); }, 100);})();
```
</details> 
</dd></dl></dd></dl>

GitHub - Alternate Row Color:
----
<dl><dd><dl><dd>

Alternate the row colors of repo directory. Activate in repo root and file viewing. Works with:

1. GitHub - Show File Size 

<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_GitHub_AlternateRowColor.js</summary><br>

Gist page for [siteSpecific_GitHub_AlternateRowColor.js](https://gist.github.com/jhauga/bb175713e395ac4135f21e7de11245a3)

```markdown
javascript:(function(){var color="aliceblue";/*<-- CHANGE IS OPTIONAL */var tableRow,tableRowLen,thead,curPage,curExtract,curUser,curRepo;var onRoot=0,tablePage=1,recurseIndex,runCompleted=0;var curDir=window.location.href,turnOff=0;var setGlobals=function(){curPage=location.host+location.pathname;if(curPage.indexOf("github.com")>-1){let checkRoleRow=document.querySelectorAll('div[role="row"]');if(curPage.indexOf("tree")>-1){if(checkRoleRow.length>=1){onRoot=1;tablePage=0;}else{onRoot=0;tablePage=1;}}else{if(checkRoleRow.length>=1){onRoot=1;tablePage=0;}else{onRoot=0;tablePage=1;}}if(onRoot==0&&tablePage==1){tableRow=document.getElementsByTagName("tr");tableRowLen=tableRow.length;}else{tableRow=document.querySelectorAll('div[role="row"]');tableRowLen=tableRow.length;}turnOff=0;}};var githubTableFunction=function(){if(turnOff==1){return;}recurseIndex=1;let alternateTableColor=function(){if(tableRow[recurseIndex]){tableRow[recurseIndex].style.backgroundColor=color;}};let recurseTableColor=function(){if(recurseIndex<=(tableRowLen-1)){if(recurseIndex%2==0){alternateTableColor();}recurseIndex+=1;setTimeout(recurseTableColor,10);}else{return;}};recurseTableColor();};var runBookmarklet=function(){console.log("Bookmarklet running:");setGlobals();if(turnOff==0){setTimeout(githubTableFunction,500);}else{return;}};runBookmarklet();var checkIfRunCompleted=function(){let curColorCount=0;let totalRows=tableRowLen-2;let evenOrOdd="odd",rowsChanged;if(totalRows%2==0){evenOrOdd="even";rowsChanged=Math.floor(totalRows/2);}else{rowsChanged=Math.floor((totalRows/2)-1);}for(i=0;i<tableRowLen;i++){if(tableRow[i].style.backgroundColor==color){curColorCount+=1;}}if(!curColorCount>=rowsChanged){console.log("Run did not complete. Retrying:");setTimeout(githubTableFunction,500);}else{console.log("Run completed:");runCompleted=1;}};var checkForChangeDir=function(){if(curDir!==window.location.href&&turnOff==0){curDir=window.location.href;runCompleted=0;runBookmarklet();}if(turnOff==0){setTimeout(checkForChangeDir,1000);}else{console.log("Bookmarklet did not run:");return;}};if(turnOff==0){if(runCompleted==0){runBookmarklet();}checkForChangeDir();}else{console.log("Bookmarklet is not running:");return;}})();
```
</details>
</dd></dl></dd></dl>

GitHub - Show File Size:
---- 
<dl><dd><dl><dd>

When viewing files in repo add a column showing file size. Activate in repo root and file viewing. Works with:

1. GitHub - Alternate Row Color

Loosely based on [stackoverflow answer](https://stackoverflow.com/questions/38675428/list-file-sizes-in-github#answer-75526865)

<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_GitHub_ShowFileSize.js</summary><br>

Gist page for [siteSpecific_GitHub_ShowFileSize.js](https://gist.github.com/jhauga/247e43f74af2f196309d5746710899ae)

```markdown
javascript:(function(){var tableRow,tableRowLen,thead,curPage,curExtract,curUser,curRepo;var sizeTH,sizeIDTH,sizeTD,sizeTDID,indexSizeID=0,fileName,unit;var onRoot=0,tablePage=1,apiRoot,curAPI,mapAPI;var firstLoad=0,curDir=window.location.href,turnOff,firstRun,fileSizeHasID,reGetAPIJSON,sessionNeedsResetting=0;if(sessionStorage.getItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize")==null){sessionStorage.setItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize","1");firstRun=sessionStorage.getItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize");let makeCheckForSessionReset=document.createElement("span");makeCheckForSessionReset.style.display="none";makeCheckForSessionReset.id="checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting";let findRightTable=document.getElementsByTagName("table");let findRightTableLen=findRightTable.length;for(i=0;i<findRightTableLen;i++){let tablePar=findRightTable[i].parentElement;if(findRightTable[i]=="div"){findRightTable[i].insertAdjacentElement("afterend",makeCheckForSessionReset);}}}else{firstRun=0;}var setGlobals=function(){curPage=location.host+location.pathname;apiRoot="https://api.github.com/repos";if(curPage.indexOf("github.com")>-1){let checkRoleRow=document.querySelectorAll('div[role="row"]');if(curPage.indexOf("tree")>-1){if(checkRoleRow.length>=1){onRoot=1;tablePage=0;}else{onRoot=0;tablePage=1;}}else{if(checkRoleRow.length>=1){onRoot=1;tablePage=0;}else{onRoot=0;tablePage=1;}}if(onRoot==0&&tablePage==1){tableRow=document.getElementsByTagName("tr");tableRowLen=tableRow.length;}else{tableRow=document.querySelectorAll('div[role="row"]');tableRowLen=tableRow.length;}turnOff=0;curExtract=curPage.substr(curPage.indexOf("/")+1);curUser=curExtract.substr(0,curExtract.indexOf("/"));curExtract=curExtract.substr(curExtract.indexOf("/")+1);if(curExtract.indexOf("/")==-1||curExtract.substr(curExtract.indexOf("/")+1).split("/").length==2){onRoot=1;if(curExtract.substr(curExtract.indexOf("/")+1).split("/").length==2){curRepo=curExtract.substr(0,curExtract.indexOf("/"));}else{curRepo=curExtract;}}else{curRepo=curExtract.substr(0,curExtract.indexOf("/"));}if(onRoot==0){curExtract=curExtract.substr(curExtract.substr(curRepo.length+1).indexOf("tree/")+((curRepo.length+1)+5));curExtract=curExtract.substr(curExtract.indexOf("/")+1);}else{curExtract="";}curAPI=apiRoot+"/"+curUser+"/"+curRepo+"/contents/"+curExtract;}else{turnOff=1;return;}};var addSizeCol=function(cur){if(turnOff==1){return;}if(firstRun!=0){console.log("Add file size bookmarklet running:");}let resetFileSize=function(){firstLoad=0;indexSizeID=0;let fileSizeHasID=0;let dataFileSize=document.querySelectorAll("data-file-size");let dataFileSizeLen=dataFileSize.length;for(r=0;r<dataFileSizeLen;r++){let curdataFileSize=dataFileSize[r].id;if(curdataFileSize.indexOf("fileSize-__-unlikely-name-__-fileSize")>-1){fileSizeHasID=1;let curindexSizeID=document.getElementById(curdataFileSize);curindexSizeID.remove();}else{continue;}}reGetAPIJSON=async function(api){let a=await fetch(api);let b=await a.text();let c=await JSON.parse(b);let d=await addSizeCol(c);};};let repoRoot=function(curI){if(tableRow[curI]&&tableRow[curI].hasChildNodes()){sizeTD=document.createElement("div");sizeTD.style.margin="0 60px";sizeTD.style.width="10%";tableRow[curI].children[1].style.width="35%";if(tableRow[curI].children.length>1&&tableRow[curI].children[1]){if(tableRow[curI].innerHTML.indexOf('aria-label="Directory"')==-1){sizeTD.dataset.fileSize="1";fileName=tableRow[curI].children[1].innerText;for(j in cur){if(cur[j].name==fileName){sizeTD.innerText=cur[j].size<1024?cur[j].size+" B":(cur[j].size<1048576?(unit=" KiB",cur[j].size/=1024):cur[j].size<1073741824?(unit=" MiB",cur[j].size/=1048576):(unit=" GiB",cur[j].size/=1073741824),cur[j].size.toFixed(1)+unit);}}sizeTD.id="fileSize-__-unlikely-name-__-fileSize"+indexSizeID;indexSizeID++;}else{sizeTD.innerText="";}tableRow[curI].children[1].insertAdjacentElement("afterend",sizeTD);}}};for(i=0;i<tableRowLen;i++){if(i==0){if(tablePage==1){if(firstLoad==0){let checkTHID=document.getElementById("sizeCol--__-unlikely_-_name-__--sizeCol");if(!checkTHID){sizeTH=document.createElement("th");sizeTH.innerHTML="Size";sizeTH.style.width="10%";sizeTH.id="sizeCol--__-unlikely_-_name-__--sizeCol";tableRow[i].children[1].insertAdjacentElement("afterend",sizeTH);tableRow[i].children[1].style.width="30%";}}}else{repoRoot(i);}}else{if(i==1){if(tablePage==1){if(firstLoad==0){tableRow[i].children[0].setAttribute("colspan","4");firstLoad=1;}else{resetFileSize();if(fileSizeHasID==1){setTimeout(function(){setGlobals();},500);if(turnOff==0){setTimeout(function(){reGetAPIJSON(curAPI);},1000);}break;}}}else{if(firstLoad==0){repoRoot(i);}else{resetFileSize();if(fileSizeHasID==1){setTimeout(function(){setGlobals();},500);if(turnOff==0){setTimeout(function(){reGetAPIJSON(curAPI);},1000);}break;}}}}else{if(tablePage==1){sizeTD=document.createElement("td");if(tableRow[i]&&tableRow[i].hasChildNodes()){if(tableRow[i].children.length>1&&tableRow[i].children[1]){if(tableRow[i].innerText.indexOf("(Directory)")==-1){sizeTD.dataset.fileSize="1";fileName=tableRow[i].children[1].innerText;for(j in cur){if(cur[j].name==fileName){sizeTD.innerText=cur[j].size<1024?cur[j].size+" B":(cur[j].size<1048576?(unit=" KiB",cur[j].size/=1024):cur[j].size<1073741824?(unit=" MiB",cur[j].size/=1048576):(unit=" GiB",cur[j].size/=1073741824),cur[j].size.toFixed(1)+unit);}}sizeTD.id="fileSize-__-unlikely-name-__-fileSize"+indexSizeID;indexSizeID++;}else{sizeTD.innerText="";}tableRow[i].children[1].insertAdjacentElement("afterend",sizeTD);}}}else{repoRoot(i);}}}}};var getAPIJSON=async function(api){let a=await fetch(api);let b=await a.text();let c=await JSON.parse(b);let d=await addSizeCol(c);};var runBookmarklet=function(){setGlobals();if(turnOff==0){setTimeout(function(){getAPIJSON(curAPI);},1000);}else{return;}};if(firstRun==1){runBookmarklet();}else{let checkIfSessionNeedsResetting=document.getElementById("checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting");if(!checkIfSessionNeedsResetting){sessionNeedsResetting=1;}}var checkForChangeDir=function(){if(curDir!==window.location.href&&turnOff==0){curDir=window.location.href;runBookmarklet();}if(turnOff==0){setTimeout(checkForChangeDir,1000);}else{console.log("Add file size bookmarklet did not run:");return;}};if(sessionNeedsResetting==1){sessionNeedsResetting=0;sessionStorage.removeItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize");firstRun=1;runBookmarklet();}if(turnOff==0){checkForChangeDir();}else{console.log("Add file size bookmarklet is not running:");return;}})();
```
</details>
</dd></dl></dd></dl>

Gmail - Style Sponsored Email: 
----
<dl><dd><dl><dd>

Use this bookmarklet to get contrast between regular emails and sponsored emails in gmail <br><br>

<!------------------------------------------
getting contrast between regular emails and sponsored emails in gmail. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>siteSpecific_Gmail_StyleSponsoredEmail.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_Gmail_StyleSponsoredEmail.js](https://gist.github.com/jhauga/98f86d2bab59a2a9618644cf598077ce)

```markdown
javascript:(function() { /* Define and declare globals in config variables. */ var rowTextGmailSponsored = "Sponsored"; var backgroundStyleGmailSponsoredEmail = "rgba(240,128,128,.1)"; /* Keeps recursive styling going. */ var switchVariableGmailSponsorStyle = 0; var sponsorsPositionedAtTopStyleGmailSponsoredEmail = 0; /* Will be used later. */ var focalElementGmailSponsorStyle; var sponsorRowsMarkedStyleGmailSponsoredEmail; var checkRowsMarkedStyleGmailSponsoredEmail; /* Define table rows for potential styling. */ var trGmailStyleSponsoredEmail = document.getElementsByTagName("tr"); var trGmailStyleSponsoredEmailLen = trGmailStyleSponsoredEmail.length; /******************************************************************************** * MAIN FUNCTION * * Styles the table row if marked "Sponsored". * *********************************************************************************/ function styleSponsorRowsStyleSponsorEmail(recur) { if (recur == undefined) { recur = 0; } /* run as normal */ /* local nested function to recurse parent elements */ let toTop = (par) => { if (par.tagName =="TBODY") { /* insert sponsors at top */ par.insertAdjacentElement("afterbegin", focalElementGmailSponsorStyle); /* mark top rows so recurse repeats when changed */ focalElementGmailSponsorStyle.dataset.markSponsor = 1; } else { /* go to next parent element */ toTop(par.parentElement); } }; /* running idel */ if (recur == 1) { checkRowsMarkedStyleGmailSponsoredEmail = /* select number of marked rows */ document.querySelectorAll("[data-mark-sponsor]").length; } else { /* run marking rows and adding data attribute for recures toggling */ for (i = 0; i < trGmailStyleSponsoredEmailLen; i++) { if (trGmailStyleSponsoredEmail[i] && /* enusre loaded correct */ trGmailStyleSponsoredEmail[i].innerText.indexOf(rowTextGmailSponsored) > -1) { trGmailStyleSponsoredEmail[i].style.background = /* use config var above */ backgroundStyleGmailSponsoredEmail; focalElementGmailSponsorStyle = /* define declared var above */ trGmailStyleSponsoredEmail[i]; /* call local function to main function */ if ( /* if no data marker */ focalElementGmailSponsorStyle.hasAttribute("data-mark-sponsor") == false) { toTop(focalElementGmailSponsorStyle.parentElement); /* place element at top */ } } else { /* no need to do anything */ let skip; } if (i >= Number(trGmailStyleSponsoredEmailLen-1)) { /* end recursion */ switchVariableGmailSponsorStyle = 1; sponsorRowsMarkedStyleGmailSponsoredEmail = /* select number of marked rows */ document.querySelectorAll("[data-mark-sponsor]").length; } } } } /***** Support functions. *****/ const toggleSwitchVarGmailStyleSponsoredEmail = () => { let theTables = document.getElementsByTagName("table"); let mailTable = theTables[Number(theTables.length-1)]; let firstRow = mailTable.getElementsByTagName("tr"); /* condition to toggle switches cand check for row changes */ if (switchVariableGmailSponsorStyle == 0) { if (firstRow[0].hasAttribute("data-mark-sponsor")) { sponsorsPositionedAtTopStyleGmailSponsoredEmail = 1; } else { sponsorsPositionedAtTopStyleGmailSponsoredEmail = 0; /* rows have changed */ switchVariableGmailSponsorStyle = 0; /* continues recurse */ } } }; /* repeats main or support functions */ const recurseGmailStyleSponsoredEmail = (idle) => { if (idle == undefined) { idle = "no"; } /* runs doing something */ /* status check */ console.log("running"); if (sponsorsPositionedAtTopStyleGmailSponsoredEmail == 0) { if (idle == "no") { /* Call main function */ styleSponsorRowsStyleSponsorEmail(); /* Recurse to style if sponsors change. */ toggleSwitchVarGmailStyleSponsoredEmail(); } else { /* keep recurse running */ if (checkRowsMarkedStyleGmailSponsoredEmail == sponsorRowsMarkedStyleGmailSponsoredEmail) { styleSponsorRowsStyleSponsorEmail(1); recurseGmailStyleSponsoredEmail(1); } else { recurseGmailStyleSponsoredEmail(); } } } else { if (switchVariableGmailSponsorStyle == 0 && /* both switches are off */ sponsorsPositionedAtTopStyleGmailSponsoredEmail == 0 ) { /* call recurse again */ recurseGmailStyleSponsoredEmail(); } else { /* reset turning switches off */ switchVariableGmailSponsorStyle = 0; sponsorsPositionedAtTopStyleGmailSponsoredEmail = 0; /* and call recurse again */ recurseGmailStyleSponsoredEmail(1); } } }; /*Make intitial call. */ recurseGmailStyleSponsoredEmail(); /* Recurse functions after initial call. */ var recurseVarGmailStyleSponsoredEmail = setInterval(function() { recurseGmailStyleSponsoredEmail(); }, 5000);})();
```
</details>
</dd></dl></dd></dl>


Google - Paste Ready Bookmark AI Response:
----
<dl><dd><dl><dd>

Bookmark the contents of a Generative AI response from Google search. Run bookmarklet, and then paste contents into new bookmark. <br><br>

<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_Google_PasteReadyBookmarkAIResponse.js</summary><br>

<!-- YouTube Instructional

<strong>Video Demonstration for Use:</strong>

`Ctrl + click` link to view demo on YouTube [TEXT_NAME_MATCHING_FILE](YOU_TUBE_LINK)

-->
		 

Gist page for [siteSpecific_Google_PasteReadyBookmarkAIResponse.js](https://gist.github.com/jhauga/0910c78eef852fc381464db7cfae49ab)

```markdown
javascript:(function(){ var pageTitle = "Google Generative AI Bookmark"; /* OPTIONAL - Change title. */ var answerDiv = document.getElementsByClassName("UxeQfc"); /* HOT-GLUE - classname holding answer HTML */ var answerDivHTML = answerDiv[0].innerHTML; /* One element with class name "CAYQBw" */ var pageStyle = `<style> /* USER EDITED *//******************************/:root { --m3c1: #0b57d0; --m3c2: rgba(247, 248, 249, 0.5); --m3c3: #fff; --m3c5: #f4f6f7; --m3c6: #f7f8f9; --m3c7: #ecedee; --m3c9: #1f1f1f; --m3c10: #5e5e5e; --m3c11: #474747; --m3c12: #1a0dab; --m3c13: #a3c9ff; --m3c14: #001d35; --m3c15: #0b57d0; --m3c16: #5e5e5e; --m3c17: #d2d2d2; --m3c18: #446eff; --m3c19: #b1c5ff; --m3c20: #c8ecff; --m3c21: #a6c8ff; --m3c22: #ecedee; --m3c23: #3179ed;}/* Hide dynamic elements */div span.Txngnb,div span.wHYlTd,div span.yUTMj,div span.E80BZc,div.EYbnVe.ZpdbId,div.EYbnVe,div.WDoJJe,.ZpdbId,svg,div.n2i4Qd,.CcNe6e,button { display: none !important;}body { margin-left: 30px;}h1, h2, h3, h4, h5, h6, p { font-family: Google Sans, Roboto, Arial, sans-serif;}div.jK2eDe.ZpdbId { background: none !important; z-index: -1;}span { font-family: Google Sans, Roboto, Arial, sans-serif; font-style: normal; font-weight: 400; font-size: 18px; line-height: 24px; }code * { font-family: monospace; padding: 0px; background: transparent; }div.WaaZC { margin-top: 10px;}div.WaaZC div div div div div { background: rgba(0,0,0,.05);}div div div div div span { background-color: rgba(0,0,0,0) !important;}.hdzaWe { font-family: Google Sans, Roboto, Arial, sans-serif; position: relative}/* COPY AND PASTE FROM GOOGLE *//******************************/.LT6XE, .zNsLfb { overflow-wrap: break-word; max-width: 632px;}.a7yfkb { color: #80868b; font-style: italic}.VQ2nqe { color: #c5221f}.mFP83e, .Bkvjgc, .Uw0eSc { color: #b45908}.gZdC2c { color: #996900}.rQeGvc { color: #188038}.RWHSsb, .z9fBwb, .quIshb { color: #1967d2}.aPB6vc, .TyFvzb, .VSzkzc { color: #9334e6}.Vm8mDc, .VURuic { color: #9334e6}.Vm8mDc { font-weight: bold}.zYSUYd { display: flex; background: transparent !important; flex-direction: row; overflow: hidden; border-radius: 8px 8px 0 0}.QQjpRc { display: flex; flex-direction: row; overflow: hidden; border-radius: 0 0 8px 8px;}.FS7GEb { display: flex; flex-direction: column; flex-grow: 1; min-width: 38%; width: 80%}.FS7GEb pre { margin: 0; display: inline-grid}.FS7GEb code { font-family: monospace; display: block; padding: 16px 16px 22px; line-height: 22px; background: transparent; overflow-x: auto;}.dDrxod { height: 34px; display: flex; background-color: transparent !important; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--m3c17);}.x7ndcb { padding-left: 15px; background-color: transparent !important; display: flex; align-items: center;}.hqI3tf { background: none; height: 34px; border: none; position: relative; top: 2px}</style>%60; /************************************************************* Clean up contents a bit. */ answerDivHTML = answerDivHTML.replace(/\n/g, "<br>"); answerDivHTML = answerDivHTML.replace(/\"/g, '&#92;&quot;'); answerDivHTML = answerDivHTML.replace(/"/g, '\"'); answerDivHTML = answerDivHTML.replace(/\'/g, "&#92;&apos;'"); answerDivHTML = answerDivHTML.replace(/'/g, "'"); answerDivHTML = answerDivHTML.replace(/([ ]{2,})/g, "<br>$1"); answerDivHTML = answerDivHTML.replace(/%/g, "\\%"); /************************************************************* Make bookmarklet with answer bookmarked. */ var copiedAnswer = 'javascript:(function() {document.write("' + /* write html head content */ "<!DOCTYPE HTML><html><head><title>" + pageTitle + "</title>" + /* add style */ pageStyle + /* close head html and start body of page */ "</head><body><h1>Google Generative AI</h1><hr>" + /* sidebarlink to original answer */ '<h3>Google Generative AI Bookmark</h3>' + /* output copied content */ answerDivHTML + /* close html */ "</body></html>" + /* close bookmarklet */ '");})()'; /************************************************************* Remove unwanted escaped double quotes. */ copiedAnswer = copiedAnswer.replace(/&#92;&quot;/g, '\\\"'); /************************************************************* Mind delay to ensure all is copied. */ alert("Wait 1 seconds to ensure all of the answer " + "\n is copied to clipboard."); /************************************************************* Copy to clipboard to make new bookmark */ setTimeout(function() { /* Use current answer in new bookmarkelet */ navigator.clipboard.writeText(copiedAnswer); /* that will write out HTML to page. */ }, 1000); /* Copy HTML to clipboard after 1 second. */})();
```
</details>
</dd></dl></dd></dl>

OctoPrint - Change Graph Image:
----
<dl><dd><dl><dd>

Change or remove the main image displayed in the graph when using [OctoPrint](https://github.com/OctoPrint/OctoPrint). If uses as is then image is removed.

<strong>IMPORTANT NOTE</strong> - this has only been tested via Unix like OS (Raspberry Pi)
and has not been tested using OctoPrint via OctoPi OS. 

<strong>USE - ready to use</strong>

<strong>USE - optional 1 change(s)</strong>
 
<details>

<summary>siteSpecific_OctoPrint_ChangeGraphImage.js</summary><br>

<strong>Optional \(x1\)</strong> 

<strong>NOTE</strong> - this assumes you have access to the OS OctoPrint is installed on via ssh or a GUI.

 1. Change the ``img`` variable to the image name put in "img" folder \(<em>see text/video below for details</em>\).
    - Starting at the user's folder navigate to ".octoprint/generated/webassets".
    - Make a new directory called "img".
    - Store images to use for background here.
    
<strong>Video Demonstration for Optional Use:</strong>

`Ctrl + click` link to view demo on YouTube [OctoPrint - Change Graph Image Demo](https://youtu.be/Fb8SSQmgs4Y)


Gist page for [siteSpecific_OctoPrint_ChangeGraphImage.js](https://gist.github.com/jhauga/f853e5427458c9e065695e32e4a8ed4f)

```markdown
javascript:(function(){var img="CHANGE_IMAGE";/* NAME and EXTENSION i.e. pic.jpg */var graph=document.getElementById("temperature-graph");if(img==0||img=="CHANGE_IMAGE"||img==""||img=="0"){graph.style.background="none";}else{graph.style.background="url(/static/webassets/img/"+img+") no-repeat center";}})();
```
</details>
</dd></dl></dd></dl>

Stackoverflow - Add Answer Anchor Links: 
----
<dl><dd><dl><dd>

Add a button to extract an answers id and add to address bar as if clicking an anchor link. Adds button to bottom of voting area for all answers. Use to easily bookmark a StackOverflow answer. <br><br>

<strong>USE - ready to use</strong>

<details>

<summary>siteSpecific_Stackoverflow_Add_Answer_Anchor_Links.js</summary><br>

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_Stackoverflow_Add_Answer_Anchor_Links.js](https://gist.github.com/jhauga/4cb77c8ca7966c63e23f6f13db316ea1)

```markdown
javascript:(function() {var answers = document.getElementsByClassName("answer"); var answersLen = answers.length; var votingContainer; for (i = 0; i < answersLen; i++) {votingContainer = answers[i].getElementsByClassName("js-voting-container")[0]; let anchorButton = document.createElement("a"); anchorButton.innerHTML = "| # |"; anchorButton.setAttribute("href", "#"+answers[i].id); anchorButton.style.marginTop = "10px"; anchorButton.style.marginLeft = "12px"; anchorButton.style.color = "gray"; votingContainer.insertAdjacentElement("beforeend", anchorButton);} })();
```
</details>
</dd></dl></dd></dl>

Stackoverflow - Copy Answer Anchor Links: 
----
<dl><dd><dl><dd>

Add a button to extract an answers id, adding it to address bar as anchor link, and copy full url to the clipboard. dds button to bottom of voting area for all answers. Use to easily bookmark and reference a StackOverflow answer.  <br><br>

<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_Stackoverflow_Copy_Answer_Anchor_Links.js</summary><br>
		 
Gist page for [siteSpecific_Stackoverflow_Copy_Answer_Anchor_Links.js](https://gist.github.com/jhauga/80fa99670b2d27c373e11e485ba451bd)

```markdown
javascript: (function () { var answers = document.getElementsByClassName("answer"); var answersLen = answers.length; var votingContainer; for (i = 0; i < answersLen; i++) { votingContainer = answers[i].getElementsByClassName("js-voting-container")[0]; let anchorButton = document.createElement("a"); anchorButton.innerHTML = "| # |"; anchorButton.setAttribute("href", "#" + answers[i].id); anchorButton.style.marginTop = "10px"; anchorButton.style.marginLeft = "12px"; anchorButton.style.color = "gray"; votingContainer.insertAdjacentElement("beforeend", anchorButton); anchorButton.addEventListener("click", function() { setTimeout(function() { navigator.clipboard.writeText(anchorButton.href); }, 100); }); }})();
```
</details>
</dd></dl></dd></dl>

YouTube - Add Time Marks
----
<dl><dd><dl><dd>

Add time marks to current video, creating links with value of marked time. When click video will open in new tab at tim indicated in link. Works with:

1. YouTube - Take Video Notes


<strong>Add Time Mark</strong> - ` Ctrl + m `.<br>


<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_YouTube_AddTimeMarks.js</summary><br>


Gist page for [siteSpecific_YouTube_AddTimeMarks.js](https://gist.github.com/jhauga/98fa9a1b56811c1d65751de76fce2f02)

```markdown
javascript:(function(){ /* OPTIONAL - set to 0 or delete to turn off instruction pop-up. */ var alertWithInstructions = 1; /* Global DOM variables */ var bookmarkletAreaID = /* parent for bookmarklet elements */ document.getElementById("bookmarkletArea"); var aboveTheFold = /* html after vidoe box */ document.getElementById("above-the-fold"); var player = /* video player topmost parent */ document.getElementById("player"); var playButton = /* play button - needed to update time mark */ document.getElementsByClassName("ytp-play-button"); var currentTimeClassName = /* class element with current time */ "ytp-time-current"; var curTimeElement; /* redefined to get time mark */ var timePreCal, timeSecCal; /* redefined - time mark in seconds and time mark */ /* Global configuration variables */ var ignoredDOMElements = /* stop function if one of these is active */ ["comments", "search", "contenteditable-root", "player"]; /* CSS style sheet */ { var bookmarkletCSS = ` /* style note area with constant styles */ div#bookmarkletArea { display: inline-flex; flex-wrap: nowrap; position: relative; top: 0px; width: 100%; } div#bookmarkletArea div { display: inline-block; position: relative; max-width: 800px; width: auto !important; left: 0px; } /* style time mark area */ span#timeMarkButtonArea { box-sizing: border-box; display: inline-block; position: relative; float: left; max-width: 750px; width: auto; height: 100%; border-radius: 10px; margin-left: 10px; padding: 5px; background: rgba(0, 0, 0, .025); } /* style close and time mark button parent */ span#timeMarkButtonArea div:first-of-type { display: inline; } span#timeMarkButtonArea div { display: inline-block; } /* style time mark buttons with constant styles */ span#timeMarkButtonArea a { box-sizing: border-box !important; display: inline-flex !important; position: relative; flex-wrap: wrap !important; top: 0px !important; left: unset !important; cursor: pointer; width: auto; height: 25px; border-radius: 3px; margin-left: 10px; margin-top: 3px; padding: 5px 10px 10px; background: rgba(40, 40, 40, .85); color: white; text-decoration: none; } span#timeMarkButtonArea a:hover { background: rgba(40, 40, 40, 1); } /* style close time mark buttons with constant styles */ span[id^="closeTimeMarkBtn"] { padding-left: 3px; padding-right: 3px; margin-left: 20px; border-left: 1px solid black; border-bottom: 1px solid black; border-width: medium; }`; } /* Bookmarklet box setup. */ var bookmarkletTextArea, bookmarkletArea; /* Ensure there are no duplicates of bookmarkletID. */ if (!bookmarkletAreaID) { /* are for bookmarklets */ bookmarkletArea = document.createElement("div"); bookmarkletArea.id = "bookmarkletArea"; /* insert bookmarklet area */ aboveTheFold.insertAdjacentElement("beforebegin", bookmarkletArea); let bookmarkletStyle = /* using bookmarkletCSS from above */ document.createElement("style"); bookmarkletStyle.textContent = /* add css properties */ bookmarkletCSS; bookmarkletArea.insertAdjacentElement("beforebegin", bookmarkletStyle); bookmarkletAreaID = document.getElementById("bookmarkletArea"); } /********************************************************************************** MAIN FUNCTION *********************************************************************************/ function keypressToBookmarklet() { let activeID = document.activeElement.id; let lastKeyPress; /* used to check for key combos */ lastKeyPress = sessionStorage.getItem("lastKeyPress"); /* for first key press */ if (lastKeyPress == null) { sessionStorage.setItem("lastKeyPress", event.key); lastKeyPress = sessionStorage.getItem("lastKeyPress"); } /* store key press and check active element */ let currentKeyPress = event.key; /****************************************************************** start conditions to activate bookmarklet box or run function accordingly if any of these elements have focus: ["comments", "search", "contenteditable-root", "player"] then don't take bookmarklets - bookmarklet - variable defined at start *******************************************************************/ for (i in ignoredDOMElements) { if (activeID == ignoredDOMElements[i]) { /* quit function */ return; } } /*** else ***/ { /* the active element is not in ignored list, run function */ let checkKeyCombo = /* check for combos */ lastKeyPress + "+" + currentKeyPress; /* check key combos and run function accordingly */ if (checkKeyCombo == "Control+m") { updateCurrentTime(); markTime(); } } /* store key press for next key combo check */ sessionStorage.setItem("lastKeyPress", event.key); } /***** SUPPORT FUNCTIONS *****/ /* Insert the link with value of current time mark. */ const updateCurrentTime = () => { /* update HTML element holding time value */ let playButtonData = playButton[0].dataset.titleNoTooltip; /* keep paused video paused */ if (playButtonData != "Play") { playButton[0].click(); playButton[0].click(); } /* update time value HTML element */ curTimeElement = /* select element with current time */ document.getElementsByClassName(currentTimeClassName); /* insert the time value where keypress occurred */ curTimeElementText = curTimeElement[0].textContent; /* extract time and calculate in seconds */ timePreCal = curTimeElementText.split(":"); }; /* Add time mark button to the right of textarea. */ const markTime = () => { if (timePreCal.length == 3) { /* not handling videos over 24 hours - no */ timeSecCal = Number(Number(timePreCal[0]*60) * 60) + /* hours to seconds */ Number(timePreCal[1]*60) + /* minutes to seconds */ Number(timePreCal[2]); /* seconds */ } else if (timePreCal.length == 2) { timeSecCal = Number(timePreCal[0]*60) + /* minutes to seconds */ Number(timePreCal[1]); /* seconds */ } else if (timePreCal.length == 1) { timeSecCal = Number(timePreCal[0]); /* seconds */ } let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); let timeMarkButtonArea; /* don't duplicate parent container */ if (!timeMarkButtonAreaID) { /* create area for time mark buttons */ let timeMarkDiv = /* parent for time mark box */ document.createElement("div"); timeMarkButtonArea = /* time mark box - parent for timemarks */ document.createElement("span"); timeMarkButtonArea.id = "timeMarkButtonArea"; /* insert time mark box parent div */ bookmarkletAreaID.insertAdjacentElement("afterbegin", timeMarkDiv); /* insert time mark box */ timeMarkDiv.insertAdjacentElement("afterbegin", timeMarkButtonArea); } /* give each mark id with time appended */ let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCal); let curTimeMarkBtn; /* don't duplicate time marks */ if (!curTimeMarkBtnID) { /* create time mark buttons */ let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); /* CREATE AND ADD CLOSE TIME MARK BUTTONS ***************************************/ /* parent of close and time mark button */ let timeMarkBtn = document.createElement("div"); /* insert parent of close and time mark button */ timeMarkButtonAreaID.insertAdjacentElement("beforeend", timeMarkBtn); curTimeMarkCloseBtn = /* enable time marks to be removed */ document.createElement("span"); curTimeMarkCloseBtn /* give each a unique data attribute */ .id = "closeTimeMarkBtn" + timeSecCal; curTimeMarkCloseBtn /* style close btn - give pointers hover effect */ .style.cursor = "pointer"; curTimeMarkCloseBtn /* style close btn - give font-size */ .style.fontSize = "small"; curTimeMarkCloseBtn /* add mouse event - mouse over to style text */ .addEventListener( "mouseover", function() { this.style.fontWeight = "bold"; this.style.fontSize = "medium"; }); curTimeMarkCloseBtn /* add mouse event - mouse out to style text */ .addEventListener( "mouseout", function() { this.style.fontWeight = "initial"; this.style.fontSize = "small"; }); curTimeMarkCloseBtn /* add click event - remove time mark and this */ .addEventListener( "click", function() { this.parentElement.remove(); /* removes all elements of time mark button */ }); curTimeMarkCloseBtn /* give close symbol as string - x */ .innerText = "x"; /* insert close time mark button */ timeMarkBtn.insertAdjacentElement("afterbegin", curTimeMarkCloseBtn); /* CREATE AND ADD TIME MARK BUTTONS ********************************************/ curTimeMarkBtn = /* time mark linking tom marked times */ document.createElement("a"); curTimeMarkBtn.id = /* give each a unique id */ "timeMarkBtn" + timeSecCal; /* open link in new tab to keep existing time marks */ curTimeMarkBtn.target = "_blank"; curTimeMarkBtn.addEventListener("click", function() { let playButtonData = playButton[0].dataset.titleNoTooltip; if (playButtonData != "Play") { playButton[0].click(); } }); let vidURL = location.href; /* extract current url */ /* conditions if url did not already have time value */ if (vidURL.indexOf("&t=") > -1) { /* had time value */ vidURL = vidURL.replace(/t=[0-9]+/, "t=" + timeSecCal); } else { /* no time value */ vidURL = vidURL + "&t=" + timeSecCal + "s"; } /* add url of video with marked time */ curTimeMarkBtn.href = vidURL; /* use hour : minutes: seconds */ for (i in timePreCal) { if (i == Number(timePreCal.length-1)) { if (Number(timePreCal.length-1) == 0) { curTimeMarkBtn.innerText = "0:" + timePreCal[i]; } else { curTimeMarkBtn.innerText += timePreCal[i]; } } else { curTimeMarkBtn.innerText += timePreCal[i] + ":"; } } /* insert timemark button in timemark area */ timeMarkBtn.insertAdjacentElement("beforeend", curTimeMarkBtn); } }; /* Listen form key combo to mark time. */ const addKeyDown = () => { document.body.addEventListener("keydown", function() { keypressToBookmarklet(); }); }; /****************************************************************** Listen for keydonw event, running main function and add time mark if the keyboard input is "Ctrl + m". *******************************************************************/ addKeyDown(); /* Add alert event so that instructions for use are communicated. */ if (alertWithInstructions != undefined && alertWithInstructions == 1) { alert( "Press 'Ctrl + m' to add time marks. \n\n" + "Clicking on time mark will open video at " + "the specified time in new tab." ); }})();
```
</details>
</dd></dl></dd></dl>

YouTube - Darken Bottom Controls: 
----
<dl><dd><dl><dd>

Darken the bottom controls of a YouTube video when the video has a constant light background. <br><br>

<!------------------------------------------
Darken the bottom controls of a YouTube video when the video has a constant light background.. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>siteSpecific_YouTube_DarkenBottomControls.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_DarkenBottomControls.js](https://gist.github.com/jhauga/b0405d62454e073d9512cbb20d1399ef)

```markdown
javascript:(function() { /* Simple process; select body, make style element, add CSS rules, and insert. */ var videoPageBodyElement = document.getElementsByTagName("body"); /* Create an HTML style tag to insert into page. */ var styleVideoBottomControls = document.createElement("style"); /* Make CSS rules to use for bottom controls. */ var cssVideoBottomControls = ` /* style control text */ div.ytp-time-display span { color: black; } /* style elements in controls */ div.ytp-progress-bar-container + div.ytp-chrome-controls { color: black; } /* style control icons */ div.ytp-progress-bar-container + div.ytp-chrome-controls path { fill: black; } /* style toggle */ div.ytp-autonav-toggle-button { background: black !important; }`;/* Add CSS rules to the created style tag. */styleVideoBottomControls.innerText = cssVideoBottomControls;videoPageBodyElement[0] /* insert the style tag after body element begins. */.insertAdjacentElement("afterbegin", styleVideoBottomControls);})();
```
</details>
</dd></dl></dd></dl>

YouTube - Save Page Notes to Local Storage: 
----
<dl><dd><dl><dd>

Saving notes taken of a YouTube video for later referencing or to continue notes later on unfinished video. Works with:

1. YouTube - Take Notes - **Saves notes taken**
2. YouTube - Saved Page Notes to Notebox - **Extracts and parses to notebox**


<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>siteSpecific_YouTube_SavePageNotesToLocalStorage.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_SavePageNotesToLocalStorage.js](https://gist.github.com/jhauga/1a1ab0a105b5ba616de1f2c46816a0a4)

```markdown
javascript:(function() { /* Ends bookmarklet if no notebox found. */ var noteBoxFound = 0; var noteBoxChecks = 0; /* Select current not box. */ var noteBox = document.getElementById("noteBox"); /* Check other id for noteBox - alias noteBoxTakeNotes from another bookmarklet. */ function checkForNoteBox() { if (noteBox) { /* botebox found */ noteBoxFound = 1; } else { if (noteBoxChecks >= 2) { let skip; /* do not try and redefine */ } else { /* redefine to alias from other bookmarkelt */ noteBox = document.getElementById("noteBoxTakNotes"); } } noteBoxChecks += 1; /* at 2 do not redefine */ } /* Check and see if notebox is on page. */ checkForNoteBox(); /* check for noteBox id */ if (noteBoxFound == 0) { /* check for alias id */ checkForNoteBox(); } /* If no notebox found alert and end bookmarklet. */ if (noteBoxFound == 0) { alert( "There is no notebox on current page.\n\n" + "Bookmarklet was canceled." ); return; } /* Store value of page notes. */ var noteBoxVal = noteBox.value; /* Get the url of video. */ var videoURL = location.href; /* Get the video title. */ var titlePar = document.getElementsByClassName("style-scope ytd-watch-metadata"); var videoTitle = titlePar[0].innerText.replace(/\n.*/g,""); /* Get the id holding the username. */ var username = document.getElementById("top-row"); /* Extract all text from id holding user name. */ var extractUserNameText = username.textContent; /* Clean text to only get username only. */ var usernameVal = extractUserNameText.replace(/\n/g,"") .replace(/^ {2,}(.*) {2,}(.*)subscribers(.*)$/g,"$1") .replace(/^(.*) {2,}.*$/g, "$1") .replace(/ {2,}/g,""); /* Generate name for localStorage variable. */ var storageVar = usernameVal + "--" + videoTitle; storageVar = storageVar.replace(/ {1,}/g, "-"); /* Start value of local storage with video url. */ var localStorageVal = videoURL + " --:-- \n" + noteBoxVal.replace(/\n/g, "<br>"); /* Store notes in local storage as variable formatted: usename--Video-Title */ /* Store to local storeage in browser. */ localStorage.setItem(storageVar, localStorageVal); /* Notify of localstorage property name. */ alert( "Notes taken for this page have been saved to local Storage as: \n" + storageVar );})();
```
</details>
</dd></dl></dd></dl>

YouTube - Saved Page Notes to Notebox: 
----
<dl><dd><dl><dd>

Extract saved notes taken of a YouTube video for later referencing or to continue notes later on unfinished video. Press `Ctrl + m` to add removable time marks. Works with:


1. YouTube - Save Page Notes to Local Storage - **Get Saved Notes for Video** 


<strong>NOTE</strong> - best to use `Shift` key to activate note box. <br>
To pause press `Ctrl`, `Shift`, and `Space` \(in that order\). <br><br>
<strong>Add Time Mark</strong> - ` Ctrl + m `.<br>
<strong>Copy Notes to Clipboard</strong> - ` Alt + a ` .<br>

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>siteSpecific_YouTube_SavedPageNotesToNotebox.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_SavedPageNotesToNotebox.js](https://gist.github.com/jhauga/5dfca4820e20b57b9bf97647519c2dc6)

```markdown
javascript:(function(){ /* Global DOM variables */ var noteAreaSavedPageNotesIDSavedPageNotes = /* parent for note elements */ document.getElementById("noteAreaSavedPageNotes"); var noteBoxTakNotes = /* textare element for taking notes */ document.getElementById("noteBoxTakNotes"); var closeNoteBoxSavedPageNotes = /* Close notebox element */ document.getElementById("closeNoteBoxSavedPageNotes"); var aboveTheFoldSavedPageNotes = /* html after vidoe box */ document.getElementById("above-the-fold"); var playerSavedPageNotes = /* video playerSavedPageNotes topmost parent */ document.getElementById("player"); var playButtonSavedPageNotes = /* play button - needed to update time mark */ document.getElementsByClassName("ytp-play-button"); var currentTimeClassNameSavedPageNotes = /* class element with current time */ "ytp-time-current"; /* Global configuration variables */ var ignoredKeysSavedPageNotes = /* keys pressed that do not active not box */ "Home End PageUp PageDown"; var ignoredDOMElementsSavedPageNotes = /* stop function if one of these is active */ ["comments", "search", "contenteditable-root", "player"]; /* Declare global variables that will be defined later. */ var curTimeElementSavedPageNotes, curTimeElementTextSavedPageNotes, timePreCalSavedPageNotes, timeSecCalSavedPageNotes; /* CSS style sheet */ { var noteCSSSavedPageNotes = ` /* style close elements with constant styles */ button#closeNoteBoxSavedPageNotesBtn { display: inline; position: relative; left: -5px; top: 5px; width: 25px; height: 25px; background: red; color: white; border: none; border-radius: 5px; z-index: 1; } button#closeNoteBoxSavedPageNotesBtn:hover, button#closeNoteBoxSavedPageNotesBtn:hover ~ input#closeCheckbox:hover { border: 3px solid gray; } button#closeNoteBoxSavedPageNotesBtn.hideNotesSavedPageNotes + div { display: none !important; } button#closeNoteBoxSavedPageNotesBtn.hideNotesSavedPageNotes + div + div { margin-top: 20px; } /* style note area with constant styles */ div#noteAreaSavedPageNotes { display: inline-flex; flex-wrap: nowrap; position: relative; top: 0px; width: 100%; } div #noteAreaSavedPageNotes div { display: inline-block; position: relative; margin: 0px 10px; max-width: 450px; width: min-content; } div#noteAreaSavedPageNotes div+div { display: inline-block; position: relative; max-width: 800px; width: auto !important; left: 0px; } /* style note box with constant style */ textarea#noteBoxTakNotes { max-width: 450px; width: 450px; height: 100px; padding: 10px; border-radius: 10px; } /* style time mark area */ span#timeMarkButtonArea { box-sizing: border-box; display: inline-block; position: relative; float: left; max-width: 750px; width: auto; height: 100%; border-radius: 10px; margin-left: 10px; padding: 5px; background: rgba(0, 0, 0, .025); } /* style close and time mark button parent */ span#timeMarkButtonArea div:first-of-type { display: inline; } span#timeMarkButtonArea div { display: inline-block; } /* style time mark buttons with constant styles */ span#timeMarkButtonArea a { box-sizing: border-box !important; display: inline-flex !important; position: relative; flex-wrap: wrap !important; top: 0px !important; left: unset !important; cursor: pointer; width: auto; height: 25px; border-radius: 3px; margin-left: 10px; margin-top: 3px; padding: 5px 10px 10px; background: rgba(40, 40, 40, .85); color: white; text-decoration: none; } span#timeMarkButtonArea a:hover { background: rgba(40, 40, 40, 1); } /* style close time mark buttons with constant styles */ span[id^="closeTimeMarkBtn"] { padding-left: 3px; padding-right: 3px; margin-left: 20px; border-left: 1px solid black; border-bottom: 1px solid black; border-width: medium; }`; } /* Note box setup. */ { var noteTextAreaSavedPageNotes, noteAreaSavedPageNotes, noteBoxTakNotesDiv, closeNoteBoxSavedPageNotesBtn, closeCheckbox; if (!noteAreaSavedPageNotesIDSavedPageNotes) { /* are for notes */ noteAreaSavedPageNotes = document.createElement("div"); noteAreaSavedPageNotes.id = "noteAreaSavedPageNotes"; aboveTheFoldSavedPageNotes.insertAdjacentElement("beforebegin", noteAreaSavedPageNotes); let noteStyle = /* using noteCSSSavedPageNotes from above */ document.createElement("style"); noteStyle.textContent = /* add css properties */ noteCSSSavedPageNotes; noteAreaSavedPageNotes.insertAdjacentElement("beforebegin", noteStyle); noteAreaSavedPageNotesIDSavedPageNotes = document.getElementById("noteAreaSavedPageNotes"); /* note box */ noteTextAreaSavedPageNotes = document.createElement("textarea"); noteTextAreaSavedPageNotes.id = "noteBoxTakNotes"; noteBoxTakNotesDiv = document.createElement("div"); /* insert div to hold textarea */ noteAreaSavedPageNotesIDSavedPageNotes.insertAdjacentElement("afterbegin", noteBoxTakNotesDiv); /* insert textare html elements to take notes */ noteBoxTakNotesDiv.insertAdjacentElement("afterbegin", noteTextAreaSavedPageNotes); /* close buttnon */ closeNoteBoxSavedPageNotesBtn = document.createElement("button"); closeNoteBoxSavedPageNotesBtn.id = "closeNoteBoxSavedPageNotesBtn"; noteStyle.insertAdjacentElement("afterend", closeNoteBoxSavedPageNotesBtn); closeNoteBoxSavedPageNotesBtn.textContent = "X"; /* get id of button to close note area - enables this to work with timemarks */ let closeBtnIDSavedPageNotes = document.getElementById("closeNoteBoxSavedPageNotesBtn"); /* alternate close button status */ closeBtnIDSavedPageNotes.addEventListener("click", function() { if (this.textContent == "X") { this.className = "hideNotesSavedPageNotes"; /* hide note area with css rules */ this.textContent = "O"; /* switch hiding note area */ } else { this.className = ""; /* show note area with css rules */ this.textContent = "X"; /* switch to show note area */ } }); } } /* Redefine noteBoxTakNotes */ noteBoxTakNotes = document.getElementById("noteBoxTakNotes"); /***** SUPPORT FUNCTIONS *****/ /* Copy notes in textare to clipboard. */ const copyNotesSavedPageNotes = () => { noteBoxTakNotes.select(); navigator.clipboard.writeText(noteBoxTakNotes.value); }; /* Update current time - for time mark. */ const updateCurrentTime = () => { /* update HTML element holding time value */ let playButtonData = playButtonSavedPageNotes[0].dataset.titleNoTooltip; /* to keep video paused */ if (playButtonData != "Play") { playButtonSavedPageNotes[0].click(); playButtonSavedPageNotes[0].click(); } /* update time value HTML element */ curTimeElementSavedPageNotes = /* select element with current time */ document.getElementsByClassName(currentTimeClassNameSavedPageNotes); curTimeElementTextSavedPageNotes = curTimeElementSavedPageNotes[0].textContent; /* extract time and calculate in seconds */ timePreCalSavedPageNotes = curTimeElementTextSavedPageNotes.split(":"); }; /* Focus on textarea whenever keydown occurs. */ const keypressToNoteSavedPageNotes = () => { let activeID = document.activeElement.id; let lastKeyPressSavedPageNotes; /* used to check for key combos */ lastKeyPressSavedPageNotes = sessionStorage.getItem("lastKeyPressSavedPageNotes"); /* for first key press */ if (lastKeyPressSavedPageNotes == null) { sessionStorage.setItem("lastKeyPressSavedPageNotes", event.key); lastKeyPressSavedPageNotes = sessionStorage.getItem("lastKeyPressSavedPageNotes"); } /* store key press and check active element */ let currentKeyPress = event.key; /* start conditions to activate note box or run function accordingly */ /* if any of these elements have focus */ /** ignoredDOMElementsSavedPageNotes = "comments search contenteditable-root playerSavedPageNotes"; **/ /* then don't take notes - note - variable defined at start */ for (i in ignoredDOMElementsSavedPageNotes) { if (activeID == ignoredDOMElementsSavedPageNotes[i]) { /* quit function */ return; } } /* else */ { /* the active element is not in ignored list, run function */ let checkKeyCombo = /* check for combos */ lastKeyPressSavedPageNotes + "+" + currentKeyPress; /* check key combos and run function accordingly */ if (checkKeyCombo == "Control+Shift") { noteBoxTakNotes.blur(); /* out of note box */ } /* add time marker adjacent to notes */ else if (checkKeyCombo == "Control+m") { updateCurrentTime(); markTime(); } /* select and copy notes to clipboard */ else if (checkKeyCombo == "Alt+a") { copyNotesSavedPageNotes(); } else { /* only if note box is not active element */ if (activeID != "noteBoxTakNotes") { /* prevent fullscreen from occuring *//* ************************************** NOTE - THIS DOES NOT WORK ************************* if (currentKeyPress == "f") { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Esc'})); } ************************************** ***************************************/ /* USE VARIABLE FOR CONDITIONS */ let noIgnoredKeys = ignoredKeysSavedPageNotes.indexOf(event.key) == -1; let notPauseShortcut = checkKeyCombo != "Shift+ "; if (noIgnoredKeys) { if (notPauseShortcut) { noteBoxTakNotes.focus(); } } } } } /* store key press for next key combo check */ sessionStorage.setItem("lastKeyPressSavedPageNotes", event.key); }; /* Add time mark button to the right of textarea. */ const markTime = () => { noteBoxTakNotes.blur(); /* quickly deactivate note box */ noteBoxTakNotes.setAttribute("disabled", true); if (timePreCalSavedPageNotes.length == 3) { /* not handling videos over 24 hours - no */ timeSecCalSavedPageNotes = Number(Number(timePreCalSavedPageNotes[0]*60) * 60) + /* hours to seconds */ Number(timePreCalSavedPageNotes[1]*60) + /* minutes to seconds */ Number(timePreCalSavedPageNotes[2]); /* seconds */ } else if (timePreCalSavedPageNotes.length == 2) { timeSecCalSavedPageNotes = Number(timePreCalSavedPageNotes[0]*60) + /* minutes to seconds */ Number(timePreCalSavedPageNotes[1]); /* seconds */ } else if (timePreCalSavedPageNotes.length == 1) { timeSecCalSavedPageNotes = Number(timePreCalSavedPageNotes[0]); /* seconds */ } /* create time mark area and elements */ let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); let timeMarkButtonArea; /* don't duplicate parent container */ if (!timeMarkButtonAreaID) { /* create area for time mark buttons */ let timeMarkDiv = /* parent for time mark box */ document.createElement("div"); timeMarkButtonArea = /* time mark box - parent for timemarks */ document.createElement("span"); timeMarkButtonArea.id = "timeMarkButtonArea"; /* insert time mark box parent div */ noteBoxTakNotesDiv.insertAdjacentElement("afterend", timeMarkDiv); /* insert time mark box */ timeMarkDiv.insertAdjacentElement("afterbegin", timeMarkButtonArea); } /* give each mark id with time appended */ let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCalSavedPageNotes); let curTimeMarkCloseBtn, curTimeMarkBtn; /* don't duplicate time marks */ if (!curTimeMarkBtnID) { /* create time mark buttons */ let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); /* CREATE AND ADD CLOSE TIME MARK BUTTONS ***************************************/ /* parent of close and time mark button */ let timeMarkBtn = document.createElement("div"); /* insert parent of close and time mark button */ timeMarkButtonAreaID.insertAdjacentElement("beforeend", timeMarkBtn); curTimeMarkCloseBtn = /* enable time marks to be removed */ document.createElement("span"); curTimeMarkCloseBtn /* give each a unique data attribute */ .id = "closeTimeMarkBtn" + timeSecCalSavedPageNotes; curTimeMarkCloseBtn /* style close btn - give pointers hover effect */ .style.cursor = "pointer"; curTimeMarkCloseBtn /* style close btn - give font-size */ .style.fontSize = "small"; curTimeMarkCloseBtn /* add mouse event - mouse over to style text */ .addEventListener( "mouseover", function() { this.style.fontWeight = "bold"; this.style.fontSize = "medium"; }); curTimeMarkCloseBtn /* add mouse event - mouse out to style text */ .addEventListener( "mouseout", function() { this.style.fontWeight = "initial"; this.style.fontSize = "small"; }); curTimeMarkCloseBtn /* add click event - remove time mark and this */ .addEventListener( "click", function() { this.parentElement.remove(); /* removes all elements of time mark button */ }); curTimeMarkCloseBtn /* give close symbol as string - x */ .innerText = "x"; /* insert close time mark button */ timeMarkBtn.insertAdjacentElement("afterbegin", curTimeMarkCloseBtn); /* CREATE AND ADD TIME MARK BUTTONS ********************************************/ let closeTimeBtn = /* get id of close button to insert time mark after it */ document.getElementById("closeTimeMarkBtn" + timeSecCalSavedPageNotes); curTimeMarkBtn = /* time mark linking tom marked times */ document.createElement("a"); curTimeMarkBtn.id = /* give each a unique id */ "timeMarkBtn" + timeSecCalSavedPageNotes; /* open link in new tab - _blank */ curTimeMarkBtn.target = "_blank"; let vidURL = location.href; /* extract current url */ /* conditions if url did not already have time value */ if (vidURL.indexOf("&t=") > -1) { /* had time value */ vidURL = vidURL.replace(/t=[0-9]+/, "t=" + timeSecCalSavedPageNotes); } else { /* no time value */ vidURL = vidURL + "&t=" + timeSecCalSavedPageNotes + "s"; } curTimeMarkBtn.href = vidURL; /* use hour : minutes: seconds */ for (i in timePreCalSavedPageNotes) { if (i == Number(timePreCalSavedPageNotes.length-1)) { if (Number(timePreCalSavedPageNotes.length-1) == 0) { curTimeMarkBtn.innerText = "0:" + timePreCalSavedPageNotes[i]; } else { curTimeMarkBtn.innerText += timePreCalSavedPageNotes[i]; } } else { curTimeMarkBtn.innerText += timePreCalSavedPageNotes[i] + ":"; } } /* insert time marked at key combo "Ctrl + m" */ timeMarkBtn.insertAdjacentElement("beforeend", curTimeMarkBtn); /* add click event to pause video if clicked and video is playing */ curTimeMarkBtn.addEventListener("click", function() { let playButtonData = playButtonSavedPageNotes[0].dataset.titleNoTooltip; if (playButtonData != "Play") { playButtonSavedPageNotes[0].click(); } }); } /* focus back on note box */ noteBoxTakNotes.removeAttribute("disabled"); noteBoxTakNotes.focus(); }; /* Begin taking notes. */ noteBoxTakNotes.focus(); /* Quickly get back to notes */ const addKeyDownSavedPageNotes = () => { document.body.addEventListener("keydown", function() { keypressToNoteSavedPageNotes(); }); }; const addKeyUpSavedPageNotes = () => { document.body.addEventListener("keyup", function() { keypressToNoteSavedPageNotes(); }); }; /* Listen for keydonw event. */ addKeyDownSavedPageNotes(); /********************************************************************************** MAIN FUNCTION *********************************************************************************/ function addSavedPageNotesToNotebox() { /* get the video title */ let titlePar = document.getElementsByClassName("style-scope ytd-watch-metadata"); let videoTitle = titlePar[0].innerText.replace(/\n.*/g,""); /* get the id holding the username */ let username = document.getElementById("top-row"); /* extract all text from id holding user name */ let extractUserNameText = username.textContent; /* clean text to only get username only */ let usernameVal = extractUserNameText.replace(/\n/g,"") .replace(/^ {2,}(.*) {2,}(.*)subscribers(.*)$/g,"$1") .replace(/^(.*) {2,}.*$/g, "$1") .replace(/ {2,}/g,""); /* generate name for localStorage variable */ let storageVar = usernameVal + "--" + videoTitle; storageVar = storageVar.replace(/ {1,}/g, "-"); /* store notes in local storage as variable formatted: usename--Video-Title */ let storedNotes = localStorage.getItem(storageVar); if (storedNotes == null || storedNotes == undefined) { alert("There are no saved notes for the current page."); } else { noteBoxTakNotes.textContent = storedNotes.replace(/<br>/g, "\n"); } } addSavedPageNotesToNotebox();})();
```
</details>
</dd></dl></dd></dl>

YouTube - Show Short Release Date: 
----
<dl><dd><dl><dd>

Quickly getting the release of a YouTube short. NOTE - after 1st scroll down and back up to get short date. <br><br>

<!------------------------------------------
Quickly getting the release of a YouTube short. NOTE - after 1st scroll down and back up to get short date. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<strong>NOTE</strong> - after 1st short has loaded, scroll down and back up, then click in white space to get release date.

<strong>NOTE</strong> - delay of 1/2 second before release date is added to top of right-most action widgets.

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>siteSpecific_YouTube_ShowShortReleaseDate.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_ShowShortReleaseDate.js](https://gist.github.com/jhauga/6924dfc7556ae2c9e2a9c6ea57231d45)

```markdown
javascript:(function() { /* OPTIONAL - alert with instructions. */ var alertInstructionsYoutTubeShortRelese = 1; /* Check if being run for first time, reloading if not as to compensate for initialization bug. */ var checkPageInitYoutTubeShortRelese = sessionStorage.getItem("initYoutTubeShortRelese"); /* See if page session initialized. */ if (checkPageInitYoutTubeShortRelese == null || checkPageInitYoutTubeShortRelese == undefined) { alert( "BOOKMARKLET HAS NOT BEEN INITIALIZED:\n\n" + "Run bookmarklet again if release date is not displayed.\n" + "NOTE - page down and back up to short for consistent results." ); sessionStorage.setItem("initYoutTubeShortRelese", "1"); window.location.reload(); return; } /* Declare global variables. */ var factoidsYoutTubeShortRelese, releaseDateYoutTubeShortRelese, actionsIDYoutTubeShortRelese, putReleaseYoutTubeShortRelese; /***********************SUPPORT FUNCTIONS***********************/ /* Define DOM global variables. *****/ const defineVarYoutTubeShortRelese = () => { /* select parent containing short description */ factoidsYoutTubeShortRelese = document.getElementsByClassName("ytwFactoidRendererHost"); /* placing before this item*/ actionsIDYoutTubeShortRelese = document.getElementById("actions"); /* get release date */ releaseDateYoutTubeShortRelese = factoidsYoutTubeShortRelese[2].textContent; }; /* Create and style HTML to hold date. *****/ const makeDateElementYoutTubeShortRelese = () => { /* create element to store release date */ putReleaseYoutTubeShortRelese = document.createElement("p"); /* make presentable */ putReleaseYoutTubeShortRelese .style.fontFamily = "Roboto"; putReleaseYoutTubeShortRelese .style.fontWeight = "bold"; putReleaseYoutTubeShortRelese .style.marginLeft = "10px"; putReleaseYoutTubeShortRelese .style.textAlign = "center"; putReleaseYoutTubeShortRelese .style.background = "rgba(0, 0, 0, .095)"; putReleaseYoutTubeShortRelese .style.borderRadius = "25px"; putReleaseYoutTubeShortRelese .style.width = "50px"; putReleaseYoutTubeShortRelese .style.height = "50px"; putReleaseYoutTubeShortRelese .style.paddingTop = "12px"; putReleaseYoutTubeShortRelese .style.boxSizing = "border-box"; putReleaseYoutTubeShortRelese .style.fontSize = "9pt"; /* Give id to remove if duplicates */ putReleaseYoutTubeShortRelese .id = "putReleaseYoutTubeShortRelese"; }; /* Add item to right of short. *************/ const addRelDateYoutTubeShortRelese = () => { actionsIDYoutTubeShortRelese .insertAdjacentElement("beforebegin", putReleaseYoutTubeShortRelese); /* Select again */ putReleaseYoutTubeShortRelese = document.getElementById("putReleaseYoutTubeShortRelese"); /* check if year is at end or beginning */ let atEndYear = /^[a-zA-Z]+ \d{5,}$/; let atStartYear = /^\d{4}.*$/; /* make easier to read */ if (atEndYear.test(releaseDateYoutTubeShortRelese)) { releaseDateYoutTubeShortRelese = /* year is at end */ releaseDateYoutTubeShortRelese.replace(/([0-9]{1,})([0-9]{4})$/g, "$1, $2"); } else if (atStartYear.test(releaseDateYoutTubeShortRelese)) { releaseDateYoutTubeShortRelese = /* year is at start */ releaseDateYoutTubeShortRelese.replace(/([0-9]{4})/g, "$1, "); } /* Put in text of short release date. */ putReleaseYoutTubeShortRelese.innerText = releaseDateYoutTubeShortRelese; }; /*************************************************************** MAIN FUNCTION ****************************************************************/ document.body.addEventListener("click", function() { /* Have to delay a bit - using one second cause - seems right. */ setTimeout(function() { /* Check id that is made to remove if already placed. */ putReleaseYoutTubeShortRelese = document.getElementById("putReleaseYoutTubeShortRelese"); /* If already placed remove. */ if (putReleaseYoutTubeShortRelese) { putReleaseYoutTubeShortRelese.remove(); defineVarYoutTubeShortRelese(); } else { defineVarYoutTubeShortRelese(); } /* Prep element to be inserted. */ makeDateElementYoutTubeShortRelese(); /* insert short release date */ addRelDateYoutTubeShortRelese(); /* Delay for half a second for content loading. */ }, 500); }); /* SHow instructions if turned on. */ if (alertInstructionsYoutTubeShortRelese == 1) { alert(` INSTRUCTIONS - YOUTUBE SHOW SHORT RELEASE DATE\n **********************************************\n\n Click any white space on page to get release date.\n NOTE - after first short has loaded, scroll down to next\n short and back up, then click white space to get current\n short's release date. `); } })();
```
</details>
</dd></dl></dd></dl>

YouTube - Stack User Playlist Feed: 
----
<dl><dd><dl><dd>

Stack the playlists in the user playlist feed as if dispaly were  block, increasing the font size a bit. <br><br>


<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_YouTube_StackUserPlaylistFeed.js</summary><br>


<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_StackUserPlaylistFeed.js](https://gist.github.com/jhauga/b2da5b4b5d639eb7d309231c4038a6a5)

```markdown
javascript:(function(){ /* Declare global variables. */ var checkPage, docBodyStackUserPlaylist, stackUserPlaylistFeed, stackUserPlaylistFeedParClass, stackUserPlaylistFeedTitleClass, stackUserPlaylistFeedImageClass, resetMarker; /* SUPPORT - DEFINE GLOBALS */ function defineVarStackUserPlaylist() { /* Used to ensure that the page is the user playlist feed. */ checkPage = location.href; /* Used later to add event listener. */ docBodyStackUserPlaylist = document.getElementsByTagName("body"); /* To check, insert, remove, or do nothing if alread inserted */ stackUserPlaylistFeed = document.getElementById("stackUserPlaylistFeed"); /* Put class names in variables for easier updating. */ /* Class of parent holding major elements. */ stackUserPlaylistFeedParClass = "yt-lockup-view-model-wiz yt-lockup-view-model-wiz--vertical yt-lockup-view-model-wiz--collection-stack-2 yt-lockup-view-model-wiz--compact"; /* Class of parent holding title elements. */ stackUserPlaylistFeedTitleClass = "yt-lockup-view-model-wiz__metadata"; /* Class of parent holding the image elements. */ stackUserPlaylistFeedImageClass = "yt-lockup-view-model-wiz__content-image"; /* Used to reset duplicated title class as to not break loop. */ resetMarker = "reset--to--title--class"; } /***************************************************************** MAIN FUNCTION *****************************************************************/ /* Select playlist elements by class using variables defined at top. */ function titleToTopStackUserPlaylistFeed() { /* main holding title and image */ let playlistStack = document.getElementsByClassName(stackUserPlaylistFeedParClass); /* title elements */ let playlistTitle = document.getElementsByClassName(stackUserPlaylistFeedTitleClass); /* image elements */ let contentImage = document.getElementsByClassName(stackUserPlaylistFeedImageClass); /* ensure the parent class is same as title class */ if (playlistTitle.length == playlistStack.length) { /* if so loop, select title, copy to top, and remove original */ for (i = 0; i < playlistStack.length; i++) { let curTitle = playlistTitle[i]; /* title */ let curImage = contentImage[i]; /* image */ /* move title to top */ curImage.insertAdjacentElement("beforebegin", curTitle); /* mark for resetting */ playlistStack[i].children[0].className += " " + resetMarker; /* remove original title */ playlistStack[i].children[2].remove(); } } /* select titles with reset mark */ let resetClassTitle = document.getElementsByClassName(resetMarker); /* loop through them */ for (i = 0; i < resetClassTitle.length; i++) { /* set class name to original class nameof title */ resetClassTitle[i] .setAttribute("class", stackUserPlaylistFeedTitleClass); } } /* Define style elements in tag to insert and make playlist block display. */ { var pageStyle = ` /* additional styling to match */ tp-yt-app-drawer { border-right: 1px solid lightgray; padding-left: 10px; } div#contents, div#contents ytd-rich-item-renderer, div#contents div.style-scope.ytd-rich-item-renderer { display: block !important; } div#contents div#content, yt-lockup-view-model.ytd-rich-item-renderer.lockup, yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz, div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__content-image, div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata, div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div h3 a span, div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata button.yt-spec-button-shape-next, div.yt-lockup-metadata-view-model-wiz__text-container, div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div { display: inline-block !important; position: relative; margin-bottom: 5px; } div#contents div#content { width: auto; margin-left: 10px; } ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer { margin: 0px;} yt-lockup-view-model.ytd-rich-item-renderer.lockup { padding: 15px 5px 10px 15px; border-top: 1px solid lightslategray; border-bottom: 2px solid lightslategray; } yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz { display: inline-block !important; width: 1500px;!i;!; }yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz { position: relative;}yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz a.yt-lockup-view-model-wiz__content-image:first-of-type { display: flex; position: relative; width: 300px;} div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__content-image { padding-bottom: 10px; padding-right: 50px; border-right: 3px solid lightslategray; } div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata { position: relative !important; margin-left: 50px; width: 100%; top: 0px; display: inline !important;!i;!; } div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div h3 a span { margin-top: 10px; padding: 0px; font-size: 24pt !important; width: 100%;!i;!; } div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata button.yt-spec-button-shape-next { top: 5px; left: 35px; padding-top: 1px; padding-bottom: 38px !important; border: 2px solid lightslategray; } div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div div.yt-content-metadata-view-model-wiz__metadata-row:first-of-type { margin-left: 0px !important; margin-top: 10px; } div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div div.yt-content-metadata-view-model-wiz__metadata-row { padding: 5px 0px; } div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div div.yt-content-metadata-view-model-wiz__metadata-row span.yt-core-attributed-string { font-size: 15pt; }yt-lockup-metadata-view-model.yt-lockup-metadata-view-model-wiz--vertical.yt-lockup-metadata-view-model-wiz--compact.yt-lockup-metadata-view-model-wiz { width: 100%;}.yt-lockup-metadata-view-model-wiz__text-container { width: 100%;}a.yt-lockup-metadata-view-model-wiz__title { width: 200%;} }%60;} /****** SUPPORT FUNCTION ******/ /* Check if page is not playlist. */ function checkForRemoveStackUserPlaylist() { if (location.href.indexOf("youtube.com/feed/playlists") == -1) { stackUserPlaylistFeed = /* redefine to remove */ document.getElementById("stackUserPlaylistFeed"); if (stackUserPlaylistFeed) { stackUserPlaylistFeed.remove(); docBodyStackUserPlaylist[0] .removeEventListener("mouseover", removeStackUserPlaylistFeed); } else { let skip; } } }/* Add element to style. */ function addStackUserPlaylistFeed() { /* if user playlist feed */ if (checkPage.indexOf("youtube.com/feed/playlists") > -1) { if (!stackUserPlaylistFeed) { /* Insert style element in HTML head if on the right page. */ let docHead = document.getElementsByTagName("head"); /* Creat style element to insert. */ let styleElement = document.createElement("style"); /* Give id to not duplicate */ styleElement.id = "stackUserPlaylistFeed"; /* Fill style element with contents form pageStyle variable. */ styleElement.innerText = pageStyle; /* Insert the style needed to stack playlist. */ docHead[0].insertAdjacentElement("beforeend", styleElement); /* Lastly call function to rearrange elements. */ titleToTopStackUserPlaylistFeed(); } else { /* Do nothing if alread inserted */ let skip; } } else { checkForRemoveStackUserPlaylist(); } } /* Call function functions to initiate bookmarklet. */ defineVarStackUserPlaylist(); addStackUserPlaylistFeed(); /* Remove on mouseover */ function removeStackUserPlaylistFeed() { defineVarStackUserPlaylist(); setTimeout(function() { if (location.href.indexOf("youtube.com/feed/playlists") > -1) { stackUserPlaylistFeed = /* redefine to remove */ document.getElementById("stackUserPlaylistFeed"); if (stackUserPlaylistFeed) { let skip; } else { addStackUserPlaylistFeed(); } } else { checkForRemoveStackUserPlaylist(); } }, 100); } /* Add event to remove if not on playlist page. */ docBodyStackUserPlaylist[0] .addEventListener("mouseover", removeStackUserPlaylistFeed);})();
```
</details>
</dd></dl></dd></dl>

You Tube - Sync Audio: 
----
<dl><dd><dl><dd>

Quickly resync video and audio are out of sync to resynchronize audio to video <br><br>

<!------------------------------------------
video and audio are out of sync to resynchronize audio to video. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>siteSpecific_YouTube_SyncAudio.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_SyncAudio.js](https://gist.github.com/jhauga/4e4b1e29e97aa5dd4383cac435331bcf)

```markdown
javascript:(function() { /* Configuration Variable - set final quality of video. */ var finalQualityYouTubeSyncAudio = "720p"; /* Select video settings by class name. */ var settingsYouTubeSyncAudio = document.getElementsByClassName("ytp-button ytp-settings-button"); /* Select menu for quality using class name. */ var menuItemYouTubeSyncAudio = document.getElementsByClassName("ytp-menuitem"); /************************************************ MAIN FUNCTION ************************************************/ /* Click by argument being found in loop. */ function changeQualityYouTubeSyncAudio(clickWhat) { /* loop all menu items found by class name */ for (i = 0; i < menuItemYouTubeSyncAudio.length; i++) { /* if text in menu item found matching argument, click */ if ( menuItemYouTubeSyncAudio[i] .textContent .indexOf(clickWhat) > -1 ) { /* menu item matches argument, click and end loop */ menuItemYouTubeSyncAudio[i].click(); break; } } } /* Start process to sync video to audio. */ const syncVideoToAudioYouTubeSyncAudio = (step) => { /* conditional steps for process */ if (step == "Quality") { /* allow a bit of delay for menu dynamics */ setTimeout(function() { /* click video settings gear icon */ settingsYouTubeSyncAudio[0].click(); }, 100); } /* run main function to sync audio, resetting video quality, */ /* allowing a bit of delay for menu dynamics */ setTimeout(function() { changeQualityYouTubeSyncAudio(step); }, 300); }; /* Select video settings icon at bottom of video. **/ syncVideoToAudioYouTubeSyncAudio("Quality"); /* Set video to 144p. **/ syncVideoToAudioYouTubeSyncAudio("144p"); /* Additional delay to ensure menu dynamics. **/ setTimeout(function() { /* Again select video settings icon at bottom of video. **/ syncVideoToAudioYouTubeSyncAudio("Quality"); /* Set final video to config var. finalQualityYouTubeSyncAudio. */ syncVideoToAudioYouTubeSyncAudio(finalQualityYouTubeSyncAudio); }, 1000);})(); 
```
</details>
</dd></dl></dd></dl>

YouTube - Take Notes and Add Removable Time Marks: 
----
<dl><dd><dl><dd>

Add note box to YouTube video and take notes on it. Just start typing. Press `Ctrl + m` to add removable time marks. <br>
<strong>NOTE</strong> - best to use `Shift` key to activate note box. <br>
To pause press `Ctrl`, `Shift`, and `Space` \(in that order\). <br><br>
<strong>Add Time Mark</strong> - ` Ctrl + m `.<br>
<strong>Copy Notes to Clipboard</strong> - ` Alt + a ` .<br>

<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_YouTube_takeNotesAndAddRemovableTimeMarks</summary><br>


<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_takeNotesAndAddRemovableTimeMarks](https://gist.github.com/jhauga/a2011b5dd50336546f8f91ee2d051de5)

```markdown
javascript:(function(){ /* Global DOM variables */ var noteAreaID = /* parent for note elements */ document.getElementById("noteArea"); var noteBox = /* textare element for taking notes */ document.getElementById("noteBox"); var closeNoteBox = /* Close notebox element */ document.getElementById("closeNoteBox"); var aboveTheFold = /* html after vidoe box */ document.getElementById("above-the-fold"); var player = /* video player topmost parent */ document.getElementById("player"); var playButton = /* play button - needed to update time mark */ document.getElementsByClassName("ytp-play-button"); var currentTimeClassName = /* class element with current time */ "ytp-time-current"; var curTimeElement; /* redefined to get time mark */ var timePreCal, timeSecCal; /* redefined - time mark in seconds and time mark */ /* Global configuration variables */ var ignoredKeys = /* keys pressed that do not active not box */ "Home End PageUp PageDown"; var ignoredDOMElements = /* stop function if one of these is active */ ["comments", "search", "contenteditable-root", "player"]; /* CSS style sheet */ { var noteCSS = ` /* style close elements with constant styles */ button#closeNoteBoxBtn { display: inline; position: relative; left: -5px; top: 5px; width: 25px; height: 25px; background: red; color: white; border: none; border-radius: 5px; z-index: 1; } button#closeNoteBoxBtn:hover, button#closeNoteBoxBtn:hover ~ input#closeCheckbox:hover { border: 3px solid gray; } input#closeCheckbox { box-sizing: content-box; display: inline-block; position: absolute; left: -5px; top: 5px; z-index: 2; opacity: 0; } input#closeCheckbox:hover { width: 20px; height: 20px; border: 2px solid gray; opacity: .25; } input#closeCheckbox:checked + div#noteArea { display: inline-flex; } input#closeCheckbox + div { display: none; } /* style note area with constant styles */ div#noteArea { display: inline-flex; flex-wrap: nowrap; position: relative; top: 0px; width: 100%; } div #noteArea div { display: inline-block; position: relative; margin: 0px 10px; max-width: 450px; width: min-content; } div#noteArea div+div { display: inline-block; position: relative; max-width: 800px; width: auto !important; left: 0px; } /* style note box with constant style */ textarea#noteBox { max-width: 450px; width: 450px; height: 100px; padding: 10px; border-radius: 10px; } /* style time mark area */ span#timeMarkButtonArea { box-sizing: border-box; display: inline-block; position: relative; float: left; max-width: 750px; width: auto; height: 100%; border-radius: 10px; margin-left: 10px; padding: 5px; background: rgba(0, 0, 0, .025); } /* style close and time mark button parent */ span#timeMarkButtonArea div:first-of-type { display: inline; } span#timeMarkButtonArea div { display: inline-block; } /* style time mark buttons with constant styles */ span#timeMarkButtonArea a { box-sizing: border-box !important; display: inline-flex !important; position: relative; flex-wrap: wrap !important; top: 0px !important; left: unset !important; cursor: pointer; width: auto; height: 25px; border-radius: 3px; margin-left: 10px; margin-top: 3px; padding: 5px 10px 10px; background: rgba(40, 40, 40, .85); color: white; text-decoration: none; } span#timeMarkButtonArea a:hover { background: rgba(40, 40, 40, 1); } /* style close time mark buttons with constant styles */ span[id^="closeTimeMarkBtn"] { padding-left: 3px; padding-right: 3px; margin-left: 20px; border-left: 1px solid black; border-bottom: 1px solid black; border-width: medium; }`; } /* Note box setup. */ var noteTextArea, noteArea, noteBoxDiv, closeNoteBoxBtn, closeCheckbox; /* don't duplicate */ if (!noteAreaID) { /* area for notes */ noteArea = document.createElement("div"); noteArea.id = "noteArea"; aboveTheFold.insertAdjacentElement("beforebegin", noteArea); let noteStyle = /* using noteCSS from above */ document.createElement("style"); noteStyle.textContent = /* add css properties */ noteCSS; noteArea.insertAdjacentElement("beforebegin", noteStyle); noteAreaID = document.getElementById("noteArea"); /* note box */ noteTextArea = document.createElement("textarea"); noteTextArea.id = "noteBox"; noteBoxDiv = document.createElement("div"); /* insert div to hold textarea */ noteAreaID.insertAdjacentElement("afterbegin", noteBoxDiv); /* insert textare html elements to take notes */ noteBoxDiv.insertAdjacentElement("afterbegin", noteTextArea); /* close buttnon */ closeNoteBoxBtn = document.createElement("button"); closeNoteBoxBtn.id = "closeNoteBoxBtn"; noteStyle.insertAdjacentElement("afterend", closeNoteBoxBtn); closeNoteBoxBtn.textContent = "X"; /* checkbox to show hide with css */ closeCheckbox = document.createElement("input"); closeCheckbox.type = "checkbox"; closeCheckbox.id = "closeCheckbox"; closeNoteBoxBtn.insertAdjacentElement("afterend", closeCheckbox); closeCheckbox = document.getElementById("closeCheckbox"); closeCheckbox.setAttribute("checked", true); /* alternate close button status */ closeCheckbox.addEventListener("click", function() { if (this.previousElementSibling.textContent == "X") { this.previousElementSibling.textContent = "O"; } else { this.previousElementSibling.textContent = "X"; } }); } /* Redefine noteBox */ noteBox = document.getElementById("noteBox"); /***** SUPPORT FUNCTIONS *****/ /* Copy notes in textare to clipboard. */ const copyNotes = () => { noteBox.select(); navigator.clipboard.writeText(noteBox.value); }; /* Focus on textarea whenever keydown occurs. */ const updateCurrentTime = () => { /* update HTML element holding time value */ let playButtonData = playButton[0].dataset.titleNoTooltip; if (playButtonData != "Play") { playButton[0].click(); playButton[0].click(); } /* update time value HTML element */ curTimeElement = /* select element with current time */ document.getElementsByClassName(currentTimeClassName); curTimeElementText = curTimeElement[0].textContent; /* extract time and calculate in seconds */ timePreCal = curTimeElementText.split(":"); }; /* Apply key combos and handle actions accordingly. */ const keypressToNote = () => { let activeID = document.activeElement.id; let lastKeyPress; /* used to check for key combos */ lastKeyPress = sessionStorage.getItem("lastKeyPress"); /* for first key press */ if (lastKeyPress == null) { sessionStorage.setItem("lastKeyPress", event.key); lastKeyPress = sessionStorage.getItem("lastKeyPress"); } /* store key press and check active element */ let currentKeyPress = event.key; /* start conditions to activate note box or run function accordingly */ /* if any of these elements have focus */ /** ignoredDOMElements = "comments search contenteditable-root player"; **/ /* then don't take notes - note - variable defined at start */ for (i in ignoredDOMElements) { if (activeID == ignoredDOMElements[i]) { /* quit function */ return; } } /* else */ { /* the active element is not in ignored list, run function */ let checkKeyCombo = /* check for combos */ lastKeyPress + "+" + currentKeyPress; /* check key combos and run function accordingly */ if (checkKeyCombo == "Control+Shift") { noteBox.blur(); /* out of note box */ } /* add time marker adjacent to notes */ else if (checkKeyCombo == "Control+m") { updateCurrentTime(); markTime(); } /* select and copy notes to clipboard */ else if (checkKeyCombo == "Alt+a") { copyNotes(); } else { /* only if note box is not active element */ if (activeID != "noteBox") { /* prevent fullscreen from occuring *//* ************************************** NOTE - THIS DOES NOT WORK ************************* if (currentKeyPress == "f") { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Esc'})); } ************************************** ***************************************/ /* USE VARIABLE FOR CONDITIONS */ let noIgnoredKeys = ignoredKeys.indexOf(event.key) == -1; let notPauseShortcut = checkKeyCombo != "Shift+ "; if (noIgnoredKeys) { if (notPauseShortcut) { noteBox.focus(); } } } } } /* store key press for next key combo check */ sessionStorage.setItem("lastKeyPress", event.key); }; /* Add time mark button to the right of textarea. */ const markTime = () => { noteBox.blur(); /* quickly deactivate note box */ noteBox.setAttribute("disabled", true); if (timePreCal.length == 3) { /* not handling videos over 24 hours - no */ timeSecCal = Number(Number(timePreCal[0]*60) * 60) + /* hours to seconds */ Number(timePreCal[1]*60) + /* minutes to seconds */ Number(timePreCal[2]); /* seconds */ } else if (timePreCal.length == 2) { timeSecCal = Number(timePreCal[0]*60) + /* minutes to seconds */ Number(timePreCal[1]); /* seconds */ } else if (timePreCal.length == 1) { timeSecCal = Number(timePreCal[0]); /* seconds */ } /* create time mark area and elements */ let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); let timeMarkButtonArea; /* don't duplicate parent container */ if (!timeMarkButtonAreaID) { /* create area for time mark buttons */ let timeMarkDiv = /* parent for time mark box */ document.createElement("div"); timeMarkButtonArea = /* time mark box - parent for timemarks */ document.createElement("span"); timeMarkButtonArea.id = "timeMarkButtonArea"; /* insert time mark box parent div */ noteBoxDiv.insertAdjacentElement("afterend", timeMarkDiv); /* insert time mark box */ timeMarkDiv.insertAdjacentElement("afterbegin", timeMarkButtonArea); } /* give each mark id with time appended */ let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCal); let curTimeMarkCloseBtn, curTimeMarkBtn; /* don't duplicate time marks */ if (!curTimeMarkBtnID) { /* create time mark buttons */ let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); /* CREATE AND ADD CLOSE TIME MARK BUTTONS ***************************************/ /* parent of close and time mark button */ let timeMarkBtn = document.createElement("div"); /* insert parent of close and time mark button */ timeMarkButtonAreaID.insertAdjacentElement("beforeend", timeMarkBtn); curTimeMarkCloseBtn = /* enable time marks to be removed */ document.createElement("span"); curTimeMarkCloseBtn /* give each a unique data attribute */ .id = "closeTimeMarkBtn" + timeSecCal; curTimeMarkCloseBtn /* style close btn - give pointers hover effect */ .style.cursor = "pointer"; curTimeMarkCloseBtn /* style close btn - give font-size */ .style.fontSize = "small"; curTimeMarkCloseBtn /* add mouse event - mouse over to style text */ .addEventListener( "mouseover", function() { this.style.fontWeight = "bold"; this.style.fontSize = "medium"; }); curTimeMarkCloseBtn /* add mouse event - mouse out to style text */ .addEventListener( "mouseout", function() { this.style.fontWeight = "initial"; this.style.fontSize = "small"; }); curTimeMarkCloseBtn /* add click event - remove time mark and this */ .addEventListener( "click", function() { this.parentElement.remove(); /* removes all elements of time mark button */ }); curTimeMarkCloseBtn /* give close symbol as string - x */ .innerText = "x"; /* insert close time mark button */ timeMarkBtn.insertAdjacentElement("afterbegin", curTimeMarkCloseBtn); /* CREATE AND ADD TIME MARK BUTTONS ********************************************/ let closeTimeBtn = /* get id of close button to insert time mark after it */ document.getElementById("closeTimeMarkBtn" + timeSecCal); curTimeMarkBtn = /* time mark linking tom marked times */ document.createElement("a"); curTimeMarkBtn.id = /* give each a unique id */ "timeMarkBtn" + timeSecCal; /* open link in new tab - _blank */ curTimeMarkBtn.target = "_blank"; let vidURL = location.href; /* extract current url */ /* conditions if url did not already have time value */ if (vidURL.indexOf("&t=") > -1) { /* had time value */ vidURL = vidURL.replace(/t=[0-9]+/, "t=" + timeSecCal); } else { /* no time value */ vidURL = vidURL + "&t=" + timeSecCal + "s"; } curTimeMarkBtn.href = vidURL; /* use hour : minutes: seconds */ for (i in timePreCal) { if (i == Number(timePreCal.length-1)) { if (Number(timePreCal.length-1) == 0) { curTimeMarkBtn.innerText = "0:" + timePreCal[i]; } else { curTimeMarkBtn.innerText += timePreCal[i]; } } else { curTimeMarkBtn.innerText += timePreCal[i] + ":"; } } /* insert time marked at key combo "Ctrl + m" */ timeMarkBtn.insertAdjacentElement("beforeend", curTimeMarkBtn); /* add click event to pause video if clicked and video is playing */ curTimeMarkBtn.addEventListener("click", function() { let playButtonData = playButton[0].dataset.titleNoTooltip; if (playButtonData != "Play") { playButton[0].click(); } }); } /* focus back on note box */ noteBox.removeAttribute("disabled"); noteBox.focus(); }; /* Begin taking notes. */ noteBox.focus(); /* Quickly get back to notes */ const addKeyDown = () => { document.body.addEventListener("keydown", function() { keypressToNote(); }); }; /* Listen for keydonw event. */ addKeyDown(); })();
```
</details>
</dd></dl></dd></dl>

YouTube - Take Video Notes: 
----
<dl><dd><dl><dd>


Take notes on a YouTube video. Press ctrl+Shift to quickly move focus out of note box. Start typing to begin taking notes. Works with:

1. YouTube - Add Time Marks


<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_YouTube_TakeVideoNotes.js</summary><br>


<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_TakeVideoNotes.js](https://gist.github.com/jhauga/d3b4f0442de3d1b72da26ae0c9cbe499)

```markdown
javascript:(function(){ /* Global DOM variables */ var noteAreaTakeNotesIDTakeNotes = /* parent for note elements */ document.getElementById("noteAreaTakeNotes"); var noteBoxTakNotes = /* textare element for taking notes */ document.getElementById("noteBoxTakNotes"); var closeNoteBoxTakeNotes = /* Close notebox element */ document.getElementById("closeNoteBoxTakeNotes"); var aboveTheFoldTakeNotes = /* html after vidoe box */ document.getElementById("above-the-fold"); var playerTakeNotes = /* video playerTakeNotes topmost parent */ document.getElementById("player"); var playButtonTakeNotes = /* play button - needed to update time mark */ document.getElementsByClassName("ytp-play-button"); var currentTimeClassNameTakeNotes = /* class element with current time */ "ytp-time-current"; /* Global configuration variables */ var ignoredKeysTakeNotes = /* keys pressed that do not active not box */ "Home End PageUp PageDown"; var ignoredDOMElementsTakeNotes = /* stop function if one of these is active */ ["comments", "search", "contenteditable-root", "player"]; /* CSS style sheet */ { var noteCSSTakeNotes = ` /* style close elements with constant styles */ button#closeNoteBoxTakeNotesBtn { display: inline; position: relative; left: -5px; top: 5px; width: 25px; height: 25px; background: red; color: white; border: none; border-radius: 5px; z-index: 1; } button#closeNoteBoxTakeNotesBtn:hover, button#closeNoteBoxTakeNotesBtn:hover ~ input#closeCheckbox:hover { border: 3px solid gray; } button#closeNoteBoxTakeNotesBtn.hideNotesTakeNotes + div { display: none !important; } button#closeNoteBoxTakeNotesBtn.hideNotesTakeNotes + div + div { margin-top: 20px; } /* style note area with constant styles */ div#noteAreaTakeNotes { display: inline-flex; flex-wrap: nowrap; position: relative; top: 0px; width: 100%; } div #noteAreaTakeNotes div { display: inline-block; position: relative; margin: 0px 10px; max-width: 450px; width: min-content; } div#noteAreaTakeNotes div+div { display: inline-block; position: relative; max-width: 800px; width: auto !important; left: 0px; } /* style note box with constant style */ textarea#noteBoxTakNotes { max-width: 450px; width: 450px; height: 100px; padding: 10px; border-radius: 10px; }`; } /* Note box setup. */ var noteTextAreaTakeNotes, noteAreaTakeNotes, noteBoxTakNotesDiv, closeNoteBoxTakeNotesBtn, closeCheckbox; if (!noteAreaTakeNotesIDTakeNotes) { /* are for notes */ noteAreaTakeNotes = document.createElement("div"); noteAreaTakeNotes.id = "noteAreaTakeNotes"; aboveTheFoldTakeNotes.insertAdjacentElement("beforebegin", noteAreaTakeNotes); let noteStyle = /* using noteCSSTakeNotes from above */ document.createElement("style"); noteStyle.textContent = /* add css properties */ noteCSSTakeNotes; noteAreaTakeNotes.insertAdjacentElement("beforebegin", noteStyle); noteAreaTakeNotesIDTakeNotes = document.getElementById("noteAreaTakeNotes"); /* note box */ noteTextAreaTakeNotes = document.createElement("textarea"); noteTextAreaTakeNotes.id = "noteBoxTakNotes"; noteBoxTakNotesDiv = document.createElement("div"); /* insert div to hold textarea */ noteAreaTakeNotesIDTakeNotes.insertAdjacentElement("afterbegin", noteBoxTakNotesDiv); /* insert textare html elements to take notes */ noteBoxTakNotesDiv.insertAdjacentElement("afterbegin", noteTextAreaTakeNotes); /* close buttnon */ closeNoteBoxTakeNotesBtn = document.createElement("button"); closeNoteBoxTakeNotesBtn.id = "closeNoteBoxTakeNotesBtn"; noteStyle.insertAdjacentElement("afterend", closeNoteBoxTakeNotesBtn); closeNoteBoxTakeNotesBtn.textContent = "X"; /* get id of button to close note area - enables this to work with timemarks */ let closeBtnIDTakeNotes = document.getElementById("closeNoteBoxTakeNotesBtn"); /* alternate close button status */ closeBtnIDTakeNotes.addEventListener("click", function() { if (this.textContent == "X") { this.className = "hideNotesTakeNotes"; /* hide note area with css rules */ this.textContent = "O"; /* switch hiding note area */ } else { this.className = ""; /* show note area with css rules */ this.textContent = "X"; /* switch to show note area */ } }); } /* Redefine noteBoxTakNotes */ noteBoxTakNotes = document.getElementById("noteBoxTakNotes"); /***** SUPPORT FUNCTIONS *****/ /* Copy notes in textare to clipboard. */ function copyNotesTakeNotes() { noteBoxTakNotes.select(); navigator.clipboard.writeText(noteBoxTakNotes.value); } /* Focus on textarea whenever keydown occurs. */ function keypressToNoteTakeNotes() { let activeID = document.activeElement.id; let lastKeyPressTakeNotes; /* used to check for key combos */ lastKeyPressTakeNotes = sessionStorage.getItem("lastKeyPressTakeNotes"); /* for first key press */ if (lastKeyPressTakeNotes == null) { sessionStorage.setItem("lastKeyPressTakeNotes", event.key); lastKeyPressTakeNotes = sessionStorage.getItem("lastKeyPressTakeNotes"); } /* store key press and check active element */ let currentKeyPress = event.key; /* start conditions to activate note box or run function accordingly */ /* if any of these elements have focus */ /** ignoredDOMElementsTakeNotes = "comments search contenteditable-root playerTakeNotes"; **/ /* then don't take notes - note - variable defined at start */ for (i in ignoredDOMElementsTakeNotes) { if (activeID == ignoredDOMElementsTakeNotes[i]) { /* quit function */ return; } } /* else */ { /* the active element is not in ignored list, run function */ let checkKeyCombo = /* check for combos */ lastKeyPressTakeNotes + "+" + currentKeyPress; /* check key combos and run function accordingly */ if (checkKeyCombo == "Control+Shift") { noteBoxTakNotes.blur(); /* out of note box */ } /* select and copy notes to clipboard */ else if (checkKeyCombo == "Alt+a") { copyNotesTakeNotes(); } else { /* only if note box is not active element */ if (activeID != "noteBoxTakNotes") { /* prevent fullscreen from occuring *//* ************************************** NOTE - THIS DOES NOT WORK ************************* if (currentKeyPress == "f") { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Esc'})); } ************************************** ***************************************/ /* USE VARIABLE FOR CONDITIONS */ let noIgnoredKeys = ignoredKeysTakeNotes.indexOf(event.key) == -1; let notPauseShortcut = checkKeyCombo != "Shift+ "; if (noIgnoredKeys) { if (notPauseShortcut) { noteBoxTakNotes.focus(); } } } } } /* store key press for next key combo check */ sessionStorage.setItem("lastKeyPressTakeNotes", event.key); } /* Begin taking notes. */ noteBoxTakNotes.focus(); /* Quickly get back to notes */ const addKeyDownTakeNotes = () => { document.body.addEventListener("keydown", function() { keypressToNoteTakeNotes(); }); }; const addKeyUpTakeNotes = () => { document.body.addEventListener("keyup", function() { keypressToNoteTakeNotes(); }); }; /* Listen for keydonw event. */ addKeyDownTakeNotes();})();
```
</details>
</dd></dl></dd></dl>

YouTube - Watch Random Video: 
----
<dl><dd><dl><dd>

Bookmarklet for when you want to watch all videos in home feed at once, and can't pick one to watch. <br><br>

<!------------------------------------------
when you want to watch all videos in home feed at once, and can't pick one to watch. Works with:

1. Focus - What it Does
-------------------------------------------->

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>siteSpecific_YouTube_WatchRandomVideo.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [siteSpecific_YouTube_WatchRandomVideo.js](https://gist.github.com/jhauga/c21475673dee3816b6ce3f9ed7fe35ec)

```markdown
javascript:(function() { /* Config variable - 1 to oepn in new tab, 0 to not. */ var openInNewTabWatchRandomVideo = 1; /* Class name of element holding link for video. */ var videoFeedWatchRandomVideo = /* HOT-GLUE - may change */ document.getElementsByClassName("yt-simple-endpoint inline-block style-scope ytd-thumbnail"); /* Length of all videos in home feed. */ var videoFeedWatchRandomVideoLen = videoFeedWatchRandomVideo.length; /* Generate random value using length. */ var randomValWatchRandomVideo = Math.floor(Math.random() * videoFeedWatchRandomVideoLen); /****************************************************************************************** MAIN FUNCTION ******************************************************************************************/ function watchRandomVideo(target) { /* Make sure video links are loaded. */ if (videoFeedWatchRandomVideo.length >= 1 && /* at least one loaded */ videoFeedWatchRandomVideo[0].hasAttribute("href") /* good guess load correctly */ ) { /* get video link */ let videoURL = videoFeedWatchRandomVideo[randomValWatchRandomVideo].href; /* watch random video */ window.open(videoURL, target); } else { /* do nothing */ let skip; } } /* Check if configured to open in new tab. */ if (openInNewTabWatchRandomVideo == 1) { /* if so, open in new tab */ watchRandomVideo("_blank"); } else { /* if not, open in current window */ watchRandomVideo("_self"); }})();
```
</details>
</dd></dl></dd></dl>

</div>

<hr><br>

# Window Bookmarklets
<div>
The below bookmarklets pertain to the browser window object, enabling user experience (<em>UX</em>) customization.

Page Offset - Custom Page Down: 
----
<dl><dd><dl><dd>

Click anywhere on a webpage with a customized page down value. Good for reading certain pages. <br><br>

<strong>USE - ready to use</strong>
<details>

<summary>window_PageOffset_CustomPageDown.js</summary><br>

Gist page for [window_PageOffset_CustomPageDown.js](https://gist.github.com/jhauga/5b5bf9e7ae170f1f412085b1005114d8)

```markdown
javascript:(function(){var pageDownBy=500;function runPageDown(y){scrollTo(0,y);}document.body.addEventListener("click",function(){pageDown=pageYOffset+pageDownBy;runPageDown(pageDown)});})();
```
</details>
</dd></dl></dd></dl>


Style - Bold Selected Text: 
----
<dl><dd><dl><dd>

Run this bookmarklet when you want to bold selected text on a webpage. Press `ctrl + b` to make the selected text bold. Works with:

1. Style - **\*\[ALL\]** Selected Text -\> *Window Bookmarklets*


<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>window_style_boldSelectedText.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [window_style_boldSelectedText.js](https://gist.github.com/jhauga/b8e11ddaf7f0fdf9e5c31dddc23b6794)

```markdown
javascript:(function() { /* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */ var alertWithInstructions_boldText = 1; /* turn instruction alert on or off */ var noPressKey_boldText = "SHIFT"; /* button to press when using with other bookmarkel */ /* Define global variables. */ var numberOfKeyPresses_boldText = 2;/* specify how many keypresses are used */ var currentStyleOpenTag_boldText = "<strong>"; /* open tag to style selection */ var currentStyleCloseTag_boldText = "</strong>"; /* close tag to style selection */ var keyCombo_boldText = "Control+b"; /* key combo to change style */ /* Declare global variables */ var range_boldText, selection_boldText, selectionParent_boldText, selectedString_boldText, parentIDWithSelectedText_boldText; /******************************* MAIN FUNCTION *******************************/ /*****************************************************************************/ var keySwitch_boldText = 0; var lastThreeKeys_boldText = []; /* enables last three key presses to be stored */ function keypressToBookmarklet_boldText(key_press) { /* keyboard combo that enablse text to be style bold */ lastThreeKeys_boldText.push(key_press); /* keep only the last three keys */ if (lastThreeKeys_boldText.length > numberOfKeyPresses_boldText) { lastThreeKeys_boldText.shift(); } /* check key combo */ if (numberOfKeyPresses_boldText == 2) { /* check if key combo is keyCombo_boldText variable */ let checkIfKeyCombo_boldText = lastThreeKeys_boldText[0] + "+" + lastThreeKeys_boldText[1]; if (checkIfKeyCombo_boldText == keyCombo_boldText) { getParentElementOfSelection_boldText(); /* get parent of selected text */ } } else if (numberOfKeyPresses_boldText == 3) { /* check if key combo is keyCombo_boldText variable */ let checkIfKeyCombo_boldText = lastThreeKeys_boldText[0] + "+" + lastThreeKeys_boldText[1] + "+" + lastThreeKeys_boldText[2]; if (checkIfKeyCombo_boldText == keyCombo_boldText) { getParentElementOfSelection_boldText(); /* get parent of selected text */ } } else { /* check if key combo is keyCombo_boldText variable */ let checkIfKeyCombo_boldText = lastThreeKeys_boldText[0]; if (checkIfKeyCombo_boldText == keyCombo_boldText) { getParentElementOfSelection_boldText(); /* get parent of selected text */ } } } /***** Support Functions: *****/ /* Get parent of selection, give it id and use it to style selected text. */ const getParentElementOfSelection_boldText = () => { /* get the current selection */ selection_boldText = window.getSelection(); if (selection_boldText.rangeCount > 0) { /* ensure something is selected */ /* prepare elements to change selection */ range_boldText = selection_boldText.getRangeAt(0); /* first object of selection */ selectionParent_boldText = range_boldText.commonAncestorContainer; /* node of selection */ let temp = document.getElementById("bm_window_style"); if (temp) { /* don't include prior global style ids */ let tempID = temp.getAttribute("id"); if (tempID == "bm_window_style") { temp.removeAttribute("id"); } else { temp.setAttribute("id", tempID.replace("bm_window_style", "")); } } selectedString_boldText = range_boldText.toString(); /* store as string */ /* ensure selection is a text node */ if (selectionParent_boldText.nodeType === 3) { /* if it is a text node */ let curPar = selectionParent_boldText.parentElement; /* store the parent element */ let outText = curPar.outerHTML; /* select all of the styled element */ let keepText = curPar.innerText; /* select only the text of styled element */ let checkIfStyleApplied = /* check if the style has already been applied */ currentStyleOpenTag_boldText.replace(/[<>]/g, "").toUpperCase(); /* account for style attributes that may be applied intemplate */ if (checkIfStyleApplied.indexOf(" ") > -1) { checkIfStyleApplied = /* extract only the tag name */ checkIfStyleApplied.substr(0, checkIfStyleApplied.indexOf(" ")); } if (checkIfStyleApplied == curPar.tagName) { /* remove if already applied */ let grandParentOfSelection = curPar.parentElement; /* get tag nesting selection */ let curChildStyle = /* get all tag names used from top style configuration */ grandParentOfSelection.getElementsByTagName(curPar.tagName); for (j = 0; j < curChildStyle.length; j++) { /* loop with all tags and check text */ let curCheck = curChildStyle[j]; /* get each tag with configged style tag */ let text = curCheck.innerText; /* extract the text from tag */ /* HOT-GLUE - makes a pretty good guess as to whether or not this is selection */ if (outText.indexOf(text) > -1) { /* out text - selection parent outerHTML */ curCheck.outerText = text; /* Replace outerText which removes stringed style */ /* end loop as this is probably the selected text and no more styled tags to rm */ break; } else { /* Do nothing - not the tag to remove */ let skip; } } } else { /* give parent a global style id */ if (curPar.hasAttribute("id") == true) { let curID = curPar.id; if (curID.indexOf("bm_window_style") > -1) { /* set the parents' id to global style id */ curPar.id = "bm_window_style"; } else { /* append global style id to the current id value */ curPar.id += " bm_window_style"; } } else { /* set the parents' id to global style id */ curPar.setAttribute("id", "bm_window_style"); } /* select by id to get parent element */ parentIDWithSelectedText_boldText = document.getElementById("bm_window_style"); /* apply styling to selection */ boldTheSelectedText(); } } } }; /* Style text using the ID added to parent element in getParentElementOfSelection_boldText(). */ const boldTheSelectedText = () => { /* store the curren innerHTML to update with bold text */ let curInnerHTML = parentIDWithSelectedText_boldText.innerHTML; /* wrap selection in HTML u tag */ let boldStyleSelection = /* use variables defined at top and in main function */ currentStyleOpenTag_boldText + selectedString_boldText + currentStyleCloseTag_boldText; /* if only one occurence of selected text in parent element */ if (curInnerHTML.indexOf(selectedString_boldText) == curInnerHTML.lastIndexOf(selectedString_boldText)) { /* replace selection with newly styled text */ curInnerHTML = curInnerHTML.replace(selectedString_boldText, boldStyleSelection); /* Update parent HTML with newly styled text */ parentIDWithSelectedText_boldText.innerHTML = curInnerHTML; } else { /* variable used so insertion is not duplicated */ let curLengthOfText = selectedString_boldText.length; /* HOT-GLUE - make a good guess as to where index of current selection is within parent */ var getCurIndex = () => { /* Ensure parent is an element node */ if (selectionParent_boldText.nodeType === Node.ELEMENT_NODE) { return range_boldText.startOffset; } else { return range_boldText.startOffset; } }; let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index */ var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new bold text */ return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount)); }; /* update the parent HTML with text containg bold selection */ parentIDWithSelectedText_boldText.innerHTML = insertAtIndex(curInnerHTML, boldStyleSelection, curIndex, curLengthOfText); } selection_boldText = undefined; lastThreeKeys_boldText = []; }; /* Listen form key combo to bold text. */ const addKeyDown_boldText = () => { document.body.addEventListener("keydown", function(event) { keypressToBookmarklet_boldText(event.key); }); }; /****************************************************************** Listen for keydonw event, running main function and bold selected text if the keyboard input is keyCombo_boldText variable. *******************************************************************/ addKeyDown_boldText(); /* Add alert event so that instructions for use are communicated. */ if (alertWithInstructions_boldText != undefined && alertWithInstructions_boldText == 1) { let alertText = "INSTRUCTIONS: \n" + "************* \n" + "Press '" + keyCombo_boldText + "' to make selected text bold. \n" + "To remove press '" + keyCombo_boldText + "' some of previous styled text. \n\n" + "For best results: \n\n" + " - Avoid selecting text with different sytling. \n" + " - Avoid selecting a word that is often repeated. \n" + " - Press each key specified one at a time. \n" + " - If using with another style bookmarklet, press '" + noPressKey_boldText + "'\n" + " button THREE times with NO text selected \n" + " before styling another with a different style \n" + " and key combo. \n" + " - If style is not applied, press just '" + keyCombo_boldText[keyCombo_boldText.length-1] + "' again."; alert(alertText); } })();
```
</details>
</dd></dl></dd></dl>

Style- Highlight Selected Text: 
----
<dl><dd><dl><dd>

Run this bookmarklet when you want to highlight selected text on a webpage. Press `ctrl + Shift + h` to make the selected text highlighted. Works with:


1. Style - **\*\[ALL\]** Selected Text -\> *Window Bookmarklets*


<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>window_style_highlightSelectedText.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [window_style_highlightSelectedText.js](https://gist.github.com/jhauga/3bd193b98a84a0ac048c607d6d2a804d)

```markdown
javascript:(function() {/* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */ var alertWithInstructions_highlightText = 1; /* turn instruction alert on or off */ var noPressKey_highlightText = "SHIFT"; /* button to press when using with other bookmarkel */ /* Define global variables. */ var numberOfKeyPresses_highlightText = 3;/* specify how many keypresses are used */ var currentStyleOpenTag_highlightText = "<span style='background:yellow'>"; /* open tag to style selection */ var currentStyleCloseTag_highlightText = "</span>"; /* close tag to style selection */ var keyCombo_highlightText = "Control+Shift+h"; /* key combo to change style */ /* Declare global variables */ var range_highlightText, selection_highlightText, selectionParent_highlightText, selectedString_highlightText, parentIDWithSelectedText_highlightText; /******************************* MAIN FUNCTION *******************************/ /*****************************************************************************/ var keySwitch_highlightText = 0; var lastThreeKeys_highlightText = []; /* enables last three key presses to be stored */ function keypressToBookmarklet_highlightText(key_press) { /* keyboard combo that enablse text to be style file */ lastThreeKeys_highlightText.push(key_press); /* keep only the last three keys */ if (lastThreeKeys_highlightText.length > numberOfKeyPresses_highlightText) { lastThreeKeys_highlightText.shift(); } /* check key combo */ if (numberOfKeyPresses_highlightText == 2) { /* check if key combo is keyCombo_highlightText variable */ let checkIfKeyCombo_highlightText = lastThreeKeys_highlightText[0] + "+" + lastThreeKeys_highlightText[1]; if (checkIfKeyCombo_highlightText == keyCombo_highlightText) { getParentElementOfSelection_highlightText(); /* get parent of selected text */ } } else if (numberOfKeyPresses_highlightText == 3) { /* check if key combo is keyCombo_highlightText variable */ let checkIfKeyCombo_highlightText = lastThreeKeys_highlightText[0] + "+" + lastThreeKeys_highlightText[1] + "+" + lastThreeKeys_highlightText[2]; if (checkIfKeyCombo_highlightText == keyCombo_highlightText) { getParentElementOfSelection_highlightText(); /* get parent of selected text */ } } else { /* check if key combo is keyCombo_highlightText variable */ let checkIfKeyCombo_highlightText = lastThreeKeys_highlightText[0]; if (checkIfKeyCombo_highlightText == keyCombo_highlightText) { getParentElementOfSelection_highlightText(); /* get parent of selected text */ } } } /***** Support Functions: *****/ /* Get parent of selection, give it id and use it to style selected text. */ const getParentElementOfSelection_highlightText = () => { /* get the current selection */ selection_highlightText = window.getSelection(); if (selection_highlightText.rangeCount > 0) { /* ensure something is selected */ /* prepare elements to change selection */ range_highlightText = selection_highlightText.getRangeAt(0); /* first object of selection */ selectionParent_highlightText = range_highlightText.commonAncestorContainer; /* node of selection */ let temp = document.getElementById("bm_window_style"); if (temp) { /* don't include prior global style ids */ let tempID = temp.getAttribute("id"); if (tempID == "bm_window_style") { temp.removeAttribute("id"); } else { temp.setAttribute("id", tempID.replace("bm_window_style", "")); } } selectedString_highlightText = range_highlightText.toString(); /* store as string */ /* ensure selection is a text node */ if (selectionParent_highlightText.nodeType === 3) { /* if it is a text node */ let curPar = selectionParent_highlightText.parentElement; /* store the parent element */ let outText = curPar.outerHTML; /* select all of the styled element */ let keepText = curPar.innerText; /* select only the text of styled element */ let checkIfStyleApplied = /* check if the style has already been applied */ currentStyleOpenTag_highlightText.replace(/[<>]/g, "").toUpperCase(); /* account for style attributes that may be applied intemplate */ checkIfStyleApplied = checkIfStyleApplied.substr(0, checkIfStyleApplied.indexOf(" ")); if (checkIfStyleApplied == curPar.tagName) { /* remove if already applied */ let grandParentOfSelection = curPar.parentElement; /* get tag nesting selection */ let curChildStyle = /* get all tag names used from top style configuration */ grandParentOfSelection.getElementsByTagName(curPar.tagName); for (j = 0; j < curChildStyle.length; j++) { /* loop with all tags and check text */ let curCheck = curChildStyle[j]; /* get each tag with configged style tag */ let text = curCheck.innerText; /* extract the text from tag */ /* HOT-GLUE - makes a pretty good guess as to whether or not this is selection */ if (outText.indexOf(text) > -1) { /* out text - selection parent outerHTML */ curCheck.outerText = text; /* Replace outerText which removes stringed style */ /* end loop as this is probably the selected text and no more styled tags to rm */ break; } else { /* Do nothing - not the tag to remove */ let skip; } } } else { /* give parent a global style id */ if (curPar.hasAttribute("id") == true) { let curID = curPar.id; if (curID.indexOf("bm_window_style") > -1) { /* set the parents' id to global style id */ curPar.id = "bm_window_style"; } else { /* append global style id to the current id value */ curPar.id += " bm_window_style"; } } else { /* set the parents' id to global style id */ curPar.setAttribute("id", "bm_window_style"); } /* select by id to get parent element */ parentIDWithSelectedText_highlightText = document.getElementById("bm_window_style"); /* apply styling to selection */ fileTheSelectedText(); } } } }; /* Style text using the ID added to parent element in getParentElementOfSelection_highlightText(). */ const fileTheSelectedText = () => { /* store the curren innerHTML to update with file text */ let curInnerHTML = parentIDWithSelectedText_highlightText.innerHTML; /* wrap selection in HTML u tag */ let fileStyleSelection = /* use variables defined at top and in main function */ currentStyleOpenTag_highlightText + selectedString_highlightText + currentStyleCloseTag_highlightText; /* if only one occurence of selected text in parent element */ if (curInnerHTML.indexOf(selectedString_highlightText) == curInnerHTML.lastIndexOf(selectedString_highlightText)) { /* replace selection with newly styled text */ curInnerHTML = curInnerHTML.replace(selectedString_highlightText, fileStyleSelection); /* Update parent HTML with newly styled text */ parentIDWithSelectedText_highlightText.innerHTML = curInnerHTML; } else { /* variable used so insertion is not duplicated */ let curLengthOfText = selectedString_highlightText.length; /* HOT-GLUE - make a good guess as to where index of current selection is within parent */ var getCurIndex = () => { /* Ensure parent is an element node */ if (selectionParent_highlightText.nodeType === Node.ELEMENT_NODE) { return range_highlightText.startOffset; } else { return range_highlightText.startOffset; } }; let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index */ var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new file text */ return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount)); }; /* update the parent HTML with text containg file selection */ parentIDWithSelectedText_highlightText.innerHTML = insertAtIndex(curInnerHTML, fileStyleSelection, curIndex, curLengthOfText); } selection_highlightText = undefined; lastThreeKeys_highlightText = []; }; /* Listen form key combo to file text. */ const addKeyDown_highlightText = () => { document.body.addEventListener("keydown", function(event) { keypressToBookmarklet_highlightText(event.key); }); }; /****************************************************************** Listen for keydonw event, running main function and file selected text if the keyboard input is keyCombo_highlightText variable. *******************************************************************/ addKeyDown_highlightText(); /* Add alert event so that instructions for use are communicated. */ if (alertWithInstructions_highlightText != undefined && alertWithInstructions_highlightText == 1) { let alertText = "INSTRUCTIONS: \n" + "************* \n" + "Press '" + keyCombo_highlightText + "' to make selected text file. \n" + "To remove press '" + keyCombo_highlightText + "' some of previous styled text. \n\n" + "For best results: \n\n" + " - Avoid selecting text with different sytling. \n" + " - Avoid selecting a word that is often repeated. \n" + " - Press each key specified one at a time. \n" + " - If using with another style bookmarklet, press '" + noPressKey_highlightText + "'\n" + " button THREE times with NO text selected \n" + " before styling another with a different style \n" + " and key combo. \n" + " - If style is not applied, press just '" + keyCombo_highlightText[keyCombo_highlightText.length-1] + "' again."; alert(alertText); } })();
```
</details>
</dd></dl></dd></dl>

Style - Italic Selected Text: 
----
<dl><dd><dl><dd>

Run this bookmarklet when you want to italicize selected text on a webpage. Press `ctrl + i` to make the selected text italic. Works with:

1. Style - **\*\[ALL\]** Selected Text -\> *Window Bookmarklets*


<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>window_style_italicSelectedText.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [window_style_italicSelectedText.js](https://gist.github.com/jhauga/f5dbf303496f6db838794c4464591afb)

```markdown
javascript:(function() { /* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */ var alertWithInstructions_italicText = 1; /* turn instruction alert on or off */ var noPressKey_italicText = "SHIFT"; /* button to press when using with other bookmarkel */ /* Define global variables. */ var numberOfKeyPresses_italicText = 2;/* specify how many keypresses are used */ var currentStyleOpenTag_italicText = "<em>"; /* open tag to style selection */ var currentStyleCloseTag_italicText = "</em>"; /* close tag to style selection */ var keyCombo_italicText = "Control+i"; /* key combo to change style */ /* Declare global variables */ var range_italicText, selection_italicText, selectionParent_italicText, selectedString_italicText, parentIDWithSelectedText_italicText; /******************************* MAIN FUNCTION *******************************/ /*****************************************************************************/ var keySwitch_italicText = 0; var lastThreeKeys_italicText = []; /* enables last three key presses to be stored */ function keypressToBookmarklet_italicText(key_press) { /* keyboard combo that enablse text to be style italic */ lastThreeKeys_italicText.push(key_press); /* keep only the last three keys */ if (lastThreeKeys_italicText.length > numberOfKeyPresses_italicText) { lastThreeKeys_italicText.shift(); } /* check key combo */ if (numberOfKeyPresses_italicText == 2) { /* check if key combo is keyCombo_italicText variable */ let checkIfKeyCombo_italicText = lastThreeKeys_italicText[0] + "+" + lastThreeKeys_italicText[1]; if (checkIfKeyCombo_italicText == keyCombo_italicText) { getParentElementOfSelection_italicText(); /* get parent of selected text */ } } else if (numberOfKeyPresses_italicText == 3) { /* check if key combo is keyCombo_italicText variable */ let checkIfKeyCombo_italicText = lastThreeKeys_italicText[0] + "+" + lastThreeKeys_italicText[1] + "+" + lastThreeKeys_italicText[2]; if (checkIfKeyCombo_italicText == keyCombo_italicText) { getParentElementOfSelection_italicText(); /* get parent of selected text */ } } else { /* check if key combo is keyCombo_italicText variable */ let checkIfKeyCombo_italicText = lastThreeKeys_italicText[0]; if (checkIfKeyCombo_italicText == keyCombo_italicText) { getParentElementOfSelection_italicText(); /* get parent of selected text */ } } } /***** Support Functions: *****/ /* Get parent of selection, give it id and use it to style selected text. */ const getParentElementOfSelection_italicText = () => { /* get the current selection */ selection_italicText = window.getSelection(); if (selection_italicText.rangeCount > 0) { /* ensure something is selected */ /* prepare elements to change selection */ range_italicText = selection_italicText.getRangeAt(0); /* first object of selection */ selectionParent_italicText = range_italicText.commonAncestorContainer; /* node of selection */ let temp = document.getElementById("bm_window_style"); if (temp) { /* don't include prior global style ids */ let tempID = temp.getAttribute("id"); if (tempID == "bm_window_style") { temp.removeAttribute("id"); } else { temp.setAttribute("id", tempID.replace("bm_window_style", "")); } } selectedString_italicText = range_italicText.toString(); /* store as string */ /* ensure selection is a text node */ if (selectionParent_italicText.nodeType === 3) { /* if it is a text node */ let curPar = selectionParent_italicText.parentElement; /* store the parent element */ let outText = curPar.outerHTML; /* select all of the styled element */ let keepText = curPar.innerText; /* select only the text of styled element */ let checkIfStyleApplied = /* check if the style has already been applied */ currentStyleOpenTag_italicText.replace(/[<>]/g, "").toUpperCase(); /* account for style attributes that may be applied intemplate */ if (checkIfStyleApplied.indexOf(" ") > -1) { checkIfStyleApplied = /* extract only the tag name */ checkIfStyleApplied.substr(0, checkIfStyleApplied.indexOf(" ")); } if (checkIfStyleApplied == curPar.tagName) { /* remove if already applied */ let grandParentOfSelection = curPar.parentElement; /* get tag nesting selection */ let curChildStyle = /* get all tag names used from top style configuration */ grandParentOfSelection.getElementsByTagName(curPar.tagName); for (j = 0; j < curChildStyle.length; j++) { /* loop with all tags and check text */ let curCheck = curChildStyle[j]; /* get each tag with configged style tag */ let text = curCheck.innerText; /* extract the text from tag */ /* HOT-GLUE - makes a pretty good guess as to whether or not this is selection */ if (outText.indexOf(text) > -1) { /* out text - selection parent outerHTML */ curCheck.outerText = text; /* Replace outerText which removes stringed style */ /* end loop as this is probably the selected text and no more styled tags to rm */ break; } else { /* Do nothing - not the tag to remove */ let skip; } } } else { /* give parent a global style id */ if (curPar.hasAttribute("id") == true) { let curID = curPar.id; if (curID.indexOf("bm_window_style") > -1) { /* set the parents' id to global style id */ curPar.id = "bm_window_style"; } else { /* append global style id to the current id value */ curPar.id += " bm_window_style"; } } else { /* set the parents' id to global style id */ curPar.setAttribute("id", "bm_window_style"); } /* select by id to get parent element */ parentIDWithSelectedText_italicText = document.getElementById("bm_window_style"); /* apply styling to selection */ italicTheSelectedText(); } } } }; /* Style text using the ID added to parent element in getParentElementOfSelection_italicText(). */ const italicTheSelectedText = () => { /* store the curren innerHTML to update with italic text */ let curInnerHTML = parentIDWithSelectedText_italicText.innerHTML; /* wrap selection in HTML u tag */ let italicStyleSelection = /* use variables defined at top and in main function */ currentStyleOpenTag_italicText + selectedString_italicText + currentStyleCloseTag_italicText; /* if only one occurence of selected text in parent element */ if (curInnerHTML.indexOf(selectedString_italicText) == curInnerHTML.lastIndexOf(selectedString_italicText)) { /* replace selection with newly styled text */ curInnerHTML = curInnerHTML.replace(selectedString_italicText, italicStyleSelection); /* Update parent HTML with newly styled text */ parentIDWithSelectedText_italicText.innerHTML = curInnerHTML; } else { /* variable used so insertion is not duplicated */ let curLengthOfText = selectedString_italicText.length; /* HOT-GLUE - make a good guess as to where index of current selection is within parent */ var getCurIndex = () => { /* Ensure parent is an element node */ if (selectionParent_italicText.nodeType === Node.ELEMENT_NODE) { return range_italicText.startOffset; } else { return range_italicText.startOffset; } }; let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index */ var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new italic text */ return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount)); }; /* update the parent HTML with text containg italic selection */ parentIDWithSelectedText_italicText.innerHTML = insertAtIndex(curInnerHTML, italicStyleSelection, curIndex, curLengthOfText); } selection_italicText = undefined; lastThreeKeys_italicText = []; }; /* Listen form key combo to italic text. */ const addKeyDown_italicText = () => { document.body.addEventListener("keydown", function(event) { keypressToBookmarklet_italicText(event.key); }); }; /****************************************************************** Listen for keydonw event, running main function and italic selected text if the keyboard input is keyCombo_italicText variable. *******************************************************************/ addKeyDown_italicText(); /* Add alert event so that instructions for use are communicated. */ if (alertWithInstructions_italicText != undefined && alertWithInstructions_italicText == 1) { let alertText = "INSTRUCTIONS: \n" + "************* \n" + "Press '" + keyCombo_italicText + "' to make selected text italic. \n" + "To remove press '" + keyCombo_italicText + "' some of previous styled text. \n\n" + "For best results: \n\n" + " - Avoid selecting text with different sytling. \n" + " - Avoid selecting a word that is often repeated. \n" + " - Press each key specified one at a time. \n" + " - If using with another style bookmarklet, press '" + noPressKey_italicText + "'\n" + " button THREE times with NO text selected \n" + " before styling another with a different style \n" + " and key combo. \n" + " - If style is not applied, press just '" + keyCombo_italicText[keyCombo_italicText.length-1] + "' again."; alert(alertText); } })();
```
</details>
</dd></dl></dd></dl>

Style - Underline Selected Text: 
----
<dl><dd><dl><dd>

Run this bookmarklet when you want to underline selected text on a webpage. Press `Control + Shift + u` to make the selected text underlined. Works with:

1. Style - **\*\[ALL\]** Selected Text -\> *Window Bookmarklets*

<strong>USE - ready to use</strong>

<!------------------------------------------
<strong>USE - requires [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
<strong>USE - optional [x] change(s)</strong>
-------------------------------------------->

<!------------------------------------------
[Loosely] [b]Based on [SITE_NAME](REF_LINK)
-------------------------------------------->

<details>

<summary>window_style_underlineSelectedText.js</summary><br>

<!------------------------------------------
<strong>Required Changes\(x1\)</strong>
 1. QUICK_DESCRIPTION
-------------------------------------------->

<!------------------------------------------
<strong>Optional Changes\(x2\)</strong> 
 1. QUICK_DESCRIPTION            
 2. QUICK_DESCRIPTION            
-------------------------------------------->

<!-- PASTE VIDEO HERE -->


Gist page for [window_style_underlineSelectedText.js](https://gist.github.com/jhauga/645e97a7af14a14965d040d3bb2aa45f)

```markdown
javascript:(function() { /* OPTIONAL - set to 0 or delete to turn off instruciton pop-up, */ var alertWithInstructions_underlineText = 1; /* turn instruction alert on or off */ var noPressKey_underlineText = "SHIFT"; /* button to press when using with other bookmarkel */ /* Define global variables. */ var numberOfKeyPresses_underlineText = 3;/* specify how many keypresses are used */ var currentStyleOpenTag_underlineText = "<u>"; /* open tag to style selection */ var currentStyleCloseTag_underlineText = "</u>"; /* close tag to style selection */ var keyCombo_underlineText = "Control+Shift+u"; /* key combo to change style */ /* Declare global variables */ var range_underlineText, selection_underlineText, selectionParent_underlineText, selectedString_underlineText, parentIDWithSelectedText_underlineText; /******************************* MAIN FUNCTION *******************************/ /*****************************************************************************/ var keySwitch_underlineText = 0; var lastThreeKeys_underlineText = []; /* enables last three key presses to be stored */ function keypressToBookmarklet_underlineText(key_press) { /* keyboard combo that enablse text to be style underline */ lastThreeKeys_underlineText.push(key_press); /* keep only the last three keys */ if (lastThreeKeys_underlineText.length > numberOfKeyPresses_underlineText) { lastThreeKeys_underlineText.shift(); } /* check key combo */ if (numberOfKeyPresses_underlineText == 2) { /* check if key combo is keyCombo_underlineText variable */ let checkIfKeyCombo_underlineText = lastThreeKeys_underlineText[0] + "+" + lastThreeKeys_underlineText[1]; if (checkIfKeyCombo_underlineText == keyCombo_underlineText) { getParentElementOfSelection_underlineText(); /* get parent of selected text */ } } else if (numberOfKeyPresses_underlineText == 3) { /* check if key combo is keyCombo_underlineText variable */ let checkIfKeyCombo_underlineText = lastThreeKeys_underlineText[0] + "+" + lastThreeKeys_underlineText[1] + "+" + lastThreeKeys_underlineText[2]; if (checkIfKeyCombo_underlineText == keyCombo_underlineText) { getParentElementOfSelection_underlineText(); /* get parent of selected text */ } } else { /* check if key combo is keyCombo_underlineText variable */ let checkIfKeyCombo_underlineText = lastThreeKeys_underlineText[0]; if (checkIfKeyCombo_underlineText == keyCombo_underlineText) { getParentElementOfSelection_underlineText(); /* get parent of selected text */ } } } /***** Support Functions: *****/ /* Get parent of selection, give it id and use it to style selected text. */ const getParentElementOfSelection_underlineText = () => { /* get the current selection */ selection_underlineText = window.getSelection(); if (selection_underlineText.rangeCount > 0) { /* ensure something is selected */ /* prepare elements to change selection */ range_underlineText = selection_underlineText.getRangeAt(0); /* first object of selection */ selectionParent_underlineText = range_underlineText.commonAncestorContainer; /* node of selection */ let temp = document.getElementById("bm_window_style"); if (temp) { /* don't include prior global style ids */ let tempID = temp.getAttribute("id"); if (tempID == "bm_window_style") { temp.removeAttribute("id"); } else { temp.setAttribute("id", tempID.replace("bm_window_style", "")); } } selectedString_underlineText = range_underlineText.toString(); /* store as string */ /* ensure selection is a text node */ if (selectionParent_underlineText.nodeType === 3) { /* if it is a text node */ let curPar = selectionParent_underlineText.parentElement; /* store the parent element */ let outText = curPar.outerHTML; /* select all of the styled element */ let keepText = curPar.innerText; /* select only the text of styled element */ let checkIfStyleApplied = /* check if the style has already been applied */ currentStyleOpenTag_underlineText.replace(/[<>]/g, "").toUpperCase(); /* account for style attributes that may be applied intemplate */ if (checkIfStyleApplied.indexOf(" ") > -1) { checkIfStyleApplied = /* extract only the tag name */ checkIfStyleApplied.substr(0, checkIfStyleApplied.indexOf(" ")); } if (checkIfStyleApplied == curPar.tagName) { /* remove if already applied */ let grandParentOfSelection = curPar.parentElement; /* get tag nesting selection */ let curChildStyle = /* get all tag names used from top style configuration */ grandParentOfSelection.getElementsByTagName(curPar.tagName); for (j = 0; j < curChildStyle.length; j++) { /* loop with all tags and check text */ let curCheck = curChildStyle[j]; /* get each tag with configged style tag */ let text = curCheck.innerText; /* extract the text from tag */ /* HOT-GLUE - makes a pretty good guess as to whether or not this is selection */ if (outText.indexOf(text) > -1) { /* out text - selection parent outerHTML */ curCheck.outerText = text; /* Replace outerText which removes stringed style */ /* end loop as this is probably the selected text and no more styled tags to rm */ break; } else { /* Do nothing - not the tag to remove */ let skip; } } } else { /* give parent a global style id */ if (curPar.hasAttribute("id") == true) { let curID = curPar.id; if (curID.indexOf("bm_window_style") > -1) { /* set the parents' id to global style id */ curPar.id = "bm_window_style"; } else { /* append global style id to the current id value */ curPar.id += " bm_window_style"; } } else { /* set the parents' id to global style id */ curPar.setAttribute("id", "bm_window_style"); } /* select by id to get parent element */ parentIDWithSelectedText_underlineText = document.getElementById("bm_window_style"); /* apply styling to selection */ underlineTheSelectedText(); } } } }; /* Style text using the ID added to parent element in getParentElementOfSelection_underlineText(). */ const underlineTheSelectedText = () => { /* store the curren innerHTML to update with underline text */ let curInnerHTML = parentIDWithSelectedText_underlineText.innerHTML; /* wrap selection in HTML u tag */ let underlineStyleSelection = /* use variables defined at top and in main function */ currentStyleOpenTag_underlineText + selectedString_underlineText + currentStyleCloseTag_underlineText; /* if only one occurence of selected text in parent element */ if (curInnerHTML.indexOf(selectedString_underlineText) == curInnerHTML.lastIndexOf(selectedString_underlineText)) { /* replace selection with newly styled text */ curInnerHTML = curInnerHTML.replace(selectedString_underlineText, underlineStyleSelection); /* Update parent HTML with newly styled text */ parentIDWithSelectedText_underlineText.innerHTML = curInnerHTML; } else { /* variable used so insertion is not duplicated */ let curLengthOfText = selectedString_underlineText.length; /* HOT-GLUE - make a good guess as to where index of current selection is within parent */ var getCurIndex = () => { /* Ensure parent is an element node */ if (selectionParent_underlineText.nodeType === Node.ELEMENT_NODE) { return range_underlineText.startOffset; } else { return range_underlineText.startOffset; } }; let curIndex = getCurIndex(); /* HOT-GLUE CALL - get the guessed index */ var insertAtIndex = (orgStr, insStr, index, insCount) => { /* insert new underline text */ return orgStr.slice(0, index) + insStr + orgStr.slice(Number(index + insCount)); }; /* update the parent HTML with text containg underline selection */ parentIDWithSelectedText_underlineText.innerHTML = insertAtIndex(curInnerHTML, underlineStyleSelection, curIndex, curLengthOfText); } selection_underlineText = undefined; lastThreeKeys_underlineText = []; }; /* Listen form key combo to underline text. */ const addKeyDown_underlineText = () => { document.body.addEventListener("keydown", function(event) { keypressToBookmarklet_underlineText(event.key); }); }; /****************************************************************** Listen for keydonw event, running main function and underline selected text if the keyboard input is keyCombo_underlineText variable. *******************************************************************/ addKeyDown_underlineText(); /* Add alert event so that instructions for use are communicated. */ if (alertWithInstructions_underlineText != undefined && alertWithInstructions_underlineText == 1) { let alertText = "INSTRUCTIONS: \n" + "************* \n" + "Press '" + keyCombo_underlineText + "' to make selected text underline. \n" + "To remove press '" + keyCombo_underlineText + "' some of previous styled text. \n\n" + "For best results: \n\n" + " - Avoid selecting text with different sytling. \n" + " - Avoid selecting a word that is often repeated. \n" + " - Press each key specified one at a time. \n" + " - If using with another style bookmarklet, press '" + noPressKey_underlineText + "'\n" + " button THREE times with NO text selected \n" + " before styling another with a different style \n" + " and key combo. \n" + " - If style is not applied, press just '" + keyCombo_underlineText[keyCombo_underlineText.length-1] + "' again."; alert(alertText); } })();
```
</details>
</dd></dl></dd></dl>

URI - Anchor Higlighted Text: 
----
<dl><dd><dl><dd>

Select text and add it to URI as anchor link. NOTE - for best results limit selection to one line, avoiding special characters. <br><br>


<strong>USE - ready to use</strong>
<details>

<summary>window_URI_AnchorHighlightedText.js</summary><br>


<!-- PASTE VIDEO HERE -->


Gist page for [window_URI_AnchorHighlightedText.js](https://gist.github.com/jhauga/861f74e65191714ecbd2d0eee7712754)

```markdown
javascript:(function() { /* Define global variables. */ var currentPage = location.href.replace(/#~:text=*/g, ""); /* current uri */ var initTextAnchor = "#:~:text="; /* anchor syntax for text */ /* Store highlighted text in a variable using function. */ const selectHighlightedText = () => { let selection = window.getSelection(); /* use window property */ if (selection.rangeCount > 0) { /* if some text selected */ return encodeURI(selection /* return it as am emcpded */ .getRangeAt(0).toString() /* URI string replacing */ .replace(/ {2,}/g, " ") /* two or more spaces */ .replace(/\n/g, "")); /* and rendered new lines str */ } else { /* if none selected */ return ""; /* return empty string */ } }; /* Store results of selectHighlightedText() call. */ var selectedText = selectHighlightedText(); /* Set URI with anchor to highlighted text. */ location.href = `${currentPage}${initTextAnchor}${selectedText}`;})();
```
</details>
</dd></dl></dd></dl>

</div>

<hr><br>


<!---------------------------------------- END OF FILE ----------------------------------------->
