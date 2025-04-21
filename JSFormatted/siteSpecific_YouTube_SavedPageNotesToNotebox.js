javascript:(function(){ 
 /* Global DOM variables */
 var noteAreaSavedPageNotesIDSavedPageNotes =  /* parent for note elements */
  document.getElementById("noteAreaSavedPageNotes");
 
 var noteBoxTakNotes =               /* textare element for taking notes */
  document.getElementById("noteBoxTakNotes");
 
 var closeNoteBoxSavedPageNotes =         /* Close notebox element */
  document.getElementById("closeNoteBoxSavedPageNotes");
 
 var aboveTheFoldSavedPageNotes =         /* html after vidoe box */
  document.getElementById("above-the-fold");
 
 var playerSavedPageNotes =               /* video playerSavedPageNotes topmost parent */
  document.getElementById("player"); 
 
 var playButtonSavedPageNotes =           /* play button - needed to update time mark */
  document.getElementsByClassName("ytp-play-button");
 
 var currentTimeClassNameSavedPageNotes = /* class element with current time */
  "ytp-time-current"; 
 
 /* Global configuration variables */
 var ignoredKeysSavedPageNotes =          /* keys pressed that do not active not box */
  "Home End PageUp PageDown"; 
 
 var ignoredDOMElementsSavedPageNotes =   /* stop function if one of these is active */
  ["comments", "search", "contenteditable-root", "player"]; 
 
 /* Switch variables. */
 var savedNotesTimeAdded = 0; /* if time mark array saved with prior notes */
 
 /* Declare global variables that will be defined later. */
 var curTimeElementSavedPageNotes, curTimeElementTextSavedPageNotes,
     timePreCalSavedPageNotes, timeSecCalSavedPageNotes, storedNotesArrSavedPageNotes;
 
 /* CSS style sheet */
 {
  var noteCSSSavedPageNotes = `
  /* style close elements with constant styles */
   button#closeNoteBoxSavedPageNotesBtn {
    display: inline;
    position: relative;
    left: -5px;
    top: 5px;
    width: 25px;
    height: 25px;
    background: red;
    color: white;
    border: none;
    border-radius: 5px;
    z-index: 1;
   }
   button#closeNoteBoxSavedPageNotesBtn:hover,
   button#closeNoteBoxSavedPageNotesBtn:hover ~ input#closeCheckbox:hover {
    border: 3px solid gray;
   }
   button#closeNoteBoxSavedPageNotesBtn.hideNotesSavedPageNotes + div {
    display: none !important;
   }
   button#closeNoteBoxSavedPageNotesBtn.hideNotesSavedPageNotes + div + div {
    margin-top: 20px;
   }
   /* style note area with constant styles */
   div#noteAreaSavedPageNotes {
    display: inline-flex;
    flex-wrap: nowrap;
    position: relative;
    top: 0px;
    width: 100%;
   }
   div #noteAreaSavedPageNotes div {
    display: inline-block; 
    position: relative;
    margin: 0px 10px;
    max-width: 450px;
    width: min-content;
   }
   div#noteAreaSavedPageNotes div+div {
    display: inline-block;
    position: relative;
    max-width: 800px;
    width: auto !important;
    left: 0px; 
   }
   /* style note box with constant style */
   textarea#noteBoxTakNotes {
    max-width: 450px;  
    width: 450px;
    height: 100px; 
    padding: 10px;
    border-radius: 10px;
   }
   /* style time mark area */
   span#timeMarkButtonArea {
    box-sizing: border-box;   
    display: inline-block;
    position: relative;
    float: left;
    max-width: 750px;
    width: auto;
    height: 100%;
    border-radius: 10px;
    margin-left: 10px;   
    padding: 5px;
    background: rgba(0, 0, 0, .025);      
   }
   /* style close and time mark button parent */
   span#timeMarkButtonArea div:first-of-type {
    display: inline;
   }
   span#timeMarkButtonArea div {
    display: inline-block;
   }   
   /* style time mark buttons with constant styles */
   span#timeMarkButtonArea a {
    box-sizing: border-box !important;
    display: inline-flex !important;
    position: relative;
    flex-wrap: wrap !important;
    top: 0px !important;
    left: unset !important;
    cursor: pointer;
    width: auto;
    height: 25px;
    border-radius: 3px;
    margin-left: 10px;
    margin-top: 3px;
    padding: 5px 10px 10px;
    background: rgba(40, 40, 40, .85);
    color: white;    
    text-decoration: none;    
   }
   span#timeMarkButtonArea a:hover { 
    background: rgba(40, 40, 40, 1);  
   }
   /* style close time mark buttons with constant styles */
   span[id^="closeTimeMarkBtn"] {
    padding-left: 3px;
    padding-right: 3px;
    margin-left: 20px;
    border-left: 1px solid black;
    border-bottom: 1px solid black;    
    border-width: medium;  
   }
 `;
 }
 
 /* Note box setup. */
 {
  var noteTextAreaSavedPageNotes, noteAreaSavedPageNotes, noteBoxTakNotesDiv, 
      closeNoteBoxSavedPageNotesBtn, closeCheckbox;
  if (!noteAreaSavedPageNotesIDSavedPageNotes) {
   /* are for notes */
   noteAreaSavedPageNotes = document.createElement("div");
   noteAreaSavedPageNotes.id = "noteAreaSavedPageNotes";   
   aboveTheFoldSavedPageNotes.insertAdjacentElement("beforebegin", noteAreaSavedPageNotes); 

   let noteStyle =         /* using noteCSSSavedPageNotes from above */
    document.createElement("style"); 

   noteStyle.textContent = /* add css properties */
    noteCSSSavedPageNotes;        

   noteAreaSavedPageNotes.insertAdjacentElement("beforebegin", noteStyle);
   noteAreaSavedPageNotesIDSavedPageNotes = document.getElementById("noteAreaSavedPageNotes");

   /* note box */
   noteTextAreaSavedPageNotes = document.createElement("textarea"); 
   noteTextAreaSavedPageNotes.id = "noteBoxTakNotes"; 
   noteBoxTakNotesDiv = document.createElement("div");

   /* insert div to hold textarea */
   noteAreaSavedPageNotesIDSavedPageNotes.insertAdjacentElement("afterbegin", noteBoxTakNotesDiv);

   /* insert textare html elements to take notes */
   noteBoxTakNotesDiv.insertAdjacentElement("afterbegin", noteTextAreaSavedPageNotes); 

   /* close buttnon */
   closeNoteBoxSavedPageNotesBtn = document.createElement("button");
   closeNoteBoxSavedPageNotesBtn.id = "closeNoteBoxSavedPageNotesBtn";
   noteStyle.insertAdjacentElement("afterend", closeNoteBoxSavedPageNotesBtn);
   closeNoteBoxSavedPageNotesBtn.textContent = "X";

   /* get id of button to close note area - enables this to work with timemarks */
   let closeBtnIDSavedPageNotes = document.getElementById("closeNoteBoxSavedPageNotesBtn");    
   /* alternate close button status */
   closeBtnIDSavedPageNotes.addEventListener("click", function() {
    if (this.textContent == "X") {
     this.className = "hideNotesSavedPageNotes"; /* hide note area with css rules    */     
     this.textContent = "O";                /* switch hiding note area          */
    } else {
     this.className = "";                   /* show note area with css rules    */
     this.textContent = "X";                /* switch to show note area         */
    }
   });
  }
 }
 /* Redefine noteBoxTakNotes */
 noteBoxTakNotes = document.getElementById("noteBoxTakNotes");
 
 /***** SUPPORT FUNCTIONS *****/
 /* Copy notes in textare to clipboard. */
 const copyNotesSavedPageNotes = () => {
  noteBoxTakNotes.select();
  navigator.clipboard.writeText(noteBoxTakNotes.value);
 }; 
 
 /* Update current time - for time mark. */
 const updateCurrentTime = () => {
  /* update HTML element holding time value */
  let playButtonData = 
   playButtonSavedPageNotes[0].dataset.titleNoTooltip;
  
  /* to keep video paused */
  if (playButtonData != "Play") {
   playButtonSavedPageNotes[0].click(); 
   playButtonSavedPageNotes[0].click();
  }
  
  /* update time value HTML element */
  curTimeElementSavedPageNotes =   /* select element with current time */
   document.getElementsByClassName(currentTimeClassNameSavedPageNotes); 
  curTimeElementTextSavedPageNotes = curTimeElementSavedPageNotes[0].textContent;
  
  /* extract time and calculate in seconds */
  timePreCalSavedPageNotes = curTimeElementTextSavedPageNotes.split(":");    
 }; 
 
 /* Add time mark button to the right of textarea. */
 const markTime = () => {  
  /* func functions */
  /* extract current time from video on ctrl + m */
  let extracTCurTime = (ct) => {
   if (savedNotesTimeAdded == 1) {
    noteBoxTakNotes.blur(); /* quickly deactivate note box */
    noteBoxTakNotes.setAttribute("disabled", true);
   }

   if (ct.length == 3) { /* not handling videos over 24 hours - no */
    timeSecCalSavedPageNotes = 
     Number(Number(ct[0]*60) * 60) + /* hours to seconds   */
     Number(ct[1]*60) +              /* minutes to seconds */
     Number(ct[2]);                  /* seconds */
   } 
   else if (ct.length == 2) {
    timeSecCalSavedPageNotes = 
     Number(ct[0]*60) +    /* minutes to seconds */
     Number(ct[1]);        /* seconds */
   } 
   else if (ct.length == 1) {
    timeSecCalSavedPageNotes =      
     Number(ct[0]); /* seconds */
   }
  };
  
  /* add main area for time marks */
  let addTimeMarkArea = () => {
   /* create time mark area and elements */
   let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea");
   let timeMarkButtonArea;

   /* don't duplicate parent container */
   if (!timeMarkButtonAreaID) { /* create area for time mark buttons */
    let timeMarkDiv =    /* parent for time mark box */
     document.createElement("div");
    timeMarkButtonArea = /* time mark box - parent for timemarks */
     document.createElement("span"); 
    timeMarkButtonArea.id = "timeMarkButtonArea"; 

    /* insert time mark box parent div */
    noteBoxTakNotesDiv.insertAdjacentElement("afterend", timeMarkDiv);   

    /* insert time mark box */
    timeMarkDiv.insertAdjacentElement("afterbegin", timeMarkButtonArea);
   }
  };
  
  /* give new time marks unique id and add time */
  let normalCall = 0; /* switch variable - 1 if called via ctrl + m */
  let addTimeMarkItem = (ct) => {
   if (ct == undefined) { normalCall = 1; } /* run using ctrl + m */
   
   /* check if mark already there */ 
   let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCalSavedPageNotes);
   let curTimeMarkCloseBtn, curTimeMarkBtn;

   /* don't duplicate time marks */
   if (!curTimeMarkBtnID) { /* create time mark buttons */
    let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea");

    /* CREATE AND ADD CLOSE TIME MARK BUTTONS ***************************************/
    /* parent of close and time mark button */
    let timeMarkBtn = document.createElement("div");

    /* insert parent of close and time mark button */
    timeMarkButtonAreaID.insertAdjacentElement("beforeend", timeMarkBtn);

    curTimeMarkCloseBtn = /* enable time marks to be removed    */
     document.createElement("span");    

   curTimeMarkCloseBtn   /* give each a unique data attribute */
    .id = "closeTimeMarkBtn" + timeSecCalSavedPageNotes;

    curTimeMarkCloseBtn  /* style close btn - give pointers hover effect */
    .style.cursor = "pointer";

    curTimeMarkCloseBtn   /* style close btn - give font-size */
    .style.fontSize = "small";

    curTimeMarkCloseBtn   /* add mouse event - mouse over to style text */
    .addEventListener(
     "mouseover", function() {
      this.style.fontWeight = "bold";
      this.style.fontSize = "medium";
     });

    curTimeMarkCloseBtn   /* add mouse event - mouse out to style text */
    .addEventListener(
     "mouseout", function() {
      this.style.fontWeight = "initial"; 
      this.style.fontSize = "small";
     });    

    curTimeMarkCloseBtn   /* add click event - remove time mark and this */
    .addEventListener(
     "click", function() {
      this.parentElement.remove(); /* removes all elements of time mark button */
     });

    curTimeMarkCloseBtn   /* give close symbol as string - x */
    .innerText = "x";

    /* insert close time mark button */
    timeMarkBtn.insertAdjacentElement("afterbegin", curTimeMarkCloseBtn);

    /* CREATE AND ADD TIME MARK BUTTONS ********************************************/
    let closeTimeBtn =    /* get id of close button to insert time mark after it */
     document.getElementById("closeTimeMarkBtn" + timeSecCalSavedPageNotes);

    curTimeMarkBtn =      /* time mark linking tom marked times */
     document.createElement("a");

    curTimeMarkBtn.id =   /* give each a unique id */
     "timeMarkBtn" + timeSecCalSavedPageNotes;

    /* open link in new tab - _blank */
    curTimeMarkBtn.target =  "_blank";   
    let vidURL = location.href; /* extract current url */

    /* conditions if url did not already have time value */
    if (vidURL.indexOf("&t=") > -1) { /* had time value   */
     vidURL = vidURL.replace(/t=[0-9]+/, "t=" + timeSecCalSavedPageNotes);
    } else {                         /* no time value    */
     vidURL = vidURL + "&t=" + timeSecCalSavedPageNotes + "s";
    }      
    curTimeMarkBtn.href = vidURL;

    if (normalCall == 1) { /* called via ctrl + m */ 
     /* use calculation for current video time */
     /* use hour : minutes: seconds */
     for (i in timePreCalSavedPageNotes) {
      if (i == Number(timePreCalSavedPageNotes.length-1)) {
       if (Number(timePreCalSavedPageNotes.length-1) == 0) {
        curTimeMarkBtn.innerText = "0:" + timePreCalSavedPageNotes[i];
       } else {
        curTimeMarkBtn.innerText += timePreCalSavedPageNotes[i];
       }     
      } else {
       curTimeMarkBtn.innerText += timePreCalSavedPageNotes[i] + ":";
      }
     }
    } else {
     curTimeMarkBtn.innerText = ct; /* using time from prior note session */
    }
    /* insert time marked at key combo "Ctrl + m" */
    timeMarkBtn.insertAdjacentElement("beforeend", curTimeMarkBtn);

    /* add click event to pause video if clicked and video is playing */
    curTimeMarkBtn.addEventListener("click", function() {
     let playButtonData = playButtonSavedPageNotes[0].dataset.titleNoTooltip;
     if (playButtonData != "Play") {
      playButtonSavedPageNotes[0].click();
     }
    });     
   }    

   /* focus back on note box */
   noteBoxTakNotes.removeAttribute("disabled");
   noteBoxTakNotes.focus();
  };
  
  /* 0 => adding time markks from prior notes, 1 => add with crtl + m */
  if (savedNotesTimeAdded == 0) {
   let priorTimeArr = /* array from prior time mark make-shift array */
    storedNotesArrSavedPageNotes[2].split(",");
   let priorTimeArrLen = /* prep for loop */
    priorTimeArr.length; 
    
   /* sort time values */
   priorTimeArr.sort();
   
   /* add time marks from last note session */
   for (i = 0; i < priorTimeArrLen; i++) {
    extracTCurTime(priorTimeArr[i].split(":"));
    if ( i == 0) { /* add time area on first iteration */
     addTimeMarkArea();
    }
    /* give each mark id with time appended, adding prior time  */
    addTimeMarkItem(priorTimeArr[i]);    
   }
  } else {
   /* get current time spot of video */
   extracTCurTime(timePreCalSavedPageNotes);

   /* check if time mark area needs to be added */
   addTimeMarkArea();

   /* give each mark id with time appended, adding current time */
   addTimeMarkItem();
  }
 };
 
 /* Focus on textarea whenever keydown occurs. */
 const keypressToNoteSavedPageNotes = () => {
  let activeID = document.activeElement.id;
  let lastKeyPressSavedPageNotes; /* used to check for key combos */
  lastKeyPressSavedPageNotes = sessionStorage.getItem("lastKeyPressSavedPageNotes");
  
  /* for first key press */
  if (lastKeyPressSavedPageNotes == null) { 
   sessionStorage.setItem("lastKeyPressSavedPageNotes", event.key);
   lastKeyPressSavedPageNotes = sessionStorage.getItem("lastKeyPressSavedPageNotes");
  }
  
  /* store key press and check active element */
  let currentKeyPress = event.key;

  /* start conditions to activate note box or run function accordingly  */
  /* if any of these elements have focus */
  /** ignoredDOMElementsSavedPageNotes = "comments search contenteditable-root playerSavedPageNotes"; **/
  /* then don't take notes - note - variable defined at start */
  for (i in ignoredDOMElementsSavedPageNotes) {
   if (activeID == ignoredDOMElementsSavedPageNotes[i]) { 
    /* quit function  */
    return;
   } 
  } /* else */
  { /* the active element is not in ignored list, run function */
   let checkKeyCombo = /* check for combos */
    lastKeyPressSavedPageNotes + "+" + currentKeyPress;
    
   /* check key combos and run function accordingly */
   if (checkKeyCombo == "Control+Shift") {
    noteBoxTakNotes.blur();    /* out of note box */
   } 
   /* add time marker adjacent to notes */
   else if (checkKeyCombo == "Control+m") {    
    updateCurrentTime();
    markTime();    
   } 
   /* select and copy notes to clipboard  */
   else if (checkKeyCombo == "Alt+a") {
    copyNotesSavedPageNotes();
   } else {
    /* only if note box is not active element */
    if (activeID != "noteBoxTakNotes") {
     /* prevent fullscreen from occuring *//*
     **************************************
     NOTE - THIS DOES NOT WORK
     *************************
     if (currentKeyPress == "f") {
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Esc'}));
     }
     **************************************
     ***************************************/
     /* USE VARIABLE FOR CONDITIONS */
     let noIgnoredKeys = ignoredKeysSavedPageNotes.indexOf(event.key) == -1;
     let notPauseShortcut = checkKeyCombo != "Shift+ ";
     if (noIgnoredKeys) {
      if (notPauseShortcut) {
       noteBoxTakNotes.focus();
      }
     }
    }   
   }
  }
  /* store key press for next key combo check */
  sessionStorage.setItem("lastKeyPressSavedPageNotes", event.key);
 };
 
 /* Begin taking notes. */
 noteBoxTakNotes.focus();
 
 /* Quickly get back to notes */
 const addKeyDownSavedPageNotes = () => { 
  document.body.addEventListener("keydown", 
   function() { keypressToNoteSavedPageNotes(); }); 
 };
 
 const addKeyUpSavedPageNotes = () => { 
  document.body.addEventListener("keyup", 
   function() { keypressToNoteSavedPageNotes(); }); 
 };
 
 /* Listen for keydonw event. */ 
 addKeyDownSavedPageNotes();
 
 /**********************************************************************************
  MAIN FUNCTION 
  *********************************************************************************/
 function addSavedPageNotesToNotebox() {
  /* get the video title */
  let titlePar = document.getElementsByClassName("style-scope ytd-watch-metadata");
  let videoTitle = titlePar[0].innerText.replace(/\n.*/g,"");

  /* get the id holding the username             */
  let username = 
   document.getElementById("top-row");

  /* extract all text from id holding user name  */
  let extractUserNameText = username.textContent;

  /* clean text to only get username only        */
  let usernameVal =   extractUserNameText.replace(/\n/g,"")
   .replace(/^ {2,}(.*) {2,}(.*)subscribers(.*)$/g,"$1")
   .replace(/^(.*) {2,}.*$/g, "$1")
   .replace(/ {2,}/g,"");

  /* generate name for localStorage variable  */
  let storageVar = usernameVal + "--" + videoTitle;
  storageVar = storageVar.replace(/ {1,}/g, "-");

  /* 
   store notes in local storage as variable formatted: 
   usename--Video-Title
  */
  let storedNotes = localStorage.getItem(storageVar);
  if (storedNotes == null ||
      storedNotes == undefined) {
   alert("There are no saved notes for the current page.");
   savedNotesTimeAdded = 1; /* run mark time as normal */
  } else {
   storedNotesArrSavedPageNotes = storedNotes.split("--:--"); /* make saved notes array */
   
   /* store previos notes */
   let priorNotesTaken = storedNotesArrSavedPageNotes[1];
   
   noteBoxTakNotes.textContent = /* add prior notes to box */
    storedNotesArrSavedPageNotes[0] + "\n" +  /* add heading for title and date         */
    storedNotesArrSavedPageNotes[1].replace(/<br>/g, "\n");   /* replace with new lines */
    
   /* check if time marks were saved */
   if (storedNotesArrSavedPageNotes[2] == "empty") { /* no time marks from prior notes  */
    savedNotesTimeAdded = 1; /* run mark time as normal */
   } else {
    /* add time marks from prior notes */
    markTime();
    savedNotesTimeAdded = 1; /* run mark time as normal */
   }   
   alert("PRIOR NOTE SESSION LOADED: \n\n" +
    "NOTE - type \"clear\" or \"delete\", then save to alter log " +
    "accordingly, else all saves will be stored in running log of " +
    "note sessions.\n" + 
    "NOTE - it is safe to remove these notes if saving this session " +
    "as they will remain in local storage for notes saved for video.\n" +
    "NOTE - to avoid clutter it is suggested that the notes from prior " + 
    "sessions be cleaned or cleared before saving this session.\n" +
    "NOTE - To clear running log of notes, save page notes with only: \n" +
    "\"clear\" \n" + "typed into the note box.\n" + "and run bookmarklet " +
    "siteSpecific_YouTube_SavePageNotesToLocalStorage.\n" +
    "NOTE - To delete notes for this video, save page notes with only: \n" +
    "\"delete\" \n" + "typed into the note box." + "and run bookmarklet " +
    "siteSpecific_YouTube_SavePageNotesToLocalStorage."
   );
   noteBoxTakNotes.select();
  }
 }
 addSavedPageNotesToNotebox();
})();