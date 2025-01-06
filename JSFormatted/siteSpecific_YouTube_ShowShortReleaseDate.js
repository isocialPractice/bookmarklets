javascript:(function() {  
 /* OPTIONAL - alert with instructions. */
 var alertInstructionsYoutTubeShortRelese = 1;

 var factoidsYoutTubeShortRelese, releaseDateYoutTubeShortRelese, 
     actionsIDYoutTubeShortRelese, putReleaseYoutTubeShortRelese;
  
 document.body.addEventListener("click", function() {
  /* Have to delay a bit - using one second cause - seems right. */
  setTimeout(function() {
   /* remove if already placed. */
   putReleaseYoutTubeShortRelese = 
    document.getElementById("putReleaseYoutTubeShortRelese"); 

   /* if already placed remove */
   if (putReleaseYoutTubeShortRelese) {
    putReleaseYoutTubeShortRelese.remove();
   }

   /* select parent containing short description */  
   factoidsYoutTubeShortRelese = 
    document.getElementById("factoids");

   /* placing before this item*/
   actionsIDYoutTubeShortRelese = 
    document.getElementById("actions");       

   /* get release date */
   releaseDateYoutTubeShortRelese = 
    factoidsYoutTubeShortRelese.children[2].innerText;
   
   /* create element to store release date */
   putReleaseYoutTubeShortRelese = 
    document.createElement("p");

   /* make presentable */
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

   /* insert short release date */
   actionsIDYoutTubeShortRelese
   .insertAdjacentElement("beforebegin", putReleaseYoutTubeShortRelese);
    
   /* Select again */
   putReleaseYoutTubeShortRelese = 
    document.getElementById("putReleaseYoutTubeShortRelese"); 
   
   /* check if year is at end or beginning */
   let atEndYear = /^[a-zA-Z]+ \d{5,}$/;
   let atStartYear = /^\d{4}.*$/;
   
   /* make easier to read */ 
   if (atEndYear.test(releaseDateYoutTubeShortRelese)) {
    releaseDateYoutTubeShortRelese = /* year is at end */
     releaseDateYoutTubeShortRelese.replace(/([0-9]{1,})([0-9]{4})$/g, "$1, $2");
   } else if (atStartYear.test(releaseDateYoutTubeShortRelese)) {
    releaseDateYoutTubeShortRelese = /* year is at start */
     releaseDateYoutTubeShortRelese.replace(/([0-9]{4})/g, "$1, ");       
   }

   /* Put in text of short release date. */
   putReleaseYoutTubeShortRelese.innerText = 
    releaseDateYoutTubeShortRelese;
  }, 500);
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