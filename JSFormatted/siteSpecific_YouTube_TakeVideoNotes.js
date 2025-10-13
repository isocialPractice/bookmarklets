javascript:(function(){ 
 /* Config variables. */
 var heightTakeVideoNotes = /* set initial height for notes */
  "50px";
  
 /* Global DOM variables */
 var noteAreaTakeNotesIDTakeNotes =  /* parent for note elements */
  document.getElementById("noteAreaTakeNotes");
 
 var noteBoxTakNotes =               /* textare element for taking notes */
  document.getElementById("noteBoxTakNotes");
 
 var closeNoteBoxTakeNotes =         /* Close notebox element */
  document.getElementById("closeNoteBoxTakeNotes");
 
 var aboveTheFoldTakeNotes =         /* html after vidoe box */
  document.getElementById("above-the-fold");
 
 var playerTakeNotes =               /* video playerTakeNotes topmost parent */
  document.getElementById("player"); 
 
 var playButtonTakeNotes =           /* play button - needed to update time mark */
  document.getElementsByClassName("ytp-play-button");
 
 var currentTimeClassNameTakeNotes = /* class element with current time */
  "ytp-time-current"; 
 
 /* Global configuration variables */
 var ignoredKeysTakeNotes =          /* keys pressed that do not active not box */
  "Home End PageUp PageDown"; 
 
 var ignoredDOMElementsTakeNotes =   /* stop function if one of these is active */
  ["comments", "search", "contenteditable-root", "player"]; 
 
 /* CSS style sheet */
 {
 var noteCSSTakeNotes = `
 /* style close elements with constant styles */
  button#closeNoteBoxTakeNotesBtn {
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
  button#closeNoteBoxTakeNotesBtn:hover,
  button#closeNoteBoxTakeNotesBtn:hover ~ input#closeCheckbox:hover {
   border: 3px solid gray;
  }
  button#closeNoteBoxTakeNotesBtn.hideNotesTakeNotes + div {
   display: none !important;
  }
  button#closeNoteBoxTakeNotesBtn.hideNotesTakeNotes + div + div {
   margin-top: 20px;
  }
  /* style note area with constant styles */
  div#noteAreaTakeNotes {
   display: inline-flex;
   flex-wrap: nowrap;
   position: relative;
   top: 0px;
   width: 100%;
  }
  div #noteAreaTakeNotes div {
   display: inline-block; 
   position: relative;
   margin: 0px 10px;
   max-width: 450px;
   width: min-content;
  }
  div#noteAreaTakeNotes div+div {
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
   height: ${heightTakeVideoNotes}; 
   padding: 10px;
   border-radius: 10px;
  }
`;
  }
 /* Note box setup. */
 var noteTextAreaTakeNotes, noteAreaTakeNotes, noteBoxTakNotesDiv, 
     closeNoteBoxTakeNotesBtn, closeCheckbox;
 if (!noteAreaTakeNotesIDTakeNotes) {
  /* are for notes */
  noteAreaTakeNotes = document.createElement("div");
  noteAreaTakeNotes.id = "noteAreaTakeNotes";   
  aboveTheFoldTakeNotes.insertAdjacentElement("beforebegin", noteAreaTakeNotes); 
  
  let noteStyle =         /* using noteCSSTakeNotes from above */
   document.createElement("style"); 
  
  noteStyle.textContent = /* add css properties */
   noteCSSTakeNotes;        
  
  noteAreaTakeNotes.insertAdjacentElement("beforebegin", noteStyle);
  noteAreaTakeNotesIDTakeNotes = document.getElementById("noteAreaTakeNotes");
  
  /* note box */
  noteTextAreaTakeNotes = document.createElement("textarea"); 
  noteTextAreaTakeNotes.id = "noteBoxTakNotes"; 
  noteBoxTakNotesDiv = document.createElement("div");
  
  /* insert div to hold textarea */
  noteAreaTakeNotesIDTakeNotes.insertAdjacentElement("afterbegin", noteBoxTakNotesDiv);
  
  /* insert textare html elements to take notes */
  noteBoxTakNotesDiv.insertAdjacentElement("afterbegin", noteTextAreaTakeNotes); 
  
  /* close buttnon */
  closeNoteBoxTakeNotesBtn = document.createElement("button");
  closeNoteBoxTakeNotesBtn.id = "closeNoteBoxTakeNotesBtn";
  noteStyle.insertAdjacentElement("afterend", closeNoteBoxTakeNotesBtn);
  closeNoteBoxTakeNotesBtn.textContent = "X";
  
  /* get id of button to close note area - enables this to work with timemarks */
  let closeBtnIDTakeNotes = document.getElementById("closeNoteBoxTakeNotesBtn");    
  /* alternate close button status */
  closeBtnIDTakeNotes.addEventListener("click", function() {
   if (this.textContent == "X") {
    this.className = "hideNotesTakeNotes"; /* hide note area with css rules    */     
    this.textContent = "O";                /* switch hiding note area          */
   } else {
    this.className = "";                   /* show note area with css rules    */
    this.textContent = "X";                /* switch to show note area         */
   }
  });
 }
 
 /* Redefine noteBoxTakNotes */
 noteBoxTakNotes = document.getElementById("noteBoxTakNotes");
 
 /***** SUPPORT FUNCTIONS *****/
 /* Copy notes in textare to clipboard. */
 function copyNotesTakeNotes() {
  noteBoxTakNotes.select();
  navigator.clipboard.writeText(noteBoxTakNotes.value);
 }
 
 /* Focus on textarea whenever keydown occurs. */
 function keypressToNoteTakeNotes() {
  let activeID = document.activeElement.id;
  let lastKeyPressTakeNotes; /* used to check for key combos */
  lastKeyPressTakeNotes = sessionStorage.getItem("lastKeyPressTakeNotes");
  
  /* for first key press */
  if (lastKeyPressTakeNotes == null) { 
   sessionStorage.setItem("lastKeyPressTakeNotes", event.key);
   lastKeyPressTakeNotes = sessionStorage.getItem("lastKeyPressTakeNotes");
  }
  
  /* store key press and check active element */
  let currentKeyPress = event.key;

  /* start conditions to activate note box or run function accordingly  */
  /* if any of these elements have focus */
  /** ignoredDOMElementsTakeNotes = "comments search contenteditable-root playerTakeNotes"; **/
  /* then don't take notes - note - variable defined at start */
  for (i in ignoredDOMElementsTakeNotes) {
   if (activeID == ignoredDOMElementsTakeNotes[i]) { 
    /* quit function  */
    return;
   } 
  } /* else */
  { /* the active element is not in ignored list, run function */
   let checkKeyCombo = /* check for combos */
    lastKeyPressTakeNotes + "+" + currentKeyPress;
    
   /* check key combos and run function accordingly */
   if (checkKeyCombo == "Control+Shift") {
    noteBoxTakNotes.blur();    /* out of note box */
   }
   /* select and copy notes to clipboard  */
   else if (checkKeyCombo == "Alt+a") {
    copyNotesTakeNotes();
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
     let noIgnoredKeys = ignoredKeysTakeNotes.indexOf(event.key) == -1;
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
  sessionStorage.setItem("lastKeyPressTakeNotes", event.key);
 } 
 
 /* Begin taking notes. */
 noteBoxTakNotes.focus();
 
 /* Quickly get back to notes */
 const addKeyDownTakeNotes = () => { document.body.addEventListener("keydown", function() {
  keypressToNoteTakeNotes();  
  }); 
 }; 
 const addKeyUpTakeNotes = () => { document.body.addEventListener("keyup", function() {
  keypressToNoteTakeNotes();
  }); 
 };
 /* Listen for keydonw event. */ 
 addKeyDownTakeNotes();
})();