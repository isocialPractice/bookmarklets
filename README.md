# Browser Bookmarklets

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
<strong>IMPORTANT</strong> - Ensure final JS is condensed (<em>one line little space</em>):

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
<br>

<strong>Condensed Ready:</strong>
```markdown
javascript:(function() {  })();
```

## Navigation Sidebar Bookmarklets
The below bookmarklets are for pages withe a side nav with many links.
Copy and paste (<em>making any needed adjustments</em>) to use.

### Highlight Current Page:
If a page has side navigation that doesn't hightlight the current page
then use this bookmarklet:
<details>

<summary>nav_Sidebar_HighlightCurrentPage.js</summary>
<br>

Gist page for [nav_Sidebar_HighlightCurrentPage.js](https://gist.github.com/jhauga/716cd39dc31ac9f607993f709cc48f60)

```markdown
javascript:(function(){var styleBackground="white";/*<<--CHANGE*/var styleColor="black";/*<<--CHANGE*/var pathName=location.pathname;var allATags=document.getElementsByTagName("a");for(i=0;i<allATags.length;i++){let currentATag=allATags[i];let currentHref=currentATag.href;if(currentHref.indexOf(pathName)>-1){currentATag.style.background=styleBackground;currentATag.style.color=styleColor;}}})();
```

</details>

## Site Specific Bookmarklets:
### ChatGPT - Bookmark a specific response
Bookmark ChatGPT response as basic text or HTML. Change variable textOut to 1 for text and 0 for HTML.
<details>

<summary>siteSpecific_chatGPT_BookmarkResponse.js</summary>
<br>

Gist page for [siteSpecific_chatGPT_BookmarkResponse.js](https://gist.github.com/jhauga/328eccd84d072664c68bf2079fd11bab)

```markdown
javascript:(function(){var textOut=0;var rawText="PASTE_RESPONSE";var htmlOut;if(textOut==1){htmlOut=0;}else{htmlOut=1;}var styleEl="<style>p, ol, ul { +  max-width: 90%; } p {  line-height: 18pt;  font-size: 16pt; } ol, ul {  margin: 10px 3px; } ul {  list-style: disc; } li {  margin: 3px 0;  font-size: 14pt; } div div, pre div {  background:black;  color:white;  max-width: 800px;  margin:0 10px;  overflow:auto } div pre {  padding-left:10px }</style>";let onWord=0;var splitMarks="--__EDjr1DZD--split--EDjr1DZD__--";var makeMarks=function(splitChar){if(splitChar==undefined){splitChar="";}rawText=rawText.replace(/\n/g,"\\n");rawText=rawText.replace(/```[^```]*```|&lt;[^&]*&gt;|\;/g,function(match){if(match===";"){return";\n";}return match;});rawText=rawText.replace(/([0-9]+)/g,"  $1");rawText=rawText.replace(/(\w[:'"`])\.([A-Z])/g,"$1. $2");rawText=rawText.replace(/(```)*([{](?![a-zA-Z]))/g,"$1$2 \n");rawText=rawText.replace(/(```)*([}](?![ }]))/g,"$1 \n $2 \n");let checkEx=1;let onoff=0;while(checkEx==1){if(rawText.indexOf("```")>-1){checkEx=1;if(onoff==0){if(textOut==1){rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","<hr><div><code>");}else{rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","<hr><div><pre><code>");}onoff=1;}else{if(textOut==1){rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","</code></div><hr>");}else{rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","</code></pre></div><hr>");}onoff=0;}}else{checkEx=0;}}rawText=rawText.replace(/ {2,}([0-9]+)/g,splitChar+"\n\n$1 ");rawText=rawText.replace(/ {2,}(-)/g,splitChar+"\n$1");rawText=rawText.replace(/: {2,}/g,splitChar+"\n");rawText=rawText.replace(/ {2,}/g,"__"+splitChar+"__"+" \n\n");let tempSplitWord=new RegExp("__"+splitChar+"__","g");let extractCodeText=rawText.substring(rawText.indexOf("<code>")+6,rawText.lastIndexOf("</code>")-7);let tempText=extractCodeText.replace(tempSplitWord,"");tempText=tempText.replace(/\*\*/g,"");rawText=rawText.replace(extractCodeText,tempText);if(htmlOut==1){rawText=rawText.replace(/\\n/g,splitMarks+"--NEW-LINE");rawText=rawText.replace(/\n/g,"<br>");let splitMarkNewLine=new RegExp(splitMarks+"--NEW-LINE","g");rawText=rawText.replace(splitMarkNewLine,"\\n");rawText=rawText.replace(/\*\*/g," ** ");}};var checkNest=function(){if(liHTML==1){nestedList=1;}};var checkState=function(swOne,swTwo,htmlOne,htmlTwo){checkNest();outText+=htmlOne+htmlTwo;};var parseHTML=function(cw){outText+=cw+" ";};let setMaxWords=25,count=1;let outText="";if(textOut==1){outText="<pre>";makeMarks(splitMarks);}else{outText="<div>";makeMarks(splitMarks);}let rawTextArr=rawText.split(" ");for(i in rawTextArr){if(textOut==1){if(rawTextArr[i].indexOf("\n")>-1){count=1;}if(count>=setMaxWords){outText+="\n"+rawTextArr[i]+" ";count=1;}else{outText+=rawTextArr[i]+" ";count+=1;}if(i==rawTextArr.length-1){outText+=rawTextArr[i]+"</pre>";}}else{parseHTML(rawTextArr[i]);if(rawTextArr[i].indexOf("<br>")>-1){count=1;}if(count>=setMaxWords){outText+="<br>";count=1;}else{count+=1;}if(i==rawTextArr.length-1){outText+=rawTextArr[i]+"</div>";}}}if(textOut==1){let splitReg=new RegExp("__"+splitMarks+"__","g");outText=outText.replace(splitReg,"");let splitRegII=new RegExp(splitMarks,"g");outText=outText.replace(splitRegII,"");}else{let splitReg=new RegExp("__"+splitMarks+"__","g");outText=outText.replace(splitReg,"<br>");let splitRegII=new RegExp(splitMarks,"g");outText=outText.replace(splitRegII,"");outText=outText.replace(/\*\* <br>/g,"</strong><br>");outText=outText.replace(/ \*\* :/g,"</strong>: ");outText=outText.replace(/\*\* /g,"<strong>");outText=outText.replace(/\.([A-Z])/g,". $1");}document.write(styleEl+outText);})();
```
</details>

### ChatGPT - Resize Prompt
Resize the ChatGPT text prompt.
<details>

<summary>siteSpecific_chatGPT_ResizePrompt.js</summary>
<br>

Gist page for [siteSpecific_chatGPT_ResizePrompt.js](https://gist.github.com/jhauga/edf8e8a842ebe8b00e1a5ff3ec24892c)

```markdown
javascript:(function(){var promptTextarea=document.getElementById("prompt-textarea");var subButton=promptTextarea.nextElementSibling;promptTextarea.style.resize="horizontal";promptTextarea.style.padding="100px";subButton.style.right="unset";subButton.style.left="10px";subButton.style.bottom="0px";subButton.style.width="50px";subButton.style.height="50px";})();
```

</details>