javascript:(function() { 
 
 /* Switch variables. */
 var noteBoxFound = 0;   /* switch variable to see if note box on page      */
 var noteBoxChecks = 0;  /* safety variable when checking for duplicates    */
 var noteBoxCleared = 0; /* switch variable to clear prior saved note logs  */
 var noteBoxDelete = 0;  /* switch variable to delete saved notes for video */
 var noteOutAlert = "default"; /* switch statement - alert shown when run   */
 
 /* Default content variables */
 var instructMsg; /* defined in switch statement at bottom */
 const outAlertMsg = (sVar) => { /* normally saving notes  */
  let outMsg = "Notes taken for this page have been saved to local Storage as: \n" +
   sVar + "\n\n";
  return outMsg;
 };
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
  /* end bookmarklet */
  return;
 }
 
 /* Store value of page notes.                     */
 var noteBoxVal = noteBox.value;
 
 /* Get the time marks that were saved.            */
 var timeMarkBtnAreaID = /* sim. var to take notes */
  document.getElementById("timeMarkButtonArea");
  
 /* 
    Check if time marks were added, and store in 
    make shift array if so that will be appended 
    to end of saved page notes.                    
 */
 var timeMarkAdded = 0; var timeMarkArr = [];
 if (timeMarkBtnAreaID) {  
  let timeTagA = /* get all a tiags in time marks */
   timeMarkBtnAreaID.getElementsByTagName("a");
  let timeTagALen = /* length of time marks added */
   timeTagA.length;
  
  /* make sure time are in time mark area */
  if (timeTagALen >= 1) {
   timeMarkAdded = 1;
   for (i = 0; i < timeTagALen; i++) {
    timeMarkArr.push(timeTagA[i].innerText);
   }
  }  
 }
 /* if no times and time marks added to notws           */
 if (timeMarkAdded == 0) {
  /* add one item to array noting no times were in area */
  timeMarkArr = []; /* redefine as empty */
  timeMarkArr.push("empty"); /* define one value */
 }
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
 
 /* Get date of current notes. */
 var date = new Date(); 
 var theSaveDate = /* Append to video title when recalled */
  date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
  
 /* Start value of local storage with video url.      */
 var videoTitleAndSaveDate =   /* title and save date */ 
  videoTitle + " - " + theSaveDate;
 
 /* Text from notes being saved.   */
 var saveNoteText = /* notes taken */
  noteBoxVal.replace(/\n/g, "<br>");
 
 /* Time marks added while taking notes. */
 var saveTimeMarksAdded = /* add time marks or specify empty */
  timeMarkArr.join(","); 
 
 /* Create storage item to save current nots.      */
 const createLocalStorageVal = () => {
  let localStorageVal = 
   videoTitleAndSaveDate + 
   "--:--"  + /* split */
   saveNoteText +
   "--:--" +  /* split */
   saveTimeMarksAdded;
   
   /* output final storage value */
   return localStorageVal;
 };    
 /* 
  Store notes in local storage as variable formatted: 
  usename-:-Video-Title-:-timeMarkArr
 */
 
 /* Check if current notes exist. */
 var priorSavedNotes = localStorage.getItem(storageVar);
 
 if (priorSavedNotes != null ||
     priorSavedNotes != undefined) {
  if (saveNoteText.toLowerCase() == "clear") {
   /* output cleared alert */
   noteBoxClear = 1;
   noteOutAlert = "clear";;
  } 
  else if (saveNoteText.toLowerCase() == "delete") {
   /* don't save, but delete, outputting delete alert  */
   noteBoxDelete = 1; 
   noteOutAlert = "delete";;
  } else {
   /* output instruct message */
   noteOutAlert = "append";;
   /* append to log of notes */
   let priorSavedNotesArr = /* make prior notes array */
    priorSavedNotes.split("--:--"); 

   /* include prior notes */
   saveNoteText += /* heading and note text from last */   
    "<br>--------------------------------------<br><br>" +   
    priorSavedNotesArr[0] + "<br>" + /* heading of prior */
    priorSavedNotesArr[1];

   /* include prior time marks */
   if (priorSavedNotesArr[2] != "empty") {
    /* add last time marks saved from prior notes    */
    saveTimeMarksAdded += /* append prior time marks */
     "," + priorSavedNotesArr[2];
   } else {
    /* do nothing */
    let skip;
   }
  }
 }
 /* Check delete switch variable and save if 0 */
 if (noteBoxDelete == 0) {
  /* Store to local storeage in browser. */
  localStorage.setItem(storageVar, createLocalStorageVal());    
 } else {
  /* delete local storage and end bookmarklet */
  localStorage.removeItem(storageVar);
 }
 
 switch(noteOutAlert) {
  case "clear": 
   instructMsg = "PRIOR SAVED NOTE SESSIONS CLEARED: \n" +
    outAlertMsg(storageVar); /* Notify of localstorage property name. */
   break;
  case "delete":
   instructMsg = "PRIOR SAVED NOTE SESSIONS DELETED:";
   break;
  case "append":
   instructMsg = outAlertMsg(storageVar) + /* Notify of localstorage property name. */
    "NOTE - use bookmarket siteSpecific_YouTube_SavedPageNotesToNotebox to restore " +
    "running log of ALL notes. \n" +
    "NOTE - To avoid duplicates and clutter when over 1 save, clear text " +
    "before saving the next session of notes.\n" +
    "NOTE - To clear running log of notes, save page notes with only: \n" +
    "\"clear\" \n" + "typed into the note box.\n" +
    "NOTE - To delete notes for this video, save page notes with only: \n" +
    "\"delete\" \n" + "typed into the note box.";
   break;
  case "default":   
   instructMsg = outAlertMsg(storageVar); /* Notify of localstorage property name. */
   break;
  default:   
   instructMsg = outAlertMsg(storageVar); /* Notify of localstorage property name. */
 }
 /* Alert with update or quasi instructions if saving after first time. */
 alert(instructMsg);
})(); 