javascript:(function(){ 
 /* OPTIONAL - set to 0 or delete to turn off instruction pop-up. */
 var alertWithInstructions = 1;
 /* Global DOM variables */
 var bookmarkletAreaID =     /* parent for bookmarklet elements */
  document.getElementById("bookmarkletArea");
 
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
 var ignoredDOMElements =  /* stop function if one of these is active */
  ["comments", "search", "contenteditable-root", "player"]; 
 
 /* CSS style sheet */
 {
 var bookmarkletCSS = `
  div#bookmarkletArea {
   display: inline-flex;
   flex-wrap: nowrap;
   position: relative;
   top: 0px;
   width: 100%;
  }
  div#bookmarkletArea div {
   display: inline-block;
   position: relative;
   max-width: 800px;
   width: auto !important;
   left: 0px; 
  }
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
  } `;
  }
 /* Bookmarklet box setup. */
 var bookmarkletTextArea, bookmarkletArea;
 
 /* Ensure there are no duplicates of bookmarkletID. */
 if (!bookmarkletAreaID) {
  /* are for bookmarklets */
  bookmarkletArea = document.createElement("div");
  bookmarkletArea.id = "bookmarkletArea";   
  
  /* insert bookmarklet area */
  aboveTheFold.insertAdjacentElement("beforebegin", bookmarkletArea); 
  
  let bookmarkletStyle =         /* using bookmarkletCSS from above */
   document.createElement("style"); 
  
  bookmarkletStyle.textContent = /* add css properties */
   bookmarkletCSS;        
  
  bookmarkletArea.insertAdjacentElement("beforebegin", bookmarkletStyle);
  bookmarkletAreaID = document.getElementById("bookmarkletArea");
 }

 /***** MAIN FUNCTION *****/
 function keypressToBookmarklet() {
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

  /****************************************************************** 
   start conditions to activate bookmarklet box or run function accordingly
   if any of these elements have focus:
     ["comments", "search", "contenteditable-root", "player"]
   then don't take bookmarklets - bookmarklet - variable defined at start 
  *******************************************************************/
  for (i in ignoredDOMElements) {
   if (activeID == ignoredDOMElements[i]) { 
    /* quit function  */
    return;
   } 
  }
  /*** else ***/
  { /* the active element is not in ignored list, run function */
   let checkKeyCombo = /* check for combos */
    lastKeyPress + "+" + currentKeyPress;
    
   /* check key combos and run function accordingly */
   if (checkKeyCombo == "Control+m") {
    updateCurrentTime();
    markTime();    
   } 
  }
  /* store key press for next key combo check */
  sessionStorage.setItem("lastKeyPress", event.key);
 } 

 /***** SUPPORT FUNCTIONS *****/
 /* Insert the link with value of current time mark. */
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
 
 /* Add time mark button to the right of textarea. */
 const markTime= () => {    
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
   let timeMarkDiv =    /* parent for time mark box */
    document.createElement("div");
   timeMarkButtonArea = /* time mark box - parent for timemarks */
    document.createElement("span"); 
   timeMarkButtonArea.id = "timeMarkButtonArea"; 
   /* insert time mark box parent div */
   bookmarkletAreaID.insertAdjacentElement("afterbegin", timeMarkDiv);   
   /* insert time mark box */
   timeMarkDiv.insertAdjacentElement("afterbegin", timeMarkButtonArea);
  }
  let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCal);
  let curTimeMarkBtn;
  if (!curTimeMarkBtnID) { /* create time mark buttons */
   let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea");
   
   curTimeMarkBtn =     /* time mark linking tom marked times */
    document.createElement("a");
   
   curTimeMarkBtn.id =  /* give each a unique id */
    "timeMarkBtn" + timeSecCal;
   
   /* open link in new tab to keep existing time marks */   
   curTimeMarkBtn.target =  "_blank";   
   
   curTimeMarkBtn.addEventListener("click", function() {
    let playButtonData = playButton[0].dataset.titleNoTooltip;
    if (playButtonData != "Play") {
     playButton[0].click();
    }
   });
   
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

   timeMarkButtonAreaID.insertAdjacentElement("beforeend", curTimeMarkBtn);
  }    
 }; 
 
 /* Listen form key combo to mark time. */
 const addKeyDown = () => { document.body.addEventListener("keydown", function() {
  keypressToBookmarklet();  
  }); 
 }; 

 /****************************************************************** 
   Listen for keydonw event, running main function and add time mark
   if the keyboard input is "Ctrl + m".
 *******************************************************************/ 
 addKeyDown();
 /* Add alert event so that instructions for use are communicated. */
 if (alertWithInstructions != undefined && alertWithInstructions == 1) {
  alert("Press 'Ctrl + m' to add time marks. \n\nClicking on time mark will open video at the specified time in new tab.");
 }
})();