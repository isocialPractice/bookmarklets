javascript:(function() { 
 /* Select current not box. */
 var noteBox = document.getElementById("noteBox");
 if (!noteBox) {
  noteBox = document.getElementById("noteBoxTakNotes");
 }
 /* Store value of page notes. */
 var noteBoxVal = noteBox.value;
 /* Get the url of video. */
 var videoURL = location.href;
 /* Get the video title. */
 var titlePar = document.getElementsByClassName("style-scope ytd-watch-metadata");
 var videoTitle = titlePar[0].innerText.replace(/\n.*/g,"");
 /* Get the user name. */
 var username = document.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string");
 var usernameVal = username[0].innerText;
 /* Generate name for localStorage variable. */
 var storageVar = usernameVal + "--" + videoTitle;
 storageVar = storageVar.replace(/ {1,}/g, "-");
 
 /* Start value of local storage with video url. */
 var localStorageVal = videoURL + " --:-- \n" + noteBoxVal.replace(/\n/g, "<br>");
 /* 
  Store notes in local storage as variable formatted: 
  usename--Video-Title
 */
 localStorage.setItem(storageVar, localStorageVal);    
 alert("Notes taken for this page have been saved to local Storage as: \n" +
 storageVar);
 })(); 