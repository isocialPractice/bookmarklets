javascript:(function(){var textOut=0;var rawText="PASTE_RESPONSE";var htmlOut;if(textOut==1){htmlOut=0;}else{htmlOut=1;}var styleEl="<style>p, ol, ul { +  max-width: 90%; } p {  line-height: 18pt;  font-size: 16pt; } ol, ul {  margin: 10px 3px; } ul {  list-style: disc; } li {  margin: 3px 0;  font-size: 14pt; } div div, pre div {  background:black;  color:white;  max-width: 800px;  margin:0 10px;  overflow:auto } div pre {  padding-left:10px }</style>";let onWord=0;var splitMarks="--__EDjr1DZD--split--EDjr1DZD__--";var makeMarks=function(splitChar){if(splitChar==undefined){splitChar="";}rawText=rawText.replace(/\n/g,"\\n");rawText=rawText.replace(/```[^```]*```|&lt;[^&]*&gt;|\;/g,function(match){if(match===";"){return";\n";}return match;});rawText=rawText.replace(/([0-9]+)/g,"  $1");rawText=rawText.replace(/(\w[:'"`])\.([A-Z])/g,"$1. $2");rawText=rawText.replace(/(```)*([{](?![a-zA-Z]))/g,"$1$2 \n");rawText=rawText.replace(/(```)*([}](?![ }]))/g,"$1 \n $2 \n");let checkEx=1;let onoff=0;while(checkEx==1){if(rawText.indexOf("```")>-1){checkEx=1;if(onoff==0){if(textOut==1){rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","<hr><div><code>");}else{rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","<hr><div><pre><code>");}onoff=1;}else{if(textOut==1){rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","</code></div><hr>");}else{rawText=rawText.replace("``` ","```");rawText=rawText.replace(" ```","```");rawText=rawText.replace("```","</code></pre></div><hr>");}onoff=0;}}else{checkEx=0;}}rawText=rawText.replace(/ {2,}([0-9]+)/g,splitChar+"\n\n$1 ");rawText=rawText.replace(/ {2,}(-)/g,splitChar+"\n$1");rawText=rawText.replace(/: {2,}/g,splitChar+"\n");rawText=rawText.replace(/ {2,}/g,"__"+splitChar+"__"+" \n\n");let tempSplitWord=new RegExp("__"+splitChar+"__","g");let extractCodeText=rawText.substring(rawText.indexOf("<code>")+6,rawText.lastIndexOf("</code>")-7);let tempText=extractCodeText.replace(tempSplitWord,"");tempText=tempText.replace(/\*\*/g,"");rawText=rawText.replace(extractCodeText,tempText);if(htmlOut==1){rawText=rawText.replace(/\\n/g,splitMarks+"--NEW-LINE");rawText=rawText.replace(/\n/g,"<br>");let splitMarkNewLine=new RegExp(splitMarks+"--NEW-LINE","g");rawText=rawText.replace(splitMarkNewLine,"\\n");rawText=rawText.replace(/\*\*/g," ** ");}};var checkNest=function(){if(liHTML==1){nestedList=1;}};var checkState=function(swOne,swTwo,htmlOne,htmlTwo){checkNest();outText+=htmlOne+htmlTwo;};var parseHTML=function(cw){outText+=cw+" ";};let setMaxWords=25,count=1;let outText="";if(textOut==1){outText="<pre>";makeMarks(splitMarks);}else{outText="<div>";makeMarks(splitMarks);}let rawTextArr=rawText.split(" ");for(i in rawTextArr){if(textOut==1){if(rawTextArr[i].indexOf("\n")>-1){count=1;}if(count>=setMaxWords){outText+="\n"+rawTextArr[i]+" ";count=1;}else{outText+=rawTextArr[i]+" ";count+=1;}if(i==rawTextArr.length-1){outText+=rawTextArr[i]+"</pre>";}}else{parseHTML(rawTextArr[i]);if(rawTextArr[i].indexOf("<br>")>-1){count=1;}if(count>=setMaxWords){outText+="<br>";count=1;}else{count+=1;}if(i==rawTextArr.length-1){outText+=rawTextArr[i]+"</div>";}}}if(textOut==1){let splitReg=new RegExp("__"+splitMarks+"__","g");outText=outText.replace(splitReg,"");let splitRegII=new RegExp(splitMarks,"g");outText=outText.replace(splitRegII,"");}else{let splitReg=new RegExp("__"+splitMarks+"__","g");outText=outText.replace(splitReg,"<br>");let splitRegII=new RegExp(splitMarks,"g");outText=outText.replace(splitRegII,"");outText=outText.replace(/\*\* <br>/g,"</strong><br>");outText=outText.replace(/ \*\* :/g,"</strong>: ");outText=outText.replace(/\*\* /g,"<strong>");outText=outText.replace(/\.([A-Z])/g,". $1");}document.write(styleEl+outText);})();