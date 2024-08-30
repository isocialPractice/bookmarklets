# Browser Bookmarklets ![repo icon](favicon.png)
<!-- Navigation -->
<div>
<details>
<summary>Document Navigation: </summary>

- [Navigation Bookmarklets](#navigation-bookmarklets)
  - [Highlight Current Page](#sidebar---highlight-current-page) - ready to use
  - [Underline Anchor Linke](#sidebar---underline-anchor-link) - ready to use
- [Style Bookmarklets](#style-bookmarklets)
  - [Favicon - Change or Add Favicon](#favicon---change-or-add-favicon) - requires 1 change(s)
- [Site Specific Bookmarklets](#site-specific-bookmarklets)
  - [ChatGPT - Bookmark a specific response](#chatgpt---bookmark-a-specific-response) - requires 1 change
  - [ChatGPT - Paste Ready Bookmark Response](#chatgpt---paste-ready-bookmark-response) - ready to use
  - [ChatGPT - Resize Prompt](#chatgpt---resize-prompt) - ready to use
  - [GitHub - Alternate Row Color](#github---alternate-row-color) - ready to use
  - [GitHub - Show File Size](#github---show-file-size) - ready to use
  - [OctoPrint - Change Graph Image](#octoprint---change-graph-image) - ready to use - <em>1 optional change</em>
  - [Stackoverflow - Add Answer Anchor Links](#stackoverflow---add-answer-anchor-links) - ready to use
  - [YouTube - Take Notes and Add Time Marks](#youtube---take-notes-and-add-time-marks) - ready to use
- [Window Bookmarklets](#window-bookmarklets)
  - [Page Offset - Custom Page Down](#page-offset---custom-page-down) - ready to use
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


`Ctrl + click` for more info on [Browser Bookmarklets](https://subsimple.com/bookmarklets/index.php). <br>
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

# Navigation Bookmarklets:
<div>
The below bookmarklets are for pages withe a side nav with many links.
Copy and paste (<em>making any needed adjustments</em>) to use.

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
javascript:(function(){ var pageTitle = "ChatGPT Bookmark"; /* <-- OPTIONAL - change title */ var pageHead = "ChatGPT Response"; /* <-- OPTIONAL - change head */ /* NOTE - 'HOT-GLUE' comments for fast patched */ /* Class names to identify button row in each answer. */ var ButtonClassNameIdentifier = "rounded-lg text-token-text-secondary"; /* HOT-GLUE -- THIS IS HIGHLY LIKELY TO CHANGE */ /* Class names to identify div that is parent of button row. */ var DivClassNameIdentifier = "items-center justify-start rounded-xl p-1"; /* HOT-GLUE -- THIS IS HIGHLY LIKELY TO CHANGE ************/ var DivClassNameIdentifierII = "-ml-1 mt-0 flex h-7 items-center justify-center gap"; /* This checks class on signed out guest page */ /* Class names to identify the answer area sibling so answer area can be selected. */ var answerAreaClassNameIdentifier = "mt-1 flex gap-3"; /******************* HOT-GLUE -- THIS IS HIGHLY LIKELY TO CHANGE */ /* Select all divs and use in loop. */ var allDivElements = document.getElementsByTagName("div"); var allDivElementsLen = allDivElements.length; /* Define variables for later use. */ var answerRow, buttonRow, copyButton, cancelWhile = 0, answerArea, answerDIV, answerDIVLen, answerText, currentButtonsPath, currentButton, currentButtonsPathArr, currentSelection, priorSelection, copyButtonIndex, priorSelectionIndex, pathPar, pathGrandPar, pathGreatGrandPar; for (i = 0; i < allDivElementsLen; i++) { /* get the copy button <- ASSUMES HTML SEMATICS */ if (( /* condition for logged out or guest chatgpt.com page */ allDivElements[i].className.indexOf(DivClassNameIdentifierII) > -1 && /* HOT-GLUE - if a conversation has question edits - HOT-GLUE */ allDivElements[i].getElementsByTagName("path").length >= 1 ) || ( /* condition for logged in account page - working with everyday 3.5 chatGPT */ allDivElements[i].className.indexOf(DivClassNameIdentifier) > -1 && /* HOT-GLUE - if a conversation has question edits - HOT-GLUE */ allDivElements[i].getElementsByTagName("path").length > 2 )) { /* start process to select the copy button */ let selectCopyButton = function() { currentButtonsPath = allDivElements[i].getElementsByTagName("path"); currentButtonsPathArr = []; for (j = 0; j < currentButtonsPath.length; j++) { currentSelection = currentButtonsPath[j]; pathPar = currentSelection.parentElement; /* select svg */ pathGrandPar = pathPar.parentElement; /* select/check if span */ if (pathGrandPar.tagName == "SPAN" || /* HOT-GLUE - check if parent span */ pathGrandPar.tagName == "BUTTON") { /* HOT-GLUE - logged out was button */ currentButtonsPathArr.push(currentSelection.getAttribute("d")); } } if (currentButtonsPathArr.length == 1) { copyButtonIndex = 0; } else { for (j = 0; j < currentButtonsPathArr.length; j++) { currentSelection = currentButtonsPathArr[j]; if (j == 0) { priorSelection = currentSelection; priorSelectionIndex = 0; } else { priorSelection = priorSelection; priorSelectionIndex = priorSelectionIndex; } if (priorSelection.length < currentSelection.length) { /* none of the other variables need to change */ copyButtonIndex = priorSelectionIndex; } else { /* other variables need to change */ copyButtonIndex = j; priorSelectionIndex = j; priorSelection = currentSelection; } } } copyButton = allDivElements[i].getElementsByTagName("button")[copyButtonIndex]; }; selectCopyButton(); copyButton.addEventListener("click", function () { buttonRow = this.parentElement; /* start process to select answer ares */ let checkForAnswerArea = function() { if (buttonRow.className.indexOf(answerAreaClassNameIdentifier) == -1 && cancelWhile < 20) { cancelWhile+=1; buttonRow = buttonRow.parentElement; checkForAnswerArea(); } else { answerRow = buttonRow.previousElementSibling; } }; checkForAnswerArea(); answerArea = answerRow; answerDIV = answerArea.getElementsByTagName("div"); answerDIVLen = answerDIV.length; /* start process to get div holding answer <-- ASSUMES HTML SEMATICS*/ let j = 0; /* <-- switch to turn off loop */ let l = 0; /* increase nested div tag */ let errOut = 0; while (j != 1) { let isItAnswer = answerDIV[l].children[0].tagName; if (isItAnswer != "div" || isItAnswer != "DIV") { answerText = answerDIV[l]; j = 1; } else { /* increment and continue loop */ l+=1; errOut+=1; } if (errOut >= 20) { break; } } /* now the answer's div element should be extracted */ let copiedContent = /* get the content being copied */ answerText.innerHTML; /* clean up a bit */ /* so new lines can be inserted at end */ copiedContent = copiedContent.replace(/\n/g, "<br>"); copiedContent = copiedContent.replace(/\"/g, '&#92;&quot;'); /* use html encoding for escaped double quotes */ copiedContent = copiedContent.replace(/"/g, '\"'); /* keep double quotes as needed for inline html */ copiedContent = copiedContent.replace(/\\'/g, "&#92;&apos;'"); /* use html encoding for escaped single quotes */ copiedContent = copiedContent.replace(/'/g, "\'"); /* keep single quotes as needed for inline html */ copiedContent = copiedContent.replace(/([ ]{2,})/g, "<br>$1"); /* replace 2 or momre spaces with <br> tag */ copiedContent = copiedContent.replace(/class=&#92;&quot;/g, "class='"); /* HOT-GLUE - correct open class - HOT-GLUE */ copiedContent = copiedContent.replace(/&#92;&quot;>/g, "'>"); /* HOT-GLUE - correct close class - HOT-GLUE */ /* style the bookmarked page */ var bookmarkPageStyle = %60 <style> * { font-family: sans-serif,system-ui; } body { max-width: 50%; margin-left:auto; margin-right: auto; background:rgb(47 79 79 / 3%); } p code { color: black; font-size: 12pt; font-weight: 600; } p { font-size: 12pt; margin-bottom: 1.25em; margin-top: 1.25em; line-height: 16pt; } pre { max-width: 800px; overflow-x: scroll; padding: 20px; border-radius: 5px; background: black; color: white; } pre div.dark.bg-gray-950 div.flex.items-center.relative span { background: rgb(55 55 55); display: block; width: 110%; padding: 8px 0 0 25px; left: -3.5%; position: relative; top: -20px; color: #cdcdcd; font-size: 10pt; } pre div.bg-black.rounded-md code { line-height: 1; } pre code * { padding: 2px 0px; display: inline-block; font-family: system-ui !important; } pre div.bg-black.rounded-md code .hljs-comment, pre div.bg-black.rounded-md code.hljs-meta { display: block; color: hsla(0,0%,100%,.5); } pre div.bg-black.rounded-md code .hljs-meta:first-of-type { display: inline-block; position: relative; top: -20px; line-height: 2; } pre div.bg-black.rounded-md code .hljs-meta:last-of-type { display: block; margin-bottom: -10px; line-height: 1.5; } pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800, pre div.bg-black.rounded-md button { vertical-align: middle; padding: 5px 40px; color: rgb(217,217,227); } pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800 { display: inline-block; position: relative; width: 100%; top: -20px; right: -5% !important; margin-left: -8% !important; overflow-x: hidden !important; background: rgb(52,53,65); } pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800 span:first-of-type { line-height: 2; } pre div.bg-black.rounded-md button { display: inline-block; float: right; cursor: pointer; max-width:150px; background: none; border: none; text-decoration: line-through; } pre div.bg-black.rounded-md button svg { height: 15px; width: 20px; margin-right: 3px; } .hljs-doctag, .hljs-formula, .hljs-keyword, .hljs-literal { color: #2e95d3; } .hljs-comment { color: hsla(0,0%,100%,.5); } .hljs-addition, .hljs-attribute, .hljs-meta-string, .hljs-regexp, .hljs-string { color: #00a67d; } .hljs-built_in, .hljs-class .hljs-title { color: #e9950c; } .hljs-attr, .hljs-number, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-pseudo, .hljs-template-variable, .hljs-type, .hljs-variable { color: #df3079; } div[data-side='1'] { display:inline-block; position:fixed; left:0px; top: 0px; width:20%; height:auto; border: 2px solid black; border-bottom-right-radius: 80px; background: #000; } div[data-side='1'] svg, div[data-side='1'] path, div[data-side='1'] h3 { display: inline-block; } div[data-side='1'] svg { background: white; border-radius: 100%; margin-top: 20px; margin-left: 20px; padding:3px; } div[data-side='1'] h3 { position: relative; font-size: 12pt; margin-left: 20px; top: -15px !important; color: white; } table,th,td { border: 1px solid #d9d9e3; } table { border-collapse: separate; border-spacing: 0px; border-radius: 5px; width: 100%; max-width: none !important; } th,td { padding: 5px 5px; } th { background-color: rgba(236,236,241,.2); } button { display: none; } ul li { margin-top: 12px; } ul li code { color: black; font-weight: bold; font-size: larger; } ul li code::before, ul li code::after { content: '\%60'; } </style> %60; /* alert to wait - if pasted immediately = does not work */ alert("Wait 2 seconds for content to generate as bookmarklet on clipboard. \nThen open bookmark manager and make new bookmark by pasting into url field"); /* store new bookmarklet to be written to clipboard */ var bookmarklet = 'javascript:(function() {document.write("' + /* write html head content */ "<!DOCTYPE HTML><html><head><title>" + pageTitle + "</title>" + /* style a bit */ bookmarkPageStyle + "</head><body><h1>" + pageHead + "</h1><hr>" + /* sidebarlink to original answer */ "<div data-side='1' data-nav='0'>" + "<svg width='41' height='41' viewBox='0 0 41 41' fill='none' xmlns='http://www.w3.org/2000/svg' class='h-2/3 w-2/3' role='img'><text x='-9999' y='-9999'>ChatGPT</text><path d='M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z' fill='currentColor'></path></svg>" + '<h3>ChatGPT Bookmark</h3></div>' + /* output copied content */ copiedContent + /* close html */ "</body></html>" + /* close bookmarklet */ '");})()'; /* HOT-GLUE - remove unwanted escaped double quotes - HOT-GLUE */ bookmarklet = bookmarklet.replace(/&#92;&quot;/g, "&quot;"); /* set timeout so bookmarklet content is copied after answers' text */ setTimeout(function () { navigator.clipboard.writeText(bookmarklet); }, 2000); }); } } })();
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
javascript:(function(){var setMaxHeight="600px";var setMaxWidth="95%";var setMinHeight="40px";var setMinWidth="280px";var promptTextarea=document.getElementById("prompt-textarea");var promptPar=promptTextarea.parentElement;var subButton=promptPar.nextElementSibling;var parElement=promptPar.parentElement;var grandParElement=parElement.parentElement;grandParElement.style.transform="rotateX(180deg)";grandParElement.style.overflow="auto";grandParElement.style.resize="both";grandParElement.style.minHeight="100px";grandParElement.style.maxHeight="800px";grandParElement.style.minWidth="280px";grandParElement.style.maxWidth="85%";parElement.style.display="inline-block";parElement.style.transform="rotateX(180deg)";parElement.style.minWidth="100%";parElement.style.maxWidth="100%";parElement.style.height="inherit";parElement.style.minHeight="95%";subButton.style.position="absolute";subButton.style.bottom="10px";promptPar.style.paddingLeft="30px";promptPar.style.height="inherit";promptTextarea.style.paddingRight="100px";promptTextarea.style.paddingLeft="30px";promptTextarea.style.width="100%";var neededStyling=document.createElement("style");neededStyling.innerHTML=`form.w-full { width: auto !important;}textarea#prompt-textarea {   max-height: 800px !important;  min-height: 100% !important;  height: inherit !important; overflow: scroll !important; }  form div.relative.flex.h-full.flex-1 div + div.flex.w-full.items-center {  min-height: `+setMinHeight+` !important;  max-height: `+setMaxHeight+` !important;  min-width: `+setMinWidth+` !important;  max-width: `+setMaxWidth+` !important; } `;document.body.appendChild(neededStyling);})();
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

YouTube - Take Notes and Add Time Marks
----
<dl><dd><dl><dd>

Add note box to YouTube video and take notes on it. Just start typing. <br>
<strong>NOTE</strong> - best to use `Shift` key to activate note box. <br>
To pause press `Ctrl`, `Shift`, and `Space` \(in that order\). <br><br>
<strong>Add Time Mark</strong> - ` Ctrl + m `.<br>
<strong>Copy Notes to Clipboard</strong> - ` Alt + a ` .<br>

<strong>USE - ready to use</strong>
<details>

<summary>siteSpecific_YouTube_takeNotesAndAddTimeMarks.js</summary><br>

<!--
 _OPTIONAL---------------------------------------------------------------------------------------
 <strong>Video Demonstration for Use:</strong>
 `Ctrl + click` link to view demo on YouTube [TEXT_NAME_MATCHING_FILE](YOU_TUBE_LINK)
 _OPTIONAL---------------------------------------------------------------------------------------
          ---------------------------------------------------------------------------------------
-->		 

Gist page for [siteSpecific_YouTube_takeNotesAndAddTimeMarks.js](https://gist.github.com/jhauga/7cd368113b0a083e063310d5deb8c718)

```markdown
javascript:(function(){ /* Global DOM variables */ var noteAreaID = /* parent for note elements */ document.getElementById("noteArea"); var noteBox = /* textare element for taking notes */ document.getElementById("noteBox"); var aboveTheFold = /* html after vidoe box */ document.getElementById("above-the-fold"); var player = /* video player topmost parent */ document.getElementById("player"); var playButton = /* play button - needed to update time mark */ document.getElementsByClassName("ytp-play-button"); var currentTimeClassName = /* class element with current time */ "ytp-time-current"; var curTimeElement; /* redefined to get time mark */ var timePreCal, timeSecCal; /* redefined - time mark in seconds and time mark */ /* Global configuration variables */ var ignoredKeys = /* keys pressed that do not active not box */ "Home End PageUp PageDown"; var ignoredDOMElements = /* stop function if one of these is active */ ["comments", "search", "contenteditable-root", "player"]; /* CSS style sheet */ var noteCSS = ` div#noteArea { display: inline-flex; flex-wrap: nowrap; position: relative; top: 0px; width: 100%; } div #noteArea div { display: inline-block; position: relative; margin: 0px; max-width: 450px; width: min-content; } div#noteArea div+div { display: inline-block; position: relative; max-width: 800px; width: auto !important; left: 0px; } textarea#noteBox { max-width: 450px; width: 450px; height: 100px; border-radius: 10px; } span#timeMarkButtonArea { box-sizing: border-box; display: inline-block; position: relative; float: left; max-width: 750px; width: auto; height: 100%; border-radius: 10px; margin-left: 10px; padding: 5px; background: rgba(0, 0, 0, .025); } span#timeMarkButtonArea a { box-sizing: border-box !important; display: inline-flex !important; position: relative; flex-wrap: wrap !important; top: 0px !important; left: unset !important; cursor: pointer; width: auto; height: 25px; border-radius: 3px; margin-left: 10px; margin-top: 3px; padding: 5px 10px 10px; background: rgba(40, 40, 40, .85); color: white; text-decoration: none; } span#timeMarkButtonArea a:hover { background: rgba(40, 40, 40, 1); } %60; /* Note box setup. */ var noteTextArea, noteArea, noteBoxDiv; if (!noteAreaID) { /* are for notes */ noteArea = document.createElement("div"); noteArea.id = "noteArea"; aboveTheFold.insertAdjacentElement("beforebegin", noteArea); let noteStyle = /* using noteCSS from above */ document.createElement("style"); noteStyle.textContent = /* add css properties */ noteCSS; noteArea.insertAdjacentElement("beforebegin", noteStyle); noteAreaID = document.getElementById("noteArea"); /* note box */ noteTextArea = document.createElement("textarea"); noteTextArea.id = "noteBox"; noteBoxDiv = document.createElement("div"); /* insert div to hold textarea */ noteAreaID.insertAdjacentElement("afterbegin", noteBoxDiv); /* insert textare html elements to take notes */ noteBoxDiv.insertAdjacentElement("afterbegin", noteTextArea); } /* Redefine noteBox */ noteBox = document.getElementById("noteBox"); /***** SUPPORT FUNCTIONS *****/ /* Copy notes in textare to clipboard. */ function copyNotes() { noteBox.select(); navigator.clipboard.writeText(noteBox.value); } /* Focus on textarea whenever keydown occurs. */ const updateCurrentTime = () => { /* update HTML element holding time value */ let playButtonData = playButton[0].dataset.titleNoTooltip; if (playButtonData != "Play") { playButton[0].click(); playButton[0].click(); } /* update time value HTML element */ curTimeElement = /* select element with current time */ document.getElementsByClassName(currentTimeClassName); curTimeElementText = curTimeElement[0].textContent; /* extract time and calculate in seconds */ timePreCal = curTimeElementText.split(":"); }; function keypressToNote() { let activeID = document.activeElement.id; let lastKeyPress; /* used to check for key combos */ lastKeyPress = sessionStorage.getItem("lastKeyPress"); /* for first key press */ if (lastKeyPress == null) { sessionStorage.setItem("lastKeyPress", event.key); lastKeyPress = sessionStorage.getItem("lastKeyPress"); } /* store key press and check active element */ let currentKeyPress = event.key; /* start conditions to activate note box or run function accordingly */ /* if any of these elements have focus */ /** ignoredDOMElements = "comments search contenteditable-root player"; **/ /* then don't take notes - note - variable defined at start */ for (i in ignoredDOMElements) { if (activeID == ignoredDOMElements[i]) { /* quit function */ return; } } /* else */ { /* the active element is not in ignored list, run function */ let checkKeyCombo = /* check for combos */ lastKeyPress + "+" + currentKeyPress; /* check key combos and run function accordingly */ if (checkKeyCombo == "Control+Shift") { noteBox.blur(); /* out of note box */ } /* add time marker adjacent to notes */ else if (checkKeyCombo == "Control+m") { updateCurrentTime(); markTime(); } /* select and copy notes to clipboard */ else if (checkKeyCombo == "Alt+a") { copyNotes(); } else { /* only if note box is not active element */ if (activeID != "noteBox") { /* prevent fullscreen from occuring *//* ************************************** NOTE - THIS DOES NOT WORK ************************* if (currentKeyPress == "f") { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Esc'})); } ************************************** ***************************************/ /* USE VARIABLE FOR CONDITIONS */ let noIgnoredKeys = ignoredKeys.indexOf(event.key) == -1; let notPauseShortcut = checkKeyCombo != "Shift+ "; if (noIgnoredKeys) { if (notPauseShortcut) { noteBox.focus(); } } } } } /* store key press for next key combo check */ sessionStorage.setItem("lastKeyPress", event.key); } /* Add time mark button to the right of textarea. */ function markTime() { noteBox.blur(); /* quickly deactivate note box */ noteBox.setAttribute("disabled", true); if (timePreCal.length == 3) { /* not handling videos over 24 hours - no */ timeSecCal = Number(Number(timePreCal[0]*60) * 60) + /* hours to seconds */ Number(timePreCal[1]*60) + /* minutes to seconds */ Number(timePreCal[2]); /* seconds */ } else if (timePreCal.length == 2) { timeSecCal = Number(timePreCal[0]*60) + /* minutes to seconds */ Number(timePreCal[1]); /* seconds */ } else if (timePreCal.length == 1) { timeSecCal = Number(timePreCal[0]); /* seconds */ } let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); let timeMarkButtonArea; if (!timeMarkButtonAreaID) { /* create area for time mark buttons */ let timeMarkDiv = /* parent for time mark box */ document.createElement("div"); timeMarkButtonArea = /* time mark box - parent for timemarks */ document.createElement("span"); timeMarkButtonArea.id = "timeMarkButtonArea"; /* insert time mark box parent div */ noteBoxDiv.insertAdjacentElement("afterend", timeMarkDiv); /* insert time mark box */ timeMarkDiv.insertAdjacentElement("afterbegin", timeMarkButtonArea); } let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCal); let curTimeMarkBtn; if (!curTimeMarkBtnID) { /* create time mark buttons */ let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); curTimeMarkBtn = /* time mark linking tom marked times */ document.createElement("a"); curTimeMarkBtn.id = /* give each a unique id */ "timeMarkBtn" + timeSecCal; /* open link in new tab - _blank */ curTimeMarkBtn.target = "_blank"; let vidURL = location.href; /* extract current url */ /* conditions if url did not already have time value */ if (vidURL.indexOf("&t=") > -1) { /* had time value */ vidURL = vidURL.replace(/t=[0-9]+/, "t=" + timeSecCal); } else { /* no time value */ vidURL = vidURL + "&t=" + timeSecCal + "s"; } curTimeMarkBtn.href = vidURL; /* use hour : minutes: seconds */ for (i in timePreCal) { if (i == Number(timePreCal.length-1)) { if (Number(timePreCal.length-1) == 0) { curTimeMarkBtn.innerText = "0:" + timePreCal[i]; } else { curTimeMarkBtn.innerText += timePreCal[i]; } } else { curTimeMarkBtn.innerText += timePreCal[i] + ":"; } } timeMarkButtonAreaID.insertAdjacentElement("beforeend", curTimeMarkBtn); } /* focus back on note box */ noteBox.removeAttribute("disabled"); noteBox.focus(); } /* Begin taking notes. */ noteBox.focus(); /* Quickly get back to notes */ const addKeyDown = () => { document.body.addEventListener("keydown", function() { keypressToNote(); }); }; const addKeyUp = () => { document.body.addEventListener("keyup", function() { keypressToNote(); }); }; addKeyDown();})();
```
</details>
</dd></dl></dd></dl>

</div>

<hr><br>

# Window Bookmarklets
<div>
The below bookmarklets pertain to the browser window object, enabling user experience \(<em>UX</em>\) customization.

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
</div>


<hr><br>