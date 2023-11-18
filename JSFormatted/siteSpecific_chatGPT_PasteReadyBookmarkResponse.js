javascript:(function(){ 
 var pageTitle = "ChatGPT Bookmark"; /* <-- OPTIONAL - change title */
 var pageHead  = "ChatGPT Response"; /* <-- OPTIONAL - change head  */
 /* Select copybuttons. */
 var copyButton = document.getElementsByClassName("flex ml-auto gizmo:ml-0 gap-1 items-center rounded-md p-1 text-xs");
 var copyButtonLen = copyButton.length;
 for (i = 0; i < copyButtonLen; i++) {
  copyButton[i].addEventListener("click", function () {
   /* start process to select answer ares */
   let buttonBar = this.parentElement.parentElement;  
   let answerArea = /* answer parent */
    buttonBar.previousElementSibling; 
   let answerText =          /* parent holding answer's text */
    answerArea.getElementsByClassName("markdown prose w-full break-words");
   let copiedContent = /* contetn being copied*/
    answerText[0].innerHTML;
   /* clean up a bit */
   copiedContent = copiedContent.replace(/\n/g, "");
   copiedContent = copiedContent.replace(/"/g, '\\"');  
   copiedContent = copiedContent.replace(/'/g, "\\'");
   /* alert to wait */
   alert("Wait 2 seconds for content to generate as bookmarklet on clipboard. \nThen open bookmark manager and make new bookmark by pasting into url field");
   var bookmarklet = 'javascript:(function() {document.write("' + 
    /* write html head content */
    "<!DOCTYPE HTML><html><head><title>" + pageTitle + "</title>" +
    /* style a bit */
    "<style>button {display:none;} pre {max-width: 800px;background:black; color:white;}</style>" + 
    "</head><body><h1>" + pageHead + "</h1>" +
    /* output copied content */
    copiedContent + 
    /* close html */
    "</body></html>" +
    /* close bookmarklet */
    '");})()';    
   /* set timeout so bookmarklet content is copied after answers' text */
   setTimeout(function () {
    navigator.clipboard.writeText(bookmarklet);
   }, 2000);
  });
 }
})();