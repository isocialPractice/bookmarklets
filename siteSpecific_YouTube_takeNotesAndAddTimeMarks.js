javascript:(function(){ /* Global DOM variables */ var noteAreaID = /* parent for note elements */ document.getElementById("noteArea"); var noteBox = /* textare element for taking notes */ document.getElementById("noteBox"); var aboveTheFold = /* html after vidoe box */ document.getElementById("above-the-fold"); var player = /* video player topmost parent */ document.getElementById("player"); var playButton = /* play button - needed to update time mark */ document.getElementsByClassName("ytp-play-button"); var currentTimeClassName = /* class element with current time */ "ytp-time-current"; var curTimeElement; /* redefined to get time mark */ var timePreCal, timeSecCal; /* redefined - time mark in seconds and time mark */ /* CSS style sheet */ var noteCSS = ` div#noteArea { display: inline-flex; flex-wrap: nowrap; position: relative; top: 0px; width: 100%; } div #noteArea div { display: inline-block; position: relative; margin: 0px; max-width: 450px; width: min-content; } div#noteArea div+div { display: inline-block; position: relative; max-width: 800px; width: auto !important; left: 0px; } textarea#noteBox { max-width: 450px; width: 450px; height: 100px; border-radius: 10px; } span#timeMarkButtonArea { display: inline-block; position: relative; float: left; max-width: 750px; width: auto; margin-left: 10px; } span#timeMarkButtonArea a { box-sizing: unset !important; display: inline-flex !important; position: relative; flex-wrap: wrap !important; top: 0px !important; left: unset !important; cursor: pointer; width: auto; height: 25px; margin-left: 10px; margin-top: 3px; padding: 5px 10px 10px; background: rgb(40, 40, 40); color: white; }%60; /* Note box setup. */ var noteTextArea, noteArea, noteBoxDiv; if (!noteAreaID) { /* are for notes */ noteArea = document.createElement("div"); noteArea.id = "noteArea"; aboveTheFold.insertAdjacentElement("beforebegin", noteArea); let noteStyle = /* using noteCSS from above */ document.createElement("style"); noteStyle.textContent = /* add css properties */ noteCSS; noteArea.insertAdjacentElement("beforebegin", noteStyle); noteAreaID = document.getElementById("noteArea"); /* note box */ noteTextArea = document.createElement("textarea"); noteTextArea.id = "noteBox"; noteBoxDiv = document.createElement("div"); /* insert div to hold textarea */ noteAreaID.insertAdjacentElement("afterbegin", noteBoxDiv); /* insert textare html elements to take notes */ noteBoxDiv.insertAdjacentElement("afterbegin", noteTextArea); } /* Redefine noteBox */ noteBox = document.getElementById("noteBox"); /***** SUPPORT FUNCTIONS *****/ /* Copy notes in textare to clipboard. */ function copyNotes() { noteBox.select(); navigator.clipboard.writeText(noteBox.value); } /* Focus on textarea whenever keydown occurs. */ const updateCurrentTime = () => { /* update HTML element holding time value */ let playButtonData = playButton[0].dataset.titleNoTooltip; if (playButtonData != "Play") { playButton[0].click(); playButton[0].click(); } /* update time value HTML element */ curTimeElement = /* select element with current time */ document.getElementsByClassName(currentTimeClassName); curTimeElementText = curTimeElement[0].textContent; /* extract time and calculate in seconds */ timePreCal = curTimeElementText.split(":"); }; function keypressToNote() { let activeID = document.activeElement.id; let lastKeyPress; /* used to check for key combos */ lastKeyPress = sessionStorage.getItem("lastKeyPress"); /* for first key press */ if (lastKeyPress == null) { sessionStorage.setItem("lastKeyPress", event.key); lastKeyPress = sessionStorage.getItem("lastKeyPress"); } /* store key press and check active element */ let currentKeyPress = event.key; let ignoredKeys = "Home"; /* keys pressed that do not active not box */ /* start conditions to activate note box or run function accordingly */ if (activeID != "comments" || /* if any of these elements have focus */ activeID != "search" || /* then don't take notes */ activeID != "contenteditable-root" || activeID != "player") { let checkKeyCombo = /* check for combos */ lastKeyPress + "+" + currentKeyPress; /* check key combos and run function accordingly */ if (checkKeyCombo == "Control+Shift") { noteBox.blur(); /* out of note box */ } /* add time marker adjacent to notes */ else if (checkKeyCombo == "Control+m") { updateCurrentTime(); markTime(); } /* select and copy notes to clipboard */ else if (checkKeyCombo == "Alt+a") { copyNotes(); } else { /* only if note box is not active element */ if (activeID != "noteBox") { /* prevent fullscreen from occuring *//* ************************************** NOTE - THIS DOES NOT WORK ************************* if (currentKeyPress == "f") { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Esc'})); } ************************************** ***************************************/ /* USE VARIABLE FOR CONDITIONS */ let noIgnoredKeys = ignoredKeys.indexOf(event.key) == -1; let notPauseShortcut = checkKeyCombo != "Shift+ "; if (noIgnoredKeys) { if (notPauseShortcut) { noteBox.focus(); } } } } } /* store key press for next key combo check */ sessionStorage.setItem("lastKeyPress", event.key); } /* Add time mark button to the right of textarea. */ function markTime() { noteBox.blur(); /* quickly deactivate note box */ noteBox.setAttribute("disabled", true); if (timePreCal.length == 3) { /* not handling videos over 24 hours - no */ timeSecCal = Number(Number(timePreCal[0]*60) * 60) + /* hours to seconds */ Number(timePreCal[1]*60) + /* minutes to seconds */ Number(timePreCal[2]); /* seconds */ } else if (timePreCal.length == 2) { timeSecCal = Number(timePreCal[0]*60) + /* minutes to seconds */ Number(timePreCal[1]); /* seconds */ } else if (timePreCal.length == 1) { timeSecCal = Number(timePreCal[0]); /* seconds */ } let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); let timeMarkButtonArea; if (!timeMarkButtonAreaID) { /* create area for time mark buttons */ let timeMarkDiv = /* parent for time mark box */ document.createElement("div"); timeMarkButtonArea = /* time mark box - parent for timemarks */ document.createElement("span"); timeMarkButtonArea.id = "timeMarkButtonArea"; /* insert time mark box parent div */ noteBoxDiv.insertAdjacentElement("afterend", timeMarkDiv); /* insert time mark box */ timeMarkDiv.insertAdjacentElement("afterbegin", timeMarkButtonArea); } let curTimeMarkBtnID = document.getElementById("timeMarkBtn" + timeSecCal); let curTimeMarkBtn; if (!curTimeMarkBtnID) { /* create time mark buttons */ let timeMarkButtonAreaID = document.getElementById("timeMarkButtonArea"); curTimeMarkBtn = /* time mark linking tom marked times */ document.createElement("a"); curTimeMarkBtn.id = /* give each a unique id */ "timeMarkBtn" + timeSecCal; /* open link in new tab - _blank */ curTimeMarkBtn.target = "_blank"; let vidURL = location.href; /* extract current url */ /* conditions if url did not already have time value */ if (vidURL.indexOf("&t=") > -1) { /* had time value */ vidURL = vidURL.replace(/t=[0-9]+/, "t=" + timeSecCal); } else { /* no time value */ vidURL = vidURL + "&t=" + timeSecCal + "s"; } curTimeMarkBtn.href = vidURL; /* use hour : minutes: seconds */ for (i in timePreCal) { if (i == Number(timePreCal.length-1)) { if (Number(timePreCal.length-1) == 0) { curTimeMarkBtn.innerText = "0:" + timePreCal[i]; } else { curTimeMarkBtn.innerText += timePreCal[i]; } } else { curTimeMarkBtn.innerText += timePreCal[i] + ":"; } } timeMarkButtonAreaID.insertAdjacentElement("beforeend", curTimeMarkBtn); } /* focus back on note box */ noteBox.removeAttribute("disabled"); noteBox.focus(); } /* Begin taking notes. */ noteBox.focus(); /* Quickly get back to notes */ const addKeyDown = () => { document.body.addEventListener("keydown", function() { keypressToNote(); }); }; const addKeyUp = () => { document.body.addEventListener("keyup", function() { keypressToNote(); }); }; addKeyDown();})();