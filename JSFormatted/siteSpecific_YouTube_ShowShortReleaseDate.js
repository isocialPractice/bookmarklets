javascript:(function() {  
/* OPTIONAL - alert with instructions. */
var alertInstructionsYoutTubeShortRelese = 1;

 var factoidsYoutTubeShortRelese, releaseDateYoutTubeShortRelese, 
     actionsIDYoutTubeShortRelese, putReleaseYoutTubeShortRelese;
  
document.body.addEventListener("click", function() {
 /* Have to delay a bit - using one second cause - seems right. */
  setTimeout(function() {
   /* Remove if already placed. */
   putReleaseYoutTubeShortRelese = document.getElementById("putReleaseYoutTubeShortRelese"); 
   if (putReleaseYoutTubeShortRelese) {putReleaseYoutTubeShortRelese.remove();}
   
   /* Parsed id of side widgets. "
   factoidsYoutTubeShortRelese = 
    document.getElementById("factoids");
   
   /* Get release date. */
   releaseDateYoutTubeShortRelese = 
    factoids.children[2].innerText;
   
   /* Placing before this item. */
   actionsIDYoutTubeShortRelese = document.getElementById("actions");
   
   /* Make presentable */
   putReleaseYoutTubeShortRelese = document.createElement("p");
   putReleaseYoutTubeShortRelese
   .style.fontFamily = "Roboto";
   putReleaseYoutTubeShortRelese
   .style.fontWeight = "bold";
   putReleaseYoutTubeShortRelese
   .style.marginLeft = "10px";
   putReleaseYoutTubeShortRelese
   .style.textAlign = "center";
   putReleaseYoutTubeShortRelese
   .style.background = "rgba(0, 0, 0, .095)";
   putReleaseYoutTubeShortRelese
   .style.borderRadius = "25px";
   putReleaseYoutTubeShortRelese
   .style.width = "50px";
   putReleaseYoutTubeShortRelese
   .style.height = "50px";
   putReleaseYoutTubeShortRelese
   .style.paddingTop = "12px";
   putReleaseYoutTubeShortRelese
   .style.boxSizing = "border-box";
   putReleaseYoutTubeShortRelese
   .style.fontSize = "9pt";
   
   /* Give id to remove if duplicates */
   putReleaseYoutTubeShortRelese
   .id = "putReleaseYoutTubeShortRelese";
   
   /* Insert release date at top of widget. */
   actionsIDYoutTubeShortRelese
   .insertAdjacentElement("beforebegin", putReleaseYoutTubeShortRelese);
   
   /* Select again */
   putReleaseYoutTubeShortRelese = 
    document.getElementById("putReleaseYoutTubeShortRelese"); 
   
   /* Make text easier to read. */
   let relYear = releaseDateYoutTubeShortRelese 
    .substr(releaseDateYoutTubeShortRelese.length-4, 4);
    
   releaseDateYoutTubeShortRelese = 
    releaseDateYoutTubeShortRelese.replace(
    relYear, ", " + relYear);
   
   /* Put in text of short release date. */
   putReleaseYoutTubeShortRelese.innerText = 
    releaseDateYoutTubeShortRelese;
  }, 1000);
 });
 /* SHow instructions if turned on. */
 if (alertInstructionsYoutTubeShortRelese == 1) {
  alert(`
  INSTRUCTIONS - YOUTUBE SHOW SHORT RELEASE DATE\n
  **********************************************\n\n

  Click any white space on page to get release date.\n
  NOTE - after first short has loaded, scroll down to next\n
  short and back up, then click white space to get current\n
  short's release date.
  `);
 } 
})(); 