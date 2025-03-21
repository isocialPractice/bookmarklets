javascript:(function() {  
 /* OPTIONAL - alert with instructions. */
 var alertInstructionsYoutTubeShortRelese = 1;

 /* 
  Check if being run for first time, reloading if not as to 
  compensate for initialization bug.
 */
 var checkPageInitYoutTubeShortRelese = 
  sessionStorage.getItem("initYoutTubeShortRelese");
 
 /* See if page session initialized. */
 if (checkPageInitYoutTubeShortRelese == null ||
     checkPageInitYoutTubeShortRelese == undefined) {
  alert(
  "BOOKMARKLET HAS NOT BEEN INITIALIZED:\n\n" +
  "Run bookmarklet again if release date is not displayed.\n" +
  "NOTE - page down and back up to short for consistent results."
  );
  sessionStorage.setItem("initYoutTubeShortRelese", "1");
  window.location.reload();    
  return;
 }
 
 /* Declare global variables. */
 var factoidsYoutTubeShortRelese, releaseDateYoutTubeShortRelese, 
     actionsIDYoutTubeShortRelese, putReleaseYoutTubeShortRelese;
 
 /***********************SUPPORT FUNCTIONS***********************/     
 /* Define DOM global variables.         *****/
 const defineVarYoutTubeShortRelese = () => {
  /* select parent containing short description */  
  factoidsYoutTubeShortRelese = 
   document.getElementsByClassName("ytwFactoidRendererHost");

  /* placing before this item*/
  actionsIDYoutTubeShortRelese = 
   document.getElementById("actions");       

  /* get release date */
  releaseDateYoutTubeShortRelese = 
   factoidsYoutTubeShortRelese[2].textContent;
 };
 
 /* Create and style HTML to hold date. *****/
 const makeDateElementYoutTubeShortRelese = () => {
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
 };
 
 /* Add item to right of short. *************/
 const addRelDateYoutTubeShortRelese = () => {
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
 };
 
 /***************************************************************
                          MAIN FUNCTION
 ****************************************************************/
 document.body.addEventListener("click", function() {  
  /* Have to delay a bit - using one second cause - seems right. */
  setTimeout(function() {
   /* Check id that is made to remove if already placed. */
   putReleaseYoutTubeShortRelese = 
    document.getElementById("putReleaseYoutTubeShortRelese"); 

   /* If already placed remove. */
   if (putReleaseYoutTubeShortRelese) {
    putReleaseYoutTubeShortRelese.remove();
    defineVarYoutTubeShortRelese();
   } else {
    defineVarYoutTubeShortRelese();
   }
   
   /* Prep element to be inserted. */
   makeDateElementYoutTubeShortRelese();
      
   /* insert short release date */
   addRelDateYoutTubeShortRelese();     
   
   /* Delay for half a second for content loading. */
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