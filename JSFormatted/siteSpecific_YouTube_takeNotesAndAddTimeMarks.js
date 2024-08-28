javascript:(function(){ 
 /* Global DOM variables */
 var noteAreaID =           /* parent for note elements */
  document.getElementById("noteArea");
 var noteBox =              /* textare element for taking notes */
  document.getElementById("noteBox");
 var aboveTheFold =         /* html after vidoe box */
  document.getElementById("above-the-fold");
 var currentTimeClassName = /* class element with current time */
  "ytp-time-current"; 
 
 /* Note box setup. */
 var noteTextArea, noteArea;
 if (!noteAreaID) {
  /* are for notes */
  noteArea = document.createElement("div");
  noteArea.id = "noteArea";
  noteArea.style.display = "inline-grid";
  noteArea.style.position = "relative";
  noteArea.style.top = "0px";
  noteArea.style.width = "100%";  
  aboveTheFold.insertAdjacentElement("beforebegin", noteArea); 
  noteAreaID = document.getElementById("noteArea");
  /* note box */
  noteTextArea = document.createElement("textarea"); 
  noteTextArea.id = "noteBox"; 
  noteTextArea.style.maxWidth = "450px";
  noteTextArea.style.width = "450px";
  noteTextArea.style.height = "100px";
  noteTextArea.style.borderRadius = "10px";
  noteAreaID.insertAdjacentElement("afterbegin", noteTextArea); 
 }
 
 /* Redefine noteBox */
 noteBox = document.getElementById("noteBox");
 
 /* Global config variables */
 var enterCount = 0; /* hold for 2 seconds to copy notes */
 var shiftCount = 0; /* hold for 2 seconds to mark video time */
 
 /***** SUPPORT FUNCTIONS *****/
 /* Copy notes in textare to clipboard. */
 function copyNotes() {
  noteBox.select();
  navigator.clipboard.writeText(noteBox.value);
 }
 /* 
    Focus on textarea whenever keydown occurs. 
    NOTE - if using key combe `Ctrl + Shift + Home` press shift key first.
 */
 function keypressToNote() {
  let activeID = document.activeElement.id;
  let lastKeyPress; /* used to check for key combos */
  lastKeyPress = sessionStorage.getItem("lastKeyPress");
  if (lastKeyPress == null) { 
   sessionStorage.setItem("lastKeyPress", event.key);
   lastKeyPress = sessionStorage.getItem("lastKeyPress");
  }
  let currentKeyPress = event.key;
  let ignoredKeys = "Home"; 
  if (activeID != "comments" || /* if any of these elements have focus */
      activeID != "search"   || /* then don't take notes */
      activeID != "contenteditable-root") {   
   let checkKeyCombo = /* check for combos */
    lastKeyPress + "+" + currentKeyPress;
   if (checkKeyCombo == "Control+Shift") {
    noteBox.blur();    /* out of note box */
   } else {
    /* only if note box is not active element */
    if (activeID != "noteBox") {
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
     let noIgnoredKeys = ignoredKeys.indexOf(event.key) == -1;
     let notPauseShortcut = checkKeyCombo != "Shift+ ";
     if (noIgnoredKeys) {
      if (notPauseShortcut) {
       noteBox.focus();
      }
     }
    }   
   }
  }
  /* store key press for next key combo check */
  sessionStorage.setItem("lastKeyPress", event.key);
 } 
 
 /* Add time mark button to the right of textarea. */
 function markTime() {  
  noteBox.blur(); /* quickly deactivate note box */
  let curTimeElement = 
   document.getElementsByClassName(currentTimeClassName); 
  /* extract time and calculate in seconds */
  let timePreCal = curTimeElement[0].innerText.split(":");  
  /* calculate time in seconds */
  let timeSecCal;
  if (timePreCal.length == 3) { /* not handling videos over 24 hours - no */
   timeSecCal = 
    Number(Number(timePreCal[0]*60) * 60) + /* hours to seconds   */
    Number(timePreCal[1]*60) +              /* minutes to seconds */
    Number(timePreCal[2]);                  /* seconds */
  } 
  else if (timePreCal.length == 2) {
   timeSecCal = 
    Number(timePreCal[0]*60) +    /* minutes to seconds */
    Number(timePreCal[1]);        /* seconds */
  } 
  else if (timePreCal.length == 1) {
   timeSecCal =      
    Number(timePreCal[0]); /* seconds */
  }
  
  let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea");
  let timeMarkButtonArea;
  if (!timeMarkButtonAreaID) { /* create area for time mark buttons */
   timeMarkButtonArea = document.createElement("span");
   timeMarkButtonArea.id = "timeMarkButtonArea";
   timeMarkButtonArea.style.display = "inline-flex";
   timeMarkButtonArea.style.flexWrap = "wrap";
   timeMarkButtonArea.style.position = "relative";    
   timeMarkButtonArea.style.float = "left";
   timeMarkButtonArea.style.left = "450px";
   timeMarkButtonArea.style.maxWidth = "750px";
   timeMarkButtonArea.style.marginLeft = "10px";       
   /* insert area for time marks */
   noteBox.insertAdjacentElement("afterend", timeMarkButtonArea);
  }
  let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCal);
  let curTimeMarkBtn;
  if (!curTimeMarkBtnID) { /* create time mark buttons */
   let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea");
   curTimeMarkBtn = document.createElement("a");
   curTimeMarkBtn.id = "timeMarkBtn" + timeSecCal;
   curTimeMarkBtn.style.cursor = "pointer";
   curTimeMarkBtn.style.boxSizing = "border-box";
   curTimeMarkBtn.style.display = "inline-table";
   curTimeMarkBtn.style.position = "relative";   
   curTimeMarkBtn.style.top = "-100px";
   curTimeMarkBtn.style.left = "10px";      
   curTimeMarkBtn.style.width = "auto";
   curTimeMarkBtn.style.height = "25px";
   curTimeMarkBtn.style.marginLeft = "10px";
   curTimeMarkBtn.style.marginTop = "3px";
   curTimeMarkBtn.style.padding = "10px"; 
   curTimeMarkBtn.style.paddingTop = "5px";
   curTimeMarkBtn.style.background = "#282828";
   curTimeMarkBtn.style.color = "white";   
   curTimeMarkBtn.target = "_blank";   
   let vidURL = location.href;
   /* conditions if url did not already have time value */
   if (vidURL.indexOf("t=") > -1) { /* had time value   */
    vidURL = vidURL.replace(/t=[0-9]+/, "t=" + timeSecCal);
   } else {                         /* no time value    */
    vidURL += "&t=" + timeSecCal + "s";
   }   
   curTimeMarkBtn.href = vidURL;
   /* use hour : minutes: seconds */
   for (i in timePreCal) {
    if (i == Number(timePreCal.length-1)) {
     if (Number(timePreCal.length-1) == 0) {
      curTimeMarkBtn.innerText = "0:" + timePreCal[i];
     } else {
      curTimeMarkBtn.innerText += timePreCal[i];
     }     
    } else {
     curTimeMarkBtn.innerText += timePreCal[i] + ":";
    }
   }
   
   timeMarkButtonAreaID.insertAdjacentElement("beforeend", curTimeMarkBtn);
  }
  /* focus back on note box */
  noteBox.focus();
 }
 
 /* Begin taking notes. */
 noteBox.focus();
 noteBox.addEventListener("keydown", function() {
  /*** INLINE FUNCTIONS ***/
  /*
  check if enter pressed for over 2 second-ish 
  copy contents of text area to clipboard 
  */
  let checkEnter = () => {
   if (enterCount >= 2) { /* prevent multiple new lines from being created */
    let noteVal = noteBox.value;
    let lastLineBreak = noteVal.lastIndexOf("\n");
    let firstLineBreak = noteVal.indexOf("\n");
    if (lastLineBreak != firstLineBreak) {
     /* delete every new line after the last one */
     noteVal = noteVal.substr(0, lastLineBreak);
     noteBox.value = noteVal;    
    }
   }  
   /*hold donw enter for 2-ish seconds */
   if (enterCount >= 20) {
    copyNotes(); /* copy note box to clipboard */
    /* prevent notes and clipboard from being cleared */
    document.body.removeEventListener("keydown", keypressToNote);
    noteBox.blur();
    enterCount = 0;
    document.body.addEventListener("click", addKeyDown);
   }
  };
  /*
  check if shift pressed for over 2 seconds-ish 
  add timemark button to right of textarea 
  */
  let checkShift = () => {
   /* hold down shift for 2-ish seconds */
   if (shiftCount >= 20) {    
    markTime();
    shiftCount = 0;    
   }
  };    
  /* check how long enter is pressed */
  if (event.key == "Enter") {
   checkEnter();
   enterCount++;
  } 
  /* check how long shift is pressed */
  if (event.key == "Shift") {
   checkShift();
   shiftCount++;
  }   
 });
 
 /* Quickly get back to notes */
 const addKeyDown = () => { document.body.addEventListener("keydown", keypressToNote); };
 /* Reset Shift and Enter time switches on keyup. */
 document.body.addEventListener("keyup", function() {
  /* reset enter counter */
  enterCount = 0;
  shiftCount = 0;
  /* prevent fullscreen from occuring *//*
  **************************************
  NOTE - THIS DOES NOT WORK
  *************************
  let firstKey = event.key;
  if (firstKey == "f") {
   document.body.dispatchEvent(new KeyboardEvent('keyup', {'key': 'Esc'}));   
  }
  **************************************
  ***************************************/
 });
 addKeyDown();
})();