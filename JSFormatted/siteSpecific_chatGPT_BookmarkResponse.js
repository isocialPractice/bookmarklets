javascript:(function(){ 
 var rawText = "PASTE_RESPONSE"; 
 /* Output type switches */
 var textOut = 0; /* change to 1 for raw text output */
 var changeTitle = "DEFAULT_TITLE"; /* puts out default if not changed */
 /* If no code box, then just pasting should work. If code box ensure special characters escaped. Paste response below and leave as is. */ 
 var htmlOut; /* set by textOut */
 if (textOut == 1) {
  htmlOut = 0;
 } else {
  htmlOut = 1;
 }
 /*style*/
 var styleEl = 
"<style>p, ol, ul { +  max-width: 90%; } p {  line-height: 18pt;  font-size: 16pt; } ol, ul {  margin: 10px 3px; } ul {  list-style: disc; } li {  margin: 3px 0;  font-size: 14pt; } div div, pre div {  background:black;  color:white;  max-width: 800px;  margin:0 10px;  overflow:auto } div pre {  padding-left:10px }</style>";
 /* Switch variables */
 let onWord = 0;
 /* Support function */
 var makeMarks = function () {
  rawText = rawText.replace(/\n/g, "\\n");
  rawText = rawText.replace(/(([0-9]+)\.)/g, "  $1");
  rawText = rawText.replace(/(\w[:'"`])\.([A-Z])/g, "$1. $2");
  rawText = rawText.replace(/```((active directory operations)|(algorithm optimization)|(angular)|(api integration)|(array[s])|(assignment[s])|(asynchronous programming)|(authentication)|(authorization)|(backup and recovery)|(bash)|(basic command line navigation)|(batch file basics)|(batch file functions)|(batch file input)|(batch file output)|(batch file variables)|(batch)|(boolean)|(boolean[s])|(c#)|(c\+\+)|(callback[s])|(class)|(class[s])|(closure[s])|(cloud computing)|(cloud services)|(cmd)|(code analysis)|(code comments)|(code refactoring)|(collection[s])|(command substitution)|(comment[s])|(conditional[s])|(conditional[s])|(configuration)|(constructor[s])|(container management \(docker\))|(containerization)|(cron jobs and scheduling)|(css)|(cybersecurity)|(data backup)|(data migration)|(data retrieval)|(data structures)|(data type[s])|(database management)|(database)|(declaration[s])|(dependency injection)|(design patterns)|(destructor[s])|(devops)|(dictionary[s])|(disaster recovery)|(disk space management)|(django)|(dns configuration)|(docker)|(dom manipulation)|(enumeration[s])|(environment variables)|(environment variables)|(error handling)|(error handling)|(event handling)|(event[s])|(excel)|(exception[s])|(express.js)|(expression[s])|(file and directory operations)|(file and folder operations)|(file compression and archiving)|(file handling)|(file system analysis)|(file upload)|(firewall setup)|(flask)|(float[s])|(for loop[s])|(function)|(function)|(function[s])|(functional programming)|(garbage collection)|(git)|(go)|(graph algorithms)|(hash table[s])|(html)|(if statements)|(import[s])|(incident response)|(infrastructure as code)|(inheritance[s])|(input and output redirection)|(integer[s])|(interface)|(interface[s])|(it compliance)|(it documentation)|(it policies and procedures)|(java)|(javascript)|(json)|(lambda[s])|(library[s])|(linked list)|(linked list[s])|(load balancing)|(loop)|(loop[s])|(mac and linux command line titles:)|(memory management)|(method[s])|(module[s])|(multithreading)|(mutex[s])|(network configuration)|(network configuration)|(network security)|(networking and ip configuration)|(networking)|(node.js)|(object)|(object-oriented programming)|(object[s])|(operator[s])|(package management \(apt, yum, brew\))|(package[s])|(parallel computing)|(parameter[s])|(performance profiling)|(perl)|(permissions and ownership)|(php)|(pipes and filters)|(pointer[s])|(powershell scripting)|(powershell)|(process management)|(python)|(queue[s])|(react)|(recursion)|(recursion[s])|(registry editing)|(regular expression)|(regular expression)|(regular expressions in the command line)|(remote desktop connection)|(rest api)|(return[s])|(ruby on rails)|(ruby)|(rust)|(scripting with bash)|(semaphore[s])|(server administration)|(set[s])|(shell script debugging)|(shell script functions)|(shell script)|(singleton[s])|(software deployment)|(sorting algorithms)|(sorting)|(spring boot)|(sql)|(ssh and remote access)|(stack[s])|(statement[s])|(string manipulation)|(string[s])|(swift)|(switch)|(syntax[s])|(system monitoring \(top, ps\))|(system monitoring)|(system updates and upgrades)|(task scheduling)|(text file processing)|(text file processing)|(text processing with awk)|(thread[s])|(tree traversal)|(tuple[s])|(typescript)|(unit test)|(unit testing framework)|(user account management)|(variable)|(variable[s])|(version control \(git\))|(virtual private cloud \(vpc\))|(virtualization)|(vpn configuration)|(vue.js)|(websockets)|(while loop[s])|(windows command prompt tips)|(windows event logs)|(windows management instrumentation \(wmi\))|(windows script host)|(windows security policies)|(windows services)|(xml))/g, "```");
  rawText = rawText.replace(/(```)*((\{(?![a-zA-Z]))|(\[)|(\()) {1,}/g, "$1$2\n  ");
  rawText = rawText.replace(/(```)*(( {1,}\})|( {1,}\])|( {1,}\)))/g, "$1$2 \n  ");
  rawText = rawText.replace(/(((?!`)(&lt;\/[a-zA-Z]+&gt;)|(&lt;[a-zA-Z]+&gt;)(?!`)))/g, "$1<br>");
  rawText = rawText.replace(/(?!\()(\$[a-zA-Z]+)/g, "<br>$1");  
  let checkEx = 1;
  let onoff = 0;
  while (checkEx == 1) {
   if (rawText.indexOf("**") > -1) {
    if (onoff == 0) {
     rawText = rawText.replace("**", "<strong>");
     onoff = 1;
    } else {
     rawText = rawText.replace("**", "</strong>: ");   
     onoff = 0;
    }
   } else {
    checkEx = 0;
   }
  }
  checkEx = 1; onoff = 0;
  while (checkEx == 1) {
   if (rawText.indexOf("```") > -1) {
    checkEx = 1;    
    if (onoff == 0) {     
     if (textOut == 1) {      
      rawText = rawText.replace("``` ", "```"); rawText = rawText.replace(" ```", "```");
      rawText = rawText.replace("```", "<hr><div><code>");            
     } else {      
      rawText = rawText.replace("``` ", "```"); rawText = rawText.replace(" ```", "```");
      rawText = rawText.replace("```", "<hr><div><pre><code>");            
     }
     onoff = 1;
    } else {             
     if (textOut == 1) {
      rawText = rawText.replace("``` ", "```"); rawText = rawText.replace(" ```", "```");
      rawText = rawText.replace("```", "</code></div><hr>");            
     } else {
      rawText = rawText.replace("``` ", "```"); rawText = rawText.replace(" ```", "```");
      rawText = rawText.replace("```", "</code></pre></div><hr>");      
     }
     onoff = 0;
    }
   } else {
    checkEx = 0;
   }
  }
  rawText = rawText.replace(/ {2,}([0-9]+)/g, "\n\n$1 ");
  rawText = rawText.replace(/ {2,}(-)/g, "\n$1");
  rawText = rawText.replace(/: {2,}/g, "\n");
  rawText = rawText.replace(/ {2,}/g, " \n\n");
  if (htmlOut == 1) {   
   rawText = rawText.replace(/\n/g, "<br>");   
  }
 };
 var checkNest = function () {
  if (liHTML == 1) {
   nestedList = 1;
  }
 };
 var checkState = function (swOne, swTwo, htmlOne, htmlTwo) {
  checkNest();
  outText += htmlOne + htmlTwo;
 };
 /* Use for making text. */
 let setMaxWords = 25, count = 1; 
 var parseHTML = function (cw, curCount) {
  /* current word */
  outText += cw + " ";
  count = curCount;
 };
 /* Use for making HTML */
 let outText = "";
 if (changeTitle == "DEFAULT_TITLE") {
  changeTitle = "ChatGPT Bookmarklet Response";
  outText = "<h1>" + changeTitle + "</h1><hr>";
 } else {
  outText = "<h1>" + changeTitle + "</h1><hr>";  
 }
 if (textOut == 1) {
  outText += "<pre>";
  makeMarks();
 } else {
  outText += "<div>";
  makeMarks();
 }
 let rawTextArr = rawText.split(" ");
 for (i in rawTextArr) {
  if (rawTextArr[i].indexOf("\n") > -1 || rawTextArr[i].indexOf("<br>") > -1) {
   count = 1;
  }
  if (textOut == 1) {
   if (count >= setMaxWords) {
    parseHTML("\n" + rawTextArr[i], 1);
   } else {
    parseHTML(rawTextArr[i], Number(count+1));
   }
  } else {   
   if (count >= setMaxWords) {
    parseHTML("<br>" + rawTextArr[i], 1);
   } else {
    parseHTML(rawTextArr[i], Number(count+1));
   }
  }
 }
 if (textOut == 1) {
  outText += "</pre>";
 } else {
  outText += "</div>";
 }
 outText = outText.replace(/\.([A-Z])/g, ". $1");   
 document.write("<title>" + changeTitle + "</title>" + styleEl + outText);
})();