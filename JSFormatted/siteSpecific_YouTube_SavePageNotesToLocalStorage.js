javascript:(function() { 
 
 /* Ends bookmarklet if no notebox found. */
 var noteBoxFound = 0;
 var noteBoxChecks = 0;
 
 /* Select current not box.               */
 var noteBox = document.getElementById("noteBox");
 
 /* 
  Check other id for noteBox - alias noteBoxTakeNotes
  from another bookmarklet.
 */
 function checkForNoteBox() { 
  if (noteBox) {
   /* botebox found                             */
   noteBoxFound = 1;   
  } else {
   if (noteBoxChecks >= 2) {
    let skip; /* do not try and redefine        */
   } else {
    /* redefine to alias from other bookmarkelt */
    noteBox = document.getElementById("noteBoxTakNotes");   
   }
  } 
  noteBoxChecks += 1; /* at 2 do not redefine      */
 }
 
 /* Check and see if notebox is on page.           */
 checkForNoteBox(); /* check for noteBox id        */
 if (noteBoxFound == 0) { /* check for alias id    */
  checkForNoteBox(); 
 } 
 
 /* If no notebox found alert and end bookmarklet. */
 if (noteBoxFound == 0) {
  alert(
   "There is no notebox on current page.\n\n" + 
   "Bookmarklet was canceled."
  );
  return;
 }
 
 /* Store value of page notes.                     */
 var noteBoxVal = noteBox.value;
 
 /* Get the url of video.                          */
 var videoURL = location.href;
 
 /* Get the video title.                           */
 var titlePar = 
  document.getElementsByClassName("style-scope ytd-watch-metadata");
 var videoTitle = 
  titlePar[0].innerText.replace(/\n.*/g,"");
  
 /* Get the id holding the username.            */
 var username = 
  document.getElementById("top-row");
 
 /* Extract all text from id holding user name. */
 var extractUserNameText = username.textContent;
  
 /* Clean text to only get username only.       */
 var usernameVal =   extractUserNameText.replace(/\n/g,"")
  .replace(/^ {2,}(.*) {2,}(.*)subscribers(.*)$/g,"$1")
  .replace(/^(.*) {2,}.*$/g, "$1")
  .replace(/ {2,}/g,"");
 
 /* Generate name for localStorage variable. */
 var storageVar = usernameVal + "--" + videoTitle;
 storageVar = storageVar.replace(/ {1,}/g, "-");
 
 /* Start value of local storage with video url. */
 var localStorageVal = videoURL + " --:-- \n" + noteBoxVal.replace(/\n/g, "<br>");
 /* 
  Store notes in local storage as variable formatted: 
  usename--Video-Title
 */
 
 /* Store to local storeage in browser. */
 localStorage.setItem(storageVar, localStorageVal);    
 
 /* Notify of localstorage property name. */
 alert(
  "Notes taken for this page have been saved to local Storage as: \n" +
  storageVar
 );
})(); 