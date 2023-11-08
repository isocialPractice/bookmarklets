# Browser Bookmarklets ![repo icon](!favicon.png)
<div>
<details>
<summary>Document Navigation: </summary>

- [Navigation Bookmarklets](#navigation-bookmarklets)
  - [Highlight Current Page](#highlight-current-page)
  - [Underline Anchor Linke](#underline-anchor-link)
- [Site Specific Bookmarklets](#site-specific-bookmarklets)
  - [ChatGPT - Bookmark a specific response](#chatgpt---bookmark-a-specific-response)
  - [ChatGPT - Resize Prompt](#chatgpt---resize-prompt)
  - [GitHub - Alternate Row Color](#github---alternate-row-color)
  - [GitHub - Show File Size](#github---show-file-size)
</details>
</div>

<div>
This is a running list of browser bookmarklets. Below each listed 
bookmarklet is a collapsible section with the bookmarklet ready 
to copy and paste. The root of the repo contains the bookmarklets
ready to use. In the folder JSFormatted are the bookmarklets as 
uncondensed JavaScript.

<em>ctrl + click</em> for more info on [Browser Bookmarklets](https://subsimple.com/bookmarklets/index.php). <br>
<em>ctrl + click</em> for more info on [Making Bookmarklets](https://gist.github.com/caseywatts/c0cec1f89ccdb8b469b1).

In short a bookmarklet is saved as a browser bookmark, but in 
lieu of URL is condensed JavaScript. When on a page select the
bookmark (<em>best to have bookmarklets on bookmark bar</em>) where
the bookmarklet was saved. This will then change the current page in
the browser according to the bookmarket's JavaScript. Below are two 
blank canvas bookmarklet ready to copy/paste: <br>
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

# Navigation Bookmarklets:
<div>
The below bookmarklets are for pages withe a side nav with many links.
Copy and paste (<em>making any needed adjustments</em>) to use.

Highlight Current Page:
----
<dl><dd><dl><dd>
If a page has side navigation that doesn't hightlight the current page
then use this bookmarklet: <br><br>

<strong>USE - AS IS</strong>
<details>

<summary>nav_Sidebar_HighlightCurrentPage.js</summary><br>

Gist page for [nav_Sidebar_HighlightCurrentPage.js](https://gist.github.com/jhauga/716cd39dc31ac9f607993f709cc48f60)

```markdown
javascript:(function(){var styleBackground="white";/*<<--CHANGE*/var styleColor="black";/*<<--CHANGE*/var pathName=location.pathname;var allATags=document.getElementsByTagName("a");for(i=0;i<allATags.length;i++){let currentATag=allATags[i];let currentHref=currentATag.href;if(currentHref.indexOf(pathName)>-1){currentATag.style.background=styleBackground;currentATag.style.color=styleColor;}}})();
```
</details>
</dd></dl></dd></dl>

Underline Anchor Link:
----
<dl><dd><dl><dd>
If a page has a side navigation with many anchor links, which do not underline
when clicked use this bookmarklet: <br><br>

<strong>USE - AS IS</strong>
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

# Site Specific Bookmarklets:
<div>
The below bookmarklets will only work when used on the website specified.

ChatGPT - Bookmark a specific response
----
<dl><dd><dl><dd>
Bookmark ChatGPT response as basic text or HTML. Change variable textOut to 1 for text and 0 for HTML.
If any error, escape quotes and special characters in text and repaste. <br><br>

<strong>USE - STEPS </strong>
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
javascript:(function(){var rawText="PASTE_RESPONSE";var textOut=0;var changeTitle="DEFAULT_TITLE";var htmlOut;if(textOut==1){htmlOut=0;}else{htmlOut=1;}var styleEl="<style>p, ol, ul { +  max-width: 90%; } p {  line-height: 18pt;  font-size: 16pt; } ol, ul {  margin: 10px 3px; } ul {  list-style: disc; } li {  margin: 3px 0;  font-size: 14pt; } div div, pre div {  background:black;  color:white;  max-width: 800px;  margin:0 10px;  overflow:auto } div pre {  padding-left:10px }</style>";let onWord=0;var makeMarks=function(){rawText=rawText.replace(/\n/g,"\\n");rawText=rawText.replace(/(([0-9]+)\.)/g,"  $1");rawText=rawText.replace(/(\w[:'"`])\.([A-Z])/g,"$1. $2");rawText=rawText.replace(/```((html)|(css)|(javascript)|(python)|(java)|(c\+\+)|(c#)|(ruby)|(php)|(sql)|(bash)|(json)|(xml)|(typescript)|(swift)|(go)|(rust)|(perl)|(powershell)|(shell script)|(docker)|(git)|(rest api)|(node.js)|(react)|(angular)|(vue.js)|(express.js)|(django)|(flask)|(ruby on rails)|(spring boot)|(database)|(file handling)|(error handling)|(loop)|(function)|(class)|(interface)|(unit test)|(event handling)|(dom manipulation)|(regular expression)|(configuration)|(authentication)|(authorization)|(networking)|(file upload)|(data retrieval)|(sorting)|(batch)|(recursion)|(sorting algorithms)|(data structures)|(linked list)|(tree traversal)|(graph algorithms)|(algorithm optimization)|(memory management)|(multithreading)|(parallel computing)|(asynchronous programming)|(object-oriented programming)|(design patterns)|(dependency injection)|(code refactoring)|(unit testing framework)|(code analysis)|(performance profiling)|(garbage collection)|(virtualization)|(api integration)|(websockets)|(regular expression)|(functional programming)|(code comments)|(network configuration)|(firewall setup)|(dns configuration)|(vpn configuration)|(cybersecurity)|(cloud computing)|(virtual private cloud \(vpc\))|(database management)|(data backup)|(server administration)|(system monitoring)|(containerization)|(devops)|(load balancing)|(infrastructure as code)|(data migration)|(incident response)|(network security)|(it compliance)|(cloud services)|(software deployment)|(it documentation)|(backup and recovery)|(disaster recovery)|(it policies and procedures)|(batch file basics)|(batch file variables)|(if statements)|(conditional[s])|(for loop[s])|(while loop[s])|(file and folder operations)|(environment variables)|(batch file input)|(batch file output)|(user account management)|(registry editing)|(task scheduling)|(windows services)|(error handling)|(text file processing)|(string manipulation)|(batch file functions)|(windows event logs)|(network configuration)|(powershell scripting)|(windows security policies)|(active directory operations)|(windows script host)|(windows management instrumentation \(wmi\))|(remote desktop connection)|(windows command prompt tips)|(mac and linux command line titles:)|(basic command line navigation)|(file and directory operations)|(text file processing)|(permissions and ownership)|(process management)|(package management \(apt, yum, brew\))|(scripting with bash)|(command substitution)|(shell script debugging)|(regular expressions in the command line)|(input and output redirection)|(pipes and filters)|(environment variables)|(shell script functions)|(cron jobs and scheduling)|(ssh and remote access)|(file compression and archiving)|(system monitoring \(top, ps\))|(networking and ip configuration)|(system updates and upgrades)|(disk space management)|(file system analysis)|(text processing with awk)|(version control \(git\))|(container management \(docker\))|(boolean)|(variable)|(function)|(switch)|(object)|(variable[s])|(array[s])|(function[s])|(class[s])|(object[s])|(method[s])|(loop[s])|(conditional[s])|(string[s])|(integer[s])|(float[s])|(boolean[s])|(pointer[s])|(enumeration[s])|(inheritance[s])|(interface[s])|(exception[s])|(module[s])|(library[s])|(package[s])|(import[s])|(return[s])|(parameter[s])|(operator[s])|(assignment[s])|(declaration[s])|(data type[s])|(statement[s])|(comment[s])|(syntax[s])|(expression[s])|(recursion[s])|(constructor[s])|(destructor[s])|(collection[s])|(hash table[s])|(linked list[s])|(queue[s])|(stack[s])|(dictionary[s])|(set[s])|(tuple[s])|(lambda[s])|(callback[s])|(closure[s])|(event[s])|(thread[s])|(mutex[s])|(semaphore[s])|(singleton[s]))/g,"```");rawText=rawText.replace(/(```)*((\{(?![a-zA-Z]))|(\[)|(\()) {1,}/g,"$1$2\n  ");rawText=rawText.replace(/(```)*(( {1,}\})|( {1,}\])|( {1,}\)))/g,"$1$2 \n  ");rawText=rawText.replace(/(((?!`)(&lt;\/[a-zA-Z]+&gt;)|(&lt;[a-zA-Z]+&gt;)(?!`)))/g,"$1<br>");rawText=rawText.replace(/(?!\()(\$[a-zA-Z]+)/g,"<br>$1");let checkEx=1;let onoff=0;while(checkEx==1){if(rawText.indexOf("**")>-1){if(onoff==0){rawText=rawText.replace("**","<strong>");onoff=1;}else{rawText=rawText.replace("**","</strong>: ");onoff=0;}}else{checkEx=0;}}checkEx=1;onoff=0;while(checkEx==1){if(rawText.indexOf("```")>-1){checkEx=1;if(onoff==0){if(textOut==1){rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","<hr><div><code>");}else{rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","<hr><div><pre><code>");}onoff=1;}else{if(textOut==1){rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","</code></div><hr>");}else{rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","</code></pre></div><hr>");}onoff=0;}}else{checkEx=0;}}rawText=rawText.replace(/ {2,}([0-9]+)/g,"\n\n$1 ");rawText=rawText.replace(/ {2,}(-)/g,"\n$1");rawText=rawText.replace(/: {2,}/g,"\n");rawText=rawText.replace(/ {2,}/g," \n\n");if(htmlOut==1){rawText=rawText.replace(/\n/g,"<br>");}};var checkNest=function(){if(liHTML==1){nestedList=1;}};var checkState=function(swOne,swTwo,htmlOne,htmlTwo){checkNest();outText+=htmlOne+htmlTwo;};let setMaxWords=25,count=1;var parseHTML=function(cw,curCount){outText+=cw+" ";count=curCount;};let outText="";if(changeTitle=="DEFAULT_TITLE"){outText="<h1>ChatGPT Bookmarklet Response</h1><hr>";}else{outText="<h1>"+changeTitle+"</h1><hr>";}if(textOut==1){outText+="<pre>";makeMarks();}else{outText+="<div>";makeMarks();}let rawTextArr=rawText.split(" ");for(i in rawTextArr){if(rawTextArr[i].indexOf("\n")>-1||rawTextArr[i].indexOf("<br>")>-1){count=1;}if(textOut==1){if(count>=setMaxWords){parseHTML("\n"+rawTextArr[i],1);}else{parseHTML(rawTextArr[i],Number(count+1));}}else{if(count>=setMaxWords){parseHTML("<br>"+rawTextArr[i],1);}else{parseHTML(rawTextArr[i],Number(count+1));}}}if(textOut==1){outText+="</pre>";}else{outText+="</div>";}outText=outText.replace(/\.([A-Z])/g,". $1");document.write(styleEl+outText);})();
```
</details>
</dd></dl></dd></dl>

ChatGPT - Resize Prompt
----
<dl><dd><dl><dd>
Resize the ChatGPT text prompt. <br><br>

<strong>USE - AS IS</strong>
<details>

<summary>siteSpecific_chatGPT_ResizePrompt.js</summary><br>

Gist page for [siteSpecific_chatGPT_ResizePrompt.js](https://gist.github.com/jhauga/edf8e8a842ebe8b00e1a5ff3ec24892c)

```markdown
javascript:(function(){var promptTextarea=document.getElementById("prompt-textarea");var subButton=promptTextarea.nextElementSibling;var parElement=promptTextarea.parentElement;var grandParElement=parElement.parentElement;grandParElement.style.transform="rotateX(180deg)";grandParElement.style.overflow="auto";grandParElement.style.resize="both";grandParElement.style.minHeight="40px !important";grandParElement.style.maxHeight="775px !important";grandParElement.style.minWidth="280px !important";grandParElement.style.maxWidth="95% !important";parElement.style.display="inline-block";parElement.style.transform="rotateX(180deg)";parElement.style.minWidth="100%";parElement.style.maxWidth="100%";parElement.style.height="95%";parElement.style.minHeight="95%";promptTextarea.style.paddingRight="100px";promptTextarea.style.paddingLeft="30px";promptTextarea.style.width="100% !important";var neededStyling=document.createElement("style");neededStyling.innerHTML="textarea#prompt-textarea {   max-height: 800px !important;   min-height: 100% !important;   overflow: scroll !important;  }  form div.relative.flex.h-full.flex-1 div + div.flex.w-full.items-center {   min-height: 40px !important;   max-height: 775px !important;   min-width: 280px !important;   max-width: 95% !important;  } ";document.body.appendChild(neededStyling);})();
```
</details>
</dd></dl></dd></dl>

GitHub - Alternate Row Color:
----
<dl><dd><dl><dd>
Alternate the row colors of repo directory. Activate in repo root and file viewing. Works with:

1. GitHub - Show File Size 

<strong>USE - AS IS</strong>
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

<strong>USE - AS IS</strong>
<details>

<summary>siteSpecific_GitHub_ShowFileSize.js</summary><br>

Gist page for [siteSpecific_GitHub_ShowFileSize.js](https://gist.github.com/jhauga/247e43f74af2f196309d5746710899ae)

```markdown
javascript:(function(){var tableRow,tableRowLen,thead,curPage,curExtract,curUser,curRepo;var sizeTH,sizeIDTH,sizeTD,sizeTDID,indexSizeID=0,fileName,unit;var onRoot=0,tablePage=1,apiRoot,curAPI,mapAPI;var firstLoad=0,curDir=window.location.href,turnOff,firstRun,fileSizeHasID,reGetAPIJSON,sessionNeedsResetting=0;if(sessionStorage.getItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize")==null){sessionStorage.setItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize","1");firstRun=sessionStorage.getItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize");let makeCheckForSessionReset=document.createElement("span");makeCheckForSessionReset.style.display="none";makeCheckForSessionReset.id="checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting";let findRightTable=document.getElementsByTagName("table");let findRightTableLen=findRightTable.length;for(i=0;i<findRightTableLen;i++){let tablePar=findRightTable[i].parentElement;if(findRightTable[i]=="div"){findRightTable[i].insertAdjacentElement("afterend",makeCheckForSessionReset);}}}else{firstRun=0;}var setGlobals=function(){curPage=location.host+location.pathname;apiRoot="https://api.github.com/repos";if(curPage.indexOf("github.com")>-1){let checkRoleRow=document.querySelectorAll('div[role="row"]');if(curPage.indexOf("tree")>-1){if(checkRoleRow.length>=1){onRoot=1;tablePage=0;}else{onRoot=0;tablePage=1;}}else{if(checkRoleRow.length>=1){onRoot=1;tablePage=0;}else{onRoot=0;tablePage=1;}}if(onRoot==0&&tablePage==1){tableRow=document.getElementsByTagName("tr");tableRowLen=tableRow.length;}else{tableRow=document.querySelectorAll('div[role="row"]');tableRowLen=tableRow.length;}turnOff=0;curExtract=curPage.substr(curPage.indexOf("/")+1);curUser=curExtract.substr(0,curExtract.indexOf("/"));curExtract=curExtract.substr(curExtract.indexOf("/")+1);if(curExtract.indexOf("/")==-1||curExtract.substr(curExtract.indexOf("/")+1).split("/").length==2){onRoot=1;if(curExtract.substr(curExtract.indexOf("/")+1).split("/").length==2){curRepo=curExtract.substr(0,curExtract.indexOf("/"));}else{curRepo=curExtract;}}else{curRepo=curExtract.substr(0,curExtract.indexOf("/"));}if(onRoot==0){curExtract=curExtract.substr(curExtract.substr(curRepo.length+1).indexOf("tree/")+((curRepo.length+1)+5));curExtract=curExtract.substr(curExtract.indexOf("/")+1);}else{curExtract="";}curAPI=apiRoot+"/"+curUser+"/"+curRepo+"/contents/"+curExtract;}else{turnOff=1;return;}};var addSizeCol=function(cur){if(turnOff==1){return;}if(firstRun!=0){console.log("Add file size bookmarklet running:");}let resetFileSize=function(){firstLoad=0;indexSizeID=0;let fileSizeHasID=0;let dataFileSize=document.querySelectorAll("data-file-size");let dataFileSizeLen=dataFileSize.length;for(r=0;r<dataFileSizeLen;r++){let curdataFileSize=dataFileSize[r].id;if(curdataFileSize.indexOf("fileSize-__-unlikely-name-__-fileSize")>-1){fileSizeHasID=1;let curindexSizeID=document.getElementById(curdataFileSize);curindexSizeID.remove();}else{continue;}}reGetAPIJSON=async function(api){let a=await fetch(api);let b=await a.text();let c=await JSON.parse(b);let d=await addSizeCol(c);};};let repoRoot=function(curI){if(tableRow[curI]&&tableRow[curI].hasChildNodes()){sizeTD=document.createElement("div");sizeTD.style.margin="0 60px";sizeTD.style.width="10%";tableRow[curI].children[1].style.width="35%";if(tableRow[curI].children.length>1&&tableRow[curI].children[1]){if(tableRow[curI].innerHTML.indexOf('aria-label="Directory"')==-1){sizeTD.dataset.fileSize="1";fileName=tableRow[curI].children[1].innerText;for(j in cur){if(cur[j].name==fileName){sizeTD.innerText=cur[j].size<1024?cur[j].size+" B":(cur[j].size<1048576?(unit=" KiB",cur[j].size/=1024):cur[j].size<1073741824?(unit=" MiB",cur[j].size/=1048576):(unit=" GiB",cur[j].size/=1073741824),cur[j].size.toFixed(1)+unit);}}sizeTD.id="fileSize-__-unlikely-name-__-fileSize"+indexSizeID;indexSizeID++;}else{sizeTD.innerText="";}tableRow[curI].children[1].insertAdjacentElement("afterend",sizeTD);}}};for(i=0;i<tableRowLen;i++){if(i==0){if(tablePage==1){if(firstLoad==0){let checkTHID=document.getElementById("sizeCol--__-unlikely_-_name-__--sizeCol");if(!checkTHID){sizeTH=document.createElement("th");sizeTH.innerHTML="Size";sizeTH.style.width="10%";sizeTH.id="sizeCol--__-unlikely_-_name-__--sizeCol";tableRow[i].children[1].insertAdjacentElement("afterend",sizeTH);tableRow[i].children[1].style.width="30%";}}}else{repoRoot(i);}}else{if(i==1){if(tablePage==1){if(firstLoad==0){tableRow[i].children[0].setAttribute("colspan","4");firstLoad=1;}else{resetFileSize();if(fileSizeHasID==1){setTimeout(function(){setGlobals();},500);if(turnOff==0){setTimeout(function(){reGetAPIJSON(curAPI);},1000);}break;}}}else{if(firstLoad==0){repoRoot(i);}else{resetFileSize();if(fileSizeHasID==1){setTimeout(function(){setGlobals();},500);if(turnOff==0){setTimeout(function(){reGetAPIJSON(curAPI);},1000);}break;}}}}else{if(tablePage==1){sizeTD=document.createElement("td");if(tableRow[i]&&tableRow[i].hasChildNodes()){if(tableRow[i].children.length>1&&tableRow[i].children[1]){if(tableRow[i].innerText.indexOf("(Directory)")==-1){sizeTD.dataset.fileSize="1";fileName=tableRow[i].children[1].innerText;fileName=fileName.substr(0,fileName.indexOf("\n"));for(j in cur){if(cur[j].name==fileName){sizeTD.innerText=cur[j].size<1024?cur[j].size+" B":(cur[j].size<1048576?(unit=" KiB",cur[j].size/=1024):cur[j].size<1073741824?(unit=" MiB",cur[j].size/=1048576):(unit=" GiB",cur[j].size/=1073741824),cur[j].size.toFixed(1)+unit);}}sizeTD.id="fileSize-__-unlikely-name-__-fileSize"+indexSizeID;indexSizeID++;}else{sizeTD.innerText="";}tableRow[i].children[1].insertAdjacentElement("afterend",sizeTD);}}}else{repoRoot(i);}}}}};var getAPIJSON=async function(api){let a=await fetch(api);let b=await a.text();let c=await JSON.parse(b);let d=await addSizeCol(c);};var runBookmarklet=function(){setGlobals();if(turnOff==0){setTimeout(function(){getAPIJSON(curAPI);},1000);}else{return;}};if(firstRun==1){runBookmarklet();}else{let checkIfSessionNeedsResetting=document.getElementById("checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting");if(!checkIfSessionNeedsResetting){sessionNeedsResetting=1;}}var checkForChangeDir=function(){if(curDir!==window.location.href&&turnOff==0){curDir=window.location.href;runBookmarklet();}if(turnOff==0){setTimeout(checkForChangeDir,1000);}else{console.log("Add file size bookmarklet did not run:");return;}};if(sessionNeedsResetting==1){sessionNeedsResetting=0;sessionStorage.removeItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize");firstRun=1;runBookmarklet();}if(turnOff==0){checkForChangeDir();}else{console.log("Add file size bookmarklet is not running:");return;}})();
```
</details>
</dd></dl></dd></dl>

</div>
<hr><br>