javascript:(function(){ 
 /* Global DOM variables */
 var noteAreaID =            /* parent for note elements */
  document.getElementById("noteArea");
 
 var noteBox =               /* textare element for taking notes */
  document.getElementById("noteBox");
 
 var closeNoteBox =          /* Close notebox element */
  document.getElementById("closeNoteBox");
 
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
 
 /* Global configuration variables */
 var ignoredKeys = /* keys pressed that do not active not box */
  "Home End PageUp PageDown"; 
 
 var ignoredDOMElements =  /* stop function if one of these is active */
  ["comments", "search", "contenteditable-root", "player"]; 
 
 /* CSS style sheet */
 {
 var noteCSS = `
 /* style close elements with constant styles */
  button#closeNoteBoxBtn {
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
  button#closeNoteBoxBtn:hover,
  button#closeNoteBoxBtn:hover ~ input#closeCheckbox:hover {
   border: 3px solid gray;
  }
  input#closeCheckbox {
   box-sizing: content-box;
   display: inline-block;
   position: absolute;
   left: -5px;
   top: 5px;
   z-index: 2;
   opacity: 0;
  }
  input#closeCheckbox:hover {
   width: 20px;
   height: 20px; 
   border: 2px solid gray;
   opacity: .25;
  }
  
  input#closeCheckbox:checked + div#noteArea {
   display: inline-flex;
  }
  
  input#closeCheckbox + div {
   display: none;
  }
  /* style note area with constant styles */
  div#noteArea {
   display: inline-flex;
   flex-wrap: nowrap;
   position: relative;
   top: 0px;
   width: 100%;
  }
  div #noteArea div {
   display: inline-block; 
   position: relative;
   margin: 0px 10px;
   max-width: 450px;
   width: min-content;
  }
  div#noteArea div+div {
   display: inline-block;
   position: relative;
   max-width: 800px;
   width: auto !important;
   left: 0px; 
  }
  /* style note box with constant style */
  textarea#noteBox {
   max-width: 450px;  
   width: 450px;
   height: 100px; 
   padding: 10px;
   border-radius: 10px;
  }
  /* style time mark buttons with constant styles */
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
 var noteTextArea, noteArea, noteBoxDiv, 
     closeNoteBoxBtn, closeCheckbox;
 if (!noteAreaID) {
  /* are for notes */
  noteArea = document.createElement("div");
  noteArea.id = "noteArea";   
  aboveTheFold.insertAdjacentElement("beforebegin", noteArea); 
  
  let noteStyle =         /* using noteCSS from above */
   document.createElement("style"); 
  
  noteStyle.textContent = /* add css properties */
   noteCSS;        
  
  noteArea.insertAdjacentElement("beforebegin", noteStyle);
  noteAreaID = document.getElementById("noteArea");
  
  /* note box */
  noteTextArea = document.createElement("textarea"); 
  noteTextArea.id = "noteBox"; 
  noteBoxDiv = document.createElement("div");
  
  /* insert div to hold textarea */
  noteAreaID.insertAdjacentElement("afterbegin", noteBoxDiv);
  
  /* insert textare html elements to take notes */
  noteBoxDiv.insertAdjacentElement("afterbegin", noteTextArea); 
  
  /* ckise buttnon */
  closeNoteBoxBtn = document.createElement("button");
  closeNoteBoxBtn.id = "closeNoteBoxBtn";
  noteStyle.insertAdjacentElement("afterend", closeNoteBoxBtn);
  closeNoteBoxBtn.textContent = "X";
  
  /* checkbox to show hide with css */
  closeCheckbox = document.createElement("input");
  closeCheckbox.type = "checkbox";
  closeCheckbox.id = "closeCheckbox";  
  closeNoteBoxBtn.insertAdjacentElement("afterend", closeCheckbox);
  closeCheckbox = document.getElementById("closeCheckbox");
  closeCheckbox.setAttribute("checked", true);
  /* alternate blose button status */
  closeCheckbox.addEventListener("click", function() {
   if (this.previousElementSibling.textContent == "X") {
    this.previousElementSibling.textContent = "O";
   } else {
    this.previousElementSibling.textContent = "X";
   }
  });
 }
 
 /* Redefine noteBox */
 noteBox = document.getElementById("noteBox");
 
 /***** SUPPORT FUNCTIONS *****/
 /* Copy notes in textare to clipboard. */
 function copyNotes() {
  noteBox.select();
  navigator.clipboard.writeText(noteBox.value);
 }
 
 /* Focus on textarea whenever keydown occurs. */
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

  /* start conditions to activate note box or run function accordingly  */
  /* if any of these elements have focus */
  /** ignoredDOMElements = "comments search contenteditable-root player"; **/
  /* then don't take notes - note - variable defined at start */
  for (i in ignoredDOMElements) {
   if (activeID == ignoredDOMElements[i]) { 
    /* quit function  */
    return;
   } 
  }  /* else */
  { /* the active element is not in ignored list, run function */
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
   noteBoxDiv.insertAdjacentElement("afterend", timeMarkDiv);   
   /* insert time mark box */
   timeMarkDiv.insertAdjacentElement("afterbegin", timeMarkButtonArea);
  }
  
  /* give each mark id with time appended */
  let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCal);
  let curTimeMarkCloseBtn, curTimeMarkBtn;
  
  /* don't duplicate time marks */
  if (!curTimeMarkBtnID) { /* create time mark buttons */
   let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea");
   
   /* CREATE AND ADD CLOSE TIME MARK BUTTONS ***************************************/
   curTimeMarkCloseBtn = /* enable time marks to be removed    */
    document.createElement("span");    
    
  curTimeMarkCloseBtn   /* give each a unique data attribute */
   .id = "closeTimeMarkBtn" + timeSecCal;
   
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
     this.nextElementSibling.remove();  /* select and rmeove time mark */
     this.remove();                     /* rmove this element */
    });
   
   curTimeMarkCloseBtn   /* give close symbol as string - x */
   .innerText = "x";
   
   /* insert close time mark button */
   timeMarkButtonAreaID.insertAdjacentElement("beforeend", curTimeMarkCloseBtn);
      
   /* CREATE AND ADD TIME MARK BUTTONS ********************************************/
   let closeTimeBtn =    /* get id of close button to insert time mark after it */
    document.getElementById("closeTimeMarkBtn" + timeSecCal);
    
   curTimeMarkBtn =      /* time mark linking tom marked times */
    document.createElement("a");
   
   curTimeMarkBtn.id =   /* give each a unique id */
    "timeMarkBtn" + timeSecCal;
   
   /* open link in new tab - _blank */
   curTimeMarkBtn.target =  "_blank";   
   let vidURL = location.href; /* extract current url */
   
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
   /* insert time marked at key combo "Ctrl + m" */
   closeTimeBtn.insertAdjacentElement("afterend", curTimeMarkBtn);
   
   /* add click event to pause video if clicked and video is playing */
   curTimeMarkBtn.addEventListener("click", function() {
    let playButtonData = playButton[0].dataset.titleNoTooltip;
    if (playButtonData != "Play") {
     playButton[0].click();
    }
   });     
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
 /* Listen for keydonw event. */ 
 addKeyDown();
})();