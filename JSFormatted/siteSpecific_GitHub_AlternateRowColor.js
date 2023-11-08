javascript:(function(){
 var color = "aliceblue"; /*<-- CHANGE IS OPTIONAL */
 var tableRow, tableRowLen, thead, curPage, curExtract, curUser, curRepo;
 var onRoot=0,tablePage=1,recurseIndex,runCompleted=0;
 /* Switches and elements to turn off. */
 var curDir = window.location.href, turnOff=0;
 /* Get current directory and uspe with api. */
 var setGlobals = function() {  
   curPage = location.host + location.pathname;
   if (curPage.indexOf("github.com") > -1) {
    let checkRoleRow = document.querySelectorAll('div[role="row"]');
    if (curPage.indexOf("tree") > -1) {
     if (checkRoleRow.length >= 1) {
      onRoot = 1;
      tablePage = 0;
     } else {
      onRoot = 0;
      tablePage = 1;
     }
    } else {
     if (checkRoleRow.length >= 1) {
      onRoot = 1;
      tablePage = 0;
     } else {
      onRoot = 0;
      tablePage = 1;
     }
    }
    if (onRoot == 0 && tablePage == 1) {
     tableRow = document.getElementsByTagName("tr");
     tableRowLen = tableRow.length;         
    } else {
     tableRow = document.querySelectorAll('div[role="row"]');
     tableRowLen = tableRow.length;               
    }
    turnOff = 0;    
   }
 };  
 /* Function to run after json stored */
 var githubTableFunction = function() {
  if (turnOff == 1) { return; }  
  recurseIndex=1;
  /* function to chang row color */
  let alternateTableColor = function() {
   if (tableRow[recurseIndex]) {
    /* add color to row */
    tableRow[recurseIndex].style.backgroundColor = color;
   }
  };
  let recurseTableColor = function() {
   if (recurseIndex <= (tableRowLen-1)) {
    /* alternate every even number row */
    if (recurseIndex%2 == 0) {     
     alternateTableColor();
    }
    recurseIndex+=1;
    setTimeout(recurseTableColor, 10);
   } else {
    return;
   }
  };
  recurseTableColor();
 };         
 /* Run bookmarklet according to current directory. */
 var runBookmarklet = function() {  
  console.log("Bookmarklet running:");
  setGlobals();
  if (turnOff == 0) {    
   /* works more consistently with timeout */
   setTimeout(githubTableFunction, 500);
  } else {
   return;
  }
 };  
 runBookmarklet();
 /* Ensure all table rows alternated as not at 100%. */
 var checkIfRunCompleted = function() {
  let curColorCount = 0;
  let totalRows = tableRowLen-2;
  /* config by number of rows */
  let evenOrOdd = "odd", rowsChanged;
  if (totalRows%2 == 0) {
   evenOrOdd = "even";
   rowsChanged = Math.floor(totalRows/2);
  } else {
   rowsChanged = Math.floor((totalRows/2) - 1);
  }
  for (i = 0; i < tableRowLen; i++) {
   /* check number of rows changed */
   if (tableRow[i].style.backgroundColor == color) {
    curColorCount+=1;
   }
  }
  /* compare against number of rows */
  if (!curColorCount >= rowsChanged) {
   console.log("Run did not complete. Retrying:"); 
   setTimeout(githubTableFunction, 500);
  } else {
   console.log("Run completed:");
   runCompleted = 1;
  }
 };
 /* Run bookmarklet with changing directories. */
 var checkForChangeDir = function() {
  if (curDir !== window.location.href && turnOff == 0) {
   /* directory has changed so re-run */
   curDir = window.location.href;
   runCompleted=0;
   runBookmarklet();
  } 
  if (turnOff == 0) {
   /* recurse if no error */
   setTimeout(checkForChangeDir, 1000); 
  } else {
   console.log("Bookmarklet did not run:");
   return;
  }  
 };
 /* Listen for directory change, check if completed, recurse, and/or exit if error. */
 if (turnOff == 0) { 
  if (runCompleted == 0) {
   runBookmarklet();
  } 
  checkForChangeDir();
 } else { 
  console.log("Bookmarklet is not running:");
  return; 
 }
})();