javascript:(function(){
 var tableRowFileName, tableRowLenFileName, theadFileName, curPageFileName, curExtractFileName, curUserFileName, curRepoFileName;
 var tableItemTHFileName, tableItemIDTHFileName, tableItemTDFileName, tableItemTDIDFileName, indexTableItemIDFileName = 0, fileNameFileName, unitFileName;
 var onRootFileName=0,tablePageFileName=1,apiRootFileName, curAPIFileName, mapAPIFileName;
 /* Switches and elements to turn off. */
 var firstLoadFileName = 0, curDirFileName = window.location.href, turnOffFileName, firstRunFileName, fileItemHasIDFileName, reGetAPIJSONFileName, sessionNeedsResettingFileName = 0;
 if (sessionStorage.getItem("showTableItem-,._.,-|__--_unlikely-_-name_--__|-,._.,-showTableItem") == null) {
  sessionStorage.setItem("showTableItem-,._.,-|__--_unlikely-_-name_--__|-,._.,-showTableItem", "1");
  firstRunFileName = sessionStorage.getItem("showTableItem-,._.,-|__--_unlikely-_-name_--__|-,._.,-showTableItem");
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
  firstRunFileName = 0;
 }
 /* Get current directory and uspe with api. */
 var setGlobals = function() {  
   curPageFileName = location.host + location.pathname;      
   apiRootFileName = "https://api.github.com/repos"; 
   if (curPageFileName.indexOf("github.com") > -1) {
    let checkRoleRow = document.querySelectorAll('div[role="row"]');
    if (curPageFileName.indexOf("tree") > -1) {
     if (checkRoleRow.length >= 1) {
      onRootFileName = 1;
      tablePageFileName = 0;
     } else {
      onRootFileName = 0;
      tablePageFileName = 1;
     }
    } else {
     if (checkRoleRow.length >= 1) {
      onRootFileName = 1;
      tablePageFileName = 0;
     } else {
      onRootFileName = 0;
      tablePageFileName = 1;
     }
    }
    if (onRootFileName == 0 && tablePageFileName == 1) {
     tableRowFileName = document.getElementsByTagName("tr");
     tableRowLenFileName = tableRowFileName.length;         
    } else {
     tableRowFileName = document.querySelectorAll('div[role="row"]');
     tableRowLenFileName = tableRowFileName.length;               
    }
    turnOffFileName = 0;
    /* extract user and repo */
    curExtractFileName = curPageFileName.substr(curPageFileName.indexOf("/")+1);
    curUserFileName = curExtractFileName.substr(0, curExtractFileName.indexOf("/"));
    curExtractFileName = curExtractFileName.substr(curExtractFileName.indexOf("/")+1);
    if (
     curExtractFileName.indexOf("/") == -1 || 
     curExtractFileName.substr(curExtractFileName.indexOf("/")+1).split("/").length == 2
    ) {
     onRootFileName = 1;
     if (curExtractFileName.substr(curExtractFileName.indexOf("/")+1).split("/").length == 2) {
      curRepoFileName = curExtractFileName.substr(0, curExtractFileName.indexOf("/"));
     } else {
      curRepoFileName = curExtractFileName;
     }
    } else {
     curRepoFileName = curExtractFileName.substr(0, curExtractFileName.indexOf("/"));
    }
    /* extract current path */
    if (onRootFileName == 0) {
     curExtractFileName = curExtractFileName.substr(curExtractFileName.substr(curRepoFileName.length+1).indexOf("tree/")+((curRepoFileName.length+1)+5));
     curExtractFileName = curExtractFileName.substr(curExtractFileName.indexOf("/")+1);
    } else {
     curExtractFileName = "";
    }
    curAPIFileName = apiRootFileName + "/" + curUserFileName + "/" + curRepoFileName + "/contents/" + curExtractFileName;
   } else {
    turnOffFileName = 1;
    return;
   }
 };  
 /* Function to run after json stored */
 var githubTableFunction = function(cur) {
  if (turnOffFileName == 1) { return; }
  if (firstRunFileName != 0) { console.log("Bookmarklet running:"); }
  /* reset when dir change*/
  let resetTableFunction = function() {
   firstLoadFileName = 0;
   indexTableItemIDFileName = 0;
   let tableItemHasID = 0;
/******** WHEN CREATED COLUMN ********
   let dataTableItem = document.querySelectorAll("data-table-item");
   let dataTableItemLen = dataTableItem.length;
   for (r = 0; r < dataTableItemLen; r++) {
    let curdataTableItem = dataTableItem[r].id;
    if (curdataTableItem.indexOf("tableItem-__-unlikely-name-__-tableItem") > -1) {
     tableItemHasID = 1;
     let curindexTableItemID = document.getElementById(curdataTableItem);
     curindexTableItemID.remove();
    } else {
     continue;
    }
   }
**********************************   
**********************************/ 
   /* redo fetch */      
   reGetAPIJSONFileName = async function(api) {
    let a = await fetch(api);
    let b = await a.text();
    let c = await JSON.parse(b);
    let d = await githubTableFunction(c);
   };
  };  
  /* run if on repo root page out of tree */
  let repoRoot = function(curI) { 
/******** CREATING COLUMN ********   
   if (tableRowFileName[curI] && tableRowFileName[curI].hasChildNodes()) {
    tableItemTDFileName = document.createElement("div");
    tableItemTDFileName.style.margin = "0 60px";
    tableItemTDFileName.style.width = "10%";      
    tableRowFileName[curI].children[1].style.width = "35%";
    if (tableRowFileName[curI].children.length > 1 && tableRowFileName[curI].children[1]) {
     if (tableRowFileName[curI].innerHTML.indexOf('aria-label="Directory"') == -1) {
      tableItemTDFileName.dataset.tableItem = "1";
      fileNameFileName = tableRowFileName[curI].children[1].innerText;        
      for (j in cur) {
       if (cur[j].name == fileNameFileName) {
        tableItemTDFileName.innerText = 
         cur[j].tableItem < 1024 ? cur[j].tableItem + " B" : 
         (cur[j].tableItem < 1048576 ? (unitFileName = " KiB", cur[j].tableItem /= 1024) : 
         cur[j].tableItem < 1073741824 ? (unitFileName = " MiB", cur[j].tableItem /= 1048576) : 
         (unitFileName = " GiB", cur[j].tableItem /= 1073741824),cur[j].tableItem.toFixed(1) + unitFileName);
       }
      }        
     tableItemTDFileName.id = "tableItem-__-unlikely-name-__-tableItem"+indexTableItemIDFileName;
     indexTableItemIDFileName++;       
     } else {
      tableItemTDFileName.innerText = "";       
     }
     tableRowFileName[curI].children[1].insertAdjacentElement("afterend", tableItemTDFileName);
    }
   }      
  };  
**********************************
**********************************/  
  for (i = 0; i < tableRowLenFileName; i++) {    
   if (i == 0) {
    if (tablePageFileName == 1) { if (firstLoadFileName == 0) {} else {} } else { if (firstLoadFileName == 0) { repoRoot(i); } else {} } /* <<-- EDITS HERE - !! DELETE ME !! */
/******** CREATING COLUMN ********
    if (firstLoadFileName == 0) {     
     let checkTHID = document.getElementById("tableItemCol--_unlikely-_-text_--tableItemCol");
     if (!checkTHID) {
      tableItemTHFileName = document.createElement("th");
      tableItemTHFileName.innerHTML = "COLUMN_TITLE";
      tableItemTHFileName.style.width = "10%";
      tableItemTHFileName.id = "tableItemCol--_unlikely-_-text_--tableItemCol";
      tableRowFileName[i].children[1].insertAdjacentElement("afterend", tableItemTHFileName);
      tableRowFileName[i].children[1].style.width = "30%";
     }
    }
**********************************
**********************************/
   } else {
    if (i == 1) {
     if (tablePageFileName == 1) { if (firstLoadFileName == 0) {} else {} } else { if (firstLoadFileName == 0) { repoRoot(i); } else {} } /* <<-- EDITS HERE - !! DELETE ME !! */      
/******** CREATING COLUMN ********
     if (firstLoadFileName == 0) {
      tableRowFileName[i].children[0].setAttribute("colspan", "4");
      firstLoadFileName = 1;
     } else {
       resetTableFunction();
       if (tableItemHasID == 1) { 
        setTimeout(function() {
         setGlobals();       
        }, 500);
        if (turnOffFileName == 0) {
         setTimeout(function() {         
          reGetAPIJSONFileName(curAPIFileName);         
         }, 1000);
        }
        break;
       }      
     }      
**********************************
**********************************/
    } else {
     if (tablePageFileName == 1) { if (firstLoadFileName == 0) {} else {} } else { if (firstLoadFileName == 0) { repoRoot(i); } else {} } /* <<-- EDITS HERE - !! DELETE ME !! */
/********* CREATING COLUMN ********
     tableItemTDFileName = document.createElement("td");          
     if (tableRowFileName[i] && tableRowFileName[i].hasChildNodes()) {
      if (tableRowFileName[i].children.length > 1 && tableRowFileName[i].children[1]) {
       if (tableRowFileName[i].innerText.indexOf("(Directory)") == -1) {
        tableItemTDFileName.dataset.tableItem = "1";
        fileNameFileName = tableRowFileName[i].children[1].innerText;        
        fileNameFileName = fileNameFileName.substr(0,fileNameFileName.indexOf("\n"));
        for (j in cur) {
         if (cur[j].name == fileNameFileName) {
          tableItemTDFileName.innerText = 
           cur[j].tableItem < 1024 ? cur[j].tableItem + " B" : 
           (cur[j].tableItem < 1048576 ? (unitFileName = " KB", cur[j].tableItem /= 1024) : 
           cur[j].tableItem < 1073741824 ? (unitFileName = " MB", cur[j].tableItem /= 1048576) : 
           (unitFileName = " GB", cur[j].tableItem /= 1073741824),cur[j].tableItem.toFixed(1) + unitFileName);
         }
        }        
       tableItemTDFileName.id = "tableItemData--_unlikely-_-text_--tableItemData"+indexTableItemIDFileName;
       indexTableItemIDFileName++;       
       } else {
        tableItemTDFileName.innerText = "";       
       }
       tableRowFileName[i].children[1].insertAdjacentElement("afterend", tableItemTDFileName);
      }
     }
**********************************
**********************************/
    }
   }         
  }
 };        
 /* Get api as text, convert to json, then use json to run table function. */
 var getAPIJSON = async function(api) {
  let a = await fetch(api);
  let b = await a.text();
  let c = await JSON.parse(b);
  let d = await githubTableFunction(c);
 };
 /* Run bookmarklet according to current directory. */
 var runBookmarklet = function() {  
  setGlobals();
  if (turnOffFileName == 0) {    
   getAPIJSON(curAPIFileName);
  } else {
   return;
  }
 };  
 if (firstRunFileName == 1) {   
  runBookmarklet(); 
 } else {
  let checkIfSessionNeedsResetting = document.getElementById("checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting");
  if (!checkIfSessionNeedsResetting) { sessionNeedsResettingFileName = 1; }
 }
 /* Run bookmarklet with changing directories. */
 var checkForChangeDir = function() {
  if (curDirFileName !== window.location.href && turnOffFileName == 0) {
   curDirFileName = window.location.href;
   runBookmarklet();
  }
  if (turnOffFileName == 0) {
   setTimeout(checkForChangeDir, 1000); 
  } else {
   console.log("Bookmarklet did not run:");
   return;
  }
 };
 if (sessionNeedsResettingFileName == 1) {
  sessionNeedsResettingFileName = 0;
  sessionStorage.removeItem("showTableItem-,._.,-|__--_unlikely-_-name_--__|-,._.,-showTableItem");
  firstRunFileName = 1;   
  runBookmarklet();
 }
 if (turnOffFileName == 0) { 
  checkForChangeDir(); 
 } else { 
  console.log("Bookmarklet is not running:");
  return; 
 }
})();