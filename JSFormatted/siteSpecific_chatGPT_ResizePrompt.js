javascript: (function () {   /***** SET CUSTOM RESIZE VALUES *****/
/* The 2 variables below will set a general value for resizing.  */
 var setMaxHeight = "600px"; /* specify max height for resizing. */
 var setMaxWidth =  "95%";   /* Specify max width for resizing.  */
 var setMinHeight = "40px";  /* specify min height for resizing. */
 var setMinWidth =  "280px"; /* Specify min width for resizing.  */ 
 var promptTextarea = document.getElementById("prompt-textarea");
 var promptPar = promptTextarea.parentElement;
 var subButton = promptPar.nextElementSibling;
 var parElement = promptPar.parentElement; 
 var grandParElement = parElement.parentElement; 
 grandParElement.style.transform = "rotateX(180deg)";
 grandParElement.style.overflow = "auto";
 grandParElement.style.resize = "both";  
 grandParElement.style.minHeight = "100px";
 grandParElement.style.maxHeight = "800px";
 grandParElement.style.minWidth = "280px"; 
 grandParElement.style.maxWidth = "85%"; 
 parElement.style.display = "inline-block";
 parElement.style.transform = "rotateX(180deg)";
 parElement.style.minWidth = "100%";
 parElement.style.maxWidth = "100%";
 parElement.style.height = "inherit";
 parElement.style.minHeight = "95%";
 subButton.style.position = "absolute";
 subButton.style.bottom = "10px";
 promptPar.style.paddingLeft = "30px";
 promptPar.style.height = "inherit"; 
 promptTextarea.style.paddingRight = "100px";
 promptTextarea.style.paddingLeft = "30px";
 promptTextarea.style.width = "100%";
 /* Add style element to mark important overrides. */
 var neededStyling = document.createElement("style");
 neededStyling.innerHTML = `
form.w-full {
 width: auto !important;
}
textarea#prompt-textarea {   
 max-height: 800px !important;   
 min-height: 100% !important;   
 height: inherit !important;
 overflow: scroll !important;  
}  
form div.relative.flex.h-full.flex-1 div + div.flex.w-full.items-center {   
 min-height: ` + setMinHeight + ` !important;   
 max-height: ` + setMaxHeight + ` !important;   
 min-width: `  + setMinWidth  + ` !important;   
 max-width: `  + setMaxWidth  + ` !important;  
} 
`;
 document.body.appendChild(neededStyling);
})();