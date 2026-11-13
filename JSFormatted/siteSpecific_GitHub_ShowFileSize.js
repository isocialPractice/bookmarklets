javascript:(function(){
 var tableRow, tableRowLen, thead, curPage, curExtract, curUser, curRepo;
 var sizeTH, sizeIDTH, sizeTD, sizeTDID, indexSizeID = 0, fileName, unit;
 var onRoot=0,tablePage=1,apiRoot, curAPI, mapAPI;
 /* Switch to prevent new columns being added on navigations */
 var firstLoad = 0, curDir = window.location.href, turnOff, firstRun, fileSizeHasID, reGetAPIJSON, sessionNeedsResetting = 0;
 /* The key the copy that is running puts on the window. A paste made while it runs leaves it to do
    the work for both: a second poll asks the API again for every directory change, and a reader
    who is not signed in gets sixty requests an hour. */
 var pollKey = "showFileSizePoll--__-unlikely_-_name-__--showFileSizePoll";
 if (window[pollKey] == 1) {
  console.log("Add file size bookmarklet is already running:");
  return;
 }
 /* When the next request may go out, whether one is out now, and whether the API is refusing. The
    waits get longer the more answers in a row have been no use, so a listing this cannot write is
    never turned into a request a second. */
 var nextTryAt = 0, fetchOut = 0, rateLimited = 0;
 /* Refusals in a row: a 403 past the hourly limit, a body that is not a listing, or a request that
    never arrived. The limit lasts until the hour turns over, so these wait a long time and then
    stop until the address changes. */
 var refusals = 0, refusalWaits = [5000, 15000, 45000, 135000, 300000];
 /* Writes in a row that left the listing with no column, which is what a pass that met GitHub
    replacing the listing leaves behind. The reader is looking at a listing with no sizes in it, so
    these try again soon, but not for ever. */
 var writeTries = 0, writeWaits = [1000, 1000, 2000, 5000, 15000, 60000];
 /* The listing the API last gave for this directory. GitHub replaces a listing header row and all,
    and a pass that lands while the header row is missing has nowhere to put the heading; when the
    row comes back, this is what writes the column from the answer already in hand rather than
    asking for the same data twice. Cleared when the address changes, since it describes the
    directory it came from and no other. */
 var heldListing = null;
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
  for (let i = 0; i < findRightTableLen; i++) {
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
  for (let j in cur) {
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
 /* What the header reads. A refused request otherwise leaves the reader no way to tell a directory
    of empty files from a limit that has been reached, and the header already on the page carries
    the reason without anything new being put there. */
 var headerText = function() {
  return rateLimited == 1 ? "Size (rate limited)" : "Size";
 };
 /* Say in the header what the API is doing, where there is a header to say it in. The row layout
    the repository root serves has no header row, so there the column simply does not appear. */
 var sayRateLimited = function() {
  let header = document.getElementById("sizeCol--__-unlikely_-_name-__--sizeCol");
  if (header) { header.innerHTML = headerText(); }
 };
 /* The rows of the listing as a static copy, leaving out any already taken off the page. A table
    page's rows come back as a live collection, and GitHub replaces the listing a moment after the
    address changes, so a loop reading that collection walks rows that are on their way out. */
 var listingRowsNow = function() {
  let rows = Array.prototype.slice.call(listingRows());
  let here = [];
  for (let r = 0; r < rows.length; r++) {
   if (document.contains(rows[r])) { here.push(rows[r]); }
  }
  return here;
 };
 /* Whether any of those rows lists a file or folder, which is whether there is a listing to write
    a column into at all. */
 var hasListing = function(rows) {
  for (let r = 0; r < rows.length; r++) {
   if (isListingRow(rows[r])) { return 1; }
  }
  return 0;
 };
 /* Whether any of those rows is the header row, which is whether there is anywhere to put the
    heading. A table listing GitHub has taken the header row out of still has rows to write sizes
    into and nowhere to name the column: that there is a listing and that there is somewhere the
    heading goes are two questions, and reading the first as both is what left a reader with a
    column of empty cells and nothing saying why. */
 var hasHeaderRow = function(rows) {
  for (let r = 0; r < rows.length; r++) {
   if (isHeaderRow(rows[r])) { return 1; }
  }
  return 0;
 };
 /* Whether this page has anywhere a pass could write at all: a listing, and on a table page the
    header row the heading goes in. The row layout the repository root serves has no header row by
    design, so it is not held to one. */
 var canWriteColumn = function() {
  let rows = listingRowsNow();
  if (hasListing(rows) == 0) { return 0; }
  return (tablePage == 1 && hasHeaderRow(rows) == 0) ? 0 : 1;
 };
 /* Whether the listing on the page wants the column written into it, read off the page every time
    rather than off what the last pass managed to do. A listing whose rows hold no size cell has
    either never had the column or had it taken away by GitHub's re-render, and both want the same
    write; a table page that kept its cells and lost its header wants one too. A page with no
    listing rows wants nothing, and neither does a table listing with no header row: both are states
    no answer the API could give resolves, which is what keeps this from spending a reader's requests
    on data there is nowhere to write. */
 var columnNeedsWriting = function() {
  if (canWriteColumn() == 0) { return 0; }
  if (document.querySelectorAll('[data-file-size]').length == 0) { return 1; }
  if (tablePage == 1 && !document.getElementById("sizeCol--__-unlikely_-_name-__--sizeCol")) { return 1; }
  return 0;
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
   sizeTH.innerHTML = headerText();
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
  /* The rows this pass walks, decided before anything is taken off the page, and told apart by
     what each one holds rather than by its number in the table. A pass that arrives while GitHub
     is replacing the listing finds no listing to write into and clears nothing, so the reader
     keeps the column they already had and the poll comes back for this directory. A table listing
     with its header row missing is the same case: there is nowhere to put the heading, and a column
     of cells no heading names is worse for the reader than no column at all. */
  let rows = listingRowsNow();
  if (hasListing(rows) == 0) { return; }
  if (tablePage == 1 && hasHeaderRow(rows) == 0) { return; }
  clearSizeCells();
  for (let r = 0; r < rows.length; r++) {
   let row = rows[r];
   if (!document.contains(row)) { continue; }
   if (tablePage == 0) { repoRoot(row); continue; }
   if (isHeaderRow(row)) { addSizeHeader(row); continue; }
   if (!isListingRow(row)) { widenSpanningRow(row); continue; }
   addSizeCell(row);
  }
 };
 /* Whether the column can go back without asking the API again, which is every state where the
    answer is already in hand. The sizes are either still on the page or still in heldListing, and
    only the heading was ever missing - no answer carries one, so a request for it spends a reader's
    quota on the one thing another copy of the same data cannot fix. A refusal has its reason to put
    back on the same terms. */
 var columnGoesBackFree = function() {
  if (tablePage != 1 || columnNeedsWriting() == 0) { return 0; }
  if (heldListing !== null) { return 1; }
  return (rateLimited == 1 && document.querySelectorAll('[data-file-size]').length == 0) ? 1 : 0;
 };
 /* Write the column from the answer in hand, or empty cells carrying the reason while the API is
    refusing, and judge the pass the way wrote() judges its own. A refusal keeps its wait: the
    heading is back, and the sizes behind it still want the limit to turn over. */
 var writeHeldColumn = function() {
  addSizeCol(heldListing === null ? [] : heldListing);
  sayRateLimited();
  if (columnNeedsWriting() == 0) {
   writeTries = 0;
   if (rateLimited == 0) { nextTryAt = 0; }
  }
 };
 /* How long to wait before asking again: the nth answer of a kind in a row waits the nth time in
    that kind's list, and past the end of the list nothing asks again until the address changes. */
 var holdOff = function(waits, n) {
  let wait = n >= 1 && n <= waits.length ? waits[n - 1] : -1;
  nextTryAt = wait < 0 ? Infinity : Date.now() + wait;
 };
 /* An answer that was not a listing. Sizes already on the page are left exactly as they are, since
    writing an empty column over them would read as a directory of empty files. Where there is a
    listing and no column at all - which is where a reader meets the limit, a directory or two in,
    on a listing GitHub has just replaced - the table layout gets the column with the reason in its
    heading: a reader cannot otherwise tell a bookmarklet waiting on a limit from one that did not
    run. A listing with no header row to say it in - the row layout the repository root serves, or a
    table listing GitHub has taken the header row out of - gets nothing written into it, and the
    reason goes on as soon as the row is back. */
 var refused = function() {
  refusals++;
  rateLimited = 1;
  if (
   tablePage == 1 &&
   document.querySelectorAll('[data-file-size]').length == 0 &&
   hasListing(listingRowsNow()) == 1
  ) {
   addSizeCol([]);
  }
  sayRateLimited();
  holdOff(refusalWaits, refusals);
 };
 /* A listing. Keep it, write the column from it, then judge the pass by what is on the page
    afterwards: one that ended with no column met GitHub replacing the listing, and is tried again
    soon. Keeping it is what makes a header row taken out and put back cost no second request. */
 var wrote = function(data) {
  refusals = 0;
  rateLimited = 0;
  heldListing = data;
  addSizeCol(data);
  sayRateLimited();
  if (columnNeedsWriting() == 1) {
   writeTries++;
   holdOff(writeWaits, writeTries);
  } else {
   writeTries = 0;
   nextTryAt = 0;
  }
 };
 /* The listing for this directory, or nothing. Past the hourly limit the API answers 403 with a
    JSON object carrying a message, which parses as happily as the data does, so an answer counts
    only when the request succeeded and the body is the array of entries the API documents. A
    refusal is not data, and neither is a request that never arrived. */
 var getAPIJSON = async function(api) {
  try {
   let answer = await fetch(api);
   let body = await answer.text();
   let data = answer.ok ? JSON.parse(body) : null;
   if (!answer.ok || !(data instanceof Array)) {
    refused();
   } else {
    wrote(data);
   }
  } catch (err) {
   refused();
  } finally {
   fetchOut = 0;
  }
 };
 /* run bookmarklet according to current directory */
 var runBookmarklet = function() {
  insertBookmarkletStyle();
  setGlobals();
  if (turnOff == 1) { return; }
  /* marked as out before the wait, so the poll does not start a second request inside it */
  fetchOut = 1;
  setTimeout(function() { getAPIJSON(curAPI); }, 1000);
 };
 if (firstRun == 1) {
  runBookmarklet();
 } else {
  let checkIfSessionNeedsResetting =
   document.getElementById("checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting");
  if (!checkIfSessionNeedsResetting) { sessionNeedsResetting = 1; }
 }
 /* Create or change the col with the file size, and put back one the page took away. The poll reads
    the page rather than what the last pass managed, so a listing that never had the column and one
    that lost it are the same case and both get written; a refusal is the one state the page cannot
    be asked about, so it is held to the waits in refusalWaits and still wants somewhere on the page
    to write before it is worth asking for. A GitHub page that is not a file listing, an issues page
    say, otherwise spends six of the reader's sixty requests an hour on an address no answer writes
    anything to. What can be written from the answer already in hand is written first and without a
    request, which is how a heading that went with a replaced header row comes back however long the
    waits have run on. */
 var checkForChangeDir = function() {
  if (turnOff == 1) {
   console.log("Add file size bookmarklet did not run:");
   return;
  }
  if (curDir !== window.location.href) {
   curDir = window.location.href;
   heldListing = null;
   refusals = 0;
   writeTries = 0;
   rateLimited = 0;
   nextTryAt = 0;
   runBookmarklet();
  } else if (fetchOut == 0 && columnGoesBackFree() == 1) {
   writeHeldColumn();
  } else if (
   fetchOut == 0 && Date.now() >= nextTryAt &&
   ((rateLimited == 1 && canWriteColumn() == 1) || columnNeedsWriting() == 1)
  ) {
   runBookmarklet();
  }
  setTimeout(checkForChangeDir, 1000);
 };
 if (sessionNeedsResetting == 1) {
  sessionNeedsResetting = 0;
  sessionStorage.removeItem("showFileSize-,._.,-|__--_unlikely-_-name_--__|-,._.,-showFileSize");
  firstRun = 1;
  runBookmarklet();
 }
 if (turnOff == 0) {
  window[pollKey] = 1;
  checkForChangeDir();
 } else {
  console.log("Add file size bookmarklet is not running:");
  return;
 }
})();