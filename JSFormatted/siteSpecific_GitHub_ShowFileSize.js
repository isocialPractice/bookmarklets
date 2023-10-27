javascript:(function(){
 var tableRow, tableRowLen, thead, curPage, curExtract, curUser, curRepo;
 var sizeTH, sizeIDTH, sizeTD, sizeTDID, indexSizeID = 0, fileName, unit;
 var apiRoot, curAPI, mapAPI;
 /* Switch to prevent new columns being added on navigations */
 var firstLoad = 0, curDir = window.location.href, turnOff, firstRun, sessionNeedsResetting = 0;
 if (sessionStorage.getItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize") == null) {
  sessionStorage.setItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize", "1");
  firstRun = sessionStorage.getItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize");
  let makeCheckForSessionReset = document.createElement("span");
  makeCheckForSessionReset.style.display = "none";
  makeCheckForSessionReset.id = "checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting";
  let findRightTable = document.getElementsByTagName("table");
  let findRightTableLen = findRightTable.length;
  for (i = 0; i < findRightTableLen; i++) {
   /* this assumes github will not change html symantics */
   let tablePar = findRightTable[i].parentElement;
   if (findRightTable[i] == "div") {
    findRightTable[i].insertAdjacentElement("afterend", makeCheckForSessionReset);
   }
  }
 } else {
  firstRun = 0;
 }
 var setGlobals = function() {  
   curPage = location.host + location.pathname;      
   tableRow = document.getElementsByTagName("tr");
   tableRowLen = tableRow.length;     
   apiRoot = "https://api.github.com/repos"; 
   if (curPage.indexOf("github.com") > -1 && curPage.indexOf("tree") > -1) {
    turnOff = 0;  
    /* extract user and repo */
    curExtract = curPage.substr(curPage.indexOf("/")+1);
    curUser = curExtract.substr(0, curExtract.indexOf("/"));
    curExtract = curExtract.substr(curExtract.indexOf("/")+1);
    curRepo = curExtract.substr(0, curExtract.indexOf("/"));
    /* extract current path */
    curExtract = curExtract.substr(curExtract.substr(curRepo.length+1).indexOf("tree/")+((curRepo.length+1)+5));  
    curExtract = curExtract.substr(curExtract.indexOf("/")+1);  
    curAPI = apiRoot + "/" + curUser + "/" + curRepo + "/contents/" + curExtract;   
   } else {
    turnOff = 1;
    return;
   }
 };  
 /* function to add size data after json stored */
 var addSizeCol = function(cur) {
  if (turnOff == 1) { return; }
  console.log("Add file size bookmarklet ran:");
  for (i = 0; i < tableRowLen; i++) {    
   if (i == 0) {
    if (firstLoad == 0) {
     let checkTHID = document.getElementById("sizeCol--__-unlikely_-_name-__--sizeCol");
     if (!checkTHID) {
      sizeTH = document.createElement("th");
      sizeTH.innerHTML = "Size";
      sizeTH.style.width = "10%";
      sizeTH.id = "sizeCol--__-unlikely_-_name-__--sizeCol";
      tableRow[i].children[1].insertAdjacentElement("afterend", sizeTH);
      tableRow[i].children[1].style.width = "30%";
     }
    }
   } else {
    if (i == 1) {
     if (firstLoad == 0) {
      tableRow[i].children[0].setAttribute("colspan", "4");
      firstLoad = 1;
     } else {
      firstLoad = 0;
      indexSizeID = 0;
      let fileSizeHasID = 0;
      let dataFileSize = document.querySelectorAll("data-file-size");
      let dataFileSizeLen = dataFileSize.length;
      for (r = 0; r < dataFileSizeLen; r++) {       
       let curdataFileSize = dataFileSize[r].id;
       if (curdataFileSize.indexOf("fileSize-__-unlikely-name-__-fileSize") > -1) {
        fileSizeHasID = 1;
        let curindexSizeID = document.getElementById(curdataFileSize);        
        curindexSizeID.remove();       
       } else {
        continue;
       }
      }
      /* redo fetch */
      var reGetAPIJSON = async function(api) {
       let a = await fetch(api);
       let b = await a.text();
       let c = await JSON.parse(b);
       let d = await addSizeCol(c);
      };                  
      if (fileSizeHasID == 1) { 
       setTimeout(function() {
        setGlobals();       
       }, 1500);
       if (turnOff == 0) {
        setTimeout(function() {         
         reGetAPIJSON(curAPI);         
        }, 2000);
       }
       break;
      }
     }
    } else {       
     sizeTD = document.createElement("td");      
     if (tableRow[i] && tableRow[i].hasChildNodes()) {
      if (tableRow[i].children.length > 1 && tableRow[i].children[1]) {
       if (tableRow[i].innerText.indexOf("(Directory)") == -1) {
        sizeTD.dataset.fileSize = "1";
        fileName = tableRow[i].children[1].innerText;        
        fileName = fileName.substr(0,fileName.indexOf("\n"));
        for (j in cur) {
         if (cur[j].name == fileName) {
          sizeTD.innerText = 
           cur[j].size < 1024 ? cur[j].size + " B" : 
           (cur[j].size < 1048576 ? (unit = " KB", cur[j].size /= 1024) : 
           cur[j].size < 1073741824 ? (unit = " MB", cur[j].size /= 1048576) : 
           (unit = " GB", cur[j].size /= 1073741824),cur[j].size.toFixed(1) + unit);
         }
        }        
       sizeTD.id = "fileSize-__-unlikely-name-__-fileSize"+indexSizeID;
       indexSizeID++;       
       } else {
        sizeTD.innerText = "";       
       }
       tableRow[i].children[1].insertAdjacentElement("afterend", sizeTD);
      }
     }
    }
   }         
  }
 };        
 /* get api as text, convert to json, then use json to add size col to table */
 var getAPIJSON = async function(api) {
  let a = await fetch(api);
  let b = await a.text();
  let c = await JSON.parse(b);
  let d = await addSizeCol(c);
 };
 /* run bookmarklet according to current directory */
 var runBookmarklet = function() {  
  setGlobals();
  if (turnOff == 0) {    
   setTimeout(function() { getAPIJSON(curAPI); }, 1000);
  } else {
   return;
  }
 };  
 if (firstRun == 1) {   
  runBookmarklet(); 
 } else {
  let checkIfSessionNeedsResetting = document.getElementById("checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting");
  if (!checkIfSessionNeedsResetting) { sessionNeedsResetting = 1; }
 }
 /* create or change col with file size */
 var checkForChangeDir = function() {
  if (curDir !== window.location.href && turnOff == 0) {
   curDir = window.location.href;
   runBookmarklet();
  }
  if (turnOff == 0) {
   setTimeout(checkForChangeDir, 1000); 
  } else {
   return;
  }
 };
 if (sessionNeedsResetting == 1) {
  sessionNeedsResetting = 0;
  sessionStorage.removeItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize");
  firstRun = 1;   
  runBookmarklet();
 }
 if (turnOff == 0) { 
  checkForChangeDir(); 
 } else { 
  return; 
 }
})();