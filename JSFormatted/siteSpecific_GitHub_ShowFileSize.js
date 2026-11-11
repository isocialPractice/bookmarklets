javascript:(function(){
 var tableRow, tableRowLen, thead, curPage, curExtract, curUser, curRepo;
 var sizeTH, sizeIDTH, sizeTD, sizeTDID, indexSizeID = 0, fileName, unit;
 var onRoot=0,tablePage=1,apiRoot, curAPI, mapAPI;
 /* Switch to prevent new columns being added on navigations */
 var firstLoad = 0, curDir = window.location.href, turnOff, firstRun, fileSizeHasID, reGetAPIJSON, sessionNeedsResetting = 0;
 /* 1 once a listing has had the size column written into it, so a column the page then replaced is
    told apart from a page that never had one */
 var columnWritten = 0;
 var docBody = document.getElementsByTagName("body");
 /* style td element text color */
 var bookmarkletStyle = document.createElement("style");
 bookmarkletStyle.id = "fileSizeStyle--__-unlikely_-_name-__--fileSizeStyle";
 bookmarkletStyle.textContent = `td[id^="fileSize-__-unlikely-name-__-fileSize"] { color: #9198a1 !important; }`;
 /* insert style, re-inserting if a soft navigation replaced the body */
 var insertBookmarkletStyle = function() {
  if (!document.getElementById("fileSizeStyle--__-unlikely_-_name-__--fileSizeStyle")) {
   docBody[0].insertAdjacentElement("afterbegin", bookmarkletStyle);
  }
 };
 insertBookmarkletStyle();
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
 /* The rows of the listing as they stand now. GitHub finishes rendering the table while the fetch
    for this directory is still out, so a count taken before the data comes back leaves the rows
    that arrived late with no size cell. Every loop reads the rows again instead. */
 var listingRows = function() {
  return tablePage == 1 ?
   document.getElementsByTagName("tr") : document.querySelectorAll('div[role="row"]');
 };
 /* The header row, which holds th cells where a listing row holds td cells. */
 var isHeaderRow = function(row) {
  return (row && row.children && row.children[1] &&
   row.children[1].tagName.toLowerCase() == "th") ? 1 : 0;
 };
 /* A row listing one file or folder. The others - the header, the row above the listing on a tree
    page, and the "View all files" row below it - hold a single cell spanning the whole table. The
    repo root has no row above its listing, so the first listing row sits where a tree page's
    spanning row does, and a fixed row number reads one as the other. */
 var isListingRow = function(row) {
  return (row && row.children && row.children.length > 1 && !isHeaderRow(row)) ? 1 : 0;
 };
 /* A cell spanning the table covers one more column once the size column is there, counted off its
    own colspan and marked so a second run does not widen it twice. */
 var widenSpanningRow = function(row) {
  if (!row || !row.children || !row.children[0]) { return; }
  let spanning = row.children[0];
  if (spanning.dataset.fileSizeWidened == "1") { return; }
  spanning.dataset.fileSizeWidened = "1";
  spanning.setAttribute(
   "colspan", String((parseInt(spanning.getAttribute("colspan"), 10) || 1) + 1)
  );
 };
 /* What the size column shows for one row, read out of the API data by file name. A folder gets
    nothing: the API gives every folder a size of 0, which would read as "0 B" in the column. */
 var sizeFor = function(cur, fileName) {
  for (j in cur) {
   if (cur[j].name != fileName || cur[j].type != "file") { continue; }
   let size = cur[j].size;
   if (size < 1024) { return size + " B"; }
   if (size < 1048576) { return (size / 1024).toFixed(1) + " KiB"; }
   if (size < 1073741824) { return (size / 1048576).toFixed(1) + " MiB"; }
   return (size / 1073741824).toFixed(1) + " GiB";
  }
  return "";
 };
 /* Take out the size cells of an earlier load before writing this one, so a directory change or a
    second run reuses the column rather than leaving two side by side. */
 var clearSizeCells = function() {
  indexSizeID = 0;
  let written = document.querySelectorAll('[data-file-size]');
  for (let w = written.length - 1; w >= 0; w--) { written[w].remove(); }
 };
 var setGlobals = function() {
   curPage = location.host + location.pathname;
   apiRoot = "https://api.github.com/repos";
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
    tableRow = listingRows();
    tableRowLen = tableRow.length;
    turnOff = 0;
    /* extract user and repo */
    curExtract = curPage.substr(curPage.indexOf("/")+1);
    curUser = curExtract.substr(0, curExtract.indexOf("/"));
    curExtract = curExtract.substr(curExtract.indexOf("/")+1);
    if (
     curExtract.indexOf("/") == -1 ||
     curExtract.substr(curExtract.indexOf("/")+1).split("/").length == 2
    ) {
     onRoot = 1;
     if (curExtract.substr(curExtract.indexOf("/")+1).split("/").length == 2) {
      curRepo = curExtract.substr(0, curExtract.indexOf("/"));
     } else {
      curRepo = curExtract;
     }
    } else {
     curRepo = curExtract.substr(0, curExtract.indexOf("/"));
    }
    /* extract current path */
    if (onRoot == 0) {
     curExtract = curExtract.substr(curExtract.substr(curRepo.length+1).indexOf("tree/")+((curRepo.length+1)+5));
     curExtract = curExtract.substr(curExtract.indexOf("/")+1);
    } else {
     curExtract = "";
    }
    curAPI = apiRoot + "/" + curUser + "/" + curRepo + "/contents/" + curExtract;
   } else {
    turnOff = 1;
    return;
   }
 };
 /* function to add size data after json stored */
 var addSizeCol = function(cur) {
  if (turnOff == 1) { return; }
  if (firstRun != 0) { console.log("Add file size bookmarklet running:"); }
  /* the size column header. A directory reached by a soft navigation needs it written again: the
     listing that held it was replaced by the one now on the page, header and all. */
  let addSizeHeader = function(row) {
   if (document.getElementById("sizeCol--__-unlikely_-_name-__--sizeCol")) { return; }
   if (!row || !row.children || !row.children[1]) { return; }
   sizeTH = document.createElement("th");
   sizeTH.innerHTML = "Size";
   sizeTH.style.width = "10%";
   sizeTH.id = "sizeCol--__-unlikely_-_name-__--sizeCol";
   row.children[1].insertAdjacentElement("afterend", sizeTH);
   row.children[1].style.width = "30%";
  };
  /* one size cell, after the name cell, in the table the repository pages serve */
  let addSizeCell = function(row) {
   sizeTD = document.createElement("td");
   sizeTD.dataset.fileSize = "1";
   sizeTD.innerText = sizeFor(cur, row.children[1].innerText);
   if (sizeTD.innerText != "") {
    sizeTD.id = "fileSize-__-unlikely-name-__-fileSize" + indexSizeID;
    indexSizeID++;
   }
   row.children[1].insertAdjacentElement("afterend", sizeTD);
  };
  /* the same cell for the row layout, which holds divs rather than table cells */
  let repoRoot = function(row) {
   if (!isListingRow(row)) { return; }
   sizeTD = document.createElement("div");
   sizeTD.dataset.fileSize = "1";
   sizeTD.style.margin = "0 60px";
   sizeTD.style.width = "10%";
   sizeTD.innerText = sizeFor(cur, row.children[1].innerText);
   if (sizeTD.innerText != "") {
    sizeTD.id = "fileSize-__-unlikely-name-__-fileSize" + indexSizeID;
    sizeTD.style.color = "#9198a1";
    indexSizeID++;
   }
   row.children[1].style.width = "35%";
   row.children[1].insertAdjacentElement("afterend", sizeTD);
  };
  /* Write the column from scratch each time the data comes back, reading the rows again rather
     than trusting the count taken when the fetch went out, and telling each row apart by what it
     holds rather than by its number in the table. */
  clearSizeCells();
  tableRow = listingRows();
  tableRowLen = tableRow.length;
  for (i = 0; i < tableRowLen; i++) {
   let row = tableRow[i];
   if (tablePage == 0) { repoRoot(row); continue; }
   if (isHeaderRow(row)) { addSizeHeader(row); continue; }
   if (!isListingRow(row)) { widenSpanningRow(row); continue; }
   addSizeCell(row);
  }
  /* whether this page had a listing to write a column into, which is what tells a column the page
     dropped from a column there was never going to be */
  columnWritten = document.getElementById("sizeCol--__-unlikely_-_name-__--sizeCol") ? 1 : 0;
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
  insertBookmarkletStyle();
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
  let checkIfSessionNeedsResetting =
   document.getElementById("checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting");
  if (!checkIfSessionNeedsResetting) { sessionNeedsResetting = 1; }
 }
 /* GitHub replaces the listing a moment after the address changes, and the replacement can land
    after the column was written, taking it with it. A column that was written and is no longer
    there has been dropped that way rather than never written, so the same poll puts it back.
    columnWritten is 0 on a page that has no listing to write one into, which is what keeps this
    from asking for the data again every second on a page that was never going to have a column. */
 var columnWasDropped = function() {
  if (columnWritten == 0) { return 0; }
  if (document.getElementById("sizeCol--__-unlikely_-_name-__--sizeCol")) { return 0; }
  return document.querySelectorAll('[data-file-size]').length == 0 ? 1 : 0;
 };
 /* create or change col with file size */
 var checkForChangeDir = function() {
  if (curDir !== window.location.href && turnOff == 0) {
   curDir = window.location.href;
   runBookmarklet();
  } else if (turnOff == 0 && columnWasDropped() == 1) {
   runBookmarklet();
  }
  if (turnOff == 0) {
   setTimeout(checkForChangeDir, 1000);
  } else {
   console.log("Add file size bookmarklet did not run:");
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
  console.log("Add file size bookmarklet is not running:");
  return;
 }
})();