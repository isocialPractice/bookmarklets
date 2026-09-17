javascript:(function(){
 /* Declare global variables. */
 var curPageGitHubListOldNewestCommits, curExtractGitHubListOldNewestCommits, curUserGitHubListOldNewestCommits,
     curRepoGitHubListOldNewestCommits, curNWOGitHubListOldNewestCommits, curRefPathGitHubListOldNewestCommits,
     curBaseGitHubListOldNewestCommits; /* current list */
 var apiRootGitHubListOldNewestCommits, curAPIGitHubListOldNewestCommits, retryAPIGitHubListOldNewestCommits,
     cacheKeyGitHubListOldNewestCommits, reGetAPIJSONGitHubListOldNewestCommits; /* github apis */
 var barGitHubListOldNewestCommits, newestBtnGitHubListOldNewestCommits, oldestBtnGitHubListOldNewestCommits,
     noteGitHubListOldNewestCommits, filterStackGitHubListOldNewestCommits, newestURLGitHubListOldNewestCommits, oldestURLGitHubListOldNewestCommits; /* additional elements */

 /* Define global variables. */
 var pageSizeGitHubListOldNewestCommits = 35, totalCommitsGitHubListOldNewestCommits = 0, headSHAGitHubListOldNewestCommits = "",
     clickCountGitHubListOldNewestCommits = 0, offsetGitHubListOldNewestCommits = 0, sepGitHubListOldNewestCommits = "+";
 var barIDGitHubListOldNewestCommits = "jumpCommits--__-unlikely_-_name-__--jumpCommits";
 
 /* Switches and elements to turn off. */
 var firstLoadGitHubListOldNewestCommits = 0, curDirGitHubListOldNewestCommits = window.location.href,
     turnOffGitHubListOldNewestCommits, firstRunGitHubListOldNewestCommits, sessionNeedsResettingGitHubListOldNewestCommits = 0;

 /************************************* SUPPORT FUNCTIONS *************************************/
 /** Called in main function. *****************************************************************/
 
 /* Hidden marker: when it is missing the page was reloaded and the session must reset. */
 const makeSessionMarkerGitHubListOldNewestCommits = () => {
  let makeCheckForSessionReset = document.createElement("span");
  makeCheckForSessionReset.style.display = "none";
  makeCheckForSessionReset.id = "checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting";
  document.body.appendChild(makeCheckForSessionReset);
 };

 /* Check if session marker is set. */
 const checkSessionMarkerGitHubListOldNewestCommits = () => {
  if (sessionStorage.getItem("jumpCommits-,._.,-|__--_unlikely-_-name_--__|-,._.,-jumpCommits") == null) {
   sessionStorage.setItem("jumpCommits-,._.,-|__--_unlikely-_-name_--__|-,._.,-jumpCommits", "1");
   firstRunGitHubListOldNewestCommits = sessionStorage.getItem("jumpCommits-,._.,-|__--_unlikely-_-name_--__|-,._.,-jumpCommits");
   makeSessionMarkerGitHubListOldNewestCommits();
  } else {
   firstRunGitHubListOldNewestCommits = 0;
  }
 };
 
 /* Get current repository and use with api. */
 const setGlobalsGitHubListOldNewestCommits = () => {
  curPageGitHubListOldNewestCommits = location.host + location.pathname;
  apiRootGitHubListOldNewestCommits = "https://api.github.com/repos";
  if (curPageGitHubListOldNewestCommits.indexOf("github.com") > -1 && curPageGitHubListOldNewestCommits.indexOf("/commits") > -1) {
   turnOffGitHubListOldNewestCommits = 0;
   /* extract user and repo */
   curExtractGitHubListOldNewestCommits = curPageGitHubListOldNewestCommits.substr(curPageGitHubListOldNewestCommits.indexOf("/")+1);
   curUserGitHubListOldNewestCommits = curExtractGitHubListOldNewestCommits.substr(0, curExtractGitHubListOldNewestCommits.indexOf("/"));
   curExtractGitHubListOldNewestCommits = curExtractGitHubListOldNewestCommits.substr(curExtractGitHubListOldNewestCommits.indexOf("/")+1);
   curRepoGitHubListOldNewestCommits = curExtractGitHubListOldNewestCommits.substr(0, curExtractGitHubListOldNewestCommits.indexOf("/"));
   curExtractGitHubListOldNewestCommits = curExtractGitHubListOldNewestCommits.substr(curExtractGitHubListOldNewestCommits.indexOf("/")+1);
   /* extract branch and path that follow "commits" */
   if (curExtractGitHubListOldNewestCommits.indexOf("/") == -1) {
    curRefPathGitHubListOldNewestCommits = "";
   } else {
    curRefPathGitHubListOldNewestCommits = curExtractGitHubListOldNewestCommits.substr(curExtractGitHubListOldNewestCommits.indexOf("/")+1).replace(/\/+$/, "");
   }
   /* this assumes github will not change html symantics */
   let metaNWO = document.querySelector('meta[name="octolytics-dimension-repository_nwo"]');
   curNWOGitHubListOldNewestCommits = (metaNWO && metaNWO.content) ? metaNWO.content : curUserGitHubListOldNewestCommits + "/" + curRepoGitHubListOldNewestCommits;
   curBaseGitHubListOldNewestCommits = location.origin + "/" + curNWOGitHubListOldNewestCommits + "/commits" + (curRefPathGitHubListOldNewestCommits ? "/" + curRefPathGitHubListOldNewestCommits : "");
   cacheKeyGitHubListOldNewestCommits = "jumpCommitsCache-,._.,-" + curNWOGitHubListOldNewestCommits + ":" + curRefPathGitHubListOldNewestCommits;
   /* first api call treats the whole tail as a branch, the retry splits branch from file path */
   let refSegsGitHubListOldNewestCommits = curRefPathGitHubListOldNewestCommits ? curRefPathGitHubListOldNewestCommits.split("/") : [];
   curAPIGitHubListOldNewestCommits = apiRootGitHubListOldNewestCommits + "/" + curNWOGitHubListOldNewestCommits + "/commits?per_page=1" + (curRefPathGitHubListOldNewestCommits ? "&sha=" + encodeURIComponent(curRefPathGitHubListOldNewestCommits) : "");
   retryAPIGitHubListOldNewestCommits = apiRootGitHubListOldNewestCommits + "/" + curNWOGitHubListOldNewestCommits + "/commits?per_page=1" + (refSegsGitHubListOldNewestCommits.length > 0 ? "&sha=" + encodeURIComponent(refSegsGitHubListOldNewestCommits[0]) : "") + (refSegsGitHubListOldNewestCommits.length > 1 ? "&path=" + encodeURIComponent(refSegsGitHubListOldNewestCommits.slice(1).join("/")) : "");
  } else {
   turnOffGitHubListOldNewestCommits = 1;
   return;
  }
 };

 /* Github's own pagination links, used for button state and as a fallback. */
 const pagLinkGitHubListOldNewestCommits = (which) => {
  return document.querySelector('a[data-component="Pagination.' + which + '"]');
 };
 const atNewestGitHubListOldNewestCommits = () => {
  let a = pagLinkGitHubListOldNewestCommits("PreviousPage");
  return (!a || a.getAttribute("aria-disabled") == "true");
 };
 const atOldestGitHubListOldNewestCommits = () => {
  let a = pagLinkGitHubListOldNewestCommits("NextPage");
  return (!a || a.getAttribute("aria-disabled") == "true");
 };

 /* The offset separator github writes into its own "Next" href. */
 const setSepGitHubListOldNewestCommits = () => {
  let a = pagLinkGitHubListOldNewestCommits("NextPage");
  let h = a ? (a.getAttribute("href") || "") : "";
  let v = h.match(/[?&]after=([^&]*)/);
  if (v && v[1].indexOf("%2B") > -1) {
   sepGitHubListOldNewestCommits = "%2B";
  } else {
   sepGitHubListOldNewestCommits = "+";
  }
 };

 /* One button in github's native style. */
 const makeButtonGitHubListOldNewestCommits = (label) => {
  let b = document.createElement("button");
  b.type = "button";
  b.innerText = label;
  b.className = "prc-Button-ButtonBase-9n-Xk";
  b.style.cssText = "margin-right:8px;padding:3px 12px;border:1px solid var(--borderColor-default,#d0d7de);border-radius:6px;background:var(--bgColor-muted,#f6f8fa);color:var(--fgColor-default,#1f2328);font:600 12px/20px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;cursor:pointer";
  return b;
 };
 const setOffGitHubListOldNewestCommits = (btn, off) => {
  btn.disabled = off;
  btn.style.opacity = off ? "0.5" : "1";
  btn.style.cursor = off ? "default" : "pointer";
 };

 /* Fallback when the api cannot be reached: click through the pages. */
 const walkPagesGitHubListOldNewestCommits = (which, limit) => {
  let n = 0;
  let t = setInterval(function() {
   let a = pagLinkGitHubListOldNewestCommits(which);
   if (!a || a.getAttribute("aria-disabled") == "true" || n >= limit) {
    clearInterval(t);
    return;
   }
   n++;
   noteGitHubListOldNewestCommits.innerText = "page " + (n + 1) + "\u2026";
   a.click();
  }, 700);
 };

 /* Draw the two buttons into the filter stack, or float them if it moved. */
 const drawBarGitHubListOldNewestCommits = () => {
  let oldBar = document.getElementById(barIDGitHubListOldNewestCommits);
  if (oldBar) { oldBar.remove(); }
  barGitHubListOldNewestCommits = document.createElement("span");
  barGitHubListOldNewestCommits.id = barIDGitHubListOldNewestCommits;
  newestBtnGitHubListOldNewestCommits = makeButtonGitHubListOldNewestCommits("\u2191 Newest");
  oldestBtnGitHubListOldNewestCommits = makeButtonGitHubListOldNewestCommits("\u2193 Oldest");
  noteGitHubListOldNewestCommits = document.createElement("span");
  noteGitHubListOldNewestCommits.style.cssText = "font:400 12px/20px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;opacity:.75";
  noteGitHubListOldNewestCommits.innerText = "counting\u2026";
  barGitHubListOldNewestCommits.appendChild(newestBtnGitHubListOldNewestCommits);
  barGitHubListOldNewestCommits.appendChild(oldestBtnGitHubListOldNewestCommits);
  barGitHubListOldNewestCommits.appendChild(noteGitHubListOldNewestCommits);
  filterStackGitHubListOldNewestCommits = document.querySelector(".tmp-mb-3.prc-Stack-Stack-UQ9k6") || document.querySelector('[data-testid="commits-filter-bar"]');
  if (filterStackGitHubListOldNewestCommits) {
   barGitHubListOldNewestCommits.style.cssText = "display:inline-flex;align-items:center;margin-right:8px";
   filterStackGitHubListOldNewestCommits.insertBefore(barGitHubListOldNewestCommits, filterStackGitHubListOldNewestCommits.firstChild);
  } else {
   barGitHubListOldNewestCommits.style.cssText = "position:fixed;z-index:2147483647;top:70px;right:16px;display:inline-flex;align-items:center;padding:6px 10px;border-radius:6px;background:var(--bgColor-default,#fff);box-shadow:0 1px 8px rgba(0,0,0,.35)";
   document.body.appendChild(barGitHubListOldNewestCommits);
  }
 };

 /* Function to run after json stored */
 const githubNavFunction = (cur) => {
  if (turnOffGitHubListOldNewestCommits == 1) { return; }
  if (firstRunGitHubListOldNewestCommits != 0) { console.log("Bookmarklet running:"); }
  if (cur && cur.length > 0) {
   headSHAGitHubListOldNewestCommits = cur[0].sha;
   if (totalCommitsGitHubListOldNewestCommits == 0) { totalCommitsGitHubListOldNewestCommits = 1; }
  }
  setSepGitHubListOldNewestCommits();
  drawBarGitHubListOldNewestCommits();
  if (totalCommitsGitHubListOldNewestCommits > 0 && headSHAGitHubListOldNewestCommits != "") {
   /* value of commit history divided by 35 */
   clickCountGitHubListOldNewestCommits = Math.floor((totalCommitsGitHubListOldNewestCommits - 1) / pageSizeGitHubListOldNewestCommits);
   /* github skips one commit per page boundary, so the last page starts here */
   offsetGitHubListOldNewestCommits = (clickCountGitHubListOldNewestCommits * pageSizeGitHubListOldNewestCommits) - 1;
   newestURLGitHubListOldNewestCommits = curBaseGitHubListOldNewestCommits;
   if (clickCountGitHubListOldNewestCommits > 0) {
    oldestURLGitHubListOldNewestCommits = curBaseGitHubListOldNewestCommits + "?after=" + headSHAGitHubListOldNewestCommits + sepGitHubListOldNewestCommits + offsetGitHubListOldNewestCommits;
   } else {
    oldestURLGitHubListOldNewestCommits = curBaseGitHubListOldNewestCommits;
   }
   noteGitHubListOldNewestCommits.innerText = totalCommitsGitHubListOldNewestCommits + " commits \u00b7 " + (clickCountGitHubListOldNewestCommits + 1) + " pages";
   newestBtnGitHubListOldNewestCommits.onclick = function() { window.location.href = newestURLGitHubListOldNewestCommits; };
   oldestBtnGitHubListOldNewestCommits.onclick = function() { window.location.href = oldestURLGitHubListOldNewestCommits; };
   setOffGitHubListOldNewestCommits(newestBtnGitHubListOldNewestCommits, atNewestGitHubListOldNewestCommits());
   setOffGitHubListOldNewestCommits(oldestBtnGitHubListOldNewestCommits, (atOldestGitHubListOldNewestCommits() && clickCountGitHubListOldNewestCommits == 0));
   /* cache so soft navigation does not spend the api rate limit twice */
   sessionStorage.setItem(cacheKeyGitHubListOldNewestCommits, totalCommitsGitHubListOldNewestCommits + ":" + headSHAGitHubListOldNewestCommits);
  } else {
   noteGitHubListOldNewestCommits.innerText = "api unavailable \u00b7 stepping instead";
   newestBtnGitHubListOldNewestCommits.onclick = function() { walkPagesGitHubListOldNewestCommits("PreviousPage", 500); };
   oldestBtnGitHubListOldNewestCommits.onclick = function() { walkPagesGitHubListOldNewestCommits("NextPage", 500); };
   setOffGitHubListOldNewestCommits(newestBtnGitHubListOldNewestCommits, atNewestGitHubListOldNewestCommits());
   setOffGitHubListOldNewestCommits(oldestBtnGitHubListOldNewestCommits, atOldestGitHubListOldNewestCommits());
  }
  firstLoadGitHubListOldNewestCommits = 1;
 };
 
 /* Get api as text, convert to json, then use json to run the nav function. */
 const getAPIJSON = async (api) => {
  try {
   let a = await fetch(api);
   if (!a.ok) { throw new Error("HTTP " + a.status); }
   let linkHeader = a.headers.get("Link");
   let lastPage = linkHeader ? linkHeader.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/) : null;
   totalCommitsGitHubListOldNewestCommits = lastPage ? parseInt(lastPage[1], 10) : 0;
   let b = await a.text();
   let c = await JSON.parse(b);
   let d = await githubNavFunction(c);
   return;
  } catch (e) {
   console.log("Bookmarklet api failed: " + (e.message || e));
  }
  /* redo fetch */
  if (api != retryAPIGitHubListOldNewestCommits) {
   reGetAPIJSONGitHubListOldNewestCommits(retryAPIGitHubListOldNewestCommits);
  } else {
   totalCommitsGitHubListOldNewestCommits = 0;
   githubNavFunction(0);
  }
 };
 reGetAPIJSONGitHubListOldNewestCommits = async function(api) {
  let a = await getAPIJSON(api);
 };

 /*********************************************************************************************
                                          MAIN FUNCTION
 *********************************************************************************************/
 function GitHubListOldNewestCommits() {
  /* check session markers */
  checkSessionMarkerGitHubListOldNewestCommits();

  /* run bookmarklet according to current directory */
  var runBookmarklet = function() {
   setGlobalsGitHubListOldNewestCommits();
   if (turnOffGitHubListOldNewestCommits == 0) {
    totalCommitsGitHubListOldNewestCommits = 0;
    headSHAGitHubListOldNewestCommits = "";
    let cached = sessionStorage.getItem(cacheKeyGitHubListOldNewestCommits);
    if (cached && cached.indexOf(":") > -1) {
     totalCommitsGitHubListOldNewestCommits = parseInt(cached.substr(0, cached.indexOf(":")), 10);
     headSHAGitHubListOldNewestCommits = cached.substr(cached.indexOf(":")+1);
     githubNavFunction(0);
    } else {
     getAPIJSON(curAPIGitHubListOldNewestCommits);
    }
   } else {
    return;
   }
  };
  if (firstRunGitHubListOldNewestCommits == 1) {
   runBookmarklet();
  } else {
   let checkIfSessionNeedsResetting = document.getElementById("checkIfSessionNeedsResetting--__-unlikely_-_name-__--checkIfSessionNeedsResetting");
   if (!checkIfSessionNeedsResetting) { sessionNeedsResettingGitHubListOldNewestCommits = 1; }
  }
  /* run bookmarklet with changing directories */
  var checkForChangeDir = function() {
   if (location.host.indexOf("github.com") == -1) {
    console.log("Bookmarklet did not run:");
    return;
   }
   if (curDirGitHubListOldNewestCommits !== window.location.href) {
    curDirGitHubListOldNewestCommits = window.location.href;
    runBookmarklet();
   } else {
    if (turnOffGitHubListOldNewestCommits == 0 && !document.getElementById(barIDGitHubListOldNewestCommits)) {
     runBookmarklet();
    }
   }
   setTimeout(checkForChangeDir, 1000);
  };
  if (sessionNeedsResettingGitHubListOldNewestCommits == 1) {
   sessionNeedsResettingGitHubListOldNewestCommits = 0;
   sessionStorage.removeItem("jumpCommits-,._.,-|__--_unlikely-_-name_--__|-,._.,-jumpCommits");
   sessionStorage.setItem("jumpCommits-,._.,-|__--_unlikely-_-name_--__|-,._.,-jumpCommits", "1");
   firstRunGitHubListOldNewestCommits = 1;
   makeSessionMarkerGitHubListOldNewestCommits();
   runBookmarklet();
  }
  if (turnOffGitHubListOldNewestCommits == 0) {
   checkForChangeDir();
  } else {
   console.log("Bookmarklet is not running:");
   return;
  }
 }
 GitHubListOldNewestCommits();
})();
