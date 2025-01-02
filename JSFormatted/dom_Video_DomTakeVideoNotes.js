javascript:(function() { 
 /* OPTIONAL FUNCTIONALITY VARIABLES
 ///////////////////////////////////////////////////*/ 
 /* OPTIONAL - use key press events */
 var allowKeyPressDomTakeVideoNotes = 1; 
 
 /* OPTIONAL - prompt with instructions */
 var promptInstructionsDomTakeVideoNotes = 1;
 
 /* CONFIG VARIABLES
 ///////////////////////////////////////////////////*/ 
 /* Keys pressed that do not active not box. */
 var ignoredKeysDomTakeVideoNotes =   
  "Home End PageUp PageDown"; 

 /* Set max height and width that note box can be sest to. */
 var maxWidthDomTakeVideoNotes = "1000px";
 var maxHeightDomTakeVideoNotes = "600px";
 
 /* HTML PAGE ELEMENTS
 ///////////////////////////////////////////////////*/
 /* Lookout for a video tag. */
 var checkVideoTagDomTakeVideoNotes = 
  document.getElementsByTagName("video");
 
 /* Lookout for an iframe tag. */ 
 var checkIframeDomTakeVideoNotes = 
  document.getElementsByTagName("iframe");    
 
 /* style applied to video area. */
 var noteBoxStyling = `
  div#noteBoxDomTakeVideoNotes {
   position: fixed;
   z-index: 1;
   bottom: 10px;
   max-width: 500px;
   max-height: 500px;
   margin-left: 20px;
   margin-bottom: 20px;
  }
  div#closeDomTakeVideoNotes {
   box-sizing: content-box;
   cursor: pointer;
   display: inline-block;
   position: absolute;   
   z-index: 2;
   width: 15px;   
   height: 15px;   
   padding: 5px 5px 15px 5px;
   margin-top: -15px;
   margin-left: 5px;   
   background: red;
   color: white;
   border-radius: 5px;
   text-align: center;   
  }
  div#showHideNoteBoxDomTakeVideoNotes,
  textarea#textareaDomTakeVideoNotes {
   max-width:  ${maxWidthDomTakeVideoNotes}  !important;
   max-height: ${maxHeightDomTakeVideoNotes} !important;
  }
  div#showHideNoteBoxDomTakeVideoNotes {
   resize: both !important;    
   overflow: auto;
   transform: rotateX(180deg);
   height: 200px;
   width: 600px;
   padding: 0px;   
  }
  textarea#textareaDomTakeVideoNotes {
   box-sizing: border-box;
   position: absolute;
   z-index: 1;
   resize: none;
   transform: rotateX(180deg);
   height: inherit;
   width: inherit;
   margin-left: 10px;
   margin-bottom: 10px;
   padding: 25px;
  }
 `;
 
 /* Make sure page has either a video tag or an iframe tag. */
 if (
     checkVideoTagDomTakeVideoNotes.length > 1 || 
     checkIframeDomTakeVideoNotes.length > 1
    ) {
  /* create elements for take notes area */
  let noteBoxStyleDomTakeVideoNotes = document.createElement("style");
  let noteBoxDomTakeVideoNotes = document.createElement("div"); 
  let closeDomTakeVideoNotes = document.createElement("div");
  let showHideNoteBoxDomTakeVideoNotes = document.createElement("div");
  let textareaDomTakeVideoNotes = document.createElement("textarea");
  
  /* add id for styling and additional functionality */
  noteBoxStyleDomTakeVideoNotes.id = "noteBoxStyleDomTakeVideoNotes";       /* checks if notebox exist */
  noteBoxDomTakeVideoNotes.id = "noteBoxDomTakeVideoNotes";                 /* hold all                */
  closeDomTakeVideoNotes.id ="closeDomTakeVideoNotes";                      /* show and hide notes     */
  showHideNoteBoxDomTakeVideoNotes.id = "showHideNoteBoxDomTakeVideoNotes"; /* style with display none */
  textareaDomTakeVideoNotes.id = "textareaDomTakeVideoNotes";               /* text box for notes      */
  
  /* first check if bookmarklet has been applied */
  let checkIfDomTakeVideoNotes = 
   document.getElementById("noteBoxStyleDomTakeVideoNotes");
  
  /* if not applied apply bookmarklet and add note elements */
  if (!checkIfDomTakeVideoNotes) {
   /* insert style tag and use noteBoxStyling defined at start */
   document.body.appendChild(noteBoxStyleDomTakeVideoNotes);
   noteBoxStyleDomTakeVideoNotes.innerText = noteBoxStyling;

   /* insert and select newly inserted element */
   document.body.appendChild(noteBoxDomTakeVideoNotes);   
   let noteBoxDomTakeVideoNotesID = 
    document.getElementById("noteBoxDomTakeVideoNotes");

   /* insert and select newly inserted element */
   noteBoxDomTakeVideoNotesID
   .insertAdjacentElement("afterbegin", closeDomTakeVideoNotes);
   let closeDomTakeVideoNotesID = 
    document.getElementById("closeDomTakeVideoNotes");

   /* insert and select newly inserted element */
   closeDomTakeVideoNotesID
   .insertAdjacentElement("afterend", showHideNoteBoxDomTakeVideoNotes);  
   let showHideNoteBoxDomTakeVideoNotesID = 
    document.getElementById("showHideNoteBoxDomTakeVideoNotes");

   /* insert and select newly inserted element */
   showHideNoteBoxDomTakeVideoNotesID
   .insertAdjacentElement("afterbegin", textareaDomTakeVideoNotes);  
   let textareaDomTakeVideoNotesID = 
    document.getElementById("textareaDomTakeVideoNotes");

   /* add ablility for not box to be hidden */
   closeDomTakeVideoNotesID.innerText = "x";
   closeDomTakeVideoNotesID.dataset.showhide = "0";
   closeDomTakeVideoNotesID.addEventListener("click", function() {
    if (this.dataset.showhide == "0") {
     this.dataset.showhide = "1";
     this.innerText = "o";
     this.nextElementSibling.style.display = "none";
    } else {
     this.dataset.showhide = "0";
     this.innerText = "x";
     this.nextElementSibling.style.display = "";
    }
   });
   
   /***** KEY PRESS FUNCTIONS *****/
   if (allowKeyPressDomTakeVideoNotes == 1) {
    /* Copy notes in textare to clipboard. */
    function copyNotesDomTakeVideoNotes() {
     textareaDomTakeVideoNotesID.select();
     navigator.clipboard.writeText(textareaDomTakeVideoNotesID.value);
    }

    /* Focus on textarea whenever keydown occurs. */
    function keypressToNoteDomTakeVideoNotes() {
     let activeID = document.activeElement.id;
     let lastKeyPressDomTakeVideoNotes; /* used to check for key combos */
     lastKeyPressDomTakeVideoNotes = 
      sessionStorage.getItem("lastKeyPressDomTakeVideoNotes");

     /* for first key press */
     if (lastKeyPressDomTakeVideoNotes == null) { 
      sessionStorage.setItem("lastKeyPressDomTakeVideoNotes", event.key);
      lastKeyPressDomTakeVideoNotes = 
       sessionStorage.getItem("lastKeyPressDomTakeVideoNotes");
     }

     /* store key press and check active element */
     let currentKeyPress = event.key;

     /* start conditions to activate note box or run function accordingly  */
     /* if any of these elements have focus */
     /** ignoredKeysDomTakeVideoNotes = "comments search contenteditable-root playerTakeNotes"; **/
     /* then don't take notes - note - variable defined at start */
     for (i in ignoredKeysDomTakeVideoNotes) {
      if (activeID == ignoredKeysDomTakeVideoNotes[i]) { 
       /* quit function */
       return;
      } 
     } /* else */
     { /* the active element is not in ignored list, run function */
      let checkKeyCombo = /* check for combos */
       lastKeyPressDomTakeVideoNotes + "+" + currentKeyPress;

      /* check key combos and run function accordingly */
      if (checkKeyCombo == "Control+Shift") {
       textareaDomTakeVideoNotesID.blur();    /* out of note box */
      }
      /* select and copy notes to clipboard  */
      else if (checkKeyCombo == "Alt+a") {
       copyNotesDomTakeVideoNotes();
      } else {
       /* only if note box is not active element */
       if (activeID != "textareaDomTakeVideoNotesID") {
        /* prevent fullscreen from occuring *//*
        /* USE VARIABLE FOR CONDITIONS */
        let noIgnoredKeys = 
         ignoredKeysDomTakeVideoNotes.indexOf(event.key) == -1;
        
        let notPauseShortcut = checkKeyCombo != "Shift+ ";
        if (noIgnoredKeys) {
         if (notPauseShortcut) {
          textareaDomTakeVideoNotesID.focus();
         }
        }
       }   
      }
     }
     /* store key press for next key combo check */
     sessionStorage.setItem("lastKeyPressDomTakeVideoNotes", event.key);
    }    
    /* Begin taking notes. */
    textareaDomTakeVideoNotes.focus();

    /* Quickly get back to notes */
    const addKeyDownDomTakeVideoNotes = () => { 
     document.body.addEventListener("keydown", function() {
      keypressToNoteDomTakeVideoNotes();  
     }); 
    }; 
    const addKeyUpDomTakeVideoNotes = () => { 
     document.body.addEventListener("keyup", function() {
      keypressToNoteDomTakeVideoNotes();
     }); 
    };
    /* Listen for keydonw event. */ 
    addKeyDownDomTakeVideoNotes();   
   }
  }
 }
 /* Prompt with instructions if turned on - variable at top is 1. */
 if (promptInstructionsDomTakeVideoNotes == 1) {
  alert(`TAKE VIDEO NOTES INSTRUCTIONS:\n\n
 I. Taking Notes:\n
    *************\n\n
  - Start typing to take notes.\n
  - Press 'Ctrl + Shift' to unfocus note box.\n
  - Start typing again to take notes.\n
  - Press 'Alt + a' to copy all in note box.\n
  - To hide notes and have option to save click\n
    the red button at top left of notes.\n\n  
  `
/*************************************************
                  MAYBE LATER
 ************************************************* 
II. Saving Notes:\n
  - Press 'Save Notes' button adjacent to close\n
    button when notes are closed to save notes.
**************************************************/    
  );
 }
})(); 