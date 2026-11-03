javascript:(function(){
 /* Declare global variables. */
 var pageGitHubNavigateCommitsSequentially, browseGitHubNavigateCommitsSequentially, barGitHubNavigateCommitsSequentially,
     prevBtnGitHubNavigateCommitsSequentially, nextBtnGitHubNavigateCommitsSequentially; /* current commit and added elements */
 var resolvedGitHubNavigateCommitsSequentially = {}, lookupGitHubNavigateCommitsSequentially = ""; /* newer commit per sha, lookup in flight */

 /* Define global variables. */
 var apiRootGitHubNavigateCommitsSequentially = "https://api.github.com/repos", pageSizeGitHubNavigateCommitsSequentially = 100,
     routePagesGitHubNavigateCommitsSequentially = 30, waitCountGitHubNavigateCommitsSequentially = 0;
 var barIDGitHubNavigateCommitsSequentially = "navCommits--__-unlikely_-_name-__--navCommits";
 var cacheKeyGitHubNavigateCommitsSequentially = "navCommitsCache-,._.,-|__--_unlikely-_-name_--__|-,._.,-";
 var runKeyGitHubNavigateCommitsSequentially = "navCommitsRun--__-unlikely_-_name-__--navCommitsRun";

 /* Switches. */
 var curDirGitHubNavigateCommitsSequentially = "";

 /************************************* SUPPORT FUNCTIONS *************************************/
 /** Called in main function. *****************************************************************/

 /* Owner/repo and sha of the commit being viewed, or null when the page is not a commit. */
 const readPageGitHubNavigateCommitsSequentially = () => {
  let m = location.pathname.match(/^\/([^\/]+)\/([^\/]+)\/commit\/([0-9a-fA-F]{7,40})\/?$/);
  if (location.hostname != "github.com" || !m) { return null; }
  return { nwo: m[1] + "/" + m[2], sha: m[3].toLowerCase() };
 };

 /* Github's "Browse files" button, once the header shows this commit. */
 const findBrowseGitHubNavigateCommitsSequentially = (sha) => {
  let links = document.querySelectorAll('a[href*="/tree/"]');
  for (let i = 0; i < links.length; i++) {
   let href = (links[i].getAttribute("href") || "").toLowerCase();
   let isBrowse = (links[i].className || "").indexOf("browseFilesButton") > -1 || (links[i].textContent || "").trim() == "Browse files";
   if (isBrowse && href.indexOf("/tree/" + sha) > -1) { return links[i]; }
  }
  return null;
 };

 /* Parent sha from github's own parent link (its "p" hotkey). */
 const domParentGitHubNavigateCommitsSequentially = () => {
  let a = document.querySelector('a[data-hotkey="p"][href*="/commit/"]');
  let m = a ? (a.getAttribute("href") || "").match(/\/commit\/([0-9a-fA-F]{7,40})/) : null;
  return m ? m[1].toLowerCase() : "";
 };

 /* Commit list cache for the repo, newest first. Entry: [sha, parents or null when unknown]. */
 const loadCacheGitHubNavigateCommitsSequentially = (nwo) => {
  try {
   let c = JSON.parse(sessionStorage.getItem(cacheKeyGitHubNavigateCommitsSequentially + nwo) || "null");
   if (c && c.list) { return c; }
  } catch (e) {}
  return { head: false, list: [] };
 };
 const saveCacheGitHubNavigateCommitsSequentially = (nwo, c) => {
  try { sessionStorage.setItem(cacheKeyGitHubNavigateCommitsSequentially + nwo, JSON.stringify(c)); } catch (e) {}
 };
 const indexOfShaGitHubNavigateCommitsSequentially = (list, sha) => {
  for (let i = 0; i < list.length; i++) {
   if (list[i][0].indexOf(sha) == 0) { return i; }
  }
  return -1;
 };

 /* Stepping back: record the parent shown on the page, extending the cached list downward. */
 const learnParentGitHubNavigateCommitsSequentially = (c, sha, parent) => {
  let i = indexOfShaGitHubNavigateCommitsSequentially(c.list, sha);
  if (i < 0 || !parent) { return; }
  if (!c.list[i][1]) { c.list[i] = [c.list[i][0], [parent]]; }
  if (i == c.list.length - 1 && indexOfShaGitHubNavigateCommitsSequentially(c.list, parent) < 0) { c.list.push([parent, null]); }
 };

 /* Newer commit from the cached list: a child of sha, else the commit listed just above it. */
 const nextFromCacheGitHubNavigateCommitsSequentially = (c, sha) => {
  let i = indexOfShaGitHubNavigateCommitsSequentially(c.list, sha);
  if (i < 0) { return null; }
  for (let j = i - 1; j >= 0; j--) {
   if (c.list[j][1] && c.list[j][1].length > 0 && c.list[j][1][0].indexOf(sha) == 0) { return { sha: c.list[j][0] }; }
  }
  for (let j = i - 1; j >= 0; j--) {
   if (c.list[j][1] && c.list[j][1].some(function(p) { return p.indexOf(sha) == 0; })) { return { sha: c.list[j][0] }; }
  }
  if (i > 0) { return { sha: c.list[i - 1][0] }; }
  if (c.head) { return { newest: 1 }; }
  return null;
 };

 /* Commit date from the page header, else from the api. */
 const commitDateGitHubNavigateCommitsSequentially = async (page) => {
  let header = browseGitHubNavigateCommitsSequentially ? browseGitHubNavigateCommitsSequentially.closest('[data-component="PageHeader"]') : null;
  let t = (header && header.querySelector("relative-time[datetime]")) || document.querySelector("relative-time[datetime]");
  if (t && !isNaN(Date.parse(t.getAttribute("datetime")))) { return t.getAttribute("datetime"); }
  try {
   let r = await fetch(apiRootGitHubNavigateCommitsSequentially + "/" + page.nwo + "/commits/" + page.sha);
   if (r.ok) { let j = await r.json(); return j.commit.committer.date; }
  } catch (e) {}
  return "";
 };

 /* Api: commits on the default branch since the commit date. The oldest page holds this commit. */
 const apiPageGitHubNavigateCommitsSequentially = async (url, n) => {
  let r = await fetch(url + "&page=" + n);
  if (!r.ok) { throw new Error("api " + r.status); }
  return (await r.json()).map(function(c) { return [c.sha, c.parents.map(function(p) { return p.sha; })]; });
 };
 const apiWindowGitHubNavigateCommitsSequentially = async (page, since) => {
  let url = apiRootGitHubNavigateCommitsSequentially + "/" + page.nwo + "/commits?per_page=" + pageSizeGitHubNavigateCommitsSequentially + "&since=" + encodeURIComponent(since);
  let r = await fetch(url);
  if (!r.ok) { throw new Error("api " + r.status); }
  let list = (await r.json()).map(function(c) { return [c.sha, c.parents.map(function(p) { return p.sha; })]; });
  let last = (r.headers.get("Link") || "").match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  let n = last ? parseInt(last[1], 10) : 1;
  if (n > 1) {
   list = await apiPageGitHubNavigateCommitsSequentially(url, n);
   if (indexOfShaGitHubNavigateCommitsSequentially(list, page.sha) <= 0) {
    n--;
    list = (await apiPageGitHubNavigateCommitsSequentially(url, n)).concat(list);
   }
  }
  return { head: n == 1, list: list };
 };

 /* Fallback for private repos or a spent api limit: github's own commits list, newest page first. */
 const routeWindowGitHubNavigateCommitsSequentially = async (page, since) => {
  let base = location.origin + "/" + page.nwo + "/commits?" + (since ? "since=" + encodeURIComponent(since) : "");
  let list = [], after = "";
  for (let k = 0; k < routePagesGitHubNavigateCommitsSequentially; k++) {
   let r = await fetch(base + (after ? "&after=" + encodeURIComponent(after) : ""), { headers: { Accept: "application/json" } });
   if (!r.ok) { throw new Error("commits page " + r.status); }
   let j = await r.json();
   let p = j.payload ? (j.payload.commitsRefRoute || j.payload.commitsRoute) : null;
   if (!p || !p.commitGroups) { throw new Error("commits page format"); }
   p.commitGroups.forEach(function(g) { g.commits.forEach(function(c) { list.push([c.oid, null]); }); });
   let pg = p.filters ? p.filters.pagination : null;
   if (indexOfShaGitHubNavigateCommitsSequentially(list, page.sha) > -1 || !pg || !pg.hasNextPage) { break; }
   after = pg.endCursor;
  }
  return { head: true, list: list };
 };

 /* Find the newer commit: cache first, then the api, then github's commits list. */
 const resolveNextGitHubNavigateCommitsSequentially = async (page) => {
  let c = loadCacheGitHubNavigateCommitsSequentially(page.nwo);
  learnParentGitHubNavigateCommitsSequentially(c, page.sha, domParentGitHubNavigateCommitsSequentially());
  saveCacheGitHubNavigateCommitsSequentially(page.nwo, c);
  let hit = nextFromCacheGitHubNavigateCommitsSequentially(c, page.sha);
  if (hit) { return hit; }
  let date = await commitDateGitHubNavigateCommitsSequentially(page);
  /* a minute of slack so the commit itself is inside the window */
  let since = date ? new Date(Date.parse(date) - 60000).toISOString().replace(/\.\d{3}Z$/, "Z") : "";
  let win = null, why = "";
  if (since) {
   try { win = await apiWindowGitHubNavigateCommitsSequentially(page, since); } catch (e) { why = e.message; }
  }
  if (!win) {
   try { win = await routeWindowGitHubNavigateCommitsSequentially(page, since); } catch (e) { return { error: why || e.message }; }
  }
  if (indexOfShaGitHubNavigateCommitsSequentially(win.list, page.sha) < 0) { return { error: "this commit is not on the default branch" }; }
  learnParentGitHubNavigateCommitsSequentially(win, page.sha, domParentGitHubNavigateCommitsSequentially());
  saveCacheGitHubNavigateCommitsSequentially(page.nwo, win);
  return nextFromCacheGitHubNavigateCommitsSequentially(win, page.sha) || { error: "not found" };
 };

 /* One button in github's native style, copied from "Browse files". */
 const makeButtonGitHubNavigateCommitsSequentially = (browse, label) => {
  let b;
  if (browse) {
   b = browse.cloneNode(true);
   b.removeAttribute("aria-describedby");
   b.removeAttribute("aria-labelledby");
   b.removeAttribute("id");
   b.className = b.className.split(" ").filter(function(n) { return n.indexOf("prc-") == 0; }).join(" ");
   let vis = b.querySelector('[data-component="leadingVisual"]');
   if (vis) { vis.remove(); }
   let txt = b.querySelector('[data-component="text"]');
   if (txt) { txt.textContent = label; } else { b.textContent = label; }
  } else {
   b = document.createElement("a");
   b.textContent = label;
   b.style.cssText = "padding:3px 12px;border:1px solid var(--borderColor-default,#d0d7de);border-radius:6px;background:var(--bgColor-muted,#f6f8fa);color:var(--fgColor-default,#1f2328);font:600 12px/20px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;text-decoration:none";
  }
  return b;
 };
 const setButtonGitHubNavigateCommitsSequentially = (btn, page, sha, title) => {
  if (sha) {
   btn.setAttribute("href", "/" + page.nwo + "/commit/" + sha);
   btn.removeAttribute("aria-disabled");
   btn.style.opacity = "1";
   btn.style.cursor = "pointer";
  } else {
   btn.removeAttribute("href");
   btn.setAttribute("aria-disabled", "true");
   btn.style.opacity = "0.5";
   btn.style.cursor = "default";
  }
  btn.title = title;
 };

 /* Draw the two buttons before "Browse files", or float them if github moved it. */
 const drawBarGitHubNavigateCommitsSequentially = (page, browse) => {
  let oldBar = document.getElementById(barIDGitHubNavigateCommitsSequentially);
  if (oldBar) { oldBar.remove(); }
  barGitHubNavigateCommitsSequentially = document.createElement("span");
  barGitHubNavigateCommitsSequentially.id = barIDGitHubNavigateCommitsSequentially;
  barGitHubNavigateCommitsSequentially.dataset.sha = page.sha;
  barGitHubNavigateCommitsSequentially.style.cssText = "display:inline-flex;align-items:center;gap:8px";
  prevBtnGitHubNavigateCommitsSequentially = makeButtonGitHubNavigateCommitsSequentially(browse, "\u2190 Previous");
  nextBtnGitHubNavigateCommitsSequentially = makeButtonGitHubNavigateCommitsSequentially(browse, "Next \u2192");
  barGitHubNavigateCommitsSequentially.appendChild(prevBtnGitHubNavigateCommitsSequentially);
  barGitHubNavigateCommitsSequentially.appendChild(nextBtnGitHubNavigateCommitsSequentially);
  if (browse) {
   browse.parentElement.insertBefore(barGitHubNavigateCommitsSequentially, browse);
  } else {
   barGitHubNavigateCommitsSequentially.style.cssText += ";position:fixed;z-index:2147483647;top:70px;right:16px;padding:6px 10px;border-radius:6px;background:var(--bgColor-default,#fff);box-shadow:0 1px 8px rgba(0,0,0,.35)";
   document.body.appendChild(barGitHubNavigateCommitsSequentially);
  }
 };

 /* Set both buttons once the newer commit is known. */
 const applyNextGitHubNavigateCommitsSequentially = (page, res) => {
  if (res.sha) {
   setButtonGitHubNavigateCommitsSequentially(nextBtnGitHubNavigateCommitsSequentially, page, res.sha, "Newer commit " + res.sha.slice(0, 7));
  } else if (res.newest) {
   setButtonGitHubNavigateCommitsSequentially(nextBtnGitHubNavigateCommitsSequentially, page, "", "This is the newest commit on the default branch");
  } else {
   setButtonGitHubNavigateCommitsSequentially(nextBtnGitHubNavigateCommitsSequentially, page, "", "Newer commit not found: " + res.error);
  }
  if (!prevBtnGitHubNavigateCommitsSequentially.getAttribute("href")) {
   let c = loadCacheGitHubNavigateCommitsSequentially(page.nwo);
   let i = indexOfShaGitHubNavigateCommitsSequentially(c.list, page.sha);
   let parents = i > -1 ? c.list[i][1] : null;
   if (parents && parents.length > 0) {
    setButtonGitHubNavigateCommitsSequentially(prevBtnGitHubNavigateCommitsSequentially, page, parents[0], "Parent commit " + parents[0].slice(0, 7));
   } else if (parents) {
    setButtonGitHubNavigateCommitsSequentially(prevBtnGitHubNavigateCommitsSequentially, page, "", "This is the first commit");
   }
  }
 };

 /* Draw the buttons for the commit on screen, then look up the newer commit. */
 const runBookmarkletGitHubNavigateCommitsSequentially = () => {
  let page = readPageGitHubNavigateCommitsSequentially();
  let bar = document.getElementById(barIDGitHubNavigateCommitsSequentially);
  if (!page) {
   if (bar) { bar.remove(); }
   return;
  }
  if (bar && bar.dataset.sha == page.sha) { return; }
  browseGitHubNavigateCommitsSequentially = findBrowseGitHubNavigateCommitsSequentially(page.sha);
  /* wait up to 5 checks for the header to render before floating the buttons */
  if (!browseGitHubNavigateCommitsSequentially && waitCountGitHubNavigateCommitsSequentially++ < 5) { return; }
  pageGitHubNavigateCommitsSequentially = page;
  drawBarGitHubNavigateCommitsSequentially(page, browseGitHubNavigateCommitsSequentially);
  let parent = domParentGitHubNavigateCommitsSequentially();
  setButtonGitHubNavigateCommitsSequentially(prevBtnGitHubNavigateCommitsSequentially, page, parent, parent ? "Parent commit " + parent.slice(0, 7) : "Parent commit not found on the page");
  let key = page.nwo + "@" + page.sha;
  if (resolvedGitHubNavigateCommitsSequentially[key]) {
   applyNextGitHubNavigateCommitsSequentially(page, resolvedGitHubNavigateCommitsSequentially[key]);
   return;
  }
  setButtonGitHubNavigateCommitsSequentially(nextBtnGitHubNavigateCommitsSequentially, page, "", "Finding the newer commit\u2026");
  if (lookupGitHubNavigateCommitsSequentially == key) { return; }
  lookupGitHubNavigateCommitsSequentially = key;
  resolveNextGitHubNavigateCommitsSequentially(page).then(function(res) {
   if (!res.error) { resolvedGitHubNavigateCommitsSequentially[key] = res; }
   lookupGitHubNavigateCommitsSequentially = "";
   let cur = document.getElementById(barIDGitHubNavigateCommitsSequentially);
   if (cur && cur.dataset.sha == page.sha) { applyNextGitHubNavigateCommitsSequentially(page, res); }
  });
 };

 /*********************************************************************************************
                                          MAIN FUNCTION
 *********************************************************************************************/
 function GitHubNavigateCommitsSequentially() {
  if (location.hostname != "github.com") {
   console.log("Bookmarklet did not run:");
   return;
  }
  /* already running in this tab: redraw only */
  if (window[runKeyGitHubNavigateCommitsSequentially]) {
   window[runKeyGitHubNavigateCommitsSequentially]();
   return;
  }
  window[runKeyGitHubNavigateCommitsSequentially] = runBookmarkletGitHubNavigateCommitsSequentially;
  console.log("Bookmarklet running:");
  /* run bookmarklet with changing directories */
  var checkForChangeDir = function() {
   if (curDirGitHubNavigateCommitsSequentially !== window.location.href) {
    curDirGitHubNavigateCommitsSequentially = window.location.href;
    waitCountGitHubNavigateCommitsSequentially = 0;
   }
   runBookmarkletGitHubNavigateCommitsSequentially();
   setTimeout(checkForChangeDir, 1000);
  };
  checkForChangeDir();
 }
 GitHubNavigateCommitsSequentially();
})();
