javascript:(function() {
 /* CONFIG VARIABLES */
 var resolveRelativeLinksConvertPageToMarkdown = true;  /* rewrite relative hrefs to absolute */
 var copyResultToClipboardConvertPageToMarkdown = true;  /* place markdown on system clipboard */
 var rootSelectorConvertPageToMarkdown        = "body";  /* element subtree to convert to markdown */

 var turndownCdnConvertPageToMarkdown   = /* cdn for html to markdown converter library         */
  "https://unpkg.com/turndown@7.1.2/dist/turndown.js";
 var gfmPluginCdnConvertPageToMarkdown  = /* cdn for github flavored markdown plugin            */
  "https://unpkg.com/turndown-plugin-gfm@1.0.2/dist/turndown-plugin-gfm.js";

 /* GLOBAL VARIABLES */
 var pageUrlConvertPageToMarkdown      = /* fully qualified url of current document             */
  document.baseURI || location.href;

 var rootElementConvertPageToMarkdown  = /* root subtree element to extract markdown from       */
  document.querySelector(rootSelectorConvertPageToMarkdown) || document.body;

 var mdDataConvertPageToMarkdown       = "";  /* final markdown string produced by conversion */

 /************************************* SUPPORT FUNCTIONS *************************************/

 /* Dynamically load an external script and resolve once it has finished executing. */
 const loadScriptConvertPageToMarkdown = (url) => {
  /* return a promise that resolves when script tag fires load event */
  return new Promise((resolve, reject) => {
   var s = document.createElement("script");
   s.src = url;
   s.onload = () => resolve(true);
   s.onerror = () => reject(new Error("failed to load " + url));
   document.head.appendChild(s);
  });
 };

 /* Resolve a single relative url string against the base page url. */
 const absolutizeUrlConvertPageToMarkdown = (raw, baseUrl) => {
  /* skip empty in page anchors and non navigational schemes */
  if (!raw) return raw;
  if (raw.charAt(0) === "#") return raw;
  if (/^(javascript:|mailto:|tel:|data:)/i.test(raw)) return raw;
  try {
   return new URL(raw, baseUrl).href;
  } catch (e) {
   /* leave unparsable urls untouched */
   return raw;
  }
 };

 /* Clone the root subtree and rewrite relative urls on anchors and images to absolute. */
 const resolveLinksConvertPageToMarkdown = (rootEl, baseUrl) => {
  /* clone so we never mutate the live page */
  var clone = rootEl.cloneNode(true);
  if (!resolveRelativeLinksConvertPageToMarkdown) return clone;
  /* rewrite anchor hrefs */
  var anchors = clone.querySelectorAll("a[href]");
  for (var i = 0; i < anchors.length; i++) {
   var rawHref = anchors[i].getAttribute("href");
   anchors[i].setAttribute("href", absolutizeUrlConvertPageToMarkdown(rawHref, baseUrl));
  }
  /* rewrite image srcs the same way so inline images become portable */
  var imgs = clone.querySelectorAll("img[src]");
  for (var j = 0; j < imgs.length; j++) {
   var rawSrc = imgs[j].getAttribute("src");
   imgs[j].setAttribute("src", absolutizeUrlConvertPageToMarkdown(rawSrc, baseUrl));
  }
  return clone;
 };

 /* Normalize subtree so the gfm table rule can see clean inline cells and tidy whitespace. */
 const normalizeForMarkdownConvertPageToMarkdown = (rootEl) => {
  /* strip colgroup and col so turndown gfm tables do not get confused by them */
  var colgroups = rootEl.querySelectorAll("colgroup, col");
  for (var i = 0; i < colgroups.length; i++) {
   colgroups[i].parentNode.removeChild(colgroups[i]);
  }
  /* unwrap block paragraphs inside table cells so the gfm rule sees inline text */
  var cellParas = rootEl.querySelectorAll("td > p, th > p");
  for (var j = 0; j < cellParas.length; j++) {
   var p = cellParas[j];
   var parent = p.parentNode;
   while (p.firstChild) parent.insertBefore(p.firstChild, p);
   /* separate adjacent unwrapped paragraphs with a space to preserve word boundaries */
   parent.insertBefore(rootEl.ownerDocument.createTextNode(" "), p);
   parent.removeChild(p);
  }
  /* promote first row td cells to th so turndown gfm recognizes a heading row */
  var tables = rootEl.querySelectorAll("table");
  for (var t = 0; t < tables.length; t++) {
   var firstRow = tables[t].querySelector("tr");
   if (!firstRow) continue;
   /* skip when row already has a th cell because plugin will already accept it */
   if (firstRow.querySelector("th")) continue;
   var tds = firstRow.querySelectorAll(":scope > td");
   for (var k = 0; k < tds.length; k++) {
    var td = tds[k];
    var th = rootEl.ownerDocument.createElement("th");
    /* copy attributes so styling survives even though markdown will drop most of them */
    for (var a = 0; a < td.attributes.length; a++) {
     th.setAttribute(td.attributes[a].name, td.attributes[a].value);
    }
    while (td.firstChild) th.appendChild(td.firstChild);
    td.parentNode.replaceChild(th, td);
   }
  }
  /* replace non breaking spaces with regular spaces to avoid clipboard mojibake */
  var walker = rootEl.ownerDocument.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
  var n;
  while ((n = walker.nextNode())) {
   if (n.nodeValue && n.nodeValue.indexOf("\u00A0") !== -1) {
    n.nodeValue = n.nodeValue.replace(/\u00A0/g, " ");
   }
  }
  return rootEl;
 };

 /* Convert an HTML element subtree into GitHub flavored markdown using turndown. */
 const convertHtmlToMdConvertPageToMarkdown = (el) => {
  /* configure turndown for clean output and gfm features like tables and strikethrough */
  var td = new window.TurndownService({
   headingStyle: "atx",
   codeBlockStyle: "fenced",
   bulletListMarker: "-",
   emDelimiter: "*",
   linkStyle: "inlined"
  });
  if (window.turndownPluginGfm && window.turndownPluginGfm.gfm) {
   td.use(window.turndownPluginGfm.gfm);
  }
  return td.turndown(el);
 };

 /* Copy a string to the system clipboard using the async api with a textarea fallback. */
 const copyToClipboardConvertPageToMarkdown = (text, onDone) => {
  /* try modern api first then fall back for older browsers and non secure contexts */
  if (navigator.clipboard && navigator.clipboard.writeText) {
   navigator.clipboard.writeText(text)
    .then(() => { if (onDone) onDone(true); })
    .catch(() => {
     var ok = fallbackCopyConvertPageToMarkdown(text);
     if (onDone) onDone(ok);
    });
   return;
  }
  var ok2 = fallbackCopyConvertPageToMarkdown(text);
  if (onDone) onDone(ok2);
 };

 /* Legacy clipboard copy using a hidden textarea and execCommand for fallback compatibility. */
 const fallbackCopyConvertPageToMarkdown = (text) => {
  /* create offscreen textarea select contents and execute copy command */
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.top = "-1000px";
  ta.style.left = "-1000px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  var ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { /* ignore */ }
  document.body.removeChild(ta);
  return ok;
 };

 /*********************************************************************************************
                                          MAIN FUNCTION
 *********************************************************************************************/
 /* Load required libraries, rewrite links, convert subtree to markdown, and copy the result. */
 function runConvertPageToMarkdown() {
  /* chain library loads then perform conversion and clipboard copy */
  loadScriptConvertPageToMarkdown(turndownCdnConvertPageToMarkdown)
   .then(() => loadScriptConvertPageToMarkdown(gfmPluginCdnConvertPageToMarkdown))
   .then(() => {
    var prepared = resolveLinksConvertPageToMarkdown(  /* clone with absolute hrefs and srcs   */
     rootElementConvertPageToMarkdown,
     pageUrlConvertPageToMarkdown
    );
    normalizeForMarkdownConvertPageToMarkdown(prepared);  /* tidy cells nbsp and colgroups   */
    mdDataConvertPageToMarkdown = convertHtmlToMdConvertPageToMarkdown(prepared);

    /* small delay keeps behavior consistent with pattern and gives slow pages time to settle */
    setTimeout(function() {
     if (copyResultToClipboardConvertPageToMarkdown) {
      copyToClipboardConvertPageToMarkdown(mdDataConvertPageToMarkdown, function(ok) {
       /* notify the user once the clipboard has actually received the markdown */
       var size = mdDataConvertPageToMarkdown.length;
       alert(ok
        ? ("Markdown copied to clipboard (" + size + " chars).")
        : "Clipboard copy failed. Markdown is available on window.__convertedMarkdown.");
       /* expose result on window for manual retrieval when clipboard is blocked */
       window.__convertedMarkdown = mdDataConvertPageToMarkdown;
      });
     }
    }, 500);
   })
   .catch((err) => {
    /* surface load or conversion failures to the user */
    console.error("ConvertPageToMarkdown failed:", err);
    alert("ConvertPageToMarkdown failed: " + (err && err.message ? err.message : err));
   });
 }

 /* Call main function. */
 runConvertPageToMarkdown();
})();
