javascript:(function(){ 
 /* Global DOM variables */
 var noteAreaID =            /* parent for note elements */
  document.getElementById("noteArea");
 var noteBox =               /* textare element for taking notes */
  document.getElementById("noteBox");
 var aboveTheFold =          /* html after vidoe box */
  document.getElementById("above-the-fold");
 var player =                /* video player topmost parent */
  document.getElementById("player"); 
 var playButton =            /* play button - needed to update time mark */
  document.getElementsByClassName("ytp-play-button");
 var currentTimeClassName =  /* class element with current time */
  "ytp-time-current"; 
 var curTimeElement;         /* redefined to get time mark  */
 var timePreCal, timeSecCal; /* redefined - time mark in seconds and time mark */
 
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
 const updateCurrentTime = () => {
  /* update HTML element holding time value */
  let playButtonData = playButton[0].dataset.titleNoTooltip;
  if (playButtonData != "Play") {
   playButton[0].click(); playButton[0].click();
  }
  /* update time value HTML element */
  curTimeElement = /* select element with current time */
   document.getElementsByClassName(currentTimeClassName); 
  curTimeElementText = curTimeElement[0].textContent;
  /* extract time and calculate in seconds */
  timePreCal = curTimeElementText.split(":");    
 };
 function keypressToNote() {
  let activeID = document.activeElement.id;
  let lastKeyPress; /* used to check for key combos */
  lastKeyPress = sessionStorage.getItem("lastKeyPress");
  
  /* for first key press */
  if (lastKeyPress == null) { 
   sessionStorage.setItem("lastKeyPress", event.key);
   lastKeyPress = sessionStorage.getItem("lastKeyPress");
  }
  
  /* store key press and check active element */
  let currentKeyPress = event.key;
  let ignoredKeys = "Home"; /* keys pressed that do not active not box */

  /* start conditions to activate note box or run function accordingly  */
  if (activeID != "comments" || /* if any of these elements have focus */
      activeID != "search"   || /* then don't take notes */
      activeID != "contenteditable-root" ||
      activeID != "player") {   
   let checkKeyCombo = /* check for combos */
    lastKeyPress + "+" + currentKeyPress;
    
   /* check key combos and run function accordingly */
   if (checkKeyCombo == "Control+Shift") {
    noteBox.blur();    /* out of note box */
   } /* add time marker adjacent to notes */
   else if (checkKeyCombo == "Control+m") {    
    updateCurrentTime();
    markTime();    
   }  /* select and copy notes to clipboard  */
   else if (checkKeyCombo == "Alt+a") {
    copyNotes();
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
  noteBox.setAttribute("disabled", true);
  
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
   if (vidURL.indexOf("&t=") > -1) { /* had time value   */
    vidURL = vidURL.replace(/t=[0-9]+/, "t=" + timeSecCal);
   } else {                         /* no time value    */
    vidURL = vidURL + "&t=" + timeSecCal + "s";
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
  noteBox.removeAttribute("disabled");
  noteBox.focus();
 }
 
 /* Begin taking notes. */
 noteBox.focus();
 
 /* Quickly get back to notes */
 const addKeyDown = () => { document.body.addEventListener("keydown", function() {
  keypressToNote();  
  }); 
 }; 
 const addKeyUp = () => { document.body.addEventListener("keyup", function() {
  keypressToNote();
  }); 
 };
 
 player.click();
 addKeyDown();
})();