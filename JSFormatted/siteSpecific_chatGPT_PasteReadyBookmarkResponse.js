javascript:(function(){ 
/* Configuration variables. */
 var instructionAlert = 1; /* <-- CONFIGURATION - 1 is on (alert), 0 is off (no alert) */
 var useRunningFix    = 1; /* <-- CONFIGURATION - 1 is on (find and replace), 0 is off */
 var replaceAllRunFix = 1; /* <-- CONFIGURATION - 1 is on (replace all), 0 is off      */
 
 /* Optional variables. */
 var pageTitle = "ChatGPT Bookmark"; /* <-- OPTIONAL - change title */
 var pageHead  = "ChatGPT Response"; /* <-- OPTIONAL - change head  */

 /* DOM variables. */
 /* Class names to identify div that is parent of button row.                  */
 var copyButtonSelector =       /* select copy button by attribute             */
  "[aria-label=\"Copy\"]";  
 
 /* Class names to identify the answer area sibling so answer area can be selected. */
 var answerAreaClassNameIdentifier =  /* HOT-GLUE - likely to change                */
  "mx-[var(--mini-thread-content-inset)]"; 

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
 ***********/
 var RUNNING_FIX = {
 "1": {
  one: "\\",   /* IMPORTANT - this needs to stay */
  two: "&#92;" /* IMPORTANT - this needs to stay */
 },
  "2": {
   one: "&lt;iostream&gt;",
   two: "&lt;iostream&gt;<br>"
  },
  "3": {
   one: " std;",
   two: " std;<br>"
  },
  "4": {
   one: ";\n}",
   two: ";<br>}"
  }
 };

/* Define variables for later use. */  
 var answerRow, buttonRow, copyButton, cancelWhile = 0, 
     answerArea, currentButtonsPath, currentButtonsPathLen, currentButton, 
     currentButtonsPathArr, currentSelection, priorSelection, 
     copyButtonIndex, priorSelectionIndex, pathPar, 
     pathGrandPar, pathGreatGrandPar;
     
 /* Select all copy buttons and use in loop. */
 currentButtonsPath = document.querySelectorAll(copyButtonSelector);
 currentButtonsPathLen = currentButtonsPath.length; 
 
 /* Style the bookmarked page. */
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
 p code {    
  color: black;
  font-size: 12pt;
  font-weight: 600;
 }
 p {
  font-size: 12pt;
  margin-bottom: 1.25em;
  margin-top: 1.25em;
  line-height: 16pt;
  display: inline;
 }
 pre {
  max-width: 800px;
  overflow-x: scroll;
  padding: 1px 3px;
  border-radius: 3px;
  border: 1px solid #d6d6d6;
  background: #d3d3d342;
  color: black;
  display: inline;
 }
 code, pre {
  line-height: 14pt;
  font-family: monospace !important;
  background-color: #f0f0f4;
 }
 pre pre {
  display: inline-block !important;
  max-width: 800px !important;
  padding: 20px 20px !important;
  overflow: auto !important;
  width: 100% !important;
 }
 pre div.dark.bg-gray-950 div.flex.items-center.relative span {
  background: rgb(55 55 55);
  display: block;
  width: 110%;
  padding: 8px 0 0 25px;
  left: -3.5%;
  position: relative;
  top: -20px;
  color: #cdcdcd;
  font-size: 10pt;
 }   
 pre div.bg-black.rounded-md code {
  line-height: 1;    
 }
 pre code * {
  padding: 2px 0px;
  display: inline-block;
  font-family: system-ui !important;
 }   
 pre div.bg-black.rounded-md code .hljs-comment,
 pre div.bg-black.rounded-md code .hljs-meta, 
 pre span.hljs-comment {
  display: block;
  color: hsla(200, 20%, 40%, 1);
 }  
 pre div.bg-black.rounded-md code .hljs-meta:first-of-type {
  display: inline-block;
  position: relative;
  top: -20px;
  line-height: 2;
 }
 pre div.bg-black.rounded-md code .hljs-meta:last-of-type {
  display: block;
  margin-bottom: -10px;
  line-height: 1.5;
 }
 pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800, 
 pre div.bg-black.rounded-md button {
  vertical-align: middle;
  padding: 5px 40px;
  color: rgb(217,217,227);
 }
 pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800 {
  display: inline-block;
  position: relative;
  width: 100%;
  top: -20px;
  right: -5% !important;
  margin-left: -8% !important;
  overflow-x: hidden !important;    
  background: rgb(52,53,65);
 }
 pre div.bg-black.rounded-md .flex.items-center.relative.text-gray-200.bg-gray-800 span:first-of-type {
  line-height: 2;
 }
 pre div.bg-black.rounded-md button {
  display: inline-block;
  float: right;
  cursor: pointer;
  max-width:150px; 
  background: none;    
  border: none; 
  text-decoration: line-through;
 }
 pre div.bg-black.rounded-md button svg { 
  height: 15px;
  width: 20px;
  margin-right: 3px;
 }    
 .hljs-doctag, 
 .hljs-formula, 
 .hljs-keyword, 
 .hljs-literal {
  color: #2e95d3;
 }
 .hljs-comment {
  color: hsla(0,0%,100%,.5);
 }
 .hljs-addition, 
 .hljs-attribute, 
 .hljs-meta-string, 
 .hljs-regexp, 
 .hljs-string {
  color: #00a67d;
 }
 .hljs-built_in, 
 .hljs-class .hljs-title {
  color: #e9950c;
 }
 .hljs-attr, 
 .hljs-number, 
 .hljs-selector-attr, 
 .hljs-selector-class, 
 .hljs-selector-pseudo, 
 .hljs-template-variable, 
 .hljs-type, 
 .hljs-variable {
  color: #df3079;
 }  
 div[data-side='1'] {
  display:inline-block;
  position:fixed;
  left:0px;
  top: 0px;
  width:20%;
  height:auto;
  border: 2px solid black;
  border-bottom-right-radius: 80px;
  background: #000;
 }
 div[data-side='1'] svg, 
 div[data-side='1'] path,
 div[data-side='1'] h3 {
  display: inline-block;
 }
 div[data-side='1'] svg {    
  background: white;
  border-radius: 100%;
  margin-top: 20px;
  margin-left: 20px;
  padding:3px;    
 }
 div[data-side='1'] h3 {    
  position: relative;   
  font-size: 12pt;
  margin-left: 20px;
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
  max-width: none !important;
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
 ul li code,
 ol li code {
  color: black;
  background: #ececec;
  border-radius: .25rem;    
  font-size: 1.115em;
  font-weight: 500;
  padding: .15rem .3rem;
 }
 ul li code::before,
 ul li code::after,
 ol li code::before,
 ol li code::after    {
  content: '\`';
 }
 code[class*='hljs language-'] {
  background: none !important;
  font-size: 12pt;
 }
 
</style>
`;
 }
 
 /******************************** SUPPORT FUNCTIONS ********************************/
 /* Increments so no duplicate ids for marker ids, */
 var numID = 0;  
 
 /* Add click event to document and check elements, running bookmark accordingly. */
 const docEventChatGPTPasteReadyBookmark = () => {
  /* add a click event listener to the document */
  document.addEventListener('click', function(event) {
   /* ensure bookmarklet is on and a errpr was not found */
   if (onOffPasteReadyBookmarkResponse  == 1) { /* defined at top            */
   /* check if the clicked e/*lement or any of its parents has the attribute */
   let clickedItem = event.target;
   let curID;

   /* check if id has been assigned */
   if (clickedItem.hasAttribute("id") && 
       clickedItem.id.indexOf(
        "unexpected_value_bookmarklet_chatgpt_pasteReadyBookmark"
       ) > -1) {
    /* define current id */
    curID = clickedItem.id;
   } else {
    /* define current id */
    curID = /* use current value of incrementing number */
     "unexpected_value_bookmarklet_chatgpt_pasteReadyBookmark" + numID;

    clickedItem.setAttribute(
     "id", 
     "unexpected_value_bookmarklet_chatgpt_pasteReadyBookmark" + numID
    );

    /* increment number id for unique id value */
    numID++;
   }
   /* select current item with unique id */
   let curItem = document.getElementById(curID);     

   /* check if the copy button was clicked */
   if (curItem.parentElement.hasAttribute("aria-label") && 
       curItem.parentElement.getAttribute("aria-label") == "Copy") {
    /* call main function */
    pasteReadyBookmarkResponse(curItem.parentElement);
   }
   } else { /* do nothing */
    let skip
   }
  });
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
 
 /* Check class name that is used to identify answer area. */
 const checkClassIdentityChatGPTPasteReadyBookmark = (curClass) => {
  let checkClass = 0; /* reset                              */
  /* check string against common values of class names used */
  for (i = 0; i < answerAreaClassNameIdentifierLen; i++) {
   if (curClass.indexOf(answerAreaClassNameIdentifier[i]) > -1) {
     /* match - increment checkClass */
     checkClass++;    
   } else { /* do nothing */
    let skip;
   }
  }
  /* return the final true false value */
  return checkClass;
 };

 /* Redefine variable used to identify answer ares, making array. */
 answerAreaClassNameIdentifier = /* make array using space as divider */
  answerAreaClassNameIdentifier.split(" ");
  
 /* Get length for future use. */
 var answerAreaClassNameIdentifierLen = /* length of array */
  answerAreaClassNameIdentifier.length;
  
 /*********************************************************************************** 
  MAIN FUNCTION
  ***********************************************************************************/
 function pasteReadyBookmarkResponse(aWhat) {
  buttonRow = aWhat.parentElement;    
  /* start process to select answer ares */        
  let checkForAnswerArea = () => {
   /* variable to hold count of matching identifiers in class name */
   let checkClass = "no"; /* inially no - so if no class           */
   if (buttonRow.hasAttribute("class")) {
    checkClass = /* pass to support function to count matches      */
     checkClassIdentityChatGPTPasteReadyBookmark(buttonRow.className);
   } 
   if (checkClass != "no" &&  /* has been redefined witn sorted class              */
       checkClass >= answerAreaClassNameIdentifierLen && /* likely matches         */ 
       buttonRow.previousElementSibling               && /* more likely match      */       
       buttonRow.previousElementSibling.innerText.length >= 100 /* probably match  */
      ) {      
    /* probably found it (hey - this is a bookmarklet), define global variable     */
    answerRow = buttonRow.previousElementSibling;    
   } else {
    cancelWhile+=1; /********************** increment safety linit      */
    buttonRow = buttonRow.parentElement; /* check nxt top-level element */
    if (cancelWhile <= 20) { /* recurs are below safety limit            */
     checkForAnswerArea();
    } else {                /* do nothing ********************************/
     let skip;
    }    
   }
  };
  checkForAnswerArea();
  
  /* dry alert - repair needed */
  let dryAlert = () => {
   alert("REPAIR NEEDED:\n\n" +
         " Please report issue on GitHub repo\n" +
         " https://github.com/isocialPractice/bookmarklets"
        );
   /* turn off bookmarklet */
   onOffPasteReadyBookmarkResponse = 0;
  };
  
  /* define function variable */
  let copiedContent;  
  /* ensure that answerRow has been defined */
  if (cancelWhile >= 20 && answerRow == undefined) { /* answerRow not defined */
   console.log(answerRow);
   console.log(cancelWhile);
   /* alert repair is needed        */
   dryAlert();
   /* exit function */
   return;    
  } else { /* found from func function checkForAnserArea */
   /* now the answer's div element should be extracted */
   copiedContent = answerRow.innerHTML;
  }

  /* clean up a bit */       
  copiedContent = copiedContent.replace(/\n/g, "--new-line_unlikely_line-new--"); /* new line marker replaced later    */
  copiedContent = copiedContent.replace(/<code /g, "<pre ");      /* change opening code HTML tags to pre tags         */
  copiedContent = copiedContent.replace(/<\/code>/g, "</pre>");   /* change closing code HTML tags to pre tags         */  
  copiedContent = copiedContent.replace(/\"/g, '&#92;&quot;');    /* use html encoding for escaped double quotes       */
  copiedContent = copiedContent.replace(/"/g, '\"');              /* keep double quotes as needed for inline html      */
  copiedContent = copiedContent.replace(/\'/g, "&#92;&apos;'");   /* use html encoding for escaped single quotes       */
  copiedContent = copiedContent.replace(/'/g, "'");               /* keep single quotes as needed for inline html      */
  copiedContent = copiedContent.replace(/([ ]{2,})/g, "<br>$1");  /* replace 2 or momre spaces with <br> tag           */
  copiedContent = copiedContent.replace(/class=&#92;&quot;/g, "class='"); /* HOT-GLUE - correct open class  - HOT-GLUE */
  copiedContent = copiedContent.replace(/&#92;&quot;>/g, "'>");           /* HOT-GLUE - correct close class - HOT-GLUE */  
  
  /* utilize "RUNNING_FIX" to correctly write unexpected outputs */
  copiedContent = runningFixChatGPTPasteReadyBookmark(copiedContent);

  /* alert to wait - if pasted immediately = does not work */
  alert(
   "Wait 2 seconds for content to generate as bookmarklet on clipboard. \n" +
   "Then open bookmark manager and make new bookmark by pasting into url field"
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
}, 500);
</script>
`;

  /* store new bookmarklet to be written to clipboard */
  var bookmarklet = 'javascript:(function() {document.write("' + 
   /* write html head content */
   "<!DOCTYPE HTML><html><head><title>" + pageTitle + "</title>" +
   /* style a bit */
   bookmarkPageStyle + 
   /* add page body and div */
   "</head><body><div id='chatGPTPasteReadyBookmark'>" + 
   "<h1>" + pageHead + "</h1><hr>" +
   /* sidebarlink to original answer */
   "<div data-side='1' data-nav='0'>" +
   "<svg width='41' height='41' viewBox='0 0 41 41' fill='none' xmlns='http://www.w3.org/2000/svg' class='h-2/3 w-2/3' role='img'><text x='-9999' y='-9999'>ChatGPT</text><path d='M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z' fill='currentColor'></path></svg>" +
   '<h3>ChatGPT Bookmark</h3></div>' +   
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

   /* set timeout so bookmarklet content is copied after answers' text */
   setTimeout(function () {
    navigator.clipboard.writeText(bookmarklet);
   }, 2000);   
 }
 
 /* Run function that checks whenever a click event fires on page. */
 docEventChatGPTPasteReadyBookmark();

 /* If instruction alert is on. */
 if (instructionAlert == 1) {
  alert(
  "INSTRUCTIONS: \n" +
  "**************** \n" +
  "IMPORTANT - click copy button around bottom. \n\n" +
  "1. Run bookmarklet. \n" +
  "2. Click the copy answer button (at bottom of button). \n" + 
  "3. Create a new bookmarket, pasting contents of clipboard in the URL box.");
 }
}
)();