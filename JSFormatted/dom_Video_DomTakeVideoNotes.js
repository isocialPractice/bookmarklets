javascript:(function() {
 /* OPTIONAL VARIABLES */
 var promptInstructionsDomTakeVideoNotes = 1; /* prompt with instructions */

 var allowKeyPressDomTakeVideoNotes = 1;      /* use key press events   */

 /* CONFIG VARIABLES */
 var ignoredKeysDomTakeVideoNotes = /* keys pressed that do not active not box */
  "Home End PageUp PageDown ArrowUp ArrowRight ArrowDown ArrowLeft f v k";

 /* Set max height and width that note box can be sest to. */
 var maxWidthDomTakeVideoNotes = "1000px";
 var maxHeightDomTakeVideoNotes = "600px";

 /* DOM VARIABLES */
 /* Lookout for a video tag.   */
 var checkVideoTagDomTakeVideoNotes =
  document.getElementsByTagName("video");

 /* Lookout for an iframe tag. */
 var checkIframeDomTakeVideoNotes =
  document.getElementsByTagName("iframe");

 /* style applied to video area. */
 var noteBoxStyling = `
  div#noteBoxDomTakeVideoNotes {
   position: fixed;
   z-index: 1000;
   left: 25%;
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

 /* GLOBAL VARIABLES */
 var textareaDomTakeVideoNotesID;   /* defined later */
 var textareaDomTakeVideoNotes = 0; /* when not taking notes allow fv to focus on video */

 /* Instructions shown when run. */
 var noteInstructionsDomTakeVideoNotes = `
  TAKE VIDEO NOTES INSTRUCTIONS:\n\n
   I. Taking Notes:\n
    *************\n
  - Start typing to take notes.\n
  - Press 'Ctrl + Shift' to unfocus note box.\n
  - Start typing again to take notes.\n
  - When not taking notes, and video out of view \n
    press f and v within 1 second of each other \n
    to bring in view.
  - Press 'Alt + a' to copy all in note box.\n
  - To hide notes and have option to save click\n
    the red button at top left of notes.\n\n`;

 /************************************* SUPPORT FUNCTIONS *************************************/
 /* Select and copy notes. */
 const copyNotesDomTakeVideoNotes = () => {
  textareaDomTakeVideoNotesID.select();
  navigator.clipboard.writeText(textareaDomTakeVideoNotesID.value);
 };

 /* Focus on textarea whenever keydown occurs. */
 const keypressToNoteDomTakeVideoNotes = () => {
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
  /* if any of these elements have focus                                */
  /* then don't take notes - note - variable defined at start           */
  for (i in ignoredKeysDomTakeVideoNotes) {
   if (activeID == ignoredKeysDomTakeVideoNotes[i]) {
    /* quit function */
    return;
   }
  } /* else implied */
  { /* the active element is not in ignored list, run function */
   let checkKeyCombo = /* check for combos */
   lastKeyPressDomTakeVideoNotes + "+" + currentKeyPress;

   /* check key combos and run function accordingly */
   if (checkKeyCombo == "Control+Shift") {
    textareaDomTakeVideoNotesID.blur();  /* out of note box */
    textareaDomTakeVideoNotes = 0;   /* allow video focus combo */
   }
   /* select and copy notes to clipboard  */
   else if (checkKeyCombo == "Alt+a") {
    copyNotesDomTakeVideoNotes();
   }
   else {
    /* only if note box is not active element */
    if (activeID != "textareaDomTakeVideoNotesID") {
     /* prevent fullscreen from occuring */
     /* use variable for conditions */
     let noIgnoredKeys =
      ignoredKeysDomTakeVideoNotes.indexOf(event.key) == -1;

     let notPauseShortcut = checkKeyCombo != "Shift+ ";
     if (noIgnoredKeys) {
      if (notPauseShortcut) {
       textareaDomTakeVideoNotesID.focus();
       textareaDomTakeVideoNotes = 1;
      }
     }
    }
   }
  }
  /* store key press for next key combo check */
  sessionStorage.setItem("lastKeyPressDomTakeVideoNotes", event.key);
 };

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

 /* Put video into focus if scrolling and not in view. */
 const scrollToVideoTakeVideoNotes = () => {
  let videoRunningTakeVideoNotes = 0;
  let fvPressed = false;
  let keyHistory = [];

  /* helper: detect if a video or iframe is running */
  let isVideoOrIframePlaying = (el) => {
  if (el.tagName === "VIDEO") {
   return !el.paused && !el.ended;
  }
  if (el.tagName === "IFRAME") {
   /* assume iframes are "running" if they exist — customize if needed */
   return true;
  }
  return false;
  };

  /* update global status variable */
  let updateRunningStatus = () => {
   let mediaElements = [...document.querySelectorAll("video, iframe")];
    videoRunningTakeVideoNotes = mediaElements.some(isVideoOrIframePlaying) ? 1 : 0;
  };

  /* focus on the currently playing video/iframe */
  let focusOnRunningMedia = () => {
   let mediaElements = [...document.querySelectorAll("video, iframe")];
   for (const el of mediaElements) {
    /* scrolls it into view */
    if (
       isVideoOrIframePlaying(el) &&   /* video is playing */
       textareaDomTakeVideoNotes == 0  /* not taking notes */
      ) {
     el.scrollIntoView({
      behavior: "smooth",
      block: "center"
     });
     return;
    }
   }
  };


  /* key listener logic: detect 'f' and 'v' pressed within 1 second */
  document.addEventListener("keydown", (e) => {
   let now = Date.now();
   keyHistory.push({ key: e.key.toLowerCase(), time: now });

   /* keep only recent keystrokes (within 1 second) */
   keyHistory = keyHistory.filter(entry => now - entry.time <= 1000);

   let keys = keyHistory.map(k => k.key);
   if (keys.includes("f") && keys.includes("v")) {
    fvPressed = true;
   }

   /* run action */
   updateRunningStatus();
   if (fvPressed && /* f and v within a second */
       videoRunningTakeVideoNotes === 1 && /* video is running */
       textareaDomTakeVideoNotes == 0      /* textarea not in focus */
      ) {
    focusOnRunningMedia();
    fvPressed = false; /* reset after action */
    keyHistory = [];
   } else { /* do nothing */
    let skip;
   }
  });

  /* optional: make all videos and iframes focusable */
  document.querySelectorAll("video, iframe").forEach(el => {
   el.setAttribute("tabindex", "-1");
  });

  console.log("Video focus listener initialized.");
 };

 /*********************************************************************************************
                                         MAIN FUNCTION
 *********************************************************************************************/
 function runDOMTakeVideoNotes() {
  /* create elements for take notes area */
  let noteBoxStyleDomTakeVideoNotes = document.createElement("style");
  let noteBoxDomTakeVideoNotes  = document.createElement("div");
  let closeDomTakeVideoNotes    = document.createElement("div");
  let showHideNoteBoxDomTakeVideoNotes = document.createElement("div");
  let textareaDomTakeVideoNotes    = document.createElement("textarea");

  /* add id for styling and additional functionality */
  noteBoxStyleDomTakeVideoNotes.id = "noteBoxStyleDomTakeVideoNotes";       /* checks if notebox exist */
  noteBoxDomTakeVideoNotes.id  = "noteBoxDomTakeVideoNotes";                /* hold all                */
  closeDomTakeVideoNotes.id    = "closeDomTakeVideoNotes";                  /* show and hide notes     */
  showHideNoteBoxDomTakeVideoNotes.id = "showHideNoteBoxDomTakeVideoNotes"; /* style with display none */
  textareaDomTakeVideoNotes.id    = "textareaDomTakeVideoNotes";            /* text box for notes      */

  /* first check if bookmarklet has been applied */
  let checkIfDomTakeVideoNotes =
   document.getElementById("noteBoxStyleDomTakeVideoNotes");

  /* if not applied apply bookmarklet and add note elements    */
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
   textareaDomTakeVideoNotesID =
    document.getElementById("textareaDomTakeVideoNotes");

   /* add ablility for note box to be hidden */
   closeDomTakeVideoNotesID.innerText = "x";
   closeDomTakeVideoNotesID.dataset.showhide = "0";
   closeDomTakeVideoNotesID.addEventListener("click", function() {
    if (this.dataset.showhide == "0") {
     /* hide and focus out of textarea */
     this.dataset.showhide = "1";
     this.innerText = "o";
     this.nextElementSibling.style.display = "none";
     textareaDomTakeVideoNotes = 0;
    } else {
     /* show and focus back on textarea */
     this.dataset.showhide = "0";
     this.innerText = "x";
     this.nextElementSibling.style.display = "";
     textareaDomTakeVideoNotesID.focus();
     textareaDomTakeVideoNotes = 1;
    }
   });

   /***** KEY PRESS FUNCTIONS *****/
   if (allowKeyPressDomTakeVideoNotes == 1) {
    /* copy notes in textare to clipboard */
    copyNotesDomTakeVideoNotes();

    /* begin taking notes */
    textareaDomTakeVideoNotes.focus();

    /* turn on text box focus indicator */
    textareaDomTakeVideoNotes = 1;

    /* allow video to be scrolled back into view */
    scrollToVideoTakeVideoNotes();

    /* listen for keydonw event */
    addKeyDownDomTakeVideoNotes();
   }
  }
 }

 /* Make sure page has either a video tag or an iframe tag. */
 if (
   checkVideoTagDomTakeVideoNotes.length >= 1 ||
   checkIframeDomTakeVideoNotes.length >= 1
  ) {
  runDOMTakeVideoNotes();

  /* Prompt with instructions if turned on - variable at top is 1. */
  if (promptInstructionsDomTakeVideoNotes == 1) {
   alert(noteInstructionsDomTakeVideoNotes);
  }
 }

 /*************************************************
                     MAYBE LATER
  *************************************************
  II. Saving Notes:\n
   - Press 'Save Notes' button adjacent to close\n
     button when notes are closed to save notes.
  **************************************************/
})();