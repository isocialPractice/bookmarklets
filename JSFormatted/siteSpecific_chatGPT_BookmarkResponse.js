javascript:(function(){
/* If no code box, then just pasting should work. If code box ensure special characters escaped. Paste response below and leave as is. */
var rawText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget metus et velit interdum vehicula. Integer tristique odio sit amet libero pellentesque, nec euismod nunc volutpat. Donec a augue in massa volutpat ullamcorper. Cras varius odio ut est interdum, a egestas nulla malesuada. Fusce feugiat, velit ac dignissim vulputate, ligula nunc feugiat tellus, eget convallis felis justo ut massa. Ut dictum est nunc, et eleifend augue efficitur at.    1. **Lorem ipsum dolor**:     - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet, nisl in sodales imperdiet, erat quam fermentum ligula, a sollicitudin dui orci vel nunc.    2. **Lorem ipsum dolor**:     - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ultrices est. Donec porttitor quam sed consectetur venenatis.    3. **Lorem ipsum dolor**:     - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut ultrices ante. Nulla tincidunt, felis eu vulputate viverra.    4. **Lorem ipsum dolor**:     - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula est ut tortor dictum, nec consequat justo semper.    5. **Lorem ipsum dolor**:     - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in mi eget tortor aliquet facilisis.    6. **Lorem ipsum dolor**:     - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam rhoncus nulla sit amet dapibus. Sed eget lorem id arcu egestas euismod.    7. **Lorem ipsum dolor**:     - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id augue vitae eros vehicula tristique. Fusce et augue sed ex ullamcorper facilisis.    8. **Lorem ipsum dolor**:     - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultrices auctor erat, in convallis risus scelerisque ac."; 
/* Output type switches */
var textOut = 0; /* change to 1 for raw text output */
var htmlOut; /* set by textOut */
if (textOut == 1) {
 htmlOut = 0; 
}
else {
 htmlOut = 1;
}
/* Switch variables */
let onWord = 0;
/* Support function */
var splitMarks = "--__EDjr1DZD--split--EDjr1DZD__--";
var makeMarks = function(splitChar) {
 if (splitChar == undefined) { splitChar = ""; }
 rawText = rawText.replace(/\n/g,"\\n");
 rawText = rawText.replace(/```[^```]*```|&lt;[^&]*&gt;|\;/g, function(match) {
  if (match === ";") {
    return ";\n";
  }
  return match;
});
 rawText = rawText.replace(/(```)*([{](?![a-zA-Z]))/g, "$1$2 \n");
 rawText = rawText.replace(/(```)*([}](?![ }]))/g, "$1 \n $2 \n");
 if (textOut == 1) {
  rawText = rawText.replace(/:```/g, "<hr><div style='background:black;color:white'><code>");
  rawText = rawText.replace(/```/g, "</code></div><hr>");
  } else {
  rawText = rawText.replace(/:```/g, "<hr><div style='background:black;color:white;max-width: 800px;margin:0 10px;overflow:auto'><pre><code>");
  rawText = rawText.replace(/```/g, "</code></pre></div><hr>");  
  } 
 rawText = rawText.replace(/ {2,}([0-9]+)/g,splitChar +  "\n\n$1 ");
 rawText = rawText.replace(/ {2,}(-)/g, splitChar + "\n$1");
 rawText = rawText.replace(/: {2,}/g, splitChar+ "\n");
 rawText = rawText.replace(/ {2,}/g, "__"+splitChar+"__"+ " \n\n"); 
 let tempSplitWord = new RegExp("__"+splitChar+"__", "g");
 let extractCodeText = rawText.substring(rawText.indexOf("<code>")+6, rawText.lastIndexOf("</code>")-7); 
 let tempText = extractCodeText.replace(tempSplitWord, ""); 
 tempText = tempText.replace(/\*\*/g, "");
 rawText = rawText.replace(extractCodeText, tempText); 
 if (htmlOut == 1) { 
  rawText = rawText.replace(/\\n/g, splitMarks+"--NEW-LINE");
  rawText = rawText.replace(/\n/g, "<br>");
  let splitMarkNewLine = new RegExp(splitMarks+"--NEW-LINE", "g");
  rawText = rawText.replace(splitMarkNewLine, "\\n" );
  rawText = rawText.replace(/\*\*/g, " ** ");
 }
};
var checkNest = function() {
 if (liHTML == 1) {
  nestedList = 1;
 }
};
var checkState = function(swOne, swTwo, htmlOne, htmlTwo) {
 checkNest(); 
 outText += htmlOne + htmlTwo;
};
var parseHTML = function(cw) { /* current word */
 outText += cw + " ";
};
/* Use for making text. */
let setMaxWords = 25, count = 1;
/* Use for making HTML */
let outText = "";
if (textOut == 1) {
 outText = "<pre>";
 makeMarks(splitMarks);
} else { 
 outText = "<div style='max-width: 90%'>";
 makeMarks(splitMarks);
}
let rawTextArr = rawText.split(" ");
for (i in rawTextArr) {
 if (textOut == 1) {
  if (rawTextArr[i].indexOf("\n") > -1) {
   count = 1;
  }
  if (count >= setMaxWords) {
   outText += "\n" + rawTextArr[i] + " ";
   count = 1;
  } else {
   outText += rawTextArr[i] + " ";
   count+=1;
  } 
  /* leave last in condition */
  if (i == rawTextArr.length - 1) { 
   outText += rawTextArr[i] + "</pre>";
  }  
 } else {    
  parseHTML(rawTextArr[i]);
  if (rawTextArr[i].indexOf("<br>") > -1) {
   count = 1;
  }
  if (count >= setMaxWords) {
   outText += "<br>" ;
   count = 1;
  } else {   
   count+=1;
  }  
  /* leave last in condition */
  if (i == rawTextArr.length - 1) { 
   outText += rawTextArr[i] + "</div>";
  } 
 }
}
if (textOut == 1) {
 let splitReg = new RegExp("__"+splitMarks+"__", "g");
 outText = outText.replace(splitReg, "");
 let splitRegII = new RegExp(splitMarks, "g");
 outText = outText.replace(splitRegII, "");
} else { /*WILL REMOVE WHEN HTML PARSING*/
 let splitReg = new RegExp("__"+splitMarks+"__", "g");
 outText = outText.replace(splitReg, "");
 let splitRegII = new RegExp(splitMarks, "g");
 outText = outText.replace(splitRegII, ""); 
 outText = outText.replace(/\*\* <br>/g, "</strong><br>");
 outText = outText.replace(/\*\* :/g, "</strong>:");
 outText = outText.replace(/\*\* /g, "<strong>"); 
}
document.write(outText);
})(); 